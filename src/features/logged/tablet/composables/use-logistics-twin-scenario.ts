import { computed, shallowRef } from 'vue'

import {
  LOGISTICS_TWIN_DISPATCH_RESOURCES,
  LOGISTICS_TWIN_NEW_OBSTRUCTION_ID,
  LOGISTICS_TWIN_OBSTRUCTIONS,
  createLogisticsTwinDestinationFromLocation,
  type LogisticsTwinDispatchResource,
  type LogisticsTwinObstruction,
  type LogisticsTwinPendingLocation,
  type LogisticsTwinRecord,
  type LogisticsTwinRegisterPayload,
  getLogisticsTwinDestination,
  getLogisticsTwinTone,
  getLogisticsTwinToneLabel,
} from '@/features/logged/tablet/constants/logistics-twin-data'
import { createOptimalRoadJibunRoute } from '@/features/logged/tablet/utils/road-jibun-routing'
import {
  type DashboardRegisteredObstruction,
  useLogisticsObstructionStore,
} from '@/shared/stores/logistics-obstruction'
import type { MapEntityMarkerItem } from '@/shared/types/map/yard-map'

const NEW_OBSTRUCTION_VEHICLE_MARKER_OFFSET_Y = -34
const NEW_OBSTRUCTION_VEHICLE_MARKER_OFFSET_X = 22
const TRANSPORTER_GROUP = '트랜스포터'
const DISPATCH_ROUTE_MIN_DURATION_MS = 9500
const DISPATCH_ROUTE_MAX_DURATION_MS = 18000
const DISPATCH_ROUTE_MS_PER_METER = 36
const DISPATCH_RESOURCE_STAGGER_DURATION_MS = 500
const METERS_PER_DEGREE_LAT = 111320

function getDispatchVehicleStartPosition(
  target: LogisticsTwinObstruction,
): [number, number] {
  return target.lngLat
}

function getDispatchRouteCoordinates(
  target: LogisticsTwinObstruction,
  destination: { lngLat: [number, number]; phys: [number, number] },
) {
  if (target.id !== LOGISTICS_TWIN_NEW_OBSTRUCTION_ID) {
    return compactRouteCoordinates([target.lngLat, destination.lngLat])
  }

  return (
    createOptimalRoadJibunRoute({
      destinationLngLat: destination.lngLat,
      destinationPhys: destination.phys,
      startLngLat: target.lngLat,
      startPhys: target.phys,
    }) ?? compactRouteCoordinates([target.lngLat, destination.lngLat])
  )
}

function isSameCoordinate(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1]
}

function compactRouteCoordinates(coordinates: Array<[number, number]>) {
  return coordinates.filter(
    (coordinate, index) =>
      index === 0 || !isSameCoordinate(coordinate, coordinates[index - 1]),
  )
}

function getRouteDistanceMeters(coordinates: Array<[number, number]>) {
  return coordinates.slice(1).reduce((distance, coordinate, index) => {
    const previous = coordinates[index]
    const averageLatitude =
      ((previous[1] + coordinate[1]) / 2) * (Math.PI / 180)
    const metersPerDegreeLng =
      METERS_PER_DEGREE_LAT * Math.max(Math.cos(averageLatitude), 0.000001)
    const deltaLngMeters = (coordinate[0] - previous[0]) * metersPerDegreeLng
    const deltaLatMeters = (coordinate[1] - previous[1]) * METERS_PER_DEGREE_LAT
    return distance + Math.hypot(deltaLngMeters, deltaLatMeters)
  }, 0)
}

function getDispatchDepartureDurationMs(
  routeCoordinates: Array<[number, number]>,
  resourceIndex: number,
) {
  const routeDuration = Math.round(
    getRouteDistanceMeters(routeCoordinates) * DISPATCH_ROUTE_MS_PER_METER,
  )
  return (
    Math.min(
      DISPATCH_ROUTE_MAX_DURATION_MS,
      Math.max(DISPATCH_ROUTE_MIN_DURATION_MS, routeDuration),
    ) +
    resourceIndex * DISPATCH_RESOURCE_STAGGER_DURATION_MS
  )
}

function shouldMoveDispatchResource({
  resource,
  selectedResources,
}: {
  resource: LogisticsTwinDispatchResource
  selectedResources: LogisticsTwinDispatchResource[]
}) {
  const hasTransporter = selectedResources.some(
    (selectedResource) => selectedResource.group === TRANSPORTER_GROUP,
  )

  if (!hasTransporter) return true
  return selectedResources.length === 1 || resource.group === TRANSPORTER_GROUP
}

function moveToDashboardRoute() {
  if (typeof window === 'undefined') return

  const dashboardUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
  dashboardUrl.hash = '/dashboard'
  const targetWindow = window.parent === window ? window : window.parent
  targetWindow.location.assign(dashboardUrl.toString())
}

function createObstructionFromRegistered(
  registered: DashboardRegisteredObstruction,
): LogisticsTwinObstruction {
  return {
    id: registered.id,
    label: registered.label || 'OB51',
    name: registered.name,
    kind: registered.kind,
    jibun: registered.locationLabel,
    phys: registered.phys,
    lngLat: registered.lngLat,
    days: 0,
    foundAt: registered.foundAt,
    reporter: registered.reporter,
    status: '확인',
    detail: registered.detail,
    destination: registered.destination,
    photo: registered.photo,
  }
}

export function useLogisticsTwinScenario() {
  const logisticsObstructionStore = useLogisticsObstructionStore()
  const currentStep = shallowRef(1)
  const obstructions = shallowRef<LogisticsTwinObstruction[]>(
    LOGISTICS_TWIN_OBSTRUCTIONS.map((item) => ({ ...item })),
  )
  const selectedId = shallowRef('')
  const markerInfoId = shallowRef('')
  const targetId = shallowRef('')
  const selectedDispatchResourceCodes = shallowRef<string[]>([])
  const dispatchConfirmed = shallowRef(false)
  const pendingStartLocation = shallowRef<LogisticsTwinPendingLocation | null>(
    null,
  )
  const pendingDestinationLocation =
    shallowRef<LogisticsTwinPendingLocation | null>(null)
  const records = shallowRef<LogisticsTwinRecord[]>([])
  const mapViewResetRequest = shallowRef(0)
  const toastMessage = shallowRef('')

  function upsertObstruction(item: LogisticsTwinObstruction) {
    obstructions.value = [
      item,
      ...obstructions.value.filter((obstruction) => obstruction.id !== item.id),
    ]
  }

  const visibleObstructions = computed(() =>
    obstructions.value.filter((item) => item.status !== '완료'),
  )

  const selectedObstruction = computed(
    () =>
      visibleObstructions.value.find((item) => item.id === selectedId.value) ??
      null,
  )

  const targetObstruction = computed(
    () =>
      obstructions.value.find((item) => item.id === targetId.value) ??
      selectedObstruction.value,
  )

  const mapMarkers = computed<MapEntityMarkerItem[]>(() => {
    if (currentStep.value < 3) return []

    const obstructionMarkers = visibleObstructions.value
      .filter(
        (item) =>
          !(
            currentStep.value === 5 &&
            dispatchConfirmed.value &&
            item.id === targetObstruction.value?.id
          ),
      )
      .map((item) => ({
        id: item.id,
        label: item.label,
        name: item.name,
        phys: item.lngLat,
        selected: currentStep.value >= 4 && item.id === selectedId.value,
        selectable: currentStep.value === 4,
        focusOnSelect: true,
        info:
          currentStep.value === 4 && item.id === markerInfoId.value
            ? {
                label: item.label,
                title: item.name,
                status: item.status,
                imageSrc: item.photo,
                imageAlt: `${item.name} 현장 사진`,
                rows: [
                  { label: '종류', value: item.kind },
                  { label: '위치', value: item.jibun },
                  { label: '발견시기', value: item.foundAt },
                  {
                    label: '간섭기간',
                    value: `${item.days}일 (${getLogisticsTwinToneLabel(item.days)})`,
                  },
                  { label: '보고자', value: item.reporter },
                ],
                description: item.detail,
              }
            : undefined,
        showWave: false,
        tone:
          getLogisticsTwinTone(item.days) === 'danger'
            ? 'obstruction-danger'
            : 'obstruction-warn',
      }))

    if (currentStep.value === 3) {
      const pendingMarkers: MapEntityMarkerItem[] = []
      if (pendingStartLocation.value) {
        pendingMarkers.push({
          id: 'pending-obstruction-start-location',
          label: '출발',
          name: `출발지 ${pendingStartLocation.value.label}`,
          phys: pendingStartLocation.value.lngLat,
          anchor: 'center',
          selected: true,
          showWave: false,
          tone: 'obstruction-warn',
        })
      }
      if (pendingDestinationLocation.value) {
        pendingMarkers.push({
          id: 'pending-obstruction-destination-location',
          label: '도착',
          name: `도착지 ${pendingDestinationLocation.value.label}`,
          phys: pendingDestinationLocation.value.lngLat,
          anchor: 'center',
          selected: true,
          showWave: false,
          tone: 'drop-zone',
        })
      }

      return [...obstructionMarkers, ...pendingMarkers]
    }

    if (currentStep.value !== 5) return obstructionMarkers

    const target = targetObstruction.value
    const destination = getLogisticsTwinDestination(target)
    const isNewObstructionTarget =
      target?.id === LOGISTICS_TWIN_NEW_OBSTRUCTION_ID
    const selectedDispatchResources = LOGISTICS_TWIN_DISPATCH_RESOURCES.filter(
      (resource) => selectedDispatchResourceCodes.value.includes(resource.code),
    )
    const routeCoordinates = target
      ? getDispatchRouteCoordinates(target, destination)
      : []
    const vehicleMarkers: MapEntityMarkerItem[] = target
      ? selectedDispatchResources.map((resource, index) => {
          const isTransporter = resource.group === TRANSPORTER_GROUP
          const movesAlongRoute =
            dispatchConfirmed.value &&
            shouldMoveDispatchResource({
              resource,
              selectedResources: selectedDispatchResources,
            })
          const shouldOffsetVehicleMarker =
            isNewObstructionTarget &&
            !isTransporter &&
            selectedDispatchResources.length > 1 &&
            !movesAlongRoute
          const startPosition = getDispatchVehicleStartPosition(target)

          return {
            id: `scenario-vehicle-${resource.code}`,
            label: resource.code,
            name: `${resource.group} ${resource.code}`,
            iconClass:
              resource.group === '지게차' ? 'ti ti-forklift' : 'ti ti-truck',
            phys: startPosition,
            offset: shouldOffsetVehicleMarker
              ? ([
                  index % 2 === 0
                    ? -NEW_OBSTRUCTION_VEHICLE_MARKER_OFFSET_X
                    : NEW_OBSTRUCTION_VEHICLE_MARKER_OFFSET_X,
                  NEW_OBSTRUCTION_VEHICLE_MARKER_OFFSET_Y,
                ] as [number, number])
              : undefined,
            tone: 'vehicle',
            updatesTrack:
              movesAlongRoute &&
              selectedDispatchResources.findIndex((selectedResource) =>
                shouldMoveDispatchResource({
                  resource: selectedResource,
                  selectedResources: selectedDispatchResources,
                }),
              ) === index,
            motion: movesAlongRoute
              ? {
                  stop: target.lngLat,
                  destination: destination.lngLat,
                  routeCoordinates,
                  approachDurationMs: 0,
                  dwellDurationMs: 300,
                  departureDurationMs: getDispatchDepartureDurationMs(
                    routeCoordinates,
                    index,
                  ),
                }
              : undefined,
          }
        })
      : []

    return [
      ...obstructionMarkers,
      {
        id: 'drop-zone',
        label: '목적지',
        name: destination.jibun,
        phys: destination.lngLat,
        tone: 'drop-zone',
      },
      ...vehicleMarkers,
    ]
  })

  const trackCoordinates = computed<Array<[number, number]>>(() => {
    if (currentStep.value !== 5 || !targetObstruction.value) return []
    const target = targetObstruction.value
    const destination = getLogisticsTwinDestination(target)
    const routeCoordinates = getDispatchRouteCoordinates(target, destination)
    const selectedDispatchResources = LOGISTICS_TWIN_DISPATCH_RESOURCES.filter(
      (resource) => selectedDispatchResourceCodes.value.includes(resource.code),
    )
    const movingResourceIndex = selectedDispatchResources.findIndex(
      (resource) =>
        shouldMoveDispatchResource({
          resource,
          selectedResources: selectedDispatchResources,
        }),
    )
    const routeStart =
      movingResourceIndex >= 0
        ? getDispatchVehicleStartPosition(target)
        : target.lngLat

    return compactRouteCoordinates([routeStart, ...routeCoordinates])
  })

  function updateObstructionStatus(
    id: string,
    status: LogisticsTwinObstruction['status'],
  ) {
    obstructions.value = obstructions.value.map((item) =>
      item.id === id ? { ...item, status } : item,
    )
  }

  function showToast(message: string) {
    toastMessage.value = message
    window.setTimeout(() => {
      if (toastMessage.value === message) toastMessage.value = ''
    }, 2400)
  }

  function unlockTablet() {
    selectedId.value = ''
    markerInfoId.value = ''
    if (startDispatchFromDashboardRequest()) return

    currentStep.value = 4
    showToast('태블릿 잠금이 해제되었습니다')
  }

  function startRegister() {
    pendingStartLocation.value = null
    pendingDestinationLocation.value = null
    markerInfoId.value = ''
    currentStep.value = 3
  }

  function showObstructionList() {
    pendingStartLocation.value = null
    pendingDestinationLocation.value = null
    selectedId.value = ''
    markerInfoId.value = ''
    currentStep.value = 4
  }

  function pickRegisterLocation(location: LogisticsTwinPendingLocation) {
    if (!pendingStartLocation.value) {
      pendingStartLocation.value = location
      showToast('출발지가 선택되었습니다. 도착지를 선택해 주세요')
      return
    }

    pendingDestinationLocation.value = location
    showToast('도착지가 선택되었습니다. 간섭물을 등록할 수 있습니다')
  }

  function registerObstruction(payload: LogisticsTwinRegisterPayload) {
    const startLocation = pendingStartLocation.value
    const destinationLocation = pendingDestinationLocation.value
    if (!startLocation || !destinationLocation) return

    const destination =
      createLogisticsTwinDestinationFromLocation(destinationLocation)

    const newItem: LogisticsTwinObstruction = {
      id: LOGISTICS_TWIN_NEW_OBSTRUCTION_ID,
      label: 'OB51',
      name: payload.name,
      kind: payload.kind,
      jibun: startLocation.label,
      phys: startLocation.phys,
      lngLat: startLocation.lngLat,
      destination,
      days: 0,
      foundAt: '2026.05.22 13:20',
      reporter: 'HSE 담당자',
      status: '확인',
      detail: payload.detail,
      photo: payload.photo || undefined,
    }

    upsertObstruction(newItem)
    logisticsObstructionStore.setRegisteredObstruction({
      detail: newItem.detail,
      foundAt: newItem.foundAt,
      id: newItem.id,
      kind: newItem.kind,
      label: newItem.label,
      lngLat: newItem.lngLat,
      locationLabel: startLocation.label,
      name: newItem.name,
      photo: newItem.photo,
      phys: newItem.phys,
      reporter: newItem.reporter,
      status: newItem.status,
      destination,
    })
    selectedId.value = newItem.id
    markerInfoId.value = newItem.id
    pendingStartLocation.value = null
    pendingDestinationLocation.value = null
    currentStep.value = 4
    showToast('도로 간섭물이 등재되었습니다')
  }

  function selectObstruction(item: LogisticsTwinObstruction) {
    selectedId.value = item.id
    markerInfoId.value = item.id
    currentStep.value = Math.max(currentStep.value, 4)
    dispatchConfirmed.value = false
    showToast(`${item.label} 간섭물을 선택했습니다`)
  }

  function selectObstructionById(id: string) {
    if (currentStep.value !== 4) return

    const item = visibleObstructions.value.find(
      (obstruction) => obstruction.id === id,
    )
    if (item) selectObstruction(item)
  }

  function closeObstructionInfo(id: string) {
    if (currentStep.value !== 4 || markerInfoId.value !== id) return
    markerInfoId.value = ''
  }

  function requestMove(item: LogisticsTwinObstruction) {
    selectedId.value = item.id
    markerInfoId.value = ''
    targetId.value = item.id
    updateObstructionStatus(item.id, '이동요청')
    currentStep.value = 5
    selectedDispatchResourceCodes.value = []
    dispatchConfirmed.value = false
    showToast('지번체계 기반 간섭물 이동을 요청하였습니다')
  }

  function startDispatchFromDashboardRequest() {
    const registered = logisticsObstructionStore.registeredObstruction
    if (!registered?.dispatchRequestAt) return false

    const target = createObstructionFromRegistered(registered)
    upsertObstruction(target)
    selectedId.value = target.id
    markerInfoId.value = ''
    targetId.value = target.id
    updateObstructionStatus(target.id, '이동요청')
    currentStep.value = 5
    selectedDispatchResourceCodes.value = []
    dispatchConfirmed.value = false
    logisticsObstructionStore.consumeDispatchRequest()
    showToast('디지털 트윈에서 선택한 간섭물 이동 배차를 진행합니다')
    return true
  }

  function openObstructionInDashboard(item: LogisticsTwinObstruction) {
    const registered = logisticsObstructionStore.registeredObstruction
    const locationLabel =
      registered?.id === item.id ? registered.locationLabel : item.jibun
    const destination =
      registered?.id === item.id
        ? (item.destination ?? registered.destination)
        : item.destination

    logisticsObstructionStore.setRegisteredObstruction({
      detail: item.detail,
      destination,
      foundAt: item.foundAt,
      id: item.id,
      kind: item.kind,
      label: item.label,
      lngLat: item.lngLat,
      locationLabel,
      name: item.name,
      photo: item.photo,
      phys: item.phys,
      reporter: item.reporter,
      status: item.status,
    })
    logisticsObstructionStore.requestRegisteredObstructionInfoOpen()
    moveToDashboardRoute()
  }

  function toggleDispatchResource(code: string) {
    if (dispatchConfirmed.value) return
    selectedDispatchResourceCodes.value =
      selectedDispatchResourceCodes.value.includes(code)
        ? selectedDispatchResourceCodes.value.filter((item) => item !== code)
        : [...selectedDispatchResourceCodes.value, code]
  }

  function confirmDispatch() {
    if (selectedDispatchResourceCodes.value.length === 0) {
      showToast('배차 자원을 한 대 이상 선택해 주세요')
      return
    }

    if (targetId.value) updateObstructionStatus(targetId.value, '배차확정')
    dispatchConfirmed.value = true
    showToast('배차가 확정되어 모바일 오더를 전달하였습니다')
  }

  function completeRecord() {
    const target = targetObstruction.value
    if (target) {
      updateObstructionStatus(target.id, '완료')
      if (logisticsObstructionStore.registeredObstruction?.id === target.id) {
        logisticsObstructionStore.clearRegisteredObstruction()
      }
      records.value = [
        {
          id: target.id,
          name: target.name,
          jibun: target.jibun,
          equip: selectedDispatchResourceCodes.value.join(', '),
          at: '2026.05.22 09:35',
        },
        ...records.value,
      ]
    }
    currentStep.value = 6
    dispatchConfirmed.value = false
    showToast('간섭물 이동 실적이 기록되었습니다')
  }

  function showCompletedList() {
    selectedId.value = ''
    markerInfoId.value = ''
    targetId.value = ''
    selectedDispatchResourceCodes.value = []
    dispatchConfirmed.value = false
    pendingStartLocation.value = null
    pendingDestinationLocation.value = null
    currentStep.value = 4
    mapViewResetRequest.value += 1
  }

  function restartScenario() {
    currentStep.value = 1
    obstructions.value = LOGISTICS_TWIN_OBSTRUCTIONS.map((item) => ({
      ...item,
    }))
    selectedId.value = ''
    markerInfoId.value = ''
    targetId.value = ''
    selectedDispatchResourceCodes.value = []
    dispatchConfirmed.value = false
    pendingStartLocation.value = null
    pendingDestinationLocation.value = null
    records.value = []
    toastMessage.value = ''
    mapViewResetRequest.value += 1
  }

  return {
    closeObstructionInfo,
    completeRecord,
    confirmDispatch,
    currentStep,
    dispatchConfirmed,
    mapViewResetRequest,
    mapMarkers,
    openObstructionInDashboard,
    pendingDestinationLocation,
    pendingStartLocation,
    pickRegisterLocation,
    records,
    registerObstruction,
    requestMove,
    restartScenario,
    selectObstruction,
    selectObstructionById,
    selectedDispatchResourceCodes,
    selectedObstruction,
    showCompletedList,
    showObstructionList,
    startRegister,
    targetObstruction,
    toastMessage,
    toggleDispatchResource,
    trackCoordinates,
    unlockTablet,
    visibleObstructions,
  }
}
