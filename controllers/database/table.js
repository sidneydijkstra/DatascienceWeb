// get database
var database = require("./database.js")

// class for storing database table
class Table{
  constructor(table, columns) {
    // setup table name and column names
    this.table = table;
    this.columns = columns;
  }


  // function to get table entries with limit
  async get(limit){
    return new Promise((resolve, reject)=>{
      try {
        var escLimit = database.escape(limit);
        var limitSql = limit == 0 ? "" : `LIMIT ${escLimit}`;

        var sql = `SELECT * FROM db_datascience.${this.table} ${limitSql};`;
        database.getConnection().query(sql, function (error, results, fields) {
          if (error){
            return reject({
              state: false,
              error: error,
              result: []
            });
          }else{
            return resolve({
              state: true,
              error: "",
              sql: sql,
              columns: fields.map(x => x.name),
              result: JSON.parse(JSON.stringify(results))
            });
          }
        });
      } catch (e) {
        return resolve({
          state: false,
          error: error,
          result: []
        });
      }
    });
  }

  // function to get entries from table based on search statement and limit
  async search(search, limit){
    return new Promise((resolve, reject)=>{
      try {
        var searchSql = ""
        Object.keys(search).forEach((key, i) => {
          if (this.columns.includes(key) && search[key] != ''){
            searchSql += searchSql == "" ? "WHERE " : " AND ";
            searchSql += `${database.escapeId(key)} LIKE ${database.escape(search[key])}`;
          }
        });

        var limitSql = limit == 0 ? "" : `LIMIT ${limit}`;

        var sql = `SELECT * FROM db_datascience.${this.table} ${searchSql} ${limitSql};`;
        console.log(sql);
        database.getConnection().query(sql, function (error, results, fields) {
          if (error){
            return resolve({
              state: false,
              error: error,
              result: []
            });
          }else{
            return resolve({
              state: true,
              error: "",
              sql: sql,
              columns: fields.map(x => x.name),
              result: JSON.parse(JSON.stringify(results))
            });
          }
        });
      } catch (error) {
        return resolve({
          state: false,
          error: error,
          result: []
        });
      }
    });
  }

  // get the total entries of a table
  async count(){
    try {
      return new Promise((resolve, reject)=>{
        var sql = `SELECT COUNT(${this.columns[0]}) AS count FROM db_datascience.${this.table};`;
        database.getConnection().query(sql, function (error, results, fields) {
          if (error){
            return resolve({
              state: false,
              error: error,
              result: []
            });
          }else{
            return resolve({
              state: true,
              error: "",
              sql: sql,
              columns: fields.map(x => x.name),
              result: JSON.parse(JSON.stringify(results))
            });
          }
        });
      });
    } catch (e) {
      return resolve({
        state: false,
        error: error,
        result: []
      });
    }
  }
}

module.exports = Table
