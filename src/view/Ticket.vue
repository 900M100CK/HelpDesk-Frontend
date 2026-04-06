<template>
  <div>
    <h1>Danh sách Helpdesk Tickets</h1>
    <table id="tickets" class="ui celled compact table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Category</th>
          <th>Priority</th>
          <th colspan="3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, i) in tickets" :key="i">
          <td>{{ t.key }}</td>
          <td>{{ t.category }}</td>
          <td>{{ t.priority }}</td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'show', params: { id: t._id }}">Show</router-link>
          </td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'edit', params: { id: t._id }}">Edit</router-link>
          </td>
          <td width="75" class="center aligned" @click.prevent="onDestroy(t._id)">
            <a :href="`/tickets/${t._id}`">Destroy</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { api } from '../helper/helpers';
export default {
  name: 'ticket-list',
  data() { return { tickets: [] }; },
  async mounted() {
    const res = await api.getTickets();
    this.tickets = res.data; // Express server của bạn gói mảng trong key `data`
  },
  methods: {
    async onDestroy(id) {
      const sure = window.confirm('Bạn có chắc chắn muốn xóa?');
      if (!sure) return;
      await api.deleteTicket(id);
      this.tickets = this.tickets.filter(t => t._id !== id);
    }
  }
};
</script>