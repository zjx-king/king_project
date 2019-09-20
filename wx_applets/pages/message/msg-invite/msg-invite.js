// pages/message/msg-like/msg-like.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    page_size: 10,
    page: 1,
    total: 0,
    list: []
  },

  // 获取数据
  getData(page) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/readMessage',
      data: {
        type: 3,
        user_id: wx.getStorageSync('userId'),
        page: page,
        limit: that.data.page_size
      },
      method: 'POST',
      success(res) {
        that.processData(res.data.data.list, res.data.data.count)
        console.log(res.data.data)
      }
    })
  },
  // 数据处理

  processData(data, total) {
    let that = this;

    that.setData({
      list: that.data.list.concat(data),
      total: total
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.total > that.data.list.length) {
      var page = that.data.page + 1;
      that.setData({
        page: page
      })
      that.getData(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})