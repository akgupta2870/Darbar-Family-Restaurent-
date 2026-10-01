# DARBAR Fine Dining & Family Restaurant — Next.js 15 Project Architecture

This application is built with a dual-mode architecture:
1. **Interactive Live Demo:** Runs with zero setup in Google AI Studio on port 3000.
2. **Next.js 15 App Router Production System:** Complete production-grade Next.js App Router structure ready for instant deployment to Vercel, Firebase App Hosting, or GCP Cloud Run.

---

## 📁 Next.js 15 Folder Structure

```
├── app/
│   ├── layout.tsx                # Root layout with fonts, metadata & light theme
│   ├── page.tsx                  # Home page (Hero, specials, reviews, map)
│   ├── menu/
│   │   └── page.tsx              # Digital Menu with veg/non-veg filter & search
│   ├── offers/
│   │   └── page.tsx              # Marketing banners & promotional coupons
│   ├── track/
│   │   └── page.tsx              # Real-time Order Tracking (6 stages)
│   ├── checkout/
│   │   └── page.tsx              # Checkout flow with simulated payment
│   ├── story/
│   │   └── page.tsx              # Royal heritage & private cabin showcase
│   ├── admin/
│   │   └── page.tsx              # Restaurant management portal
│   └── api/                      # Next.js Server Route Handlers
│       ├── orders/route.ts       # GET/POST orders endpoint
│       ├── reservations/route.ts # Table & private cabin booking endpoint
│       ├── menu/route.ts         # Digital menu API
│       └── webhook/whatsapp/     # Meta WhatsApp Cloud API webhook handler
├── src/
│   ├── components/               # Modular UI components
│   ├── context/                  # CartContext & OrderContext
│   ├── data/mockData.ts          # Seed dishes, categories, offers & settings
│   ├── services/
│   │   ├── firebaseService.ts    # Firestore service adapter
│   │   └── notificationService.ts # WhatsApp & SMS notification triggers
│   └── types/index.ts            # TypeScript interfaces
├── next.config.mjs               # Next.js configuration
├── package.next.json             # Standalone Next.js 15 package manifest
└── README_NEXTJS.md              # Deployment guide
```

---

## 🚀 How to Deploy as Next.js 15 to Vercel or Cloud Run

### Option 1: Deploy to Vercel (1-Click)
1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **Import Repository**.
3. Use the `package.next.json` dependencies (or copy `package.next.json` over `package.json`).
4. Framework Preset: **Next.js**.
5. Click **Deploy**.

### Option 2: Run locally as Next.js
```bash
cp package.next.json package.json
npm install
npm run dev
```

---

## 🛠️ Phase-2 Integrations

- **Firebase Firestore:** Replace `firebaseService.ts` local storage adapter with direct Firebase Web SDK `initializeFirestore()` & `collection(db, 'orders')`.
- **Payment Gateway:** Replace the simulated payment flow in `CheckoutPage.tsx` with Razorpay / Cashfree SDK.
- **WhatsApp Business API:** Connect `app/api/webhook/whatsapp/route.ts` with Meta Graph API to send automated WhatsApp order confirmations directly to customer phone numbers.
