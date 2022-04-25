<template>
  <div>
    <Form
      @submit="handleCreate"
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
      class="shadow-lg register-form"
    >
      <TextInput
        :value="firstName"
        name="firstName"
        type="text"
        label="Имя"
        placeholder="Имя"
        success-message="Добро пожаловать!"
      />
      <TextInput
        :value="lastName"
        name="lastName"
        type="text"
        label="Фамилия"
        placeholder="Фамилия"
        success-message="Добро пожаловать!"
      />
      <div class="email">
        <TextInput
          :value="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="Ваш email адрес"
          success-message="Готово, мы не будем спамить!"
          class="text-input-email"
        />
        <span v-if="isWrongEmailOnRegister" class="email__wrong"
          >Кажется этот email уже зарегистрирован! Попробуйте ещё раз!</span
        >
        <EmailValidationAnimation />
      </div>
      <TextInput
        :value="password"
        name="password"
        :type="passwordFieldType"
        label="Пароль"
        placeholder="Ваш пароль"
        success-message="Сложный и безопасный!"
      />
      <em class="toggle-password fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></em>

      <TextInput
        :value="confirmPassword"
        name="confirmPassword"
        :type="passwordFieldType"
        label="Подтвердите пароль"
        placeholder="Введите пароль ещё раз"
        success-message="Запомните его!"
      />
      <em class="toggle-password fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></em>

      <button v-if="!isLoading" class="submit-btn d-flex" type="submit">Подтвердить</button>
      <button v-if="isLoading" class="btn submit-btn" type="submit" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Загружается...
      </button>
    </Form>
  </div>
</template>

<script lang="ts">
import * as Yup from "yup";
import { useStore } from "vuex";
import { Form } from "vee-validate";
import { useRouter } from "vue-router";
import TextInput from "@/components/TextInput.vue";
import { computed, defineComponent, ref } from "vue";
import { UserRegisterData } from "@/types/interfaces";
import EmailValidationAnimation from "@/components/EmailValidationAnimation.vue";

export default defineComponent({
  name: "Register",
  components: {
    Form,
    TextInput,
    EmailValidationAnimation,
  },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();

    const hidePassword = ref(true);
    const passwordFieldIcon = computed(() => (hidePassword.value ? "fa-eye" : "fa-eye-slash"));
    const passwordFieldType = computed(() => (hidePassword.value ? "password" : "text"));
    const isLoading = computed(() => state.isLoading);
    const isRegistered = computed(() => state.isRegistered);
    const isWrongEmailOnRegister = computed(() => state.isWrongEmailOnRegister);
    const isWrong = ref(false);
    const email = "";
    const password = "";
    const firstName = "";
    const lastName = "";
    const image = "";
    const confirmPassword = "";

    const onInvalidSubmit = () => {
      const submitBtn: HTMLElement | null = document.querySelector(".submit-btn");
      if (submitBtn) {
        submitBtn.classList.add("invalid");
        setTimeout(() => {
          submitBtn.classList.remove("invalid");
        }, 1000);
      }
    };

    // Using yup to generate a validation schema
    // https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
    const schema = Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).max(20).required(),
      confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref("password")], "Пароль не совпадает"),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreate = async (values: Record<string, any>) => {
      if (values.email !== "" && values.password !== "") {
        const userData: UserRegisterData = {
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          image:
            image === ""
              ? "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
              : image,
        };

        try {
          await dispatch("registerUser", userData);
          if (state.isRegistered === true) {
            router.push(`/check-email/${userData.email}`);
          }
          isWrong.value = false;
        } catch (error) {
          isWrong.value = true;
        }
      }
    };

    return {
      image,
      email,
      schema,
      isWrong,
      password,
      lastName,
      firstName,
      isLoading,
      isRegistered,
      hidePassword,
      handleCreate,
      confirmPassword,
      onInvalidSubmit,
      passwordFieldIcon,
      passwordFieldType,
      isWrongEmailOnRegister,
      userData: { password: null, firstName: null, lastName: null, email: null, image: null },
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
