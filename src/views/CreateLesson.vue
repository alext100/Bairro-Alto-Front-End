<template>
  <SidebarMenu :profileName="profileName" :isExitButton="true" />
  <div class="container-sm d-flex flex-column mt-5">
    <CkEditor v-model="editorData" />
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
        <b-form-radio-group
          buttons
          button-variant="outline-secondary"
          size="md"
          class="pt-3 flex-wrap justify-content-around"
          v-model="mixedGroupedSelected"
          :options="mixedGroupedOptions"
          :aria-describedby="ariaDescribedby"
        ></b-form-radio-group>
        <p v-if="noType" class="no-error-type-alert m-1">Выберите уровень урока</p>
      </b-form-group>
    </b-card>
    <b-button
      v-if="!isLoading"
      class="input-form--submit-button mb-3 mt-1"
      @click="handleCKeditor"
      type="submit"
      pill
      >{{ !isEdited || editorData === "" ? "Отправить" : "Отредактировать" }}</b-button
    >
    <button v-if="isLoading" class="btn input-form--submit-button submit-btn" type="submit" disabled>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Загружается...
    </button>
    <Lessons @update-lesson="handleUpdate" />
  </div>
</template>

<script>
import UploadAdapter from "@/utils/uploadAdapter";
import { defineComponent, ref } from "vue";
import { mapActions, mapState } from "vuex";
import CkEditor from "@/components/CkEditorCustom.vue";
import state from "@/store/state";
import SidebarMenu from "@/components/SidebarMenu.vue";
import Lessons from "./Lessons.vue";

export default defineComponent({
  name: "GroupInputMessage",
  components: {
    CkEditor,
    SidebarMenu,
    Lessons,
  },

  setup() {
    const editorData = ref("");
    const mixedGroupedSelected = ref();
    const mixedGroupedOptions = [
      { text: "A1", value: "A1" },
      { text: "A2", value: "A2" },
      { text: "B1", value: "B1" },
      { text: "B2", value: "B2" },
    ];
    return {
      editorData,
      mixedGroupedSelected,
      mixedGroupedOptions,
    };
  },

  data() {
    return {
      realTimeData: {
        customers: 3,
      },
      noType: false,
      editor: CkEditor,
      profileName: state.currentUser.firstName,
      data: {
        editorData: null,
      },
      isEdited: false,
      lessonId: "",
    };
  },
  methods: {
    ...mapActions(["createLesson", "updateLessonById"]),
    ...mapState(["currentUser"]),
    onReady(editor) {
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    },

    iframelyOembedConvert() {
      document.querySelectorAll("oembed[url]").forEach((element) => {
        // eslint-disable-next-line no-undef
        iframely.load(element, element.attributes.url.value);
      });
    },

    getTitleAndBody() {
      const data = {
        title: "",
        body: "",
      };
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.editorData, "text/html");
      const title = doc.getElementsByTagName("h1")[0];
      data.title = title.innerText;
      doc.body.removeChild(title);
      data.body = doc.body.innerHTML;
      return data;
    },

    async handleCKeditor() {
      this.noType = true;
      const data = this.getTitleAndBody();

      if (this.isEdited || this.editorData !== "") {
        const lesson = {
          title: data.title,
          body: data.body,
          author: state.currentUser.id,
          level: this.mixedGroupedSelected,
          date: new Date(),
        };
        const { lessonId } = this;

        await this.updateLessonById({ lessonId, lesson });
        this.noType = false;
        this.editorData = "";
        setTimeout(() => {
          this.iframelyOembedConvert();
        }, 1100);
      } else if (this.editorData !== "" && this.mixedGroupedSelected !== undefined) {
        const lesson = {
          title: data.title,
          body: data.body,
          author: state.currentUser.id,
          level: this.mixedGroupedSelected,
          date: new Date(),
        };

        await this.createLesson(lesson);
        this.noType = false;
        this.editorData = "";
        setTimeout(() => {
          this.iframelyOembedConvert();
        }, 1100);
      }
      if (this.mixedGroupedSelected === undefined) {
        this.noType = true;
      }
    },

    async uploader(editor) {
      // eslint-disable-next-line no-param-reassign
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new UploadAdapter(loader);
    },

    handleUpdate(lesson) {
      this.editorData = lesson.title + lesson.body;
      this.isEdited = true;
      this.lessonId = lesson.id;
    },
  },
  computed: {
    ...mapState(["isLoading"]),
  },

  mounted() {
    setTimeout(() => {
      this.iframelyOembedConvert();
    }, 1000);
  },
});
</script>

<style>
button.input-form--submit-button {
  width: 150px;
  background-color: #fd8904;
  color: white;
}
</style>
