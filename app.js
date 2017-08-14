//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var that=this
    that.getUserInfo(function(userInfo){

    })
    wx.checkSession({
      success:function(){
        console.log('ok')
        //session未过期 
        this.userLogin;
      },
      fail:function(){
        console.log('fail')
        // 登录态过期 重新请求
        that.userLogin;
      }
    })
  },
  //用户登录
  userLogin:function(){
    console.log('111')
  	wx.login({
        	success:function(res){
        		if(res.code){
        			//获取code 把code当成参数传到后台请求API
        			wx.request({
        				url:app.globalData.httpsurl+'public/index.php?s=privateinfo/wologin',
        				data:{
        					code:res.code,
        				},
        				success:function(res){
        					//设置缓存session----reuserinfo
        					try{
        						wx.setStorageSync('reuserinfo',res.data)
        					}catch(e){
        						//
        					}
                },
                fail:function(){
                  wx.showModal({
                    title:"提示",content:"用户不存在"
                  })
                }
        			})
        		}else{
        			wx.showModal({
                    title: "提示", content: "获取用户登录失败"+res.errMsg
                  })
        		}
        	}
        })
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
        fail:function(res){
        	var param={nickname:'未授权'}
        	that.globalData.userInfo=param;
        	typeof cb=="function" && cb(that.globalData.userInfo);
        }
      })
    }
  },
  //定义全局变量
  globalData: {
    userInfo: null,
    httpsurl:"http://xgwshenxcx.com/",
  }
})
