<template>
  <div class="place-list" :id="loading ? 'loading' : 'loaded'" :aria-busy="loading.toString()">
    <InstallBanner />
    <Header />

    <div class="sort-controls" v-if="!loading && placeData.length">
      <span class="sort-label">Sort By</span>
      <button
        class="sort-btn"
        :class="{ active: sortMode === 'curiosity' }"
        @click="setSortMode('curiosity')"
        :aria-pressed="(sortMode === 'curiosity').toString()">
        <span class="material-symbols-outlined sort-spinner" v-if="rankLoading">progress_activity</span>
        <span class="material-symbols-outlined sort-ai-icon" v-else>auto_awesome</span>
        Curiosity
      </button>
      <button
        class="sort-btn"
        :class="{ active: sortMode === 'distance' }"
        @click="setSortMode('distance')"
        :aria-pressed="(sortMode === 'distance').toString()">
        Distance
      </button>
    </div>

    <transition-group appear @before-enter="beforePlaceCardsEnter" @enter="asPlaceCardEnter" tag="ul" name="place-list">
      <li v-for="(place, index) in sortedPlaces" :key="place.name" :data-index="index">
        <a class="place-image-container" :href="place.wikiUrl" target="_blank" rel="noopener">
          <img :src="place.imgUrl" :alt="`Photo of ${place.name}`" />
        </a>
        <div class="place-header">
          <div class="distance" v-if="place.distance">
            <a :href="place.mapUrl" target="_blank">
              {{ place.distance }} mi away<span class="material-symbols-outlined">directions_walk</span>
            </a>
          </div>
          <h2><a :href="place.wikiUrl" target="_blank" rel="noopener">{{ place.name }}</a></h2>
          <p class="place-snippet" v-if="place.snippet">{{ place.snippet }}</p>
          <div class="place-actions">
            <button
              class="action-btn speech-toggle stopped"
              @click="togglePlaceTextSpeech(place.description, $event)"
              :aria-label="`Play audio description of ${place.name}`">
              <span class="material-symbols-outlined">play_arrow</span>
              <span class="label-stopped">Listen to Entry</span>
              <span class="label-playing">Stop Audio</span>
            </button>
            <button class="action-btn tour-action-btn" @click="startTour(place)">
              <span class="material-symbols-outlined">route</span>
              Start Tour
            </button>
          </div>
        </div>

        <div
          class="place-description"
          :class="[place.name == openPlaceTextIndex ? 'show' : '']"
          :data-name="place.name">
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

    <span aria-live="polite" class="sr-only">{{
      loading ? 'Searching for nearby places…' : `${sortedPlaces.length} places found`
    }}</span>

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

// Place card list
.place-list {
  @include container;
  position: relative;
  height: 100%;

  li {
    margin-bottom: calc(2em * var(--base));
  }
}

.place-image-container {
  position: relative;
  margin-bottom: calc(0.5em * var(--base));
  text-align: center;
  background: var(--grey);
  border-radius: 10px;
  overflow: hidden;
  height: 250px;
  display: block;

  &:focus-visible {
    outline: 2px solid var(--white);
    outline-offset: 2px;
  }

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
  flex-direction: column;
  align-items: flex-start;

  h2 {
    font-family: var(--display);
    font-size: 1.35em;
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 0.5em;

    a {
      color: inherit;
      text-decoration: none;
      @include hover-transition;

      &:hover {
        color: var(--light-grey);
      }
    }
  }
}

.distance {
  color: var(--light-grey);
  font-size: 0.75em;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-decoration: none;
  margin-bottom: 0.25em;

  span {
    position: relative;
    top: 4px;
    padding-left: 2px;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 0.5;
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: var(--white);
    }
  }
}

.action-btn {
  background: none;
  border: 1px solid var(--border-grey);
  border-radius: 5px;
  color: var(--light-grey);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
  padding: 5px 8px;
  font-size: 0.6em;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  @include hover-transition;

  span {
    font-size: 1.5em;
    font-variation-settings: 'FILL' 0;
    line-height: 1;
  }

  &:hover {
    border-color: var(--white);
    color: var(--white);
  }

  &.stopped .label-playing,
  &.playing .label-stopped {
    display: none;
  }

  &.playing {
    background: var(--white);
    border-color: var(--white);
    color: var(--black);
  }
}

.place-description {
  overflow: hidden;
  margin-top: calc(0.5em * var(--base));
  max-height: 0;
  transition: 0.7s ease;

  &.show {
    max-height: 1000px;
    transition: 0.7s ease;
    position: relative;
  }

  p {
    font-size: 1em;
    line-height: calc(1em * var(--base) * 1.25);
    color: var(--grey);
    padding-bottom: 1.5em;
    border-bottom: 1px solid var(--border-grey);
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding-bottom: 1em;
    font-size: 0.8em;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--light-grey);
    text-decoration: none;
    @include hover-transition;

    &:hover {
      color: var(--white);
    }
  }
}

.place-snippet {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.85em;
  line-height: 1.5;
  color: var(--light-grey);
  margin-bottom: 0.75em;
}

.place-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1.5em;
}

.sort-label {
  font-size: 0.75em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--med-grey);
  margin-right: 0.25em;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  background: none;
  border: 1px solid var(--border-grey);
  border-radius: 4px;
  color: var(--med-grey);
  cursor: pointer;
  font-size: 0.75em;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.5em 0.75em;
  @include hover-transition;

  &:hover {
    border-color: var(--light-grey);
    color: var(--light-grey);
  }

  &.active {
    border-color: var(--white);
    color: var(--white);
  }

  .sort-spinner,
  .sort-ai-icon {
    font-size: 1.1em;
    font-variation-settings: 'FILL' 1;
  }

  .sort-spinner {
    animation: sort-spin 1s linear infinite;
  }
}

@keyframes sort-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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
import axios from 'axios';
import gsap from 'gsap';
import Header from '../components/Header';
import InstallBanner from '../components/InstallBanner';

export default {
  name: 'PlaceList',

  components: {
    Header,
    InstallBanner
  },

  data() {
    return {
      placeData: [],
      lat: '',
      long: '',
      loading: true,
      noPlaces: false,
      openPlaceTextIndex: null,
      sortMode: 'curiosity',
      curioRank: [],
      rankLoading: false
    };
  },

  computed: {
    sortedPlaces() {
      if (this.sortMode === 'distance') {
        return [...this.placeData].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      }
      if (this.curioRank.length) {
        return [...this.placeData].sort((a, b) => {
          const ai = this.curioRank.indexOf(a.name);
          const bi = this.curioRank.indexOf(b.name);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });
      }
      return [...this.placeData].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
  },

  setup() {
    //Loading transitions for place list items
    const beforePlaceCardsEnter = el => {
      el.style.transform = 'translateY(20px)';
      el.style.opacity = 0;
    };
    const asPlaceCardEnter = (el, done) => {
      // First argument, el, is element we're animating; second element contains our animation properties
      gsap.to(el, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        onComplete: done,
        delay: el.dataset.index * 0.2
      });
    };

    return { beforePlaceCardsEnter, asPlaceCardEnter };
  },

  created() {
    //Show PWA install button (see last section of this article: https://levelup.gitconnected.com/vue-pwa-example-298a8ea953c9)
    //Note that as of this writing, on mobile beforeinstallprompt is only supported on Chrome for Android, Android Browser, and Opera, and no major iOS browsers. There's a fix for iOS below.
    let pwaInstallPrompt;
    window.addEventListener('beforeinstallprompt', e => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();

      // Stash the event so it can be triggered later
      pwaInstallPrompt = e;

      // Show previously hidden banner
      this.pwaInstallBannerDisplay = 'block';
    });

    this.installer = () => {
      this.pwaInstallBannerDisplay = 'none';
      pwaInstallPrompt.prompt();
    };

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      hideInstallPromotion();

      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt = null;

      // Eventually, let's send an analytics event here to indicate successful install
      console.log('PWA was installed');
    });

    // If user opts into geolocation browser prompt, run the following code. (Source: https://stackoverflow.com/questions/62481765/how-to-get-current-latitude-and-longitude-in-vuejs)
    // Note that https is required for geolocation API to work in Chrome: https://developer.chrome.com/blog/geolocation-on-secure-contexts-only/
    const geolocationSuccess = position => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      const latCache = this.lat.toFixed(2);
      const longCache = this.long.toFixed(2);

      // Documentation: https://www.mediawiki.org/wiki/API:Query
      let url = 'https://en.wikipedia.org/w/api.php?origin=*';
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
        pithumbsize: '500'
        // exchars: '40', //For testing only so speechsynthesis doesn't last forever
      };

      Object.keys(params).forEach(function (key) {
        url += '&' + key + '=' + params[key];
      });

      const cachedPlaceData = JSON.parse(localStorage.getItem(`place-data-cache-${latCache}.${longCache}`));

      // If cached place list exists, we assume cached place data exists as well, so we use data from each cache to set corresponding data sets
      if (cachedPlaceData) {
        this.placeData = cachedPlaceData;
        this.fetchRanking(latCache, longCache);

        //If in development env, set loading flag immediately for quicker refresh during dev
        if (process.env.NODE_ENV == 'development') {
          this.loading = false;
        } else {
          setTimeout(() => (this.loading = false), 3000);
        }

        // If cached data does not exist, we make our 2 get requests for the data
      } else {
        axios
          .get(url)
          .then(response => {
            const allPlaceData = response.data.query.pages;
            return allPlaceData;
          })

          // Relevant API docs:
          // - Thumbnail: https://www.mediawiki.org/wiki/Extension:PageImages
          // - First paragraph: https://www.mediawiki.org/wiki/API:Get_the_contents_of_a_page#Method_3:_Use_the_TextExtracts_API
          // - Url: https://www.mediawiki.org/w/api.php?action=help&modules=query%2Binfo
          .then(allPlaceData => {
            for (const property in allPlaceData) {
              const placeName = allPlaceData[property].title;
              const placeDescription = allPlaceData[property].extract;
              const placeWikiUrl = allPlaceData[property].canonicalurl;
              const placeImgUrl =
                allPlaceData[property].thumbnail === undefined ? null : allPlaceData[property].thumbnail.source;

              const placeLat =
                allPlaceData[property].coordinates === undefined ? '' : allPlaceData[property].coordinates[0].lat;
              const placeLong =
                allPlaceData[property].coordinates === undefined ? '' : allPlaceData[property].coordinates[0].lon;
              const placeMapUrl =
                placeLat != ''
                  ? `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${placeLat},${placeLong}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
              const distanceFromUser =
                placeLat != '' ? getDistanceFromLatLong(this.lat, this.long, placeLat, placeLong) : null;

              // Get distance between user and each place
              function getDistanceFromLatLong(lat1, long1, lat2, long2) {
                const R = 6371; // Radius of the earth in km!
                const dLat = deg2rad(lat2 - lat1); // deg2rad below
                const dLong = deg2rad(long2 - long1);
                const a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const d = (R * c * 0.621371).toFixed(2); // Distance in mi
                return d;
              }

              function deg2rad(deg) {
                return deg * (Math.PI / 180);
              }

              const snippet = placeDescription?.match(/^[^.!?]+[.!?]/)?.[0] || '';

              // Store each place's data in an object to be appended to array below
              const placeDataObj = {
                name: placeName,
                description: placeDescription,
                snippet,
                wikiUrl: placeWikiUrl,
                imgUrl: placeImgUrl,
                mapUrl: placeMapUrl,
                distance: distanceFromUser
              };

              if (placeImgUrl) {
                this.placeData.push(placeDataObj);
              }

              // Sort places by distance from user
              this.placeData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

              // Cache place data in localstorage
              localStorage.setItem(`place-data-cache-${latCache}.${longCache}`, JSON.stringify(this.placeData));

              if (this.loading) {
                this.loading === false;
              }
            }
          })
          .then(() => new Promise(resolve => setTimeout(resolve, 1000))) //Fictional delay to show loader animation and let place cards get in place
          .catch(error => console.log(`${error}`))
          .finally(() => {
            this.loading = false;
            this.fetchRanking(latCache, longCache);
          });
      }
    };

    // Log any errors from Geolocation API request
    const geolocationError = err => {
      console.log(err);
    };

    // Geolocation API the causes location browser prompt. We wait for user to opt in (success) before running success() function above
    // TODO: I HARDCODED THE MAXIMUM AGE (CACHE) SO THAT PAGE RELOAD WOULD HAPPEN QUICKER - HOW CAN WE ALLOW USER TO FORCE GETTING NEW COORDS?
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, { maximumAge: 360000 });
  },
  methods: {
    hideAppInstallBanner(e) {
      e.preventDefault();

      this.pwaInstallBannerDisplay = 'none';
    },
    setSortMode(mode) {
      this.sortMode = mode;
      this.openPlaceTextIndex = null;
    },
    async fetchRanking(latCache, longCache) {
      const cacheKey = `curiosity-rank-${latCache}.${longCache}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        this.curioRank = JSON.parse(cached);
        return;
      }
      this.rankLoading = true;
      try {
        const { data } = await axios.post('/.netlify/functions/rank', {
          places: this.placeData.map(p => ({ name: p.name, description: p.description }))
        });
        this.curioRank = data.ranked;
        localStorage.setItem(cacheKey, JSON.stringify(this.curioRank));
      } catch (err) {
        console.error('Ranking failed, falling back to distance sort', err);
        this.sortMode = 'distance';
      } finally {
        this.rankLoading = false;
      }
    },
    togglePlaceText(name) {
      this.openPlaceTextIndex = this.openPlaceTextIndex === name ? null : name;
    },
    startTour(place) {
      const latCache = parseFloat(this.lat).toFixed(2);
      const longCache = parseFloat(this.long).toFixed(2);
      const actualIndex = this.placeData.findIndex(p => p.name === place.name);
      localStorage.setItem('tour-start-index', actualIndex !== -1 ? actualIndex : 0);
      localStorage.setItem('tour-place-cache-key', `place-data-cache-${latCache}.${longCache}`);
      this.$router.push('/tour');
    },
    togglePlaceTextSpeech(textToSay, e) {
      const utterance = new SpeechSynthesisUtterance(textToSay);
      utterance.rate = 0.9;
      const speech = window.speechSynthesis;
      const btn = e.currentTarget;
      const icon = btn.querySelector('.material-symbols-outlined');

      if (btn.classList.contains('stopped')) {
        speech.cancel();
        speech.speak(utterance);

        document.querySelectorAll('.speech-toggle').forEach(b => {
          b.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
          b.classList.replace('playing', 'stopped');
        });
        icon.textContent = 'stop';
        btn.classList.replace('stopped', 'playing');
      } else {
        speech.cancel();
        icon.textContent = 'play_arrow';
        btn.classList.replace('playing', 'stopped');
      }

      utterance.onend = () => {
        icon.textContent = 'play_arrow';
        btn.classList.replace('playing', 'stopped');
      };
    }
  }
};
</script>
