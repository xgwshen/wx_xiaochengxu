//获取应用实例
var app = getApp()
Page({
  data:{
    search:'',
    hotname:'',
    aa:true,
    gets:'',
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=index/tuijian',
        success:function(res)
        { 
          console.log(res);
            that.setData({
              search:res.data.productlist,
              hotname:res.data.hotname
            })
        }
    })

  },
  sotolist:function(e){
     var goods_name = e.currentTarget.dataset.name
     wx.redirectTo({
      url: '../list/list?goods_name='+goods_name
    })
  },
  getinfo:function(event){
    //进入商品详情
    //console.log(event);
    wx.navigateTo({
      url: '../list/info?goods_id='+event.currentTarget.dataset.goods_id
    })
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  toastHide: function (event) {
    this.setData({ aa: true })
  },
  formSubmit:function(event){
     console.log(event);
     var goods_name=event.detail.value.goods_name;
     if (goods_name) {
       wx.redirectTo({
         url: '../list/list?goods_name=' + goods_name
       })
     }else{
        this.setData({
          aa:false,
          gets:'请输入商品名称'
        })
     }

  }
})