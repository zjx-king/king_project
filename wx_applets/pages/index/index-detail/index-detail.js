// pages/index/index-detail/index-detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    brainhole_id: 0,
    pull:false,
    isFold: true,
    hideHeight:0,
    opacityHeight:0
  },
  //展开
  showAll: function () {
    this.setData({
      isFold: !this.data.isFold,
    })
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

  //脑洞详情数据
  brainholedetails(brainhole_id) {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/brainHole/brainholedetails",
      method: "GET",
      data: {
        "brainhole_id": brainhole_id,
        "user_id": wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            detail: res.data.data
          })
          if (that.data.detail.brainhole_title.length > 8){
            let title = that.data.detail.brainhole_title.slice(0, 8)
            wx.setNavigationBarTitle({
              title: title+"...",
            })
          }else{
            wx.setNavigationBarTitle({
              title: that.data.detail.brainhole_title,
            })
          }
        }
      }
    })
  },
  //追更接口
  collection() {

    let that = this;
    that.getBlack(that.data.detail.user_id)

    setTimeout(() => {
      if (that.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
      wx.request({
        url: app.globalData.url + "/article/brainHole/collection",
        method: "POST",
        data: {
          article_type: 1,
          article_id: that.data.brainhole_id,
          user_id: wx.getStorageSync('userInfo').user_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            that.brainholedetails(that.data.brainhole_id)
          }
        }
      })
      }
    }, 500)
    

  },
  //查看主干脑洞
  showThreadArticle() {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/article/showThreadArticle",
      method: "GET",
      data: {
        brainhole_id: that.data.brainhole_id,
        article_id: 0,
        user_id: wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          if (res.data.data.length == 0) {
            that.writeContinue();//续写
          }else{
            wx.navigateTo({
              url: '../index-read/index-read?brainhole_id=' + that.data.brainhole_id + '&article_id=0', //阅读页
            })
          }
         
        } 
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.brainholedetails(options.brainhole_id)
    this.setData({
      brainhole_id: options.brainhole_id
    })
    

    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
    if (getCurrentPages()[1].route == "pages/nd/nd-list/nd-list" || getCurrentPages()[1].route == "pages/nd/nd-more/nd-more"){
      console.log("不清除nextBrainHole")
    }else{
      wx.removeStorageSync("nextBrainHole")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    var query = wx.createSelectorQuery();
    query.select('.hide').boundingClientRect();
    query.select('.opacity').boundingClientRect();
    setTimeout(()=>{
      query.exec(function (res) {
        //res就是 所有标签为mjltest的元素的信息 的数组
        //取高度
        that.setData({
          hideHeight: res[0].height,
          opacityHeight: res[1].height,
        })
      })
    },100)
    
   
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // if (ops.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(ops.target)
    // }
    return {
      title: '转发',
      path: 'pages/index/index-detail/index-detail?brainhole_id=' + this.data.brainhole_id,
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // //可以获取群组信息
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
  // 判断拉黑状态
  getBlack(ohterId) {
    let that = this;
    if (wx.getStorageSync('userId')) {
      wx.request({
        url: app.globalData.url + '/user/User/userRelation',
        data: {
          active_user_id: wx.getStorageSync('userInfo').user_id,
          passive_user_id: ohterId
        },
        method: 'GET',
        success(res) {
          if (res.data.data.black_state == "被拉黑" || res.data.data.black_state == "已拉黑") {
            that.setData({
              pull: true
            })

          }

        }
      })
    } else {
      app.loging(); // 判断是否登录
    }

  },
  //跳转目录页
  goCatalog() {

    let that = this;
      wx.request({
        url: app.globalData.url + "/article/article/catalogueTrunk",
        method: "GET",
        data: {
          brainhole_id: this.data.brainhole_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '暂无目录',
              icon:'none'
            })
          }else{
            wx.navigateTo({
              url: '../../nd/nd-catalog/nd-catalog?brainhole_id=' + that.data.brainhole_id + '&cataType=1',
            })
          }
        }
      })
   
  },
  //跳转阅读页
  goRead() {
    this.showThreadArticle(); //查看主干
  },
  
  //续写
  writeContinue() {
    if (this.data.detail.brainhole_type == "1") {
      wx.showModal({
        // title: '提示',
        content: "暂未开放写长篇功能",
        showCancel: false,
        confirmColor: "#000",
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.redirectTo({
        url: '../../edit/edit-branch/edit-branch?article_type=1' + '&brainhole_id=' + this.data.brainhole_id + '&article_chapter=0' + '&article_parent_id=0',
      })

    }

  },


})