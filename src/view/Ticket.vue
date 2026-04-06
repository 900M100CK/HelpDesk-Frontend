<template>
  <div>
    <h1>Danh sách Helpdesk Tickets</h1>

    <div class="ui form" style="margin-bottom: 20px;">
      <div class="field">
        <div class="ui fluid icon input">
          <input type="text" v-model="searchQuery"
            placeholder="Tìm kiếm theo Key, Category hoặc nội dung câu trả lời..." />
          <i class="search icon"></i>
        </div>
      </div>
    </div>

    <div v-if="toastMessage" class="ui positive message">
      <i class="check icon"></i> {{ toastMessage }}
    </div>

    <div v-if="loading">Đang tải...</div>

    <div v-else-if="filteredTickets.length === 0">
      <p>Không tìm thấy dữ liệu phù hợp.</p>
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
          <th>Response (Value)</th>
          <th colspan="4" class="center aligned">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, i) in filteredTickets" :key="i">
          <td><strong>{{ t.key }}</strong></td>
          <td>{{ t.category }}</td>

          <td class="center aligned">
            <div class="ui label" :class="getPriorityColor(t.priority)">
              {{ t.priority || 'Chưa xếp loại' }}
            </div>
          </td>

          <td>{{ t.value }}</td>

          <td width="50" class="center aligned">
            <router-link :to="{ name: 'show', params: { id: t._id } }" class="ui mini button">
              Show
            </router-link>
          </td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'edit', params: { id: t._id } }" class="ui mini primary button">
              Edit
            </router-link>
          </td>
          <td width="75" class="center aligned">
            <button class="ui negative mini button" @click="onDestroy(t._id)">
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
      loading: true,
      searchQuery: '', // Biến lưu trữ từ khóa tìm kiếm
      toastMessage: '' // Biến lưu trữ thông báo khi copy
    };
  },
  computed: {
    // XỬ LÝ LỌC DỮ LIỆU (REAL-TIME FILTER)
    filteredTickets() {
      if (!this.searchQuery) return this.tickets;

      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.tickets.filter(t => {
        // Lọc qua nhiều trường để tìm kiếm thông minh hơn
        return (
          (t.key && t.key.toLowerCase().includes(lowerCaseQuery)) ||
          (t.category && t.category.toLowerCase().includes(lowerCaseQuery)) ||
          (t.value && t.value.toLowerCase().includes(lowerCaseQuery))
        );
      });
    }
  },
  async mounted() {
    const res = await api.getTickets();
    if (res?.success) {
      this.tickets = res.data;
    }
    this.loading = false;
  },
  methods: {
    // HÀM ĐỔI MÀU BẢNG (Sử dụng class màu mặc định của Semantic UI)
    getPriorityColor(priority) {
      if (!priority) return '';

      // Chuyển về chữ thường và cắt bỏ khoảng trắng 2 đầu để so sánh chính xác 100%
      const p = priority.toString().trim().toLowerCase();

      // Bảng màu chuẩn của Semantic UI Label
      if (p === 'urgent' || p === 'khẩn cấp') return 'red';
      if (p === 'high' || p === 'cao') return 'orange';
      if (p === 'medium' || p === 'trung bình') return 'blue';
      if (p === 'low' || p === 'thấp') return 'green';

      return 'grey'; // Màu mặc định nếu không khớp từ khóa nào
    },

    // HÀM XỬ LÝ COPY VÀ HIỂN THỊ TOAST
    async copyResponse(text) {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);

        // Hiện thông báo
        this.toastMessage = 'Đã sao chép câu trả lời vào bộ nhớ tạm!';

        // Tự động tắt thông báo sau 2.5 giây
        setTimeout(() => {
          this.toastMessage = '';
        }, 2500);
      } catch (err) {
        alert('Trình duyệt của bạn không hỗ trợ tính năng copy tự động.');
      }
    },

    async onDestroy(id) {
      const sure = window.confirm('Bạn có chắc chắn muốn xóa?');
      if (!sure) return;

      const res = await api.deleteTicket(id);
      if (res?.success) {
        // Thay vì lọc mảng gốc, chúng ta cập nhật lại mảng tickets
        this.tickets = this.tickets.filter(t => t._id !== id);
      } else {
        alert('Xóa thất bại, thử lại!');
      }
    }
  }
};
</script>