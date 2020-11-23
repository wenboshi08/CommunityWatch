<template>
  <div>
    <form id="changeName" class='component' v-on:submit.prevent="changeUsername" method="post">
      <input id='username' v-model.trim='username' type='text' name='username' placeholder="New username"> <br>
      <input type='submit' value='Change username' class="button">
    </form>

    <br>

    <form id="changePass" class='component' v-on:submit.prevent="changePassword" method="post">
      <input id='password' v-model.trim='password' type='text' name='password' placeholder="New password"> <br>
      <input type='submit' value='Change password' class="button">
    </form>

    <div v-if='errors.length' class="error-message" style="width: 250px;">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for='error in errors' v-bind:key='error.id'>{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "change",

  data() {
    return {
      errors: [],
      username: "",
      password: ""
    }
  },

  methods: {
    changeUsername: function() {
      const bodyContent = { username: this.username};
        axios
          .put("/api/users", bodyContent)
          .then(() => {
            // handle success
            eventBus.$emit('change-username-success', true);

            eventBus.$emit('trigger-signout', true);

            
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
    },

    changePassword: function() {
      const bodyContent = { password: this.password};
        axios
          .put("/api/users/password", bodyContent)
          .then(() => {
            // handle success
            eventBus.$emit('change-password-success', true);

            eventBus.$emit('trigger-signout', true);

            
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
    },

    resetForm: function() {
      this.username = "";
      this.password = "";
    },

    clearMessages: function() {
      setInterval(() => {
        this.errors = [];
      }, 5000);
    }
  }
}
</script>

<style scoped>
form {
  width: fit-content;
}

input[type="text"],
input[type="url"] {
  width: 15rem;
}
</style>