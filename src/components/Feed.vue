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
          <p style="text-align: center">There are no Crimes to display.</p>
        </div>
      </div>
    </div>
    <div v-else-if="page === 'post'">
      <h2 class="mt-3">Posts</h2>
      <div
        class="p-3 mb-2 bg-light text-dark overflow-auto"
        style="height: 500px"
      >
        <button
          v-if="userName"
          class="btn btn-outline-primary btn-sm"
          type="button"
          data-toggle="collapse"
          data-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          + Add Post
        </button>
        <div class="collapse" id="collapseExample" style="padding-top: 20px">
          <form class="postForm">
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
                {{ neighbor === "all" ? "Choose below" : neighbor }}
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a
                  class="dropdown-item"
                  v-for="n in neighborhoods"
                  v-bind:key="n.id"
                  v-on:click="selectNeighborhood(n.neighborhood, n.id)"
                  >{{ n.neighborhood }}</a
                >
              </div>
            </div>
            <br /><br />
            <textarea
              class="form-control"
              rows="3"
              id="postContent"
              placeholder="Post something here!"
            ></textarea>
            <br />
            <button
              type="button"
              class="float-left btn btn-outline-primary btn-sm"
              v-on:click="addPost"
            >
              Post
            </button>
          </form>
        </div>
        <br /><br />
        <div class="h-100 overflow-auto" v-if="posts.length">
          <PostItem
            v-for="post in posts"
            v-bind:key="post.postId + '-' + post.userId"
            v-bind:post="post"
          />
        </div>
        <div v-else>
          <p style="text-align: center">
            There are no Posts to display. Create one today!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CrimeListItem from "./CrimeListItem";
import PostItem from "./PostItem";
import { eventBus } from "../main";

export default {
  name: "Feed",
  components: { CrimeListItem, PostItem },
  props: {
    type_id: Number,
    neighbor_id: Number,
    neighbor: String,
    startdate: String,
    enddate : String,
    navPage : String,
    following: Array[Number],
  },
  data() {
    return {
      page: "main",
      types: [],
      neighborhoods: [],
      crimes: [],
      posts: [],
      userName: this.$cookie.get("commwatch-auth"),
    };
  },
  created: function () {
    eventBus.$on("changeType-success", () => {
      this.getCrimes();
      this.getPosts();
    });

    eventBus.$on("changeNeighbor-success", () => {
      this.getCrimes();
      this.getPosts();
    });

    eventBus.$on("changeStartDate-success", () => {
      this.getCrimes();
      this.getPosts();
    });

    eventBus.$on("changeEndDate-success", () => {
      this.getCrimes();
      this.getPosts();
    });

    eventBus.$on("create-post-success", () => {
      this.getPosts();
    });

    eventBus.$on("delete-post-success", () => {
      this.getPosts();
    });

    eventBus.$on("toMain", () => {
      this.getCrimes();
    });

    eventBus.$on("toMine", () => {
      this.getCrimes(true);
    });

    eventBus.$on("signout-success", () => {
      this.$cookie.set("commwatch-auth", "");
      this.$cookie.set("commwatch-auth-id", "");
      this.userName = "";
      this.getCrimes();
      this.getPosts();
    });
  },
  mounted: function () {
    this.getCrimes();
    this.getPosts();
    this.loadNeighborhoods();
  },
  methods: {
    changePage: function (newPage) {
      this.page = newPage;
      if (this.page == "main") {
        this.getCrimes();
      }
    },

    getCrimes: async function (my_own=false) {
      let that = await this;
      if(my_own|| that.navPage === "neigh") {
        const bodyContent = {neigh: that.following};
        axios
          .put(
            `/api/crimes/mine?type=${that.$props.type_id}&from_=${that.$props.startdate}&to_=${that.$props.enddate}`, bodyContent
          )
          .then((response) => {
            that.crimes = [...response.data];
          });
      } else {
        axios
          .get(
            `/api/crimes?type=${that.$props.type_id}&neigh=${that.$props.neighbor_id}&from_=${that.$props.startdate}&to_=${that.$props.enddate}`
          )
          .then((response) => {
            that.crimes = [...response.data];
          });
      }
    },

    getPosts: async function () {
      let that = await this;
      axios
        .get(`/api/posts?neighborhoodId=${that.$props.neighbor_id}`)
        .then((response) => {
          that.posts = [...response.data];
        });
    },

    loadNeighborhoods: function () {
      axios.get("/api/neighborhoods").then((response) => {
        this.neighborhoods.push(...response.data.all);
      });
    },

    selectNeighborhood: function (newNeighbor, id) {
      eventBus.$emit("changePostDropdown", {
        neighborhood: newNeighbor,
        neighborhoodId: id,
      });
    },

    checkContentNonEmpty: function (content) {
      if (content.length === 0) {
        alert("Your post cannot be empty. Please post something meaningful.");
        return false;
      } else {
        return true;
      }
    },

    reset: function () {
      document.getElementById("postContent").value = "";
    },

    addPost: async function () {
      let that = await this;
      let postContent = document.getElementById("postContent").value;
      if (this.checkContentNonEmpty(postContent)) {
        const bodyContent = {
          neighborhoodId: that.$props.neighbor_id,
          content: postContent,
        };
        axios
          .post(`/api/posts/new`, bodyContent)
          .then(() => {
            eventBus.$emit("create-post-success", true);
            this.reset();
          })
          .catch(() => {
            // Still sign User out so they have to sign in again.
            eventBus.$emit("trigger-signout", true);
          });
      }
    },
  },
};
</script>
