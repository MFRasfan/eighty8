const { default: mongoose } = require('mongoose');
const Notification = require('../model/notification');

const getNotifications= async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {};
    if (userId) {
      query['user.id'] = userId;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

      
      const filteredNotifications = notifications.map(notification => {
      
        const matchedUserIds = notification.user.filter(user =>{
            console.log(user.id, mongoose.Types.ObjectId(userId))

            return user.id.equals(userId);
        }); 
        
        
        return { ...notification.toObject(), user: matchedUserIds };
    });

    const unreadNotificationCount = notifications.reduce((count, notification) => {
        const matchedUser = notification.user.find(user => user.id.equals(userId));
        if (matchedUser && !matchedUser.read) {
          return count + 1;
        }
        return count;
      }, 0);
    res.json({
        data: filteredNotifications,
        unRead:unreadNotificationCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateReadStatus = async (req, res) => {
    try {
      const { userId } = req.query;
      const filter = { 'user.id': userId };
      const update = { $set: { 'user.$.read': true } };
  
      const updatedNotification = await Notification.updateMany(
        filter,
        update,
        { new: true }
      ).exec();
  
      if (updatedNotification) {
        res.json(updatedNotification);
      } else {
        res.status(404).json({ error: 'Notification not found' });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  
  
module.exports = {getNotifications,updateReadStatus};
