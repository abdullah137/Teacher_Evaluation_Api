module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }else {
            // It is logged in already
            res.redirect('');
        }
    },

    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()) {
            res.redirect('/dashboard');
        }else {
            return next();
        }
    }
}