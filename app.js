const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ urlencoded: true }));

app.use(express.static("public"));

//setup mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

//schema
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// Chain of events
//declaring route
app.route("/articles")
    //GET (READ) - fetches all
    .get(function (req, res) {
        Article.find(function (err, foundArticle) {
            if (!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        });
    })

    //POST (CREATE) - one item
    .post(function (req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save(function (err) {
            if (!err) {
                res.send("Successfully saved")
            } else {
                res.send("Failed");
            }
        })
    }) 

    //DELETE (all)
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Deleted all");
            } else {
                res.send(err);
            }
        });
    })

//Targetting a specific article

app.route("/articles/:articleTitle")

    //GET(READ) a specific article
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (!err) {
                res.send("Hi "+foundArticle);
            } else {
                res.send(err + "No article found!");
            }
        });
    })

    //PUT(UPDATE)
    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle }, //condition
            { title: req.body.title, content: req.body.content }, //update
            { overwrite: true }, //restriction for deletion
            function(err, result) { //callback
                if(!err) {
                    res.send("Successfully updated articles");
                } else {
                    res.send("Failed to update");
                }
            }
        )
    })
    
    //PATCH(UPDATE)
    .patch(function(req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            {$set: req.body },
            { overwrite: true },
            function(err, result) {
                if(!err) {
                    res.send("Successfully saved");
                } else {
                    res.send("Failed to update");
                }
            }
        );
    })

    //DELETE
    .delete(function(req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle  },
            function(err) {
                if(!err) {
                    res.send("#Successfully deleted")
                } else {
                    res.send("Failed to deleted")
                }
        });
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});