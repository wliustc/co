/**
 * author:wushain
 * 常用函数扩展++
 */
(function($) {
    "use strict";
    /**
     * 过渡结束回调
     */
    $.fn.transitionEnd = function(callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, dom = this;

        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
    
    /**
     * 判断是否支持touch事件
     */
    $.support = (function() {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    /**
     * 如果支持Touch事件，那么定义touch事件
     */
    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    /**
     * 获取当前坐标位置
     */
    $.getTouchPosition = function(e) {
        e = e.originalEvent || e;
        if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
            return {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            };
        } else {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
    };

    /**
     * 元素的实际高度,非滚动高度
     */
    $.fn.scrollHeight = function() {
        return this[0].scrollHeight;
    };

    /**
     * JS 定义2D，3D转换
     * @param {String} transform css3 2d或者3d转换参数
     */
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    };
    
    /**
     * JS 定义过渡
     * @param {String} duration 时间+单位
     */
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };

    /**
     * 获取dom元素的x,y偏移量
     * @param {dom} el dom元素
     * @param {String} axis x或者y
     */
    $.getTranslate = function(el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };

    /**
     * 跟setTimeout/setInterval差不多，通过递归调用同一方法来不断更新画面以达到动画效果
     */
    $.requestAnimationFrame = function(callback) {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else {
            return window.setTimeout(callback, 1000 / 60);
        }
    };

    /**
     * 取消requestAnimationFrame中的回调函数
     * 用法：myReq = requestAnimationFrame(step);window.cancelAnimationFrame(myReq);
     */
    $.cancelAnimationFrame = function(id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else {
            return window.clearTimeout(id);
        }
    };

    /**
     * ************************************* 华丽的分割线 *************************************
     * author:wushain
     * ule更新扩展++
     */
    $.extend($, {
        /**
         * 根据判断获取跳转路径
         */
        jumpPath: function(name, id) {
            !name && $.alert("jumpPath: You must fill in the name");
            !id && $.alert("jumpPath: You must fill in the ID");
            //定义跳转到shop页面和store
            var shopUrl = '//m.ule.com/item/detail/',
                storeUrl = '//m.ule.com/store/index/',
                goodsLinkUrl = '';
            if ($.browser.ule) {
                shopUrl = 'uleMobile://uleVi_';
                storeUrl = 'ulemobile://uleStore_';
            }
            if ($.browser.wx) {
                goodsLinkUrl = shopUrl + id + '?client_type=wx_ule';
            } else {
                goodsLinkUrl = shopUrl + id;
            }
            if (name == 'goods') {
                return goodsLinkUrl
            } else if (name == 'store') {
                return storeUrl
            } else {
                console.log('nothing')
            }
        },

        /**
         * 返回图片路径
         */
        imgPath: function() {
            var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
            return uleUrl
        },

        /**
         * 数据分离
         * @param {any} arr 
         */
        separateArr: function(arr) {
            !arr && $.alert("separateArr: You must fill in the arr");
            var separateArr = [],
                tempArr = [];
            arr.forEach(function(element) {
                tempArr.push(element.sectionId)
            });
            tempArr = tempArr.unique()
            tempArr.forEach(function(element2, i) {
                separateArr[i] = []
            })
            arr.forEach(function(element) {
                tempArr.forEach(function(element2, i) {
                    if (element2 == element.sectionId) {
                        separateArr[i].push(element)
                    }
                })
            });
            return separateArr;
        }

    })
})($);