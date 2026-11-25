const fs=require("fs");
const n=JSON.parse(fs.readFileSync("nik_fixed.json"));
const xml=s=>s.normalize("NFC").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const ACT="הַמַּעֲשֶׂה שֶׁל הַיּוֹם.";
async function tts(voice,k,o){
 const f=`out/${voice}/${k}.mp3`; if(fs.existsSync(f)) return;
 const ssml=`<speak version="1.0" xml:lang="he-IL"><voice name="he-IL-${voice}Neural"><prosody rate="-6%">${xml(o.t)}.<break time="900ms"/>${xml(o.x)}<break time="1100ms"/>${ACT}<break time="400ms"/>${xml(o.a)}</prosody></voice></speak>`;
 for(let i=0;i<5;i++){
  const r=await fetch("https://eastus.tts.speech.microsoft.com/cognitiveservices/v1",{method:"POST",headers:{"Ocp-Apim-Subscription-Key":"proxy-injected","Content-Type":"application/ssml+xml","X-Microsoft-OutputFormat":"audio-24khz-48kbitrate-mono-mp3","User-Agent":"manginat"},body:ssml});
  if(r.ok){ fs.writeFileSync(f,Buffer.from(await r.arrayBuffer())); return; }
  console.log(k,voice,r.status); await new Promise(z=>setTimeout(z,3000*(i+1)));
 }
}
(async()=>{ for(const v of ["Hila","Avri"]){ fs.mkdirSync("out/"+v,{recursive:true}); for(const k in n) await tts(v,k,n[k]); } console.log("ok"); })();
