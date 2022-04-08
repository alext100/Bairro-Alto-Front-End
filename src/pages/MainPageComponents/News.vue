<template>
  <div class="main-page__features-news ck-content">
    <div v-motion-slide-visible-bottom :delay="200">
      <router-link to="/news" class="features-item">
        <h2 class="features-title m-0">Новости</h2>
      </router-link>
      <n-carousel
        draggable
        show-arrow
        :transition-style="{ transitionDuration: 800, transitionTimingFunction: 'cubic-bezier(.29, 1.01, 1, 0.48)' }"
        data-test="news-carousel"
      >
        <div v-for="news in newsBody" :key="news">
          <n-card :bordered="false">
            <div class="news__body p-0 mb-5 news-text" v-html="news?.body"></div>
          </n-card>
        </div>

        <template #arrow="{ prev, next }">
          <div class="custom-arrow">
            <button v-tippy="'Предыдущая'" type="button" class="custom-arrow--left" @click="prev">
              <n-icon><ArrowBack /></n-icon>
            </button>
            <button v-tippy="'Следующая'" type="button" class="custom-arrow--right" @click="next">
              <n-icon><ArrowForward /></n-icon>
            </button>
          </div>
        </template>
        <template #dots="{ total, currentIndex, to }">
          <ul class="custom-dots mb-2">
            <li
              v-for="index of total"
              :key="index"
              :class="{ ['is-active']: currentIndex === index - 1 }"
              @click="to(index - 1)"
            />
          </ul>
        </template>
      </n-carousel>
      <router-link to="/news" class="features-item">
        <span>Все новости...</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { NCard, NCarousel, NIcon } from "naive-ui";
import { defineComponent } from "vue";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";

export default defineComponent({
  name: "MainPageNews",

  components: { NCard, NCarousel, ArrowBack, ArrowForward, NIcon },

  props: {
    newsBody: { type: Object, required: true },
  },
});
</script>

<style scoped>
.main-page__features-news {
  padding-top: 3rem;
  padding-bottom: 1rem;
  z-index: 2;
}
.features-item {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
.news-text {
  color: #000;
  text-align: justify;
  text-justify: inter-word;
  font-size: 16px;
}

.custom-arrow {
  display: flex;
  position: absolute;
  bottom: 20px;
  right: 14px;
}

.custom-arrow button {
  font-size: larger;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  color: var(--bairro-alto-logo-color);
  background-color: rgba(7, 7, 7, 0.6);
  border-width: 0;
  border-radius: 8px;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-arrow button:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.custom-arrow button:active {
  transform: scale(0.95);
  transform-origin: center;
}

.custom-dots {
  display: flex;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 25px;
  left: 20px;
}

.custom-dots li {
  display: inline-block;
  width: 12px;
  height: 4px;
  margin: 0 3px;
  border-radius: 4px;
  background-color: rgba(61, 61, 61, 0.4);
  transition: width 0.3s, background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-dots li.is-active {
  width: 40px;
  background: var(--bairro-alto-logo-color);
}

@media (min-width: 900px) {
  .features-item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30%;
    flex: 0 0 45%;
    margin-bottom: -30px;
  }
}
</style>
