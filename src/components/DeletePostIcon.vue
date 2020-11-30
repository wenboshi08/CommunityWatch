<template>
  <div :id="'deleteIcon' + this.post.postId" class="deleteIcon">
    <img
      src="../../imgs/deleteIcon.png"
      width="30px"
      title="Delete"
      class="deleteImg"
      v-on:click="deletePost"
    />
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "PostItem",

  props: {
    post: Object,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    deletePost: function () {
      let that = this;
      axios.delete(`api/posts/${that.$props.post.postId}`).then(() => {
        eventBus.$emit("delete-post-success", true);
      });
    },
  },
};
</script>

<style scoped>
.deleteIcon {
  opacity: 0.5;
}
.deleteIcon:hover {
  opacity: 1;
  cursor: pointer;
}
</style>
