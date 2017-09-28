var submit=document.getElementById('sub_btn3');
submit.onclick= function(){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){
		if(request.readyState===XMLHttpRequest.DONE)
		{
			if(request.status===200)
			{
				
				alert("User Succesfully Created");
			}
			else if(request.status===403)
			{
				alert('Username already exists');
			}
			else if(request.status===500)
			{
				alert('OOPS!Something went wrong');
				alert(request.responseText);
			}
		}
	};
		var username=document.getElementById('username');
		username=username.value;	
		var password=document.getElementById('password');
		password=password.value;
		console.log(username);
		console.log(password);
	request.open('POST','http://localhost:1111/create-user',true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({username:username,password:password}));
};