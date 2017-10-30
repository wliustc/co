 //string原型扩展
 $.extend(String.prototype, {
     //method
     trim: function() {
         return this.replace(/(^\s*)|(\s*$)/g, '');
     },
     sliceAfter: function(str) {
         return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : '';
     },
     sliceBefore: function(str) {
         return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : '';
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
     getQueryJson: function() {
         if (this.indexOf('?') < 0) return {};
         var query = this.substr(this.indexOf('?') + 1),
             params = query.split('&'),
             len = params.length,
             result = {},
             key,
             value,
             item,
             param;
         for (var i = 0; i < len; i++) {
             param = params[i].split('=');
             key = param[0];
             value = param[1];
             item = result[key];
             if ('undefined' == typeof item) {
                 result[key] = value;
             } else if (Object.prototype.toString.call(item) == '[object Array]') {
                 item.push(value);
             } else {
                 result[key] = [item, value];
             }
         }
         return result;
     }
 });
 // 浏览器环境判断
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
                 ylxd: false
             };
         } else {
             var uappType = {
                 ule: false,
                 ylxd: true
             };
         }
         var appobj = $.extend({
             ios: os == 'ios',
             android: os == 'android',
             version: version
         }, uappType);
         return appobj;
     } else if (ua.indexOf('ulxdapp/') > 0) {
         version = ua.sliceAfter('ulxdapp/').split('_')[3];
         os = ua.sliceAfter('ulxdapp/').sliceBefore('_');
         return {
             ylxd: true,
             wx: false,
             ios: os == 'ios',
             android: os == 'android',
             version: version
         };
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
 if ($.browser.ule) {
     shopUrl = 'uleMobile://uleVi_';
     storeUrl = 'ulemobile://uleStore_';
 };
 // alert提示层
 var _tip, tID;
 $('<div class="wrapper"></div>').appendTo('body');
 var tipBox = function(msg) {
     if (!msg) return;
     $('.load-wrapper').hide();
     _tip && _tip.remove() && clearTimeout(tID);
     _tip = $('<div class="tips_overlay">' +
         '<div class="tipBox">' +
         '<div class="msg"><h2><i></i>' + msg + '</h2></div>' +
         '</div>' +
         '</div>').appendTo(".wrapper");
     setTimeout(function() {
         _tip.addClass('overlay-in');
         _tip.children(".tipBox").addClass('mask-in');

     }, 10);
     tID = setTimeout(function() {
         if (!_tip) return;
         _tip.addClass('overlay-out');
         _tip.children(".tipBox").addClass('mask-out');
         _tip.remove();
         _tip = null;
     }, 2000);
 };
 window.tipBox = tipBox;

 $.extend($.fn, {
     lazyload: function() {
         var oThis = this,
             extend_height = 400;
         // 要加载的图片是不是在指定窗口内
         function inViewport(el) {
             // 当前窗口的顶部
             var top = window.pageYOffset
             // 当前窗口的底部
             var btm = window.pageYOffset + window.innerHeight
             // 元素所在整体页面内的y轴位置
             var elTop = $(el).offset().top;
             // 判断元素，是否在当前窗口，或者当前窗口延伸400像素内
             return elTop >= top && elTop - extend_height <= btm
         }
         // 滚动事件里判断，加载图片
         $(window).bind('scroll', function() {
             $('img.lazy').each(function(index, node) {
                 var $this = $(this)
                 if (!$this.data('src')) {
                     return
                 }
                 if (!inViewport(this)) return
                 $this.attr('src', $this.data('src'));
                 $this.error(function() {
                     $this.attr('src', 'https://i2.ule.com/i/global/noimage_450.jpg');
                 }).removeClass('lazy');
                 console.log('scroll')
             })
         }).trigger('scroll');
     },
     itemRecommond: function(opts) {
         opts = $.extend({
             uleUrl: 'ule.com',
             itemShow: false,
             itemKeys: ['event_btdz_syg'],
             itemClass: ['.item01', '.item02', '.item03'],
             shopShow: false,
             shopKeys: [],
             shopClass: [],
             itemHtml: '',
             container: '.container',
         }, opts)
         var uleUrl = opts.uleUrl;
         var protocol = location.protocol == 'file:' ? 'http:' : location.protocol;
         var uleCdn = uleUrl == 'ule.com' ? 'ulecdn.com' : 'beta.ulecdn.com';
         var uleUrl = uleUrl == 'ule.com' ? 'ule.com' : 'beta.ule.com';
         var shopUrl = '//m.ule.com/item/detail/';
         var storeUrl = '//m.ule.com/store/index/';

         if ($.browser.ule) {
             shopUrl = 'uleMobile://uleVi_';
             storeUrl = 'ulemobile://uleStore_';
         } else if ($.browser.ylxd) {
             shopUrl = '//m.ule.com/item/ylxd/detail/';
         }
         //商品推荐位
         var getList = function(keys) {
             var oThis = this;
             var url = protocol + '//static-content.' + uleCdn + '/mobilead/recommond/dwRecommond.do?restype=2001';
             var data = {
                 moduleKeys: keys
             };
             $.ajax({
                 url: url,
                 type: 'get',
                 data: data,
                 dataType: 'jsonp',
                 jsonp: "jsonApiCallback",
                 jsonpCallback: "jsonApiCallback",
                 cache: true,
                 headers: {
                     'Accept-Encoding': 'gzip,deflate'
                 },
                 success: function(data) {
                     var j = 0;
                     $.each(data, function(key, value) {
                         var _arr = [];
                         var html = opts.itemHtml;
                         for (var i = 0; i < value.length; i++) {
                             value[i].shopUrl = shopUrl;
                             value[i].imgUrl = value[i].imgUrl.replace(/http:/, '');
                             _arr.push(html.substitute(value[i]));
                         }
                         $(opts.itemClass[j++]).html(_arr.join(''));

                     })
                     $(window).lazyload();
                 },
                 error: function(XMLHttpRequest, textStatus, errorThrown) {
                     alert('活动实在是太火爆了，排个队再来！');
                 }
             });
         }
         var initStores = function(keys) {
             var oThis = this
             var data = {
                 sectionKeys: keys
             }
             var url = protocol + "//search.ule.com/api/recommend?restype=2002&jsoncallback=?";
             $.getJSON(url, data, function(o) {
                 var j = 0;
                 $.each(o, function(key, value) {
                     var items = value;
                     var html = '';
                     for (var i = 0; i < items.length; i++) {

                         var item = items[i];
                         var link = item.link;
                         var linkArr = link.split('/');
                         var storeId = linkArr[linkArr.length - 1].split('.')[0];
                         if (storeId.indexOf('-') != -1) {
                             storeId = storeId.slice(0, storeId.indexOf('-'));
                         }
                         var arr = item.title.split(' ');
                         var src = storeUrl + storeId;
                         if ($.browser.ule) {
                             src += '_' + encodeURIComponent(item.title);
                         }

                         html += '<li class="item col-2">' +
                             '<a class="product-pic" href="' + src + '"><img src="' + item["imgUrl"] + '" /></a>' +
                             '</li>';
                     }
                     $(opts.shopClass[j++]).html(html);
                 })

             });

         }
         opts.itemShow && getList(opts.itemKeys.join(','));
         opts.shopShow && initStores(opts.shopKeys.join(','));
     }
 })