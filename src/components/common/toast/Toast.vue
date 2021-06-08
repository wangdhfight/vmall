<template>
  <div class="toast" v-show="isShow">
    <div class="toast-txt">
      <div>{{ message }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Toast",
  data() {
    return {
      message: "加载....",
      isShow: false,
      timer: null,
    };
  },
  methods: {
    show(message = "加载中...", duration = 1000) {
      this.isShow = true;
      this.message = message;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isShow = false;
        this.message = "";
      }, duration);
    },
  },
  // beforeDestory() { // 不生效
  //   clearTimeout(this.timer);
  // },
};
</script>
<style scoped>
.toast{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 999;
  background: rgba(82,103,108, .01);
}
.toast-txt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(253, 164, 164, 0.8);
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  z-index: 999;
}
</style>
