// pages/my/my-personal/my-personal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    imgUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var user = wx.getStorageSync('userInfo');
    this.setData({
      user: user,
      imgUrl: user.user_image
    })
  },
  // 修改信息
  formSubmit: function(e) {
    let name = e.detail.value.name;
    let introduce = e.detail.value.introduce;
    let that = this;
    if (name != ''){
      if (introduce != '') {
        wx.request({
          url: app.globalData.url + '/user/user/userEdit',
          data: {
            user_id: that.data.user.user_id,
            user_name: name,
            user_introduce: introduce,
          },
          method: 'POST',
          success(res) {
            console.log(res.data)
            if (res.data.code == 200) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '修改失败',
              })
            }
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '签名不能为空',
        })
      }
    }else{
      wx.showToast({
        icon: 'none',
        title: '昵称不能为空',
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //调手机相机
  goPhoto() {
    let that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.photo('camera')
        } else if (res.tapIndex == 1) {
          that.photo('album')
        } else {
          //保存
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })


  },
  photo(type) {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片['album', 'camera']
        wx.showLoading({})
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.url + '/user/user/Userimg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            user_id: that.data.user.user_id,
            type: 2,
          },
          success(res) {
            const data = JSON.parse(res.data);
            console.log(data)
          
            //do something
            if (data.code==200){
              wx.showToast({
                icon: 'none',
                title: '上传成功',
              })
              that.setData({
                imgUrl: tempFilePaths
              })
            }else{
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            }
            wx.hideLoading()
          }
        })

      }
    })
  }

})