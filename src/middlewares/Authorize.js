// Authorize to protect Roles
const providerize = (req, res, next) => {
    if (req.user && req.user.role === 'provider') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as a provider');
    }
};

module.exports = providerize;