
const express = require('express');
const router = express.Router();
const VideoProgress = require('../models/video'); 
router.patch('/save', async (req, res) => {
  try {
    const {
      userid,
      userName,
      videoid,
      videotitle,
      videolength,
      videolastWatchedTime,
      videoprogress
    } = req.body;

    if (
      !userid || !userName || !videoid || !videotitle ||
      videolength == null || videolastWatchedTime == null || videoprogress == null
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updated = await VideoProgress.findOneAndUpdate(
      { userid, videoid },
      {
        userid,
        userName,
        videoid,
        videotitle,
        videolength,
        videolastWatchedTime,
        videoprogress
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Progress saved/updated', data: updated });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save or update progress' });
  }
});


router.get('/progress/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const progress = await VideoProgress.find({ userid });

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Could not fetch user progress' });
  }
});

module.exports = router;
