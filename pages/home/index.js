import req from '../../utils/request.js';

const Dialog = require('../../components/dialog/dialog');

Page({
  data: {
   
  },
  onShow() {
  },
  handleScan(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        const { errMsg, result } = res;
        if(errMsg === 'scanCode:ok'){
          const orderId = result.split(':').length === 2 ? result.split(':')[1]:0;
          console.log('orderId,',orderId);
          this.scanFetch(orderId);
        }
      }
    })
  },
  scanFetch(orderId){
    const { sellerId } = wx.getStorageSync('userInfo') || {};
    const data = {
      form:{
        interNumber:'21000005',
        orderId,
        sellerId
      }
    };
    req.post('/scanQrcodeToTakeMeal',data)
    .then(data=>{
      const { resultCode } = data.body;
      if(resultCode === '000000'){
       wx.showToast({
         title:'扫描成功'
       });
      }
    });
  },
  onShareAppMessage(res) {
    return {
      title: '迅羽商家版',
      path: '/pages/home/index'
    }
  }
})