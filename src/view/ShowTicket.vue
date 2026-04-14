<template>
  <div>
    <h1>Ticket detail</h1>

    <div v-if="loading">Loading...</div>

    <div v-else-if="ticket._id">
      <div class="ui labeled input fluid" style="margin-bottom: 15px">
        <div class="ui label">Key</div>
        <input type="text" disabled :value="ticket.key" />
      </div>

      <div class="ui labeled input fluid" style="margin-bottom: 15px">
        <div class="ui label">Content</div>
        <input type="text" disabled :value="ticket.value" />
      </div>

      <div class="ui labeled input fluid" style="margin-bottom: 15px">
        <div class="ui label">Category</div>
        <input type="text" disabled :value="ticket.category" />
      </div>

      <div class="ui labeled input fluid" style="margin-bottom: 15px">
        <div class="ui label">Priority</div>
        <input type="text" disabled :value="ticket.priority" />
      </div>

      <router-link
        class="ui button positive"
        :to="{ name: 'edit', params: { id: $route.params.id } }"
      >
        Edit ticket
      </router-link>
    </div>

    <div v-else>
      <p>No ticket found.</p>
      <router-link to="/tickets" class="ui button">Back</router-link>
    </div>
  </div>
</template>

<script>
import { api } from '../helper/helpers';

export default {
  name: 'show-ticket',
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
  }
};
</script>
