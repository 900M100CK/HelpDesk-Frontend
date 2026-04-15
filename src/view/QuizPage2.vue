<template>
  <div class="ui container" style="margin-top: 20px">
    <h1 class="ui header">
      Staff Training Quiz: Typing Mode
      <div class="sub header">Fill in the blanks</div>
    </h1>

    <div v-if="loading" class="ui active inline loader"></div>

    <div v-else-if="tickets.length === 0" class="ui warning message">
      <p>Don't have any tickets available.</p>
    </div>

    <div v-else-if="submitted" class="ui segment">
      <h2 class="ui header" :class="scoreColor">
        Score: {{ score }} / {{ questions.length }}
      </h2>
      
      <table class="ui celled table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ans, i) in answerHistory" :key="i" :class="{ positive: ans.isCorrect, negative: !ans.isCorrect }">
            <td>
              <div class="ui ribbon label" :class="ans.type === 'guessKey' ? 'teal' : 'blue'">
                {{ ans.type === 'guessKey' ? 'Choose Value -> Find Key' : 'Choose Key -> Find Value' }}
              </div>
              <br/>
              <i>{{ ans.givenText }}</i>
            </td>
            <td><strong>{{ ans.userAnswer || '(Empty)' }}</strong></td>
            <td>{{ ans.correctAnswer }}</td>
            <td>
              <i class="icon" :class="ans.isCorrect ? 'check green large' : 'times red large'"></i>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="ui primary button" @click="restart">Take a Quiz Again</button>
    </div>

    <div v-else>
      <div class="ui message">
        Câu {{ currentIndex + 1 }} / {{ questions.length }}
        <span class="ui right floated basic label">
          Task: {{ currentQuestion.type === 'guessKey' ? 'Find the Error Code' : 'Find the Response' }}
        </span>
      </div>

      <div class="ui padded segment form">
        <div class="ui info message" v-if="currentQuestion.type === 'guessValue'">
          <i class="info circle icon"></i> Please enter the correct response for this error code.
        </div>
        <div class="ui info message" v-else>
          <i class="info circle icon"></i> Read the response and enter the corresponding error code.
        </div>

        <div class="field" :class="{ disabled: currentQuestion.type === 'guessValue' }">
          <label>error code (Key)</label>
          <input 
            type="text" 
            v-model="inputKey" 
            :readonly="currentQuestion.type === 'guessValue'"
            placeholder="input key here..."
            @keyup.enter="nextQuestion"
          />
        </div>

        <div class="field" :class="{ disabled: currentQuestion.type === 'guessKey' }">
          <label>Response (Value)</label>
          <textarea 
            v-model="inputValue" 
            :readonly="currentQuestion.type === 'guessKey'"
            rows="3"
            placeholder="input response here..."
          ></textarea>
        </div>

        <div style="margin-top: 20px;">
          <button 
            class="ui primary button" 
            @click="nextQuestion"
            :disabled="!isAnswerProvided"
          >
            {{ isLastQuestion ? 'Submit' : 'Confirm & Next Question' }}
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
      
    
      inputKey: '',
      inputValue: '',
      
      answerHistory: [],
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
        // Random 50/50 
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
    
    setupCurrentQuestion() {
      const q = this.currentQuestion;
      if (q.type === 'guessKey') {
        // given Value, hide Key
        this.inputValue = q.value;
        this.inputKey = ''; 
      } else {
        // given Key, hide Value
        this.inputKey = q.key;
        this.inputValue = ''; 
      }
    },

    nextQuestion() {
      if (!this.isAnswerProvided) return;

      const q = this.currentQuestion;
      let userAnswer = '';
      let correctAnswer = '';
      let givenText = '';

      // Logic to grade: delete extra spaces and ignore case
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

      // save history
      this.answerHistory.push({
        type: q.type,
        givenText,
        userAnswer,
        correctAnswer,
        isCorrect
      });

      // change question or submit
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