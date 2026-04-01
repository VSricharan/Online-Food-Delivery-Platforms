# MySQL Integration — Execution Guide

## Architecture

```
CSV → MySQL (3 tables) → R (DBI + RMariaDB) → ML Models → Power BI
```

## File Execution Order

| Step | File | Tool | Purpose |
|------|------|------|---------|
| 1 | `00_mysql_schema.sql` | MySQL Workbench | Create database + tables |
| 2 | *(CSV import)* | MySQL Workbench | Load data into staging table |
| 3 | `00_mysql_schema.sql` (Step 5-6) | MySQL Workbench | Normalize staging → 3 tables |
| 4 | `00_db_connection.R` | RStudio | Fetch data from MySQL → RDS |
| 5 | `01_data_preprocessing.R` | RStudio | EDA (optional, reads from RDS) |
| 6 | `02_ml_models.R` | RStudio | Train ML models |
| 7 | `03_business_insights.R` | RStudio | Business analysis + exports |
| 8 | Power BI | Power BI Desktop | Create dashboard |

---

## Step-by-Step Instructions

### Step 1: MySQL Setup

1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Open `00_mysql_schema.sql`
4. **Run Steps 1–3 only** (CREATE DATABASE, tables, staging table)
   - Select lines 1 through the staging table creation
   - Click ⚡ Execute

### Step 2: Import CSV into Staging Table

1. In MySQL Workbench, right-click on `staging_raw` table
2. Select **Table Data Import Wizard**
3. Browse to: `C:\Users\asus\Desktop\sampath\cleaned_food_delivery_data.csv`
4. Set encoding: **UTF-8**
5. Select **"Use existing table: staging_raw"**
6. Map columns (should auto-match by name)
7. Click **Import**
8. Verify: `SELECT COUNT(*) FROM staging_raw;` → should return **2000**

### Step 3: Normalize Data

1. Run **Step 5** of `00_mysql_schema.sql` (the INSERT queries)
   - This populates `restaurants`, `customers`, and `orders` from staging
2. Run **Step 6** (DROP staging table)
3. Run **Step 7** (verification queries) to confirm:
   - `restaurants`: ~10-12 rows
   - `customers`: varies (deduplicated profiles)
   - `orders`: 2000 rows

### Step 4: R Database Connection

1. Open RStudio
2. Open `00_db_connection.R`
3. **Edit line 46**: Set your MySQL password
   ```r
   password = "your_mysql_password"
   ```
4. Run the entire script: `source("00_db_connection.R")`
5. Verify output:
   - "SUCCESS: Connected to MySQL database"
   - "Fetched 2000 rows"
   - "Saved: cleaned_food_delivery_data.rds"

### Step 5–7: Run Existing Pipeline (Unchanged)

```r
source("01_data_preprocessing.R")   # Optional (EDA only)
source("02_ml_models.R")            # ML training
source("03_business_insights.R")    # Business insights + Power BI exports
```

### Step 8: Power BI Dashboard

#### Option A: Connect Power BI Directly to MySQL

1. Open **Power BI Desktop**
2. **Get Data** → **MySQL Database**
3. Enter:
   - Server: `localhost`
   - Database: `food_delivery_db`
4. Choose **Import** mode
5. Select all 3 tables: `customers`, `restaurants`, `orders`
6. Click **Load**
7. Go to **Model View** → Verify relationships:
   - `orders.customer_id` → `customers.customer_id`
   - `orders.restaurant_id` → `restaurants.restaurant_id`

#### Option B: Import CSV Files from R

If MySQL connector is unavailable:
1. **Get Data** → **Text/CSV**
2. Import these files (exported by `03_business_insights.R`):
   - `cleaned_food_delivery_data.csv` — Full dataset
   - `powerbi_city_stats.csv` — City performance
   - `powerbi_hour_stats.csv` — Hourly patterns
   - `powerbi_platform_stats.csv` — Platform comparison
   - `powerbi_restaurant_stats.csv` — Restaurant analysis
   - `powerbi_predictions.csv` — ML predictions
   - `model_comparison.csv` — Model accuracy metrics

#### Power BI MySQL Connector Prerequisite

> If you see "MySQL connector not found", install:
> **MySQL Connector/NET** from https://dev.mysql.com/downloads/connector/net/
> Restart Power BI after installation.

---

## Database Schema Diagram

```
┌─────────────────────┐     ┌─────────────────────────────┐     ┌──────────────────┐
│     customers       │     │          orders              │     │   restaurants     │
├─────────────────────┤     ├─────────────────────────────┤     ├──────────────────┤
│ customer_id (PK)    │◄────│ customer_id (FK)             │     │ restaurant_id(PK)│
│ age                 │     │ restaurant_id (FK)           │────►│ restaurant_type   │
│ gender              │     │ order_id (PK)                │     └──────────────────┘
│ marital_status      │     │ avg_cost                     │
│ occupation          │     │ order_hour                   │
│ monthly_income      │     │ days_since_prior             │
│ education           │     │ meal                         │
│ family_size         │     │ medium                       │
│ income_level        │     │ order_time                   │
│ city_tier           │     │ time_period                  │
│ cities              │     │ cost_category                │
└─────────────────────┘     │ order_frequency              │
                            │ preference                   │
                            │ ease_convenient              │
                            │ high_demand_area             │
                            └─────────────────────────────┘
```

## Troubleshooting

| Issue | Solution |
|-------|---------|
| `RMariaDB` install fails | `install.packages("RMariaDB", type = "binary")` |
| MySQL connection refused | Check MySQL service is running (Windows Services) |
| Wrong password | Edit `password` in `00_db_connection.R` line 46 |
| LOAD DATA disabled | Use MySQL Workbench Import Wizard instead |
| Power BI can't see MySQL | Install MySQL Connector/NET, restart Power BI |
| 0 rows fetched | Verify staging import: `SELECT COUNT(*) FROM staging_raw` |
