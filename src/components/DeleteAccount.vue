<template>
  <div id="delete-account" >
    <button class="delete-account" v-on:click="deleteAccount" >Delete Account</button>
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