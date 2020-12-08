<template>
  <div class="create-reply-modal">
    <button
      :id="'replyIcon' + post.postId"
      class="replyIcon"
      data-toggle="modal"
      :data-target="'#replyModal-' + post.postId"
    >
      <img
        src="../../imgs/replyIcon.png"
        width="30px"
        title="Reply"
        class="replyImg"
      />
    </button>
    <a
      class="link"
      :id="'link-' + post.postId"
      v-if="hasReplies"
      v-on:click="loadModal"
      >See Replies</a
    >
    <div
      class="modal fade"
      :id="'replyModal-' + post.postId"
      tabindex="-1"
      role="dialog"
      :aria-labelledby="'replyModalLabel-' + post.postId"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="'replyModalLabel-' + post.postId">
              Post a Reply!
            </h5>
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
      hasReplies: false,
    };
  },
  created: function () {
    this.postHasReplies();
    eventBus.$on("create-reply-success", () => {
      this.postHasReplies();
    });
    eventBus.$on("delete-reply-success", () => {
      this.postHasReplies();
    });
  },
  methods: {
    reset: function () {
      this.content = "";
    },
    addReply: async function () {
      let that = await this;
      const bodyContent = {
        content: that.content,
        postId: that.$props.post.postId,
      };
      axios
        .post(`api/replies/new`, bodyContent)
        .then(() => {
          eventBus.$emit("create-reply-success", true);
          this.reset();
          this.postHasReplies();
        })
        .catch(() => {
          eventBus.$emit("create-reply-success", false);
          this.reset();
          this.postHasReplies();
        });
    },
    postHasReplies: async function () {
      let that = await this;
      let replies = [];
      axios
        .get(`api/replies/${that.$props.post.postId}`)
        .then((res) => {
          replies = [...res.data];
        })
        .then(() => {
          if (replies.length > 0) {
            this.hasReplies = true;
          } else {
            this.hasReplies = false;
          }
        });
    },
    loadModal: async function () {
      let that = await this;
      eventBus.$emit("see-replies-click", { post: that.$props.post });
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
.link:hover {
  text-decoration: underline;
}
</style>