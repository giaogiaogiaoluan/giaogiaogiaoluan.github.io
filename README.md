# lewisluan · 极客风个人主页

在线主页：https://giaogiaogiaoluan.github.io/

原生 HTML、CSS、JavaScript 静态网站，由 GitHub Pages 从 `main` 分支根目录直接发布。零构建依赖、零统计脚本、无后端服务。

## 特性概览

- **工业终端视觉**：碳黑底色 + 荧光绿 / 琥珀信号色，并支持一键切换「工程蓝图浅色模式」。
- **内置交互终端**：首屏支持真实命令输入与快捷芯片（`help`、`whoami`、`ls projects`、`cat labassistant`、`cat zhiyi-pdf`、`stack`、`neofetch`、`theme`、`clear`），按 `/` 可快速聚焦。
- **全局命令面板**：按 `⌘K` / `Ctrl+K` 或点击顶部 `CMD` 按钮快速跳转分区、切换主题、打开仓库或复制主页链接。
- **交互式项目概念示意**：LabAssistant 支持 `LOG / PLAN / STAT` 视图切换，知译 PDF 支持 `DUAL / ZH_ONLY` 双语对照切换（均为原创概念示意，非真实应用截图）。

## 本地预览

在此目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，打开 http://127.0.0.1:8765 。

## 文件结构

- `index.html`：页面结构、项目卡片、Unix 手册风格关于区与命令面板。
- `styles.css`：暗色终端 / 浅色蓝图双主题样式、非对称响应式布局与微动效。
- `script.js`：主题持久化、实时时钟、交互终端、命令面板与项目示意切换。
- `favicon.svg`：终端提示符风格站点图标。
- `.nojekyll`：直接发布静态文件。

当前展示内容仅基于两个公开仓库（LabAssistant、知译 PDF），未发布私人联系方式或未公开项目信息。
