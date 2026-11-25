const fs=require("fs"),vm=require("vm"),crypto=require("crypto");
const L=fs.readFileSync(process.argv[2],"utf8").split("\n");
const s=L.findIndex(l=>l.startsWith("const POWERS")), e=L.findIndex(l=>l.startsWith("const ORD"));
const C=vm.runInNewContext(L.slice(s,e).join("\n")+"\n;({GUIDED})",{});
const steps=[...new Set(C.GUIDED.flatMap(g=>g.steps))];
const key=t=>crypto.createHash("sha1").update(t).digest("hex").slice(0,10);
fs.writeFileSync("guided_keys.txt",steps.map(key).join(" "));
const V={Nimrod:"ZiofZHcEBTn5sRySe5h8",Dalit:"MEuFCMd6dNJqQaLoEa8r"};
const jobs=[]; for(const v in V){ fs.mkdirSync("out_el/"+v,{recursive:true}); for(const t of steps) jobs.push([v,key(t),t]); }
console.log("steps",steps.length,"jobs",jobs.length,"chars",steps.join("").length*2);
async function one([v,k,text]){ const f=`out_el/${v}/${k}.mp3`; if(fs.existsSync(f)) return;
  for(let i=0;i<6;i++){ try{ const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${V[v]}?output_format=mp3_44100_64`,{method:"POST",headers:{"xi-api-key":"proxy-injected","Content-Type":"application/json"},body:JSON.stringify({text:require("./fixes.js")(text,v),model_id:"eleven_v3",language_code:"he"})});
    if(r.ok){ fs.writeFileSync(f,Buffer.from(await r.arrayBuffer())); return; } console.log(v,k,r.status,(await r.text()).slice(0,150)); }catch(e){ console.log(v,k,e.message); }
    await new Promise(z=>setTimeout(z,4000*(i+1))); } }
(async()=>{ let i=0; const w=async()=>{ while(i<jobs.length) await one(jobs[i++]); }; await Promise.all([w(),w(),w()]); console.log("done"); })();
