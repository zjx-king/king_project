// pages/my/my-phone/my-phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    num: '',
    btn: false,
    regRes: false,
    time: "60s后重新发送",
    dis: true,
  },
  // 倒计时
  timer() {
    var t = 60;
    let countdown = setInterval(() => {
      t--;
      console.log(t)
      if (t > 0) {
        countdown;
        this.setData({
          time: t + "s后重新发送",
          dis: true,
        })
      } else {
        clearInterval(countdown);
        this.setData({
          time: "重新发送",
          dis: false
        })
      }
    }, 1000)
  },
  // 点击重新发送
  send() {
    this.setData({
      dis: true,
      time: "60s后重新发送",
    })
    this.timer()
  },



  // 获取输入的号码
  num(e) {
    let val = e.detail.value;
    let bool, btn;
    val > 0 ? bool = false : bool = true;

    if (val.length == 6) {
      btn = true;
      this.reg(val) ? btn = false : btn = true;
    } else {
      btn = false;
    }

    this.setData({
      num: val,
      btn: btn
    })

  },

  // 验证号码
  reg(num) {
    var myreg = /^[0-9]{6}$/;
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
    if (phone.length == 6) {
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
    this.setData({
      phone: options.phone,
    })
    this.timer();
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