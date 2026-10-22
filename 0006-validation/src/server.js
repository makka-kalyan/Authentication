import app from "./app/app.js";
import connectToDb from "./config/db.js";

await connectToDb();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
