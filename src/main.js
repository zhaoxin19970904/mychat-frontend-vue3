import { createApp } from 'vue'

import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import vue3GoogleLogin from 'vue3-google-login'
import store from './store';


let CLIENT_ID = '892749453222-ckthm4h2leeonk0fvh8e7sefuau11i75.apps.googleusercontent.com';

const app = createApp(App);

app.use(router);
app.use(vue3GoogleLogin, {
    clientId: CLIENT_ID,
  })

app.use(store);
app.use(Antd).mount('#app');

