<script setup lang="ts">
import chevronRightIcon from '@/assets/images/screen-4/icon2.svg'
import chevronDownIcon from '@/assets/images/screen-4/icon5.svg'
import SideNavTree from '@/features/logged/dashboard/components/side-nav-tree.vue'
import {
  BLOCK_TREE_NODES,
  type SideNavTreeLeaf,
} from '@/features/logged/dashboard/constants/side-navigation'

const emit = defineEmits<{
  'leaf-click': [leaf: SideNavTreeLeaf]
}>()
</script>

<template>
  <SideNavTree
    :nodes="BLOCK_TREE_NODES"
    :collapsed-icon="chevronRightIcon"
    :expanded-icon="chevronDownIcon"
    @leaf-click="emit('leaf-click', $event)"
  />
</template>
