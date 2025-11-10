# api/environmental_fusion.py
# Environmental data fusion logic for asthma risk assessment
# Analyzes temperature, humidity, and PM2.5 air quality

import numpy as np
from dataclasses import dataclass
from typing import Dict

# --- Configuration Constants ---
ENV_SENSOR_WEIGHTS: Dict[str, float] = {
    "temperature": 1.0,
    "humidity": 1.5,
    "pm25": 2.0  # Air quality is most important
}
ENV_TOTAL_WEIGHT: float = sum(ENV_SENSOR_WEIGHTS.values())

# --- Thresholds for Environmental Factors ---
TEMPERATURE_THRESHOLDS: Dict[str, float] = {
    "cold_max": 15.0,      # Below 15°C can trigger asthma
    "safe_min": 18.0,      # Comfortable range starts
    "safe_max": 24.0,      # Comfortable range ends
    "hot_min": 28.0        # Above 28°C can trigger asthma
}

HUMIDITY_THRESHOLDS: Dict[str, float] = {
    "dry_max": 30.0,       # Below 30% is too dry
    "safe_min": 40.0,      # Ideal range starts
    "safe_max": 60.0,      # Ideal range ends
    "humid_min": 70.0      # Above 70% is too humid
}

PM25_THRESHOLDS: Dict[str, float] = {
    "good_max": 12.0,      # Good air quality
    "moderate_max": 35.4,  # Moderate air quality
    "unhealthy_min": 35.5  # Unhealthy for sensitive groups
}

# --- Data Structure for Environmental Assessment ---
@dataclass
class EnvironmentalOutput:
    """Environmental risk assessment output."""
    environmental_risk: str
    risk_score: float
    confidence: float
    reasoning: str
    individual_risks: Dict[str, int]
    triggers: list

# --- Classification Functions ---
def classify_temperature(temp_celsius: float) -> int:
    """Classifies temperature into risk level (0=Safe, 1=Medium, 2=High)."""
    if temp_celsius < TEMPERATURE_THRESHOLDS["cold_max"] or temp_celsius > TEMPERATURE_THRESHOLDS["hot_min"]:
        return 2  # High risk - too cold or too hot
    elif temp_celsius < TEMPERATURE_THRESHOLDS["safe_min"] or temp_celsius > TEMPERATURE_THRESHOLDS["safe_max"]:
        return 1  # Medium risk - outside comfort zone
    else:
        return 0  # Safe - comfortable temperature

def classify_humidity(humidity_percent: float) -> int:
    """Classifies humidity into risk level (0=Safe, 1=Medium, 2=High)."""
    if humidity_percent < HUMIDITY_THRESHOLDS["dry_max"] or humidity_percent > HUMIDITY_THRESHOLDS["humid_min"]:
        return 2  # High risk - too dry or too humid
    elif humidity_percent < HUMIDITY_THRESHOLDS["safe_min"] or humidity_percent > HUMIDITY_THRESHOLDS["safe_max"]:
        return 1  # Medium risk - outside ideal range
    else:
        return 0  # Safe - ideal humidity

def classify_pm25(pm25_value: float) -> int:
    """Classifies PM2.5 air quality into risk level (0=Safe, 1=Medium, 2=High)."""
    if pm25_value > PM25_THRESHOLDS["unhealthy_min"]:
        return 2  # High risk - unhealthy air quality
    elif pm25_value > PM25_THRESHOLDS["moderate_max"]:
        return 1  # Medium risk - moderate air quality
    else:
        return 0  # Safe - good air quality

# --- Main Environmental Fusion Logic ---
def environmental_fusion(temperature: float, humidity: float, pm25: float) -> EnvironmentalOutput:
    """
    Calculates environmental asthma risk by analyzing temperature, humidity, and air quality.
    
    Args:
        temperature: Temperature in Celsius
        humidity: Relative humidity in percentage (0-100)
        pm25: PM2.5 particulate matter in µg/m³
    
    Returns:
        EnvironmentalOutput with risk assessment
    """
    # 1. Classify environmental factors into risk categories
    temp_risk = classify_temperature(temperature)
    humidity_risk = classify_humidity(humidity)
    pm25_risk = classify_pm25(pm25)
    
    individual_risks = {
        "temperature": temp_risk,
        "humidity": humidity_risk,
        "pm25": pm25_risk
    }
    
    # 2. Identify specific triggers
    triggers = []
    if temp_risk > 0:
        if temperature < TEMPERATURE_THRESHOLDS["safe_min"]:
            triggers.append(f"Cold temperature ({temperature:.1f}°C)")
        else:
            triggers.append(f"High temperature ({temperature:.1f}°C)")
    
    if humidity_risk > 0:
        if humidity < HUMIDITY_THRESHOLDS["safe_min"]:
            triggers.append(f"Low humidity ({humidity:.1f}%)")
        else:
            triggers.append(f"High humidity ({humidity:.1f}%)")
    
    if pm25_risk > 0:
        triggers.append(f"Poor air quality (PM2.5: {pm25:.1f} µg/m³)")
    
    # 3. Weighted Fusion Calculation
    weighted_sum = (
        (ENV_SENSOR_WEIGHTS["temperature"] * temp_risk) +
        (ENV_SENSOR_WEIGHTS["humidity"] * humidity_risk) +
        (ENV_SENSOR_WEIGHTS["pm25"] * pm25_risk)
    )
    risk_score = weighted_sum / ENV_TOTAL_WEIGHT
    
    # 4. Determine final environmental risk category
    if risk_score >= 1.5:
        environmental_risk = "HIGH"
    elif risk_score >= 0.75:
        environmental_risk = "MEDIUM"
    else:
        environmental_risk = "SAFE"
    
    # 5. Calculate confidence based on agreement between factors
    std_dev = np.std(list(individual_risks.values()))
    confidence = max(0.5, 1.0 - (std_dev * 0.4))
    
    # 6. Generate reasoning
    if triggers:
        reasoning = f"Environmental triggers detected: {', '.join(triggers)}. Risk score: {risk_score:.2f}"
    else:
        reasoning = f"Environmental conditions are favorable. Risk score: {risk_score:.2f}"
    
    return EnvironmentalOutput(
        environmental_risk=environmental_risk,
        risk_score=risk_score,
        confidence=confidence,
        reasoning=reasoning,
        individual_risks=individual_risks,
        triggers=triggers
    )

# --- Helper function to get environmental data from database ---
def get_environmental_data_from_record(record: dict) -> dict:
    """
    Extract environmental data from a sensor data record.
    
    Args:
        record: Database record from sensor_data table
    
    Returns:
        Dictionary with temperature, humidity, and pm25 values
    """
    return {
        "temperature": record.get("temperature"),
        "humidity": record.get("humidity"),
        "pm25": record.get("pm25")
    }
