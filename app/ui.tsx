 "use client";

import { useMemo, useState } from "react";
import { CalendarDays, Wallet, Megaphone, Users, ClipboardList, Building2, Download, Search, Plus, Trash2, Pencil, Upload, FileJson } from "lucide-react";

type Row = Record<string, any>;

const initialAds: Row[] = [
  { phase:"Phase 1", platform:"Instagram", budget:2000000, objective:"Awareness", audience:"Palu + Sulawesi Tengah + kota sekitar", reach:"35K–60K", content:"Reels / teaser" },
  { phase:"Phase 2", platform:"TikTok", budget:1500000, objective:"Engagement", audience:"17–40, beauty & fashion", reach:"30K–55K", content:"Short video / creator" },
  { phase:"Phase 3", platform:"Instagram + Facebook + TikTok", budget:5500000, objective:"Event conversion", audience:"Palu + audience luar Sulteng", reach:"90K–160K", content:"Countdown / event highlight" }
];

const initialTasks: Row[] = [
  { task:"Finalisasi venue & layout", deadline:"2026-10-01", pic:"Event Team", status:"In Progress", progress:60 },
  { task:"Canvassing Brand Beauty", deadline:"2026-10-15", pic:"Partnership", status:"In Progress", progress:45 },
  { task:"Canvassing Media Partner", deadline:"2026-10-20", pic:"Marketing", status:"Not Started", progress:0 },
  { task:"Paid Ads Phase 1", deadline:"2026-09-14", pic:"Ads Team", status:"Done", progress:100 }
];

const initialTenants: Row[] = [];
const initialKols: Row[] = [];
const initialFinance: Row[] = [];

const fmt = (n:number) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n||0);

function download(name:string, content:string, type="application/json"){
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([content],{type}));
  a.download=name; a.click(); URL.revokeObjectURL(a.href);
}

export function Dashboard(){
  const [tab,setTab]=useState("Dashboard");
  const [ads,setAds]=useState(initialAds);
  const [tasks,setTasks]=useState(initialTasks);
  const [tenants,setTenants]=useState(initialTenants);
  const [kols,setKols]=useState(initialKols);
  const [finance,setFinance]=useState(initialFinance);
  const [query,setQuery]=useState("");
  const [modal,setModal]=useState<string|null>(null);

  const totalAds=useMemo(()=>ads.reduce((s,r)=>s+Number(r.budget||0),0),[ads]);
  const income=finance.filter(x=>x.type==="Income").reduce((s,r)=>s+Number(r.amount||0),0);
  const expense=finance.filter(x=>x.type==="Expense").reduce((s,r)=>s+Number(r.amount||0),0);
  const progress=Math.round(tasks.reduce((s,r)=>s+Number(r.progress||0),0)/(tasks.length||1));

  const filtered=(rows:Row[])=>rows.filter(r=>JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));

  function addRecord(kind:string){
    const common = kind==="finance"
      ? {type:"Expense",category:"Operasional",amount:0,date:new Date().toISOString().slice(0,10),notes:""}
      : kind==="task" ? {task:"Tugas baru",deadline:"2026-11-01",pic:"",status:"Not Started",progress:0}
      : kind==="tenant" ? {name:"Brand baru",contact:"",package:"",status:"Prospect"}
      : kind==="kol" ? {name:"KOL baru",platform:"Instagram",followers:0,status:"Prospect"}
      : {phase:"Phase 1",platform:"Instagram",budget:0,objective:"Awareness",audience:"",reach:"",content:""};
    if(kind==="finance") setFinance(v=>[...v,common]);
    if(kind==="task") setTasks(v=>[...v,common]);
    if(kind==="tenant") setTenants(v=>[...v,common]);
    if(kind==="kol") setKols(v=>[...v,common]);
    if(kind==="ads") setAds(v=>[...v,common]);
    setModal(null);
  }

  function remove(kind:string,i:number){
    if(!confirm("Hapus data ini?")) return;
    if(kind==="finance") setFinance(v=>v.filter((_,x)=>x!==i));
    if(kind==="task") setTasks(v=>v.filter((_,x)=>x!==i));
    if(kind==="tenant") setTenants(v=>v.filter((_,x)=>x!==i));
    if(kind==="kol") setKols(v=>v.filter((_,x)=>x!==i));
    if(kind==="ads") setAds(v=>v.filter((_,x)=>x!==i));
  }

  function exportCSV(kind:string, rows:Row[]){
    const fs=[...new Set(rows.flatMap(r=>Object.keys(r)))];
    const csv=[fs.join(","),...rows.map(r=>fs.map(f=>`"${String(r[f]??"").replaceAll('"','""')}"`).join(","))].join("\n");
    download(`beauty-palu-${kind}.csv`,csv,"text/csv;charset=utf-8");
  }

  function backup(){
    download("beauty-palu-2026-backup.json",JSON.stringify({event:{name:"Beauty Palu 2026",date:"2026-11-26",venue:"Atrium Palu Grand Mall"},ads,tasks,tenants,kols,finance},null,2));
  }

  const nav=[
    ["Dashboard","Overview"],["Detail Event","Event"],["Buying Plan Ads","Ads"],["Finance","Finance"],["Task & Timeline","Tasks"],["Tenant","Tenant"],["Influencer / KOL","KOL"]
  ];

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="mark">BP</div><div><b>Beauty Palu</b><span>2026 Management</span></div></div>
      <div className="nav">{nav.map(([label])=><button className={tab===label?"active":""} onClick={()=>setTab(label)} key={label}>{label}</button>)}</div>
      <div className="side-bottom">
        <button onClick={backup}><FileJson size={16}/> Backup JSON</button>
        <label className="import"><Upload size={16}/> Import JSON<input type="file" accept=".json" onChange={async e=>{const f=e.target.files?.[0];if(f){alert("File terbaca. Untuk restore penuh, hubungkan ke Supabase pada versi production.");}}}/></label>
      </div>
    </aside>

    <main className="main">
      <header>
        <div><p className="eyebrow">EVENT MANAGEMENT SYSTEM</p><h1>{tab}</h1></div>
        <div className="search"><Search size={17}/><input placeholder="Cari data..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      </header>

      {tab==="Dashboard" && <section>
        <div className="hero"><div><span className="pill">26 NOVEMBER 2026</span><h2>Beauty Palu 2026</h2><p>Atrium Palu Grand Mall · Luxury Beauty Event / High-End Brand Partnership</p></div><CalendarDays size={42}/></div>
        <div className="cards">
          <Card icon={<Megaphone/>} title="Ads Budget" value={fmt(totalAds)} note="Instagram · TikTok · Facebook"/>
          <Card icon={<Wallet/>} title="Balance" value={fmt(income-expense)} note={`Income ${fmt(income)} · Expense ${fmt(expense)}`}/>
          <Card icon={<ClipboardList/>} title="Preparation" value={`${progress}%`} note={`${tasks.length} task terdaftar`}/>
          <Card icon={<Building2/>} title="Tenant" value={String(tenants.length)} note="Brand Beauty"/>
          <Card icon={<Users/>} title="Influencer / KOL" value={String(kols.length)} note="Data partnership"/>
        </div>
        <div className="grid2"><Panel title="Target Audience"><p>Perempuan 17–40 tahun, beauty & fashion enthusiast, masyarakat umum Palu dan sekitarnya, serta audience luar Palu / Sulawesi Tengah.</p></Panel><Panel title="Quick Actions"><div className="actions"><button onClick={()=>setTab("Buying Plan Ads")}><Plus/> Ads Plan</button><button onClick={()=>setTab("Finance")}><Plus/> Finance</button><button onClick={()=>setTab("Task & Timeline")}><Plus/> Task</button></div></Panel></div>
      </section>}

      {tab==="Detail Event" && <Panel title="Detail Event"><div className="detail"><b>Nama Event</b><span>Beauty Palu 2026</span><b>Tanggal</b><span>26 November 2026</span><b>Venue</b><span>Atrium Palu Grand Mall</span><b>Konsep</b><span>Luxury Beauty Event / High-End Brand Partnership</span><b>Target Audience</b><span>Perempuan 17–40, beauty & fashion enthusiast, masyarakat umum.</span><b>Target Area</b><span>Palu, Sulawesi Tengah + audience luar Palu / Sulawesi Tengah</span></div></Panel>}

      {tab==="Buying Plan Ads" && <DataPanel title="Buying Plan Ads" rows={filtered(ads)} columns={["phase","platform","budget","objective","audience","reach","content"]} add={()=>addRecord("ads")} remove={i=>remove("ads",i)} export={()=>exportCSV("ads",ads)} />}

      {tab==="Finance" && <DataPanel title="Finance" rows={filtered(finance)} columns={["type","category","amount","date","notes"]} add={()=>addRecord("finance")} remove={i=>remove("finance",i)} export={()=>exportCSV("finance",finance)} money="amount"/>}

      {tab==="Task & Timeline" && <DataPanel title="Task & Timeline" rows={filtered(tasks)} columns={["task","deadline","pic","status","progress"]} add={()=>addRecord("task")} remove={i=>remove("task",i)} export={()=>exportCSV("tasks",tasks)} />}

      {tab==="Tenant" && <DataPanel title="Master Tenant" rows={filtered(tenants)} columns={["name","contact","package","status"]} add={()=>addRecord("tenant")} remove={i=>remove("tenant",i)} export={()=>exportCSV("tenants",tenants)} />}

      {tab==="Influencer / KOL" && <DataPanel title="Master Influencer / KOL" rows={filtered(kols)} columns={["name","platform","followers","status"]} add={()=>addRecord("kol")} remove={i=>remove("kol",i)} export={()=>exportCSV("kols",kols)} />}

      <footer>Beauty Palu 2026 · Event Management System · Struktur siap dikembangkan ke Supabase + Vercel</footer>
    </main>
  </div>
}

function Card({icon,title,value,note}:{icon:any,title:string,value:string,note:string}){return <div className="card"><div className="icon">{icon}</div><small>{title}</small><strong>{value}</strong><span>{note}</span></div>}
function Panel({title,children}:{title:string,children:React.ReactNode}){return <div className="panel"><div className="panel-head"><h3>{title}</h3></div>{children}</div>}
function DataPanel({title,rows,columns,add,remove,export:exp,money}:{title:string,rows:Row[],columns:string[],add:()=>void,remove:(i:number)=>void,export:()=>void,money?:string}){
  return <Panel title={title}><div className="toolbar"><button className="primary" onClick={add}><Plus size={16}/> Tambah</button><button onClick={exp}><Download size={16}/> Export CSV</button></div><div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}<th>Aksi</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{columns.map(c=><td key={c}>{money===c?fmt(Number(r[c]||0)):String(r[c]??"")}</td>)}<td><button className="iconbtn" onClick={()=>remove(i)}><Trash2 size={15}/></button></td></tr>)}{!rows.length&&<tr><td colSpan={columns.length+1} className="empty">Belum ada data.</td></tr>}</tbody></table></div></Panel>
}