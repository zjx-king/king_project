// pages/nd/nd-catalog-branch/nd-catalog-branch.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brainhole_id: 0,
    article_id: 0,
    article_parent_id: 0,
    thread: {},
    cataType: 0,
    catalogList: []
  },
  //分支目录
  catalogueBranch(){
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/article/catalogueBranch",
      method: "GET",
      data: {
        brainhole_id: that.data.brainhole_id,
        article_parent_id: that.data.article_parent_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            thread: res.data.data.splice(0,1)[0],
            catalogList: res.data.data
          })
      
        }
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.cataType){
      this.setData({
        cataType: options.cataType
      })
    }
    this.setData({
      brainhole_id: options.brainhole_id,
      article_id: options.article_id,
      article_parent_id: options.article_parent_id
    })
    this.catalogueBranch();//分支目录
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

  },
  //返回上一级
  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  //跳转详情页
  goDetail(e) {
    wx.redirectTo({
      url: '../../index/index-read/index-read?cataType=1' + '&brainhole_id=' + e.currentTarget.dataset.brainhole_id + '&article_id=' + e.currentTarget.dataset.article_id,
    })
  }
})