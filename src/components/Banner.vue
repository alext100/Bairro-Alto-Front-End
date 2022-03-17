<template>
  <div class="particles-container">
    <Particles
      :id="id"
      class="tsparticles"
      :particlesInit="particlesInit"
      :particlesLoaded="particlesLoaded"
      :url="url"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
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

#tsparticles-materials {
  position: absolute;
  width: 100%;
  height: 100vh;
}
.particles-container {
  justify-content: center;
  display: flex;
}
</style>
