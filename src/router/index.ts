import { createRouter , createWebHashHistory} from 'vue-router'
import welcome from '../pages/welcome.vue'
import login from '../pages/login.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: welcome
        },
        {
            path: '/login',
            component: login
        }
    ]
})

export default router