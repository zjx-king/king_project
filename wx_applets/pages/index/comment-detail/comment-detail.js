// pages/index/comment-detail/comment-detail.js
var app = getApp()
var time = require('../../../utils/formatdate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publishBoolean: false, //发表判断
    comment_Content:"",//评论内容
    comLen: 0, //评论长度
    btnBoolean: true, //按钮禁用判断
    article_id: 0,//文章id
    comment_top_id:0,//主评论id
    comment_id:0,//评论id
    passive_user_id:"",//被回复的用户id
    show: true, //显示无更多数据
    page:1,
    i:-1,
    detailList: {},
    comment_num:0,
    replyList:[],
    
  },

  //评论详情接口
  showCommentArticle() {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/articleComment/showCommentDetails",
      method: "GET",
      data: {
        article_id: that.data.article_id,
        comment_top_id: that.data.comment_top_id,
        user_id: wx.getStorageSync('userInfo').user_id,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          let arr = res.data.data.son_comment
          let arr2 = res.data.data.main_comment
          for (let i = 0; i < arr.length; i++) {
            arr[i].comment_add_time = time.formatTimeTwo(arr[i].comment_add_time, 'M月D日 h:m')
          }
          arr2.comment_add_time = time.formatTimeTwo(arr2.comment_add_time, 'M月D日 h:m')
          that.setData({
            detailList: arr2,
            i: -1
          })
          if (that.data.replyList.length < res.data.data.comment_num) {
            that.setData({
              comment_num: res.data.data.comment_num,
              replyList: that.data.replyList.concat(arr),
              i: -1
            })
          }
            

          wx.setNavigationBarTitle({
            title: that.data.comment_num + "条回复"
          })
          wx.hideLoading()
        }
      }
    })
  },
  //回复评论接口
  commentArticle() {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/articleComment/commentOrReply",
      method: "POST",
      data: {
        article_id: that.data.article_id,
        user_id: wx.getStorageSync('userInfo').user_id,
        comment_content: that.data.comment_Content,
        passive_user_id: that.data.passive_user_id,
        comment_article_id: that.data.comment_top_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          let arr = that.data.replyList
          let obj = res.data.data
          that.showCommentArticle()
          obj.comment_add_time = time.formatTimeTwo(obj.comment_add_time, 'M月D日 h:m')
          arr.push(obj)
          that.setData({
            replyList: arr,
            i: -1,
            comment_num: that.data.comment_num+1
          });
          that.goHidden()
          wx.showToast({
            title: '评论成功',
            image: '/images/index/ok.png',
            duration: 2000
          })
          wx.setNavigationBarTitle({
            title: that.data.comment_num + "条回复"
          })
        }
      }
    })
  },
  //评论点赞
  commentLike() {

    let that = this;
    wx.request({
      url: app.globalData.url + "/article/articleComment/commentLike",
      method: "POST",
      data: {
        comment_id: that.data.comment_id,
        user_id: wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          let arr = that.data.replyList
          let obj = that.data.detailList
          if (that.data.i >= 0){
            arr[that.data.i].is_like = 1
            arr[that.data.i].fabulous_num = arr[that.data.i].fabulous_num + 1
            that.setData({
              replyList: arr,
              i:-1
            })
          }else{
            obj.is_like = 1
            obj.fabulous_num = obj.fabulous_num + 1
            that.setData({
              detailList: obj,
              i:-1
            })
          }
         

        }
      }
    })
  },
  //取消评论点赞
  commentCancelLike() {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/articleComment/commentCancelLike",
      method: "POST",
      data: {
        comment_id: that.data.comment_id,
        user_id: wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          let arr = that.data.replyList
          let obj = that.data.detailList
          if (that.data.i >= 0) {
            arr[that.data.i].is_like = 0
            arr[that.data.i].fabulous_num = arr[that.data.i].fabulous_num - 1
            that.setData({
              replyList: arr,
              i:-1
            })
          } else {
            obj.is_like = 0
            obj.fabulous_num = obj.fabulous_num - 1
            that.setData({
              detailList: obj,
              i:-1
            })
          }

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      article_id: options.article_id,
      comment_top_id: options.comment_id
    })
    this.showCommentArticle();
   
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
   
    // wx.onKeyboardHeightChange(res => {
    //   console.log(res.height)
    //   if (res.height == 0) {
    //     this.setData({
    //       publishBoolean: false,
    //       comLen: 0
    //     })
    //   }
    // })
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
    let pages = this.data.page;
    pages = pages + 1;
    this.setData({
      page: pages
    })

    if (this.data.replyList.length < this.data.comment_num) {
      wx.showLoading({
        title: '加载中',
      })
      this.showCommentArticle();
    } else {
      this.setData({
        show: false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点赞
  fabulous(e) {
    let like = e.currentTarget.dataset.like
    if (e.currentTarget.dataset.i >= 0){
      this.setData({
        i: e.currentTarget.dataset.i
      })
    }
    this.setData({
      comment_id: e.currentTarget.dataset.id
    })

    if (like == 0) {
      this.commentLike();
    } else {
      this.commentCancelLike();
    }

  },
  //显示文本域评论
  goShow(e) {
    if (e.currentTarget.dataset.id > 0){
      this.setData({
        passive_user_id: e.currentTarget.dataset.id
      })
    }else{
      this.setData({
        passive_user_id: ""
      })
    }
    this.setData({
      publishBoolean: true
    })
    wx.setNavigationBarTitle({
      title: "写评论"
    })
  },
  //隐藏文本域评论
  goHidden() {
    this.setData({
      publishBoolean: false,
      btnBoolean: true,
      comLen: 0
    })
    wx.setNavigationBarTitle({
      title: this.data.comment_num + "条回复"
    })
  },
  //监听文本域
  comChange(e) {
    this.setData({
      comment_Content: e.detail.value,
      comLen: e.detail.value.length
    })
    if (this.data.comLen > 0) {
      this.setData({
        btnBoolean: false
      })
    } else {
      this.setData({
        btnBoolean: true
      })
    }
  },
})