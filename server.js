const fastify = require("fastify")({ logger: true });
const sqlite3 = require("sqlite3").verbose();

const PORT = 3000;

const db = new sqlite3.Database("random_numbers.db", (err) => {
  if (err) {
    fastify.log.error("Error opening database:", err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS numbers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number INTEGER NOT NULL
      )
    `, (err) => {
      if (err) {
        fastify.log.error("Error creating table: ", err.message);
      } else {
        fastify.log.info("Database initialized");
      }
    });
  }
});

fastify.post("/", (_, reply) => {
  const number = Math.floor(Math.random() * 999) + 1;
  
  db.run(`INSERT INTO numbers (number) VALUES (?)`, [number], function (err) {
    if (err) {
      fastify.log.error("Error inserting: ", err.message);

      return reply.status(500).send({ error: "Internal server error" });
    }

    reply.send({ id: this.lastID, number });
  });
});

fastify.get("/:id", (request, reply) => {
  const id = parseInt(request.params.id, 10);
  
  if (isNaN(id)) {
    return reply.status(400).send({ error: "Invalid ID" });
  }
  db.get(`SELECT number FROM numbers WHERE id = ?`, [id], (err, row) => {
    if (err) {
      fastify.log.error("Error retrieving:", err.message);

      return reply.status(500).send({ error: "Internal server error" });
    }
    if (!row) {
      return reply.status(404).send({ error: `Number with id ${id} not found` });
    }
    reply.send(row.number);
  });
});

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server running on port ${PORT}`);
});