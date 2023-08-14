const OrderModel = require('../models/orderModel');

const currentMonthRevenue =async(currentMonthStratDate,now)=>{
    const currentMonthRevenue = await OrderModel.aggregate([
        {$match:{orderDate:{$gte:currentMonthStratDate,$lt:now},status:{$eq:"delivered"}}},
        // {$match:{orderDate:{$gte:currentMonthStratDate,$lt:now},status:{$eq:"delivered"}}},
        {$group:{_id:null,currentMonthRevenue:{$sum:"$totalPrice"}}}
    ])
    const result = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].currentMonthRevenue : 0;
    return result

}
const previousMonthRevenue = async(previousMonthStratDate,previousMonthEndDate)=>{
    const previousMonthRevenue = await OrderModel.aggregate([
      {$match:{orderDate:{$gte:previousMonthStratDate,$lt:previousMonthEndDate},status:{$eq:"delivered"}}},
      // {$match:{orderDate:{$gte:previousMonthStratDate,$lt:previousMonthEndDate},status:{$ne:"Pending"}}},
      {$group:{_id:null,previousMonthRevenue:{$sum:"$totalPrice"}}}
    ]);
    const result = previousMonthRevenue.length > 0 ? previousMonthRevenue[0].previousMonthRevenue : 0;
    return result;
  }

  const paymentMethodAmount  =async()=>{    const paymentMethodTotal =await OrderModel.aggregate([
        {$match:{status:{$eq:"delivered"}}},
        {$group:{_id:"$paymentMethod",amount:{$sum:"$totalPrice"}}}
    ])
    const result = paymentMethodTotal.length > 0 ? paymentMethodTotal : 0;
    return result;
  }
  const todayIncome = async(today, now) =>{
    const todayOrders = await OrderModel.aggregate([
      {$match:{orderDate:{$gte:today,$lt:now},status:{$eq:"delivered"}}},
      // {$unwind:"$products"},
      // {$group:{_id:null,todayIncome:{$sum:{$multiply:[{$toDouble:"$products.quantity"},{$toDouble:"$products.price"}]}}}},
      {$group:{_id:null,todayIncome:{$sum:"$totalPrice"}}},
      {$project:{todayIncome:1}}
    ]);
    const todayIncome = todayOrders.length > 0 ? todayOrders[0].todayIncome : 0;
    return todayIncome;
  }
  const yesterdayIncome = async(today,yesterday) =>{
    const yesterdayOrders = await OrderModel.aggregate([
      {$match:{orderDate:{$gte:yesterday,$lt:today},status:{$eq:"delivered"}}},
      {$unwind:"$products"},
      {$group:{_id:null,yesterdayIncome:{$sum:{$multiply:[{$toDouble:"$products.quantity"},{$toDouble:"$products.price"}]}}}},
      {$project:{yesterdayIncome:1}}
    ]);
    const yesterdayIncome = yesterdayOrders.length > 0 ? yesterdayOrders[0].yesterdayIncome : 0;
    return yesterdayIncome
  }
  const totalRevenue = async() =>{
    const revenue = await OrderModel.aggregate([
      {$match:{status:{$eq:"delivered"}}},
      {$group:{_id:null,revenue:{$sum:"$totalPrice"}}}
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].revenue : 0;
    return totalRevenue;
  }

  const dailyChart = async () =>{
    const dailyOrders = await OrderModel.aggregate([
      {$match:{status:{$eq:"delivered"}}},
      {$group:{_id:{$dateToString:{format:"%Y-%m-%d",date:"$orderDate"}},dailyrevenue:{$sum:"$totalPrice"}}},
      {$sort:{_id:1}},
      {$limit:14}
    ]);
  
    const result = dailyOrders || 0;
    return result;
  }

  const categorySales = async() => {
    const catSales = await OrderModel.aggregate([
      {$match:{status:{$eq:"delivered"}}},
      {$unwind:"$products"},
      {$lookup:{
        from:"products",
        localField:"products.product_id",
        foreignField:"_id",
        as: "categories"
      }},
      {$unwind:"$categories"},
      {$lookup:{
        from:"categories",
        localField:"categories.category",
        foreignField:"_id",
        as:"category"
      }},
      {$unwind:"$category"},
      {$group:{_id:"$category.categoryName",qty:{$sum:"$products.quantity"}}}
    ]);
    // console.log(catSales);  
    return catSales;
  }
  
  

module.exports={
    currentMonthRevenue,
    previousMonthRevenue,
    paymentMethodAmount,
    todayIncome,
    yesterdayIncome,
    totalRevenue,
    dailyChart,
    categorySales
}