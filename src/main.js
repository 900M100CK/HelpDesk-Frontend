import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js'; // Cần nâng cấp router lên v4
import 'semantic-ui-css/semantic.min.css';

createApp(App).use(router).mount('#app');