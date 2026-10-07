-- Categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  offer_price DECIMAL(10, 2),
  main_image TEXT,
  additional_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tagline TEXT,
  sku TEXT UNIQUE,
  stock INTEGER DEFAULT 0,
  section_name TEXT,
  product_link TEXT,
  payment_modes TEXT[] DEFAULT ARRAY['upi', 'cod']::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Slideshows table
CREATE TABLE slideshows (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  position INTEGER,
  slides JSONB DEFAULT '[]'::JSONB,
  animation_type TEXT DEFAULT 'fade',
  slide_duration INTEGER DEFAULT 3500,
  ribbon_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sections table
CREATE TABLE sections (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER,
  position_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Section Products (many-to-many)
CREATE TABLE section_products (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT REFERENCES sections(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Update Sections table
CREATE TABLE update_sections (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  products BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer Feedbacks table
CREATE TABLE feedbacks (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_image TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  product_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  products JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_mode TEXT,
  advance_paid DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment Settings table
CREATE TABLE payment_settings (
  id BIGSERIAL PRIMARY KEY,
  upi_id TEXT,
  upi_enabled BOOLEAN DEFAULT TRUE,
  cod_enabled BOOLEAN DEFAULT TRUE,
  cod_advance_percent INTEGER DEFAULT 15,
  razorpay_key TEXT,
  razorpay_secret TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Settings
CREATE TABLE admin_settings (
  id BIGSERIAL PRIMARY KEY,
  store_name TEXT DEFAULT 'Sunpowers',
  store_logo TEXT,
  whatsapp_number TEXT DEFAULT '9621050636',
  email TEXT,
  phone TEXT,
  address TEXT,
  youtube_links TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS policies (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE slideshows ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON slideshows FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON sections FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON feedbacks FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON admin_settings FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_section ON products(section_name);
CREATE INDEX idx_section_products_section ON section_products(section_id);
CREATE INDEX idx_orders_customer ON orders(customer_phone);
CREATE INDEX idx_orders_date ON orders(created_at);
