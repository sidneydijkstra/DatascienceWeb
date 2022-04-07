// get fs, used in loading files
var fs = require('fs');
// get database
var database = require("./database.js")
// get table class
var Table = require("./table.js")

// class for loading all the tables and handling these tables
class DatabaseController{
  constructor() {
    // create table array
    this.tables = []

    // load and parse tables.json data
    var rawdata = fs.readFileSync("./json/tables.json");
    var parsedata = JSON.parse(rawdata)

    // create table instances in tables array
    Object.keys(parsedata).forEach((name, i) => {
        this.tables[name] = new Table(name, parsedata[name]);
    });
  }

  // function to het all table names
  getTables(){
    return Object.keys(this.tables);
  }

  // function to check if tables array contains table name
  has(table){
    return this.tables[table] !== undefined
  }

  // function to get table based on table name
  get(table){
    if(this.tables[table] !== undefined)
      return {
        state: true,
        error: "",
        result: this.tables[table]
      };
    else{
      return {
        state: false,
        error: `DatabaseController has no table '${table}'`,
        result: null
      };
    }
  }

  // function to run raw sql code used by oure sql console
  async raw(sql){
    return new Promise((resolve, reject)=>{
      try {
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

}

module.exports = new DatabaseController();
