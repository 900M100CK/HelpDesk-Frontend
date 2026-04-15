<template>
  <section class="about-page">
    <div class="ui raised very padded text container segment">
      <p class="about-label">About Me</p>
      <h1>Helpdesk Knowledge System</h1>
      <p class="about-lead">
        I built this system to manage helpdesk knowledge in a simple and practical way.
        It allows users to create, update, search, and review support tickets in one place,
        making daily support work faster and more consistent.
      </p>

      <div class="ui relaxed list about-points">
        <div class="item">
          <i class="check circle icon"></i>
          <div class="content">
            Store reusable ticket responses with a clear key, category, and priority level.
          </div>
        </div>
        <div class="item">
          <i class="check circle icon"></i>
          <div class="content">
            Search knowledge quickly so common issues can be answered without repeating manual work.
          </div>
        </div>
        <div class="item">
          <i class="check circle icon"></i>
          <div class="content">
            Edit and organize existing tickets to keep support content accurate and easy to maintain.
          </div>
        </div>
        <div class="item">
          <i class="check circle icon"></i>
          <div class="content">
            Practice with training quizzes that help users remember ticket categories and response content.
          </div>
        </div>
      </div>

      <p class="about-footer">
        Overall, this project is designed as a lightweight helpdesk support platform that improves
        response speed, knowledge reuse, and staff training.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'about-me'
};
</script>

<style scoped>
.about-page {
  padding: 1rem 0;
}

.about-label {
  margin-bottom: 0.75rem;
  color: #0f766e;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.about-lead,
.about-footer {
  font-size: 1.05rem;
  line-height: 1.7;
}

.about-points {
  margin: 2rem 0;
}

.about-points .item {
  margin-bottom: 1rem;
}
</style>