const { Item } = require('../db/models');
async function checkOwner(req, res, next) {
  if (req.body.id) {
    const { owner } = await Item.findOne({ where: { id: req.body.id } });
    if (owner !== req.session.user.id) {
      return res.redirect('/');
    }
    next();
  } else if (req.params.id) {
    const { owner } = await Item.findOne({ where: { id: req.params.id } });
    if (owner !== req.session.user.id) {
      return res.redirect('/');
    }
    next();
  }
}

module.exports = checkOwner;
