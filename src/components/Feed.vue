<template>
  <!-- TABS -->
  <div class="col-md-4 h-auto">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link active"
          v-on:click="changePage('main')"
          data-toggle="tab"
          >Crimes</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" v-on:click="changePage('post')" data-toggle="tab"
          >Post</a
        >
      </li>
    </ul>
    <!-- HEADERS -->
    <div v-if="page === 'main'">
      <h2 class="mt-3">Crimes</h2>
      <div
        class="p-3 mb-2 bg-light text-dark overflow-auto"
        style="height: 500px"
      >
        <div class="h-100 overflow-auto" v-if="crimes.length">
          <CrimeListItem
            v-for="crime in crimes"
            v-bind:key="crime.fileNumber + '' + crime.crimeType"
            v-bind:crime="crime"
          />
        </div>
        <div v-else>
          <p style="text-align: center">
            There are no Freets to display. Create one today!
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="page === 'post'">
      <h2 class="mt-3">Posts</h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CrimeListItem from "./CrimeListItem";
import { eventBus } from "../main";

export default {
  name: "Feed",
  components: { CrimeListItem },
  props: {
    type_id: Number,
    neighbor_id: Number,
  },
  data() {
    return {
      page: "main",
      types: [],
      neighborhoods: [],
      crimes: [],
      posts: [],
      userName: this.$cookie.get("fritter-auth"),
    };
  },
  created: function () {
    this.getCrimes();

    eventBus.$on("changeType-success", () => {
      this.getCrimes();
    });

    eventBus.$on("changeNeighbor-success", () => {
      this.getCrimes();
    });
  },
  mounted: function () {
    this.getCrimes();
  },
  methods: {
    changePage: function (newPage) {
      this.page = newPage;
      if (this.page == "main") {
        this.getCrimes();
      }
    },

    getCrimes: async function () {
      let that = await this;
      axios
        .get(
          `/api/crimes?type=${that.$props.type_id}&neigh=${that.$props.neighbor_id}`
        )
        .then((response) => {
          that.crimes = [...response.data];
        });
    },
  },
};
</script>
