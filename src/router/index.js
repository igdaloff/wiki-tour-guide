import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PlaceList from '../views/PlaceList.vue'

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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
