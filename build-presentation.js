const pptxgen = require('pptxgenjs');
const path = require('path');
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Form & Frame';
pptx.subject = 'Product, growth and operating proposal';
pptx.title = 'Form & Frame — Make it real';
pptx.company = 'Form & Frame';
pptx.lang = 'en-GB';
pptx.theme = { headFontFace: 'Cambria', bodyFontFace: 'Arial', lang: 'en-GB' };
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
const C = { ink:'171716', paper:'F7F6F2', clay:'B86A3B', fog:'D5D2CA', muted:'77746D', olive:'4A4C46', gold:'E2AF75' };
const root = __dirname, asset = name => path.join(root, 'assets', name);
const hero = asset('burnham-before-after.png'); const chimney = asset('chimney-before-after.png'); const charcoal = asset('charcoal-before-after.png');
function rect(s,x,y,w,h,fill,line){s.addShape(pptx.ShapeType.rect,{x,y,w,h,fill:{color:fill},line:{color:line||fill}})}
function text(s,t,x,y,w,h,opts={}){s.addText(t,{x,y,w,h,margin:0,fontFace:opts.fontFace||'Arial',fontSize:opts.fontSize||14,color:opts.color||C.ink,bold:opts.bold||false,italic:opts.italic||false,breakLine:false,fit:'shrink',valign:opts.valign||'mid',paraSpaceAfterPt:0,align:opts.align||'left'})}
function label(s,t,x,y,w,color=C.clay){text(s,t,x,y,w,.18,{fontFace:'Courier New',fontSize:8,color,bold:true})}
function title(s,t,x,y,w,h=1.2,color=C.ink){text(s,t,x,y,w,h,{fontFace:'Cambria',fontSize:36,color})}
function slide(n){const s=pptx.addSlide();s.background={color:C.paper};text(s,`FORM & FRAME  /  ${String(n).padStart(2,'0')}`,.55,7.05,3,.14,{fontFace:'Courier New',fontSize:7,color:C.muted});return s}

// 1. Cover
{const s=slide(1);s.background={color:C.ink};s.addImage({path:hero,x:6.85,y:0,w:6.483,h:7.5,transparency:4});rect(s,6.85,0,6.483,7.5,C.ink);s.addShape(pptx.ShapeType.rect,{x:6.85,y:0,w:6.483,h:7.5,fill:{color:C.ink,transparency:50},line:{color:C.ink,transparency:100}});label(s,'PRODUCT + GROWTH PROPOSAL',.7,.7,3,C.gold);title(s,'Make the wall\nworth the room.',.7,1.25,6,1.7,'FFFFFF');text(s,'A digital-first local interior-fit-out brand built to turn intent into consultations, visualised concepts and premium installations.',.7,3.45,5.2,.7,{fontSize:17,color:'D8D4CB'});text(s,'FORM & FRAME\nSLOUGH, BERKSHIRE · 2026',.7,6.15,3,.45,{fontFace:'Courier New',fontSize:9,color:C.gold});}

// 2 Product
{const s=slide(2);label(s,'THE PRODUCT',.65,.55,2);title(s,'More than a website.\nA consultative sales engine.',.65,.9,7.3,1.2);text(s,'The experience removes the usual friction between inspiration and a site visit: customers can see the work, define the brief and arrive at the conversation more prepared.',.65,2.25,5.7,.7,{fontSize:15,color:C.muted});s.addImage({path:chimney,x:7.8,y:.55,w:4.9,h:2.8});const items=[['01','VISUAL PROOF','Real before/after projects make the value visible.'],['02','GUIDED CONFIGURATOR','Customers explore TV, storage, fire and lighting choices.'],['03','QUALIFIED ENQUIRY','Budget, postcode, timings and photos arrive in one brief.'],['04','HUMAN HANDOVER','Book a free visit; the trade team confirms and closes.']];items.forEach((a,i)=>{const x=.65+(i%2)*3.55,y=3.55+Math.floor(i/2)*1.35;label(s,a[0],x,y,.3);text(s,a[1],x+.45,y,2.6,.2,{fontSize:11,bold:true});text(s,a[2],x+.45,y+.3,2.6,.55,{fontSize:11,color:C.muted});});}

// 3 Experience
{const s=slide(3);s.background={color:'252522'};label(s,'THE CUSTOMER JOURNEY',.65,.55,3,C.gold);title(s,'A simple path\nfrom “I like this” to “visit booked”.',.65,.9,6.5,1.25,'FFFFFF');const flow=[['01','DISCOVER','Meta ad / Google / referral'],['02','BELIEVE','Before + after proof'],['03','CONFIGURE','Build a first concept'],['04','BOOK','Choose a consultation slot'],['05','CONVERT','Site visit → quote → install']];flow.forEach((a,i)=>{const x=.65+i*2.5;rect(s,x,3.55,2.1,1.5,i===4?C.clay:'343530');label(s,a[0],x+.17,3.78,.4,i===4?'FFFFFF':C.gold);text(s,a[1],x+.17,4.12,1.7,.23,{fontSize:13,bold:true,color:'FFFFFF'});text(s,a[2],x+.17,4.48,1.6,.35,{fontSize:10,color:'D8D4CB'});if(i<4)text(s,'→',x+2.18,4.2,.25,.2,{fontSize:19,color:C.gold,align:'center'});});text(s,'The website’s job is not to replace the craftsperson. It makes the first conversation better, and protects time for the appointments most likely to convert.',.65,6.05,8,.48,{fontSize:14,color:'C8C5BD'});}

// 4 Platform
{const s=slide(4);label(s,'SCALABLE OPERATING MODEL',.65,.55,3);title(s,'One local launch.\nA repeatable operating system.',.65,.9,6.4,1.15);const nodes=[['CUSTOMER LAYER','Portfolio · configurator · chatbot · booking'],['LEAD LAYER','Enquiries · concept saves · uploads · qualification'],['TEAM LAYER','Calendar · estimate queue · installer allocation'],['GROWTH LAYER','Pixel events · audiences · reporting · retargeting']];nodes.forEach((a,i)=>{const y=2.4+i*1.05;rect(s,.65,y,5.25,.72,i===0?'E9E6DE':'FFFFFF',C.fog);text(s,a[0],.88,y+.14,1.45,.18,{fontFace:'Courier New',fontSize:8,color:C.clay,bold:true});text(s,a[1],2.25,y+.12,3.25,.22,{fontSize:12});if(i<3)text(s,'↓',3.1,y+.72,.3,.25,{fontSize:18,color:C.clay,align:'center'});});s.addImage({path:charcoal,x:7.05,y:1.05,w:5.63,h:4.55});text(s,'Scale by duplicating the operating playbook into nearby towns — not by adding more manual chasing.',7.05,6.1,4.9,.45,{fontSize:15,color:C.muted});}

// 5 marketing
{const s=slide(5);s.background={color:C.ink};label(s,'GO-TO-MARKET · META ADS',.65,.55,3,C.gold);title(s,'Sell the transformation,\nnot the construction.',.65,.9,6.8,1.15,'FFFFFF');const columns=[['AWARENESS','Short before/after reels\nLocal radius: Slough + 20 mi\nCreative: reveal, fire glow, storage'],['CONSIDERATION','Carousel: 3 wall layouts\nLanding: project detail + visualiser\nProof: reviews, process, finish'],['CONVERSION','Click-to-message + booking\nLead form with postcode + budget\nRetarget saved concepts & video viewers']];columns.forEach((a,i)=>{const x=.65+i*4.15;rect(s,x,3.15,3.6,2.2,i===2?C.clay:'2B2C29');label(s,`0${i+1}`,x+.2,3.42,.3,i===2?'FFFFFF':C.gold);text(s,a[0],x+.2,3.78,2.9,.24,{fontSize:14,bold:true,color:'FFFFFF'});text(s,a[1],x+.2,4.28,3.0,.75,{fontSize:12,color:'DDD9D1'});});text(s,'Initial test plan: 3 concepts × 2 hooks × 2 audiences. Keep the strongest visual proof, then optimise toward booked consultations—not cheap clicks.',.65,6.05,9.6,.45,{fontSize:14,color:'C9C6BE'});}

// 6 roadmap
{const s=slide(6);label(s,'90-DAY LAUNCH PLAN',.65,.55,3);title(s,'Make it useful.\nThen make it repeatable.',.65,.9,6.4,1.15);const plan=[['DAYS 1–30','FOUNDATION','Deploy site, analytics, calendar, CRM pipeline, local GBP optimisation. Photograph 6 finished jobs.'],['DAYS 31–60','DEMAND','Launch Meta creative tests and retargeting. Publish 3 case studies. Train bot handover and lead response.'],['DAYS 61–90','SYSTEMISE','Review lead-to-visit and visit-to-quote conversion. Standardise quote templates. Expand radius only when capacity holds.']];plan.forEach((p,i)=>{const x=.65+i*4.15;rect(s,x,3.2,3.65,2.35,'FFFFFF',C.fog);label(s,p[0],x+.22,3.45,1.2);text(s,p[1],x+.22,3.8,2.7,.25,{fontSize:14,bold:true});text(s,p[2],x+.22,4.32,3.1,.78,{fontSize:11,color:C.muted});});text(s,'Success signals: more enquiry completeness · faster first response · stronger site-visit rate · richer portfolios · measurable cost per booked consultation.',.65,6.25,10,.35,{fontSize:13,color:C.muted});}

// 7 Close
{const s=slide(7);s.background={color:'E3B37A'};label(s,'THE DECISION',.7,.7,2,'4A2B18');title(s,'Build the local category leader.',.7,1.25,8,1,'25170D');text(s,'The opportunity is to turn a highly visual craft into a more discoverable, more credible and more operationally efficient service business.',.7,2.55,6.5,.65,{fontSize:17,color:'4A2B18'});const next=[['01','Confirm brand name, domain and offer'],['02','Connect calendar, CRM and Resend email'],['03','Shoot / generate a launch portfolio'],['04','Launch local Meta test campaigns']];next.forEach((n,i)=>{text(s,n[0],.7,3.85+i*.55,.35,.2,{fontFace:'Courier New',fontSize:9,color:'4A2B18',bold:true});text(s,n[1],1.25,3.82+i*.55,4.5,.25,{fontSize:14,color:'25170D'});});s.addImage({path:hero,x:8.2,y:.7,w:4.45,h:5.95});text(s,'FORM & FRAME  /  READY TO BUILD',.7,6.65,3.5,.18,{fontFace:'Courier New',fontSize:8,color:'4A2B18'});}

pptx.writeFile({ fileName: path.join(root, 'Form-and-Frame-Product-Growth-Proposal.pptx') });
