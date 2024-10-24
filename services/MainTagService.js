var MysqlConnection = require( '../datalayer/MysqlConnection');
 const MainTagService= {
    allMainTags:function(){
        var resultset=null;
        const conn = MysqlConnection.createConnection();
       conn.query('select * from student', function (err, result, fields) {
    if (err) throw err;
    resultset = result;
  });
    return resultset;   
    }
}
module.exports= MainTagService;

