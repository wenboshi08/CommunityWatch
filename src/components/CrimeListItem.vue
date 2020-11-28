    <!-- <div class="crime-container">
      <div class="crime-name">
        {{ crime.crimeType }} <br />
        {{ crime.location }} <br />
        {{ crime.neighborhood }} <br />
        {{ crime.fileNumber }} <br />
        {{ crime.reportDate }}
      </div>
    </div> -->
<template>
  <div class="card w-100 mt-3">
   <div class="card-body">
    
    <!-- Time -->
    <div class="float-right">
      {{ crime.reportDate }}
    </div>
    
    <!-- Follow/Unfollow -->
    
    <div>
      <h5 class="card-title mt-4"> {{crime.crimeType}} </h5>
    </div>
    <div>
     <h6 class="card-subtitle text-muted"> {{ crime.location }} </h6>
    </div>
    <div v-if='true'>
        <button type="button" class="float-right btn btn-outline-primary btn-sm" v-on:click="unfollow">Unfollow </button>
      </div>
      <div v-else>
        <button type="button" class="float-right btn btn-outline-primary btn-sm" v-on:click="follow">Follow </button>
      </div>
    <div>
     <h6 class="card-subtitle mt-3 text-muted"> {{ crime.neighborhood }} </h6>
     
    </div>

    <!-- Freet Content -->
    <!-- <div v-if='editing'>
      <textarea class="form-control w-100" v-model.trim='content' type="text" name="content" placeholder="Update Freet"></textarea>
    </div>
    <div v-else>
      <h5 class="card-title">{{ freet.content }}</h5>
    </div>
    <div v-if='freet.originalAuthor===undefined'>
      <h6 class="card-subtitle mt-3 text-muted"> By: {{ freet.author }}</h6>
    </div>
    <div v-else>
      <h6 class="card-subtitle mt-3 text-muted"> Refreeted by: {{ freet.author }}. Original by: {{ freet.originalAuthor }}</h6>
    </div> -->

    <!-- Upvote/Refreet -->
    <!-- <div v-if='freet.upvotesIds.includes(userId)' class="upvoter">
      <p>Upvotes: {{ freet.votes }}</p>
      <a class="card-link" v-on:click="downvoteFreet">Downvote</a>
      <a class="card-link" v-on:click="getUpvoters">See upvotes</a>
      <a class="card-link" v-on:click="refreet">Refreet</a>
    </div>
    <div v-else class="upvoter">
      <p>Upvotes: {{ freet.votes }}</p>
      <a class="card-link" v-on:click="upvoteFreet">Upvote</a>
      <a class="card-link" v-on:click="getUpvoters">See upvotes</a>
      <a class="card-link" v-on:click="refreet">Refreet</a>
    </div> -->

    </div>
  </div>
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
    return {};
  },

  computed: {},

  methods: {},
};
</script>
