var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
const app = express();
const multer = require('multer');
var util = require('util');
var idx = {smallImage: '', bigImage: ''}

//const upload = multer({ dest: './public/images/' });

// default options
app.use(fileUpload());

const MainTagService = require('../services/MainTagService')
var MysqlConnection = require('../datalayer/MysqlConnection');
const conn = MysqlConnection.createConnection();
var id = "";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },

    filename: function (req, file, cb) {
        id = (Math.random() + 1).toString(36).substring(7) + Date.now();
        if (idx.bigImage === "")
            idx.bigImage = id;
        else
            idx.smallImage = id;
        cb(null, id);
    }
});
var upload = multer({storage: storage}).any();
/* GET users listing. */
router.get('/all', function (req, res, next) {

    var resultset = [];

    conn.query('select blog.id,about,title,contributor,thumbnail,date from blog  join images on blog.image = images.id  LIMIT 20', function (err, result, fields) {
        if (err)
            throw err;
        res.status(200).json(result);

    });
});

router.get('/categories/all', function (req, res, next) {

    var resultset = [];

    conn.query('select blog.id,about,title,contributor,main,date from blog  join images on blog.image = images.id  LIMIT 8', function (err, result, fields) {
        if (err)
            throw err;
        res.status(200).json(result);

    });
});
//select * from blog order by hits desc limit 1;

router.get('/article/:id', function (req, res, next) {
    var articleId = req.params['id'];
    var resultset = [];
     conn.query('UPDATE blog set hits=hits+1 where blog.id =?', [articleId], function (err, result, fields) {
        if (err)
            throw err;
       

    });
    conn.query('select main_tag, about,title,contributor,main,body,date from blog  join images on blog.image = images.id join article_main_tags on blog.id = article_main_tags.article where blog.id =?', [articleId], function (err, result, fields) {
        if (err)
            throw err;
        res.status(200).json(result);

    });
   


    return resultset;
});
router.get('/articles/category/:id', function (req, res, next) {
    var category = req.params['id'];
    var resultset = [];



 conn.query('select blog.id, about,title,contributor,main,body,date from blog  join images on blog.image = images.id  join article_main_tags on blog.id = article_main_tags.article where article_main_tags.main_tag =? order by blog.hits DESC limit 10', [category], function (err, result, fields) {
        if (err)
            throw err;
        res.status(200).json(result);

    });

    return resultset;
});
router.get('/article/maintags/:id', function (req, res, next) {
    var articleId = req.params['id'];
    var resultset = [];

 conn.query('select main_tag from blog  join article_main_tags on blog.id = article_main_tags.article where article_main_tags.article =?', [articleId], function (err, result, fields) {
        if (err)
            throw err;
        res.status(200).json(result);

    });

    return resultset;
});
router.get('/category/:id', function (req, res, next) {
    var category = req.params['id'];
    var resultset = [];



 conn.query('select blog.id,main_tag, about,title,contributor,thumbnail,body,date from blog  join images on blog.image = images.id  join article_main_tags on blog.id = article_main_tags.article where article_main_tags.main_tag =? limit 8', [category], function (err, result, fields) {
        if (err)
            throw err;
        res.status(200).json(result);

    });

    return resultset;
});
router.get('/category/all/:id', function (req, res, next) {
    var category = req.params['id'];
    var resultset = [];



 conn.query('select blog.id,main_tag, about,title,contributor,thumbnail,body,date from blog  join images on blog.image = images.id  join article_main_tags on blog.id = article_main_tags.article where article_main_tags.main_tag =? limit 20', [category], function (err, result, fields) {
        if (err)
            throw err;
        res.status(200).json(result);

    });

    return resultset;
});

router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(JSON.stringify(err));
            res.status(400).send('fail saving image');
        } else {
            id = "";

            res.send(idx);
            idx.bigImage = "";
        }
    });
});
router.post('/upload/images', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(JSON.stringify(err));
            res.status(400).send('fail saving image');
        } else {
            let r = (Math.random() + 1).toString(36).substring(7);
            var sql = 'insert into images (id,thumbnail,main) values (?,?,?)';
            conn.query(sql, [r, idx.smallImage, idx.bigImage], function (err, result, fields) {
                if (err)
                    throw err;

                console.log(result);


            });
            id = "";

            res.send(r);
            idx.bigImage = "";
        }
    });
});
var id = {id: ""};
router.post('/article', function (req, res, data) {
    var blog = req.body;

    var sql = 'insert into blog (id,about,body,contributor,date,title,image) values (?,?,?,?,?,?,?)';
    var body = [blog.title.replace(/\s+/g, '-'), "", blog.body, blog.contributor, new Date(), blog.title];
    conn.query(sql, [blog.title.replace(/\s+/g, '-').toLowerCase(), "", blog.body, blog.contributor, new Date(), blog.title, blog.image], function (err, result, fields) {
        if (err)
            throw err;
        id.id = blog.title.replace(/\s+/g, '-');
        var main_tags = blog.maintags;
        var values = [];
        for (const[key, value] of Object.entries(main_tags)) {
            var temp = [blog.title.replace(/\s+/g, '-'), value.id];
            console.log(temp);
            values.push(temp);
        }
        console.log(values);
        var sql = 'insert into article_main_tags (article,main_tag) values ?';
        conn.query(sql, [values], function (err) {
            if (err)
                throw err;

        });
        res.status(200).json(id);

    });
});

module.exports = router;
