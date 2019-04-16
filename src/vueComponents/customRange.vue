<template>
  <div class="cr">
    <div class="title">
      <span>{{title}}</span>
    </div>

    <div class="rangeBox">
      <span class="icon"></span>
      <span class="resume" @click="clickHandler"></span>
      <div class="inputContainer">
        <input
          type="range"
          min="0"
          max="200"
          step="1"
          v-bind:value="decimalValue"
          @change="changeHandler($event)"
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "value"],
  model: {
    prop: "value",
    event: "change"
  },
  //此处需要自定义事件
  data() {
    return {};
  },
  computed: {
    decimalValue() {
      return this.value.slice(0, this.value.length - 1);
    }
  },
  methods: {
    changeHandler(e) {
      console.log("change");
      this.$emit("change", e.target.value + "%");
    },
    clickHandler() {
      this.$emit("change", "100%");
    }
  }
};
</script>
<style scoped>
.cr {
  margin-bottom: 10px;
  width: 100%;
  position: relative;
}
.cr .title {
  text-align: left;
  height: 30px;
  line-height: 30px;
  color: #000;
}
.cr .inputContainer {
  margin: 0 40px;
}
.cr .icon {
  display: block;
  width: 40px;
  height: 30px;
  float: left;
  background-image: url("http://localhost:9527/static/svg/range.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.cr .rangeBox {
  position: relative;
  overflow: hidden;
}
.cr input {
  width: 100%;
  height: 30px;
}
.cr .resume {
  display: block;
  float: right;
  width: 40px;
  height: 30px;
  background-image: url("http://localhost:9527/static/svg/resume.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>


