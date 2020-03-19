import Vue from 'vue'
import App from './App.vue'
import { Button, Row, Col, Layout, Menu, Breadcrumb, Icon, Affix, Table, Slider, InputNumber, Select, Card} from 'ant-design-vue';
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

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
