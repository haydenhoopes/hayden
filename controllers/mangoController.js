// const Mango = require('../models/mango');
// const Budget = require('../models/budget');

// const dateFormat = require('dateformat');
// const { render } = require('ejs');
// const AWS = require('aws-sdk');
// AWS.config.update({region:'us-east-1', profile:'hayden'});
// const db = new AWS.DynamoDB.DocumentClient({});

// const getMangoParams = body => {
//     return {
//       date: body.date,
//       source: body.source,
//       type: body.type,
//       category: body.category,
//       paymentMethod: body.paymentMethod,
//       description: body.description,
//       isNormal: body.isNormal,
//       amount: body.amount,
//       who: body.who,
//       tithing: body.tithing
//     };
//   },
//     getMangoFields = allMangos => {
//         return allMangos.map(mango => {
//             return {
//                 source: mango.source,
//                 type: mango.type,
//                 category: mango.category,
//                 paymentMethod: mango.paymentMethod,
//                 description: mango.description,
//                 isNormal: mango.isNormal,
//                 amount: mango.amount.toFixed(2),
//                 who: mango.who,
//                 date: dateFormat(mango.date, "mm/dd/yy"),
//                 _id: mango._id,
//                 tithing: mango.tithing
//             }
//         })
//     },
//     getTotal = transactions => {
//         let total = 0;
//         transactions.forEach(transaction => {
//             total+= transaction.amount;
//         });
//         return Number(total);
//     },
//     tithing = transactions => {
//         let tithingPaid = 0;
//         let tithingDue = 0;
//         transactions.forEach(transaction => {
//             if (transaction.type == "Income") {
//                 tithingDue += transaction.amount * .1;
//             } else {
//                 tithingPaid += transaction.amount;
//             };
//         });
//         return tithingDue - tithingPaid;
//     },
//     balance = transactions => {
//         let income = 0;
//         let expenses = 0;
//         transactions.forEach(transaction => {
//             if (transaction.type == "Income") {
//                 income += transaction.amount;
//             } else {
//                 expenses += transaction.amount;
//             };
//         });
//         return (income - expenses).toFixed(2);
//     };

// module.exports = {
//     mangoes: async (req, res, next) => {
//         let transactions = await Mango.find({}).sort({ _id: -1 });
//         let mangoes = getMangoFields(transactions);
//         res.locals.mangoes = mangoes;
//         res.locals.title = "Mangoes";
//         res.locals.total = balance(transactions);
//         res.render("mango/mangoes");
//     },

//     add: (req, res) => {
//         res.locals.title = "Add Mango";
//         res.render("mango/add");
//     },

//     addMango: (req, res, next) => {
//         let mango = getMangoParams(req.body);
//         if (mango.isNormal == "on") {
//             mango.isNormal = true;
//         } else {
//             mango.isNormal = false;
//         };
//         if (mango.tithing == "on") {
//             mango.tithing = true;
//         } else {
//             mango.tithing = false;
//         };
//         Mango.create(mango).then(mango => {
//             req.flash('success', "Mango planted successfully!");
//             res.redirect("/mangoes");
//         }).catch(error => {
//             req.flash('error', error.message);
//             res.redirect("/mangoes");
//         })
//     },

//     getSingleMango: async (req, res, next) => {
//         let id = req.params.id;
//             try {
//                 let mango = await Mango.findById(id);
//                 mango = getMangoFields([mango])[0];
//                 mango.date = dateFormat(mango.date, "yyyy-mm-dd");
//                 res.locals.mango = mango;
//                 res.locals.title = `Edit Mango`;
//                 res.render('mango/singleMango');
//             } catch (error) {
//                 req.flash("error", error.message);
//                 res.redirect(`/`);
//             }
//         },
//     getExpenses: async (req, res) => {
//         let expenses = await Mango.find({type: "Expense"}).sort({ _id: -1 });
//         console.log(expenses);
//         let mangoes = getMangoFields(expenses);
//         res.locals.mangoes = mangoes;
//         res.locals.title = "Expenses";
//         res.locals.total = getTotal(expenses).toFixed(2);
//         res.render("mango/mangoes");
//     },
//     getIncome: async (req, res) => {
//         let income = await Mango.find({type: "Income"}).sort({ _id: -1 });
//         let mangoes = getMangoFields(income);
//         res.locals.mangoes = mangoes;
//         res.locals.title = "Income";
//         res.locals.total = getTotal(income).toFixed(2);
//         res.render("mango/mangoes");
//     },

//     delete: async (req, res) => {
//         try {
//             await Mango.findByIdAndDelete(req.params.id);
//             req.flash('success', "Mango deleted successfully!");
//             res.redirect("/mangoes");
//         } catch (error) {
//             req.flash('error', error.message);
//             res.redirect("/mangoes");
//         }
//     },

//     updateMango: async (req, res) => {
//         let mango = getMangoParams(req.body);
//         if (mango.isNormal == "on") {
//             mango.isNormal = true;
//         } else {
//             mango.isNormal = false;
//         };
//         if (mango.tithing == "on") {
//             mango.tithing = true;
//         } else {
//             mango.tithing = false;
//         };
//         try {
//             await Mango.findByIdAndUpdate(req.params.id, mango);
//             req.flash('success', "Mango updated successfully!");
//             res.redirect("/mangoes");
//         } catch (error) {
//             req.flash('error', error.message);
//             res.render("/mangoes");
//         }
//     },
//     getTithing: async (req, res) => {
//         try {
//             let tithingMangoes = await Mango.find({tithing: true});
//             let mangoes = getMangoFields(tithingMangoes);
//             res.locals.mangoes = mangoes;
//             res.locals.title = "Tithing";
//             res.locals.total = tithing(mangoes).toFixed(2);
//             res.render("mango/mangoes");
//         } catch (error) {
//             req.flash('error', error.message);
//             res.redirect('/mangoes');
//         }
//     },
//     budgetPage: async (req, res) => {
//         let currentDate = new Date();
//         let month = String(currentDate.getMonth()) + String(currentDate.getFullYear);
//     },
//     test: async (req, res) => {
//         let d = await db.scan({
//             TableName: 'projects'
//           }).promise();
//         res.send({
//             "statusCode": 200,
//             "headers": {'Content-Type': 'text/json'},
//             "body": d
//         });
//     }
// }