// const regeneratorRuntime = require('/lib/runtime.js')
// fundebug错误监控
var fundebug = require('./lib/fundebug.1.3.1.min.js');
fundebug.init(
{
    apikey : ''
})

const ald = require('./lib/ald-stat.js')


//app.js
App({
  onLaunch: function () {
    

    this.globalData = {}

    wx.cloud.init({})

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.globalData.openid = res.result.openid
        wx.switchTab({
          url: '/pages/add/add',
          fail: function(e) {}
        })
      }, 
      fail: err => { 
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })

    wx.checkSession({
      success (a) {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })
    
  }
})
