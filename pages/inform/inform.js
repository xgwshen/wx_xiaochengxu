var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    articles: {},
    status:''
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=index/articlesinfo',
      data:{
        sessioninfo: util.getcache('reuserinfo'),
        id: options.id,
      } ,
      success: function (res) {
        console.log(res.data);
        that.setData({
          articles: res.data.info,
          status:res.data.status
        })
        WxParse.wxParse('content', 'html', res.data.info.content, that, 5);
      }
    })
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