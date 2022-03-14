<template>
  <Header />
  <n-config-provider :locale="ruRU" :date-locale="dateRuRU">
    <n-message-provider>
      <router-view v-slot="{ Component, route }">
        <transition name="route" mode="out-in">
          <div :key="route.name">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NMessageProvider, NConfigProvider, ruRU, dateRuRU } from "naive-ui";
import Header from "./components/Header.vue";

export default defineComponent({
  name: "app",
  components: { Header, NMessageProvider, NConfigProvider },

  setup() {
    return {
      ruRU,
      dateRuRU,
    };
  },
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
#app {
  font-family: Noto Sans, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
:root {
  --primary-color: #0071fe;
  --error-color: #f23648;
  --error-bg-color: #fddfe2;
  --success-color: #21a67a;
  --success-bg-color: #e0eee4;
  --bairro-alto-logo-color: #fcb73c;
}

/* route transitions */
.route-enter-from {
  opacity: 0;
}
.route-enter-active {
  transition: all 0.3s ease-out;
}
.route-leave-to {
  opacity: 0;
}
.route-leave-active {
  transition: all 0.3s ease-in;
}
</style>
