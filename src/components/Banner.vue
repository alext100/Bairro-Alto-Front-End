<template>
  <div class="particles-container">
    <Particles
      id="tsparticles"
      class="tsparticles"
      :particlesInit="particlesInit"
      :particlesLoaded="particlesLoaded"
      url="/particlesText.json"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      loaded: false,
      particlesInit: null,
      particlesLoaded: null,
    };
  },
});
</script>

<style scoped>
#tsparticles {
  position: absolute;
  width: 100%;
  height: 500px;
}
.particles-container {
  justify-content: center;
  display: flex;
}
</style>
