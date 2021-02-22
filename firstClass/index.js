const express = require("express");
const { v4, validate } = require("uuid");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateAcaiId(request, response, next) {
  const { id } = request.params;

  if (!validate(id))
    return response.status(400).json({ error: "Invalid acai ID" });

  return next();
}

let acais = [];

app.use(logRequests);
app.use("/acai/:id", validateAcaiId);

app.get("/acai/", (request, response) => {
  return response.json(acais);
});

app.post("/acai", (request, response) => {
  const { name, price } = request.body;
  const acai = { id: v4(), name, price };

  acais.push(acai);

  return response.json(acai);
});

app.put("/acai/:id", (request, response) => {
  const { id } = request.params;
  const { name, price } = request.body;
  const acaiIndex = acais.findIndex((acai) => id == acai.id);

  if (acaiIndex) {
    response.status(400).json({ error: "Invalid acai ID" });
  }

  const acai = {
    id,
    name,
    price,
  };

  acais[acaiIndex] = acai;

  return response.json(acai);
});

app.delete("/acai/:id", (request, response) => {
  const { id } = request.params;

  const acaiIndex = acais.findIndex((acai) => id === acai.id);

  acais.splice(acaiIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("backend starts");
});
