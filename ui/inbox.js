	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{
			
			if(request.status===200)
			{
			list=request.responseText;
			ul=document.getElementById('message_list');
			ul.innerHTML=list;
			}
		}
	};
	request.open('GET', 'http://localhost:1111/fetch-message', true);
	request.send(null);

