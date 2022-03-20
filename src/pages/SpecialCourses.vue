<template>
  <div class="container">
    <Banner id="tsparticles-materials" url="/particlesImages.json" v-if="!$isMobile()" />
    <div class="specialCourses-page__features ck-content">
      <h1 class="features-title features-item m-3">Спецкурсы</h1>
      <div class="container cards-container">
        <n-card hoverable v-for="course in specialCourses || []" :key="course" footer-style="font-size: 18px">
          <template #cover>
            <router-link :to="{ name: 'SpecialCourse', params: { id: course.id } }">
              <img v-if="course.image && course.image !== ''" :src="course.image" alt="Course cover" />
            </router-link>
          </template>
          <template #footer>
            <router-link class="materials-page__router-link" :to="{ name: 'SpecialCourse', params: { id: course.id } }">
              {{ course.title }}
            </router-link>
          </template>
        </n-card>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "SpecialCourses",
  components: { Banner, NCard, Footer },

  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => {
      dispatch("getWebContent");
      document.body.style.backgroundColor = "white";
    });

    const specialCourses = computed(() => state.webContent?.posts?.filter((post) => post?.category === "Спецкурсы"));

    return {
      specialCourses,
    };
  },
});
</script>

<style scoped>
.features-item {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}

.n-card {
  width: 300px;
  height: 370px;
  margin: 10px 3px 10px 3px;
}
.cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
.materials-page__router-link {
  color: black;
  text-decoration: none;
}
</style>
