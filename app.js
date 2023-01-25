const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

mongoose.set('strictQuery', 'true');

mongoose.connect('mongodb://127.0.0.1:27017/OneProgress', {useNewUrlParser : true});

const notesSchema = new mongoose.Schema({
    notesTitle : String,
    notesBody : String
});



const todoSchema = new mongoose.Schema({
    todoName : String
});

const notesModel = new mongoose.model('note', notesSchema);
const todoModel = new mongoose.model('todo', todoSchema);

app.get('/', function(req, res) {

    todoModel.find({}, function(err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            res.render('home', {notesHtml : foundItems})
        }
    })
})

app.get('/notes', function(req, res) {

    notesModel.find({}, function(err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            res.render('notes', {notesHtml : foundItems})
        }
    })
})

app.get('/addtodo', function(req, res) {
    res.render('addtodo')
})



app.get('/addnotes', function(req, res) {
    res.render('addnotes')
})

app.post('/addnotes', function(req, res) {
    let newNoteTitle = req.body.noteTitle;
    let newNoteBody = req.body.noteBody;

    let newNote = new notesModel({
        notesTitle : newNoteTitle,
        notesBody : newNoteBody
    })

    newNote.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/notes')
        }
    });
        
})



app.get('/delete/:id', function(req, res) {
    notesModel.findByIdAndDelete({_id : req.params.id}, req.body, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/notes');
        }
    })
})

app.get('/deleteTodo/:id', function(req, res) {
    todoModel.findByIdAndDelete({_id : req.params.id}, req.body, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
})

app.post("/", function(req, res) {
    let newTodoJs = req.body.newTodo;
    
    let newTodoItemAdded = new todoModel({
        todoName : newTodoJs
    })

    newTodoItemAdded.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/')
        }
    })
})

app.listen(3000, function() {
    console.log('App running...');
})