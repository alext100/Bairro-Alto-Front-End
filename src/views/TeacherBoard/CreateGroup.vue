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
        <SubmitButton v-if="!isLoading" class="create-group__submit-btn" buttonType="submit">
          Подтвердить
        </SubmitButton>
        <SubmitButton v-if="isLoading" :buttonDisabled="true">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Загружается...
        </SubmitButton>
      </Form>
      <p v-if="isError">Произошла ошибка при создании группы, возможно группа с таким названием уже существует</p>
    </div>
  </div>
</template>

<script lang="ts">
import * as Yup from "yup";
import { useStore } from "vuex";
import { Form } from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import { computed, defineComponent, ref } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import sidebarTeacherMenuItems from "@/views/TeacherBoard/sideBarTeacherMenuItems";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: "CreateGroup",
  components: { SidebarMenu, TextInput, Form, SubmitButton },
  setup() {
    const { state, dispatch } = useStore();
    const isLoading = computed(() => state.isLoading);
    const isError = ref(false);

    const onInvalidSubmit = () => {
      const submitBtn = document.querySelector(".create-group__submit-btn");
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

    const schema = Yup.object().shape({
      name: Yup.string().min(6).max(70).required(),
    });

    const handleCreateGroup = async (values: Record<string, any>, actions: any) => {
      const groupData = { groupName: values.name };
      try {
        await dispatch("createGroup", groupData);
        actions.setFieldValue("name", `Группа ${values.name} создана`);
        isError.value = false;
      } catch (error) {
        isError.value = true;
      }
    };

    return {
      schema,
      isError,
      onChange,
      isLoading,
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
