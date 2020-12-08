<template>
  <div class="create-reply-modal">
    <button
      :id="'replyIcon' + this.post.postId"
      class="replyIcon"
      data-toggle="modal"
      data-target="#replyModal"
    >
      <img
        src="../../imgs/replyIcon.png"
        width="30px"
        title="Reply"
        class="replyImg"
      />
    </button>
    <div
      class="modal fade"
      id="replyModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="replyModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="replyModalLabel">Post a Reply!</h5>
          </div>
          <div class="modal-body">
            <textarea
              class="rcontent"
              id="replyContent"
              v-model.trim="content"
              type="text"
              name="content"
              placeholder="Comment on this post"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="addReply"
              data-dismiss="modal"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "ReplyModal",
  props: {
    post: Object,
  },
  data() {
    return {
      content: "",
    };
  },
  methods: {
    reset: function () {
      this.content = "";
    },
    addReply: function () {
      const bodyContent = {
        content: this.content,
        postId: this.$props.post.postId,
      };
      axios
        .post(`api/replies/new`, bodyContent)
        .then(() => {
          eventBus.$emit("create-reply-success", { post: this.$props.post });
          this.reset();
        })
        .catch(() => {
          eventBus.$emit("create-reply-success", false);
          this.reset();
        });
    },
  },
};
</script>
<style scoped>
.replyIcon {
  border: hidden;
  outline: none;
  background-color: white;
  opacity: 0.5;
}
.replyIcon:hover {
  opacity: 1;
  cursor: pointer;
}
.rcontent {
  width: 90%;
  height: 100px;
  color: rgb(38, 50, 56);
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  margin-bottom: 50px;
  text-align: center;
  margin-bottom: 27px;
}
.rcontent:focus {
  border: 2px solid black !important;
}
</style>