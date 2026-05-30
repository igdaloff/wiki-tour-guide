import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PlaceList from '../views/PlaceList.vue'
import Tour from '../views/Tour.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/list',
    name: 'List',
    component: PlaceList,
  },
  {
    path: '/tour',
    name: 'Tour',
    component: Tour,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
