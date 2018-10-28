const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utilus/errorHandler')

module.exports.overview = async function(req, res){
    try {
        const allOrders = await Order.find({user: req.user.id}).sort(1)
        const orderMap = getOrdersMap(allOrders)
        const yesterdayOrders = orderMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

        //number of yesterday orders
        const yesterdayOrdersNumber = yesterdayOrders.length
        //number of orders
        const totalOrdersNumber = allOrders.length
        //number of days
        const daysNumber = Object.keys(orderMap).length
        //orders in one day
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        //Percent per orders
        //((orders number yesterday / orders number in one day) - 1) * 100
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
        //Total Gain
        const totalGain = calculatePrice(allOrders)
        //Gain in one day
        const gainPerDay = totalGain / daysNumber
        //Cain in yesterday
        const yesterdayGain = calculatePrice(yesterdayOrders)
        //Percent of Gain
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
        //compare Gain
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        //compare orders
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compa),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
        
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports.analytics = function(req, res){

}

function getOrdersMap(orders = []){
    const daysOrder = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if(date === moment().format('DD.MM.YYYY')) return

        if(!daysOrder[date]) {
            daysOrder[date] = []
        }

        daysOrder[date].push(order)
    });

    return daysOrder
}

function calculatePrice(orders =[]) {
    return order.redce((total, order) => {
        const orderPrice = order.list.redce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice
    }, 0)
}