// miniprogram/pages/index/index.js

import moment from '../../lib/moment.js'
const regeneratorRuntime = require('../../lib/runtime.js')

import promisify from '../../lib/promisify.js'; 
function createRpx2px() {
  const { windowWidth } = wx.getSystemInfoSync()
  return function(rpx) {
    return windowWidth / 750 * rpx
  }
}
const rpx2px = createRpx2px()
let ctx

const app = getApp()
import F2 from '@antv/wx-f2';
let chart = null;
function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  let data = [
    // { timestamp: '1951 年', step: 38 },
  ];

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    step: {
      tickCount: 5
    },
    timestamp: {
      tickCount: 8
    },

  });


  chart.axis('timestamp', {
    label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      }
      if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });

  chart.axis('step', {
    label(text) {
      return {
        text: text / 1000 + 'k步'
      };
    }
  });

  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value + '步';
    }
  });
  // chart.interval().position('timestamp*step');
  chart.area().position('timestamp*step').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
  chart.line().position('timestamp*step').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
  chart.render();
  return chart;
}


let lineChart = null;
function initChartLine(canvas, width, height, F2) { // 使用 F2 绘制图表
  let data = [
  
  ];


  lineChart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  lineChart.source(data, {
    data: {
      tickCount: 5
    },
  });

  lineChart.scale('data', {
      tickCount: 8
    });

  lineChart.scale('value', {
      tickCount: 5
    });

  lineChart.axis('data', {
    label: function label(text, index, total) {
      // 只显示每一年的第一天
      var textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
 
 
  lineChart.line().position('data*value').color('type');
  lineChart.render();
  return lineChart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      onInit: initChart
    },
    line:{
      onInit: initChartLine
    },
    noWeight:0,
    remove:0,
    days:0,
    average:0,
    min:0,
    max:0,
    showImg:false,
    setPage:false
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let This = this
    ctx = wx.createCanvasContext('shareCanvas')

    this.getList(app.globalData.openid)

    wx.cloud.init({})
    wx.getWeRunData({
      success (res) {
        // 或拿 cloudID 通过云调用直接获取开放数据
        const cloudID = res.cloudID

        wx.cloud.callFunction({
          name: 'sportLength',
          data: {
            weRunData: wx.cloud.CloudID(cloudID), // 这个 CloudID 值到云函数端会被替换
            obj: {
              shareInfo: wx.cloud.CloudID(cloudID), // 非顶层字段的 CloudID 不会被替换，会原样字符串展示
            }
          },
          success: res => {
            let { stepInfoList }= res.result.event.weRunData.data

            stepInfoList.forEach(item => {
              item.timestamp = moment.unix(item.timestamp).format('M.D')
            })
            This.setData({
                weRunData:stepInfoList
              })

            chart.changeData(stepInfoList)
            
          }
        })

      }
    })
  },

  getList(){
    
    const db = wx.cloud.database()
    let This = this
    let resault = {}
    let newArray = []
    db.collection('list').where({
      _openid: app.globalData.openid
    }).get({
      success: function (res) {

        // 坚持天数
        let len = res.data.length - 1
        let days = res.data[len].index
        This.setData({days})

        // 平均体重
        let averageArr = [],average,averageAll = 0
        res.data.forEach(item => {
            item.hasOwnProperty('morningValue') ? (averageAll+=item.morningValue,averageArr.push(item.morningValue)) : ''
            item.hasOwnProperty('eveningValue') ? (averageAll+=item.eveningValue,averageArr.push(item.eveningValue)) : ''
        })
        average = parseInt(averageAll/averageArr.length,10)
        This.setData({average})


        // 最大 最小
        let max = Math.max.apply(null, averageArr),
            min = Math.min.apply(null, averageArr)
        This.setData({max,min})
        
        // 比减少
        let remove =  averageArr[averageArr.length-1] - averageArr[0]
        remove = remove.toFixed(1)
        This.setData({remove})

        // 当前体重
        let noWeight = averageArr[averageArr.length-1]
        This.setData({noWeight})


        // 体重走向
        let weightArr = []
        let weRunData = res.data.length
        This.setData({weRunData})

        res.data.forEach(item => {

          if(item.hasOwnProperty('morningValue')){
            weightArr.push({
              data:moment(item.date,'YYYY-MM-DD').format('M.D'),
              type:'上午',
              value:item.morningValue,
            })
          }

          if(item.hasOwnProperty('eveningValue')){
            weightArr.push({
              data:moment(item.date,'YYYY-MM-DD').format('M.D'),
              type:'下午',
              value:item.eveningValue,
            })
          }

        })
        
        
        lineChart.changeData(weightArr)
        
      }
    })

  },
  getMsg(){

    const db = wx.cloud.database()
    
    return new Promise((resolve, reject) => {
      db.collection('shareMsg').aggregate().sample({ size: 1 }).end().then(res=>{ 
        resolve(res.list[0])
      });
    })
  },
  async share(){

      const wxGetImageInfo = promisify(wx.getImageInfo)

      let shareMsg =  await this.getMsg();

      this.getInfo().then(userInfo => {
        Promise.all([
            wxGetImageInfo({
                src: userInfo.avatarUrl
            }),
            
        ]).then(res => {

            ctx.fillRect(0,0,rpx2px(500),rpx2px(760))
            ctx.clearRect(0,0,rpx2px(500),rpx2px(760))
            ctx.draw()

            // 纯白背景
            ctx.fillStyle = '#F6642F'
            ctx.fillRect(0,0,rpx2px(500),rpx2px(760))

            // 渐变背景
            let grad=ctx.createLinearGradient(0,0,rpx2px(700),rpx2px(760)); 
            grad.addColorStop(0,"#3BADF8");                  
            grad.addColorStop(1,"#7682FF");
            ctx.fillStyle=grad;                         
            ctx.fillRect(0,0,rpx2px(500),rpx2px(760));                    

            // 小程序二维码
            ctx.fillStyle = '#fff'
            ctx.fillRect(0,rpx2px(560),rpx2px(500),rpx2px(200))
            ctx.drawImage('../../images/qrcode.jpeg', rpx2px(20), rpx2px(580), rpx2px(160),rpx2px(160));
            ctx.setTextAlign('left')     
            ctx.setFillStyle('#000')     
            ctx.setFontSize(rpx2px(28))
            ctx.fillText('长按左侧二维码', rpx2px(220), rpx2px(640))
            ctx.setFillStyle('#2C5181')     
            ctx.setFontSize(rpx2px(24))
            ctx.fillText('晒出我的体重', rpx2px(220), rpx2px(680))
            ctx.setFontSize(rpx2px(20))
            ctx.setFillStyle('#797677')
            ctx.fillText('@21天体重记录 小程序', rpx2px(220), rpx2px(720))
              
            // 头像
            ctx.save(); 
            ctx.beginPath(); 
            ctx.arc(rpx2px(70), rpx2px(90), rpx2px(30), 0, Math.PI * 2, false);
            ctx.clip();
            ctx.drawImage(res[0].path, rpx2px(40), rpx2px(60), rpx2px(60), rpx2px(60)); 
            ctx.restore(); 

            // 用户名
            ctx.setTextAlign('left')    
            ctx.setFillStyle('#B3E2E8')  
            ctx.setFontSize(rpx2px(26)) 
            ctx.fillText(userInfo.nickName, rpx2px(120), rpx2px(100))

            // 体重
            ctx.setTextAlign('center')  
            ctx.setFillStyle('#fff')  
            ctx.setFontSize(rpx2px(140))         
            ctx.fillText(this.data.noWeight, rpx2px(220), rpx2px(350))
            ctx.setTextAlign('left')  
            ctx.setFillStyle('#fff')  
            ctx.setFontSize(rpx2px(30))         
            ctx.fillText('kg', rpx2px(380), rpx2px(350))

            // 语句
            ctx.setTextAlign('left')     
            ctx.setFillStyle('#B3E2E8')     
            ctx.setFontSize(rpx2px(30))
            ctx.fillText(shareMsg.title, rpx2px(40), rpx2px(450))
            ctx.setFillStyle('#FEFDF8')     
            ctx.setFontSize(rpx2px(25))
            ctx.fillText(shareMsg.text, rpx2px(40), rpx2px(500))
            
            ctx.draw()


            this.setData({showImg:true})
        })

      })

  },
  getInfo(){
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: function(res) {
          let { nickName , avatarUrl } = res.userInfo
          console.log(avatarUrl)
          resolve({ nickName , avatarUrl })
        }
      })
    })
  },

  cloShare(){
    this.setData({showImg:false})
    this.setData({setPage:false})
  },
  saveImg(){
    
    const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)

    wxCanvasToTempFilePath({
        canvasId: 'shareCanvas'
    }, this).then(res => {
        return wxSaveImageToPhotosAlbum({
            filePath: res.tempFilePath
        })
    }).then(res => {
        wx.showToast({
            title: '已保存到相册'
        })
    }).catch(err => {
      wx.showToast({
          icon: 'none',
          title: '授权失败'
        })

      this.setData({setPage:true})
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
  onShareAppMessage: function () {

  }
})