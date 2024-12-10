const { getUserTokenInfo } = require('../controllers/users');

const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            res.status(400).send({ message: 'Token is invalid' })
        }

        const userToken = await getUserTokenInfo(token);

        if (!userToken) {
            res.status(401).send({ message: 'User not found' });
            return;
        }

        req.userInfo = userToken ? userToken.user ? userToken.user['dataValues'] : null : null;

        next();
    } catch (error) {
        console.log('auth error >', error);
        return;
    }
}

module.exports = {
    userAuth
}