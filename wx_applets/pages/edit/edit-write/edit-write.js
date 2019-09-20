var dateTimePicker = require('../../../utils/dateTimePicker.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    introduction: "",
    article: "",
    articleTitle:"",
    booleans: true,
    checkBoolean: false,
    timeBolean:true,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: new Date().getFullYear(),
    timing:"",//定时
    tag_id:'',
    tag_name:'',
    imgUrl:'',
    drafts:1, //草稿箱数量
    brainhole_id:0,//脑洞id
    article_id:0,//章节id
    type:0,//脑洞、文章类型
    id:0,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.draftsLength();//草稿箱
    if (options.introduction || options.article || options.title || options.articleTitle || options.type) {
      this.setData({
        introduction: options.introduction,
        article: options.article,
        title: options.title,
        articleTitle: options.articleTitle,
        type: options.type
      })
      let obj = {
        introduction: this.data.introduction,
        article: this.data.article,
        title: this.data.title,
        articleTitle: this.data.articleTitle,
      }
      wx.setStorage({
        key: 'write',
        data: obj,
      })
    }
    if (wx.getStorageSync('write').title){
      this.setData({
        introduction: wx.getStorageSync('write').introduction,
        title: wx.getStorageSync('write').title,
      })
    }
    if (wx.getStorageSync('write').articleTitle) {
      this.setData({
        article: wx.getStorageSync('write').article,
        articleTitle: wx.getStorageSync('write').articleTitle
      })
    }
    if (options.ctype == 1){
      this.setData({
        id: options.id,
        type: options.type
      })
      this.getDraftDetail();//获取草稿详情
    }else if (wx.getStorageSync('tag')){
      this.setData({
        tag_id: wx.getStorageSync('tag').tag_id,
        tag_name: wx.getStorageSync('tag').tag_name,
        imgUrl: wx.getStorageSync('tag').imgUrl
      })
    } else if (wx.getStorageSync('openDraft')){
      this.setData({
        brainhole_id: wx.getStorageSync('openDraft').brainhole_id,
        tag_id: wx.getStorageSync('openDraft').tag_id,
        article_id: wx.getStorageSync('openDraft').article_id,
        imgUrl: wx.getStorageSync('openDraft').imgUrl,
      })
      
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.draftsLength();//草稿箱
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
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
  //提示框
  toast(content, booleans,drafts) {
    let that = this;
    wx.showModal({
      // title: '提示',
      content: content,
      showCancel: booleans,
      confirmColor: "#000",
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (that.data.type == 0){
            if (drafts == 1) {
              that.openBrainhole(1)//存草稿
            } else if (drafts == 2) {
              that.openBrainhole(2)//发布脑洞
            }
          }else{
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
      this.toast("草稿箱已满定时发送不可用", false,3)
    }
  },
  //存入草稿箱
  goDrafs() {
    if(this.data.drafts <= 0){
      this.toast("草稿箱已满", false, 3)
    }else if (this.data.title == "") {
      this.toast("请输入标题", false, 3)
    } else if (this.data.introduction == "") {
      this.toast("请输入简介", false, 3)
    } else {
      this.toast("是否存入草稿箱", true, 1)
    }
  },

  //跳转编辑文章页
  goArticle() {
    wx.navigateTo({
      url: '../edit-article/edit-article?title=' + this.data.title + '&article=' + this.data.article + '&introduction=' + this.data.introduction + '&articleTitle=' + this.data.articleTitle + '&type=' + this.data.type,
    })
  },
  //跳转编辑简介页
  goIntroduction() {
    wx.navigateTo({
      url: '../edit-introduction/edit-introduction?title=' + this.data.title + '&article=' + this.data.article + '&introduction=' + this.data.introduction + '&articleTitle=' + this.data.articleTitle + '&type=' + this.data.type,
    })
  },
  //选择定时发送
  checkSelect(){
    if (this.data.checkBoolean){
      this.setData({
        timeBolean:true,
        checkBoolean:false,
        timing:""
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
    if (startDateM <= date){
      this.toast("不能小于或等于当前时间", false, 3)
      this.setData({
        timeBolean: true,
        checkBoolean: false
      });
    }else{
      this.setData({
        dateTime1: e.detail.value,
        timeBolean: false,
        checkBoolean:true,
        timing: time
      });
    }
    
   
    
  },
  //滑动日期
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  //草稿箱
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

  //获取脑洞草稿详情
  getDraftDetail(){
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
        if (res.data.data.article_title){
          that.setData({
            article: res.data.data.first_floor,
            articleTitle: res.data.data.article_title,
            article_id: res.data.data.article_id,
          })
        }else{
          that.setData({
            article: "",
            articleTitle: ""
          })
        }
        that.setData({
          title: res.data.data.brainhole_title,
          introduction: res.data.data.brainhole_description,
          brainhole_id: res.data.data.brainhole_id,
          tag_id: res.data.data.brainhole_tag_id,
          imgUrl: res.data.data.brainhole_image,
        })
        let obj = {
          brainhole_id: res.data.data.brainhole_id,
          tag_id: res.data.data.brainhole_tag_id,
          article_id: res.data.data.article_id,
          imgUrl: res.data.data.brainhole_image,
        }
        wx.setStorage({
          key: "openDraft",
          data: obj
        })
      }
    })
  },

  //发布脑洞接口
  openBrainhole(draft){
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
          url: app.globalData.url + '/index/brainhole/openBrainhole',
          method: "post", 
          data: {
            brainhole_type: 2,
            user_id: wx.getStorageSync('userInfo').user_id,
            brainhole_tag_id: that.data.tag_id,
            brainhole_tag_name: that.data.tag_name,
            brainhole_title: that.data.title,
            brainhole_image: that.data.imgUrl,
            brainhole_description: that.data.introduction,
            first_floor: that.data.article,
            brainhole_draft: draft,
            brainhole_addtime: that.data.timing,
            article_title: that.data.articleTitle
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 200){
              wx.removeStorageSync('write')
              if (that.data.timing != ""){
                wx.switchTab({
                  url: '/pages/index/home/home'
                })
              }else if (res.data.data.brainhole_draft == 2) {
                wx.redirectTo({
                  url: '../../index/index-detail/index-detail?brainhole_id=' + res.data.data.value,//跳脑洞详情
                })
              } else {
                wx.redirectTo({
                  url: '../../my/my-drafts/my-drafts',//跳草稿列表
                })
              }
              that.setData({
                title: "",
                introduction: "",
                article: "",
                articleTitle: "",
              })

            }
           
          }
        })
     
    }
  },

  //草稿编辑发布接口
  draftBrainhole(draft){
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
          url: app.globalData.url + '/index/brainhole/draftBrainhole',
          method: "post",
          data: {
            brainhole_id: that.data.brainhole_id, //脑洞id
            brainhole_type: 2,
            user_id: wx.getStorageSync('userInfo').user_id,
            brainhole_tag_id: that.data.tag_id,
            brainhole_image: that.data.imgUrl,
            brainhole_title: that.data.title,
            brainhole_description: that.data.introduction,
            first_floor: that.data.article,
            brainhole_draft: draft,
            brainhole_addtime: that.data.timing,
            article_title: that.data.articleTitle,
            article_id: that.data.article_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 200) {
              wx.removeStorageSync('write')
              if (that.data.timing != "") {
                wx.switchTab({
                  url: '/pages/index/home/home'
                })
              } else if (res.data.data.brainhole_draft == 2) {
                wx.redirectTo({
                  url: '../../index/index-detail/index-detail?brainhole_id=' + res.data.data.value,//跳脑洞详情
                })
              } else {
                wx.redirectTo({
                  url: '../../my/my-drafts/my-drafts',//跳草稿列表
                })
              }
              that.setData({
                title: "",
                introduction: "",
                article: "",
                articleTitle: "",
              })

            }
          }
        })
    }
  },

  //管理草稿箱
  goDrafts(){
    wx.navigateTo({
      url: '../../my/my-drafts/my-drafts',
    })
  },

  //立即发布脑洞
  goRelease() {
    if(this.data.title == ""){
      this.toast("请输入标题", false, 3)
    }else if(this.data.introduction == ""){
      this.toast("请输入简介", false, 3)
    }else{
      this.toast("立即发布脑洞", true, 2)
    }
  }
})