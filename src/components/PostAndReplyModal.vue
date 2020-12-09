<template>
  <div class="post-and-reply-modal">
    <div
      class="modal fade"
      id="postAndReplyModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="postAndReplyModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" style="display: block">
            <h5>Post</h5>
            <div class="card w-100 mt-3" style="background-color: lightblue">
              <div class="card-body">
                <div>
                  <h5 class="card-title mt-4">{{ post.poster }}</h5>
                </div>
                <div>
                  <h6 class="card-subtitle text-muted">
                    {{ post.postContent }}
                  </h6>
                </div>
                <div>
                  <h6 class="card-subtitle mt-3 text-muted">
                    {{ post.neighborhood }}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-body">
            <h5>Replies</h5>
            <div class="h-100 overflow-auto" v-if="replies.length">
              <ReplyItem
                v-for="reply in replies"
                v-bind:key="reply.replyId + '-' + reply.replierId"
                v-bind:reply="reply"
              />
            </div>
            <div v-else>
              <p style="text-align: center">There are no replies to display.</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                v-on:click="hideModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade show"
      id="backdrop"
      style="display: none"
    ></div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import ReplyItem from "./ReplyItem";

export default {
  name: "PostAndReplyModal",
  components: {
    ReplyItem,
  },
  props: {
    post: Object,
  },
  data() {
    return {
      content: "",
      replies: [],
    };
  },
  created: function () {
    eventBus.$on("launchModal", () => {
      this.loadReplies();
    });
    eventBus.$on("create-reply-success", () => {
      this.loadReplies();
    });
    eventBus.$on("delete-reply-success", () => {
      this.loadReplies();
    });
  },
  mounted: function () {},
  methods: {
    hideModal: function () {
      let myModal = document.getElementById("postAndReplyModal");
      myModal.style.display = "none";
      myModal.className = "modal fade";
      document.getElementById("backdrop").style.display = "none";
    },

    showModal: function () {
      let myModal = document.getElementById("postAndReplyModal");
      myModal.style.display = "block";
      myModal.className = "modal fade show";
      document.getElementById("backdrop").style.display = "block";
    },

    loadReplies: async function () {
      let that = await this;
      axios
        .get(`api/replies/${that.$props.post.postId}`)
        .then((res) => {
          this.replies = [...res.data];
        })
        .then(() => {
          this.showModal();
        });
    },
  },
};
</script>