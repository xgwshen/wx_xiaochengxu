// pages/product/info.js
var app = getApp()
Page({
  data:{
    articles:{},
    imgurl:'',
    classid:1
  },
  onLoad:function(options){
    var that = this
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=index/articles',
      success:function(res){
        console.log(res.data);
        that.setData({
          articles: res.data.article,
          imgurl: res.data.imgurl,
          content:res.data.content
        })
      }
    })
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    this.onLoad();
  },
  toinfo:function(event){
    wx.navigateTo({
      url: '../inform/inform?id=' + event.currentTarget.dataset.id
    })
  },
  information:function(event){
    var that = this
    var classid = event.currentTarget.dataset.id;
    //根据需求调消息
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=index/articles',
      data:{
        cid:classid
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          articles: res.data.article,
          imgurl: res.data.imgurl,
          classid: classid
        })
      }
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