<template>
  <div :style="{ display: pwaInstallBannerDisplay }" class="install-banner">
    <h3>Install this App<i class="material-symbols-outlined download-icon">download</i></h3>
    <span>to easily access it from your home screen.</span>
    <a @click="installer" href="" class="install-link">Install </a>
    <a @click="hideAppInstallBanner" href="" class="no-thanks">No thanks</a>
  </div>
</template>

<script>
export default {
  name: 'InstallBanner',
  data() {
    return {
      pwaInstallBannerDisplay: 'none',
      pwaInstallPrompt: undefined,
    }
  },

  created() {
    //Show PWA install button (see last section of this article: https://levelup.gitconnected.com/vue-pwa-example-298a8ea953c9)
    //Note that as of this writing, on mobile beforeinstallprompt is only supported on Chrome for Android, Android Browser, and Opera, and no major iOS browsers. There's a fix for iOS below.
    let pwaInstallPrompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()

      // Stash the event so it can be triggered later
      pwaInstallPrompt = e

      // Show previously hidden banner
      this.pwaInstallBannerDisplay = 'block'
    })

    this.installer = () => {
      this.pwaInstallBannerDisplay = 'none'
      pwaInstallPrompt.prompt()
    }

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      hideInstallPromotion()

      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt = null

      // Eventually, let's send an analytics event here to indicate successful install
      console.log('PWA was installed')
    })
  },
  methods: {
    hideAppInstallBanner(e) {
      e.preventDefault()

      this.pwaInstallBannerDisplay = 'none'
    },
  },
}
</script>

<style lang="scss">
@import '../assets/mixins.scss';

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
    font-size: 0.9em;
    line-height: 1.1;
  }

  .download-icon {
    position: relative;
    top: 5px;
    margin-left: 8px;

    @media screen and (max-width: $medium) {
      font-weight: 800;
    }
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
</style>
