<template>
  <div class="cc">
    <div class="cover" v-if="show" @click="coverHandler"></div>
    <div class="icon" v-bind:class="{'on':show,'off':!show}" @click="iconHandler"></div>
    <ul v-if="show">
      <li
        v-for="(item,index) in arr"
        :key="item+index"
        @click="clickHandler(item.handler)"
      >{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false
    };
  },
  props: ["arr"],
  methods: {
    clickHandler(item) {
      this.show = false;
      this.$emit("receive", item);
    },
    iconHandler() {
      this.show = !this.show;
    },
    coverHandler() {
      this.show = false;
    }
  }
};
</script>
<style scoped>
.cc {
  position: absolute;
  width: 40px;
  height: 100%;
  left: 0;
}
.cc .cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
}
.cc .icon {
  width: 40px;
  height: 100%;
  position: relative;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.cc .on {
  background-image: url("http://localhost:9527/static/svg/selectup.svg");
  z-index: 1001;
}
.cc .off {
  background-image: url("http://localhost:9527/static/svg/selectDown.svg");
  z-index: 999;
}

.cc ul {
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
  z-index: 1001;
  user-select: none;
}
.cc ul::-webkit-scrollbar {
  width: 0px;
}
.cc ul::-webkit-scrollbar-thumb {
  width: 10px;
  border-radius: 5px;
  background: #000;
}
.cc ul::-webkit-scrollbar-track {
  width: 10px;
  border-radius: 5px;
  background: #fff;
}

.cc ul li {
  text-align: center;
  list-style: none;
  color: #fff;
  border-radius: 5px;
}
.cc ul li:hover {
  background: #fff;

  color: #000;
  cursor: pointer;
}
</style>


