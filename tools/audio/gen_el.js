const fs=require("fs");
const it=JSON.parse(fs.readFileSync("items.json"));
const V={Nimrod:"ZiofZHcEBTn5sRySe5h8",Dalit:"MEuFCMd6dNJqQaLoEa8r"};
const jobs=[];
for(const v in V){ fs.mkdirSync("out_el/"+v,{recursive:true});
  jobs.push([v,"sample","בין הגירוי לתגובה יש רגע. אתה בתוכו עכשיו."]);
  for(const k in it){ const o=it[k]; jobs.push([v,k,`${o.t}.\n\n${o.x}\n\nהמעשה של היום. ${o.a}`]); } }
async function one([v,k,text]){ const f=`out_el/${v}/${k}.mp3`; if(fs.existsSync(f)) return;
  for(let i=0;i<6;i++){
    try{ const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${V[v]}?output_format=mp3_44100_64`,{method:"POST",headers:{"xi-api-key":"proxy-injected","Content-Type":"application/json"},body:JSON.stringify({text:require("./fixes.js")(text,v),model_id:"eleven_v3",language_code:"he"})});
      if(r.ok){ fs.writeFileSync(f,Buffer.from(await r.arrayBuffer())); return; }
      console.log(v,k,r.status,(await r.text()).slice(0,150)); }catch(e){ console.log(v,k,e.message); }
    await new Promise(z=>setTimeout(z,4000*(i+1))); } }
(async()=>{ let i=0; const w=async()=>{ while(i<jobs.length) await one(jobs[i++]); }; await Promise.all([w(),w(),w()]); console.log("done"); })();
