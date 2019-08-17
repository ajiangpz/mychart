<template>
  <div class="container">
    <span class="title">{{title}}</span>
    <div class="cc">
      <input
        type="checkbox"
        :id="id"
        v-bind:checked="checked"
        v-on:change="$emit('change',$event.target.checked)"
      >
      <label :for="id" v-bind:class="{on:checked,off:!checked}" class="btn"></label>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: "checked",
    event: "change"
  },
  props: {
    checked: Boolean,
    title: String,
    id: String
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
<style scoped>
.container {
  padding: 4px;
  border-radius: 5px;
  margin-bottom: 10px;
}
.title {
  display: inline-block;
  height: 26px;
  line-height: 26px;
  color: #000;
  margin-right: 10px;
}
.cc {
  width: 80px;
  height: 26px;
  border-radius: 50px;
  position: relative;
  display: inline-block;
  background: #fff;
  border: 1px solid lightblue;
}
.cc:before,
.cc:after {
  height: 26px;
  line-height: 26px;
  text-align: center;
  position: absolute;
  left: 5px;
  font-size: 12px;
  color: black;
}
.cc:before {
  content: "ON";
  left: 10px;
}
.cc:after {
  content: "OFF";
  right: -30px;
}
.cc .btn {
  position: absolute;
  background: #000;
  width: 36px;
  height: 20px;
  border-radius: 20px;
  top: 3px;
  right: 5px;
  transition: all 0.5s linear;
  z-index: 2;
}
.cc .on {
  right: 37px;
}
.cc .off {
  right: 5px;
}
.cc input {
  visibility: hidden;
}
</style>


