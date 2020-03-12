// miniprogram/pages/topList/topList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resault:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection('topList').limit(100).orderBy('index', 'desc').get({
      success:  (res) => {
        console.log(res)
        this.setData({
          resault:res.data
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onReady()
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

    let ShareOption = {
      title: '我到排行榜了，瘦给你看',
      path: '/pages/topList/topList',
    } 

    return ShareOption
  }
})