// pages/my/my-drafts/my-drafts.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], //存放选中的数据
    btnBolean: false,
    checkedBolean: false,
    draftsList: [],
    user_id: '',
    sum: 0,
    check: false
  },
  // 跳转页面
  toPage(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.removeStorageSync("tag")
    wx.removeStorageSync('write')
    wx.removeStorageSync('writeBranch')
    if (type == 1) {
      wx.navigateTo({
        url: "/pages/edit/edit-write/edit-write?id=" + id + "&type=" + type + '&ctype=1',
      })
    } else {
      wx.navigateTo({
        url: "/pages/edit/edit-branch/edit-branch?id=" + id + "&type=" + type + '&ctype=1',
      })

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user_id: wx.getStorageSync('userId')
    })

  },

  getData() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/draftList',
      data: {
        user_id: wx.getStorageSync('userId')
      },
      method: 'GET',
      success(res) {
        that.setData({
          draftsList: res.data.data.list,
          sum: res.data.data.sum
        })
        wx.setNavigationBarTitle({
          title: "草稿箱（" + res.data.data.list.length + "/" + res.data.data.sum + ")"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  tit() {
    // setTimeout(() => {
    //   wx.setNavigationBarTitle({
    //     title: "草稿箱（" + this.data.draftsList.length + "/" + this.data.sum + ")"
    //   })
    // }, 600)
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    this.tit()
    that.getData();


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
  del() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/delDraft',
      data: {
        user_id: that.data.user_id,
        delarr: JSON.stringify(that.data.list)
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          })
          that.tit()
        } else {
          if (that.data.list.length > 0) {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }

        }
        that.setData({
          list: [],
          check: false,
          btnBolean: false
        })
        that.getData();
      }
    })
  },
  //选中checkbox
  checkedBox(e) {
    let that = this;
    let data = e.currentTarget.dataset;
    let list = that.data.list;
    let arr = [];
    let newArr;

    arr.push(data);

    // 比较id是否相同
    let bool = list.some(item => item.id === data.id)
    //删除两个数组中id相同的对象
    if (bool) {
      let n = list.filter(item => !arr.some(ele => ele.id === item.id));
      newArr = n;
    } else {
      newArr = list.concat(arr);
    }
    that.setData({
      list: newArr
    })
  }
})