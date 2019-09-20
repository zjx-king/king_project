// pages/nd/nd-list/nd-list.js
var app = getApp();
var time = require('../../../utils/formatdate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    page_size: 10,
    list: [],
    num: 0,
    show: true,
    type:0
  },

  // 跳转他人主页
  goOthers: function (e) {
    let id = e.currentTarget.dataset.id
    if (wx.getStorageSync('userId')) {
      if (id == wx.getStorageSync('userId')) {
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
  //更多脑洞接口
  lookaround(type) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/article/brainHole/lookaround',
      data: {
        brainhole_type: type,
        brainhole_tag_id: 0,
        brainhole_order: 0,
        page: that.data.page,
        page_size: that.data.page_size
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200){
          let arr = res.data.data.list
          for (let i = 0; i < arr.length; i++) {
            arr[i].brainhole_addtime = time.formatTimeTwo(arr[i].brainhole_addtime, 'Y-M-D')
          }
          that.setData({
            num: res.data.data.count,
            list: that.data.list.concat(arr)
          })
          wx.hideLoading();

          //下一篇脑洞缓存
          let obj = {
            type: 0,
            brainhole_type: type,
            tag_id: 0,
            page: that.data.page
          }
          wx.setStorage({
            key: "nextBrainHole",
            data: obj
          })

        }
      }
    })
  },
  //跳转详情
  goDetail(e) {
    wx.navigateTo({
      url: '../../index/index-detail/index-detail?brainhole_id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 1){
      wx.setNavigationBarTitle({ title: "长篇脑洞" })
    }else{
      wx.setNavigationBarTitle({ title: "短篇脑洞" })
    }
    this.setData({
      type: options.type
    })
    this.lookaround(this.data.type);//脑洞列表

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
    let pages = this.data.page;
    pages = pages + 1;
    this.setData({
      page: pages
    })

    if (this.data.list.length < this.data.num) {
      wx.showLoading({
        title: '加载中',
      })
      this.lookaround(this.data.type); 
    } else {
      this.setData({
        show: false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})