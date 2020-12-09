<template>
  <div id="app">
    <!-- Set name or it defaults to '/' in router.js -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
  beforeCreate: function() {
    let authenticated = this.$cookie.get('commwatch-auth');
    if (!authenticated) {
      this.$router.push("/");
    }
  }
};
</script>

<!-- global styles -->
<style>
* {
  box-sizing: border-box;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: white;
}

.success-message {
  color: green;
  margin: auto;
}

.error-message {
  color: red;
  margin: auto;
}
</style>