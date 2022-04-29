<template>
  <div class="container-sm d-flex flex-column mt-5">
    <CkEditor v-model="editorData" />
    <form class="row g-3" @submit.prevent="handleAudio">
      <div class="col-auto">
        <div class="input-group">
          <label
            v-tippy="'Прикрепить аудио файл формата mp3, ogg, wav до 33 мб'"
            for="inputGroupFile"
            class="form-label"
          >
            <em class="bi bi-file-earmark-music inputfile-icon">
              <span class="inputfile-description">{{ this.fileNameAndSize }}</span>
            </em>
            <p class="inputfile-alert" v-if="errorAlert !== ''">{{ this.errorAlert }}</p>
          </label>
          <input
            @input="chooseFile"
            @change="onChange"
            data-input="false"
            iconName="bi bi-file-earmark-music"
            type="file"
            ref="fileInput"
            class="form-control inputfile"
            id="inputGroupFile"
            aria-describedby="inputGroupFileAddon"
            aria-label="Upload"
          />
        </div>
      </div>
    </form>
    <SubmitButton
      v-if="!isLoading"
      class="input-form__submit-button mb-3 mt-1"
      buttonType="submit"
      @click="handleCKeditor"
    >
      Сохранить
    </SubmitButton>
    <SubmitButton v-if="isLoading" class="btn input-form__submit-button__spinner" :buttonDisabled="true">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Загружается...
    </SubmitButton>
  </div>
  <GroupMessages @updateMessage="handleUpdateMessage" />
</template>

<script>
import state from "@/store/state";
import { mapActions, mapState } from "vuex";
import UploadAdapter from "@/utils/uploadAdapter";
import { defineComponent, onMounted, ref } from "vue";
import getTitleAndBody from "@/utils/getTitleAndBody";
import CkEditor from "@/components/CkEditorCustom.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import GroupMessages from "@/views/TeacherBoard/GroupMessages.vue";

export default defineComponent({
  name: "GroupInputMessage",
  components: { CkEditor, GroupMessages, SubmitButton },

  setup() {
    const editorData = ref("");
    onMounted(() => {
      document.body.style.backgroundColor = "white";
    });
    const onChange = () => {
      state.isLoading = false;
    };
    return {
      onChange,
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

    async handleCKeditor() {
      this.errorAlert = "";
      if (this.editorData !== "") {
        const data = getTitleAndBody(this.editorData);
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

<style lang="scss" scoped>
.input-form__submit-button {
  width: 300px;
  &__spinner {
    width: 300px !important;
  }
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
  &:hover {
    color: blue;
  }
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
</style>
