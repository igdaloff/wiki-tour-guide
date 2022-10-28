<template>
  <div class="place-list" :id="loading ? 'loading' : 'loaded'">
    <div :style="{ display: installBtn }" class="install-banner">
      <h3>
        Install this App<i class="material-symbols-outlined download-icon"
          >download</i
        >
      </h3>
      <span>to easily access it from your home screen.</span>
      <a @click="installer" href="" class="install-link">Install </a>
      <a @click="hideAppInstallBanner" href="" class="no-thanks">No thanks</a>
    </div>

    <Header />

    <transition-group
      appear
      @before-enter="beforePlaceCardsEnter"
      @enter="asPlaceCardEnter"
      tag="ul"
      name="place-list">
      <li v-for="(place, index) in placeData" :key="index" :data-index="index">
        <div class="place-image-container" @click="showPlaceText">
          <img
            :src="place.imgUrl"
            :alt="`Photo of ${place.name}`"
            :data-name="place.name" />
        </div>
        <div class="place-header">
          <span
            class="play material-symbols-outlined"
            @click="togglePlaceTextSpeech(place.description, $event)"
            >play_circle</span
          >
          <div class="place-header-meta">
            <h2 @click="showPlaceText" :data-name="place.name">
              {{ place.name }}
            </h2>
            <div class="distance">
              <a :href="place.mapUrl" target="_blank">
                <template v-if="place.mapUrl && place.distance">
                  {{ place.distance }} mi away
                  <span class="material-symbols-outlined">directions_walk</span>
                </template>
                <template v-else> Open in Map </template>
              </a>
            </div>
          </div>
        </div>

        <div class="place-description" :data-name="place.name">
          <a :href="place.wikiUrl" target="_blank">Read on Wikipedia</a>
          <p>{{ place.description }}</p>
        </div>
      </li>
    </transition-group>

    <p v-if="noPlaces == true" class="empty-state">
      No places found within 10mi. Damb. Try
      <span>expanding your search radius</span>
      <em> (a feature which doesn't exist yet)</em>.
    </p>

    <span v-if="loading" class="orb">
      <span class="loading-text">Searching…</span>
      <span class="orb-pointer"></span>
    </span>
  </div>
</template>

<style lang="scss">
@import '../assets/mixins.scss';

// Loading stuff
#loading {
  overflow: hidden; //To hide scrollbars during loading

  .orb {
    @include orb;
  }

  ul,
  header,
  .install-banner {
    opacity: 0;
  }
}

#loaded {
  ul,
  header,
  .install-banner {
    opacity: 1;
    transition: 3s opacity ease-out;
  }
}

.orb-pointer {
  height: $orb-height;
  animation: pointer-spin 3s ease-in-out infinite;

  &:after {
    content: '';
    position: absolute;
    top: -34px;
    left: calc(50% - 10px);
    right: 0;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid white;
    transition: top 3.5s ease-in;
  }
}

@keyframes pointer-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  animation: 1.5s infinite loading-text-fade ease-in;
}

@keyframes loading-text-fade {
  0%,
  100% {
    opacity: 1;
  }

  75% {
    opacity: 0;
  }
}

// PWA install banner
.install-banner {
  position: relative;
  display: block;
  background: var(--dark-grey);
  color: var(--grey);
  width: 100%;
  padding: 1em 1em 1.25em;
  margin-top: 1.25em;
  border-radius: 10px;

  h3 {
    font-size: 1.25em;
  }

  span {
    display: inline-block;
    margin-top: 0.25em;
    margin-bottom: 1em;
    font-size: 1em;
    line-height: 1.1;
  }

  .download-icon {
    position: relative;
    top: 5px;
    margin-left: 8px;
  }

  .install-link {
    @include button;
    background: var(--white);
    padding: 0.5em 0.75em;
    font-size: 1em;
    color: var(--black);
    margin-right: 1em;

    i {
      margin-inline-start: 0.5em;
    }
  }

  .no-thanks {
    text-decoration: underline;
  }
}

// Place card list
.place-list {
  @include container;
  position: relative;
  height: 100%;
}

.place-image-container {
  position: relative;
  text-align: center;
  background: var(--grey);
  border-radius: 10px;
  overflow: hidden;
  height: 250px;

  img {
    position: absolute;
    margin: auto;
    cursor: pointer;
    min-width: 100%;
    min-height: 100%;
    top: -100%;
    left: 0;
    right: 0;
    bottom: -100%;
  }
}

.place-header {
  display: flex;
  padding: calc(0.25em * var(--base)) 0 calc(1.5em * var(--base));

  h2 {
    font-weight: 700;
    cursor: pointer;
  }
}

.place-header-meta {
  justify-content: center;
  flex-direction: column;
  display: flex;
  padding-left: 0.5em;
}

.distance {
  color: var(--med-grey);
  font-size: 1em;
  text-decoration: none;
  display: flex;
  align-items: center;
  line-height: 1.3;

  span {
    font-size: 1.2em;
    padding-left: 2px;
    padding-top: 1px;
    position: absolute;
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
  cursor: pointer;
  @include hover-transition;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: 0 0 0 0px var(--black), 0 0 0 1px var(--white);
      border-radius: 100%;
      padding: 0;
    }
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

//Empty state
.empty-state {
  font-size: 1.3em;
  line-height: 1.4;
  text-align: center;
  padding: 2em 1em;

  span {
    text-decoration: underline;
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

  data() {
    return {
      installBtn: 'none',
      installer: undefined,
      placeData: [],
      lat: '',
      long: '',
      loading: true,
      noPlaces: false,
    }
  },

  setup() {
    //Loading transitions for place list items
    const beforePlaceCardsEnter = (el) => {
      el.style.transform = 'translateY(20px)'
      el.style.opacity = 0
    }
    const asPlaceCardEnter = (el, done) => {
      // First argument, el, is element we're animating; second element contains our animation properties
      gsap.to(el, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        onComplete: done,
        delay: el.dataset.index * 0.2,
      })
    }

    return { beforePlaceCardsEnter, asPlaceCardEnter }
  },

  created() {
    //Show PWA install button (see last section of this article: https://levelup.gitconnected.com/vue-pwa-example-298a8ea953c9)
    let installPrompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()

      // Stash the event so it can be triggered later
      installPrompt = e

      // Show previously hidden banner
      this.installBtn = 'block'
    })

    this.installer = () => {
      this.installBtn = 'none'
      installPrompt.prompt()
    }

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      hideInstallPromotion()

      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt = null

      // Eventually, let's send an analytics event here to indicate successful install
      console.log('PWA was installed')
    })

    // If user opts into geolocation browser prompt, run the following code. (Source: https://stackoverflow.com/questions/62481765/how-to-get-current-latitude-and-longitude-in-vuejs)
    // Note that https is required for geolocation API to work in Chrome: https://developer.chrome.com/blog/geolocation-on-secure-contexts-only/
    const geolocationSuccess = (position) => {
      this.lat = position.coords.latitude
      this.long = position.coords.longitude
      const latCache = this.lat.toFixed(2)
      const longCache = this.long.toFixed(2)

      // Documentation: https://www.mediawiki.org/wiki/API:Query
      let url = 'https://en.wikipedia.org/w/api.php?origin=*'
      const params = {
        action: 'query',
        generator: 'geosearch',
        ggscoord: this.lat + '|' + this.long,
        ggsradius: '10000',
        ggslimit: '20',
        format: 'json',
        exintro: 'true',
        prop: 'coordinates|info|extracts|pageimages',
        explaintext: '1',
        exlimit: 'max',
        inprop: 'url',
        pithumbsize: '500',
      }

      Object.keys(params).forEach(function (key) {
        url += '&' + key + '=' + params[key]
      })

      const cachedPlaceData = JSON.parse(
        localStorage.getItem(`place-data-cache-${latCache}.${longCache}`)
      )

      // If cached place list exists, we assume cached place data exists as well, so we use data from each cache to set corresponding data sets
      if (cachedPlaceData) {
        this.placeData = cachedPlaceData

        //If in development env, set loading flag immediately for quicker refresh during dev
        if (process.env.NODE_ENV == 'development') {
          this.loading = false
        } else {
          setTimeout(() => (this.loading = false), 3000)
        }

        // If cached data does not exist, we make our 2 get requests for the data
      } else {
        axios
          .get(url)
          .then((response) => {
            const allPlaceData = response.data.query.pages
            return allPlaceData
          })

          // Relevant API docs:
          // - Thumbnail: https://www.mediawiki.org/wiki/Extension:PageImages
          // - First paragraph: https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page#Method_3:_Use_the_TextExtracts_API
          // - Url: https://www.mediawiki.org/w/api.php?action=help&modules=query%2Binfo
          .then((allPlaceData) => {
            for (const property in allPlaceData) {
              const placeName = allPlaceData[property].title
              const placeDescription = allPlaceData[property].extract
              const placeWikiUrl = allPlaceData[property].canonicalurl
              const placeImgUrl =
                allPlaceData[property].thumbnail === undefined
                  ? null
                  : allPlaceData[property].thumbnail.source

              const placeLat =
                allPlaceData[property].coordinates === undefined
                  ? ''
                  : allPlaceData[property].coordinates[0].lat
              const placeLong =
                allPlaceData[property].coordinates === undefined
                  ? ''
                  : allPlaceData[property].coordinates[0].lon
              const placeMapUrl =
                placeLat != ''
                  ? `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${placeLat},${placeLong}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      placeName
                    )}`
              const distanceFromUser =
                placeLat != ''
                  ? getDistanceFromLatLong(
                      this.lat,
                      this.long,
                      placeLat,
                      placeLong
                    )
                  : null

              // Get distance between user and each place
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

              // Store each place's data in an object to be appended to array below
              const placeDataObj = {
                name: placeName,
                description: placeDescription,
                wikiUrl: placeWikiUrl,
                imgUrl: placeImgUrl,
                mapUrl: placeMapUrl,
                distance: distanceFromUser,
              }

              if (placeImgUrl) {
                this.placeData.push(placeDataObj)
              }

              // Sort places by distance from user
              this.placeData.sort(
                (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
              )

              // Cache place data in localstorage
              localStorage.setItem(
                `place-data-cache-${latCache}.${longCache}`,
                JSON.stringify(this.placeData)
              )

              if (this.loading) {
                this.loading === false
              }
            }
          })
          .then(() => new Promise((resolve) => setTimeout(resolve, 1000))) //Fictional delay to show loader animation and let place cards get in place
          .catch((error) => console.log(`${error}`))
          .finally(() => {
            this.loading = false
          })
      }
    }

    // Log any errors from Geolocation API request
    const geolocationError = (err) => {
      console.log(err)
    }

    // Geolocation API the causes location browser prompt. We wait for user to opt in (success) before running success() function above
    // TODO: I HARDCODED THE MAXIMUM AGE (CACHE) SO THAT PAGE RELOAD WOULD HAPPEN QUICKER - HOW CAN WE ALLOW USER TO FORCE GETTING NEW COORDS?
    navigator.geolocation.getCurrentPosition(
      geolocationSuccess,
      geolocationError,
      { maximumAge: 360000 }
    )
  },
  methods: {
    hideAppInstallBanner(e) {
      e.preventDefault()

      this.installBtn = 'none'
    },
    showPlaceText(e) {
      const placeName = e.target.getAttribute('data-name')
      const descriptionElement = document.querySelector(
        `.place-description[data-name='${placeName}']`
      )
      descriptionElement.classList.add('show')
    },
    togglePlaceTextSpeech(textToSay, e) {
      let utterance = new SpeechSynthesisUtterance(textToSay)
      utterance.rate = 0.9
      const speech = window.speechSynthesis

      if (e.target.classList.contains('play')) {
        speech.cancel()
        speech.speak(utterance)
        e.target.textContent = 'pause_circle'
        e.target.classList.add('pause')
        e.target.classList.remove('play')

        utterance.onend = function (e) {
          e.target.textContent = 'play_circle'
          e.target.classList.add('play')
        }
      } else {
        speech.pause()
        e.target.textContent = 'play_circle'
        e.target.classList.add('play')
      }
    },
  },
}
</script>
