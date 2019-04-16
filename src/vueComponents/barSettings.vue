<template>
  <div class="bs">
    <div>{{barsettings}}</div>
    <div>{{settings}}</div>
    <span>可拖拽的item</span>
    <div class="dragContain">
      <div
        v-for="(item,index) in columns.slice(1)"
        :key="'drag'+index"
        draggable="true"
        class="dragItem"
        @dragstart="drag($event,item)"
      >{{item}}</div>
    </div>
    <span>metris</span>
    <div class="dropContain" @drop="drop($event,barsettings.metrics)" @dragover="allowDrop($event)">
      <div v-for="(item,index) in barsettings.metrics" :key="index" class="dropItem">
        <span>{{item}}</span>
        <div class="after" @click="removeItem(barsettings.metrics,item)"></div>
      </div>
    </div>
    <span>showLine</span>
    <div
      class="dropContain"
      @drop="drop($event,barsettings.showLine)"
      @dragover="allowDrop($event)"
    >
      <div v-for="(item,index) in barsettings.showLine" :key="index" class="dropItem">
        <span>{{item}}</span>
        <div class="after" @click="removeItem(barsettings.showLine,item)"></div>
      </div>
    </div>
    <span>axisLine</span>
    <div
      class="dropContain"
      @drop="drop($event,barsettings.axisSite.right)"
      @dragover="allowDrop($event)"
    >
      <div v-for="(item,index) in barsettings.axisSite.right" :key="index" class="dropItem">
        <span>{{item}}</span>
        <div class="after" @click="removeItem(barsettings.axisSite.right,item)"></div>
      </div>
    </div>

    <span>yAxisType</span>
    <custom-select
      :items="dataType"
      title="左轴数据类型"
      v-model="barsettings.yAxisType[0]"
      v-on:receive="$emit('receive',barsettings)"
    ></custom-select>
    <custom-select :items="dataType" title="右轴数据类型" v-model="barsettings.yAxisType[1]"></custom-select>
    <span>stack</span>
    <div
      class="dropContain"
      @drop="drop($event,barsettings.stack.stack)"
      @dragover="allowDrop($event)"
    >
      <div v-for="(item,index) in barsettings.stack.stack" :key="index" class="dropItem">
        <span>{{item}}</span>
        <div class="after" @click="removeItem(barsettings.stack.stack,item)"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["barsettings"],
  model: {
    prop: "barsettings",
    event: "receive"
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
</style>
