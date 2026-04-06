import { createRouter, createWebHistory } from 'vue-router';

import Tickets from './../view/Ticket.vue';
import NewTicket from './../view/NewTicket.vue';
import ShowTicket from './../view/ShowTicket.vue';
import EditTicket from './../view/EditTicket.vue';

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/tickets', name: 'tickets', component: Tickets },
  { path: '/tickets/new', name: 'new-ticket', component: NewTicket },
  { path: '/tickets/:id', name: 'show', component: ShowTicket },
  { path: '/tickets/:id/edit', name: 'edit', component: EditTicket }
];

const router = createRouter({
  history: createWebHistory(), // thay cho mode: 'history'
  routes,
  linkActiveClass: 'active'
});

export default router;