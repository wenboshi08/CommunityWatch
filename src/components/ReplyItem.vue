<template>
  <div class="card w-100 mt-3" style="background-color: lavender">
    <div class="card-body">
      <div class="float-right" v-if="checkIfUserAuthoredReply()">
        <DeleteReplyIcon v-bind:reply="reply" />
      </div>
      <div>
        <h5 class="card-title mt-4">{{ reply.replier }}</h5>
      </div>
      <div>
        <h6 class="card-subtitle text-muted">{{ reply.replyContent }}</h6>
      </div>
    </div>
  </div>
</template>


<script>
import DeleteReplyIcon from "./DeleteReplyIcon";

export default {
  name: "ReplyItem",
  components: {
    DeleteReplyIcon,
  },
  props: {
    reply: Object,
  },
  data() {
    return {
      isSignedIn: false,
    };
  },
  computed: {},
  created: function () {},
  methods: {
    checkIfUserAuthoredReply: function () {
      let curr_user = this.$cookie.get("commwatch-auth");
      if (curr_user === this.$props.reply.replier) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>