<template>
  <div class="home">
    <div class="grid">
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
    <header>
      <router-link to="/list" class="orb">
        <h1 class="header">Wiki Walking Guide</h1>
        <h2 class="header begin">Tap to Begin</h2>
      </router-link>
    </header>
  </div>
</template>

<script></script>

<style lang="scss">
@import '../assets/mixins.scss';

$grid-color: #393939;

.home {
  max-width: 800px;
  height: 100%;
  overflow: hidden;
  position: relative;
  margin: 0 auto;

  .grid {
    opacity: 1;
  }

  h1 {
    animation: 7s infinite orb-text-fade;
  }

  h2 {
    opacity: 0;
    animation: 7s infinite orb-text-fade-alt;
  }

  .orb {
    @include orb;

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 1000%;
      height: 1000%;
      margin-left: -450%;
      border-radius: 100%;
      border: 1px solid var(--dark-grey);
      animation: pulse-ring 5s ease-in infinite;
      transition: border 3s ease-out;
      opacity: 1;
    }
  }
}

@keyframes orb-text-fade {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 1;
  }

  30% {
    opacity: 0;
  }

  70% {
    opacity: 0;
  }

  75% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

@keyframes orb-text-fade-alt {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  30% {
    opacity: 1;
  }

  70% {
    opacity: 1;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.1);
  }
}

@keyframes pulse-ring-click {
  0% {
    transform: scale(0.1);
  }
}

.grid {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
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
