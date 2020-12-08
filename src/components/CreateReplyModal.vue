<template>
  <div class="create-reply-modal">
    <div :id="'replyIcon' + this.post.postId" class="replyIcon">
      <img
        src="../../imgs/replyIcon.png"
        width="30px"
        title="Reply"
        class="replyImg"
        v-on:click="toggleModal"
      />
    </div>
    <div class="reply-modal" v-bind:id="'reply-modal' + this.post.postId">
      <div class="reply-modal-content">
        <span class="reply-close-button" v-on:click="toggleModal">&times;</span>
        <form
          id="create-reply"
          class="create-reply-component"
          v-on:submit.prevent="addReply"
          method="post"
        >
          <textarea
            class="rcontent"
            id="replyContent"
            v-model.trim="content"
            type="text"
            name="content"
            placeholder="Comment on this post"
          ></textarea>
          <input
            class="reply-submit"
            type="submit"
            value="Reply"
            style="float: right"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "CreateReplyModal2",
  props: {
    post: Object,
  },
  data() {
    return {
      content: "",
    };
  },
  methods: {
    toggleModal: function () {
      let modal = document.getElementById("reply-modal" + this.post.postId);
      console.log("modal: ", modal.classList);
      modal.classList.toggle("reply-show-modal");
    },
    addReply: function () {
      const bodyContent = {
        content: this.content,
        postId: this.$props.post.postId,
      };
      axios
        .post(`api/replies/new`, bodyContent)
        .then(() => {
          eventBus.$emit("create-reply-success", true);
        })
        .catch(() => {
          eventBus.$emit("create-reply-success", false);
        });
      this.toggleModal();
    },
  },
};
</script>
<style scoped>
.reply-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
  z-index: 9999;
}
.reply-modal-content {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem 1.5rem;
  width: 24rem;
  border-radius: 0.5rem;
}
.reply-close-button {
  float: right;
  width: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: lightgray;
}
.reply-close-button:hover {
  background-color: darkgray;
}
.reply-show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
form {
  width: fit-content;
}
.rcontent {
  width: 90%;
  height: 100px;
  color: rgb(38, 50, 56);
  font-weight: 700;
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
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
}
.rcontent:focus {
  border: 2px solid black !important;
}
.reply-submit {
  cursor: pointer;
  border-radius: 5em;
  color: #fff;
  background: black;
  border: 0;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 10px;
  padding-top: 10px;
  font-family: "Ubuntu", sans-serif;
  font-size: 13px;
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.04);
}
.reply-submit:hover {
  text-decoration: underline;
}
.replyIcon {
  opacity: 0.5;
}
.replyIcon:hover {
  opacity: 1;
  cursor: pointer;
}
</style>