var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
var ulecdn = uleUrl === "ule.com" ? "ulecdn.com" : "beta.ulecdn.com";
$.extend(String.prototype, {
    trim: function() {
        return this.replace(/(^\s*)|(\s*$)/g, '')
    },
    format: function() {
        var result = this;
        if (arguments.length > 0) {
            var parameters = (arguments.length == 1 && $.isArray(arguments[0])) ? arguments[0] : $.makeArray(arguments);
            $.each(parameters, function(i, n) {
                result = result.replace(new RegExp("\\{" + i + "\\}", "g"), n)
            })
        }
        return result
    },
    substitute: function(data) {
        if (data && typeof(data) == 'object') {
            return this.replace(/\{([^{}]+)\}/g, function(match, key) {
                var value = data[key];
                return (value !== undefined) ? '' + value : ''
            })
        } else {
            return this.toString()
        }
    },
    parseJSON: function() {
        return (new Function("return " + this.toString()))()
    },
    parseDate: function() {
        return (new Date()).parse(this.toString())
    },
    replaceAll: function(os, ns) {
        return this.replace(new RegExp(os, 'gm'), ns)
    },
    parseAttrJSON: function() {
        var d = {},
            a = this.toString().split(';');
        for (var i = 0; i < a.length; i++) {
            if (a[i].trim() === '' || a[i].indexOf(':') < 1) continue;
            var item = a[i].sliceBefore(':').trim(),
                val = a[i].sliceAfter(':').trim();
            if (item !== '' && val !== '') d[item.toCamelCase()] = val._toRealValue()
        }
        return d
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
    isMobile: function() {
        return (new RegExp(/^(13|14|15|17|18)\d{9}$/).test(this.trim()))
    },
    sliceAfter: function(str) {
        return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : ''
    },
    sliceBefore: function(str) {
        return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : ''
    },
    escapeReg: function() {
        return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241')
    },
    getQueryValue: function(name) {
        var reg = new RegExp("(^|&|\\?|#)" + name.escapeReg() + "=([^&]*)(&|\x24)", "");
        var match = this.match(reg);
        return (match) ? match[2] : ''
    }
});
$.extend($, {
    getJSONPSUPER: function(url, options, data, callback) {
        var options = $.extend({
            callback: 'callback',
            timeout: 10000
        }, options);
        var jsre = /=\?/,
            jsonp = 'json' + (+new Date()) + parseInt(Math.random() * 100);
        if (!jsre.test(url)) {
            url += (url.match(/\?/) ? "&" : "?") + options.callback + "=?"
        }
        if (typeof(data) == "function") {
            callback = data, data = {}
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
        }, options.timeout);
        head.appendChild(script)
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
                ysh: false,
                hrysh: false
            }
        } else if (ua.sliceAfter('uleapp/').split('_')[1] == 'ysh') {
            var uappType = {
                ule: false,
                ylxd: false,
                ysh: true,
                hrysh: false
            }
        } else if (ua.sliceAfter('uleapp/').split('_')[1] == 'hrysh') {
            var uappType = {
                ule: false,
                ylxd: false,
                ysh: false,
                hrysh: true
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
            ysh: false,
            hrysh: false,
            wx: ua.match(/micromessenger/i),
            ios: ua.match(/(iphone|ipod|ipad);?/i),
            android: ua.match(/android/i)
        }
    }
})());
$(function() {
    var shopUrl = '//m.ule.com/item/detail/';
    var storeUrl = '//m.ule.com/store/index/';
    var imgRootUrl = '//i2.' + ulecdn + '/i/event/2017/0925/anhui/';
    var shareCall = function() {
        var title = "世界邮政日 掌柜欢乐购",
            content = "世界邮政日 掌柜欢乐购",
            imgUrl = "//i0.ule.com/ulewap/i/logo.png",
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
    if (uleUrl === "beta.ule.com") {
        activityNo = "MA_U_150649577028679"
    } else {
        activityNo = "MA_U_150650556433802"
    }
    var AnhuiShoppingDay = {
        status: true,
        param: {},
        shopKey: "event20170927_anhui_hot,event20170927_anhui_overvalue,event20170927_anhui_more",
        appkey: {
            appkey: '4b9f40822ddd5cd5',
            version_no: 'apr_2010_build01'
        },
        api: {
            queryLocation: '//service.' + uleUrl + '/api/mobile/getAddressByIp.do',
            queryCouponList: '//prize.' + uleUrl + '/mc/m/api/v2/base/coupon/couponListBySearch?',
            receiveCoupon: '//prize.' + uleUrl + '/mc/m/api/v2/base/coupon/receiveCoupon',
            getPrdsUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2001",
            getStoresUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2002"
        },
        init: function() {
            var m = this;
            m.getUrl();
            /**
             * 定义优惠券LINK
             */
            if ($.browser.ule) {
                if ($.browser.android) {
                    m.couponLink = encodeURI('ULEMOBILE://action_ShoppingActivity#wgt.CouponList')
                } else if ($.browser.ios) {
                    m.couponLink = encodeURI('ulemobile://uleCommon_viewname$$CouponViewController^^xib$$0^^isHideTab$$1')
                }
            } else {
                m.couponLink = '//m.' + uleUrl + '/coupon/list'
            }
            /**
             * 领券、优惠券
             */
            m.queryLocation(function() {
                if (m.province === "安徽") {
                    $('#firstTitleImg').attr('src', imgRootUrl + 'title_01.jpg');
                    m.queryCouponList()
                } else {
                    $('.coupon-box').remove()
                }
            });
            /**
             * 获取数据、列表数据
             */
            m.getList(m.shopKey)
        },
        getUrl: function() {
            if ($.browser.ule) {
                shopUrl = 'uleMobile://uleVi_';
                storeUrl = 'ulemobile://uleStore_'
            } else if ($.browser.ylxd) {
                shopUrl = '//m.ule.com/item/ylxd/detail/'
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
        getCookie: function(name) {
            var cookies = document.cookie.split(";");
            for (var i = 0, len = cookies.length; i < len; i++) {
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
        isLogin: function(callback) {
            var m = this;
            var url = location.href;
            if (m.checkUserStatus()) {
                callback && callback.apply(this)
            } else {
                if ($.browser.ule) {
                    location.href = 'uleMobile://uleLogin_' + url
                } else {
                    if (m.getCookie('client_type') == 'wx_psbc') {
                        location.href = '//m.' + uleUrl + '/user/relation?target=' + encodeURIComponent(url)
                    } else {
                        location.href = '//m.' + uleUrl + '/user/login?target=' + url
                    }
                }
            }
        },
        queryLocation: function(callback) {
            var m = this;
            $.ajax({
                type: "get",
                data: m.appkey,
                async: true,
                url: m.api.queryLocation,
                dataType: "jsonp",
                jsonp: "jsonApiCallback",
                jsonpCallback: "jsonApiCallback",
                cache: true,
                headers: {
                    "Accept-Encoding": "gzip,deflate"
                },
                success: function(o) {
                    if (o.returnCode == '0000') {
                        m.province = o.province;
                        callback && callback.apply(m)
                    }
                }
            })
        },
        queryCouponList: function() {
            var m = this;
            var msg = {
                useScene: '4000',
                types: '1,2,3,4,5',
                activityNo: activityNo,
                sortBy: '8001',
                pageIndex: '1',
                pageSize: '30'
            };
            $.getJSONPSUPER(m.api.queryCouponList, {
                callback: 'callback',
                timeout: 10000
            }, msg, function(obj) {
                if (obj == false) {
                    errorHandler()
                } else if (obj == 'timeout') {
                    errorHandler()
                } else {
                    successHandler(obj)
                }
            });
            var errorHandler = function() {
                $('.couponTitle, .coupon-box').hide()
            };
            var successHandler = function(o) {
                if (o.code == '0000') {
                    var couponList = o.result.confList.prizeCouponList;
                    if (couponList && couponList.length > 0) {
                        var couponItem = $('.coupon-item');
                        couponList[0].pickUpStartTime = new Date('2017/09/29 00:00:00').getTime();
                        if (couponList[1]) {
                            couponList[1].pickUpStartTime = new Date('2017/10/09 00:00:00').getTime()
                        }
                        for (var i = 0; i < couponList.length; i++) {
                            if (!couponList[i].currentStock) {
                                couponItem.eq(i).addClass('over');
                                couponItem.eq(i).find('img').attr('src', imgRootUrl + 'coupon_over_' + couponList[i].amount + '.png');
                                continue
                            }
                            if (couponList[i].pickUpStartTime > system.systemTime.get()) {
                                couponItem.eq(i).addClass('notStart');
                                couponItem.eq(i).find('img').attr('src', imgRootUrl + 'coupon_nobegin_' + couponList[i].amount + '.png')
                            } else {
                                couponItem.eq(i).removeClass('notStart');
                                couponItem.eq(i).find('img').attr('src', imgRootUrl + 'coupon_' + couponList[i].amount + '.png')
                            }
                            couponItem.eq(i).data('did', couponList[i].detailId)
                        }
                        $('.coupon-box').show();
                        m.bindEvent();
                        if (uleUrl === "ule.com") {
                            m.couponTime(couponList);
                            m.lotteryUtils()
                        }
                    } else {
                        $('.coupon-box').remove();
                        $('#firstTitleImg').attr('src', imgRootUrl + 'title_01_no_coupon.jpg')
                    }
                }
            }
        },
        couponTime: function(couponArr) {
            var _endTime = couponArr.endTime;
            var endTime = new Date(couponArr.endTime).format('yyyy-mm-dd hh:nn:ss') || '2017-10-31 23:59:59';
            var nowTime = system.systemTime.get('yyyy-mm-dd hh:nn:ss');
            if (endTime && nowTime >= endTime) {
                $('.coupon-box').remove();
                $('#firstTitleImg').attr('src', imgRootUrl + 'title_01_no_coupon.jpg')
            }
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
        bindEvent: function() {
            var m = this;
            $('.coupon-item').click(function() {
                var did = $(this).data('did');
                if (!did || $(this).hasClass('over') || $(this).hasClass('notStart')) {
                    return false
                } else {
                    m.isLogin(function() {
                        m.receiveCoupon(did)
                    })
                }
            });
            $('.mask-close, .cancel').click(function() {
                $('.mask').hide()
            })
        },
        receiveCoupon: function(dId) {
            var m = this;
            if ($.browser.ule) {
                channels = '300000'
            } else {
                channels = '400000'
            }
            var msg = {
                activityCode: activityNo,
                couponDetailId: dId,
                channel: channels,
                mobile: ''
            };
            if (!m.status) {
                return false
            }
            m.status = false;
            $.ajax({
                type: "get",
                data: msg,
                async: true,
                url: m.api.receiveCoupon,
                dataType: "jsonp",
                jsonp: "callback",
                beforeSend: function() {
                    $('.loading').show()
                },
                complete: function() {
                    $('.loading').hide()
                },
                success: function(o) {
                    m.status = true;
                    if (o.code == '0000') {
                        $('.mask .mask-r h3').html('恭喜您获得' + o.result.amount + '元现金券一张');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/success_1.png" />');
                        $('.mask-tip').html('<p class="mask-tip">请进我的优惠券查看使用规则</p>');
                        $('.mask-b').html('<a class="btn mycouponbtn" href="' + m.couponLink + '">查看我的优惠券</a>');
                        $('.mask').show()
                    } else if (o.code == '3005' || o.code == '3006') {
                        $('.mask .mask-r h3').html('亲，该优惠券领取有限制。具体查看活动规则');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/enough.png" />');
                        $('.mask-tip').html('快试试其他现金券!');
                        $('.mask-b').html('<a class="btn cancel" href="javascript:;">确定</a>');
                        $('.mask').show()
                    } else if (o.code == '3004') {
                        $('.mask .mask-r h3').html('哎哟喂！');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/mask_over.png" />');
                        $('.mask-tip').html('还是慢了一拍，现金券已领完！');
                        $('.mask-b').html('<a class="btn cancel" href="javascript:;">确定</a>');
                        $('.mask').show()
                    } else if (o.code == '3003') {
                        $('.mask .mask-r h3').html('哎哟喂！还是慢了一拍，<br/>该优惠券今日已领完！');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/mask_over.png" />');
                        $('.mask-tip').html('快试试其他现金券!');
                        $('.mask-b').html('<a class="btn cancel" href="javascript:;">确定</a>');
                        $('.mask').show()
                    } else if (o.code == '9002' || o.code == '3008') {
                        $('.mask .mask-r h3').html('活动优惠券领取实在太火爆，您没有抢到哦！');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/mask_over.png" />');
                        $('.mask-tip').html('本活动为概率性事件，不能保证所有客户成功领取优惠券。');
                        $('.mask-b').html('<a class="btn cancel" href="javascript:;">确定</a>');
                        $('.mask').show()
                    } else if (o.code == '9003') {
                        $('.mask .mask-r h3').html('hi亲，您今天领券的券实在太多了');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/mask_over.png" />');
                        $('.mask-tip').html('快试试其他吧！');
                        $('.mask-b').html('<a class="btn cancel" href="javascript:;">确定</a>');
                        $('.mask').show()
                    } else if (o.code == '1007') {
                        $('.mask .mask-r h3').html('蓝瘦，香菇，此券已从你的全世界路过。');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/mask_over.png" />');
                        $('.mask-tip').html('快试试其他吧！');
                        $('.mask-b').html('<a class="btn cancel" href="javascript:;">确定</a>');
                        $('.mask').show()
                    } else if (o.code == '3007') {
                        $('.mask .mask-r h3').html('亲，该优惠券不在领取时间内哦，不能领取！');
                        $('.mask-l').html('<img src="//i0.ule.com/i/event/2016/1111/mask_over.png" />');
                        $('.mask-tip').html('快试试其他吧！');
                        $('.mask-b').html('<a class="btn cancel" href="javascript:;">确定</a>');
                        $('.mask').show()
                    } else {
                        tipBox(o.msg)
                    }
                    m.bindEvent()
                },
                error: function(jqXHR, errorStatus, errorThrown) {
                    tipBox('不小心开小差了，请重试');
                    m.status = true
                }
            })
        },
        priceFormat: function(val) {
            var arr = val.toString().split('.');
            return '<b>' + arr[0] + '</b>.' + (arr[1] || '00')
        },
        item: '<li><a href="%s">                        <div class="picBox">                            <img class="img" data-original="%s" src="//i0.ulecdn.com/ulewap/i/290x290x2x.png"/>                        </div>                        <div class="nameBox">%s</div>                        <div class="buyBox">                            <p class="price">￥<span class="price-min">%s</span></p>                            <p class="btn-buy">立即<br>购买</p>                        </div>                    </a></li>',
        getList: function(key) {
            var m = this;
            var errorHandle = function() {};
            var successHandle = function(res) {
                for (var k in res) {
                    var items = '';
                    var data = res[k];
                    var clientType = $.browser.wx ? '?client_type=wx_ule' : '';
                    var tarContainer = '';
                    if (k.indexOf('hot') > 0) {
                        tarContainer = 'shopContainer01'
                    } else if (k.indexOf('overvalue') > 0) {
                        tarContainer = 'shopContainer02'
                    } else if (k.indexOf('more') > 0) {
                        tarContainer = 'shopContainer03'
                    }
                    if (!data) {
                        $('#' + tarContainer).hide();
                        continue
                    }
                    if (uleUrl === "beta.ule.com") {
                        data.length = 4
                    }
                    for (var i = 0, len = data.length; i < len; i++) {
                        var value = data[i];
                        var isSoldOut = Number(value.inStock);
                        var itemUrl = shopUrl + value.listingId + clientType;
                        var imgUrl = value.imgUrl.replace(/^http(s)?:/, '');
                        var minPrice = m.priceFormat(value.minPrice);
                        items += m.sprintf(m.item, itemUrl, imgUrl, value.listingName, minPrice)
                    }
                    $('#' + tarContainer + ' .list').html('<ul class="ul-style clearfix">' + items + '</ul>');
                    $(".img").picLazyLoad({
                        effect: "fadeIn",
                        threshold: 420
                    })
                }
            };
            $.ajax({
                url: m.api.getPrdsUrl,
                type: 'get',
                timeout: 10000,
                data: {
                    moduleKeys: key
                },
                dataType: 'jsonp',
                jsonp: "jsonApiCallback",
                jsonpCallback: "jsonp0",
                cache: true,
                headers: {
                    "Accept-Encoding": "gzip,deflate"
                },
                success: function(obj) {
                    successHandle(obj)
                },
                error: function() {
                    errorHandle()
                }
            })
        },
        item_store: '<li class="storeItem"><a href="%s">                            <img class="img" data-original="%s" src="//i0.ulecdn.com/ulewap/i/290x290x2x.png" width="100%" />                        </a></li>',
        getStore: function(key) {
            var m = this;
            var errorHandle = function() {};
            var successHandle = function(res) {
                for (var k in res) {
                    var items = '';
                    var data = res[k];
                    for (var i = 0, len = data.length; i < len; i++) {
                        var value = data[i];
                        var link = value.link;
                        var linkArr = link.sliceAfter('?').split('&');
                        var storeId = linkArr[0].split('=')[1];
                        var arr = value.title.split(' ');
                        var src = '';
                        if (storeId == 'index') {
                            storeId = value.link.replace(/[^0-9]/ig, '')
                        }
                        if ($.browser.ule) {
                            src = storeUrl + storeId + '_' + encodeURI(arr[0])
                        } else {
                            src = storeUrl + storeId
                        }
                        value["imgUrl"] = value["imgUrl"].replace(/http:/, "");
                        items += m.sprintf(m.item_store, link, value["imgUrl"])
                    }
                    $('#storeContainer .list').html('<ul class="ul-style clearfix">' + items + '</ul>');
                    $(".img").lazyload({
                        effect: "fadeIn",
                        threshold: 420
                    })
                }
            };
            $.ajax({
                url: '//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2002',
                type: 'get',
                timeout: 10000,
                data: {
                    sectionKeys: key
                },
                dataType: 'jsonp',
                jsonp: "jsonApiCallback",
                jsonpCallback: "jsonApiCallback0",
                cache: true,
                headers: {
                    "Accept-Encoding": "gzip,deflate"
                },
                success: function(obj) {
                    successHandle(obj)
                },
                error: function() {
                    errorHandle()
                }
            })
        },
        sprintf: function() {
            var str = arguments[0] || '';
            for (var i = 1, len = arguments.length; i < len; i++) {
                str = str.replace(/%s/, arguments[i])
            }
            return str
        }
    };
    AnhuiShoppingDay.init()
});