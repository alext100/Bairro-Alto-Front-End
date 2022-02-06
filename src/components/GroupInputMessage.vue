<template>
  <div class="container-sm d-flex flex-column mt-5">
    <CkEditor v-model="editorData" />
    <b-button v-if="!isLoading" class="input-form--submit-button mb-3 mt-1" @click="handleCKeditor" type="submit" pill
      >Отправить</b-button
    >
    <button v-if="isLoading" class="btn input-form--submit-button submit-btn" type="submit" disabled>
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

    async handleCKeditor() {
      const groupToUpdate = {
        homeworkToDo: [...state.currentGroup.homeworkToDo, { message: this.editorData, time: new Date() }],
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
