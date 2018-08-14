const { $Message } = require('../../components/iview/base/index');
import req from '../../utils/request.js';

Page({
  data: {
    list: [],
    checkModalVisible: false
  },
  onShow() {
    this.getList();
  },
  getList() {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    const userInfo = wx.getStorageSync('userInfo');
    const params = {
      form: {
        "interNumber": "21000002",
        "sellerId": userInfo.sellerId
      }
    };
    wx.showNavigationBarLoading();
    req.post('/getCheckAccount', params)
      .then(res => {
        wx.hideLoading();
        const {
          code,
          message,
          body: {
            businessResult,
            resultCode,
            checkAccountList
          }
        } = res;
        if (code - 0 === 200) {
          wx.hideNavigationBarLoading();
          if (resultCode != '000000') {
            wx.showToast({
              title: businessResult,
              duration: 2500,
              mask: true
            });
            return;
          }
          this.setData({
            checkAccountList
          });
        }
      });
  },
  handleCheck(e) {
    const { sellerid,mealtype } = e.currentTarget.dataset;
    this.setData({
      sellerId:sellerid,
      mealType:mealtype,
      checkModalVisible: true
    });
    
  },
  handleCheckOK() {
// wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    const { mealType,sellerId } = this.data;
    const params = {
      form: {
        "interNumber": "31000001",
        "sellerId": sellerId,
        "mealType":mealType
      }
    };
    wx.showNavigationBarLoading();
    req.post('/checkAccount', params)
      .then(res => {
        // wx.hideLoading();
        const {
          code,
          message,
          body: {
            businessResult,
            resultCode
          }
        } = res;
        if (code - 0 === 200) {
          wx.hideNavigationBarLoading();
          if (resultCode != '000000') {
            wx.showToast({
              title: businessResult,
              duration: 2500,
              mask: true
            });
            return;
          }
          this.handleCheckClose();
          $Message({
            content: '处理成功',
            type: 'success'
          });
          this.getList();
        }
      });
  },
  handleCheckClose() {
    this.setData({
      checkModalVisible: false
    });
  },
  handleCallPhone(){
    const phoneNumber = '400-820-5151';
    wx.makePhoneCall({
      phoneNumber
    })
  }
})