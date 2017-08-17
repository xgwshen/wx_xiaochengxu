//index.js
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    alldata:{},
    scrollTop:0,
    aa:true,
    pro_imgurl:'',
    imgurl:'',
    gets:''
  },
   goTop: function(e){
    this.setData({
        scrollTop:0
    })
   },
   scroll:function(e,res){
      // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
      if(e.detail.scrollTop > 100){
          this.setData({
              floorstatus: true
          });
      }else {
          this.setData({
              floorstatus: false
          });
      }
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=index/index',
      success:function(res){
        console.log(res.data);
        that.setData({
          alldata:res.data,
          pro_imgurl:res.data.pro_imgurl,
          imgurl:res.data.imgurl
        })
      }
    })
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    this.onLoad();
  },
  coupons:function(event){
    console.log(event);
    var that = this;
    if (!util.getcache('reuserinfo')) {
      wx.showModal({
        title: "提示", content: "信息获取失败，请检查网络或返回刷新重进"
      })
    }else {
      // classify_id(首页传来的优惠券的classify_id) 、fav_id(首页传来的优惠券的fav_id) 、sessioninfo（登录后返回的json）
      var that = this;
      wx.request({
        url: app.globalData.httpsurl +'public/index.php?s=index/getfavorablelist',
        data:{
          classify_id:event.currentTarget.dataset.classify_id,
          fav_id:event.currentTarget.dataset.fav_id,
          sessioninfo:util.getcache('reuserinfo')
        },
        success:function(res){
          console.log(res.data);
            if(res.data.status){
              that.setData({
                aa:false,
                gets:'领取成功'
              })
            }else{
              if(res.data.errormsg)
              {
                //您已经领取过了
                wx.showModal({
                  title: "提示", content: "您已经领取过了"
                })
              }
            }
        }
      })
    }
  },
  toastHide:function(event){
      this.setData({aa:true})
  },
  getinfo:function(event){
    //进入商品详情
    //console.log(event);
    wx.navigateTo({
      url: '../list/info?goods_id='+event.currentTarget.dataset.goods_id
    })
  },
  toClass:function(){
    wx.navigateTo({
      url: '../classification/classification'
    });
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

