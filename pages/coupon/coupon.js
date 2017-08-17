var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data:{
    userfav:1,
    classs:1,
    status:true,
    hidden: true
  },
  onLoad: function () {
    var that = this
    if (!util.getcache('reuserinfo')) {
      wx.showModal({
        title: "提示", content: "信息获取失败，请检查网络或返回刷新重进"
      })
    } else {
      that.loadingChange();
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=Mycenter/favorable',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          userfav: res.data.userfav,
          hidden: true,
          status: res.data.status
        })
      }
    })
    }
  },
  loadingChange: function () {
    var that = this;
    that.setData({ hidden: !this.data.hidden })
    setTimeout(function () {
      that.setData({
        hidden: true
      });
      //that.update();
    }, 3000);
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    this.onLoad();
  },
  //切换
  statusTab: function (event) {
    //
    console.log(event);
    var that = this
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=Mycenter/favorable',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        statu: event.currentTarget.dataset.size
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          userfav: res.data.userfav,
          classs: event.currentTarget.dataset.size,
          status: res.data.status
        })
      }
    })
  },
})