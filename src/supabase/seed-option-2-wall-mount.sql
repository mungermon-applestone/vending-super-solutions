
-- This is a seed script that you can run in the Supabase SQL Editor
-- It adds the Option-2 Wall Mount machine to the database

-- Insert machine data
INSERT INTO public.machines (slug, title, type, temperature, description)
VALUES (
  'option-2-wall-mount',
  'Option-2, Wall Mount',
  'vending',
  'ambient',
  'Space-efficient wall-mounted vending machine for standard applications where floor space is limited. Perfect for hallways, waiting areas, and other tight spaces.'
);

-- Get the inserted machine ID
DO $$
DECLARE
  machine_id UUID;
BEGIN
  SELECT id INTO machine_id FROM public.machines WHERE slug = 'option-2-wall-mount';
  
  -- Insert machine images
  INSERT INTO public.machine_images (machine_id, url, alt, display_order)
  VALUES 
    (machine_id, 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394', 'Option-2 Wall Mount - Front View', 1),
    (machine_id, 'https://images.unsplash.com/photo-1627395637580-988089c61818', 'Option-2 Wall Mount - Side View', 2);
  
  -- Insert machine specs
  INSERT INTO public.machine_specs (machine_id, key, value)
  VALUES 
    (machine_id, 'dimensions', '48"H x 36"W x 18"D'),
    (machine_id, 'weight', '350 lbs (empty)'),
    (machine_id, 'capacity', 'Up to 180 items depending on configuration'),
    (machine_id, 'powerRequirements', '110V, 3 amps'),
    (machine_id, 'temperature', 'Ambient (room temperature)'),
    (machine_id, 'connectivity', 'WiFi, Ethernet, Cellular (optional)'),
    (machine_id, 'paymentOptions', 'Credit card, mobile payment, cash (optional)'),
    (machine_id, 'screen', '10" Touchscreen Display'),
    (machine_id, 'manufacturer', 'VendTech Solutions'),
    (machine_id, 'priceRange', '$5,500 - $8,500 (purchase) or leasing options available');
  
  -- Insert machine features
  INSERT INTO public.machine_features (machine_id, feature, display_order)
  VALUES 
    (machine_id, 'Compact wall-mounted design', 1),
    (machine_id, 'Saves valuable floor space', 2),
    (machine_id, 'Remote monitoring and diagnostics', 3),
    (machine_id, 'Custom branding options', 4),
    (machine_id, 'Adjustable shelving for different product sizes', 5),
    (machine_id, 'Energy-efficient LED lighting', 6),
    (machine_id, 'High-security locking system', 7);
  
  -- Insert deployment examples
  INSERT INTO public.deployment_examples (machine_id, title, description, image_url, image_alt, display_order)
  VALUES 
    (machine_id, 'Hotel Hallway', 'Providing guest conveniences without taking up valuable floor space', 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e', 'Hotel hallway deployment', 1),
    (machine_id, 'Office Break Room', 'Mounted in smaller break areas where floor space is at a premium', 'https://images.unsplash.com/photo-1497215842964-222b430dc094', 'Office break room deployment', 2);
END $$;
