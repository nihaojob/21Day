// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const moment = require('moment')

// 昨日签到列表
const getList = () => {
    return db.collection('list').where({
		      date:moment().format('YYYY-MM-DD')
		    }).get()
}

// 获取昵称
const getName = (openId) => {
    return db.collection('users').where({
		      _openid: openId
		    }).get()
}


// 保存排行榜
const addTopUserInfo = (openId,Param) => {
    return db.collection('topList').add({
        data: {
            _openid: openId,
            ...Param
        }
    })
}


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {

    // 删除之前数据
    let removeList = await db.collection('topList').where({'_openid':_.neq('123')}).remove()

    // 获取列表数据
  	let result
  	await getList().then(res => {
  		result = res.data
  	})

    // 循环存储
    for(let item of result) {
       await getName(item._openid).then(res => {
          res.data.length == 1 ? item.name = res.data[0].nickName : item.name = '匿名用户'
          res.data.length == 1 ? item.url = res.data[0].avatarUrl : item.avatarUrl = ''
          addTopUserInfo(item._openid,item).then(res => {
            console.log(res)
          }) 

        })
    }
    
    console.log('end')
  	return result

  }catch(e){

  }
}