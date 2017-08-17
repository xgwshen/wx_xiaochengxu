var util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    aa:true,
    buygoods:'',
    favora:'',//优惠券
    address:'',//默认收货地址
    allprice:'',
    cat_ids:'',
    prcurl:'',
    gets:'',
    leave:'',
    favoraprice:0,//优惠
    favoraid: 0,//使用的优惠id
    allnum:'',//总数量
    choosedata: 0
  },
  onLoad: function (event) {
    console.log(event);
    var that = this;
    if(!util.getcache('reuserinfo'))
    {
       wx.showModal({
         title: "提示", content: "信息获取失败，请检查网络或返回刷新重进"
       })
    }else{
      var a = event.buygoods?JSON.parse(event.buygoods):'';
      var allnum
      if(a!='')
      {
        allnum = a[0]['goods_number'] ? a[0]['goods_number'] : 0;
      }
      var cid = event.cid;
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/affirm',
        data: {
          sessioninfo:util.getcache('reuserinfo'),
          cid:cid,
          cat_id:event.cat_ids
        },
        success:function(res)
        {
            console.log(res.data);
            var fa = res.data.favora;
            if (res.data.cartlist)
            {
              a = res.data.cartlist;
              allnum = res.data.number ? res.data.number : 0;
            }
            if(res.data.allprice)
               var ap = res.data.allprice;
            else
               var ap =event.allprice;
            if (fa)
            {
              if (ap >= fa.min_amount)
                var favoraprice = fa.act_type_ext;
              else
                var favoraprice = 0;
            }
            else
              var favoraprice = 0;
            that.setData({
              buygoods:a,
              favora:fa,
              // favoraprice:favoraprice,
              address:res.data.address,
              allprice:ap,
              cat_ids: event.cat_ids,
              prcurl:res.data.prcurl,
              allnum:allnum
            })
            console.log(that.data.buygoods);
        }
    })
    if(!that.data.address)
      that.seladdress();
    }
  },
  /**
   * 减少
  */
  reduce: function (e) {
    var index = e.target.dataset.index;
    var nu = this.data.buygoods[index]['goods_number'];
    var numbers2;
    var param = {};
    if (nu > 1) {
      numbers2 = nu-1;
      var prcval = "buygoods.["+index+"].allprice";
      param[prcval] = (this.data.buygoods[index]['allprice'])-(this.data.buygoods[index]['price']);
      var allprice = "allprice";
      param[allprice] = (this.data.allprice)-(this.data.buygoods[index]['price']);
    }
    else {
      numbers2 = 1;
      wx.showModal({
        title: "提示", content: "最少购买一件，请核对信息！"
      })
    }
    var keyval = "buygoods.[" + index + "].goods_number";
    param[keyval] = numbers2;
    this.setData(param);
  },
  /**
   * 增加
  */
  add: function (e) {
    var index = e.target.dataset.index;
    var nu = this.data.buygoods[index]['goods_number'];
    var numbers2;
    var param = {};
    if (nu < this.data.buygoods[index].inventory) {
      numbers2 = nu+1;
      var prcval = "buygoods[" + index + "]allprice";
      param[prcval] = parseFloat(this.data.buygoods[index]['allprice']) + parseFloat(this.data.buygoods[index]['price']);
      var allprice = "allprice";
      param[allprice] = parseFloat(this.data.allprice) + parseFloat(this.data.buygoods[index]['price']);
    }
    else {
      numbers2 = nu;
      wx.showModal({
        title: "提示", content: "抱歉，库存已到上限！"
      })
    }
    var keyval = "buygoods[" + index + "].goods_number";
    param[keyval] = numbers2;
    this.setData(param);
  },
  //地址选择
  seladdress:function(){
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({ 
          success: function (res) 
          { 
            console.log(res);
            that.setData({
                address:{name:res.userName,tel:res.telNumber,province:res.provinceName,city:res.cityName,county:res.countyName,address:res.detailInfo},
              })
          },
          fail:function(re)
          {
            if (re.errMsg != 'chooseAddress:cancel') {
              console.log(re);
              //用户拒绝或者调用失败用自己的收获地址
              if (!that.data.address)
                that.address();
            }
          }
      }) 
    } 
    else 
    { /*
        wx.showModal({ 
          title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。' 
        }) */
      if (!that.data.address)
        that.address();
    }
},
/**
 * 自己的收获地址
*/
 address:function(){
      //调转到收获地址列表页
   wx.navigateTo({
     url: '../addrlist/addrlist'
   })
 },
  /**
   *  获得优惠券
  */
  favora:function(){
    wx.navigateTo({ 
      url: '../list/coupon?allprice='+this.data.allprice
    })
  },
  /**
   *  失去焦点事件(获得留言内容)
  */
  leavedata:function(e){
    console.log(e);
    var i  = e.currentTarget.dataset.index;
    var evaluate = e.detail.value;
    console.log(evaluate);
    this.setData({
      leave:evaluate
    });
  },//提交
  getaffirm:function(){
    var that = this;//subval =
    if(!that.data.favora)
    {
      that.setData({
          favora:{fav_id:'',act_type_ext:0,fav_name:''}
      })
    }
    //判断地址是否选择
    //var length = that.data.address.length;
    if(!that.data.address)
    {
        //提示没有选择地址
          wx.showModal({
            title: "提示", content: "请选择收货地址，再付款！"
          })
    }
    else{
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=order/setorder',
        data: {
          goods_id:that.data.buygoods[0]['goods_id'],
          goods_name:that.data.buygoods[0]['goods_name'],
          goods_number:that.data.buygoods[0]['goods_number'],
          colour_name:that.data.buygoods[0]['colour_name'],
          norms_name:that.data.buygoods[0]['norms_name'],
          price:that.data.buygoods[0]['price'],
          allprice:that.data.allprice,
          youprice: that.data.favoraprice,
          fav_id: that.data.favoraid,
          cats_id:that.data.cat_ids,
          address:that.data.address,
          leave:(that.data.leave)?(that.data.leave):'',//用户留言
          sessioninfo:util.getcache('reuserinfo')
        },
        success:function(res)
        {
          console.log(res.data);
          if(res.data.return_code=="SUCCESS"){
              var reorderid = res.data.reorderid;
              var messge = '恭喜您购买成功！感谢您的购买~，期待您的再次光临';
              var urls = '../orderlist/orderlist?size=2';
              wx.requestPayment({ 
                'timeStamp': ""+res.data.timeStamp, 
                'nonceStr': ""+res.data.nonceStr, 
                'package': ""+res.data.package, 
                'signType': ""+res.data.signType,
                'paySign': ""+res.data.paySign, 
                'success':function(res){
                  wx.request({
                    url: app.globalData.httpsurl +'public/index.php?s=order/ordersutus',
                      data: {
                        sessioninfo:util.getcache('reuserinfo'),
                        orderid:reorderid,
                        youprice: that.data.favoraprice,
                        fav_id: that.data.favoraid,
                      },
                      success:function(res)
                      {//status
                        console.log(res)
                          if(res.data.status)
                          {
                             
                              wx.redirectTo({
                               url: '../common/common?mssge=' + messge +'&urls='+urls,
                              })
                          }else{
                             console.log('订单状态修改失败');
                             wx.showModal({
                               title: "提示", content: "订单状态修改失败，请截图联系客服！"
                             })
                          }
                      }
                  })
                  }, 
                'fail':function(res){ 
                    console.log('失败');
                    console.log(res);
                      //提示支付失败
                      that.setData({
                          aa:false,
                          gets:'支付失败'
                      })
                }  
              });
          }else{
             console.log(res);
             //统一下单调用失败
             wx.showModal({
               title: "提示", content: res.data.remass ? res.data.remass : '统一下单调用失败，请核对您的购买信息！'
             })
          }
        }
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
