<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import PlaceList from './views/PlaceList.vue'

export default {
  name: 'App',
  components: {
    PlaceList,
  },
}
</script>

<style lang="scss"></style>
