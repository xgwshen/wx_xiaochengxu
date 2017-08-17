var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/star.png',
    selectedSrc: '../../images/star_select.png',
    tempFilePaths: '',
    orderproduct:'',
    orderid:'',//订单id
    prcurl:'',
    fileprc: app.globalData.httpsurl +'public/uploads/',
    gets:'',
    aa:true
  },
  onLoad:function(options){
    console.log(options);
    var that = this;  
    // 生命周期函数--监听页面加载
      wx.request({
        url: app.globalData.httpsurl +'public/index.php?s=order/orderinfo',
        data: {
            sessioninfo:util.getcache('reuserinfo'),
            id:options.order_id
          },
        success:function(res){
          console.log(res.data);
          that.setData({
            orderproduct:res.data.product,
            prcurl:res.data.prcurl,
            orderid:res.data.allinfo.orderid
          })
        }
    })
  },
  onShow: function (options) { // Do something when show. 
    app.onLaunch();
    this.onLoad();
  },
  //点击左边,整颗星
  selectRight: function (event) {
    var key = event.currentTarget.dataset.key
    var i  = event.currentTarget.dataset.index
    console.log("得" + key + "分")
    var keyval = "orderproduct["+i+"].key";
    var param = {};
    param[keyval] = key;
    this.setData(param);
    //evaluates
  },
  uploadDIY(filePaths,successUp,failUp,i,length,index){
    wx.uploadFile({ 
      url: app.globalData.httpsurl +'public/index.php?s=index/upload', 
      filePath: filePaths[i], 
      name: 'file',  
      success: (resp) => {
        console.log(resp);
        var keyval = "orderproduct["+index+"].evaluatepic["+i+"]";
        var param = {};
        var picdata = resp.data;
        picdata = picdata.replace('"','');
        picdata = picdata.replace('"','');
        param[keyval] = picdata;
        this.setData(param);
        console.log(this.data.orderproduct);
        successUp++; 
      }, 
      fail: (res) => { 
        console.log(res)
        failUp ++; 
        }, 
        complete: () => { 
          i ++; 
          if(i == length) { 
            console.log('总共'+successUp+'张上传成功,'+failUp+'张上传失败！'); 
          } else {
            //递归调用uploadDIY函数 
            this.uploadDIY(filePaths,successUp,failUp,i,length,index); 
          }
        }, 
      }); 
    },
  chooseimage: function (event) {
    var _this = this;  
    var index  = event.currentTarget.dataset.index
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res)
        var successUp = 0; 
        //成功个数 
        var failUp = 0; 
        //失败个数 
        var length = res.tempFilePaths.length; 
        //总共个数 
        var i = 0; 
        _this.uploadDIY(res.tempFilePaths,successUp,failUp,i,length,index);
      }
    })
  },
  /**
   *  失去焦点事件
  */
  evaluatedata:function(e){
    console.log(e);
    var i  = e.currentTarget.dataset.index;
    var evaluate = e.detail.value;
    console.log(i);
    console.log(evaluate);

    var evaluateval = "orderproduct["+i+"].content";
    var param = {};
    param[evaluateval] = evaluate;
    this.setData(param);
  },
  torderlist:function(){
    var that = this;  
    var messge = '评价成功~';
    var urls = '../orderlist/orderlist';
    // 生命周期函数--监听页面加载
    //console.log(that.data.orderproduct);
      wx.request({
        url: app.globalData.httpsurl +'public/index.php?s=order/evaluate',
        data: {
            sessioninfo:util.getcache('reuserinfo'),
            evaluate:that.data.orderproduct,
            orderid:that.data.orderid
          },
        success:function(res){
          console.log(res.data);
          wx.navigateTo({
            url: '../common/common?mssge=' + messge + '&urls=' + urls,
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }
    })
  },
  toastHide: function (event) {
    this.setData({ aa: true })
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