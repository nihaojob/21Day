// 云函数入口文件
const cloud = require('wx-server-sdk')

const moment = require('moment')

cloud.init(
  // { traceUser: true }
)

const db = cloud.database()
const wxContext = cloud.getWXContext()

exports.main = async (event, context) => {

  let openId = event.userInfo.openId
  delete event.userInfo
  try {
    return await db.collection('list').where({
      _openid:openId,
      date:moment().format('YYYY-MM-DD')
    })
    .update({
      data: {
      	...event
      },
    })
  } catch(e) {
    console.error(e)
  }
}

