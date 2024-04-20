import { createRouter, createWebHistory } from 'vue-router'
import loginForm from '../components/loginForm.vue'
import AdminPage from '../components/AdminPage.vue'
import ClientList from '../components/ClientList.vue'
import AdminList from '../components/AdminList'
import AddUser from '../components/AddUser'
import EditUser from '../components/EditUser'
import ChatPage from '../components/ChatPage'
import { jwtDecode } from 'jwt-decode';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: loginForm
  },
  {
    path: '/adminpage',
    name: 'AdminPage',
    component: AdminPage,
    meta: { requiresAdmin: true },
    children: [
        {
          path: 'adminlist', 
          component: AdminList
        },
        {
          path: 'clientlist',
          component: ClientList
        }
    ]
  },
  {
    path: '/adduser',
    name: 'adduser',
    component: AddUser,
    meta:{requiresAdmin:true},
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component:EditUser,
  },
  {
    path: '/chat',
    name: 'chat',
    component:ChatPage,
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {

    if (to.matched.some(record => record.meta.requiresAdmin)) {
      const token = localStorage.getItem('token');

      if (!token) {
        return next('/');
      }
  
      try {

        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          next();
        } else {
          alert('No permission'); 
          next(from.path); 
        }
      } catch (error) {
        console.error('Token decoding failed:', error);
        next('/'); 
      }
    } else {
      next(); 
    }
  });

export default router