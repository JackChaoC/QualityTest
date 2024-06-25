import Vue from 'vue';
import Router from 'vue-router';
import PageNoFound from '../../../views/common/pageNotFound.vue';

Vue.use(Router);
const router = new Router({
    mode: 'history',
    base: '/testPage',
    routes: [
        {
            path: '/',
            redirect: '/SpotCheck'
        },
        {
            path: '*',
            name: 'PageNoFound',
            component: PageNoFound,
        },
        {
            path: '/one',
            name: 'one',
            component: () => import('../views/one.vue')
        },
        {
            path: '/two',
            name: 'two',
            component: () => import('../views/two/two.vue')
        },
        {
            path: '/SpotCheck',
            name: 'SpotCheck',
            component: () => import('../views/SpotCheck/SpotCheck.vue')
        },
        {
            path: '/Location',
            name: 'Location',
            component: () => import('../views/Location.vue')
        },
        {
            path: '/Photo',
            name: 'Photo',
            component: () => import('../views/Photo.vue')
        },
        {
            path: '/OtherQuestion',
            name: 'OtherQuestion',
            component: () => import('../views/OtherQuestion/OtherQuestion.vue')
        }
    ]
});
export default router;