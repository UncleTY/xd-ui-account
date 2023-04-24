import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import App from './App.vue'
import 'element-plus/dist/index.css'
import api from './service'
import axios from "axios";

const app = createApp(App);

app.use(ElementPlus);

app.mount('#app');
app.provide('$axios', axios)
app.config.globalProperties.$api = api;
