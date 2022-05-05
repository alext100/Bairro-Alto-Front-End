<template>
  <Banner id="tsparticles-materials" url="/particlesImages.json" v-if="!$isMobile()" />
  <div class="not-found">
    <h1
      class="not-found__tittle"
      v-motion
      :initial="{ opacity: 0.05, y: -100 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="1000"
    >
      404
    </h1>
    <p class="not-found__description">Этой страницы не существует.</p>
    <router-link to="/" exact class="not-found__link-back"> Вернуться на главную </router-link>
  </div>
  <Footer class="footer" />
</template>

<script setup>
import Footer from "@/components/Footer.vue";
import Banner from "@/components/Banner.vue";
import useSplitText from "@/composables/useSplitText";

useSplitText(".not-found__description", "staggerFromEnd");
</script>

<style lang="scss">
.not-found {
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  &__tittle {
    font-size: 50px;
    font-weight: 700;
    background-color: #ffffffca;
  }
  &__description {
    font-size: 30px;
    background-color: #ffffffca;
  }
  &__link-back {
    font-size: 20px;
    background-color: #ffffffca;
    color: var(--bairro-alto-logo-color);
    &:hover {
      color: var(--hover-color);
    }
  }
}
@media (max-width: 600px) {
  .not-found {
    &__tittle {
      font-size: 40px;
    }
    &__description {
      font-size: 20px;
    }
  }
}
.footer {
  position: absolute;
  bottom: 0;
}
#tsparticles-materials {
  position: absolute;
  z-index: -1;
}
</style>
