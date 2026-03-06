// CREATE SERVER.JS
const app = require('./app');
const { dbConnection } = require('./config/db');
require('dotenv').config();

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbConnection();
});
