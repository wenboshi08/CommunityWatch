<template>
    <div>
        <Navbar />
        <h1 v-if="isSignedIn">My neighborhood</h1>
        <h1 v-else>Not Sign In Yet</h1>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar.vue";

    export default {
        name: "MyNeighborhood",
        data: function () {
            return {
                isSignedIn: false,
            };
        },
        created: function() {
            let authenticated = this.$cookie.get('commwatch-auth');
            let authenticated_id = this.$cookie.get('commwatch-auth-id');
            if (authenticated && authenticated_id) {
                this.isSignedIn = true;
            }
        },
        components: {
            Navbar,
        },
        methods: {},
    }
</script>

<style scoped>

</style>