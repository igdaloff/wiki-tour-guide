<template>
  <div class="home">
    <header>
      <h1 class="header">Wiki Walking Guide</h1>
      <h2>Read-aloud Wikipedia pages of notable places near you.</h2>
    </header>
    <div>
      <span class="get-started">To get started...</span>
      <router-link to="/list">
        <span class="material-symbols-outlined">location_searching</span>
        Share My Location
      </router-link>
    </div>
  </div>
</template>

<script></script>

<style lang="scss">
@import '../assets/mixins.scss';

.home {
  text-align: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  @include container;

  h1 {
    font-family: var(--display);
    font-weight: 500;
    font-size: 2.3em;
  }

  h2 {
    margin: 1em 0 3em;
    padding: 0 2em;
    letter-spacing: 0.01em;
  }

  a {
    @include icon-button;
  }
}

.get-started {
  display: block;
  margin-bottom: 1em;
  font-weight: 300;
  font-size: 1.25em;
  letter-spacing: 0.01em;
}
</style>
