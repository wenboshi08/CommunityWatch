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
// import mapquest from "mapquest";
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { eventBus } from "../main";

    export default {
        name: "Map",
        components: {},
        props: {
            type_id: Number,
            neighbor_id: Number,
            neighbor: String,
            startdate: String,
            enddate : String,
            navPage : String,
            following: Array[Number],
            userId: String,
        },
        data() {
            return {
                map: undefined,
                error: "",
                success: "",
                crimes: [],
                center: [-71.1097, 42.3736],
                followedNeighborhoods: [],
            };
        },
  

    created: function () {
        eventBus.$on("changeType-success", () => {
            this.getFollowedNeighborhoods();
        });

        eventBus.$on("changeNeighbor-success", () => {
            this.getFollowedNeighborhoods();
        });

        eventBus.$on("changeStartDate-success", () => {
            this.getFollowedNeighborhoods();
        });

        eventBus.$on("toMain", () => {
            this.getCrimes();
        });

        eventBus.$on("toMine", () => {
            this.getCrimes(true);
        });

        eventBus.$on("changeEndDate-success", () => {
        this.getFollowedNeighborhoods();
        });

        eventBus.$on("follow-neighbor-success", () => {
        this.getFollowedNeighborhoods();
        });

        eventBus.$on("unfollow-neighbor-success", () => {
        this.getFollowedNeighborhoods();
        });
    },
  mounted: function () {
    this.getFollowedNeighborhoods();
  },

  methods: {
    getCrimes: async function () {
      let that = await this;
      if(that.navPage === "neigh") {
        const bodyContent = {neigh: that.$props.following};
        axios
        .put(
            `/api/crimes/mine?type=${that.$props.type_id}&from_=${that.$props.startdate}&to_=${that.$props.enddate}`, bodyContent
        ).then((response) => {
          const crimes = response.data;
          return crimes;
        })
        .then((crimes) => {
          return crimes.map((crime) => {
            return {
              type: "Feature",
              properties: {
                fileNumber: crime.fileNumber,
                reportDate: crime.reportDate,
                crimeType: crime.crimeType,
                neighborhood: crime.neighborhood,
                location: crime.location.split(" ").slice(1).join(" "),
              },
              geometry: {
                type: "Point",
                coordinates: [crime.longitude, crime.latitude],
              },
            };
          });
        })
        .then((processedCrimes) => {
          that.crimes = processedCrimes;
        })
        .then(() => {
          that.setupLeafletMap(that.crimes);
        });
      } else {
        axios
            .get(
            `/api/crimes?type=${that.$props.type_id}&neigh=${that.$props.neighbor_id}&from_=${that.$props.startdate}&to_=${that.$props.enddate}`
            )
            .then((response) => {
            const crimes = response.data;
            return crimes;
            })
            .then((crimes) => {
            return crimes.map((crime) => {
                
                return {
                type: "Feature",
                properties: {
                    fileNumber: crime.fileNumber,
                    reportDate: crime.reportDate,
                    crimeType: crime.crimeType,
                    neighborhood: crime.neighborhood,
                    location: crime.location.split(" ").slice(1).join(" "),
                },
                geometry: {
                    type: "Point",
                    coordinates: [crime.longitude, crime.latitude],
                },
                };
            });
            })
            .then((processedCrimes) => {
            that.crimes = processedCrimes;
            })
            .then(() => {
            that.setupLeafletMap(that.crimes);
            });
      }
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
    setupLeafletMap: async function (crimes) {
      let mapDiv = this.map;
      if (mapDiv !== undefined) {
        mapDiv.remove();
      }
      mapDiv = L.map("map-container").setView(
        [42.37369292702129, -71.11050691418987],
        13
      );
      // let DefaultIcon = L.icon({
      //   iconUrl: icon,
      //   shadowUrl: iconShadow,
      // });

      // L.Marker.prototype.options.icon = DefaultIcon;
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
        features: crimes,
      };
      let jsonData = JSON.stringify(data);

      let that = await this;
      L.geoJson(JSON.parse(jsonData), {
        onEachFeature: this.onEachFeature,
        pointToLayer: function (feature, latlng) {
          // orange icon
          let markerHtmlStylesOrange = `
                background-color: ${"#F68A37"};
                width: 1.5rem;
                height: 1.5rem;
                display: block;
                left: -.8rem;
                top: -1.5rem;
                position: relative;
                border-radius: 3rem 3rem 0;
                transform: rotate(45deg);
                border: 1px solid #FFFFFF`;
          let orangeIcon = L.divIcon({
            className: "",
            iconAnchor: [0, 24],
            labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            html: `<span style="${markerHtmlStylesOrange}" />`,
          });

          // blue icon
          let markerHtmlStylesBlue = `
                background-color: ${"#236AB9"};
                width: 1.5rem;
                height: 1.5rem;
                display: block;
                left: -.8rem;
                top: -1.5rem;
                position: relative;
                border-radius: 3rem 3rem 0;
                transform: rotate(45deg);
                border: 1px solid #FFFFFF`;
          let blueIcon = L.divIcon({
            className: "",
            iconAnchor: [0, 24],
            labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            html: `<span style="${markerHtmlStylesBlue}" />`,
          });

          if (
            that.followedNeighborhoods.includes(feature.properties.neighborhood)
          ) {
            return new L.Marker(latlng, { icon: orangeIcon });
          } else {
            return new L.Marker(latlng, { icon: blueIcon });
          }
        },
      }).addTo(mapDiv);
      this.map = mapDiv;
    },

    getFollowedNeighborhoods: async function () {
      let that = await this;
      if (that.$props.userId) {
        axios.get(`/api/feeds/user?id=${that.$props.userId}`).then((res) => {
          let neighborhoodIds = [...res.data];
          that.followedNeighborhoods = [];
          neighborhoodIds.map((n) => {
            axios
              .get(`/api/neighborhoods/${n.neighborhoodId}`)
              .then((res2) => {
                that.followedNeighborhoods.push(res2.data.neighborhood);
              })
              .then(() => {
                that.getCrimes();
              });
          });
        });
      } else {
        that.followedNeighborhoods = [];
        that.getCrimes();
      }
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