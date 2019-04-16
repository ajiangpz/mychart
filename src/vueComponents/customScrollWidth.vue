<template>
  <div class="csw">
    <div class="title">
      <span>{{title}}</span>
    </div>
    <div class="inputBox">
      <input
        type="text"
        :step="step"
        v-bind:value="value"
        @wheel="wheelHandler($event)"
        @input="$emit('receive',$event.target.value)"
      >
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "value", "step"],
  model: {
    prop: "value",
    event: "receive"
  },
  data() {
    return {
      show: true
    };
  },
  methods: {
    wheelHandler(event) {
      if (event.deltaY === -100) {
        this.$emit("receive", parseInt(this.value) + parseInt(this.step));
      } else {
        this.$emit("receive", parseInt(this.value) - parseInt(this.step));
      }
    }
  }
};
</script>
<style scoped>
.csw {
  width: 100%;
  margin-bottom: 10px;
}
.title {
  float: left;
  height: 30px;
  line-height: 30px;
  margin-right: 10px;
}
.inputBox {
  overflow: hidden;
}
.inputBox input {
  width: 100%;
  height: 30px;
  border: 1px solid black;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>

