const User = require("../models/user"),
    passport = require('passport');

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
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash("success", "User created successfully");
                next();
            } else {
                req.flash("error", `${error.message}`);
                res.redirect("/users/new");
            }
        })
    },

    userLogin: (req, res, next) => {
        passport.authenticate('local', {
          successRedirect: '/',
          successFlash: true,
          failureRedirect: '/users/login',
          failureFlash: true,
        })(req, res, next);
      },

      redirect: (req, res) => {
        res.redirect(`${res.locals.redirect}`);
      },

      logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.redirect('/');
      },

      getUser: async (req, res, next) => {
          let id = req.params.id;
          if (res.locals.currentUser && (res.locals.currentUser.isAdmin || (!res.locals.currentUser.isAdmin && res.locals.currentUser._id == req.params.id))) {
            try {
                let user = await User.findById(id);
                res.locals.user = user;
                console.log(user);
                res.render('user/singleUser');
            } catch (error) {
                req.flash("error", error.message);
                res.redirect(`/`);
            }
        } else { // if nothing
            req.flash("error", "Log in to access this user's information");
            res.redirect("/users/login");
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
              res.redirect('/');
          }
        } else {
          req.flash("error", "Log in to access this user's information");
          res.redirect("/users/login");
        }
    },

    updateUser: async (req, res, next) => {
      let id = req.params.id;
      if (res.locals.currentUser && (res.locals.currentUser.isAdmin || (!res.locals.currentUser.isAdmin && res.locals.currentUser._id == req.params.id))) { 
        try {
          let user = getUserParams(req.body);
          let updatedUser = await User.findByIdAndUpdate(id, user);
          req.flash("success", "User updated successfully!")
          res.redirect(`/users/${id}`);
        } catch (error) {
          req.flash("error", error.message);
          res.redirect(`/users/${id}/edit`);
        }
      } else {
        req.flash("error", "Log in to access this user's information");
        res.redirect(`/users/${id}`);
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
          res.render('/');
        }
      } else {
        res.render("error/notFound");
      }
    }
}