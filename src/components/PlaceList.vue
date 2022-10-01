<template>
  <div>
    <ul>
      <li v-for="(place, index) in placeDataArr" :key="index">
        <h2>{{ place.name }}</h2>
        <p>{{ place.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PlaceList",

  data() {
    return {
      placeDataArr: [],
      lat: "",
      long: "",
    };
  },
  async created() {
    // If geolocation request is successful (if user opts into browser prompt), run the following code. Source: https://stackoverflow.com/questions/62481765/how-to-get-current-latitude-and-longitude-in-vuejs
    const success = (position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;

      const API_KEY = process.env.VUE_APP_OPENTRIPMAP_API_KEY;
      const radius = 2000;

      // Use lat and long to generate Open Trip Map API request URL; this gets us the list of nearby places of interest
      const url =
        "https://api.opentripmap.com/0.1/en/places/radius?radius=" +
        radius +
        "&lon=" +
        this.long +
        "&lat=" +
        this.lat +
        "&src_geom=wikidata&src_attr=wikidata&limit=20&apikey=" +
        API_KEY;

      // Use URL generated above in axios call, return list of places in an array; we'll loop through these below
      axios
        .get(url)
        .then((response) => {
          const allPlaces = response.data.features;
          const allPlacesArr = [];

          // Turn returned object into an array
          for (const place in allPlaces) {
            allPlacesArr.push(allPlaces[place].properties.name.replace(/ /g, "_"));
          }
          return allPlacesArr;
        })

        // When above API call completes, loop through our array of place names (created above) and query Wikipedia API for each.
        .then((allPlacesArr) => {
          for (let i = 0; i < allPlacesArr.length; i++) {
            axios
              .get(
                `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${allPlacesArr[i]}&explaintext=1&formatversion=2&format=json&origin=*`
              )
              .then((response) => {
                const placeName = response.data.query.pages[0].title;
                const placeDescription = response.data.query.pages[0].extract;

                // Store result in an object to be appended to array below
                const placeDataObj = {
                  name: placeName,
                  description: placeDescription,
                };

                // Add name and description object to array, only if description exists and is substantial (sometimes Wikipedia returns
                // a description like "Gateway Theater may refer to" when it's unsure of the query you're looking for. We don't want to show those.)
                if (placeDescription && placeDescription.length > 40) {
                  this.placeDataArr.push(placeDataObj);
                }
              });
          }
        })
        .catch((error) => console.log(`Error: ${error}`));
    };

    // Log any errors from Geolocation API request
    const error = (err) => {
      console.log(err);
    };

    // Geolocation API the causes location browser prompt. We wait for user to opt in (success) before running success() function above
    navigator.geolocation.getCurrentPosition(success, error);
  },
};
</script>

<style></style>
