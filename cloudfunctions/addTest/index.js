// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const wxContext = cloud.getWXContext()
const db = cloud.database()


// 查询
const getInfo = (openId) => {
    return db.collection('users').where({
        _openid: openId
    }).get()
}

// 新增
const addInfo = (openId,Param) => {
    return db.collection('users').add({
        data: {
            _openid: openId,
            ...Param
        }
    })
}

// 修改
const updataInfo = (openId, Param) => {
    return db.collection('users').where({
            _openid: openId,
        })
        .update({
            data: {
                ...Param
            },
        })
}

exports.main = async (event, context) => {

    try {


        let openId = event.userInfo.openId

        delete event.userInfo

        // 用户表中是否存在判断
        let isHas = await getInfo(openId, event).then(res => {
            let hasInfo
            res.data.length == 0 ? hasInfo = false : hasInfo = true
            return hasInfo
        })

        // 新增或修改
        let result

        if(isHas){
         await updataInfo(openId, event).then(res => { result = res }) 
        }else{
          await addInfo(openId, event).then(res => { result = res })
        }


        return result

        // return Result
    } catch (e) {
        console.error(e)
    }
}