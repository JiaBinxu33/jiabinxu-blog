<template>
  <div ref="vantaRef" class="vanta-container"></div>
</template>

<script>
export default {
  data() {
    return {
      vantaEffect: null,
    };
  },
  mounted() {
    if (window.VANTA && window.THREE) {
      try {
        this.vantaEffect = window.VANTA.WAVES({
          el: this.$refs.vantaRef,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x5588,
          shininess: 30.0,
          waveHeight: 15.0,
          waveSpeed: 0.85,
          zoom: 0.85,
        });
      } catch (e) {
        console.error("VantaBackground: Error during Vanta initialization:", e); // 日志4：捕获初始化过程中的错误
      }
    } else {
      console.error(
        "VantaBackground: VANTA or THREE not found on window object!"
      ); // 日志5：报告库未找到
    }
  },
  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  },
};
</script>

<style scoped>
.vanta-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>
