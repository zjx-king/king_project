// pages/common/report-xq/report-xq.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    status: false,
    report_id: 0, //举报id
    report_focus_id:0, //举报文章/用户/评论id
    type:0,//举报类型
    report_content:"", //举报内容
  },

  // 选择图片
  chooseImg() {
    let that = this;
    let num = 3 - that.data.list.length;
    if (num > 0) {
      wx.chooseImage({
        count: num,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;

          that.setData({
            list: that.data.list.concat(res.tempFilePaths)
          })
          if (that.data.list.length == 3) {
            that.setData({
              status: true
            })
          }
        }
      })
    }

  },
  // 删除图片
  close(e) {
    let that = this;
    let id = e.target.dataset.id;
    let arr = [];
    let list = that.data.list;

    for (let i = 0; i < list.length; i++) {
      if (i != id) {
        arr.push(list[i]);
      }
    }

    that.setData({
      list: arr
    })

    if (that.data.list.length < 3) {
      that.setData({
        status: false
      })
    }
  },
  // 举报
  saveReport() {
   
    let that = this;
    if (that.data.report_content == ""){
      wx.showToast({
        title: '举报内容不能为空',
        icon: 'none'
      })
    }else{
      wx.request({
        url: app.globalData.url + '/index/Brainhole/saveReport',
        method: "POST",
        data: {
          user_id: wx.getStorageSync('userId'),
          report_id: that.data.report_id,
          report_focus_id: wx.getStorageSync('report').report_focus_id,
          type: wx.getStorageSync('report').type,
          report_content: that.data.report_content,
          image: that.data.list
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '举报成功',
              icon: 'none'
            })
            that.setData({
              report_content: "",
              list: []
            })
          } else {
            wx.showToast({
              title: '举报失败',
              icon: 'none'
            })
          }
        }
      })
    }
    

  },
  //举报内容
  reportContent(e){
    this.setData({
      report_content: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      report_id: options.report_id
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})