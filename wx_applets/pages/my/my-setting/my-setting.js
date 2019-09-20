// pages/my/my-setting/my-setting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storage: '',
    msg: ''
  },
  // 消息通知开关
  switchChange: function(e) {
    console.log('switch 发生 change 事件，携带值为', e.detail.value)

    let type;
    e.detail.value ? type = 1 : type = 2;

    this.msg(type);
  },

  // 新消息提醒开关
  msg(type) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/user/User/newRemind',
      data: {
        user_id: wx.getStorageSync('userId'),
        type: type
      },
      method: 'POST',
      success(res) {
        console.log('r', res.data.data)
        if (res.data.code == 200) {
          if (type == 3) {
            that.setData({
              msg: res.data.data == 1 ? 'true' : ''
            })
          }
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
      }
    })
  },
  // 退出登录
  quit() {
    wx.showModal({
      content: '确定退出当前帐号吗？',
      cancelColor: '#333333',
      confirmColor: '#333333',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('userId')
          wx.switchTab({
            url: '/pages/my/my-index/my-index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //  页面跳转
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.msg(3);
    wx.getStorageInfo({
      success(res) {
        let size;
        if (res.currentSize > 1024) {
          size = res.currentSize / 1024 + 'M';
        } else {
          size = res.currentSize + 'K'
        }
        that.setData({
          storage: size
        })
      }
    })
  },

  // 清除缓存
  clearStorage() {
    let that = this;
    wx.showModal({
      content: '确定清除缓存吗？',
      cancelColor: '#333333',
      confirmColor: '#333333',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          that.setData({
            storage: 0 + 'M'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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