const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesUserExist = (username) =>{
    let sameUserNames = users.filter((user)=>{
        return user.username === username
    });
    if(sameUserNames.length > 0){
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message: "username or password empty!"});
  }
  if(doesUserExist(username)){
    return res.status(400).json({message: "user already exists"});
  } else {
    users.push({"username": username, "password": password})
    return res.status(200).json({message: "user successfully registered"})
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookPromise =  new Promise((resolve,reject)=>{
        resolve(books);
    })
    bookPromise.then((book) =>{
        res.send(JSON.stringify({books},null,4));
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let isbnPromise =  new Promise((resolve,reject)=>{
        if(isbn <= Object.keys(books).length){
            resolve(books[req.params.isbn]);
        }
        else{
            reject("Wrong ISBN param");
        }
    });

    isbnPromise.then(
        (book) =>{ res.send(JSON.stringify({book},null,4));},
        (error) => { res.status(400).json({message: error});}
        );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksbyAuthorPromise =  new Promise((resolve,reject)=>{
        resolve(Object.values(books).filter((book)=> book.author===req.params.author));
    })
    booksbyAuthorPromise.then((book) =>{
        res.json(book);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbyTitle =  new Promise((resolve,reject)=>{
        resolve(Object.values(books).filter((book)=> book.title===req.params.title));
    })
    booksbyTitle.then((book) =>{
        res.json(book);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let book = books[req.params.isbn]
    if(book){
        res.json({reviews: book.reviews});
    } else {
        res.status(400).json({message: "Wrong ISBN param"});
    }
});

module.exports.general = public_users;
