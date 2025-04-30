import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

// Create Vue instance
const app = createApp(App);

// Set the global API URL (base URL for your API)
app.config.globalProperties.$apiUrl = 'https://api.example.com';

// Mount the app
app.mount('#app');
