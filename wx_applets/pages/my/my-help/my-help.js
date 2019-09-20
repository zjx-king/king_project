// pages/my/my-help/my-help.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpList:[
      {
        problem:"为什么文章会被锁定？"
      },
      {
        problem: "被封号了怎么办？"
      },
      {
        problem: "原来手机不用了，如何更换绑定手机号？"
      },
      {
        problem: "如何发布脑洞？"
      },
      {
        problem: "违规的文章还能找回吗？"
      }
    ]
  },

  // 获取数据
  getData() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/helpCenter',
      data: {
      },
      method: 'GET',
      success(res) {
        that.setData({
          // list: res.data.data
        })
        console.log(res.data.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})