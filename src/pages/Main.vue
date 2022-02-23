<template>
  <div class="home container dflex">
    <h1 class="pageHeader-title">Уютная школа португальского языка</h1>
    <div class="main-teacher shadow">
      <h2 class="m-5">Преподаватели</h2>
      <n-carousel
        autoplay
        :interval="7000"
        effect="custom"
        :transition-props="{ name: 'creative' }"
        show-arrow
        style="width: 100%; height: 550px"
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
  </div>
</template>

<script>
import { NCard, NCarousel, NIcon } from "naive-ui";
import { computed, defineComponent, onMounted } from "vue";
import { mapActions, useStore } from "vuex";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default defineComponent({
  name: "MainPage",

  components: { NCard, NCarousel, ArrowBack, ArrowForward, NIcon },
  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => dispatch("getWebContent"));
    const allTeachers = computed(() => state.webContent?.posts.filter((post) => post.category === "Преподаватели"));
    const teacher = computed(() => allTeachers.value[getRandomInteger(0, allTeachers.value.length - 1)]);

    return {
      teacher,
      allTeachers,
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

<style scoped>
.pageHeader-title {
  margin-top: 0;
  margin-bottom: 3rem;
  font-size: 2.7rem;
  line-height: 1.4;
  font-weight: 400;
}
.teacher__body {
  object-fit: cover;
}

.teacher-info {
  position: absolute;
  display: block;
  bottom: 21%;
  right: 0%;
  max-width: 17rem;
  color: #eee;
  font-size: 1.1rem;
  font-family: Noto Sans, Arial, sans-serif;
  line-height: 1.59;
}

:deep(.creative-enter-from),
:deep(.creative-leave-to) {
  opacity: 0;
  transform: scale(0.9);
}

:deep(.creative-enter-active),
:deep(.creative-leave-active) {
  transition: all 0.8s ease;
}

@media (min-width: 480px) {
  .pageHeader-title {
    max-width: 42rem;
    font-size: 4rem;
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
  color: rgb(255, 168, 28);
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
  background: rgb(255, 168, 28);
}
</style>
