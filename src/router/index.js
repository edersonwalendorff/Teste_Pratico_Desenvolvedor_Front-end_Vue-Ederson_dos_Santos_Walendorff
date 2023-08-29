import { createRouter, createWebHistory } from 'vue-router';
import AddressPage from '@/views/AddressPage';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Address', // Use um nome significativo, como 'Address'
        component: AddressPage,
      },
      {
        path: 'address',
        name: 'Address',
        component: AddressPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
