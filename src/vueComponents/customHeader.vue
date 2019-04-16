<template>
  <div class="ch">
    <span class="text">{{text}}</span>
    <span class="icon" v-on:click="handlerClick" v-bind:class="{open:xShow,close:!xShow}"></span>
  </div>
</template>
<script>
export default {
  props: ["text", "xShow"],
  model: {
    prop: "xShow",
    event: "receive"
  },
  data() {
    return {
      open: true
    };
  },
  methods: {
    handlerClick() {
      this.open = !this.xShow;
      this.$emit("receive", this.open);
    }
  }
};
</script>
<style scoped>
.ch {
  margin-bottom: 10px;
}
.ch .text {
  display: inline-block;
  width: 100px;
  height: 30px;
  vertical-align: middle;
  border: 1px solid black;
  background-color: #fff;
  text-align: center;
  box-sizing: border-box;
  border-radius: 5px;
}
.ch .icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: middle;
}
.open {
  background-image: url("http://localhost:9527/static/svg/close.svg");
}
.close {
  background-image: url("http://localhost:9527/static/svg/open.svg");
}
</style>

