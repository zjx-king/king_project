// pages/message/msg-index/msg-index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sys:1,
    userMsg:{}
  },

  //页面跳转
  toPage(e) {
    let url = e.currentTarget.dataset.url;
    let user = wx.getStorageSync('userId');
    if (user) {
      wx.navigateTo({
        url: url,
      })
    }else{
      wx.showModal({
        content: '需要登陆才能进行下一步操作',
        confirmColor: '#333333',
        cancelColor	: '#333333',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },

  // 获取官方消息通知
  getSys() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/officialRemind',
      data: {
        user_id: wx.getStorageSync('userId')
      },
      method: 'GET',
      success(res) {
        that.setData({
          sys: res.data.data
        })
      }
    })
  },
  
  // 获取用户消息通知
  getMsg() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/messagePrompt',
      data: {
        user_id: wx.getStorageSync('userId')
      },
      method: 'GET',
      success(res) {
        that.setData({
          userMsg: res.data.data
        })
      }
    })
  },

  // Tabbar消息提醒红点
  getTab() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/User/read',
      data: {
        user_id: wx.getStorageSync('userId')
      },
      method: 'GET',
      success(res) {
        if (res.data.data.new_official + res.data.data.count > 0){
          wx.showTabBarRedDot({
            index: 3,
          })
        }else{
          wx.hideTabBarRedDot({
            index: 3,
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTab();
    this.getSys();
    this.getMsg();
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