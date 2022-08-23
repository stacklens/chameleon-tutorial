作为独立开发者，我经常头疼于图标等 **UI 的配色**、**16进制色码转换**等问题。

正好最近在琢磨**小程序开发**，于是用 **uni-app** 框架撸了一个叫**变色龙**的色彩搭配小程序。

核心的功能大概这样：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-gif-00-03.gif)

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-gif-00-04.gif)

> 色彩数据来源：[Frank Lin.](http://www.2kil.com/)，[uiGrdients](https://uigradients.com/#GradeGrey)，[Dlog_Shuai](https://ext.dcloud.net.cn/plugin?id=3558)

功能简单实用。（自认为）

你可以在这里查看小程序的完整功能：

![](https://blog.dusaiphoto.com/img-sufacego3/cha_mp_qrcode.jpg)



所以就想干脆挑出里面的重点，写成**短篇入门教程**，给想要学习 uniapp 的同学。

**核心内容**：

- uniapp 结构、配置、规范、插件
- Vue 模板语法、组件、状态、计算属性、事件等基础知识
- uniCloud 云函数

> 主要涉及到调色盘、色码转换、相似色、中国色和用户留言功能板块。

写作风格和我的其他教程一样，**新手向，入门级**。

> 浅显易懂，但 Vue 开发需要一点前端基础，如果你是纯新手，非常建议先浏览[Vue官方文档](https://cn.vuejs.org/)。

## uniapp是什么

uniapp 是一个跨平台的开发框架，细节可以在[uniapp官网](https://uniapp.dcloud.net.cn/)查看，这里只说其最显著的优点：

- 跨平台，只写**一套代码**，小程序、H5、原生 App 都能运行，对小团队来说，极大程度提高了效率（理论上）
- 集成了 uniCloud 、uni-id、前端网页托管等一系列工具，降低了开发难度。

更优秀的是，它基于 Vue 进行开发。即使你以后不用 uniapp ，但学了 Vue 也怎么都不亏。

> 微信小程序原生语言和 Vue 很像，但是细节上的差别却不少，转换有时间成本。

所以还犹豫啥赶紧学起来，我保证这个教程会短小精悍（仅五个章节左右），花不了你几天时间的。

## 准备工作

多说无益，不如上手尝试下。

新手开发 uniapp 建议用官方的 [HBuilder](https://hx.dcloud.net.cn/Tutorial/install/windows) ，由于是自家的，很多功能都集成进去了。

下载好 HBuilder 后，新建一个 uniapp 项目：

![](https://blog.dusaiphoto.com/img/uniapp-cha-01.jpg)

因为是做一个色彩方面的小程序，所以项目名称就是“变色龙”了。

Vue 版本是 2，一是 Vue 2 比较容易上手，二是项目中用到的插件需求。

接着安装需要的插件：

- [uni-ui](https://ext.dcloud.net.cn/plugin?id=55)：官方提供的跨平台通用UI插件。
- [t-color-picker](https://ext.dcloud.net.cn/plugin?id=412)：调色盘插件。

> 插件 t-color-picker 有个小Bug，可能导致获取的颜色全部为黑色，如果你遇到了，就打开 `components/t-color-picker/to-color-picker.vue` ，将所有的 `pageX` 、 `pageY` 替换为 `clientX` 、 `clientY` 即可。

安装方式很简单，进入插件下载页面后，点击右侧的**使用HBuilder导入插件**就 ok 了：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-32.jpg)

接着让我们观察项目目录。

uniapp工程最核心的目录及文件如下（注意不是全部）：

```bash
┌─uniCloud              云空间目录
│─components            组件目录
│  └─comp-a.vue         可复用的a组件
├─pages                 业务页面文件目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─xxx.vue         xxx页面
├─static                静态资源目录，注意：静态资源只能存放于此
├─uni_modules           存放[uni_module](/uni_modules)
├─unpackage             非工程代码，一般存放运行或发行的编译结果
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息
├─pages.json            配置页面路由、导航条、选项卡等页面类信息
└─uni.scss              内置的常用样式变量 
```

这么多东西眼睛都看花了。

莫慌，其他的你啥都不用管，只需要知道 `pages/index/index.vue` 就是小程序首页的入口文件就 ok 了。

因此在里面写代码，修改成下面这样：

```html
<!-- pages/index/index.vue  -->

<template>
  <view class="container">
    <button @click="openPicker">颜色选择器</button>
    <t-color-picker ref="colorPicker" :color="canvasColor" @confirm="confirmPicker"></t-color-picker>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        canvasColor: {
          r: 255,
          g: 0,
          b: 0,
          a: 1
        }
      };
    },
    methods: {
      openPicker(item) {
        // 打开颜色选择器
        this.$refs.colorPicker.open();
      },
      confirmPicker(e) {
        console.log('颜色选择器返回值：' + e.hex)
      }
    }
  };
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
</style>
```

可以看到，一个标准的 `.vue` 文件包含三块：

- `<template>` 包裹的模板，描述了页面的结构，对应传统 web 开发的 `html` 。
- `<script>` 包裹的脚本，描述页面逻辑，对应 `javascript` 。
- `<style>` 包裹的样式，描述页面外观，对应 `css` 。

让我们按这三大块拆解来研究。

## 代码拆解

首先的模板：

```html
<!-- pages/index/index.vue  -->

<template>
  <view class="container">
    <button @click="openPicker">颜色选择器</button>
    <t-color-picker ref="colorPicker" :color="canvasColor" @confirm="confirmPicker"></t-color-picker>
  </view>
</template>

...
```

- 传统 web 开发常用 `div` 作为包裹元素的容器，很遗憾在 uniapp 中没有，你需要将 `div` 改成 `view`，`span` 改成 `text`、`a` 改成 `navigator`。
- `<button>` 是内置的控件，其属性 `@click="openPicker"` 表示**点击按钮事件**将执行 `openPicker()` 这个方法。（后面脚本里有定义）
- `<t-color-picker>` 是刚才下载的**调色盘**插件。属性 `ref` 定义了其名字，方便后续调用；`:color` 将调色盘**选定的颜色**绑定到 `canvasColor` 状态上；`@confirm` 将**调色盘的确认按钮**绑定到 `confirmPicker()` 方法。

这里需要注意 Vue 属性特殊符号的含义。冒号 `:` 通常代表此属性被绑定到了 **Vue 所管理的状态**上，比如 `data` 中的变量、计算属性等。 `@` 符号通常表示此属性被绑定到某种**事件**上，比如鼠标点击事件、子组件抛出的事件等等。

然后是脚本：

```javascript
// pages/index/index.vue

...

<script>
  export default {
    data() {
      return {
        canvasColor: {
          r: 255,
          g: 0,
          b: 0,
          a: 1
        }
      };
    },
    methods: {
      openPicker(item) {
        // 打开颜色选择器
        this.$refs.colorPicker.open();
      },
      confirmPicker(e) {
        console.log('颜色选择器返回值：' + e.hex)
      }
    }
  };
</script>

...
```

- 状态 `canvasColor` 表征的是当前选定颜色的 RGB 值，也就是**红绿蓝**三个通道的强度了，范围0~255之间。`a: 1` 是透明度通道，注意它在本项目中是**没有用到的**。
- `methods` 里面定义的两个方法用于打开调色盘和调色盘确认事件，都是插件提供的功能。

最后是样式：

```css
/* pages/index/index.vue */

...

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
</style>
```

这里主要是定义了元素应该如何布局，比如居中、边缘填充等。

> 样式部分的代码由于通常简单且不涉及逻辑，后续都是简单带过。有不懂的请自行了解。

核心代码就这样了。

接下来做一点收尾工作。`pages.json` 这个文件存放小程序的全局配置，比如导航栏的背景色、文本色等。

修改成下面这样：

```json
// pages.json

{
  "pages": [{
    "path": "pages/index/index",
    "style": {
      "navigationBarTitleText": "变色龙"
    }
  }],
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "变色龙",
    "navigationBarBackgroundColor": "#000",
    "backgroundColor": "#fff"
  },
  "uniIdRouter": {}
}
```

使得首页导航栏显示“变色龙”几个大字。

## 测试

代码这就写好了，接下来测试。

选择**工具栏 - 运行到浏览器 - Chrome**：

![](https://blog.dusaiphoto.com/img-sufacego3/Cha-04.jpg)

按照提示一路确认，顺利的话将自动弹出 Chrome 浏览器，小程序首页的内容就有了：

![](https://blog.dusaiphoto.com/img/uniapp-cha-02.jpg)

点击按钮，调色盘弹出：

![](https://blog.dusaiphoto.com/img/uniapp-cha-03.jpg)

怎么样，简单且有趣吧。

你可以看到，在 uniapp 中编写页面、运用插件是相当轻松的。

## 结语

前言介绍到此为止了。

如果你对 uniapp 感兴趣，下一章节让我们继续。

