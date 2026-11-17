export function validate(s){
 if(!s||s.version!==1||typeof s.name!=='string'||!s.name.trim())throw Error('Name and version 1 required.');
 for(const k of ['currency','source','review'])if(typeof s[k]!=='string')throw Error(k+' must be text.');
 if(!s.currency.trim())throw Error('Declare one currency or accounting unit.');
 if(!Number.isInteger(s.months)||s.months<1||s.months>120)throw Error('Use 1–120 whole months.');
 for(const k of ['startingCash','hourlyTimeValue'])if(typeof s[k]!=='number'||!Number.isFinite(s[k])||s[k]<0||s[k]>1e9)throw Error('Invalid '+k);
 if(!Array.isArray(s.experiments)||!s.experiments.length||s.experiments.length>30)throw Error('Use 1–30 experiments.');
 const names=new Set();
 for(const e of s.experiments){
  if(typeof e.name!=='string'||!e.name.trim()||names.has(e.name))throw Error('Unique experiment names required.');names.add(e.name);
  for(const k of ['startupCost','fixedMonthly','marketingMonthly','leadsMonthly','conversion','price','variableCost','feeRate','deliveryHours','availableHours','acquisitionHours','downsideMultiplier','upsideMultiplier'])
   if(typeof e[k]!=='number'||!Number.isFinite(e[k])||e[k]<0||e[k]>1e9)throw Error('Invalid '+k);
  if(e.conversion>1||e.feeRate>1||e.downsideMultiplier>1||e.upsideMultiplier<1||e.upsideMultiplier>100)throw Error('Invalid rate or scenario multiplier.');
  if(!Number.isInteger(e.paymentDelay)||e.paymentDelay<0||e.paymentDelay>24)throw Error('Payment delay must be 0–24 whole months.');
  if(e.acquisitionHours>e.availableHours)throw Error('Acquisition hours exceed available monthly hours.');
 }
 return s;
}
function simulate(s,e,label,multiplier){
 const requested=Math.floor(e.leadsMonthly*e.conversion*multiplier),capacity=e.deliveryHours===0?requested:Math.floor((e.availableHours-e.acquisitionHours)/e.deliveryHours),units=Math.min(requested,capacity);
 const gross=units*e.price,earned=gross*(1-e.feeRate),spend=e.fixedMonthly+e.marketingMonthly+units*e.variableCost,hours=e.acquisitionHours+units*e.deliveryHours;
 let cumulative=-e.startupCost,peakFunding=e.startupCost,firstRevenue=null;
 const series=[];
 for(let month=1;month<=s.months;month++){
  // Expenses are paid before this month's receipts; track intramonth cash shortfall.
  cumulative-=spend;peakFunding=Math.max(peakFunding,-cumulative);
  const receipts=month>e.paymentDelay?earned:0;cumulative+=receipts;
  if(receipts>0&&firstRevenue===null)firstRevenue=month;
  series.push({month,units,grossRevenue:gross,netEarned:earned,cashReceipts:receipts,cashExpenses:spend,cumulativeCashFlow:cumulative,cashBalance:s.startingCash+cumulative,ownerHours:hours});
 }
 const contribution=e.price*(1-e.feeRate)-e.variableCost;
 const operatingBreakEvenUnits=contribution>0?Math.ceil((e.fixedMonthly+e.marketingMonthly)/contribution):null;
 const paybackIndex=series.findIndex((r,i)=>r.cumulativeCashFlow>=0&&series.slice(i).every(x=>x.cumulativeCashFlow>=0));
 const receipts=series.reduce((a,r)=>a+r.cashReceipts,0),netEarned=earned*s.months,totalHours=hours*s.months;
 const r={experiment:e.name,scenario:label,unitsMonthly:units,unservedDemandMonthly:requested-units,grossRevenue:gross*s.months,netEarned,cashReceipts:receipts,receivables:netEarned-receipts,totalCashCost:e.startupCost+spend*s.months,netCashFlow:cumulative,peakFundingRequired:Math.max(0,peakFunding),additionalFundingRequired:Math.max(0,peakFunding-s.startingCash),firstReceiptMonth:firstRevenue,paybackMonth:paybackIndex<0?null:paybackIndex+1,operatingBreakEvenUnits,ownerHours:totalHours,timeAdjustedSurplus:netEarned-e.startupCost-spend*s.months-totalHours*s.hourlyTimeValue,series};
 if(Object.values(r).some(v=>typeof v==='number'&&!Number.isFinite(v)))throw Error('Inputs exceed numerical limits.');
 return r;
}
export function evaluate(s){validate(s);return s.experiments.flatMap(e=>[['Downside',e.downsideMultiplier],['Base',1],['Upside',e.upsideMultiplier]].map(([label,m])=>simulate(s,e,label,m)));}
export function csv(rows){
 const cols=['experiment','scenario','unitsMonthly','grossRevenue','netEarned','cashReceipts','receivables','totalCashCost','netCashFlow','peakFundingRequired','additionalFundingRequired','firstReceiptMonth','paybackMonth','operatingBreakEvenUnits','ownerHours','timeAdjustedSurplus'];
 const q=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 return [cols,...rows.map(r=>cols.map(k=>r[k]))].map(row=>row.map(q).join(',')).join('\r\n');
}
