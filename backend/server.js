const MongoClient=require('mongodb').MongoClient;
const express=require('express');
const path=require('path');
const app=express();
const port=3000;
const url = 'mongodb://localhost:27017';
const database='football';
const pages_dir = path.resolve(__dirname, "..", "frontend", "pages");
const public_dir = path.resolve(__dirname, "..", "frontend", "notpages");
app.use(express.static(public_dir));
app.use(express.urlencoded({ extended: false }));
app.get('/',(req,res)=>{
    res.sendFile(path.join(pages_dir,'tempindex.html'));
})
app.get('/addplayer',(req,res)=>{
    res.sendFile(path.join(pages_dir,'addPlayer.html'));
})
app.get('/deleteplayer',(req,res)=>{
    res.sendFile(path.join(pages_dir,'deletePlayer.html'));
})
app.get('/updateplayer',(req,res)=>{
    res.sendFile(path.join(pages_dir,'updatePlayer.html'));
})
app.get('/Signin',(req,res)=>{
    res.sendFile(path.join(pages_dir,'Signin.html'));
})
app.get('/Signup',(req,res)=>{
    res.sendFile(path.join(pages_dir,'Signup.html'));
})
app.get('/indexpage',(req,res)=>{
    res.sendFile(path.join(pages_dir,'index.html'));
})





app.get('/addPlayertoleague',(req,res)=>{
    MongoClient.connect(url, (err,client)=>{
        const db=client.db(database);
        const collection=db.collection("league");
        collection.insertOne({name:`${req.query.name}`,age:`${req.query.age}`,team:`${req.query.team}`,id:`${req.query.id}`},(err)=>{
            if(err) {throw err}
        });
    });
    res.end();
});
app.get('/updatePlayerinfo',(req,res)=>{
    MongoClient.connect(url,(err,client)=>{
        const db=client.db(database);
        const collection=db.collection("league");
        let cnt;
        collection.countDocuments({id:`${req.query.id}`}).then(res=>cnt=res);
        if(cnt!=0){collection.updateMany({id:`${req.query.id}`},{
            $set:{"age":req.query.age,"team":req.query.team
        }})}
        else{throw "Failed"}
    });
    res.end();
})

app.get('/deletePlayerinfo',(req,res)=>{
    MongoClient.connect(url,(err,client)=>{
        const db=client.db(database);
        const collection=db.collection('league');
        let cnt;
        collection.countDocuments({id:`${req.query.id}`}).then(res=>cnt=res);
        if(cnt!=0){collection.deleteMany({id:req.query.id});}
        else{throw "no"}
    })
    res.end();
})

app.get('/viewPlayers',(req,res)=>{
    MongoClient.connect(url,(err,client)=>{
        const db=client.db(database);
        const collection=db.collection('league');
        collection.find({}).toArray(function(err,docs){
            res.send(docs);
        });
    
    });
})
function signuptemp(collection,username,password){
    collection.find({username:`${username}`}).toArray().then(result=>{
        if(result.length==0){
            collection.insertOne({username:`${username}`,password:`${password}`});
            return true;
        }
        else{
            return false;
        }
    }).then(result=>result);
}
app.post('/addUser',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    MongoClient.connect(url,(err,client)=>{
        const db=client.db(database);
        const collection=db.collection('users');
        res.send(signuptemp(collection,username,password));
    });
});
async function Signintemp(collection,user,pass){
    var returnvalue;
    await collection.find({username:`${user}`}).toArray().then(result=>{
        if(result.length==0){
            return null;
        }
        else if(pass.localeCompare(result[0].password)!=0){
            return false;
        }
        else{
            answer={
                username:result[0].username,
                password:result[0].password
            };
            return answer
        }
    }).then(result2=>returnvalue=result2);
    return returnvalue;
}
app.post('/Signinuser',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    let data;
    MongoClient.connect(url,async (err,client)=>{
        const db=client.db(database);
        const collection=db.collection('users');
        await Signintemp(collection,username,password).then(res=>data=res);
        res.send(data);
    });
});

app.listen(port,()=>{
    console.log('League is started connected!');
})