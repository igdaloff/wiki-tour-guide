<template>
  <header class="main-header">
    <nav>
      <h1>Places Nearby</h1>
      <!-- <a href="" class="settings-link"><span class="material-symbols-outlined">settings</span></a> -->
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
  justify-content: space-between;
  padding: 4em 0 0.5em;
  margin-bottom: 1.5em;
  border-bottom: 1px solid;
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
export default {
  name: 'Header',
}
</script>
