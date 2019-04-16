<template>
  <div class="ct">{{title}}</div>
</template>
<script>
export default {
  props: ["title"],
  data() {
    return {};
  }
};
</script>
<style scoped>
.ct {
  color: yellow;
  width: 100%;
  text-align: center;
  line-height: 30px;
  height: 30px;
}
</style>


