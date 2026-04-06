<template>
  <div>
    <h1>Danh sách Helpdesk Tickets</h1>

    <div v-if="loading">Đang tải...</div>

    <div v-else-if="tickets.length === 0">
      <p>Chưa có ticket nào.</p>
      <router-link to="/tickets/new" class="ui button positive">
        Tạo ticket mới
      </router-link>
    </div>

    <table v-else id="tickets" class="ui celled compact table">
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
            <router-link :to="{ name: 'show', params: { id: t._id } }">
              Show
            </router-link>
          </td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'edit', params: { id: t._id } }">
              Edit
            </router-link>
          </td>
          <td width="75" class="center aligned">
            <button
              class="ui negative mini button"
              @click="onDestroy(t._id)"
            >
              Destroy
            </button>
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
  data() {
    return {
      tickets: [],
      loading: true
    };
  },
  async mounted() {
    const res = await api.getTickets();
    if (res?.success) {
      this.tickets = res.data;
    }
    this.loading = false;
  },
  methods: {
    async onDestroy(id) {
      const sure = window.confirm('Bạn có chắc chắn muốn xóa?');
      if (!sure) return;

      const res = await api.deleteTicket(id);
      if (res?.success) {
        this.tickets = this.tickets.filter(t => t._id !== id);
      } else {
        alert('Xóa thất bại, thử lại!');
      }
    }
  }
};
</script>