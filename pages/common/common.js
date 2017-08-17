Page({
  data:{
    messge:''
  },
  onLoad:function(options){
    var that = this;
    
    // 生命周期函数--监听页面加载
      that.setData({
        messge: options.messge
      })
      console.log(that.data.messge);
    setTimeout(function () { 
      that.tiaozhuan(options); 
        }, 1000);
  },
  tiaozhuan: function (options){
    wx.redirectTo({
      //url: '../orderlist/orderlist?size=2'
      url: options.urls,

    })
  }
  ,
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})