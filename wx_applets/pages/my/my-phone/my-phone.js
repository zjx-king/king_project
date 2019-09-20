// pages/my/my-phone/my-phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: '',
    hidden: true,
    btn: false,
    regRes: false,
  },
  // 清空输入
  clear() {
    this.setData({
      num: '',
      hidden: true,
      btn: false,
    })
  },
  // 获取输入的号码
  num(e) {
    let val = e.detail.value;
    let bool, btn;
    val > 0 ? bool = false : bool = true;

    if (val.length == 11) {
      btn = true;
      this.reg(val) ? btn = false : btn = true;
    } else {
      btn = false;
    }

    this.setData({
      hidden: bool,
      num: val,
      btn: btn
    })

  },

  // 验证号码
  reg(num) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    let bool;
    myreg.test(num) ? bool = false : bool = true;
    this.setData({
      regRes: bool
    })

    return bool;
  },

  // 提交
  submit() {
    let phone = this.data.num;
    if (phone.length == 11) {
      if (this.reg(phone) == false) {
        // 验证通过执行的代码
        wx.navigateTo({
          url: '/pages/my/my-phoneNew/my-phoneNew',
        })
      }
    } else {
      this.setData({
        btn: false,
      })
    }
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