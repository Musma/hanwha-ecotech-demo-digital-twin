<script setup lang="ts">
import type {
  SideNavTreeLeaf,
  SideNavTreeNode,
} from '@/features/logged/dashboard/constants/side-navigation'

defineProps<{
  nodes: SideNavTreeNode[]
  collapsedIcon: string
  expandedIcon: string
}>()

const emit = defineEmits<{
  'leaf-click': [leaf: SideNavTreeLeaf]
}>()
</script>

<template>
  <div class="nav-tree">
    <template v-for="node in nodes" :key="node.id">
      <div v-if="node.expanded && node.groups" class="tree-branch">
        <div class="tree-row tree-row--stretch">
          <div class="node-button node-button--root">
            <img class="node-icon" :src="expandedIcon" alt="" />
            <div class="node-text">
              <div class="node-label">{{ node.label }}</div>
            </div>
          </div>
        </div>
        <div v-for="group in node.groups" :key="group.id" class="tree-indent">
          <div class="guide-line"></div>
          <div class="indent-body">
            <div class="tree-group">
              <div class="tree-row tree-row--stretch">
                <div class="node-button node-button--group">
                  <img
                    class="node-icon"
                    :src="group.expanded ? expandedIcon : collapsedIcon"
                    alt=""
                  />
                  <div class="node-text">
                    <div
                      class="node-label"
                      :class="{ 'node-label--noto': group.useNotoLabel }"
                    >
                      {{ group.label }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="group.expanded && group.leaves" class="leaf-indent">
                <div class="guide-line"></div>
                <div class="leaf-list">
                  <button
                    v-for="leaf in group.leaves"
                    :key="leaf.id"
                    class="leaf-button"
                    type="button"
                    @click="emit('leaf-click', leaf)"
                  >
                    <div class="leaf-text">
                      <div class="leaf-label">{{ leaf.label }}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="tree-row tree-row--top">
        <div class="node-button node-button--root">
          <img class="node-icon" :src="collapsedIcon" alt="" />
          <div class="node-text">
            <div class="node-label">{{ node.label }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.nav-tree {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 6px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
  overflow: hidden;
}

.tree-row {
  position: relative;
  border-radius: 8px;
}

.tree-row--top {
  flex-shrink: 0;
  width: 330px;
  height: 36px;
}

.tree-row--stretch {
  flex-shrink: 0;
  align-self: stretch;
  height: 36px;
}

.tree-branch {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-end;
  justify-content: flex-start;
  width: 330px;
}

.node-button {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0 0 12px;
  border-radius: 8px;
}

.node-button--root {
  width: 330px;
}

.node-button--group {
  width: 263px;
}

.node-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  overflow: visible;
}

.node-text {
  position: relative;
  flex-shrink: 0;
  width: 28px;
  height: 20px;
}

.node-label {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
  text-align: left;
  white-space: nowrap;
}

.node-label--noto {
  font-family: 'Noto Sans KR', sans-serif;
}

.tree-indent {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 2px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
  padding: 0 0 0 19px;
}

.guide-line {
  flex-shrink: 0;
  align-self: stretch;
  width: 2px;
  background: #364153;
}

.indent-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 2px;
  align-items: flex-start;
  justify-content: flex-start;
}

.tree-group {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
  width: 263px;
}

.leaf-indent {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 13px;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 0 0 19px;
}

.leaf-list {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
  align-items: flex-start;
  justify-content: flex-start;
}

.leaf-button {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 0;
  align-items: center;
  justify-content: flex-start;
  width: 229px;
  height: 32px;
  padding: 0 0 0 12px;
  cursor: pointer;
  border-radius: 8px;
}

.leaf-text {
  position: relative;
  flex-shrink: 0;
  width: 76.98px;
  height: 20px;
}

.leaf-label {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
  text-align: left;
  white-space: nowrap;
}
</style>
