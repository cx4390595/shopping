// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from "vuex"
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'


Vue.use(infiniteScroll);
Vue.use(Vuex);
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state:{
    nickName:"",
    cartCount:0,
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount
    }
  }
});
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
