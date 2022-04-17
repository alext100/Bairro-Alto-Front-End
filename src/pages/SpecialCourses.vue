<template>
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
  <Footer />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { NCard } from "naive-ui";
import { Post } from "@/types/interfaces";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import { computed, ComputedRef, onBeforeMount, onMounted } from "vue";

const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const specialCourses: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.category === "Спецкурсы")
);
</script>

<style scoped>
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
</style>
