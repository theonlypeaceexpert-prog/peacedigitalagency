CREATE POLICY "public can read review avatars"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'review-avatars');

CREATE POLICY "anyone can upload a review avatar"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'review-avatars');

INSERT INTO public.reviews (name, email, country, country_code, rating, body, service, price, duration, repeat_client, is_sample, status, created_at) VALUES
('Sarah Mitchell', NULL, 'United States', 'US', 5, 'Peace rebuilt our Shopify store from the ground up. The layout, speed and product pages are on another level — our customers actually finish checkout now. Communication was clear the entire way through.', 'Shopify Store Optimization', '$320', '2 weeks', true, true, 'approved', now() - interval '18 days'),
('Daniel Okafor', NULL, 'United Kingdom', 'GB', 5, 'We were struggling with a slow, clunky site. After the performance work our pages load almost instantly and mobile finally feels smooth. Worth every penny.', 'Website Performance Optimization', '$250', '9 days', false, true, 'approved', now() - interval '32 days'),
('Amelia Brooks', NULL, 'Australia', 'AU', 5, 'The SEO and product page work brought our listings back into search. Peace explained everything in plain English and stuck to the timeline.', 'SEO & Product Optimization', '$300', '3 weeks', true, true, 'approved', now() - interval '47 days'),
('Lucas Meyer', NULL, 'Germany', 'DE', 4, 'Strong creative on our Meta and Instagram campaigns and a much cleaner account structure. Reporting could have started a little earlier, but the results speak.', 'Facebook & Instagram Ads', '$280', '1 month', false, true, 'approved', now() - interval '61 days'),
('Grace van Dijk', NULL, 'Netherlands', 'NL', 5, 'Our new store design finally matches the quality of our products. Beautiful, fast, and easy for our team to manage. We have already booked a second project.', 'eCommerce Website Design', '$350', '3 weeks', true, true, 'approved', now() - interval '76 days');