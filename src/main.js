import { createApp } from 'vue';

import App from './App.vue';

import router from './router';

const app = createApp(App);


/*
 * URL del backend.
 *
 * Como frontend y Netlify Functions están siendo
 * ejecutados por netlify dev, podemos usar una
 * dirección relativa.
 */
app.config.globalProperties.$url =
    '/.netlify/functions';


app.use(router);

app.mount('#app');