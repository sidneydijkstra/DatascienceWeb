var fs = require('fs');
var database = require("./database.js")
var Table = require("./table.js")

class DatabaseController{
  constructor() {
    this.tables = []
    var rawdata = fs.readFileSync("./json/tables.json");
    var parsedata = JSON.parse(rawdata)

    Object.keys(parsedata).forEach((name, i) => {
        this.tables[name] = new Table(name, parsedata[name]);
    });
  }

  getTables(){
    return Object.keys(this.tables);
  }

  has(table){
    return this.tables[table] !== undefined
  }

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
