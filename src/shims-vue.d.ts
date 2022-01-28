/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "@ckeditor/ckeditor5-vue" {
  // or other CKEditor 5 build.
  const ClassicEditorBuild: any;

  export = ClassicEditorBuild;
}
