/**
 * 懒加载插件
 * 微信JSDK
 * 秒杀插件
 */

/**
 * jQuery picLazyLoad Plugin
 */
(function($) {
    $.fn.picLazyLoad = function(settings) {
        var $this = $(this),
            _winScrollTop = 0,
            _winHeight = $(window).height();
        settings = $.extend({
            threshold: 0,
            placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
        }, settings || {});
        lazyLoadPic();
        $(window).on('scroll', function() {
            _winScrollTop = $(window).scrollTop();
            lazyLoadPic();
        });

        function lazyLoadPic() {
            $this.each(function() {
                var $self = $(this);
                if ($self.is('img')) {
                    if ($self.attr('data-original')) {
                        var _offsetTop = $self.offset().top;
                        if ((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)) {
                            $self.attr('src', $self.attr('data-original'));
                            $self.removeAttr('data-original');
                        }
                    }
                } else {
                    if ($self.attr('data-original')) {
                        if ($self.css('background-image') == 'none') {
                            $self.css('background-image', 'url(' + settings.placeholder + ')');
                        }
                        var _offsetTop = $self.offset().top;
                        if ((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)) {
                            $self.css('background-image', 'url(' + $self.attr('data-original') + ')');
                            $self.removeAttr('data-original');
                        }
                    }
                }
            });
        }
    }
})(jQuery);
/**
 * weixin-share.js
 */
! function(a, b) {
    "function" == typeof define && (define.amd || define.cmd) ? define(function() {
        return b(a)
    }) : b(a, !0)
}(this, function(a, b) {
    function c(b, c, d) {
        a.WeixinJSBridge ? WeixinJSBridge.invoke(b, e(c), function(a) {
            g(b, a, d)
        }) : j(b, d)
    }

    function d(b, c, d) {
        a.WeixinJSBridge ? WeixinJSBridge.on(b, function(a) {
            d && d.trigger && d.trigger(a), g(b, a, c)
        }) : d ? j(b, d) : j(b, c)
    }

    function e(a) {
        return a = a || {}, a.appId = E.appId, a.verifyAppId = E.appId, a.verifySignType = "sha1", a.verifyTimestamp = E.timestamp + "", a.verifyNonceStr = E.nonceStr, a.verifySignature = E.signature, a
    }

    function f(a) {
        return {
            timeStamp: a.timestamp + "",
            nonceStr: a.nonceStr,
            "package": a.package,
            paySign: a.paySign,
            signType: a.signType || "SHA1"
        }
    }

    function g(a, b, c) {
        var d, e, f;
        switch (delete b.err_code, delete b.err_desc, delete b.err_detail, d = b.errMsg, d || (d = b.err_msg, delete b.err_msg, d = h(a, d), b.errMsg = d), c = c || {}, c._complete && (c._complete(b), delete c._complete), d = b.errMsg || "", E.debug && !c.isInnerInvoke && alert(JSON.stringify(b)), e = d.indexOf(":"), f = d.substring(e + 1)) {
            case "ok":
                c.success && c.success(b);
                break;
            case "cancel":
                c.cancel && c.cancel(b);
                break;
            default:
                c.fail && c.fail(b)
        }
        c.complete && c.complete(b)
    }

    function h(a, b) {
        var e, f, c = a,
            d = p[c];
        return d && (c = d), e = "ok", b && (f = b.indexOf(":"), e = b.substring(f + 1), "confirm" == e && (e = "ok"), "failed" == e && (e = "fail"), -1 != e.indexOf("failed_") && (e = e.substring(7)), -1 != e.indexOf("fail_") && (e = e.substring(5)), e = e.replace(/_/g, " "), e = e.toLowerCase(), ("access denied" == e || "no permission to execute" == e) && (e = "permission denied"), "config" == c && "function not exist" == e && (e = "ok"), "" == e && (e = "fail")), b = c + ":" + e
    }

    function i(a) {
        var b, c, d, e;
        if (a) {
            for (b = 0, c = a.length; c > b; ++b) d = a[b], e = o[d], e && (a[b] = e);
            return a
        }
    }

    function j(a, b) {
        if (!(!E.debug || b && b.isInnerInvoke)) {
            var c = p[a];
            c && (a = c), b && b._complete && delete b._complete, console.log('"' + a + '",', b || "")
        }
    }

    function k() {
        0 != D.preVerifyState && (u || v || E.debug || "6.0.2" > z || D.systemType < 0 || A || (A = !0, D.appId = E.appId, D.initTime = C.initEndTime - C.initStartTime, D.preVerifyTime = C.preVerifyEndTime - C.preVerifyStartTime, H.getNetworkType({
            isInnerInvoke: !0,
            success: function(a) {
                var b, c;
                D.networkType = a.networkType, b = "http://open.weixin.qq.com/sdk/report?v=" + D.version + "&o=" + D.preVerifyState + "&s=" + D.systemType + "&c=" + D.clientVersion + "&a=" + D.appId + "&n=" + D.networkType + "&i=" + D.initTime + "&p=" + D.preVerifyTime + "&u=" + D.url, c = new Image, c.src = b
            }
        })))
    }

    function l() {
        return (new Date).getTime()
    }

    function m(b) {
        w && (a.WeixinJSBridge ? b() : q.addEventListener && q.addEventListener("WeixinJSBridgeReady", b, !1))
    }

    function n() {
        H.invoke || (H.invoke = function(b, c, d) {
            a.WeixinJSBridge && WeixinJSBridge.invoke(b, e(c), d)
        }, H.on = function(b, c) {
            a.WeixinJSBridge && WeixinJSBridge.on(b, c)
        })
    }
    var o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H;
    if (!a.jWeixin) return o = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        onMenuShareQZone: "menu:share:QZone",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest"
    }, p = function() {
        var b, a = {};
        for (b in o) a[o[b]] = b;
        return a
    }(), q = a.document, r = q.title, s = navigator.userAgent.toLowerCase(), t = navigator.platform.toLowerCase(), u = !(!t.match("mac") && !t.match("win")), v = -1 != s.indexOf("wxdebugger"), w = -1 != s.indexOf("micromessenger"), x = -1 != s.indexOf("android"), y = -1 != s.indexOf("iphone") || -1 != s.indexOf("ipad"), z = function() {
        var a = s.match(/micromessenger\/(\d+\.\d+\.\d+)/) || s.match(/micromessenger\/(\d+\.\d+)/);
        return a ? a[1] : ""
    }(), A = !1, B = !1, C = {
        initStartTime: l(),
        initEndTime: 0,
        preVerifyStartTime: 0,
        preVerifyEndTime: 0
    }, D = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        preVerifyState: 1,
        systemType: y ? 1 : x ? 2 : -1,
        clientVersion: z,
        url: encodeURIComponent(location.href)
    }, E = {}, F = {
        _completes: []
    }, G = {
        state: 0,
        data: {}
    }, m(function() {
        C.initEndTime = l()
    }), H = {
        config: function(a) {
            E = a, j("config", a);
            var b = E.check === !1 ? !1 : !0;
            m(function() {
                var a, d, e;
                if (b) c(o.config, {
                    verifyJsApiList: i(E.jsApiList)
                }, function() {
                    F._complete = function(a) {
                        C.preVerifyEndTime = l(), G.state = 1, G.data = a
                    }, F.success = function() {
                        D.preVerifyState = 0
                    }, F.fail = function(a) {
                        F._fail ? F._fail(a) : G.state = -1
                    };
                    var a = F._completes;
                    return a.push(function() {
                        k()
                    }), F.complete = function() {
                        for (var c = 0, d = a.length; d > c; ++c) a[c]();
                        F._completes = []
                    }, F
                }()), C.preVerifyStartTime = l();
                else {
                    for (G.state = 1, a = F._completes, d = 0, e = a.length; e > d; ++d) a[d]();
                    F._completes = []
                }
            }), E.beta && n()
        },
        ready: function(a) {
            0 != G.state ? a() : (F._completes.push(a), !w && E.debug && a())
        },
        error: function(a) {
            "6.0.2" > z || B || (B = !0, -1 == G.state ? a(G.data) : F._fail = a)
        },
        checkJsApi: function(a) {
            var b = function(a) {
                var c, d, b = a.checkResult;
                for (c in b) d = p[c], d && (b[d] = b[c], delete b[c]);
                return a
            };
            c("checkJsApi", {
                jsApiList: i(a.jsApiList)
            }, function() {
                return a._complete = function(a) {
                    if (x) {
                        var c = a.checkResult;
                        c && (a.checkResult = JSON.parse(c))
                    }
                    a = b(a)
                }, a
            }())
        },
        onMenuShareTimeline: function(a) {
            d(o.onMenuShareTimeline, {
                complete: function() {
                    c("shareTimeline", {
                        title: a.title || r,
                        desc: a.title || r,
                        img_url: a.imgUrl || "",
                        link: a.link || location.href,
                        type: a.type || "link",
                        data_url: a.dataUrl || ""
                    }, a)
                }
            }, a)
        },
        onMenuShareAppMessage: function(a) {
            d(o.onMenuShareAppMessage, {
                complete: function() {
                    c("sendAppMessage", {
                        title: a.title || r,
                        desc: a.desc || "",
                        link: a.link || location.href,
                        img_url: a.imgUrl || "",
                        type: a.type || "link",
                        data_url: a.dataUrl || ""
                    }, a)
                }
            }, a)
        },
        onMenuShareQQ: function(a) {
            d(o.onMenuShareQQ, {
                complete: function() {
                    c("shareQQ", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a)
                }
            }, a)
        },
        onMenuShareWeibo: function(a) {
            d(o.onMenuShareWeibo, {
                complete: function() {
                    c("shareWeiboApp", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a)
                }
            }, a)
        },
        onMenuShareQZone: function(a) {
            d(o.onMenuShareQZone, {
                complete: function() {
                    c("shareQZone", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a)
                }
            }, a)
        },
        startRecord: function(a) {
            c("startRecord", {}, a)
        },
        stopRecord: function(a) {
            c("stopRecord", {}, a)
        },
        onVoiceRecordEnd: function(a) {
            d("onVoiceRecordEnd", a)
        },
        playVoice: function(a) {
            c("playVoice", {
                localId: a.localId
            }, a)
        },
        pauseVoice: function(a) {
            c("pauseVoice", {
                localId: a.localId
            }, a)
        },
        stopVoice: function(a) {
            c("stopVoice", {
                localId: a.localId
            }, a)
        },
        onVoicePlayEnd: function(a) {
            d("onVoicePlayEnd", a)
        },
        uploadVoice: function(a) {
            c("uploadVoice", {
                localId: a.localId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        downloadVoice: function(a) {
            c("downloadVoice", {
                serverId: a.serverId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        translateVoice: function(a) {
            c("translateVoice", {
                localId: a.localId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        chooseImage: function(a) {
            c("chooseImage", {
                scene: "1|2",
                count: a.count || 9,
                sizeType: a.sizeType || ["original", "compressed"],
                sourceType: a.sourceType || ["album", "camera"]
            }, function() {
                return a._complete = function(a) {
                    if (x) {
                        var b = a.localIds;
                        b && (a.localIds = JSON.parse(b))
                    }
                }, a
            }())
        },
        previewImage: function(a) {
            c(o.previewImage, {
                current: a.current,
                urls: a.urls
            }, a)
        },
        uploadImage: function(a) {
            c("uploadImage", {
                localId: a.localId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        downloadImage: function(a) {
            c("downloadImage", {
                serverId: a.serverId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        getNetworkType: function(a) {
            var b = function(a) {
                var c, d, e, b = a.errMsg;
                if (a.errMsg = "getNetworkType:ok", c = a.subtype, delete a.subtype, c) a.networkType = c;
                else switch (d = b.indexOf(":"), e = b.substring(d + 1)) {
                    case "wifi":
                    case "edge":
                    case "wwan":
                        a.networkType = e;
                        break;
                    default:
                        a.errMsg = "getNetworkType:fail"
                }
                return a
            };
            c("getNetworkType", {}, function() {
                return a._complete = function(a) {
                    a = b(a)
                }, a
            }())
        },
        openLocation: function(a) {
            c("openLocation", {
                latitude: a.latitude,
                longitude: a.longitude,
                name: a.name || "",
                address: a.address || "",
                scale: a.scale || 28,
                infoUrl: a.infoUrl || ""
            }, a)
        },
        getLocation: function(a) {
            a = a || {}, c(o.getLocation, {
                type: a.type || "wgs84"
            }, function() {
                return a._complete = function(a) {
                    delete a.type
                }, a
            }())
        },
        hideOptionMenu: function(a) {
            c("hideOptionMenu", {}, a)
        },
        showOptionMenu: function(a) {
            c("showOptionMenu", {}, a)
        },
        closeWindow: function(a) {
            a = a || {}, c("closeWindow", {}, a)
        },
        hideMenuItems: function(a) {
            c("hideMenuItems", {
                menuList: a.menuList
            }, a)
        },
        showMenuItems: function(a) {
            c("showMenuItems", {
                menuList: a.menuList
            }, a)
        },
        hideAllNonBaseMenuItem: function(a) {
            c("hideAllNonBaseMenuItem", {}, a)
        },
        showAllNonBaseMenuItem: function(a) {
            c("showAllNonBaseMenuItem", {}, a)
        },
        scanQRCode: function(a) {
            a = a || {}, c("scanQRCode", {
                needResult: a.needResult || 0,
                scanType: a.scanType || ["qrCode", "barCode"]
            }, function() {
                return a._complete = function(a) {
                    var b, c;
                    y && (b = a.resultStr, b && (c = JSON.parse(b), a.resultStr = c && c.scan_code && c.scan_code.scan_result))
                }, a
            }())
        },
        openProductSpecificView: function(a) {
            c(o.openProductSpecificView, {
                pid: a.productId,
                view_type: a.viewType || 0,
                ext_info: a.extInfo
            }, a)
        },
        addCard: function(a) {
            var e, f, g, h, b = a.cardList,
                d = [];
            for (e = 0, f = b.length; f > e; ++e) g = b[e], h = {
                card_id: g.cardId,
                card_ext: g.cardExt
            }, d.push(h);
            c(o.addCard, {
                card_list: d
            }, function() {
                return a._complete = function(a) {
                    var c, d, e, b = a.card_list;
                    if (b) {
                        for (b = JSON.parse(b), c = 0, d = b.length; d > c; ++c) e = b[c], e.cardId = e.card_id, e.cardExt = e.card_ext, e.isSuccess = e.is_succ ? !0 : !1, delete e.card_id, delete e.card_ext, delete e.is_succ;
                        a.cardList = b, delete a.card_list
                    }
                }, a
            }())
        },
        chooseCard: function(a) {
            c("chooseCard", {
                app_id: E.appId,
                location_id: a.shopId || "",
                sign_type: a.signType || "SHA1",
                card_id: a.cardId || "",
                card_type: a.cardType || "",
                card_sign: a.cardSign,
                time_stamp: a.timestamp + "",
                nonce_str: a.nonceStr
            }, function() {
                return a._complete = function(a) {
                    a.cardList = a.choose_card_info, delete a.choose_card_info
                }, a
            }())
        },
        openCard: function(a) {
            var e, f, g, h, b = a.cardList,
                d = [];
            for (e = 0, f = b.length; f > e; ++e) g = b[e], h = {
                card_id: g.cardId,
                code: g.code
            }, d.push(h);
            c(o.openCard, {
                card_list: d
            }, a)
        },
        chooseWXPay: function(a) {
            c(o.chooseWXPay, f(a), a)
        }
    }, b && (a.wx = a.jWeixin = H), H
});
/* Seckill 秒杀插件 */
$(function() {
    var windowHref = window.location.host;
    // var doMain = "beta.ule.com";
    // var ulecdn = "beta.ulecdn.com";
    var doMain = "ule.com";
    var ulecdn = "ulecdn.com";
    if (windowHref.indexOf('ule.com') != -1 && windowHref.indexOf('beta.ule.com') == -1) {
        doMain = 'ule.com';
        ulecdn = "ulecdn.com"
    }
    $.extend(String.prototype, {
        sliceAfter: function(str) {
            return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : ''
        },
        sliceBefore: function(str) {
            return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : ''
        }
    });
    $.browser = $.browser || {};
    $.extend($.browser, (function() {
        var ua = navigator.userAgent.toLowerCase(),
            os, version;
        if (ua.indexOf('uleapp/') > 0) {
            version = ua.sliceAfter('uleapp/').split('_')[3];
            os = ua.sliceAfter('uleapp/').sliceBefore('_');
            if (ua.sliceAfter('uleapp/').split('_')[1] == 'ule') {
                var uappType = {
                    ule: true,
                    ylxd: false,
                    ysh: false
                }
            } else if (ua.sliceAfter('uleapp/').split('_')[1] == 'ysh') {
                var uappType = {
                    ule: false,
                    ylxd: false,
                    ysh: true
                }
            } else {
                var uappType = {
                    ule: false,
                    ylxd: true,
                    ysh: false
                }
            }
            var appobj = $.extend({
                ios: os == 'ios',
                android: os == 'android',
                version: version
            }, uappType);
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
    if ($.browser.ule) {
        var shopUrl = '//service.' + doMain + '/seckill/item/detail/';
        var urlParam = '?uleNeedNativeTitle=false&client_type=app_ylw&source=h5'
    } else if ($.browser.ylxd) {
        var shopUrl = '//service.' + doMain + '/seckill/item/detail/';
        var urlParam = '?uleNeedNativeTitle=false&client_type=app_ylxd&source=h5'
    } else {
        var shopUrl = '//m.' + doMain + '/mseckill/item/detail/';
        var urlParam = ''
    }

    var _getScript = function(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', url);
        head.appendChild(js);
        var callbackFn = function() {
            if (typeof callback === 'function') {
                callback()
            }
        };
        if (document.all) {
            js.onreadystatechange = function() {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    callbackFn()
                }
            }
        } else {
            js.onload = function() {
                callbackFn()
            }
        }
    };
    $.getScript = _getScript;
    $.extend($.fn, {
        seckillService: function(options, componentOpt, callBack) {
            options = $.extend({
                container: '.wrapUl',
                prdsHtml: function(item, status, shopUrl, urlParam, actCode) {
                    var btnTemp = "";
                    if (item.goodCss == "no_prd" || status.isEnd) btnTemp = '<a href="javascript:void(0)" data-id="' + item.listId + '" class="over">已秒光</a>';
                    else if (status.share) btnTemp = '<a href="' + shopUrl + item.listId + '/' + actCode + urlParam + '" data-id="' + item.listId + '" class="share">分享立获秒杀资格</a>';
                    else if (item.goodCss != "no_prd" && status.isActive) btnTemp = '<a href="' + shopUrl + item.listId + '/' + actCode + urlParam + '" data-id="' + item.listId + '" class="begin">立即秒杀</a>';
                    else btnTemp = '<a href="' + shopUrl + item.listId + '/' + actCode + urlParam + '"  data-id="' + item.listId + '"  class="nobegin">即将开始</a>';
                    var tmp = '<li><a href="' + shopUrl + item.listId + '/' + actCode + urlParam + '"><img src="' + item.itemImgUrl.replace(/^http(s)?:/, '') + '"></a><p class="desc">' + item.itemName + '</p><p class="price"><span class="r_price">¥' + item.salPrice + '</span><span class="cg_price">秒杀价：¥<label>' + item.seckillPrice + '</label></span></p><p class="count"><span>数量: 200</span></p>' + btnTemp + '</li>';
                    return tmp
                },
                CHANNEL: "2017051610440362",
                pageSize: 50,
                pageNum: 1,
                canGet: true,
                pluginTimes: 0,
                IsNextChangeBtn: false,
                isPage: false,
                api: {
                    getDateUrl: "//act." + doMain + "/seckillInfoApi/queryActivityDate",
                    getActCodeUrl: "//act." + doMain + "/seckillInfoApi/queryActivity",
                    getPrdsUrl: "//act." + doMain + "/seckillInfoApi/queryActivityItem",
                    getShareData: '//service.' + doMain + '/api/share/findItemShareList.do',
                },
            }, options);
            var dataset = {},
                dataArr = [],
                actPrds = {};
            var timer = {
                t: []
            };
            var currentDate = '';
            var isPrds = true,
                request = true;
            var components = {
                dateLine: {
                    isShowDate: (componentOpt.dateLine && componentOpt.dateLine.isShowDate) || false,
                    container: (componentOpt.dateLine && componentOpt.dateLine.container) || '.timeChoose',
                    num: (componentOpt.dateLine && componentOpt.dateLine.num) || 3,
                    isSlide: (componentOpt.dateLine && componentOpt.dateLine.isSlide) || false,
                    htmlTemp: '',
                    render: function(html) {
                        var oThis = this;
                        $(oThis.container).append(html);
                        if (oThis.isSlide) {
                            $.getScript("//i0." + ulecdn + "/ulewap/j/common/iscroll.js", iScrollInit)
                        }
                    },
                    dateLineHtml: (componentOpt.dateLine && componentOpt.dateLine.dateLineHtml) || function(i, date) {
                        var tmp = '<li class="time ' + (i == 0 ? "focus" : "") + '" data-val="' + date + '">' + getDateText(date) + '</li>';
                        return tmp
                    },
                    callback: function() {}
                },
                timeLine: {
                    isShowTimeLine: (componentOpt.timeLine && componentOpt.timeLine.isShowTimeLine) || false,
                    container: (componentOpt.timeLine && componentOpt.timeLine.container) || '.timeChoose',
                    num: '',
                    type: (componentOpt.timeLine && componentOpt.timeLine.type) || 1,
                    htmlTemp: '',
                    mountStatus: [],
                    render: function(html) {
                        var oThis = this;
                        var containerArr = oThis.container.split(',');
                        for (var i = 0; i < containerArr.length; i++) {
                            $(containerArr[i]).append(html)
                        }
                    },
                    handleTimeEle: function(actitityList, index) {
                        var oThis = this;
                        var startDate = actitityList[0].startDate;
                        var html = oThis.timeLineHtml('', startDate, '');
                        oThis.mountStatus[index] = true;
                        $(oThis.container).eq(index).append(html)
                    },
                    timeLineHtml: (componentOpt.timeLine && componentOpt.timeLine.timeLineHtml) || function(i, time, code) {
                        var tmp = '<li class="time ' + (i == 0 ? "focus" : "") + '" data-val="' + code + '">' + new Date(time.replace(/-/g, '/')).format('hh:nn') + '场</li>';
                        return tmp
                    },
                    bindClick: function(actitityList) {
                        var oThis = this;
                        $(oThis.container).children().click(function() {
                            if (timer['t'].length) {
                                for (var i = 0; i < timer['t'].length; i++) {
                                    clearInterval(timer['t'][i]);
                                    timer['t'][i] = null
                                }
                            }
                            $(this).addClass("focus").siblings().removeClass("focus");
                            var index = $(this).index();
                            $(container).html("");
                            options.pageNum = 1;
                            isPrds = true;
                            request = true;
                            JEND.track.ule.sendEvent("webapp", "click", "h5_ms20170521_actcode_" + $(this).data('val'), "");
                            generateBox(index, actitityList[index]);
                            loadPrdsApi(index, actitityList[index], renderPrds)
                        })
                    },
                    callback: function() {}
                },
                countDown: {
                    isShowCountDown: (componentOpt.countDown && componentOpt.countDown.isShowCountDown) || false,
                    container: (componentOpt.countDown && componentOpt.countDown.container) || '.startTime',
                    htmlTemp: '',
                    timeFormat: (componentOpt.countDown && componentOpt.countDown.timeFormat) || ['天', '时', '分', '秒'],
                    distanceEndText: (componentOpt.countDown && componentOpt.countDown.distanceEndText) || '距结束',
                    distanceStartText: (componentOpt.countDown && componentOpt.countDown.distanceStartText) || '距开始',
                    render: function(html) {
                        var oThis = this;
                        $(oThis.container).append(html)
                    },
                    timeLineHtml: (componentOpt.countDown && componentOpt.countDown.timeLineHtml) || function() {
                        var tmp = '<label></label><label></label><label></label><label></label>';
                        return tmp
                    },
                    callback: function() {}
                }
            };
            var container = options.container;
            var create = function(callback) {
                getDateApi(callback)
            };
            var eventInit = function() {
                var id = $(options.container + ' .section').attr('id');
                var removeBeforeStr = id.substring(id.indexOf('_') + 1);
                var actCode = removeBeforeStr.substring(0, removeBeforeStr.lastIndexOf('_'));
                for (var i = 0; i < dataset[currentDate]['actitityList'].length; i++) {
                    if (dataset[currentDate]['actitityList'][i]['code'] == actCode) {
                        var session = i;
                        var actCodeInfo = dataset[currentDate]['actitityList'][i];
                        break
                    }
                }
                $(window).unbind('scroll');
                $(window).scroll(function() {
                    var lastli = $(options.container + ' li').last();
                    if (lastli.length == 0) return false;
                    if ($(window).scrollTop() + $(window).height() >= (lastli.offset().top + lastli.offset().height)) {
                        if (!isPrds) {
                            return
                        }
                        if (request) {
                            request = false;
                            $('.loaddiv').show();
                            loadPrdsApi(session, actCodeInfo, renderPrds)
                        }
                    }
                })
            };
            var installDate = function(activityDateList) {
                var activityDateList = activityDateList.split(",");
                for (var i = 0; i < activityDateList.length; i++) {
                    dataArr.push(activityDateList[i]);
                    dataset[activityDateList[i]] = {}
                }
            };
            var installActCode = function(date, actitityList) {
                dataset[date]['actitityList'] = [];
                for (var i = 0; i < actitityList.length; i++) {
                    dataset[date]['actitityList'].push(actitityList[i])
                }
            };
            var installActPrds = function(actCode, itemListPage) {
                if (actPrds[actCode] && actPrds[actCode].length > 0) {
                    actPrds[actCode].push(itemListPage)
                } else {
                    actPrds[actCode] = [];
                    actPrds[actCode].push(itemListPage)
                }
            };
            var getDateApi = function(callback) {
                if (!($.isEmptyObject(dataset))) {
                    callback && callback.apply(this, [dataArr]);
                    return
                }
                $.ajax({
                    type: "GET",
                    async: true,
                    dataType: "jsonp",
                    jsonp: "jsonCallBack",
                    url: options.api.getDateUrl,
                    data: {
                        channel: options.CHANNEL
                    },
                    success: function(obj) {
                        installDate(obj.activityDateList);
                        callback && callback.apply(this, [obj.activityDateList])
                    },
                    error: function(jqXHR, errorStatus, errorThrown) {
                        $('.loading_wrapper').hide()
                    }
                })
            };
            var getActCodeApi = function(date, index, callback, scope) {
                if (!($.isEmptyObject(dataset[date]))) {
                    callback && callback.apply(this, [dataset[date]['actitityList']]);
                    return
                }
                var datas = {
                    channel: options.CHANNEL,
                    activityDate: date
                };
                $.ajax({
                    type: "GET",
                    async: true,
                    dataType: "jsonp",
                    jsonp: "jsonCallBack",
                    url: options.api.getActCodeUrl,
                    data: datas,
                    success: function(obj) {
                        installActCode(date, obj.actitityList);
                        if (!scope) {
                            scope = this
                        }
                        callback && callback.apply(scope, [obj.actitityList, index])
                    },
                    error: function(jqXHR, errorStatus, errorThrown) {
                        $('.loading_wrapper').hide()
                    }
                })
            };
            var loadPrdsApi = function(session, actCodeInfo, callback) {
                var actCode = actCodeInfo.code;
                if (!options.isPage) {
                    if (actPrds[actCode] && actPrds[actCode].length > 0) {
                        callback && callback.apply(this, [session, actPrds[actCode][0], actCodeInfo]);
                        return
                    }
                }
                var datas = {
                    activityCode: actCode,
                    pageSize: options.pageSize,
                    pageNum: options.pageNum
                };
                $.ajax({
                    type: "GET",
                    async: true,
                    dataType: "jsonp",
                    jsonp: "jsonCallBack",
                    url: options.api.getPrdsUrl,
                    data: datas,
                    success: function(obj) {
                        if (obj.returnCode == "0000") {
                            var itemListPage = obj.itemListPage;
                            installActPrds(actCode, itemListPage);
                            callback && callback.apply(this, [session, itemListPage, actCodeInfo])
                        } else {
                            $('#session_' + actCode + '_' + session).remove()
                        }
                    },
                    error: function(jqXHR, errorStatus, errorThrown) {
                        $('.loading_wrapper').hide()
                    }
                })
            };
            var getfirstDate = function(datas) {
                var datas = datas.split(",");
                var nowTime = system.systemTime.get('yyyymmdd');
                datas.sort();
                for (var i = 0; i < datas.length; i++) {
                    if (nowTime > datas[i]) {
                        if (i == datas.length - 1) {
                            var date = datas[i]
                        }
                        continue
                    } else {
                        var date = datas[i];
                        break
                    }
                }
                currentDate = date;
                getActCodeApi(date, '', sessionTrigger);
                JEND.track.ule.sendEvent("webapp", "click", "h5_ms20170521_date_" + date, "")
            };
            var initNavEls = function(datas) {
                var datas = datas.split(",");
                var dates = [];
                var nowTime = system.systemTime.get('yyyymmdd');
                datas.sort();
                for (var i = 0; i < datas.length; i++) {
                    if (nowTime > datas[i]) {
                        if (i == datas.length - 1) {
                            dates.push(datas[i])
                        }
                        continue
                    } else {
                        dates.push(datas[i])
                    }
                }
                datas = dates;
                var len = datas.length;
                var html = '';
                this.itemLen = len;
                if (typeof components.dateLine.num == 'number' && len > components.dateLine.num) {
                    len = components.dateLine.num
                }
                for (var i = 0; i < len; i++) {
                    var date = datas[i].replace(/-/g, "");
                    html += components.dateLine.dateLineHtml(i, date)
                }
                components.dateLine.render(html);
                bindNavEvent()
            };
            var bindNavEvent = function() {
                $(components.dateLine.container).find("li").bind("click", function() {
                    var that = $(this);
                    if (timer['t'].length) {
                        for (var i = 0; i < timer['t'].length; i++) {
                            clearInterval(timer['t'][i]);
                            timer['t'][i] = null
                        }
                    }
                    that.addClass("focus").siblings().removeClass("focus");
                    var date = $(this).attr("data-val");
                    $(container).html("");
                    options.pageNum = 1;
                    isPrds = true;
                    request = true;
                    currentDate = date;
                    getActCodeApi(date, '', sessionTrigger);
                    JEND.track.ule.sendEvent("webapp", "click", "h5_ms20170521_date_" + date, "")
                });
                $(components.dateLine.container).find("li").eq(0).click()
            };
            var sessionTrigger = function(actitityList) {
                if (components.timeLine.isShowTimeLine) {
                    if (components.timeLine.type == 1) {
                        var html = '';
                        for (var i = 0; i < actitityList.length; i++) {
                            html += components.timeLine.timeLineHtml(i, actitityList[i].startDate, actitityList[i].code)
                        }
                        components.timeLine.render(html);
                        generateBox(0, actitityList[0].code);
                        loadPrdsApi(0, actitityList[0], renderPrds);
                        components.timeLine.bindClick(actitityList)
                    } else if (components.timeLine.type == 2) {
                        for (var i = 0; i < actitityList.length; i++) {
                            generateBox(i, actitityList[i].code);
                            loadPrdsApi(i, actitityList[i], renderPrds)
                        }
                    } else if (components.timeLine.type == 3) {
                        generateBox(0, actitityList[0].code);
                        loadPrdsApi(0, actitityList[0], renderPrds)
                    } else if (components.timeLine.type == 4) {
                        generateBox(0, actitityList[0].code);
                        var len = dataArr.length;
                        if (components.dateLine.num < dataArr.length) {
                            len = components.dateLine.num
                        }
                        for (var i = 0; i < len; i++) {
                            if (components.timeLine.mountStatus[i]) {
                                continue
                            }
                            if (dataset[dataArr[i]]['actitityList'] && dataset[dataArr[i]]['actitityList'].length > 0) {
                                components.timeLine.handleTimeEle(dataset[dataArr[i]]['actitityList'], i)
                            } else {
                                getActCodeApi(dataArr[i], i, components.timeLine.handleTimeEle, components.timeLine)
                            }
                        }
                        loadPrdsApi(0, actitityList[0], renderPrds)
                    }
                } else {
                    generateBox(0, actitityList[0].code);
                    loadPrdsApi(0, actitityList[0], renderPrds)
                }
            };
            var generateBox = function(session, actCode) {
                $(container).append('<div class="section" id="session_' + actCode + "_" + session + '"><div class="loading"></div></div>')
            };
            var renderPrds = function(session, itemListPage, actCodeInfo) {
                if (!itemListPage.itemList || itemListPage.itemList.length == 0) {
                    if (options.pageNum == 1) {
                        $('.miaoshadiv').html("")
                    } else {
                        isPrds = false;
                        request = true
                    }
                    $('.loaddiv').hide();
                    return
                }
                var itemList = itemListPage.itemList;
                getPrdEl(session, itemList, actCodeInfo);
                bindPrdEvent()
            };
            var renderCountDown = function(statusStr, session, actCode) {
                if (components.countDown.isShowCountDown) {
                    if (components.timeLine.type == 4) {
                        if (statusStr == '秒杀已结束') {
                            $(components.countDown.container).eq(0).html('')
                        } else {
                            if ($(components.dateLine.container).children().eq(0).hasClass('focus')) {
                                $(components.countDown.container).eq(0).html('<span>' + statusStr + '</span>' + components.countDown.timeLineHtml())
                            }
                        }
                    } else {
                        if (statusStr == '秒杀已结束') {
                            $('#session_' + actCode + '_' + session + ' ' + components.countDown.container).html(statusStr)
                        } else {
                            $('#session_' + actCode + '_' + session + ' ' + components.countDown.container).html('<span>' + statusStr + '</span>' + components.countDown.timeLineHtml())
                        }
                    }
                }
            };
            var changeStatus = function(session, actCode, dates, status) {
                if (options.pageNum == 1) {
                    if (components.timeLine.isShowTimeLine && components.timeLine.type == 2) {
                        var $timeP = $('<p class="timeP clearfix"></p>');
                        var $times = $('<span class="left ' + components.timeLine.container.replace(".", "") + '"></span>');
                        var timeLine = components.timeLine.timeLineHtml('', dates.startTime, '');
                        $times.append(timeLine);
                        $timeP.append($times);
                        var $startTime = $('<span class="right ' + components.countDown.container.replace(".", "") + '"></span>');
                        $timeP.append($startTime);
                        $('#session_' + actCode + '_' + session).prepend($timeP);
                        var countElm = $startTime
                    } else if (components.timeLine.isShowTimeLine && components.timeLine.type == 4) {
                        if ($('.timeChoose li.focus').index() == 0) {
                            var countElm = $(components.countDown.container)
                        } else {
                            var countElm = $('');
                            $(components.countDown.container).html('')
                        }
                    } else if (components.countDown.isShowCountDown) {
                        var $timeP = $('<p class="timeP"></p>');
                        var $startTime = $('<span class="right ' + components.countDown.container.replace(".", "") + '"></span>');
                        $timeP.append($startTime);
                        $('#session_' + actCode + '_' + session).prepend($timeP);
                        var countElm = $startTime
                    } else if (!components.countDown.isShowCountDown) {
                        var countElm = $('')
                    } else {
                        var countElm = $(components.countDown.container)
                    }
                    if (dates.nowTime < dates.startTime) {
                        renderCountDown(components.countDown.distanceStartText, session, actCode);
                        bindCountDown(countElm, dates.startTime, session, function() {
                            $('.nobegin').each(function() {
                                $(this).attr("class", "ms_btn begin").html('立即秒杀')
                            });
                            renderCountDown(components.countDown.distanceEndText, session, actCode);
                            bindCountDown(countElm, dates.endTime, session, function() {
                                renderCountDown('秒杀已结束', session, actCode);
                                $('.wrapUl .ms_btn').attr("class", "ms_btn over").attr("href", "javascript:void(0)").html("已秒光")
                            })
                        })
                    } else if (dates.nowTime < dates.endTime) {
                        status.isActive = true;
                        renderCountDown(components.countDown.distanceEndText, session, actCode);
                        bindCountDown(countElm, dates.endTime, session, function() {
                            renderCountDown('秒杀已结束', session, actCode);
                            $('.wrapUl .ms_btn').attr("class", "ms_btn over").attr("href", "javascript:void(0)").html("已秒光")
                        })
                    } else {
                        status.isEnd = true;
                        renderCountDown('秒杀已结束', session, actCode)
                    }
                } else {
                    if (dates.nowTime < dates.startTime) {} else if (dates.nowTime < dates.endTime) {
                        status.isActive = true
                    } else {
                        status.isEnd = true
                    }
                }
            };
            var render = function(session, prds, status, actCodeInfo) {
                var actCode = actCodeInfo.code;
                if (options.pageNum > 1) {
                    var prdHtml = ''
                } else {
                    var prdHtml = '<ul class="clear" style="width:100%">'
                }
                for (var i = 0; i < prds.length; i++) {
                    var item = prds[i];
                    item.itemImgUrl = item.itemImgUrl.replaceAll('.jpg', '_l.jpg').replaceAll('.JPG', '_l.jpg');
                    if (item.storageNum - item.sellStorageNum < 1 || status.isEnd) {
                        item.goodCss = 'no_prd'
                    }
                    if (options.pageNum > 1) {
                        prdHtml += options.prdsHtml(item, status, shopUrl, urlParam, actCode)
                    } else {
                        if (i == prds.length - 1) {
                            prdHtml = prdHtml + options.prdsHtml(item, status, shopUrl, urlParam, actCode) + '</ul><div class="loaddiv" style="display: none"><span>加载中...</span></div>'
                        } else {
                            prdHtml += options.prdsHtml(item, status, shopUrl, urlParam, actCode)
                        }
                    }
                }
                appendprds(session, actCodeInfo.code, prdHtml)
            };
            var appendprds = function(session, actCode, prdstmp) {
                $('#session_' + actCode + '_' + session + ' .loading').remove();
                if (options.isPage && options.pageNum > 1) {
                    $('#session_' + actCode + '_' + session + ' ul').append(prdstmp)
                } else {
                    $('#session_' + actCode + '_' + session).append(prdstmp);
                    if (options.pageNum == 1) {
                        if (options.isPage) {
                            eventInit()
                        }
                        calPluginTimes()
                    }
                }
                options.pageNum = ++options.pageNum;
                $('.loaddiv').hide();
                isPrds = true;
                request = true;
                callBack && callBack.apply(this, [pluginTimes])
            };
            var calPluginTimes = function() {
                if (typeof window.pluginTimes == "number") {
                    window.pluginTimes = options.pluginTimes = window.pluginTimes + 1
                } else {
                    window.pluginTimes = options.pluginTimes = 1
                }
            };
            var getPrdEl = function(session, itemList, actCodeInfo) {
                var prds = itemList;
                var dates = {
                    nowTime: system.systemTime.get('yyyy-mm-dd hh:nn:ss'),
                    startTime: actCodeInfo.startDate,
                    endTime: actCodeInfo.endDate
                };
                var isEnd = false;
                var isActive = false;
                var status = {
                    'isEnd': false,
                    'isActive': false,
                    'share': false
                };
                var actCode = actCodeInfo.code;
                changeStatus(session, actCode, dates, status);
                render(session, prds, status, actCodeInfo)
            };
            var bindPrdEvent = function() {};
            var resizeWidth = function() {
                $prdWrap.width($(window).width())
            };
            var iScrollInit = function() {
                var w = $(components.dateLine.container + " li").width();
                var h = $(components.dateLine.container).height();
                var liMarginL = parseInt($(components.dateLine.container + " li").css("margin-left").replace("px", ""));
                var liMarginR = parseInt($(components.dateLine.container + " li").css("margin-right").replace("px", ""));
                var l = $(components.dateLine.container + " li").size();
                $(components.dateLine.container).css("width", ((w + liMarginL + liMarginR) * l) + "px");
                $(components.dateLine.container).wrap('<div id="scrollWrapper" style="position:relative;height: ' + h + 'px;">');
                var parentId = $(components.dateLine.container).parent().attr('id');
                fscroll = new iScroll(parentId, {
                    snap: 'li',
                    hScrollbar: false,
                    vScrollbar: false,
                    vScroll: false,
                    onScrollEnd: function() {}
                })
            };
            var bindCountDown = function(element, endTimeStr, session, callback) {
                var endTime = endTimeStr.parseDate().getTime(),
                    seconds = Math.round((endTime - system.systemTime.get().getTime()) / 1000);
                (function(i) {
                    var timerId = setInterval(function() {
                        seconds = Math.round((endTime - system.systemTime.get().getTime()) / 1000);
                        updateCountDown(element, seconds, components.countDown.timeFormat);
                        if (seconds <= 0) {
                            clearInterval(timer['t'][i]);
                            timer['t'][i] = null;
                            if (callback) {
                                callback(element, i)
                            }
                        }
                    }, 1000);
                    timer['t'][i] = timerId
                })(session);
                updateCountDown(element, seconds, components.countDown.timeFormat)
            };
            var updateCountDown = function(element, seconds, timeFormat) {
                if (seconds > 0) {
                    var s = seconds % 60;
                    var m = Math.floor((seconds % 3600) / 60);
                    var h = Math.floor(seconds / 3600);
                    var day = Math.floor(seconds / 3600 / 24);
                    h = h - day * 24;
                    var timei = element.children();
                    day = (day + '').padLeft(2, '0').toString();
                    day == "00" ? timei.eq(1).hide() : timei.eq(1).html("<i>" + day + "</i>" + timeFormat[0]).show();
                    h = (h + '').padLeft(2, '0').toString();
                    timei.eq(2).html("<i>" + h + "</i>" + timeFormat[1]);
                    m = (m + '').padLeft(2, '0').toString();
                    timei.eq(3).html("<i>" + m + "</i>" + timeFormat[2]);
                    s = (s + '').padLeft(2, '0').toString();
                    timei.eq(4).html("<i>" + s + "</i>" + timeFormat[3])
                }
            };
            var formatStr = function(str, len) {
                if (str.length < len) {
                    return str
                } else {
                    return str.substring(0, len) + "..."
                }
            };
            var sortDatas = function(datas) {
                var len = datas.length,
                    temp;
                for (var i = 0; i < datas.length; i++) {
                    for (var j = 0; j < len - i - 1; j++) {
                        if (parseInt(datas[j].startDate.time) >= datas[j + 1].startDate.time) {
                            temp = datas[j + 1];
                            datas[j + 1] = datas[j];
                            datas[j] = temp
                        }
                    }
                }
                return datas
            };
            var getDateText = function(date) {
                if (!date) return "";
                var y = date.substring(0, 4);
                var m = date.substring(4, 6);
                var d = date.substring(6, 8);
                return m + "月" + d + "日"
            };
            var nextChange = function() {
                $('p.next').click(function() {
                    $(window).scrollTop(0);
                    var next = $(components.dateLine.container + ' li.focus').next();
                    if (next.length > 0) next.click();
                    else $(components.dateLine.container + ' li').eq(0).click()
                })
            };
            if (options.IsNextChangeBtn) {
                nextChange()
            }
            var init = function() {
                if (components.dateLine.isShowDate) {
                    create(initNavEls)
                } else {
                    create(getfirstDate)
                }
            };
            init()
        }
    })
});