const axios = require("axios"),
    qs = require("qs"),
    jwt = require("jsonwebtoken"),
    jwkToPem = require("jwk-to-pem"),
    api = require("../api/api"),
    middleware = require("../custom_middleware/middleware");

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

const keys = [{"alg":"RS256","e":"AQAB","kid":"0/d8/viN93l66uaTNpbSjHKtGfXVHDyX2fjhysppD0o=","kty":"RSA","n":"zFff9bD9pRjsmLIcT8GRWFXVpcNKQTlbrJBdmYkrNEUiNNml0SO5SwlrPvMAGlAlIQwhDkCDfHNdXwybee9uf74c_M4ODRi6MfEZ7QAfzpr64A2P-doWcdYdVjEzOezsbGH2J8kdyoQMxBI96Fpa4G4hJljfVH-w7mFRCQAwSWoQZbNRrXkA3Kytuf9uossOy8P2DO-1s12K-GtYE_h-VqnnWM4a9HBOSJZOk8cV-CXD8kzOyNk30Cq3WzOpgfrBjmx8jPhWcW1HfDOJsp6ZGk-LgYBnuZGgZspRrVxOaAZlnqXRKRmgHsTpU1eZ1nGX6GxNg6TKzsjRb3HJfAK09Q","use":"sig"},{"alg":"RS256","e":"AQAB","kid":"4+iVQ3riiKO9xYMTp0eCX62OGnzC8HlwKfj1VRM5LFg=","kty":"RSA","n":"oMomyq-FP3X8CcAJ4A-gxa1pjKJSyjeea_UQXrLfLHrqlzniyVuTsOQinFyzrNkw00tyayrC1m00CrjgaIwNScBXYf19QYYyMYVsrW4Z360rre_lkQtUOSgIlBeEERKC5ySmKYP_kfOWHvSfFOuEXH_R3tHV6WF3r73MXWZyqjUOyhWxi5SE2J3psmiMIL7YHMF3apLjK8DpZH0i4bDtN0pVqS34UoedUnl5F7wsvBUIh2pMXFypL7ou5CTYRuMzoUtbRD0J0QG2KAduD3L1x64lwYkYL3g8WjLKIHW_GeGxoD71ksRNz2sNw5IXUeH0HI3SJNXzg5uEfd2l_XOKbQ","use":"sig"}]

const loginUrl = `https://hayden-users.auth.us-east-1.amazoncognito.com/login?client_id=1fbcgp5ageie2cas98dsq65d9o&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=${process.env.loginRedirectUrl}`;

module.exports = {
    getLogin: (req, res, next) => {
       res.redirect(loginUrl);
    }, 

    loginWithToken: async (req, res, next) => {
      let code = req.query.code; // This code only lasts for five minutes and is used to get the JWT that we will later store in the user's browser.
      let data = qs.stringify({
        'grant_type': 'authorization_code',
        'client_id': '1fbcgp5ageie2cas98dsq65d9o',
        'code': code,
        'redirect_uri': 'https://u1r7jcqgp2.execute-api.us-east-1.amazonaws.com/latest/users/loginWithToken' 
      });
    
      var config = {
        method: 'post',
        url: 'https://hayden-users.auth.us-east-1.amazoncognito.com/oauth2/token',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Cookie': 'XSRF-TOKEN=6a3cafbb-3c2b-4d03-926e-6a948307dbc8'
        },
        data : data
      };
      
      axios(config)
      // Now we have the JWT, let's decode and verify it
      .then(function (response) {
        res.locals.id_token = response.data.id_token;
        res.locals.access_token = response.data.access_token;
        res.locals.refresh_token = response.data.refresh_token;
        res.locals.expires_in = response.data.expires_in;
      })
      .catch(function (error) {
        res.send(error.response.data);
      })
      .then(() => {
        let pem = jwkToPem(keys[1]);
        jwt.verify(res.locals.access_token, pem, function(err, decoded) {
          if (err) {res.send(err)};
          next();
        })
      })
      .catch(err => {
        res.send(err);
      });

      // After the access token is recieved, validate it. Then store it in the user's session. Then redirect to the home page.
    },

    setCookie: (req, res, next) => {
      res.cookie("access_token", res.locals.access_token, {httpOnly: true, secure: true, maxAge: 3600000});
      req.flash("success", "Successfully logged in!");
      res.redirect(middleware.makeUrl());
    },

    logout: (req, res, next) => {
      res.clearCookie('access_token');
      req.flash("success", "Successfully logged out!");
      res.redirect(middleware.makeUrl());
    },

    getMessages: async (req, res) => {
      if (res.locals.currentUser && (res.locals.currentUser.isAdmin || (!res.locals.currentUser.isAdmin && res.locals.currentUser._id == req.params.id))) {
        try {
          let mes = await api.scan("messages");
          res.locals.messages = mes.data;
          res.render("user/messages");
        } catch (error) {
          req.flash("error", error);
          res.redirect(middleware.makeUrl());
        }
      } else {
        res.render("error/notFound");
      }
    },

    postMessage: (req, res) => {
      let mess = req.body;
      mess['dateAdded'] = new Date().toLocaleDateString();
      api.create("messages", mess).then(() => {
        req.flash("success", "Message sent successfully!");
        res.redirect(middleware.makeUrl());
      }).catch(err => {
        res.flash("error", err);
        res.redirect(middleware.makeUrl());
      });
    },

    deleteMany: (req, res) => {
      let toDelete = [];
      for (mtd of req.body.messagesToDelete) {
        toDelete['_id'] = mtd;
      };
      api.delete("messages", toDelete).then((e) => {
        console.log(e);
        req.flash("success", "Messages deleted!");
        res.redirect(middleware.makeUrl("/users/messages"));
      }).catch(err => {
        console.log(err);
        req.flash("error", err);
        res.redirect(middleware.makeUrl("/users/messages"));
      });
    }
}