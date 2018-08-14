//app.js

import req from './utils/request.js';
const config = {
  // serverUrl: 'http://118.190.154.11:3000/mock/26/swx'
  serverUrl:'https://api.1soche.com/swx'
};
App({
  onLaunch: function () {
    // 登录
    const token = wx.getStorageSync('token') || '';
    token === '' && wx.reLaunch({
      url:'/pages/login/index'
    })
    this.configReq();
    wx.login({
      success: res => {
        console.log(res);
        const { code } = res;
        const data = {
          form:{
            interNumber:'11000005',
            code
          }
        };
        req.post('/wxLogin',data)
        .then(data=>{
          const { resultCode,businessResult='',openid } = data.body;
          if(resultCode === '000000'){
            wx.setStorageSync('openid',openid);
          }else{
            wx.showToast({
              title:`授权失败-${businessResult}`
            });
          }
        })
       
      }
    })
    
  },
  configReq() {
    // wx.setStorageSync('token','18516602043');
    req.baseUrl(config.serverUrl)
      .interceptor(res => {
        switch(res.data.code-0){
          case 200:
            const { resultCode,businessResult='' } = res.data.body;
            if(resultCode!=='000000'){
              wx.showToast({
                title:businessResult
              });
            }
            return true;
          default:
            wx.showToast({
              title: '操作失败',
            })
            return false;
        }
      })
  },
  globalData: {
    userInfo: null
  }
})