<template>
  <div class="map">
    <div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="container">
        <div id="map-container"></div>
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

<script>
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import mapquest from "mapquest";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import data from "../../test-data.geojson";
// import LeafletHeatmap from "./LeafletHeatmap";
// import Vue from "vue";
// import * as VueGoogleMaps from "vue2-google-maps";
// import { Loader } from "google-maps";

// import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

// Vue.use(VueGoogleMaps, {
//   installComponents: true,
//   load: {
//     key: "AIzaSyAlSCDlDz-SOG0h9L0sSogIxcNhznag1Lg",
//     libraries: "places",
//   },
// });

// Vue.filter("json", (x) => JSON.stringify(x));

// import { eventBus } from "../main";

export default {
  name: "Map",
  components: {},
  data() {
    return {
      error: "",
      success: "",
      crimes: [],
      center: [-71.1097, 42.3736],
    };
  },

  created: function () {},

  mounted: function () {
    this.loadCrimes();
    this.setupLeafletMap();
  },

  methods: {
    geoCodeAddress: async (location, fn) => {
      //   mapquest.geocode()
      //     .search(location)
      //     .on("success", function (e) {
      //       console.log(e);
      //     });
      //   console.log(location);
      return mapquest.geocode(
        {
          address: [location],
          key: "gX72Jyp1H1l0fIoGb06xGY6yJ9h6KMN1",
        },
        function (err, result) {
          fn([result.displayLatLng.lng, result.displayLatLng.lat]);
        }
      );
    },
    onEachFeature: (feature, layer) => {
      if (feature.properties && feature.properties.crimeType) {
        layer.bindPopup(feature.properties.crimeType);
        layer.on("mouseover", () => {
          layer.openPopup();
        });
        layer.on("mouseout", () => {
          layer.closePopup();
        });
      }
    },
    setupLeafletMap: function () {
      const mapDiv = L.map("map-container").setView(
        [42.37369292702129, -71.11050691418987],
        13
      );
      let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
      });

      L.Marker.prototype.options.icon = DefaultIcon;
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution: "© OpenStreetMap",
          maxZoom: 18,
          id: "mapbox/streets-v11",
          accessToken:
            "pk.eyJ1Ijoic3Zpc2h3YWIiLCJhIjoiY2tocGViOTF4MGl3ZTJzcDY5a2x0cDg4bSJ9.zu75vUX-kDvcReosDGWP1w",
        }
      ).addTo(mapDiv);
      let data = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              crimeType: "AutoTheft",
              fileNumber: "2009-00217",
              location: "100 CHURCH ST, Cambridge, MA",
              neighborhoodId: 1,
              reportDate: "2009-01-08T20:53:00Z",
            },
            geometry: {
              type: "Point",
              coordinates: [-71.1214574, 42.3739487],
            },
          },
          {
            type: "Feature",
            properties: {
              crimeType: "Hit and Run",
              fileNumber: "2009-00219",
              location: "0 BLAKESLEE ST, Cambridge, MA",
              neighborhoodId: 1,
              reportDate: "2009-01-08T22:02:00Z",
            },
            geometry: {
              type: "Point",
              coordinates: [-71.13506269999999, 42.3809522],
            },
          },
          {
            type: "Feature",
            properties: {
              crimeType: "Shoplifting",
              fileNumber: "2009-00233",
              location: "0 WHITE ST, Cambridge, MA",
              neighborhoodId: 2,
              reportDate: "2009-01-09T15:02:00Z",
            },
            geometry: {
              type: "Point",
              coordinates: [-71.11737410000001, 42.3894396],
            },
          },
          {
            type: "Feature",
            properties: {
              crimeType: "Larceny from MV",
              fileNumber: "2009-00241",
              location: "300 VASSAR ST, Cambridge, MA",
              neighborhoodId: 3,
              reportDate: "2009-01-09T19:22:00Z",
            },
            geometry: {
              type: "Point",
              coordinates: [-71.1041173, 42.3555879],
            },
          },
        ],
      };
      let jsonData = JSON.stringify(data);
      L.geoJson(JSON.parse(jsonData), {
        onEachFeature: this.onEachFeature,
      }).addTo(mapDiv);
    },
    resolveCrimePromise: async function (crime) {
      let coord;
      await this.geoCodeAddress(crime.location, function (result) {
        coord = result;
      });

      // wait for coord to to be assigned to result in callback
      // before i return object below that references coord in
      // the geometry.coordinates field
      return {
        type: "Feature",
        properties: {
          fileNumber: crime.fileNumber,
          reportDate: crime.reportDate,
          crimeType: crime.crimeType,
          neighborhood: crime.neighborhood,
          location: crime.location,
        },
        geometry: {
          type: "Point",
          coordinates: coord,
        },
      };
    },
    loadCrimes: async function () {
      let crimeData;
      axios
        .get("/api/crimes/")
        .then((response) => {
          crimeData = response.data;
        })
        .then(() => {
          let promises = crimeData.map((crime) => {
            return this.resolveCrimePromise(crime);
          });
          Promise.all(promises).then((results) => {
            crimeData = results;
            console.log(results);
          });
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

<style scoped>
#map-container {
  width: 800px;
  height: 600px;
  margin: 40px;
}
</style>