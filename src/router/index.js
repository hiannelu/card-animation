import { createRouter, createWebHistory } from 'vue-router'
import Books from '@/components/Books.vue'
import BookDetail from '@/components/BookDetail.vue'

const routes = [
  {
    path: '/books',
    name: 'books',
    component: Books,
    children: [
      {
        path: ':id',
        name: 'book-detail',
        component: BookDetail
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
