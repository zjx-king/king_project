// pages/index/index-read/index-read.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: false, //续写弹窗
    statu: false, //发表弹窗
    token:"",
    windowHeight: 0,
    topNum: 0,
    readDetail: {},
    brainhole_id: 0, //脑洞id
    article_id: 0,//当前看的章节
    commentContent: "", //评论内容
    cataType:0,//目录页判断
    waitShow:true,
    nextBtn:true,//下一章按钮判断
    pull:false//判断拉黑状态
  },
  //当前scrollTop
  onPageScroll: function (e) {
    this.setData({
      topNum: e.scrollTop
    })
  },

  //开始阅读
  readTimeStart(){
   
      let that = this;
      wx.request({
        url: app.globalData.url + "/article/read/readTimeStart",
        method: "POST",
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              token: res.data.data
            })
          } 
        }
      })
    
  },

  //结束阅读
  readTimeEnd(){
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/read/readTimeEnd",
      method: "POST",
      data: {
        token: that.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {

        }
      }
    })
  },

  //查看当前和上级文章（主干、分支脑洞）
  showBranchArticle(){
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/article/showBranchArticle",
      method: "GET",
      data: {
        brainhole_id: that.data.brainhole_id,
        article_id: that.data.article_id,
        user_id: wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            readDetail: res.data.data
          })
          if (that.data.readDetail.brainhole_title.length > 8) {
            let title = that.data.readDetail.brainhole_title.slice(0, 8)
            wx.setNavigationBarTitle({
              title: title + "...",
            })
          } else {
            wx.setNavigationBarTitle({
              title: that.data.readDetail.brainhole_title,
            })
          }
        
        } else {
          that.setData({
            waitShow: false //续写按钮
          })
        }
      }
    })
  },

  //查看下一章主干脑洞
  showThreadArticle() {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/article/showThreadArticle",
      method: "GET",
      data: {
        brainhole_id: that.data.brainhole_id, 
        article_id: that.data.article_id,
        user_id: wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            readDetail: res.data.data
          })
          if (that.data.readDetail.brainhole_title.length > 8) {
            let title = that.data.readDetail.brainhole_title.slice(0, 8)
            wx.setNavigationBarTitle({
              title: title + "...",
            })
          } else {
            wx.setNavigationBarTitle({
              title: that.data.readDetail.brainhole_title,
            })
          }
        }else{
          that.setData({
            waitShow: false //续写按钮
          })
        }
      }
    })
  },
  //查看下一章分支接口
  nextArticle(){
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/article/nextArticle",
      method: "GET",
      data: {
        brainhole_id: that.data.brainhole_id,
        article_id: that.data.article_id,
        user_id: wx.getStorageSync('userInfo').user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            readDetail: res.data.data
          })
          if (that.data.readDetail.brainhole_title.length > 8) {
            let title = that.data.readDetail.brainhole_title.slice(0, 8)
            wx.setNavigationBarTitle({
              title: title + "...",
            })
          } else {
            wx.setNavigationBarTitle({
              title: that.data.readDetail.brainhole_title,
            })
          }
        } else {
          that.setData({
            waitShow: false //续写按钮
          })
        }
      }
    })
  },


  //追更接口
  collection() {
    let that = this;
    that.getBlack(that.data.readDetail.user_id)
    setTimeout(()=>{
      if (that.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
        wx.request({
          url: app.globalData.url + "/article/brainHole/collection",
          method: "POST",
          data: {
            article_type: 2,
            article_id: that.data.readDetail.article_id,
            user_id: wx.getStorageSync('userInfo').user_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 200) {
              that.setData({
                article_id: that.data.readDetail.article_id
              })
              that.showBranchArticle();
            }
          }
        })
      }

    },500)
   
  },

  //点赞接口
  articleLike() {
    let that = this;
    that.getBlack(that.data.readDetail.user_id)
    setTimeout(()=>{
      if (that.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
        wx.request({
          url: app.globalData.url + "/article/article/articleLike",
          method: "POST",
          data: {
            article_id: that.data.readDetail.article_id,
            user_id: wx.getStorageSync('userInfo').user_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 200) {
              that.setData({
                article_id: that.data.readDetail.article_id
              })
              that.showBranchArticle()
            }
          }
        })
      } 
    },500)
   
   
  },

  //取消点赞接口
  cancleLike() {
    let that = this;
    that.getBlack(that.data.readDetail.user_id)
   
    setTimeout(() => {
      if (that.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
        wx.request({
          url: app.globalData.url + "/article/article/articleCancelLike",
          method: "POST",
          data: {
            article_id: that.data.readDetail.article_id,
            user_id: wx.getStorageSync('userInfo').user_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 200) {
              that.setData({
                article_id: that.data.readDetail.article_id
              })
              that.showBranchArticle()
            }
          }
        })
      } 
    }, 500)
    
      
  },

  //评论文章接口
  commentArticle() {
    let that = this;
    that.getBlack(that.data.readDetail.user_id)
   
    setTimeout(() => {
      if (that.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
        wx.request({
          url: app.globalData.url + "/article/articleComment/commentArticle",
          method: "POST",
          data: {
            article_id: that.data.readDetail.article_id,
            user_id: wx.getStorageSync('userInfo').user_id,
            comment_content: that.data.comment_Content
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 200) {
              that.setData({
                article_id: that.data.readDetail.article_id
              })
              that.showBranchArticle();
              wx.showToast({
                title: '评论成功',
              })
              that.setData({
                statu: false,
                comment_Content: ""
              })

            }
          }
        })
      }
    }, 500)
    
  },
  // 判断拉黑状态
  getBlack(ohterId) {
    let that = this;
    if(wx.getStorageSync('userId')){
      wx.request({
        url: app.globalData.url + '/user/User/userRelation',
        data: {
          active_user_id: wx.getStorageSync('userInfo').user_id,
          passive_user_id: ohterId
        },
        method: 'GET',
        success(res) {
          if (res.data.data.black_state == "被拉黑" || res.data.data.black_state == "已拉黑") {
            that.setData({
              pull: true
            })

          }

        }
      })
    }else{
      app.loging(); // 判断是否登录
    } 
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (options.cataType){
      that.setData({
        cataType: options.cataType
      })
    }
    that.setData({
      brainhole_id: options.brainhole_id,
      article_id: options.article_id
    })
    if (that.data.cataType == 1){
      that.showBranchArticle();//查看当前文章
   }else{
      that.showThreadArticle();//查看第一章主线
   }

    if (wx.getStorageSync('nextBrainHole')) {
      this.setData({
        nextBtn: false
      })
    }
    

    //获取屏幕高
    wx.getSystemInfo({
      success: function(res) {
          // let clientHeight = res.windowHeight;
          // let clientWidth = res.windowWidth;
          // let ratio = 750 / clientWidth;
          // let height = clientHeight * ratio;
          that.setData({
            windowHeight: res.windowHeight
          });
      }
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
    this.readTimeStart();
    // this.readTimeEnd();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
     this.readTimeEnd();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.readTimeEnd();
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
  //上一章
  upper(){
    if (this.data.readDetail.article_parent_id == 0){
      wx.showToast({
        title: '不能往前翻了',
      })
    }else{
      this.setData({
        article_id: this.data.readDetail.article_parent_id
      })
      this.showBranchArticle();
    }
  
  },
  //下一章
  next(){
    if (this.data.readDetail.article_branch == 1) {
      //下一章主线
      this.setData({
        article_id:this.data.readDetail.article_id
      })
      this.showThreadArticle();
    }else{
      //下一章分支接口
      this.setData({
        article_id: this.data.readDetail.article_id
      })
      this.nextArticle();
    }
  },

  //向下翻页
  changeTop() {
    if (this.data.topNum > 0){
      let top = this.data.windowHeight - 100
      //控制滚动
      wx.pageScrollTo({
        scrollTop: this.data.topNum - top
      })
      
    }
    

  },
  //向上翻页
  changeBottom() {
    let top = this.data.windowHeight - 100
    //控制滚动
    wx.pageScrollTo({
      scrollTop: this.data.topNum + top
    })
  
  },
  //点赞
  fabulous() {
    if (this.data.readDetail.is_like == 0) {
      this.articleLike();
    } else {
      this.cancleLike();
    }


  },
  //底部评论弹窗
  goShow() {
    this.setData({
      statu: true
    })
  },
  goHide() {
    this.setData({
      status: false,
      statu: false
    })
  },
  //续写
  writeContinue() {
    this.getBlack(this.data.readDetail.user_id)
    
    setTimeout(() => {
      if (this.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
        if (this.data.readDetail.brainhole_type == "1") {
          wx.showModal({
            // title: '提示',
            content: "暂未开放写长篇功能",
            showCancel: false,
            confirmColor: "#000",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          if (this.data.readDetail.article_chapter) {
            wx.redirectTo({
              url: '../../edit/edit-branch/edit-branch?article_type=1' + '&brainhole_id=' + this.data.brainhole_id + '&article_chapter=' + this.data.readDetail.article_chapter + '&article_parent_id=' + this.data.readDetail.article_id,
            })
          } else {
            wx.redirectTo({
              url: '../../edit/edit-branch/edit-branch?article_type=1' + '&brainhole_id=' + this.data.brainhole_id + '&article_chapter=0' + '&article_parent_id=0',
            })
          }


        }
      }
    }, 500)
    
   
   
  },
  //写分支 
  writeBranch() {
    this.getBlack(this.data.readDetail.user_id)
    if (this.data.pull) {
      wx.showToast({
        title: '你们处于拉黑关系，不能进行操作',
        icon: 'none'
      })
    } else {
      if (this.data.readDetail.brainhole_type == "1") {
        wx.showModal({
          // title: '提示',
          content: "暂未开放写长篇功能",
          showCancel: false,
          confirmColor: "#000",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '../../edit/edit-branch/edit-branch?article_type=2' + '&brainhole_id=' + this.data.brainhole_id + '&article_chapter=' + this.data.readDetail.article_chapter + '&article_parent_id=' + this.data.readDetail.article_parent_id
        })
      }
    }
      
    
  },
  //写文章弹窗
  goToast() {
    this.setData({
      status: true,
      statu: false
    })
  },
  //评论内容
  commentContent(e) {
    this.setData({
      comment_Content: e.detail.value
    })
  },
  //跳转评论页
  goComment() {
    this.getBlack(this.data.readDetail.user_id)
   
    setTimeout(() => {
      if (this.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../index-comment/index-comment?article_id=' + this.data.readDetail.article_id,
        })
      }
    }, 500)
   
   

  },
  //跳转目录页
  goCatalog() {
    wx.navigateTo({
      url: '../../nd/nd-catalog/nd-catalog?brainhole_id=' + this.data.brainhole_id + '&cataType=' + this.data.readDetail.article_branch +  '&article_id='+this.data.readDetail.article_id,
    })
  },
  //跳转分支目录页
  goBranch() {
    wx.navigateTo({
      url: '../../nd/nd-catalog-branch/nd-catalog-branch?brainhole_id=' + this.data.brainhole_id + '&article_parent_id=' + this.data.readDetail.article_parent_id + '&cataType=1' + '&article_id=' + this.data.readDetail.article_id,
    })
  },
  //跳转举报页
  goReport() {
    this.getBlack(this.data.readDetail.user_id)
    setTimeout(() => {
      if (this.data.pull) {
        wx.showToast({
          title: '你们处于拉黑关系，不能进行操作',
          icon: 'none'
        })
      } else {
        let obj = {
          report_focus_id: this.data.readDetail.article_id,
          type: 1
        }
        wx.setStorage({
          key: "report",
          data: obj
        })
        wx.navigateTo({
          url: '../../common/report/report',
        })
      }
    }, 500)
   
  },

  //下一个脑洞 
  nextNd() {
    let that = this
    wx.request({
      url: app.globalData.url + '/article/brainHole/nextBrainHole',
      method: "GET",
      data: {
        brainhole_id: that.data.brainhole_id,
        brainhole_type: wx.getStorageSync('nextBrainHole').brainhole_type,
        type: wx.getStorageSync('nextBrainHole').type,
        user_id: wx.getStorageSync('userInfo').user_id,
        tag_id: wx.getStorageSync('nextBrainHole').tag_id,
        page: wx.getStorageSync('nextBrainHole').page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          wx.redirectTo({
            url: '../../index/index-detail/index-detail?brainhole_id=' + res.data.data.brainhole_id,
          })

        }
      }
    })

  },
  
})