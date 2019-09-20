// pages/index/index-comment/index-comment.js
var app = getApp()
var time = require('../../../utils/formatdate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fabulousBoolean:false,//点赞判断
    publishBoolean:false,//发表判断
    comLen:0,//评论长度
    btnBoolean:true,//按钮禁用判断
    article_id:0,//文章id
    comment_id: 0,//评论id
    comment_Content:"",//评论内容
    show:true, //显示无更多数据
    i:0,
    page: 1,
    commentList: [],
    article_num:0,
    comment_num:0
  },
  //评论列表接口
  showCommentArticle(){
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/articleComment/showCommentArticle",
      method: "GET",
      data: {
        article_id: that.data.article_id,
        user_id: wx.getStorageSync('userInfo').user_id,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          let arr = res.data.data.article_comment
          for (let i = 0; i < arr.length; i++) {
            arr[i].comment_add_time = time.formatTimeTwo(arr[i].comment_add_time, 'M月D日 h:m')
          }
          if (that.data.commentList.length < res.data.data.article_num){
            that.setData({
              commentList: that.data.commentList.concat(arr),
              article_num: res.data.data.article_num,
              comment_num: res.data.data.comment_num
            })
          }
          that.setData({
            publishBoolean: false,
            btnBoolean: true,
            comLen: 0
          })

          wx.setNavigationBarTitle({
            title: "全部" + that.data.comment_num + "条评论"
          })
          wx.hideLoading();
        }
      }
    })
  },
  //评论文章接口
  commentArticle() {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/articleComment/commentArticle",
      method: "POST",
      data: {
        article_id: that.data.article_id,
        user_id: wx.getStorageSync('userInfo').user_id,
        comment_content: that.data.comment_Content
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          let arr = that.data.commentList
          let obj = res.data.data
          that.showCommentArticle()
          obj.comment_add_time = time.formatTimeTwo(obj.comment_add_time, 'M月D日 h:m')
          arr.push(obj)
          that.setData({
            commentList: arr,
            i: -1,
            comment_num: that.data.comment_num+1
          });
          wx.showToast({
            title: '评论成功',
            image: '/images/index/ok.png',
            duration: 2000
          })
          wx.setNavigationBarTitle({
            title: "全部" + that.data.comment_num + "条评论"
          })
        }
      }
    })
  },
  //评论点赞
  commentLike(){
   
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
          let arr = that.data.commentList
          arr[that.data.i].is_like = 1
          arr[that.data.i].fabulous_num = arr[that.data.i].fabulous_num + 1

          that.setData({
            commentList: arr
          })
          
        }
      }
    })
  },
  //取消评论点赞
  commentCancelLike(){
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
          let arr = that.data.commentList
          arr[that.data.i].is_like = 0
          arr[that.data.i].fabulous_num = arr[that.data.i].fabulous_num-1
          
          that.setData({
            commentList: arr
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      article_id: options.article_id
    })
    this.showCommentArticle()
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
    //   if (res.height == 0 ){
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

    if (this.data.commentList.length < this.data.article_num) {
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
  fabulous(e){
    let like = e.currentTarget.dataset.like
    this.setData({
      comment_id: e.currentTarget.dataset.id,
      i: e.currentTarget.dataset.i
    })
   
    if(like == 0){
      this.commentLike();
    }else{
      this.commentCancelLike();
    }

  },
  //显示文本域评论
  goShow(){
    this.setData({
      publishBoolean: true
    })
  },
  //隐藏文本域评论
  goHidden(){
    this.commentArticle();
    // this.setData({
    //   publishBoolean: false,
    //   btnBoolean: true,
    //   comLen: 0
    // })
  },
  //监听文本域
  comChange(e){
    this.setData({
      comLen:e.detail.value.length,
      comment_Content: e.detail.value
    })
    if(this.data.comLen > 0){
      this.setData({
        btnBoolean:false
      })
    }else{
      this.setData({
        btnBoolean: true
      })
    }
  },




  //跳转评论详情
  gocomDetail(e) {

    wx.navigateTo({
      url: '../comment-detail/comment-detail?article_id=' + this.data.article_id + "&comment_id=" + e.currentTarget.dataset.id,
    })
  }
})