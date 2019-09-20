// pages/edit/edit-introduction/edit-introduction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    article: "",
    introduction: "",
    articleTitle:"",
    type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.introduction || options.article || options.title || options.articleTitle || options.type) {
      this.setData({
        introduction: options.introduction,
        article: options.article,
        title: options.title,
        articleTitle: options.articleTitle,
        type: options.type
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
  toast(content) {
    wx.showModal({
      // title: '提示',
      content: content,
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
  //监听标题
  changeValue1(e) {
    this.setData({
      title: e.detail.value
    })
  },
  //光标离开获取value
  changeValue(e){
    this.setData({
      introductionLen: e.detail.value.length,
      introduction: e.detail .value
    })
  
  },
  //返回发文章
  goWrite(){
    if (this.data.title == "") {
      this.toast("请填写标题")
    } else if (this.data.introduction == ""){
      this.toast("请输入简介")
    }else{
      wx.removeStorageSync('write')
      wx.redirectTo({
        url: '../edit-write/edit-write?title=' + this.data.title + '&article=' + this.data.article + '&introduction=' + this.data.introduction + '&articleTitle=' + this.data.articleTitle + '&type=' + this.data.type,
          })
    }
   
  }
})