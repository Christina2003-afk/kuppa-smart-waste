import pandas as pd
import numpy as np
import os
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# 1. Generate Realistic Mock Dataset
print("Generating historical waste dataset...")
np.random.seed(42)
num_records = 5000

# Features
# day_of_week: 0 (Mon) to 6 (Sun)
# population_density: scale of 1 to 10 (10 being very dense)
# event_day: 0 (No) or 1 (Yes, e.g. festival/holiday)
# current_fill_level: 0 to 100 percentage
# target -> hours_until_full: How many hours until it hits 100%

days = np.random.randint(0, 7, num_records)
density = np.random.randint(1, 11, num_records)
events = np.random.choice([0, 1], p=[0.9, 0.1], size=num_records)
current_fill = np.random.randint(0, 80, num_records)

# Simulate target variable (Hours until full)
# Logic: 
# High density = fills faster (fewer hours)
# Weekends (5,6) = fills faster
# Event days = fills much faster
# Higher current fill = fewer hours left
base_hours = 48.0
hours_left = base_hours - (current_fill * 0.4) - (density * 1.5) - (np.isin(days, [5,6]) * 5) - (events * 10)
# Add some noise
hours_left = hours_left + np.random.normal(0, 2, num_records)
# Ensure no negative hours
hours_left = np.maximum(0.5, hours_left)

data = pd.DataFrame({
    'day_of_week': days,
    'population_density': density,
    'event_day': events,
    'current_fill_level': current_fill,
    'hours_until_full': hours_left
})

csv_path = 'historical_waste_data.csv'
data.to_csv(csv_path, index=False)
print(f"Dataset saved to {csv_path} with {num_records} records.")

# 2. Train the Machine Learning Model (Random Forest)
print("\nTraining Random Forest Regression Model...")
X = data[['day_of_week', 'population_density', 'event_day', 'current_fill_level']]
y = data['hours_until_full']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 3. Evaluate the model
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
print(f"Model Mean Squared Error: {mse:.2f}")

# 4. Save the Model
model_path = 'bin_fill_predictor_model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model, f)
print(f"Model saved successfully to {model_path}.")
print("\nAI Model Training Complete! This model is now ready for production.")
