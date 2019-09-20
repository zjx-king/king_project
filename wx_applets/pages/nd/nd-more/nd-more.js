// pages/nd/nd-more/nd-more.js
var app = getApp();
var time = require('../../../utils/formatdate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fil: 0,
    cur1: 0,
    cur2: 0,
    page: 1,
    page_size: 10,
    num:0,
    show: true,
    sx1: '最新发布',
    sx2: '标签筛选',
    list: [],
    sxList1: [{
      name: '最新发布', 
        id: 0
      },
      {
        name: '最热', 
        id: 1
      },
      {
        name: '最新更新',
        id: 2
      },
    ],
    sxList2: [],
    filterBoolean1: false,
    filterBoolean2: false
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

  // 筛选下拉框
  filter(e) {
    let id = e.currentTarget.dataset.id;
    
    this.setData({
     
      page:1,
     
    })
    if (e.currentTarget.dataset.id == 1){
      if(this.data.filterBoolean1){
        this.setData({
          filterBoolean2: false,
          filterBoolean1: false
        })
      }else{
        this.setData({
          filterBoolean2: false,
          filterBoolean1: true
        })
      }
        

    }else{
      if (this.data.filterBoolean2) {
        this.setData({
          filterBoolean2: false,
          filterBoolean1: false
        })
      } else {
        this.setData({
          filterBoolean1: false,
          filterBoolean2: true
        })
      }
      
    }

  },
  // 筛选效果
  sx(e) {
    let type = e.currentTarget.dataset.type;
    let cur = e.currentTarget.dataset.cur;
    let text = e.currentTarget.dataset.text;
    if (type == 1) {
      if (cur == 0){
        
        this.lookaround(0, this.data.cur2, 1);
      }else if(cur ==1){
       
        this.lookaround(0, this.data.cur2, 0);
      }else{
       
        this.lookaround(0, this.data.cur2, 2);
      }
      this.setData({
        cur1: cur,
        sx1: text,
        filterBoolean2: false,
        filterBoolean1: false,
        page:1,
        list:[]
      })
    
      
    } else {
      this.setData({
        cur2: cur,
        sx2: text,
        filterBoolean2: false,
        filterBoolean1: false,
        page:1,
        list:[]
      })
    
      this.lookaround(0, this.data.cur2, this.data.cur1);
    }

  },
  //获取脑洞标签
  getTag() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/article/brainHole/getTag',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200){
          that.setData({
            sxList2: res.data.data
          })
        }
       
      }
    })
  },
  //更多脑洞接口
  lookaround(type, tag_id, order){
    let that = this;
    wx.request({
      url: app.globalData.url + '/article/brainHole/lookaround',
      data: {
        brainhole_type: type,
        brainhole_tag_id: tag_id,
        brainhole_order: order,
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
          wx.hideLoading();//关闭加载
          
          //下一篇脑洞缓存
          let obj = {
            type: type,
            brainhole_type: 0,
            tag_id: tag_id,
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
  goDetail(e){
     wx.navigateTo({
       url: '../../index/index-detail/index-detail?brainhole_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTag();
    this.lookaround(0,0,1);
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

    if (this.data.list.length < this.data.num) {
      wx.showLoading({
        title: '加载中',
      })
      this.lookaround(0, this.data.cur2, this.data.cur1);; //灵魂
    } else {
      this.setData({
        show: false
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})