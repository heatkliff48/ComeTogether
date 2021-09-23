const router = require('express').Router();
const { response } = require('express');
const { User, Event } = require('../db/models');
router.post('/', async (req, res) => {
  const { title, text } = req.body.myData;
  const coordinatx = req.body.coords[0];
  const coordinaty = req.body.coords[1];
  try {
    const event = await Event.create({
      title,
      text,
      owner: req.session.user.id,
      coordinatx,
      coordinaty,
    });
    res.json(event);
  } catch (err) {
    console.log(err);
  }
});
router.get('/mark', async (req, res) => {
  const mark = await Event.findAll({ include: [{ model: User }] });
  res.json(mark);
});

module.exports = router;
