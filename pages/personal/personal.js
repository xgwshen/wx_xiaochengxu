var app = getApp();
Page({
  data:{
    userInfo: {},
    choosedata:0
  },
  onLoad:function(options){
     var that = this;
    //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
            userInfo:userInfo
          })
      })
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    this.onLoad();
  },
  impoweragain:function()
  {
    var that = this;
    wx.openSetting({
      success: function (res) {
        if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) { 
          //这里是授权成功之后 填写你重新获取数据的js //参考: 
          app.globalData.userInfo = '未授权'
          app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
              userInfo: userInfo
            })
          })
        }
      } 
    })
/*
    var that = this;
      //重新调用用户头像数据
    app.globalData.userInfo = '未授权'
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
*/
  },
  // 去我的优惠券
  toCoupon:function(){
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  // 去地址列表
  toAddrlist:function(){
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          that.setData({
            address: { name: res.userName, tel: res.telNumber, province: res.provinceName, city: res.cityName, county: res.countyName, address: res.detailInfo },
            //choosedata:1
          })
        },
        fail: function (re) {
          //用户拒绝或者调用失败用自己的收获地址
          if (re.errMsg !='chooseAddress:cancel')
          {
            if (!that.data.address) {
              wx.navigateTo({
                url: '../addrlist/addrlist'
              })
            } //that.address();
          }

        }

      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    /*
    wx.navigateTo({
      url: '../addrlist/addrlist'
    })*/
  },
  /**
 * 自己的收获地址
*/
  address: function () {
    //调转到收获地址列表页
    wx.navigateTo({
      url: '../addrlist/addrlist'
    })
  },
  // 加盟电话
  toJiontel:function(){
    wx.makePhoneCall({
      phoneNumber: '4001027979' 
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