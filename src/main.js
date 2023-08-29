import { createApp } from 'vue'; // Importe createApp do Vue 3.x
import App from './App.vue';
import vuetify from './plugins/vuetify'; // Verifique o caminho real no seu projeto
import router from './router'; // Se você estiver usando o roteamento

const app = createApp(App); // Crie a instância do aplicativo

app.use(router); // Use o roteador, se estiver usando
app.use(vuetify);
app.mount('#app'); // Monte o aplicativo no elemento com ID "app"
