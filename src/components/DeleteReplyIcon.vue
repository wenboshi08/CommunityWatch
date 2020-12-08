<template>
  <div :id="'deleteIcon' + this.reply.replyId" class="deleteIcon">
    <img
      src="../../imgs/deleteIcon.png"
      width="30px"
      title="Delete"
      class="deleteImg"
      v-on:click="deleteReply"
    />
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "DeleteReplyIcon",

  props: {
    reply: Object,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    deleteReply: function () {
      let that = this;
      axios.delete(`api/replies/${that.$props.reply.replyId}`).then(() => {
        eventBus.$emit("delete-reply-success", true);
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
