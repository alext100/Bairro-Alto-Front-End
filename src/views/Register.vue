<template>
  <div>
    <Form @submit="handleCreate" :validation-schema="schema" @invalid-submit="onInvalidSubmit" class="shadow-lg">
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
      <TextInput
        :value="email"
        name="email"
        type="email"
        label="E-mail"
        placeholder="Ваш email адрес"
        success-message="Готово, мы не будем спамить!"
      />
      <span v-if="isWrongEmailOnRegister()" class="email__wrong"
        >Кажется этот email уже зарегистрирован! Попробуйте ещё раз!</span
      >
      <TextInput
        :value="password"
        name="password"
        type="password"
        label="Пароль"
        placeholder="Ваш пароль"
        success-message="Сложный и безопасный!"
      />
      <TextInput
        :value="confirm_password"
        name="confirm_password"
        type="password"
        label="Подтвердите пароль"
        placeholder="Введите пароль ещё раз"
        success-message="Запомните его!"
      />

      <button v-if="!isLoading" class="submit-btn" type="submit">Подтвердить</button>
      <button v-if="isLoading" class="btn btn-primary submit-btn" type="submit" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Загружается...
      </button>
    </Form>
  </div>
</template>

<script lang="ts">
import { Form } from "vee-validate";
import * as Yup from "yup";
import TextInput from "@/components/TextInput.vue";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import { UserRegisterData } from "@/types/interfaces";
import state from "@/store/state";

export default defineComponent({
  name: "Register",
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
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).max(20).required(),
      confirm_password: Yup.string()
        .required()
        .oneOf([Yup.ref("password")], "Пароль не совпадает"),
    });

    return {
      schema,
      onInvalidSubmit,
    };
  },

  data() {
    return {
      userData: { password: null, firstName: null, lastName: null, email: null, image: null },
      isWrong: false,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      image: "",
      confirm_password: "",
    };
  },

  methods: {
    ...mapActions(["registerUser"]),
    ...mapState(["isRegistered", "isWrongEmailOnRegister"]),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleCreate({ password, firstName, lastName, email, image }: Record<string, any>) {
      if (email !== "" && password !== "") {
        const userData: UserRegisterData = {
          password,
          firstName,
          lastName,
          email,
          image:
            image === ""
              ? "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
              : image,
        };

        try {
          await this.registerUser(userData);
          if (state.isRegistered === true) {
            this.$router.push("/login");
          }
          this.password = "";
          this.firstName = "";
          this.lastName = "";
          this.email = "";
          this.image = "";
          this.isWrong = false;
        } catch (error) {
          this.isWrong = true;
        }
      }
    },
  },

  computed: {
    ...mapState(["isLoading"]),
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
</style>
