<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="container-sm d-flex flex-column mt-5">
    <h1>Создать урок</h1>
    <Form
      @submit="handleCKeditor"
      v-slot="{ isSubmitting }"
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
      :initial-values="formValues"
      ref="courseNameForm"
    >
      <b-card>
        <b-form-group
          label-class="fw-bold pt-0"
          class="mb-0 text-nowrap"
          label-size="lg"
          label="Уровень:"
          label-cols-sm="2"
          label-align-sm="start"
          v-slot="{ ariaDescribedby }"
        >
          <p v-if="noType" class="no-error-type-alert m-1">Выберите уровень урока</p>
          <b-form-radio-group
            v-tippy="'Выбрать уровень урока'"
            buttons
            button-variant="outline-secondary"
            size="md"
            class="pt-3 flex-wrap justify-content-around"
            v-model="mixedGroupedSelected"
            :options="mixedGroupedOptions"
            :aria-describedby="ariaDescribedby"
          ></b-form-radio-group>
        </b-form-group>
        <label for="courses">Выберите название курса</label>
        <div class="container inputs-container">
          <vue-select
            name="courses"
            placeholder="Курсы:"
            :modelValue="selectCourseNamesOptions"
            :options="selectCourseNamesOptions"
            v-model="selectedCourse"
            close-on-select
            searchable
            clear-on-select
            clear-on-close
            search-placeholder="Поиск"
            @update:modelValue="updateModelValue"
            :empty-model-value="''"
          >
          </vue-select>

          <TextInput
            :value="courseName"
            name="name"
            type="text"
            label="Новый курс:"
            placeholder="Название курса"
            success-message="Ok!"
            class="mt-3 mb-5 course-name-field"
          />
        </div>

        <form class="row g-3" @submit.prevent="handleAudio">
          <div class="col-auto">
            <div class="input-group">
              <label v-tippy="'Аудио файл формата mp3, ogg, wav до 33 мб'" for="inputGroupFile" class="form-label">
                <em class="bi bi-file-earmark-music inputfile-icon">
                  Прикрепить аудио
                  <span class="inputfile-description">{{ fileNameAndSize }}</span>
                </em>
                <p class="inputfile-alert" v-if="errorAlert !== ''">{{ errorAlert }}</p></label
              >
              <input
                data-input="false"
                iconName="bi bi-file-earmark-music"
                type="file"
                ref="fileInput"
                @input="chooseFile"
                class="form-control inputfile"
                id="inputGroupFile"
                aria-describedby="inputGroupFileAddon"
                aria-label="Upload"
              />
            </div>
          </div>
        </form>
      </b-card>
      <CkEditor v-model="editorData" />
      <b-button
        v-if="!isLoading"
        :disabled="isSubmitting"
        :class="{ submitting: isSubmitting }"
        class="input-form--submit-button mb-3 mt-3"
        pill
        type="submit"
      >
        {{ !isEdited || editorData === "" ? "Сохранить" : "Отредактировать" }}
      </b-button>
      <button v-if="isLoading" class="btn input-form__submit-button__spinner submit-btn" type="submit" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Загружается...
      </button>
    </Form>
    <Lessons @update-lesson="handleUpdate" />
  </div>
</template>

<script>
import * as Yup from "yup";
import { useStore } from "vuex";
import { Form } from "vee-validate";
import VueSelect from "vue-next-select";
import TextInput from "@/components/TextInput.vue";
import getTitleAndBody from "@/utils/getTitleAndBody";
import CkEditor from "@/components/CkEditorCustom.vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import Lessons from "@/views/TeacherBoard/Lessons.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import sidebarTeacherMenuItems from "@/views/TeacherBoard/sideBarTeacherMenuItems";

export default defineComponent({
  name: "GroupInputMessage",
  components: {
    CkEditor,
    SidebarMenu,
    Lessons,
    VueSelect,
    TextInput,
    Form,
  },

  setup() {
    const { dispatch, state } = useStore();
    const courseNames = computed(() => state.courseNames.courseNames);
    const isLoading = computed(() => state.isLoading);
    const editorData = ref("");
    const selectedCourse = ref(null);
    const mixedGroupedSelected = ref();
    const mixedGroupedOptions = [
      { text: "A1", value: "A1" },
      { text: "A2", value: "A2" },
      { text: "B1", value: "B1" },
      { text: "B2", value: "B2" },
    ];
    let courseName = "";
    const data = { editorData: null };
    const isEdited = ref(false);
    const noType = ref(false);
    const lessonId = ref("");
    const errorAlert = ref("");
    const formValues = { courseName };
    const fileNameAndSize = ref("");
    const lessonAudios = ref([]);
    const audio = ref([]);
    const courseNameForm = ref(null);
    const fileInput = ref(null);

    const iframelyOembedConvert = () => {
      document.querySelectorAll("oembed[url]").forEach((element) => {
        // eslint-disable-next-line no-undef
        iframely.load(element, element.attributes.url.value);
      });
    };
    onMounted(() => {
      dispatch("getAllCourseNames");
      document.body.style.backgroundColor = "white";

      setTimeout(() => {
        iframelyOembedConvert();
      }, 1000);

      fileInput.value.addEventListener("change", (event) => {
        const [file] = event.target.files;
        const { name: fileName, size } = file;
        const fileSize = (size / 1000).toFixed(2);
        if (fileSize >= 32000) {
          errorAlert.value = "Максимальный размер файла 32 мб!";
        }
        fileNameAndSize.value = `${fileName} - ${fileSize}KB`;
      });
    });

    const selectCourseNamesOptions = computed(() => {
      const courses = courseNames.value.filter((course) => course.courseName).map((course) => course.courseName);
      const uniqueCourses = [...new Set(courses)];
      return uniqueCourses;
    });

    const onInvalidSubmit = () => {
      const submitBtn = document.querySelector(".input-form--submit-button");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    };

    const onReady = (editor) => {
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    };

    const updateModelValue = () => {
      courseNameForm.value.setFieldValue("name", selectedCourse.value);
    };

    const handleUpdate = (lesson) => {
      editorData.value = lesson.title + lesson.body;
      isEdited.value = true;
      lessonId.value = lesson.id;
      lessonAudios.value = lesson.audios;
      courseNameForm.value.setFieldValue("name", lesson.courseName);
      courseName = lesson.courseName;
      mixedGroupedSelected.value = lesson.level;
      if (lessonAudios.value.length !== 0) {
        // eslint-disable-next-line prefer-destructuring
        fileNameAndSize.value = lessonAudios.value[0].split("/").filter(Boolean).pop();
      }
    };

    const clearAllForms = (resetForm) => {
      noType.value = false;
      editorData.value = "";
      isEdited.value = false;
      selectedCourse.value = null;
      mixedGroupedSelected.value = null;
      resetForm();
      setTimeout(() => {
        iframelyOembedConvert();
      }, 1100);
    };

    const handleCKeditor = async (values, { resetForm }) => {
      noType.value = true;
      if (isEdited.value && editorData.value !== "") {
        const editedData = getTitleAndBody(editorData.value);
        const courseData = {
          courseName: values.name,
        };
        const lesson = {
          title: editedData.title,
          body: editedData.body,
          author: state.currentUser.id,
          level: mixedGroupedSelected.value,
          date: new Date(),
          audios: audio.value.data === undefined ? undefined : [...lessonAudios.value, audio.value.data[0]],
          courseName: courseData.courseName,
        };
        const editedLessonId = lessonId.value;
        await dispatch("updateLessonById", { lessonId: editedLessonId, lesson });
        await dispatch("getAllCourseNames");
        clearAllForms(resetForm);
      } else if (editorData.value !== "" && mixedGroupedSelected.value !== undefined) {
        errorAlert.value = "";
        const editedData = getTitleAndBody(editorData.value);
        const courseData = { courseName: values.name };
        const lesson = {
          title: editedData.title,
          body: editedData.body,
          author: state.currentUser.id,
          level: mixedGroupedSelected.value,
          date: new Date(),
          audios: audio.value.data === undefined ? undefined : [...lessonAudios.value, audio.value.data[0]],
          courseName: courseData.courseName,
        };
        await dispatch("createLesson", lesson);
        await dispatch("getAllCourseNames");
        clearAllForms(resetForm);
      }
      if (mixedGroupedSelected.value === undefined) {
        noType.value = true;
      }
      audio.value = [];
      fileNameAndSize.value = "";
      errorAlert.value = "";
    };

    const chooseFile = async () => {
      audio.value = [];
      errorAlert.value = "";
      const input = fileInput.value;
      const file = input?.files;
      const extensionLists = {};
      extensionLists.audio = ["mp3", "ogg", "wav"];
      const isValidFileType = (fName, fType) =>
        extensionLists[fType].indexOf(fName.split(".").pop().toLowerCase()) > -1;

      if (!isValidFileType(file[0].name, "audio")) {
        errorAlert.value = "Выберите файл формата mp3, ogg, wav";
      } else if (file && file[0]) {
        errorAlert.value = "";
        audio.value = await dispatch("uploadAudio", file);
      }
    };

    const schema = Yup.object().shape({
      name: Yup.string().min(6).max(80),
    });

    return {
      data,
      audio,
      noType,
      schema,
      onReady,
      isEdited,
      isLoading,
      fileInput,
      errorAlert,
      editorData,
      formValues,
      courseName,
      chooseFile,
      courseNames,
      handleUpdate,
      selectedCourse,
      handleCKeditor,
      courseNameForm,
      onInvalidSubmit,
      fileNameAndSize,
      updateModelValue,
      editor: CkEditor,
      mixedGroupedOptions,
      mixedGroupedSelected,
      iframelyOembedConvert,
      selectCourseNamesOptions,
      currentUser: state.currentUser,
      menuItems: sidebarTeacherMenuItems(),
      profileName: state.currentUser.firstName,
    };
  },
});
</script>

<style lang="scss" scoped>
button.input-form--submit-button {
  width: 150px;
  background-color: #fd8904;
  color: white;
}
button.input-form__submit-button__spinner {
  width: 200px;
  background-color: #fd8904;
  color: white;
  border-radius: 24px;
  border-color: black;
  font-weight: bold;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile-icon {
  font-size: 1.5em;
  font-weight: 700;
  display: inline-block;
  cursor: pointer;
}
.inputfile-icon:hover {
  color: blue;
}
.inputfile-description {
  font-size: 18px;
  color: chocolate;
  margin: 20px;
}
.inputfile-alert {
  font-size: 20px;
  color: var(--error-color);
}
audio {
  filter: sepia(10%) saturate(70%) grayscale(1) contrast(99%) invert(5%);
  width: 500px;
  height: 40px;
  margin-top: 5px;
  margin-bottom: 5px;
}
audio::-webkit-media-controls-mute-button {
  display: none !important;
}

audio::-webkit-media-controls-volume-slider {
  display: none !important;
}

audio::-webkit-media-controls-volume-control-container.closed {
  display: none !important;
}
audio::-webkit-media-controls-volume-control-container {
  display: none !important;
}

.course-name-field {
  max-width: 600px !important;
}
.no-error-type-alert {
  color: var(--error-color);
  font-size: larger;
  animation: fade-in 2s;
  position: absolute;
  top: 0px;
}

.vue-select {
  max-width: 600px !important;
  width: inherit !important;
  min-width: 250px;
  height: 50px !important;
  background-color: #f2f5f7;
  border-radius: 5px !important;
  border: 2px solid transparent !important;
  padding: 15px 10px !important;
  outline: none !important;
}
:deep(.vue-input input) {
  font-size: 16px !important;
  background-color: #f2f5f7;
  margin-top: -8px !important;
}

@media (max-width: 770px) {
  audio {
    width: 400px;
  }
}
@media (max-width: 500px) {
  audio {
    width: 300px;
  }
}
@media (max-width: 400px) {
  audio {
    width: 250px;
  }
}
:deep(.ck .ck-sticky-panel .ck-sticky-panel__content_sticky) {
  position: static !important;
}
:deep(.ck-editor__top) {
  position: static !important;
  overflow: hidden !important;
  display: block !important;
  height: 38.67px !important;
  .ck-sticky-panel__placeholder {
    display: none !important;
  }
}
</style>
