	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){

	if(request.readyState===XMLHttpRequest.DONE)
		{
			
			if(request.status===200)
			{
			rows=JSON.parse(request.responseText);
			toDisplay = `<tr><td><b>Username</b></td><td><b>Mobile</b></td><td><b>Address</b></td><td><b>Age</b></td><td><b>Gender</b></td></tr>`;
			for (var i = 0; i < rows.length; i++) {
				toDisplay = toDisplay + "<tr><td>" + rows[i].username + "</td><td>" + rows[i].mobile + "</td><td>" + rows[i].address +"</td><td>" + rows[i].age+ "</td><td>" + rows[i].gender + "</td></tr>"
			}
			table=document.getElementById('details');

			table.innerHTML=toDisplay;
			}
		}
	};
	request.open('GET', 'http://localhost:1111/fetch-details', true);
	request.send(null);
