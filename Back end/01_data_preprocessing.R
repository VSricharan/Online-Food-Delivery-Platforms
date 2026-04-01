# ==============================================================================
# FILE: 01_data_preprocessing.R
# PROJECT: Online Food Delivery Business Intelligence
# PURPOSE: Data Loading, Cleaning, Feature Engineering & Exploratory Data Analysis
# AUTHOR: Sampath
# DATE: 2026-02-19
# ==============================================================================

# ==============================================================================
# SECTION 1: INSTALL & LOAD REQUIRED PACKAGES
# ==============================================================================

required_packages <- c("tidyverse", "ggplot2", "dplyr", "tidyr", "readr",
                        "scales", "gridExtra", "corrplot", "RColorBrewer")

for (pkg in required_packages) {
  if (!require(pkg, character.only = TRUE)) {
    install.packages(pkg, dependencies = TRUE)
    library(pkg, character.only = TRUE)
  }
}

cat("=== All packages loaded successfully ===\n\n")

# ==============================================================================
# SECTION 2: LOAD THE DATASET
# ==============================================================================

file_path <- "Book1_expanded_2000 - Book1_expanded_2000.csv.csv"

if (!file.exists(file_path)) {
  stop("ERROR: File not found! Please update 'file_path' variable with the correct path.")
}

df <- read.csv(file_path, stringsAsFactors = FALSE, na.strings = c("", "NA", " "))

cat("=== Dataset Loaded Successfully ===\n")
cat("Rows:", nrow(df), "\n")
cat("Columns:", ncol(df), "\n\n")

# ==============================================================================
# SECTION 3: INITIAL DATA EXPLORATION
# ==============================================================================

cat("=== DATASET STRUCTURE ===\n")
str(df)

cat("\n=== FIRST 6 ROWS ===\n")
print(head(df))

cat("\n=== STATISTICAL SUMMARY ===\n")
print(summary(df))

cat("\n=== COLUMN NAMES ===\n")
print(colnames(df))

# Rename columns for easier handling
colnames(df) <- c("Age", "Gender", "Marital_Status", "Occupation", "Monthly_Income",
                   "Education", "Family_Size", "Medium", "Restaurant_Type",
                   "Order_Time", "Meal", "Preference", "Ease_Convenient",
                   "Avg_Cost", "Order_Hour", "Days_Since_Prior", "Cities")

cat("\n=== RENAMED COLUMNS ===\n")
print(colnames(df))

# ==============================================================================
# SECTION 4: MISSING VALUE ANALYSIS
# ==============================================================================

cat("\n=== MISSING VALUES PER COLUMN ===\n")
missing_counts <- colSums(is.na(df))
missing_pct <- round(100 * missing_counts / nrow(df), 2)
missing_df <- data.frame(Column = names(missing_counts),
                         Missing = missing_counts,
                         Percentage = missing_pct)
missing_df <- missing_df[order(-missing_df$Missing), ]
print(missing_df)

# Helper: get mode
get_mode <- function(x) {
  x <- x[!is.na(x)]
  if (length(x) == 0) return(NA)
  ux <- unique(x)
  ux[which.max(tabulate(match(x, ux)))]
}

# Fill numeric columns with median
numeric_cols <- c("Age", "Family_Size", "Avg_Cost", "Order_Hour", "Days_Since_Prior")
for (col in numeric_cols) {
  if (any(is.na(df[[col]]))) {
    median_val <- median(df[[col]], na.rm = TRUE)
    df[[col]][is.na(df[[col]])] <- median_val
    cat("Filled", col, "missing values with median:", median_val, "\n")
  }
}

# Fill categorical columns with mode
categorical_cols <- c("Gender", "Marital_Status", "Occupation", "Monthly_Income",
                       "Education", "Medium", "Restaurant_Type", "Order_Time",
                       "Meal", "Preference", "Ease_Convenient", "Cities")
for (col in categorical_cols) {
  if (any(is.na(df[[col]]))) {
    mode_val <- get_mode(df[[col]])
    df[[col]][is.na(df[[col]])] <- mode_val
    cat("Filled", col, "missing values with mode:", mode_val, "\n")
  }
}

cat("\n=== REMAINING MISSING VALUES ===\n")
print(colSums(is.na(df)))

# ==============================================================================
# SECTION 5: DATA CLEANING & STANDARDIZATION (PRODUCTION-LEVEL)
# ==============================================================================
# This is the critical section. The dataset contains comma-separated multi-values
# like "Casual Dining, Bar" and inconsistent casing like "bar " / "Bar".
# We clean ALL categorical columns rigorously to prevent ML errors.

cat("\n=== DEEP-CLEANING CATEGORICAL VARIABLES ===\n")

# ---- 5a. RESTAURANT TYPE CLEANING ----
# Problem: Values like "Casual Dining, Bar", "Desert Parlor, Quick Bites",
#          "bar " (lowercase + trailing space), "Desert Parlor, Desert Parlor"
# Solution: Keep only the FIRST value before any comma, trim, title-case

cat("\nRestaurant Types BEFORE cleaning:\n")
print(sort(table(df$Restaurant_Type), decreasing = TRUE))

# Step 1: Trim whitespace
df$Restaurant_Type <- trimws(df$Restaurant_Type)

# Step 2: For comma-separated values, keep FIRST type only
# e.g. "Casual Dining, Bar" → "Casual Dining"
# e.g. "Desert Parlor, Quick Bites" → "Desert Parlor"
df$Restaurant_Type <- sapply(strsplit(df$Restaurant_Type, ","), function(x) trimws(x[1]))

# Step 3: Standardize to Title Case (handles "bar " → "Bar", "quick bites" → "Quick Bites")
# Custom title case function
to_title <- function(x) {
  words <- strsplit(x, " ")[[1]]
  paste(toupper(substring(words, 1, 1)), substring(words, 2), sep = "", collapse = " ")
}
df$Restaurant_Type <- sapply(df$Restaurant_Type, to_title)

# Step 4: Fix known variations
df$Restaurant_Type <- gsub("Takeaway, Delivery", "Takeaway", df$Restaurant_Type)

cat("\nRestaurant Types AFTER cleaning:\n")
print(sort(table(df$Restaurant_Type), decreasing = TRUE))
cat("Unique restaurant types:", length(unique(df$Restaurant_Type)), "\n")

# ---- 5b. CLEAN ALL OTHER CATEGORICAL COLUMNS ----
# Apply trim + title case to all text columns to prevent factor issues

text_cols <- c("Gender", "Marital_Status", "Occupation", "Monthly_Income",
               "Education", "Medium", "Order_Time", "Meal", "Preference",
               "Ease_Convenient", "Cities")

for (col in text_cols) {
  df[[col]] <- trimws(df[[col]])
  # Remove any remaining special characters that could break factors
  df[[col]] <- gsub("[^[:alnum:][:space:]().&/]", "", df[[col]])
}

# ---- 5c. REPLACE EMPTY STRINGS WITH NA AND RE-FILL ----
for (col in c("Restaurant_Type", text_cols)) {
  df[[col]][df[[col]] == ""] <- NA
  if (any(is.na(df[[col]]))) {
    mode_val <- get_mode(df[[col]])
    df[[col]][is.na(df[[col]])] <- mode_val
    cat("Re-filled empty strings in", col, "with:", mode_val, "\n")
  }
}

# ---- 5d. Standardize Monthly_Income to ordered levels ----
df$Monthly_Income <- factor(df$Monthly_Income,
                            levels = c("No Income", "Below Rs.10000",
                                       "10001 to 25000", "25001 to 50000",
                                       "More than 50000"),
                            ordered = TRUE)

# ---- 5e. Standardize Ease_Convenient ----
df$Ease_Convenient <- factor(df$Ease_Convenient,
                             levels = c("Strongly disagree", "Disagree",
                                        "Neutral", "Agree", "Strongly agree"),
                             ordered = TRUE)

# ---- 5f. Ensure numeric columns are numeric ----
df$Age <- as.numeric(df$Age)
df$Family_Size <- as.numeric(df$Family_Size)
df$Avg_Cost <- as.numeric(df$Avg_Cost)
df$Order_Hour <- as.numeric(df$Order_Hour)
df$Days_Since_Prior <- as.numeric(df$Days_Since_Prior)

# ---- VALIDATION CHECK ----
cat("\n=== POST-CLEANING VALIDATION ===\n")
cat("Any NAs remaining?", any(is.na(df)), "\n")
cat("Any empty strings?", any(df == "", na.rm = TRUE), "\n")
cat("Total rows:", nrow(df), "\n")
cat("Total columns:", ncol(df), "\n")
cat("Data Cleaning Complete!\n")

# ==============================================================================
# SECTION 6: FEATURE ENGINEERING
# ==============================================================================

# 6a. Income Level (numeric encoding)
df$Income_Level <- as.numeric(factor(df$Monthly_Income,
                                     levels = c("No Income", "Below Rs.10000",
                                                "10001 to 25000", "25001 to 50000",
                                                "More than 50000")))
df$Income_Level[is.na(df$Income_Level)] <- 1

# 6b. Time Period
df$Time_Period <- case_when(
  df$Order_Hour >= 6 & df$Order_Hour < 12  ~ "Morning",
  df$Order_Hour >= 12 & df$Order_Hour < 17 ~ "Afternoon",
  df$Order_Hour >= 17 & df$Order_Hour < 21 ~ "Evening",
  TRUE                                      ~ "Night"
)

# 6c. Cost Category
cost_q <- quantile(df$Avg_Cost, probs = c(0.25, 0.50, 0.75), na.rm = TRUE)
df$Cost_Category <- case_when(
  df$Avg_Cost <= cost_q[1] ~ "Low",
  df$Avg_Cost <= cost_q[2] ~ "Medium",
  df$Avg_Cost <= cost_q[3] ~ "High",
  TRUE                     ~ "Premium"
)
df$Cost_Category <- factor(df$Cost_Category,
                           levels = c("Low", "Medium", "High", "Premium"),
                           ordered = TRUE)

# 6d. Order Frequency Category
df$Order_Frequency <- case_when(
  df$Days_Since_Prior <= 5  ~ "Very_Frequent",
  df$Days_Since_Prior <= 10 ~ "Frequent",
  df$Days_Since_Prior <= 20 ~ "Moderate",
  TRUE                      ~ "Infrequent"
)

# 6e. City Tier Numeric
df$City_Tier <- case_when(
  df$Cities == "Tier 1" ~ 1,
  df$Cities == "Tier 2" ~ 2,
  df$Cities == "Tier 3" ~ 3,
  TRUE                  ~ 2
)

# ==============================================================================
# SECTION 7: TARGET VARIABLE — "High_Demand_Area"
# ==============================================================================

median_cost <- median(df$Avg_Cost, na.rm = TRUE)
cat("\nMedian Average Cost:", median_cost, "\n")

df$High_Demand_Area <- ifelse(
  (as.integer(df$Avg_Cost >= median_cost) +
   as.integer(df$City_Tier <= 2) +
   as.integer(df$Days_Since_Prior <= 15)) >= 2,
  1, 0
)
df$High_Demand_Area <- as.factor(df$High_Demand_Area)

cat("\n=== TARGET VARIABLE DISTRIBUTION ===\n")
cat("0 = Not High Demand, 1 = High Demand\n")
print(table(df$High_Demand_Area))
print(prop.table(table(df$High_Demand_Area)))

# ==============================================================================
# SECTION 8: EXPLORATORY DATA ANALYSIS (EDA)
# ==============================================================================

theme_set(theme_minimal(base_size = 12) +
          theme(plot.title = element_text(face = "bold", hjust = 0.5, size = 14),
                plot.subtitle = element_text(hjust = 0.5, color = "gray40"),
                legend.position = "bottom"))

colors_main <- c("#2C3E50", "#E74C3C", "#3498DB", "#2ECC71", "#F39C12", "#9B59B6")

# PLOT 1: Orders by Hour
cat("\n--- Generating Plot 1: Orders by Hour of Day ---\n")
p1 <- ggplot(df, aes(x = Order_Hour)) +
  geom_histogram(binwidth = 1, fill = "#3498DB", color = "white", alpha = 0.8) +
  geom_density(aes(y = after_stat(count)), color = "#E74C3C", linewidth = 1) +
  labs(title = "Distribution of Orders by Hour of Day",
       subtitle = "When do customers order food?",
       x = "Hour of Day (0-23)", y = "Number of Orders") +
  scale_x_continuous(breaks = 0:23)
print(p1)

# PLOT 2: Orders by City Tier
cat("--- Generating Plot 2: Orders by City Tier ---\n")
p2 <- ggplot(df, aes(x = Cities, fill = Cities)) +
  geom_bar(alpha = 0.8, show.legend = FALSE) +
  geom_text(stat = "count", aes(label = after_stat(count)), vjust = -0.5) +
  scale_fill_manual(values = colors_main[1:3]) +
  labs(title = "Order Distribution by City Tier",
       subtitle = "Which cities generate the most orders?",
       x = "City Tier", y = "Number of Orders")
print(p2)

# PLOT 3: Orders by Platform
cat("--- Generating Plot 3: Orders by Platform ---\n")
p3 <- ggplot(df, aes(x = reorder(Medium, Medium, function(x) -length(x)), fill = Medium)) +
  geom_bar(alpha = 0.8, show.legend = FALSE) +
  geom_text(stat = "count", aes(label = after_stat(count)), vjust = -0.5) +
  scale_fill_manual(values = colors_main) +
  labs(title = "Orders by Delivery Platform",
       subtitle = "Swiggy vs Zomato vs ONDC market share",
       x = "Platform", y = "Number of Orders")
print(p3)

# PLOT 4: Average Cost
cat("--- Generating Plot 4: Average Cost Distribution ---\n")
p4 <- ggplot(df, aes(x = Avg_Cost)) +
  geom_histogram(binwidth = 100, fill = "#2ECC71", color = "white", alpha = 0.8) +
  geom_vline(xintercept = median_cost, color = "#E74C3C",
             linetype = "dashed", linewidth = 1) +
  annotate("text", x = median_cost + 150, y = Inf,
           label = paste("Median:", median_cost), vjust = 2, color = "#E74C3C") +
  labs(title = "Distribution of Average Cost (for 2 People)",
       subtitle = "Revenue distribution across orders",
       x = "Average Cost (Rs.)", y = "Number of Orders")
print(p4)

# PLOT 5: Orders by Meal Type
cat("--- Generating Plot 5: Orders by Meal Type ---\n")
p5 <- ggplot(df, aes(x = reorder(Meal, Meal, function(x) -length(x)), fill = Meal)) +
  geom_bar(alpha = 0.8, show.legend = FALSE) +
  geom_text(stat = "count", aes(label = after_stat(count)), vjust = -0.5) +
  scale_fill_manual(values = colors_main) +
  labs(title = "Orders by Meal Type",
       subtitle = "Which meal generates the most orders?",
       x = "Meal Type", y = "Number of Orders")
print(p5)

# PLOT 6: Time Period vs City
cat("--- Generating Plot 6: Time Period vs City ---\n")
df$Time_Period <- factor(df$Time_Period,
                         levels = c("Morning", "Afternoon", "Evening", "Night"))
p6 <- ggplot(df, aes(x = Time_Period, fill = Cities)) +
  geom_bar(position = "dodge", alpha = 0.8) +
  scale_fill_manual(values = colors_main[1:3]) +
  labs(title = "Order Distribution: Time Period vs City Tier",
       subtitle = "Peak ordering times across different city tiers",
       x = "Time Period", y = "Number of Orders", fill = "City Tier")
print(p6)

# PLOT 7: Cost by Restaurant Type (Top 8)
cat("--- Generating Plot 7: Cost by Restaurant Type ---\n")
top_restaurants <- df %>%
  count(Restaurant_Type, sort = TRUE) %>%
  head(8) %>%
  pull(Restaurant_Type)

p7 <- df %>%
  filter(Restaurant_Type %in% top_restaurants) %>%
  ggplot(aes(x = reorder(Restaurant_Type, Avg_Cost, FUN = median),
             y = Avg_Cost, fill = Restaurant_Type)) +
  geom_boxplot(alpha = 0.7, show.legend = FALSE) +
  coord_flip() +
  labs(title = "Average Cost by Restaurant Type (Top 8)",
       subtitle = "Which restaurant types generate the most revenue?",
       x = "Restaurant Type", y = "Average Cost (Rs.)")
print(p7)

# PLOT 8: Heatmap
cat("--- Generating Plot 8: Heatmap - Hour vs City ---\n")
heatmap_data <- df %>%
  count(Order_Hour, Cities) %>%
  group_by(Cities) %>%
  mutate(pct = n / sum(n))

p8 <- ggplot(heatmap_data, aes(x = Order_Hour, y = Cities, fill = n)) +
  geom_tile(color = "white") +
  scale_fill_gradient(low = "#FFF5EB", high = "#E74C3C") +
  scale_x_continuous(breaks = 0:23) +
  labs(title = "Order Density Heatmap: Hour vs City Tier",
       subtitle = "Darker = More orders at that hour in that city",
       x = "Hour of Day", y = "City Tier", fill = "Orders")
print(p8)

# PLOT 9: Income vs Spending
cat("--- Generating Plot 9: Income vs Spending ---\n")
p9 <- df %>%
  filter(!is.na(Monthly_Income)) %>%
  ggplot(aes(x = Monthly_Income, y = Avg_Cost, fill = Monthly_Income)) +
  geom_boxplot(alpha = 0.7, show.legend = FALSE) +
  labs(title = "Spending Pattern by Income Level",
       subtitle = "Do higher-income customers spend more?",
       x = "Monthly Income", y = "Average Cost (Rs.)") +
  theme(axis.text.x = element_text(angle = 20, hjust = 1))
print(p9)

# PLOT 10: Target Variable
cat("--- Generating Plot 10: Target Variable Distribution ---\n")
p10 <- ggplot(df, aes(x = High_Demand_Area, fill = High_Demand_Area)) +
  geom_bar(alpha = 0.8, show.legend = FALSE) +
  geom_text(stat = "count", aes(label = after_stat(count)), vjust = -0.5) +
  scale_fill_manual(values = c("#E74C3C", "#2ECC71"),
                    labels = c("Low Demand", "High Demand")) +
  scale_x_discrete(labels = c("0" = "Low Demand", "1" = "High Demand")) +
  labs(title = "Target Variable: High Demand Area Distribution",
       subtitle = "Balance between high and low demand areas",
       x = "Category", y = "Count")
print(p10)

# ==============================================================================
# SECTION 9: KEY BUSINESS STATISTICS
# ==============================================================================
cat("\n")
cat("================================================================\n")
cat("          KEY BUSINESS STATISTICS SUMMARY                       \n")
cat("================================================================\n")
cat("Total Records:              ", nrow(df), "\n")
cat("Average Order Cost:          Rs.", round(mean(df$Avg_Cost, na.rm = TRUE), 2), "\n")
cat("Median Order Cost:           Rs.", round(median(df$Avg_Cost, na.rm = TRUE), 2), "\n")
cat("Max Order Cost:              Rs.", max(df$Avg_Cost, na.rm = TRUE), "\n")
cat("Min Order Cost:              Rs.", min(df$Avg_Cost, na.rm = TRUE), "\n")
cat("Total Estimated Revenue:     Rs.", format(sum(df$Avg_Cost, na.rm = TRUE), big.mark = ","), "\n")
cat("Most Popular Platform:      ", names(sort(table(df$Medium), decreasing = TRUE))[1], "\n")
cat("Most Popular Meal:          ", names(sort(table(df$Meal), decreasing = TRUE))[1], "\n")
cat("Peak Order Hour:            ", as.numeric(names(sort(table(df$Order_Hour), decreasing = TRUE))[1]), ":00\n")
cat("Most Orders from City:      ", names(sort(table(df$Cities), decreasing = TRUE))[1], "\n")
cat("High Demand Areas:          ", sum(df$High_Demand_Area == 1),
    "(", round(100 * sum(df$High_Demand_Area == 1) / nrow(df), 1), "%)\n")
cat("================================================================\n\n")

# ==============================================================================
# SECTION 10: SAVE CLEANED DATA
# ==============================================================================

output_file <- "cleaned_food_delivery_data.csv"
write.csv(df, output_file, row.names = FALSE)
cat("Cleaned dataset saved to:", output_file, "\n")

saveRDS(df, "cleaned_food_delivery_data.rds")
cat("R dataset saved to: cleaned_food_delivery_data.rds\n")

cat("\n=== 01_data_preprocessing.R COMPLETE ===\n")
cat("Next step: Run 02_ml_models.R\n")
