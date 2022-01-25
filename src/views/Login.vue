<template>
  <div>
    <Form @submit="handleLogin" :validation-schema="schema" @invalid-submit="onInvalidSubmit">
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
        type="password"
        label="Пароль"
        placeholder="Введите пароль"
        success-message="Сложный и безопасный!"
      />
      <span v-if="isWrong" class="login__wrong">Не правильное имя пользователя или пароль! Попробуйте ещё раз!</span>
      <button class="submit-btn" type="submit">Подтвердить</button>

      <router-link :to="{ name: 'Register' }">
        <button class="register-btn" type="button">Зарегистрироваться</button>
      </router-link>
    </Form>
  </div>
</template>

<script lang="ts">
import { Form } from "vee-validate";
import * as Yup from "yup";
import TextInput from "@/components/TextInput.vue";
import { defineComponent } from "vue";
/* import state from "@/store/state"; */
import { mapActions, mapState } from "vuex";
import { UserLoginData } from "@/types/interfaces";
import state from "@/store/state";

export default defineComponent({
  name: "Login",
  components: {
    TextInput,
    Form,
  },
  setup() {
    function onInvalidSubmit() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submitBtn: any = document.querySelector(".submit-btn");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    }

    // Using yup to generate a validation schema
    // https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).max(20).required(),
    });

    return {
      schema,
      onInvalidSubmit,
    };
  },

  data() {
    return {
      userData: { email: null, password: null },
      isWrong: false,
      email: state.isRegistered ? state.user.email : "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    ...mapState(["isProfessor", "isAdmin", "isStudent", "user", "isRegistered"]),

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
          /*           if (state.isStudent === true) {
            this.$router.push({ path: `/student/${state.currentUser.id}` });
          } else if (state.isProfessor === true) {
            this.$router.push("/teacher");
          } else if (state.isAdmin === true) {
            this.$router.push("/admin");
          } */
        } catch (error) {
          this.isWrong = true;
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
form {
  width: 300px;
  margin: 0px auto;
  padding-bottom: 60px;
}

.submit-btn,
.register-btn {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 100%;
  border-radius: 7px;
  margin-top: 40px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  text-decoration: none;
}

.register-btn {
  background: var(--success-color);
}

.submit-btn.invalid {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}
.login__wrong {
  color: var(--error-color);
  font-size: 15px;
  font-family: arial;
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
</style>
