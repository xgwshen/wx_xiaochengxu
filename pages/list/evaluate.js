var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data:{
    evaluate:'',
    classs:1,
    status:true,
    url:'',
    goal:{}
  },
  onLoad: function (event) {
    var that = this
    console.log(event);
    var goods_id = event.goods_id
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=product/allevaluate',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        goods_id: goods_id
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.status){

          for (var i = 0; i < res.data.evaluate.length; i++) {
            var a = res.data.evaluate[i].nkname.charAt(res.data.evaluate[i].nkname.length - 1);
            res.data.evaluate[i].nkname = a;
          }
        }
        
        that.setData({
          evaluate: res.data.evaluate,
          url: res.data.evalurl,
          status: res.data.status
        })
        
      }
    })
  }
})