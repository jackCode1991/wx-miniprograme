// const App = getApp()

// Page({
//     data: {
//         indicatorDots: !0,
//         vertical: !1,
//         autoplay: !1,
//         interval: 3000,
//         duration: 1000,
//         current: 0,
//         goods: {
//             item: {},
//             images:[]
//         }
//     },
//     swiperchange(e) {
//         this.setData({
//             current: e.detail.current, 
//         })
//     },
//     onLoad(option) {
//         this.goodsDetail = App.HttpResource('/weChatMall/product/goodsDetail/:id', {id: '@id'})
//         this.setData({
//             id: option.id
//         })
//     },
//     onShow() {
//         this.getDetail(this.data.id)
//     },
//     addCart(e) {
//         const goods = this.data.goods.item._id
//         App.HttpService.addCartByUser(goods)
//         .then(res => {
//             const data = res.data
//             console.log(data)
//             if (data.meta.code == 0) {
//                 this.showToast(data.meta.message)
//             }
//         })
//     },
//     previewImage(e) {
//         const urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
//         const index = e.currentTarget.dataset.index
//         const current = urls[Number(index)]
        
//         App.WxService.previewImage({
//             current: current, 
//             urls: urls, 
//         })
//     },
//     showToast(message) {
//         App.WxService.showToast({
//             title   : message, 
//             icon    : 'success', 
//             duration: 1500, 
//         })
//     },
//     getDetail(id) {
//     	// App.HttpService.getDetail(id)
//         this.goodsDetail.getAsync({id: id})
//         .then(res => {
//             const data = res.data
//             console.log(data)
//         	if (data.code == 200) {
//                 data.data.images.forEach(n => n.imageUrl = App.renderImage(n.imageUrl))
//         		this.setData({
//                     'goods.item': data.data.item, 
//                     total: data.data.images.length, 
//                     'goods.images': data.data.images,
//                 })
//         	}
//         })
//     },
// })

Page({

 /**
   * 页面的初始数据
   */
  data: {
    // banner
    imgUrls: [
      "http://img5.imgtn.bdimg.com/it/u=2525822522,239525169&fm=26&gp=0.jpg",
      "http://img3.imgtn.bdimg.com/it/u=2192124848,2952521845&fm=214&gp=0.jpg",
      "http://img3.imgtn.bdimg.com/it/u=2660072450,2789984519&fm=26&gp=0.jpg"
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    // 商品详情介绍
    detailImg: [
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579085321248&di=0c4c4311f32e12f8bcf1f86c3b48e68e&imgtype=0&src=http%3A%2F%2Fpicapi.zhituad.com%2Fphoto%2F78%2F13%2F86FAF.jpg",
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579085462102&di=d6d732a82a42694eea3e4a7d65b2614b&imgtype=jpg&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D2825072931%2C1518064060%26fm%3D214%26gp%3D0.jpg",
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579085321245&di=0e2b4d6f0f3564b6351ebb7928d5af6d&imgtype=0&src=http%3A%2F%2Fimg.sccnn.com%2Fbimg%2F339%2F16232.jpg",

    ],
    quantity1: {
        quantity: 1,
        min: 1,
        max: 20,
        delStatus: 'disabled',
        addStatus: 'normal'
      },
      isLike: true,
      showDialog: false, 
},
    //预览图片
    previewImage: function (e) {
        var current = e.target.dataset.src;
        wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: this.data.imgUrls // 需要预览的图片http链接列表  
        })
    },
    // 立即购买
    immeBuy() {
    wx.showToast({
    title: '购买成功',
    icon: 'success',
    duration: 2000
    });
    },
    /**
     * sku 弹出
     */
    toggleDialog: function () {
    this.setData({
    showDialog: !this.data.showDialog
    });
    },
    /**
    * sku 关闭
    */
    closeDialog: function () {
    console.info("关闭");
    this.setData({
    showDialog: false
    });
    },
    /* 减数 */
    delCount: function (e) {
    console.log("刚刚您点击了减一");
    var count = this.data.quantity1.quantity;
    // 商品总数量-1
    if (count > 1) {
    count -= 1;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var delStatus = count <= 1 ? 'disabled' : 'normal';
    // 只有大于10件的时候，才能normal状态，否则disable状态  
    var addStatus = count >= 10 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
    quantity1: {
        quantity: count,
        delStatus: delStatus,
        addStatus: addStatus
    }
    });
    },
    /* 加数 */
    addCount: function (e) {
    console.log("刚刚您点击了加一");
    var count = this.data.quantity1.quantity;
    // 商品总数量-1  
    if (count < 10) {
    count += 1;
    }

    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var delStatus = count <= 1 ? 'disabled' : 'normal';
    // 只有大于10件的时候，才能normal状态，否则disable状态  
    var addStatus = count >= 10 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
        quantity1: {
            quantity: count,
            delStatus: delStatus,
            addStatus: addStatus
        }
        });
    },
    /* 输入框事件 */
    bindManual: function (e) {
        var count = this.data.quantity1.quantity;
        // 将数值与状态写回  
        this.setData({
        count: count
        });
    },
    /**
    * 加入购物车
    */
    addCar: function (e) {
        console.log(e.target.dataset.goodid);
        wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
        });
        console.info("关闭");
            this.setData({
            showDialog: false
        });
    },
    // 收藏
    addLike() {
        this.setData({
        isLike: !this.data.isLike
        });
    },
    // 跳到购物车
    toCar() {
        console.log(111);
        wx.switchTab({
        url: '/pages/cart/cart'
        })
    },
    // 立即购买
    immeBuy() {
        wx.showToast({
        title: '购买成功',
        icon: 'success',
        duration: 2000
    });
    },

})