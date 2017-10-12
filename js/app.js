requirejs.config({
    // baseUrl: '/',
    shim: {
        //没有实现AMD规范的类库加载规范
        // 'backbone': {
        //     deps: ['underscore', 'jquery'],
        //     exports: 'Backbone'
        // },
        // 暴露多个变量，不用exports,用init
        // hello: {
        //     init: function() {
        //         return {
        //             hello: hello,
        //             hello2: hello2
        //         }
        //     }
        // }
        "jw": ["jquery"],
        "ule_plugin": ["jquery"],
        "ule_wap": ["ule_plugin"],
        "ule_extend": ["ule_wap"],
        "vue-lazyload": ["vue"],
    },
    paths: {
        'jquery': 'http://i1.beta.ulecdn.com/ulewap/ws/lib/js/jquery.min',
        'jw': 'http://i1.beta.ulecdn.com/ulewap/ws/lib/js/jw/jquery-weui.min',
        'fastclick': 'http://i1.beta.ulecdn.com/ulewap/ws/lib/js/fastclick.min',
        'ule_plugin': 'ule_plugin',
        'ule_wap': 'ule_wap',
        'ule_extend': 'ule_extend',
        'vue': 'http://i1.beta.ulecdn.com/ulewap/ws/lib/js/vue.min',
        'vue-lazyload': '../lib/js/vue-lazyload'
    }
});

require(['jquery', 'vue', 'fastclick', 'vue-lazyload', 'jw', 'ule_plugin', 'ule_wap', 'ule_extend'], function($, Vue, FastClick, VueLazyload) {
    Vue.use(VueLazyload, {
        loading: 'http://i1.ulecdn.com/i/event/2016/0108/loading.gif',
        listenEvents: ['scroll']
    })
    new Vue({
        el: '#app',
        data: {
            hotList: [],
            discountList: []
        },
        created: function() {
            FastClick.attach(document.body)
            // 通过key获取列表数据
            var key = "event_store_truniagen,event_ulestorenmg0929_dt"
            this.getItems(key)
        },
        methods: {
            buy: function(id) {
                window.location.href = $.jumpPath('goods', id)
            },
            getItems: function(key) {
                var _self = this
                var data = {
                    moduleKeys: key
                };
                $.ajax({
                    url: '//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2001',
                    type: 'get',
                    async: false,
                    data: data,
                    dataType: 'jsonp',
                    jsonp: "jsonApiCallback",
                    jsonpCallback: "jsonApiCallback",
                    cache: true,
                    headers: {
                        "Accept-Encoding": "gzip,deflate"
                    },
                    success: function(obj) {
                        // console.log(obj)
                        _self.hotList = obj.event_ulestorenmg0929_dt
                        _self.discountList = obj.event_store_truniagen
                    }
                });
            },
        },
        mounted: function() {
            
        }
    })
})