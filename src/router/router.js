import { createRouter, createWebHistory } from 'vue-router';

import Tickets from './../view/Ticket.vue';
import NewTicket from './../view/NewTicket.vue';
import ShowTicket from './../view/ShowTicket.vue';
import EditTicket from './../view/EditTicket.vue';
import QuizPage from './../view/QuizPage.vue';  
import QuizPage2 from './../view/QuizPage2.vue';  

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/tickets', name: 'tickets', component: Tickets },
  { path: '/tickets/new', name: 'new-ticket', component: NewTicket },
  { path: '/tickets/:id', name: 'show', component: ShowTicket },
  { path: '/tickets/:id/edit', name: 'edit', component: EditTicket },
  {path: '/quiz', name: 'quiz', component: QuizPage}, // lazy load quiz component
  {path: '/quiz2', name: 'quiz2', component: QuizPage2} // lazy load quiz2 component
];

const router = createRouter({
  history: createWebHistory(), // thay cho mode: 'history'
  routes,
  linkActiveClass: 'active'
});

export default router;