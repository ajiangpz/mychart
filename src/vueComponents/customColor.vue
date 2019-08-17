
<template>
  <div class="cc">
    <div class="title">
      <span>{{title}}</span>
    </div>
    <div class="container">
      <span class="icon"></span>
      <div class="colorBox">
        <input
          type="color"
          v-bind:value="value"
          v-on:input="$emit('input',$event.target.value)"
          class="colorInput"
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["value", "title"],
  model: {
    prop: "value",
    event: "input"
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.cc {
  width: 100%;
  padding: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.icon {
  float: left;
  width: 40px;
  height: 30px;
  background-image: url("http://localhost:9527/static/svg/color.svg");
  background-size: contain;
  background-repeat: no-repeat;
}
.colorBox {
  overflow: hidden;
  position: relative;
}
.colorInput {
  display: inline-block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 30px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px;
  border: 1px solid lightblue;
}
.cc .title {
  text-align: left;
  height: 30px;
  line-height: 30px;
  color: #000;
}
</style>


