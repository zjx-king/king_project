// pages/login/login.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user: {},
    mask: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  // 页面跳转
  toPage(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },



  onLoad: function() {},

  // 关闭弹窗
  closeMask() {
    this.setData({
      mask: false
    })
  },
  // 获取手机号
  getPhoneNumber(e) {
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)

    this.setData({
      mask: false,
    })

    this.register(e.detail); // 用户登陆注册
  },

  // 获取用户授权
  getUserInfo: function(e) {
    let that = this;
    let user = e.detail.userInfo;

    that.setData({
      user: user
    })

    if (user) {
      // 用户登录
      wx.login({
        success: res => {
          that.setData({
            mask: true
          })
         

          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (ress) {
                //发起网络请求
                wx.request({
                  url: app.globalData.url + '/login/login/loginAuthorization',
                  method: 'POST',
                  data: {
                    code: res.code,
                    iv: ress.iv,
                    encryptedData: encodeURIComponent(ress.encryptedData)
                  },
                  success(res) {
                    console.log('res:', res);
                    wx.setStorage({
                      key: "openid",
                      data: res.data.data.openid
                    })
                  }
                })
                
              }
            });
            
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })


    } else {
      wx.hideLoading();
    }
  },


  // 用户登陆
  register(obj) {
    let that = this;
    wx.showLoading({
      title: '登录中',
    })
    wx.request({
      url: app.globalData.url + '/login/login/userInfo',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        user_name: that.data.user.nickName,
        user_image: that.data.user.avatarUrl,
        iv: obj.iv,
        encryptedData: encodeURIComponent(obj.encryptedData)
      },
      success(res) {
        if (res.data.code == 200) {
          wx.setStorage({
            key: "userId",
            data: res.data.data.user_id
          })
          // 获取用户信息存入缓存
          that.userInfoApi(res.data.data.user_id);
        } else {
          wx.showToast({
            title: '登陆失败',
            icon: 'none',
            duration: 2000
          })
        }

        wx.hideLoading();
      }
    })


  },

  // 获取用户信息
  userInfoApi(id) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/userInfo',
      data: {
        user_id: id,
      },
      method: 'GET',
      success(res) {
        if (res.data.code == 200) {
          wx.setStorage({
            key: "userInfo",
            data: res.data.data
          })

          wx.navigateBack({
            delta: 1
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})