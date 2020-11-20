<template>
  <div class="neighborhood-container">
    <div class="neighborhood-name"> {{ crime.fileNumber }}. Time: {{ crime.reportDate }}. Location {{crime.location}}.

    </div>
    

  </div>
</template>

<script>
// import axios from "axios";
// import { eventBus } from "../main";

export default {
  name: "CrimeListItem",

  props: {
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
};
</script>
