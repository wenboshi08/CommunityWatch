<template>
  <div class="subcontainer">
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
            v-bind:crime="crime"
          />
        </div>
        <div v-else>
          <p style="text-align: center">There are no crimes to display!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CrimeListItem from "./CrimeListItem";
import { eventBus } from "../main";

export default {
  name: "CrimeList",
  components: { CrimeListItem },

  data() {
    return {
      error: "",
      success: "",
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
      setInterval(() => {
        this.success = "";
        this.error = "";
      }, 5000);
    },
  },
};
</script>
