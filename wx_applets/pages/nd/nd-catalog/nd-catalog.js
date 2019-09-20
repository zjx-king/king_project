// pages/nd/nd-catalog/nd-catalog.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catalogList: [],
    cataType: 0,//目录类型
    article_id: 0,//文章id
    brainhole_id: 0,//脑洞id
  },

  //目录
  catalogueTrunk() {
    let that = this;
    if (that.data.cataType == 1){
      wx.request({
        url: app.globalData.url + "/article/article/catalogueTrunk",
        method: "GET",
        data: {
          brainhole_id: that.data.brainhole_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              catalogList: res.data.data
            })
          }
        }
      })
    }else{
      wx.request({
        url: app.globalData.url + "/article/article/catalogue",
        method: "GET",
        data: {
          brainhole_id: that.data.brainhole_id,
          article_id: that.data.article_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              catalogList: res.data.data
            })
          }
        }
      })
    }
    
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.article_id){
      this.setData({
        article_id: options.article_id
      })
    }
    this.setData({
      brainhole_id: options.brainhole_id,
      cataType: options.cataType
    })
    this.catalogueTrunk();//目录
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
  //返回主目录
  goBack(){
    this.setData({
      cataType: 1
    })
    this.catalogueTrunk();//返回主目录
  },
  //跳转详情页
  goDetail(e) {
    wx.redirectTo({
      url: '../../index/index-read/index-read?cataType=1' + '&brainhole_id=' + e.currentTarget.dataset.brainhole_id + '&article_id=' + e.currentTarget.dataset.article_id,
    })
  },
  //跳转分支页
  goBranch(e){
    wx.navigateTo({
      url: '../nd-catalog-branch/nd-catalog-branch?brainhole_id=' + e.currentTarget.dataset.brainhole_id + '&article_parent_id=' + e.currentTarget.dataset.article_parent_id + '&article_id=' + e.currentTarget.dataset.article_id,
      })
  }
})