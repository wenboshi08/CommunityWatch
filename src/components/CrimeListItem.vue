<template>
  <div class="card w-100 mt-3">
   <div class="card-body">
      <div class="float-right">
        {{ crime.reportDate }}
      </div>
      <div>
        <h5 class="card-title mt-4"> {{crime.crimeType}} </h5>
      </div>
      <div>
        <h6 class="card-subtitle text-muted"> {{ crime.location }} </h6>
      </div>
      <div>
        <h6 class="card-subtitle mt-3 text-muted">{{ crime.neighborhood }}</h6>
      </div>
    </div>
  </div>
  <!-- <div v-if='following'>
        <button type="button" class="float-right btn btn-outline-primary btn-sm" v-on:click="unfollow">Unfollow </button> -->
</template>
  
<script>
// import axios from "axios";
// import { eventBus } from "../main";

export default {
  name: "CrimeListItem",

  props: {
    crime: Object,
  },

  data() {
    return {
      following: false,
      user: this.$cookie.get('fritter-auth'),
    };
  },

  computed: {},

  methods: {
    follow: function() {
      this.following = true;
    },


    unfollow: function() {
      this.following = false;
    }
  },
};
</script>
