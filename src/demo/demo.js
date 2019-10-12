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
