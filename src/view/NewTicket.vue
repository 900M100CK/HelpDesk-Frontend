<template>
  <div>
    <h1>Create a new ticket</h1>
    <helpdesk-form @createOrUpdate="createOrUpdate"></helpdesk-form>
  </div>
</template>

<script>
import HelpdeskForm from '../components/HelpdeskForm.vue';
import { api } from '../helper/helpers';

export default {
  name: 'new-ticket',
  components: { 'helpdesk-form': HelpdeskForm },
  methods: {
    createOrUpdate: async function(ticket) {
      const res = await api.createTicket(ticket);

      if (!res || !res.success) {
        alert('Ticket creation failed, check your connection!');
        return;
      }

      alert('Ticket created successfully!');
      const id = res.data?._id || res._id;
      this.$router.push(`/tickets/${id}`);
    }
  }
};


</script>
