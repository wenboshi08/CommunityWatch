<template>
  <div class="neighborhood-container">
    <div class="neighborhood-name"> {{ neighborhood.neighborhood }}</div>
    

  </div>
</template>

<script>
// import axios from "axios";
// import { eventBus } from "../main";

export default {
  name: "NeighborhoodListItem",

  props: {
    neighborhood: Object

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
