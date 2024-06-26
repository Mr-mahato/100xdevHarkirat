/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */

  // this my todos is missing one functionality that is : you just have to find update the particular section
  // if a user want to update that ones.
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000
const app = express();
const path = require('path');
const cors = require('cors');
app.use(bodyParser.json());
// this cors allow to hit my server from any address or html page 
app.use(cors());


// let taskStor = [];

function findArrayIndex(Id,myArr)
{
  // console.log(Id);
  var task;
  var flag = 0;
  myArr.forEach((val)=>{
    if(val.id==Id)
    {
      flag = 1;
      task = val;
    }
  })
  if(flag == 0) return -1;
  else
  return task;
}
// this is simply to print all the task in the tasklist
app.get('/todos', (req, res) => {
  // res.send(taskStor);
  fs.readFile("02-nodejs/todos.json","utf-8",(err,data)=>{
    if(err)
    {
      res.send('you are not able to read the file text in json');
    }
    else
    {
      const ans =  JSON.parse(data);
      res.send(ans);
    }
  })
})

// this is to push the task or submitted in the body
app.post('/todos',(req,res)=>{
  var obj = req.body;
  obj.id = Math.floor(Math.random()*100);
  console.log(obj);
  fs.readFile("02-nodejs/todos.json","utf-8",(err,data)=>{
    var jsData = JSON.parse(data);
    if(err) {res.status(404)}
    jsData.push(obj);
    var todo = JSON.stringify(jsData);
    fs.writeFile("02-nodejs/todos.json",todo,"utf-8",(err,data)=>{
      if(err) console.log("here is error")
      else res.send(data);
    })
  })
})
 
// lets delete the particular todo's item
app.delete('/todos/:id',(req,res)=>{
  const id = req.params.id;
  console.log(id);
  fs.readFile("02-nodejs/todos.json","utf-8",(err,data)=>{
    var taskStor = JSON.parse(data);
    const ind = findArrayIndex(id,taskStor);
  if(ind!=-1)
  {
    taskStor.splice(ind,1);
  }
  else
  {
    res.sendStatus(404);
  }
  taskStor = JSON.stringify(taskStor);
  fs.writeFile("02-nodejs/todos.json",taskStor, (err,data)=>{
    if(err)
    {
     throw err;
    }
    res.status(200).send();
  })
})
res.send("ok");
})
// this function is to retrive the specific todos  from the collections of todos
app.get('/todos/:id',(req,res)=>{
  const value = req.params.id;
  fs.readFile("02-nodejs/todos.json","utf-8",(err,data)=>{
    var checkData = JSON.parse(data);
    var finalTask =   findArrayIndex(value,checkData);
    if(finalTask==-1)
    {
      res.send('id not found');
    }
    else 
    res.send(finalTask);
  })
})
function findIndex(id,myarr)
{
  return myarr.findIndex((val)=>val.id==id);
}
// this one is for updating particular todos  by the user who wants to update the existing todos
app.put('/todos/:id',(req,res)=>{
 fs.readFile("02-nodejs/todos.json","utf-8",(err,data)=>{
  // convert the json file to object
  var myTodos = JSON.parse(data);
  // console.log(myTodos);
  var jsonIndex = findIndex(req.params.id,myTodos);
  // console.log(jsonIndex);
  const newObj = {
  id: myTodos[jsonIndex].id,
  title:req.body.title,
  description:req.body.description,
  completed:req.body.completed
  }
  myTodos[jsonIndex] = newObj;
  console.log(myTodos);
  fs.writeFile("02-nodejs/todos.json",JSON.stringify(myTodos),(err,data)=>{
      if(err) throw err;
      else res.send(myTodos[jsonIndex]);
  })
  // res.send("you are going right");
 })
})


/* This is for when you loads html page with express server */
// app.get("/",(req,res)=>{
//   res.sendFile(path.join(__dirname,"index.html"));
// })


//  this is simple loading page where you will sef the port starting message
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;