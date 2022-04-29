<template>
  <div class="container">
    <Form
      @submit="handleLogin"
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
      @change="onChange"
      class="shadow-lg login-form"
    >
      <div class="email">
        <TextInput
          :value="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="Введите email адрес"
          success-message="Готово, мы не будем спамить!"
          class="text-input-email"
        />
        <EmailValidationAnimation />
      </div>
      <TextInput
        :value="password"
        name="password"
        :type="passwordFieldType"
        label="Пароль"
        placeholder="Введите пароль"
        success-message="Сложный и безопасный!"
      />
      <ShowHidePassword @click="hidePassword = !hidePassword" />
      <span v-if="isNotActive" class="login__wrong login__wrong--is-not-active"
        >Перейдите по ссылке в письме, чтобы активировать аккаунт</span
      >
      <span v-else-if="isWrong" class="login__wrong"
        >Не правильное имя пользователя или пароль! Попробуйте ещё раз!</span
      >
      <SubmitButton v-if="!isLoading" class="login-submit-button" buttonType="submit">Подтвердить</SubmitButton>
      <SubmitButton v-if="isLoading" class="login-submit-button__disabled" :buttonDisabled="true">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Загружается...
      </SubmitButton>
      <router-link :to="{ name: 'Register' }" class="text-decoration-none">
        <SubmitButton v-if="!isLoading" class="register-button d-flex" buttonType="button"
          >Зарегистрироваться</SubmitButton
        >
      </router-link>
    </Form>
  </div>
</template>

<script lang="ts">
import * as Yup from "yup";
import { useStore } from "vuex";
import { Form } from "vee-validate";
import { useRouter } from "vue-router";
import TextInput from "@/components/TextInput.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import { IUserError, UserLoginData } from "@/types/interfaces";
import { computed, defineComponent, onMounted, ref } from "vue";
import ShowHidePassword from "@/components/ShowHidePassword.vue";
import EmailValidationAnimation from "@/components/EmailValidationAnimation.vue";

export default defineComponent({
  name: "Login",
  components: {
    TextInput,
    Form,
    SubmitButton,
    ShowHidePassword,
    EmailValidationAnimation,
  },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();
    const isLoading = computed(() => state.isLoading);
    const isRegistered = computed(() => state.isRegistered);
    const currentUser = computed(() => state.currentUser);
    const hidePassword = ref(true);
    const passwordFieldType = computed(() => (hidePassword.value ? "password" : "text"));
    const isWrong = ref(false);
    const isNotActive = ref(false);

    const redirectToUserPage = () => {
      if (state.currentUser.studentAccess === true) {
        router.push({ path: `/student/${state.currentUser.id}` });
      }
      if (state.currentUser.teacherAccess === true) {
        router.push("/teacher");
      }
      if (state.currentUser.adminAccess === true) {
        router.push("/admin");
      }
    };

    onMounted(() => redirectToUserPage());

    const onInvalidSubmit = () => {
      const submitBtn = document.querySelector(".login-submit-button");
      if (submitBtn) {
        submitBtn.classList.add("invalid");
        setTimeout(() => {
          submitBtn.classList.remove("invalid");
        }, 1000);
      }
    };

    const onChange = () => {
      state.isLoading = false;
    };

    // Using yup to generate a validation schema
    // https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).max(20).required(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLogin = async (values: Record<string, any>) => {
      if (values.email !== "" && values.password !== "") {
        const userData: UserLoginData = {
          email: values.email,
          password: values.password,
        };
        try {
          await dispatch("login", userData);
          isWrong.value = false;
          setTimeout(() => {
            redirectToUserPage();
          }, 500);
        } catch (error) {
          if (
            (error as Error).message.match("Подтвердите регистрацию перейдя по ссылке в письме!") ||
            (error as Error).message.match("Invalid token specified") ||
            (error as IUserError).code?.match("401")
          ) {
            isNotActive.value = true;
          } else isWrong.value = true;
        }
      }
    };

    return {
      schema,
      isWrong,
      onChange,
      isLoading,
      currentUser,
      handleLogin,
      isNotActive,
      password: "",
      hidePassword,
      isRegistered,
      onInvalidSubmit,
      passwordFieldType,
      userData: { email: null, password: null },
      email: state.isRegistered ? state.user.email : "",
    };
  },
});
</script>

<style lang="scss" scoped>
form {
  width: 350px;
  margin: 0px auto;
  padding: 15px 20px 30px;
  border-style: ridge;
}

.login-submit-button {
  letter-spacing: 0.5em;
  width: -webkit-fill-available;
}

.register-button {
  letter-spacing: 0.2em;
  width: -webkit-fill-available;
}

.login__wrong {
  color: var(--error-color);
  font-size: 15px;
  font-family: Noto Sans, Arial, sans-serif;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
