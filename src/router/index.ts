import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import HomePage from '@/pages/home/Index.vue'
import LoginPage from '@/pages/login/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { anonymous: true }
  },
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/trials',
    name: 'trials',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/trial/Index.vue')
  },
  {
    path: '/plans',
    name: 'plans',
    component: () => import('../pages/plan/Index.vue')
  },
  {
    path: '/discounts',
    name: 'discounts',
    component: () => import('../pages/discount/Index.vue')
  },
  {
    path: '/addons',
    name: 'addons',
    component: () => import('../pages/addon/Index.vue')
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    props: true,
    component: () => import('../pages/subscription/Index.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../pages/users/Index.vue'),
    beforeEnter: (to: any, from: any, next: any) => {
      if (to.name == "users" && !store.getters.isAdmin)
        next('/');
      else
        next();
    }
  }
]

const router = new VueRouter({
  routes
})

export default router

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.anonymous)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})
