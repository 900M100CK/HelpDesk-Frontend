<template>
  <div>
    <h1>Tạo Yêu Cầu Mới</h1>
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
      alert('Tạo ticket thành công!');
      // Điều hướng về màn hình chi tiết
      this.$router.push(`/tickets/${res.data._id}`);
    }
  }
};
</script>