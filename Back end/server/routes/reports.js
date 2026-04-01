const express = require('express')
const { charts } = require('../data')
const path = require('path')
const router = express.Router()

const REPORTS = [
    {
        id: 'monthly-demand',
        title: 'Monthly Demand Report',
        description: 'Order volume trends, demand forecasts and peak period analysis',
        icon: 'TrendingUp',
        color: 'blue',
        lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        size: '2.4 MB',
        category: 'Demand',
    },
    {
        id: 'delivery-efficiency',
        title: 'Delivery Efficiency Report',
        description: 'Delivery time analysis, route performance and driver utilisation',
        icon: 'Truck',
        color: 'green',
        lastGenerated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        size: '1.8 MB',
        category: 'Operations',
    },
    {
        id: 'customer-analytics',
        title: 'Customer Analytics Report',
        description: 'Customer demographics, ordering patterns and satisfaction metrics',
        icon: 'Users',
        color: 'purple',
        lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        size: '3.1 MB',
        category: 'Customers',
    },
    {
        id: 'ml-model-performance',
        title: 'ML Model Performance Report',
        description: 'Model accuracy, precision, recall and prediction confidence metrics',
        icon: 'BarChart2',
        color: 'orange',
        lastGenerated: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        size: '0.9 MB',
        category: 'ML Models',
    },
    {
        id: 'revenue-analysis',
        title: 'Revenue Analysis Report',
        description: 'Revenue by city, restaurant type, platform and time period',
        icon: 'DollarSign',
        color: 'emerald',
        lastGenerated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        size: '1.5 MB',
        category: 'Finance',
    },
]

// GET /api/reports
router.get('/', (req, res) => {
    res.json({ reports: REPORTS })
})

// GET /api/reports/download/:id?format=csv|pdf
router.get('/download/:id', (req, res) => {
    const { id } = req.params
    const format = (req.query.format || 'csv').toLowerCase()

    // Generate CSV content based on report type
    let csvContent = ''
    const report = REPORTS.find(r => r.id === id)
    if (!report) return res.status(404).json({ error: 'Report not found' })

    if (id === 'monthly-demand') {
        csvContent = 'Week,Actual Orders,Predicted Orders\n'
        charts.weeklyDemand.forEach(w => {
            csvContent += `Week ${w.week},${w.actual},${w.predicted}\n`
        })
    } else if (id === 'customer-analytics') {
        csvContent = 'City,Total Orders\n'
        Object.entries(charts.ordersByCity).sort((a,b)=>b[1]-a[1]).forEach(([city, count]) => {
            csvContent += `${city},${count}\n`
        })
        csvContent += '\nOrder Frequency,Total Users\n'
        Object.entries(charts.orderFrequency).sort((a,b)=>b[1]-a[1]).forEach(([freq, count]) => {
            csvContent += `${freq},${count}\n`
        })
    } else if (id === 'delivery-efficiency') {
        csvContent = 'Time Period,Total Orders\n'
        Object.entries(charts.ordersByTimePeriod).sort((a,b)=>b[1]-a[1]).forEach(([tp, count]) => {
            csvContent += `${tp},${count}\n`
        })
        csvContent += '\nHour of Day,Total Orders\n'
        Object.entries(charts.ordersByHour).forEach(([hour, count]) => {
            csvContent += `${hour}:00,${count}\n`
        })
    } else if (id === 'revenue-analysis') {
        csvContent = 'Restaurant Type,Total Orders,Total Revenue (RS)\n'
        Object.entries(charts.ordersByRestaurant).sort((a,b)=>b[1].revenue-a[1].revenue).forEach(([type, data]) => {
            csvContent += `${type},${data.count},${Math.round(data.revenue)}\n`
        })
        csvContent += '\nPlatform,Total Orders\n'
        Object.entries(charts.ordersByPlatform).sort((a,b)=>b[1]-a[1]).forEach(([plat, count]) => {
            csvContent += `${plat},${count}\n`
        })
    } else {
        // ML model report - use model_comparison data
        const dataPath = path.join(__dirname, '../../model_comparison.csv')
        try {
            const fs = require('fs')
            csvContent = fs.readFileSync(dataPath, 'utf8')
        } catch {
            csvContent = 'Model,Accuracy,Precision,Recall,F1_Score,AUC_ROC\nRandom Forest,0.9433,0.8883,0.9458,0.916,0.9737\n'
        }
    }

    const filename = `${id}_${new Date().toISOString().slice(0, 10)}.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(csvContent)
})

module.exports = router
