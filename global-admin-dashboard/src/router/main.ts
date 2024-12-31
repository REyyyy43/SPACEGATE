import { createRouter, createWebHistory } from 'vue-router';

// Define the routes
const routes = [
  {
    path: '/', // Default route
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'), // Lazy-loaded DashboardView
  },
  {
    path: '/tenants', // Route for managing tenants
    name: 'Tenants',
    component: () => import('@/views/TenantsView.vue'), // Lazy-loaded TenantsView
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all route for 404s
    name: 'NotFound',
    component: {
      template: '<div><h2>404 - Page Not Found</h2></div>',
    },
  },
];

// Create and export the router
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
});

export default router;
