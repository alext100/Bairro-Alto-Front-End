<template>
  <div class="home container dflex mb-5">
    <div
      v-motion
      :initial="{
        opacity: 0,
        y: 50,
      }"
      :enter="{
        opacity: 1,
        y: 0,
      }"
      :delay="200"
    >
      <h1 class="main-page__title">Уютная школа португальского языка</h1>
    </div>
    <div class="main-page__teachers shadow">
      <h2 class="mx-5 m-1 teachers__title">Преподаватели</h2>
      <n-carousel
        autoplay
        draggable
        :interval="7000"
        show-arrow
        :transition-style="{ transitionDuration: 800, transitionTimingFunction: 'cubic-bezier(.29, 1.01, 1, 0.48)' }"
      >
        <div v-for="teacher in allTeachers" :key="teacher">
          <n-card :bordered="false">
            <div class="teacher__body p-0" v-html="teacher?.body"></div>
          </n-card>
        </div>

        <template #arrow="{ prev, next }">
          <div class="custom-arrow">
            <button type="button" class="custom-arrow--left" @click="prev">
              <n-icon><ArrowBack /></n-icon>
            </button>
            <button type="button" class="custom-arrow--right" @click="next">
              <n-icon><ArrowForward /></n-icon>
            </button>
          </div>
        </template>
        <template #dots="{ total, currentIndex, to }">
          <ul class="custom-dots">
            <li
              v-for="index of total"
              :key="index"
              :class="{ ['is-active']: currentIndex === index - 1 }"
              @click="to(index - 1)"
            />
          </ul>
        </template>
      </n-carousel>
    </div>
    <Banner v-if="!$isMobile()" />
    <div v-if="!$isMobile()" class="banner-container"></div>

    <section class="main-page__features ck-content">
      <div class="features">
        <router-link to="/methodic" class="features-item">
          <div v-motion-slide-visible-left :delay="300">
            <h2 class="features-title">Методика</h2>
            <div v-if="methodic[0]?.body" class="features-text" v-html="methodicBody?.body"></div>
            <div v-else class="features-text">
              Преподаём по лексическому подходу — то есть делаем акцент на запоминании и использовании не отдельных
              слов, а фраз и словосочетаний — так легче запоминать слова и легче научиться разговаривать.
            </div>
            <span>Подробнее...</span>
          </div>
        </router-link>
        <router-link to="/atmosphere" class="features-item">
          <div v-motion-slide-visible-right :delay="300">
            <h2 class="features-title">Атмосфера</h2>
            <div v-if="atmosphere[0]?.body" class="features-text" v-html="atmosphereBody?.body"></div>
            <div v-else class="features-text">
              Школа небольшая и уютная. Аудитории школы находятся в мансарде. В перерывах пьём чай (иногда вино), едим
              печенье и листаем книги на итальянском.
            </div>
            <span>Подробнее...</span>
          </div>
        </router-link>
      </div>
    </section>

    <div class="main-page__features ck-content">
      <div v-motion-slide-visible-bottom :delay="200">
        <router-link to="/news" class="features-item">
          <h2 class="features-title m-0">Новости</h2>
        </router-link>

        <n-carousel
          draggable
          show-arrow
          :transition-style="{ transitionDuration: 800, transitionTimingFunction: 'cubic-bezier(.29, 1.01, 1, 0.48)' }"
        >
          <div v-for="news in newsBody" :key="news">
            <n-card :bordered="false">
              <div class="news__body p-0 mb-5 news-text" v-html="news?.body"></div>
            </n-card>
          </div>

          <template #arrow="{ prev, next }">
            <div class="custom-arrow">
              <button type="button" class="custom-arrow--left" @click="prev">
                <n-icon><ArrowBack /></n-icon>
              </button>
              <button type="button" class="custom-arrow--right" @click="next">
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
  </div>
</template>

<script>
import { NCard, NCarousel, NIcon } from "naive-ui";
import { computed, defineComponent, onMounted, onUnmounted } from "vue";
import { mapActions, useStore } from "vuex";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";
import getTitleAndBody from "@/utils/getTitleAndBody";
import Banner from "@/components/Banner.vue";

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default defineComponent({
  name: "MainPage",

  components: { NCard, NCarousel, ArrowBack, ArrowForward, NIcon, Banner },
  setup() {
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });
    onUnmounted(() => {
      document.body.style.backgroundColor = "";
    });

    const { state, dispatch } = useStore();
    onMounted(() => dispatch("getWebContent"));
    const allTeachers = computed(() => state.webContent?.posts?.filter((post) => post.category === "Преподаватели"));
    const methodic = computed(() =>
      state.webContent?.posts?.filter((post) => post?.title === "Лексический подход - главная страница")
    );
    const methodicBody = computed(() => getTitleAndBody(methodic?.value[0].body));

    const atmosphere = computed(() =>
      state.webContent?.posts?.filter((post) => post?.title === "Атмосфера - главная страница")
    );
    const atmosphereBody = computed(() => getTitleAndBody(atmosphere?.value[0].body));

    const news = computed(() => state.webContent?.posts?.filter((post) => post?.category === "Новости"));
    const newsBody = computed(() => news.value.map((element) => getTitleAndBody(element?.body)));

    const teacher = computed(() => allTeachers.value[getRandomInteger(0, allTeachers.value.length - 1)]);

    return {
      teacher,
      allTeachers,
      atmosphere,
      methodic,
      atmosphereBody,
      methodicBody,
      newsBody,
    };
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    ...mapActions(["getWebContent"]),
  },
});
</script>

<style>
body {
  background-color: #fff;
}
.main-page__title {
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  line-height: 1.4;
  font-weight: 400;
}
.teachers__title {
  color: var(--bairro-alto-logo-color);
}
.teacher__body {
  display: flex;
}

.main-page__features {
  padding-top: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #d59758;
  z-index: 2;
}

.main-page__teachers {
  border-bottom: 1px solid #d59758;
}

.features {
  display: flex;
  flex-direction: column;
}

.features-item {
  color: #d59758;
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
.features-text {
  color: #000;
  text-align: justify;
  text-justify: inter-word;
  z-index: 1;
}

.news-text {
  color: #000;
  text-align: justify;
  text-justify: inter-word;
  font-size: 16px;
}

.banner-container {
  height: 490px;
}

@media (min-width: 900px) {
  .main-page__features {
    padding-bottom: 4rem;
  }

  .features {
    flex-direction: row;
    justify-content: space-around;
  }
  .features-item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30%;
    flex: 0 0 45%;
    margin-bottom: -30px;
  }
}

@media (min-width: 1199px) {
  .features {
    flex-direction: row;
    justify-content: space-between;
  }
}

@media (min-width: 480px) {
  .main-page__title {
    max-width: 42rem;
    font-size: 3.5rem;
  }
  .teacher__body {
    display: flex;
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .teacher__body {
    flex-direction: column;
  }
  .main-page__title {
    font-size: 3rem;
  }
}
@media (max-width: 479px) {
  .main-page__title {
    font-size: 2.5rem;
  }
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
</style>
