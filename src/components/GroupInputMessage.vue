<template>
  <div class="container-sm d-flex flex-column mt-5">
    <CkEditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onReady" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CkEditor from "./CkEditorCustom.vue";

export default defineComponent({
  props: ["editorConfig"],

  name: "GroupInputMessage",
  components: {
    CkEditor,
  },

  data() {
    return {
      editor: CkEditor,
      editorData: "",
    };
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onReady(editor: any) {
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    },
  },
});
</script>
