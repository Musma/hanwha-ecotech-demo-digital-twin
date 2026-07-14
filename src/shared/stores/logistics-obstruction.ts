import { defineStore } from 'pinia'

const STORAGE_KEY = 'hanwha-logistics-new-obstruction'

export interface DashboardRegisteredObstruction {
  detail: string
  foundAt: string
  id: string
  infoOpenRequestAt?: number
  kind: string
  label: string
  lngLat: [number, number]
  locationLabel: string
  name: string
  photo?: string
  phys: [number, number]
  reporter: string
  status: string
}

function isNumberTuple(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(Number(value[0])) &&
    Number.isFinite(Number(value[1]))
  )
}

function normalizeObstruction(
  value: unknown,
): DashboardRegisteredObstruction | null {
  if (!value || typeof value !== 'object') return null

  const source = value as Partial<DashboardRegisteredObstruction>
  if (
    typeof source.id !== 'string' ||
    typeof source.name !== 'string' ||
    typeof source.kind !== 'string' ||
    typeof source.detail !== 'string' ||
    !isNumberTuple(source.phys) ||
    !isNumberTuple(source.lngLat)
  ) {
    return null
  }

  return {
    detail: source.detail,
    foundAt: source.foundAt || '',
    id: source.id,
    infoOpenRequestAt:
      typeof source.infoOpenRequestAt === 'number'
        ? source.infoOpenRequestAt
        : undefined,
    kind: source.kind,
    label: source.label || '',
    lngLat: [Number(source.lngLat[0]), Number(source.lngLat[1])],
    locationLabel: source.locationLabel || '',
    name: source.name,
    photo: source.photo,
    phys: [Number(source.phys[0]), Number(source.phys[1])],
    reporter: source.reporter || '',
    status: source.status || '',
  }
}

function readStoredObstruction(): DashboardRegisteredObstruction | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeObstruction(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function writeStoredObstruction(
  obstruction: DashboardRegisteredObstruction | null,
) {
  if (typeof window === 'undefined') return

  if (!obstruction) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obstruction))
}

export const useLogisticsObstructionStore = defineStore(
  'logistics-obstruction',
  {
    state: () => ({
      registeredObstruction: readStoredObstruction(),
    }),
    actions: {
      clearRegisteredObstruction() {
        this.registeredObstruction = null
        writeStoredObstruction(null)
      },
      reloadRegisteredObstruction() {
        this.registeredObstruction = readStoredObstruction()
      },
      requestRegisteredObstructionInfoOpen() {
        if (!this.registeredObstruction) return

        this.registeredObstruction = {
          ...this.registeredObstruction,
          infoOpenRequestAt: Date.now(),
        }
        writeStoredObstruction(this.registeredObstruction)
      },
      setRegisteredObstruction(obstruction: DashboardRegisteredObstruction) {
        this.registeredObstruction = obstruction
        writeStoredObstruction(obstruction)
      },
    },
  },
)
