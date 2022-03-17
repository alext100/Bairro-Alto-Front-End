<template>
  <div class="container">
    <Banner id="tsparticles-materials" url="/particlesImages.json" v-if="!$isMobile()" />
    <div class="materials-page__features ck-content">
      <h1 class="features-title features-item m-0">Материалы</h1>
      <div class="container cards-container">
        <n-card hoverable v-for="material in materials || []" :key="material" footer-style="font-size:18px">
          <template #cover>
            <router-link :to="{ name: 'MaterialsPost', params: { id: material.id } }">
              <img :src="material.image" />
            </router-link>
          </template>
          <template #footer>
            <router-link class="materials-page__router-link" :to="'/materials/' + material.id">
              {{ material.title }}
            </router-link>
          </template>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted } from "vue";
import { mapActions, useStore } from "vuex";
import { NCard } from "naive-ui";
import Banner from "@/components/Banner.vue";

export default defineComponent({
  name: "Materials",
  components: { NCard, Banner },

  setup() {
    const { state, dispatch } = useStore();
    onMounted(() => {
      dispatch("getWebContent");
      document.body.style.backgroundColor = "white";
    });

    const materials = computed(() => state.webContent?.posts?.filter((post) => post?.category === "Материалы"));

    return {
      materials,
    };
  },

  methods: {
    ...mapActions(["getWebContent"]),
  },
});
</script>

<style scoped>
.n-card {
  width: 300px;
  height: 400px;
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
