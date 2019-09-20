// pages/nd/nd-index/nd-index.js
var app = getApp();
var time = require('../../../utils/formatdate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: false,
    page:1,
    show: true,
    zgList: [],
    gzList:[],
    gz_num:0,
    zg_num:0,
    user_imageList:[]
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
  //跳转阅读
  goDetail(e) {
    wx.removeStorageSync("nextBrainHole");
    if (e.currentTarget.dataset.article_chapter == 0 || e.currentTarget.dataset.previous_article_id == 0){
      wx.navigateTo({
        url: '../../index/index-detail/index-detail?brainhole_id=' + e.currentTarget.dataset.brainhole_id
      })
    }else{
      wx.navigateTo({
        url: '../../index/index-read/index-read?brainhole_id=' + e.currentTarget.dataset.brainhole_id + '&article_id=' + e.currentTarget.dataset.previous_article_id + '&cataType=1',
      })
    }
   

  },
  //跳转详情
  goLike(e) {
    wx.removeStorageSync("nextBrainHole"); 
    if (e.currentTarget.dataset.draft_type == 2){
      wx.navigateTo({
        url: '../../index/index-read/index-read?brainhole_id=' + e.currentTarget.dataset.brainhole_id + '&article_id=' + e.currentTarget.dataset.article_id + '&cataType=1',
      })
    }else{
      wx.navigateTo({
        url: '../../index/index-detail/index-detail?brainhole_id=' + e.currentTarget.dataset.brainhole_id
      })
    }
   
  },

  // tab切换
  tab(e) {
    let id = e.target.dataset.id;
    let tab;
    id == 0 ? tab = false : tab = true;
    this.setData({
      tab: tab,
      page:1
    })
  },

  // 页面跳转
  toPage(e){
    let url = e.currentTarget.dataset.url;
    if (url == "/pages/nd/nd-user/nd-user"){
      if (wx.getStorageSync('userId')){
        wx.navigateTo({
          url: url,
        })
      }else{
        app.loging();
      }
    }else{
      wx.navigateTo({
        url: url,
      })
    }
    
  },
  //追更列表
  getUpdateList(){
    let that = this;
    wx.request({
      url: app.globalData.url + '/index/brainhole/getUpdateList', 
      data: {
        user_id: wx.getStorageSync('userInfo').user_id,
        page:that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200){
          let oldList = that.data.zgList
          if (oldList.length < res.data.data.count){
            that.setData({
              zg_num: res.data.data.count,
              zgList: oldList.concat(res.data.data.list)
            })
          }
          wx.hideLoading();//关闭加载
        }
        
        
      }
    })
  },
  //关注列表
  getFollowList() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/index/brainhole/getFollowList',
      data: {
        user_id: wx.getStorageSync('userInfo').user_id,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200){

          let arr = res.data.data.list
          for (let i = 0; i < arr.length; i++) {
            arr[i].add_time = time.formatTimeTwo(arr[i].add_time, 'M月D日 h:m')
          }
          if (that.data.gzList.length < res.data.data.count) {
            that.setData({
              gz_num: res.data.data.count,
              gzList: that.data.gzList.concat(arr)
            })
          }
          
          wx.hideLoading();//关闭加载
        }
       
      }
    })
  },
  //更多有趣的灵魂
  getFunSoul(){
    let that = this;
    wx.request({
      url: app.globalData.url + '/index/brainhole/getFunSoul',
      data: {
        page: that.data.page,
        "user_id": wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.code == 200){
          that.setData({
            user_imageList: res.data.data.list.splice(0, 5)
          })
         
        }
        
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
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
    if (wx.getStorageSync('userId')) {
      this.setData({
        page:1,
        zgList: [],
        gzList: [],
      })
      this.getUpdateList();//追更
      this.getFollowList();//关注
      this.getFunSoul();//有趣灵魂
    }else{
      this.setData({
        zgList: [],
        gzList: [],
        user_imageList:[]
      })
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
    let pages = this.data.page;
    pages = pages + 1;
    this.setData({
      page: pages
    })
    if (this.data.tab){
      if (this.data.gzList.length < this.data.gz_num) {
        wx.showLoading({
          title: '加载中',
        })
        this.getFollowList(); //关注
      } 
    }else{
      if (this.data.zgList.length < this.data.zg_num) {
        wx.showLoading({
          title: '加载中',
        })
        this.getUpdateList(); //追更
      } 
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})