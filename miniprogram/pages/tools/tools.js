// miniprogram/pages/tools/tools.js
import promisify from '../../lib/promisify.js'; 

function createRpx2px() {
  const { windowWidth } = wx.getSystemInfoSync()

  return function(rpx) {
    return windowWidth / 750 * rpx
  }
}

const rpx2px = createRpx2px()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    showImg:false,
    msg:'获取中...',
    url:'',
    name:'',
  },

  sendTemplateMessageViaCloudFunction(e) {
    const db = wx.cloud.database()

    console.log( e.detail.formId)
      wx.cloud.callFunction({
        name: 'pushMsg',
        data: {
          formId: e.detail.formId,
        },
        // eslint-disable-next-line
      }).then((res) => {
        console.log('[云调用] [发送模板消息] 成功: ', res)
      }).catch(err => {
        
        console.error('[云调用] [发送模板消息] 失败: ', err)
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    // const db = wx.cloud.database()
    // wx.cloud.callFunction({
    //              name: 'pushMsg',
    //              data: {
    //                 formId:'gfBM-mnmphPfUhlK9lho3U83IM07GrQPYeFN6Rd6Xk8'
    //              },
    //              success: res => {
    //                 wx.showToast({
    //                   title: '新增记录成功',
    //                 })
    //              },
    //              fail: err => { 
    //                 wx.showToast({
    //                   icon: 'none',
    //                   title: '新增记录失败'
    //                 })
    //              }
    //            })





      // let arr = [
      // '我们是胖子，营养过剩的胖子，少吃点不会怎样的。' ,
      // '加菲猫和机器猫只是卡通人物，我们生活在现实中。' ,
      // '你就一直做一个穿过气衣服的土的掉渣的死胖子吧！' ,
      // '没办法！人家瘦子！胃小！再不克制就一辈子羡慕别人吧！' ,
      // '看美女一个个活得更滋润，为啥？' ,
      // '想证明给其他人看看，我可以！你的志气哪儿去了？' ,
      // '心灵美比外在美重要，但两全其美岂不是更好？' ,
      // '不瘦下来不准买新衣服！不瘦下来不准再做头发！你就一直做一个穿过气衣服的土的掉渣的死胖子吧！' ,
      // '饿着痛苦还是丑着痛苦？我要瘦！要美！' ,
      // '商场里漂亮的衣服，难道你不想穿上它？' ,
      // '女人不对自己狠心，男人就会对女人狠心。' ,
      // '你们要自己加油。要证明给自己和一些傻X看。就算以前是胖子也会有瘦下来变漂亮的一天。' ,
      // '青春只有一次，我们不能浪费青春！我们要有绚丽的青春！' ,
      // '想减肥就别老是给自己找借口，少墨迹，果断点会死？' ,
      // '散步时，男朋友可以楼主你的腰。' ,
      // '其他女人都能瘦下来你为啥不行！你是白痴吗？你天生就该当肥猪吗？' ,
      // '我坚决要洗心革面，美女大变身！' ,
      // '美，瘦了一点有什么用啊，才不要听别人虚情假意的说，你好像瘦了一点。瘦一点有什么用，听就要听别人说，哇啊！你好美哦！那样才是美得冒泡。' ,
      // '猪胖还能多卖点钱，你胖能卖钱吗？胖子比猪还不值钱。'

      // ]

    // const db = wx.cloud.database()
    // let This = this
    
    // db.collection('cheerMsg').get({
    //   success: function (res) {

    //     wx.showModal({
    //       content: res.data[Math.ceil(Math.random()*res.data.length)].msg,
    //       showCancel:false
    //     })

    //   }
    // })



    // const queue = () => {
    //   const list = []; // 队列
    //   let index = 0;  // 游标

    //   // next 方法
    //   const next = () => {
    //     if (index >= list.length - 1) return;    

    //     // 游标 + 1
    //     const cur = list[++index];
    //     cur(next);
    //   }

    //   // 添加任务
    //   const add = (...fn) => {
    //     list.push(...fn);
    //   }

    //   // 执行
    //   const run = (...args) => {
    //     const cur = list[index];
    //     typeof cur === 'function' && cur(next);
    //   }

    //   // 返回一个对象
    //   return {
    //     add,
    //     run,
    //   }
    // }

    // // 生成异步任务
    // const async = (x) => {
    //   return (next) => {// 传入 next 函数

    //     let obj = {
    //       msg:x
    //     }
    //     db.collection('cheerMsg').add({
    //          data: {
    //            ...obj
    //          },
    //          success: res => {
    //           console.log(x+'success')
    //           next();
    //          },
    //          fail: err => {
    //            console.log(x+'error')
    //          }
    //        })


    //   }
    // }

    // const q = queue();
    // const funs = arr.map(item => async(item));

    // q.add(...funs);
    // q.run();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  share(){

      const wxGetImageInfo = promisify(wx.getImageInfo)

      this.getInfo().then(userInfo => {

        Promise.all([
            wxGetImageInfo({
                src: userInfo.avatarUrl
            })
        ]).then(res => {

            const ctx = wx.createCanvasContext('shareCanvas')

            // 纯白背景
            ctx.fillStyle = '#F6642F'
            ctx.fillRect(0,0,rpx2px(500),rpx2px(760))

            // 渐变背景
            var grad=ctx.createLinearGradient(0,0,rpx2px(700),rpx2px(760)); 
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
            ctx.setFontSize(rpx2px(190))         
            ctx.fillText('175', rpx2px(220), rpx2px(350))
            ctx.setTextAlign('left')  
            ctx.setFillStyle('#fff')  
            ctx.setFontSize(rpx2px(30))         
            ctx.fillText('kg', rpx2px(380), rpx2px(350))

            // 语句
            ctx.setTextAlign('left')     
            ctx.setFillStyle('#B3E2E8')     
            ctx.setFontSize(rpx2px(30))
            ctx.fillText('连自己都不努力，别人有没办法', rpx2px(40), rpx2px(450))
            ctx.setFillStyle('#FEFDF8')     
            ctx.setFontSize(rpx2px(25))
            ctx.fillText('爱自己 | 爱自律', rpx2px(40), rpx2px(500))
            
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
          resolve({ nickName , avatarUrl })
        }
      })
    })
  },
  onReady: function () {

    


        
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
    })
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