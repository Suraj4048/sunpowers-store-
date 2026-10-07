# ☀️ Sunpowers Online Store — सेटअप (सिर्फ़ 3 स्टेप)

## फ़ाइलें
| फ़ाइल | काम |
|---|---|
| `index.html` | ग्राहकों वाली वेबसाइट (होम पेज) |
| `admin.html` | Admin Panel — अलग लिंक: `/admin` |
| `config.js` | Supabase URL + Key (डेटाबेस कनेक्शन) |
| `core.js`, `xlsx-lite.js` | वेबसाइट का इंजन (इन्हें न बदलें) |
| `setup.sql` | डेटाबेस सेटअप — Supabase में एक बार चलाना है |
| `vercel.json` | Vercel सेटिंग |

## स्टेप 1 — डेटाबेस (एक बार)
1. supabase.com → अपना प्रोजेक्ट → बाएँ **SQL Editor** → **New query**
2. `setup.sql` का पूरा टेक्स्ट paste करें → **Run**
3. नीचे लिखा आए: `Sunpowers setup complete ✔`

(दोबारा चलाने से कोई डेटा या पासवर्ड नहीं मिटता।)

## स्टेप 2 — config.js चेक करें
Supabase → **Project Settings → API** → *Project URL* और *anon / publishable key* — ये दोनों `config.js` में वही होने चाहिए।

## स्टेप 3 — GitHub पर डालें (Vercel अपने आप लाइव करेगा)
Codespaces में ZIP अपलोड करें (`sunpowers-store` फ़ोल्डर में), फिर ये एक कमांड:
```
cd /workspaces/sunpowers-store && find . -mindepth 1 -maxdepth 1 ! -name .git ! -name sunpowers-store-v2.zip -exec rm -rf {} + && unzip -o sunpowers-store-v2.zip && rm sunpowers-store-v2.zip && git add -A && git commit -m "Sunpowers store v2" && git push
```

## पहली बार Admin
- लिंक: `https://आपकी-साइट/admin`
- पासवर्ड: **sunpowers@123** → तुरंत ⚙️ सेटिंग्स → "Admin पासवर्ड बदलें"
- ऊपर पीले बॉक्स में **"डेमो डेटा अभी पब्लिश करें"** दबाएँ — फिर सब कुछ एडिट करें।

## Admin में क्या-क्या है
- 🏠 **होम लेआउट** — सेक्शन/स्लाइडशो का क्रम ⬆️⬇️, छुपाएँ 👁, नया सेक्शन/स्लाइडशो जोड़ते समय जगह चुनें
- 📦 **प्रोडक्ट्स** — पहले सेक्शन चुनें → फिर डिटेल (नाम, Sale Price, Offer Price, फ़ोटो, और फ़ोटो, टैगलाइन, लिंक…) → Publish। एडिट / कॉपी / छुपाएँ / डिलीट
- 🖼️ **स्लाइडशो** — फ़ोटो अपलोड, टाइटल, चलती रिबन टैगलाइन, बटन, क्लिक लिंक (Product / Section / Form / WhatsApp / Call / URL), समय, Fade/Slide, ऊँचाई
- 🛠️ सर्विसेज़, ⭐ फ़ीडबैक (sticky ticker), ▶️ YouTube वीडियो, 📝 फ़ॉर्म व "ऑर्डर कैसे करें" गाइड
- 🧾 **ऑर्डर** और 📨 **पूछताछ** — स्टेटस बदलें, WhatsApp करें, Excel डाउनलोड
- 📊 **Excel** — पूरी वेबसाइट एक Excel में डाउनलोड → बदलाव → अपलोड → सब जगह अपडेट। **Google Merchant / Facebook / Instagram / WhatsApp कैटलॉग** के लिए प्रोडक्ट फ़ीड (CSV)
- ⚙️ **सेटिंग्स** — स्टोर नाम, लोगो, WhatsApp, पेमेंट (COD + एडवांस %, UPI ID — चालू/बंद), Facebook/Instagram/YouTube/GMB लिंक, Google Analytics, Meta Pixel, पासवर्ड, बैकअप

## ज़रूरी बातें
- फ़ोटो Supabase Storage (`sp-images`) में जाती हैं। Storage न चले तो फ़ोटो छोटी होकर डेटा में सेव होती है — वेबसाइट फिर भी चलती है।
- हर प्रोडक्ट का अपना लिंक: `https://आपकी-साइट/?p=PRODUCT_ID` (Google/Meta पर लिस्टिंग के लिए)।
- सब कुछ फ़्री टूल्स पर: Vercel (होस्टिंग) + Supabase (डेटाबेस, फ़्री प्लान)।
