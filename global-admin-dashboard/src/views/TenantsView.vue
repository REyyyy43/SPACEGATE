<template>
    <div class="tenants">
      <h2>Manage Tenants</h2>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <form @submit.prevent="createTenant" class="tenant-form">
        <label>
          Tenant Name:
          <input type="text" v-model="tenant.name" required />
        </label>
        <label>
          Contact Email:
          <input type="email" v-model="tenant.contactEmail" required />
        </label>
        <label>
          Billing Plan:
          <select v-model="tenant.billingPlan" required>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <button type="submit">Create Tenant</button>
      </form>
  
      <div v-if="loading" class="loading">Loading...</div>
      <ul v-else class="tenant-list">
        <li v-for="tenant in tenants" :key="tenant.id">
          <div>
            <span>{{ tenant.name }} - {{ tenant.billingPlan }}</span>
            <span>Contact: {{ tenant.contactEmail }}</span>
          </div>
          <div class="actions">
            <button @click="editTenant(tenant)">Edit</button>
            <button @click="deleteTenant(tenant.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue';
  import { generateClient } from 'aws-amplify/data';
  import type { Schema } from '../../../amplify/data/resource';
  
  // Generate Amplify client
  const client = generateClient<Schema>();
  
  export default {
    name: 'TenantsView',
    setup() {
      const tenant = ref({
        name: '',
        contactEmail: '',
        billingPlan: 'basic' as 'basic' | 'premium', // Enforce strict typing
      });
  
      const tenants = ref<any[]>([]);
      const errorMessage = ref('');
      const successMessage = ref('');
      const loading = ref(false);
  
      const fetchTenants = async () => {
        loading.value = true;
        errorMessage.value = '';
        try {
          const { data, errors } = await client.models.Tenant.list({});
          if (errors?.length) {  // Check explicitly for errors array length
            console.error('GraphQL Errors:', errors);
            errorMessage.value = `Failed to fetch tenants: ${errors[0]?.message || 'Unknown error'}`;
          } else if (!data) {
            errorMessage.value = 'No data received from server';
          } else {
            console.log('Fetched tenants:', data);
            tenants.value = data;
          }
        } catch (error: unknown) {  // Explicitly type the error
          console.error('Fetch Error:', error);
          errorMessage.value = error instanceof Error 
            ? `Error: ${error.message}`
            : 'An unexpected error occurred while fetching tenants';
        } finally {
          loading.value = false;
        }
      };
  
      const createTenant = async () => {
        errorMessage.value = '';
        loading.value = true;
        try {
          await client.models.Tenant.create({
            name: tenant.value.name,
            contactEmail: tenant.value.contactEmail,
            billingPlan: tenant.value.billingPlan,
          });
          tenant.value = { name: '', contactEmail: '', billingPlan: 'basic' }; // Reset form
          successMessage.value = 'Tenant created successfully!';
          setTimeout(() => {
            successMessage.value = '';
          }, 3000);
          await fetchTenants();
        } catch (error) {
          errorMessage.value = 'Failed to create tenant. Please try again.';
          console.error('Error creating tenant:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const editTenant = (tenantToEdit: any) => {
        tenant.value = { ...tenantToEdit }; // Populate form with tenant data
      };
  
      const deleteTenant = async (tenantId: string) => {
        errorMessage.value = '';
        loading.value = true;
        try {
          await client.models.Tenant.delete({ id: tenantId });
          successMessage.value = 'Tenant deleted successfully!';
          setTimeout(() => {
            successMessage.value = '';
          }, 3000);
          await fetchTenants(); // Refresh tenant list
        } catch (error) {
          errorMessage.value = 'Failed to delete tenant. Please try again.';
          console.error('Error deleting tenant:', error);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(fetchTenants);
  
      return {
        tenant,
        tenants,
        createTenant,
        errorMessage,
        successMessage,
        loading,
        editTenant,
        deleteTenant,
      };
    },
  };
  </script>
  
  <style scoped>
  .tenants {
    max-width: 600px;
    margin: 2rem auto;
  }
  
  h2 {
    text-align: center;
    color: #333;
  }
  
  .tenant-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .tenant-form label {
    font-size: 1rem;
    color: #555;
  }
  
  .tenant-form input,
  .tenant-form select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .tenant-form button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: white;
    background-color: #4caf50;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .tenant-form button:hover {
    background-color: #45a049;
  }
  
  .tenant-list {
    list-style: none;
    padding: 0;
  }
  
  .tenant-list li {
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .tenant-list span {
    font-size: 1rem;
    color: #333;
  }
  
  .error-message {
    color: #dc3545;
    background-color: #f8d7da;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    text-align: center;
  }
  
  .success-message {
    color: #28a745;
    background-color: #d4edda;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    text-align: center;
  }
  
  .loading {
    text-align: center;
    color: #666;
    padding: 1rem;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .actions button {
    padding: 0.3rem 0.6rem;
    font-size: 0.9rem;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .actions button:hover {
    background-color: #0056b3;
  }
  
  .actions button:nth-child(2) {
    background-color: #dc3545;
  }
  
  .actions button:nth-child(2):hover {
    background-color: #c82333;
  }
  </style>
  