const User = require("../models/user"),
    passport = require('passport'),
    parser = require("../api/parse");

let urlPrefix = process.env.url_prefix;

const makeUrl = (rem) => {
  if (!urlPrefix && !rem) { return "/"}
  else if (urlPrefix && !rem) {return urlPrefix}
  else if (!urlPrefix && rem) { return rem}
  else { return urlPrefix + rem}
}

const getUserParams = body => {
  return {
    name: {
      firstName: body.firstName,
      lastName: body.lastName
    },
    username: body.username,
    email: body.email,
    password: body.password,
  };
};

module.exports = {
    getLogin: (req, res, next) => {
       res.render('user/login') ;
    },
    postLogin: (req, res, next) => {
        next();
    },
    newUser: (req, res, next) => {
        res.render('user/create');
    },
    postNewUser: (req, res, next) => {
        let newUser = getUserParams(req.body);
        User.register(newUser, newUser.password, (error, user) => {
            if (user) {
                req.flash("success", "User created successfully");
                next();
            } else {
                req.flash("error", `${error.message}`);
                next();
            }
        })
    },

    userLogin: (req, res, next) => {
        passport.authenticate('local', {
          successRedirect: makeUrl(),
          successFlash: true,
          failureRedirect: makeUrl('/users/login'),
          failureFlash: true,
        })(req, res, next);
      },

      redirect: (req, res) => {
        res.redirect(makeUrl(res.locals.redirect));
      },

      logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.redirect(makeUrl());
      },

      getUser: async (req, res, next) => {
          let id = req.params.id;
          if (res.locals.currentUser && (res.locals.currentUser.isAdmin || (!res.locals.currentUser.isAdmin && res.locals.currentUser._id == req.params.id))) {
            try {
                let user = await User.findById(id);
                res.locals.user = user;
                res.render('user/singleUser');
            } catch (error) {
                req.flash("error", error.message);
                res.redirect(makeUrl());
            }
        } else { // if nothing
            req.flash("error", "Log in to access this user's information");
            res.redirect(makeUrl('/users/login'));
        }
      },

      editUser: async (req, res, next) => {
        let id = req.params.id;
        if (res.locals.currentUser && (res.locals.currentUser.isAdmin || (!res.locals.currentUser.isAdmin && res.locals.currentUser._id == req.params.id))) {
          try {
            let user = await User.findById(id);
            res.locals.user = user;
            res.render('user/edit');
          } catch (error) {
              req.flash("error", error.message);
              res.redirect(makeUrl());
          }
        } else {
          req.flash("error", "Log in to access this user's information");
          res.redirect(makeUrl("/users/login"));
        }
    },

    updateUser: async (req, res, next) => {
      let id = req.params.id;
      if (res.locals.currentUser && (res.locals.currentUser.isAdmin || (!res.locals.currentUser.isAdmin && res.locals.currentUser._id == req.params.id))) { 
        try {
          let user = getUserParams(req.body);
          let updatedUser = await User.findByIdAndUpdate(id, user);
          req.flash("success", "User updated successfully!")
          res.redirect(makeUrl(`/users/${id}`));
        } catch (error) {
          req.flash("error", error.message);
          res.redirect(makeUrl(`/users/${id}/edit`));
        }
      } else {
        req.flash("error", "Log in to access this user's information");
        res.redirect(makeUrl(`/users/${id}`));
      }
    },

    allUsers: async (req, res, next) => {
      if (res.locals.currentUser && (res.locals.currentUser.isAdmin || (!res.locals.currentUser.isAdmin && res.locals.currentUser._id == req.params.id))) {
        try {
        let allUsers = await User.find({});
        res.locals.allUsers = allUsers;
        console.log(res.locals.allUsers);
        res.render("user/allUsers");
        } catch (error) {
          req.flash("error", "There was an error getting the users");
          res.redirect(makeUrl());
        }
      } else {
        res.render("error/notFound");
      }
    }
}