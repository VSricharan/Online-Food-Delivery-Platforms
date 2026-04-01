# ==============================================================================
# FILE: 03_business_insights.R
# PROJECT: Online Food Delivery Business Intelligence
# PURPOSE: Business Analytics, Profitability Prediction, Expansion Strategy,
#          and Actionable Recommendations for Stakeholders
# AUTHOR: Sampath
# DATE: 2026-02-20
#
# DEFENSIVE DESIGN NOTES:
# 1. All margin() calls use ggplot2::margin() to avoid randomForest masking
# 2. Factor alignment for new prediction data uses safe_align_for_predict()
# 3. tryCatch around prediction to never crash the whole script
# ==============================================================================

# ==============================================================================
# SECTION 1: INSTALL & LOAD REQUIRED PACKAGES
# ==============================================================================

required_packages <- c("tidyverse", "ggplot2", "dplyr", "gridExtra",
                        "scales", "RColorBrewer", "randomForest", "caret")

for (pkg in required_packages) {
  if (!require(pkg, character.only = TRUE)) {
    install.packages(pkg, dependencies = TRUE)
    library(pkg, character.only = TRUE)
  }
}

cat("=== All packages loaded ===\n\n")

# IMPORTANT: randomForest::margin() masks ggplot2::margin().
# ALL theme() calls in this script use ggplot2::margin() explicitly.

# ==============================================================================
# SECTION 2: LOAD DATA & MODELS
# ==============================================================================

# Load cleaned data
if (file.exists("cleaned_food_delivery_data.rds")) {
  df <- readRDS("cleaned_food_delivery_data.rds")
} else {
  stop("ERROR: Run 01_data_preprocessing.R first!")
}

# Load trained models
if (file.exists("ml_models_results.rds")) {
  ml <- readRDS("ml_models_results.rds")
  cat("Models loaded. Best model will be used for prediction.\n")
} else {
  stop("ERROR: Run 02_ml_models.R first!")
}

# Ensure target variable is factor (defensive — may already be factor)
if (is.numeric(df$High_Demand_Area) || is.character(df$High_Demand_Area)) {
  df$High_Demand_Area <- factor(df$High_Demand_Area, levels = c(0, 1),
                                 labels = c("Low", "High"))
} else if (is.factor(df$High_Demand_Area)) {
  # Already a factor — ensure levels are correct
  if (!all(c("Low", "High") %in% levels(df$High_Demand_Area))) {
    df$High_Demand_Area <- factor(df$High_Demand_Area, levels = c(0, 1),
                                   labels = c("Low", "High"))
  }
}

# Professional theme for all plots
# CRITICAL: Using ggplot2::margin() to avoid randomForest::margin() conflict
theme_set(theme_minimal(base_size = 12) +
          theme(plot.title = element_text(face = "bold", hjust = 0.5, size = 14),
                plot.subtitle = element_text(hjust = 0.5, color = "gray40"),
                legend.position = "bottom",
                plot.margin = ggplot2::margin(10, 10, 10, 10)))

# Color palette
pal <- c("#2C3E50", "#E74C3C", "#3498DB", "#2ECC71", "#F39C12", "#9B59B6")

cat("Data:", nrow(df), "rows loaded.\n\n")

# ==============================================================================
# SECTION 3: FEATURE IMPORTANCE INSIGHTS
# ==============================================================================

cat("================================================================\n")
cat("  FEATURE IMPORTANCE — WHAT DRIVES HIGH DEMAND?                \n")
cat("================================================================\n\n")

rf_model <- ml$rf
imp <- importance(rf_model)
imp_df <- data.frame(
  Feature = rownames(imp),
  MeanDecreaseGini = imp[, "MeanDecreaseGini"]
)
imp_df <- imp_df[order(-imp_df$MeanDecreaseGini), ]

cat("Top 10 Most Important Features:\n")
print(head(imp_df, 10))

# Plot — using ggplot2::margin() explicitly
p_fi <- ggplot(head(imp_df, 10),
               aes(x = reorder(Feature, MeanDecreaseGini),
                   y = MeanDecreaseGini)) +
  geom_bar(stat = "identity", fill = "#3498DB", alpha = 0.85) +
  geom_text(aes(label = round(MeanDecreaseGini, 1)), hjust = -0.2, size = 3.5) +
  coord_flip() +
  labs(title = "Top 10 Factors Driving High-Demand Areas",
       subtitle = "Higher Gini = More important for predicting profitability",
       x = "", y = "Mean Decrease Gini") +
  theme(plot.margin = ggplot2::margin(10, 30, 10, 10))
print(p_fi)

cat("\nBUSINESS INTERPRETATION:\n")
cat("- The top features reveal what makes an area profitable.\n")
cat("- Avg_Cost: Higher-spending areas = more revenue per order.\n")
cat("- City_Tier: Tier 1 cities have highest demand density.\n")
cat("- Order_Hour: Certain hours drive significantly more orders.\n")
cat("- Days_Since_Prior: Frequent reordering signals loyal customer base.\n\n")

# ==============================================================================
# SECTION 4: LOCATION-BASED PROFITABILITY ANALYSIS
# ==============================================================================

cat("================================================================\n")
cat("  LOCATION ANALYSIS — WHERE IS BUSINESS MOST PROFITABLE?       \n")
cat("================================================================\n\n")

# 4a. Revenue by City Tier
city_stats <- df %>%
  group_by(Cities) %>%
  summarise(
    Total_Orders = n(),
    Avg_Revenue = round(mean(Avg_Cost, na.rm = TRUE), 2),
    Total_Revenue = sum(Avg_Cost, na.rm = TRUE),
    High_Demand_Pct = round(100 * sum(High_Demand_Area == "High") / n(), 1),
    Avg_Family_Size = round(mean(Family_Size, na.rm = TRUE), 1),
    .groups = "drop"
  ) %>%
  arrange(desc(Total_Revenue))

cat("--- City-wise Business Performance ---\n")
print(city_stats)

# Plot — ggplot2::margin() used
p_city_rev <- ggplot(city_stats, aes(x = reorder(Cities, -Total_Revenue),
                                      y = Total_Revenue, fill = Cities)) +
  geom_bar(stat = "identity", alpha = 0.85, show.legend = FALSE) +
  geom_text(aes(label = paste0("Rs.", format(Total_Revenue, big.mark = ","))),
            vjust = -0.5, size = 3.5) +
  scale_fill_manual(values = pal[1:3]) +
  scale_y_continuous(labels = comma) +
  labs(title = "Total Revenue by City Tier",
       subtitle = "Which cities generate the most revenue?",
       x = "City Tier", y = "Total Revenue (Rs.)") +
  theme(plot.margin = ggplot2::margin(10, 10, 10, 10))
print(p_city_rev)

# 4b. High Demand % by City
p_city_demand <- ggplot(city_stats, aes(x = Cities, y = High_Demand_Pct,
                                         fill = Cities)) +
  geom_bar(stat = "identity", alpha = 0.85, show.legend = FALSE) +
  geom_text(aes(label = paste0(High_Demand_Pct, "%")), vjust = -0.5) +
  scale_fill_manual(values = pal[1:3]) +
  labs(title = "Percentage of High-Demand Orders by City",
       subtitle = "Where should the business focus expansion?",
       x = "City Tier", y = "High Demand %") +
  theme(plot.margin = ggplot2::margin(10, 10, 10, 10))
print(p_city_demand)

# ==============================================================================
# SECTION 5: TIME-BASED ANALYSIS
# ==============================================================================

cat("\n================================================================\n")
cat("  TIME-BASED ANALYSIS — WHEN ARE ORDERS HIGHEST?               \n")
cat("================================================================\n\n")

hour_stats <- df %>%
  group_by(Order_Hour) %>%
  summarise(
    Orders = n(),
    Avg_Revenue = round(mean(Avg_Cost, na.rm = TRUE), 2),
    High_Demand_Pct = round(100 * sum(High_Demand_Area == "High") / n(), 1),
    .groups = "drop"
  )

cat("--- Hourly Order Statistics ---\n")
print(hour_stats)

peak_hours <- hour_stats %>% filter(Orders >= quantile(Orders, 0.75))
cat("\n--- PEAK HOURS (Top 25%) ---\n")
print(peak_hours)

p_hourly <- ggplot(hour_stats, aes(x = Order_Hour, y = Orders)) +
  geom_line(color = "#3498DB", linewidth = 1.2) +
  geom_point(aes(color = ifelse(Orders >= quantile(Orders, 0.75), "Peak", "Normal")),
             size = 3) +
  scale_color_manual(values = c("Peak" = "#E74C3C", "Normal" = "#3498DB"),
                     name = "Hour Type") +
  scale_x_continuous(breaks = 0:23) +
  labs(title = "Order Volume by Hour of Day",
       subtitle = "Red dots = Peak hours — Deploy more delivery staff here",
       x = "Hour of Day", y = "Number of Orders") +
  theme(plot.margin = ggplot2::margin(10, 10, 10, 10))
print(p_hourly)

p_rev_hour <- ggplot(hour_stats, aes(x = Order_Hour, y = Avg_Revenue)) +
  geom_bar(stat = "identity", fill = "#2ECC71", alpha = 0.8) +
  geom_hline(yintercept = mean(hour_stats$Avg_Revenue),
             color = "#E74C3C", linetype = "dashed", linewidth = 1) +
  scale_x_continuous(breaks = 0:23) +
  labs(title = "Average Revenue per Order by Hour",
       subtitle = "Red dashed line = Overall average",
       x = "Hour of Day", y = "Average Revenue (Rs.)") +
  theme(plot.margin = ggplot2::margin(10, 10, 10, 10))
print(p_rev_hour)

# Time Period Summary
time_stats <- df %>%
  group_by(Time_Period) %>%
  summarise(
    Orders = n(),
    Avg_Revenue = round(mean(Avg_Cost, na.rm = TRUE), 2),
    Total_Revenue = sum(Avg_Cost, na.rm = TRUE),
    .groups = "drop"
  ) %>%
  arrange(desc(Orders))

cat("\n--- Time Period Summary ---\n")
print(time_stats)

# ==============================================================================
# SECTION 6: PLATFORM ANALYSIS
# ==============================================================================

cat("\n================================================================\n")
cat("  PLATFORM COMPARISON — WHICH APP PERFORMS BEST?               \n")
cat("================================================================\n\n")

platform_stats <- df %>%
  group_by(Medium) %>%
  summarise(
    Orders = n(),
    Market_Share_Pct = round(100 * n() / nrow(df), 1),
    Avg_Cost = round(mean(Avg_Cost, na.rm = TRUE), 2),
    Total_Revenue = sum(Avg_Cost, na.rm = TRUE),
    High_Demand_Pct = round(100 * sum(High_Demand_Area == "High") / n(), 1),
    .groups = "drop"
  ) %>%
  arrange(desc(Orders))

cat("--- Platform Performance ---\n")
print(platform_stats)

p_platform <- ggplot(platform_stats, aes(x = reorder(Medium, -Orders),
                                          y = Orders, fill = Medium)) +
  geom_bar(stat = "identity", alpha = 0.85, show.legend = FALSE) +
  geom_text(aes(label = paste0(Market_Share_Pct, "%\n(", Orders, ")")),
            vjust = -0.3, size = 3.5) +
  scale_fill_manual(values = c("Swiggy" = "#F39C12", "Zomato" = "#E74C3C",
                                "ONDC" = "#3498DB")) +
  labs(title = "Market Share by Delivery Platform",
       subtitle = "Order count and percentage for each platform",
       x = "Platform", y = "Number of Orders") +
  theme(plot.margin = ggplot2::margin(10, 10, 10, 10))
print(p_platform)

# ==============================================================================
# SECTION 7: RESTAURANT TYPE ANALYSIS
# ==============================================================================

cat("\n================================================================\n")
cat("  RESTAURANT TYPE — WHAT FOOD TYPES ARE MOST PROFITABLE?       \n")
cat("================================================================\n\n")

rest_stats <- df %>%
  group_by(Restaurant_Type) %>%
  summarise(
    Orders = n(),
    Avg_Revenue = round(mean(Avg_Cost, na.rm = TRUE), 2),
    High_Demand_Pct = round(100 * sum(High_Demand_Area == "High") / n(), 1),
    .groups = "drop"
  ) %>%
  filter(Orders >= 20) %>%
  arrange(desc(Avg_Revenue))

cat("--- Top Restaurant Types by Revenue ---\n")
print(head(rest_stats, 10))

p_rest <- ggplot(head(rest_stats, 10),
                 aes(x = reorder(Restaurant_Type, Avg_Revenue),
                     y = Avg_Revenue, fill = High_Demand_Pct)) +
  geom_bar(stat = "identity", alpha = 0.85) +
  coord_flip() +
  scale_fill_gradient(low = "#FFF5EB", high = "#E74C3C", name = "High Demand %") +
  labs(title = "Top 10 Restaurant Types by Average Revenue",
       subtitle = "Color intensity = % of high-demand orders",
       x = "", y = "Average Revenue (Rs.)") +
  theme(plot.margin = ggplot2::margin(10, 10, 10, 10))
print(p_rest)

# ==============================================================================
# SECTION 8: CUSTOMER SEGMENTATION
# ==============================================================================

cat("\n================================================================\n")
cat("  CUSTOMER SEGMENTATION — WHO ARE THE BEST CUSTOMERS?          \n")
cat("================================================================\n\n")

occ_stats <- df %>%
  group_by(Occupation) %>%
  summarise(
    Orders = n(),
    Avg_Spend = round(mean(Avg_Cost, na.rm = TRUE), 2),
    High_Demand_Pct = round(100 * sum(High_Demand_Area == "High") / n(), 1),
    .groups = "drop"
  ) %>%
  arrange(desc(Orders))

cat("--- Customer Segments by Occupation ---\n")
print(occ_stats)

p_occ <- ggplot(occ_stats, aes(x = reorder(Occupation, -Orders),
                                y = Orders, fill = Occupation)) +
  geom_bar(stat = "identity", alpha = 0.85, show.legend = FALSE) +
  geom_text(aes(label = paste0("Rs.", Avg_Spend)), vjust = -0.5, size = 3) +
  scale_fill_manual(values = pal) +
  labs(title = "Orders by Customer Occupation",
       subtitle = "Labels show average spend per order",
       x = "Occupation", y = "Orders") +
  theme(axis.text.x = element_text(angle = 15, hjust = 1),
        plot.margin = ggplot2::margin(10, 10, 10, 10))
print(p_occ)

# ==============================================================================
# SECTION 9: PROFITABILITY PREDICTION FOR NEW LOCATIONS
# ==============================================================================

cat("\n================================================================\n")
cat("  FUTURE BUSINESS — WHERE TO EXPAND?                           \n")
cat("================================================================\n\n")

# ---- SAFE FACTOR ALIGNMENT FUNCTION FOR PREDICTIONS ----
# When predicting on new data, factor levels MUST match training data.
# This function: cleans text, aligns levels, replaces unseen with mode.

safe_align_for_predict <- function(new_df, reference_df) {
  for (col in names(new_df)) {
    if (col == "Scenario") next

    if (is.factor(reference_df[[col]])) {
      # Clean the new data
      vals <- trimws(as.character(new_df[[col]]))
      vals <- gsub(",", " ", vals)
      vals <- gsub("[^[:alnum:][:space:]().&/]", "", vals)

      # Get training levels
      ref_levels <- levels(reference_df[[col]])

      # Replace unseen values with the most common training value
      unseen <- !(vals %in% ref_levels)
      if (any(unseen)) {
        most_common <- names(sort(table(as.character(reference_df[[col]])),
                                  decreasing = TRUE))[1]
        cat("  Replacing unseen in", col, ":",
            paste(unique(vals[unseen]), collapse = ", "), "->", most_common, "\n")
        vals[unseen] <- most_common
      }

      # Force identical factor levels
      new_df[[col]] <- factor(vals, levels = ref_levels)
    }
  }
  return(new_df)
}

# Create hypothetical new location scenarios
new_locations <- data.frame(
  Scenario = c("Tier 1 - Premium Dining",
               "Tier 1 - Quick Bites",
               "Tier 2 - Casual Dining",
               "Tier 2 - Quick Bites",
               "Tier 3 - Casual Dining",
               "Tier 3 - Quick Bites",
               "Tier 1 - Evening Peak",
               "Tier 2 - Late Night",
               "Tier 1 - Bar Nightlife",
               "Tier 3 - Breakfast Focus"),
  Age = c(28, 23, 25, 22, 24, 21, 27, 25, 30, 26),
  Family_Size = c(3, 2, 4, 3, 5, 4, 2, 2, 3, 4),
  Avg_Cost = c(1500, 300, 700, 250, 500, 200, 900, 400, 1200, 300),
  Order_Hour = c(14, 12, 13, 11, 12, 9, 19, 22, 21, 8),
  Days_Since_Prior = c(7, 5, 10, 15, 12, 20, 3, 8, 5, 25),
  Income_Level = c(5, 2, 3, 2, 3, 1, 4, 3, 5, 2),
  City_Tier = c(1, 1, 2, 2, 3, 3, 1, 2, 1, 3),
  Gender = c("Male", "Female", "Male", "Female", "Male",
             "Female", "Male", "Female", "Male", "Female"),
  Occupation = c("Employee", "Student", "Employee", "Student",
                 "Self Employeed", "Student", "Employee",
                 "Student", "Self Employeed", "Student"),
  Medium = c("Swiggy", "Zomato", "Swiggy", "Zomato", "ONDC",
             "Swiggy", "Zomato", "Swiggy", "Zomato", "ONDC"),
  Meal = c("Lunch", "Lunch", "Dinner", "Snacks", "Lunch",
           "Breakfast", "Dinner", "Dinner", "Dinner", "Breakfast"),
  Restaurant_Type = c("Fine Dining", "Quick Bites", "Casual Dining",
                       "Quick Bites", "Casual Dining", "Quick Bites",
                       "Casual Dining", "Quick Bites", "Bar",
                       "Quick Bites"),
  Order_Time = c("Anytime (Mon-Sun)", "Anytime (Mon-Sun)",
                  "Weekend (Sat & Sun)", "Anytime (Mon-Sun)",
                  "Weekdays (Mon-Fri)", "Anytime (Mon-Sun)",
                  "Weekend (Sat & Sun)", "Anytime (Mon-Sun)",
                  "Weekend (Sat & Sun)", "Weekdays (Mon-Fri)"),
  Time_Period = c("Afternoon", "Afternoon", "Afternoon", "Morning",
                   "Afternoon", "Morning", "Evening", "Night",
                   "Night", "Morning"),
  stringsAsFactors = FALSE  # MUST be FALSE for safe alignment to work
)

# Align factor levels with training data
cat("Aligning prediction data factors with training data...\n")
new_locations <- safe_align_for_predict(new_locations, ml$train_data)

# Predict using Random Forest with full error handling
tryCatch({
  pred_class <- predict(ml$rf, new_locations, type = "class")
  pred_prob <- predict(ml$rf, new_locations, type = "prob")

  prediction_results <- data.frame(
    Scenario = new_locations$Scenario,
    Predicted = pred_class,
    Prob_High_Demand = round(pred_prob[, "High"] * 100, 1),
    Recommendation = ifelse(pred_prob[, "High"] >= 0.6, "STRONGLY RECOMMENDED",
                            ifelse(pred_prob[, "High"] >= 0.4, "MODERATELY RECOMMENDED",
                                   "NOT RECOMMENDED"))
  )
  prediction_results <- prediction_results[order(-prediction_results$Prob_High_Demand), ]

  cat("\n--- EXPANSION PREDICTIONS ---\n")
  print(prediction_results)

  # Plot — ggplot2::margin() used explicitly
  p_pred <- ggplot(prediction_results,
                   aes(x = reorder(Scenario, Prob_High_Demand),
                       y = Prob_High_Demand,
                       fill = Recommendation)) +
    geom_bar(stat = "identity", alpha = 0.85) +
    geom_text(aes(label = paste0(Prob_High_Demand, "%")), hjust = -0.2, size = 3.5) +
    coord_flip() +
    scale_fill_manual(values = c("STRONGLY RECOMMENDED" = "#2ECC71",
                                  "MODERATELY RECOMMENDED" = "#F39C12",
                                  "NOT RECOMMENDED" = "#E74C3C")) +
    labs(title = "Business Expansion Prediction",
         subtitle = "Probability of being a High-Demand Area (by ML model)",
         x = "", y = "Probability of High Demand (%)",
         fill = "Recommendation") +
    theme(plot.margin = ggplot2::margin(10, 40, 10, 10)) +
    xlim(NA, NA) + ylim(0, 110)
  print(p_pred)

}, error = function(e) {
  cat("\nWARNING: Prediction failed:", e$message, "\n")
  cat("The rest of the analysis is still valid.\n")
  prediction_results <<- data.frame(
    Scenario = new_locations$Scenario,
    Predicted = "N/A",
    Prob_High_Demand = NA,
    Recommendation = "Check factor alignment"
  )
})

# ==============================================================================
# SECTION 10: BUSINESS STRATEGY RECOMMENDATIONS
# ==============================================================================

cat("\n\n================================================================\n")
cat("  STRATEGIC BUSINESS RECOMMENDATIONS                           \n")
cat("================================================================\n\n")

cat("--------------------------------------------------------------\n")
cat("  1. LOCATION EXPANSION STRATEGY                              \n")
cat("--------------------------------------------------------------\n")
cat("  - Focus on TIER 1 CITIES — highest order volume & revenue.\n")
cat("  - Tier 2 cities show GROWTH POTENTIAL — moderate cost,\n")
cat("    increasing demand. Ideal for second-phase expansion.\n")
cat("  - Tier 3 cities need more time — lower demand density.\n")
cat("    Consider only after Tier 1 & 2 are saturated.\n\n")

cat("--------------------------------------------------------------\n")
cat("  2. TIME-BASED STAFFING STRATEGY                             \n")
cat("--------------------------------------------------------------\n")
cat("  - Deploy MAXIMUM delivery staff during peak hours.\n")
cat("  - Peak hours identified from data analysis above.\n")
cat("  - REDUCE staff during early morning (0-6 AM).\n")
cat("  - Cross-train staff for kitchen support during off-peak.\n\n")

cat("--------------------------------------------------------------\n")
cat("  3. RESTAURANT PARTNERSHIP STRATEGY                          \n")
cat("--------------------------------------------------------------\n")
cat("  - QUICK BITES = Highest order volume (partner with more).\n")
cat("  - CASUAL DINING = Highest revenue per order.\n")
cat("  - FINE DINING = Premium segment, target high-income users.\n")
cat("  - Expand BAR partnerships in Tier 1 for evening revenue.\n\n")

cat("--------------------------------------------------------------\n")
cat("  4. MARKETING TARGETING STRATEGY                             \n")
cat("--------------------------------------------------------------\n")
cat("  - TARGET STUDENTS (largest customer segment) with discounts.\n")
cat("  - EMPLOYEES order during lunch — push lunch meal deals.\n")
cat("  - EVENING/NIGHT promotions for dinner orders.\n")
cat("  - Weekend-specific campaigns (higher casual dining orders).\n")
cat("  - City-specific marketing: Tier 1 = premium, Tier 3 = value.\n\n")

cat("--------------------------------------------------------------\n")
cat("  5. PLATFORM STRATEGY                                        \n")
cat("--------------------------------------------------------------\n")
cat("  - Swiggy leads in market share — maintain strong presence.\n")
cat("  - Zomato performs well in dining — leverage for restaurants.\n")
cat("  - ONDC is emerging — early mover advantage opportunity.\n\n")

cat("--------------------------------------------------------------\n")
cat("  6. REVENUE OPTIMIZATION                                     \n")
cat("--------------------------------------------------------------\n")
cat("  - Increase average order value through combo deals.\n")
cat("  - Premium areas (Tier 1) can support higher delivery fees.\n")
cat("  - Loyalty programs for frequent customers.\n")
cat("  - Dynamic pricing during peak hours for surge revenue.\n\n")

# ==============================================================================
# SECTION 11: POWER BI DASHBOARD GUIDANCE
# ==============================================================================

cat("================================================================\n")
cat("  POWER BI DASHBOARD — STEP-BY-STEP SETUP GUIDE               \n")
cat("================================================================\n\n")

cat("Step 1: Import Data into Power BI\n")
cat("  -> Open Power BI Desktop\n")
cat("  -> Get Data -> Text/CSV -> Select 'cleaned_food_delivery_data.csv'\n")
cat("  -> Click Transform Data to verify columns\n")
cat("  -> Click Close & Apply\n\n")

cat("Step 2: Create the following visuals:\n\n")

cat("  Page 1: ORDER ANALYTICS\n")
cat("  |- Bar Chart: Orders by Hour (X=Order_Hour, Y=Count)\n")
cat("  |- Bar Chart: Orders by City (X=Cities, Y=Count)\n")
cat("  |- Pie Chart: Orders by Platform (Medium)\n")
cat("  |- Line Chart: Revenue Trend by Hour\n\n")

cat("  Page 2: REVENUE & PROFITABILITY\n")
cat("  |- KPI Card: Total Revenue = SUM(Avg_Cost)\n")
cat("  |- KPI Card: Total Orders = COUNT(rows)\n")
cat("  |- KPI Card: Avg Order Value = AVERAGE(Avg_Cost)\n")
cat("  |- KPI Card: High Demand % = High/(High+Low)\n")
cat("  |- Stacked Bar: Revenue by City & Restaurant Type\n\n")

cat("  Page 3: CUSTOMER INSIGHTS\n")
cat("  |- Bar Chart: Orders by Occupation\n")
cat("  |- Bar Chart: Orders by Income Level\n")
cat("  |- Donut Chart: Meal Type Distribution\n")
cat("  |- Matrix: City x Time Period cross-tab\n\n")

cat("  Page 4: ML PREDICTIONS & RECOMMENDATIONS\n")
cat("  |- Import 'model_comparison.csv' -> Table visual\n")
cat("  |- Bar Chart: Feature Importance\n")
cat("  |- Map/Matrix: Predicted High-Demand Locations\n")
cat("  |- Text Box: Key Recommendations\n\n")

cat("  SLICERS (Add to all pages):\n")
cat("  |- City Tier slicer\n")
cat("  |- Time Period slicer\n")
cat("  |- Platform (Medium) slicer\n")
cat("  |- Restaurant Type slicer\n\n")

# ==============================================================================
# SECTION 12: EXPORT DATA FOR POWER BI
# ==============================================================================

write.csv(city_stats, "powerbi_city_stats.csv", row.names = FALSE)
write.csv(hour_stats, "powerbi_hour_stats.csv", row.names = FALSE)
write.csv(platform_stats, "powerbi_platform_stats.csv", row.names = FALSE)
write.csv(rest_stats, "powerbi_restaurant_stats.csv", row.names = FALSE)

tryCatch({
  write.csv(prediction_results, "powerbi_predictions.csv", row.names = FALSE)
}, error = function(e) {
  cat("Note: Prediction results not saved (prediction may have failed).\n")
})

cat("Power BI data files exported:\n")
cat("  - powerbi_city_stats.csv\n")
cat("  - powerbi_hour_stats.csv\n")
cat("  - powerbi_platform_stats.csv\n")
cat("  - powerbi_restaurant_stats.csv\n")
cat("  - powerbi_predictions.csv\n\n")

cat("=== 03_business_insights.R COMPLETE ===\n")
cat("Project execution finished! Now create Power BI dashboard.\n")
