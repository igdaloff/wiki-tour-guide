<template>
  <header class="main-header">
    <nav>
      <button v-if="route.name === 'Tour'" class="material-symbols-outlined back-btn" @click="router.push('/list')" aria-label="Back to places">arrow_back</button>
      <h1>{{ route.name === 'Tour' ? 'Walking Tour' : 'Places Nearby' }}</h1>
      <button v-if="route.name !== 'Tour'" class="material-symbols-outlined info-btn" @click.stop="showInfo = !showInfo" :aria-expanded="showInfo.toString()" aria-label="About this app">info</button>
      <div class="info-tooltip" v-if="showInfo" role="status">
        <p>
          Wiki Tour Guide finds interesting Wikipedia-documented places near you, then uses AI to build a personalized
          walking tour with narration for each stop.
        </p>
        <p>
          Sorting by <strong>Curiosity</strong> ranks places using Claude based on what's most worth exploring, favoring
          the less-known over the obvious.
        </p>
      </div>
    </nav>
  </header>
</template>

<style lang="scss">
@import '../assets/mixins.scss';

.main-header {
  @include container;
  padding: 0;
}

nav {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 3em 0 0.75em;
  margin-bottom: 2em;
  border-bottom: 1px solid var(--border-grey);
  position: relative;

  h1 {
    font-family: var(--display);
    font-size: 1.35em;
    font-weight: 400;
    letter-spacing: 0.01em;
  }
}

.back-btn,
.info-btn {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  line-height: 1;
}

.back-btn {
  cursor: pointer;
  font-variation-settings: 'wght' 200;
  opacity: 0.7;
  transition: opacity 0.25s ease;

  &:hover, &:focus-visible {
    opacity: 1;
    outline: none;
  }
}

.info-btn {
  margin-left: auto;
  cursor: pointer;
  font-size: 1.2em;
  font-variation-settings: 'FILL' 0, 'wght' 400;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover, &:focus-visible {
    opacity: 1;
    outline: none;
  }
}

.info-tooltip {
  position: absolute;
  top: calc(100% + 0.75em);
  right: 0;
  width: min(320px, 90vw);
  background: var(--black);
  border: 1px solid var(--border-grey);
  border-radius: 8px;
  padding: 1em;
  z-index: 100;

  p {
    color: var(--light-grey);
    font-size: 0.9em;
    line-height: 1.6;

    & + p {
      margin-top: 0.5em;
    }

    strong {
      color: var(--white);
      font-weight: 600;
    }
  }
}

.settings-link {
  position: relative;
  color: var(--white);
  pointer-events: none;
  line-height: 1;

  span {
    font-variation-settings: 'wght' 200;
    line-height: inherit;
  }
}
</style>

<script>
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'Header',
  setup() {
    const route = useRoute();
    const router = useRouter();
    return { route, router };
  },
  data() {
    return { showInfo: false };
  },
  mounted() {
    document.addEventListener('click', this.closeTooltip);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeTooltip);
  },
  methods: {
    closeTooltip() {
      this.showInfo = false;
    }
  }
};
</script>
