let express= require('express')
let app = express()


app.set('view engine', 'ejs')

app.get('/', (request, response) => {
    
    response.render("pages/index", {test: "salut"})
})
app.use(express.static('public'))
app.listen(8080)

/*var app = express();
app.use(express.static(__dirname + '/public')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on' + port);*/
