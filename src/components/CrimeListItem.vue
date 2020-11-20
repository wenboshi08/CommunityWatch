<template>
  <div class="crime-container">
    <div class="crime-name">
      {{ crime.crimeType }} <br />
      {{ crime.location }} <br />
      {{ crime.neighborhood }} <br />
      {{ crime.fileNumber }} <br />
      {{ crime.reportDate }}
    </div>
  </div>
</template>

<script>
// import axios from "axios";
// import { eventBus } from "../main";

export default {
  name: "CrimeListItem",

  props: {
    crime: Object,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},
};
</script>
