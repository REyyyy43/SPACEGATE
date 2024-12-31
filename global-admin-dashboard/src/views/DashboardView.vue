<template>
  <div class="dashboard">
    <h2>Global Admin Dashboard</h2>
    <p>Welcome to the admin dashboard. Manage your tenants and oversee the system effectively.</p>
    <div v-if="loading" class="loading">Loading tenants...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <p v-else>Total Tenants: {{ tenantCount }}</p>
    <router-link to="/tenants" class="button">Manage Tenants</router-link>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

// Generate Amplify client
const client = generateClient<Schema>();

export default {
  name: 'DashboardView',
  setup() {
    const tenantCount = ref(0);
    const loading = ref(false);
    const errorMessage = ref('');

    const fetchTenantCount = async () => {
      loading.value = true;
      errorMessage.value = '';
      try {
        const { data, errors } = await client.models.Tenant.list({});
        if (errors) {
          console.error('GraphQL Errors:', errors);
          errorMessage.value = 'Unable to fetch tenant count. Check API.';
        } else {
          console.log('Tenant count:', data?.length || 0);
          tenantCount.value = data?.length || 0;
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        errorMessage.value = 'Failed to fetch tenant count. Verify backend configuration.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchTenantCount);

    return {
      tenantCount,
      loading,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.dashboard {
  text-align: center;
  margin: 2rem auto;
}

h2 {
  font-size: 2rem;
  color: #333;
}

p {
  font-size: 1.2rem;
  margin: 1rem 0;
  color: #555;
}

.button {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: white;
  background-color: #4caf50;
  text-decoration: none;
  border-radius: 4px;
}

.button:hover {
  background-color: #45a049;
}

.loading {
  text-align: center;
  color: #666;
  padding: 1rem;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem 0;
}
</style>
