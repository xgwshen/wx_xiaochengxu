var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/star.png',
    selectedSrc: '../../images/star_select.png',
    tempFilePaths: '',
    orderproduct:'',
    orderid:'',//订单id
    prcurl:'',
    fileprc: app.globalData.httpsurl +'public/uploads/',
    logisticResult:'',
    val:'',
    count:'',
    LogisticCode:'',
    State:'',
    shipname:'',
  },
  onLoad:function(options){
     var that = this
      wx.request({
        url: app.globalData.httpsurl +'public/index.php?s=kdapisearch/index',
        data: {
            orderid:options.order_id
          },
        success:function(res){
          
          console.log(res.data);
           if(res.data.Success){
              that.setData({
                val:1,  
                logisticResult:res.data.Traces,
                count: res.data.count,
                shipname: res.data.shipname,
                LogisticCode: res.data.LogisticCode
              })
              if (res.data.State==0){
                that.setData({
                  State:'未处理'
                })
              } else if (res.data.State == 1) {
                that.setData({
                  State: '已发货'
                })
              } else if (res.data.State == 2) {
                that.setData({
                  State: '已发货'
                })
              } else if (res.data.State == 3) {
                that.setData({
                  State: '已签收'
                })
              } else if (res.data.State == 4) {
                that.setData({
                  State: '已取消'
                })
              } else if (res.data.State == 5) {
                that.setData({
                  State: '已评价'
                })
              }
           }else{
              that.setData({
                logisticResult:'该单号没有物流信息！',
                val:0
              })
          }
          /**
           * 推荐商品
          */
            wx.request({
              url: app.globalData.httpsurl +'public/index.php?s=index/tuijian',
              success: function (res) {
                console.log(res);
                that.setData({
                  search: res.data.productlist,
                })
              }
           })
        }
    })
  },
  getinfo: function (event) {
    //进入商品详情
    //console.log(event);
    wx.navigateTo({
      url: '../list/info?goods_id=' + event.currentTarget.dataset.goods_id
    })
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