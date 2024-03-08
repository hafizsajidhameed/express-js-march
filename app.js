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
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/users/:id', (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).send({message: 'bad request, invalid id.'})
  const findUser = users.find((user)=> user.id === parsedId);
  if(!findUser) return res.sendStatus(404)
  return res.send(findUser)
});



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