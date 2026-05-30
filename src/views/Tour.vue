<template>
  <div class="tour" :id="loading ? 'tour-loading' : 'tour-loaded'">
    <Header />

    <div v-if="loading" class="tour-loader">
      <span class="orb">
        <span class="loading-text">Designing tour…</span>
        <span class="orb-pointer"></span>
      </span>
    </div>

    <div v-else-if="error" class="tour-error">
      <p>{{ error }}</p>
      <router-link to="/list">Back to places</router-link>
    </div>

    <div v-else class="tour-content">
      <div class="tour-controls">
        <button class="material-symbols-outlined speech-toggle stopped" @click="toggleSpeech" aria-label="Play tour narration">play_circle</button>
        <span class="tour-label">Listen to tour</span>
      </div>

      <template v-for="(stop, i) in tour.stops" :key="i">
        <p class="tour-transition" v-html="renderText(stop.before)"></p>
        <div class="tour-stop-card">
          <div class="stop-image-container" v-if="stop.imgUrl">
            <img :src="stop.imgUrl" :alt="`Photo of ${stop.name}`" />
          </div>
          <div class="stop-info">
            <span class="stop-number">Stop {{ i + 1 }}</span>
            <h2>{{ stop.name }}</h2>
            <div class="stop-distance" v-if="stop.distance">
              <a :href="stop.mapUrl" target="_blank">
                {{ stop.distance }} mi away
                <span class="material-symbols-outlined">directions_walk</span>
              </a>
            </div>
            <p class="stop-highlight">{{ stop.highlight }}</p>
            <a class="stop-wiki-link" :href="stop.wikiUrl" target="_blank">
              Read on Wikipedia
              <span class="material-symbols-outlined">open_in_new</span>
            </a>
          </div>
        </div>
      </template>

      <p class="tour-closing" v-html="renderText(tour.closing)"></p>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/mixins.scss';

#tour-loading {
  overflow: hidden;

  .orb {
    @include orb;
  }

  header {
    opacity: 0;
  }
}

#tour-loaded {
  header {
    opacity: 1;
    transition: 3s opacity ease-out;
  }
}

.tour {
  @include container;
  position: relative;
  min-height: 100%;
}

.tour-loader {
  position: relative;
  height: calc(100vh - 6em);
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

.tour-controls {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 2em;
}

.tour-label {
  color: var(--light-grey);
  font-size: 0.8em;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.tour-transition {
  font-family: var(--serif);
  font-size: 1.1em;
  line-height: calc(1em * var(--base) * 1.35);
  margin-bottom: 1.5em;
  color: var(--grey);

  strong {
    font-weight: 600;
    color: var(--white);
  }
}

.tour-stop-card {
  border: 1px solid var(--border-grey);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 2em;
}

.stop-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  background: var(--dark-grey);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.stop-info {
  padding: 1em;
}

.stop-number {
  display: block;
  font-size: 0.75em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--light-grey);
  margin-bottom: 0.5em;
}

.stop-info h2 {
  font-family: var(--display);
  font-size: 1.5em;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5em;
}

.stop-distance {
  margin-bottom: 1em;

  a {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    text-decoration: none;
    color: var(--light-grey);
    font-size: 0.8em;
    font-weight: 400;
    @include hover-transition;

    &:hover {
      color: var(--white);
    }

    .material-symbols-outlined {
      font-size: 1.1em;
      position: relative;
      top: 1px;
    }
  }
}

.stop-highlight {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1em;
  line-height: 1.5;
  color: var(--grey);
  margin-bottom: 1em;
  border-left: 2px solid var(--border-grey);
  padding-left: 1em;
}

.stop-wiki-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--light-grey);
  text-decoration: none;
  @include hover-transition;

  &:hover {
    color: var(--white);
  }

  .material-symbols-outlined {
    font-size: 1em;
  }
}

.tour-closing {
  font-family: var(--serif);
  font-size: 1.1em;
  line-height: calc(1em * var(--base) * 1.35);
  margin-bottom: 3em;
  color: var(--grey);

  strong {
    font-weight: 600;
    color: var(--white);
  }
}

.tour-error {
  padding: 2em 0;
  text-align: center;
  line-height: 1.6;

  p {
    margin-bottom: 1em;
    color: var(--light-grey);
  }

  a {
    font-size: 0.85em;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: var(--light-grey);
    text-decoration: underline;

    &:hover {
      color: var(--white);
    }
  }
}

.tour-controls .stopped,
.tour-controls .playing {
  position: relative;
  font-variation-settings: 'FILL' 1;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  color: inherit;

  &:focus-visible {
    outline: 2px solid var(--white);
    outline-offset: 4px;
    border-radius: 50%;
  }
}
</style>

<script>
import axios from 'axios';
import Header from '../components/Header';

export default {
  name: 'Tour',

  components: { Header },

  data() {
    return {
      loading: true,
      error: null,
      tour: null
    };
  },

  computed: {
    fullNarrative() {
      if (!this.tour) return '';
      return [
        ...this.tour.stops.flatMap(s => [s.before.replace(/\*\*/g, ''), s.highlight]),
        this.tour.closing.replace(/\*\*/g, '')
      ].join(' ');
    }
  },

  async created() {
    const cacheKey =
      localStorage.getItem('tour-place-cache-key') ||
      Object.keys(localStorage).find(k => k.startsWith('place-data-cache-'));
    const placeData = cacheKey ? JSON.parse(localStorage.getItem(cacheKey)) : null;

    if (!placeData || !placeData.length) {
      this.$router.push('/list');
      return;
    }

    const startIndex = parseInt(localStorage.getItem('tour-start-index') ?? '0', 10);
    const narrativeCacheKey = `tour-v2-${cacheKey}-from-${startIndex}`;
    const cachedTour = localStorage.getItem(narrativeCacheKey);

    if (cachedTour) {
      this.tour = JSON.parse(cachedTour);
      this.loading = false;
      return;
    }

    try {
      const { data } = await axios.post('/.netlify/functions/tour', {
        places: placeData,
        startIndex
      });
      this.tour = data;
      localStorage.setItem(narrativeCacheKey, JSON.stringify(this.tour));
    } catch (err) {
      this.error = 'Could not generate tour. Please try again.';
      console.error(err?.response?.data ?? err);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    renderText(text) {
      return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    },

    toggleSpeech(e) {
      const btn = e.target;
      const speech = window.speechSynthesis;

      if (btn.classList.contains('stopped')) {
        const utterance = new SpeechSynthesisUtterance(this.fullNarrative);
        utterance.rate = 0.9;
        speech.cancel();
        speech.speak(utterance);
        btn.textContent = 'stop_circle';
        btn.classList.replace('stopped', 'playing');

        utterance.onend = () => {
          btn.textContent = 'play_circle';
          btn.classList.replace('playing', 'stopped');
        };
      } else {
        speech.cancel();
        btn.textContent = 'play_circle';
        btn.classList.replace('playing', 'stopped');
      }
    }
  }
};
</script>
