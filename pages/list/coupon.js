var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data:{
    userfav:'',
    classs:1,
    status:true,
    allprice:0
  },
  onLoad: function (event) {
    var that = this
    console.log(event);
    that.setData({
      allprice: parseFloat(event.allprice)
    })
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=Mycenter/favorable',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          userfav: res.data.userfav,
          status: res.data.status
        })
      }
    })
  },
  favs:function(event){
    var favoraprice = event.currentTarget.dataset.favoraprice
    var favoraid    = event.currentTarget.dataset.id
    console.log(event);
     var pages = getCurrentPages();
     var prevPage = pages[pages.length - 2];
     prevPage.setData({
       favoraprice: favoraprice,
       favoraid: favoraid,//使用的优惠id
     })
     wx.navigateBack({ delta: 1 })
  }
 /**
     *
     * var prevPage = pages[pages.length - 2];  //上一个页面
//直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    */
})