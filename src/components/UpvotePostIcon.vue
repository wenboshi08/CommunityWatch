<template>
    <div :id="'upvoteIcon' + this.post.postId" class="upvoteIcon">
        <div v-if="isSignedIn">
            <div  v-if="upvoted">
                <img
                        src="../../imgs/upvoteIconSolid.svg"
                        width="30px"
                        title="Upvote"
                        class="upvoteImg"
                        v-on:click="upvotePost"
                />
                {{upvoteCounts}}
            </div>
            <div v-else >
                <img
                        src="../../imgs/upvoteIcon.svg"
                        width="30px"
                        title="Upvote"
                        class="upvoteImg"
                        v-on:click="upvotePost"
                />
                {{upvoteCounts}}
            </div>
        </div>
        <div v-else>
            <img
                    src="../../imgs/upvoteIcon.svg"
                    width="30px"
                    title="Upvote"
                    class="upvoteImg"
                    v-on:click="upvotePost"
            />
            {{upvoteCounts}}
        </div>
    </div>
</template>

<script>
    import {eventBus} from "../main";
    import axios from "axios";

    export default {
        name: "UpvotePostIcon",
        props: {
            post: Object,
        },
        data() {
            return {
                upvoted : false,
                isSignedIn : false,
                upvoteCounts: 0,
            };
        },

        mounted: function() {
            this.countUpvotes();
            this.checkIfUpvoted();
        },

        created : function() {
            let authenticated = this.$cookie.get('commwatch-auth');
            if (authenticated) {
                this.isSignedIn = true;
            }
            eventBus.$on("signout-success", () => {
                this.$cookie.set('commwatch-auth', '');
                this.$cookie.set('commwatch-auth-id', '');
                this.isSignedIn = false;
            });
        },

        methods: {
            upvotePost: function () {
                if (this.isSignedIn) {
                    const userId = parseInt(this.$cookie.get('commwatch-auth-id'))
                    const body = {"userId": userId, "postId": this.post.postId}
                    if (!this.upvoted) {
                        axios.post('api/upvotes', body)
                            .then(() => {
                                // eventBus.$emit("upvote-post-success", true);
                                this.upvoted = true;
                                this.upvoteCounts += 1;
                            })
                    } else {
                        axios.put('api/upvotes', body)
                            .then(() => {
                                // eventBus.$emit("upvote-withdraw-success", true);
                                this.upvoted = false;
                                this.upvoteCounts -= 1;
                            })
                    }
                }
            },

            countUpvotes: function () {
                axios.get(`api/upvotes/post/${this.post.postId}`)
                    .then((res) => {
                        this.upvoteCounts = res.data.length;
                    })
            },

            checkIfUpvoted: function () {
                if (this.isSignedIn) {
                    const userId = parseInt(this.$cookie.get('commwatch-auth-id'))
                    axios.get(`api/upvotes/exist?userId=${userId}&postId=${this.post.postId}`)
                    .then((res) => {
                        this.upvoted = res.data.exist;
                    })
                }
            }

        }


    }
</script>

<style scoped>
    .upvoteIcon {
        opacity: 0.7;
    }
    .upvoteIcon:hover {
        opacity: 1;
        cursor: pointer;
    }

</style>