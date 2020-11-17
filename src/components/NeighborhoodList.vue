<template>
  <div class="subcontainer">
    <div class="header secondary-header">
      neighborhoods
    </div>
    <div>
      <div v-if='success' class="success-message">
        {{ success }}
      </div>
      <div v-if='error' class="error-message">
        {{ error }}
      </div>
<!--       {{neighborhoods}}
 -->      <div class="neighborhoods-container">  
        <div v-if="neighborhoods.length">
          <NeighborhoodListItem
            v-for="neighborhood in neighborhoods"
            v-bind:key="neighborhood.id"
            v-bind:neighborhood="neighborhood"
          />
        </div>
        <div v-else>
          <p style="text-align: center;">There are no neighborhoods to display!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NeighborhoodListItem from "./NeighborhoodListItem";

// import { eventBus } from "../main";

export default {
  name: "NeighborhoodList",

  components: { NeighborhoodListItem },

  data() {
    return {
      error: "",
      success: "",
      neighborhoods: []
    };
  },

  created: function() {
   
 
  },

  mounted: function() {
    this.loadNeighborhoods();
  },

  methods: {
    loadNeighborhoods: function() {
      axios.get("/api/neighborhoods").then(response => {
        this.neighborhoods = response.data.all;
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
