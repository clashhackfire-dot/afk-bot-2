const express=require('express');
const mineflayer=require('mineflayer');
const config=require('./config.json');
const app=express();
app.use(express.static('public'));
let status='CONNECTING',lastDisconnect='None',connectedAt=null,bot;
function createBot(){
 status='CONNECTING';
 bot=mineflayer.createBot(config);
 bot.once('spawn',()=>{status='ONLINE';connectedAt=Date.now();});
 bot.on('end',(r)=>{status='OFFLINE';lastDisconnect=String(r||'Disconnected');setTimeout(createBot,5000);});
 bot.on('error',(e)=>{lastDisconnect=e.message;});
}
createBot();
app.get('/api/status',(req,res)=>res.json({
 status,username:config.username,
 server:`${config.host}:${config.port}`,
 uptimeSeconds:connectedAt?Math.floor((Date.now()-connectedAt)/1000):0,
 lastDisconnect
}));
app.listen(process.env.PORT||10000);
