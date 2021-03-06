<template>
  <div>
    <Navbar />
    <div v-if="navPage === 'account'">
      <Account />
    </div>
    <div v-else>
      <div class="row" style="margin-left: 50px; margin-top: 20px; font-size:20pt">{{title}}</div>
      <div class="row" style="margin-left: 50px; margin-top: 20px">
        <div class="btn-group">
          <span style="margin-right: 5px">Crime Type:</span>
          <button
            class="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style="margin-left: 5px; margin-right: 5px"
          >
            {{ type }}
          </button>
          <div
            class="dropdown-menu pre-scrollable"
            aria-labelledby="dropdownMenuButton"
          >
            <a
              class="dropdown-item"
              v-for="t in types"
              v-bind:key="t.id"
              v-on:click="changeType(t.crimeType, t.id)"
              >{{ t.crimeType }}
            </a>
          </div>
        </div>

        <div v-if="navPage === 'main'" class="btn-group">
          <span style="margin-right: 3px">Neighborhood:</span>

          <button
            class="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style="margin-left: 5px; margin-right: 5px"
          >
            {{ neighbor }}
          </button>
          <div
            class="dropdown-menu pre-scrollable"
            aria-labelledby="dropdownMenuButton"
          >
            <a
              class="dropdown-item"
              v-for="n in neighborhoods"
              v-bind:key="n.id"
              v-on:click="changeNeighbor(n.neighborhood, n.id)"
              >{{ n.neighborhood }}</a
            >
          </div>
        </div>

        <div
          v-if="
            navPage === 'main' &&
            userId !== undefined &&
            userId !== '-1' &&
            neighbor_id !== 0 &&
            following.includes(neighbor_id)
          "
        >
          <button
            type="button"
            class="btn btn-outline-primary btn-sm"
            v-on:click="unfollow"
          >
            Unfollow
          </button>
        </div>
        <div
          v-else-if="
            navPage === 'main' && userId !== undefined && userId !== '-1' && neighbor_id !== 0
          "
        >
          <button
            type="button"
            class="btn btn-outline-primary btn-sm"
            v-on:click="follow"
          >
            Follow
          </button>
        </div>
      </div>

      <div class="row" style="margin-left: 50px; margin-top: 5px">
        <div class="btn-group">
          <span style="">Start date: </span>
          <div class="md-form md-outline input-with-post-icon datepicker">
            <input
              placeholder="Select date"
              type="date"
              id="example"
              class="form-control"
              value="2018-01-01"
              v-model="start"
              @input="changeStartDate"
            />
          </div>
        </div>
        <div class="btn-group">
          <span style="margin-left: 3px">End date: </span>
          <div class="md-form md-outline input-with-post-icon datepicker">
            <input
              placeholder="Select date"
              type="date"
              id="example"
              class="form-control"
              value="2019-11-19"
              v-model="end"
              @input="changeEndDate"
            />
          </div>
        </div>
      </div>

      <div class="row" style="margin-left: 50px">
        <div
          style="
            color: gray;
            font-size: 9pt;
            margin-top: 3px;
            font-style: italic;
          "
        >
          Note: the exact crime addresses have been masked for safety reasons
        </div>
      </div>

      <div class="main h-auto">
        <Map
          v-bind:type_id="type_id"
          v-bind:neighbor_id="neighbor_id"
          v-bind:neighbor="neighbor"
          v-bind:startdate="start"
          v-bind:enddate="end"
          v-bind:userId="userId"
          v-bind:navPage="navPage"
          v-bind:following="following"
        />
        <Feed
          v-bind:type_id="type_id"
          v-bind:neighbor_id="neighbor_id"
          v-bind:neighbor="neighbor"
          v-bind:startdate="start"
          v-bind:enddate="end"
          v-bind:navPage="navPage"
          v-bind:following="following"
        />

        <PostAndReplyModal v-bind:post="modalPost" />
      </div>
    </div>
  </div>
</template>

<script>
import Feed from "../components/Feed.vue";
import NeighborhoodList from "../components/NeighborhoodList.vue";
import CrimeList from "../components/CrimeList.vue";
import Navbar from "../components/Navbar.vue";
import Map from "../components/Map.vue";
import Account from "./Account.vue";
import PostAndReplyModal from "../components/PostAndReplyModal";
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "Main",
  data: function () {
    return {
      navPage: "account",
      type: "all",
      type_id: 0,
      neighbor: "all",
      neighbor_id: 0,
      types: [],
      neighborhoods: [],
      following: [],
      userId: this.$cookie.get("commwatch-auth-id"),
      modalPost: {},
      start: "2018-01-01",
      end: "2019-11-19",
      title : "Community Watch Homepage",
    };
  },
  components: {
    NeighborhoodList,
    CrimeList,
    Map,
    Navbar,
    Feed,
    Account,
    PostAndReplyModal,
  },
  created: function () {
    eventBus.$on("changePostDropdown", ({ neighborhood, neighborhoodId }) => {
      this.changeNeighbor(neighborhood, neighborhoodId);
    });
    eventBus.$on("toMain", () => {
      this.navPage = "main";
      this.title = "Community Watch Homepage";
    });
    eventBus.$on("toMine", () => {
      this.navPage = "neigh";
      this.title = "My neighborhoods";
    });
    eventBus.$on("toAcco", () => {
      this.navPage = "account";
    });
    eventBus.$on("see-replies-click", ({ post }) => {
      this.modalPost = post;
      eventBus.$emit("launchModal", true);
    });
  },
  mounted: function () {
    this.loadFollowing();
    this.loadNeighborhoods();
    this.loadTypes();
  },
  methods: {
    loadFollowing: function () {
      if (this.userId !== "") {
        axios.get("/api/feeds/user?id=" + this.userId).then((response) => {
          this.following = response.data.map((id) => id.neighborhoodId);
        });
      } else {
        this.following = [];
      }
    },

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

    changeStartDate: function () {
      eventBus.$emit("changeStartDate-success", true);
    },

    changeEndDate: function () {
      eventBus.$emit("changeEndDate-success", true);
    },

    changeNeighbor: function (newNeighbor, id) {
      this.neighbor = newNeighbor;
      this.neighbor_id = id;
      eventBus.$emit("changeNeighbor-success", true);
    },

    follow: function () {
      if (this.userId !== "" && this.neighbor_id !== 0) {
        const bodyContent = {
          userId: this.userId,
          neighborhoodId: this.neighbor_id,
        };
        axios.post("/api/feeds", bodyContent).then(() => {
          this.loadFollowing();
          eventBus.$emit("follow-neighbor-success", true);
        });
      }
    },

    unfollow: function () {
      if (this.userId !== "" && this.neighbor_id !== 0) {
        axios
          .put("/api/feeds", {
            userId: this.userId,
            neighborhoodId: this.neighbor_id,
          })
          .then(() => {
            this.loadFollowing();
            eventBus.$emit("unfollow-neighbor-success", true);
          });
      }
    },
  },
};
</script>
