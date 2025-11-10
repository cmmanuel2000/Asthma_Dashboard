# api/index.py

import traceback
import sys
import os

try:
    from flask import Flask, request, jsonify
    # CORRECTED IMPORT: Look for fusion_logic in the same (api) directory
    from .fusion_logic import hybrid_fusion, FusionOutput
    from .environmental_fusion import environmental_fusion, EnvironmentalOutput
    from dataclasses import asdict
    import time
    from supabase import create_client, Client
    print("INFO: All libraries imported successfully.")
except Exception:
    print("FATAL: A required library is missing. Check requirements.txt.", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)

app = Flask(__name__)

# Initialize Supabase client from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: SUPABASE_URL and SUPABASE_KEY environment variables not set!", file=sys.stderr)
    print("Please set them in your .env file or environment", file=sys.stderr)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

def get_latest_sensor_data_from_supabase():
    """Fetch the latest sensor data from Supabase sensor_data table."""
    try:
        if not supabase:
            print("ERROR: Supabase client not initialized", file=sys.stderr)
            return None
            
        print("-> Fetching latest data from Supabase...")
        # Get the most recent record ordered by created_at
        response = supabase.table("sensor_data")\
            .select("*")\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
        
        if not response.data or len(response.data) == 0:
            print("WARNING: No data found in Supabase")
            return None
        
        latest_record = response.data[0]
        print(f"-> Latest record: {latest_record['id']} at {latest_record['created_at']}")
        
        # Map the database columns to the expected format for physiological fusion logic
        # Determine audio risk level from prediction_label
        prediction_label = latest_record.get("prediction_label", "normal")
        if prediction_label == "cough":
            audio_risk_level = 2  # High risk for cough
        elif prediction_label == "wheeze":
            audio_risk_level = 1  # Medium risk for wheeze
        else:
            audio_risk_level = 0  # Safe for normal
        
        # Convert spo2 value (currently in decimal 0-1 range) to percentage
        spo2_raw = latest_record.get("spo2", 0)
        spo2_percent = spo2_raw * 100 if spo2_raw and spo2_raw < 1 else (spo2_raw if spo2_raw else 95.0)
        
        # Calculate breathing rate from accel_mag (this is a simplified estimation)
        # You may need to adjust this based on your actual sensor logic
        accel_mag = latest_record.get("accel_mag", 0)
        breathing_rate_bpm = 30 + (accel_mag * 5) if accel_mag else 30
        
        sensor_data = {
            "audio_risk_level": audio_risk_level,
            "spo2_percent": spo2_percent,
            "breathing_rate_bpm": breathing_rate_bpm,
            "temperature": latest_record.get("temperature"),
            "humidity": latest_record.get("humidity"),
            "pm25": latest_record.get("pm25"),
            "raw_data": latest_record  # Include original data for reference
        }
        
        print(f"-> Processed data - Audio risk: {audio_risk_level}, SpO2: {spo2_percent:.1f}%, Breathing: {breathing_rate_bpm:.1f} bpm")
        
        return sensor_data
    except Exception as e:
        print(f"ERROR: Failed to fetch data from Supabase: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return None

def save_assessment_to_supabase(result: FusionOutput, inputs: dict):
    """Save the fusion assessment result to Supabase."""
    try:
        print(f"-> Saving assessment to Supabase...")
        # You can create a separate table for assessments or update the sensor_data table
        # For now, we'll just log it
        print(f"   Risk: {result.final_risk}, Score: {result.risk_score:.2f}, Confidence: {result.confidence:.2f}")
        print(f"   Reasoning: {result.reasoning}")
        # TODO: Implement actual saving to a separate assessments table if needed
        return True
    except Exception as e:
        print(f"ERROR: Failed to save assessment: {str(e)}", file=sys.stderr)
        return False

@app.route('/api/assess-risk', methods=['POST'])
def assess_risk_endpoint():
    try:
        print("\nReceived new request to /api/assess-risk")
        sensor_data = get_latest_sensor_data_from_supabase()
        
        if sensor_data is None:
            return jsonify({"error": "No sensor data available in database"}), 404
        
        audio_risk = sensor_data.get("audio_risk_level")
        spo2_value = sensor_data.get("spo2_percent")
        bpm = sensor_data.get("breathing_rate_bpm")

        if any(v is None for v in [audio_risk, spo2_value, bpm]):
            return jsonify({"error": "Missing required sensor data"}), 400

        fusion_result = hybrid_fusion(audio_risk, spo2_value, bpm)
        raw_inputs = {'spo2': spo2_value, 'bpm': bpm, 'audio_risk': audio_risk}
        save_assessment_to_supabase(fusion_result, raw_inputs)
        
        # Include raw sensor data in response for debugging
        response_data = asdict(fusion_result)
        response_data['sensor_inputs'] = raw_inputs
        
        return jsonify(response_data), 200
    except Exception:
        print("--- RUNTIME ERROR CAUGHT ---", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        print("--------------------------", file=sys.stderr)
        return jsonify({"error": "A server error occurred. Check Vercel logs."}), 500

@app.route('/api/assess-environmental', methods=['POST'])
def assess_environmental_endpoint():
    try:
        print("\nReceived new request to /api/assess-environmental")
        sensor_data = get_latest_sensor_data_from_supabase()
        
        if sensor_data is None:
            return jsonify({"error": "No sensor data available in database"}), 404
        
        temperature = sensor_data.get("temperature")
        humidity = sensor_data.get("humidity")
        pm25 = sensor_data.get("pm25")
        
        # Check if environmental data is available
        if all(v is None for v in [temperature, humidity, pm25]):
            return jsonify({
                "error": "No environmental data available",
                "message": "Temperature, humidity, and PM2.5 data are all missing"
            }), 404
        
        # Use default values for missing data
        temperature = temperature if temperature is not None else 22.0  # Default comfortable temp
        humidity = humidity if humidity is not None else 50.0  # Default comfortable humidity
        pm25 = pm25 if pm25 is not None else 10.0  # Default good air quality
        
        env_result = environmental_fusion(temperature, humidity, pm25)
        env_inputs = {'temperature': temperature, 'humidity': humidity, 'pm25': pm25}
        
        # Include environmental data in response
        response_data = asdict(env_result)
        response_data['environmental_inputs'] = env_inputs
        
        return jsonify(response_data), 200
    except Exception:
        print("--- RUNTIME ERROR CAUGHT ---", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        print("--------------------------", file=sys.stderr)
        return jsonify({"error": "A server error occurred. Check Vercel logs."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
