<template>
  <div class="cd">
    <div class="dragHeader">{{title}}</div>

    <div class="dropContain" @drop="drop($event,dropArray)" @dragover="allowDrop($event)">
      <div v-for="(item,index) in dropArray||originArr" :key="index" class="dropItem">
        <span>{{item}}</span>
        <div class="after" @click="removeItem(dropArray,item)"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["items", "metrics", "title", "type"],
  model: {
    prop: "metrics",
    event: "drop"
  },
  data() {
    return {
      dropArray: this.metrics
    };
  },
  computed: {
    originArr() {
      if (this.type === "metrics") {
        this.dropArray = this.items.slice(0, 1);
        return this.items.slice(0, 1);
      } else {
        this.dropArray = [];
        return [];
      }
    }
  },

  methods: {
    addItem(arr, item) {
      let index = arr.indexOf(item);
      if (!~index) {
        arr.push(item);
        this.$emit("drop", this.dropArray);
      }
    },
    drop(event, arr) {
      event.preventDefault();
      let data = event.dataTransfer.getData("text");
      this.addItem(arr, data);
    },
    allowDrop(event) {
      event.preventDefault();
    },

    removeItem(arr, item) {
      let index = arr.indexOf(item);
      if (!!~index) {
        arr.splice(index, 1);
        this.$emit("drop", this.dropArray);
      }
    }
  }
};
</script>
<style scoped>
.cd {
  width: 100%;
  margin-bottom: 10px;
}
.dragHeader {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: left;
}

.dropContain {
  width: 100%;
  min-height: 30px;
  line-height: 30px;
  border: 1px solid black;
  border-radius: 5px;
}
.dropItem {
  position: relative;
  width: 60px;
  height: 20px;
  text-align: center;
  background: #fff;
  color: #000;
  line-height: 20px;
  border-radius: 5px;
  display: inline-block;
  margin-right: 10px;
}
.dropItem .after {
  position: absolute;
  display: block;
  /* display: block; */
  width: 10px;
  height: 10px;
  border-radius: 5px;
  top: 0px;
  right: 0px;
  background-color: #39444673;
  background-image: url(http://localhost:9527/static/svg/dialogclose.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>


