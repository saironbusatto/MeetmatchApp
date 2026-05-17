import { cors } from "hono/cors";
import { Hono } from "hono";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { invitesRouter } from "./routes/invites";
import { privateEventsRouter } from "./routes/private-events";
import { publicEventsRouter } from "./routes/public-events";
import { usersRouter } from "./routes/users";

const app = new Hono();

app.use("*", cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use("*", errorHandler);

app.route("/api/v1", healthRouter);
app.route("/api/v1/auth", authRouter);
app.route("/api/v1/users", usersRouter);
app.route("/api/v1/private-events", privateEventsRouter);
app.route("/api/v1/public-events", publicEventsRouter);
app.route("/api/v1/invites", invitesRouter);

export { app };
