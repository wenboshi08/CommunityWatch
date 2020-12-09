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
    import icon from "leaflet/dist/images/marker-icon.png";
    import iconShadow from "leaflet/dist/images/marker-shadow.png";
    import {eventBus} from "../main";

    export default {
        name: "Map",
        components: {},
        props: {
            type_id: Number,
            neighbor_id: Number,
            neighbor: String,
            startdate: String,
            enddate : String,
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
                this.getCrimes();
            });

            eventBus.$on("changeNeighbor-success", () => {
                this.getCrimes();
            });

            eventBus.$on("changeStartDate-success", () => {
                this.getCrimes();
            });

            eventBus.$on("changeEndDate-success", () => {
                this.getCrimes();
            });
        },
        mounted: function () {
            this.getCrimes();
        },

        methods: {
            getCrimes: async function () {
                let that = await this;
                axios
                    .get(
                        `/api/crimes?type=${that.$props.type_id}&neigh=${that.$props.neighbor_id}&from_=${that.$props.startdate}&to_=${that.$props.enddate}`
                    )
                    .then((response) => {
                        const crimes = response.data;
                        return crimes;
                    }).then((crimes) => {
                        return crimes.map((crime) => {
                            return {
                                  type: "Feature",
                                  properties: {
                                    fileNumber: crime.fileNumber,
                                    reportDate: crime.reportDate,
                                    crimeType: crime.crimeType,
                                    neighborhood: crime.neighborhood,
                                    location: crime.location.split(' ').slice(1).join(' '),
                                  },
                                  geometry: {
                                    type: "Point",
                                    coordinates: [crime.longitude, crime.latitude],
                                  },
                                }
                        })
                }).then((processedCrimes) => {
                    that.crimes = processedCrimes;
                }).then(() => {
                    that.setupLeafletMap(that.crimes);
                });
            },

            // geoCodeAddress: async (location, fn) => {
            //     return mapquest.geocode(
            //         {
            //             address: [location],
            //             key: "gX72Jyp1H1l0fIoGb06xGY6yJ9h6KMN1",
            //         },
            //         function (err, result) {
            //             fn([result.displayLatLng.lng, result.displayLatLng.lat]);
            //         }
            //     );
            // },
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
                // var container = L.DomUtil.get('map-container');
                //   if(container != null){
                //   container._leaflet_id = null;
                //   }
                if (mapDiv !== undefined && mapDiv !== null) {
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
                let data = {
                    type: "FeatureCollection",
                    features: crimes,
                };
                let jsonData = JSON.stringify(data);
                L.geoJson(JSON.parse(jsonData), {
                    onEachFeature: this.onEachFeature,
                }).addTo(mapDiv);
                this.map = mapDiv;
            },

            // resolveCrimePromise: async function (crime) {
            //     let coord;
            //     await this.geoCodeAddress(crime.location, function (result) {
            //         coord = result;
            //     });
            //
            //     // wait for coord to to be assigned to result in callback
            //     // before i return object below that references coord in
            //     // the geometry.coordinates field
            //     return {
            //         type: "Feature",
            //         properties: {
            //             fileNumber: crime.fileNumber,
            //             reportDate: crime.reportDate,
            //             crimeType: crime.crimeType,
            //             neighborhood: crime.neighborhood,
            //             location: crime.location.split(' ').slice(1).join(' '),
            //         },
            //         geometry: {
            //             type: "Point",
            //             coordinates: coord,
            //         },
            //     };
            // },


            // loadCrimes: async function () {
            //   let crimeData;
            //   axios
            //     .get("/api/crimes/")
            //     .then((response) => {
            //       crimeData = response.data;
            //     })
            //     .then(() => {
            //       let promises = crimeData.map((crime) => {
            //         return this.resolveCrimePromise(crime);
            //       });
            //       Promise.all(promises).then((results) => {
            //         crimeData = results;
            //       });
            //     });
            // },

            // newLoadCrimes: async function () {
            //   let that = await this;
            //   let res = await axios
            //     .get(
            //       `/api/crimes?type=${that.$props.type_id}&neigh=${that.$props.neighbor_id}`
            //     )
            //     .then((response) => {
            //       return response.data;
            //     })
            //     .then((crimes) => {
            //       const KEY = "2PiwKOE0ZPWlhGEJjVghZmpmDWoYYGiJ";
            //       const promises = crimes.map((crime) => {
            //         return axios
            //           .get(
            //             `https://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${crime.location}`
            //           )
            //           .then((response) => {
            //             return response.data.results[0].locations[0].displayLatLng;
            //           })
            //           .then((location) => {
            //             return {
            //               type: "Feature",
            //               properties: {
            //                 fileNumber: crime.fileNumber,
            //                 reportDate: crime.reportDate,
            //                 crimeType: crime.crimeType,
            //                 neighborhood: crime.neighborhood,
            //                 location: crime.location.split(' ').slice(1).join(' '),
            //               },
            //               geometry: {
            //                 type: "Point",
            //                 coordinates: [location.lng, location.lat],
            //               },
            //             };
            //           });
            //       });
            //       Promise.all(promises)
            //         .then((Data) => {
            //           that.crimes = Data;
            //         })
            //         .then(() => {
            //           this.setupLeafletMap(that.crimes);
            //         });
            //     })
            //     .catch((error) => {
            //       alert(error);
            //     });
            //   return res;
            // },

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