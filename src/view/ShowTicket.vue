<template>
  <div>
    <h1>Chi Tiết Yêu Cầu</h1>
    <div class="ui labeled input fluid" style="margin-bottom: 15px">
      <div class="ui label">Key</div>
      <input type="text" disabled :value="ticket.key" />
    </div>
    <div class="ui labeled input fluid" style="margin-bottom: 15px">
      <div class="ui label">Nội dung</div>
      <input type="text" disabled :value="ticket.value" />
    </div>
    
    <router-link class="ui button positive" :to="{ name: 'edit', params: { id: this.$route.params.id }}">
      Chỉnh sửa Ticket
    </router-link>
  </div>
</template>

<script>
import { api } from '../helper/helpers';
export default {
  name: 'show-ticket',
  data() { return { ticket: {} }; },
  async mounted() {
    const res = await api.getTicket(this.$route.params.id);
    this.ticket = res.data;
  }
};
</script>