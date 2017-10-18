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

    var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
    var url = location.href;
    //定义跳转到shop页面
    var shopUrl = '//m.ule.com/item/detail/';

    new Vue({
        el: '#app',
        data: {
            card: '',
            phone: '',
            // 活动API和key
            actDate: {
                keys: ['event_20170613_zk'],
                api: {
                    getPrdsUrl: '//search.ule.com/api/recommend?jsoncallback=?&restype=2001', // 商品
                    queryQualification: '//prize.' + uleUrl + '/mc/jiangSuGreenCard/whiteListLogin', // 资格验证
                    receivePrize: '//prize.' + uleUrl + '/mc/jiangSuGreenCard/receivePrize' // 领券
                }
            },
            // 登录状态
            loginState: 0,
            // 是否提交信息通过验证
            permissions: 0,
            // 商品列表
            goodsList: []
        },
        beforeCreate: function() {
            // 初始化
            FastClick.attach(document.body)
            $.showLoading();
        },
        created: function() {
            // 1.商品推荐位

            // 2.检查登录状态，如果登录显示已登录，反之显示没有登录
            if (this.isLogin()) {
                this.loginState = 1;
            } else {
                this.loginState = 0;
            }
            // 3.如果登录，则进入提交阶段，提交验证完成后，后端交互

            // 4.如果确认有领券资格，则显示领券界面，反之仍然不显示
        },
        methods: {
            getCookie: function(name) {
                var cookies = document.cookie.split(";");
                for (var i = 0, len = cookies.length; i < len; i++) {
                    if (cookies[i].split('=')[0].trim() == name) {
                        return cookies[i].split('=')[1];
                    }
                }
            },
            isLogin: function() {
                if (this.getCookie('mall_cookie')) {
                    return true;
                } else {
                    return false;
                }
            },
            login: function() {
                if ($.browser.ule) {
                    //邮乐app
                    location.href = 'uleMobile://uleLogin_' + url;
                } else {
                    if (this.getCookie('client_type') == 'wx_psbc') {
                        //邮储
                        location.href = 'https://m.' + uleUrl + '/user/relation?target=' + encodeURIComponent(location.href);
                    } else {
                        //邮乐
                        location.href = 'https://m.' + uleUrl + '/user/login?target=' + url;
                    }
                }
            },
            validateForm: function() {
                var _self = this;
                if((/(^\d{6}$)|(^\d{5}(\d|X|x)$)/).test(_self.card) && (/^(13|14|15|17|18)\d{9}$/).test(_self.phone)){
                    return true
                }else{
                    return false
                }
            },
            yz: function() {
                var _self = this;
                if (this.loginState == 0) {
                    $.confirm("您确定要前往登录吗?", "尚未登录", function() {
                        _self.login();
                    }, function() {});
                } else {
                    // 开始验证
                    if(_self.validateForm()){
                        // 验证通过
                        
                    }else{
                        // 验证失败
                        $.alert("您输入的信息不符合格式!", "请重新输入!");
                    }
                }
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
                    }
                });
            },
        },
        mounted: function() {
                $.hideLoading();
        }
    })
})