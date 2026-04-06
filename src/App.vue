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
```

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
