var mysql = require("mysql")

class Database{
  constructor() {
    this.connectionLimit = process.env.DATABASE_POOL_LIMIT;
    this.host = process.env.DATABASE_IP;
    this.port = process.env.DATABASE_PORT;
    this.user = process.env.DATABASE_USERNAME;
    this.debug = false;

    // setup database connection
    this.setup();
  }

  setup(){
    try {
      this.pool = mysql.createPool({
        connectionLimit: this.connectionLimit,
        host: this.host,
        port: this.port,
        user: this.user,
        password: process.env.DATABASE_PASSWORD,
        debug: this.debug
      });
      console.log(`[DATABASE] Connected to database at ${this.host}:${this.port}`);
      return;
    } catch (error) {
      console.log(`[DATABASE] Error in database at ${this.host}:${this.port}\nERROR: ${error}`);
      return;
    }
  }

  async isConnected(){
    return new Promise((resolve, reject)=>{

      setTimeout(function(){
        this.state = false;
        return resolve({
          state: false,
          error: "Timeout"
        });
      }, 2000);

      try {
        this.pool.getConnection(function(error){
          if(error){
            return resolve({
              state: false,
              error: error
            });
          }else{
            return resolve({
              state: true,
              error: ""
            });
          }
        });
      } catch (error) {
        return resolve({
          state: false,
          error: error
        });
      }
    });
  }

  escape(value){
    return this.pool.escape(value);
  }

  escapeId(value){
    return this.pool.escapeId(value);
  }

  getConnection(){
    return this.pool;
  }

  getConnectionStatus(){
    return {
      connectionLimit : this.connectionLimit,
      host : this.host,
      port : this.port,
      user : this.user,
      debug : this.debug
    };
  }
}

var db = new Database();

module.exports = db;
