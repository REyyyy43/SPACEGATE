<template>
  <div>
    <!-- Amplify Authenticator for login -->
    <Authenticator>
      <template #default="{ user, signOut }">
        <!-- Navigation bar -->
        <nav>
          <h1>Global Admin Dashboard</h1>
          <div class="user-info">
            <span>Welcome, {{ user.username }}!</span>
            <button @click="signOut">Sign Out</button>
          </div>
        </nav>
        
        <!-- Routed views -->
        <router-view />
      </template>
    </Authenticator>
  </div>
</template>

<script>
import { Authenticator } from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css'; // Import Amplify UI styles

export default {
  components: {
    Authenticator,
  },
};
</script>

<style>
/* General app styling */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4caf50;
  color: white;
  padding: 1rem;
}

nav h1 {
  margin: 0;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

button {
  background-color: white;
  color: #4caf50;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}

button:hover {
  background-color: #f1f1f1;
}
</style>
