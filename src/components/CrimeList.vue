<template>
  <div class="subcontainer">
    <div class="header secondary-header">
      Crimes
    </div>
    <div>
      <div v-if='success' class="success-message">
        {{ success }}
      </div>
      <div v-if='error' class="error-message">
        {{ error }}
      </div>
        <div class="neighborhood-container">  
        <div v-if="crimes.length">
          <CrimeListItem
            v-for="crime in crimes"
            v-bind:key="crime.fileNumber"
            v-bind:crime="crime"
          />
        </div>
        <div v-else>
          <p style="text-align: center;">There are no crimes to display!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CrimeListItem from "./CrimeListItem";

// import { eventBus } from "../main";

export default {
  name: "CrimeList",

  components: { CrimeListItem },


  data() {
    return {
      error: "",
      success: "",
      crimes: []
    };
  },

  created: function() {
   
 
  },

  mounted: function() {
    this.loadNeighborhoods();
  },

  methods: {
    loadNeighborhoods: function() {
      axios.get("/api/crimes").then(response => {
        this.crimes = response.data;
      });
    },

    clearMessages: function() {
      setInterval(() => {
        this.success = "";
        this.error = "";
      }, 5000);
    }
  }
};
</script>