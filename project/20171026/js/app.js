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
            isGetCode: 1, //是够可以点击获取验证码
            loadShow: 1,
            env: 'development', //production
            picKey: '',
            picUrl: '',
            vCodeBtnContent: '获取验证码',
            apiData: {
                code: 'MA_U_150235262975758',
                api: {
                    getPicCode: "//prize." + uleUrl + "/mc/mobileReceiveCoupons/getRandomCode", //获取图片验证码
                    getPhoneCode: '//prize.' + uleUrl + '/mc/mobileReceiveCoupons/validateCode', //获取手机验证码
                    sub: '//prize.' + uleUrl + '/mc/mobileReceiveCoupons/receiveCoupons' //提交
                }
            },
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
            // 初始化数据
            this.apiData.api.getPicCode = this.env == 'development' ? "//prize.beta.ule.com/mc/mobileReceiveCoupons/getRandomCode" : "//prize." + uleUrl + "/mc/mobileReceiveCoupons/getRandomCode"
            this.apiData.api.getPhoneCode = this.env == 'development' ? "//prize.beta.ule.com/mc/mobileReceiveCoupons/validateCode" : "//prize." + uleUrl + "/mc/mobileReceiveCoupons/validateCode"
            this.apiData.api.sub = this.env == 'development' ? "//prize.beta.ule.com/mc/mobileReceiveCoupons/receiveCoupons" : "//prize." + uleUrl + "/mc/mobileReceiveCoupons/receiveCoupons"
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
            // 手机号验证
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

            // 图形验证码验证
            picCheck: function() {
                // 不能为空，必须为4位
                var _self = this
                if (!_self.form.pic) {
                    _self.tip.picTip = "验证码不能为空"
                    return false
                } else if (_self.form.pic.length != 4) {
                    _self.tip.picTip = "验证码格式填写错误"
                    return false
                } else {
                    _self.tip.picTip = ""
                    return true
                }
            },

            // 短信验证码验证
            vcodeCheck: function() {
                // 不能为空
                if (!this.form.vcode) {
                    this.tip.vcodeTip = "验证码不能为空"
                    return false
                } else {
                    this.tip.vcodeTip = ""
                    return true
                }
            },

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

            // 获取手机验证码
            getVcode() {
                var _self = this
                var maxtime = 60
                if (_self.phoneCheck() && _self.picCheck()) {
                    $.ajax({
                        type: "get",
                        data: {
                            activityCode: _self.apiData.code, //活动CODE
                            mobile: _self.form.phone, //手机号
                            picRandomCode: _self.form.pic, //用户填写的图形验证码
                            key: _self.picKey //图形验证码返回的key
                        },
                        url: _self.apiData.api.getPhoneCode,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function(data) {
                            if (data.code == "0000") {
                                // 获取成功
                                if (data.content) {
                                    timer = setInterval(function() {
                                        if (maxtime >= 0) {
                                            _self.isGetCode = 0;
                                            _self.vCodeBtnContent = maxtime + "s";
                                            --maxtime;
                                        } else {
                                            clearInterval(timer);
                                            _self.isGetCode = 1;
                                            _self.vCodeBtnContent = "重新获取";
                                            maxtime = 60;
                                        }
                                    }, 1000);
                                } else {
                                    _self.tip.vcodeTip = "请更换验证码"
                                }
                            } else if (data.code == "1002") {
                                $.toast("手机号格式错误", "text");
                            } else {
                                $.toast(data.message, "text");
                            }
                        }
                    });
                }
            },
            // 获取图形验证码
            getPic: function() {
                var _self = this
                $.ajax({
                    type: "get",
                    data: {
                        activityCode: _self.apiData.code
                    },
                    url: _self.apiData.api.getPicCode,
                    dataType: "jsonp",
                    jsonp: "callback",
                    success: function(data) {
                        if (data.code == "0000") {
                            _self.picKey = data.content.key;
                            _self.picUrl = data.content.imageURL;
                        } else {
                            $.toast(data.message, "text");
                        }
                    }
                }).done(function() {
                    _self.loadShow = 0
                })
            },
            // 表单提交
            sub: function() {
                if (_self.phoneCheck() && _self.picCheck() && _self.vcodeCheck()) {
                    $.ajax({
                        type: "get",
                        data: {
                            activityCode: _self.apiData.code, //活动code
                            mobile: _self.form.phone, //手机号
                            smsRandomCode: _self.form.vcode //用户填写的短信验证码
                        },
                        url: _self.apiData.api.sub,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function(data) {
                            if (data.code == "0000") {
                                // $(".mask-box .txt").html("领取成功！");
                                $(".mask_bg").show();
                            } else if (data.code == "0001") {
                                $("#mobileValidateCode").val("");
                                $("#mobileValidateCodeError").html("验证码错误");
                                $(".mask_bg").hide();
                            } else if (data.code == "1002") {
                                $("#mobile").val("");
                                $("#mobileError").html("手机号格式错误");
                                $(".mask_bg").hide();
                            } else if (data.code == "1001") {
                                $('.mask-box .h2').hide();
                                $(".mask-box .h3").html("哎呀，每人限领一个福利，别贪心哦(*^_^*) ");
                                $(".mask_bg").show();
                            } else if (data.code == "7000" || data.code == "1006") {
                                $('.mask-box .h2').html('领光啦');
                                $(".mask-box .h3").html("请明天再来看看吧");
                                $(".mask-box .txt").html("点击下方【邮乐818】去主会场看看!")
                                $(".sure_btn").html("邮乐818");
                                $(".mask_bg").show();
                            } else {
                                $.toast(data.message, "text");
                            }
                        }
                    });
                }
            }
        },
        mounted: function() {
            this.getPic()
        }
    })
})