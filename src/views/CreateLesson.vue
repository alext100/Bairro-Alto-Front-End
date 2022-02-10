<template>
  <SidebarMenu :profileName="profileName" :isExitButton="true" />
  <div class="container-sm d-flex flex-column mt-5">
    <CkEditor v-model="editorData" />
    <form class="row g-3" @submit.prevent="handleAudio">
      <div class="col-auto">
        <div class="input-group">
          <label for="inputGroupFile" class="form-label"
            ><em class="bi bi-file-earmark-music inputfile-icon">
              <span class="inputfile-description">{{ this.fileNameAndSize }}</span>
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
    <button v-if="isLoading" class="btn input-form__submit-button__spinner submit-btn" type="submit" disabled>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Загружается...
    </button>
    <Lessons @update-lesson="handleUpdate" />
  </div>
</template>

<script>
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
      audio: [],
      lessonAudios: [],
      fileNameAndSize: "",
      errorAlert: "",
    };
  },
  methods: {
    ...mapActions(["createLesson", "updateLessonById", "uploadAudio"]),
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

      if (this.isEdited && this.editorData !== "") {
        const data = this.getTitleAndBody();
        const lesson = {
          title: data.title,
          body: data.body,
          author: state.currentUser.id,
          level: this.mixedGroupedSelected,
          date: new Date(),
          audios: this.audio.data === undefined ? undefined : [...this.lessonAudios, this.audio.data[0]],
        };

        const { lessonId } = this;

        await this.updateLessonById({ lessonId, lesson });
        this.noType = false;
        this.editorData = "";
        this.isEdited = false;
        setTimeout(() => {
          this.iframelyOembedConvert();
        }, 1100);
      } else if (this.editorData !== "" && this.mixedGroupedSelected !== undefined) {
        this.errorAlert = "";
        const data = this.getTitleAndBody();
        const lesson = {
          title: data.title,
          body: data.body,
          author: state.currentUser.id,
          level: this.mixedGroupedSelected,
          date: new Date(),
          audios: this.audio.data === undefined ? undefined : [...this.lessonAudios, this.audio.data[0]],
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
      this.audio = [];
      this.fileNameAndSize = "";
      this.errorAlert = "";
    },

    handleUpdate(lesson) {
      this.editorData = lesson.title + lesson.body;
      this.isEdited = true;
      this.lessonId = lesson.id;
      this.lessonAudios = lesson.audios;
      // eslint-disable-next-line prefer-destructuring
      this.fileNameAndSize = this.lessonAudios[0].split("/").filter(Boolean).pop();
    },

    async chooseFile() {
      this.audio = [];
      this.errorAlert = "";
      const input = this.$refs?.fileInput;
      const file = input?.files;

      const extensionLists = {};
      extensionLists.audio = ["mp3", "ogg", "wav"];
      const isValidFileType = (fName, fType) => extensionLists[fType].indexOf(fName.split(".").pop()) > -1;

      if (!isValidFileType(file[0].name, "audio")) {
        this.errorAlert = "Выберите файл формата mp3, ogg, wav";
      } else if (file && file[0]) {
        this.errorAlert = "";
        this.audio = await this.uploadAudio(file);
      }
    },
  },
  computed: {
    ...mapState(["isLoading"]),
  },

  mounted() {
    setTimeout(() => {
      this.iframelyOembedConvert();
    }, 1000);

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

<style>
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
  font-size: 2em;
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
