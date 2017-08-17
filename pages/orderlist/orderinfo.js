var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    orderproduct: '',
    orderid: '',//订单id
    prcurl: '',
    fileprc: app.globalData.httpsurl +'public/uploads/',
    allinfo:{},
    logisticResult:{},
    fatime:'',
    shipname:''
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    // 生命周期函数--监听页面加载
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/orderinfo',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        id: options.order_id
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          orderproduct: res.data.product,
          prcurl: res.data.prcurl,
          allinfo: res.data.allinfo,
          fatime: res.data.fatime
        })
          wx.request({
            url: app.globalData.httpsurl +'public/index.php?s=kdapisearch/index',
            data: {
              orderid: that.data.allinfo.orderid
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.Success) {
                that.setData({
                  logisticResult: res.data.Traces[0],
                  shipname: res.data.shipname
                })
              } else {
                that.setData({
                  logisticResult: '',
                })
              }
            }
          })
      }
    })
  }
  ,
  //调用物流
  express: function (event) {
    var that = this
    var order_id = event.currentTarget.dataset.order_id
    wx.navigateTo({
      //wx.setStorageSync('buygoods', res.data);
      url: '../orderlist/express?order_id=' + order_id
    })
  },
  //确认收货
  affirm: function (event) {
    console.log(event);
    var that = this
    var i = event.currentTarget.dataset.index
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/affirmput',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        order_id: event.currentTarget.dataset.order_id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status) {//orderstatus
          var keyval = "orderlist[" + i + "].orderstatus";
          var param = {};
          param[keyval] = 3;
          that.setData(param);
          console.log(that.data.orderlist);
          that.setData({
            aa: false,
            gets: '确认成功！'
          })
          //跳转到 订单详情页

        }
      }
    })
  },
  //取消订单
  cancel: function (event) {
    var that = this
    var i = event.currentTarget.dataset.index
    var order_id = event.currentTarget.dataset.order_id
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/cancel',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        order_id: event.currentTarget.dataset.order_id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status) {//orderstatus
          wx.request({
            url: app.globalData.httpsurl +'public/index.php?s=order/orderlist',
            data: {
              sessioninfo: util.getcache('reuserinfo')
            },
            success: function (res) {
              that.setData({
                aa: false,
                gets: '取消成功'
              }),
              wx.navigateBack({ delta: 1 })
            }
          })
        }
      }
    })
  },
  //立即支付
  getaffirm: function (event) {
    var that = this
    var order_id = event.currentTarget.dataset.order
    var messge = '恭喜您购买成功！感谢您的购买~，期待您的再次光临';
    var urls = '../orderlist/orderlist?size=2';
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/againpay',
      data: {
        order_id: order_id,
        sessioninfo: util.getcache('reuserinfo')
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.return_code == "SUCCESS") {
          //var reorderid = order_id;
          wx.requestPayment({
            'timeStamp': "" + res.data.timeStamp,
            'nonceStr': "" + res.data.nonceStr,
            'package': "" + res.data.package,
            'signType': "" + res.data.signType,
            'paySign': "" + res.data.paySign,
            'success': function (res) {
              wx.request({
                url: app.globalData.httpsurl +'public/index.php?s=order/ordersutus',
                data: {
                  sessioninfo: util.getcache('reuserinfo'),
                  orderid: order_id
                },
                success: function (res) {//status
                  console.log(res)
                  if (res.data.status) {
                      wx.redirectTo({
                       url: '../common/common?mssge=' + messge + '&urls=' + urls,
                      })
                  } else {
                    console.log('订单状态修改失败');
                    wx.showModal({
                      title: "提示", content: "订单状态修改失败，请截图联系客服！"
                    })
                  }
                }
              })

            },
            'fail': function (res) {
              console.log('失败');
              console.log(res);
              //提示支付失败
              that.setData({
                aa: false,
                gets: '支付失败'
              })
            }
          });
        } else {
          console.log(res);
          //统一下单调用失败
          wx.showModal({
            title: "提示", content: res.data.remass ? res.data.remass : '统一下单调用失败，请核对您的购买信息！'
          })
        }
      }
    })
  },
  //点击去评价
  eval: function (event) {
    var order_id = event.currentTarget.dataset.order_id
    wx.navigateTo({
      //wx.setStorageSync('buygoods', res.data);
      url: '../orderlist/evaluate?order_id=' + order_id
    })
  },
  // 点击去详情
  toInfo: function (event){
    wx.navigateTo({
      url: '../list/info?goods_id=' + event.currentTarget.dataset.goods_id
    })
  },
  toastHide: function (event) {
    this.setData({ aa: true })
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})