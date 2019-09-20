// pages/my/my-blacklist/my-blacklist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    page_size: 20,
    page: 1,
    total: 0,
    myId: '',
    type: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user: options.user_id,
      myId: wx.getStorageSync('userId'),
      type: options.type
    })
    this.getData(1);
  },
  // 获取数据
  getData(page) {
    let that = this;
    let url, data;

    if (that.data.type == 0) {
      url = '/user/user/fansList';
      data = {
        user_id: that.data.myId,
        page: page,
        limit: that.data.page_size
      }
    } else {
      url = '/user/user/othersFans';
      data = {
        active_user_id: that.data.myId,
        passive_user_id: that.data.user,
        page: page,
        limit: that.data.page_size
      }
    }

    wx.request({
      url: app.globalData.url + url,
      data: data,
      method: 'GET',
      success(res) {
        that.processData(res.data.data.list, res.data.data.count)
      }
    })
  },
  //添加关注
  add(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let that = this;
    let aa = 'list[' + index + '].status';
    wx.request({
      url: app.globalData.url + '/user/user/canceloraddFollow',
      data: {
        active_user_id: that.data.myId,
        passive_user_id: id,
        type: 1
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            [aa]: '互相关注'
          })
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none'
          })
        }
      }
    })
  },
  //取消关注
  del(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let that = this;
    let aa = 'list[' + index + '].status';

    wx.showModal({
      content: '确定取消关注此人吗',
      cancelColor: '#333333',
      confirmColor: '#333333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/user/user/canceloraddFollow',
            data: {
              active_user_id: that.data.myId,
              passive_user_id: id,
              type: 2
            },
            method: 'POST',
            success(res) {
              if (res.data.code == 200) {
                that.setData({
                  [aa]: '关注'
                })
              } else {
                wx.showToast({
                  title: '取关失败',
                  icon: 'none'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  // 跳转页面
  toPage(e) {
    let id = e.currentTarget.dataset.id;
    let myId = wx.getStorageSync('userId');
    if (id == myId) {
      wx.navigateTo({
        url: "/pages/my/my-mine/my-mine",
      })
    } else {
      wx.navigateTo({
        url: "/pages/my/my-other/my-other?user_id=" + id,
      })
    }

  },

  // 数据处理

  processData(data, total) {
    let that = this;

    that.setData({
      list: that.data.list.concat(data),
      total: total
    })
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
    let that = this;
    if (that.data.total > that.data.list.length) {
      var page = that.data.page + 1;
      that.setData({
        page: page
      })
      that.getData(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})