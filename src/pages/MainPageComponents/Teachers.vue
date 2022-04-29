<template>
  <div class="main-page__teachers shadow">
    <h2 class="mx-5 m-1 main-page__teachers__title">Преподаватели</h2>
    <n-carousel
      autoplay
      draggable
      :interval="7000"
      show-arrow
      :transition-style="{ transitionDuration: 800, transitionTimingFunction: 'cubic-bezier(.29, 1.01, 1, 0.48)' }"
      data-test="teachers-carousel"
    >
      <div v-for="teacher in allTeachers" :key="teacher">
        <n-card :bordered="false">
          <div class="main-page__teachers__body p-0" v-html="teacher?.body"></div>
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
</template>

<script>
import { NCard, NCarousel, NIcon } from "naive-ui";
import { defineComponent } from "vue";
import { ArrowBack, ArrowForward } from "@vicons/ionicons5";

export default defineComponent({
  name: "Teachers",
  components: { NCard, NCarousel, ArrowBack, ArrowForward, NIcon },

  props: {
    allTeachers: {
      type: Array,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.main-page__teachers {
  border-bottom: 1px solid var(--hover-color);
  &__title {
    color: var(--bairro-alto-logo-color);
  }
  &__body {
    font-size: 17px;
    display: flex;
  }
}
.custom-arrow {
  display: flex;
  position: absolute;
  bottom: 20px;
  right: 14px;
  & button {
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
    &:hover {
      background-color: rgba(0, 0, 0, 0.4);
    }
    &:active {
      transform: scale(0.95);
      transform-origin: center;
    }
  }
}
.custom-dots {
  display: flex;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 25px;
  left: 20px;
  & li {
    display: inline-block;
    width: 12px;
    height: 4px;
    margin: 0 3px;
    border-radius: 4px;
    background-color: rgba(61, 61, 61, 0.4);
    transition: width 0.3s, background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  & .is-active {
    width: 40px;
    background: var(--bairro-alto-logo-color);
  }
}

@media (max-width: 768px) {
  .teacher__body {
    flex-direction: column;
  }
}
</style>
