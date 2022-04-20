
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
    ]
  },

  {
    path: '/fixquote',
    component: () => import('layouts/FixquoteLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Fixquote.vue'), props: true },
      { path: ':shortcode', component: () => import('pages/Fixquote.vue'), props: true }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
