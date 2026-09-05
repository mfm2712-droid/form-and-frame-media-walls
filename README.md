# Form & Frame site starter

Run locally with `node server.js`, then open `http://localhost:3000`.

The server records enquiries and configurator concepts under `data/`. To receive email alerts, copy `.env.example` to `.env`, add a verified Resend sender and set the variables in your deployment environment. No email is sent until those values are configured. The admin enquiries endpoint requires `Authorization: Bearer <ADMIN_TOKEN>`.

Open the back-office at `http://localhost:3000/admin.html`. It requires the `ADMIN_TOKEN` from your `.env` file.

Endpoints: `POST /api/enquiries`, `POST /api/concepts`, `POST /api/chat`, `GET /api/admin/enquiries`.
