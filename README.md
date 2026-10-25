# 杨国栋 · 个人作品集

AIGC 图片作品与 vibe coding 项目的个人作品集。静态 HTML / CSS / JavaScript，无需安装依赖或构建。

## 页面

- `index.html`：纸感拼贴版首页。
- `studio.html`：深色数字展览档案版。
- `data.js`：11 组视觉作品和 24 个公开项目的展示数据。
- `assets/`：高清作品图片与真实项目截图。

## GitHub Pages

在仓库 **Settings → Pages** 中选择 **Deploy from a branch → main → /(root)**。

自定义域名为 `works.ysdtn.com`。在 Pages 设置中保存该域名后，将阿里云主机记录 `works` 的 CNAME 值设为 `yguodong627-star.github.io`。保留根域名及 `www` 的现有记录，避免影响主站。

Pages 证书准备完成后开启 **Enforce HTTPS**。

## 本地预览

可直接在浏览器中打开 `index.html`；也可在当前目录启动静态服务：

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

## 作品与联系方式

网站中的图片、项目及联系方式均由作者提供。代码仓库公开不代表图片作品的版权被转让；转载、商用或使用作品请先联系作者。

邮箱：ethan@163.com  
GitHub：https://github.com/yguodong627-star
