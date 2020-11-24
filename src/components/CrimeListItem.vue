<template>
<<<<<<< HEAD
  <div class="neighborhood-container">
    <div class="neighborhood-name"> {{ crime.fileNumber }}. Time: {{ crime.reportDate }}. Location {{crime.location}}.

    </div>
    

=======
  <div class="crime-container">
    <div class="crime-name">
      {{ crime.crimeType }} <br />
      {{ crime.location }} <br />
      {{ crime.neighborhood }} <br />
      {{ crime.fileNumber }} <br />
      {{ crime.reportDate }}
    </div>
>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
  </div>
</template>

<script>
// import axios from "axios";
// import { eventBus } from "../main";

export default {
  name: "CrimeListItem",

  props: {
<<<<<<< HEAD
    crime: Object

  },

  data() {
    return {
      
    };
  },

  computed: {
    
  },

  methods: {
  
  }
=======
    crime: Object,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},
>>>>>>> afb78ba8a541dfda865469282b4b3c6b74af8475
};
</script>
