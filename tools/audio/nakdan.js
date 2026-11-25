const fs=require("fs");
const items=JSON.parse(fs.readFileSync(process.argv[2]));
const outF=process.argv[3]; const done=fs.existsSync(outF)?JSON.parse(fs.readFileSync(outF)):{};
async function nak(text){
 const r=await fetch("https://nakdan-5-1.loadbalancer.dicta.org.il/api",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:"nakdan",data:text,genre:"modern",addmorph:false,keepqq:false,nodageshdefmem:false,patachma:false,keepmetagim:true})});
 const j=await r.json(); return j.map(w=>w.sep||!w.options.length?w.word:w.options[0].replace(/\|/g,"")).join("");
}
(async()=>{for(const [k,it] of Object.entries(items)){ if(done[k]) continue;
 done[k]={t:await nak(it.t),x:await nak(it.x),a:await nak(it.a)};
 fs.writeFileSync(outF,JSON.stringify(done,null,1)); }
 console.log("done",Object.keys(done).length);})();
