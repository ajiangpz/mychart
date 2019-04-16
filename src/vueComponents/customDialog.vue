<template>
  <div class="dialog" ref="dialog">
    <div class="dialog-cover"></div>
    <div class="dialog-content">
      <div class="content-header">{{title}}</div>
      <slot name="selectUl"></slot>
      <div class="dialog-close" @click="$emit('receive',false)"></div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {},
  props: ["title"],
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.dialog {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1000;
}
.dialog .dialog-cover {
  width: 100%;
  height: 100%;
  background: #ddd;
  opacity: 0.5;
}
.dialog-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.dialog-content .content-header {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background: #fff;
  color: black;
  border-radius: 5px 5px 0 0;
}
.dialog-close {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 30px;
  height: 30px;
  background-image: url(http://localhost:9527/static/svg/dialogclose.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  /* padding: 10px; */
  border: 1px solid #ffffff;
  border-radius: 20px;
}
.dialog ul {
  position: relative;
  width: 200px;
  z-index: 100;
  background: #4fa8de;
  box-sizing: border-box;
  border-radius: 0 0 5px 5px;
  padding: 10px;
  overflow-y: scroll;
  min-height: 50px;
  max-height: 200px;
}
.dialog ul::-webkit-scrollbar {
  width: 0px;
}
.dialog ul::-webkit-scrollbar-thumb {
  width: 10px;
  border-radius: 5px;
  background: #000;
}
.dialog ul::-webkit-scrollbar-track {
  width: 10px;
  border-radius: 5px;
  background: #fff;
}

.dialog ul li {
  text-align: center;
  list-style: none;
  color: #fff;
  border-radius: 5px;
}
.dialog ul li:hover {
  background: #fff;

  color: #000;
  cursor: pointer;
}
</style>


