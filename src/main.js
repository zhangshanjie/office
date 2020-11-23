// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 使用iview4x版本，
import iView from 'iview'
import iviewArea from 'iview-area'
import App from './App'
import { router } from './router/index'
import store from './store'
import 'iview/dist/styles/iview.css'
import i18n from '@/locale'
import Icon from 'vue-awesome/components/Icon'
// 按需引入awesome图标
import 'vue-awesome/icons/brands/qq'
import 'vue-awesome/icons/brands/weixin'
import 'vue-awesome/icons/brands/weibo'
import 'vue-awesome/icons/brands/github'
import fishdata from './views/commom'
import { getRequest, postRequest, putRequest, deleteRequest, importRequest, uploadFileRequest ,http ,fetch,uploadImg,refust
} from '@/libs/axios'
import { setStore, getStore, removeStore } from '@/libs/storage'
import { dateUtil } from '@/libs/globalUtil'
import util from '@/libs/util'

import dictUtil from '@/libs/dictUtil'
import hasPermission from '@/libs/hasPermission'
import hasRole from '@/libs/hasRole'
import VueStomp from "vue-stomp"
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import VueApexCharts from 'vue-apexcharts'
import '@babel/polyfill'
import mavonEditor from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    // use
    Vue.use(mavonEditor)


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'YOUR_APP_KEY'
})


import common from './common/common.js'
//注册到vue原型上
Vue.prototype.common = common

Vue.prototype.$http = http //json
Vue.prototype.$fetch = fetch //formData
Vue.prototype.$uploadImg = uploadImg
Vue.prototype.$refust = refust;

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(VueLazyload, {
    error: require('./assets/img-error.png'),
    loading: require('./assets/loading2.gif')
})
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(iviewArea);
Vue.component('icon', Icon);
Vue.use(VueStomp);
Vue.use(VueClipboard);
Vue.use(hasPermission);

Vue.use(hasRole);
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);
// 挂载全局使用的方法
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.fishdata = fishdata
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.importRequest = importRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
Vue.prototype.dateUtil = dateUtil;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        // 初始化菜单
        util.initRouter(this);
        // 初始化全局数据字典
        dictUtil.initDictData(this);
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    }
})
