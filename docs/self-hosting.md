# Self-Hosting Farscry

Self-host Farscry on any machine that runs Docker. This guide covers Unraid + Cloudflare Tunnel — the simplest path with valid TLS, no router config, and free.

## What you'll have when done

- Farscry running at `https://farscry.<your-domain>` with a real cert
- Postgres + API + web served via Caddy + Cloudflare Tunnel
- Persistent data volume on your Unraid array
- Restarts automatically with Docker

---

## Prerequisites

- An Unraid server (or any Linux box with Docker + Docker Compose v2)
- A domain on Cloudflare (free plan works)
- ~10 minutes

---

## Step 1 — Install Compose Manager on Unraid

If you don't already have it:

1. **Apps** → search **Compose Manager** (by `dcflachs`)
2. Install it
3. **Settings → Docker** → make sure Docker is enabled

> Skip this step if you already manage compose stacks on Unraid.

---

## Step 2 — Create a Cloudflare Tunnel

1. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) → **Networks → Tunnels**
2. Click **Create a tunnel** → **Cloudflared** → name it `farscry` → **Save tunnel**
3. On the **Install connector** screen, **copy the tunnel token** (the long string after `--token`). Save it for Step 4.
4. Click **Next**
5. **Public hostnames** → **Add a public hostname**:
   - **Subdomain:** `farscry` (or whatever you want)
   - **Domain:** pick your domain
   - **Service type:** `HTTP`
   - **URL:** `web:80`
6. **Save** the tunnel

Cloudflare now points `farscry.<your-domain>` at your tunnel and will route traffic to whatever connects with that token.

---

## Step 3 — Get the code on your Unraid server

SSH into your Unraid box (or use the terminal in the Unraid UI):

```bash
# Choose a location on your array, e.g.:
mkdir -p /mnt/user/appdata/farscry
cd /mnt/user/appdata/farscry

git clone https://github.com/<you>/farscry.git .
```

> No git? `apk add git` (Alpine) or use the **NerdPack** plugin.

---

## Step 4 — Configure environment variables

```bash
cp .env.prod.example .env.prod
nano .env.prod
```

Fill in:

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | A long random string |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` |
| `PUBLIC_HOSTNAME` | `farscry.<your-domain>` (no `https://`) |
| `TUNNEL_TOKEN` | The tunnel token from Step 2 |

---

## Step 5 — Bring up the stack

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

First build takes 3–5 minutes. After that it boots in seconds.

Check that everything is up:

```bash
docker compose -f docker-compose.prod.yml ps
```

You should see `db (healthy)`, `api`, `web`, and `cloudflared` all `Up`.

Watch the cloudflared logs to confirm the tunnel connected:

```bash
docker compose -f docker-compose.prod.yml logs -f cloudflared
```

Look for `Registered tunnel connection`.

---

## Step 6 — Open Farscry

Visit `https://farscry.<your-domain>`. Sign up, set a username, and you're live.

---

## Updating

When new code lands:

```bash
cd /mnt/user/appdata/farscry
git pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

The `migrate` service runs `drizzle-kit push` automatically before the API starts, so schema changes apply themselves.

---

## Optional — Add to Compose Manager UI

If you prefer managing from Unraid's web UI:

1. **Compose Manager** → **Add new stack** → name it `farscry`
2. Point the stack directory at `/mnt/user/appdata/farscry`
3. Set the compose file to `docker-compose.prod.yml`
4. Set the env file to `.env.prod`
5. Click **Compose Up**

Now you can start/stop/redeploy from the Unraid dashboard.

---

## Troubleshooting

**Tunnel won't connect**
- Double-check `TUNNEL_TOKEN` — no quotes, no spaces, the whole base64 string
- `docker compose logs cloudflared`

**Page loads but auth fails**
- `PUBLIC_HOSTNAME` must match what you set in the Cloudflare tunnel — without `https://`

**Calls connect but no video**
- WebRTC needs HTTPS to access camera/mic. Confirm you're on `https://`, not the Unraid IP.
- For symmetric NATs you may need a TURN server. Public STUN works for ~90% of home networks. See [advanced TURN setup](./turn-setup.md) (TODO).

**Migrations fail on first boot**
- Check `docker compose logs migrate`
- Make sure `db` is `healthy` before the migrate service runs (it should be automatic)

---

## What you don't need

- **Port forwarding** — Cloudflare Tunnel makes outbound connections only
- **A static IP** — works behind dynamic IP, CGNAT, even mobile hotspots
- **Let's Encrypt** — Cloudflare provides the cert at the edge
- **A separate reverse proxy** (SWAG, etc.) — Caddy is bundled in the web image
