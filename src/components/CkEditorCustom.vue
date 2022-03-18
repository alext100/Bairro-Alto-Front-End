<template>
  <div class="ckeditor-container">
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      @ready="onReady"
      @focus="isFocused = true"
    ></ckeditor>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import AutoImage from "@ckeditor/ckeditor5-image/src/autoimage";
import AutoLink from "@ckeditor/ckeditor5-link/src/autolink";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import Clipboard from "@ckeditor/ckeditor5-clipboard/src/clipboard";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code";
import DataFilter from "@ckeditor/ckeditor5-html-support/src/datafilter";
import DataSchema from "@ckeditor/ckeditor5-html-support/src/dataschema";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import FindAndReplace from "@ckeditor/ckeditor5-find-and-replace/src/findandreplace";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor";
import FontFamily from "@ckeditor/ckeditor5-font/src/fontfamily";
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize";
import GeneralHtmlSupport from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupport";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import HtmlEmbed from "@ckeditor/ckeditor5-html-embed/src/htmlembed";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageResizeEditing from "@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting";
import ImageResizeHandles from "@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import LinkImage from "@ckeditor/ckeditor5-link/src/linkimage";
import List from "@ckeditor/ckeditor5-list/src/list";
import ListProperties from "@ckeditor/ckeditor5-list/src/listproperties";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import MediaEmbedToolbar from "@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import RemoveFormat from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import SpecialCharacters from "@ckeditor/ckeditor5-special-characters/src/specialcharacters";
import SpecialCharactersArrows from "@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows";
import SpecialCharactersCurrency from "@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency";
import SpecialCharactersLatin from "@ckeditor/ckeditor5-special-characters/src/specialcharacterslatin";
import SpecialCharactersText from "@ckeditor/ckeditor5-special-characters/src/specialcharacterstext";
import StandardEditingMode from "@ckeditor/ckeditor5-restricted-editing/src/standardeditingmode";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableCellProperties from "@ckeditor/ckeditor5-table/src/tablecellproperties";
import TableProperties from "@ckeditor/ckeditor5-table/src/tableproperties";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import Title from "@ckeditor/ckeditor5-heading/src/title";
import TodoList from "@ckeditor/ckeditor5-list/src/todolist";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount";
import { computed, defineComponent, ref } from "vue";
import sanitizeHtml from "sanitize-html";
import UploadAdapter from "../utils/uploadAdapter";

export default defineComponent({
  name: "CkEditor",
  props: {
    modelValue: { type: String, default: "" },
  },
  setup(props, { emit }) {
    const editorData = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
      },
    });
    const isFocused = ref(false);

    const onReady = (editor) => {
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    };

    const uploader = (editor) => {
      // eslint-disable-next-line no-param-reassign
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new UploadAdapter(loader);
    };

    const imageConfiguration = {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          label: "Original",
        },
        {
          name: "resizeImage:40",
          value: "40",
          label: "40%",
        },
        {
          name: "resizeImage:60",
          value: "60",
          label: "60%",
        },
      ],
    };

    const editorConfig = {
      extraPlugins: [uploader],
      removePlugins: ["MediaEmbedToolbar"],

      mediaEmbed: {
        previewsInData: true,
      },

      plugins: [
        Alignment,
        AutoImage,
        AutoLink,
        BoldPlugin,
        BlockQuote,
        Clipboard,
        Code,
        DataFilter,
        DataSchema,
        EssentialsPlugin,
        FindAndReplace,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        GeneralHtmlSupport,
        Heading,
        Highlight,
        HorizontalLine,
        HtmlEmbed,
        Image,
        ImageCaption,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageResizeEditing,
        ImageResizeHandles,
        ImageUpload,
        Indent,
        ItalicPlugin,
        LinkPlugin,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        MediaEmbedToolbar,
        PasteFromOffice,
        ParagraphPlugin,
        RemoveFormat,
        SourceEditing,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersLatin,
        SpecialCharactersText,
        StandardEditingMode,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableCellProperties,
        TableProperties,
        TableToolbar,
        TextTransformation,
        Title,
        TodoList,
        Underline,
        WordCount,
      ],

      toolbar: {
        items: [
          "heading",
          "blockQuote",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "todoList",
          "|",
          "imageUpload",
          "mediaEmbed",
          "|",
          "outdent",
          "indent",
          "|",
          "alignment",
          "findAndReplace",
          "|",
          "fontBackgroundColor",
          "fontColor",
          "fontFamily",
          "fontSize",
          "highlight",
          "|",
          "underline",
          "horizontalLine",
          "htmlEmbed",
          "removeFormat",
          "sourceEditing",
          "specialCharacters",
          "|",
          "insertTable",
          "undo",
          "redo",
          "|",
          "restrictedEditingException",
          "subscript",
          "superscript",
          "strikethrough",
          "code",
        ],
        shouldNotGroupWhenFull: true,
      },
      language: "pt",
      image: {
        toolbar: [
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
          "|",
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "linkImage",
          "resizeImage",
        ],
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableCellProperties", "tableProperties"],
      },

      htmlEmbed: {
        showPreviews: true,
        sanitizeHtml: (inputHtml) => {
          const outputHtml = sanitizeHtml(inputHtml);

          return {
            html: outputHtml,

            hasChanged: true,
          };
        },
      },
      htmlSupport: {
        allow: [
          {
            name: /.*/,
            attributes: true,
            classes: true,
            styles: true,
          },
        ],
      },
      typing: {
        transformations: {
          extra: [
            { from: ":)", to: "🙂" },
            { from: ":+1:", to: "👍" },
            { from: ":tada:", to: "🎉" },
            {
              from: /(^|\s)(")([^"]*)(")$/,
              to: [null, "«", null, "»"],
            },
            {
              from: /([.?!] )([a-z])$/,
              to: (matches) => [null, matches[1].toUpperCase()],
            },
          ],
        },
      },
      link: {
        addTargetToExternalLinks: true,
        decorators: [
          {
            mode: "manual",
            label: "Downloadable",
            attributes: {
              download: "download",
            },
          },
        ],
      },
    };

    return { editorData, editorConfig, isFocused, onReady, imageConfiguration };
  },

  data() {
    return {
      editor: ClassicEditor,
    };
  },
});
</script>

<style lang="scss">
.ck .ck-sticky-panel .ck-sticky-panel__content_sticky {
  position: static !important;
}

.ck-editor__top {
  overflow: hidden;
  display: block;
  height: 38.67px;
  .ck-sticky-panel__placeholder {
    display: none !important;
  }
}
</style>
