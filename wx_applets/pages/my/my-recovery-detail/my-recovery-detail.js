// pages/my/my-recovery-detail/my-recovery-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "我是标题",
    introduction: "我是简介",
    article: "我没违规 我违规了",
    violation: "我违规了",
    booleans: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.introduction || options.article || options.title) {
      this.setData({
        introduction: options.introduction,
        article: options.article,
        title: options.title
      })
    }
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
  //提示框
  toast(content, booleans) {
    wx.showModal({
      // title: '提示',
      content: content,
      showCancel: booleans,
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
  //改变标题
  changeTitle(e){
    this.setData({
      title:e.detail.value
    })
  },
  //跳转编辑文章页
  goArticle() {
    wx.navigateTo({
      url: '../../edit/edit-article/edit-article?title=' + this.data.title + '&article=' + this.data.article + '&introduction=' + this.data.introduction + '&type=1',
    })
  },
  //跳转编辑简介页
  goIntroduction() {
    wx.navigateTo({
      url: '../../edit/edit-introduction/edit-introduction?title=' + this.data.title + '&article=' + this.data.article + '&introduction=' + this.data.introduction + '&type=1',
    })
  },
  //立即发布脑洞
  goRelease() {
    this.toast("立即发布脑洞", true)
  
  }
})