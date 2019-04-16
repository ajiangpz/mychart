<template>
  <div>
    <custom-drag v-model="pieSettings.metrics" :dragItems="columns.slice(1)"></custom-drag>
  </div>
</template>
<script>
import customDrag from "./customDrag.vue";
export default {
  props: ["pieSettings", "columns"],
  model: {
    prop: "pieSettings",
    event: "receive"
  },
  created() {},
  components: {
    customDrag
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
</style>

