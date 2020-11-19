<template>
  <div class="map">
    <div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="map-container" id="map-container" v-if="crimes.length">
        <!-- <div v-if="crimes.length">
          <google-map
            :center="center"
            :zoom="7"
            style="width: 100%; height: 500px"
          >
            <google-marker
              v-for="c in crimes"
              v-bind:key="c.fileNumber"
              v-bind:position="c.position"
              v-bind:clickable="true"
              v-bind:draggable="true"
              v-on:click="center = c.position"
            ></google-marker>
          </google-map>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAlSCDlDz-SOG0h9L0sSogIxcNhznag1Lg" async defer></script>
<script>
import axios from "axios";
import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
import { Loader } from "google-maps";

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: "AIzaSyAlSCDlDz-SOG0h9L0sSogIxcNhznag1Lg",
    libraries: "places",
  },
});

Vue.filter("json", (x) => JSON.stringify(x));

// import { eventBus } from "../main";

export default {
  name: "Map",
  data() {
    return {
      error: "",
      success: "",
      crimes: [],
    };
  },

  created: function () {},

  mounted: function () {
    this.loadCrimes();
  },

  methods: {
    geoCodeAddress: async function (address, geocoder) {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          //   map.setCenter(results[0].geometry.location);
          //   let marker = new google.maps.Marker(
          //       {  position: results[0].geometry.location,
          //       });
          return results[0].geometry.location;
        } else {
          console.log(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    },
    loadCrimes: async function () {
      let google;
      let map;
      axios
        .get("/api/crimes/")
        .then((response) => {
          this.crimes = response.data;
        })
        .then(() => {
          const options = {
            /* todo */
          };
          const loader = new Loader(
            "AIzaSyAlSCDlDz-SOG0h9L0sSogIxcNhznag1Lg",
            options
          );
          google = loader.load();
        })
        .then(() => {
          map = new google.maps.Map(document.getElementById("map-container"), {
            center: { lat: 42.3736, lng: 71.1097 },
            zoom: 8,
          });
        })
        .then(() => {
          let geocoder = new google.maps.Geocoder();
          this.crimes.map((crime) => {
            let position = geoCodeAddress(crime.location, geocoder);
            return {
              fileNumber: crime.fileNumber,
              reportDate: crime.reportDate,
              crimeType: crime.crimeType,
              neighborhood: crime.neighborhood,
              location: crime.location,
              position: position,
            };
          });
          console.log(this.crimes);
        });
    },

    clearMessages: function () {
      setInterval(() => {
        this.success = "";
        this.error = "";
      }, 5000);
    },
  },
};
</script>
