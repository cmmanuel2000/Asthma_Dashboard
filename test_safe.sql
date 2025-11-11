-- SAFE RISK TEST - Single Record
-- Perfect conditions, normal breathing
-- Copy and paste into Supabase SQL Editor

INSERT INTO sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_001', 75, 0.98, 0.4, 22.5, 48.0, 'normal', 'safe', 10.0, 0.7, 100);

-- Verify it was inserted
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1;
