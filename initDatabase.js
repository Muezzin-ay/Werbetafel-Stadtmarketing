
const db = require('./modules/db')

// Authenticate to the local Database
db.authenticate();
// Override Database
db.initDatabase();