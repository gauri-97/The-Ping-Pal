var submit=document.getElementById('admin-button');
submit.onclick= function(){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{
			
			if(request.status===200)
			{
				alert("You're logged in as an admin");
				window.open('http://localhost:1111/admin-page','_self');
			}
			else
			{
				alert("You're not authorized to access the admin page");
			}
		}
	};
	request.open('GET', 'http://localhost:1111/admin', true);
	request.send(null);
};