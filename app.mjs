import express from "express";
const app = express();
import queryString from 'query-string';
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
const PORT = process.env.PORT || 3000;
import { createVlidationSchema } from "./validation/validationShema.js";
import cookieParser from "cookie-parser";
import session from "express-session";
// import {passport} from "passport";
// import { Strategy } from "passport-local";
const passport = require('passport')
const strategy = require('passport-local')
import "./strategies/local-strategy.js"


export const  users = [
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
app.use(cookieParser());
app.use(session({
  secret: "sajid hameed",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 360000
  },
}))

//passport-local

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
//middleware used globly
app.use(middleware1)

// a middleware example it would be used in all routes to log reqest method
const middleware1 = (req, res, next)=> {
  console.log(`this is ${req.method} request, and URL ${req.url}`);
  next()
}

//middleware for find user index
const getUserIndexByUsername = (req, res, next)=> {
  const {params : {id}} = req;
  const parsedId = parseInt(id);
  if(isNaN(parseInt(id))) return res.status(400).send('invalid id');
  const findUserIndex = users.indexOf(users.find(user => user.id === parsedId));
  next()
}

// middleware example2
const middleware2 = (req, res, next)=> {
  console.log('object added into array successfully')
  next()
}
app.get("/", (req, res) => {
    console.log(req.query);
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
  res.status(201).send('this is / path')
});

//passport route
app.post("/api/passport", passport.authenticate("local"), (req, res) => {
  res.status(201).send('this is /api/passport path')
})

app.get('/api/users', query('name')
.isString()
.notEmpty()
.withMessage('must not be empty')
.isLength({min: 3, max: 10})
.withMessage('must be at least 3 characters'), (req, res) => {
  console.log(req['express-validator#contexts'])
  const result = validationResult(req);
  console.log(result)
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
app.post('/api/users',middleware2,[
body('username').notEmpty().withMessage('must not be empty')
.isLength( { min: 5, max: 15 })
.withMessage("Username must have minimum length of 5")
.isString(),
body('displayname')
.notEmpty().withMessage('must not be empty')
]
, (req, res)=> {
  const result = validationResult(req)
  console.log(result)
  console.log(req.body)
  const data = matchedData(req)
  console.log(data)
  const newUser = {id: users[users.length - 1].id + 1, ...data};
  if(!result.isEmpty()){
    return res.status(422).json({errors: result.array()})
  }else{
    users.push(newUser)
    return res.status(201).send(users);
  }
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
// app.put('/api/users/:id', (req, res)=> {
//   const {body, params: {id},} = req;
//   const parsedId  =  parseInt(id);
//   if(isNaN(parsedId)) return res.status(400).send('Bad Request');

//   const findUserIndex = users.findIndex((user)=> user.id === parsedId);

//   if(findUserIndex === -1 ) return res.status(404).send("Not Found");
//   users [findUserIndex] = {id: parsedId, ...body };
//   return res.status(200).send(users[findUserIndex]);
// })



app.get('/api/products', (req, res) => {
  //cookie example
  res.cookie('username', 'sajid', { maxAge: 3600, })
  // console.log(req.headers.cookie)
  // console.log(req.cookies)
  // console.log(req.signedCookies);
  //session example
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if(err){
      console.log(err);
      throw err;
    }
    console.log(sessionData)
  })
  const productItem  = req.query.item;
  const findProduct =  products.find((product) => product.item === productItem);
  if(req.cookies.username && req.cookies.username === 'sajid')return  res.status(200).send(findProduct);
  else return res.json(products)
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

//session example for new route
app.post('/api/auth', (req, res) => {
  const {body: {
    username, displayname
  }} = req;
  
  const findUser = users.find((user) => user.username === username);
  if(findUser.displayname !== displayname && findUser.displayname !== displayname)return res.status(401).send({message: "bad credentials"});

  req.session.user = findUser;
  console.log(req.session);
  console.log(req.session.id )
  return res.status(200).send(findUser)
})
app.get('/api/auth/status', (req, res)=> {
  req.sessionStore.get(req.sessionID, (err, session)=> {
    console.log(session);
    console.log(req.session.id);
  })
  if(req.session.user) return res.status(200).json(req.session.user);
  else return res.status(401).json({message : "You are unauthorized"});
  
})

//cart route
app.post("/api/cart", (req, res) => {
if(!req.session.user)  return res.status(403).json("Please login first");
let {body: item} = req;
let {cart} = req.session;
if(cart) {
  cart.push(item);
} else {
  req.session.cart = [item];
  res.setHeader('Content-Type', 'application/json');
  res.send(cart);
}
return res.status(201).send(item);
});
app.get("api/cart", (req, res) => {
  if(!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
})

app.listen(PORT, () => console.log("Server running on port " + PORT));