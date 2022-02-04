<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" @click="handleLogout" :isExitButton="true" />
  <div class="container">
    <div class="container-sm login-form d-flex flex-column mt-5">
      <Form
        @submit="handleCreateGroup"
        :validation-schema="schema"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ isSubmitting }"
        :initial-values="formValues"
      >
        <TextInput
          :value="groupName"
          name="name"
          type="text"
          label="Название группы"
          placeholder="Введите название группы (до 70 символов)"
          success-message="Ok!"
        />

        <button :disabled="isSubmitting" :class="{ submitting: isSubmitting }" class="submit-btn" type="submit">
          Подтвердить
        </button>
      </Form>
      <p v-if="isError">Произошла ошибка при создании группы, возможно группа с таким названием уже существует</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import state from "@/store/state";
import { mapActions, mapState } from "vuex";
import { Form } from "vee-validate";
import * as Yup from "yup";
import TextInput from "@/components/TextInput.vue";

export default defineComponent({
  name: "CreateGroup",
  components: { SidebarMenu, TextInput, Form },
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
      name: Yup.string().min(6).max(70).required(),
    });

    return {
      schema,
      onInvalidSubmit,
    };
  },

  data() {
    return {
      formValues: {
        groupName: "",
      },
      groupName: "",
      isError: false,
      isHiddenFormToCreate: true,
      profileName: state.currentUser.firstName,
      menuItems: [
        {
          link: `/teacher`,
          name: "Мои группы",
          icon: "bx-grid-alt",
        },
        {
          link: `/create-group`,
          name: "Создать группу",
          icon: "bx-add-to-queue",
        },
        {
          link: `/teacher`,
          name: "Messages",
          icon: "bx-chat",
        },
        {
          link: `/teacher`,
          name: "Settings",
          icon: "bx-cog",
        },
      ],
    };
  },

  methods: {
    ...mapActions(["deleteDataFromLocalStorage", "createGroup"]),
    handleLogout(event: Event) {
      if ((event.target as HTMLInputElement).classList.contains("profile__log_out")) {
        this.deleteDataFromLocalStorage();
        this.$router.push("/");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleCreateGroup(values: Record<string, any>, actions: any) {
      const groupData = {
        groupName: values.name,
      };
      try {
        await this.createGroup(groupData);
        actions.setFieldValue("name", `Группа ${values.name} создана`);
        this.isError = false;
      } catch (error) {
        this.isError = true;
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
  min-width: 300px;
  width: 500px;
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

button.submitting::after {
  content: "";
  position: absolute;
  width: 1rem;
  height: 1rem;
  top: calc(50% - 0.5rem);
  left: 1.5rem;
  border-radius: 2em;
  border-color: transparent transparent black black;
  border-style: solid;
  border-width: 0.15em;
  animation: spinner-rotation 0.75s infinite;
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes spinner-rotation {
  to {
    transform: rotate(360deg);
  }
}
</style>
