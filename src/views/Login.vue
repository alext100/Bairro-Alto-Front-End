<template>
  <div class="container">
    <Form
      @submit="handleLogin"
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
      @change="onChange"
      class="shadow-lg"
    >
      <TextInput
        :value="email"
        name="email"
        type="email"
        label="E-mail"
        placeholder="Введите email адрес"
        success-message="Готово, мы не будем спамить!"
      />
      <TextInput
        :value="password"
        name="password"
        :type="passwordFieldType"
        label="Пароль"
        placeholder="Введите пароль"
        success-message="Сложный и безопасный!"
      />
      <em class="toggle-password fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></em>

      <span v-if="isNotActive" class="login__wrong">Перейдите по ссылке в письме, чтобы активировать аккаунт</span>
      <span v-else-if="isWrong" class="login__wrong"
        >Не правильное имя пользователя или пароль! Попробуйте ещё раз!</span
      >
      <button v-if="!isLoading" class="submit-btn" type="submit">Подтвердить</button>
      <button v-if="isLoading" class="btn submit-btn" type="submit" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Загружается...
      </button>

      <router-link :to="{ name: 'Register' }" class="text-decoration-none">
        <button v-if="!isLoading" class="register-btn d-flex" type="button">Зарегистрироваться</button>
      </router-link>
    </Form>
  </div>
</template>

<script lang="ts">
import { Form } from "vee-validate";
import * as Yup from "yup";
import TextInput from "@/components/TextInput.vue";
import { computed, defineComponent, ref } from "vue";
import { mapActions, mapState, useStore } from "vuex";
import { UserLoginData } from "@/types/interfaces";
import state from "@/store/state";

export default defineComponent({
  name: "Login",
  components: {
    TextInput,
    Form,
  },
  setup() {
    const store = useStore();
    function onInvalidSubmit() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submitBtn: any = document.querySelector(".submit-btn");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    }

    const onChange = () => {
      store.state.isLoading = false;
    };

    // Using yup to generate a validation schema
    // https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).max(20).required(),
    });

    const hidePassword = ref(true);
    const passwordFieldIcon = computed(() => (hidePassword.value ? "fa-eye" : "fa-eye-slash"));
    const passwordFieldType = computed(() => (hidePassword.value ? "password" : "text"));

    return {
      schema,
      onInvalidSubmit,
      onChange,
      passwordFieldIcon,
      passwordFieldType,
      hidePassword,
    };
  },

  data() {
    return {
      userData: { email: null, password: null },
      isWrong: false,
      isNotActive: false,
      email: state.isRegistered ? state.user.email : "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["login"]),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleLogin(values: Record<string, any>) {
      if (values.email !== "" && values.password !== "") {
        const userData: UserLoginData = {
          email: values.email,
          password: values.password,
        };
        try {
          await this.login(userData);
          this.isWrong = false;
          setTimeout(() => {
            this.redirectToUserPage();
          }, 500);
        } catch (error) {
          if (
            (error as Error).message.match("Подтвердите регистрацию перейдя по ссылке в письме!") ||
            (error as Error).message.match("Invalid token specified")
          ) {
            this.isNotActive = true;
          } else this.isWrong = true;
        }
      }
    },

    redirectToUserPage() {
      if (state.currentUser.studentAccess === true) {
        this.$router.push({ path: `/student/${state.currentUser.id}` });
      }
      if (state.currentUser.teacherAccess === true) {
        this.$router.push("/teacher");
      }
      if (state.currentUser.adminAccess === true) {
        this.$router.push("/admin");
      }
    },
  },
  computed: {
    ...mapState(["isLoading", "isRegistered", "currentUser"]),
  },
  mounted() {
    this.redirectToUserPage();
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

.submit-btn,
.register-btn {
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
}
.submit-btn {
  letter-spacing: 0.5em;
  width: -webkit-fill-available;
}
.register-btn {
  letter-spacing: 0.2em;
  width: -webkit-fill-available;
}

.submit-btn.invalid {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}
.login__wrong {
  color: var(--error-color);
  font-size: 15px;
  font-family: Noto Sans, Arial, sans-serif;
  font-weight: bold;
  margin-bottom: 10px;
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

.submit-btn:hover,
.register-btn:hover {
  transform: scale(1.1);
}

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
