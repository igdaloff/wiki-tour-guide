<template>
  <div class="place-list" :id="loading ? 'loading' : 'loaded'">
    <transition-group
      appear
      @before-enter="beforeEnter"
      @enter="enter"
      tag="ul"
      name="place-list"
    >
      <Header />
      <li v-for="(place, index) in placeMetadata" :key="index" :data-index="index">
        <div class="place-image-container" @click="showDescription">
          <img
            :src="place.imgUrl"
            :alt="`Photo of ${place.name}`"
            :data-name="place.name"
          />
        </div>
        <div class="place-header">
          <span
            class="play material-symbols-outlined"
            @click="speakDescription(place.description, $event)"
            >play_circle</span
          >
          <div class="place-header-meta">
            <h2 @click="showDescription" :data-name="place.name">{{ place.name }}</h2>
            <div class="distance">
              <a :href="place.mapUrl"> {{ place.distance }} mi away </a>
              <span class="material-symbols-outlined">directions_walk</span>
            </div>
          </div>
        </div>

        <div class="place-description" :data-name="place.name">
          <a :href="place.wikiUrl">Read on Wikipedia</a>
          <p>{{ place.description }}</p>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<style lang="scss">
@import '../assets/mixins.scss';

#loading {
  opacity: 0;
  overflow: hidden; //To hide scrollbars during loading
}

#loaded {
  opacity: 1;
  transition: 2s;
}
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
    cursor: pointer;
  }
}

.place-header {
  display: flex;
  padding: calc(0.25em * var(--base)) 0 calc(1.5em * var(--base));

  h2 {
    font-weight: 500;
    cursor: pointer;
  }
}

.place-header-meta {
  justify-content: center;
  flex-direction: column;
  display: flex;
}

.distance {
  color: var(--med-grey);
  font-size: 0.9em;
  text-decoration: none;
  display: flex;
  align-items: center;
  line-height: 1.3;

  span {
    font-size: 1.2em;
    padding-left: 1px;
    padding-top: 2px;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.play,
.pause {
  font-variation-settings: 'FILL' 1;
  font-size: 3em;
  padding-right: 0.15em;
  cursor: pointer;
  @include hover-transition;

  &:hover {
    color: var(--dark-grey);
  }
}

.place-description {
  overflow: hidden;
  max-height: 0;
  transition: 0.7s ease;

  &.show {
    max-height: 1000px;
    transition: 0.7s ease;
    position: relative;
  }

  p {
    margin-bottom: 2em;
    padding-bottom: 1em;
    border-bottom: 1px solid;
  }

  a {
    display: block;
    padding-bottom: 1em;
  }
}
</style>

<script>
import axios from 'axios'
import gsap from 'gsap'
import Header from '../components/Header'

export default {
  name: 'PlaceList',

  components: {
    Header,
  },

  //Loading transitions for place list items
  setup() {
    const beforeEnter = (el) => {
      el.style.transform = 'translateY(20px)'
      el.style.opacity = 0
    }
    const enter = (el, done) => {
      // First argument, el, is element we're animating; second element contains our animation properties
      gsap.to(el, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        onComplete: done,
        delay: el.dataset.index * 0.2,
      })
    }

    return { beforeEnter, enter }
  },

  data() {
    return {
      placeMetadata: [],
      lat: '',
      long: '',
      loading: true,
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
      const radius = 5000

      // Use lat and long to generate Open Trip Map API request URL; this gets us the list of nearby places of interest
      const url =
        'https://api.opentripmap.com/0.1/en/places/radius?radius=' +
        radius +
        '&lon=' +
        this.long +
        '&lat=' +
        this.lat +
        '&src_geom=wikidata&src_attr=wikidata&limit=20&apikey=' +
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
        this.loading = false

        // If cached data does not exist, we make our 2 get requests for the data
      } else {
        axios
          .get(url)
          .then((response) => {
            const allPlaces = response.data.features

            // Turn returned object into an array
            for (const place in allPlaces) {
              nearbyPlaces.push(allPlaces[place].properties.name.replace(/ /g, '_'))
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
                  `https://en.wikipedia.org/w/api.php?action=query&prop=info|extracts|pageimages|coordinates&inprop=url&exsentences=10&exlimit=1&titles=${nearbyPlaces[i]}&explaintext=1&formatversion=2&format=json&origin=*&pithumbsize=500`
                )
                .then((response) => {
                  const placeData = response.data.query.pages[0]
                  const placeName = placeData.title
                  const placeDescription = placeData.extract
                  const placeWikiUrl = placeData.canonicalurl
                  const placeImgUrl = placeData.thumbnail.source
                  const placeLat = placeData.coordinates[0].lat
                  const placeLong = placeData.coordinates[0].lon
                  const placeMapUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${placeLat},${placeLong}`
                  const distanceFromUser = getDistanceFromLatLong(
                    this.lat,
                    this.long,
                    placeLat,
                    placeLong
                  )

                  // Get distance between user and place
                  function getDistanceFromLatLong(lat1, long1, lat2, long2) {
                    const R = 6371 // Radius of the earth in km!
                    const dLat = deg2rad(lat2 - lat1) // deg2rad below
                    const dLong = deg2rad(long2 - long1)
                    const a =
                      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(deg2rad(lat1)) *
                        Math.cos(deg2rad(lat2)) *
                        Math.sin(dLong / 2) *
                        Math.sin(dLong / 2)
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                    const d = (R * c * 0.621371).toFixed(2) // Distance in mi
                    return d
                  }

                  function deg2rad(deg) {
                    return deg * (Math.PI / 180)
                  }

                  // Store result in an object to be appended to array below
                  const placeDataObj = {
                    name: placeName,
                    description: placeDescription,
                    wikiUrl: placeWikiUrl,
                    imgUrl: placeImgUrl,
                    mapUrl: placeMapUrl,
                    distance: distanceFromUser,
                  }

                  // Add name and description object to array, only if description exists and is substantial (sometimes Wikipedia returns
                  // a description like "Gateway Theater may refer to" when it's unsure of the query you're looking for. We don't want to show those.)
                  if (placeDescription && placeDescription.length > 40) {
                    this.placeMetadata.push(placeDataObj)

                    // Sort by distance
                    this.placeMetadata.sort(
                      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
                    )
                  }

                  // Cache place data in localstorage
                  localStorage.setItem(
                    `place-data-cache-${latCache}.${longCache}`,
                    JSON.stringify(this.placeMetadata)
                  )
                })

              if (this.loading) {
                this.loading === false
              }
            }
          })
          .catch((error) => console.log(`Error: ${error}`))
          .finally(() => {
            this.loading = false
          })
      }
    }

    // Log any errors from Geolocation API request
    const error = (err) => {
      console.log(err)
    }

    // Geolocation API the causes location browser prompt. We wait for user to opt in (success) before running success() function above
    // TODO: I HARDCODED THE MAXIMUM AGE (CACHE) SO THAT PAGE RELOAD WOULD HAPPEN QUICKER - HOW CAN WE ALLOW USER TO FORCE GETTING NEW COORDS?
    navigator.geolocation.getCurrentPosition(success, error, {
      maximumAge: 360000,
    })
  },
  methods: {
    showDescription(e) {
      const placeName = e.target.getAttribute('data-name')
      const descriptionElement = document.querySelector(
        `.place-description[data-name='${placeName}']`
      )
      descriptionElement.classList.add('show')
    },
    speakDescription(textToSay, event) {
      let utterance = new SpeechSynthesisUtterance(textToSay)

      if (event.target.classList.contains('play')) {
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
        event.target.textContent = 'pause_circle'
        event.target.classList.add('pause')
        event.target.classList.remove('play')
      } else {
        window.speechSynthesis.pause()
        event.target.textContent = 'play_circle'
        event.target.classList.add('play')
      }
    },
  },
}
</script>
