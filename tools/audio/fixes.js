// Pronunciation fixes, applied only to the text sent for reading (the app text is unchanged).
// Per voice: a word a voice misreads gets vowels here, and the affected items are regenerated.
const H="א-ת";
const RULES={
  Dalit:[[new RegExp(`(^|[^${H}])(ו?)שאל(?![${H}])`,"g"),(m,a,v)=>a+(v?"וּ":"")+"שְׁאַל"]],
  Nimrod:[]
};
module.exports=(text,voice)=>(RULES[voice]||[]).reduce((t,[re,f])=>t.replace(re,f),text);
module.exports.touches=(text,voice)=>module.exports(text,voice)!==text;
