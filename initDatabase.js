
const db = require('./modules/db')

// Authenticate to the local Database
try {
    db.authenticate();
} catch(err) {
    console.log(`There was in Error in Database authentication: ${err}`);
}

// Override Database
try {
    db.initDatabase();
} catch(err) {
    console.log(`There was in Error in Initialization: ${err}`);
}

