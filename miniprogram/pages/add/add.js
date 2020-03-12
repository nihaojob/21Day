import moment from '../../lib/moment.js'; 
const regeneratorRuntime = require('../../lib/runtime.js')
import promisify from '../../lib/promisify.js';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [[], []],  // 日期数字
    TodayIndex:0,          // 当天Index
    timeType:'',           // 上下午类型判断
    morningValue:0,        // 上午日期值
    morningText:'未完成',   // 上午提示文字
    morningEd:false,
    eveningValue:0,        // 下午日期值
    eveningText:'未完成',   // 下午提示文字
    eveningEd:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    // 生成下拉
    let multiArray = [[], [0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]]
    for(let i =30; i<150; i++){multiArray[0].push(i)}
    this.setData({multiArray})

    // 获取当天数据
    await this.step1()

    // 时间类型
    let nowHour = moment().hour(),timeType
    nowHour > 12 ? timeType = 'evening' : timeType = 'morning'
    this.setData({timeType})

  },
  tapFn(){
    this.save()
  },
  async save (){

    wx.showLoading({
      title: '提交中...',
    })

    let todayHas =  await this.step1();

    //  今天数据存在 
    if(todayHas){ // 更新
       await this.step4()
    }else{// 新建数据

        // 获取昨天数据
        await this.step2()

        wx.showLoading({
          title: '提交中...',
        })

        // 新增
        await this.step3() 

        wx.showLoading({
          title: '提交中...',
        })

    }


    await this.step1();

    wx.hideLoading()

  },
  // 是否存在当天数据
  step1:function(){
    const db = wx.cloud.database()
    let This = this
    return new Promise(function(resolve, reject) {
      // 查询当天数据
      db.collection('list').where({
        _openid: app.globalData.openid,
        date: moment().format('YYYY-MM-DD'),
      }).get({
        success:  (res)=> {
          let result
          res.data.length != 0 ? result = true : result = false

          if(res.data.length != 0){

            if(res.data[0].hasOwnProperty('morningValue')){
              This.setData({'morningValue':res.data[0].morningValue})
              This.setData({'morningText':'已完成'})
              This.setData({'morningEd':true})
            }
            if(res.data[0].hasOwnProperty('eveningValue')){
              This.setData({'eveningValue':res.data[0].eveningValue})
              This.setData({'eveningText':'已完成'})
              This.setData({'eveningEd':true})
            }
            
          }

          resolve(result);
        }
      })
      
    });


    
  },
  // 是否存在上天数据
  step2:function(){

    let This = this
    const db = wx.cloud.database()

    return new Promise(function(resolve, reject) {

      // 查询上天数据
      db.collection('list').where({
        _openid: app.globalData.openid,
        date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      }).get({
        success: function (res) {
          if(res.data.length != 0){// 设置index值
             This.setData({
               TodayIndex:res.data[0].index+1
             })
          }else{
            This.setData({
              TodayIndex:1
            })
          }
          resolve(res);
        }
      })
    });

  },
  // 新增数据
  step3:function(){

    let This = this
    const db = wx.cloud.database()

    return new Promise((resolve, reject) => {

        let Param = {
          index:this.data.TodayIndex,
          date:moment().format('YYYY-MM-DD'),
        }

        Param[this.data.timeType+'Time'] = moment().format('hh:mm:ss')
        Param[this.data.timeType+'Value'] = this.data[this.data.timeType+'Value']


        if(this.data[this.data.timeType+'Value'] == 0){
          wx.showToast({
              icon: 'none',
              title: '不能为0，请点击下拉框选择体重',
            })
          reject('不能为0，请点击下拉框选择体重')
          return 
        }

        db.collection('list').add({
          data: {
            ...Param
          },
          success: res => {

            wx.showToast({
              title: '新增记录成功',
            })
        
            resolve(res)
          },
          fail: err => {

            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })

            reject(err)
          }
        })
    });
  },
  // 更新数据
  step4:function(){

    let This = this
    const db = wx.cloud.database()

    return new Promise((resolve, reject) => {

      let Param = {
        date:moment().format('YYYY-MM-DD'),
      }

        Param[this.data.timeType+'Time'] = moment().format('hh:mm:ss')
        Param[this.data.timeType+'Value'] = this.data[this.data.timeType+'Value']

        if(this.data[this.data.timeType+'Value'] == 0){
          wx.showToast({
              icon: 'none',
              title: '不能为0，请点击下拉框选择体重',
            })
          reject('不能为0，请点击下拉框选择体重')
          return 
        }

        // 云函数调用
        wx.cloud.callFunction({
             name: 'add',
             data: {
              ...Param
             },
             success: res => {
                wx.showToast({
                  title: '新增记录成功',
                })

                resolve(res)
             },
             fail: err => { 
                wx.showToast({
                  icon: 'none',
                  title: '新增记录失败'
                })
                reject(err)
             }
           })
    });



  },
  getMsg(){

    const db = wx.cloud.database()
    let This = this

    db.collection('cheerMsg').aggregate().sample({ size: 1 }).end().then(res=>{ 
      wx.showModal({
        content: res.list[0].msg,
        showCancel:false
      })
    });
   
  },

  // 下拉日期事件
  bindMultiPickerChange:async function(e){

    let getSetting = promisify(wx.getSetting)

    // 是否授权判断
    const isAuthorize = await getSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        // this.getInfo()
        return true
      } else {
        return false
      }
    })

    if (isAuthorize) {
      let targetName = e.target.dataset.name
      let value = this.data.multiArray[0][e.detail.value[0]] + this.data.multiArray[1][e.detail.value[1]];
      let Param = {}
      Param[targetName + 'Value'] = value
      this.setData({ ...Param })
    }else{
      wx.navigateTo({
        url: '/pages/null/null',
      })
    }
    
  },
  toTopPage(){

    wx.switchTab({
      url: '/pages/topList/topList'
    })

  },
  toTopTips(){
    wx.navigateTo({
      url: '/pages/Tips/Tips',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    // 获取鼓励
    this.getMsg()
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
  onShareAppMessage: function () {

  }
})