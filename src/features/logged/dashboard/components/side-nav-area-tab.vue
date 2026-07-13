<script setup lang="ts">
import chevronRightIcon from '@/assets/images/screen-6/icon2.svg'
import chevronDownIcon from '@/assets/images/screen-6/icon6.svg'
import SideNavTree from '@/features/logged/dashboard/components/side-nav-tree.vue'
import {
  AREA_TREE_NODES,
  type SideNavTreeLeaf,
} from '@/features/logged/dashboard/constants/side-navigation'

const emit = defineEmits<{
  'leaf-click': [leaf: SideNavTreeLeaf]
}>()
</script>

<template>
  <SideNavTree
    :nodes="AREA_TREE_NODES"
    :collapsed-icon="chevronRightIcon"
    :expanded-icon="chevronDownIcon"
    @leaf-click="emit('leaf-click', $event)"
  />
</template>
