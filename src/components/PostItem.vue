<template>
  <div class="card w-100 mt-3">
    <div class="card-body">
      <div class="float-right" v-if="checkIfUserAuthoredPost()">
        <DeletePostIcon v-bind:post="post" />
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
    </div>
  </div>
</template>


<script>
import DeletePostIcon from "./DeletePostIcon";
// import axios from "axios";
// import { eventBus } from "../main";

export default {
  name: "PostItem",
  components: {
    DeletePostIcon,
  },
  props: {
    post: Object,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    checkIfUserAuthoredPost: function () {
      let curr_user = this.$cookie.get("commwatch-auth");
      if (curr_user === this.$props.post.poster) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>