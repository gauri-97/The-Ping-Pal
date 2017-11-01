	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{
			
			if(request.status===200)
			{
			rows=JSON.parse(request.responseText);
			toDisplay = `<tr><td><b>Sender</b></td><td><b>Message</b></td><td><b>Time</b></td></tr>`;
			for (var i = 0; i < rows.length; i++) {
				toDisplay = toDisplay + "<tr><td>" + rows[i].sender + "</td> <td>" + rows[i].content + "</td> <td>" + rows[i].time + "</td></tr>"
			}
			table=document.getElementById('message_list');

			table.innerHTML=toDisplay;
			}
		}
	};
	request.open('GET', 'http://localhost:1111/fetch-message', true);
	request.send(null);

