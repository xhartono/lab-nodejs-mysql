/**
 * @author hartono kurniawan <xhartono@gmail.com>
 */

const app = require('express')();
const mysql = require('mysql2');

const bodyParser = require('body-parser');

app.use(bodyParser.json({
    limit: '8mb'
})); // support json encoded bodies

// environment variables
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// mysql credentials
const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST || 'db',
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || 'inix2021',
	database: process.env.MYSQL_DATABASE || 'sistradb'
});

// home page
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'NodeJS dan MySQL dengan docker'
	});
});

// tambahakan peserta ke database
app.post('/tambah', (req, res) => {
	const peserta = req.body;
	const query = 'INSERT INTO peserta values(?, ?, ?, ?)';

	connection.query(query, [peserta.nopeserta, peserta.nama, peserta.alamat, peserta.kota], (err, results, fields) => {
		if (err) {
			console.error(err);
			res.json({
				success: false,
				message: 'Ada Error..!'
			});
		} else {
			res.json({
				success: true,
				message: 'Peserta berhasil ditambahkan.'
			});
		}
	});
});

// Ambil semua peserta
app.get('/daftar', (req, res) => {
	const query = 'SELECT * FROM peserta';
    connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Ada Error...!'
    		});
    	} else {
    		res.json({
    			success: true,
    			result: results
    		});
    	}
    });
});

connection.connect((err) => {
	if (err) {
		console.error('error connecting mysql: ', err);
	} else {
		console.log('mysql connection successful');
		app.listen(PORT, HOST, (err) => {
			if (err) {
				console.error('Error starting  server', err);
			} else {
				console.log(`server running on http://${HOST}:${PORT}`);
			}
		});
	}
});
