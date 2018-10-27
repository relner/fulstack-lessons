const Order = require('../models/Order')
const errorHandler = require('../utilus/errorHandler')

// (get) localhost:5000/api/order?offset=30&limit=50
module.exports.getAll = async function(req, res){

    const query = {
        user: req.user.id
    }

    //date of start
    if(req.query.start){
        query.date = {
            //$gte bolshe ili ravno
            $gte: req.query.start
        }
    }

    if(req.query.end){
        if(!query.date) query.date = {}
        //$gte menshe ili ravno
        query.date['$lte'] = req.query.end
    }

    if(req.query.order){
        query.order = +req.query.order
    }

    try {
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset)
            .limit(+req.query.limit) // + == parseInt()

        res.status(200).json(orders)

    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports.create = async function(req, res){
    try {
        const lastOrder = await Order.findOne({user: req.user.id}).sort({date: -1})
        const maxOrder = lastOrder ? lastOrder.order : 0

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save()
        res.status(201).json(order)
    } catch (error) {
        errorHandler(res, error)
    }
} 