"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, Download, X, Save, Wallet, Megaphone, ClipboardList, Building2, Users, CalendarDays } from "lucide-react";

type Kind = "ads"|"finance"|"tasks"|"tenant"|"kol"|"agenda";
type Row = Record<string, any>;

const seed = {
  ads: [
    {phase:"Phase 1",platform:"Instagram",budget:4000000,objective:"Awareness",audience:"Palu + Sulawesi Tengah",reach:"60K–100K",content:"Teaser / Reels",start:"2026-09-14",end:"2026-10-15",notes:""},
    {phase:"Phase 2",platform:"TikTok",budget:3000000,objective:"Engagement",audience:"17–40, beauty & fashion",reach:"50K–90K",content:"Short video / creator",start:"2026-10-16",end:"2026-11-15",notes:""},
    {phase:"Phase 3",platform:"Instagram + Facebook + TikTok",budget:2000000,objective:"Event conversion",audience:"Palu + luar Sulawesi Tengah",reach:"35K–70K",content:"Countdown / event highlight",start:"2026-11-16",end:"2026-11-26",notes:""}
  ],
  finance: [],
  tasks: [
    {task:"Finalisasi venue & layout",description:"",deadline:"2026-10-01",pic:"Event Team",status:"In Progress",progress:60,priority:"High",notes:""},
    {task:"Canvassing Brand Beauty",description:"",deadline:"2026-10-15",pic:"Partnership",status:"In Progress",progress:45,priority:"High",notes:""},
    {task:"Canvassing Media Partner",description:"",deadline:"2026-10-20",pic:"Marketing",status:"Not Started",progress:0,priority:"Medium",notes:""}
  ],
  tenant: [],
  kol: [],
  agenda: []
};

const fieldLabels:Record<string,string> = {
  phase:"Phase",platform:"Platform",budget:"Budget",objective:"Objective",audience:"Audience",
  reach:"Estimated Reach",content:"Content Type",start:"Start Date",end:"End Date",notes:"Notes",
  type:"Type",description:"Description",category:"Category",amount:"Amount",date:"Date",
  task:"Task",deadline:"Deadline",pic:"PIC",status:"Status",progress:"Progress (%)",
  priority:"Priority",name:"Name",contact:"Contact",phone:"Phone",email:"Email",instagram:"Instagram",
  package:"Package",price:"Price",payment:"Payment Status",followers:"Followers",engagement:"Engagement",
  location:"Location",fee:"Fee",activity:"Activity",startTime:"Start Time",endTime:"End Time"
};

const fields:Record<Kind,string[]> = {
  ads:["phase","platform","budget","objective","audience","reach","content","start","end","notes"],
  finance:["type","description","category","amount","date","notes"],
  tasks:["task","description","deadline","pic","status","progress","priority","notes"],
  tenant:["name","pic","phone","email","instagram","category","package","price","payment","status","notes"],
  kol:["name","platform","followers","engagement","category","location","contact","fee","status","notes"],
  agenda:["date","startTime","endTime","activity","pic","location","description","status"]
};

const fmt=(n:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n||0));

function initial(kind:Kind):Row {
  if(kind==="finance") return {type:"Expense",description:"",category:"Operasional",amount:0,date:"2026-09-18",notes:""};
  if(kind==="tasks") return {task:"",description:"",deadline:"2026-11-01",pic:"",status:"Not Started",progress:0,priority:"Medium",notes:""};
  if(kind==="tenant") return {name:"",pic:"",phone:"",email:"",instagram:"",category:"Beauty",package:"",price:0,payment:"Belum Bayar",status:"Prospect",notes:""};
  if(kind==="kol") return {name:"",platform:"Instagram",followers:0,engagement:"",category:"Beauty",location:"Palu",contact:"",fee:0,status:"Prospect",notes:""};
  if(kind==="agenda") return {date:"2026-11-26",startTime:"09:00",endTime:"10:00",activity:"",pic:"",location:"Atrium Palu Grand Mall",description:"",status:"Planned"};
  return {phase:"Phase 1",platform:"Instagram",budget:0,objective:"Awareness",audience:"",reach:"",content:"",start:"2026-09-14",end:"2026-10-15",notes:""};
}

function download(name:string,text:string,type="application/json"){
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([text],{type}));
  a.download=name;a.click();URL.revokeObjectURL(a.href);
}

export function Dashboard(){
  const [tab,setTab]=useState("Dashboard");
  const [data,setData]=useState(seed);
  // Persist CRUD changes in this browser until Supabase persistence is connected.
  useEffect(()=>{try{const saved=localStorage.getItem("beauty-palu-2026-data");if(saved)setData(JSON.parse(saved));}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem("beauty-palu-2026-data",JSON.stringify(data));}catch{}},[data]);
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState<{kind:Kind,index:number|null,row:Row,mode:"edit"|"view"}|null>(null);
  const [eventEdit,setEventEdit]=useState(false);
  const [event,setEvent]=useState({name:"Beauty Palu 2026",date:"2026-11-26",venue:"Atrium Palu Grand Mall",concept:"Luxury Beauty Event / High-End Brand Partnership",audience:"Perempuan 17–40 tahun, beauty & fashion enthusiast, masyarakat umum Palu dan sekitarnya.",area:"Palu, Sulawesi Tengah + audience luar Palu / Sulawesi Tengah"});

  const totalAds=data.ads.reduce((s,r)=>s+Number(r.budget||0),0);
  const income=data.finance.filter(r=>r.type==="Income").reduce((s,r)=>s+Number(r.amount||0),0);
  const expense=data.finance.filter(r=>r.type==="Expense").reduce((s,r)=>s+Number(r.amount||0),0);
  const prep=Math.round(data.tasks.reduce((s,r)=>s+Number(r.progress||0),0)/(data.tasks.length||1));

  const setRows=(kind:Kind, updater:(rows:Row[])=>Row[]) =>
    setData(d=>({...d,[kind]:updater(d[kind])} as any));

  const add=(kind:Kind)=>setModal({kind,index:null,row:initial(kind),mode:"edit"});
  const edit=(kind:Kind,index:number)=>setModal({kind,index,row:{...data[kind][index]},mode:"edit"});
  const view=(kind:Kind,index:number)=>setModal({kind,index,row:{...data[kind][index]},mode:"view"});
  const remove=(kind:Kind,index:number)=>{
    if(confirm("Apakah Anda yakin ingin menghapus data ini?")) setRows(kind,r=>r.filter((_,i)=>i!==index));
  };
  const save=()=>{
    if(!modal)return;
    setRows(modal.kind,r=>{
      const next=[...r];
      if(modal.index===null) next.push(modal.row); else next[modal.index]=modal.row;
      return next;
    });
    setModal(null);
  };

  const filtered=(kind:Kind)=>data[kind].map((r,i)=>({r,i})).filter(x=>JSON.stringify(x.r).toLowerCase().includes(search.toLowerCase()));

  const exportCsv=(kind:Kind)=>{
    const rows=data[kind], cols=[...new Set(rows.flatMap(r=>Object.keys(r)))];
    const csv=[cols.join(","),...rows.map(r=>cols.map(c=>`"${String(r[c]??"").replaceAll('"','""')}"`).join(","))].join("\n");
    download(`beauty-palu-${kind}.csv`,csv,"text/csv;charset=utf-8");
  };

  const nav=[
    ["Dashboard","Dashboard"],["Detail Event","Event"],["Buying Plan Ads","ads"],
    ["Finance","finance"],["Task & Timeline","tasks"],["Tenant","tenant"],
    ["Influencer / KOL","kol"],["Agenda / Schedule","agenda"]
  ];

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="mark">BP</div><div><b>Beauty Palu</b><span>2026 Management</span></div></div>
      <div className="nav">{nav.map(([label,key])=><button key={key} className={tab===label?"active":""} onClick={()=>setTab(label)}>{label}</button>)}</div>
      <div className="side-bottom"><button onClick={()=>download("beauty-palu-2026-backup.json",JSON.stringify(data,null,2))}><Download size={16}/> Backup JSON</button></div>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">EVENT MANAGEMENT SYSTEM</p><h1>{tab}</h1></div><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari data..."/></div></header>

      {tab==="Dashboard" && <section>
        <div className="hero"><div><span className="pill">26 NOVEMBER 2026</span><h2>{event.name}</h2><p>{event.venue} · {event.concept}</p></div><CalendarDays size={42}/></div>
        <div className="cards">
          <Card icon={<Megaphone/>} title="Ads Budget" value={fmt(totalAds)} note="Instagram · TikTok · Facebook"/>
          <Card icon={<Wallet/>} title="Balance" value={fmt(income-expense)} note={`Income ${fmt(income)} · Expense ${fmt(expense)}`}/>
          <Card icon={<ClipboardList/>} title="Preparation" value={`${prep}%`} note={`${data.tasks.length} task`}/>
          <Card icon={<Building2/>} title="Tenant" value={String(data.tenant.length)} note="Brand Beauty"/>
          <Card icon={<Users/>} title="Influencer / KOL" value={String(data.kol.length)} note="Partnership"/>
        </div>
        <div className="grid2"><Panel title="Target Audience"><p>Perempuan 17–40 tahun, beauty & fashion enthusiast, masyarakat umum Palu dan sekitarnya, serta audience luar Palu / Sulawesi Tengah.</p></Panel><Panel title="Quick Actions"><div className="actions"><button onClick={()=>add("ads")}><Plus/> Ads Plan</button><button onClick={()=>add("finance")}><Plus/> Finance</button><button onClick={()=>add("tasks")}><Plus/> Task</button><button onClick={()=>add("tenant")}><Plus/> Tenant</button></div></Panel></div>
      </section>}

      {tab==="Event" && <Panel title="Detail Event"><div className="detail"><b>Nama Event</b><span>{event.name}</span><b>Tanggal</b><span>{new Date(event.date+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</span><b>Venue</b><span>{event.venue}</span><b>Konsep</b><span>{event.concept}</span><b>Target Audience</b><span>{event.audience}</span><b>Target Area</b><span>{event.area}</span></div><div className="toolbar"><button className="primary" onClick={()=>setEventEdit(v=>!v)}><Pencil size={16}/> {eventEdit?"Tutup Edit":"Edit Event"}</button></div>{eventEdit&&<div className="form-grid">{([["name","Nama Event"],["date","Tanggal"],["venue","Venue"],["concept","Konsep"],["audience","Target Audience"],["area","Target Area"]] as const).map(([k,l])=><label key={k}>{l}<input type={k==="date"?"date":"text"} value={event[k]} onChange={e=>setEvent({...event,[k]:e.target.value})}/></label>)}</div>}</Panel>}

      {tab==="Buying Plan Ads" && <DataPanel kind="ads" title="Buying Plan Ads" rows={filtered("ads")} add={add} view={view} edit={edit} remove={remove} exp={exportCsv}/>}
      {tab==="Finance" && <DataPanel kind="finance" title="Finance" rows={filtered("finance")} add={add} view={view} edit={edit} remove={remove} exp={exportCsv}/>}
      {tab==="Task & Timeline" && <DataPanel kind="tasks" title="Task & Timeline" rows={filtered("tasks")} add={add} view={view} edit={edit} remove={remove} exp={exportCsv}/>}
      {tab==="Tenant" && <DataPanel kind="tenant" title="Tenant" rows={filtered("tenant")} add={add} view={view} edit={edit} remove={remove} exp={exportCsv}/>}
      {tab==="Influencer / KOL" && <DataPanel kind="kol" title="Influencer / KOL" rows={filtered("kol")} add={add} view={view} edit={edit} remove={remove} exp={exportCsv}/>}
      {tab==="Agenda / Schedule" && <DataPanel kind="agenda" title="Agenda / Schedule" rows={filtered("agenda")} add={add} view={view} edit={edit} remove={remove} exp={exportCsv}/>}

      <footer>Beauty Palu 2026 · Event Management System</footer>
    </main>
    {modal && <Editor modal={modal} setModal={setModal} save={save}/>}
  </div>;
}

function DataPanel({kind,title,rows,add,view,edit,remove,exp}:{kind:Kind,title:string,rows:{r:Row,i:number}[],add:(k:Kind)=>void,view:(k:Kind,i:number)=>void,edit:(k:Kind,i:number)=>void,remove:(k:Kind,i:number)=>void,exp:(k:Kind)=>void}){
  const cols=fields[kind];
  return <Panel title={title}><div className="toolbar"><button className="primary" onClick={()=>add(kind)}><Plus size={16}/> Tambah</button><button onClick={()=>exp(kind)}><Download size={16}/> Export CSV</button></div>
    <div className="table-wrap"><table><thead><tr>{cols.map(c=><th key={c}>{fieldLabels[c]}</th>)}<th>AKSI</th></tr></thead><tbody>
      {rows.map(({r,i})=><tr key={i}>{cols.map(c=><td key={c}>{["budget","amount","price","fee"].includes(c)?fmt(r[c]):String(r[c]??"")}</td>)}<td><div className="row-actions"><button className="action-view" onClick={()=>view(kind,i)} title="Lihat"><Eye size={15}/> Lihat</button><button className="action-edit" onClick={()=>edit(kind,i)} title="Edit / Update"><Pencil size={15}/> Edit</button><button className="action-delete" onClick={()=>remove(kind,i)} title="Hapus"><Trash2 size={15}/> Hapus</button></div></td></tr>)}
      {!rows.length&&<tr><td colSpan={cols.length+1} className="empty">Belum ada data. <button className="inline-add" onClick={()=>add(kind)}>+ Tambah data</button></td></tr>}
    </tbody></table></div>
  </Panel>
}

function Editor({modal,setModal,save}:{modal:{kind:Kind,index:number|null,row:Row,mode:"edit"|"view"},setModal:(v:any)=>void,save:()=>void}){
  const title=modal.mode==="view"?"Lihat":modal.index===null?"Tambah":"Edit";
  const update=(k:string,v:any)=>setModal((m:any)=>({...m,row:{...m.row,[k]:v}}));
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><p className="eyebrow">BEAUTY PALU 2026</p><h3>{title} {modal.kind.toUpperCase()}</h3></div><button className="closebtn" onClick={()=>setModal(null)}><X size={18}/></button></div>
    <div className="form-grid">{fields[modal.kind].map(k=>{const v=modal.row[k]??"";const num=["budget","amount","price","fee","followers","progress"].includes(k);const date=["date","deadline","start","end"].includes(k);const select=["type","status","payment","priority","platform"].includes(k);
      let opts:string[]=[];if(k==="type")opts=["Income","Expense"];if(k==="status")opts=modal.kind==="tasks"?["Not Started","In Progress","Done","On Hold"]:["Prospect","Contacted","Negotiation","Confirmed","Cancelled","Declined","Planned","Completed"];if(k==="payment")opts=["Belum Bayar","DP","Lunas"];if(k==="priority")opts=["Low","Medium","High"];if(k==="platform")opts=["Instagram","TikTok","Facebook","YouTube","Instagram + Facebook + TikTok"];
      return <label key={k}>{fieldLabels[k]||k}{select?<select disabled={modal.mode==="view"} value={v} onChange={e=>update(k,e.target.value)}>{opts.map(o=><option key={o}>{o}</option>)}</select>:<input disabled={modal.mode==="view"} type={num?"number":date?"date":"text"} value={v} onChange={e=>update(k,num?Number(e.target.value):e.target.value)}/>}</label>})}</div>
    {modal.mode==="edit"&&<div className="modal-actions"><button onClick={()=>setModal(null)}>Batal</button><button className="primary" onClick={save}><Save size={16}/> Simpan</button></div>}
  </div></div>
}

function Card({icon,title,value,note}:{icon:any,title:string,value:string,note:string}){return <div className="card"><div className="icon">{icon}</div><small>{title}</small><strong>{value}</strong><span>{note}</span></div>}
function Panel({title,children}:{title:string,children:React.ReactNode}){return <div className="panel"><div className="panel-head"><h3>{title}</h3></div>{children}</div>}
