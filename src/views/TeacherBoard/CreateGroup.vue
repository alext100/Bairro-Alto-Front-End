<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="container">
    <div class="container-sm d-flex flex-column mt-5">
      <Form
        @submit="handleCreateGroup"
        @invalid-submit="onInvalidSubmit"
        @change="onChange"
        :validation-schema="schema"
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
        <SubmitButton ref="submitButtonRef" v-if="!isLoading" class="create-group__submit-btn" buttonType="submit">
          Подтвердить
        </SubmitButton>
        <SubmitButton v-if="isLoading" :buttonDisabled="true">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Загружается...
        </SubmitButton>
      </Form>
      <p v-if="!!alertMessage">{{ alertMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import SidebarMenu from "@/components/SidebarMenu.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import TextInput from "@/components/TextInput.vue";
import sidebarTeacherMenuItems from "@/views/TeacherBoard/sideBarTeacherMenuItems";
import { Form, FormActions } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import * as Yup from "yup";

export default defineComponent({
  name: "CreateGroup",
  components: { SidebarMenu, TextInput, Form, SubmitButton },
  setup() {
    const { state, dispatch } = useStore();
    const isLoading = computed(() => state.isLoading);
    const alertMessage = ref("");
    const submitButtonRef = ref<HTMLElement | null>(null);

    const onInvalidSubmit = () => {
      if (!submitButtonRef.value) return;
      submitButtonRef.value.classList.add("invalid");
      setTimeout(() => {
        if (!submitButtonRef.value) return;
        submitButtonRef.value.classList.remove("invalid");
      }, 1000);
    };

    const onChange = () => {
      state.isLoading = false;
    };

    const schema = Yup.object().shape({
      name: Yup.string().min(6).max(70).required(),
    });

    const handleCreateGroup = async (
      values: Record<string, unknown>,
      actions: FormActions<Record<string, unknown>>
    ) => {
      const groupData = { groupName: values.name };
      try {
        await dispatch("createGroup", groupData);
        alertMessage.value = `Группа ${values.name} создана`;
        actions.resetForm();
      } catch (error) {
        alertMessage.value = "Произошла ошибка при создании группы, возможно группа с таким названием уже существует";
        actions.setFieldError("name", "Произошла ошибка при создании группы");
      }
    };

    return {
      schema,
      onChange,
      isLoading,
      alertMessage,
      groupName: "",
      onInvalidSubmit,
      handleCreateGroup,
      isHiddenFormToCreate: true,
      formValues: { groupName: "" },
      menuItems: sidebarTeacherMenuItems(),
      profileName: state.currentUser.firstName,
    };
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
</style>
