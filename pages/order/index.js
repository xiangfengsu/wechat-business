import req from '../../utils/request.js';

Page({
  data: {
    activeTab: 0,
    tabs: [{
      icon: 'icon-sun',
      text: '午餐'
    }, {
      icon: 'icon-moon',
      text: '晚餐'
    }]
  },
  onShow() {
    // 默认获取午餐
    this.getData(1);
  },
  handleTab({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    this.setData({
      activeTab: index
    });
    this.getData(index + 1);
  },
  getData(mealType) {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    const userInfo = wx.getStorageSync('userInfo');
    const params = {
      form: {
        "interNumber": "21000001",
        "orderDate": userInfo.orderDate,
        "sellerId": userInfo.sellerId,
        "mealType": mealType || ""
      }
    };
    wx.showNavigationBarLoading();
    req.post('/getOrderList', params)
      .then(res => {
        wx.hideLoading();
        const {
          code,
          message,
          body: {
            businessResult,
            resultCode,
            orderList,
            totalNum,
            orderNum,
            leftNum,
            useNum,
            waitNum,
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
          const orderStatusDict = {
            '-2': '已删除',
            '-1': '处理失败',
            '0': '待处理',
            '1': '待领取',
            '2': '已领取',
            '3': '已退款'
          }
          const orderTimeDict = {
            '1': '11:00',
            '2': '12:00',
            '3': '13:00',
            '4': '14:00',
            '5': '15:00',
            '6': '(午饭)半小时内',
            '7': '17:00',
            '8': '18:00',
            '9': '19:00',
            '10': '20:00',
            '11': '21:00',
            '12': '(晚饭)半小时内'
          }
          const newOrderList = orderList.map(item => {
            item.orderTime = orderTimeDict[item.orderTime];
            item.orderStatus = orderStatusDict[item.orderStatus];
            return item;
          });
          this.setData({
            totalNum,
            orderNum,
            leftNum,
            useNum,
            waitNum,
            orderList: newOrderList
          })
        }
      });
  }
})