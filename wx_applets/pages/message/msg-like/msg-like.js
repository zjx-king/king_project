// pages/message/msg-like/msg-like.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        type: 1,
        user_id: wx.getStorageSync('userId'),
        page: page,
        limit: that.data.page_size
      },
      method: 'POST',
      success(res) {
        that.processData(res.data.data.list, res.data.data.count)
        wx.hideLoading()
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
  // 跳转页面
  toPage2(e) {
    let id = e.currentTarget.dataset.id;
    let myId = wx.getStorageSync('userId');

    console.log(id, myId)

    if (id == myId) {
      wx.navigateTo({
        url: "/pages/my/my-mine/my-mine",
      })
    } else {
      wx.navigateTo({
        url: "/pages/my/my-other/my-other?user_id=" + id,
      })
    }

  },

  // 跳转页面
  toPage1(e) {
    wx.removeStorageSync("nextBrainHole")
    let brainhole = e.currentTarget.dataset.brainhole;
    let article = e.currentTarget.dataset.article;
    let comment = e.currentTarget.dataset.comment;
    let msg = e.currentTarget.dataset.msg;


    if (msg) {
      if (comment == 0) {
        wx.navigateTo({
          url: "/pages/index/index-comment/index-comment?comment_id=" + comment + "&article_id=" + article,
        })
      } else {
        wx.navigateTo({
          url: "/pages/index/comment-detail/comment-detail?comment_id=" + comment + "&article_id=" + article,
        })

      }
    } else {
      if (article) {
        wx.navigateTo({
          url: "/pages/index/index-read/index-read?nextBrainHole=1&cataType=1&brainhole_id=" + brainhole + "&article_id=" + article
        })
      } else if (brainhole) {
        wx.navigateTo({
          url: "/pages/index/index-detail/index-detail?nextBrainHole=1&brainhole_id=" + brainhole,
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({})
    this.getData(1)
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