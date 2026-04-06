<template>
  <div class="ui container" style="margin-top: 20px">
    <h1 class="ui header">
      Staff Training Quiz
      <div class="sub header">Ghép mã lỗi với phản hồi đúng</div>
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="ui active inline loader"></div>

    <!-- Không có ticket -->
    <div v-else-if="tickets.length === 0" class="ui warning message">
      <p>Chưa có ticket nào trong hệ thống để tạo quiz.</p>
      <router-link to="/tickets/new" class="ui button positive">
        Tạo ticket đầu tiên
      </router-link>
    </div>

    <!-- Kết quả -->
    <div v-else-if="submitted" class="ui segment">
      <h2 class="ui header" :class="scoreColor">
        Kết quả: {{ score }} / {{ questions.length }} đúng
      </h2>
      <div class="ui indicating progress" :data-percent="scorePercent">
        <div class="bar" :style="{ width: scorePercent + '%', background: scoreBarColor }">
          <div class="progress">{{ scorePercent }}%</div>
        </div>
      </div>

      <table class="ui celled table" style="margin-top: 20px">
        <thead>
          <tr>
            <th>Mã lỗi</th>
            <th>Câu trả lời của bạn</th>
            <th>Đáp án đúng</th>
            <th>Kết quả</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(q, i) in questions" :key="i">
            <td><strong>{{ q.key }}</strong></td>
            <td>{{ answers[i] || '(bỏ trống)' }}</td>
            <td>{{ q.value }}</td>
            <td>
              <span v-if="answers[i] === q.value" class="ui green label">✓ Đúng</span>
              <span v-else class="ui red label">✗ Sai</span>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="ui primary button" style="margin-top: 15px" @click="restart">
        Làm lại
      </button>
    </div>

    <!-- Quiz -->
    <div v-else>
      <!-- Tiến độ -->
      <div class="ui message">
        Câu {{ currentIndex + 1 }} / {{ questions.length }}
      </div>

      <!-- Câu hỏi hiện tại -->
      <div class="ui padded segment">
        <h3>Mã lỗi: <span class="ui blue label large">{{ currentQuestion.key }}</span></h3>
        <p style="margin-top: 10px; color: gray">
          Category: {{ currentQuestion.category }} |
          Priority: {{ currentQuestion.priority }}
        </p>

        <div style="margin-top: 15px">
          <div
            v-for="(option, i) in currentOptions"
            :key="i"
            class="ui segment"
            :class="{ 'secondary': selectedAnswer === option }"
            style="cursor: pointer; margin-bottom: 8px"
            @click="selectAnswer(option)"
          >
            <input
              type="radio"
              :id="'option-' + i"
              :value="option"
              v-model="selectedAnswer"
              style="margin-right: 10px"
            />
            <label :for="'option-' + i" style="cursor: pointer">{{ option }}</label>
          </div>
        </div>

        <div style="margin-top: 15px; display: flex; gap: 10px">
          <button
            class="ui primary button"
            :disabled="!selectedAnswer"
            @click="nextQuestion"
          >
            {{ isLastQuestion ? 'Nộp bài' : 'Câu tiếp theo' }}
          </button>
          <button class="ui button" @click="restart">Bắt đầu lại</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../helper/helpers';

export default {
  name: 'quiz-page',
  data() {
    return {
      tickets: [],
      loading: true,
      questions: [],
      answers: [],
      currentIndex: 0,
      selectedAnswer: null,
      submitted: false
    };
  },
  async mounted() {
    const res = await api.getTickets();
    if (res?.success) {
      this.tickets = res.data;
      this.buildQuiz();
    }
    this.loading = false;
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex] || {};
    },
    currentOptions() {
      return this.currentQuestion.options || [];
    },
    isLastQuestion() {
      return this.currentIndex === this.questions.length - 1;
    },
    score() {
      return this.questions.filter((q, i) => this.answers[i] === q.value).length;
    },
    scorePercent() {
      if (!this.questions.length) return 0;
      return Math.round((this.score / this.questions.length) * 100);
    },
    scoreColor() {
      if (this.scorePercent >= 80) return 'green';
      if (this.scorePercent >= 50) return 'yellow';
      return 'red';
    },
    scoreBarColor() {
      if (this.scorePercent >= 80) return '#21ba45';
      if (this.scorePercent >= 50) return '#fbbd08';
      return '#db2828';
    }
  },
  methods: {
    buildQuiz() {
      // Shuffle tickets và lấy tối đa 10 câu
      const shuffled = [...this.tickets].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));

      // Với mỗi câu, tạo 4 lựa chọn: 1 đúng + 3 sai ngẫu nhiên từ các ticket khác
      this.questions = selected.map(ticket => {
        const wrongOptions = this.tickets
          .filter(t => t._id !== ticket._id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(t => t.value);

        const options = [...wrongOptions, ticket.value]
          .sort(() => Math.random() - 0.5);

        return {
          key: ticket.key,
          value: ticket.value,
          category: ticket.category,
          priority: ticket.priority,
          options
        };
      });

      this.answers = new Array(this.questions.length).fill(null);
      this.currentIndex = 0;
      this.selectedAnswer = null;
      this.submitted = false;
    },
    selectAnswer(option) {
      this.selectedAnswer = option;
    },
    nextQuestion() {
      if (!this.selectedAnswer) return;

      this.answers[this.currentIndex] = this.selectedAnswer;
      this.selectedAnswer = null;

      if (this.isLastQuestion) {
        this.submitted = true;
      } else {
        this.currentIndex++;
      }
    },
    restart() {
      this.buildQuiz();
    }
  }
};
</script>

<style scoped>
.ui.segment:hover {
  background-color: #f0f4ff;
}
</style>