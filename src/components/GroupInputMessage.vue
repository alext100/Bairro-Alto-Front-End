<template>
  <div class="container-sm d-flex flex-column mt-5">
    <CkEditor v-model="editorData" />
    <b-button v-if="!isLoading" class="input-form--submit-button mb-3 mt-1" @click="handleCKeditor" type="submit" pill
      >Отправить</b-button
    >
    <button v-if="isLoading" class="btn input-form__submit-button__spinner submit-btn" type="submit" disabled>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Загружается...
    </button>
  </div>
</template>

<script>
import state from "@/store/state";
import UploadAdapter from "@/utils/uploadAdapter";
import { defineComponent, ref } from "vue";
import { mapActions, mapState } from "vuex";
import CkEditor from "./CkEditorCustom.vue";

export default defineComponent({
  name: "GroupInputMessage",
  components: {
    CkEditor,
  },

  setup() {
    const editorData = ref("");
    return {
      editorData,
    };
  },

  data() {
    return {
      editor: CkEditor,
      data: {
        editorData: null,
      },
    };
  },
  methods: {
    ...mapActions(["updateGroup"]),
    ...mapState(["currentGroup"]),
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
      const data = this.getTitleAndBody();
      const groupToUpdate = {
        homeworkToDo: [...state.currentGroup.homeworkToDo, { title: data.title, message: data.body, time: new Date() }],
        id: state.currentGroup.id,
      };
      if (this.editorData !== "") {
        await this.updateGroup(groupToUpdate);
        setTimeout(() => {
          this.iframelyOembedConvert();
        }, 900);
      }
      this.editorData = "";
    },

    async uploader(editor) {
      // eslint-disable-next-line no-param-reassign
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new UploadAdapter(loader);
    },
  },
  computed: {
    ...mapState(["isLoading"]),
  },

  mounted() {
    setTimeout(() => {
      this.iframelyOembedConvert();
    }, 900);
  },
});
</script>

<style scoped>
button.input-form__submit-button__spinner {
  width: 200px;
  background-color: #fd8904;
  color: white;
  border-radius: 24px;
  border-color: black;
  font-weight: bold;
}
</style>
