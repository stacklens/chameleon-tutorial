'use strict';
const nodemailer = require('nodemailer')

// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', // 网易163邮箱 smtp.163.com
  port: 465, // 网易邮箱端口 25
  auth: {
    user: '填写你自己的邮箱账号！', //邮箱账号
    pass: '填写你自己的邮箱授权码！' //邮箱的授权码
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
