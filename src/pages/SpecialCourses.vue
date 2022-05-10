<template>
  <div class="special-courses__container">
    <div class="container">
      <Banner id="tsparticles-materials" url="/particlesImages.json" v-if="!$isMobile()" />
      <div class="special-courses ck-content">
        <h1 class="special-courses__title m-3">Спецкурсы</h1>
        <div class="container cards-container">
          <n-card hoverable v-for="course in specialCourses || []" :key="course.id" footer-style="font-size: 18px">
            <template #cover>
              <router-link :to="{ name: 'SpecialCourse', params: { id: course.id } }">
                <img v-if="course.image && course.image !== ''" :src="course.image" alt="Course cover" />
                <em v-else class="bx bxs-image bx-border no-image-icon"></em>
              </router-link>
            </template>
            <template #footer>
              <router-link
                v-tippy="'Узнать подробности'"
                class="special-courses__link-to-card"
                :to="{ name: 'SpecialCourse', params: { id: course.id } }"
              >
                {{ course.title }}
              </router-link>
            </template>
          </n-card>
        </div>
      </div>
    </div>
    <Footer class="special-courses__footer" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import { useHead } from "@vueuse/head";
import { Post } from "@/types/interfaces";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import useSplitText from "@/composables/useSplitText";
import { computed, ComputedRef, onBeforeMount, onMounted, reactive } from "vue";

const { state, dispatch } = useStore();
const siteData = reactive({
  title: `Спецкурсы Bairro Alto`,
  description: `Специальные курсы португальского языка в Санкт-Петербурге Байрру Алту`,
});
useHead({
  title: computed(() => siteData.title),
  meta: [
    {
      name: `description`,
      content: computed(() => siteData.description),
    },
  ],
});

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const specialCourses: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.category === "Спецкурсы")
);
useSplitText(".special-courses__title", "charsWave");
</script>

<style lang="scss" scoped>
.special-courses__container {
  position: relative;
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.special-courses__title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}

.n-card {
  width: 300px;
  height: 380px;
  margin: 10px 3px 10px 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
.special-courses__link-to-card {
  color: black;
  text-decoration: none;
}
.no-image-icon {
  font-size: 182px;
  color: #8080804d;
}
.special-courses__footer {
  position: absolute;
  bottom: 0;
}
</style>
