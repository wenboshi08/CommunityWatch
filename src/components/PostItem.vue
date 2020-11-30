<template>
  <div class="card w-100 mt-3">
    <div class="card-body">
      <!-- <div class="float-left">
        {{ post.poster }}
      </div> -->
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
// import axios from "axios";
// import { eventBus } from "../main";

export default {
  name: "PostItem",

  props: {
    post: Object,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},
};
</script>
