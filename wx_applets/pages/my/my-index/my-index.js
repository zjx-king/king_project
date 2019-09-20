// pages/my/my-index/my-index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    url: app.globalData.url,
    isLogin: true,
    msg: false,
    toastBolean: false, //分享
    list: [{
        name: '我的主页',
        url: '../my-mine/my-mine'
      },
      {
        name: '草稿箱',
        url: '../my-drafts/my-drafts'
      },
      // {
      //   name: '回收站',
      //   url: '../my-recovery/my-recovery'
      // },
      {
        name: '分享有礼',
        url: 'share'
      },
      // {
      //   name: '帮助中心',
      //   url: '../my-help/my-help'
      // },
      {
        name: '设置',
        url: '../my-setting/my-setting'
      },
    ],

  },
  //分享
  share() {
    let that = this;
    wx.updateShareMenu({
      withShareTicket: true,
      success() {
        wx.request({
          url: app.globalData.url + '/user/User/userShare',
          data: {
            user_id: wx.getStorageSync('userId'),
          },
          method: 'POST',
          success(res) {
            console.log('分享：',res.data)
            that.cancleShare();
          }
        })
      },
    })
  },
  //  页面跳转
  toPage(e) {
    // 从缓存中获取用户信息
    let user = wx.getStorageSync('userId');
    if (user) {
      if (e.currentTarget.dataset.url === "share?id=" + this.data.userInfo.user_id) {
        wx.hideTabBar({})
        this.setData({
          toastBolean: true
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
      }

    } else {
      wx.showModal({
        content: '需要登陆才能进行下一步操作',
        confirmColor: '#333333',
        showCancel: false,
        success(res) {
          if (res.confirm) {

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //隐藏分享弹窗
  cancleShare() {
    wx.showTabBar({})
    this.setData({
      toastBolean: false
    })
  },

  // 获取数据
  getData() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/userInfo',
      data: {
        user_id: wx.getStorageSync('userId'),
      },
      method: 'GET',
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            userInfo: res.data.data,
            isLogin: true,
            isShow: false
          })
          wx.setStorage({
            key: "userInfo",
            data: res.data.data
          })
        }

      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 跳转登录页
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


    var that = this;
    that.getData();
    // 监听网络状态
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        if (res.networkType == 'none') {
          wx.showLoading({
            title: '无网络',
            mask: true
          })
        } else {
          wx.hideLoading()
        }
      }
    })
    // 判断登陆状态是否过期
    let value = wx.getStorageSync('userId')
    wx.checkSession({
      success() {

        if (value == "" || value == undefined) {
          that.setData({
            isLogin: false
          })
        } else {
          that.getData();
          that.setData({
            isLogin: true
          })
          
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        that.setData({
          isLogin: false
        })

      }
    })
    
    wx.setNavigationBarTitle({
      title: "我的"
    })

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