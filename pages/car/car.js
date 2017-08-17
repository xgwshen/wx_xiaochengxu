var util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data:{
    shoplist:1,
    userInfo:'',
    selectedAllStatus: false,
    arr:'',
    count:0,
    aa:true,
    gets:'',
    status:'',
    startX:'',//起点坐标
    editIndex: 0,
    delBtnWidth: 100,
    shopval:{},
    hidden: true
  },
  onLoad:function(options){
    var that = this
    console.log(app.globalData.httpsurl);
    //调用应用实例的方法获取全局数据
    if(!util.getcache('reuserinfo'))
    {
        wx.showModal({
          title: "提示", content: "信息获取失败，请检查网络或返回刷新重进"
        })
    }else{
      that.loadingChange();
        wx.request({
          url: app.globalData.httpsurl +'public/index.php?s=shopcat/getshopcart',
          data: {
              sessioninfo:util.getcache('reuserinfo')
            },
          success:function(res){
            console.log(res.data);
            that.setData({
              shoplist:res.data,
              status: res.data.status,
              hidden: true,
              selectedAllStatus: false,
            })
          }
        })
    }
  },
  onShow: function (options) { // Do something when show. 
    var that = this;
    app.onLaunch();
    that.onLoad();
  },
  loadingChange: function () {
    var that = this;
    that.setData({ hidden: !this.data.hidden })
    setTimeout(function () {
      that.setData({
        hidden: true
      });
      //that.update();
    }, 3000);
  },
  //购物车调到详情页
  toInfo:function(e){
    console.log(e); 
    var index=currentTarget.dataset.index;
    var id = this.data.shoplist.data[index]['goods_id'];
    wx.navigateTo({
      url: '../list/info?goods_id=' + id
    })
  },
  /**手指刚放到屏幕触发*/
  touchS: function (e) {
    console.log(e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });

    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    console.log(e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "transform:translateX(0)";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "transform:translateX(-" + disX + "px)";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "transform:translateX(-" + delBtnWidth + "px)";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      console.log(index);
     // var list = that.data.shoplist;
      //将拼接好的样式设置到当前item中
      //list.data[index].txtStyle = txtStyle;
      var param = {};
      var keyval = "shoplist.data.[" + index + "].txtStyle";
      param[keyval] = txtStyle;
      this.setData(param);

      //更新列表的状态
     // this.setData({
       // shoplist: list
      //});
    }
  },
  touchE: function (e) {
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "transform:translateX(-" + delBtnWidth + "px)" : "transform:translateX(0)";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
     // var list = that.data.shoplist;
      //list.data[index].txtStyle = txtStyle;

      var param = {};
      var keyval = "shoplist.data.[" + index + "].txtStyle";
      param[keyval] = txtStyle;
      that.setData(param);

      //更新列表的状态
      //that.setData({
//shoplist: list
//});
    }
  },
  /**
   * 购物车删除
  */
  del:function(event){
    var that = this;
    var cartid = event.target.dataset.cartid;
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=shopcat/delcat',
        data: {
          sessioninfo: util.getcache('reuserinfo'),
          id: cartid
        },
        success: function (res) {
          if (res.data.status)
          {
            //删除成功
              that.setData({
                aa: false,
                gets:'删除成功'
              })
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
              //this.onLoad()
          }else{
              that.setData({
                  aa: false,
                  gets: res.data.error_msg
              })
          }
         
        }
    })
  },
  /**
   * 减少
  */
  reduce:function(e){
    var that = this;
    var index = e.target.dataset.index;
    console.log(index)
    var nu = that.data.shoplist.data[index]['goods_number'];
    var numbers2;
    var param = {};
    if(nu > 1){
        numbers2= nu-1;
        console.log(that.data.shoplist.data[index].checkdan);
        if (that.data.shoplist.data[index].checkdan)
        {
           var prcval = "shoplist.allprice";
           param[prcval] = (this.data.shoplist.allprice)-(this.data.shoplist.data[index]['price']);
        }
        
      }
    else{
      numbers2=1;
      wx.showModal({
        title: "提示", content: "删除请左滑！"
      })
    }
    var keyval = "shoplist.data.["+index+"].goods_number";
    param[keyval] = numbers2;
    this.setData(param);
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=shopcat/updataCat',
      data: {
          sessioninfo:util.getcache('reuserinfo'),
          id:this.data.shoplist.data[index]['id'],
          myNUm:numbers2
        },
      success:function(res){
        console.log(res.data);
      }
    })
  },
  /**
   * 增加
  */
  add:function(e){
    var index = e.target.dataset.index;
    var nu = (this.data.shoplist.data[index]['goods_number']-0);
    var numbers2;
    var param = {};
    if(nu <(this.data.shoplist.data[index].allnumber-0)){
        numbers2= nu+1;
        console.log(this.data.shoplist.data[index].checkdan);
        if (this.data.shoplist.data[index].checkdan) {
          var prcval = "shoplist.allprice";
           param[prcval] = parseFloat(this.data.shoplist.allprice) + parseFloat(this.data.shoplist.data[index]['price']);
        }
       
      }
    else{
      numbers2=nu;
      wx.showModal({
        title: "提示", content: "抱歉，库存已到上限！"
      })
      
    }
    var keyval = "shoplist.data.["+index+"].goods_number";
    param[keyval] = numbers2;
    this.setData(param);
    //也要改库中的数据
    wx.request({
      url: app.globalData.httpsurl +'public/index.php?s=shopcat/updataCat',
      data: {
          sessioninfo:util.getcache('reuserinfo'),
          id:this.data.shoplist.data[index]['id'],
          myNUm:numbers2
        },
      success:function(res){
        console.log(res.data);
      }
    })
  },
  /**
   * 输入数据（购物车产品数量）时，失去焦点事件
  */
  leavedata: function (e) {
    var that = this;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var nu = that.data.shoplist.data[index]['goods_number'];
    var evaluate = e.detail.value;
    var numbers2;
    var param = {};
    if (evaluate < (that.data.shoplist.data[index].allnumber-0)) {
      if (evaluate>1)
          numbers2 = evaluate;
      else
      {
        numbers2 = 1;
        wx.showModal({
          title: "提示", content: "删除请左滑！"
        })
      }
    }
    else {
      numbers2 = (that.data.shoplist.data[index].allnumber)-0;
      wx.showModal({
        title: "提示", content: "抱歉，库存已到上限！"
      })
    }
    //this.data.shoplist.data[index].checkdan
    var keyval = "shoplist.data.[" + index + "].goods_number";
    param[keyval] = numbers2;
    that.setData(param);
    console.log(evaluate);
  },
  //选择时改变购物车总价格
  checkboxChange: function(e) {
    console.log(e);
    var that = this;
    var value = e.detail.value;
    console.log(value);
    var len = e.detail.value.length;
    console.log(len);
    var allprice = 0;
    var index;
    var arr = '';
    if (len)
    {
      for (var i = 0; i < len; i++) {
        index = parseInt(e.detail.value[i]);
        console.log(index);
        allprice += (parseFloat(that.data.shoplist.data[index]['price']) * (that.data.shoplist.data[index]['goods_number']));
        arr += that.data.shoplist.data[index]['id'] + ',';
        var param = {};
        var checkdan = "shoplist.data.[" + index + "].checkdan";
        param[checkdan] = true;
        that.setData(param);
      }
      console.log(that.data.shopval);

      if (that.data.shopval.length > len)
      {
          console.log(123);
          console.log(that.data.shopval);
          console.log(e.detail.value);
          for (var ii = 0; ii < that.data.shopval.length;ii++)
          {
            if (that.data.shopval[ii] != e.detail.value[ii])
              index = that.data.shopval[ii];
            var param = {};
            var checkdan = "shoplist.data.[" + index + "].checkdan";
            param[checkdan] = false;
            that.setData(param);
          }

      }
     
      console.log(that.data.shoplist.data[index].checkdan);
    }
    else
    {
      var carts = that.data.shoplist.data;
      for (var j = 0; j < carts.length; j++) {
        var param = {};
        var checkdan = "shoplist.data[" + j + "].checkdan";
        param[checkdan] = false;
        that.setData(param);
      }
      allprice = 0;
    }
    that.setData({
      "shoplist.allprice":allprice,
      "arr":arr,
      "selectedAllStatus":false,
      "shopval":e.detail.value 
    })
  },
  //全选
  bindSelectAll: function() {
    var that = this
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var carts = this.data.shoplist.data;
    var allselect;
    console.log( carts);
    if(selectedAllStatus){
      //已经选中再点击时取消，
      allselect = true;
    }else{
      //为非时选中
      allselect = false;
    }
      var check = '';
      var checkdan="";
      var allprice = 0;
      var arr='';
      var array=[];
        for (var i = 0; i <carts.length; i++) {
          var param = {};
            checkdan = "shoplist.data[" + i + "].checkdan";
            check = "shoplist.data["+i+"].check";
           // arrary = 'shopval[' + i + ']';
            //param[arrary] = i;
            array[i] = i;
            param[check] = allselect;
            param[checkdan] = allselect;
            param['selectedAllStatus'] = selectedAllStatus;
            allprice += parseFloat((carts[i]['price'])*(carts[i]['goods_number']));
            arr+=carts[i]['id']+',';
            that.setData(param);
        }
        console.log(that.data.shopval);
        this.setData({
          "shoplist.allprice":allprice,
          "shopval":array
        })
        if(!selectedAllStatus)
        {
          that.setData({
           "shoplist.allprice":0,
           "shopval":{}
         });
        }
         else{
           that.setData({
           "arr":arr
         });
         }
   // }
},/*立即购买页*/
  oncebuy:function(){
    var that = this; //cat_ids
    if (that.data.arr.length)
    {
      wx.navigateTo({
        url: '../list/affirm?cat_ids=' + that.data.arr
      })
    }
    else{
      wx.showModal({
        title: "提示", content: "抱歉，您没有选择商品！请选择商品后购买。"
      })
    }
  },
  // 去首页逛逛
  toIndex:function(){
    wx.switchTab({
      url: '../index/index'
    })
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