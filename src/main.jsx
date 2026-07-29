import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import * as XLSX from 'xlsx'
import {
  ArrowDownCircle, ArrowUpCircle, BarChart3, Download, Landmark,
  Layers3, List, Pencil, Plus, Save, Trash2, WalletCards
} from 'lucide-react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import './styles.css'

const STORAGE_KEY = 'liga-padel-cashflow-v1'

const defaultData = {
  initialBalance: 0,
  categories: [
    { id: crypto.randomUUID(), name: 'APC', subcategories: [{ id: crypto.randomUUID(), name: 'Cancha' }] }
  ],
  transactions: []
}

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0
})

const today = () => new Date().toISOString().slice(0, 10)

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData
  } catch {
    return defaultData
  }
}

function App() {
  const [data, setData] = useState(loadData)
  const [tab, setTab] = useState('movimientos')
  const [editingBalance, setEditingBalance] = useState(false)
  const [balanceDraft, setBalanceDraft] = useState(data.initialBalance)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)), [data])
  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  const totals = useMemo(() => {
    const income = data.transactions.filter(t => t.type === 'Ingreso').reduce((a, t) => a + t.amount, 0)
    const expense = data.transactions.filter(t => t.type === 'Egreso').reduce((a, t) => a + t.amount, 0)
    return { income, expense, profit: income - expense, balance: data.initialBalance + income - expense }
  }, [data])

  const saveBalance = () => {
    setData(d => ({ ...d, initialBalance: Number(balanceDraft) || 0 }))
    setEditingBalance(false)
  }

  return (
    <>
      {showSplash && (
        <div className="splash" aria-label="Cargando aplicación">
          <img src={`${import.meta.env.BASE_URL}logo-lpa.png`} alt="Liga de Padel del Atlántico" />
          <span>Flujo de caja</span>
        </div>
      )}
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img src={`${import.meta.env.BASE_URL}logo-lpa.png`} alt="Liga de Padel del Atlántico" />
          <div>
            <span className="eyebrow">LIGA DE PADEL DEL ATLÁNTICO</span>
            <h1>Flujo de caja</h1>
          </div>
        </div>
      </header>

      <main>
        <section className="balance-card">
          <div>
            <span>Balance disponible</span>
            <strong>{money.format(totals.balance)}</strong>
          </div>
          <Landmark size={34} />
          <div className="balance-base">
            {editingBalance ? (
              <div className="inline-edit">
                <input type="number" value={balanceDraft} onChange={e => setBalanceDraft(e.target.value)} />
                <button onClick={saveBalance} aria-label="Guardar balance"><Save size={18}/></button>
              </div>
            ) : (
              <button className="link-button" onClick={() => setEditingBalance(true)}>
                Balance inicial: {money.format(data.initialBalance)} <Pencil size={14}/>
              </button>
            )}
          </div>
        </section>

        {tab === 'movimientos' && <MovementTab data={data} setData={setData} totals={totals} />}
        {tab === 'categorias' && <CategoriesTab data={data} setData={setData} />}
        {tab === 'historial' && <HistoryTab data={data} setData={setData} />}
        {tab === 'estadisticas' && <StatsTab data={data} />}
      </main>

      <nav className="bottom-nav">
        <NavButton active={tab==='movimientos'} icon={WalletCards} label="Movimientos" onClick={() => setTab('movimientos')} />
        <NavButton active={tab==='categorias'} icon={Layers3} label="Categorías" onClick={() => setTab('categorias')} />
        <NavButton active={tab==='historial'} icon={List} label="Historial" onClick={() => setTab('historial')} />
        <NavButton active={tab==='estadisticas'} icon={BarChart3} label="Estadísticas" onClick={() => setTab('estadisticas')} />
      </nav>
    </div>
    </>
  )
}

function NavButton({ active, icon: Icon, label, onClick }) {
  return <button className={active ? 'active' : ''} onClick={onClick}><Icon size={21}/><span>{label}</span></button>
}

function MovementTab({ data, setData, totals }) {
  const [form, setForm] = useState({ type: 'Ingreso', amount: '', date: today(), categoryId: '', subcategoryId: '', description: '' })
  const selectedCategory = data.categories.find(c => c.id === form.categoryId)

  const submit = e => {
    e.preventDefault()
    const category = data.categories.find(c => c.id === form.categoryId)
    const subcategory = category?.subcategories.find(s => s.id === form.subcategoryId)
    if (!form.amount || Number(form.amount) <= 0 || !category || !subcategory) return
    const item = {
      id: crypto.randomUUID(),
      type: form.type,
      amount: Number(form.amount),
      date: form.date,
      categoryId: category.id,
      category: category.name,
      subcategoryId: subcategory.id,
      subcategory: subcategory.name,
      description: form.description.trim(),
      createdAt: new Date().toISOString()
    }
    setData(d => ({ ...d, transactions: [item, ...d.transactions] }))
    setForm(f => ({ ...f, amount: '', description: '' }))
  }

  return <section className="page-section">
    <div className="mini-cards">
      <MiniCard label="Ingresos" value={totals.income} type="income" />
      <MiniCard label="Egresos" value={totals.expense} type="expense" />
    </div>
    <div className="panel">
      <div className="section-title"><Plus size={20}/><h2>Nuevo movimiento</h2></div>
      {data.categories.length === 0 ? <p className="empty">Primero crea una categoría y una subcategoría.</p> :
      <form onSubmit={submit} className="form-grid">
        <div className="type-switch">
          {['Ingreso','Egreso'].map(type => <button key={type} type="button" className={form.type===type ? `selected ${type.toLowerCase()}` : ''} onClick={() => setForm({...form,type})}>{type === 'Ingreso' ? <ArrowUpCircle size={18}/> : <ArrowDownCircle size={18}/>} {type}</button>)}
        </div>
        <label>Valor<input required inputMode="numeric" type="number" min="1" value={form.amount} onChange={e => setForm({...form,amount:e.target.value})} placeholder="0" /></label>
        <label>Fecha<input required type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})}/></label>
        <label>Categoría<select required value={form.categoryId} onChange={e => setForm({...form,categoryId:e.target.value,subcategoryId:''})}><option value="">Selecciona</option>{data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Subcategoría<select required disabled={!selectedCategory} value={form.subcategoryId} onChange={e => setForm({...form,subcategoryId:e.target.value})}><option value="">Selecciona</option>{selectedCategory?.subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label className="full">Descripción (opcional)<input value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Detalle del movimiento" /></label>
        <button className="primary full" type="submit">Guardar movimiento</button>
      </form>}
    </div>
  </section>
}

function MiniCard({ label, value, type }) {
  return <div className={`mini-card ${type}`}><span>{label}</span><strong>{money.format(value)}</strong></div>
}

function CategoriesTab({ data, setData }) {
  const [categoryName, setCategoryName] = useState('')
  const [subDrafts, setSubDrafts] = useState({})

  const addCategory = e => {
    e.preventDefault(); const name = categoryName.trim(); if (!name) return
    setData(d => ({...d,categories:[...d.categories,{id:crypto.randomUUID(),name,subcategories:[]}]})); setCategoryName('')
  }
  const addSub = (categoryId) => {
    const name = (subDrafts[categoryId] || '').trim(); if (!name) return
    setData(d => ({...d,categories:d.categories.map(c => c.id===categoryId ? {...c,subcategories:[...c.subcategories,{id:crypto.randomUUID(),name}]} : c)}))
    setSubDrafts(s => ({...s,[categoryId]:''}))
  }
  const deleteCategory = id => {
    if (!confirm('¿Eliminar esta categoría y sus subcategorías? Los movimientos guardados no se borrarán.')) return
    setData(d => ({...d,categories:d.categories.filter(c=>c.id!==id)}))
  }
  const deleteSub = (categoryId, subId) => setData(d => ({...d,categories:d.categories.map(c => c.id===categoryId ? {...c,subcategories:c.subcategories.filter(s=>s.id!==subId)} : c)}))

  return <section className="page-section">
    <div className="panel">
      <div className="section-title"><Layers3 size={20}/><h2>Categorías</h2></div>
      <form className="add-row" onSubmit={addCategory}><input value={categoryName} onChange={e=>setCategoryName(e.target.value)} placeholder="Nueva categoría"/><button className="primary"><Plus size={18}/> Agregar</button></form>
    </div>
    {data.categories.map(c => <div className="panel category-card" key={c.id}>
      <div className="category-heading"><h3>{c.name}</h3><button className="icon-danger" onClick={()=>deleteCategory(c.id)}><Trash2 size={17}/></button></div>
      <div className="chips">{c.subcategories.map(s => <span className="chip" key={s.id}>{s.name}<button onClick={()=>deleteSub(c.id,s.id)}>×</button></span>)}</div>
      <div className="add-row"><input value={subDrafts[c.id]||''} onChange={e=>setSubDrafts({...subDrafts,[c.id]:e.target.value})} placeholder="Nueva subcategoría"/><button onClick={()=>addSub(c.id)}><Plus size={18}/></button></div>
    </div>)}
  </section>
}

function HistoryTab({ data, setData }) {
  const [query, setQuery] = useState('')
  const filtered = data.transactions.filter(t => `${t.category} ${t.subcategory} ${t.description}`.toLowerCase().includes(query.toLowerCase()))
  const remove = id => { if(confirm('¿Eliminar este movimiento?')) setData(d=>({...d,transactions:d.transactions.filter(t=>t.id!==id)})) }
  const exportExcel = () => {
    const rows = data.transactions.map(t => ({Fecha:t.date,Tipo:t.type,Categoría:t.category,Subcategoría:t.subcategory,Descripción:t.description,Valor:t.amount}))
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{wch:13},{wch:12},{wch:22},{wch:22},{wch:35},{wch:16}]
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Movimientos')
    XLSX.writeFile(wb,`flujo-caja-liga-padel-${today()}.xlsx`)
  }
  return <section className="page-section">
    <div className="panel">
      <div className="section-title spread"><div><List size={20}/><h2>Historial</h2></div><button className="secondary" onClick={exportExcel} disabled={!data.transactions.length}><Download size={17}/> Excel</button></div>
      <input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar movimiento..." />
      <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Detalle</th><th>Tipo</th><th>Valor</th><th></th></tr></thead><tbody>
        {filtered.map(t=><tr key={t.id}><td>{t.date}</td><td><strong>{t.category} / {t.subcategory}</strong><small>{t.description||'Sin descripción'}</small></td><td><span className={`badge ${t.type.toLowerCase()}`}>{t.type}</span></td><td className={t.type==='Ingreso'?'positive':'negative'}>{t.type==='Ingreso'?'+':'-'}{money.format(t.amount)}</td><td><button className="icon-danger" onClick={()=>remove(t.id)}><Trash2 size={16}/></button></td></tr>)}
        {!filtered.length && <tr><td colSpan="5" className="empty">No hay movimientos.</td></tr>}
      </tbody></table></div>
    </div>
  </section>
}

function StatsTab({ data }) {
  const years = [...new Set(data.transactions.map(t=>t.date.slice(0,4)))].sort().reverse()
  const [year,setYear] = useState('Todos')
  const [month,setMonth] = useState('Todos')
  const filtered = data.transactions.filter(t => (year==='Todos'||t.date.slice(0,4)===year) && (month==='Todos'||t.date.slice(5,7)===month))
  const income = filtered.filter(t=>t.type==='Ingreso').reduce((a,t)=>a+t.amount,0)
  const expense = filtered.filter(t=>t.type==='Egreso').reduce((a,t)=>a+t.amount,0)
  const profit = income-expense
  const pieData = [{name:'Ingresos',value:income},{name:'Egresos',value:expense}].filter(x=>x.value>0)
  const colors = ['#2fa36b','#e55c63']
  return <section className="page-section">
    <div className="panel filters"><label>Año<select value={year} onChange={e=>setYear(e.target.value)}><option>Todos</option>{years.map(y=><option key={y}>{y}</option>)}</select></label><label>Mes<select value={month} onChange={e=>setMonth(e.target.value)}><option>Todos</option>{Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')).map((m,i)=><option value={m} key={m}>{new Intl.DateTimeFormat('es-CO',{month:'long'}).format(new Date(2026,i,1))}</option>)}</select></label></div>
    <div className="stats-grid"><MiniCard label="Total ingresos" value={income} type="income"/><MiniCard label="Total egresos" value={expense} type="expense"/><MiniCard label="Utilidad" value={profit} type={profit>=0?'profit':'expense'}/></div>
    <div className="panel chart-panel"><h2>Ingresos vs. egresos</h2>{pieData.length ? <div className="chart"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={98} paddingAngle={4}>{pieData.map((_,i)=><Cell key={i} fill={colors[i]}/>)}</Pie><Tooltip formatter={v=>money.format(v)}/><Legend/></PieChart></ResponsiveContainer></div> : <p className="empty">No hay datos para el período seleccionado.</p>}</div>
  </section>
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
