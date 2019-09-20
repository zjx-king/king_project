// pages/edit/edit-branch/edit-branch.js
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: "",
    articleTitle: "",
    booleans: true,
    checkBoolean: false,
    timeBolean: true,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: new Date().getFullYear(),
    timing: "",//定时
    drafts: 1, //草稿箱数量
    brainhole_id: 0,//脑洞id
    article_id: 0,//文章id
    article_type: 0,//续写/分支
    article_chapter: 0,//当前章节
    article_parent_id: 0,//id
    type:0,
    id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.draftsLength();//草稿箱接口
    
    if (options.article_type == 1){
     wx.setNavigationBarTitle({
       title: '续写',
     })
     this.setData({
       article_chapter: Number(options.article_chapter) + 1,
       article_type: options.article_type,
       brainhole_id: options.brainhole_id,
       article_parent_id: options.article_parent_id
     })
    
    }else{
      wx.setNavigationBarTitle({
        title: '写分支',
      })
      this.setData({
        article_chapter: options.article_chapter,
        article_type: options.article_type,
        brainhole_id: options.brainhole_id,
        article_parent_id: options.article_parent_id
      })
    }

    if (wx.getStorageSync('writeBranch')) {
      this.setData({
        article: wx.getStorageSync('writeBranch').article,
        articleTitle: wx.getStorageSync('writeBranch').articleTitle
      })
    }
   

    if(options.ctype == 1){
      this.setData({
        id: options.id,
        type: options.type
      })
      this.getDraftDetail();//获取草稿详情
    }
  


    // 获取完整的年月日 时分秒，以及默认显示的数组

    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //监听标题
  changeValue1(e) {
    this.setData({
      articleTitle: e.detail.value
    })
    let obj = {
      article: this.data.article,
      articleTitle: this.data.articleTitle,
    }
    wx.setStorage({
      key: 'writeBranch',
      data: obj,
    })
   
  },
  //监听文章
  changeValue2(e) {
    this.setData({
      article: e.detail.value
    })
    let obj = {
      article: this.data.article,
      articleTitle: this.data.articleTitle,
    }
    wx.setStorage({
      key: 'writeBranch',
      data: obj,
    })
  },

  //提示框
  toast(content, booleans, drafts) {
    let that = this;
    wx.showModal({
      // title: '提示',
      content: content,
      showCancel: booleans,
      confirmColor: "#000",
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (that.data.type == 0) {
            if (drafts == 1) {
              that.openBrainhole(1)//存草稿
            } else if (drafts == 2) {
              that.openBrainhole(2)//发布脑洞
            }
          } else {
            if (drafts == 1) {
              that.draftBrainhole(1)//存草稿
            } else if (drafts == 2) {
              that.draftBrainhole(2)//发布脑洞
            }
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //定时发送
  goTime() {
    if (this.data.drafts <= 0) {
      this.toast("草稿箱已满定时发送不可用", false, 3)
    }
  },
  //存入草稿箱
  goDrafs() {
    if (this.data.drafts <= 0) {
      this.toast("草稿箱已满", false, 3)
    }else if (this.data.articleTitle == "") {
      this.toast("请输入标题", false, 3)
    } else if (this.data.article.length < 50) {
      this.toast("文章字数少于50字，不能上传", false, 3)
    } else {
      this.toast("是否存入草稿箱", true, 1)
    }
  },
  //选择定时发送
  checkSelect() {
    if (this.data.checkBoolean) {
      this.setData({
        timeBolean: true,
        checkBoolean: false,
        timing: ""
      })
    }
  },
  //选择时间确定
  changeDateTime1(e) {
    var time = this.data.dateTimeArray1[0][this.data.dateTime1[0]] + "-" + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + "-" + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + " " + this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ":" + this.data.dateTimeArray1[4][this.data.dateTime1[4]] + ":00"
    //转成毫秒
    var changeTime = time.replace(new RegExp("-", "gm"), "/");
    var startDateM = (new Date(changeTime)).getTime(); //得到毫秒数
    //当前时间的毫秒
    var date = Date.now();
    if (startDateM <= date) {
      this.toast("不能小于或等于当前时间", false, 3)
      this.setData({
        timeBolean: true,
        checkBoolean: false
      });
    } else {
      this.setData({
        dateTime1: e.detail.value,
        timeBolean: false,
        checkBoolean: true,
        timing: time
      });
    }



  },

  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  //续写/写分支接口
  openBrainhole(draft) {
    let that = this;
    var time = that.data.timing;
    //转成毫秒
    var changeTime = time.replace(new RegExp("-", "gm"), "/");
    var startDateM = (new Date(changeTime)).getTime(); //得到毫秒数
    //当前时间的毫秒
    var date = Date.now();
    if (startDateM <= date) {
      this.toast("不能小于或等于当前时间", false, 3)
    } else {
      wx.request({
        url: app.globalData.url + '/article/article/branchOrWriting',
        method: "post", 
        data: {
          article_type: that.data.article_type,
          article_draft: draft,
          article_addtime: that.data.timing,
          brainhole_id: that.data.brainhole_id,
          article_chapter: that.data.article_chapter,
          user_id: wx.getStorageSync('userInfo').user_id,
          article_parent_id: that.data.article_parent_id,
          article_title:that.data.articleTitle,
          article_content: that.data.article
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if(res.data.code == 200){
            wx.removeStorageSync('writeBranch')
            if (that.data.timing != "") {
              wx.switchTab({
                url: '/pages/index/home/home'
              })
            } else if (draft == 1){
              wx.redirectTo({
                url: '../../my/my-drafts/my-drafts',//跳草稿列表
              })
            }else{
              wx.redirectTo({
                url: '../../index/index-read/index-read?article_id=' + res.data.data.article_id + '&brainhole_id=' + that.data.brainhole_id +'&cataType=1',//跳阅读脑洞详情
              })
            }
            that.setData({
              article: "",
              articleTitle: "",
            })
          }
        }
      })

    }
  },

  //获取脑洞草稿详情
  getDraftDetail() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/index/brainhole/getDraftDetail',
      method: "GET",
      data: {
        id: that.data.id,
        type: that.data.type,
        user_id: wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          article: res.data.data.article_content,
          articleTitle: res.data.data.article_title,
          article_id: res.data.data.article_id,
          article_chapter: res.data.data.article_chapter,
        })
       
      }
    })
  },

  
  //管理草稿箱
  goDrafts() {
    wx.navigateTo({
      url: '../../my/my-drafts/my-drafts',
    })
  },

  //草稿箱接口
  draftsLength() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/user/draftList',
      data: {
        user_id: wx.getStorageSync('userInfo').user_id,
      },
      method: "GET",
      success(res) {
        that.setData({
          drafts: res.data.data.sum - res.data.data.count
        })
        if (that.data.drafts != 0) {
          that.setData({
            booleans: false
          })
        }
      }
    })
  },

  //草稿编辑发布接口
  draftBrainhole(draft) {
    let that = this;
    var time = that.data.timing;
    //转成毫秒
    var changeTime = time.replace(new RegExp("-", "gm"), "/");
    var startDateM = (new Date(changeTime)).getTime(); //得到毫秒数
    //当前时间的毫秒
    var date = Date.now();
    if (startDateM <= date) {
      this.toast("不能小于或等于当前时间", false, 3)
    } else {
      wx.request({
        url: app.globalData.url + '/index/brainhole/draftArticle',
        method: "post",
        data: {
          user_id: wx.getStorageSync('userInfo').user_id,
          article_content: that.data.article,
          article_draft: draft,
          brainhole_addtime: that.data.timing,
          article_title: that.data.articleTitle,
          article_id: that.data.article_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            wx.removeStorageSync('writeBranch')
            if (that.data.timing != "") {
              wx.switchTab({
                url: '/pages/index/home/home'
              })
            } else if (res.data.data.article_draft == 2) {
              wx.redirectTo({
                url: '../../index/index-read/index-read?brainhole_id=' + res.data.data.brainhole_id + '&article_id=' + res.data.data.article_id + '&cataType=1',//跳阅读
              })
            } else {
              wx.redirectTo({
                url: '../../my/my-drafts/my-drafts',//跳草稿列表
              })
            }
            that.setData({
              article: "",
              articleTitle: "",
            })
          }
        }
      })
    }
  },


  //立即发布脑洞
  goRelease() {
    if (this.data.articleTitle == "") {
      this.toast("请输入标题", false, 3)
    } else if (this.data.article.length < 50) {
      this.toast("文章字数少于50字，不能上传", false, 3)
    } else {
      this.toast("立即发布脑洞", true, 2)
    }
  }




})