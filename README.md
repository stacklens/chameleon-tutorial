[![](https://img.shields.io/badge/uniapp-x.x-orange.svg)](https://www.python.org/downloads/release/python-370/)
[![](https://img.shields.io/badge/vue-2.X-blue.svg)](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
[![](https://img.shields.io/badge/HBuilder-3.5-green.svg)](https://docs.djangoproject.com/en/2.1/releases/2.1/)
[![](https://img.shields.io/badge/license-CC_BY_NC_4.0-000000.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

# uni-app开发微信小程序[色彩大师]

作为独立开发者，我经常头疼于图标等 UI 的配色、16进制色码转换等问题。

正好最近对**小程序开发**感兴趣，于是就用 **uniapp** 框架撸了一个叫**变色龙**的色彩搭配小程序。

核心的功能大概这样：

![Cha-gif-00-03](https://blog.dusaiphoto.com/img-sufacego3/Cha-gif-00-03.gif)

![Cha-gif-00-04](https://blog.dusaiphoto.com/img-sufacego3/Cha-gif-00-04.gif)

> 中国色/渐变色数据来源：[Frank Lin.](http://www.2kil.com/)/[Dlog_Shuai](https://ext.dcloud.net.cn/plugin?id=3558)

功能简单实用。（自认为）

你可以在这里查看小程序的完整功能：

![cha_mp_qrcode](https://blog.dusaiphoto.com/img-sufacego3/cha_mp_qrcode.jpg)



所以我就想着，干脆挑出里面的重点，写成**短篇入门教程**，给想要学习 uniapp 的同学。

**核心内容**：

- uniapp 结构、配置、规范、插件
- Vue 模板语法、组件、状态、计算属性、事件等基础知识
- uniCloud 云函数

> 主要涉及到调色盘、色码转换、相似色、中国色和用户留言功能板块。

写作风格和我的其他教程一样，**新手向，入门级**。

> 浅显易懂，但 Vue 开发需要一点前端基础，如果你是纯新手，非常建议先浏览[Vue官方文档](https://cn.vuejs.org/)。

## uniapp是什么

uniapp 是一个跨平台的开发框架，细节就不讲了自己去[uniapp官网](https://uniapp.dcloud.net.cn/)看，这里只说其最显著的优点：

- 跨平台，只写**一套代码**，小程序、H5、原生 App 都能运行，对小团队来说，极大程度提高了效率（理论上）
- 集成了 uniCloud 、uni-id、前端网页托管等一系列工具，降低了开发难度。

更优秀的是，它基于 Vue 进行开发。即使你以后不用 uniapp ，但学了 Vue 也怎么都不亏。

> 微信小程序原生语言和 Vue 很像，但是细节上的差别却不少，转换到 Vue 多少也是有时间成本的。

所以还犹豫啥赶紧学起来，我保证这个教程会短小精悍（仅五个章节左右），花不了你几天时间的。

## 准备战斗

介绍到此为止了。

如果你对 uniapp 感兴趣，下一章节让我们继续。

本文在公众号、[Github](https://github.com/stacklens/chameleon-tutorial/tree/master/md)和[博客](https://www.dusaiphoto.com/)同步更新，传送门：

![Cha-QR](https://blog.dusaiphoto.com/img-sufacego3/Cha-QR.jpg)

## 许可协议

本教程（包括且不限于文章、代码、图片等内容）遵守 **署名-非商业性使用 4.0 国际 (CC BY-NC 4.0) 协议**。协议内容如下。

**您可以自由地：**

- **共享** — 在任何媒介以任何形式复制、发行本作品。
- **演绎** — 修改、转换或以本作品为基础进行创作。

只要你遵守许可协议条款，许可人就无法收回你的这些权利。

**惟须遵守下列条件：**

- **署名** — 您必须给出**适当的署名**，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。
- **非商业性使用** — 您不得将本作品用于**商业目的**。

- **没有附加限制** — 您不得适用法律术语或者技术措施从而限制其他人做许可协议允许的事情。

> 适当的署名：您必须提供创作者和署名者的姓名或名称、版权标识、许可协议标识、免责标识和作品链接。
>
> 商业目的：主要目的为获得商业优势或金钱回报。
