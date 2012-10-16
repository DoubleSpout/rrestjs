/*
req.paramdot 对象
两者区别在于：
如果收到以下参数
user.name = 1
user.sex = 'male'
则
req.param = {user.name:1,
			user.sex:'male'
			}
req.paramdot = {user:{
						name:1,
						sex:'male'
					}
				}
同时这2个参数都会对[]这类字符串query进行解析成对象。
*/

//主要加工function，接受param参数，和req对象

var genparamdot = module.exports = function(reqparam){
	var p = reqparam,
		keys = Object.keys(p),
		filter_keys = [],
		normal_keys = keys.filter(function(v, i){
				if(~v.indexOf('.')){
					filter_keys.push(v);
					return false
				}
				return true;
			})

	if(keys.length === 0 || filter_keys.length === 0) return p;//如果没有参数或者没有带"."的参数，则跳过
	
	var paramdot = {};//存放paramdot的对象
	
	filter_keys.forEach(function(v, i, ary){
		var v_ary = v.split('.'),
			v_last = v_ary.length - 1;
		var deal = function(obj, j, array){
			var me = arguments.callee,
				islast = j === v_last ? true : false;
			if(islast) return obj[array[j]] = p[v];
			if(!obj[array[j]]) obj[array[j]] = {};
			return me(obj[array[j]], j+1, array);
			}
		deal(paramdot, 0, v_ary);
	});
	normal_keys.forEach(function(v){
		paramdot[v] = p[v];
	});
	return paramdot;
}
