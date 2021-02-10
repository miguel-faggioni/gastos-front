<template>
  <DxSankey
    :data-source="chartData"
    source-field="source"
    target-field="target"
    weight-field="weight"
    :palette="options.colors ? options.colors : null"
    class="px-4"
  >
    <DxTooltip
      :enabled="true"
      :customize-link-tooltip="options.linkTooltip"
      :customize-node-tooltip="options.nodeTooltip"
    />
    <DxNode :width="8" :padding="30" />
    <DxLink color-mode="gradient" />
  </DxSankey>
</template>

<script>
  import DxSankey, { DxTooltip, DxNode, DxLink } from 'devextreme-vue/sankey'

  export default {
    components: {
      DxSankey,
      DxTooltip,
      DxNode,
      DxLink,
    },
    props: ['chartData', 'options'],
  }
</script>

<style></style>
