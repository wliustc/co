(function($) {
    "use strict";
    /**
     * jquery懒加载
     * author: wushain
     * time: 2016/4/7
     * @param {$} dom                   懒加载的jq节点
     * @param {Number} distance         滚动超过dom多少距离再执行懒加载
     */
    var setOptions = function(options) {
        var defaults = {
            dom: '.lazybox',
            distance: 100
        };
        return $.extend(defaults, options)
    }
    $.extend($, {
        lazyboxShow: function(options) {
            var opts = setOptions(options)
            // 初始化隐藏数据块儿
            $(opts.dom).css({
                display: 'none'
            })
            $(opts.dom).each(function(index, element) {
                var w = $(element).width()
                var b = $(element).css('float')
                var p = $(element).css('padding')
                var m = $(element).css('margin')
                var $newlazyBox = $("<div style='padding:10px'><div class='newlazyBox' style='width:"+ w +"px;float:"+ b +";height:30px;background:#eeedeb;padding:"+ p +";margin-top:10px;'></div></div>");
                $(element).after($newlazyBox)
            })
        },
        lazyboxHide: function(options){
            var opts = setOptions(options)
            $(opts.dom).css({
                display: 'block'
            })
            $('.newlazyBox').css({
                display: 'none'
            })
        }
    })
})($);