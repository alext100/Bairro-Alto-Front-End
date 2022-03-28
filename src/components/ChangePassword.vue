<template>
  <div class="container m-5">
    <Form
      @submit="handleChangePassword"
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
      class="shadow-lg"
    >
      <n-h1>Поменять пароль</n-h1>

      <TextInput
        :value="password"
        name="password"
        :type="passwordFieldType"
        label="Пароль"
        placeholder="Новый пароль"
        success-message="Сложный и безопасный!"
      />
      <em class="toggle-password fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></em>

      <TextInput
        :value="confirmPassword"
        name="confirmPassword"
        :type="passwordFieldType"
        label="Подтвердите новый пароль"
        placeholder="Введите пароль ещё раз"
        success-message="Запомните его!"
      />
      <em class="toggle-password fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></em>

      <button v-if="!isLoading" class="submit-btn d-flex" type="submit">Подтвердить</button>
      <button v-if="isLoading" class="btn submit-btn" type="submit" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Загружается...
      </button>
      <n-p
        >Обязательно активируйте новый пароль перейдя по ссылке в письме, которое мы вам пришлём на вашу почту
        {{ currentUser.email }}</n-p
      >
      <n-p v-if="isWrong" class="btn-danger">Что-то пошло не так! Попробуйте обновить страницу и повторить</n-p>
    </Form>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "vee-validate";
import * as Yup from "yup";
import TextInput from "@/components/TextInput.vue";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { NH1, NP } from "naive-ui";

export default defineComponent({
  name: "ChangePassword",
  components: {
    TextInput,
    Form,
    NH1,
    NP,
  },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();

    const hidePassword = ref(true);
    const passwordFieldIcon = computed(() => (hidePassword.value ? "fa-eye" : "fa-eye-slash"));
    const passwordFieldType = computed(() => (hidePassword.value ? "password" : "text"));
    const isLoading = computed(() => state.isLoading);

    const { currentUser } = state;
    let isWrong = false;
    const password = ref("");
    const confirmPassword = ref("");

    const onInvalidSubmit = () => {
      const submitBtn: any = document.querySelector(".submit-btn");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    };

    const schema = Yup.object().shape({
      password: Yup.string().min(6).max(20).required(),
      confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref("password")], "Пароль не совпадает"),
    });

    // eslint-disable-next-line no-shadow
    const handleChangePassword = async ({ password }: Record<string, any>) => {
      const { email } = currentUser;
      const { id } = currentUser;
      if (password !== "") {
        const userData = {
          password,
          email,
          id,
        };

        try {
          await dispatch("changePassword", userData);
          if (state.isRegistered === true) {
            router.push(`/check-email/${userData.email}`);
          }
          isWrong = false;
        } catch (error) {
          isWrong = true;
        }
      }
    };

    return {
      schema,
      isWrong,
      password,
      isLoading,
      hidePassword,
      confirmPassword,
      onInvalidSubmit,
      passwordFieldIcon,
      passwordFieldType,
      handleChangePassword,
      currentUser: state.currentUser,
    };
  },
});
</script>

<style lang="scss" scoped>
form {
  width: 370px;
  margin: 0px auto;
  padding: 15px 20px 30px;
  border-style: ridge;
}

.submit-btn {
  display: inline-block;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  justify-content: center;
  padding: 1rem 1.6rem 1rem 2.5rem;
  color: var(--hover-color);
  border: 1px solid var(--hover-color);
  border-radius: 1.2rem;
  -webkit-transition: border-color 0.2s;
  transition: border-color 0.2s;
  line-height: normal;
  background: transparent;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5em;
}

.submit-btn.invalid {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}

.submit-btn:hover {
  transform: scale(1.1);
}

.email__wrong {
  color: var(--error-color);
  font-size: 15px;
  font-family: Noto Sans, Arial, sans-serif;
  font-weight: bold;
  margin-bottom: 10px;
}
.toggle-password {
  top: -63px;
  left: 265px;
  position: relative;
  background-color: transparent;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease-in-out;
  width: fit-content;
}
</style>
