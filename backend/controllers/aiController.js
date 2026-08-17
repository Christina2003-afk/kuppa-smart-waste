// Exported weights from Google Colab Linear Regression Model
// This simulates our trained AI model natively in Node.js
const bias = 1.0500;
const weights = {
  'temperature_celsius': 0.4950,
  'humidity_percent': 0.0010,
  'hour_of_day': 0.0500,
  'is_weekend': 14.8000,
  'previous_fill_level': 1.0000,
};

exports.predictFillLevel = async (req, res) => {
  try {
    const { temperature, humidity, hourOfDay, isWeekend, previousFillLevel } = req.body;

    // Validate inputs
    if (temperature === undefined || previousFillLevel === undefined) {
      return res.status(400).json({ message: 'Missing required features for prediction' });
    }

    // Apply the Machine Learning model formula
    let prediction = bias 
      + (temperature * weights['temperature_celsius'])
      + ((humidity || 50) * weights['humidity_percent'])
      + ((hourOfDay || new Date().getHours()) * weights['hour_of_day'])
      + ((isWeekend ? 1 : 0) * weights['is_weekend'])
      + (previousFillLevel * weights['previous_fill_level']);

    // Add time-based sinusoidal feature (matching the Colab logic)
    prediction += (Math.sin((hourOfDay || new Date().getHours()) / 24 * 2 * Math.PI) * 10);

    // Clamp between 0 and 100
    prediction = Math.max(0, Math.min(100, prediction));

    res.json({
      predictedFillLevel: Math.round(prediction),
      confidence: 0.92, // Simulated model confidence
      featuresUsed: {
        temperature,
        humidity: humidity || 50,
        hourOfDay: hourOfDay || new Date().getHours(),
        isWeekend: isWeekend || false,
        previousFillLevel
      }
    });

  } catch (error) {
    console.error("AI Prediction Error:", error);
    res.status(500).json({ message: 'Error running AI prediction', error });
  }
};
