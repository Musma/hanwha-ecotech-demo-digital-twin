<script setup lang="ts">
import chevronDownIcon from '@/assets/images/screen-8/icon2.svg'
import chevronRightIcon from '@/assets/images/screen-8/icon6.svg'
import SideNavTree from '@/features/logged/dashboard/components/side-nav-tree.vue'
import { EQUIPMENT_TREE_NODES } from '@/features/logged/dashboard/constants/side-navigation'
</script>

<template>
  <SideNavTree
    :nodes="EQUIPMENT_TREE_NODES"
    :collapsed-icon="chevronRightIcon"
    :expanded-icon="chevronDownIcon"
  />
</template>
