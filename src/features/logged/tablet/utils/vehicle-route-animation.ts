import type { MapEntityMarkerMotion } from '@/shared/types/map/yard-map'

import type { Marker } from 'maplibre-gl'

type Coordinate = [number, number]
export type VehicleRouteAnimationPhase =
  'approach' | 'dwell' | 'departure' | 'done'
type PositionUpdateHandler = (
  position: Coordinate,
  phase: VehicleRouteAnimationPhase,
) => void

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2
}

function interpolateCoordinate(
  from: Coordinate,
  to: Coordinate,
  progress: number,
): Coordinate {
  const easedProgress = easeInOutCubic(Math.min(1, Math.max(0, progress)))
  return [
    from[0] + (to[0] - from[0]) * easedProgress,
    from[1] + (to[1] - from[1]) * easedProgress,
  ]
}

function getCoordinateDistance(from: Coordinate, to: Coordinate) {
  return Math.hypot(to[0] - from[0], to[1] - from[1])
}

function getDepartureRoute(motion: MapEntityMarkerMotion) {
  return motion.routeCoordinates && motion.routeCoordinates.length >= 2
    ? motion.routeCoordinates
    : [motion.stop, motion.destination]
}

function interpolateRouteCoordinate(
  route: Coordinate[],
  progress: number,
): Coordinate {
  if (route.length <= 1) return route[0] ?? [0, 0]

  const easedProgress = easeInOutCubic(Math.min(1, Math.max(0, progress)))
  const segmentLengths = route
    .slice(1)
    .map((coordinate, index) => getCoordinateDistance(route[index], coordinate))
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0)
  if (totalLength <= 0) return route[route.length - 1]

  const targetLength = totalLength * easedProgress
  let accumulatedLength = 0
  for (let index = 0; index < segmentLengths.length; index += 1) {
    const segmentLength = segmentLengths[index]
    if (accumulatedLength + segmentLength < targetLength) {
      accumulatedLength += segmentLength
      continue
    }

    if (segmentLength <= 0) return route[index + 1]
    const segmentProgress = (targetLength - accumulatedLength) / segmentLength
    return [
      route[index][0] +
        (route[index + 1][0] - route[index][0]) * segmentProgress,
      route[index][1] +
        (route[index + 1][1] - route[index][1]) * segmentProgress,
    ]
  }

  return route[route.length - 1]
}

export function startVehicleRouteAnimation(
  marker: Marker,
  start: Coordinate,
  motion: MapEntityMarkerMotion,
  onPositionUpdate?: PositionUpdateHandler,
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    marker.setLngLat(motion.destination)
    onPositionUpdate?.(motion.destination, 'done')
    return () => undefined
  }

  const approachEnd = motion.approachDurationMs
  const dwellEnd = approachEnd + motion.dwellDurationMs
  const motionEnd = dwellEnd + motion.departureDurationMs
  const departureRoute = getDepartureRoute(motion)
  let animationFrame: number | null = null
  let startedAt: number | null = null
  let lastPosition: Coordinate | null = null

  const updatePosition = (
    position: Coordinate,
    phase: VehicleRouteAnimationPhase,
  ) => {
    marker.setLngLat(position)
    if (lastPosition?.[0] === position[0] && lastPosition?.[1] === position[1])
      return

    lastPosition = position
    onPositionUpdate?.(position, phase)
  }

  const animate = (timestamp: number) => {
    startedAt ??= timestamp
    const elapsed = timestamp - startedAt

    if (elapsed < approachEnd) {
      updatePosition(
        interpolateCoordinate(start, motion.stop, elapsed / approachEnd),
        'approach',
      )
    } else if (elapsed < dwellEnd) {
      updatePosition(motion.stop, 'dwell')
    } else if (elapsed < motionEnd) {
      updatePosition(
        interpolateRouteCoordinate(
          departureRoute,
          (elapsed - dwellEnd) / motion.departureDurationMs,
        ),
        'departure',
      )
    } else {
      updatePosition(motion.destination, 'done')
      animationFrame = null
      return
    }

    animationFrame = requestAnimationFrame(animate)
  }

  animationFrame = requestAnimationFrame(animate)
  return () => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}
