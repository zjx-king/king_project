// pages/index/search-user/search-user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'searchText':'',
    "page": 1,
    "user_num": 0,
    "show": true,
    "userList": [],
    user_id: wx.getStorageSync('userInfo').user_id
  },
  // 跳转他人主页
  goOthers: function (e) {
    let id = e.currentTarget.dataset.id
    if (wx.getStorageSync('userId')) {
      if (id == this.data.user_id) {
        wx.navigateTo({
          url: '../../my/my-mine/my-mine',
        })
      } else {
        wx.navigateTo({
          url: '../../my/my-other/my-other?user_id=' + id,
        })
      }
    } else {
      app.loging(); // 判断是否登录
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      searchText: options.searchText
    })
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
    let searchText = this.data.searchText;
    this.goUser(searchText)
  },
  //请求搜索数据
  goUser(searchText) {
    let that = this;
    wx.request({
      url: app.globalData.url + "/index/brainhole/getFunSoul",
      method: "GET",
      data: {
        "keyword": searchText,
        "page": that.data.page,
        "user_id": wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code === 200) {
          const oldUser = that.data.userList;
          if (res.data.data.count > that.data.userList.length) {
            that.setData({
              "userList": oldUser.concat(res.data.data.list),
              "user_num": res.data.data.count
            })
          }
          // 隐藏加载框
          wx.hideLoading();
        }
      }
    })
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
    let pages = this.data.page;
    let searchText = this.data.searchText;
    pages = pages + 1;
    this.setData({
      page: pages
    })

    if (this.data.userList.length < this.data.user_num) {
        wx.showLoading({
          title: '加载中',
        })
        this.goUser(searchText);
      } else {
        this.setData({
          "show": false
        })
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})