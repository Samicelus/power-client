import Home from './components/home.vue'
import Login from './components/login.vue'

const routers = [
  {
    path: '/home',
    name: 'home',
    meta: {checkLogined: true},
    component: Home
  },
  {
    path: '/',
    meta: {checkLogined: false},
    component: Login
  },
  {
    path: '/login',
    meta: {checkLogined: false},
    component: Login
  }
]
export default routers