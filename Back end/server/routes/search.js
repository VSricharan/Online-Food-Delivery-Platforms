const express = require('express')
const { rawOrders } = require('../data')
const router = express.Router()

// GET /api/search?q=query
router.get('/', (req, res) => {
    const q = (req.query.q || '').toLowerCase().trim()
    if (!q || q.length < 2) return res.json({ results: [], query: q })

    const results = []

    // Search orders (limit 5)
    const matchedOrders = rawOrders.map((o, index) => {
        return {
            ...o,
            computedId: `ORD-${String(index + 1001).padStart(5, '0')}`
        };
    }).filter(o =>
        (o.Restaurant_Type || '').toLowerCase().includes(q) ||
        (o.Cities || '').toLowerCase().includes(q) ||
        (o.Medium || '').toLowerCase().includes(q) ||
        (o.Meal || '').toLowerCase().includes(q) ||
        o.computedId.toLowerCase().includes(q)
    ).slice(0, 5)

    matchedOrders.forEach(o => {
        results.push({
            type: 'order',
            id: o.computedId,
            title: `Order at ${o.Restaurant_Type || 'Unknown'}`,
            subtitle: `${o.Cities || 'Unknown'} · ${o.Medium || 'Unknown'} · ₹${o.Avg_Cost || '0'}`,
            icon: 'ShoppingBag',
            details: o,
        })
    })

    // Search restaurants
    const restaurants = [...new Set(rawOrders.map(o => o.Restaurant_Type).filter(Boolean))]
    const matchedRest = restaurants.filter(r => r.toLowerCase().includes(q)).slice(0, 3)
    matchedRest.forEach(r => {
        const count = rawOrders.filter(o => o.Restaurant_Type === r).length
        results.push({
            type: 'restaurant',
            id: r,
            title: r,
            subtitle: `${count} orders · Restaurant Type`,
            icon: 'Truck',
        })
    })

    // Search cities
    const cities = [...new Set(rawOrders.map(o => o.Cities).filter(Boolean))]
    const matchedCities = cities.filter(c => c.toLowerCase().includes(q)).slice(0, 2)
    matchedCities.forEach(c => {
        const count = rawOrders.filter(o => o.Cities === c).length
        results.push({
            type: 'city',
            id: c,
            title: c,
            subtitle: `${count} orders · City Region`,
            icon: 'Globe',
        })
    })

    res.json({ results, query: q, total: results.length })
})

module.exports = router
