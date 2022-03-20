<template>
  <div class="container">
    <Banner id="tsparticles-materials" url="/particlesImages.json" v-if="!$isMobile()" />
    <div class="ck-content">
      <h1 class="features-title m-3">Материалы</h1>
      <div class="container cards-container">
        <n-card hoverable v-for="material in materials || []" :key="material" footer-style="font-size:18px;">
          <template #cover>
            <router-link :to="{ name: 'MaterialsPost', params: { id: material.id } }">
              <img v-if="material.image && material.image !== ''" :src="material.image" alt="Post cover" />
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
  <Footer />
</template>

<script>
import { computed, defineComponent, onMounted } from "vue";
import { mapActions, useStore } from "vuex";
import { NCard } from "naive-ui";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "Materials",
  components: { NCard, Banner, Footer },

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
.materials-page__router-link {
  color: black;
  text-decoration: none;
}
.features-title {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
</style>
