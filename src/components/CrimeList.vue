<template>
  <div class="subcontainer">
<<<<<<< HEAD
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
=======
    <div class="header secondary-header">crimes</div>
    <div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="crimes-container">
        <form style="display: inline-flex">
          <label for="crimeType">Filter by crime type:</label>
          <select
            name="crimeTypes"
            id="crimeTypeFilter"
            v-on:change="crimeFilterChange"
          >
            <option value="All">All</option>
            <option value="Auto Theft">Auto Theft</option>
            <option value="Hit and Run">Hit and Run</option>
            <option value="Shoplifting">Shoplifting</option>
            <option value="Larceny from MV">Larceny from MV</option>
          </select>
        </form>
        <form style="display: inline-flex">
          <label for="neighborhood">Filter by neighborhood:</label>
          <select
            name="neighborhoods"
            id="neighborhoodFilter"
            v-on:change="neighborhoodFilterChange"
          >
            <option value="All">All</option>
            <option value="North Cambridge">North Cambridge</option>
            <option value="West Cambridge">West Cambridge</option>
            <option value="Peabody">Peabody</option>
            <option value="Straberry Hill">Straberry Hill</option>
            <option value="Area 4">Area 4</option>
          </select>
        </form>
        <div v-if="crimes.length">
          <CrimeListItem
            v-for="crime in crimes"
            v-bind:key="crime.fileNumber + '' + crime.crimeType"
>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
            v-bind:crime="crime"
          />
        </div>
        <div v-else>
<<<<<<< HEAD
          <p style="text-align: center;">There are no crimes to display!</p>
=======
          <p style="text-align: center">There are no crimes to display!</p>
>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CrimeListItem from "./CrimeListItem";
<<<<<<< HEAD

// import { eventBus } from "../main";

export default {
  name: "CrimeList",

  components: { CrimeListItem },


=======
import { eventBus } from "../main";

export default {
  name: "CrimeList",
  components: { CrimeListItem },

>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
  data() {
    return {
      error: "",
      success: "",
<<<<<<< HEAD
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
=======
      crimes: [],
      crimeFilterVal: "All",
      neighborhoodFilterVal: "All",
    };
  },

  created: function () {
    eventBus.$on("crimeFilterChangeSuccess", () => {
      axios.get("/api/crimes/").then((response) => {
        this.crimes = [...response.data];
        this.updateCrimes();
      });
    });
    eventBus.$on("neighborhoodFilterChangeSuccess", () => {
      axios.get("/api/crimes/").then((response) => {
        this.crimes = [...response.data];
        this.updateCrimes();
      });
    });
  },

  mounted: function () {
    this.loadCrimes();
  },

  methods: {
    crimeFilterChange: function () {
      let crimeFilter = document.getElementById("crimeTypeFilter");
      this.crimeFilterVal = crimeFilter.value;
      eventBus.$emit("crimeFilterChangeSuccess", true);
    },
    neighborhoodFilterChange: function () {
      let neighborhoodFilter = document.getElementById("neighborhoodFilter");
      this.neighborhoodFilterVal = neighborhoodFilter.value;
      eventBus.$emit("neighborhoodFilterChangeSuccess", true);
    },
    loadCrimes: function () {
      axios.get("/api/crimes/").then((response) => {
        this.crimes = [...response.data];
      });
    },
    updateCrimes: async function () {
      if (
        this.crimeFilterVal !== "All" &&
        this.neighborhoodFilterVal !== "All"
      ) {
        this.crimes = this.crimes.filter(
          (c) =>
            c.crimeType === this.crimeFilterVal &&
            c.neighborhood === this.neighborhoodFilterVal
        );
      } else if (this.crimeFilterVal !== "All") {
        this.crimes = this.crimes.filter(
          (c) => c.crimeType === this.crimeFilterVal
        );
      } else if (this.neighborhoodFilterVal !== "All") {
        console.log(this.neighborhoodFilterVal);
        this.crimes = this.crimes.filter(
          (c) => c.neighborhood === this.neighborhoodFilterVal
        );
        console.log(this.crimes);
      } else {
        this.loadCrimes();
      }
    },
    clearMessages: function () {
>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
      setInterval(() => {
        this.success = "";
        this.error = "";
      }, 5000);
<<<<<<< HEAD
    }
  }
};
</script>
=======
    },
  },
};
</script>
>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
