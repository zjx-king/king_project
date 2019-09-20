// pages/my/my-mine/my-mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    tabPage: true,
    mask: false,
    black: false,
    follow: false,
    ohterId: '',
    myInfo: {},
    userInfo: {},
    height: '',
    h1: '',
    cur: 0,
    user: '',
    headTop: 0,
    navTop: 0,
    page_size: 10,
    page0: 1,
    page1: 1,
    page2: 1,
    page3: 1,
    total0: 0,
    total1: 0,
    total2: 0,
    total3: 0,
    nav: [{
        name: '脑洞'
      },
      {
        name: '追更'
      },
      {
        name: '喜欢'
      }
    ],
    footNav1: [{
      name: "更换封面"
    }],
    list0: [],
    list1: [],
    list2: [],
    list3: []
  },

  // 举报
  toReport() {

    let obj = {
      report_focus_id: this.data.ohterId,
      type: 3
    }
    wx.setStorage({
      key: "report",
      data: obj
    })
    setTimeout(() => {
      this.setData({
        mask: false
      })
      wx.navigateTo({
        url: '../../common/report/report',
      })

    }, 0)

  },

  // 关闭遮罩层
  closeMask() {
    this.setData({
      mask: false
    })
  },
  // 打开菜单
  openMask() {
    this.setData({
      mask: true
    })
  },
  // 关注操作
  follow(e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    wx.request({
      url: app.globalData.url + '/user/user/canceloraddFollow',
      data: {
        active_user_id: that.data.myInfo.user_id,
        passive_user_id: that.data.ohterId,
        type: type
      },
      method: 'POST',
      success(res) {
        if (res.data.data == "请先移出黑名单"){
          wx.showToast({
            title: res.data.data,
            icon:'none'
          })
        }
        that.getBlack();
      }
    })
  },

  // 判断拉黑状态
  getBlack() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/User/userRelation',
      data: {
        active_user_id: that.data.myInfo.user_id,
        passive_user_id: that.data.ohterId
      },
      method: 'GET',
      success(res) {
        that.setData({
          black: res.data.data.black_state == "拉黑" ? false : true,
          follow: res.data.data.follow_state == "关注" ? false : true
        })
      }
    })
  },

  // 拉黑操作
  addBlack() {
    let that = this;


    wx.showModal({
      content: '确定拉黑该用户吗？',
      cancelColor: '#333333',
      confirmColor: '#333333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/user/user/addBlack',
            data: {
              active_user_id: that.data.myInfo.user_id,
              passive_user_id: that.data.ohterId
            },
            method: 'POST',
            success(res) {
              wx.showToast({
                title: res.data.data,
                icon: 'none'
              })
              that.getBlack()
             

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
        that.setData({
          mask: false
        })
      }
    })



  },
  // 切换发布与参与
  tabPage(e) {
    let id = e.currentTarget.dataset.id;
    let page;
    id == 1 ? page = true : page = false;
    this.setData({
      tabPage: page
    })
  },


  // 返回首页
  toIndex() {
    wx.switchTab({
      url: '/pages/index/home/home'
    })
  },

  // 导航切换
  navTab(e) {
    this.setData({
      cur: e.currentTarget.dataset.cur
    })
  },



  // 获取数据
  getData(type, page) {
    let that = this;
    let url;
    switch (type) {
      case 0:
        url = '/user/user/brainHoleList'; //用户发布
        break;
      case 1:
        url = '/user/user/userArticleList'; //用户参与
        break;
      case 2:
        url = '/user/user/userLikeList'; //用户喜欢
        break;
      case 3:
        url = '/user/User/continuous'; //用户追更
        break;
    }
    wx.request({
      url: app.globalData.url + url,
      data: {
        user_id: that.data.ohterId,
        page: page,
        limit: that.data.page_size
      },
      method: 'GET',
      success(res) {
        that.processData(type, res.data.data.list, res.data.data.count)
      }
    })

  },

  // 数据处理

  processData(type, data, total) {
    let that = this;

    switch (type) {
      case 0:
        that.setData({
          list0: that.data.list0.concat(data),
          total0: total
        })
        break;
      case 1:
        that.setData({
          list1: that.data.list1.concat(data),
          total1: total
        })
        break;
      case 2:
        that.setData({
          list2: that.data.list2.concat(data),
          total2: total
        })
        break;
      case 3:
        that.setData({
          list3: that.data.list3.concat(data),
          total3: total
        })
        break;
    }
  },

  // 页面滚动加载1
  lower0(e) {
    let that = this;
    if (that.data.total0 > that.data.list0.length) {
      var page = that.data.page0 + 1;
      that.setData({
        page0: page
      })
      that.getData(0, page)
    }

  },
  // 页面滚动加载2
  lower1(e) {
    let that = this;
    if (that.data.total1 > that.data.list1.length) {
      var page = that.data.page1 + 1;
      that.setData({
        page1: page
      })
      that.getData(1, page)
    }

  },
  // 页面滚动加载3
  lower2(e) {
    let that = this;
    if (that.data.total2 > that.data.list2.length) {
      var page = that.data.page2 + 1;
      that.setData({
        page2: page
      })
      that.getData(2, page)
    }


  },

  // 页面滚动加载4
  lower3(e) {
    let that = this;
    if (that.data.total3 > that.data.list3.length) {
      var page = that.data.page3 + 1;
      that.setData({
        page3: page
      })
      that.getData(3, page)
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    wx.showLoading({})
    // 从缓存中获取用户信息
    that.setData({
      myInfo: wx.getStorageSync('userInfo'),
      ohterId: options.user_id
    })

    that.getData(0, 1);
    that.getData(1, 1);
    that.getData(2, 1);
    that.getData(3, 1);


    


  },
  /** 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        // if (that.data.black == "拉黑") {
          var h1, h2;
          // 获取页面元素高度
          let query = wx.createSelectorQuery();
          query.select('.head').boundingClientRect(rect => {
            h1 = rect.height;
          }).exec();


          // 获取页面元素高度
          let query1 = wx.createSelectorQuery();
          query1.select('.nav').boundingClientRect(rect => {
            h2 = rect.height;
          }).exec();


          setTimeout(() => {
            that.setData({
              height: res.windowHeight - h1 - h2
            })

          }, 1000)
        }
      // }
    })


    setTimeout(() => {
      // 获取页面元素高度
      let query = wx.createSelectorQuery();
      query.select('.tab-nav').boundingClientRect(rect => {
        that.setData({
          h1: rect.height
        })
      }).exec();
      wx.hideLoading()

      console.log(that.data.height, that.data.h1)
    }, 1000)
  },


  // 跳转页面
  toPage(e) {
    if (e.currentTarget.dataset.url) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }

  },
  // 跳转页面
  toPage1(e) {
    wx.removeStorageSync("nextBrainHole")
    let brainhole = e.currentTarget.dataset.brainhole;
    let article = e.currentTarget.dataset.article;
    if (article) {
      wx.navigateTo({
        url: "/pages/index/index-read/index-read?nextBrainHole=1&cataType=1&brainhole_id=" + brainhole + "&article_id=" + article
      })
    } else {
      wx.navigateTo({
        url: "/pages/index/index-detail/index-detail?nextBrainHole=1&brainhole_id=" + brainhole,
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/userInfo',
      data: {
        user_id: that.data.ohterId,
      },
      method: 'GET',
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            userInfo: res.data.data
          })
        }
      }
    })

    this.getBlack();
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

  }
})