const express = require('express');
const app = express();
app.use(express.json());

const routeLibros = require('./routes/libros');
const errorHandler = require('./middlewares/errorHandler');

app.use('/libros', routeLibros);
app.use(errorHandler);

const port = 3000;

app.listen(port, ()=>{
    console.log('Server corriendo en el puerto 3000');
});