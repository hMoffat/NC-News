const app = require("./app");

const { port = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
