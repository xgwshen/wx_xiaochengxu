//product/index.js
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
//获取应用实例
//var  aa = true;
Page({
  data: {
    productinfo:{},
    userInfo: {},
    classstyle:'good_yanse0',
    num:0,
    nums:0,
    norm:'',
    color_id:'',
    color_val:'',
    norms_val:'',
    norms_id:'',
    promote_price:'',
    showView:true,
    numbers:1,
    addsuccess:'',
    aa:true,
    buyval:{},
    normsarray:{},
    address:'',
    gets: ''
  },
  onLoad: function (event) {
    // showView:(event.showView=="true"?true:false)
    var that = this
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=product/productinfo',
        data: {
          goods_id:event.goods_id,
          sessioninfo:util.getcache('reuserinfo')
        },
        success:function(res)
        {
          /* 定位功能，暂时不要
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              console.log(res);
              wx.request({
                //url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1', 
                url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=RFUBZ-A2L33-UT23P-3KGIH-C7IM6-MUBSD',
                data: {},
                header: {
                  'Content-Type': 'application/json'
                },
                success: function (ops) {
                  var adress = ops.data;
                  that.setData({
                    address: (adress.result.ad_info.city) + ' ' + (adress.result.ad_info.district)
                  })
                  console.log(that.data.address);
                  console.log(adress);
                }
              })
            }
          })*/
            console.log(res.data);
            if(res.data.color_norm.color.length>0)
            {
              var parm ={
                 color_id: (res.data.color_norm.color[0]['color_id']),
                 color_val: (res.data.color_norm.color[0]['color_val'])
                  }
              that.setData(parm)
                  console.log(that.data.norms_val);
            }
            if (res.data.color_norm.norms.length > 0)
            {
              var parm = {
                norms_id: res.data.color_norm.norms[0]['norms_id'] ,
                norms_val: res.data.color_norm.norms[0]['norms_val']
              }
            }else{
              var parm = {
                // norms_id: res.data.norms[0]['attr_id'],
                // norms_val: res.data.norms[0]['attr_name']
              }
            }
            that.setData(parm) 
            if(res.data.norms.length>0)
            {
              that.setData({
                 normsarray:res.data.norms
             })
            }
            for (var i = 0; i < res.data.evaluate.length;i++){
              if (res.data.evaluate[i].nkname){
                var a = res.data.evaluate[i].nkname.charAt(res.data.evaluate[i].nkname.length - 1);
                res.data.evaluate[i].nkname = a;
              }
            }
            that.setData({
              productinfo:res.data,
              promote_price:res.data.defaultprice
             })
            console.log(res.data.evaluate)
          WxParse.wxParse('content', 'html', res.data.content, that, 5);
        }
    })
    
  },
  colorSel:function(event){
    console.log(event);
    this.setData({
      num:event.currentTarget.dataset.color,
      color_id:event.currentTarget.dataset.color_id,
      color_val:event.currentTarget.dataset.color_val
    })
  },
  colorSel_norm:function(event){
    var that = this
    that.setData({
      nums:event.currentTarget.dataset.norm,
      norms_id:event.currentTarget.dataset.norms_id,
      norms_val:event.currentTarget.dataset.norms_val
    })
     wx.request({
       url: app.globalData.httpsurl +'public/index.php?s=product/price',
        data: {
          norms_id:event.currentTarget.dataset.norms_id,
          color_id:that.data.color_id,
          goods_id:that.data.productinfo.goods_id
        },
        success:function(res)
        {
            console.log(res.data);
            that.setData({
              promote_price:res.data
          })
        }
    })
  },
  /***
   * 查看更多评价
  */
  moreeval:function(){
    wx.navigateTo({
      url: '../list/evaluate?goods_id=' + this.data.productinfo.goods_id
    })
  },
  show:function(){
    var that=this;
    that.setData({
      showView:(!that.data.showView)
    })
  },
  /**
   * 减少
  */
  reduce:function(){
    var nu = this.data.numbers;
    var numbers2;
    if(nu > 1){
        numbers2= nu-1;
      }
    else{
      numbers2=1;
    }
    this.setData({
      numbers:numbers2
    })
  },
  /**
   * 增加
  */
  add:function(){
    var nu = this.data.numbers;
    var numbers2;
    if(nu <this.data.productinfo.goods_number){
        numbers2= nu+1;
      }
    else{
      numbers2=nu;
    }
    this.setData({
      numbers:numbers2
    })
  },
  navgaTocar: function () {
    wx.switchTab({
      url: '../car/car',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })//购物车
  },
  addCar:function(){
   var that = this;
   if (this.data.productinfo.goods_number > 0) {
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=shopcat/setsessionaddress',
        data: {
          norms_id:that.data.norms_id,
          colour_id:that.data.color_id,
          colour_name:that.data.color_val,
          norms_name:that.data.norms_val,
          goods_id:that.data.productinfo.goods_id,
          sessioninfo:util.getcache('reuserinfo'),
          goods_price:that.data.promote_price,
          goods_number:this.data.numbers,
          goods_thumb:that.data.productinfo.goods_thumb,
          goods_name:that.data.productinfo.goods_name,
          cat_id:that.data.productinfo.cid,//没有等会添加
        },
        success:function(res){
              //  aa = false
               console.log(res);
           
                if(res.data.status){
                that.setData({
                      aa:false,
                      gets:"加入成功",
                      "productinfo.catcount": that.data.productinfo.catcount + that.data.numbers
                })
              }
            //console.log(res.data,that.data.addsuccess);
        }
    })
   }
   else{
     wx.showModal({
       title: "提示", content: "抱歉！该商品暂时缺货，请过断时间再来购买！"
     })
   }
  },
  /**获取地址*/
  mapaddress:function(){
    var that = this;
    wx.getLocation({ 
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度 
      success: function(res) {
         var latitude = res.latitude 
         var longitude = res.longitude 
         wx.openLocation({ 
            latitude: latitude, 
            longitude: longitude, 
            scale: 28 
           }) 
          wx.request({
            //url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1', 
            url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=RFUBZ-A2L33-UT23P-3KGIH-C7IM6-MUBSD',
            data: {},
            header: {
              'Content-Type': 'application/json'
            },
            success: function (ops) {
              var adress = ops.data;
              that.setData({
                address: (adress.result.ad_info.city) + ' ' + (adress.result.ad_info.district)
              })
              console.log(that.data.address);
              console.log(adress);
            }
          })
         }
      })
  },
  /*立即购买页*/
  oncebuy:function(){
    var that = this;
    if (this.data.productinfo.goods_number >0)
    {
      console.log(that.data.promote_price);
      var dataval=[{
            norms_id:that.data.norms_id,
            colour_id:that.data.color_id,
            colour_name:that.data.color_val,
            norms_name:that.data.norms_val,
            goods_id:that.data.productinfo.goods_id,
            price:that.data.promote_price,
            goods_number:this.data.numbers,
            inventory: this.data.productinfo.goods_number,
            goods_thumb:that.data.productinfo.goods_thumb,
            goods_name:that.data.productinfo.goods_name,
            cat_id:that.data.productinfo.cid,
            allprice:(that.data.promote_price)*(this.data.numbers)
      }];
    var allprice = (this.data.numbers)*(that.data.promote_price);
      wx.navigateTo({
        //wx.setStorageSync('buygoods', res.data);
        url: '../list/affirm?buygoods='+JSON.stringify(dataval)+'&allprice='+allprice+'&cid='+that.data.productinfo.cid
      })
    }
    else{
      wx.showModal({
        title: "提示", content: "抱歉！该商品暂时缺货，请过断时间再来购买！"
      })
    }
  },
  toastHide:function(event){
      this.setData({aa:true})
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
