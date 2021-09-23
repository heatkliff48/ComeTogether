const { UserPlaylist } = require('../db/models');
async function checkOwner(req, res, next) {
  const { owner } = await UserPlaylist.findOne({
    where: { id: req.params.id },
  });
  if (owner !== req.session.user.id) {
    return res.redirect('/');
  }
  next();
}

module.exports = checkOwner;
