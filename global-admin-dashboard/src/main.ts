// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import router from './router/main'; // Vue Router

// Configure Amplify with the provided amplify_outputs.json
Amplify.configure(outputs);

// Create the Vue app
const app = createApp(App);

// Use Vue Router with proper typing
app.use(router);

// Mount the app to the DOM
app.mount('#app');
