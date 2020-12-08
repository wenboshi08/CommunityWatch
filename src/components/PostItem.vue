<template>
  <div v-if="hasFlags">
    <button
      class="btn btn-outline-secondary btn-sm"
      type="button"
      data-toggle="collapse"
      :data-target="`#${'post' + this.post.postId}`"
      aria-expanded="false"
      aria-controls="this.post.postId"
    >
      Click to See Hidden Post
    </button>
    <div class="collapse" :id="'post' + this.post.postId">
      <div class="card w-100 mt-3">
        <div class="card-body">
          <div class="float-right" v-if="checkIfUserAuthoredPost()">
            <DeletePostIcon v-bind:post="post" />
          </div>
          <div class="float-right" v-if="isSignedIn">
            <FlagPostIcon v-bind:post="post" />
            <div v-if="hasFlags" class="warning">
              <div style="color: red; font-size: 10pt; font-style: italic">
                Warning: this post may contain inappropriate content
              </div>
            </div>
          </div>

          <div>
            <h5 class="card-title mt-4">{{ post.poster }}</h5>
          </div>
          <div>
            <h6 class="card-subtitle text-muted">{{ post.postContent }}</h6>
          </div>
          <div>
            <h6 class="card-subtitle mt-3 text-muted">
              {{ post.neighborhood }}
            </h6>
          </div>
          <div>
            <h6 class="card-subtitle mt-3 text-muted">
              {{ post.postTime.substring(0, 10) }}
            </h6>
          </div>
          <div v-if="isSignedIn">
            <div class="float-right upvote">
              <DownvotePostIcon v-bind:post="post" />
            </div>
            <div class="float-right downvote">
              <UpvotePostIcon v-bind:post="post" />
            </div>
            <div class="float-left"><ReplyModal v-bind:post="post" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="card w-100 mt-3">
      <div class="card-body">
        <div class="float-right" v-if="checkIfUserAuthoredPost()">
          <DeletePostIcon v-bind:post="post" />
        </div>
        <div class="float-right" v-if="isSignedIn">
          <FlagPostIcon v-bind:post="post" />
          <div v-if="hasFlags" class="warning">
            <div style="color: red; font-size: 10pt; font-style: italic">
              Warning: this post may contain inappropriate content
            </div>
          </div>
        </div>

        <div>
          <h5 class="card-title mt-4">{{ post.poster }}</h5>
        </div>
        <div>
          <h6 class="card-subtitle text-muted">{{ post.postContent }}</h6>
        </div>
        <div>
          <h6 class="card-subtitle mt-3 text-muted">{{ post.neighborhood }}</h6>
        </div>
        <div>
          <h6 class="card-subtitle mt-3 text-muted">
            {{ post.postTime.substring(0, 10) }}
          </h6>
        </div>
        <div v-if="isSignedIn">
          <div class="float-right upvote">
            <DownvotePostIcon v-bind:post="post" />
          </div>
          <div class="float-right downvote">
            <UpvotePostIcon v-bind:post="post" />
          </div>
          <div class="float-left"><ReplyModal v-bind:post="post" /></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import DeletePostIcon from "./DeletePostIcon";
import FlagPostIcon from "./FlagPostIcon";
import UpvotePostIcon from "./UpvotePostIcon";
import DownvotePostIcon from "./DownvotePostIcon";
import ReplyModal from "./ReplyModal";
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "PostItem",
  components: {
    DeletePostIcon,
    FlagPostIcon,
    UpvotePostIcon,
    DownvotePostIcon,
    ReplyModal,
  },
  props: {
    post: Object,
  },

  data() {
    return {
      isSignedIn: false,
      hasFlags: false,
    };
  },

  computed: {},
  created: function () {
    let authenticated = this.$cookie.get("commwatch-auth");
    if (authenticated) {
      this.isSignedIn = true;
    }
    this.getAllFlagged();
    eventBus.$on("signout-success", () => {
      this.$cookie.set("commwatch-auth", "");
      this.$cookie.set("commwatch-auth-id", "");
      this.isSignedIn = false;
    });

    eventBus.$on("flag-post-success", () => {
      this.getAllFlagged();
    });
  },
  mounted: function () {},
  methods: {
    checkIfUserAuthoredPost: function () {
      let curr_user = this.$cookie.get("commwatch-auth");
      if (curr_user === this.$props.post.poster) {
        return true;
      } else {
        return false;
      }
    },

    getAllFlagged: function () {
      let that = this;
      axios
        .get(`api/posts/flag/all/${that.$props.post.postId}`)
        .then((res) => {
          let response = res.data.flagged;
          if (response == undefined || response.length == 0) {
            this.hasFlags = false;
          } else {
            this.hasFlags = true;
          }
        })
        .catch(() => {
          // Still sign User out so they have to sign in again.
          eventBus.$emit("signout-success", true);
        });
    },
  },
};
</script>

<style scoped>
.warning {
  display: inline-block;
}
.upvote {
  margin-left: 4px;
  margin-right: 4px;
}
.downvote {
  margin-left: 4px;
  margin-right: 4px;
}
</style>
