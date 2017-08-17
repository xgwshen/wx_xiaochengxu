var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    address:{},
    province:{},
    city:{},
    county:{},
    index:0,
    indexcity: 0,
    indexcounty: 0,
  },
  onLoad:function(options){
    console.log(options);
    // 生命周期函数--监听页面加载
    var that = this;
    var province;
    var city;
    var county;
    if (options.address !='undefined')
    {
      console.log(options.address);
      that.setData({
        address: JSON.parse(options.address)
      })
      province = that.data.address.province;
      city = that.data.address.city;
      county = that.data.address.county;
    }else{
      province = null;
      city = null;
      county = null;
    }
    //province
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/alladdress', //取所有省级数据
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        province: province,
        city: city,
        county: county,
        pid:0,
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          province: res.data.province,
          city: res.data.city,
          county: res.data.county,
          index:res.data.index,
          indexcity:res.data.indexcity,
          indexcounty: res.data.indexcounty
        })
      }
    })
  },
  /**选择省*/
  bindChange:function(e){
    console.log(e);
    var that = this;
    var index = e.detail.value
    //console.log(that.data.province.area_id[index]);
    that.setData({
      index: index,
    }),
      wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/provincess', //取所有省级数据
        data: {
          sessioninfo: util.getcache('reuserinfo'),
          pid: that.data.province.area_id[index],
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            city: res.data.city,
            county: res.data.county,
            indexcity: 0,
            indexcounty: 0,
          })
        }
      })
  },
  /**根据城市选县*/
  bindcityChange:function(e){
    console.log(e);
    var that = this;
    var index = e.detail.value
    that.setData({
      indexcity: index,
    }),
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/province', //取所有省级数据
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        pid: that.data.city.area_id[index],
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          county: res.data
        })
      }
    })

  },
 /**
  * 选择县区
 */
  bindcountyChange: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      indexcounty: e.detail.value
    })
  },
  /**
   * 新增或者修改地址
  */
  formSubmit: function(e) {
    var that = this;
    var index = that.data.index;
    var indexcity = that.data.indexcity;
    var indexcounty = that.data.indexcounty;
    console.log(e);
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    //如果是编辑 address
    if (that.data.address.id)
      var id = that.data.address.id;
    else
      var id = 0;
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/address_edit',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        id:id,
        name: e.detail.value.name,
        tel: e.detail.value.tel,
        address: e.detail.value.address,
        province: that.data.province.title[index],
        city: that.data.city.title[indexcity],
        county: that.data.county.title[indexcounty],
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status)
        {
          console.log(123);
          wx.navigateBack({ 
              delta: 1,
              success: function (e) {
                console.log(e);
                var prevPage;
                var pages = getCurrentPages();
                 prevPage = pages[pages.length - 1];
                if (prevPage.route=='pages/addrlist/editip')
                {
                    prevPage = pages[pages.length - 2];
                }
                //var page = getCurrentPages().pop();
                console.log(prevPage);
                if (prevPage == undefined || prevPage == null) return;
                prevPage.onLoad();
              }
            })

        }
      }
    })
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  toaddrlist:function(){
    wx.navigateTo({
        url: '../addrlist/addrlist'
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