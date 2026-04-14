<template>
  <div>
    <h1>Edit Ticket</h1>

    <div v-if="loading">Loading...</div>

    <helpdesk-form
      v-else
      :ticket="ticket"
      @createOrUpdate="createOrUpdate"
    />
  </div>
</template>

<script>
import HelpdeskForm from '../components/HelpdeskForm.vue';
import { api } from '../helper/helpers';

export default {
  name: 'edit-ticket',
  components: { 'helpdesk-form': HelpdeskForm },
  data() {
    return {
      ticket: {},
      loading: true
    };
  },
  async mounted() {
    const res = await api.getTicket(this.$route.params.id);
    if (res?.success) {
      this.ticket = res.data;
    }
    this.loading = false;
  },
  methods: {
    async createOrUpdate(ticket) {
      const res = await api.updateTicket(ticket);
      if (res?.success) {
        alert('Ticket update successful!');
        this.$router.push(`/tickets/${ticket._id}`);
      } else {
        alert('Update failed, try again!');
      }
    }
  }
};
</script>
