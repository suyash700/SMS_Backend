const adminMiddleware = async (req,res,next) => {
    console.log("auth midde ",req.user);
    const role = req.user.isAdmin
   console.log(role);
   
    if(!role){
      return  res.status(403).json({message:"Access denied. user is not an admin"})
    }
    next();
    
}
module.exports = adminMiddleware