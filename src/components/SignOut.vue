<template>
  <div id="sign-out" >
    <button class="button is-light" v-on:click="signOut" >Sign Out</button>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "SignOut",
  
  methods: {
    signOut: function() {
      axios.delete('api/users/session')
        .then(() => {
          // handle success
          eventBus.$emit('signout-success', true);
        })
        .catch(() => {
          // Still sign User out so they have to sign in again.
          eventBus.$emit('signout-success', true);
        })
    }
  },

  mounted: function() {
    eventBus.$on('trigger-signout',  () => {this.signOut();});
    
  },

  beforeDestroy() {
    eventBus.$off('trigger-signout');
   },
}
</script>