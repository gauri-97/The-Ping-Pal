var submit=document.getElementById('newMessageBtn');
submit.onclick= function(){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){
		if(request.readyState===XMLHttpRequest.DONE)
		{
			if(request.status===200)
			{
				
				alert("Your message has been sent");
			}
			else if(request.status===403)
			{
				alert('Please enter a valid recipient');
			}
			else if(request.status===500)
			{
				alert('OOPS! Something went wrong');
				alert(request.responseText);
			}
			else
			{
				alert("something else happened!");
			}
		}
	};

	var receiver=document.getElementById('receiver');
	receiver=receiver.value;	
	var content=document.getElementById('content');
	content=content.value;

	request.open('POST', 'http://localhost:1111/new-message', true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({receiver:receiver, content:content}));
};