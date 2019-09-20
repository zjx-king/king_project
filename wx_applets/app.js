//app.js
App({
  onLaunch: function() {
    this.getTab();
    // 监听网络状态
    wx.onNetworkStatusChange(function(res) {
      
      if (res.networkType == 'none') {
        wx.showLoading({
          title: '无网络',
          mask: true
        })
      } else {
        wx.hideLoading()
      }

    })
    // 获取设备信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.statusBar = e.statusBarHeight; //状态栏高度
        let custom = wx.getMenuButtonBoundingClientRect(); //菜单按钮
        this.globalData.custom = custom;
        this.globalData.customBar = custom.bottom + custom.top - e.statusBarHeight; //计算得到定义的状态栏高度
      }
    })

    // 缓存中同步获取用户信息
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        this.globalData.userInfo = value;
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  // Tabbar消息提醒红点
  getTab() {
    let that = this;
    wx.request({
      url: this.globalData.url + '/user/User/read',
      data: {
        user_id: wx.getStorageSync('userId')
      },
      method: 'GET',
      success(res) {
        if (res.data.data.new_official + res.data.data.count > 0) {
          wx.showTabBarRedDot({
            index: 3,
          })
        } else {
          wx.hideTabBarRedDot({
            index: 3,
          })
        }
      }
    })
  },



  // 全局登陆方法
  loging() {
    let that = this;
    let value = wx.getStorageSync('userId');
    // 判断登陆状态是否过期
    wx.checkSession({
      success() {
        console.log('session_key 未过期')
        //session_key 未过期，并且在本生命周期一直有效
        if (value == "" || value == undefined) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      },
      fail() {
        console.log('session_key 已经失效，需要重新执行登录流程')
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })

  },

  // 判断网络状态
  networkStatus() {
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
      }
    })

  },

  //防止按钮多次出发
  throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
    }

    let _lastTime = null

    // 返回新的函数
    return function() {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments) //将this和参数传给原函数
        _lastTime = _nowTime
      }
    }
  },

  // 全局变量 
  globalData: {

    userInfo: null,
    // url: "https://naodong.phpartist.cn", //测试环境域名
    url: "https://naodong.softcomm.net", //生产环境域名
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    id: '',
    openid: '564e6e917a25c1cc8ce949b20931d5ef',
   
    
  },
 

})