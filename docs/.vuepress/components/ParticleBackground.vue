<template>
  <div id="particles-js-container" class="particle-background"></div>
</template>

<script>
export default {
  name: "ParticleBackground",
  mounted() {
    if (window.particlesJS) {
      this.initParticles();
    } else {
      console.error(
        "particles.js not loaded. Check config.js head script import."
      );
    }
  },
  methods: {
    initParticles() {
      // --- 针对白色背景优化的全新粒子配置 ---
      const particleOptions = {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#000" }, // <-- 修改为深灰色粒子
          shape: { type: "circle" },
          opacity: { value: 0.6, random: true }, // <-- 提高一点不透明度
          size: { value: 2, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#000", // <-- 修改为浅灰色连线
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "window",
          events: { onhover: { enable: true, mode: "grab" }, resize: true }, // <-- 模式改为 grab，感觉更柔和
          modes: {
            grab: { distance: 140, line_opacity: 1 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        retina_detect: true,
      };

      window.particlesJS("particles-js-container", particleOptions);
    },
  },
};
</script>

<style scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
