requirejs.config({
    shim: {
        "jw": ["jquery"],
        "ule_plugin": ["jquery"],
        "ule_wap": ["ule_plugin"],
        "vue-lazyload": ["vue"],
    },
    paths: {
        'jquery': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/jquery.min',
        'jw': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/jw/jquery-weui.min',
        'fastclick': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/fastclick.min',
        'ule_plugin': 'https://i1.beta.ulecdn.com/ulewap/ws/20171020/js/ule_plugin',
        'ule_wap': 'https://i1.beta.ulecdn.com/ulewap/ws/20171020/js/ule_wap',
        'vue': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/vue.min',
        'vue-lazyload': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/vue-lazyload'
    }
});

require(['jquery', 'vue', 'fastclick', 'vue-lazyload', 'jw', 'ule_plugin', 'ule_wap'], function($, Vue, FastClick, VueLazyload) {
    Vue.use(VueLazyload, {
        loading: 'https://i0.ulecdn.com/ulewap/i/290x290x2x.png',
        listenEvents: ['scroll']
    })

    var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
    var url = location.href;
    //定义跳转到shop页面
    var shopUrl = '//m.ule.com/item/detail/';

    new Vue({
        el: '#app',
        data: {
            form: {
                phone: '',
                vcode: '',
                pic: ''
            },
            tip: {
                phoneTip: '',
                vcodeTip: '',
                picTip: ''
            }
        },
        created: function() {
            // 初始化
            FastClick.attach(document.body)
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
            // 登录判断
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
            phoneCheck: function() {
                var _self = this
                if (!_self.form.phone) {
                    _self.tip.phoneTip = "手机号不能为空"
                    return false
                } else if (!(/^(13|14|15|17|18)\d{9}$/).test(_self.form.phone)) {
                    _self.tip.phoneTip = "手机号格式填写错误"
                    return false
                } else {
                    _self.tip.phoneTip = ""
                    return true
                }
            },
            vcodeCheck: function() {},
            picCheck: function() {},

            getJson: function(url, data, callback) {
                return $.ajax({
                    url: url,
                    type: 'get',
                    async: false,
                    data: data,
                    dataType: 'jsonp',
                    headers: {
                        "Accept-Encoding": "gzip,deflate"
                    },
                    success: function(obj) {
                        callback(obj)
                    }
                })
            },
            sub: function() {
                console.log(this.form)
            }

        },
        mounted: function() {

        }
    })
})