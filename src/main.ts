import CKEditor from "@ckeditor/ckeditor5-vue";
import "@fortawesome/fontawesome-free/css/all.css";
import { createHead } from "@vueuse/head";
import { MotionPlugin } from "@vueuse/motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.css";
import "boxicons/css/boxicons.min.css";
import Particles from "particles.vue3";
import { TippyPlugin } from "tippy.vue";
import VueViewer from "v-viewer";
// eslint-disable-next-line import/no-extraneous-dependencies
import "viewerjs/dist/viewer.css";
import { createApp } from "vue";
import DKToast from "vue-dk-toast";
import VueKinesis from "vue-kinesis";
import VueMobileDetection from "vue-mobile-detection";
import VueNextSelect from "vue-next-select";
import "vue-next-select/dist/index.min.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const head = createHead();

createApp(App)
  .use(head)
  .use(DKToast, {
    duration: 2000,
    positionY: "bottom",
    positionX: "right",
    styles: {
      color: "#CC1810",
      backgroundColor: "#FFC107",
      width: "120px",
      border: "1px solid #CC1810",
    },
  })
  .use(store)
  .use(router)
  .use(BootstrapVue3)
  .use(CKEditor)
  .use(Particles)
  .use(VueMobileDetection)
  .use(VueKinesis)
  .use(MotionPlugin)
  .use(TippyPlugin)
  .use(VueViewer)
  .component("vue-select", VueNextSelect)
  .mount("#app");
