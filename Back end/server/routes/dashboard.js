const express = require('express')
const { stats, charts } = require('../data')
const router = express.Router()

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
    res.json({
        totalOrders: stats.totalOrders,
        predictedDemand: stats.predictedDemand,
        preferences: stats.preferences,
        satisfactionScore: stats.satisfactionScore,
        avgOrderValue: stats.avgOrderValue,
        highDemandOrders: stats.highDemandOrders,
        changes: {
            totalOrders: '+12.5%',
            predictedDemand: '+23.4%',
            preferences: 'Active Configs',
            satisfactionScore: '+3.2%',
        }
    })
})

// GET /api/dashboard/demand  — weekly demand trend for chart
router.get('/demand', (req, res) => {
    res.json({ data: charts.weeklyDemand })
})

module.exports = router
