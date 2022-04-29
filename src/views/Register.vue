<template>
  <div>
    <Form
      @submit="handleCreate"
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
      @change="onChange"
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
      <ShowHidePassword @click="hidePassword = !hidePassword" />
      <TextInput
        :value="confirmPassword"
        name="confirmPassword"
        :type="passwordFieldType"
        label="Подтвердите пароль"
        placeholder="Введите пароль ещё раз"
        success-message="Запомните его!"
      />
      <ShowHidePassword @click="hidePassword = !hidePassword" />
      <SubmitButton v-if="!isLoading" class="register-submit-button" buttonType="submit">Подтвердить</SubmitButton>
      <SubmitButton v-if="isLoading" class="register-submit-button__disabled" :buttonDisabled="true">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Загружается...
      </SubmitButton>
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
import SubmitButton from "@/components/SubmitButton.vue";
import ShowHidePassword from "@/components/ShowHidePassword.vue";
import EmailValidationAnimation from "@/components/EmailValidationAnimation.vue";

export default defineComponent({
  name: "Register",
  components: {
    Form,
    TextInput,
    SubmitButton,
    ShowHidePassword,
    EmailValidationAnimation,
  },
  setup() {
    const { state, dispatch } = useStore();
    const router = useRouter();

    const hidePassword = ref(true);
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
      const submitBtn = document.querySelector(".register-submit-button");
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
      onChange,
      firstName,
      isLoading,
      isRegistered,
      hidePassword,
      handleCreate,
      confirmPassword,
      onInvalidSubmit,
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
.register-submit-button {
  letter-spacing: 0.3em;
  width: -webkit-fill-available;
}

.email__wrong {
  color: var(--error-color);
  font-size: 15px;
  font-family: Noto Sans, Arial, sans-serif;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
