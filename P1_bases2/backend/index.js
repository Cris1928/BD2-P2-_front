require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const express = require('express');
const cassandra = require('cassandra-driver');
const morgan = require('morgan');
const cors = require('cors');


// Inicializar Express
const app = express();
app.use(express.json());

// Configuración de CORS
app.use(cors());

// Configuración de Morgan
app.use(morgan('dev'));

// Configuración del cliente de Cassandra 
const client = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_HOST], 
    localDataCenter: process.env.CASSANDRA_DATACENTER, 
    keyspace: process.env.CASSANDRA_KEYSPACE 
  });

// Verificar la conexión a Cassandra
client.connect()
  .then(() => console.log('Conectado a Cassandra'))
  .catch(err => console.error('Error al conectar a Cassandra', err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
  });


// ============================ Manejo de Productos ============================
// Ruta para obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const query = 'SELECT * FROM productos';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});

//ruta para insertar un producto
app.post('/addproductos', async (req, res) => {
  const { codigo_producto, nombre, marca, fabricante, precio } = req.body;
  try {
    const query = `
      INSERT INTO productos (codigo_producto, nombre, marca, fabricante, fecha_aplicacion, precio)
      VALUES (?, ?, ?, ?, toTimestamp(now()), ?)`;
    await client.execute(query, [codigo_producto, nombre, marca, fabricante, precio], { prepare: true });
    res.status(201).send('Producto agregado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el producto');
  }
});

// Ruta para obtener un producto por su código
app.get('/productos/:codigo_producto', async (req, res) => {
  const { codigo_producto } = req.params;
  try {
    const query = 'SELECT * FROM productos WHERE codigo_producto = ?';
    const result = await client.execute(query, [codigo_producto], { prepare: true });
    res.json(result.rows[0]); // Devolver el primer resultado
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el producto');
  }
});

// Ruta para obtener el histórico de precios de un producto
app.get('/productos/:codigo_producto/historico', async (req, res) => {
  const { codigo_producto } = req.params;
  try {
    const query = 'SELECT fecha_aplicacion, precio FROM productos WHERE codigo_producto = ?';
    const result = await client.execute(query, [codigo_producto], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el histórico de precios');
  }
});

// ============================ Manejo de Clientes ============================
// Ruta para obtener todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const query = 'SELECT * FROM clientes';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los clientes');
  }
});

//ruta para insertar un cliente
app.post('/addclientes', async (req, res) => {
  const { codigo_cliente, nombre_empresa, representante_legal, telefono, direccion, tipo_cliente } = req.body;
  try {
    const query = `
      INSERT INTO clientes (codigo_cliente, nombre_empresa, representante_legal, telefono, direccion, tipo_cliente)
      VALUES (?, ?, ?, ?, ?, ?)`;
    await client.execute(query, [codigo_cliente, nombre_empresa, representante_legal, telefono, direccion, tipo_cliente], { prepare: true });
    res.status(201).send('Cliente agregado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el cliente');
  }
});

// Ruta para obtener un cliente por su código
app.get('/clientes/:codigo_cliente', async (req, res) => {
  const { codigo_cliente } = req.params;
  try {
    const query = 'SELECT * FROM clientes WHERE codigo_cliente = ?';
    const result = await client.execute(query, [codigo_cliente], { prepare: true });
    res.json(result.rows[0]); // Devolver el primer resultado
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el cliente');
  }
});

// Ruta para obtener los descuentos de un cliente
app.get('/clientes/:codigo_cliente/descuentos', async (req, res) => {
  const { codigo_cliente } = req.params;
  try {
    const query = 'SELECT tipo_cliente FROM clientes WHERE codigo_cliente = ?';
    const result = await client.execute(query, [codigo_cliente], { prepare: true });
    const tipo_cliente = result.rows[0].tipo_cliente;

    // Aquí puedes definir tus descuentos según el tipo de cliente
    let descuentos;
    if (tipo_cliente === 'A') {
      descuentos = { descuento: '20%' };
    } else if (tipo_cliente === 'B') {
      descuentos = { descuento: '10%' };
    } else {
      descuentos = { descuento: '5%' };
    }

    res.json(descuentos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los descuentos');
  }
});

// ============================ Manejo de Bodegas ============================
// Ruta para obtener todas las bodegas
app.get('/bodegas', async (req, res) => {
  try {
    const query = 'SELECT * FROM bodegas';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las bodegas');
  } 
});

//ruta para insertar una bodega
app.post('/addbodegas', async (req, res) => {
  const { codigo_bodega, capacidad_total_m3 } = req.body;
  try {
    const query = `
      INSERT INTO bodegas (codigo_bodega, capacidad_total_m3)
      VALUES (?, ?)`;
    await client.execute(query, [codigo_bodega, capacidad_total_m3], { prepare: true });
    res.status(201).send('Bodega agregada');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar la bodega');
  }
});

// Ruta para obtener los productos de una bodega
app.get('/bodegas/:codigo_bodega/productos', async (req, res) => {
  const { codigo_bodega } = req.params;
  try {
    const query = 'SELECT * FROM productos_por_bodega WHERE codigo_bodega = ?';
    const result = await client.execute(query, [codigo_bodega], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al listar los productos de la bodega');
  }
});

// ============================ Manejo de Cuartos Frios ============================
// Ruta para obtener todos los cuartos frios
app.get('/cuartosfrios', async (req, res) => {
  try {
    const query = 'SELECT * FROM cuartos_frios';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los cuartos frios');
  }
});

//ruta para insertar un cuarto frio
// Ruta para insertar un cuarto frío
app.post('/addcuartosfrios', async (req, res) => {
  const { codigo_cuarto_frio, codigo_bodega, capacidad_m3, temperatura } = req.body;
  try {
    // Inserción en la tabla original
    const queryOriginal = `
      INSERT INTO cuartos_frios (codigo_cuarto_frio, codigo_bodega, capacidad_m3, temperatura)
      VALUES (?, ?, ?, ?)`;
    await client.execute(queryOriginal, [codigo_cuarto_frio, codigo_bodega, capacidad_m3, temperatura], { prepare: true });
    
    // Inserción en la tabla denormalizada
    const queryDenormalizada = `
      INSERT INTO cuartos_frios_por_bodega (codigo_bodega, codigo_cuarto_frio, capacidad_m3, temperatura)
      VALUES (?, ?, ?, ?)`;
    await client.execute(queryDenormalizada, [codigo_bodega, codigo_cuarto_frio, capacidad_m3, temperatura], { prepare: true });
    
    res.status(201).send('Cuarto frío agregado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el cuarto frío');
  }
});


// Ruta para obtener los cuartos fríos de una bodega
app.get('/bodegas/:codigo_bodega/cuartosfrios', async (req, res) => {
  const { codigo_bodega } = req.params;
  try {
    const query = 'SELECT * FROM cuartos_frios WHERE codigo_bodega = ? ALLOW FILTERING';
    const result = await client.execute(query, [codigo_bodega], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los cuartos fríos de la bodega');
  }
});


// ============================ Manejo de Pedidos ============================
// Ruta para obtener todos los pedidos
app.get('/pedidos', async (req, res) => {
  try {
    const query = 'SELECT * FROM pedidos';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los pedidos');
  }
});

//ruta para insertar un pedido
app.post('/addpedidos', async (req, res) => {
  const { codigo_pedido, codigo_cliente, total_pedido } = req.body;
  try {
    const query = `
      INSERT INTO pedidos (codigo_pedido, codigo_cliente, fecha_pedido, total_pedido)
      VALUES (?, ?, toTimestamp(now()), ?)`;
    await client.execute(query, [codigo_pedido, codigo_cliente, total_pedido], { prepare: true });
    res.status(201).send('Pedido agregado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el pedido');
  }
});


// Ruta para obtener todos los detalles de pedidos
app.get('/detallepedidos', async (req, res) => {
  try {
    const query = 'SELECT * FROM detalle_pedido';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los detalles de pedidos');
  }
});

//ruta para insertar un detalle de pedido
app.post('/adddetallepedidos', async (req, res) => {
  const { codigo_pedido, codigo_producto, codigo_bodega, precio_unitario, cantidad, total_producto } = req.body;
  try {
    const query = `
      INSERT INTO detalle_pedido (codigo_pedido, codigo_producto, codigo_bodega, precio_unitario, cantidad, total_producto)
      VALUES (?, ?, ?, ?, ?, ?)`;
    await client.execute(query, [codigo_pedido, codigo_producto, codigo_bodega, precio_unitario, cantidad, total_producto], { prepare: true });
    res.status(201).send('Detalle de pedido agregado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el detalle de pedido');
  }
});

// Ruta para obtener los detalles de un pedido
app.get('/pedidos/:codigo_pedido/detalles', async (req, res) => {
  const { codigo_pedido } = req.params;
  try {
    const query = 'SELECT * FROM detalle_pedido WHERE codigo_pedido = ?';
    const result = await client.execute(query, [codigo_pedido], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el detalle del pedido');
  }
});

// Ruta para obtener los pedidos de un cliente en un rango de fechas
// http://localhost:3000/clientes/1/pedidos/rango?inicio=2024-04-01&fin=2024-04-04
app.get('/clientes/:codigo_cliente/pedidos/rango', async (req, res) => {
  const { codigo_cliente } = req.params;
  const { inicio, fin } = req.query; // Fechas en formato YYYY-MM-DD
  console.log ("inicio", inicio);
  console.log ("fin", fin);

  // Validación de las fechas
  const inicioDate = new Date(inicio);
  const finDate = new Date(fin);

  if (isNaN(inicioDate) || isNaN(finDate)) {
    return res.status(400).send('Fechas inválidas. Utiliza el formato YYYY-MM-DD.');
  }

  try {
    const query = `
      SELECT * FROM pedidos_por_cliente_fecha 
      WHERE codigo_cliente = ? AND fecha_pedido >= ? AND fecha_pedido <= ?`;
    const result = await client.execute(query, [codigo_cliente, inicioDate, finDate], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los pedidos en el rango de fechas');
  }
});

// Ruta para obtener los pedidos pendientes de una bodega
app.get('/bodegas/:codigo_bodega/pedidos/pendientes', async (req, res) => {
  const { codigo_bodega } = req.params;
  try {
    const query = `
      SELECT * FROM pedidos_pendientes_por_bodega
      WHERE codigo_bodega = ? AND estado = 'pendiente'`;
    const result = await client.execute(query, [codigo_bodega], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los pedidos pendientes');
  }
});


// Ruta para verificar la disponibilidad de productos en un pedido
app.get('/pedidos/:codigo_pedido/disponibilidad', async (req, res) => {
  const { codigo_pedido } = req.params;
  try {
    const query = `
      SELECT codigo_producto, SUM(cantidad) AS total_solicitado
      FROM detalle_pedido
      WHERE codigo_pedido = ?
      GROUP BY codigo_producto`;
    const result = await client.execute(query, [codigo_pedido], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al verificar la disponibilidad de productos');
  }
});


// Ruta para obtener la ubicación de los productos de un pedido 
app.get('/pedidos/:codigo_pedido/ubicacion', async (req, res) => {
  const { codigo_pedido } = req.params;
  
  try {
    // 1. Obtener los productos, cantidades y bodegas del pedido
    const pedidoQuery = `
      SELECT codigo_producto, cantidad, codigo_bodega
      FROM detalle_pedido
      WHERE codigo_pedido = ?`;
    
    const pedidoResult = await client.execute(pedidoQuery, [codigo_pedido], { prepare: true });

    if (pedidoResult.rows.length === 0) {
      return res.status(404).send('No se encontraron detalles para el pedido especificado.');
    }

    // 2. Obtener los cuartos fríos de las bodegas involucradas
    const bodegas = [...new Set(pedidoResult.rows.map(row => row.codigo_bodega))]; // Obtener bodegas únicas

    if (bodegas.length === 0) {
      return res.status(404).send('No se encontraron bodegas para los productos del pedido.');
    }

    // Crear placeholders para la cláusula IN
    const placeholders = bodegas.map(() => '?').join(', ');
    const cuartosFrioQuery = `
      SELECT codigo_bodega, codigo_cuarto_frio
      FROM cuartos_frios_por_bodega
      WHERE codigo_bodega IN (${placeholders})`;
    
    const cuartosFrioResult = await client.execute(cuartosFrioQuery, bodegas, { prepare: true });

    // Crear un mapa de codigo_bodega a codigo_cuarto_frio
    const mapaCuartosFrio = {};
    cuartosFrioResult.rows.forEach(row => {
      mapaCuartosFrio[row.codigo_bodega] = row.codigo_cuarto_frio;
    });

    // 3. Combinar la información
    const ubicaciones = pedidoResult.rows.map(row => ({
      codigo_producto: row.codigo_producto,
      cantidad: row.cantidad,
      codigo_bodega: row.codigo_bodega,
      codigo_cuarto_frio: mapaCuartosFrio[row.codigo_bodega] || 'No asignado'
    }));

    // 4. Responder con la información combinada
    res.json(ubicaciones);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la ubicación de los productos del pedido');
  }
});



// Iniciar el servidor 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 
