var http = require('http');
var fs = require("fs");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var inputName;

http.createServer(function(request, response) {

	if(request.url === "/index"){
		sendFileContent(response, "LoginPage.html", "text/html");
		
	}
	else if(request.url === "/"){
		console.log("Requested URL is url" +request.url);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
	}
    else if(request.url==="/login")
	{
		if (request.method=="POST")
		{
		  var userInput = "";
		  return request.on('data', function(data)
			{
				userInput += data;
				console.log("All Login Input = " + userInput);
				MongoClient.connect(url, function(err, db)
				{
					if (err) throw err;
					{
						var dbo = db.db("mydb");
					}
					var inputPassword;
					inputName = separateName(userInput);
					inputPassword = separatePassword(userInput);
					console.log("User Login Name= " + inputName);
					console.log("User Login Password= " + inputPassword);
					dbo.collection("userTable").findOne({name:inputName}, function(err, result)
					{
						if (err) throw err;
						if (result != null)
						{
							console.log("Database Name = " + result.name);
							console.log("Database Password = " + result.password);
							
							if (inputPassword==result.password)
							{
								//TestUser, TestPassword
								//TestUser2, TestPassword2
								console.log("Logined!");
								sendFileContent(response, "Buying.html", "text/html");
								//response.write('<b>Wellcome aaa!</b>');
								
							}
							else
							{
								console.log("Password fail");
								response.writeHead(200, {'Content-Type': 'text/html'});
								response.write('<b>Login failed!</b>');
							}
						}
						else
						{
							console.log("User Name fail");
							response.writeHead(200, {'Content-Type': 'text/html'});
							response.write('<b>Login failed!</b>');
						}
					db.close();
					});
				}); 
			});
			  
		}
	}
	
	
	
	else if(request.url==="/item1")
	{
		sendFileContent(response, "item1.jpg", "image/jpg");
	}
	else if(request.url==="/item2")
	{
		sendFileContent(response, "item2.jpg", "image/jpg");
	}
	else if(request.url==="/item3")
	{
		sendFileContent(response, "item3.jpg", "image/jpg");
	}
	else if(request.url==="/bk")
	{
		sendFileContent(response, "bk.jpg", "image/jpg");
	}
	else if(request.url==="/bk2")
	{
		sendFileContent(response, "bk2.jpg", "image/jpg");
	}
	
	else if(request.url==="/registerPage")
	{
		sendFileContent(response, "Register.html", "text/html");
	}
	
	else if(request.url==="/register")
	{
		if (request.method=="POST")
		{
		  var userInput = "";
		  return request.on('data', function(data)
			{
				userInput += data;
				console.log("All Register Input = " + userInput);
				MongoClient.connect(url, function(err, db)
				{
					if (err) throw err;
					{
						var dbo = db.db("mydb");
					}
					var inputPassword;
					var inputConfirmPassword;
					var inputEmail;
					inputName = separateName(userInput);
					inputPassword = separatePassword(userInput);
					inputConfirmPassword = separateConfirmPassword(userInput);
					inputEmail = separateEmail(userInput);
					console.log("User Register Name= " + inputName);
					console.log("User Register Password= " + inputPassword);
					console.log("User Register Confirm Password= " + inputConfirmPassword);
					console.log("User Register Email= " + inputEmail);
					if (inputPassword == inputConfirmPassword)
					{
						var myobj = {name: inputName, password: inputPassword, email: inputEmail, item1: "0", item2: "0", item3: "0" };
						dbo.collection("userTable").insertOne(myobj, function(err, result)
						{
							if (err) throw err;
							console.log("1 document inserted, name: " + inputName + ", password: " + inputPassword)	;					
							db.close();
						});
						console.log("Registered!");
						response.writeHead(200, {'Content-Type': 'text/html'});
						response.write('<b>Registered!</b>');
					}
					else
					{
						console.log("Password not matched!");
						response.writeHead(200, {'Content-Type': 'text/html'});
						response.write('<b>Password not matched!</b>');
					}
				}); 
			});
			  
		}
	}
	
	else if(request.url==="/updateCart")
	{
		if (request.method=="POST")
		{
		  var userInput = "";
		  return request.on('data', function(data)
			{
				userInput += data;
				console.log("All Buying Items = " + userInput);
				MongoClient.connect(url, function(err, db)
				{
					if (err) throw err;
					{
						var dbo = db.db("mydb");
					}
					var selectItem1;
					var selectItem2;
					var selectItem3;
					selectItem1 = separateName(userInput);
					selectItem2 = separatePassword(userInput);
					selectItem3 = separateConfirmPassword(userInput);
					console.log("Item1 = " + selectItem1);
					console.log("Item2 = " + selectItem2);
					console.log("Item3 = " + selectItem3);
					var myobj = { $set: {item1: selectItem1, item2: selectItem2, item3: selectItem3}};
					dbo.collection("userTable").updateOne({name: inputName}, myobj, function(err, result)
					{
						if (err) throw err;
						console.log("Buying item updated, item1: " + selectItem1 + ", item2: " + selectItem2 + ", item3: " + selectItem3)	;					
						db.close();
					});
					console.log("Buying item updated!");
					displayCart();
				}); 
			});
			  
		}
	}
	
	else if(request.url==="/buying")
	{
		sendFileContent(response, "Buying.html", "text/html");
	}
	
	else if(request.url==="/cart")
	{
		displayCart();
	}
	
	else if(request.url==="/logout")
	{
		inputName="";
		console.log("Logouted!");
		sendFileContent(response, "LoginPage.html", "text/html");
	}
	
	else if(request.url==="/admin")
	{
		sendFileContent(response, "AdminPage.html", "text/html");
		//response.write('</body></html>');
	}
	
	else if(request.url==="/adminLogin")
	{
		if (request.method=="POST")
		{
		  var userInput = "";
		  return request.on('data', function(data)
			{
				userInput += data;
				console.log("All Admin Input = " + userInput);
				var inputAdminName = separateName(userInput);
				var inputAdminPassword = separatePassword(userInput);
				//var inputDeleteRecord = separateConfirmPassword(userInput);
				console.log("Admin Login Password= " + inputAdminPassword);
				if (inputAdminName=="Admin"&&inputAdminPassword=="123456")
				{
					console.log("Admin Password Correct");
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.write('<b>The database contain the following user:</b>');
					MongoClient.connect(url, function(err, db) {
						if (err) throw err;
						var dbo = db.db("mydb");
						dbo.collection("userTable").find({}, { projection: { _id: 0, name: 1 } }).toArray(function(err, result) {
							if (err) throw err;
							//console.log(result);
							//console.log(result[0]);
							
							for (var i=0; i < result.length; i++)
							{
								var getName = JSON.stringify(result[i]);
								console.log(getName);
								response.write('<br>' + getName);
							}
							
							response.write('<br><br><form method="post" action = "/deleteRecord"><lable>Delete User Name: </lable><input type="text" name="deleteRecord" id="deleteRecord" required><br><input type="submit" value="Delete"></form>');
							//console.log(getName);
							//var getName = result[0].toString;
							db.close();
						});
					});
					
					/*
					MongoClient.connect(url, function(err, db) {
						if (err) throw err;
						var dbo = db.db("mydb");
						dbo.collection("userTable").deleteOne({name: inputDeleteRecord}, function(err, obj) {
							if (err) throw err;
							console.log(inputDeleteRecord + " deleted!");
							db.close();
						});
					});*/ 
				}
				else
				{
					console.log("Admin Password Incorrect");
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.write('<b>Admin Password Incorrect!</b>');
				}
			})
		}
	}
	
	else if(request.url==="/deleteRecord")
	{
		if (request.method=="POST")
		{
		  var userInput = "";
		  return request.on('data', function(data)
			{
				userInput += data;
				console.log("User Delete Input = " + userInput);
				var deleteUserName = separateName(userInput);
				console.log("Delete User Name= " + deleteUserName);
				MongoClient.connect(url, function(err, db) {
						if (err) throw err;
						var dbo = db.db("mydb");
						dbo.collection("userTable").deleteOne({name: deleteUserName}, function(err, obj) {
							if (err) throw err;
							console.log(deleteUserName + " deleted!");
							db.close();
						});
					});response.writeHead(200, {'Content-Type': 'text/html'});
							response.write('User ' + deleteUserName + ' deleted!');
			})
		}
		
	}
	
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
	
	function displayCart()
	{
		MongoClient.connect(url, function(err, db)
		{
			if (err) throw err;
			{
				var dbo = db.db("mydb");
			}
			dbo.collection("userTable").findOne({name:inputName}, function(err, result)
			{
				if (err) throw err;
				console.log('Logined user name: ' + result.name);
				console.log('No. of item1: ' + result.item1);
				console.log('No. of item2: ' + result.item2);
				console.log('No. of item3: ' + result.item3);
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write('<b>Dear </b>' + result.name + '<b>,</b><br><br>' +
					'<b>Your shopping cart contain:</b><p>' + 
					result.item1 + ' pack(s) of Cat Food 1</p><p>' + 
					result.item2 + ' pack(s) of Cat Food 2</p><p>' + 
					result.item3 + ' pack(s) of Cat Food 3</p>' + 
					'<input type=\"button\" value=\"Return to Buying Page\" onclick=\"location.href=\'/buying\'\"><br><br>' + 
					'<input type=\"button\" value=\"Logout\" onclick=\"location.href=\'/logout\'\">');
				db.close();
			})
			
		})
	}
	
	
}).listen(9999)

function separateName(query)
{
	var name;
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) 
	{
		var pair = vars[i].split("=");
		if (i==0)
		{
			name = decodeURIComponent(pair[1]);
			//console.log(name);
			return name;
		}
  }
}

function separatePassword(query)
{
	var spassword;
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) 
	{
		var pair = vars[i].split("=");
		if (i==1)
		{
			spassword = decodeURIComponent(pair[1]);
			//console.log(spassword);
			return spassword;
		}
  }
}

function separateConfirmPassword(query)
{
	var sConfirmPassword;
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) 
	{
		var pair = vars[i].split("=");
		if (i==2)
		{
			sConfirmPassword = decodeURIComponent(pair[1]);
			//console.log(sConfirmPassword);
			return sConfirmPassword;
		}
  }
}

function separateEmail(query)
{
	var sEmail;
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) 
	{
		var pair = vars[i].split("=");
		if (i==3)
		{
			sEmail = decodeURIComponent(pair[1]);
			//console.log(sEmail);
			return sEmail;
		}
  }
}

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}