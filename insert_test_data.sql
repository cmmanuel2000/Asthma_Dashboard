-- Test data for sensor_data table with environmental conditions
-- Copy and paste this entire block into Supabase SQL Editor

INSERT INTO sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_001', 75, 0.98, 0.5, 22.5, 45.0, 'normal', 'safe', 12.5, 0.8, 125),
(gen_random_uuid(), 'device_001', 78, 0.97, 0.6, 23.0, 48.0, 'normal', 'safe', 15.0, 0.9, 150),
(gen_random_uuid(), 'device_001', 82, 0.96, 0.8, 24.5, 52.0, 'normal', 'safe', 18.5, 1.0, 185),
(gen_random_uuid(), 'device_001', 85, 0.95, 1.2, 25.0, 55.0, 'wheeze', 'medium', 22.0, 1.2, 220),
(gen_random_uuid(), 'device_001', 88, 0.94, 1.5, 26.0, 58.0, 'wheeze', 'medium', 25.5, 1.3, 255),
(gen_random_uuid(), 'device_001', 90, 0.93, 1.8, 27.0, 60.0, 'cough', 'high', 28.0, 1.4, 280),
(gen_random_uuid(), 'device_001', 92, 0.91, 2.0, 28.5, 62.0, 'cough', 'high', 32.0, 1.5, 320),
(gen_random_uuid(), 'device_001', 88, 0.92, 1.7, 27.5, 59.0, 'wheeze', 'medium', 30.0, 1.4, 300),
(gen_random_uuid(), 'device_001', 85, 0.94, 1.3, 26.0, 56.0, 'normal', 'medium', 26.0, 1.3, 260),
(gen_random_uuid(), 'device_001', 80, 0.96, 0.9, 24.0, 50.0, 'normal', 'safe', 20.0, 1.1, 200),
(gen_random_uuid(), 'device_001', 76, 0.97, 0.6, 22.0, 47.0, 'normal', 'safe', 16.0, 0.9, 160),
(gen_random_uuid(), 'device_001', 74, 0.98, 0.5, 21.5, 45.0, 'normal', 'safe', 14.0, 0.8, 140),
(gen_random_uuid(), 'device_001', 77, 0.97, 0.7, 20.0, 42.0, 'normal', 'safe', 18.0, 1.0, 180),
(gen_random_uuid(), 'device_001', 79, 0.96, 0.8, 19.0, 40.0, 'normal', 'safe', 16.5, 0.9, 165),
(gen_random_uuid(), 'device_001', 83, 0.95, 1.0, 18.0, 38.0, 'normal', 'medium', 19.0, 1.0, 190),
(gen_random_uuid(), 'device_001', 86, 0.94, 1.3, 17.0, 35.0, 'wheeze', 'medium', 22.5, 1.1, 225),
(gen_random_uuid(), 'device_001', 89, 0.93, 1.6, 16.5, 33.0, 'wheeze', 'high', 26.0, 1.2, 260),
(gen_random_uuid(), 'device_001', 91, 0.91, 1.9, 16.0, 32.0, 'cough', 'high', 30.0, 1.3, 300),
(gen_random_uuid(), 'device_001', 87, 0.93, 1.5, 18.0, 36.0, 'wheeze', 'medium', 24.0, 1.2, 240),
(gen_random_uuid(), 'device_001', 82, 0.95, 1.1, 20.0, 40.0, 'normal', 'safe', 19.0, 1.0, 190),
(gen_random_uuid(), 'device_001', 78, 0.97, 0.7, 22.0, 44.0, 'normal', 'safe', 15.0, 0.9, 150),
(gen_random_uuid(), 'device_001', 75, 0.98, 0.5, 23.0, 46.0, 'normal', 'safe', 13.0, 0.8, 130),
(gen_random_uuid(), 'device_001', 80, 0.96, 0.9, 29.0, 65.0, 'normal', 'medium', 35.0, 1.5, 350),
(gen_random_uuid(), 'device_001', 84, 0.95, 1.2, 30.0, 68.0, 'wheeze', 'medium', 38.0, 1.6, 380),
(gen_random_uuid(), 'device_001', 87, 0.93, 1.5, 31.0, 70.0, 'wheeze', 'high', 42.0, 1.7, 420),
(gen_random_uuid(), 'device_001', 90, 0.92, 1.8, 32.0, 72.0, 'cough', 'high', 45.0, 1.8, 450),
(gen_random_uuid(), 'device_001', 85, 0.94, 1.4, 30.0, 67.0, 'wheeze', 'medium', 40.0, 1.6, 400),
(gen_random_uuid(), 'device_001', 81, 0.96, 1.0, 28.0, 62.0, 'normal', 'safe', 32.0, 1.4, 320),
(gen_random_uuid(), 'device_001', 77, 0.97, 0.7, 25.0, 55.0, 'normal', 'safe', 25.0, 1.2, 250),
(gen_random_uuid(), 'device_001', 74, 0.98, 0.5, 23.0, 48.0, 'normal', 'safe', 18.0, 1.0, 180),
(gen_random_uuid(), 'device_001', 76, 0.97, 0.6, 22.5, 46.0, 'normal', 'safe', 16.0, 0.9, 160),
(gen_random_uuid(), 'device_001', 78, 0.96, 0.8, 22.0, 45.0, 'normal', 'safe', 17.0, 0.9, 170),
(gen_random_uuid(), 'device_001', 82, 0.95, 1.1, 23.0, 47.0, 'normal', 'safe', 20.0, 1.0, 200),
(gen_random_uuid(), 'device_001', 85, 0.94, 1.4, 24.0, 50.0, 'normal', 'safe', 23.0, 1.1, 230),
(gen_random_uuid(), 'device_001', 88, 0.93, 1.7, 25.0, 52.0, 'wheeze', 'medium', 27.0, 1.2, 270),
(gen_random_uuid(), 'device_001', 90, 0.91, 2.0, 26.0, 54.0, 'cough', 'high', 31.0, 1.3, 310),
(gen_random_uuid(), 'device_001', 86, 0.93, 1.6, 25.0, 52.0, 'wheeze', 'medium', 28.0, 1.2, 280),
(gen_random_uuid(), 'device_001', 82, 0.95, 1.2, 24.0, 50.0, 'normal', 'safe', 24.0, 1.1, 240),
(gen_random_uuid(), 'device_001', 78, 0.97, 0.8, 23.0, 48.0, 'normal', 'safe', 19.0, 1.0, 190),
(gen_random_uuid(), 'device_001', 75, 0.98, 0.5, 22.5, 46.0, 'normal', 'safe', 15.0, 0.9, 150),
(gen_random_uuid(), 'device_001', 73, 0.98, 0.4, 22.0, 45.0, 'normal', 'safe', 12.0, 0.8, 120),
(gen_random_uuid(), 'device_001', 76, 0.97, 0.6, 21.5, 44.0, 'normal', 'safe', 14.0, 0.8, 140),
(gen_random_uuid(), 'device_001', 77, 0.97, 0.7, 21.0, 43.0, 'normal', 'safe', 13.5, 0.8, 135),
(gen_random_uuid(), 'device_001', 75, 0.98, 0.5, 21.0, 43.0, 'normal', 'safe', 12.5, 0.8, 125),
(gen_random_uuid(), 'device_001', 74, 0.98, 0.4, 21.0, 42.0, 'normal', 'safe', 11.0, 0.7, 110),
(gen_random_uuid(), 'device_001', 76, 0.97, 0.6, 21.5, 43.0, 'normal', 'safe', 13.0, 0.8, 130),
(gen_random_uuid(), 'device_001', 79, 0.96, 0.8, 22.0, 44.0, 'normal', 'safe', 16.0, 0.9, 160),
(gen_random_uuid(), 'device_001', 81, 0.96, 0.9, 22.5, 46.0, 'normal', 'safe', 18.0, 1.0, 180),
(gen_random_uuid(), 'device_001', 84, 0.95, 1.1, 23.0, 48.0, 'normal', 'safe', 21.0, 1.1, 210),
(gen_random_uuid(), 'device_001', 80, 0.96, 0.9, 22.5, 47.0, 'normal', 'safe', 17.5, 0.9, 175);

-- Verify the data was inserted
SELECT COUNT(*) as total_records FROM sensor_data;

-- Check the latest record
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1;

-- View summary statistics
SELECT 
    prediction_label,
    risk_level,
    COUNT(*) as count,
    ROUND(CAST(AVG(spo2 * 100) AS NUMERIC), 1) as avg_spo2_percent,
    ROUND(CAST(AVG(temperature) AS NUMERIC), 1) as avg_temp,
    ROUND(CAST(AVG(humidity) AS NUMERIC), 1) as avg_humidity,
    ROUND(CAST(AVG(pm25) AS NUMERIC), 1) as avg_pm25
FROM sensor_data
GROUP BY prediction_label, risk_level
ORDER BY risk_level DESC, prediction_label;
