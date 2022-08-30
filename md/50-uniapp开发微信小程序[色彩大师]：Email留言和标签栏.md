本章，我们将继续完善小程序 Demo，学习标签栏和云函数发送Email邮件功能。

## 标签栏

标签栏是吸附在小程序底部的栏位，通过点击它可以快速在核心页面之间切换。

要使用标签栏，首先得做点准备工作，比如合适的图标。隆重推荐字节跳动的开源图标库 [iconpark](https://iconpark.oceanengine.com/official) ，量大管饱，还完全免费。

在[iconpark](https://iconpark.oceanengine.com/official)选择**2种**你喜欢的图标，分别下载**线性**（未选中状态）和**填充**（选中状态）的 PNG 文件（所以共计2种4个图标），大小选择**48像素**。

将图标放到项目的 `/static/tabbar/` 目录，像下面这样：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-16.jpg)

下一步，新建**中国色chineseColor**页面：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-17.jpg)

记得勾选**在pages.js中注册**，使其自动注册：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-18.jpg)

uniapp 的路由切换，是通过 `pages.json` 全局配置文件实现的。同样的，标签栏也是在此文件中配置。

修改 `pages.json` 如下：

```json
// pages.json

{
  "pages": [{
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "变色龙"
      }
    },
    {
      "path": "pages/chineseColor/chineseColor",
      "style": {
        "navigationBarTitleText": "中国色",
        "enablePullDownRefresh": false
      }
    }
  ],
  "tabBar": {
    "color": "#000",
    "selectedColor": "#4976c9",
    "list": [{
        "iconPath": "/static/tabbar/platte00.png",
        "selectedIconPath": "/static/tabbar/platte01.png",
        "pagePath": "pages/index/index",
        "text": "调色盘"
      },
      {
        "iconPath": "/static/tabbar/layers00.png",
        "selectedIconPath": "/static/tabbar/layers01.png",
        "pagePath": "pages/chineseColor/chineseColor",
        "text": "中国色"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "变色龙",
    "navigationBarBackgroundColor": "#000",
    "backgroundColor": "#fff"
  },
  "uniIdRouter": {}
}
```

注意看标签栏的图标和路径是如何对应的。

刷新模拟器看看效果，底部就变成这样了：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-19.jpg)

既然要做**中国色**，那首先得要有足够的颜色数据。

将事先准备好的颜色数据导入为 `common/chineseColors.js` 文件：

```javascript
// common/chineseColors.js

const chineseColors = [{
  "name": "粉鳳仙",
  "pinyin": "fěn fèng xiān",
  "hsb": {
    h: 0,
    s: 18,
    b: 92,
  },
}, {
  "name": "浅棕茶",
  "pinyin": "qiǎn zōng chá",
  "hsb": {
    h: 38,
    s: 24,
    b: 69,
  },
}, {
  "name": "暗苔緑",
  "pinyin": "àn tái lv̀",
  "hsb": {
    h: 151,
    s: 33,
    b: 44,
  },
}, {
  "name": "銀白色",
  "pinyin": "yín bái sè",
  "hsb": {
    h: 44,
    s: 9,
    b: 92,
  },
}, 

...
]

export {
  chineseColors,
}

// 数据来源: 
// Frank Lin. http://www.2kil.com/
// Dlog_Shuai  https://ext.dcloud.net.cn/plugin?id=3558

// 数据有筛选和清洗。有需要的读者可从 https://github.com/stacklens/chameleon-tutorial 下载。
```

在前面章节中，我们已经开发完成了用来展示颜色的组件 `ColorPanel` ，可以继续拿来复用。不过在此之前，先要解决一个小问题：`ColorPanel` 作为**子组件**，它应该如何修改**父组件**的数据呢？可能你会想到修改 `props` ，毕竟父组件是通过它来动态改变子组件的状态的。但是很遗憾，Vue 里不推荐你这样做，因为这样互相修改数据很容易导致项目难以维护。

解决方法是子组件不直接修改父组件的数据，而是抛出一个**事件**，通知父组件：我这边现在发生了状况，你看看要不要更新下数据？

因此，在 `ColorPanel.vue` 增加一行代码，抛出事件：

```javascript
// components/ColorPanel/ColorPanel.vue

...

methods: {
  ...
  
  onClickCanvas() {
    uni.setClipboardData({
      data: "#" + this.hex,
    });
    // 新增代码
    this.$emit("clickPanel", this.hex)
  },
}

...
```

`this.$emit()` 就是抛出事件的函数了，父组件可以通过 `clickPanel` 方法“感应”到事件的发生。

然后就可以愉快的写新页面 `chineseColor.vue` 了：

```html
<!-- pages/chineseColor/chineseColor.vue -->

<template>
  <view>
    <uni-transition ref="trans" mode-class="fade" :duration="0" :show="true">
      <view class="content">
        <view class="card-padding">
          <uni-row>
            <uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" v-for="(item, index) in colors" :key="index">
              <ColorPanel :hsb="item.hsb" @clickPanel="onClickPanel"></ColorPanel>
              <view style="padding-bottom: 10px;"></view>
            </uni-col>
          </uni-row>
        </view>
      </view>
    </uni-transition>
  </view>
</template>

<script>
  import {
    chineseColors
  } from "../../common/chineseColors.js"

  export default {
    data() {
      return {
        colors: chineseColors,
      }
    },
    // 生命周期函数
    onReady() {
      this.$refs.trans.init({
        duration: 2000,
        timingFunction: 'ease-in-out',
        delay: 500
      })
    },
    methods: {
      onClickPanel(hex) {
        this.$refs.trans.step({
          backgroundColor: "#" + hex
        })
        // 开始执行动画
        this.$refs.trans.run(() => {})
      },
    },
  }
</script>

<style scoped>
  .content {
    width: 100vw;
    height: 100vh;
  }
  .card-padding {
    padding-left: 20px;
    padding-top: 15px;
  }
</style>
```

代码量不大，需要注意的地方有两个：

- 注意看父组件是如何通过 `@clickPanel="onClickPanel"` 接住子组件抛出的事件的。
- 为了模仿中国色数据来源 [Frank Lin.](http://www.2kil.com/) 炫酷的背景色过渡特效，这里用 `uni-ui` 插件的过渡元素 `<uni-transition>` 将所有内容包裹起来，并根据文档，调用它的 `init()` 、 `step()` 、 `run()` 等接口，当你点击画布时，让页面背景也过渡到对应的颜色。

差不多了，来看看效果：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-gif-20.gif)

任意点击画布，背景色也顺滑地过渡到对应颜色。

## 云函数与Email

发送Email是很实用的功能，比如用于开发者和用户的沟通。出于安全等方面的考虑，通常会在**云函数**中来实现。

**云函数**的详细介绍请看[uniCloud文档](https://uniapp.dcloud.net.cn/uniCloud/)，这里简明扼要说特点：

- 代码运行在云端，因此每次更新代码需要部署。
- 可以承担简单的传统后端的功能，相对以往租用云服务器的模式，会更加的实惠甚至免费。

> 在我之前的文章[微信小程序开发：云端发送Email邮件](https://www.dusaiphoto.com/article/182/)中，已经实践过了。让我们在 uniapp 中再回味一下吧。

和前面一样，新建标签栏需要一些准备工作：

- 在 [iconpark](https://iconpark.oceanengine.com/official) 下载喜欢的图标，并在 `pages.json` 注册 `feedback` 页面和链接它的 `tabbar` 。
- 在 `pages` 目录创建 `feedback` 页面。

然后就可以写 `feedback.vue` 了。

老规矩，首先是模板：

```html
<!-- pages/feedback/feedback.vue -->

<template>
  <view>
    <view class="container">
      <view class="text content-center">
        <text>想要新功能？</text>
      </view>
      <view class="text content-center">
        <text>任何意见或建议都非常感谢。</text>
      </view>
      <view class="text content-center">
        <text>你可以提交下面的表格来告诉我。</text>
      </view>

      <view class="padding-t-12">
        <uni-easyinput type="textarea" autoHeight v-model="feedbackText" placeholder="对开发者的话..."></uni-easyinput>
      </view>

      <view class="content-center padding-t-12">
        <button @click="submit" type="primary" size="mini">
          提交留言
        </button>
      </view>
    </view>

    <!-- 提示消息 -->
    <uni-popup ref="popup" type="message">
      <uni-popup-message :type="msgType" :message="msgContent"></uni-popup-message>
    </uni-popup>
  </view>
</template>

...
```

代码里没有出现任何新知识，硬要说的话就是**通知栏弹出层** `<uni-popup>` 了，绑定了 `:type` 和 `:message` 是为了根据邮件发送成功与否，动态修改弹出层的颜色和文本。

然后是脚本：

```javascript
// pages/feedback/feedback.vue

...

<script>
  export default {
    data() {
      return {
        feedbackText: "",
        msgType: "",
        msgContent: "",
      }
    },
    computed: {
      // 防止留言文本过长
      mailContent: function() {
        return this.feedbackText.trim().slice(0, 2000)
      },
    },
    methods: {
      // 提交email留言
      submit() {
        if (this.mailContent === "") {
          return uni.showToast({
            title: "请输入想说的话哟",
            icon: "none",
          })
        }
        this.sendMail()
      },
      sendMail() {
        // 调用云函数sendMail()
        uniCloud.callFunction({
            name: 'sendMail',
            data: {
              content: this.feedbackText,
            }
          })
          .then(res => {
            if (res.success === true) {
              this.msgType = "success"
              this.msgContent = "邮件发送成功"
              this.feedbackText = ""
            } else {
              this.msgType = "error"
              this.msgContent = "邮件发送失败，晚点再尝试下吧~"
            }
            return this.$refs.popup.open()
          });
      },
    }
  }
</script>

...
```

脚本里的新玩具，就是这个 `uniCloud.callFunction()` 方法了，它的作用就是发送 web 请求，调用在云端的云函数。 `name` 是云函数的名字， `data` 是需要传递过去的数据。

最后是样式：

```css
/* pages/feedback/feedback.vue */

...

<style scoped>
  .container {
    padding: 20px;
  }

  .content-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    font-size: 14px;
    color: #434343;
    font-weight: 500;
  }

  .padding-t-12 {
    padding-top: 12px;
  }
</style>
```

页面里的代码就这么多了，接下来搞花里胡哨的**云函数**。

既然云函数是在云端的，所以需要进行一点设置，告诉云服务商你想搞一块地盘玩玩。

在项目路径上右键，选择**创建uniCloud云开发环境**，再选择**阿里云**：（阿里云流程简单些）

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-22.jpg)

 这时候项目里多出来 `uniCloud` 路径，右键点击**云服务空间初始化向导**：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-23.jpg)

接着就进入 `uniCloud` 的账号申请、阿里云服务申请等环节，很简单跟着向导走就行，这里就不展开了：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-24.jpg)

创建好账号后，**新建**服务空间**chameleon**，点击下一步，空间就关联上了：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-25.jpg)

别急，快完成了。

右键点击 `uniCloud/cloudfunctions/` 路径，选择**新建云函数/对象**：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-26.jpg)

然后创建名叫 `sendMail` 的云函数。

为了简化开发，发送Email需要借助库的帮助。

右击 `sendMail` ，选择**使用命令行窗口打开所在目录**，像下面这样：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-28.jpg)

> 这时候会弹窗问你要用内置窗口还是外置。
>
> 你可以选择内置命令行窗口，等待安装完成并打开。

在打开的命令行窗口中输入：

```bash
npm install nodemailer
```

安装发送Email的库。

> 注意，一定要看清楚安装的路径！确保库被安装到 `../sendMail/node_modules/` 路径中了。

安装成功后，准备工作就搞完了。

接着编写 `../sendMail/index.js` 文件，这就是云函数的入口：

```javascript
// uniCloud/cloudfunctions/sendMail/index.js

'use strict';
const nodemailer = require('nodemailer')

// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', // 网易163邮箱是 smtp.163.com
  port: 465,           // 网易邮箱端口是 25
  auth: {
    user: '填写你自己的邮箱账号',    // 邮箱账号
    pass: '填写你自己的邮箱授权码'   // 邮箱的授权码
  }
};

exports.main = async (event, context) => {
  let transporter = nodemailer.createTransport(config);
  const content = event.content
  // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '用户反馈 <xxx@yyy.com>',
    // 主题
    subject: 'Weapp [Chameleon] 用户反馈',
    // 收件人
    to: 'xxx@yyy.com',
    // 邮件内容，text或者html格式
    text: content
  };
  const info = await transporter.sendMail(mail)
  return info
}
```

由于有 `nodemailer` 库的帮助，代码很简单，调用接口就完事了。这里难倒一众好汉的，通常是邮箱的 host、port、auth填不对这种低级的问题。

这里只简单提一下 QQ 邮箱的授权码。准备一个QQ邮箱。进入邮箱后，点击：设置 - 账户 - 开启 `POP3/SMTP` 服务。然后跟着QQ邮箱的引导步骤，最终你获得的授权码应该像下图这样：

![](https://blog.dusaiphoto.com/img-sufacego3/todo-110-28.png)

写好云函数文件后，记得还要上传云函数！

它运行在云端，更新代码后需要部署：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-30.jpg)

大功告成了！

重启服务（建议选择**连接云端函数**）：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-31.jpg)

效果如下：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-gif-31.gif)

提交留言后，你的Email邮箱中也会立即收到留言的内容。

## 结语

本系列文章到这里就结束了，相信你已经能感受到 uniapp 开发的优势了：

- 多端开发，一套代码处处运行，适配小团队。
- 以 Vue 为底层框架，学了怎么都不亏。
- 国内使用人群还算庞大，生态正在茂盛发展。

接下来的学习，你可能需要系统性的阅读[Vue文档](https://cn.vuejs.org/)、[uniapp文档](https://uniapp.dcloud.net.cn/)，逐步扩展到学习[uniCloud](https://uniapp.dcloud.net.cn/uniCloud/)、[前端网页托管](https://uniapp.dcloud.net.cn/uniCloud/hosting.html)以及三方库等衍生工具和生态中了。

路漫漫其修远兮，吾辈一同求索。

> 作者杜赛，新人写手，写有[Django搭建博客](https://www.dusaiphoto.com/course/articles-list/1/)、[微信小程序开发todo-list](https://www.dusaiphoto.com/article/167/)等系列文章。

欢迎来[Github仓库](https://github.com/stacklens/chameleon-tutorial)和**变色龙小程序**中给我点赞！

![](https://blog.dusaiphoto.com/img-sufacego3/cha_mp_qrcode.jpg)

> 线上小程序经过版本更新（根据用户反馈的建议），功能相比教程中有所扩展。

