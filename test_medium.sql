-- MEDIUM RISK TEST - Single Record
-- Wheeze detected with borderline conditions
-- Copy and paste into Supabase SQL Editor

INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_001', 88, 0.94, 1.4, 27.0, 61.0, 'wheeze', 'medium', 25.0, 1.2, 250);

-- Verify it was inserted
SELECT * FROM s3_sensor_data ORDER BY created_at DESC LIMIT 1;
