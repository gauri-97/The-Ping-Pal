console.log('loaded');
var submit=document.getElementById('sub_btn');
submit.onclick= function(){

	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){
		if(request.readyState===XMLHttpRequest.DONE)
		{
			if(request.status===200)
			{
				console.log("Succesfully logged in");
				alert("Succesfully logged in");
				window.open('http://localhost:1111/home','_self');
			}
			else if(request.status===403)
			{
				alert('Username/password is incorrect');
			}
			else if(request.status===500)
			{
				alert('OOPS!Something went wrong');
			}
		}
	};
		var username=document.getElementById('username');
		username=username.value;	
		var password=document.getElementById('password');
		password=password.value;
	request.open('POST','http://localhost:1111/login',true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({username:username,password:password}));
};