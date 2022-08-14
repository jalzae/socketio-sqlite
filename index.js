const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get("/message", (req, res, next) => {
  var sql = "select * from message"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": true,
      "data": rows
    })
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    var sql = 'INSERT INTO message (text) VALUES (?)'
    var params = [msg]
    db.run(sql, params, function (err, result) {
      if (err) {
        alert("fail to sent")
        return;
      }

    });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});