<template>
  <div class="map col-md-8">
    <div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="container">
        <div id="map-container"></div>
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
import { eventBus } from "../main";

export default {
  name: "Map",
  components: {},
  props: {
    type_id: Number,
    neighbor_id: Number,
  },
  data() {
    return {
      map: undefined,
      error: "",
      success: "",
      crimes: [],
      center: [-71.1097, 42.3736],
    };
  },
  created: function () {
    eventBus.$on("changeType-success", () => {
      this.newLoadCrimes();
    });

    eventBus.$on("changeNeighbor-success", () => {
      this.newLoadCrimes();
    });
  },
  mounted: function () {
    this.newLoadCrimes();
  },

  methods: {
    geoCodeAddress: async (location, fn) => {
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
      if (
        feature.properties &&
        feature.properties.crimeType &&
        feature.properties.neighborhood &&
        feature.properties.location
      ) {
        layer.bindPopup(
          feature.properties.neighborhood +
            ", " +
            feature.properties.crimeType +
            ", " +
            feature.properties.location
        );
        layer.on("mouseover", () => {
          layer.openPopup();
        });
        layer.on("mouseout", () => {
          layer.closePopup();
        });
      }
    },
    setupLeafletMap: function (crimes) {
      let mapDiv = this.map;
      if (mapDiv !== undefined) {
        mapDiv.remove();
      }
      mapDiv = L.map("map-container").setView(
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
      // let data = {
      //   type: "FeatureCollection",
      //   features: [
      //     {
      //       type: "Feature",
      //       properties: {
      //         crimeType: "AutoTheft",
      //         fileNumber: "2009-00217",
      //         location: "100 CHURCH ST, Cambridge, MA",
      //         neighborhoodId: 1,
      //         reportDate: "2009-01-08T20:53:00Z",
      //       },
      //       geometry: {
      //         type: "Point",
      //         coordinates: [-71.1214574, 42.3739487],
      //       },
      //     },
      //     {
      //       type: "Feature",
      //       properties: {
      //         crimeType: "Hit and Run",
      //         fileNumber: "2009-00219",
      //         location: "0 BLAKESLEE ST, Cambridge, MA",
      //         neighborhoodId: 1,
      //         reportDate: "2009-01-08T22:02:00Z",
      //       },
      //       geometry: {
      //         type: "Point",
      //         coordinates: [-71.13506269999999, 42.3809522],
      //       },
      //     },
      //     {
      //       type: "Feature",
      //       properties: {
      //         crimeType: "Shoplifting",
      //         fileNumber: "2009-00233",
      //         location: "0 WHITE ST, Cambridge, MA",
      //         neighborhoodId: 2,
      //         reportDate: "2009-01-09T15:02:00Z",
      //       },
      //       geometry: {
      //         type: "Point",
      //         coordinates: [-71.11737410000001, 42.3894396],
      //       },
      //     },
      //     {
      //       type: "Feature",
      //       properties: {
      //         crimeType: "Larceny from MV",
      //         fileNumber: "2009-00241",
      //         location: "300 VASSAR ST, Cambridge, MA",
      //         neighborhoodId: 3,
      //         reportDate: "2009-01-09T19:22:00Z",
      //       },
      //       geometry: {
      //         type: "Point",
      //         coordinates: [-71.1041173, 42.3555879],
      //       },
      //     },
      //   ],
      // };
      let data = {
        type: "FeatureCollection",
        features: crimes,
      };
      // console.log(data);
      let jsonData = JSON.stringify(data);
      L.geoJson(JSON.parse(jsonData), {
        onEachFeature: this.onEachFeature,
      }).addTo(mapDiv);
      this.map = mapDiv;
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
            // console.log(results);
          });
        });
    },

    newLoadCrimes: async function () {
      let that = await this;
      let res = await axios
        .get(
          `/api/crimes?type=${that.$props.type_id}&neigh=${that.$props.neighbor_id}`
        )
        .then((response) => {
          return response.data;
        })
        .then((crimes) => {
          const KEY = "gX72Jyp1H1l0fIoGb06xGY6yJ9h6KMN1";
          const promises = crimes.map((crime) => {
            return axios
              .get(
                `http://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${crime.location}`
              )
              .then((response) => {
                return response.data.results[0].locations[0].displayLatLng;
              })
              .then((location) => {
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
                    coordinates: [location.lng, location.lat],
                  },
                };
              });
          });
          Promise.all(promises)
            .then((Data) => {
              // console.log(Data);
              that.crimes = Data;
            })
            .then(() => {
              this.setupLeafletMap(that.crimes);
            });
        })
        .catch((error) => {
          alert(error);
        });
      return res;
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
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;
  margin: 5%;
}
</style>