import { createApp } from "vue";
import BootstrapVue3 from "bootstrap-vue-3";
import DKToast from "vue-dk-toast";
import CKEditor from "@ckeditor/ckeditor5-vue";
import Particles from "particles.vue3";
import VueMobileDetection from "vue-mobile-detection";
import VueKinesis from "vue-kinesis";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";

createApp(App)
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
  .mount("#app");
