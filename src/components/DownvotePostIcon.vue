<template>
    <div :id="'downvoteIcon' + this.post.postId" class="downvoteIcon">
        <div v-if="isSignedIn">
            <div  v-if="downvoted">
                <img
                        src="../../imgs/downvoteIconSolid.svg"
                        width="30px"
                        title="Downvote"
                        class="downvoteImg"
                        v-on:click="downvotePost"
                />
                {{downvoteCounts}}
            </div>
            <div v-else >
                <img
                        src="../../imgs/downvoteIcon.svg"
                        width="30px"
                        title="Downvote"
                        class="downvoteImg"
                        v-on:click="downvotePost"
                />
                {{downvoteCounts}}
            </div>
        </div>
        <div v-else>
            <img
                    src="../../imgs/downvoteIcon.svg"
                    width="30px"
                    title="Downvote"
                    class="downvoteImg"
                    v-on:click="downvotePost"
            />
            {{downvoteCounts}}
        </div>
    </div>
</template>

<script>
    import {eventBus} from "../main";
    import axios from "axios";

    export default {
        name: "DownvotePostIcon",
        props: {
            post: Object,
        },
        data() {
            return {
                downvoted : false,
                isSignedIn : false,
                downvoteCounts: 0,
            };
        },

        mounted: function() {
            this.countDownvotes();
            this.checkIfDownvoted();
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
            downvotePost: function () {
                if (this.isSignedIn) {
                    const userId = parseInt(this.$cookie.get('commwatch-auth-id'))
                    const body = {"userId": userId, "postId": this.post.postId}
                    if (!this.downvoted) {
                        axios.post('api/downvotes', body)
                            .then(() => {
                                this.downvoted = true;
                                this.downvoteCounts += 1;
                            })
                    } else {
                        axios.put('api/downvotes', body)
                            .then(() => {
                                this.downvoted = false;
                                this.downvoteCounts -= 1;
                            })
                    }
                }
            },

            countDownvotes: function () {
                axios.get(`api/downvotes/post/${this.post.postId}`)
                    .then((res) => {
                        this.downvoteCounts = res.data.length
                    })
            },

            checkIfDownvoted: function () {
                if (this.isSignedIn) {
                    const userId = parseInt(this.$cookie.get('commwatch-auth-id'))
                    axios.get(`api/downvotes/exist?userId=${userId}&postId=${this.post.postId}`)
                        .then((res) => {
                            this.downvoted = res.data.exist;
                        })
                }
            }

        }


    }
</script>

<style scoped>
    .downvoteIcon {
        opacity: 0.7;
    }
    .downvoteIcon:hover {
        opacity: 1;
        cursor: pointer;
    }

</style>