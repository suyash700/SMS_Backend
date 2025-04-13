
const Maintenance = require("../models/maintainance.model");


const self_maintain_middleware = async (req, res, next) => {
 
  try {

    // Fetch user details from the database
    const userselfMaintain = await Maintenance.findOne({user_id:req.userID});

    
    req.userMaintainData = userselfMaintain;
    req.userMaintainID = userselfMaintain._id;

    next();
  } catch (error) {
    console.error("Error in self_maintain_middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = self_maintain_middleware;