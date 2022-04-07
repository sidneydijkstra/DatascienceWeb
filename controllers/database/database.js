// get mysql
var mysql = require("mysql")

// class for setting up connection with database
class Database{
  constructor() {
    // get .env variables
    this.connectionLimit = process.env.DATABASE_POOL_LIMIT;
    this.host = process.env.DATABASE_IP;
    this.port = process.env.DATABASE_PORT;
    this.user = process.env.DATABASE_USERNAME;
    this.debug = false;

    // setup database connection
    this.setup();
  }

  // function for setting up the connection to the database
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


  // function to check if there is still a connection to the database
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

  // escape function used to escape user input normaly
  escape(value){
    return this.pool.escape(value);
  }

  // escape function used to escape user input for id's
  escapeId(value){
    return this.pool.escapeId(value);
  }

  // function to get the mysql connection
  getConnection(){
    return this.pool;
  }

  // function to get the status/info about the database connection
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

// create instance and set as export
var db = new Database();
module.exports = db;
