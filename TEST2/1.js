(function($) {
    var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
    var url = location.href;

    var state; //判断是否领过，若是已经领过，为防止多次弹出领取成功方法
    var login = "true"; //判断是否登录，若是已经登录，为防止多次再调用登录方法
    var doMain = 'ulecdn.com';
    //定义跳转到shop页面
    var shopUrl = '//m.ule.com/item/detail/';
    //定义跳转到store页面
    var storeUrl = '//m.ule.com/store/index/';
    var channel = "";
    var code = "MA_U_150235262975758";

    // 扩展String 原型
    $.extend(String.prototype, {
        //method
        trim: function() {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        },
        format: function() {
            var result = this;
            if (arguments.length > 0) {
                var parameters = (arguments.length == 1 && $.isArray(arguments[0])) ? arguments[0] : $.makeArray(arguments);
                $.each(parameters, function(i, n) {
                    result = result.replace(new RegExp("\\{" + i + "\\}", "g"), n);
                });
            }
            return result;
        },
        substitute: function(data) {
            if (data && typeof(data) == 'object') {
                return this.replace(/\{([^{}]+)\}/g, function(match, key) {
                    var value = data[key];
                    return (value !== undefined) ? '' + value : '';
                });
            } else {
                return this.toString();
            }
        },
        parseJSON: function() {
            return (new Function("return " + this.toString()))();
        },
        parseDate: function() {
            return (new Date()).parse(this.toString());
        },
        replaceAll: function(os, ns) {
            return this.replace(new RegExp(os, 'gm'), ns);
        },
        parseAttrJSON: function() {
            var d = {},
                a = this.toString().split(';');
            for (var i = 0; i < a.length; i++) {
                if (a[i].trim() === '' || a[i].indexOf(':') < 1) continue;
                var item = a[i].sliceBefore(':').trim(),
                    val = a[i].sliceAfter(':').trim();
                if (item !== '' && val !== '') d[item.toCamelCase()] = val._toRealValue();
            }
            return d;
        },
        padLeft: function(width, ch) {
            if (this.length >= width) return this.toString();
            return this._pad(width, ch, 0);
        },
        _pad: function(width, ch, side) {
            var str = [side ? '' : this, side ? this : ''];
            while (str[side].length < (width ? width : 0) && (str[side] = str[1] + (ch || ' ') + str[0]));
            return str[side];
        },
        trimAll: function() {
            return this.replace(/\s/g, '');
        },
        isMobile: function() {
            return (new RegExp(/^(13|14|15|17|18)\d{9}$/).test(this.trim()));
        },
        sliceAfter: function(str) {
            return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : '';
        },
        sliceBefore: function(str) {
            return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : '';
        },
        escapeReg: function() {
            return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
        },
        getQueryValue: function(name) {
            var reg = new RegExp("(^|&|\\?|#)" + name.escapeReg() + "=([^&]*)(&|\x24)", "");
            var match = this.match(reg);
            return (match) ? match[2] : '';
        }
    });
    // 扩展Zepto
    $.extend($.fn, {
        attrJSON: function(attr) {
            return (this.attr(attr || 'rel') || '').parseAttrJSON();
        }
    });
    // alert提示层
    var toast = (function() {
        var _toast, _timer;
        return function(msg) {
            if (!msg) return;
            _toast && clearTimeout(_timer);
            if (!_toast) {
                _toast = $('<div class="toast-wrap"><div class="toast"></div></div>');
                _toast.appendTo('body');
            }
            _toast.show().children('.toast').html(msg).addClass('toast-in');
            _timer = setTimeout(function() {
                if (!_toast) return;
                _toast.children('.toast').removeClass('toast-in');
                setTimeout(function() {
                    _toast.hide();
                }, 500)
            }, 2000)
        }
    }())
    window.toast = toast;
    // 浏览器环境判断
    $.browser = $.browser || {};
    $.extend($.browser, (function() {
        var ua = navigator.userAgent.toLowerCase(),
            os, version;
        //alert(ua)
        if (ua.indexOf('uleapp/') > 0) {
            version = ua.sliceAfter('uleapp/').split('_')[3];
            os = ua.sliceAfter('uleapp/').sliceBefore('_');
            if (ua.sliceAfter('uleapp/').split('_')[1] == 'ule') {
                var uappType = {
                    ule: true,
                    ylxd: false,
                    ysh: false
                };
            } else if (ua.sliceAfter('uleapp/').split('_')[1] == 'ysh') {
                var uappType = {
                    ule: false,
                    ylxd: false,
                    ysh: true
                };
            } else {
                var uappType = {
                    ule: false,
                    ylxd: true,
                    ysh: false
                };
            }
            var appobj = $.extend({
                ios: os == 'ios',
                android: os == 'android',
                version: version
            }, uappType);
            return appobj;
        } else if (ua.indexOf('uzgapp/') > 0) {
            version = ua.sliceAfter('uzgapp/').split('_')[3];
            os = ua.sliceAfter('uzgapp/').sliceBefore('_');
            return {
                uzg: true,
                wx: false,
                ios: os == 'ios',
                android: os == 'android',
                version: version
            };
        } else {
            return {
                ule: false,
                uzg: false,
                ylxd: false,
                wx: ua.match(/micromessenger/i),
                ios: ua.match(/(iphone|ipod|ipad);?/i),
                android: ua.match(/android/i)
            };
        }
    })());
    /* 全局调用 分享 */
    var shareCall = function() {
        var title = "手机验证",
            content = "手机验证",
            imgUrl = "//i0.ule.com/ulewap/i/logo.png",
            // 需获取url
            linkUrl = location.href + '&ulespring=true';
        var linkStr = title + "##" + content + "##" + imgUrl + "##" + linkUrl + "&&WX##WF##QQ";

        if ($.browser.android) {
            window.group.jsMethod(linkStr);
        } else if ($.browser.ios) {
            return linkStr;
        } else {
            return linkStr;
        }
    };
    window.shareCall = shareCall;

    //
    var coupon = {
        param: {},
        status: true,
        key: "",
        appkey: {
            appkey: '4b9f40822ddd5cd5',
            version_no: 'apr_2010_build01'
        },
        init: function() {
            var m = this;
            // 表单验证
            m.initEvent();
            // 初始化URL
            m.getUrl();
            // 初始化获取图片验证码
            m.getImgCode();
            // 表单keyup事件 表单验证
            // 
            m.bindEvent();

        },
        //      getParams:function(){
        //          var name,value;
        //          var str=location.href; //取得整个地址栏
        //          var num=str.indexOf("?")
        //          str=str.substr(num+1); //取得所有参数
        //          var arr=str.split("&"); //各个参数放到数组里
        //          for(var i=0;i < arr.length;i++){
        //              num=arr[i].indexOf("=");
        //              if(num>0){
        //                  name=arr[i].substring(0,num);
        //                  value=arr[i].substr(num+1);
        //                  this[name]=value;
        //              }
        //          }
        //      }, 
        getUrl: function() {
            if ($.browser.ule) {
                shopUrl = 'uleMobile://uleVi_';
                storeUrl = 'ulemobile://uleStore_';
                channel = "104";
            } else if ($.browser.ysh) {
                channel = "223";
            }
        },



        timer: null,
        api: {
            getPrdsUrl: "//search.ule.com/api/recommend?jsoncallback=?",
            getStoresUrl: "//search.ule.com/api/recommend?restype=2002&jsoncallback=?"
        },
        getCookie: function(name) {
            var cookies = document.cookie.split(";");
            for (var i = 0, len = cookies.length; i < len; i++) {
                if (cookies[i].split('=')[0].trim() == name) {
                    return cookies[i].split('=')[1];
                }
            }
        },
        getUserId: function(callback) {
            var oThis = this;
            $.ajax({
                type: "get",
                async: true,
                url: "//my." + uleUrl + "/usr/getIndexCookies.do",
                dataType: "jsonp",
                jsonp: "jsonCallBack", //服务端用于接收callback调用的function名的参数
                success: function(obj) {
                    oThis.userId = obj.useronlyid;
                    callback && callback.apply(oThis);
                },
                error: function(jqXHR, errorStatus, errorThrown) {
                    alert('请求服务失败');
                }
            });
        },

        checkUserStatus: function() {
            if (this.getCookie('mall_cookie')) {
                return true;
            } else {
                return false;
            }
        },
        isLogin: function(callback) {
            var m = this;
            if (m.checkUserStatus()) {
                callback && callback.apply(this);
            } else {
                //末登录
                if ($.browser.ule) {
                    //邮乐app
                    location.href = 'uleMobile://uleLogin_' + url;
                } else {
                    if (m.getCookie('client_type') == 'wx_psbc') {
                        //邮储
                        location.href = 'https://m.' + uleUrl + '/user/relation?target=' + encodeURIComponent(location.href);
                    } else {
                        //邮乐
                        location.href = 'https://m.' + uleUrl + '/user/login?target=' + url;
                    }
                }
            }

        },
        //获取图片验证码接口数据函数
        getImgCode: function() { 
            var m = this;
            $.ajax({
                type: "get",
                data: {
                    activityCode: code
                },
                url: "//prize.ule.com/mc/mobileReceiveCoupons/getRandomCode",
                dataType: "jsonp",
                jsonp: "callback", //服务端用于接收callback调用的function名的参数
                success: function(data) {
                    //console.log(data);
                    if (data.code == "0000") {
                        var codeUrl = "//" + data.content.imageURL;
                        m.key = data.content.key;
                        $("#getCodeImg img").attr("src", codeUrl);

                    } else {
                        toast(data.message);
                    }
                },
                error: function(jqXHR, errorStatus, errorThrown) {
                    toast('请求服务失败');
                }
            });
        },
        // 获取短信验证码接口数据函数
        verifyImgCode: function() {
            var m = this;
            var mobile = $("#mobile").val();
            var picRandomCode = $("#imgValidateCode").val();
            var maxtime = 60; //设定秒数时间
            $.ajax({
                type: "get",
                data: {
                    activityCode: code, //活动CODE
                    mobile: mobile,//手机号
                    picRandomCode: picRandomCode,//图形验证码
                    key: m.key  //图形验证码返回的key
                },
                url: "//prize.ule.com/mc/mobileReceiveCoupons/validateCode",
                dataType: "jsonp",
                jsonp: "callback", //服务端用于接收callback调用的function名的参数
                success: function(data) {
                    console.log(data);
                    if (data.code == "0000") {
                        if (data.content) {
                            timer = setInterval(function() {
                                if (maxtime >= 0) {
                                    msg = maxtime + "s";
                                    if (!($("#getCode").hasClass("wait"))) {
                                        $("#getCode").addClass("wait");
                                    }
                                    $("#getCode").html(msg);
                                    --maxtime;
                                } else {
                                    clearInterval(timer);
                                    $("#getCode").removeClass("wait").html("重新获取");
                                    // m.getImgCode();
                                    maxtime = 60;
                                }
                            }, 1000);
                        } else {
                            $("#imgValidateCode").val("");
                            $("#imgValidateCodeError").html("请更换验证码");
                        }
                    } else if (data.code == "1002") {
                        $("#mobile").val("");
                        $("#mobileError").html("手机号格式错误");
                        $(".mask_bg").hide();
                    } else {
                        toast(data.message);
                    }
                },
                error: function(jqXHR, errorStatus, errorThrown) {
                    toast('请求服务失败');
                }
            });
        },
        //最终提交
        verifyMobileCode: function() { 
            var m = this;
            var mobile = $("#mobile").val();
            var picRandomCode = $("#imgValidateCode").val();
            var smsRandomCode = $("#mobileValidateCode").val();

            $.ajax({
                type: "get",
                data: {
                    activityCode: code, //活动code
                    mobile: mobile, //手机号
                    smsRandomCode: smsRandomCode //用户填写的短信验证码
                },
                url: "//prize.ule.com/mc/mobileReceiveCoupons/receiveCoupons",
                dataType: "jsonp",
                jsonp: "callback", //服务端用于接收callback调用的function名的参数
                success: function(data) {
                    console.log(data);
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
                        toast(data.message);
                    }
                },
                error: function(jqXHR, errorStatus, errorThrown) {
                    toast('请求服务失败');
                }
            });
        },

        bindEvent: function() {
            var m = this;
            $('#mobile,#imgValidateCode,#mobileValidateCode').keyup(function() {
                var value = $(this).val();
                var reg = /[^0-9]+/
                if (reg.test(value)) {
                    var value = value.replace(reg, "");
                    $(this).val(value);
                }
            })
            // 获取手机验证码
            $("#getCode").click(function() {
                m.validatePhoneCode();
                var imgValidateCodeError = $("#imgValidateCodeError").html();
                var mobileError = $("#mobileError").html();
                if (imgValidateCodeError == "&nbsp;" && mobileError == "&nbsp;") {
                    m.verifyImgCode();
                }
            })
            // 获取图形验证码
            $("#getCodeImg").click(function() {
                m.validatePhoneCode();
                var mobileError = $("#mobileError").html();
                if (mobileError == "&nbsp;") {
                    m.getImgCode();
                }
            })
            $("#submit_btn").click(function() {
                m.validatePhoneCode();
                m.mobileValidateCode();
                m.imgValidateCode();
                var mobileError = $("#mobileError").html();
                var imgValidateCodeError = $("#imgValidateCodeError").html();
                var mobileValidateCodeError = $("#mobileValidateCodeError").html();
                if ((mobileValidateCodeError == "&nbsp;") && (imgValidateCodeError == "&nbsp;") && (mobileError == "&nbsp;")) {
                    m.verifyMobileCode();
                }
            })
            $(".sure_btn").click(function() {
                $(".mask_bg").hide();
                window.location.href = "//www.ule.com/event/2017/0728/ule818/index.html?adid=mmk_weixin";
            })
            $('.mask_bg, .close').click(function() {
                $(".mask_bg").hide();
            })
        },
        // 手机号验证
        validatePhoneCode: function() {
            var name = $('#mobile').val().trimAll();
            if (name == "") {
                $('#mobileError').html("请输入手机号码");
            } else if (!name.isMobile()) {
                $('#mobileError').html("手机号码格式错误");
            } else
                $('#mobileError').html("&nbsp");
        },
        // 短信验证码验证
        mobileValidateCode: function() {
            var name = $('#mobileValidateCode').val().trimAll();
            if (name == "") {
                $('#mobileValidateCodeError').html("验证码错误");
            } else
                $('#mobileValidateCodeError').html("&nbsp");
        },
        // 图形验证码验证
        imgValidateCode: function() {
            var name = $('#imgValidateCode').val().trimAll();
            if (name == "") {
                $('#imgValidateCodeError').html("验证码错误");
            } else if (name.length != 4) {
                $('#imgValidateCodeError').html("手机号码格式错误");
            } else
                $('#imgValidateCodeError').html("&nbsp");
        },
        initEvent: function() {
            var m = this;
            $("#mobile").blur(function() {
                m.validatePhoneCode();
            })
            $("#mobileValidateCode").blur(function() {
                m.mobileValidateCode();
            })
            $("#imgValidateCode").blur(function() {
                m.imgValidateCode();
            })
        },
        formatStr: function(str, len) {
            if (str.length < len) {
                return str;
            } else {
                return str.substring(0, len) + "...";
            }
        }

    }
    coupon.init();

})($);