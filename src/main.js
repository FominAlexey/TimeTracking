import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//Запросы
import axios from "axios";
import VueAxios from "vue-axios";

//CSS Framework Vuetify
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import VCalendar from 'v-calendar';
import "@/assets/styles/styles.css";
import "@/assets/styles/variables.css";
import 'v-calendar/style.css';

//Загрузка шрифтов
loadFonts();

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(VCalendar, {})
  .use(VueAxios, axios)
  .mount("#app");
