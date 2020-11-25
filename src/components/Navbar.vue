<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    src="../../imgs/logo_commwatch.png"
                    alt="Community Watch, keeping communities safe" 
                    >
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item tag="router-link" :to="{path: '/'}"><b>Community Watch</b></b-navbar-item>
            <b-navbar-item tag="router-link" :to="{path: '/myneighborhood'}"><b>My Neighborhood</b></b-navbar-item>
        </template>
        <template slot="end">
            <div v-if="isSignedIn">
                <div class="small-headline-container">
                <div style="text-align: center; font-size: 1.1em; padding: 25px"> Signed in as <i>{{this.$cookie.get('commwatch-auth')}} </i></div>
            </div>
            </div>
            <b-navbar-item tag="router-link" :to="{ path: '/account' }">
                <font-awesome-icon 
                    icon="user" 
                    size="2x" >
                </font-awesome-icon>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>
<script>
import { eventBus } from "../main";

    export default {
      name: "NavBar",
      data() {
        return {
          isSignedIn: false,
          
        }
      },
      created: function() {
          let authenticated = this.$cookie.get('commwatch-auth');
          if (authenticated) {
            this.isSignedIn = true;
          }
          eventBus.$on('signin-success', () => {this.isSignedIn=true});
          eventBus.$on('signout-success', () => {this.isSignedIn=false});
          eventBus.$on('deleteuser-success', () => {this.isSignedIn=false});
  }
    };
</script>
<style scoped>
    .nav-icon-container {
    width: 20px;
    height: 20px;
    display: inline-block;
    }
    .nav-icon-container img {
    width: inherit;
    height: inherit;
    }
</style>