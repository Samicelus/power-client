import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routers from './routers'
import App from './App.vue'
import axios from 'axios';

Vue.use(VueRouter);
Vue.use(Vuex);

const instance = axios.create({
  baseURL: 'http://localhost:12133/api'
});

const store = new Vuex.Store({
  state: {
    jwt: ""
  },
  mutations: {
    saveUserInfo (state, token) {
      console.log(state);
      state.jwt = token;
      instance.defaults.headers.common['b-json-web-token'] = token;
    },
    clearUserInfo (state){
      state.jwt = "";
      instance.defaults.headers.common['b-json-web-token'] = "";
    }
  }
})

Vue.prototype.instance=instance;

const router = new VueRouter({
  mode: 'history',
  routes: routers
})

router.beforeEach((to, from, next) => {
  if(to.meta.checkLogined){
    if(!store.state.jwt){
      next({
        path: '/login'
      })
    }else{
      next()
    }
  }else{
    next()
  }
});




import { 
  Button,
  Row,
  Col,
  Layout, 
  Menu, 
  Breadcrumb, 
  Icon, 
  Affix, 
  Table, 
  Slider, 
  InputNumber, 
  Select, 
  Card, 
  Modal, 
  Input, 
  Tooltip,
  Popover,
  Popconfirm
} from 'ant-design-vue';

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Breadcrumb);
Vue.use(Icon);
Vue.use(Affix);
Vue.use(Table);
Vue.use(Slider);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Card);
Vue.use(Modal);
Vue.use(Input);
Vue.use(Tooltip);
Vue.use(Popover);
Vue.use(Popconfirm);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
