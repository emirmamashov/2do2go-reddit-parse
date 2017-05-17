let express = require('express');
let request = require('request');
let fs = require('fs');
let csv = require('express-csv');

let router = express.Router();

let config = require('../config');
let reddit = require('../services/reddit');
let dataFunc = require('../services/data');

/* GET home page. */
router.get('/', (req, res, next) => {
	console.log(req.query);

	if (!req.query.url) return res.status(200).json({
		success: false,
		message: 'Введите url'
	});

	reddit(req.query.url).then(
		(data) => {
			let pageDatas = dataFunc.dataFormat(data.children);
			let sortData = dataFunc.sort(pageDatas, req.query.sort, req.query.desc);
			
			if (req.query.format === 'sql') {
        fs.writeFile('db.js', 
					'conn = new Mongo();\n' + 
					'db = conn.getDB("myDatabase");\n' +
					dataFunc.sqlString(sortData), 
					'utf8', 
					(err) => {
							if(err) return res.status(200).json({
								success: false,
								message: err
							});
							res.sendfile("db.js");
					}
        ); 
			} else if (req.query.format === 'csv') {
				res.csv(dataFunc.csvData(sortData));
			} else if(req.query.format === 'agr'){
				res.csv(dataFunc.agr(pageDatas));
			} else {
				res.status(200).json({
					success: false,
					message: 'Заполните все поля!'
				});
			}
		}
	).catch(
		(err) => {
			console.log(err);
			res.status(200).json({
				success: false,
				message: err
			});
		}
	);
});

module.exports = router;
