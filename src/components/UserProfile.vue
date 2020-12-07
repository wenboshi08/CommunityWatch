<template>
    <div class = "main4" id="user-profile">
        
        <div v-if="isSignedIn" >
            <div class="">
                <div style="text-align: center; margin:0px"> Signed in as <i>{{this.$cookie.get('commwatch-auth')}} </i></div>
                <SignOut/>
            </div>
            <div class="form-container">
                <div style="text-align: center; margin:2px; color: black; font-size:2em "> Account settings</div>
                <div class="four wide column">
                    <img class="ui tiny avatar image" src="https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm">
                </div>
                <ChangeUserCredentials/>
                <div class = "danger">
                    Danger zone<br>Warning: This action is not reversible!
                    <DeleteAccount/>
                </div>
            </div>
        </div>
        <div v-else class="form-container2">
            <template >
                <b-navbar-item tag="router-link" :to="{ path: '/account' }">
                    <a class="button is-light">
                    <strong>Please sign in or sign up</strong>
                    </a>
                </b-navbar-item>
            </template>
        </div>
        <div v-if='error' class="error-message">
            {{ error }}
        </div>
        <div v-if='messages.length' class="success-message" style="text-align:center;">
            <div v-for='message in messages' v-bind:key='message.id'>{{ message }}</div>
        </div>
    </div>
</template>
<script>
    import ChangeUserCredentials from "./ChangeUserCredentials.vue";
    import SignOut from "./SignOut.vue";
    import DeleteAccount from "./DeleteAccount.vue";
    
    // import axios from "axios";
    import { eventBus } from "../main";
    
    export default {
      name: "UserProfile",
    
      components: {
        ChangeUserCredentials,
        SignOut,
        DeleteAccount,
      },
    
      data() {
        return {
          isSignedIn: false,
          messages: [],
          error : "",
          followers: [],
          following: []
        };
      },
    
      created: function() {
        let authenticated = this.$cookie.get('commwatch-auth');
        if (authenticated) {
          this.isSignedIn = true;
    
        }
    
    
    
        eventBus.$on("change-username-success", () => {
          this.$cookie.set('commwatch-auth', '');
          this.$cookie.set('commwatch-auth-id', '');

          this.isSignedIn = false;
          this.messages.push(`Your username was successfully changed! Please sign in again.`);
          this.clearMessages();
    
        });
    
        eventBus.$on("change-password-success", () => {
          this.$cookie.set('commwatch-auth', '');
          this.$cookie.set('commwatch-auth-id', '');

          this.isSignedIn = false;
          this.messages.push(`Your password was successfully changed! Please sign in again.`);
          this.clearMessages();
    
        });
    
        eventBus.$on("signout-success", () => {
          this.$cookie.set('commwatch-auth', '');
          this.$cookie.set('commwatch-auth-id', '');

          this.isSignedIn = false;
          // this.messages.push("You have been signed out!");
          // this.clearMessages();
        });
    
      },
    
      methods: {
    
        clearMessages: function() {
          setInterval(() => {
            this.messages = [];
          }, 5000);
        },
    
      },
    
      beforeDestroy() {
    
       },
    };
</script>