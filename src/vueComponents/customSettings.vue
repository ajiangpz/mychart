<template>
  <div class="cs">
    <slot></slot>
  </div>
</template>
<script>
import customSelect from "./customSelect.vue";
import customInput from "./customInput.vue";
import customDrag from "./customDrag.vue";
export default {
  props: ["settings", "columns"],
  model: {
    prop: "settings",
    event: "receive"
  },

  components: {
    customSelect,
    customInput,
    customDrag
  },
  data() {
    return {
      //根据不同的图形配置不同的setting如何做到
      //计算属性可以返回一个setting
      //创建多个settings,如bar,line,pie，这样可以保留settings上一次设置的状态
      //每一个settings对应一个组件
      //根据现在选中的settings
      //每个组件应该传入settings属性和相应的图表类型settings
      //如何实现一个双向绑定两个数据
      dataType: ["KMB", "normal", "percent"]
    };
  },
  computed: {},
  methods: {}
};
</script>
<style >
</style>

