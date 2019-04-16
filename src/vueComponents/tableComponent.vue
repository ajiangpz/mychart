<template>
  <div class="asideFull">
    <div id="tableau" v-if="rows.length">
      <table>
        <tbody>
          <tr v-for="(item,index) in rows" :key="index">
            <td v-for="value in item" :key="'td'+value">{{value}}</td>
            <td @click="deleteRows(index)">删除</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: ["rows"],
  data() {
    return {};
  },
  methods: {
    deleteRows(index) {
      this.rows.splice(index, 1);
    }
  }
};
</script>
<style scoped>
</style>


