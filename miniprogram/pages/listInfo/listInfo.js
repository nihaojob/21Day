// miniprogram/pages/listInfo/listInfo.js
// 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resault:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(app.globalData.openid)
  },

  getList(id){
    
    const db = wx.cloud.database()
    let This = this
    let resault = {}
    db.collection('list').where({
      _openid: id
    }).get({
      success: function (res) {

        resault = res.data

        This.setData({
          resault:resault
        })

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
    this.onLoad()
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
  onShareAppMessage: function (res) {

      let ShareOption = {
        title: '21天体重减肥记录',
        path: '/pages/index/index',
      } 

      if(res.from == "button"){
        ShareOption = {
            title: '来呀 看看我的减肥记录呀',
            path: '/pages/detail/detail?item=' + app.globalData.openid,
          } 
      }

      return ShareOption
   
  }
})