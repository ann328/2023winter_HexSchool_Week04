import './assets/all.scss'
import 'bootstrap/dist/js/bootstrap.min'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
