# ⚡ Quick Start - 5 Minutes to Live Store

**Getting your Sunpowers store online in 5 minutes (requires existing Supabase project).**

## 1️⃣ Set Up Supabase (2 min)

```sql
-- Go to Supabase → SQL Editor
-- Copy-paste supabase_schema.sql and run
-- Then copy-paste sample-data.sql and run
```

## 2️⃣ Get Credentials (1 min)

Supabase Dashboard → Settings → API:
- Copy "Project URL" → Paste as SUPABASE_URL
- Copy "anon public" key → Paste as SUPABASE_KEY

## 3️⃣ Update index.html (1 min)

Find lines 879-880, replace:
```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY_HERE';
```

## 4️⃣ Deploy to Vercel (1 min)

```bash
git add .
git commit -m "Add Supabase credentials"
git push
```

Then:
1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Click "Deploy"
4. **Done!** ✅ Your store is live

## 🔗 Add Custom Domain

In Vercel → Your Project → Settings → Domains:
1. Add `www.sunpowers.in`
2. Update DNS in your registrar (copy-paste Vercel's values)
3. Wait 15 min for DNS to propagate
4. Visit `www.sunpowers.in` ✓

## 🛠️ Access Admin Panel

1. Visit your store URL
2. Find "Admin Mode" button (top-right)
3. Click to toggle admin on/off
4. Edit products, categories, slideshows, payment settings

## 📦 What You Get

✅ Complete e-commerce store  
✅ Shopping cart & checkout  
✅ UPI + Cash on Delivery payment  
✅ Admin dashboard  
✅ Real-time data from Supabase  
✅ Mobile responsive  
✅ 10+ sample products  
✅ Dark theme with animations  

## 🎯 Key Features Included

| Feature | Status |
|---------|--------|
| Product Catalog | ✅ Ready |
| Search & Filters | ✅ Ready |
| Shopping Cart | ✅ Ready |
| Checkout | ✅ Ready |
| UPI Payment | ✅ Configured |
| Cash on Delivery | ✅ 15% Advance |
| Admin Dashboard | ✅ Full CRUD |
| Real-time Sync | ✅ Supabase |
| Mobile Responsive | ✅ 100% |
| Customer Feedback | ✅ Ticker |
| YouTube Section | ✅ Ready |
| Contact Form | ✅ Ready |

## 📞 Payment Details

**UPI**: `Sunpowers@ybl`  
**COD**: 15% advance, 85% at delivery

## ❓ Troubleshooting

**Nothing loads?**
- Check Supabase credentials in index.html
- Verify sample data inserted in Supabase
- Check browser console (F12)

**Admin not working?**
- Refresh page
- Check admin mode is enabled
- Clear browser cache

**Custom domain not working?**
- Wait 30 min for DNS propagation
- Check DNS records in registrar match Vercel

## 📚 Full Documentation

- **README.md** - Complete setup guide with customization
- **DEPLOYMENT_GUIDE.md** - Detailed step-by-step deployment
- **QUICK_START.md** - This file (you are here)

## 🚀 You're Done!

Your store is now live. Next steps:
1. ✅ Test on mobile
2. ✅ Add more products in admin
3. ✅ Update store settings (name, contact)
4. ✅ Share with customers
5. ✅ Monitor orders in admin → Orders

**Questions?** See DEPLOYMENT_GUIDE.md → Troubleshooting

---

**Status**: 🟢 Production Ready | **Version**: 1.0 | **Updated**: 2026-10-07
