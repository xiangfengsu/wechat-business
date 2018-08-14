import req from '../../utils/request.js';
const app = getApp();
const statusDic = [{
  key:-1,
  value:'审核失败'
},{
  key:0,
  value:'待审核'
},{
  key:1,
  value:'审核通过'
}];
Page({
  data: {
    phoneNumber:'400-820-5151'
  },
  onShow(options) {
    // test token;
    // wx.setStorageSync('token',18011111111);
    const token = wx.getStorageSync('token');
    if(token === ''){
      wx.reLaunch({
        url:'/pages/login/index'
      });
    }else{
      this.getUserInfo();
    }
  },
  getUserInfo(){
    const token = wx.getStorageSync('token') || '';
    const data = {
      form:{
        interNumber:'11000004',
        mobile:token
      }
    };
    req.post('/queryUserInfo',data)
    .then(data=>{
      const {resultCode, name,address,mobile,linkman } = data.body;
      if(resultCode === '000000'){
        this.setData({
          name,
          mobile,
          address,
          linkman
        });
        wx.setStorageSync('userInfo',data.body);
      }
      
    })
  },
  
  callTelHandle(e){
    const phoneNumber = this.data.phoneNumber;
    wx.makePhoneCall({
      phoneNumber
    })
  },
  goLoginPageHandle(){
    wx.navigateTo({
      url: '/pages/login/index'
    })
  },
  reeditHandle(){
    wx.setStorageSync('registerType','update');
    wx.reLaunch({
      url: '/pages/register/index'
    })
  },
  loginOutHandle(){
    const token = wx.getStorageSync('token') || '';
    const data = {
      form:{
        interNumber:'11000003',
        mobile:token
      }
    };
    req.post('/loginOut',data)
    .then(data=>{
      const { resultCode,businessResult } = data.body;
      if(resultCode === '000000'){
        wx.clearStorageSync();
        wx.reLaunch({
          url: '/pages/login/index'
        });
        
      }
    });
  }
  
})