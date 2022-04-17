<template>
  <div class="home container dflex mb-5">
    <div v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0 }" :delay="200">
      <h1 class="main-page__title">Уютная школа португальского языка</h1>
    </div>
    <Teachers :allTeachers="allTeachers" />
    <Banner url="/particlesText.json" id="tsparticles" v-if="!$isMobile()" />
    <div v-if="!$isMobile()" class="banner-container"></div>
    <Features
      :methodic="methodic"
      :methodicBody="methodicBody"
      :atmosphere="atmosphere"
      :atmosphereBody="atmosphereBody"
    />
    <News :newsBody="newsBody" />
  </div>
  <Footer />
</template>

<script>
import { computed, defineComponent, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import getTitleAndBody from "@/utils/getTitleAndBody";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import Teachers from "./MainPageComponents/Teachers.vue";
import Features from "./MainPageComponents/Features.vue";
import News from "./MainPageComponents/News.vue";

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export default defineComponent({
  name: "MainPage",

  components: { Banner, Footer, Teachers, Features, News },
  setup() {
    const { state, dispatch } = useStore();
    onBeforeMount(() => dispatch("getWebContent"));
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });

    const allTeachers = computed(() => state.webContent?.posts?.filter((post) => post.category === "Преподаватели"));
    const teacher = computed(() => allTeachers.value[getRandomInteger(0, allTeachers.value.length - 1)]);

    const methodic = computed(() =>
      state.webContent?.posts?.filter((post) => post?.title.match("Лексический подход - главная страница"))
    );
    const methodicBody = computed(() => getTitleAndBody(methodic?.value[0].body));

    const atmosphere = computed(() =>
      state.webContent?.posts?.filter((post) => post?.title.match("Атмосфера - главная страница"))
    );
    const atmosphereBody = computed(() => getTitleAndBody(atmosphere?.value[0].body));

    const news = computed(() => state.webContent?.posts?.filter((post) => post?.category === "Новости"));
    const newsBody = computed(() => news.value.map((element) => getTitleAndBody(element?.body)));

    return {
      teacher,
      methodic,
      newsBody,
      atmosphere,
      allTeachers,
      methodicBody,
      atmosphereBody,
    };
  },
});
</script>

<style scoped>
.main-page__title {
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  line-height: 1.4;
  font-weight: 400;
}

.banner-container {
  height: 490px;
}

@media (min-width: 480px) {
  .main-page__title {
    max-width: 42rem;
    font-size: 3.5rem;
  }
}

@media (max-width: 479px) {
  .main-page__title {
    font-size: 2.5rem;
  }
}
</style>
