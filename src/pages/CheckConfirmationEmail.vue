<template>
  <div class="container d-flex justify-content-center m-5">
    <n-card
      size="huge"
      hoverable
      :bordered="false"
      embedded
      content-style="align-self: center; font-size: 20px;"
      footer-style="display: flex; justify-content: center;"
    >
      Активируйте аккаунт по ссылке, которую мы отправили на ваш email
      <template #footer>
        <button class="submit-btn d-flex" type="button" @click="handleSubmitSendEmail">Выслать ссылку ещё раз</button>
      </template>
    </n-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NCard } from "naive-ui";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "CheckConfirmationEmail",
  components: { NCard },
  setup() {
    const route = useRoute();
    const { dispatch } = useStore();
    const handleSubmitSendEmail = () => {
      dispatch("sendConfirmEmailOneMoreTime", route.params.email);
    };
    return { handleSubmitSendEmail };
  },
});
</script>

<style scoped>
.n-card {
  max-width: fit-content;
}
.submit-btn {
  display: inline-block;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  justify-content: center;
  padding: 1rem 1.6rem 1rem 2.5rem;
  color: var(--bairro-alto-logo-color);
  border: 1px solid var(--bairro-alto-logo-color);
  border-radius: 1.2rem;
  -webkit-transition: border-color 0.2s;
  transition: border-color 0.2s;
  line-height: normal;
  background: transparent;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}
.submit-btn:hover {
  color: var(--hover-color);
  border: 1px solid var(--hover-color);
  transform: scale(1.1);
}
</style>
