<template>
  <div class="container-sm d-flex flex-column mt-5">
    <CkEditor v-model="editorData" />
    <form class="row g-3" @submit.prevent="handleAudio">
      <div class="col-auto">
        <div class="input-group">
          <label for="inputGroupFile" class="form-label"
            ><em class="bi bi-file-earmark-music inputfile-icon">
              <span class="inputfile-description">{{ this.fileNameAndSize }}</span>
            </em>
            <p class="inputfile-alert" v-if="errorAlert !== ''">{{ this.errorAlert }}</p></label
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
    <b-button v-if="!isLoading" class="input-form--submit-button mb-3 mt-1" @click="handleCKeditor" type="submit" pill
      >Отправить</b-button
    >
    <button v-if="isLoading" class="btn input-form__submit-button__spinner submit-btn" type="submit" disabled>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Загружается...
    </button>
  </div>
  <GroupMessages @updateMessage="handleUpdateMessage" />
</template>

<script>
import state from "@/store/state";
import UploadAdapter from "@/utils/uploadAdapter";
import { defineComponent, ref } from "vue";
import { mapActions, mapState } from "vuex";
import CkEditor from "@/components/CkEditorCustom.vue";
import GroupMessages from "@/views/TeacherBoard/GroupMessages.vue";

export default defineComponent({
  name: "GroupInputMessage",
  components: {
    CkEditor,
    GroupMessages,
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
      audio: [],
      fileNameAndSize: "",
      errorAlert: "",
      homeworkTimeCreated: "",
    };
  },
  methods: {
    ...mapActions(["updateGroup", "uploadAudio"]),
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
      this.errorAlert = "";
      if (this.editorData !== "") {
        const data = this.getTitleAndBody();
        const groupToUpdate = {
          homeworkToDo: [
            ...state.currentGroup.homeworkToDo.filter((homework) => homework.time !== this.homeworkTimeCreated),
            { title: data.title, message: data.body, time: new Date(), audios: this.audio },
          ],
          id: state.currentGroup.id,
        };
        await this.updateGroup(groupToUpdate);
        setTimeout(() => {
          this.iframelyOembedConvert();
        }, 900);
      }
      this.fileNameAndSize = "";
      this.errorAlert = "";
      this.editorData = "";
    },

    async chooseFile() {
      this.audio = [];
      this.errorAlert = "";
      const input = this.$refs?.fileInput;
      const file = input?.files;
      const extensionLists = {};
      extensionLists.audio = ["mp3", "ogg", "wav"];
      const isValidFileType = (fName, fType) =>
        extensionLists[fType].indexOf(fName.split(".").pop().toLowerCase()) > -1;
      if (!isValidFileType(file[0].name, "audio")) {
        this.errorAlert = "Выберите файл формата mp3, ogg, wav";
      } else if (file && file[0]) {
        this.errorAlert = "";
        const uploadAudio = await this.uploadAudio(file);
        this.audio = uploadAudio.data;
      }
    },

    handleUpdateMessage(homeworkToDo) {
      this.editorData = homeworkToDo.title + homeworkToDo.message;
      this.isEdited = true;
      this.audio = homeworkToDo.audios;
      this.homeworkTimeCreated = homeworkToDo.time;
      this.fileNameAndSize = this.audio[0] ? this.audio[0].split("/").filter(Boolean).pop() : "";
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

    this.$refs.fileInput.addEventListener("change", (e) => {
      const [file] = e.target.files;
      const { name: fileName, size } = file;
      const fileSize = (size / 1000).toFixed(2);
      if (fileSize >= 32000) {
        this.errorAlert = "Максимальный размер файла 32 мб!";
      }
      this.fileNameAndSize = `${fileName} - ${fileSize}KB`;
    });
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