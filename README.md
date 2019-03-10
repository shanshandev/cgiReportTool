### 安装
npm  i
### 构建
npm run build
### 使用 
在 .html 中引入 dist/index.js文件或者引入相关模块
```
<script src="dist/index.js"></script>
<script>
   new CgiAnalysisTool({
        reportUrl: 'xxx',// 相关上报服务
        reportCode: function (data) {
            return {
                type: xxx, //定义请求结果类型
                code: xxx  //定义后端服务错误返回码
            }
        }
    })
<script>
```
