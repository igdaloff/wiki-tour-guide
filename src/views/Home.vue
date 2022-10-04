<template>
  <div class="home">
    <header>
      <h1 class="header">Wiki Walking Guide</h1>
      <h2>Read-aloud Wikipedia pages of interesting places near you.</h2>
    </header>
    <div>
      <p>To get started...</p>
      <router-link to="/list">
        <span class="material-symbols-outlined">location_searching</span>
        Share My Location
      </router-link>
    </div>
  </div>
</template>

<script></script>

<style lang="scss">
@import "../assets/mixins.scss";

.home {
  text-align: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;

  @include container;

  header {
    padding: 0 1em;
  }

  h2 {
    margin-bottom: 3em;
    padding: 0 2em;
  }

  p {
    display: block;
    margin-bottom: 0.5em;
    font-weight: 200;
    font-size: 1.25em;
    font-family: var(--sans);
  }

  a {
    @include icon-button;
  }
}
</style>
