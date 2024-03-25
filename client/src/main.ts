import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Loading, LocalStorage, SessionStorage, Dialog, BottomSheet, Dark, Platform } from 'quasar'
import vue3GoogleLogin from 'vue3-google-login'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify,
    Loading,
    LocalStorage,
    SessionStorage,
    Dialog,
    BottomSheet,
    Dark,
    Platform
  },
})

app.use(vue3GoogleLogin, {
  clientId: 'GOOGLE_CLIENT_ID'
})

app.use(createPinia())
app.use(router)

app.mount('#app')
