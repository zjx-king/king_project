// pages/my/my-recovery/my-recovery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnBolean: false,
    checkedBolean: false,
    draftsList: [
      {
        name: "骑士幻想夜",
        chapter: "第四章：糖果房子里的巫婆",
        date: "2019-07-03"
      },
      {
        name: "骑士幻想夜",
        chapter: "第四章：糖果房子里的巫婆",
        date: "2019-07-03"
      },
      {
        name: "骑士幻想夜",
        chapter: "第四章：糖果房子里的巫婆",
        date: "2019-07-03"
      }
    ]
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
  //编辑
  draftsEdit() {
    this.setData({
      btnBolean: true
    })
  },
  //取消
  draftsCancel() {
    this.setData({
      btnBolean: false
    })
  },
  //删除
  draftsDelete() {
   
  },
  //选中checkbox
  checkedBox(e) {

  },
  //跳转回收详情
  goDetail(){
    wx.navigateTo({
      url: '../my-recovery-detail/my-recovery-detail',
    })
  }
})