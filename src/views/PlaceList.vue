<template>
  <Header />
  <div class="place-list">
    <ul>
      <li v-for="(place, index) in placeMetadata" :key="index">
        <div class="place-image-container">
          <img :src="place.imgUrl" :alt="`Photo of ${place.name}`" />
        </div>
        <div class="place-header">
          <span class="play material-symbols-outlined">play_circle</span>
          <div>
            <h2>{{ place.name }}</h2>
            <a href="" class="distance"
              >135 ft away
              <span class="material-symbols-outlined"> arrow_forward </span></a
            >
          </div>
        </div>

        <p class="place-description">{{ place.description }}</p>
        <a :href="place.url">View on Wikipedia</a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import "../assets/mixins.scss";

.place-list {
  @include container;
}

.place-image-container {
  text-align: center;
  background: var(--grey);
  border-radius: 10px;
  overflow: hidden;
  max-height: 250px;

  img {
    display: block;
    margin: 0 auto;
  }
}

.place-header {
  display: flex;
  padding: 1em 0;

  h2 {
    font-weight: 500;
  }
}

.distance {
  color: var(--dark-grey);
  font-size: 0.9em;
  text-decoration: none;
  display: flex;
  align-items: center;
  line-height: 1.3;

  span {
    font-size: 1.1em;
    padding-left: 0.2em;
  }
}

.play {
  font-variation-settings: "FILL" 1;
  font-size: 3em;
  padding-right: 0.15em;
  cursor: pointer;
  @include hover-transition;

  &:hover {
    color: var(--grey);
  }
}

.place-description {
  // overflow: hidden;
  // max-height: 0;
  // transition: 0.7 ease;
}
</style>

<script>
import axios from "axios"
import Header from "../components/Header"

export default {
  name: "PlaceList",

  components: {
    Header,
  },

  data() {
    return {
      placeMetadata: [],
      lat: "",
      long: "",
    }
  },

  async created() {
    // If geolocation request is successful (if user opts into browser prompt), run the following code. Source: https://stackoverflow.com/questions/62481765/how-to-get-current-latitude-and-longitude-in-vuejs
    // Note that https is required for geolocation API to work in Chrome: https://developer.chrome.com/blog/geolocation-on-secure-contexts-only/
    const success = (position) => {
      this.lat = position.coords.latitude
      this.long = position.coords.longitude
      const latCache = this.lat.toFixed(2)
      const longCache = this.long.toFixed(2)

      const API_KEY = process.env.VUE_APP_OPENTRIPMAP_API_KEY
      const radius = 1000

      // Use lat and long to generate Open Trip Map API request URL; this gets us the list of nearby places of interest
      const url =
        "https://api.opentripmap.com/0.1/en/places/radius?radius=" +
        radius +
        "&lon=" +
        this.long +
        "&lat=" +
        this.lat +
        "&src_geom=wikidata&src_attr=wikidata&limit=20&apikey=" +
        API_KEY

      let nearbyPlaces = []

      // NOTE TO FIX THIS: JSON.PARSE CONVERTS STRING TO OBJECT BUT WE NEED IT AS AN ARRAY
      const cachedNearbyPlaces = JSON.parse(
        localStorage.getItem(`place-list-cache-${latCache}.${longCache}`)
      )

      const cachedPlaceMetadata = JSON.parse(
        localStorage.getItem(`place-data-cache-${latCache}.${longCache}`)
      )

      // Use URL generated above in axios call, return list of places in an array; we'll loop through these below

      // If cached place list exists, we assume cached place data exists as well, so we use data from each cache to set corresponding data sets
      if (cachedNearbyPlaces) {
        nearbyPlaces = cachedNearbyPlaces
        this.placeMetadata = cachedPlaceMetadata

        // If cached data does not exist, we make our 2 get requests for the data
      } else {
        axios
          .get(url)
          .then((response) => {
            const allPlaces = response.data.features

            // Turn returned object into an array
            for (const place in allPlaces) {
              nearbyPlaces.push(allPlaces[place].properties.name.replace(/ /g, "_"))
            }

            // Cache this array using lat/long as key
            localStorage.setItem(
              `place-list-cache-${latCache}.${longCache}`,
              JSON.stringify(nearbyPlaces)
            )

            return nearbyPlaces
          })

          // When above API call completes, loop through our array of place names (created above) and query Wikipedia API for each.
          // Relevant API docs:
          // - Thumbnail: https://www.mediawiki.org/wiki/Extension:PageImages
          // - First paragraph: https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page#Method_3:_Use_the_TextExtracts_API
          // - Url: https://www.mediawiki.org/w/api.php?action=help&modules=query%2Binfo
          .then((nearbyPlaces) => {
            for (let i = 0; i < nearbyPlaces.length; i++) {
              axios
                .get(
                  `https://en.wikipedia.org/w/api.php?action=query&prop=info|extracts|pageimages&inprop=url&exsentences=10&exlimit=1&titles=${nearbyPlaces[i]}&explaintext=1&formatversion=2&format=json&origin=*&pithumbsize=500`
                )
                .then((response) => {
                  const placeName = response.data.query.pages[0].title
                  const placeDescription = response.data.query.pages[0].extract
                  const placeUrl = response.data.query.pages[0].canonicalurl
                  const placeImgUrl = response.data.query.pages[0].thumbnail.source

                  // Store result in an object to be appended to array below
                  const placeDataObj = {
                    name: placeName,
                    description: placeDescription,
                    url: placeUrl,
                    imgUrl: placeImgUrl,
                  }

                  // Add name and description object to array, only if description exists and is substantial (sometimes Wikipedia returns
                  // a description like "Gateway Theater may refer to" when it's unsure of the query you're looking for. We don't want to show those.)
                  if (placeDescription && placeDescription.length > 40) {
                    this.placeMetadata.push(placeDataObj)
                  }

                  // Cache place data in localstorage
                  localStorage.setItem(
                    `place-data-cache-${latCache}.${longCache}`,
                    JSON.stringify(this.placeMetadata)
                  )
                })
            }
          })
          .catch((error) => console.log(`Error: ${error}`))
      }
    }

    // Log any errors from Geolocation API request
    const error = (err) => {
      console.log(err)
    }

    // Geolocation API the causes location browser prompt. We wait for user to opt in (success) before running success() function above
    // TODO: I HARDCODED THE MAXIMUM AGE (CACHE) SO THAT PAGE RELOAD WOULD HAPPEN QUICKER - HOW CAN WE ALLOW USER TO FORCE GETTING NEW COORDS?
    navigator.geolocation.getCurrentPosition(success, error, { maximumAge: 360000 })
  },
}
</script>
