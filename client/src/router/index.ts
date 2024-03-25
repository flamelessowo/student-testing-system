import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import Error404 from '../views/Error404.vue'
import TestCreateView from '../views/TestCreateView.vue'
import TestEditView from '../views/TestEditView.vue'
import TestListView from '../views/TestListView.vue'
import ChatView from '../views/ChatView.vue'
import CourseView from '../views/CourseView.vue'
import TestView from '../views/TestView.vue'
import { useUserStore } from '@/stores/userstore'
import { useNotifyService } from '@/core/service/message.service'
import { writeObject, getObject, deleteKey, getValue } from '@/core/service/local.session.service'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/courses',
      name: 'coureses',
      component: CourseView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/course/:courseId/test/create',
      name: 'course-test-create',
      props: true,
      component: TestCreateView,
      meta: {
        requiresAuth: true,
        requiresPerm: true,
      }
    },
    {
      path: '/course/:courseId/test/:testId/edit',
      name: 'course-test-edit',
      props: true,
      component: TestEditView,
      meta: {
        requiresAuth: true,
        requiresPerm: true,
      }
    },
    {
      path: '/course/:courseId/test/:testId',
      name: 'course-test-view',
      props: true,
      component: TestView,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/course/:courseId',
      name: 'course',
      props: true,
      component: TestListView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'pagenotfound',
      component: Error404
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const userstore = useUserStore();
  const notify = useNotifyService();
  const token: any = getValue("token");
  if (token) {
    await userstore.login(token);
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (userstore.isAuthorized) {
      if (to.matched.some((record) => record.meta.requiresPerm && !userstore.hasRole)) {
        next("/")
        notify.error("У вас недостатньо прав щоб відвідати цю сторінку");
        return;
      }
      next();
      return;
    } else {
      notify.info('Переадресовано на сторінку авторизації');
      notify.error('Потрібно авторизуватись щоб відвідати цю сторінку');
      next('/auth');
      return;
    }
  }
  next();
});

export default router
