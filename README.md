# Arnab Crafts — Next.js commerce starter

Repository: https://github.com/Dipankar-archives/arnab-crafts

## Included

- Next.js App Router + TypeScript
- PostgreSQL database through Prisma
- Secure, httpOnly signed sessions
- Customer registration and login
- One-owner admin initialization protected by `ADMIN_SETUP_TOKEN`
- Owner-only password change API (bcrypt hashed passwords)
- Owner-only product and order endpoints
- Price, frame color, and size filters
- Cart and checkout order creation
- Payment method selection: UPI, cards, net banking, wallets, Razorpay checkout adapter, and cash on delivery
- WhatsApp support at +91 91013 87479
- Custom-domain-ready frontend for `arnabcrafts.com`

## Run locally

```bash
cp .env.example .env.local
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Set a real PostgreSQL `DATABASE_URL`, a long random `AUTH_SECRET`, and a private `ADMIN_SETUP_TOKEN` before deployment.

### Create the owner account

After deploying, call the one-time endpoint with your private setup token:

```bash
curl -X POST https://arnabcrafts.com/api/auth/setup-admin \
  -H 'content-type: application/json' \
  -d '{"setupToken":"YOUR_ADMIN_SETUP_TOKEN","name":"Your Name","email":"you@example.com","password":"USE-A-NEW-12-CHARACTER-PASSWORD"}'
```

This endpoint refuses to create another admin after the first owner exists. Never commit `.env.local` or secrets. The owner password is changed through the protected admin password API; it is never stored in the repository.

## Payments

The store accepts orders with UPI, card, net-banking, wallet, and COD choices. For live online payment capture, add your own Razorpay merchant credentials as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, then connect the payment-order/signature verification flow to your merchant account. Do not put the secret in client-side code. COD and order records work without gateway credentials.

## Connect arnabcrafts.com

1. Register `arnabcrafts.com` with a domain registrar in your name.
2. Deploy this repository to Vercel or another Node-compatible host.
3. Add the domain in the hosting dashboard.
4. Add the DNS records the host gives you at your registrar.
5. Set `NEXT_PUBLIC_SITE_URL=https://arnabcrafts.com` and all production environment variables.
6. Use HTTPS and a managed PostgreSQL database in production.

The GitHub repository alone cannot register or activate the domain; the domain and hosting accounts should remain in your ownership.
