const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const dataDir = path.join(__dirname, '..')

function readCsv(filename) {
    try {
        const content = fs.readFileSync(path.join(dataDir, filename), 'utf8')
        return parse(content, { columns: true, skip_empty_lines: true, trim: true })
    } catch (e) {
        console.warn(`⚠️  Could not read ${filename}:`, e.message)
        return []
    }
}

// Load all data at startup
const rawOrders = readCsv('cleaned_food_delivery_data.csv')
const hourStats = readCsv('powerbi_hour_stats.csv')
const cityStats = readCsv('powerbi_city_stats.csv')
const platformStats = readCsv('powerbi_platform_stats.csv')
const restaurantStats = readCsv('powerbi_restaurant_stats.csv')
const predictions = readCsv('powerbi_predictions.csv')
const regressionResults = readCsv('regression_results.csv')
const classificationResults = readCsv('classification_results.csv')
const segmentationSummary = readCsv('segmentation_summary.csv')

console.log(`✅ Data Warehouse Loaded:`)
console.log(`   - ${rawOrders.length} base orders`)
console.log(`   - ${hourStats.length} hourly data points`)
console.log(`   - ${cityStats.length} city tiers`)
console.log(`   - ${platformStats.length} platforms`)
console.log(`   - ${predictions.length} forecast points`)

// Derive dashboard stats
const totalOrders = rawOrders.length
const highDemand = rawOrders.filter(r => String(r.High_Demand_Area) === '1').length
const avgCost = rawOrders.reduce((s, r) => s + parseFloat(r.Avg_Cost || 0), 0) / totalOrders
const satisfactionMap = { 'Strongly Agree': 5, 'Agree': 4, 'Neutral': 3, 'Disagree': 2, 'Strongly Disagree': 1 }
const satisfactionAvg = rawOrders.reduce((s, r) => s + (satisfactionMap[r.Ease_Convenient] || 3), 0) / totalOrders
const satisfactionPct = Math.round((satisfactionAvg / 5) * 100 * 10) / 10

// Hourly distribution (for charts)
const ordersByHour = {}
rawOrders.forEach(o => {
    const h = parseInt(o.Order_Hour)
    if (!isNaN(h)) ordersByHour[h] = (ordersByHour[h] || 0) + 1
})

// City breakdown
const ordersByCity = {}
rawOrders.forEach(o => {
    const c = o.Cities || 'Unknown'
    ordersByCity[c] = (ordersByCity[c] || 0) + 1
})

// Restaurant breakdown
const ordersByRestaurant = {}
rawOrders.forEach(o => {
    const r = o.Restaurant_Type || 'Other'
    if (!ordersByRestaurant[r]) ordersByRestaurant[r] = { count: 0, revenue: 0 }
    ordersByRestaurant[r].count++
    ordersByRestaurant[r].revenue += parseFloat(o.Avg_Cost || 0)
})

// Platform breakdown
const ordersByPlatform = {}
rawOrders.forEach(o => {
    const p = o.Medium || 'Other'
    ordersByPlatform[p] = (ordersByPlatform[p] || 0) + 1
})

// Time period breakdown
const ordersByTimePeriod = {}
rawOrders.forEach(o => {
    const t = o.Time_Period || 'Other'
    ordersByTimePeriod[t] = (ordersByTimePeriod[t] || 0) + 1
})

// Order frequency breakdown
const orderFrequency = {}
rawOrders.forEach(o => {
    const f = o.Order_Frequency || 'Other'
    orderFrequency[f] = (orderFrequency[f] || 0) + 1
})

// Weekly demand trend (directly from powerbi_predictions.csv)
const weeklyDemand = predictions.map(p => ({
    week: p.Week,
    actual: parseInt(p.Actual_Orders || 0),
    predicted: parseInt(p.Predicted_Orders || 0)
}))

module.exports = {
    rawOrders,
    hourStats,
    cityStats,
    platformStats,
    restaurantStats,
    predictions,
    regressionResults,
    classificationResults,
    segmentationSummary,
    stats: {
        totalOrders,
        highDemandOrders: highDemand,
        avgOrderValue: Math.round(avgCost * 100) / 100,
        satisfactionScore: satisfactionPct,
        predictedDemand: Math.round(totalOrders * 1.23),
        preferences: 14,
    },
    charts: {
        ordersByHour,
        ordersByCity,
        ordersByRestaurant,
        ordersByPlatform,
        ordersByTimePeriod,
        orderFrequency,
        weeklyDemand,
    }
}
