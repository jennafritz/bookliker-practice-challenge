document.addEventListener("DOMContentLoaded", function() {});

let bookList = document.querySelector("#list")
let bookDisplay = document.querySelector("#show-panel")
let currentBook = {}

fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(function(booksArray){
        booksArray.forEach(function(bookObj){
            appendBook(bookObj)
        })
    })




function appendBook(bookObj){
    let newBookLi = document.createElement("li")
        newBookLi.innerText = bookObj.title
    
    newBookLi.addEventListener("click", function(){
        bookDisplay.innerText = ""
        displayBookDetails(bookObj)
    })

    bookList.append(newBookLi)
}



function displayBookDetails(bookObj){
    currentBook = bookObj
    
    let bookImage = document.createElement("img")
        bookImage.src = bookObj["img_url"]
        bookImage.alt = bookObj.title

    let bookTitle = document.createElement("h2")
        bookTitle.innerText = bookObj.title

    let bookSubtitle = document.createElement("h4")
        bookSubtitle.innerText = bookObj.subtitle

    let bookAuthor = document.createElement("h3")
        bookAuthor.innerText = bookObj.author

    let bookDescription = document.createElement("p")
        bookDescription.innerText = bookObj.description

    let bookUsersUl = document.createElement("ul")

    usersArray = bookObj.users

    function addLike(user){
        let bookUserLi = document.createElement("li")
        bookUserLi.innerText = user.username
        bookUserLi.id = `user${user.id}`
        bookUsersUl.append(bookUserLi)
    }

    usersArray.forEach(function(user){
       addLike(user)
    })

    let likeButton = document.createElement("button")
        likeButton.innerText = "Like"
        
    likeButton.addEventListener("click", function(){
        let likesArray =  currentBook.users

        let pouros = likesArray.find(function(user){
            return (user.id === 1)
        })

        if(pouros === undefined){
            fetch(`http:localhost:3000/books/${bookObj.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "users": [...bookObj.users, 
                    {"id": 1, "username": "pouros"}
                ]})
            })
                .then(res => res.json())
                .then(function(updatedBook){
                    currentBook.users = updatedBook.users
                    let newLike = updatedBook.users[updatedBook.users.length-1]
                    addLike(newLike)
                    likeButton.innerText = "Unlike"     
            })  
        } else if(pouros !== undefined){
            let slicedArray = bookObj.users.slice(0, bookObj.users.length-1)
            fetch(`http:localhost:3000/books/${bookObj.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "users": slicedArray
                })
            })
                .then(res => res.json())
                .then(function(updatedBook){
                    currentBook.users = updatedBook.users
                    
                    let pourosLi = document.querySelector("li#user1")
                    pourosLi.remove()

                    likeButton.innerText = "Like"
            })  
        }
    })

    bookDisplay.append(bookImage, bookTitle, bookSubtitle, bookAuthor, bookDescription, bookUsersUl, likeButton)
}