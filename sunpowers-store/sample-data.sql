-- Sample data for Sunpowers Online Store

-- Insert Categories
INSERT INTO categories (name, description, icon, display_order) VALUES
('Residential Solar Systems', 'Complete solar solutions for residential properties', '🏠', 1),
('Commercial Solar Solutions', 'Enterprise-grade solar systems for businesses', '🏢', 2),
('Industrial Solar Systems', 'Heavy-duty solar installations for industrial use', '🏭', 3),
('VFD Pumps', 'Variable Frequency Drive pumps for solar irrigation', '💧', 4),
('Batteries & Inverters', 'Storage and power conversion solutions', '🔋', 5);

-- Insert Products
INSERT INTO products (category_id, name, description, price, offer_price, main_image, tagline, sku, stock, section_name, payment_modes) VALUES
(1, '5KW Solar Panel System', 'Complete 5KW residential solar panel system with mounting hardware', 150000, 129999, 'https://via.placeholder.com/300x200?text=5KW+Solar', 'Home Energy Solution', 'SKU001', 15, 'Featured Products', ARRAY['upi', 'cod']),
(1, '10KW Solar Panel System', 'Premium 10KW system for larger residences', 280000, 249999, 'https://via.placeholder.com/300x200?text=10KW+Solar', 'Maximum Efficiency', 'SKU002', 8, 'Best Sellers', ARRAY['upi', 'cod']),
(2, '25KW Commercial Solar System', 'Industrial-grade 25KW system for commercial properties', 650000, 579999, 'https://via.placeholder.com/300x200?text=25KW+Commercial', 'Business Energy Independence', 'SKU003', 4, 'Commercial Solutions', ARRAY['upi', 'cod']),
(2, '50KW Commercial Package', 'Complete 50KW commercial installation with monitoring', 1200000, 1099999, 'https://via.placeholder.com/300x200?text=50KW+Package', 'Premium Commercial', 'SKU004', 2, 'Commercial Solutions', ARRAY['upi', 'cod']),
(3, '100KW Industrial Solar', 'Heavy-duty 100KW system for industrial applications', 2500000, 2299999, 'https://via.placeholder.com/300x200?text=100KW+Industrial', 'Industrial Power', 'SKU005', 1, 'Industrial Solutions', ARRAY['upi', 'cod']),
(4, '2HP VFD Solar Pump', 'Energy-efficient 2HP pump with VFD controller', 45000, 39999, 'https://via.placeholder.com/300x200?text=2HP+Pump', 'Agricultural Solution', 'SKU006', 25, 'Featured Products', ARRAY['upi', 'cod']),
(4, '5HP VFD Solar Pump', 'Heavy-duty 5HP pump for large irrigation needs', 85000, 74999, 'https://via.placeholder.com/300x200?text=5HP+Pump', 'Maximum Output', 'SKU007', 12, 'Best Sellers', ARRAY['upi', 'cod']),
(5, '10KW Solar Inverter', 'Pure sine wave 10KW inverter with MPPT control', 120000, 99999, 'https://via.placeholder.com/300x200?text=10KW+Inverter', 'Reliable Conversion', 'SKU008', 20, 'New Arrivals', ARRAY['upi', 'cod']),
(5, '200Ah Lithium Battery Bank', 'High-capacity 200Ah lithium battery system', 450000, 399999, 'https://via.placeholder.com/300x200?text=200Ah+Battery', 'Energy Storage', 'SKU009', 6, 'New Arrivals', ARRAY['upi', 'cod']),
(1, 'Complete 15KW Home System', 'All-in-one 15KW system with battery and inverter', 420000, 379999, 'https://via.placeholder.com/300x200?text=15KW+Complete', 'Full Solution', 'SKU010', 7, 'New Arrivals', ARRAY['upi', 'cod']);

-- Insert Slideshows
INSERT INTO slideshows (title, position, slides, animation_type, slide_duration, ribbon_text) VALUES
(
  'Main Banner',
  1,
  '[
    {"image": "https://via.placeholder.com/1200x300?text=Solar+Energy+Solutions", "title": "Go Solar Today", "subtitle": "Save up to 80% on electricity", "link": "#products", "buttonText": "Shop Now"},
    {"image": "https://via.placeholder.com/1200x300?text=Affordable+Solar", "title": "Affordable Solar", "subtitle": "Starting from ₹45,000", "link": "#products", "buttonText": "Explore"},
    {"image": "https://via.placeholder.com/1200x300?text=Expert+Installation", "title": "Expert Installation", "subtitle": "Professional setup included", "link": "#contact", "buttonText": "Contact Us"}
  ]'::JSONB,
  'fade',
  3500,
  'LIMITED TIME: 15% OFF on all systems'
);

-- Insert Sections
INSERT INTO sections (name, title, description, display_order, position_index) VALUES
('Featured Products', 'Featured Products', 'Our most popular and recommended products', 1, 1),
('Best Sellers', 'Best Sellers', 'Top-rated products loved by customers', 2, 2),
('Commercial Solutions', 'Commercial Solutions', 'Enterprise solar systems for businesses', 3, 3),
('Industrial Solutions', 'Industrial Solutions', 'Heavy-duty industrial installations', 4, 4),
('New Arrivals', 'New Arrivals', 'Latest products and solutions', 5, 5);

-- Insert Section Products (many-to-many mapping)
INSERT INTO section_products (section_id, product_id, display_order) VALUES
(1, 1, 1),
(1, 6, 2),
(1, 8, 3),
(2, 2, 1),
(2, 7, 2),
(3, 3, 1),
(3, 4, 2),
(4, 5, 1),
(5, 9, 1),
(5, 10, 2);

-- Insert Sample Feedbacks
INSERT INTO feedbacks (customer_name, rating, message, product_name, verified) VALUES
('Rajesh Kumar', 5, 'Excellent solar system! My electricity bill has reduced by 75%. Highly recommended!', '5KW Solar Panel System', true),
('Priya Singh', 5, 'Outstanding customer service and quality installation. Very satisfied with the product.', '10KW Solar Panel System', true),
('Amit Patel', 4, 'Great value for money. The system is performing as expected. Good support team.', '2HP VFD Solar Pump', true),
('Sneha Gupta', 5, 'Best investment I made. The ROI is amazing and saves money every month.', 'Complete 15KW Home System', true),
('Vikram Singh', 5, 'Professional installation and excellent after-sales support. Highly satisfied.', '10KW Solar Inverter', true);

-- Insert Payment Settings
INSERT INTO payment_settings (upi_id, upi_enabled, cod_enabled, cod_advance_percent) VALUES
('Sunpowers@ybl', true, true, 15);

-- Insert Admin Settings
INSERT INTO admin_settings (store_name, whatsapp_number, phone, email, address, youtube_links) VALUES
(
  'Sunpowers Online Hub',
  '9621050636',
  '+91-9621-050-636',
  'info@sunpowers.in',
  'Sunpowers Solar Solutions, Industrial Area, Haryana, India',
  ARRAY[
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=jNQXAC9IVRw'
  ]
);
