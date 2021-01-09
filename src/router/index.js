import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Landing from '../views/Landing.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/welcome',
    name: 'Landing',
    component: Landing,
    meta: { requiresAuth: false },
    children: [
      {
        name: 'Login',
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'about',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/About.vue'),
      },
      {
        path: '',
        component: Login,
      }
    ],
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: false },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true },
    component: Home,
  }
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  // redirect to Login if no authenticated, but route needs it
  if( !Store.getters['auth/isAuthenticated'] &&
      to.matched.some(record => record.meta.requiresAuth === true)
    ){
    return next({
      name: 'Login'
    })
  }

  return next()
})

export default router
