const { response } = require("express");

require("dotenv").config();

const Pool = require("pg").Pool;
const pool = new Pool({
  user: `${process.env.DB_USER}`,
  host: `${process.env.DB_HOST}`,
  database: `${process.env.DB_DATABASE}`,
  password: `${process.env.DB_PASSWORD}`,
  port: `${process.env.DB_PORT}`,
});

const getPoints = (request, response) => {
  const qs = `SELECT json_agg(row_to_json(locations))
FROM (
    SELECT id, name, ST_AsText(geom) as geom 
    FROM locations
) locations;`;
  const nqs = `SELECT
  ST_AsGeoJSON(t.*)
FROM
  locations AS t`;
  pool.query(nqs, (error, results) => {
    if (error) {
      throw error;
    }
    console.log(results.rows);
    let res = "[";
    results.rows.map((r, index) => {
      res += r.st_asgeojson;
      if (index < results.rows.length - 1) res += ",";
    });
    res += "]";
    response.status(200).send(res);
    console.log(results);
  });
};

// Our first endpoint will be a GET request.
// Inside the pool.query() we can put the raw SQL that will touch the api database.
// We’ll SELECT all users and order by id.
const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// For our /users/:id request, we’ll be getting the custom id parameter by the URL and using a WHERE clause to display the result.

// In the SQL query, we’re looking for id=$1. In this instance, $1 is a numbered placeholder,
// which PostgreSQL uses natively instead of the ? placeholder you may be familiar with from other flavors of SQL.

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//   The API will take a GET and POST request to the /users endpoint. In the POST request, we’ll be adding a new user.
//   In this function, we’re extracting the name and email properties from the request body, and INSERTing the values.

const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [name, email],
    (error, result) => {
      if (error) {
        throw error;
      }

      response.status(201).send(`User added with ID: ${result.insertId}`);
      // troubleshoot this line of code further, not functioning correctly
    }
  );
};
const uploadPoint = (request, response) => {
  const { name, position } = request.body;

  pool.query(` INSERT INTO locations (name, geom) VALUES 
('${name}', ST_GeomFromText('POINT(${position[1]} ${position[0]})', 4326)),`),
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`point with ID:${result.insertId}`);
    };
};

//   The /users/:id endpoint will also take two HTTP requests — the GET we created for getUserById, and also a PUT, to modify an existing user.
//   For this query, we’ll combine what we learned in GET and POST to use the UPDATE clause.

//   It is worth noting that PUT is idempotent, meaning the exact same call can be made over and over and will produce the same result.
//   This is different than POST, in which the exact same call repeated will continuously make new users with the same data.

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

//   Finally, we’ll use the DELETE clause on /users/:id to delete a specific user by id.
//   This call is very similar to our getUserById() function.

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
    console.log(response);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getPoints,
};
