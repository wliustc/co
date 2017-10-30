uleUrl = 'ule.com';
$(function() {
    sharelid = '';
    shareFlag = false;
    shareMsCode = '';

    window.afterShare = function() {

        location.href = 'https://service.' + uleUrl + '/seckill/item/detailYlxd/' + sharelid + '/' + shareMsCode + '?uleNeedNativeTitle=false&client_type=app_ylxd';
    }
    // alert提示层
    var _tip, tID;
    $('<div class="wrapper"></div>').appendTo("body");
    var tipBox = function(msg) {
        if (!msg) return;
        _tip && _tip.remove() && clearTimeout(tID);
        $('.load-wrapper').hide();
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
    var ylxd919 = {
        api: {
            queryQualification: 'https://vps.' + uleUrl + '/yzgApiWAR/ylxd/user/judgeYlxdActivity.do?jsoncallback=?'
        },
        lid: '',
        afterShareFlag: '',
        userId: '',
        curApp: 'ylxd',
        init: function() {
            this.getUserId();
            this.bindEvent();

        },
        /**
         * 查询活动资格
         * @return {[type]} [description]
         */
        queryQualification: function(code) {
            var oThis = this;
            // var o = {
            //     "returnCode": "0000",
            //     "returnMessage": "操作成功",
            //     "data": {
            //         "userFlag": 0,
            //         "qualityFlag": 0,
            //         "useQualityFlag": 0,
            //         "shareFlag": 0,
            //         "userOnlyId": "10000000391"
            //     }
            // }


            $.getJSON(oThis.api.queryQualification, {
                'activityCode': code,
                'clientCallType': 'H5'
            }, function(o) {
                if (o.returnCode == '0000') {
                    shareFlag = false;
                    $('.load-wrapper').hide();
                    if (o.data.userFlag == '1') {
                        //新用户
                        if (o.data.useQualityFlag == '0') {
                            //资格没使用
                            if (o.data.shareFlag == '1') {
                                //已分享-可秒杀
                                // 跳vi页
                                sharelid = oThis.lid;
                                sharelid = oThis.channelCode;
                                oThis.afterShareFlag = '####needCallAfterShare';
                                location.href = 'https://service.' + uleUrl + '/seckill/item/detailYlxd/' + oThis.lid + '/' + oThis.channelCode + '?uleNeedNativeTitle=false&client_type=app_ylxd';
                            } else {
                                //未分享-提示分享
                                oThis.afterShareFlag = '####needCallAfterShare';
                                $('.popBox .subinfo').html('分享商品返回APP<br/>即可参与抢购<br/>商品售出还能获得收益');
                                $('.popBox').show();
                            }
                            shareFlag = true;
                        } else {
                            //提示邀请好友
                            $('.popBox .subinfo').html('您已使用了抢购资格！<br/>抢购规则请查看活动详情<br>分享邮乐爽11，好友下单得收益！');
                            $('.popBox').show();
                        }
                    } else {
                        //老用户-提示分享9.9购买的活动购买商品
                        $('.popBox .subinfo').html('很遗憾，<br>仅限新用户抢购，<br/>分享邮乐爽11，好友下单得收益！');
                        $('.popBox').show();
                    }
                } else {
                    tipBox(o.returnMessage);
                }
            })
        },
        /**
         *  获取商品分享连接
         */
        shareListingURL: function(callback) {
            var oThis = this;
            // var infoObj = yxdListingDetail || {};
            var obj = {
                "shareChannel": "1", // 分享渠道 0：PC、1：APP
                "shareFrom": "0", // 分享来源 0：我的收藏、1：天天推荐、2：邮政推荐 
                "content": '',
                "listInfo": [{
                    "frameId": "",
                    "content": "",
                    "sharePrice": oThis.sharePrice,
                    "marketPrice": '',
                    "activityCode": ms_code,
                    "listId": oThis.lid
                }]
            }
            $.ajax({
                type: "get",
                dataType: "jsonp",
                jsonp: "jsoncallback",
                url: '//vps.' + uleUrl + '/yzgApiWAR/ylxd/item/shareListingURL.do',
                data: {
                    "activityCode": oThis.channelCode,
                    'clientCallType': 'H5',
                    'data': JSON.stringify(obj)
                },
                success: function(obj) {
                    if (obj.returnCode == '0000') {
                        //   oThis.shareId = obj.data.shareId;

                        callback && callback.call(oThis);
                    }
                }
            })
        },
        AppShareWX: function() {
            var oThis = this;
            oThis.shareimgUrl = 'https://pic.ule.com/item/user_0102/desc20170821/8e34a1486aa110ef_-1x-1.jpg';
            oThis.shareUrl = 'https://www.' + uleUrl + '/app/yxd/2017/1111/recommend/index.html' + '?storeid=' + oThis.userId + '&adid=' + oThis.curApp + 'fx_merchant';
            oThis.sharetitle = '我在邮乐小店发现这些好东西，推荐你来一起看看！';
            oThis.sharecontent = '打开链接即可购买！精选商品，特色农品触手可及！';
            oThis.secTitle = oThis.sharecontent;
            // oThis.secTitle = oThis.sharetitle;
            window.location.href = "uleMobile://uleShare_" + encodeURI(oThis.sharetitle.replace(/%/, '')) + "##" + encodeURI(oThis.sharecontent) + "##" + oThis.shareimgUrl + "##" + oThis.shareUrl + oThis.afterShareFlag;

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
                    oThis.shareimgUrl = 'https://i0.' + uleUrl + '/app/yxd/i/2017/0919/919share_icon.jpg';
                    oThis.shareUrl = 'https://www.' + uleUrl + '/app/yxd/2017/1111/recommend/index.html' + '?storeid=' + oThis.userId + '&adid=' + oThis.curApp + 'fx_merchant';
                    callback && callback.apply(oThis);
                },
                error: function(jqXHR, errorStatus, errorThrown) {
                    tipBox('请求服务失败');
                }
            });
        },
        bindEvent: function() {
            var oThis = this;
            //兑换
            $('.wrapUl').on('click', '.col-2', function() {
                $('.load-wrapper').show();
                sharelid = oThis.lid = $(this).data('id') + '';
                oThis.sharePrice = $(this).data('price') + '';
                shareMsCode = oThis.channelCode = $(this).data('code') + '';


                oThis.queryQualification(oThis.channelCode);
            })
            $('.popBox .close').click(function() {
                $('.popBox').hide();
            })
            $('.rule-btn').click(function() {
                $('.ruleBox').show();
            })
            $('.ruleBox .close').click(function() {
                $('.ruleBox').hide();
            })
            //取消分享
            $('.cancle').click(function() {
                $('.popBox').hide();
            })
            //分享
            $('.share-btn').click(function() {
                $('.popBox').hide();
                oThis.shareListingURL(oThis.AppShareWX);
            })

        }
    }
    ylxd919.init();
})