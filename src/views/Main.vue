<template>
  <div>
    <Navbar />
    <div class="main">
      <!--  <CreateShortForm/>
      <ShortList/> -->
      <Map />
      <NeighborhoodList />
    </div>
  </div>
</template>

<script>
// import CreateShortForm from "../components/CreateShortForm.vue";
// import ShortList from "../components/ShortList.vue";
import NeighborhoodList from "../components/NeighborhoodList.vue";
import Navbar from "../components/Navbar.vue";
import Map from "../components/Map.vue";

export default {
  name: "Main",
  components: {
    NeighborhoodList,
    Map,
    // CreateShortForm,
    // ShortList,
    Navbar,
  },
};
</script>
