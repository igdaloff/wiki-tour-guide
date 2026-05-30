<template>
  <div :style="{ display: pwaInstallBannerDisplay }" class="install-banner">
    <h3>Install this App<i class="material-symbols-outlined download-icon">download</i></h3>
    <span>to easily access it from your home screen.</span>
    <div>
      <a @click="installer" href="" class="install-link">Install </a>
      <a @click="hideAppInstallBanner" href="" class="no-thanks">No thanks</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstallBanner',
  data() {
    return {
      pwaInstallBannerDisplay: 'none',
      pwaInstallPrompt: undefined
    };
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
  },
  methods: {
    hideAppInstallBanner(e) {
      e.preventDefault();

      this.pwaInstallBannerDisplay = 'none';
    }
  }
};
</script>

<style lang="scss">
@import '../assets/mixins.scss';

.install-banner {
  position: relative;
  display: block;
  background: var(--dark-grey);
  color: var(--grey);
  width: 100%;
  padding: 1em 1em 1.5em;
  margin-top: 1.5em;
  border-radius: 10px;
  border: 1px solid var(--border-grey);

  h3 {
    font-family: var(--display);
    font-size: 1.25em;
    font-weight: 500;
    color: var(--white);
    margin-bottom: 0.25em;
  }

  span {
    display: inline-block;
    margin-top: 0.25em;
    margin-bottom: 1em;
    font-size: 0.85em;
    line-height: 1.5;
    color: var(--light-grey);
  }

  .download-icon {
    position: relative;
    top: 5px;
    margin-left: 6px;
    font-size: 0.9em;

    @media screen and (max-width: $medium) {
      font-weight: 800;
    }
  }

  .install-link {
    @include button;
    background: var(--white);
    padding: 0.5em 1em;
    font-size: 0.9em;
    color: var(--black);
    margin-right: 1em;

    i {
      margin-inline-start: 0.5em;
    }
  }

  .no-thanks {
    font-size: 0.85em;
    color: var(--light-grey);
    text-decoration: underline;

    &:hover {
      color: var(--white);
    }
  }
}
</style>
