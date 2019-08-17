<template>
  <div class="ci">
    <div class="title">
      <span>{{title}}</span>
    </div>
    <span class="icon"></span>
    <div class="inputBox">
      <input
        type="text"
        class="input"
        v-bind:value="value"
        v-on:input="$emit('input',$event.target.value)"
      >
    </div>
  </div>
</template>
<script>
export default {
  props: ["value", "title"],
  data() {
    return {};
  }
};
</script>
<style scoped>
.ci {
  width: 100%;
  padding: 4px;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.ci .title {
  text-align: left;
  height: 30px;
  line-height: 30px;
  color: #000;
}
.ci .inputBox {
  position: relative;
  overflow: hidden;
}
.ci .inputBox .input {
  width: 100%;
  height: 30px;
  border: 1px solid lightblue;
  border-radius: 5px;
  box-sizing: border-box;
}
.ci .icon {
  display: block;
  width: 40px;
  height: 30px;
  float: left;
  background-image: url("http://localhost:9527/static/svg/content.svg");
  background-size: contain;
  background-repeat: no-repeat;
}
</style>


