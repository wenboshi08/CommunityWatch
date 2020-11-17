<template>
  <div>
    <Navbar/>
    <div class='main'>
     <!--  <CreateShortForm/>
      <ShortList/> -->
      <NeighborhoodList/>

    </div>
  </div>
</template>

<script>
// import CreateShortForm from "../components/CreateShortForm.vue";
// import ShortList from "../components/ShortList.vue";
import NeighborhoodList from "../components/NeighborhoodList.vue"
import Navbar from "../components/Navbar.vue";

export default {
  name: "Main",
  components: {
    NeighborhoodList,
    // CreateShortForm,
    // ShortList,
    Navbar
  }
};
</script>
