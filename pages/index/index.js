const app = getApp()

function request(url, data, method = 'GET', config = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json',
        ...config
      },
      method: method,
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}


Page({
  data: {
    userInfo: {},
  },
  onLoad(options) {
    console.log(options)
    const inviteCode = options.inviteCode || null
    // 是否有邀请码, 前端判断
    if (inviteCode) {
      // 登陆 前端判断 去登陆

      // 有token 
      // if(token)
      // 存在 , 代表通过别人邀请码点击进来
      // 调用接口， 这个用户邀请记录表是否存在, 不存在绑定当前用户给邀请者

      // 弹出红包弹窗 ,前端判断
      // 判断有没有领取过红包, 没有就加记录, 给当前用户和邀请者都分发红包金额 ， 扣除总金额， 添加记录
      // 如果已经领取过了， 后台就不做处理直接给提示已领取过了 
    } else {

    }
  },
  getUserProfile(e) {
    let code = null
    wx.login({
      success: (res) => {
        if (res.code) {
          code = res.code
        }
      }
    })
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(code)
        console.log(res)
        request('http://localhost:8091/wx/user/auth', {
          code: code,
          appid: 'wx9732fa565cbd06fd',
          encryptedData: res.encryptedData,
          iv: res.iv,
          rawData: res.rawData,
          signature: res.signature,
          userInfo: res.userInfo
        }, "POST").then(res => {
          console.log(res)
        }).catch(res => {
          console.log(res)
        })
      }
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail)
    request('http://localhost:8091/wx/user/phone', {
      userKey: 'ov8Tx4mxk6W0XhTHwBBuAmgY5-cc',
      appid: 'wx9732fa565cbd06fd',
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }, "POST").then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  },

  addVideo() {
    console.log('add')
    request('http://localhost:8091/', {

    }, "POST").then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })

    wx.requestPayment
  },

  pay() {
    request('http://localhost:8081/business/recharge/recharge', {
      "amount": 1,
      "domain": "",
      "payWay": "1",
      "rechargeRuleId": 1
    }, "POST", {
      'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjQ4MDMzMDksInVzZXJuYW1lIjoiMTAwMDgifQ.7deSEyTk_iHH3ueh6I_VjzpZq8F7dwN14NbDiKFlbHM'
    }).then(res => {
      console.log(res)
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.packageValue,
        signType: res.data.signType,
        paySign: res.data.paySign,
        'success': function (res) {
          console.log(res)
        },
        'fail': function (res) {
          console.log(res)
        }
      })
    }).catch(res => {
      console.log(res)
    })

  }
})