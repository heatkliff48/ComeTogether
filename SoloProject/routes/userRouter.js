const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const authUser = require('../middleware/authUser');

router
  .route('/registration')
  .get(async (req, res) => {
    res.render('registration');
  })
  .post(async (req, res) => {
    const { name, email, password, telegram } = req.body;
    if (name && email && password && telegram) {
      const hashPass = await bcrypt.hash(password, 10);
      try {
        const newUser = await User.create({
          name,
          email,
          telegram,
          password: hashPass,
        });
        req.session.user = {
          id: newUser.id,
          name: newUser.name,
          telegram: newUser.telegram,
        };
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(401).end();
      }
    } else {
      return res.sendStatus(401).end();
    }
  });
router
  .route('/login')
  .get(async (req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      try {
        const currentUser = await User.findOne({ where: { email } });
        if (currentUser && (await bcrypt.compare(password, currentUser.password))) {
          req.session.user = {
            id: currentUser.id,
            name: currentUser.name,
            telegram: currentUser.telegram,
          };
          return res.sendStatus(200);
        }
        return res.sendStatus(401).end();
      } catch (err) {
        return res.sendStatus(401).end();
      }
    } else {
      return res.sendStatus(401).end();
    }
  });

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('sesid').redirect('/');
});

module.exports = router;
