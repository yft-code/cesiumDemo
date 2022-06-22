import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'cesium/Widgets/widgets.css'
import html2canvas from "html2canvas"
Vue.use(html2canvas)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
