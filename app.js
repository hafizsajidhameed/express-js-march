import express from "express";
const app = express();
import queryString from 'query-string';
const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: "sajid", displayname: "Sajid" },
  { id: 2, username: "faizan", displayname: "Faizan" },
  { id: 3, username: "amir", displayname: "Amir" },
  { id: 4, username: "rehmat", displayname: "Rehmat" },
  { id: 5, username: "tahir", displayname: "Tahir" },
  { id: 6, username: "murtaza", displayname: "Murtaza" },
  { id: 7, username: "mo.ali", displayname: "Mo.Ali" },
  { id: 8, username: "hassan", displayname: "Hassan" },
  { id: 9, username: "abdullah", displayname: "Abdullah" }, 
  { id: 10, username: "mustafa", displayname: "Mustafa" }
];
const products = [
  {id: 1, item: "watch", price: 12345},
  {id: 2, item: "glasses", price: 12345},
  {id: 3, item: "sneaker", price: 12345},
  {id: 4, item: "cap", price: 12345},
  {id: 5, item: "shirt", price: 12345},
]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// a middleware example it would be used in all routes to log reqest method
const middleware1 = (req, res, next)=> {
  console.log(`this is ${req.method} request, and URL ${req.url}`);
  next()
}

//middleware for find user index
const getUserIndexByUsername = (req, res, next)=> {
  const {params : {id}} = req;
  const parsedId = parseInt(id);
  if(isNaN(parseInt(id))) return res.status(400).send('incalid id');
  const findUserIndex = users.indexOf(users.find(user => user.id === parsedId));
  next()
}
//middleware used globly
app.use(middleware1)

// middleware example2
const middleware2 = (req, res, next)=> {
  console.log('object addedk into array successfully')
  next()
}
app.get("/", (req, res) => {
    console.log(req.query);
  res.status(201).send({message : 'Hello World'})
});

app.get('/api/users', (req, res) => {

  // Find the user using the username
  const foundUser = users.find(user => user.username === req.query.name);

  // Handle different scenarios:
  if (foundUser) {
    // User found, send the user object as a response
    res.json(foundUser);
  } else {
    // User not found, send an appropriate response (e.g., 404 Not Found)
    res.send(users);
  }
});

// users post request
app.post('/api/users',middleware2, (req, res)=> {
  console.log(req.body)
  const {body} = req;
  const newUser = {id: users[users.length - 1].id + 1, ...body};
  users.push(newUser);
  return res.status(201).send(users);
})

//find the user by it's id
app.get('/api/users/:id', (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).send({message: 'bad request, invalid id.'})
  const findUser = users.find((user)=> user.id === parsedId);
  if(!findUser) return res.sendStatus(404)
  return res.send(findUser)
});

// put request for updating the object
app.put('/api/users/:id', (req, res)=> {
  const {body, params: {id},} = req;
  
  users[findUserIndex] = {id: parsedId, ...body };
  return res.status(200).send(users[findUserIndex]);
});

//patch request for updating partially
app.patch('/api/users/:id', getUserIndexByUsername, (req,res)=>{
  const { body, findUserIndex} = req;
//   const parsedId = parseInt(id);
//  if(isNaN(parsedId))return res.status(400).send('Invalid Id');
//  const findUserIndex = users.findIndex(user=> user.id===parsedId);
//  if(findUserIndex === -1) return res.status(404);
 users[findUserIndex] = {...users[findUserIndex],...body};
 res.status(200).json(users[findUserIndex])
});


//delete a user from array of objects
app.delete('/api/users/:id', getUserIndexByUsername, (req , res)=> {
  // const {params : {id}} = req;
  // const parsedId = parseInt(id);
  // if(isNaN(parseInt(id))) return res.status(400).send('incalid id');
  // const findUserIndex = users.indexOf(users.find(user => user.id === parsedId));
  // if(findUserIndex===-1) return res.status(404).send('not found');
  
    users.splice(findUserIndex,1);
    return res.status(200).send(`The user with id ${parsedId} has been deleted`);
  }
)



app.get('/api/products', (req, res) => {
  const productItem  = req.query.item;
  const findProduct =  products.find((product) => product.item === productItem);
  if(findProduct) return  res.json(findProduct)
  else  return res.json({message: "product not found"})
})

app.get('/api/products/:id', (req, res)=> {
  console.log(req.params)
  const productId = req.params.id;
  const product = products.filter(product=> product.id == productId)[0]
  if(!product){
    return res.status(404).json({message:'Product not found'})
  }else{
    res.json(product)
  }
})

app.listen(PORT, () => console.log("Server running on port " + PORT));