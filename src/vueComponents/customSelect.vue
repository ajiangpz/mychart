<template>
  <div class="fw">
    <div class="title">
      <span>{{title}}</span>
    </div>
    <span v-bind:class="classObject"></span>
    <div class="selectBox">
      <input
        type="text"
        v-bind:value="value"
        class="selectValue"
        readonly
        ref="selector"
        @click="clickHandler"
      >
    </div>
    <custom-dialog v-if="showDialog" v-on:receive="showDialog=$event" :title="title">
      <ul slot="selectUl">
        <li v-for="(item,index) in items" :key="index" @click="changeHandler(item,$event)">{{item}}</li>
      </ul>
    </custom-dialog>
  </div>
</template>
<script>
import customDialog from "./customDialog.vue";
export default {
  model: {
    prop: "value",
    event: "receive"
  },
  props: ["value", "items", "type", "title"],
  data() {
    return {
      originObject: {
        icon: true,
        select: false,
        bold: false,
        size: false,
        align: false,
        vertical: false,
        fontFamily: false,
        series: false
      },
      showDialog: false
    };
  },
  components: {
    customDialog
  },
  computed: {
    classObject() {
      this.originObject[this.type] = true;

      if (this.type) {
        return this.originObject;
      } else {
        this.originObject.select = true;
        return this.originObject;
      }
    }
  },
  methods: {
    changeHandler(item, e) {
      e.cancelBubble = true;
      this.showDialog = false;
      this.$emit("receive", item);
    },
    clickHandler(e) {
      console.log(e);
      this.showDialog = true;
    }
  }
};
</script>
<style scoped>
.fw {
  width: 100%;
  border-radius: 5px;
  padding: 4px;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.fw .icon {
  display: block;
  float: left;
  width: 40px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
}
.bold {
  background-image: url("http://localhost:9527/static/svg/bold.svg");
}
.size {
  background-image: url("http://localhost:9527/static/svg/size.svg");
}
.align {
  background-image: url("http://localhost:9527/static/svg/align.svg");
}
.vertical {
  background-image: url("http://localhost:9527/static/svg/vertical.svg");
}
.fontFamily {
  background-image: url("http://localhost:9527/static/svg/fontFamily.svg");
}
.series {
  background-image: url("http://localhost:9527/static/svg/series.svg");
}
.select {
  background-image: url("http://localhost:9527/static/svg/default.svg");
}
.fw .title {
  text-align: left;
  height: 30px;
  line-height: 30px;
  color: #000;
}

.fw .selectBox {
  overflow: hidden;
  position: relative;
}
.fw .selectValue {
  width: 100%;
  height: 30px;
  outline: none;
  border: 1px solid black;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
}

.fw .bg-direct {
  background-image: url("http://localhost:9527/static/svg/color.svg");
}
</style>

