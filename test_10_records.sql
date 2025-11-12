-- 10 TEST RECORDS - Various Risk Levels
-- Copy and paste into Supabase SQL Editor
-- Mix of safe, medium, and high risk scenarios

-- Record 1: SAFE - Perfect conditions, outdoor environment
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_002', 72, 0.99, 0.3, 20.0, 45.0, 'normal', 'safe', 8.0, 0.6, 80);

-- Record 2: MEDIUM - Slight wheeze, borderline conditions
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_003', 85, 0.95, 1.2, 26.0, 58.0, 'wheeze', 'medium', 22.0, 1.1, 220);

-- Record 3: SAFE - Cool room, excellent vitals
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_004', 68, 0.98, 0.5, 21.5, 50.0, 'normal', 'safe', 12.0, 0.8, 120);

-- Record 4: HIGH - Severe cough, poor air quality
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_005', 115, 0.88, 3.2, 32.0, 78.0, 'cough', 'high', 55.0, 2.1, 550);

-- Record 5: MEDIUM - Elevated breathing, high humidity
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_006', 90, 0.93, 1.8, 28.5, 65.0, 'wheeze', 'medium', 28.0, 1.5, 280);

-- Record 6: HIGH - Critical SpO2, extreme heat
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_007', 125, 0.84, 3.8, 36.0, 85.0, 'cough', 'high', 70.0, 2.5, 700);

-- Record 7: SAFE - Night time, calm breathing
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_008', 65, 0.97, 0.2, 19.5, 42.0, 'normal', 'safe', 9.0, 0.5, 90);

-- Record 8: MEDIUM - Morning activity, mild wheeze
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_009', 88, 0.96, 1.3, 24.0, 55.0, 'wheeze', 'medium', 20.0, 1.0, 200);

-- Record 9: HIGH - Exercise-induced symptoms
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_010', 118, 0.86, 3.5, 30.0, 72.0, 'cough', 'high', 60.0, 2.2, 600);

-- Record 10: SAFE - Optimal indoor environment
INSERT INTO s3_sensor_data (id, device_id, heart_rate, spo2, accel_mag, temperature, humidity, prediction_label, risk_level, pm25, pm25_density, pm25_raw) VALUES
(gen_random_uuid(), 'device_011', 70, 0.99, 0.4, 22.0, 47.0, 'normal', 'safe', 7.0, 0.5, 70);

-- Verify all records were inserted
SELECT device_id, heart_rate, spo2, prediction_label, risk_level, temperature, pm25, created_at 
FROM s3_sensor_data 
WHERE device_id IN ('device_002', 'device_003', 'device_004', 'device_005', 'device_006', 'device_007', 'device_008', 'device_009', 'device_010', 'device_011')
ORDER BY created_at DESC;
