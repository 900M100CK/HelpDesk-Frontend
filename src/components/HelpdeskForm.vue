<template>
  <form action="#" @submit.prevent="onSubmit">
    <p v-if="errorsPresent" class="error">Vui lòng điền mã và nội dung!</p>

    <div class="ui labeled input fluid" style="margin-bottom: 15px;">
      <div class="ui label">Key</div>
      <input type="text" placeholder="VD: TECH_01" v-model="localTicket.key" />
    </div>

    <div class="ui labeled input fluid" style="margin-bottom: 15px;">
      <div class="ui label">Nội dung</div>
      <input type="text" placeholder="Mô tả lỗi..." v-model="localTicket.value" />
    </div>

    <div class="ui labeled input fluid" style="margin-bottom: 15px;">
      <div class="ui label">Category</div>
      <select v-model="localTicket.category" class="ui dropdown">
        <option value="general">General</option>
        <option value="technical">Technical</option>
        <option value="billing">Billing</option>
      </select>
    </div>

    <div class="ui labeled input fluid" style="margin-bottom: 15px;">
      <div class="ui label">Priority</div>
      <select v-model="localTicket.priority" class="ui dropdown">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <button class="positive ui button">Submit</button>
  </form>
</template>

<script>
export default {
  name: 'helpdesk-form',
  props: {
    ticket: {
      type: Object,
      required: false,
      default: () => {
        return { key: '', value: '', category: 'general', priority: 'medium' };
      }
    }
  },
  data() {
    return {
      errorsPresent: false,
      localTicket: { ...this.ticket }
    };
  },
  watch: {
    ticket: {
      handler(newTicket) {
        this.localTicket = { ...newTicket };
      },
      deep: true
    }
  },
  methods: {
    onSubmit: function() {
      // Validate đơn giản [cite: 250, 251]
      if (this.localTicket.key === '' || this.localTicket.value === '') {
        this.errorsPresent = true;
      } else {
        this.$emit('createOrUpdate', this.localTicket);
      }
    }
  }
};
</script>

<style scoped>
.error { color: red; margin-bottom: 10px; font-weight: bold; }
</style>