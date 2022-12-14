const express = require("express");
const bodyParser = require("body-parser");
const { text } = require("express");
// const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting mongoose to mongodb sever and our database.
mongoose.connect("mongodb+srv://avs18:Avs18database@cluster0.xbe3lnf.mongodb.net/todolistDB");

// We are telling express run public folder as static files so we can render inside that public folder files such as 
// css files and images files or audio and video files..
app.use(express.static("Public"));



// Using ejs.
// So this mean it assuming(or finding) inside view directory there is .ejs file
app.set('view engine', 'ejs');

// creating new schema for our "todolistDB" database
const itemShema = {
    name: {
        type: String,
        required: true
    }
};

// creating mongoose model nothing but giving a new name to our collection
const List = new mongoose.model("List", itemShema);

// Creating new lists inside our List collection
const list1 = new List({
    name: "Work"
});

const list2 = new List({
    name: "Exploring"
});

const list3 = new List({
    name: "Enjoy!"
});

const defaultList = [];


const listshema = {
    name: String,
    items: [itemShema]
}

const pages = mongoose.model("pages", listshema);


app.post("/", function (req, res) {
    console.log(req.body)
    let task = req.body.newTask;
    const listName = req.body.list;
      
    const userList = new List({
        name: task
    })

    if (listName === "Today") {
        userList.save();
        res.redirect("/");
    } else {
        pages.findOne({ name: listName }, function (err, foundPage) {
            foundPage.items.push(userList);
            foundPage.save();
            res.redirect("/" + listName);
        })
    }
})

app.post("/delete", function (req, res) {
    const checkedListId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
         List.deleteOne({_id: checkedListId }, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("successfully deleted list doc from List collection!");
        }
    })

    res.redirect("/")
    } else {
        pages.updateMany({ name: listName }, { $pull: { items: { _id: checkedListId } } }, function (err, foundPage) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }
   
      
    
})

// app.post("/work", function (req, res) {
//     let task = req.body.newTask;
//     worklist.unshift(task);
//     res.redirect("/work");
// })

app.get("/", function (req, res) {
    // Find or read or consoling  all lists inside List collection
    List.find(function (err, lists) {
           
        // if (lists.length === 0) {

             // Inserted what we created above new lists into our List collection.
        //      List.insertMany(defaultList, function (err) {
        //        if (err) {
        //          console.log(err);
        //             } else {
        //             console.log("Successfully inserted new lists into \"List\" collection");
        //             }
        //      })
        //     res.redirect("/")
        // } else {
        //     // We are redndering list.ejs file with object key value pair(whatever tmeplate html we want)
        //    res.render("list",{listTitle: "Today", userTask: lists})
        // }
           
           res.render("list",{listTitle: "Today", userTask: lists})
           
    
    })
    // let day = date.getDate();
    
    

});

app.get("/:newPage", function (req, res) {
    const newPage = _.capitalize(req.params.newPage);
    pages.findOne({ name: newPage }, function (err, pageFound) {

        if (!err) {
            if (!pageFound) {
                // Creating this page
                const page1 = new pages({
                    name: newPage,
                    items: defaultList
                })
                page1.save();
                res.redirect("/" + newPage)
        } else {
                // Showing existing page
                res.render("list", {listTitle: newPage, userTask: pageFound.items})
            }
        }
    })
})

app.get("/about", function (req, res) {

    // Here we are rendering about page. But point is about page don't have properties so we rendering normally.
    res.render("about");
})

app.listen(3000, function () {
    console.log("server is running on port 3000");
});