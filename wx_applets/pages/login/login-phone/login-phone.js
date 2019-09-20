// pages/login/login-phone/login-phone.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: '',
    phones: "",
    encryption: "",
    btn: false,
    regRes: false,
    time: "获取验证码",
    dis: true,
    phoneBolean: true
  },
  //输入手机号
  phone(e) {
    this.setData({
      phones: e.detail.value
    })
    if (this.data.phones.length == 11) {
      this.setData({
        dis: false
      })
    } else {
      this.setData({
        dis: true
      })
    }
  },
  //清空手机号
  deletePhone() {
    this.setData({
      phones: "",
      dis: true
    })
  },
  //清空验证码
  deleteCode() {
    this.setData({
      num: "",
      dis: true
    })
  },
  // 倒计时
  timer() {
    var t = 60;
    let countdown = setInterval(() => {
      t--;
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

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    let that = this;


    if (!myreg.test(that.data.phones)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      let str = that.data.phones.substring(3, 7)
      that.setData({
        encryption: that.data.phones.replace(str, "****"),
        time: "60s后重新发送",
        phoneBolean: false
      })
      that.timer();
      // 获取验证码
      wx.request({
        url: app.globalData.url + '/login/login/getPhoneCode',
        data: {
          phone: that.data.phones,
        },
        method: 'POST',
        success(res) {
          if (res.data.code != 200) {
            wx.showLoading({
              title: '获取失败',
              duration: 1500,
              mask: true
            })
          }
        }
      })
    }


  },



  // 获取输入的号码
  num(e) {

    let val = e.detail.value;
    let bool, btn;
    val > 0 ? bool = false : bool = true;

    if (val.length == 6 && this.data.phones.length == 11) {
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
    let that = this;
    let code = this.data.num;
    if (code.length == 6) {
      if (this.reg(code) == false) {
        //验证通过执行的代码

        // 注册登录
        wx.request({
          url: app.globalData.url + '/login/login/loginOrRegister',
          data: {
            phone: that.data.phones,
            code: code
          },
          method: 'POST',
          success(res) {
            if (res.data.code == 200) {
              wx.setStorage({
                key: "userId",
                data: res.data.data
              })
              wx.switchTab({
                url: '/pages/my/my-index/my-index'
              })
            } else {
              wx.showLoading({
                title: '获取失败',
                duration: 1500,
                mask: true
              })
            }

          }
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
    // this.timer();
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