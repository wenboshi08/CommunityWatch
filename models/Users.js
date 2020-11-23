const db = require('../db/db_config');

/**
 * @typeof User
 * 
 * @prop {string} name - name of the user
 * @prop {number} id - id of the user
 */

/**
 * @class Users
 * 
 * Stores all Users.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {
  /**
   * Add a User.
   * 
   * @param {string} name - User name
   * @param {string} password - Password
   * @return {User} - created user
   */
  static async addOne(name, password) {
    // first insert the user into the db then fetch the user from the DB
    console.log("GOT IN Users");
    return db.run(`INSERT INTO users (${db.columnNames.userName}, ${db.columnNames.userPass}) VALUES ('${name}', '${password}')`)
              .then(() => Users.findOne(name));
  }

  /**
   * Find a User by Name.
   * @param {string} name - name of User to find
   * @return {User | undefined} - found User
   */
  static async findOne(name, password) {
    return db.get(`SELECT * FROM users WHERE ${db.columnNames.userName} = '${name}' AND ${db.columnNames.userPass} = '${password}'`);
  }

  /**
     * get one user by the name
     */
    static async get(name) {        
        return db.get(`SELECT * FROM users WHERE ${db.columnNames.userName} == '${name}'`);
    }

    /**
     * get one user by the ID
     */
  static async getFromID(userID) {        
      return db.get(`SELECT * FROM users WHERE ${db.columnNames.userId} == '${userID}'`);
  }
    
  static async has(name) {  
        let userRecord = await db.get(`SELECT * FROM users WHERE ${db.columnNames.userName} == '${name}'`);
        if (userRecord){
            return true;
        }else{
            return false;
        }
    }

  static async updateUserName(userID, newUserName) {
        return db.run(`UPDATE users 
            SET ${db.columnNames.userName} = '${newUserName}' 
            WHERE ${db.columnNames.userId} = '${userID}'`)
            .then( () => {
              return Users.get(newUserName);
            });
      }

  static async updatePassword(userID, newPassword) {
    return db.run(`UPDATE users 
        SET ${db.columnNames.userPass} = '${newPassword}' 
        WHERE ${db.columnNames.userId} = '${userID}'`)
        .then( () => {
          return Users.getFromID(userID);
        });
  }
 /**
     * delete the user by userID
     */
    static async deleteUser(userID) {      
        return Users.get(userID)
              .then( (userRecord) => {
                db.run(`DELETE FROM users WHERE ${db.columnNames.userId} = '${userID}'`);
                return userRecord;
              });  

    }
  /**
   * Return an array of all of the Users.
   * @return {User[]}
   */
  static async findAll() {
    return db.all(`SELECT * FROM users`);
  }
}

module.exports = Users;