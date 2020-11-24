<template>
  <div>
    <Navbar />
    <div class="main">
      <!--  <CreateShortForm/>
      <ShortList/> -->
      <Map />
      <NeighborhoodList />
    </div>
<<<<<<< HEAD
    <CrimeList />
=======
    <div>
      <CrimeList />
    </div>
>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
  </div>
</template>

<script>
// import CreateShortForm from "../components/CreateShortForm.vue";
// import ShortList from "../components/ShortList.vue";
import CrimeList from "../components/CrimeList.vue";
import NeighborhoodList from "../components/NeighborhoodList.vue";
import CrimeList from "../components/CrimeList.vue";
import Navbar from "../components/Navbar.vue";
import Map from "../components/Map.vue";
// import { eventBus } from "../main";

export default {
  name: "Main",
  data: function () {
    return {};
  },
  components: {
    CrimeList,
    NeighborhoodList,
    CrimeList,
    Map,
    // CreateShortForm,
    // ShortList,
    Navbar,
  },
  methods: {},
};
</script>
