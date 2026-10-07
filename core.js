/* =====================================================================
   SUNPOWERS — core.js  (shared by index.html and admin.html)
   Data layer, demo data, helpers. No external libraries.
   ===================================================================== */
(function () {
  'use strict';
  var CFG = window.SP_CONFIG || {};
  var SP = (window.SP = {});
  SP.cfg = CFG;
  SP.BUCKET = CFG.IMAGE_BUCKET || 'sp-images';

  /* ---------------- small helpers ---------------- */
  SP.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  SP.uid = function (p) {
    return (p || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };
  SP.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  SP.num = function (v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''));
    return isFinite(n) ? n : 0;
  };
  SP.money = function (n) { return '₹' + Math.round(SP.num(n)).toLocaleString('en-IN'); };
  SP.debounce = function (fn, ms) {
    var t; return function () { var a = arguments, me = this; clearTimeout(t); t = setTimeout(function () { fn.apply(me, a); }, ms); };
  };
  SP.digits = function (s) { return String(s || '').replace(/\D/g, ''); };
  SP.waNumber = function (s) { var d = SP.digits(s); if (d.length === 10) d = '91' + d; return d; };
  SP.waLink = function (num, text) {
    return 'https://wa.me/' + SP.waNumber(num) + (text ? '?text=' + encodeURIComponent(text) : '');
  };
  SP.ytId = function (url) {
    url = String(url || '').trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  };
  SP.isImg = function (s) { return !!s && /^(https?:\/\/|data:image\/|\/|\.\/)/i.test(String(s).trim()); };
  SP.safeUrl = function (u) {
    u = String(u || '').trim();
    if (!u) return '#';
    if (/^(https?:|mailto:|tel:|upi:|\/|\.\/|\?|#)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return '#'; // block javascript: etc.
    return 'https://' + u;
  };
  SP.discount = function (p) {
    var m = SP.num(p.mrp), o = SP.num(p.offer);
    return m > 0 && o > 0 && o < m ? Math.round((1 - o / m) * 100) : 0;
  };
  SP.price = function (p) { var o = SP.num(p.offer); return o > 0 ? o : SP.num(p.mrp); };
  SP.ls = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  SP.ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------------- backend (Supabase REST, no SDK) ---------------- */
  SP.backendReady = function () { return !!(CFG.SUPABASE_URL && CFG.SUPABASE_KEY); };
  function base() { return String(CFG.SUPABASE_URL || '').replace(/\/+$/, ''); }
  function authHeaders(extra) {
    var key = String(CFG.SUPABASE_KEY || '').trim();
    var h = { apikey: key };
    // New Supabase keys (sb_publishable_...) are not JWTs: send only the apikey header.
    if (key.indexOf('sb_') !== 0) h.Authorization = 'Bearer ' + key;
    for (var k in extra || {}) h[k] = extra[k];
    return h;
  }
  SP.rpc = async function (fn, args, timeoutMs) {
    if (!SP.backendReady()) throw new Error('Database connect nahi hai (config.js check karein)');
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, timeoutMs || 20000);
    var res;
    try {
      res = await fetch(base() + '/rest/v1/rpc/' + fn, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(args || {}),
        signal: ctrl ? ctrl.signal : undefined
      });
    } catch (e) {
      throw new Error(e && e.name === 'AbortError' ? 'Server se jawab nahi aaya (timeout). Internet check karein.' : 'Network error — internet check karein.');
    } finally { clearTimeout(timer); }
    var txt = await res.text(), body = null;
    try { body = txt ? JSON.parse(txt) : null; } catch (e) { body = txt; }
    if (!res.ok) {
      var msg = (body && (body.message || body.msg || body.error_description || body.error)) || ('HTTP ' + res.status);
      var code = body && body.code;
      if (res.status === 404 || code === 'PGRST202' || /could not find the function/i.test(msg))
        msg = 'Database setup baaki hai — Supabase me setup.sql run karein.';
      var err = new Error(msg); err.status = res.status; err.code = code; throw err;
    }
    return body;
  };

  /* image helpers */
  SP.compressImage = function (file, maxDim, quality) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type || '')) return reject(new Error('Sirf image file chunein (JPG/PNG/WebP)'));
      if (file.type === 'image/gif' && file.size < 1.5e6) return resolve(file);
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        try {
          var w = img.naturalWidth, h = img.naturalHeight, s = Math.min(1, maxDim / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * s)), ch = Math.max(1, Math.round(h * s));
          var c = document.createElement('canvas'); c.width = cw; c.height = ch;
          var ctx = c.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch); ctx.drawImage(img, 0, 0, cw, ch);
          URL.revokeObjectURL(url);
          c.toBlob(function (b) { b ? resolve(b) : reject(new Error('Image process nahi ho payi')); }, 'image/jpeg', quality);
        } catch (e) { reject(e); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Image read nahi ho payi')); };
      img.src = url;
    });
  };
  SP.blobToDataUrl = function (blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = function () { rej(new Error('Image read error')); }; r.readAsDataURL(blob);
    });
  };
  SP.uploadImage = async function (blob) {
    if (!SP.backendReady()) throw new Error('no backend');
    var ext = blob.type === 'image/gif' ? 'gif' : blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
    var path = 'img/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    var res = await fetch(base() + '/storage/v1/object/' + SP.BUCKET + '/' + path, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': blob.type || 'image/jpeg', 'x-upsert': 'false', 'cache-control': 'max-age=31536000' }),
      body: blob
    });
    if (!res.ok) { var t = ''; try { t = await res.text(); } catch (e) {} throw new Error('Upload failed (' + res.status + ') ' + t.slice(0, 120)); }
    return base() + '/storage/v1/object/public/' + SP.BUCKET + '/' + path;
  };
  /* returns {url, fallback:boolean} */
  SP.storeImage = async function (file) {
    var big = await SP.compressImage(file, 1600, 0.85);
    try { return { url: await SP.uploadImage(big), fallback: false }; }
    catch (e) {
      var small = await SP.compressImage(file, 700, 0.7);
      return { url: await SP.blobToDataUrl(small), fallback: true, error: e.message };
    }
  };

  /* ---------------- store load / normalize ---------------- */
  SP.CACHE_KEY = 'sp_store_cache_v1';
  SP.loadStore = async function () {
    try {
      var d = await SP.rpc('sp_get_store', {}, 12000);
      if (d && typeof d === 'object' && !Array.isArray(d) && Array.isArray(d.layout)) {
        var n = SP.normalize(d);
        SP.ls.set(SP.CACHE_KEY, n);
        return { data: n, source: 'db' };
      }
      return { data: SP.normalize(SP.demo()), source: 'demo' };
    } catch (e) {
      var c = SP.ls.get(SP.CACHE_KEY, null);
      if (c && Array.isArray(c.layout)) return { data: SP.normalize(c), source: 'cache', error: e };
      return { data: SP.normalize(SP.demo()), source: 'demo', error: e };
    }
  };

  function isObj(o) { return o && typeof o === 'object' && !Array.isArray(o); }
  function mergeDefaults(def, val) {
    if (!isObj(def)) return val === undefined ? def : val;
    var out = {}, k;
    val = isObj(val) ? val : {};
    for (k in def) out[k] = isObj(def[k]) ? mergeDefaults(def[k], val[k]) : (val[k] === undefined || val[k] === null ? def[k] : val[k]);
    for (k in val) if (!(k in out)) out[k] = val[k];
    return out;
  }
  SP.BLOCK_TYPES = ['slideshow', 'section', 'services', 'chips', 'form', 'howto', 'feedback', 'videos'];
  SP.SINGLE_BLOCKS = ['services', 'chips', 'form', 'howto', 'feedback', 'videos'];
  SP.SLIDESHOW_DEF = { name: 'Slideshow', interval: 4, effect: 'slide', autoplay: true, dots: true, arrows: true, height: 190, visible: true };
  SP.SLIDE_DEF = { image: '', bg: '#1b5e20', emoji: '☀️', title: '', subtitle: '', button: '', ribbon: '', linkType: 'none', link: '', visible: true };
  SP.SECTION_DEF = { title: 'New Section', titleEn: '', subtitle: '', kind: 'category', limit: 8, icon: '', visible: true };
  SP.PRODUCT_DEF = { title: '', titleEn: '', sections: [], tagline: '', desc: '', descEn: '', mrp: 0, offer: 0, unit: '', badge: '',
    stock: 'in', visible: true, sort: 0, emoji: '☀️', bg: '#e8f5e9', image: '', images: [], link: '', sku: '', brand: '' };

  SP.normalize = function (d) {
    var def = SP.demo();
    d = isObj(d) ? SP.clone(d) : {};
    var out = d;
    out.v = 1;
    out.settings = mergeDefaults(def.settings, d.settings);
    ['services', 'form', 'howto', 'feedback', 'videos'].forEach(function (k) {
      out[k] = isObj(d[k]) ? mergeDefaults(def[k], d[k]) : def[k];
    });
    ['services', 'feedback', 'videos'].forEach(function (k) {
      if (!Array.isArray(out[k].items)) out[k].items = [];
      out[k].items = out[k].items.filter(isObj).map(function (it) { if (!it.id) it.id = SP.uid('it'); return it; });
    });
    ['types', 'steps'].forEach(function (k) {
      var o = k === 'types' ? out.form : out.howto;
      if (!Array.isArray(o[k])) o[k] = String(o[k] || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    });
    out.sections = (Array.isArray(d.sections) ? d.sections : []).filter(isObj).map(function (s) {
      s = mergeDefaults(SP.SECTION_DEF, s); if (!s.id) s.id = SP.uid('sec'); s.limit = Math.max(1, Math.min(40, Math.round(SP.num(s.limit)) || 8)); return s;
    });
    out.slideshows = (Array.isArray(d.slideshows) ? d.slideshows : []).filter(isObj).map(function (ss) {
      var slides = Array.isArray(ss.slides) ? ss.slides : [];
      ss = mergeDefaults(SP.SLIDESHOW_DEF, ss); if (!ss.id) ss.id = SP.uid('ss');
      ss.interval = Math.max(1, Math.min(60, SP.num(ss.interval) || 4));
      ss.height = Math.max(100, Math.min(600, SP.num(ss.height) || 190));
      ss.slides = slides.filter(isObj).map(function (sl) { sl = mergeDefaults(SP.SLIDE_DEF, sl); if (!sl.id) sl.id = SP.uid('sl'); return sl; });
      return ss;
    });
    var secIds = {}; out.sections.forEach(function (s) { secIds[s.id] = 1; });
    out.products = (Array.isArray(d.products) ? d.products : []).filter(isObj).map(function (p) {
      p = mergeDefaults(SP.PRODUCT_DEF, p); if (!p.id) p.id = SP.uid('p');
      if (!Array.isArray(p.sections)) p.sections = p.sections ? [String(p.sections)] : [];
      p.sections = p.sections.filter(function (id) { return secIds[id]; });
      if (!Array.isArray(p.images)) p.images = p.images ? [String(p.images)] : [];
      p.images = p.images.filter(Boolean);
      p.mrp = SP.num(p.mrp); p.offer = SP.num(p.offer); p.sort = SP.num(p.sort);
      p.stock = p.stock === 'out' ? 'out' : 'in';
      return p;
    });
    var ssIds = {}; out.slideshows.forEach(function (s) { ssIds[s.id] = 1; });
    var seenSingle = {}, seenRef = {};
    out.layout = (Array.isArray(d.layout) ? d.layout : def.layout).filter(function (b) {
      if (!isObj(b) || SP.BLOCK_TYPES.indexOf(b.type) < 0) return false;
      if (b.type === 'section') { if (!secIds[b.ref] || seenRef[b.ref]) return false; seenRef[b.ref] = 1; }
      else if (b.type === 'slideshow') { if (!ssIds[b.ref] || seenRef[b.ref]) return false; seenRef[b.ref] = 1; }
      else { if (seenSingle[b.type]) return false; seenSingle[b.type] = 1; }
      return true;
    }).map(function (b) { if (!b.id) b.id = SP.uid('b'); if (b.hidden !== true) b.hidden = false; return b; });
    return out;
  };

  SP.sortProducts = function (list) {
    return list.slice().sort(function (a, b) { return (SP.num(a.sort) - SP.num(b.sort)); });
  };
  SP.productsOf = function (store, secId, includeHidden) {
    return SP.sortProducts(store.products.filter(function (p) {
      return (includeHidden || p.visible !== false) && p.sections.indexOf(secId) >= 0;
    }));
  };

  /* ---------------- DEMO DATA (editable from admin) ---------------- */
  SP.demo = function () {
    var pastel = ['#e8f5e9', '#fff3e0', '#e3f2fd', '#fce4ec', '#f3e5f5', '#fffde7', '#e0f7fa', '#f1f8e9'];
    var cats = [
      ['sec_c1', 'सोलर पैनल', 'Solar Panels', '☀️', 'हर छत के लिए सही पैनल', [
        ['मोनो PERC सोलर पैनल 540W', 'Mono PERC Solar Panel 540W', 16500, 13999, 'Tier-1 • 25 साल परफॉर्मेंस वारंटी', 'Bestseller'],
        ['बाइफेशियल सोलर पैनल 550W', 'Bifacial Solar Panel 550W', 19000, 15999, 'दोनों तरफ़ से बिजली', ''],
        ['TOPCon सोलर पैनल 580W', 'TOPCon Solar Panel 580W', 22000, 18499, 'नई टेक्नोलॉजी, ज़्यादा बिजली', 'New'],
        ['पॉली सोलर पैनल 335W', 'Poly Solar Panel 335W', 9500, 7999, 'बजट फ्रेंडली', ''],
        ['मोनो सोलर पैनल 200W', 'Mono Solar Panel 200W', 6500, 5299, 'छोटे घर / दुकान के लिए', ''],
        ['DCR सोलर पैनल 545W', 'DCR Solar Panel 545W', 24000, 20999, 'सब्सिडी योजना योग्य*', '']]],
      ['sec_c2', 'सोलर इन्वर्टर', 'Solar Inverters', '🔌', 'ऑन-ग्रिड, ऑफ-ग्रिड और हाइब्रिड', [
        ['ऑन-ग्रिड इन्वर्टर 3kW', 'On-Grid Inverter 3kW', 42000, 34999, 'नेट मीटरिंग रेडी', 'Bestseller'],
        ['ऑन-ग्रिड इन्वर्टर 5kW', 'On-Grid Inverter 5kW', 58000, 48999, 'WiFi मॉनिटरिंग', ''],
        ['हाइब्रिड इन्वर्टर 5kW', 'Hybrid Inverter 5kW', 85000, 72999, 'बैटरी + ग्रिड दोनों', 'New'],
        ['ऑफ-ग्रिड PCU 2.5kVA', 'Off-Grid PCU 2.5kVA', 28000, 22999, 'MPPT चार्जर के साथ', ''],
        ['सोलर होम UPS 1100VA', 'Solar Home UPS 1100VA', 9500, 7499, 'घर के लिए पावर बैकअप', ''],
        ['थ्री-फेज़ इन्वर्टर 10kW', '3-Phase Inverter 10kW', 115000, 96999, 'दुकान / फैक्ट्री के लिए', '']]],
      ['sec_c3', 'सोलर बैटरी', 'Solar Batteries', '🔋', 'लंबा बैकअप, लंबी उम्र', [
        ['सोलर ट्यूबलर बैटरी 150Ah', 'Solar Tubular Battery 150Ah', 16500, 13499, '5 साल वारंटी', 'Bestseller'],
        ['सोलर ट्यूबलर बैटरी 200Ah', 'Solar Tubular Battery 200Ah', 21000, 17499, 'लंबा बैकअप', ''],
        ['लिथियम बैटरी 2.5kWh', 'Lithium Battery 2.5kWh', 65000, 54999, 'हल्की व मेंटेनेंस-फ्री', 'New'],
        ['लिथियम LFP बैटरी 5kWh', 'Lithium LFP Battery 5kWh', 120000, 99999, '6000+ साइकिल लाइफ़', ''],
        ['बैटरी ट्रॉली', 'Battery Trolley', 1500, 999, 'मज़बूत स्टील', ''],
        ['डिस्टिल्ड वाटर 5L', 'Battery Distilled Water 5L', 250, 180, 'बैटरी की देखभाल', '']]],
      ['sec_c4', 'सोलर वाटर पंप', 'Solar Water Pumps', '💧', 'किसानों के लिए मुफ़्त धूप से सिंचाई', [
        ['सोलर सबमर्सिबल पंप 1HP', 'Solar Submersible Pump 1HP', 65000, 54999, 'छोटे खेत के लिए', ''],
        ['सोलर सबमर्सिबल पंप 3HP', 'Solar Submersible Pump 3HP', 135000, 114999, 'कुसुम योजना योग्य*', 'Bestseller'],
        ['सोलर सरफेस पंप 1HP', 'Solar Surface Pump 1HP', 48000, 39999, 'कम गहराई के लिए', ''],
        ['सोलर पंप कंट्रोलर (VFD) 3HP', 'Solar Pump Controller (VFD) 3HP', 38000, 31999, 'पंप की पूरी सुरक्षा', ''],
        ['सोलर DC वाटर पंप 0.5HP', 'Solar DC Water Pump 0.5HP', 22000, 17999, 'घर की टंकी के लिए', ''],
        ['सोलर पंप सेट 5HP', 'Solar Pump Set 5HP', 240000, 205000, 'कम्प्लीट किट', '']]],
      ['sec_c5', 'सोलर लाइट्स', 'Solar Lights', '💡', 'बिना बिजली बिल के रोशनी', [
        ['सोलर स्ट्रीट लाइट 30W', 'Solar Street Light 30W', 6500, 4999, 'ऑटो ON/OFF', ''],
        ['सोलर फ्लड लाइट 100W', 'Solar Flood Light 100W', 4500, 2999, 'रिमोट के साथ', 'Bestseller'],
        ['सोलर गार्डन लाइट (4 पैक)', 'Solar Garden Light (Pack of 4)', 2400, 1499, 'बगीचे की शोभा', ''],
        ['सोलर होम लाइटिंग किट', 'Solar Home Lighting Kit', 3500, 2499, '3 बल्ब + मोबाइल चार्जिंग', ''],
        ['सोलर वॉल लाइट (मोशन सेंसर)', 'Solar Wall Light (Motion Sensor)', 1200, 799, 'आते ही जलेगी', ''],
        ['सोलर लालटेन', 'Solar Lantern', 1500, 999, 'कहीं भी ले जाएँ', '']]],
      ['sec_c6', 'चार्ज कंट्रोलर व DB', 'Charge Controllers & DB', '🎛️', 'सुरक्षित और सही चार्जिंग', [
        ['MPPT चार्ज कंट्रोलर 40A', 'MPPT Charge Controller 40A', 6500, 4999, '30% तक ज़्यादा चार्जिंग', ''],
        ['MPPT चार्ज कंट्रोलर 60A', 'MPPT Charge Controller 60A', 9500, 7499, 'बड़े सिस्टम के लिए', ''],
        ['PWM चार्ज कंट्रोलर 20A', 'PWM Charge Controller 20A', 1800, 1199, 'छोटे सिस्टम के लिए', ''],
        ['PWM चार्ज कंट्रोलर 30A', 'PWM Charge Controller 30A', 2400, 1599, 'LCD डिस्प्ले', ''],
        ['DC डिस्ट्रीब्यूशन बॉक्स (DCDB)', 'DC Distribution Box (DCDB)', 3500, 2699, 'SPD + फ्यूज़ के साथ', ''],
        ['AC डिस्ट्रीब्यूशन बॉक्स (ACDB)', 'AC Distribution Box (ACDB)', 3200, 2499, 'MCB + SPD', '']]],
      ['sec_c7', 'सोलर वाटर हीटर', 'Solar Water Heaters', '🚿', 'सर्दियों में मुफ़्त गर्म पानी', [
        ['सोलर वाटर हीटर 100L', 'Solar Water Heater 100L', 28000, 22999, '3-4 लोगों के परिवार के लिए', ''],
        ['सोलर वाटर हीटर 150L', 'Solar Water Heater 150L', 35000, 28999, '5-6 लोगों के लिए', 'Bestseller'],
        ['सोलर वाटर हीटर 200L', 'Solar Water Heater 200L', 42000, 34999, 'बड़े परिवार के लिए', ''],
        ['सोलर वाटर हीटर 300L', 'Solar Water Heater 300L', 62000, 52999, 'होटल / हॉस्टल के लिए', ''],
        ['ETC ट्यूब (रिप्लेसमेंट)', 'ETC Tube (Replacement)', 900, 650, 'सभी मॉडल के लिए', ''],
        ['हीटर स्टैंड किट', 'Water Heater Stand Kit', 4500, 3499, 'जंग-रोधी', '']]],
      ['sec_c8', 'वायर, केबल व एक्सेसरीज़', 'Cables & Accessories', '🧰', 'इंस्टॉलेशन का पूरा सामान', [
        ['सोलर DC केबल 4mm (100m)', 'Solar DC Cable 4mm (100m)', 9000, 7499, 'UV प्रोटेक्टेड', ''],
        ['सोलर DC केबल 6mm (100m)', 'Solar DC Cable 6mm (100m)', 13500, 10999, 'कॉपर कंडक्टर', ''],
        ['MC4 कनेक्टर (10 जोड़ी)', 'MC4 Connectors (10 Pairs)', 900, 599, 'वाटरप्रूफ़', 'Bestseller'],
        ['अर्थिंग किट', 'Earthing Kit', 4500, 3299, 'केमिकल अर्थिंग', ''],
        ['लाइटनिंग अरेस्टर', 'Lightning Arrester', 3800, 2799, 'आसमानी बिजली से सुरक्षा', ''],
        ['पैनल माउंटिंग स्ट्रक्चर (1kW)', 'Panel Mounting Structure (1kW)', 9000, 6999, 'GI हॉट-डिप', '']]],
      ['sec_c9', 'कम्प्लीट सोलर सिस्टम', 'Complete Solar Systems', '🏠', 'इंस्टॉलेशन सहित पूरा सेटअप', [
        ['1kW ऑन-ग्रिड सोलर सिस्टम', '1kW On-Grid Solar System', 75000, 62000, 'सब्सिडी सहायता उपलब्ध*', ''],
        ['3kW ऑन-ग्रिड सोलर सिस्टम', '3kW On-Grid Solar System', 195000, 165000, 'सब्सिडी सहायता उपलब्ध*', 'Bestseller'],
        ['5kW ऑन-ग्रिड सोलर सिस्टम', '5kW On-Grid Solar System', 310000, 265000, 'बड़े घर के लिए', ''],
        ['2kW ऑफ-ग्रिड सोलर सिस्टम', '2kW Off-Grid Solar System', 165000, 139000, 'बैटरी बैकअप के साथ', ''],
        ['5kW हाइब्रिड सोलर सिस्टम', '5kW Hybrid Solar System', 420000, 359000, 'ग्रिड + बैटरी', 'New'],
        ['10kW कमर्शियल सोलर सिस्टम', '10kW Commercial Solar System', 650000, 549000, 'दुकान / फैक्ट्री के लिए', '']]]
    ];
    var sections = [
      { id: 'sec_u1', title: 'आज के ऑफर 🔥', titleEn: "Today's Offers 🔥", subtitle: 'सीमित समय के लिए', kind: 'update', limit: 6, icon: '', visible: true },
      { id: 'sec_u2', title: 'बेस्ट सेलर ⭐', titleEn: 'Best Sellers ⭐', subtitle: 'ग्राहकों की पहली पसंद', kind: 'update', limit: 6, icon: '', visible: true }
    ];
    var products = [], n = 0;
    cats.forEach(function (c) {
      sections.push({ id: c[0], title: c[1], titleEn: c[2], subtitle: c[4], kind: 'category', limit: 8, icon: c[3], visible: true });
      c[5].forEach(function (p, i) {
        n++;
        products.push({
          id: 'p_' + c[0].slice(4) + '_' + (i + 1), title: p[0], titleEn: p[1], sections: [c[0]],
          tagline: p[4], desc: p[0] + ' — Sunpowers द्वारा भरोसेमंद क्वालिटी, सही दाम और इंस्टॉलेशन सपोर्ट। (यह डेमो विवरण है, Admin से बदलें)',
          descEn: p[1] + ' — trusted quality, fair price and installation support by Sunpowers. (Demo text — edit from Admin)',
          mrp: p[2], offer: p[3], unit: '', badge: p[5], stock: 'in', visible: true, sort: i + 1,
          emoji: c[3], bg: pastel[n % pastel.length], image: '', images: [], link: '', sku: 'SP-' + String(n).padStart(3, '0'), brand: 'Sunpowers'
        });
      });
    });
    function add(id, sec) { products.forEach(function (p) { if (p.id === id) p.sections.push(sec); }); }
    ['p_c9_2', 'p_c1_1', 'p_c3_1', 'p_c5_2', 'p_c4_2', 'p_c7_2'].forEach(function (id) { add(id, 'sec_u1'); });
    ['p_c2_1', 'p_c1_3', 'p_c8_3', 'p_c2_3', 'p_c3_3', 'p_c9_5'].forEach(function (id) { add(id, 'sec_u2'); });

    function sl(bg, emoji, title, subtitle, button, ribbon, linkType, link) {
      return { id: SP.uid('sl'), image: '', bg: bg, emoji: emoji, title: title, subtitle: subtitle, button: button, ribbon: ribbon, linkType: linkType, link: link, visible: true };
    }
    var slideshows = [
      { id: 'ss_1', name: 'Slideshow 1 (Top)', interval: 4, effect: 'slide', autoplay: true, dots: true, arrows: true, height: 190, visible: true, slides: [
        sl('#1b5e20', '🏡', 'घर पर सोलर लगवाएं', 'बिजली बिल में भारी बचत', 'फ्री सर्वे बुक करें', '☀️ फ्री साइट सर्वे • आसान EMI • सब्सिडी सहायता', 'form', ''),
        sl('#0d47a1', '📄', 'PM सूर्य घर योजना', 'सब्सिडी के लिए पूरी मदद', 'सिस्टम देखें', '✅ आवेदन से इंस्टॉलेशन तक पूरी सहायता', 'section', 'sec_c9'),
        sl('#e65100', '🎉', 'फेस्टिव सोलर सेल', 'चुनिंदा प्रोडक्ट्स पर भारी छूट', 'ऑफर देखें', '🔥 सीमित समय का ऑफर', 'section', 'sec_u1')] },
      { id: 'ss_2', name: 'Slideshow 2', interval: 5, effect: 'fade', autoplay: true, dots: true, arrows: true, height: 170, visible: true, slides: [
        sl('#4a148c', '🔋', 'लिथियम बैटरी', 'हल्की, तेज़ चार्ज, लंबी उम्र', 'देखें', '⚡ 6000+ साइकिल लाइफ़', 'section', 'sec_c3'),
        sl('#004d40', '🔌', 'हाइब्रिड इन्वर्टर', 'ग्रिड + बैटरी, दोनों का फ़ायदा', 'देखें', '📶 WiFi मॉनिटरिंग', 'product', 'p_c2_3')] },
      { id: 'ss_3', name: 'Slideshow 3', interval: 4, effect: 'slide', autoplay: true, dots: true, arrows: true, height: 170, visible: true, slides: [
        sl('#01579b', '🚜', 'किसान भाइयों के लिए', 'सोलर पंप से मुफ़्त सिंचाई', 'पंप देखें', '💧 डीज़ल का ख़र्च ख़त्म', 'section', 'sec_c4'),
        sl('#f57f17', '🚿', 'सोलर वाटर हीटर', 'सर्दियों में मुफ़्त गर्म पानी', 'देखें', '♨️ 100L से 300L तक', 'section', 'sec_c7')] },
      { id: 'ss_4', name: 'Slideshow 4', interval: 4, effect: 'fade', autoplay: true, dots: true, arrows: true, height: 170, visible: true, slides: [
        sl('#2e7d32', '🛠️', 'इंस्टॉलेशन व सर्विस', 'ट्रेंड टेक्नीशियन, समय पर सर्विस', 'WhatsApp करें', '📞 एक कॉल पर सर्विस', 'whatsapp', 'नमस्ते, मुझे सोलर इंस्टॉलेशन/सर्विस चाहिए'),
        sl('#37474f', '🤝', 'डीलर / बल्क ऑर्डर', 'होलसेल रेट पर सोलर प्रोडक्ट्स', 'फ़ॉर्म भरें', '📦 पूरे भारत में डिलीवरी', 'form', '')] }
    ];
    var layout = [
      { type: 'slideshow', ref: 'ss_1' }, { type: 'services' }, { type: 'chips' },
      { type: 'section', ref: 'sec_u1' }, { type: 'section', ref: 'sec_u2' },
      { type: 'slideshow', ref: 'ss_2' },
      { type: 'section', ref: 'sec_c1' }, { type: 'section', ref: 'sec_c2' }, { type: 'section', ref: 'sec_c3' },
      { type: 'slideshow', ref: 'ss_3' },
      { type: 'section', ref: 'sec_c4' }, { type: 'section', ref: 'sec_c5' }, { type: 'section', ref: 'sec_c6' },
      { type: 'slideshow', ref: 'ss_4' },
      { type: 'section', ref: 'sec_c7' }, { type: 'section', ref: 'sec_c8' }, { type: 'section', ref: 'sec_c9' },
      { type: 'form' }, { type: 'howto' }, { type: 'feedback' }, { type: 'videos' }
    ].map(function (b, i) { b.id = 'b' + (i + 1); b.hidden = false; return b; });

    return {
      v: 1,
      settings: {
        storeName: 'Sunpowers', tagline: 'सोलर समाधान, भरोसे के साथ', logo: '☀️', logoImg: '', location: 'India',
        whatsapp: '9621050636', phone: '9621050636', email: 'contact@sunpowers.in', address: '',
        siteUrl: 'https://www.sunpowers.in', brand: 'Sunpowers', themeColor: '#1e8e3e', defaultLang: 'hi',
        searchPlaceholder: 'सोलर पैनल, इन्वर्टर, बैटरी खोजें', stickyTicker: true, whatsappButton: true,
        footerText: 'Sunpowers — सोलर पैनल, इन्वर्टर, बैटरी, पंप और कम्प्लीट सोलर सिस्टम। इंस्टॉलेशन सहित।',
        delivery: 'डिलीवरी चार्ज ऑर्डर कन्फ़र्म करते समय बताया जाएगा।',
        payments: {
          cod: { enabled: true, advancePct: 15, label: 'Cash on Delivery (15% एडवांस)' },
          upi: { enabled: true, upiId: 'Sunpowers@ybl', payeeName: 'Sunpowers', label: 'UPI पेमेंट (पूरा भुगतान)' }
        },
        social: { facebook: '', instagram: '', youtube: '', gmb: '' },
        integrations: { ga4: '', metaPixel: '' }
      },
      sections: sections,
      products: products,
      slideshows: slideshows,
      services: { title: 'सर्विसेज़', items: [
        { id: 'sv1', icon: '🏠', title: 'फ्री साइट सर्वे', sub: 'घर/दुकान की छत का मुफ़्त निरीक्षण', price: 'मुफ़्त', bg: '#e8f5e9', linkType: 'form', link: '' },
        { id: 'sv2', icon: '🛠️', title: 'इंस्टॉलेशन व सर्विस', sub: 'ट्रेंड टेक्नीशियन, AMC उपलब्ध', price: 'From ₹999', bg: '#fff8e1', linkType: 'whatsapp', link: 'नमस्ते, मुझे इंस्टॉलेशन/सर्विस चाहिए' },
        { id: 'sv3', icon: '📦', title: 'बल्क / डीलर ऑर्डर', sub: 'होलसेल रेट, GST बिल', price: 'स्पेशल रेट', bg: '#e3f2fd', linkType: 'form', link: '' },
        { id: 'sv4', icon: '📄', title: 'सब्सिडी सहायता', sub: 'सरकारी योजना आवेदन में मदद', price: '⚡ तुरंत सहायता', bg: '#fce4ec', linkType: 'section', link: 'sec_c9' }] },
      form: { title: 'अपनी ज़रूरत बताएं', subtitle: 'फ़ॉर्म भरें — हमारी टीम जल्द संपर्क करेगी', button: 'भेजें',
        types: ['घर के लिए सोलर सिस्टम', 'दुकान / फैक्ट्री के लिए सोलर', 'सोलर पंप (खेती)', 'बैटरी / इन्वर्टर', 'सर्विस / रिपेयर', 'डीलर / बल्क ऑर्डर', 'अन्य'] },
      howto: { title: 'ऑनलाइन ऑर्डर कैसे करें?', steps: [
        'होम पेज पर या 🔍 सर्च से अपना प्रोडक्ट चुनें।',
        'प्रोडक्ट पर क्लिक करके डिटेल, कीमत और फ़ोटो देखें।',
        '"कार्ट में डालें" बटन दबाएँ (या कार्ड पर + दबाएँ)।',
        'नीचे 🛒 कार्ट खोलें, मात्रा (Qty) चेक करें।',
        'नाम, मोबाइल नंबर और पूरा पता भरें।',
        'पेमेंट मोड चुनें और "ऑर्डर करें" दबाएँ — कन्फ़र्मेशन WhatsApp पर मिलेगा।'] },
      feedback: { title: 'ग्राहकों की राय', items: [
        { id: 'fb1', name: 'रमेश यादव', city: 'लखनऊ', rating: 5, text: '3kW सिस्टम लगवाया, बिजली बिल लगभग ज़ीरो हो गया। टीम बहुत अच्छी है।' },
        { id: 'fb2', name: 'सुनीता शर्मा', city: 'कानपुर', rating: 5, text: 'इंस्टॉलेशन समय पर हुआ और सब्सिडी में भी पूरी मदद मिली।' },
        { id: 'fb3', name: 'मोहम्मद आरिफ़', city: 'बाराबंकी', rating: 4, text: 'सोलर पंप से खेत की सिंचाई अब मुफ़्त में होती है।' },
        { id: 'fb4', name: 'Anil Verma', city: 'Varanasi', rating: 5, text: 'Genuine products, fair price. Lithium battery working great.' },
        { id: 'fb5', name: 'प्रिया सिंह', city: 'प्रयागराज', rating: 5, text: 'वाटर हीटर बढ़िया है, सर्दी में गैस का ख़र्च बच गया।' }] },
      videos: { title: 'हमारे वीडियो', items: [
        { id: 'vd1', title: 'सोलर सिस्टम इंस्टॉलेशन (लिंक बदलें)', url: '' },
        { id: 'vd2', title: 'ग्राहक अनुभव (लिंक बदलें)', url: '' },
        { id: 'vd3', title: 'सोलर पंप डेमो (लिंक बदलें)', url: '' }] },
      layout: layout
    };
  };
})();
