/**
 * 常用函数
 */
$.extend($.fn, {
    attrJSON: function(attr) {
        return (this.attr(attr || 'rel') || '').parseAttrJSON()
    }
});

/**
 * String原型方法扩展
 */
$.extend(String.prototype, {
    replaceAll: function(os, ns) {
        return this.replace(new RegExp(os, 'gm'), ns)
    },
    parseDate: function() {
        return (new Date()).parse(this.toString())
    },
    padLeft: function(width, ch) {
        if (this.length >= width) return this.toString();
        return this._pad(width, ch, 0)
    },
    _pad: function(width, ch, side) {
        var str = [side ? '' : this, side ? this : ''];
        while (str[side].length < (width ? width : 0) && (str[side] = str[1] + (ch || ' ') + str[0]));
        return str[side]
    },
    sliceAfter: function(str) {
        return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : ''
    },
    sliceBefore: function(str) {
        return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : ''
    }
});

/**
 * JSONP
 */
$.extend($, {
    getJSONPSUPER: function(url, options, data, callback) {
        var options = $.extend({
                callback: 'callback',
                timeout: 10000
            },
            options);
        var jsre = /=\?/,
            jsonp = 'json' + (+new Date()) + parseInt(Math.random() * 100);
        if (!jsre.test(url)) {
            url += (url.match(/\?/) ? "&" : "?") + options.callback + "=?"
        }
        if (typeof(data) == "function") {
            callback = data,
                data = {}
        }
        url = url.replace(jsre, "=" + jsonp);
        url += '&' + $.param(data);
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;
        var tId = null,
            __run = function(tmp) {
                if (!tId) return;
                clearTimeout(tId);
                tId = null;
                callback && callback(tmp);
                try {
                    delete window[jsonp]
                } catch (e) {}
                if (head) head.removeChild(script)
            };
        window[jsonp] = function(tmp) {
            __run(tmp)
        };
        $(script).error(function() {
            __run(false)
        });
        tId = setTimeout(function() {
                __run('timeout')
            },
            options.timeout);
        head.appendChild(script)
    }
});
/**
 * 浏览器环境判断
 */
$.browser = $.browser || {};
$.extend($.browser, (function() {
    var ua = navigator.userAgent.toLowerCase(),
        os,
        version;
    if (ua.indexOf('uleapp/') > 0) {
        version = ua.sliceAfter('uleapp/').split('_')[3];
        os = ua.sliceAfter('uleapp/').sliceBefore('_');
        if (ua.sliceAfter('uleapp/').split('_')[1] == 'ule') {
            var uappType = {
                ule: true,
                ylxd: false
            }
        } else {
            var uappType = {
                ule: false,
                ylxd: true
            }
        }
        var appobj = $.extend({
                ios: os == 'ios',
                android: os == 'android',
                version: version
            },
            uappType);
        return appobj
    } else if (ua.indexOf('ulxdapp/') > 0) {
        version = ua.sliceAfter('ulxdapp/').split('_')[3];
        os = ua.sliceAfter('ulxdapp/').sliceBefore('_');
        return {
            ylxd: true,
            wx: false,
            ios: os == 'ios',
            android: os == 'android',
            version: version
        }
    } else if (ua.indexOf('uzgapp/') > 0) {
        version = ua.sliceAfter('uzgapp/').split('_')[3];
        os = ua.sliceAfter('uzgapp/').sliceBefore('_');
        return {
            uzg: true,
            wx: false,
            ios: os == 'ios',
            android: os == 'android',
            version: version
        }
    } else {
        return {
            ule: false,
            uzg: false,
            ylxd: false,
            wx: ua.match(/micromessenger/i),
            ios: ua.match(/(iphone|ipod|ipad);?/i),
            android: ua.match(/android/i)
        }
    }
})());

/**
 * Date扩展
 */
$.extend(Date.prototype, {
    parse: function(time) {
        if (typeof(time) == 'string') {
            if (time.indexOf('GMT') > 0 || time.indexOf('gmt') > 0 || !isNaN(Date.parse(time))) {
                return this._parseGMT(time)
            } else if (time.indexOf('UTC') > 0 || time.indexOf('utc') > 0 || time.indexOf(',') > 0) {
                return this._parseUTC(time)
            } else {
                return this._parseCommon(time)
            }
        }
        return new Date()
    },
    _parseGMT: function(time) {
        this.setTime(Date.parse(time));
        return this
    },
    _parseUTC: function(time) {
        return (new Date(time))
    },
    _parseCommon: function(time) {
        var d = time.split(/ |T/),
            d1 = d.length > 1 ? d[1].split(/[^\d]/) : [0, 0, 0],
            d0 = d[0].split(/[^\d]/);
        return new Date(d0[0] - 0, d0[1] - 1, d0[2] - 0, (d1[0] || 0) - 0, (d1[1] || 0) - 0, (d1[2] || 0) - 0)
    },
    clone: function() {
        return new Date().setTime(this.getTime())
    },
    dateAdd: function(type, val) {
        var _y = this.getFullYear();
        var _m = this.getMonth();
        var _d = this.getDate();
        var _h = this.getHours();
        var _n = this.getMinutes();
        var _s = this.getSeconds();
        switch (type) {
            case 'y':
                this.setFullYear(_y + val);
                break;
            case 'm':
                this.setMonth(_m + val);
                break;
            case 'd':
                this.setDate(_d + val);
                break;
            case 'h':
                this.setHours(_h + val);
                break;
            case 'n':
                this.setMinutes(_n + val);
                break;
            case 's':
                this.setSeconds(_s + val);
                break
        }
        return this
    },
    dateDiff: function(type, date2) {
        var diff = date2 - this;
        switch (type) {
            case 'w':
                return diff / 1000 / 3600 / 24 / 7;
            case 'd':
                return diff / 1000 / 3600 / 24;
            case 'h':
                return diff / 1000 / 3600;
            case 'n':
                return diff / 1000 / 60;
            case 's':
                return diff / 1000
        }
    },
    format: function(format) {
        if (isNaN(this)) return '';
        var o = {
            'm+': this.getMonth() + 1,
            'd+': this.getDate(),
            'h+': this.getHours(),
            'n+': this.getMinutes(),
            's+': this.getSeconds(),
            'S': this.getMilliseconds(),
            'W': ['日', '一', '二', '三', '四', '五', '六'][this.getDay()],
            'q+': Math.floor((this.getMonth() + 3) / 3)
        };
        if (format.indexOf('am/pm') >= 0) {
            format = format.replace('am/pm', (o['h+'] >= 12) ? '下午' : '上午');
            if (o['h+'] >= 12) o['h+'] -= 12
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
        }
        return format
    }
});

/**
 * 全局变量（判断正式环境以及beta环境url）
 */
var windowHref = window.location.host;
var doMain = "beta.ule.com";
var ulecdn = "beta.ulecdn.com";
if (windowHref.indexOf('ule.com') != -1 && windowHref.indexOf('beta.ule.com') == -1) {
    doMain = 'ule.com';
    ulecdn = "ulecdn.com"
}

/**
 * 系统时间获取
 */
system = {
    systemTime: {
        load: function(callback) {
            var that = this;
            var errorHandle = function() {
                $('#ms_area919').remove()
            };
            $.getJSONPSUPER('//pub.' + doMain + '/clock/datetime?type=2&callback=?', {
                    callback: 'jsonCallBack',
                    timeout: 10000
                },
                function(obj) {
                    if (obj == false) {
                        errorHandle()
                    } else if (obj == 'timeout') {
                        errorHandle()
                    } else {
                        that.timeDiff = new Date().getTime() - obj.time;
                        if (callback) callback()
                    }
                })
        },
        get: function(formatType) {
            var time = new Date();
            if (this.timeDiff) {
                time = new Date(new Date().getTime() - this.timeDiff)
            }
            return (formatType) ? time.format(formatType) : time
        }
    }
};
window.system = system;

/**
 * 定义微信分享、秒杀、统计
 */
(function($) {
    var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
    var url = location.href;
    var doMain = 'ule.com';
    var shopUrl = '//m.ule.com/item/detail/';
    var storeUrl = '//m.ule.com/store/index/';

    var shareCall = function() {
        var title = "邮乐919购物节 邮储手机银行 扫码特惠_邮乐网",
            content = "邮乐919购物节 邮储手机银行 扫码特惠_邮乐网",
            imgUrl = "https://i0.ule.com/ulewap/i/logo.png",
            linkUrl = location.href + '&ulespring=true';
        var linkStr = title + "##" + content + "##" + imgUrl + "##" + linkUrl + "&&WX##WF##QQ";
        if ($.browser.android) {
            window.group.jsMethod(linkStr)
        } else if ($.browser.ios) {
            return linkStr
        } else {
            return linkStr
        }
    };
    window.shareCall = shareCall;

    var _tip, tID;
    var tipBox = function(msg) {
        if (!msg) return;
        $('.loading').hide();
        khj.status = true;
        _tip && _tip.remove() && clearTimeout(tID);
        _tip = $('<div class="tips_overlay">' + '<div class="tipBox">' + '<div class="msg"><h2><i></i>' + msg + '</h2></div>' + '</div>' + '</div>').appendTo("body");
        setTimeout(function() {
                _tip.addClass('overlay-in');
                _tip.children(".tipBox").addClass('mask-in')
            },
            10);
        tID = setTimeout(function() {
                if (!_tip) return;
                _tip.addClass('overlay-out');
                _tip.children(".tipBox").addClass('mask-out');
                _tip.remove();
                _tip = null
            },
            2000)
    };
    window.tipBox = tipBox;


    if (uleUrl === "beta.ule.com") {
        CHANNEL = "2017082109270560"
    } else {
        CHANNEL = "2017092710310127"
    }
    var khj = {
        status: true,
        appkey: {
            appkey: '4b9f40822ddd5cd5',
            version_no: 'apr_2010_build01'
        },
        init: function() {
            var m = this;
            m.getUrl();
            m.getSeckill(CHANNEL);
            m.ewmBindEvent()
        },
        getUrl: function() {
            if ($.browser.ule) {
                shopUrl = 'uleMobile://uleVi_';
                storeUrl = 'ulemobile://uleStore_'
            }
        },
        getParams: function() {
            var data = {};
            var href = decodeURIComponent(location.href);
            var paramStr = href.substring(href.indexOf("?") + 1);
            var paramArr = paramStr.split("&");
            for (var i = 0; i < paramArr.length; i++) {
                var item = paramArr[i];
                var keyVal = item.split("=");
                var val = item.slice(item.indexOf("=") + 1);
                data[keyVal[0]] = val
            }
            return data
        },
        priceFormat: function(val) {
            var arr = val.toString().split('.');
            return '<b>' + arr[0] + '</b>' + '.' + arr[1]
        },
        getSeckill: function(channel) {
            var m = this;
            if (channel == "") {
                $('#seckill').hide();
                return
            }
            var conpts = {
                countDown: {
                    isShowCountDown: true,
                    isShowCountDown: true,
                    timeFormat: ['天', '时', '分', '秒'],
                    distanceEndText: '距结束'
                },
                dateLine: {
                    isShowDate: true,
                    num: 1,
                    dateLineHtml: function(i, date) {
                        var tmp = '<li class="time ' + (i == 0 ? "focus" : "") + '" data-val="' + date + '"><i></i></li>';
                        return tmp
                    }
                },
                timeLine: {
                    type: 2,
                    isShowTimeLine: true,
                    container: '.timeDesc',
                    timeLineHtml: function(i, time, code) {
                        if (i > 0) return '';
                        var time = new Date(time.replace(/-/g, '/'));
                        var tmp = '<i></i><span class="time ' + (i == 0 ? "focus" : "") + '" data-val="' + code + '">每天上午10点限量开秒</span>';
                        return tmp
                    },
                    bindClick: function() {}
                }
            };

            function loadRadom() {
                var opt = {
                    container: '#seckill .wrapUl',
                    prdsHtml: function(item, status, shopUrl, urlParam, actCode) {
                        var btnTemp = '<span  data-id="' + item.listId + '"  class="ms_btn nobegin">即将开始</span>';
                        var bg_status = '';
                        var itemHref = shopUrl + item.listId + '/' + actCode + urlParam;
                        var itemName = item.itemName;
                        var arr = item.seckillPrice.toString().split('.');
                        var seckillPrice = '<b>' + arr[0] + '</b>.' + (arr[1] || '00');
                        if (item.goodCss == "no_prd" || status.isEnd) {
                            btnTemp = '<span data-id="' + item.listId + '" class="ms_btn btn-default">已抢完</span>';
                            bg_status = '<div class="isover"></div>'
                        } else if (status.share) {
                            btnTemp = '<span data-id="' + item.listId + '" class="ms_btn share">分享立获秒杀资格</span>';
                            bg_status = ''
                        } else if (item.goodCss != "no_prd" && status.isActive) {
                            btnTemp = '<span data-id="' + item.listId + '" class="ms_btn begin">立即秒杀</span>';
                            bg_status = ''
                        }
                        var tmp = '<li><a href="' + itemHref + '"><div class="picBox"><i class="ms_icon">秒杀</i>                                    <img src="' + item.itemImgUrl.replace(/^http(s)?:/, '') + '"/>                                    ' + bg_status + '                                </div>                                <div class="desc">                                    <p class="name">' + itemName + '</p>                                    <p class="price clearfix">￥<span class="price-min">' + seckillPrice + '</span></p>                                    <p class="buy">' + btnTemp + '</p>                                </div>                            </a></li>';
                        return tmp
                    },
                    CHANNEL: channel
                };
                return opt
            }
            /**
             * 配置秒杀项
             */
            system.systemTime.load(function() {
                var options = loadRadom();
                $('#seckill .wrapUl').seckillService(options, conpts,
                    function() {
                        if ($('#seckill .wrapUl').html() == "") {
                            $('#seckill').hide();
                            return
                        }
                    })
            })
        },
        ewmBindEvent: function() {
            var $add_liImg = $('.add_popewm ul li img');
            $add_liImg.click(function(event) {
                $(this).parent().find('.pop_box').css('display', '-webkit-box');
                $(this).parent().siblings().find('.pop_box').hide()
            });
            $('.pop_box').click(function() {
                $(this).css('display', 'none')
            })
        },
        lotteryUtils: function(callback) {
            var m = this;
            $.ajax({
                type: "get",
                data: {
                    activityCode: activityNo
                },
                async: true,
                url: "//prize." + uleUrl + "/mc/base/lotteryUtils/getLotteryServerTime",
                dataType: "jsonp",
                jsonp: "callback",
                success: function(o) {}
            })
        },
        getCookie: function(name) {
            var cookies = document.cookie.split(";");
            for (var i = 0,
                    len = cookies.length; i < len; i++) {
                if (cookies[i].split('=')[0].trim() == name) {
                    return cookies[i].split('=')[1]
                }
            }
        },
        checkUserStatus: function() {
            if (this.getCookie('mall_cookie')) {
                return true
            } else {
                return false
            }
        },
        formatStr: function(str, len) {
            if (str.length < len) {
                return str
            } else {
                return str.substring(0, len) + "..."
            }
        }
    };
    khj.init()
})($);

if ($.browser.wx) {
    $(function() {
        var uleUrl = "ule.com";
        var wxshare_title = '邮爱传万家，跨年大聚惠';
        var wxshare_link = location.href;
        var wxshare_desc = "邮爱传万家，跨年大聚惠";
        var wxshare_imgurl = "https://i0.ule.com/ulewap/i/logo.png";
        var wxshare = {
            appkey: {
                appkey: '4b9f40822ddd5cd5',
                version_no: 'apr_2010_build01'
            },
            init: function() {
                var oThis = this;
                oThis.shareWX()
            },
            shareWX: function() {
                var oThis = this;
                var _appId = "";
                var _uleUrl = "";
                if (uleUrl == "ule.com") {
                    _uleUrl = "www.ule.com";
                    _appId = "wx4e190edda7e57237"
                } else {
                    _uleUrl = "beta.ule.com";
                    _appId = "wx8b73da0067c52318"
                }
                var _api = '//service.' + uleUrl + '/api/mobile/getWechatSignature.do';
                var _data = {
                    lotteryInfoId: 325,
                    currentPageUrl: location.href,
                    appkey: '4b9f40822ddd5cd5',
                    version_no: 'apr_2010_build01',
                    appId: _appId,
                    t: Math.random()
                };
                $.ajax({
                    url: _api,
                    data: _data,
                    dataType: 'jsonp',
                    jsonp: "jsonApiCallback",
                    success: function(o) {
                        if (o.returnCode == "0000") {
                            wxConfig(o.detail[0].timestamp, o.detail[0].nonceStr, o.detail[0].signature)
                        }
                    }
                });

                function wxConfig(_timestamp, _nonceStr, _signature) {
                    wx.config({
                        debug: false,
                        appId: _appId,
                        timestamp: _timestamp,
                        nonceStr: _nonceStr,
                        signature: _signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
                    });
                    wx.ready(function() {
                        wx.onMenuShareTimeline({
                            title: wxshare_desc,
                            desc: wxshare_desc,
                            link: wxshare_link,
                            imgUrl: wxshare_imgurl,
                            trigger: function(res) {},
                            success: function(res) {},
                            cancel: function(res) {},
                            fail: function(res) {}
                        });
                        wx.onMenuShareAppMessage({
                            title: wxshare_title,
                            desc: wxshare_desc,
                            link: wxshare_link,
                            imgUrl: wxshare_imgurl,
                            trigger: function(res) {},
                            success: function(res) {},
                            cancel: function(res) {},
                            fail: function(res) {}
                        });
                        wx.onMenuShareQQ({
                            title: wxshare_title,
                            desc: wxshare_desc,
                            link: wxshare_link,
                            imgUrl: wxshare_imgurl,
                            trigger: function(res) {},
                            complete: function(res) {},
                            success: function(res) {},
                            cancel: function(res) {},
                            fail: function(res) {}
                        });
                        wx.onMenuShareWeibo({
                            title: wxshare_title,
                            desc: wxshare_desc,
                            link: wxshare_link,
                            imgUrl: wxshare_imgurl,
                            trigger: function(res) {},
                            complete: function(res) {},
                            success: function(res) {},
                            cancel: function(res) {},
                            fail: function(res) {}
                        })
                    })
                }
            }
        };
        wxshare.init()
    })
}
(function($) {
    if (typeof JEND == "undefined") {
        window.JEND = {}
    }
    JEND.track = {};
    JEND.track.uleUrl = "ulecdn.com";
    JEND.track.scriptPath = (document.location.protocol == 'https:') ? 'https://i0' : 'http://i1';
    JEND.track.init = function(options) {
        var that = this;
        that.ule.init()
    };
    JEND.track.loadJS = function(url, isAsync, onSuccess) {
        if (isAsync) {
            JEND.track.getRemoteScript(url, {
                    async: true,
                    keepScriptTag: true
                },
                onSuccess)
        } else {
            document.write(unescape('%3Cscript type="text/javascript" src="' + url + '"%3E%3C/script%3E'))
        }
    };
    JEND.track.getRemoteScript = function(a, b, c, d) {
        $.isFunction(b) && (d = c, c = b, b = {});
        var e = document.getElementsByTagName("head")[0],
            f = document.createElement("script");
        f.type = "text/javascript",
            f.charset = "utf-8",
            f.src = a;
        for (var g in b) "keepScriptTag" == g ? f.keepScriptTag = !0 : f.setAttribute(g, b[g]);
        f.onload = f.onreadystatechange = function() {
                this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (c && c(), f.onload = f.onreadystatechange = null, f.keepScriptTag || e.removeChild(f))
            },
            f.onerror = function() {
                d && d()
            },
            e.appendChild(f)
    };
    JEND.track.ule = {
        init: function() {
            JEND.track.loadJS(JEND.track.scriptPath + '.' + JEND.track.uleUrl + '/j/uletrack.js', true)
        },
        sendEvent: function(type, action, value, extend) {
            window._utrack && _utrack.push(['_trackEvent', type, action || '', value || '', extend || ''])
        }
    };
    JEND.track.init()
})(jQuery);

/**
 * 页面head
 */
(function($) {
    var innerHead = {
        init: function() {
            var oThis = this;
            var Params = oThis.getParams();
            if (Params.ishead == "false") {
                $("body").css({
                    "padding-top": "0px"
                });
                $('<style>nav.fixed{top:0px;}</style>').appendTo('head')
            } else {
                oThis.headHtml();
                oThis.popHtml()
            }
            oThis.backup();
            oThis.getPageUrl = oThis.getParams();
            var skipApp = oThis.getPageUrl.skipApp;
            if (skipApp == 'true') {
                oThis.skipApp()
            }
        },
        headHtml: function() {
            var headHtml = '';
            var headTitle = document.title;
            var fix = "fix";
            $("body").css({
                "padding-top": "40px"
            });
            $('<style>nav.fixed{top:40px;}</style>').appendTo('head');
            if ($.browser.ule) {
                if ($.browser.ios) {
                    if ($.browser.version > 367) {
                        $("body").css({
                            "padding-top": "60px"
                        });
                        $('<style>nav.fixed{top:60px;}</style>').appendTo('head')
                    }
                }
            }
            headHtml = '<h3 class="headTitle ' + fix + '"><a href="javascript:history.back();" class="back"></a><p>' + headTitle + '</p><a href="javascript:;" class="classfiy"></a><span class="shareBtn"></span></h3>';
            $('body').prepend(headHtml)
        },
        popHtml: function() {
            var m = this;
            var popHtml = '';
            popHtml += '<div class="classfiy_pop">';
            popHtml += '<div class="mask"></div>';
            popHtml += '<ul class="classfiy_nav">';
            popHtml += '<li class="homeLi"><a href="//m.ule.com/"><b></b>首页</a></li>';
            popHtml += '<li class="classfiyLi"><a href="//m.ule.com/category/all.html"><b></b>分类</a></li>';
            popHtml += '<li class="cartLi"><a href="//m.ule.com/cart/list"><b></b>购物车</a></li>';
            popHtml += '<li class="my_centerLi"><a href="//m.ule.com/user/center"><b></b>我的邮乐</a></li>';
            popHtml += '</ul>';
            popHtml += '</div>';
            $('body').append(popHtml);
            $(".classfiy").click(function() {
                $(".classfiy_pop").show()
            });
            $(".classfiy_pop").click(function() {
                $(".classfiy_pop").hide()
            });
            var defultTitleH = '0';
            var appTitleH = '20px';
            var defultBackTop = '12px';
            var appBackTop = '32px';
            var appShareBtn = '9px';
            if ($.browser.ule) {
                if ($.browser.ios) {
                    if ($.browser.version > 367) {
                        appShareBtn = '29px'
                    }
                }
            }
            $(".headTitle").css({
                "max-width": "750px",
                "background": "rgba(255,255,255,0.95)",
                "width": "100%",
                "position": "relative",
                "border-bottom": "1px solid rgba(255,255,255,0.95)",
                "margin": "0",
                "padding": defultTitleH
            });
            $(".headTitle.fix").css({
                "position": "fixed",
                "top": "0px",
                "z-index": "100"
            });
            $(".headTitle p").css({
                "width": "70%",
                "margin": "0 auto",
                "height": "40px",
                "line-height": "40px",
                "font-family": "microsoft yahei",
                "color": "#333",
                "text-align": "center",
                "font-size": "16px",
                "font-weight": "400",
                "overflow": "hidden",
                "white-space": "nowrap",
                "text-overflow": "ellipsis"
            });
            $(".headTitle a.back").css({
                "position": "absolute",
                "height": "14px",
                "width": "14px",
                "left": "15px",
                "top": defultBackTop,
                "border-top": "2px solid #666",
                "border-left": "2px solid #666",
                "transform": "rotate(-45deg)",
                "-webkit-transform": "rotate(-45deg)"
            });
            $(".shareBtn").css({
                "width": "22px",
                "height": "21px",
                'display': 'none',
                'background': 'url(//i0.ulecdn.com/ulewap/i/goodsDetail/icon_share_b.png) center center no-repeat',
                'background-size': '100% 100%',
                'margin-right': '0',
                'position': 'absolute',
                'right': '8px',
                'top': appShareBtn
            });
            $('.headTitle a.classfiy').css({
                'background': 'url(//i0.ulecdn.com/ulewap/i/goodsDetail/icon-more.png) center center no-repeat',
                'height': '40px',
                'display': 'inline-block',
                'background-size': '30px',
                'width': '50px',
                'margin-right': '0',
                'position': 'absolute',
                'right': '0',
                'top': '0'
            });
            $('.classfiy_pop').css({
                'background-color': 'rgba(0, 0, 0, 0.3)',
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'z-index': '100',
                'width': '100%',
                'height': '100%',
                'display': 'none'
            });
            $('.classfiy_pop .mask').css({
                'z-index': '101',
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%'
            });
            $('.classfiy_nav').css({
                'position': 'fixed',
                'right': '0',
                'top': '40px',
                'background': '#fff',
                'border-radius': ' 0 0 0 5px',
                'z-index': '102'
            });
            $('.classfiy_nav li').css({
                'height': '40px',
                'line-height': '40px',
                'border-bottom': '1px solid #ccc',
                'width': '110px'
            });
            $('.classfiy_nav li:last-child').css({
                'border-bottom': 'none',
                'border-radius': '0 0 0 5px'
            });
            $('.classfiy_nav li a').css({
                'height': '40px',
                'line-height': '40px',
                'display': 'block',
                'box-sizing': 'border-box',
                'width': '100%',
                'color': '#333',
                'padding': '0 0 0 10px',
                'border-left': '2px solid #fff'
            });
            $('.classfiy_nav li b').css({
                'width': '22px',
                'height': '24px',
                'background': 'url(//i0.ule.com/ulewap/i/classfiyNav_icon.png) -9999px -9999px no-repeat',
                'background-size': '91px 46px',
                'margin': '0 5px 0 0',
                'display': 'inline-block',
                'vertical-align': 'middle'
            });
            $('.classfiy_nav li.homeLi b').css({
                'background-position': '0 1px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav li.classfiyLi b').css({
                'background-position': '-24px 1px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav li.cartLi b').css({
                'background-position': '-48px 1px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav li.my_centerLi b').css({
                'background-position': '-72px 1px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav .homeLi.current b').css({
                'background-position': '0 -23px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav .classfiyLi.current b').css({
                'background-position': '-24px -23px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav .cartLi.current b').css({
                'background-position': '-48px -23px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav .my_centerLi.current b').css({
                'background-position': '-72px -23px',
                'background-size': '91px 46px'
            });
            $('.classfiy_nav li a:hover').css({
                'text-decoration': 'none',
                'color': '#333'
            });
            $('.classfiy_nav li.current a').css({
                'border-left': '2px solid #f52626',
                'color': '#f52626'
            });
            if ($.browser.ule) {
                if ($.browser.ios) {
                    if (parseInt($.browser.version) > 367) {
                        $(".headTitle").css({
                            "padding-top": "20px"
                        });
                        $(".headTitle a.back").css({
                            "top": "32px"
                        });
                        $(".headTitle a.classfiy").css({
                            "top": "20px"
                        })
                    }
                }
            }
            if ($.browser.ylxd) {
                $('.headTitle .back').attr('href', 'ulemobile://ulePopView');
                $('.headTitle a.classfiy').remove();
                if ($.browser.ios) {
                    $('.headTitle .back').attr('href', 'ulemobile://ulePopToFatherView')
                }
            } else if ($.browser.ule) {
                $('.headTitle .back').attr('href', 'ulemobile://ulePopView');
                $('.headTitle a.classfiy').remove();
                var shareInfo = location.href;
                shareInfo = decodeURIComponent(shareInfo);
                if (shareInfo.indexOf('ulesharejson') != -1) {
                    var strStart = shareInfo.indexOf('{');
                    var strEnd = shareInfo.lastIndexOf('}');
                    var shareObj = JSON.parse(shareInfo.substring(strStart, strEnd + 1));
                    var shareTitle = window.title || shareObj.title;
                    var shareContent = window.content || shareObj.content;
                    var shareImgUrl = shareObj.imageUrl.replace(/^http/, 'https');
                    var shareLink = encodeURI(shareObj.linkUrl);
                    var shareTypes = shareObj.shareType;
                    var shareLogTitle = shareObj.logTitle;
                    $('.shareBtn').css('display', 'inline-block');
                    $('.headTitle').delegate('.shareBtn', 'click',
                        function() {
                            if (parseInt($.browser.version) < 342) {
                                location.href = "uleMobile://uleShare_" + encodeURI(shareTitle) + "##" + encodeURI(shareContent) + "##" + shareImgUrl + "##" + shareLink + "##" + 'ule0317redPacketshare=true' + "##false"
                            } else {
                                var param = encodeURI('?ulesharejson{"title":"' + shareTitle + '","imageUrl":"' + shareImgUrl + '","linkUrl":"' + shareLink + '","content":"' + shareContent + '","shareType":"' + shareTypes + '","logTitle":"' + shareLogTitle + '"}');
                                location.href = 'uleMobile://uleNewShare_' + param
                            }
                        })
                }
            }
        },
        getParams: function() {
            var data = {};
            var href = location.href;
            var paramStr = href.substring(href.indexOf("?") + 1);
            var paramArr = paramStr.split("&");
            for (var i = 0; i < paramArr.length; i++) {
                var item = paramArr[i];
                var keyVal = item.split("=");
                var val = item.slice(item.indexOf("=") + 1);
                data[keyVal[0]] = val
            }
            return data
        },
        backup: function() {
            var backHtml = '';
            backHtml = '<div class="fixed_btn"><a class="go_back"></a></div>';
            $('body').append(backHtml);
            $(".fixed_btn").css({
                "position": "fixed",
                "right": "10px",
                "bottom": "-300px",
                "z-index": "20"
            });
            $('.fixed_btn a.go_back').css({
                "width": "48px",
                "height": "48px",
                "display": "block",
                "background": "url(//i0.ule.com/ulewap/i/fixed_button2.png) 0 0 no-repeat",
                "background-size": "100%",
                "position": "relative"
            });
            $('.fixed_btn a.go_back').click(function() {
                $('html, body').scrollTop(0);
                event.preventDefault()
            });
            $(window).scroll(function() {
                var scroolh = $(window).scrollTop();
                if (scroolh > 200) {
                    $(".fixed_btn").css({
                        "bottom": "3%"
                    })
                } else {
                    $(".fixed_btn").css({
                        "bottom": "-300px",
                        "transition": "all ease 1.2s",
                        "-webkit-transition": "all ease 1.2s",
                        "-moz-transition": "all ease 1.2s",
                        "-ms-transition": "all ease 1.2s",
                        "-o-transition": "all ease 1.2s"
                    })
                }
            })
        },
        skipApp: function() {
            var headTitle = document.title;
            var pageUrl = location.href.sliceAfter('com');
            var myUrl = pageUrl.replace(/skipApp=true&?|&?skipApp=true/, '');
            var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
            if ($.browser.ios) {
                location.href = encodeURI('ulebuy://WEBVIEW%%%hideNavgationBar^^^0///title^^^' + headTitle + '///key^^^https://' + uleUrl + myUrl + '///hasxib^^^0')
            } else if ($.browser.android) {
                location.href = encodeURI('ulebuy://ProductActivity&&wgt.ProductDetail&&url::https://' + uleUrl + myUrl + '##title::' + headTitle)
            }
        }
    };
    innerHead.init()
})($);