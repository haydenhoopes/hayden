const Mango = require('../models/mango');

const getMangoParams = body => {
    return {
      date: body.date,
      source: body.source,
      type: body.type,
      category: body.category,
      paymentMethod: body.paymentMethod,
      description: body.description,
      isNormal: body.isNormal,
      amount: body.amount,
      who: body.who
    };
  };

module.exports = {
    mangoes: async (req, res, next) => {
        let transactions = await Mango.find({});
        res.locals.mangoes = transactions;
        res.render("mango/mangoes");
    },

    add: (req, res) => {
        res.render("mango/add");
    },

    addMango: (req, res, next) => {
        let mango = getMangoParams(req.body);
        if (mango.isNormal == "on") {
            mango.isNormal = true;
        } else {
            mango.isNormal = false;
        };
        Mango.create(mango).then(mango => {
            req.flash('success', "Mango planted successfully!");
            res.redirect("/mangoes");
        }).catch(error => {
            req.flash('error', error.message);
            res.render('mango/add');
        })
    },

    getSingleMango: async (req, res, next) => {
        let id = req.params.id;
            try {
                let user = await User.findById(id);
                res.locals.user = user;
                console.log(user);
                res.render('user/singleUser');
            } catch (error) {
                req.flash("error", error.message);
                res.redirect(`/`);
            }
        }
}