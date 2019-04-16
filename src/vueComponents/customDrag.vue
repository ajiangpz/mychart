<template>
  <div class="cd">
    <h4>指标</h4>
    <div class="dragContain">
      <div
        v-for="(item,index) in items"
        :key="'drag'+index"
        draggable="true"
        class="dragItem"
        @dragstart="drag($event,item)"
      >{{item}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["items"],
  methods: {
    drag(event, item) {
      event.dataTransfer.setData("text", item);
    }
  }
};
</script>
<style scoped>
.cd {
  width: 100%;
  min-height: 30px;
}
.dragContain {
  width: 100%;
  min-height: 30px;
  line-height: 30px;
  border: 1px dashed black;
  border-radius: 5px;
  margin-bottom: 10px;
}
.dragItem {
  display: inline-block;
  width: 60px;
  height: 20px;
  line-height: 20px;
  /* border: 1px solid greenyellow; */
  border-radius: 5px;
  box-sizing: border-box;
  margin-right: 5px;
  text-align: center;
  background: #fff;
  color: #151212;
}
</style>

