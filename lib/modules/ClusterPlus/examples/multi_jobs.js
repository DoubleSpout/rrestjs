var  ClusterPlus = require('../lib/ClusterPlus'),
     jobs = ['./multi_jobs/jobs1.js', './multi_jobs/jobs2.js', './multi_jobs/jobs3.js', './multi_jobs/jobs4.js'],
     cp = ClusterPlus({
		logger:true,
		num: 4,
		CreateCallback:function(err, data){
		if(err) console.log(err);
		else{
				require(jobs[data.num]); //如果启动n个这里的num值会从0-(n-1)
			}
		}
	});
if(cp.isMaster){
	setTimeout(function(){console.log(cp.workobj);
	},3000)
}


