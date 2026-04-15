<template>
  <div class="ui container" style="margin-top: 20px">
    <h1 class="ui header">
      Staff Training Quiz
      <div class="sub header">Quiz for response handling of Helpdesk Tickets</div>
    </h1>

    <div v-if="loading" class="ui active inline loader"></div>

    <div v-else-if="tickets.length < 4" class="ui warning message">
      <p>Need at least 4 tickets in the system to create a quiz (for 4 answer options). Currently there are {{ tickets.length }} tickets.</p>
      <router-link to="/tickets/new" class="ui button positive">
        Create More Tickets
      </router-link>
    </div>

    <div v-else-if="submitted" class="ui segment">
      <h2 class="ui header" :class="scoreColor">
        Result: {{ score }} / {{ questions.length }} correct
      </h2>
      <div class="ui indicating progress" :data-percent="scorePercent">
        <div class="bar" :style="{ width: scorePercent + '%', background: scoreBarColor }">
          <div class="progress">
            <i :class="['icon', scoreIcon, scoreIconColor]"></i>
            {{ scorePercent }}%
          </div>
        </div>
      </div>

      <table class="ui celled table" style="margin-top: 20px">
        <thead>
          <tr>
            <th>Question Type</th>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(q, i) in questions" :key="i">
            <td>
              <span class="ui label" :class="q.type === 'guessValue' ? 'blue' : 'teal'">
                {{ q.type === 'guessValue' ? 'Find the Response' : 'Find the Error Code' }}
              </span>
            </td>
            <td><strong>{{ q.questionText }}</strong></td>
            <td>{{ answers[i] || '(Empty)' }}</td>
            <td>{{ q.correctAnswer }}</td>
            <td>
              <span v-if="answers[i] === q.correctAnswer" class="ui green label">✓ Correct</span>
              <span v-else class="ui red label">✗ Incorrect</span>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="ui primary button" style="margin-top: 15px" @click="restart">
        Take a Quiz Again
      </button>
    </div>

    <div v-else>
      <div class="ui message">
        Câu {{ currentIndex + 1 }} / {{ questions.length }} 
        <span class="ui right floated basic label">
          Loại: {{ currentQuestion.type === 'guessValue' ? 'give code - choose answer' : 'give answer - choose code' }}
        </span>
      </div>

      <div class="ui padded segment">
        <h3>{{ currentQuestion.questionLabel }}: <span class="ui blue label large">{{ currentQuestion.questionText }}</span></h3>
        <p style="margin-top: 10px; color: gray">
          Category: {{ currentQuestion.category }} | Priority: {{ currentQuestion.priority }}
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
            {{ isLastQuestion ? 'Submit' : 'Next Question' }}
          </button>
          <button class="ui button" @click="restart">Shuffle & Restart</button>
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
      if (this.tickets.length >= 4) {
        this.buildQuiz();
      }
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
      return this.questions.filter((q, i) => this.answers[i] === q.correctAnswer).length;
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
    },
    scoreIcon() {
      if (this.scorePercent >= 80) return 'trophy';
      if (this.scorePercent >= 50) return 'thumbs up';
      return 'times circle';
    },
    scoreIconColor() {
      if (this.scorePercent >= 80) return 'green';
      if (this.scorePercent >= 50) return 'yellow';
      return 'red';
    }
  },
  methods: {
    buildQuiz() {
      
      const shuffled = [...this.tickets].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));

      this.questions = selected.map(ticket => {
        
        const isGuessValue = Math.random() > 0.5;

        let questionLabel, questionText, correctAnswer, wrongOptions;

        if (isGuessValue) {
          // CHẾ ĐỘ 1: Cho Key, tìm Value
          questionLabel = 'Mã lỗi (Key)';
          questionText = ticket.key;
          correctAnswer = ticket.value;
          
          wrongOptions = this.tickets
            .filter(t => t._id !== ticket._id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(t => t.value);
        } else {
          // CHẾ ĐỘ 2: Cho Value, tìm Key
          questionLabel = 'Phản hồi mẫu (Value)';
          questionText = ticket.value;
          correctAnswer = ticket.key;
          
          wrongOptions = this.tickets
            .filter(t => t._id !== ticket._id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(t => t.key);
        }

        const options = [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5);

        return {
          type: isGuessValue ? 'guessValue' : 'guessKey',
          questionLabel,
          questionText,
          correctAnswer,
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