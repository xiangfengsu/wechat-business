const { $Message } = require('../../components/iview/base/index');
import req from '../../utils/request.js';

Page({
  data: {
    mealNumList: [{
      mealType: 1,
      // 餐品数量
      mealNum: 10,
      // input输入的数字
      inputNumber: ''
    }, {
      mealType: 2,
      mealNum: 20,
      inputNumber: ''
    }]
  },
  onShow() {
    this.getData();
  },
  // 获取餐品数量
  getData() {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    const userInfo = wx.getStorageSync('userInfo');
    const params = {
      form: {
        "interNumber": "21000007",
        "orderDate": userInfo.orderDate,
        "sellerId": userInfo.sellerId,
      }
    };
    wx.showNavigationBarLoading();
    req.post('/queryBackNum', params)
      .then(res => {
        wx.hideLoading();
        const {
          code,
          message,
          body: {
            businessResult,
            resultCode,
            mealNumList
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

          mealNumList.sort((a, b) => {
            return a.mealType - b.mealType;
          });
          const initMealNumList = [...this.data.mealNumList];
          mealNumList.forEach((_, index) => {
            Object.assign(initMealNumList[index], mealNumList[index]);
          });
          this.setData({
            mealNumList: initMealNumList
          });
        }
      });
  },
  handleInputChange(event) {
    const {
      detail: {
        value = ''
      },
      currentTarget: {
        dataset: {
          mealtype = ''
        }
      }
    } = event;
    const index = this.data.mealNumList.findIndex(item => item.mealType == mealtype);
    this.setData({
      [`mealNumList[${index}].inputNumber`]: value
    });
  },
  // 确定提交
  handleConfirmTap(event) {
    const mealType = event.currentTarget.dataset.mealtype - 0;
    const { mealNumList } = this.data;
    const index = mealNumList.findIndex(item => item.mealType == mealType);
    // input输入的数字
    const { inputNumber } = mealNumList[index];
    const receiveNum = inputNumber > 0 ? inputNumber - 0 : '';
    if (receiveNum == '') {
      wx.showToast({
        title: '请输入餐品数量',
        duration: 2000,
        mask: true
      });
      return;
    }

    wx.showLoading({
      title: "加载中",
      mask: true
    });
    const userInfo = wx.getStorageSync('userInfo');
    const params = {
      form: {
        "interNumber": "21000004",
        "sellerId": userInfo.sellerId,
        "orderDate": userInfo.orderDate,
        mealType,
        backNum:receiveNum 
      }
    };
    wx.showNavigationBarLoading();
    req.post('/saveBackNum', params)
      .then(res => {
        wx.hideLoading();
        const {
          code,
          message,
          body: {
            businessResult,
            resultCode,
            mealNumList
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
          $Message({
            content: '处理成功',
            type: 'success'
          });
          this.getData();
          // 清空input
          const mealNumList = [...this.data.mealNumList];
          mealNumList.forEach(item => item.inputNumber = '');
          this.setData({ mealNumList });
        }
      });
  },
})