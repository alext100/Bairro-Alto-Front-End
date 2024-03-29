<template>
  <div class="container">
    <Form @submit="handlePayment" :validation-schema="schema" @invalid-submit="onInvalidSubmit" data-test="payment">
      <n-h2 align-text class="mt-3 mb-4">Оплатить занятия можно здесь:</n-h2>
      <TextInput
        :value="firstName"
        name="firstName"
        type="text"
        label="Имя"
        placeholder="Ваше имя"
        success-message="Готово"
      />
      <TextInput
        :value="lastName"
        name="lastName"
        type="text"
        label="Фамилия"
        placeholder="Ваша фамилия"
        success-message="Готово"
      />
      <TextInput
        :value="email"
        name="email"
        type="email"
        label="E-mail"
        placeholder="Ваш email адрес"
        success-message="Готово"
      />
      <TextInput
        :value="price"
        name="price"
        type="number"
        step="100"
        label="Сумма"
        placeholder="Сумма к оплате"
        success-message="Готово"
      />
      <TextInput
        :value="courseName"
        name="courseName"
        type="text"
        label="Название курса"
        placeholder="Название курса"
        success-message="Готово"
      />
      <b-form-group
        label-class="fw-bold pt-0 col-sm-12"
        class="text-wrap"
        label-size="lg"
        label=""
        label-cols-sm="3"
        label-align-sm="start"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-checkbox-group
          v-model="mixedGroupedSelected"
          :options="mixedGroupedOptions"
          html-field="name"
          :state="contextualState"
          value-field="value"
          class="pt-3 flex-wrap justify-content-around"
          size="lg"
          stacked
          :autofocus="true"
          :aria-describedby="ariaDescribedby"
        ></b-form-checkbox-group>
        <p v-if="!isChecked" class="isCheckedErrorMessage">
          Ознакомьтесь c политикой обработки ПД и договором оферты и поставьте отметку об ознакомлении
        </p>
      </b-form-group>
      <button class="submit-btn" type="submit">Оплатить</button>
    </Form>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import * as Yup from "yup";
import { NH2 } from "naive-ui";
import { useStore } from "vuex";
import { Form } from "vee-validate";
import { useHead } from "@vueuse/head";
import Footer from "@/components/Footer.vue";
import TextInput from "@/components/TextInput.vue";
import { UserPaymentData } from "@/types/interfaces";
import { computed, ComputedRef, reactive, ref } from "vue";

const siteData = reactive({
  title: `Оплата обучения`,
  description: `Школа португальского языка в Санкт-Петербурге Байрру Алту, Bairro Alto`,
});
useHead({
  title: computed(() => siteData.title),
  meta: [
    {
      name: `description`,
      content: computed(() => siteData.description),
    },
  ],
});

const { dispatch } = useStore();

const mixedGroupedSelected = ref([]);
const mixedGroupedOptions = [
  {
    name: `Нажимая на кнопку вы подтверждаете согласие с
        <a onMouseOver=this.style.color='#8b5c29' onMouseOut=this.style.color='#d59758' style='text-decoration: none; color: #d59758;'
        href='/policy.pdf'>политикой обработки персональных данных</a>`,
    value: "PersonalData",
  },
  {
    name: `Нажимая на кнопку вы подтверждаете согласие с
        <a onMouseOver=this.style.color='#8b5c29' onMouseOut=this.style.color='#d59758' style='text-decoration: none; color: #d59758;'
        href='/offer.pdf'>договором оферты</a>`,
    value: "Oferta",
  },
];
const isChecked = ref(true);
const email = "";
const courseName = "";
const firstName = "";
const lastName = "";
const price = "";

const contextualState: ComputedRef<boolean | null> = computed(() => {
  if (mixedGroupedSelected.value.length === 2) {
    return true;
  }
  if (mixedGroupedSelected.value.length === 1) {
    return false;
  }
  return null;
});

const onInvalidSubmit = (): void => {
  const submitBtn: HTMLElement = document.querySelector(".submit-btn") as HTMLElement;
  submitBtn.classList.add("invalid");
  setTimeout(() => {
    submitBtn.classList.remove("invalid");
  }, 1000);
};

const schema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  price: Yup.number().min(100).max(50000).required(),
  courseName: Yup.string().required(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlePayment = async (values: Record<string, any>): Promise<void> => {
  if (mixedGroupedSelected.value.length !== 2) {
    isChecked.value = false;
  } else isChecked.value = true;

  if (
    values.email !== "" &&
    values.courseName !== "" &&
    values.firstName !== "" &&
    values.lastName !== "" &&
    values.price !== ""
  ) {
    const userData: UserPaymentData = {
      courseName: values.courseName,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      price: values.price,
      date: Date.now(),
    };

    try {
      if (isChecked.value) {
        await dispatch("payment", userData);
      }
    } catch (error) {
      isChecked.value = false;
    }
  }
};
</script>

<style scoped>
form {
  width: 1000px;
  margin: 0px auto;
  padding: 15px 20px 30px;
  border-style: none;
}
.textInput {
  max-width: 600px;
  min-width: 350px;
}

.submit-btn {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.5em;
  text-decoration: none;
  padding: 1rem 1.6rem 1rem 2.5rem;
  color: var(--hover-color);
  border: 1px solid var(--hover-color);
  border-radius: 1.2rem;
  -webkit-transition: border-color 0.2s;
  cursor: pointer;
  transition: border-color 0.2s;
  line-height: normal;
  background: transparent;
  margin-top: 10px;
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
.isCheckedErrorMessage {
  color: var(--error-color);
}

@media (max-width: 899px) {
  form {
    width: 800px;
  }
}
@media (max-width: 799px) {
  form {
    width: 700px;
  }
}
@media (max-width: 699px) {
  form {
    width: 600px;
  }
}
@media (max-width: 599px) {
  form {
    width: 500px;
    padding: 10px;
  }
  .textInput {
    max-width: 500px;
  }
  .container {
    padding: 5px;
  }
}
@media (max-width: 499px) {
  form {
    width: 450px;
    padding: 10px;
  }
  .textInput {
    max-width: 400px;
  }
  .container {
    padding: 0;
  }
}
@media (max-width: 399px) {
  form {
    width: 390px;
  }
  .textInput {
    max-width: 380px;
  }
}
</style>
