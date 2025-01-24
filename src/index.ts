import * as dotenv from "dotenv";
import app from "./server";

dotenv.config();

app.listen(3001, () => {
  console.log("server is running on port 3000 ,http://localhost:3001/");
});
