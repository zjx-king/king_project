// pages/edit/editor-index/editor-index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:0,
  },


// 页面跳转
  toPage(){
    wx.navigateTo({
      url: '/pages/edit/editor-label/editor-label',
    })
  },
// 打开app
  toastApp(){
    wx.showModal({
      // title: '提示',
      content: '暂时未开放填写长篇脑洞功能',
      showCancel: false,
      confirmColor: "#000",
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (!wx.getStorageSync('userId')) {
      app.loging();
    }else{
      let that = this
      wx.request({
        url: app.globalData.url + '/user/user/registerDay',
        method: "GET",
        data: {
          user_id: wx.getStorageSync('userInfo').user_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          that.setData({
            day: res.data.data
          })
        }
      })


    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})