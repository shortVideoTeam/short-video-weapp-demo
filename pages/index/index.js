const app = getApp()

function request(url, data, method = 'GET') {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json'
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
  onLoad() {

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

  recharge() {
    request('http://localhost:8091/', {}, "POST").then(res => {
      console.log(res)

    }).catch(res => {
      console.log(res)
    })
  },

  pay() {
    request('http://localhost:8081/business/recharge/recharge', {
      "amount": 1,
      "domain": "",
      "payWay": "1",
      "rechargeRuleId": 1
    }, "POST").then(res => {
      console.log(res)
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
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