module.exports = {
    isAdmin: (req, res, next) => {
        if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
            return 1;
        } else if (res.locals.currentUser && !res.locals.currentUser.isAdmin) {
            return 0;
        } else {
            return -1;
        }
    }
}