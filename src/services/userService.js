import db from "../models/index";
import bcrypt from'bcryptjs';

let handUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};

            let isExist =await checkUserEmail(email);
            if (isExist) {
                // user already exists

                let user = await db.User.findOne({
                    attributes: ['email','roleID', 'password'],
                    where: {email: email},
                    raw:true
                })
                if (user) {
                    // comparepassword
                    let check = await bcrypt.compareSync(user.password, password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';

                        delete user.password;
                        userData.user=user;
                    }else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                }else{
                    userData.errCode=2;
                    userData.errMessage = "User's not found"
                }
            }else{
                userData.errCode=1;
                userData.errMessage=`Your's email isn't exist in your system. Please try other email`
            }
            resolve(userData)
        }catch(e){
            reject(e)
        }
    })
}



let checkUserEmail = (userEmail) => {
    return new ProgressEvent(async (resolve , reject)=>{
        try{
            let user =await db.User.findOne({
                where: {email: userEmail}
            })
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        }catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    handUserLogin: handUserLogin
}