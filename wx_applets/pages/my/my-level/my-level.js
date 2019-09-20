// pages/my/my-level/my-level.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    levelInfo:{},
    task:[],
    level: [{
        lv: '1',
        num: '100'
      },
      {
        lv: '2',
        num: '200'
      },
      {
        lv: '3',
        num: '400'
      },
      {
        lv: '4',
        num: '800'
      },
      {
        lv: '5',
        num: '1600'
      },
      {
        lv: '6',
        num: '3200'
      },

    ]
  },  

  // 跳转页面
  toPage(e) {
    if (e.currentTarget.dataset.url) {
      wx.switchTab({
        url: e.currentTarget.dataset.url,
      })
    }

  },

  // 获取详情
  getLevel() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/levelInfo',
      data: {
        user_id: wx.getStorageSync('userId')
      },
      method: 'GET',
      success(res) {
        that.setData({
          levelInfo: res.data.data
        })
      }
    })
  },

  // 获取任务详情
  getTask() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/userTask',
      data: {
        user_id: that.data.user.user_id
      },
      method: 'GET',
      success(res) {
        that.setData({
          task: res.data.data.list
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var user = wx.getStorageSync('userInfo');
    this.setData({
      user: user
    })

    this.getLevel();
    this.getTask();
    
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