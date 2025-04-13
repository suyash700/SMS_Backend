const Maintenance = require('../models/maintainance.model')
const User = require("../models/user.model")


    const self_maintainance = async (req, res) => {
        try {
          // const userData = await User.find({});
          const maintainData = req.userMaintainData;
          console.log(maintainData);
          return res.status(200).json( maintainData );
        } catch (error) {
          console.log(` error from user route ${error}`);
        }
      };
    



    

module.exports= {self_maintainance}