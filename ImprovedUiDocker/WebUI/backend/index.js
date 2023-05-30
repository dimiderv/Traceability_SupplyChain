const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');


require("dotenv/config");

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);
app.use(express.json());


const PORT =process.env.PORT || 4000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
