// miniprogram/pages/Tips/Tips.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindFormSubmit: function(e) {
      console.log(e.detail.value.textarea)

      if(e.detail.value.textarea == ''){
        wx.showToast({
            icon: 'none',
            title: '认真点哦，不能为空的'
          })
        return 
      }


      const db = wx.cloud.database()

      wx.cloud.callFunction({
        name: 'pushMsg',
        data: {
          formId: e.detail.formId,
          msg:e.detail.value.textarea
        },
      }).then((res) => {
        console.log('[云调用] [发送模板消息] 成功: ', res)
      }).catch(err => {
        console.error('[云调用] [发送模板消息] 失败: ', err)
      })
      
      db.collection('feedback').add({
        data: {
          msg:e.detail.value.textarea
        },
        success: res => {

          wx.showToast({
            title: '瘦子，留言成功了。',
          })


          setTimeout(()=>{

            wx.switchTab({
              url: '/pages/add/add',
              fail: function(e) {}
            })

          },1000)

          
      
        },
        fail: err => {

          wx.showToast({
            icon: 'none',
            title: '出现错误，请重试'
          })

        }
      })


      
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