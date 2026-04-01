const express = require('express')
const { rawOrders } = require('../data')
const router = express.Router()

// Enrich rawOrders with display-friendly fields
const ORDERS = rawOrders.map((o, i) => ({
    id: `ORD-${String(i + 1001).padStart(5, '0')}`,
    customer: `Customer ${o.Gender || 'M'}, Age ${o.Age || 25}`,
    restaurant: o.Restaurant_Type || 'Restaurant',
    orderTime: o.Order_Time || 'Lunch',
    timePeriod: o.Time_Period || 'Afternoon',
    hour: parseInt(o.Order_Hour) || 12,
    avgCost: parseFloat(o.Avg_Cost) || 200,
    medium: o.Medium || 'Swiggy',
    meal: o.Meal || 'Lunch',
    city: o.Cities || 'Tier 1',
    frequency: o.Order_Frequency || 'Daily',
    status: o.High_Demand_Area === 'Yes' || o.High_Demand_Area === 'TRUE' ? 'delivered' : ['delivered', 'in-transit', 'preparing'][i % 3],
    highDemand: o.High_Demand_Area === 'Yes' || o.High_Demand_Area === 'TRUE',
    predictedDeliveryMin: 20 + Math.round(Math.random() * 25),
    costCategory: o.Cost_Category || 'Medium',
    preference: o.Preference || 'Online Payment',
    easiness: o.Ease_Convenient || 'Agree',
}))

// GET /api/orders
router.get('/', (req, res) => {
    const { page = 1, limit = 20, status = '', q = '', city = '', medium = '' } = req.query

    let filtered = ORDERS

    // Filter by search query
    if (q) {
        const query = q.toLowerCase()
        filtered = filtered.filter(o =>
            o.id.toLowerCase().includes(query) ||
            o.restaurant.toLowerCase().includes(query) ||
            o.customer.toLowerCase().includes(query) ||
            o.medium.toLowerCase().includes(query) ||
            o.city.toLowerCase().includes(query) ||
            o.timePeriod.toLowerCase().includes(query) ||
            o.meal.toLowerCase().includes(query) ||
            o.status.toLowerCase().includes(query) ||
            o.costCategory.toLowerCase().includes(query) ||
            o.frequency.toLowerCase().includes(query) ||
            String(o.avgCost).includes(query)
        )
    }

    // Filter by status
    if (status) filtered = filtered.filter(o => o.status === status)

    // Filter by city
    if (city) filtered = filtered.filter(o => o.city.toLowerCase().includes(city.toLowerCase()))

    // Filter by platform
    if (medium) filtered = filtered.filter(o => o.medium.toLowerCase() === medium.toLowerCase())

    // Paginate
    const total = filtered.length
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const start = (pageNum - 1) * limitNum
    const data = filtered.slice(start, start + limitNum)

    res.json({
        data,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            hasNext: start + limitNum < total,
            hasPrev: pageNum > 1,
        },
        filters: {
            statuses: ['delivered', 'in-transit', 'preparing'],
            cities: [...new Set(ORDERS.map(o => o.city))],
            mediums: [...new Set(ORDERS.map(o => o.medium))],
        }
    })
})

module.exports = router
