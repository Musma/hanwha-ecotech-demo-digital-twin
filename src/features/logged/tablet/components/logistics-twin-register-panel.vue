<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type {
  LogisticsTwinPendingLocation,
  LogisticsTwinRegisterPayload,
} from '@/features/logged/tablet/constants/logistics-twin-data'

const props = defineProps<{
  pendingDestinationLocation: LogisticsTwinPendingLocation | null
  pendingStartLocation: LogisticsTwinPendingLocation | null
}>()

const emit = defineEmits<{
  registerObstruction: [payload: LogisticsTwinRegisterPayload]
}>()

const DEFAULT_OBSTRUCTION_DETAIL = '현장에서 등재된 도로 간섭물입니다.'
const DEFAULT_OBSTRUCTION_KIND = '자재(배관)'
const DEFAULT_OBSTRUCTION_NAME = '신규 적치 자재'
const OBSTRUCTION_KIND_OPTIONS = [
  '자재(배관)',
  '폐기물',
  '장비',
  '자재(강재)',
  '기타',
]

const obstructionName = ref(DEFAULT_OBSTRUCTION_NAME)
const obstructionKind = ref(DEFAULT_OBSTRUCTION_KIND)
const obstructionDetail = ref(DEFAULT_OBSTRUCTION_DETAIL)
const photo = ref<string | null>(null)
const photoError = ref('')

const SUPPORTED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png'])
const SUPPORTED_PHOTO_NAME_PATTERN = /\.(jpe?g|png)$/i
const isRouteSelected = computed(() =>
  Boolean(props.pendingStartLocation && props.pendingDestinationLocation),
)
const routeStatusTitle = computed(() => {
  if (isRouteSelected.value) return '출발/도착지 선택 완료'
  return props.pendingStartLocation ? '도착지 선택' : '출발지 선택'
})
const routeStatusDescription = computed(() => {
  if (isRouteSelected.value) {
    return `${props.pendingStartLocation?.label} → ${props.pendingDestinationLocation?.label}`
  }

  return props.pendingStartLocation
    ? '두 번째 클릭으로 도착지를 선택하십시오'
    : '첫 번째 클릭으로 출발지를 선택하십시오'
})

watch(
  () => [
    props.pendingStartLocation?.label,
    props.pendingDestinationLocation?.label,
  ],
  () => {
    obstructionName.value = DEFAULT_OBSTRUCTION_NAME
    obstructionKind.value = DEFAULT_OBSTRUCTION_KIND
    obstructionDetail.value = DEFAULT_OBSTRUCTION_DETAIL
    photo.value = null
    photoError.value = ''
  },
)

function handlePhotoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (
    !SUPPORTED_PHOTO_TYPES.has(file.type) &&
    !SUPPORTED_PHOTO_NAME_PATTERN.test(file.name)
  ) {
    photo.value = null
    photoError.value = 'JPG 또는 PNG 형식의 이미지만 업로드할 수 있습니다.'
    input.value = ''
    return
  }

  photoError.value = ''
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    photo.value = typeof reader.result === 'string' ? reader.result : null
  })
  reader.addEventListener('error', () => {
    photo.value = null
    photoError.value = '사진을 불러오지 못했습니다. 다른 파일을 선택해 주세요.'
  })
  reader.readAsDataURL(file)
  input.value = ''
}

function removePhoto() {
  photo.value = null
  photoError.value = ''
}

function submitObstruction() {
  emit('registerObstruction', {
    detail: obstructionDetail.value.trim() || DEFAULT_OBSTRUCTION_DETAIL,
    kind: obstructionKind.value,
    name: obstructionName.value.trim() || DEFAULT_OBSTRUCTION_NAME,
    photo: photo.value,
  })
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="main-scroll-style min-h-0 flex-1 space-y-3 overflow-y-auto">
      <div
        aria-live="polite"
        class="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors"
        :class="
          isRouteSelected
            ? 'border-hw-orange-main bg-hw-orange-main/10'
            : 'border-hw-gray-lighter bg-hw-white-main'
        "
      >
        <i class="ti ti-click text-h5 text-hw-orange-main" />
        <span class="min-w-0">
          <b class="block text-s2 text-hw-text-primary">
            {{ routeStatusTitle }}
          </b>
          <span class="block text-c1 text-hw-gray-dark">
            {{ routeStatusDescription }}
          </span>
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div
          class="rounded-md border p-2"
          :class="
            pendingStartLocation
              ? 'border-hw-orange-main bg-hw-orange-lighter/20'
              : 'border-hw-gray-lighter bg-hw-white-lighter'
          "
        >
          <b class="block text-c1 text-hw-gray-dark">1. 출발지</b>
          <span
            class="mt-1 block truncate text-s2 font-bold text-hw-text-primary"
          >
            {{ pendingStartLocation?.label ?? '첫 번째 클릭' }}
          </span>
        </div>
        <div
          class="rounded-md border p-2"
          :class="
            pendingDestinationLocation
              ? 'border-hw-orange-main bg-hw-orange-lighter/20'
              : 'border-hw-gray-lighter bg-hw-white-lighter'
          "
        >
          <b class="block text-c1 text-hw-gray-dark">2. 도착지</b>
          <span
            class="mt-1 block truncate text-s2 font-bold text-hw-text-primary"
          >
            {{ pendingDestinationLocation?.label ?? '두 번째 클릭' }}
          </span>
        </div>
      </div>

      <div
        v-if="photo"
        class="overflow-hidden rounded-md border border-hw-gray-lighter"
      >
        <img
          :src="photo"
          alt="현장 사진 미리보기"
          class="h-36 w-full object-cover"
        />
        <div class="grid grid-cols-2 border-t border-hw-gray-lighter">
          <div
            class="relative px-3 py-2 text-center text-c1 font-semibold text-hw-gray-darker transition-colors hover:bg-hw-btn-hover"
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              aria-label="현장 사진 다시 선택"
              class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              @change="handlePhotoChange"
            />
            <i class="ti ti-refresh mr-1" aria-hidden="true" />
            다시 선택
          </div>
          <button
            type="button"
            class="border-l border-hw-gray-lighter px-3 py-2 text-c1 font-semibold text-hw-red-dark transition-colors hover:bg-hw-red-lighter"
            @click="removePhoto"
          >
            <i class="ti ti-trash mr-1" aria-hidden="true" />
            제거
          </button>
        </div>
      </div>
      <div
        v-else-if="isRouteSelected"
        class="relative flex w-full cursor-pointer flex-col items-center gap-1 rounded-md border border-dashed border-hw-gray-lighter bg-hw-white-lighter p-4 text-center text-hw-gray-dark transition-colors hover:border-hw-orange-main hover:bg-hw-orange-lighter/20"
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          aria-label="현장 사진 업로드"
          class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          @change="handlePhotoChange"
        />
        <i
          class="pointer-events-none ti ti-camera-plus text-h3 text-hw-orange-main"
        />
        <span class="pointer-events-none text-s2 font-semibold">
          현장 사진 업로드
        </span>
        <small class="pointer-events-none text-c1">
          클릭하여 JPG 또는 PNG 이미지를 첨부합니다
        </small>
      </div>
      <div
        v-else
        aria-disabled="true"
        class="flex w-full cursor-not-allowed flex-col items-center gap-1 rounded-md border border-dashed border-hw-gray-lighter bg-hw-white-lighter p-4 text-center text-hw-gray-dark"
      >
        <i class="ti ti-camera-plus text-h3 text-hw-gray-main" />
        <span class="text-s2 font-semibold">현장 사진 업로드</span>
        <small id="logistics-twin-photo-help" class="text-c1">
          먼저 출발지와 도착지를 선택하십시오
        </small>
      </div>
      <p v-if="photoError" role="alert" class="text-c1 text-hw-red-dark">
        {{ photoError }}
      </p>

      <div class="space-y-2">
        <label class="block text-c1 font-semibold text-hw-gray-dark">
          간섭물명
          <input
            v-model="obstructionName"
            :disabled="!isRouteSelected"
            class="mt-1 w-full rounded-md border border-hw-gray-lighter bg-hw-white-main px-3 py-2 text-b3 text-hw-text-primary disabled:bg-hw-white-dark disabled:text-hw-gray-main"
          />
        </label>
        <label class="block text-c1 font-semibold text-hw-gray-dark">
          간섭물 종류
          <select
            v-model="obstructionKind"
            :disabled="!isRouteSelected"
            class="mt-1 w-full rounded-md border border-hw-gray-lighter bg-hw-white-main px-3 py-2 text-b3 text-hw-text-primary disabled:bg-hw-white-dark disabled:text-hw-gray-main"
          >
            <option
              v-for="kindOption in OBSTRUCTION_KIND_OPTIONS"
              :key="kindOption"
              :value="kindOption"
            >
              {{ kindOption }}
            </option>
          </select>
        </label>
        <label class="block text-c1 font-semibold text-hw-gray-dark">
          상세 내용
          <textarea
            v-model="obstructionDetail"
            :disabled="!isRouteSelected"
            rows="3"
            class="mt-1 w-full resize-none rounded-md border border-hw-gray-lighter bg-hw-white-main px-3 py-2 text-b3 text-hw-text-primary disabled:bg-hw-white-dark disabled:text-hw-gray-main"
          />
        </label>
        <p class="text-c1 text-hw-gray-dark">
          간섭기간 1일 이내는 주황색, 1일 초과는 붉은색으로 가시화 화면에
          표시됩니다.
        </p>
      </div>
    </div>

    <div
      class="-mx-4 -mb-4 mt-4 shrink-0 border-t border-hw-gray-lighter bg-hw-white-lighter p-3"
    >
      <button
        type="button"
        class="w-full rounded-md bg-hw-orange-main px-4 py-3 text-s2 font-bold text-hw-white-main transition-colors hover:bg-hw-orange-dark disabled:bg-hw-gray-main"
        :disabled="!isRouteSelected"
        @click="submitObstruction"
      >
        <i class="ti ti-circle-plus mr-1" aria-hidden="true" />
        간섭물 등록
      </button>
    </div>
  </div>
</template>
