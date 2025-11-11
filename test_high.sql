-- HIGH RISK TEST - Single Record
-- Severe cough with critical SpO2 and dangerous conditions
-- Copy and paste into Supabase SQL Editor

INSERT INTO sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_001', 120, 0.85, 3.5, 35.0, 82.0, 'cough', 'high', 65.0, 2.3, 650);

-- Verify it was inserted
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1;
