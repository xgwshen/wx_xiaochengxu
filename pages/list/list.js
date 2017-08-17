//product/index.js
var app = getApp();
Page({
  data: {
    productlist:{},
    showView:true,
    sort:'all',
    cid:'',
    goods_name:'',
    zhongsort:'综合排序'
  },
  onLoad: function (event) {
    console.log(event)
    console.log(1);
    var that = this
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=product/productlist',
        data:{
          goods_name:event.goods_name
        },
        success:function(res)
        {
          console.log(res.data);
            that.setData({
              productlist:res.data,
              cid: event.cid,
              goods_name: event.goods_name
          })
        }
    })
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    this.onLoad();
  },
  getinfo:function(event){
    wx.navigateTo({
      url: 'info?goods_id='+event.currentTarget.dataset.goods_id
    })
  },
  sortshow:function(){
    var that=this;
    that.setData({
      showView:(!that.data.showView)
    })
  },
  sort:function(event){
    console.log(event);
    var that=this;
    that.setData({
      sort: event.currentTarget.dataset.size,
      zhongsort: event.currentTarget.dataset.zhong
    })
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=index/search',
      data: {
        cid: that.data.cid,
        goods_name: that.data.goods_name,
        size: event.currentTarget.dataset.size
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          productlist: res.data,
          showView: (!that.data.showView)
        })
      }
    })
  },

  tososo:function(){
    wx.navigateTo({
      url: '../soso/soso'
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
