import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./app.js";
import connnectDb from "./db/index.js";

const port = process.env.PORT || 3000;

connnectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express app is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB conntection error");
    process.exit(1);
  });
