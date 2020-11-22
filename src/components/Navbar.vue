<template>
  <div class="nav-bar">
    <div>
      <b-navbar-item tag="router-link" :to="{path: '/'}"></b-navbar-item>
      <b>Community Watch</b> 
     <b-navbar-item tag="router-link" :to="{ path: '/account' }">
               <font-awesome-icon 
                icon="user" 
                size="2x" >
          </font-awesome-icon>

        </b-navbar-item>
    </div>

  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      
    }
  },
};
</script>

<style scoped>



.nav-icon-container {
    width: 20px;
    height: 20px;
    display: inline-block;
}

.nav-icon-container img {
  width: inherit;
  height: inherit;
}
</style>