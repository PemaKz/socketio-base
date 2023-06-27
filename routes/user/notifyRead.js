const lang = require("../../lang");
const { UserNotification } = require("../../models");

module.exports = async (io, socket, params) => {
  try{
    let { notification_id } = params;
    if(!notification_id) throw new Error("Notification ID is required");
    if(!socket.user) throw new Error("User not found");
    const notification = await UserNotification.findOne({
      where: {
        id: notification_id,
        user_id: socket.user.id
      }
    });
    if(!notification) throw new Error("Notification not found");
    notification.read = true;
    await notification.save();
    return null;
  } catch(e){
    console.log(e);
    throw e;
  }
};