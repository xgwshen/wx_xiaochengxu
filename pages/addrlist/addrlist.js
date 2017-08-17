var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    addrlist:{}
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var that = this
    wx.request({
      url: app.globalData.httpsurl+'public/index.php?s=order/address',
      data: {
          sessioninfo:util.getcache('reuserinfo')
        },
      success:function(res){
        console.log(res.data);
        if (res.data.length)
        {
          that.setData({
            addrlist: res.data
          })
        }
        else{
          var address = 'undefined';
          wx.navigateTo({
            url: '../addrlist/editip?address=' + address
          })
        }
      }
    })
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    this.onLoad();
  },
  /**修改地址*/
  toeditip:function(e){
    console.log(e);
    var that = this;
    var index;
    var address;
    if (e.currentTarget.dataset.index !='undefined')
    {
        index = e.currentTarget.dataset.index
        address = JSON.stringify(that.data.addrlist[index])
    }
    else
    {
       address = null;
    }
    //console.log(address);
    wx.navigateTo({
      url: '../addrlist/editip?address=' + address
     })
  },
  /**
   * 删除
  */
  del:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = that.data.addrlist[index].id;
    //console.log(that.data.addrlist[index].id);
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/addressdel',
      data: {
        sessioninfo: util.getcache('reuserinfo'),
        id: id
      },
      success: function (res) {
        if (res.data.status) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();

              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              if (prevPage.data.address.id = id)
              {
                  prevPage.setData({
                    address: '',
                  })
              }
        }
        else {
          console.log(res.data);
        }
      }
    })

  },
  /**修改默认地址*/
  radioChange:function(e){
      console.log(e);
      var that = this;
      var index = e.detail.value;
      var id = this.data.addrlist[index].id;
      console.log(id);
      wx.request({
        url: app.globalData.httpsurl +'public/index.php?s=order/address_edit',
        data: {
          sessioninfo: util.getcache('reuserinfo'),
          id:id,
          defines:'defines'
        },
        success: function (res) {
          //console.log(res.data);
          //var a = 
            console.log(that.data.addrlist[index]);
          if (res.data.status)
          {
            for (var i = 0; i < that.data.addrlist.length; i++) {
              if(i != index)
              {
                var keyval = "addrlist[" + i + "].default";
                var param = {};
                param[keyval] = 0;
                that.setData(param);
              }else{
                var keyval = "addrlist[" + index + "].default";
                var param = {};
                param[keyval] = 1;
                that.setData(param);
              }
            }
          }
          else{
             console.log(res.data);
          }
        }
      })
  },

  /**
   *  选中
  */
  checks:function(e){
    console.log(e);
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    console.log(prevPage);
    if (prevPage.route =='pages/list/affirm')
    {
      console.log(that.data.addrlist[index]);
      prevPage.setData({
        address: that.data.addrlist[index],
      })
      wx.navigateBack({ delta: 1 })
    }
    
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