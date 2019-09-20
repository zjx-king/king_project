// pages/index/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    left: 0,
    holeList:[],
    hole:null,
    start:-1,//超级脑洞
    starts:0,//为你推荐
    brainhole: [],//推荐数组
    total:[],//存推荐数组
    brainhole_num:0,//推荐脑洞数量
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSuperBrainHole();//超级脑洞

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
    // 监听网络状态
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        if (res.networkType == 'none') {
          wx.showLoading({
            title: '无网络',
            mask: true
          })
        } else {
          wx.hideLoading()
        }
      }
    })
    if (wx.getStorageSync('userId')) {
      this.recommendForYou();//为你推荐
    }
    
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // swiper下标改变
  change(e) {
    if (e.detail.current == 1) {
      this.setData({
        left: "25%"
      })
    } else if (e.detail.current == 2) {
      this.setData({
        left: "50%"
      })
      if (wx.getStorageSync('userId')) {
        this.recommendForYou();//为你推荐
      }else{
        app.loging();
      }
    } else if (e.detail.current == 3) {
      this.setData({
        left: "75%"
      })
    } else if (e.detail.current == 0) {
      this.setData({
        left: 0
      })
    }
  },
  //超级脑洞接口
  getSuperBrainHole(){
    let that = this;
    wx.request({
      url: app.globalData.url+'/article/brainHole/getSuperBrainHole', 
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          hole: res.data.data.splice(0, 1)[0],
          holeList:res.data.data
        })
      }
    })
  },
  //为你推荐接口
  recommendForYou() {
    
    let that = this;
    wx.request({
      url: app.globalData.url + '/article/brainHole/recommendForYou',
      data: {
        user_id: wx.getStorageSync('userInfo').user_id,
        page:that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          total: res.data.data.brainhole,
          brainhole_num: res.data.data.brainhole_num
        })
        that.setData({
          brainhole: that.data.total.splice(0, 4)
        })
      }
    })
  },
  //跳转搜索页
  goSearch() {
    wx.navigateTo({
      url: '../index-search/index-search',
    })
  },
  //换一批超级脑洞
  goChange(){
    let start = this.data.start;
    start++;
    if (this.data.holeList.length == 0){
      this.setData({
        start:-1
      })
      this.getSuperBrainHole();
    }else{
        this.setData({
          hole: this.data.holeList.splice(start, start + 1)[0]
        })
    } 
    
   
  },
  //换一批为你推荐
  changeBrain(){
    if (this.data.brainhole_num / 12 < this.data.page){
      this.setData({
        page:0
      })
    }
      this.setData({
        brainhole: this.data.total.splice(0,4)
      })
    if (this.data.brainhole.length == 0){
      this.setData({
        page:this.data.page+1
      })
      this.recommendForYou()
      }
  },
  //跳转脑洞列表页
  goList(e){
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../../nd/nd-list/nd-list?type='+ type,
    })
  },
  //跳转文章详情
  goDetail(e){
    wx.navigateTo({
      url: '../index-detail/index-detail?brainhole_id=' + e.currentTarget.dataset.id,
    })
  }

})