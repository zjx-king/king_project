// pages/my/my-blacklist/my-blacklist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    page_size: 20,
    page: 1,
    total: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var user = wx.getStorageSync('userInfo');
    this.setData({
      user: user
    })
    this.getData(1)
  },
  // 获取数据
  getData(page) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/blackList',
      data: {
        user_id: that.data.user.user_id,
        page: page,
        limit: that.data.page_size
      },
      method: 'GET',
      success(res) {
        that.processData(res.data.data.list, res.data.data.count)
      }
    })
  },

  //删除黑名单
  del(e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.showModal({
      content: '确定移除此人吗',
      cancelColor: '#333333',
      confirmColor: '#333333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/user/user/cancelBlack',
            data: {
              // active_user_id: that.data.user.user_id,
              other_id: id
            },
            method: 'POST',
            success(res) {
              if (res.data.code == 200) {
                that.setData({
                  page: 1,
                  list: []
                })
                that.getData(1)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
  onShareAppMessage: function() {

  }
})