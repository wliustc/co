requirejs.config({
    shim: {
        "jw": ["jquery"],
        "ule_plugin": ["jquery"],
        "ule_wap": ["ule_plugin"],
        "ule_extend": ["ule_wap"],
        "vue-lazyload": ["vue"],
    },
    paths: {
        'jquery': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/jquery.min',
        'jw': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/jw/jquery-weui.min',
        'fastclick': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/fastclick.min',
        'ule_plugin': 'https://i1.beta.ulecdn.com/ulewap/ws/20171020/js/ule_plugin',
        'ule_wap': 'https://i1.beta.ulecdn.com/ulewap/ws/20171020/js/ule_wap',
        'ule_extend': 'https://i1.beta.ulecdn.com/ulewap/ws/20171020/js/ule_extend',
        'vue': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/vue.min',
        'vue-lazyload': 'https://i1.beta.ulecdn.com/ulewap/ws/lib/js/vue-lazyload'
    }
});

require(['jquery', 'vue', 'fastclick', 'vue-lazyload', 'jw', 'ule_plugin', 'ule_wap', 'ule_extend'], function($, Vue, FastClick, VueLazyload) {
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
            loadingShow: 1,
            goodsImg: {}, //商品图片宽高参数
            boxType: '', //弹窗类型1、2、3、4、5、6、7...
            boxShow: 0, //弹窗显示与否
            boxMsg: '', //弹窗信息
            card: '',
            phone: '',
            // 活动API和key
            actData: {
                keys: 'jsjinronglvka', //推荐位key 正式：event_20171017_goods
                code: 'MA_U_150785973137187', //活动code
                api: {
                    getPrdsUrl: '//search.ule.com/api/recommend?jsoncallback=?&restype=2001', // 商品
                    queryQualification: '//prize.' + uleUrl + '/mc/jiangSuFinance/whiteListVerification', // 资格验证
                    receivePrize: '//prize.' + uleUrl + '/mc/jiangSuFinance/whiteListVerification' // 领券
                }
            },
            // 登录状态
            loginState: 0,
            // 是否提交信息通过验证,有无领券资格
            permissions: 0,
            // 商品列表
            goodsList: []
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
            // 表单正则判断
            validateForm: function() {
                var _self = this;
                if ((/(^\d{6}$)|(^\d{5}(\d|X|x)$)/).test(_self.card) && (/^(13|14|15|17|18)\d{9}$/).test(_self.phone)) {
                    return true
                } else {
                    return false
                }
            },
            // 验证资格
            yz: function() {
                var _self = this;
                if (this.loginState == 0) {
                    $.confirm("您确定要前往登录吗?", "您尚未登录", function() {
                        _self.login();
                    }, function() {});
                } else {
                    // 开始验证
                    if (_self.validateForm()) {
                        // 前端验证通过，开始后端验证
                        _self.yzAjax();
                    } else {
                        // 前端验证失败
                        $.alert("您输入的信息不符合格式!", "请重新输入!");
                    }
                }
            },
            // 领券jump
            voucherJump: function() {
                var _self = this
                _self.boxShow = 0
                $('html, body').animate({
                    scrollTop: $("#tickets").offset().top
                }, 500);
            },
            // 领券
            voucher: function() {
                var _self = this
                var data = {
                    mobile: _self.phone,
                    idNumber: _self.card,
                    code: _self.actData.code,
                    channel: 200000
                }
                $.ajax({
                    url: _self.actData.api.receivePrize,
                    type: 'get',
                    cache: false,
                    async: false,
                    data: data,
                    dataType: 'jsonp',
                    jsonp: "callback",
                    success: function(obj) {
                        // 成功
                        if (obj.code == '0001') {
                            _self.boxShow = 1
                            _self.boxType = 3
                        }
                        // 失败
                        else {
                            _self.boxShow = 1
                            _self.boxType = 4
                            _self.boxMsg = obj.message
                        }
                    }
                })
            },
            // 关闭弹窗
            closeBox: function() {
                this.boxShow = 0
            },
            // 关闭成功领取弹窗
            closeSucBox: function() {
                this.boxShow = 0
                $('html, body').animate({
                    scrollTop: $("#goods").offset().top
                }, 500);
            },
            // 设置商品图片宽高
            setImg: function() {
                this.goodsImg.w = (screen.availWidth - 8) / 2 - 6
                this.goodsImg.h = (screen.availWidth - 8) / 2 - 6
            },
            // 商品跳转
            goodsJump: function(inStock, listingId) {
                if (!!inStock) {
                    location.href = shopUrl + listingId
                }
            },
            // 验证资格ajax
            yzAjax: function() {
                var _self = this
                var data = {
                    mobile: _self.phone,
                    idNumber: _self.card,
                    code: _self.actData.code
                }
                $.ajax({
                    url: _self.actData.api.queryQualification,
                    type: 'get',
                    cache: false,
                    async: false,
                    data: data,
                    dataType: 'jsonp',
                    jsonp: "callback",
                    success: function(obj) {
                        // 验证通过
                        if (obj.code == '0001') {
                            console.log("验证通过")
                            _self.permissions = 1
                            _self.boxShow = 1
                            _self.boxType = 1
                        }
                        // 验证不通过
                        else {
                            _self.permissions = 0
                            _self.boxShow = 1
                            _self.boxType = 0
                            _self.boxMsg = obj.message
                        }
                    }
                })
            },
            // 获取推荐位
            getItems: function() {
                var _self = this
                var data = {
                    moduleKeys: _self.actData.keys,
                    times: new Date().getTime()
                };
                $.ajax({
                    url: _self.actData.api.getPrdsUrl,
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
                        // console.log(obj.jsjinronglvka)
                        _self.goodsList = obj.jsjinronglvka
                    }
                }).done(function() {
                    _self.setImg()
                    _self.loadingShow = 0
                })
            },
        },
        mounted: function() {
            // 1.检查登录状态，如果登录显示已登录，反之显示没有登录
            if (this.isLogin()) {
                this.loginState = 1;
            } else {
                this.loginState = 0;
            }
            // 2.商品推荐位
            this.getItems()
            // 3.如果登录，则进入验证阶段，验证完成后，后端交互

            // 4.如果确认有领券资格，则显示领券界面，反之仍然不显示

        }
    })
})