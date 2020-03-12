// miniprogram/pages/null/null.js
const app = getApp()

const regeneratorRuntime = require('../../lib/runtime.js')
import promisify from '../../lib/promisify.js'; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthorize:'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    let getSetting =  promisify(wx.getSetting)

    // 是否授权判断
    let isAuthorize = await getSetting().then(res => {
        if (res.authSetting['scope.userInfo']) {
          this.getInfo()
          return true
        }else{
          return false
        }
    })
    this.setData({isAuthorize})

    // 授权通过 执行登录
    isAuthorize ? this.toAddPage() : ''

    wx.checkSession({
      success (a) {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })
  },
  getInfo(){
    wx.getUserInfo({
      success: (res) => {
        this.saveName(res.userInfo)
      }
    })
  },
  async bindGetUserInfo(e){

    if(e.detail.userInfo == undefined ){

      wx.showToast({
        icon: 'none',
        title: '好气哦，排行榜数据不能显示你的昵称。'
      })

      setTimeout(()=> {
        // 执行登录
        this.toAddPage()
      },3000)

    }else{

      await this.saveName(e.detail.userInfo)

      wx.hideLoading()

      // 执行登录
      this.toAddPage()
    }
    
  },

  // 更新昵称
  saveName(Param){
    return new Promise((resolve, reject)=> {
      wx.cloud.init()
      // 云函数调用
      wx.cloud.callFunction({
           name: 'addTest',
           data: {
            ...Param
           },
           success: res => {
              wx.showToast({
                title: '昵称更新成功',
              })

              resolve(res)
           },
           fail: err => { 
              wx.showToast({
                icon: 'none',
                title: '昵称更新失败'
              })
              reject(err)
           }
         })
    })
  },
  tapFn(){
    wx.switchTab({
      url: '/pages/add/add',
      fail: function (e) { }
    })
  },
  // 执行登录
  toAddPage(){

    wx.cloud.init({})
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        wx.switchTab({
          url: '/pages/add/add',
          fail: function(e) {}
        })
      }, 
      fail: err => { 
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })

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