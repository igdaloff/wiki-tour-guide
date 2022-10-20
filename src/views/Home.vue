<template>
  <div class="home">
    <header>
      <router-link to="/list">
        <h1 class="header">Wiki Walking Guide</h1>
      </router-link>
    </header>
    <div class="grid">
      <!-- <div class="grid-lines"></div> -->
      <div class="grid-lines-z">
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
        <div class="grid-line grid-line-z"></div>
      </div>
      <div class="grid-lines-x">
        <div class="grid-line grid-line-x"></div>
        <div class="grid-line grid-line-x"></div>
        <div class="grid-line grid-line-x"></div>
        <div class="grid-line grid-line-x"></div>
        <div class="grid-line grid-line-x"></div>
        <div class="grid-line grid-line-x"></div>
        <div class="grid-line grid-line-x"></div>
      </div>
      <div class="grid-fade"></div>
    </div>
  </div>
</template>

<script></script>

<style lang="scss">
@import '../assets/mixins.scss';

$grid-color: #393939;
$header-height: 110px;

.home {
  max-width: 800px;
  height: 100vh;
  overflow: hidden;
  position: relative;
  margin: 0 auto;

  h1 {
    position: absolute;
    top: calc(50% - $header-height / 2);
    left: 0;
    right: 0;
    z-index: 1;
    font-family: var(--sans);
    font-weight: 300;
    font-size: 1em;
    text-transform: uppercase;
    color: var(--black);
    background: white;
    margin: 0 auto;
    padding: 0 1em;
    line-height: 1.2;
    height: $header-height;
    width: $header-height;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    box-shadow: 0 0 0 14px var(--black), 0 0 0 15px var(--white);
  }

  a {
    text-decoration: none;
  }
}

.grid {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  perspective: 375px;

  .grid-line {
    position: absolute;
  }
}

.grid-lines-z,
.grid-lines-x {
  position: absolute;
  height: 100%;
  width: 100%;
}

.grid-line-z {
  height: 200%;
  top: -50%;
  left: 50%;
  transform-origin: center;
  border-left: 1px solid var(--dark-grey);
}

.grid-lines-x {
  top: 50%;
}

.grid-line-x {
  width: 100%;
  border-top: 1px solid var(--dark-grey);
}

$z-rotate-interval: 22.5deg;
$x-distance-interval: 20px;

// Z-axis lines
.grid-lines-z .grid-line {
  &:nth-child(1) {
    transform: rotate(calc($z-rotate-interval * 4));
  }
  &:nth-child(2) {
    transform: rotate(calc($z-rotate-interval * 3.5));
  }

  &:nth-child(3) {
    transform: rotate(calc($z-rotate-interval * 3));
  }

  &:nth-child(4) {
    transform: rotate(calc($z-rotate-interval * 2));
  }

  &:nth-child(5) {
    transform: rotate(calc($z-rotate-interval));
  }

  &:nth-child(6) {
    transform: rotate(calc($z-rotate-interval * -1));
  }

  &:nth-child(7) {
    transform: rotate(calc($z-rotate-interval * -2));
  }

  &:nth-child(8) {
    transform: rotate(calc($z-rotate-interval * -3));
  }

  &:nth-child(9) {
    transform: rotate(calc($z-rotate-interval * -3.5));
  }

  &:nth-child(10) {
    transform: rotate(calc($z-rotate-interval * -4));
  }
}

//X-axis lines
.grid-lines-x .grid-line {
  &:nth-child(2) {
    top: calc($x-distance-interval * 0.5);
  }

  &:nth-child(3) {
    top: calc($x-distance-interval * 2);
  }

  &:nth-child(4) {
    top: calc($x-distance-interval * 4);
  }

  &:nth-child(5) {
    top: calc($x-distance-interval * 8);
  }

  &:nth-child(6) {
    top: calc($x-distance-interval * 16);
  }

  &:nth-child(7) {
    top: calc($x-distance-interval * 32);
  }
}

.grid-fade {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  background: radial-gradient(ellipse at 50% 0%, rgba(#222, 0%) 0%, rgba(#222, 100%) 90%);
}
</style>
