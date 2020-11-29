const sqlite3 = require('sqlite3');

let sqlDb;

// name the columns of our tables for localization
const columnNames = {
  userId: "id",
  userName: "name",
  userPass: "password",
  neighborhoodTableId: "id",
  neighborhoodTableNeighborhood: "neighborhood",
  crimetypesTableId: "id",
  crimetypesTablecrime: "crimeType",
  crimeTableFileNumber: "fileNumber",
  crimeTableReportDate: "reportDate",
  crimeTableCrimeTypeId: "crimeTypeId",
  crimeTableNeighborhoodId: "neighborhoodId",
  crimeTableLocation: "location",
  feedTableUserId: "userId",
  feedTableNeighborhoodId: "neighborhoodId",
  postTablePostId: "id", 
  postTableUserId: "userId", 
  postTableNeighborhoodId: "neighborhoodId", 
  postTablePostContent: "content",
};
Object.freeze(columnNames);

function createDb() {
  console.log("created our db!");
  sqlDb = new sqlite3.Database('crimedb.db', function() {
    createUserTable();
    createNeighborhoodTable();
    createCrimeTypesTable();
    createCrimeTable();
    createFeedTable();
    createPostTable(); 
  });
};

function createUserTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS users (
    ${columnNames.userId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${columnNames.userName} TEXT NOT NULL UNIQUE,
    ${columnNames.userPass} TEXT NOT NULL
  )`);
};

function createNeighborhoodTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS neighborhoods (
    ${columnNames.neighborhoodTableId} INTEGER PRIMARY KEY,
    ${columnNames.neighborhoodTableNeighborhood} TEXT NOT NULL UNIQUE
  )`);
};

function createCrimeTypesTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS crimetypes (
    ${columnNames.crimetypesTableId} INTEGER PRIMARY KEY,
    ${columnNames.crimetypesTablecrime} TEXT NOT NULL UNIQUE
  )`);
};

function createCrimeTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS crimes (
    ${columnNames.crimeTableFileNumber} TEXT PRIMARY KEY,
    ${columnNames.crimeTableReportDate} TEXT NOT NULL,
    ${columnNames.crimeTableCrimeTypeId} INTEGER NOT NULL,
    ${columnNames.crimeTableNeighborhoodId} INTEGER NOT NULL,
    ${columnNames.crimeTableLocation} TEXT NOT NULL,
    FOREIGN KEY(${columnNames.crimeTableNeighborhoodId})
    REFERENCES neighborhoods(${columnNames.neighborhoodTableId}),
    FOREIGN KEY(${columnNames.crimeTableCrimeTypeId})
    REFERENCES crimetypes(${columnNames.crimetypesTableId})
  )`);
};

function createFeedTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS feeds (
    ${columnNames.feedTableUserId} INTEGER NOT NULL,
    ${columnNames.feedTableNeighborhoodId} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.feedTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.feedTableNeighborhoodId})
    REFERENCES neighborhoods(${columnNames.neighborhoodTableId}),
    PRIMARY KEY (${columnNames.feedTableUserId}, ${columnNames.feedTableNeighborhoodId})
  )`);
};

function createPostTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS posts (
    ${columnNames.postTablePostId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${columnNames.postTableUserId} INTEGER NOT NULL, 
    ${columnNames.postTableNeighborhoodId} INTEGER NOT NULL, 
    ${columnNames.postTablePostContent} TEXT NOT NULL, 
    FOREIGN KEY(${columnNames.postTableUserId})
    REFERENCES users(${columnNames.userId}),
    FOREIGN KEY(${columnNames.postTableNeighborhoodId})
    REFERENCES neighborhoods(${columnNames.neighborhoodTableId})
  )`); 
};

// Helper wrapper functions that return promises that resolve when sql queries are complete.

function run(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.run(sqlQuery, (err) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
};

function get(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.get(sqlQuery, (err, row) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(row);
      }
    })
  });
};

function all(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.all(sqlQuery, (err, rows) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};

createDb();

module.exports = {
  columnNames,
  get,
  all,
  run,
};