const app = require('./index');
require('dotenv').config();
const connect = require('./config/db');

app.listen(process.env.PORT, async () => {
    await connect();
    console.log("server running on port " + process.env.PORT);
});