var Get_QueryString_Plus = function(url){
        var no_q = 1,
     now_url = url && (url.split('?')[1] || no_q) || document.location.search.slice(1) || no_q;
 if(now_url === no_q) return false;
        var q_array = now_url.split('&'),
      q_o = {},
      v_array;
        for(var i=0;i<q_array.length;i++){
              v_array = q_array[i].split('=');
      q_o[v_array[0]] = v_array[1];
        };
        return q_o;
    }

