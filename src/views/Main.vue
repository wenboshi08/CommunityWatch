<template>
  <div>
    <Navbar />
    <div class="main">
      <!--  <CreateShortForm/>
      <ShortList/> -->
      <Map />
      <NeighborhoodList />
    </div>
    <div>
      <CrimeList />
    </div>
  </div>
</template>

<script>
// import CreateShortForm from "../components/CreateShortForm.vue";
// import ShortList from "../components/ShortList.vue";
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
