# Supabase Infrastructure Checklist

This checklist provides plain-language instructions for configuring and monitoring your Supabase project in the Supabase Dashboard. Follow these steps to ensure the database can handle high concurrent user loads (up to 5,000+ users) and remains serverless-compatible.

---

## 1. Confirm Paid Tier Upgrade (Scaling Concurrent Loads)
The Supabase Free Tier has strict limits on database size, CPU/RAM resources, and concurrent connection limits. It will bottleneck and fail under high concurrent loads (well before reaching 5,000 concurrent users).

### How to Verify and Upgrade:
1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Click on the **Settings** cog (bottom of the left sidebar).
4. Go to the **Billing** tab.
5. Under **Subscription Plan**, ensure you are upgraded to the **Pro** or **Enterprise** tier.
6. Under **Compute Add-ons** (if available), consider scaling the database instance size (e.g., Small, Medium, or Large compute sizes) to increase dedicated CPU and memory resources before launching to production.

---

## 2. Verify Supavisor Pooling Mode (Set to "Transaction")
For serverless hosting platforms like Vercel, direct database connections (port `5432`) are exhausted almost immediately due to the stateless nature of serverless/edge functions. You must use Supavisor connection pooling set to **Transaction Mode** (port `6543`).

### How to Check and Configure:
1. Navigate to **Settings** -> **Database** in the left sidebar.
2. Scroll down to the **Connection Pooler** section.
3. Ensure **Connection Pooling** is enabled.
4. Verify that **Pool Mode** is set to **Transaction**.
   - **Transaction Mode** releases connections back to the pool immediately after each query is executed, which is non-negotiable for serverless scaling.
   - **Session Mode** is not compatible with Vercel's Serverless environment because it holds onto connections per client session.
5. Ensure you use the **Connection String** shown here for any raw SQL migrations, CLI tools, or external services. The pooled string uses port `6543`.

---

## 3. Set and Monitor a `max_connections` Alert
To prevent database outages caused by running out of available connections, set up monitoring alerts in the Supabase Dashboard.

### How to Monitor:
1. Navigate to **Monitor** (the graph icon in the left sidebar) -> **Database** or **API** to check real-time stats.
2. Scroll to the **Database Connections** graph to monitor active client connections.
3. Set up custom notifications or integration alerts if active connections reach 80% of the project's limits.
4. **Note on scaling limits**:
   - A standard Pro tier database instance defaults to a maximum of 500 direct connections.
   - Using the Supavisor pooler (Transaction mode) increases the virtual connection capacity significantly (supporting thousands of concurrent client queries). Always route all server-side app queries through the API layer or port `6543` to keep actual Postgres connections optimized.
