<template>
  <div class="container">
    <div class="ck-content">
      <n-h1 class="special-courses-title m-3">Спецкурсы</n-h1>
      <div class="container cards-container">
        <n-card :bordered="false" hoverable header-style="font-size: 30px" footer-style="font-size: 18px">
          <template #header>{{ filteredPost[0]?.title }}</template>
          <div v-html="postBody?.body" ref="cardContainer"></div>
          <template #footer>
            <router-link class="nav-link" to="/special-courses">Вернуться к спецкурсам</router-link>
          </template>
        </n-card>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { useStore } from "vuex";
import * as PIXI from "pixi.js";
import { NCard, NH1 } from "naive-ui";
import { useRoute } from "vue-router";
import * as filters from "pixi-filters";
import { Post } from "@/types/interfaces";
import Footer from "@/components/Footer.vue";
import { GlitchFilterOptions } from "pixi-filters";
import getTitleAndBody from "@/utils/getTitleAndBody";
import { computed, ComputedRef, onBeforeMount, onMounted, onUnmounted, Ref, ref } from "vue";
/* eslint-disable @typescript-eslint/no-explicit-any */

const route = useRoute();
const { state, dispatch } = useStore();

onBeforeMount(() => dispatch("getWebContent"));
onMounted(() => {
  document.body.style.backgroundColor = "white";
});

const filteredPost: ComputedRef<Post[]> = computed(() =>
  state.webContent?.posts?.filter((post: Post) => post?.id === route.params.id)
);
const postBody: ComputedRef<{ title: string; body: string }> = computed(() =>
  filteredPost.value.length > 0 ? getTitleAndBody(filteredPost?.value[0]?.body) : { title: "", body: "" }
);

if (!PIXI.utils.isMobile.any) {
  const parser = new DOMParser();
  const documentOfParsedPostBody: Document = parser.parseFromString(postBody?.value?.body, "text/html");
  const cardCoverImage: HTMLElement | null = documentOfParsedPostBody.querySelector("figure.image img");
  const imageToReplace: ComputedRef<HTMLElement> = computed(
    () => document.body.querySelector("figure.image img") as HTMLElement
  );
  const cardContainer: Ref<HTMLElement | undefined> = ref<HTMLElement>();

  const app: PIXI.Application = new PIXI.Application({
    resizeTo: cardContainer.value,
    backgroundAlpha: 0,
  });

  const container = new PIXI.Container();
  app.stage.addChild(container);

  const spriteImage = `${cardCoverImage?.getAttribute("src")}`;
  const pixiSprite = PIXI.Sprite.from(spriteImage);
  container.addChild(pixiSprite);

  queueMicrotask(() => imageToReplace.value.replaceWith(app.view));

  const updateSize = (): void => {
    container.x = -100;
    container.y = 0;
    if (window.innerWidth < 1000) {
      container.x = -150;
    }
    if (window.innerWidth < 800) {
      container.x = -200;
    }
    if (window.innerWidth < 700) {
      container.x = -300;
    }
  };

  window.addEventListener("resize", updateSize);
  updateSize();

  const filterOptions: Pick<GlitchFilterOptions, "slices"> = { slices: 200 };
  const filter = new filters.GlitchFilter(filterOptions as any);

  container.filters = [filter] as any;

  gsap.fromTo(
    filter,
    {
      offset: 0,
    },
    {
      offset: 1000,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      repeatDelay: 1,
    }
  );
  gsap.fromTo(
    filter,
    {
      direction: 0,
    },
    {
      direction: 360,
      duration: 30,
      ease: "none",
      repeat: 1,
    }
  );
  onUnmounted(() => {
    window.removeEventListener("resize", updateSize);
  });
}
</script>

<style scoped>
.n-card-header__main {
  color: blue !important;
  font-weight: 900;
}
.n-card {
  width: 900px;
  min-width: 400px;
  height: fit-content;
  margin: 10px 3px 10px 3px;
}
.cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
.special-courses-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
