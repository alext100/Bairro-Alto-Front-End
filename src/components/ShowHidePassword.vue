<template>
  <em class="toggle-password fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></em>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const hidePassword = ref(true);
const passwordFieldIcon = computed(() => (hidePassword.value ? "fa-eye" : "fa-eye-slash"));
</script>

<style scoped>
.toggle-password {
  top: -70px;
  left: 260px;
  position: relative;
  background-color: transparent;
  cursor: pointer;
  border: none;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  width: fit-content;
}
</style>
