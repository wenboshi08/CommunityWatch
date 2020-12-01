<template>
  <!-- TABS -->
  <div class="col-md-4 h-auto">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active" v-on:click="changePage('main')" data-toggle="tab">Crimes</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" v-on:click="changePage('post')" data-toggle="tab">Post</a>
      </li>
    </ul>
    
    <!-- HEADERS -->
    <h2 v-if="page==='main'" class="mt-3">
      Crimes
    </h2>
    <h2 v-else-if="page==='post'" class="mt-3">
      Posts
    </h2>

    <!-- CRIME FILTERS -->
    <div class="btn-group">
        Neighborhood:  
        <button class="btn btn-secondary btn-sm dropdown-toggle  " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ neighbor }}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" v-for="n in neighborhoods" v-bind:key="n.id" v-on:click="changeNeighbor(n.neighborhood, n.id)">{{n.neighborhood}}</a>
        </div>
    </div>
    <div class="btn-group" v-if="page==='main'">
        Crime Type:  
        <button class="btn btn-secondary btn-sm dropdown-toggle  " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ type }}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" v-for="t in types" v-bind:key="t.id" v-on:click="changeType(t.crimeType, t.id)">{{t.crimeType}}</a>
        </div>
    </div>
    
    
    <div class="p-3 mb-2 bg-light text-dark overflow-auto" style="height: 500px">
        <div class="h-100 overflow-auto" v-if="crimes.length">
          <CrimeListItem
            v-for="crime in crimes"
            v-bind:key="crime.fileNumber + '' + crime.crimeType"
            v-bind:crime="crime"
          />
        </div>
        <div v-else>
          <p style="text-align: center;">There are no Freets to display. Create one today!</p>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CrimeListItem from "./CrimeListItem";
// import { eventBus } from "../main";

export default {
  name: "Feed",
  components: { CrimeListItem },

  data() {
    return {
      page: "main",
      type: "all",
      type_id: "0",
      neighbor: "all",
      neighbor_id: "0",
      types: [], 
      neighborhoods: [], 
      crimes: [],
      posts: [],
      userName: this.$cookie.get('fritter-auth'),
    };
  },

//   created: function() {
//     eventBus.$on("populate-popular", () => {
//       this.page = "popular";
//       this.clearMessages();
//       this.loadFreets();
//     });

  mounted: function() {
    this.loadNeighborhoods();
    this.loadTypes();
    this.getCrimes();
  },

  methods: {

    loadTypes: function() {
        axios.get("/api/crimes/types").then(response => {
            this.types = [{id: 0, crimeType: "all"}];
            this.types.push(...response.data.all);
        });
    },

    loadNeighborhoods: function() {
        axios.get("/api/neighborhoods").then(response => {
            this.neighborhoods = [{id: 0, neighborhood: "all"}];
            this.neighborhoods.push(...response.data.all);
        });
    },

    changePage: function(newPage) {
        this.page = newPage;
        this.getCrimes();
    },

    changeType: function(newType, id) {
        this.type = newType;
        this.type_id = id;
        this.getCrimes();
    },

    changeNeighbor: function(newNeighbor, id) {
        this.neighbor = newNeighbor;
        this.neighbor_id = id;
        this.getCrimes();
    },

    getCrimes: function() {
      if(this.page == "main") {
        axios.get("/api/crimes?type=" + this.type_id + "&neigh=" + this.neighbor_id).then(response => {
            this.crimes = [...response.data];
        });
      } else {
        this.crimes = [];
      } 
    },
  }
};
</script>
