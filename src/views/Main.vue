<template>
  <div>
    <Navbar />
    <div class="row" style="margin: 20px">
      <div class="btn-group">
        Neighborhood:
        <button
          class="btn btn-secondary btn-sm dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ neighbor }}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a
            class="dropdown-item"
            v-for="n in neighborhoods"
            v-bind:key="n.id"
            v-on:click="changeNeighbor(n.neighborhood, n.id)"
            >{{ n.neighborhood }}</a
          >
        </div>
      </div>
      <div class="btn-group">
        Crime Type:
        <button
          class="btn btn-secondary btn-sm dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ type }}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a
            class="dropdown-item"
            v-for="t in types"
            v-bind:key="t.id"
            v-on:click="changeType(t.crimeType, t.id)"
            >{{ t.crimeType }}</a
          >
        </div>
      </div>
    </div>
    <div class="main h-auto">
      <Map v-bind:type_id="type_id" v-bind:neighbor_id="neighbor_id" />
      <Feed v-bind:type_id="type_id" v-bind:neighbor_id="neighbor_id" />
    </div>
  </div>
</template>

<script>
import Feed from "../components/Feed.vue";
import NeighborhoodList from "../components/NeighborhoodList.vue";
import CrimeList from "../components/CrimeList.vue";
import Navbar from "../components/Navbar.vue";
import Map from "../components/Map.vue";
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "Main",
  data: function () {
    return {
      type: "all",
      type_id: 0,
      neighbor: "all",
      neighbor_id: 0,
      types: [],
      neighborhoods: [],
    };
  },
  components: {
    NeighborhoodList,
    CrimeList,
    Map,
    Navbar,
    Feed,
  },
  mounted: function () {
    this.loadNeighborhoods();
    this.loadTypes();
  },
  methods: {
    loadTypes: function () {
      axios.get("/api/crimes/types").then((response) => {
        this.types = [{ id: 0, crimeType: "all" }];
        this.types.push(...response.data.all);
      });
    },

    loadNeighborhoods: function () {
      axios.get("/api/neighborhoods").then((response) => {
        this.neighborhoods = [{ id: 0, neighborhood: "all" }];
        this.neighborhoods.push(...response.data.all);
      });
    },

    changeType: function (newType, id) {
      this.type = newType;
      this.type_id = id;
      eventBus.$emit("changeType-success", true);
    },

    changeNeighbor: function (newNeighbor, id) {
      this.neighbor = newNeighbor;
      this.neighbor_id = id;
      eventBus.$emit("changeNeighbor-success", true);
    },
  },
};
</script>
