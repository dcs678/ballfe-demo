# 开发挡板快速实现-5分钟内搞定

## 本文只是简单的引导大家怎样快速的制作一个挡板，简单的demo能够覆盖80%的需求，何乐而不为呢？
## 适合前端、后端开发数据联调
## 不懂前端的也可以快速上手，只要把返回的报文复制过来即可
## 从代码拉取、环境搭建、demo执行 5分钟搞定！搞定！
## 更高级的用法见我另一个[博文](https://www.jianshu.com/p/e04489add6ce)

# 一、安装说明


### 环境准备
安装Nodejs
[Nodejs下载](https://nodejs.org/en/download/)
#### 或者
```
yum install -y nodejs
```

# 二、执行说明
```
#安装依赖的包
$ npm install
#运行服务
$ npm run start
```
# 三、demo目录结构
本次讲解的的挡板demo目录为baffle，他的目录结构如下：


|路径	|类型	|备注	|
|--	|--	|--	|
|src/demo	|目录	|demo代码目录	|
|src/main.ejs	|文件	|启动参数	文件，可根据多个项目配置多个|
|src/demo/demo.json	|文件	|demo的代码，包含请求端口、路径，返回值的配置	|
|src/demo/demo.js	|文件	|动态修改返回值操作	|

# 四、简单说明
配置文件main.ejs
```
{

    "imposters": [
		//多个以逗号隔开，配置简单
        <% include demo/demo.json %>
    ]
}

```
demo.json
#### 1、定义端口
#### 2、定义路径
#### 3、定义返回值
#### 4、shellTransform指定动态数据修改脚本文件（根据需要使用）
```
{
	"name": "demo-server:http://localhost:8070/api/menu",
	<!-- 定义端口 -->
	"port": 8070,
	"protocol": "http",
	"stubs": [
		{
			"name": "/api/menu",
			"predicates": [{
				"equals": {
					<!-- 定义访问路径 -->
					"path": "/api/menu"
				}
			}],
			"responses": [{
				"is": {
					"statusCode": 200,
					"headers": {
						"Content-Type": "application/json charset=utf-8",
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Methods": "*",
						"Access-Control-Allow-Headers": "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE",
						"Access-Control-Allow-Credentials": "true",
						"Access-Control-Allow-Headers": "Content-Type,Access-Token",
						"Access-Control-Expose-Headers": "*",
						"Custom-Header": ""
					},
					"body": {
						<!-- 返回的json数据值 -->
						"status": 200,
						"message": "",
						"city": "",
						........
						}
				},
				"_behaviors": {
					"wait": 10,
					"decorate": "(config) => {config.logger.info('request path='+config.request.path.slice(1)); config.logger.info('request data='+config.request.body); }",
					"shellTransform": [
						"node ./src/demo/demo.js"
					]
				}
			}]
		},
		{
			"responses": [{
				"is": {
					"statusCode": 400,
					"headers": {
						"Content-Type": "application/json;  charset=utf-8",
						"Access-Control-Allow-Origin": "*"
					},
					"body": {
						"code": "bad-request",
						"message": "档板未配置"
					}
				},
				"_behaviors": {
					"wait": 10,
					"decorate": "(config) => {config.logger.info('request path='+config.request.path.slice(1)); config.logger.info('request data='+config.request.body); }"
				}
			}]
		}
	]
}

```
demo.js
#### 1、可以获取到request、response，所以请求的参数和返回的值都可以修改
#### 2、demo中使用mock工具进行数据mock
#### 3、返回值必须console.log，切记只能有一个，原因见我另一篇[文章](https://www.jianshu.com/p/e04489add6ce)
```
var request = JSON.parse(process.argv[2]),
	response = JSON.parse(process.argv[3]);

// 使用 Mock
var Mock = require('mockjs');
var moment = require('moment');
moment.locale('UTF-8');
var time = new Date();

var reqPath = request.path;
var body = response.body;

//
/**
 * 根据url进行动态数据处理
 * 动态处理返回的mock数据
 * 数据没有变动要求时不必在这处理，只在json文件写好返回内容即可
 *
 */
if (reqPath == "/api/menu") {
	body.uid = Mock.mock('@guid');
	body.city = Mock.mock('@city');
	body.timestamp=moment(time).valueOf();
	body.message = Mock.mock('@name');

	var data =body.result;
	data.forEach((item,index,data)=>{
		item.key=Mock.mock('@guid');
	})
}

//通过控制台返回使用，禁止删除或注释
console.log(JSON.stringify(response));

```
--------------------------------------------------
License
(The baffle License)

Copyright (c) 2009-2010 dcs  <dcs_2000@126.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
