var mysql = require('mysql')
const MysqlConnection = {
    createConnection:function(){
        var connection = mysql.createPool({
            connectionLimit:10,
            host:'localhost',
            port:'3306',
            database:'blog',
            user:'samuel',
            password:'7924'
        });
        return connection;
    }
}
module.exports = MysqlConnection;