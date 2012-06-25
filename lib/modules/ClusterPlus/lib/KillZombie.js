var child_process = require('child_process'),
	outerror = require('../../../Outerror'),
	command = "ps -ef | grep node | grep -v grep | awk '{print $2 \"-\" $3}'";
module.exports = function(ClusterPlus){
	var loop = setInterval(function(){	
	child_process.exec(command,  function(error, stdout, stderr){
			if(error){
				outerror('KillZombie can not work：'+JSON.stringify(error));
				ClusterPlus._output('KillZombie有误：'+error);
				clearInterval(loop);
				return;
			}
			try{
				stdout.split('\n').map(function(value){return value.split('-');}).forEach(function(v, i){
					if(v[0] == process.pid) return;
					if(v[1] == process.pid && ClusterPlus.workobj.every(function(pid){return v[0] != pid;})){
						child_process.exec('kill -9 '+v[0],  function(error, stdout, stderr){
							ClusterPlus._output(ClusterPlus.workobj);
							ClusterPlus._output('已经强制杀死僵尸进程：'+v[0]+' 父pid：'+v[1]);
						})
					}
				})
			}
			catch(error){
				outerror('KillZombie commond work error：'+JSON.stringify(error));
				ClusterPlus._output('命令有误：'+error);
			}
		})	
	},30000)
}
