<template>
  <div id="delete-account">
  <a href="#" v-on:click="deleteAccount" class="deleteButton">Delete Account</a>
    
  </div>

</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "DeleteAccount",
  
  methods: {
    deleteAccount: function() {
      axios.delete('api/users/')
        .then(() => {
          // handle success
          eventBus.$emit('deleteuser-success', true);
          eventBus.$emit('trigger-signout', true);
        })
        .catch(() => {
          // Still sign User out so they have to sign in again.
          eventBus.$emit('trigger-signout', true);
        })
    }
  },

}
</script>