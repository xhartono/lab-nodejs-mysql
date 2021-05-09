let connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'password',
    database: 'test'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });
  