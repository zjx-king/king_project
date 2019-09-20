// pages/edit/editor-index/editor-index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true,
    src: '',
    label: '',
    labelStatus: true,
    list: [],
    imgList: [],
    drafts:1
  },

  // 标签选择
  labelChoose(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      label: id,
      labelStatus: false
    })
    this.getImage(this.data.list[id].tag_id);//获取封面列表
  },

  // 图片选择
  chooseImg(e) {
    let src = e.currentTarget.dataset.src;
    this.setData({
      src: src,
      status: false,
    })
  },

  // 选择图片
  img() {
    let that = this;
    if (!this.data.labelStatus){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;

          wx.uploadFile({
            url: app.globalData.url + '/index/upload/cameraUpload', 
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
            },
            success(res) {
              that.setData({
                src: JSON.parse(res.data).data,
                status: false,
              })
            }
          })

          
        }
      })
    }else{
      this.toast('选择标签后才能选择封面哦～')
    }
  },
  //提示框
  toast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
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
      }
    })
  },

  //跳转编辑文章页
  goWrite(){
    let index = this.data.label
    let obj = {
      tag_id: this.data.list[index].tag_id,
      tag_name: this.data.list[index].tag_name,
      imgUrl: this.data.src
    }
    if (this.data.labelStatus){
      this.toast("请选择标签哦～")
    }else if(this.data.src != ''){
      wx.setStorage({
        key: "tag",
        data: obj
      })
     
      wx.navigateTo({
        url: '../edit-write/edit-write',
      })
    }else{
      this.toast("请选择封面哦～")
    }
    

  },
  //获取脑洞标签
  getTag(){
    let that = this;
    wx.request({
      url: app.globalData.url+'/article/brainHole/getTag', 
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          list: res.data.data
        })
      }
    })
  },
  //获取封面列表
  getImage(id) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/article/BrainHole/getImage', 
      data: {
        tag_id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          imgList:res.data.data
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getImage(1);//获取封面列表
     this.getTag(); //获取脑洞标签
    this.draftsLength();//草稿箱
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

  }
})