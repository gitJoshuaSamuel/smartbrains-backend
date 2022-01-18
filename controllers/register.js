

const handleRegister=(req,res,db,bcrypt,knex)=>{
    console.log('in server register');
    const {email,password,name}=req.body;

    if(!email || !name || !password){
       return res.status(400).json('incorrect form submission');
    }

    const hash=bcrypt.hashSync(password);
    console.log(email);
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        })
    .into('login')
    .returning('email')
    .then(loginEmail=>{
        return trx('users')
        .returning('*')
        .insert({
            email:loginEmail[0].email,
            name:name,
            joined:new Date()
        })
        .then(user=>{
            res.json(user[0]);
        })
        
    })
    .then(trx.commit)
    .then(trx.rollback)
    .catch(err=>res.json('unable to register'))
    })
}


module.exports={
    handleRegister:handleRegister
};