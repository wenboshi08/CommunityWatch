<template>
  <div>
    <Navbar />
    <div class="main">
      <!--  <CreateShortForm/>
      <ShortList/> -->
      <Map />
      <NeighborhoodList />
    </div>
    <CrimeList />
  </div>
</template>

<script>
// import CreateShortForm from "../components/CreateShortForm.vue";
// import ShortList from "../components/ShortList.vue";
import CrimeList from "../components/CrimeList.vue";
import NeighborhoodList from "../components/NeighborhoodList.vue";
import Navbar from "../components/Navbar.vue";
import Map from "../components/Map.vue";

export default {
  name: "Main",
  components: {
    CrimeList,
    NeighborhoodList,
    Map,
    // CreateShortForm,
    // ShortList,
    Navbar,
  },
};
</script>
