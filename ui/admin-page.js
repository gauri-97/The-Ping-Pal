var submit=document.getElementById('del_user');
submit.onclick= function(){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{
			
			if(request.status===200)
			{
			rows=JSON.parse(request.responseText);
			toDisplay = `<tr><td><b>Username</b></td></tr>`;
			for (var i = 0; i < rows.length; i++) {
				toDisplay = toDisplay + "<tr><td>" + rows[i].username +"</td><td> <input type=button id='"+rows[i].username+"'value='Delete' onclick=deleteUser(this)></td></tr>"
			}
			table=document.getElementById('message_list');

			table.innerHTML=toDisplay;
			}
		}
	};
	request.open('GET', 'http://localhost:1111/get-user', true);
	request.send(null);
};


function deleteUser(button)
{
	var name = button.id;
	alert(name);
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{
				alert(request.responseText);

		}
	};
	request.open('POST', 'http://localhost:1111/del-user', true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({user:name}));
};

var submit2=document.getElementById('del_msg');
submit2.onclick= function(){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{
			
			if(request.status===200)
			{
			rows=JSON.parse(request.responseText);
			toDisplay = `<tr><td><b>Sender</b></td><td><b>Receiver</b></td><td><b>Message</b></td><td><b>Time</b></td></tr>`;
			for (var i = 0; i < rows.length; i++) {
				toDisplay = toDisplay + "<tr><td>" + rows[i].sender + "</td> <td>" + rows[i].receiver + "</td><td>"+rows[i].content+"</td><td>" + rows[i].time + "</td><td> <input type=button id='"+rows[i].sno+"'value='Delete' onclick=deleteMsg(this)></td></tr>"
			}
			table=document.getElementById('message_list');

			table.innerHTML=toDisplay;
			}
		}
	};
	request.open('GET', 'http://localhost:1111/get-msg', true);
	request.send(null);
};
function deleteMsg(button)
{
	var sno = button.id;
	alert(sno);
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{

				alert(request.responseText);
		}
	};
	request.open('POST', 'http://localhost:1111/del-msg', true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({sno:sno}));
};
