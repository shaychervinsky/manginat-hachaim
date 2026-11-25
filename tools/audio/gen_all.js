// Records every missing file: each daily item (all pools, Hanukkah, Omer, holidays) and each guided step,
// in masculine and feminine address, in both voices. Key = sha1 of the text read (10 hex). Skips existing files.
// Usage: node gen_all.js <index.html>   (writes all_keys.txt; run with NODE_USE_ENV_PROXY=1)
const fs=require("fs"),vm=require("vm"),crypto=require("crypto"),fix=require("./fixes.js");
const src=fs.readFileSync(process.argv[2],"utf8"),L=src.split("\n");
const FEM=JSON.parse(src.match(/const FEM = (\{.*?\});\n/)[1]);const f=t=>FEM[t]||t;
const s=L.findIndex(l=>l.startsWith("const POWERS")), e=L.findIndex(l=>l.startsWith("const ORD"));
const C=vm.runInNewContext(L.slice(s,e).join("\n")+"\n;({POWERS,HANUKKAH,MONTHLY,GUIDED,OMER,HOLIDAYS})",{});
const key=t=>crypto.createHash("sha1").update(t).digest("hex").slice(0,10);
const items=[...C.POWERS.flatMap(p=>p.items),...C.HANUKKAH,...C.OMER,...Object.values(C.HOLIDAYS),...Object.values(C.MONTHLY).flatMap(m=>Object.values(m).flat())];
const texts=new Map();
for(const o of items) for(const t of [[o.t,o.x,o.a],[f(o.t),f(o.x),f(o.a)]]) texts.set(key(t.join("|")),`${t[0]}.\n\n${t[1]}\n\nהמעשה של היום. ${t[2]}`);
for(const st of C.GUIDED.flatMap(g=>g.steps)) for(const t of [st,f(st)]) texts.set(key(t),t);
texts.set("sample","בין הגירוי לתגובה יש רגע. אתה בתוכו עכשיו.");
fs.writeFileSync("all_keys.txt",[...texts.keys()].filter(k=>k!=="sample").join(" "));
const V={Nimrod:"ZiofZHcEBTn5sRySe5h8",Dalit:"MEuFCMd6dNJqQaLoEa8r"};
const jobs=[];for(const v in V){fs.mkdirSync("out_el/"+v,{recursive:true});for(const [k,t] of texts) if(!fs.existsSync(`out_el/${v}/${k}.mp3`)) jobs.push([v,k,t]);}
console.log("texts",texts.size,"missing jobs",jobs.length,"chars",jobs.reduce((n,j)=>n+j[2].length,0));
if(process.argv[3]==="--dry") process.exit(0);
async function one([v,k,text]){ const fl=`out_el/${v}/${k}.mp3`;
  for(let i=0;i<6;i++){ try{ const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${V[v]}?output_format=mp3_44100_64`,{method:"POST",headers:{"xi-api-key":"proxy-injected","Content-Type":"application/json"},body:JSON.stringify({text:fix(text,v),model_id:"eleven_v3",language_code:"he"})});
    if(r.ok){ fs.writeFileSync(fl,Buffer.from(await r.arrayBuffer())); return; } console.log(v,k,r.status,(await r.text()).slice(0,150)); }catch(e){ console.log(v,k,e.message); }
    await new Promise(z=>setTimeout(z,4000*(i+1))); } }
(async()=>{ let i=0; const w=async()=>{ while(i<jobs.length) await one(jobs[i++]); }; await Promise.all([w(),w(),w()]); console.log("done"); })();
