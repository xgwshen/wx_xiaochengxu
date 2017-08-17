var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    orderlist:1,
    prcurl:'',
    classs:0,
    aa:true,
    gets:'',
    hidden: true
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
      var that = this
      //调用应用实例的方法获取全局数据
      if (!util.getcache('reuserinfo')) {
        wx.showModal({
          title: "提示", content: "信息获取失败，请检查网络或返回刷新重进"
        })
      } else {
        that.loadingChange();
        var a = options.size;
        console.log(options);
        if (a!='')
          var statu = a;
        else
          var statu =  0;
        wx.request({
          url: app.globalData.httpsurl +'public/index.php?s=order/orderlist',
          data: {
              sessioninfo:util.getcache('reuserinfo'),
              statu: statu
            },
          success:function(res){
            console.log(res.data);
            that.setData({
              orderlist:res.data.order,
              prcurl:res.data.prcurl,
              classs: statu,
              hidden: true
            })
          }
        })
      }
  },
  loadingChange: function () {
    var that = this;
    that.setData({ hidden: !this.data.hidden})
    setTimeout(function () {
      that.setData({
        hidden: true
      });
      //that.update();
    }, 3000);
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    //this.onLoad();
  },
  //切换
  statusTab:function(event){
    //
      var that = this
      wx.request({
        url: app.globalData.httpsurl +'public/index.php?s=order/orderlist',
        data: {
            sessioninfo:util.getcache('reuserinfo'),
            statu:event.currentTarget.dataset.size
          },
        success:function(res){
          console.log(res.data);
          that.setData({
             orderlist:res.data.order,
             prcurl:res.data.prcurl,
             classs:event.currentTarget.dataset.size
          })
        }
      })
  },
  //调用物流
  express:function(event){
    var that = this
    var order_id = event.currentTarget.dataset.order_id
      wx.navigateTo({
        //wx.setStorageSync('buygoods', res.data);
        url: '../orderlist/express?order_id='+order_id
      })
  },
  //确认收货
  affirm:function(event){
    console.log(event);
      var that = this
      var i = event.currentTarget.dataset.index
      wx.request({
        url: app.globalData.httpsurl +'public/index.php?s=order/affirmput',
        data: {
            sessioninfo:util.getcache('reuserinfo'),
            order_id:event.currentTarget.dataset.order_id
          },
        success:function(res){
          console.log(res.data);
          if(res.data.status)
          {//orderstatus
            var keyval = "orderlist["+i+"].orderstatus";
            var param = {};
            param[keyval] = 3;
            that.setData(param);
            console.log(that.data.orderlist);
            that.setData({
              aa: false,
              gets: '确认成功！'
            })
            //跳转到 订单详情页
            var id = event.currentTarget.dataset.order_id
              wx.navigateTo({
                url: '../orderlist/orderinfo?order_id=' + id
              })
          }
        }
      })
  },
  //取消订单
  cancel:function(event)
  {
    var that = this
    var i = event.currentTarget.dataset.index
    var order_id = event.currentTarget.dataset.order_id
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/cancel',
        data: {
            sessioninfo:util.getcache('reuserinfo'),
            order_id:event.currentTarget.dataset.order_id
          },
        success:function(res){
          console.log(res.data);
          if(res.data.status)
          {//orderstatus
            wx.request({
              url: app.globalData.httpsurl +'public/index.php?s=order/orderlist',
              data: {
                  sessioninfo:util.getcache('reuserinfo'),
                  statu: 6
                },
              success:function(res){
                console.log(res.data);
                that.setData({
                  orderlist:res.data.order,
                })
              }
            })
          }
        }
      })
  },
  /**
   * 查看订单详情
  */
  orderinfo:function(event){
      var id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: '../orderlist/orderinfo?order_id=' + id
      })
  },
  //立即支付
  getaffirm:function(event){
    var that = this
    var order_id = event.currentTarget.dataset.order
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/againpay',
        data: {
          order_id:order_id,
          sessioninfo:util.getcache('reuserinfo')
        },
        success:function(res)
        {
          console.log(res.data);
          if(res.data.return_code=="SUCCESS"){
            //var reorderid = order_id;
              wx.requestPayment({ 
                'timeStamp': ""+res.data.timeStamp, 
                'nonceStr': ""+res.data.nonceStr, 
                'package': ""+res.data.package, 
                'signType': ""+res.data.signType,
                'paySign': ""+res.data.paySign, 
                'success':function(res){
                  wx.request({
                    url: app.globalData.httpsurl +'public/index.php?s=order/ordersutus',
                      data: {
                        sessioninfo:util.getcache('reuserinfo'),
                        orderid: order_id
                      },
                      success:function(res)
                      {//status
                        console.log(res)
                          if(res.data.status)
                          {
                             that.setData({
                                  aa:false,
                                  gets:'购买成功'
                              }),
                              wx.redirectTo({
                                url: '../common/common'
                              })
                          }else{
                             console.log('订单状态修改失败');
                             that.setData({
                                  aa:false,
                                  gets:'订单状态修改失败'
                              })
                          }
                      }
                  })

                  }, 
                'fail':function(res){ 
                    console.log('失败');
                    console.log(res);
                      //提示支付失败
                      that.setData({
                          aa:false,
                          gets:'提示支付失败'
                      })
                }  
              });
          }else{
             console.log(res);
             //统一下单调用失败
             that.setData({
                aa:false,
                gets:res.data.remass?res.data.remass:'统一下单调用失败'
            })
          }
        }
    })
  },
  //点击去评价
  eval:function(event){
    var order_id = event.currentTarget.dataset.order_id
      wx.navigateTo({
        //wx.setStorageSync('buygoods', res.data);
        url: '../orderlist/evaluate?order_id='+order_id
      })
  },
  toastHide:function(event){
      this.setData({aa:true})
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})
