// ---------------------------------------------------------------+@
// Clase contenedor (no pude importar el archivo y usar la clase, no entiendo la documentación ni la explicación en clase)

const fs = require("fs");

class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }


    async read() {
        try {
            const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`, "utf-8");
            return contenido;
        } catch (err) {
            return [];
        }
    }

    async save(objeto) {
        console.log("Guardando datos en archivo...")
        try {
            const contenido = await this.read();
            console.log("s -  Archivo leído con éxito");
            let datos = [];
            if (contenido) {
                datos = JSON.parse(contenido);
            }
            let id;
            if (datos == "") {
                id = 1;
                objeto.id = id;
                datos = [objeto];
            } else {
                id = datos[datos.length - 1].id + 1;
                objeto.id = id;
                datos.push(objeto);
            }
            try {
                await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(datos, null, 2));
                console.log("s -  Archivo modificado con éxito");
                return id;
            } catch (err) {
                console.log(`s -  Error modificando el archivo:!!!!!!!!!:${err}`);
            }
        } catch (err) {
            console.log(`s -  Error leyendo el archivo:!!!!!!!!!:${err}`);
        }
    }

    async getById(id) {
        console.log("Obteniendo producto por ID...")
        try {
            const contenido = await this.read();
            console.log("gBI -  Archivo leído con éxito");
            let datos = [];
            if (contenido != "" && contenido != "[]") {
                datos = JSON.parse(contenido);
                datos = datos.find(obj => obj.id == id);
                return datos;
            } else {
                console.log("gBI -  No hay elementos que leer!");
                return null;
            }
        } catch (err) {
            console.log("gBI -  Error leyendo el archivo!", err);
        }
    }

    async getAll() {
        console.log("Obteniendo productos...")
        try {
            const contenido = await this.read();
            console.log("gA -  Archivo leído con éxito");
            let datos = [];
            if (contenido != "" && contenido != "[]") {
                datos = JSON.parse(contenido);
                return datos;
            } else {
                console.log("gA -  No hay elementos que leer!");
                return null;
            }
        } catch (err) {
            console.log("gA -  Error leyendo el archivo!", err);
        }
    }

    async deleteById(id) {
        console.log("Borrando producto por ID...")
        try {
            const contenido = await this.read();
            console.log("dBI -  Archivo leído con éxito");
            let datos = [];
            if (contenido != "" && contenido != "[]") {
                datos = JSON.parse(contenido);
                datos = datos.filter(obj => obj.id != id);
                try {
                    await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(datos, null, 2));
                    console.log("dBI -  Producto borrado exitosamente");
                } catch (err) {
                    console.log(`dBI -  Error modificando el archivo:!: ${err}`);
                }
            } else {
                console.log("dBI -  No hay elementos que borrar!");
                return null;
            }
        } catch (err) {
            console.log("gBI -  Error leyendo el archivo!", err);
        }
    }

    async deleteAll() {
        console.log("Borrando todos los productos...");
        try {
            fs.promises.writeFile(`./${this.nombreArchivo}`, "");
            console.log("dA - Productos borrados existosamente")
        } catch (err) {
            console.log(`dA - Error al modificar el archivo, ${err}`);
        }
    }

}

const productos = new Contenedor("productos.txt");

// ---------------------------------------------------------------+@
// Servidor

const express = require('express');

const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${server.address().port}`);
})
server.on("error", error => console.log(`Error en el servidor: ${error}`));

app.get('/', (req, res) => {
    res.send('<a href="./productos">Productos Array</a></br><a href="./productoRandom">Producto Random</a>')
})

app.get('/productos', async (req, res) => {
    res.send(await productos.getAll());
})

app.get('/productoRandom', async (req, res) => {
    const rand = parseInt(1+(Math.random() * 3));
    res.send(await productos.getById(rand));
})
