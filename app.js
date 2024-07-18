import express from "express";
import { fetchUserData, NotFoundError } from "./userController";

const app = express();

app.get("/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const userData = await fetchUserData(userId);
    res.json(userData);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

const port = 3333;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
