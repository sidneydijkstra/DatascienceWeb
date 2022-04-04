var database = require("./database.js")
// %0%' AND movie_Id LIKE '%1%
class Table{
  constructor(table, columns) {
    this.table = table;
    this.columns = columns;
  }

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

  async search(search, limit){
    return new Promise((resolve, reject)=>{
      try {
        var searchSql = ""
        Object.keys(search).forEach((key, i) => {
          if (this.columns.includes(key) && search[key] != ''){
            searchSql += searchSql == "" ? "WHERE " : " AND ";
            searchSql += `${key} LIKE '${search[key]}'`;
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
