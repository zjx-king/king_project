// pages/index/index-search/index-search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "tip": true,
    "user": false,
    "searchHot": [],
    "searchRecord": [],
    "searchList": [],
    "num":0,
    "searchText":"",
    "page":1,
    "show":true,
    "imgs":[],
    user_count:0,
    cancelBoolean:true
  },

  //光标离开
  // outFo: function(e) {
  //   let search = e.detail.value;
  //   this.setData({
  //     "searchText": search
  //   })
  // },
  cancel: function(){
    this.setData({
      "searchText":"",
      "tip": true,
      "user": false,
      "searchList": [],
      "imgs": [],
      "show": true,
      "page": 1,
      cancelBoolean: true
    })
  },
  //监听输入框
  watchInput: function(e) {
      let searchText = e.detail.value;
    this.setData({
      "searchText": e.detail.value
    })
        if (searchText.length <= 0) {
          this.setData({
            "tip": true,
            "user": false,
            "searchList": [],
            "imgs": [],
            "show": true,
            "page": 1,
            cancelBoolean: true
          })
        }else{
          this.setData({
            cancelBoolean: false
          })
          
        }
  },
  //搜索
  search: function() {
    this.setData({
      "tip": false,
      "user": true,
      "page": 1,
      "searchList": [],
      imgs:[],
    })
    this.goRequest(this.data.searchText);
    
  },
  //提示搜索
  clickHot: function(e) {
    let searchText = e.target.dataset.h
    this.setData({
      "searchText": searchText,
      "tip": false,
      "user": true,
      cancelBoolean: false
    })
    this.goRequest(searchText); //调用搜索接口
  },
  //删除搜索历史
  deletes: function() {
    let that = this;
    wx.removeStorage({
      key: 'searchRecord',
      success(res) {
        that.setData({
          "searchRecord": []
        })
      }
    })
  },
  //搜索记录数据处理
  recordChange: function () {
    if (this.data.searchList.length > 0 || this.data.imgs.length > 0) {
      this.data.searchRecord.unshift(this.data.searchText)
      let arr = this.data.searchRecord;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '') {
          arr.splice(i, 1);
          i = i - 1;
        }
      };
      let array = new Set(arr)
      let arr2 = [...array].slice(0,20)
      wx.setStorage({
        key: "searchRecord",
        data: arr2
      })
    }
  },
  //进入相关用户列表
  clickState: function() {
    let searchText = this.data.searchText;
    wx.navigateTo({
      url: '../search-user/search-user?searchText=' + searchText,
    })
  },
  //请求搜索数据
  goRequest(searchText) {
    let that = this;
    wx.request({
      url: app.globalData.url + "/index/search/getArticleList",
      method: "GET",
      data: {
        "keyword": searchText,
        "page": that.data.page
      },
      success(res) {
        let oldList = that.data.searchList;
        if(res.data.code == 200){
          if (that.data.searchList.length < res.data.data.count){
            that.setData({
              imgs: res.data.data.userlist,
              user_count: res.data.data.user_count,
              searchList: oldList.concat(res.data.data.datalist),
              num: res.data.data.count
            })
          }
          that.setData({
            imgs: res.data.data.userlist,
            user_count: res.data.data.user_count,
          })

          wx.hideLoading();
          that.recordChange();//筛选搜索记录
          //搜索记录
          wx.getStorage({
            key: 'searchRecord',
            success(res) {
              that.setData({
                "searchRecord": res.data
              })
            }
          })
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值

    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    //搜索历史记录
    wx.getStorage({
      key: 'searchRecord',
      success(res) {
        that.setData({
          "searchRecord": res.data
        })
      }
    })
 

    
    //热门标题数据
    wx.request({
      url: app.globalData.url + "/index/search/hotSearch",
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          "searchHot": res.data.data
        })
      }
    })


  },
  
  //跳转文章详情
  goDetail: function(e) {
    if (wx.getStorageSync('userId')){
      wx.removeStorageSync("nextBrainHole")
      wx.navigateTo({
        url: '../index-detail/index-detail?brainhole_id=' + e.currentTarget.dataset.id
      })
    }else{
      app.loging(); // 判断是否登录
    }
    
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
    let searchText = this.data.searchText;
    pages = pages + 1;
    this.setData({
      page: pages
    })
      if (this.data.searchList.length < this.data.num) {
        wx.showLoading({
          title: '加载中',
        })
        this.goRequest(searchText);
      } else {
        this.setData({
          "show": false
        })
      }
    
    
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})