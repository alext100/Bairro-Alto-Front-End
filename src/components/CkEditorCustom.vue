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
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import Clipboard from "@ckeditor/ckeditor5-clipboard/src/clipboard";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import FindAndReplace from "@ckeditor/ckeditor5-find-and-replace/src/findandreplace";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor";
import FontFamily from "@ckeditor/ckeditor5-font/src/fontfamily";
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import HeadingButtonsUI from "@ckeditor/ckeditor5-heading/src/headingbuttonsui";
import Title from "@ckeditor/ckeditor5-heading/src/title";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import HtmlEmbed from "@ckeditor/ckeditor5-html-embed/src/htmlembed";
import DataFilter from "@ckeditor/ckeditor5-html-support/src/datafilter";
import DataSchema from "@ckeditor/ckeditor5-html-support/src/dataschema";
import GeneralHtmlSupport from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupport";
import AutoImage from "@ckeditor/ckeditor5-image/src/autoimage";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageResizeEditing from "@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting";
import ImageResizeHandles from "@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import AutoLink from "@ckeditor/ckeditor5-link/src/autolink";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import LinkImage from "@ckeditor/ckeditor5-link/src/linkimage";
import List from "@ckeditor/ckeditor5-list/src/list";
import ListProperties from "@ckeditor/ckeditor5-list/src/listproperties";
import TodoList from "@ckeditor/ckeditor5-list/src/todolist";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import MediaEmbedToolbar from "@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import ParagraphButtonUI from "@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import RemoveFormat from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import StandardEditingMode from "@ckeditor/ckeditor5-restricted-editing/src/standardeditingmode";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import SpecialCharacters from "@ckeditor/ckeditor5-special-characters/src/specialcharacters";
import SpecialCharactersArrows from "@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows";
import SpecialCharactersCurrency from "@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency";
import SpecialCharactersLatin from "@ckeditor/ckeditor5-special-characters/src/specialcharacterslatin";
import SpecialCharactersText from "@ckeditor/ckeditor5-special-characters/src/specialcharacterstext";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableCaption from "@ckeditor/ckeditor5-table/src/tablecaption";
import TableCellProperties from "@ckeditor/ckeditor5-table/src/tablecellproperties";
import TableProperties from "@ckeditor/ckeditor5-table/src/tableproperties";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import BalloonToolbar from "@ckeditor/ckeditor5-ui/src/toolbar/balloon/balloontoolbar";
import BlockToolbar from "@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount";
import sanitizeHtml from "sanitize-html";
import { computed, defineComponent, ref } from "vue";
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
        BalloonToolbar,
        BoldPlugin,
        BlockQuote,
        BlockToolbar,
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
        HeadingButtonsUI,
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
        ParagraphButtonUI,
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
        TableCaption,
        TableCellProperties,
        TableProperties,
        TableToolbar,
        TextTransformation,
        Title,
        TodoList,
        Underline,
        WordCount,
      ],
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading2", view: "h2", title: "Cabeçalho 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Cabeçalho 3", class: "ck-heading_heading3" },
          { model: "heading4", view: "h4", title: "Cabeçalho 4", class: "ck-heading_heading4" },
          { model: "heading5", view: "h5", title: "Cabeçalho 5", class: "ck-heading_heading5" },
          { model: "heading6", view: "h6", title: "Cabeçalho 6", class: "ck-heading_heading6" },
        ],
      },
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
      balloonToolbar: {
        items: [
          "blockQuote",
          "bold",
          "italic",
          "link",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "imageUpload",
          "mediaEmbed",
          "|",
          "fontFamily",
          "fontSize",
          "fontColor",
          "highlight",
          "|",
          "underline",
          "horizontalLine",
          "removeFormat",
          "insertTable",
        ],
        shouldNotGroupWhenFull: true,
      },
      blockToolbar: [
        "paragraph",
        "heading2",
        "heading3",
        "heading4",
        "heading5",
        "heading6",
        "|",
        "todoList",
        "|",
        "outdent",
        "indent",
        "|",
        "findAndReplace",
        "fontBackgroundColor",
        "htmlEmbed",
        "removeFormat",
        "sourceEditing",
        "specialCharacters",
        "restrictedEditingException",
        "subscript",
        "superscript",
        "strikethrough",
        "code",
      ],
      language: "pt",
      image: {
        resizeUnit: "%",
        resizeOptions: [
          {
            name: "resizeImage:125",
            value: "125",
          },
          {
            name: "resizeImage:original",
            value: null,
          },
          {
            name: "resizeImage:75",
            value: "75",
          },
          {
            name: "resizeImage:50",
            value: "50",
          },
          {
            name: "resizeImage:25",
            value: "25",
          },
        ],
        toolbar: [
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
          "imageStyle:wrapText",
          "imageStyle:breakText",
          "|",
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "linkImage",
          "resizeImage",
        ],
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableCellProperties",
          "tableProperties",
          "toggleTableCaption",
        ],
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
      fontFamily: {
        options: [
          "Noto Sans, sans-serif",
          "Poppins, sans-serif",
          "Roboto, sans-serif",
          "Montserrat, sans-serif",
          "Bitter, serif",
          "Lato, sans-serif",
          "Open Sans, sans-serif",
          "Oswald, sans-serif",
          "Roboto Condensed, sans-serif",
          "Arial, Helvetica, sans-serif",
          "Courier New, Courier, monospace",
          "Georgia, serif",
          "Lucida Sans Unicode, Lucida Grande, sans-serif",
          "Tahoma, Geneva, sans-serif",
          "Times New Roman, Times, serif",
          "Indie Flower, cursive",
          "Caveat, cursive",
        ],
        supportAllValues: true,
      },
      fontSize: {
        options: ["default", 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 36],
        supportAllValues: true,
      },
    };

    return { editorData, editorConfig, isFocused, onReady };
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
.ck.ck-block-toolbar-button {
  transform: translateX(-10px);
}
</style>
