<template>


  <div :id="'flagIcon' + this.post.postId" class="flagIcon">
    
    <div  v-if="flagged">
        <img
      src="../../imgs/redFlagIcon.png"
      width="30px"
      title="Flag"
      class="flagImg"
      v-on:click="flagPost"
    />

    </div>
    <div v-else >
        <img
      src="../../imgs/flagIcon.png"
      width="30px"
      title="Flag"
      class="flagImg"
      v-on:click="flagPost"
    />

    </div>
  
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
    return {
      flagged : false,
    };
  },


   mounted: function() {
    this.checkIfFlagged();
  },

  methods: {
   flagPost: function () {
      let that = this;
      axios.put(`api/posts/flag/${that.$props.post.postId}`).then((res) => {
        eventBus.$emit("flag-post-success", true);
        this.flagged = res.data.flagged;
        
      });
    },
 

  checkIfFlagged: function () {
      let that = this;
      axios.get(`api/posts/flag/${that.$props.post.postId}`).then((res) => {
        let response = res.data.flagged;
        if (response == undefined){
          this.flagged = false;
        } else {
        this.flagged = true;
      }
      }).catch(() => {
          // Still sign User out so they have to sign in again.
          eventBus.$emit('signout-success', true);
        });  
  },


},
};


</script>

<style scoped>
.flagIcon {
  opacity: 0.7;
}
.flagIcon:hover {
  opacity: 1;
  cursor: pointer;
}
</style>
