<template>
  <div id="app">
    <!-- Navbar -->
    <div class="ui inverted segment navbar">
      <div class="ui center aligned container">
        <div class="ui large secondary inverted pointing menu compact">
      <!-- Tickets -->
      <router-link
        to="/tickets"
        class="item"
        exact-active-class="active"
      >
        <i class="list icon"></i>
        <span>Tickets</span>
      </router-link>

      <!-- New Ticket -->
      <router-link
        to="/tickets/new"
        class="item"
        exact-active-class="active"
      >
        <i class="plus circle icon"></i>
        <span>New Ticket</span>
      </router-link>
      <router-link to="/quiz" class="item">
        <i class="question circle icon"></i>
        <span>Training Quiz</span>
      </router-link>
      <router-link to="/quiz2" class="item">
        <i class="keyboard icon"></i>
        <span>Typing Quiz</span>
      </router-link>
      <router-link to="/about" class="item">
        <i class="info circle icon"></i>
        <span>About Me</span>
      </router-link>

    </div>
  </div>
</div>

<!-- Main Content -->
<div class="ui text container">
  <div class="ui one column grid">
    <div class="column">
      <router-view />
    </div>
  </div>
</div>

  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app > div.navbar {
  margin-bottom: 1.5em;
}
</style>
