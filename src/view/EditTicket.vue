<template>
  <div>
    <h1>Chỉnh Sửa Ticket</h1>
    <helpdesk-form :ticket="this.ticket" @createOrUpdate="createOrUpdate"></helpdesk-form>
  </div>
</template>

<script>
import HelpdeskForm from '../components/HelpdeskForm.vue';
import { api } from '../helper/helpers';

export default {
  name: 'edit-ticket',
  components: { 'helpdesk-form': HelpdeskForm },
  data() { return { ticket: {} }; },
  async mounted() {
    const res = await api.getTicket(this.$route.params.id);
    this.ticket = res.data;
  },
  methods: {
    createOrUpdate: async function(ticket) {
      await api.updateTicket(ticket);
      alert('Cập nhật ticket thành công!');
      this.$router.push(`/tickets/${ticket._id}`);
    }
  }
};
</script>