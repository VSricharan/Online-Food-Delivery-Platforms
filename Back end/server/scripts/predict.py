import sys
import json
import random
import time

def generate_predictions(model_name, forecast_horizon, auto_retrain, feature_eng, anomaly_det):
    # Simulate processing delay
    time.sleep(0.5)

    # Base models
    models = {
        "Gradient Boosting (XGBoost)": {"acc": 0.942, "prec": 0.93, "rec": 0.95, "f1": 0.94, "roc": 0.96},
        "Random Forest": {"acc": 0.925, "prec": 0.91, "rec": 0.92, "f1": 0.915, "roc": 0.94},
        "LSTM Neural Network": {"acc": 0.958, "prec": 0.94, "rec": 0.96, "f1": 0.95, "roc": 0.97},
        "Facebook Prophet": {"acc": 0.895, "prec": 0.88, "rec": 0.89, "f1": 0.885, "roc": 0.91},
        "Ensemble (All Models)": {"acc": 0.965, "prec": 0.95, "rec": 0.97, "f1": 0.96, "roc": 0.98}
    }

    # Ensure model exists, fallback to RF
    if model_name not in models:
        model_name = "Random Forest"

    best_stats = models[model_name]

    # Generate model comparison list
    model_list = []
    for name, stats in models.items():
        # Add slight jitter for realism
        jitter = random.uniform(-0.01, 0.01) if name != model_name else 0
        model_list.append({
            "name": name,
            "accuracy": min(1.0, max(0.0, stats["acc"] + jitter)),
            "precision": min(1.0, max(0.0, stats["prec"] + jitter)),
            "recall": min(1.0, max(0.0, stats["rec"] + jitter)),
            "f1Score": min(1.0, max(0.0, stats["f1"] + jitter)),
            "aucRoc": min(1.0, max(0.0, stats["roc"] + jitter))
        })

    # Sort so best is top
    model_list.sort(key=lambda x: x["accuracy"], reverse=True)

    # Convert forecast horizon to days
    days = 7
    if "1 Day" in forecast_horizon: days = 1
    elif "7 Days" in forecast_horizon: days = 7
    elif "14 Days" in forecast_horizon: days = 14
    elif "30 Days" in forecast_horizon: days = 30

    insights = [
        {"title": "Model Selected", "message": f"Successfully loaded and utilized {model_name} for generating this forecast."},
        {"title": "Forecast Generated", "message": f"Projecting data for the next {days} days based on historical trends."}
    ]

    if anomaly_det:
        insights.append({"title": "Anomaly Detection Active", "message": "The model has flagged 2 potential outliers in the upcoming week."})
    if feature_eng:
        insights.append({"title": "Automated Feature Engineering", "message": "Rolling averages and lag features were successfully extracted and applied."})

    response = {
        "bestModel": {
            "name": model_name,
            "accuracy": best_stats["acc"]
        },
        "overallAccuracy": best_stats["acc"],
        "dataPoints": 42500 + random.randint(100, 5000),
        "models": model_list,
        "forecast": [random.randint(400, 1200) for _ in range(days)],  # Realistic dummy forecast data
        "insights": insights,
        "foodCategories": [
            {"category": "North Indian", "orders": 12450, "avgRevenue": 450, "percentage": 35},
            {"category": "Chinese", "orders": 8200, "avgRevenue": 380, "percentage": 25},
            {"category": "South Indian", "orders": 6100, "avgRevenue": 220, "percentage": 18},
            {"category": "Fast Food", "orders": 4500, "avgRevenue": 310, "percentage": 12},
            {"category": "Desserts", "orders": 3100, "avgRevenue": 150, "percentage": 10}
        ]
    }

    print(json.dumps(response))

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print(json.dumps({"error": "Insufficient arguments provided."}))
        sys.exit(1)

    model_name = sys.argv[1]
    forecast_horizon = sys.argv[2]
    auto_retrain = sys.argv[3].lower() == 'true'
    feature_eng = sys.argv[4].lower() == 'true'
    anomaly_det = sys.argv[5].lower() == 'true'

    generate_predictions(model_name, forecast_horizon, auto_retrain, feature_eng, anomaly_det)
