-- ==============================================================================
-- FILE: 00_mysql_schema.sql
-- PROJECT: Online Food Delivery Business Intelligence
-- PURPOSE: Normalized MySQL Schema — 3NF Design with Data Import Pipeline
-- AUTHOR: Sampath
-- DATE: 2026-02-22
--
-- ARCHITECTURE: MySQL → SQL JOIN → R (DBI + RMariaDB) → ML Models → Power BI
--
-- TABLE DESIGN (3NF):
--   customers   → Customer demographics (1 row per unique profile)
--   restaurants  → Restaurant type catalog (1 row per type)
--   orders       → Transactional data with FK references
--
-- IMPORT STRATEGY:
--   1. Create database + 3 normalized tables
--   2. Create a staging table matching the CSV layout
--   3. Load CSV into staging (Workbench Import Wizard or LOAD DATA)
--   4. Run normalization queries to split staging → 3 tables
--   5. Drop staging table
-- ==============================================================================


-- ==============================================================================
-- STEP 1: CREATE DATABASE
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS food_delivery_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE food_delivery_db;


-- ==============================================================================
-- STEP 2: CREATE NORMALIZED TABLES
-- ==============================================================================

-- ┌──────────────────────────────────────────────────────────────┐
-- │ TABLE 1: restaurants — Restaurant type catalog               │
-- │ One row per unique Restaurant_Type value                     │
-- └──────────────────────────────────────────────────────────────┘

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS customers;

CREATE TABLE restaurants (
  restaurant_id   INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_type VARCHAR(50) NOT NULL,

  UNIQUE KEY uq_restaurant_type (restaurant_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ┌──────────────────────────────────────────────────────────────┐
-- │ TABLE 2: customers — Customer demographic profiles           │
-- │ One row per unique combination of demographic attributes     │
-- │ NOTE: Original dataset has no customer ID column. We create  │
-- │ synthetic IDs from unique demographic combinations.          │
-- └──────────────────────────────────────────────────────────────┘

CREATE TABLE customers (
  customer_id     INT AUTO_INCREMENT PRIMARY KEY,
  age             INT NOT NULL,
  gender          VARCHAR(20) NOT NULL,
  marital_status  VARCHAR(30) NOT NULL,
  occupation      VARCHAR(30) NOT NULL,
  monthly_income  VARCHAR(30) NOT NULL,
  education       VARCHAR(30) NOT NULL,
  family_size     INT NOT NULL,
  income_level    INT NOT NULL,
  city_tier       INT NOT NULL,
  cities          VARCHAR(20) NOT NULL,

  -- Composite unique key: one row per unique customer profile
  UNIQUE KEY uq_customer_profile (
    age, gender, marital_status, occupation,
    monthly_income, education, family_size,
    income_level, city_tier
  ),

  -- Index on frequently queried columns
  INDEX idx_city_tier (city_tier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ┌──────────────────────────────────────────────────────────────┐
-- │ TABLE 3: orders — Transactional order data                   │
-- │ One row per order, references customers and restaurants       │
-- └──────────────────────────────────────────────────────────────┘

CREATE TABLE orders (
  order_id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id       INT NOT NULL,
  restaurant_id     INT NOT NULL,
  avg_cost          DECIMAL(10,2) NOT NULL,
  order_hour        INT NOT NULL,
  days_since_prior  INT NOT NULL,
  meal              VARCHAR(20) NOT NULL,
  medium            VARCHAR(20) NOT NULL,
  order_time        VARCHAR(40) NOT NULL,
  time_period       VARCHAR(20) NOT NULL,
  cost_category     VARCHAR(20) NOT NULL,
  order_frequency   VARCHAR(20) NOT NULL,
  preference        VARCHAR(100) NOT NULL,
  ease_convenient   VARCHAR(30) NOT NULL,
  high_demand_area  VARCHAR(5) NOT NULL,

  -- Foreign Key Constraints
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_orders_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  -- Performance indexes on frequently filtered/queried columns
  INDEX idx_order_hour (order_hour),
  INDEX idx_avg_cost (avg_cost),
  INDEX idx_customer (customer_id),
  INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- STEP 3: CREATE STAGING TABLE (temporary, for CSV import)
-- ==============================================================================
-- This table mirrors the exact CSV column layout so you can import
-- the CSV file directly using MySQL Workbench Import Wizard.

DROP TABLE IF EXISTS staging_raw;

CREATE TABLE staging_raw (
  Age               INT,
  Gender            VARCHAR(20),
  Marital_Status    VARCHAR(30),
  Occupation        VARCHAR(30),
  Monthly_Income    VARCHAR(30),
  Education         VARCHAR(30),
  Family_Size       INT,
  Medium            VARCHAR(20),
  Restaurant_Type   VARCHAR(50),
  Order_Time        VARCHAR(40),
  Meal              VARCHAR(20),
  Preference        VARCHAR(100),
  Ease_Convenient   VARCHAR(30),
  Avg_Cost          DECIMAL(10,2),
  Order_Hour        INT,
  Days_Since_Prior  INT,
  Cities            VARCHAR(20),
  Income_Level      INT,
  Time_Period       VARCHAR(20),
  Cost_Category     VARCHAR(20),
  Order_Frequency   VARCHAR(20),
  City_Tier         INT,
  High_Demand_Area  VARCHAR(5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- STEP 4: IMPORT CSV INTO STAGING TABLE
-- ==============================================================================
-- 
-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  OPTION A (Recommended): MySQL Workbench Import Wizard       ║
-- ╠═══════════════════════════════════════════════════════════════╣
-- ║  1. Right-click on 'staging_raw' table → Table Data Import   ║
-- ║  2. Select: cleaned_food_delivery_data.csv                   ║
-- ║  3. Encoding: UTF-8                                          ║
-- ║  4. Select "Use existing table: staging_raw"                 ║
-- ║  5. Map columns (should auto-match by name)                  ║
-- ║  6. Click Import → Verify: SELECT COUNT(*) FROM staging_raw; ║
-- ║     Expected result: 2000 rows                               ║
-- ╚═══════════════════════════════════════════════════════════════╝
--
-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  OPTION B: LOAD DATA LOCAL INFILE (if enabled on server)     ║
-- ╚═══════════════════════════════════════════════════════════════╝
-- Uncomment and update the path below:
--
-- LOAD DATA LOCAL INFILE 'C:/Users/asus/Desktop/sampath/cleaned_food_delivery_data.csv'
-- INTO TABLE staging_raw
-- CHARACTER SET utf8mb4
-- FIELDS TERMINATED BY ','
-- OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS
-- (Age, Gender, Marital_Status, Occupation, Monthly_Income, Education,
--  Family_Size, Medium, Restaurant_Type, Order_Time, Meal, Preference,
--  Ease_Convenient, Avg_Cost, Order_Hour, Days_Since_Prior, Cities,
--  Income_Level, Time_Period, Cost_Category, Order_Frequency,
--  City_Tier, High_Demand_Area);


-- ==============================================================================
-- STEP 5: NORMALIZE — Populate 3 tables from staging
-- ==============================================================================
-- Run these queries AFTER the CSV is loaded into staging_raw.

-- 5a. Populate restaurants (distinct types)
INSERT IGNORE INTO restaurants (restaurant_type)
SELECT DISTINCT Restaurant_Type
FROM staging_raw
WHERE Restaurant_Type IS NOT NULL
ORDER BY Restaurant_Type;

-- Verify:
-- SELECT * FROM restaurants;
-- Expected: ~10-12 unique restaurant types


-- 5b. Populate customers (distinct demographic profiles)
INSERT IGNORE INTO customers (
  age, gender, marital_status, occupation,
  monthly_income, education, family_size,
  income_level, city_tier, cities
)
SELECT DISTINCT
  Age, Gender, Marital_Status, Occupation,
  Monthly_Income, Education, Family_Size,
  Income_Level, City_Tier, Cities
FROM staging_raw
WHERE Age IS NOT NULL;

-- Verify:
-- SELECT COUNT(*) FROM customers;
-- Expected: fewer rows than 2000 (duplicates collapsed)


-- 5c. Populate orders (all rows, linked via FKs)
INSERT INTO orders (
  customer_id, restaurant_id,
  avg_cost, order_hour, days_since_prior,
  meal, medium, order_time, time_period,
  cost_category, order_frequency,
  preference, ease_convenient, high_demand_area
)
SELECT
  c.customer_id,
  r.restaurant_id,
  s.Avg_Cost, s.Order_Hour, s.Days_Since_Prior,
  s.Meal, s.Medium, s.Order_Time, s.Time_Period,
  s.Cost_Category, s.Order_Frequency,
  s.Preference, s.Ease_Convenient, s.High_Demand_Area
FROM staging_raw s
  INNER JOIN customers c
    ON  s.Age             = c.age
    AND s.Gender          = c.gender
    AND s.Marital_Status  = c.marital_status
    AND s.Occupation      = c.occupation
    AND s.Monthly_Income  = c.monthly_income
    AND s.Education       = c.education
    AND s.Family_Size     = c.family_size
    AND s.Income_Level    = c.income_level
    AND s.City_Tier       = c.city_tier
  INNER JOIN restaurants r
    ON s.Restaurant_Type  = r.restaurant_type;

-- Verify:
-- SELECT COUNT(*) FROM orders;
-- Expected: 2000 rows (same as original CSV)


-- ==============================================================================
-- STEP 6: CLEANUP — Drop staging table
-- ==============================================================================

DROP TABLE IF EXISTS staging_raw;


-- ==============================================================================
-- STEP 7: VERIFICATION QUERIES
-- ==============================================================================

-- 7a. Row counts
SELECT 'restaurants' AS table_name, COUNT(*) AS row_count FROM restaurants
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'orders', COUNT(*) FROM orders;

-- 7b. Sample JOIN (same query used by R connector)
SELECT
  o.order_id,
  c.age             AS Age,
  c.gender          AS Gender,
  c.marital_status  AS Marital_Status,
  c.occupation      AS Occupation,
  c.monthly_income  AS Monthly_Income,
  c.education       AS Education,
  c.family_size     AS Family_Size,
  o.medium          AS Medium,
  r.restaurant_type AS Restaurant_Type,
  o.order_time      AS Order_Time,
  o.meal            AS Meal,
  o.preference      AS Preference,
  o.ease_convenient AS Ease_Convenient,
  o.avg_cost        AS Avg_Cost,
  o.order_hour      AS Order_Hour,
  o.days_since_prior AS Days_Since_Prior,
  c.cities          AS Cities,
  c.income_level    AS Income_Level,
  o.time_period     AS Time_Period,
  o.cost_category   AS Cost_Category,
  o.order_frequency AS Order_Frequency,
  c.city_tier       AS City_Tier,
  o.high_demand_area AS High_Demand_Area
FROM orders o
  INNER JOIN customers c   ON o.customer_id  = c.customer_id
  INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LIMIT 10;

-- 7c. Business-level queries (usable in Power BI too)

-- Revenue by City Tier
SELECT c.cities, COUNT(*) AS total_orders, SUM(o.avg_cost) AS total_revenue
FROM orders o
  JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.cities
ORDER BY total_revenue DESC;

-- Orders by Hour (peak hour detection)
SELECT o.order_hour, COUNT(*) AS order_count, ROUND(AVG(o.avg_cost), 2) AS avg_revenue
FROM orders o
GROUP BY o.order_hour
ORDER BY o.order_hour;

-- Platform Market Share
SELECT o.medium, COUNT(*) AS orders, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM orders), 1) AS market_share_pct
FROM orders o
GROUP BY o.medium
ORDER BY orders DESC;


-- ==============================================================================
-- END OF SCHEMA
-- ==============================================================================
-- Next step: Run 00_db_connection.R in RStudio to fetch data via SQL JOIN.
