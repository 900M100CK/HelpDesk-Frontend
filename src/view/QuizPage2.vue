<template>
  <div class="ui container" style="margin-top: 20px">
    <h1 class="ui header">
      Staff Training Quiz: Typing Mode
      <div class="sub header">Điền thông tin còn thiếu vào ô trống</div>
    </h1>

    <div v-if="loading" class="ui active inline loader"></div>

    <div v-else-if="tickets.length === 0" class="ui warning message">
      <p>Chưa có ticket nào trong hệ thống.</p>
    </div>

    <div v-else-if="submitted" class="ui segment">
      <h2 class="ui header" :class="scoreColor">
        Điểm số: {{ score }} / {{ questions.length }}
      </h2>
      
      <table class="ui celled table">
        <thead>
          <tr>
            <th>Đề bài cho</th>
            <th>Câu bạn nhập</th>
            <th>Đáp án đúng</th>
            <th>Kết quả</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ans, i) in answerHistory" :key="i" :class="{ positive: ans.isCorrect, negative: !ans.isCorrect }">
            <td>
              <div class="ui ribbon label" :class="ans.type === 'guessKey' ? 'teal' : 'blue'">
                {{ ans.type === 'guessKey' ? 'Cho Value -> Tìm Key' : 'Cho Key -> Tìm Value' }}
              </div>
              <br/>
              <i>{{ ans.givenText }}</i>
            </td>
            <td><strong>{{ ans.userAnswer || '(Bỏ trống)' }}</strong></td>
            <td>{{ ans.correctAnswer }}</td>
            <td>
              <i class="icon" :class="ans.isCorrect ? 'check green large' : 'times red large'"></i>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="ui primary button" @click="restart">Làm lại bài Test</button>
    </div>

    <div v-else>
      <div class="ui message">
        Câu {{ currentIndex + 1 }} / {{ questions.length }}
        <span class="ui right floated basic label">
          Nhiệm vụ: {{ currentQuestion.type === 'guessKey' ? 'Nhập Mã Lỗi' : 'Nhập Phản Hồi' }}
        </span>
      </div>

      <div class="ui padded segment form">
        <div class="ui info message" v-if="currentQuestion.type === 'guessValue'">
          <i class="info circle icon"></i> Hãy nhập chính xác nội dung phản hồi cho mã lỗi này.
        </div>
        <div class="ui info message" v-else>
          <i class="info circle icon"></i> Đọc nội dung phản hồi và nhập mã lỗi tương ứng.
        </div>

        <div class="field" :class="{ disabled: currentQuestion.type === 'guessValue' }">
          <label>Mã lỗi (Key)</label>
          <input 
            type="text" 
            v-model="inputKey" 
            :readonly="currentQuestion.type === 'guessValue'"
            placeholder="Nhập mã lỗi vào đây..."
            @keyup.enter="nextQuestion"
          />
        </div>

        <div class="field" :class="{ disabled: currentQuestion.type === 'guessKey' }">
          <label>Phản hồi mẫu (Value)</label>
          <textarea 
            v-model="inputValue" 
            :readonly="currentQuestion.type === 'guessKey'"
            rows="3"
            placeholder="Nhập nội dung phản hồi vào đây..."
          ></textarea>
        </div>

        <div style="margin-top: 20px;">
          <button 
            class="ui primary button" 
            @click="nextQuestion"
            :disabled="!isAnswerProvided"
          >
            {{ isLastQuestion ? 'Nộp bài' : 'Xác nhận & Câu tiếp' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../helper/helpers';

export default {
  name: 'quiz-typing-page',
  data() {
    return {
      tickets: [],
      loading: true,
      questions: [],
      currentIndex: 0,
      
      // 2 biến ràng buộc (v-model) cho 2 ô input
      inputKey: '',
      inputValue: '',
      
      answerHistory: [], // Lưu lịch sử làm bài để in ra bảng kết quả
      submitted: false
    };
  },
  async mounted() {
    const res = await api.getTickets();
    if (res?.success) {
      this.tickets = res.data;
      if (this.tickets.length > 0) this.buildQuiz();
    }
    this.loading = false;
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex] || {};
    },
    isLastQuestion() {
      return this.currentIndex === this.questions.length - 1;
    },
    // Kiểm tra xem user đã nhập chữ vào ô trống chưa để mở khóa nút Xác nhận
    isAnswerProvided() {
      if (this.currentQuestion.type === 'guessKey') {
        return this.inputKey.trim().length > 0;
      } else {
        return this.inputValue.trim().length > 0;
      }
    },
    score() {
      return this.answerHistory.filter(ans => ans.isCorrect).length;
    },
    scoreColor() {
      const percent = (this.score / this.questions.length) * 100;
      if (percent >= 80) return 'green';
      if (percent >= 50) return 'yellow';
      return 'red';
    }
  },
  methods: {
    buildQuiz() {
      const shuffled = [...this.tickets].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));

      this.questions = selected.map(ticket => {
        // Random 50/50 xem ô nào bị khóa
        const type = Math.random() > 0.5 ? 'guessKey' : 'guessValue';
        return {
          type,
          key: ticket.key,
          value: ticket.value
        };
      });

      this.currentIndex = 0;
      this.answerHistory = [];
      this.submitted = false;
      this.setupCurrentQuestion();
    },
    
    // Hàm này thiết lập giá trị hiển thị lên 2 ô input khi chuyển câu
    setupCurrentQuestion() {
      const q = this.currentQuestion;
      if (q.type === 'guessKey') {
        // Cho Value, ẩn Key
        this.inputValue = q.value;
        this.inputKey = ''; // Để trống cho user nhập
      } else {
        // Cho Key, ẩn Value
        this.inputKey = q.key;
        this.inputValue = ''; // Để trống cho user nhập
      }
    },

    nextQuestion() {
      if (!this.isAnswerProvided) return;

      const q = this.currentQuestion;
      let userAnswer = '';
      let correctAnswer = '';
      let givenText = '';

      // Logic chấm điểm: Loại bỏ khoảng trắng 2 đầu và chuyển về chữ thường để so sánh dễ hơn
      if (q.type === 'guessKey') {
        userAnswer = this.inputKey.trim();
        correctAnswer = q.key;
        givenText = q.value;
      } else {
        userAnswer = this.inputValue.trim();
        correctAnswer = q.value;
        givenText = q.key;
      }

      const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

      // Lưu lại lịch sử
      this.answerHistory.push({
        type: q.type,
        givenText,
        userAnswer,
        correctAnswer,
        isCorrect
      });

      // Chuyển câu hoặc nộp bài
      if (this.isLastQuestion) {
        this.submitted = true;
      } else {
        this.currentIndex++;
        this.setupCurrentQuestion(); // Reset lại 2 ô input cho câu mới
      }
    },

    restart() {
      this.buildQuiz();
    }
  }
};
</script>

<style scoped>
/* CSS làm mờ nhẹ ô bị khóa để tăng trải nghiệm người dùng */
.ui.form .field.disabled label {
  color: #888;
}
.ui.form .field.disabled input,
.ui.form .field.disabled textarea {
  background-color: #f9fafb;
  color: #555;
  border-color: #e0e1e2;
}
</style>