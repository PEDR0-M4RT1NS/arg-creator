 "use client";

import { useEffect, useMemo, useState } from "react";
import { Phase, defaultPhases } from "../lib/types";
import { loadPhases, savePhases } from "../lib/storage";

type View = "dashboard" | "editor" | "settings";

export default function Creator() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [view, setView] = useState<View>("dashboard");
  const [editing, setEditing] = useState<Phase | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => setPhases(loadPhases()), []);

  const filtered = useMemo(
    () => phases.filter(p => `${p.number} ${p.title} ${p.slug}`.toLowerCase().includes(query.toLowerCase())),
    [phases, query]
  );

  function persist(next: Phase[]) {
    setPhases(next);
    savePhases(next);
  }

  function newPhase() {
    const number = phases.length ? Math.max(...phases.map(p => p.number)) + 1 : 1;
    setEditing({
      id: crypto.randomUUID(),
      number,
      slug: `fase-${String(number).padStart(2, "0")}`,
      title: "Nova fase",
      subtitle: "Uma nova porta foi criada.",
      code: "",
      content: "",
      clue: "",
      hint: "",
      type: "Código",
      status: "draft",
      unlock: "manual",
      unlockAt: "",
      accent: "#f5c2e7"
    });
    setView("editor");
  }

  function editPhase(p: Phase) {
    setEditing({...p});
    setView("editor");
  }

  function saveEditing() {
    if (!editing) return;
    const next = phases.some(p => p.id === editing.id)
      ? phases.map(p => p.id === editing.id ? editing : p)
      : [...phases, editing].sort((a,b) => a.number-b.number);
    persist(next);
    setView("dashboard");
    setEditing(null);
  }

  function deletePhase(id: string) {
    if (!confirm("Excluir esta fase?")) return;
    persist(phases.filter(p => p.id !== id));
  }

  function duplicatePhase(p: Phase) {
    const number = phases.length ? Math.max(...phases.map(x => x.number)) + 1 : 1;
    persist([...phases, {...p, id: crypto.randomUUID(), number, slug: `${p.slug}-copia`, title: `${p.title} (cópia)`, status:"draft"}].sort((a,b)=>a.number-b.number));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(phases, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="arg-phases.json"; a.click(); URL.revokeObjectURL(url);
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error();
        persist(parsed);
        alert("Fases importadas.");
      } catch { alert("JSON inválido."); }
    };
    reader.readAsText(file);
  }

  if (view === "editor" && editing) {
    return <Editor phase={editing} onChange={setEditing} onSave={saveEditing} onCancel={()=>{setView("dashboard");setEditing(null)}} />;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">MY BOO // ARG CREATOR<span>LOCAL CONTROL PANEL · V1.0</span></div>
        <div className="nav">
          <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}>▣ Dashboard</button>
          <button onClick={newPhase}>＋ Nova fase</button>
          <button onClick={()=>setView("settings")}>⚙ Configurações</button>
        </div>
        <div className="sidefoot">Os dados desta V1 ficam salvos neste navegador.<br/>Use Exportar para fazer backup.</div>
      </aside>

      <main className="main">
        {view === "settings" ? (
          <Settings phases={phases} onImport={importJson} onExport={exportJson} onReset={()=>{if(confirm("Restaurar fases padrão?")){persist(defaultPhases)}}} />
        ) : (
          <>
            <div className="top">
              <div><div className="eyebrow">CONTROL PANEL / ARG</div><h1>Dashboard</h1><div className="sub">Crie, teste e organize as fases da sua história.</div></div>
              <button className="btn primary" onClick={newPhase}>＋ NOVA FASE</button>
            </div>

            <div className="grid">
              <div className="card"><div className="label">Total de fases</div><div className="stat">{phases.length}</div></div>
              <div className="card"><div className="label">Publicadas</div><div className="stat">{phases.filter(p=>p.status==="live").length}</div></div>
              <div className="card"><div className="label">Rascunhos</div><div className="stat">{phases.filter(p=>p.status==="draft").length}</div></div>
            </div>

            <div className="card" style={{marginTop:16}}>
              <div className="toolbar">
                <input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar fase, título ou URL..." />
                <button className="btn" onClick={exportJson}>Exportar JSON</button>
              </div>
              <div className="phase-list">
                {filtered.map(p => (
                  <div className="phase" key={p.id}>
                    <div className="num">#{String(p.number).padStart(3,"0")}</div>
                    <div><strong>{p.title}</strong><div className="sub">/{p.slug} · {p.type}</div></div>
                    <div className="actions">
                      <span className={`status ${p.status}`}>{p.status==="live"?"PUBLICADA":"RASCUNHO"}</span>
                      <button className="btn" onClick={()=>editPhase(p)}>Editar</button>
                      <button className="btn" onClick={()=>duplicatePhase(p)}>Duplicar</button>
                      <button className="btn danger" onClick={()=>deletePhase(p.id)}>Excluir</button>
                    </div>
                  </div>
                ))}
                {!filtered.length && <div className="empty">Nenhuma fase encontrada.</div>}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Editor({phase,onChange,onSave,onCancel}:{phase:Phase,onChange:(p:Phase)=>void,onSave:()=>void,onCancel:()=>void}) {
  const set = (key:keyof Phase, value:string|number) => onChange({...phase,[key]:value});
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">MY BOO // EDITOR<span>PHASE BUILDER · V1.0</span></div>
        <div className="nav">
          <button onClick={onCancel}>← Voltar</button>
          <button className="active">✎ Editando fase #{String(phase.number).padStart(3,"0")}</button>
        </div>
      </aside>
      <main className="main">
        <div className="top">
          <div><div className="eyebrow">PHASE BUILDER / #{String(phase.number).padStart(3,"0")}</div><h1>{phase.title || "Nova fase"}</h1><div className="sub">Configure o desafio e veja o resultado ao lado.</div></div>
          <div className="actions"><button className="btn" onClick={onCancel}>Cancelar</button><button className="btn primary" onClick={onSave}>Salvar fase</button></div>
        </div>

        <div className="editor">
          <div>
            <div className="card">
              <h2>Identidade</h2>
              <div className="field"><label>Título</label><input value={phase.title} onChange={e=>set("title",e.target.value)} /></div>
              <div className="field"><label>Subtítulo</label><input value={phase.subtitle} onChange={e=>set("subtitle",e.target.value)} /></div>
              <div className="field"><label>URL / slug</label><input value={phase.slug} onChange={e=>set("slug",e.target.value.toLowerCase().replace(/\s+/g,"-"))} /></div>
              <div className="field"><label>Tipo de desafio</label><select value={phase.type} onChange={e=>set("type",e.target.value)}>{["Código","Senha","Enigma","Texto","Imagem","Link"].map(x=><option key={x}>{x}</option>)}</select></div>
              <div className="field"><label>Status</label><select value={phase.status} onChange={e=>set("status",e.target.value)}><option value="draft">Rascunho</option><option value="live">Publicada</option></select></div>
            </div>

            <div className="card" style={{marginTop:16}}>
              <h2>Desafio</h2>
              <div className="field"><label>Código / resposta</label><input value={phase.code} onChange={e=>set("code",e.target.value)} placeholder="ex.: bomdia" /></div>
              <div className="field"><label>Conteúdo liberado</label><textarea value={phase.content} onChange={e=>set("content",e.target.value)} placeholder="Texto que aparece quando ela acerta..." /></div>
              <div className="field"><label>Pista</label><textarea value={phase.clue} onChange={e=>set("clue",e.target.value)} placeholder="Uma pista opcional..." /></div>
              <div className="field"><label>Dica</label><textarea value={phase.hint} onChange={e=>set("hint",e.target.value)} placeholder="Uma dica para quando ela travar..." /></div>
            </div>

            <div className="card" style={{marginTop:16}}>
              <h2>Desbloqueio</h2>
              <div className="field"><label>Regra</label><select value={phase.unlock} onChange={e=>set("unlock",e.target.value)}><option value="manual">Manual</option><option value="date">Data e hora</option><option value="previous">Após fase anterior</option></select></div>
              {phase.unlock==="date" && <div className="field"><label>Data/hora</label><input type="datetime-local" value={phase.unlockAt} onChange={e=>set("unlockAt",e.target.value)} /></div>}
              <div className="notice">Nesta V1 o editor salva as configurações no navegador. A publicação real na Vercel/GitHub será a próxima camada.</div>
            </div>
          </div>

          <Preview phase={phase}/>
        </div>
      </main>
    </div>
  );
}

function Preview({phase}:{phase:Phase}) {
  return <div className="preview">
    <div className="eyebrow" style={{marginBottom:8}}>LIVE PREVIEW</div>
    <div className="preview-screen" style={{borderColor:phase.accent}}>
      <div className="kicker">MY BOO // #{String(phase.number).padStart(3,"0")}</div>
      <div className="preview-title">{phase.title || "Sem título"}</div>
      <div className="sub">{phase.subtitle || "Sem subtítulo"}</div>
      <div className="preview-box">
        <div className="kicker">{phase.type}</div>
        <p style={{lineHeight:1.7,fontSize:12}}>{phase.content || "O conteúdo liberado aparecerá aqui."}</p>
        <div className="codebox"><input placeholder="Digite a resposta..." readOnly /><button className="btn primary" style={{width:"100%",marginTop:8}}>DESBLOQUEAR</button></div>
      </div>
      {phase.clue && <div className="notice" style={{marginTop:12}}>PISTA: {phase.clue}</div>}
    </div>
  </div>;
}

function Settings({phases,onImport,onExport,onReset}:{phases:Phase[],onImport:(f:File)=>void,onExport:()=>void,onReset:()=>void}) {
  return <div className="shell">
    <aside className="sidebar"><div className="logo">MY BOO // SETTINGS<span>PROJECT TOOLS</span></div><div className="nav"><button onClick={()=>location.reload()}>← Dashboard</button></div></aside>
    <main className="main">
      <div className="top"><div><div className="eyebrow">PROJECT / SETTINGS</div><h1>Configurações</h1><div className="sub">Backup e restauração do conteúdo.</div></div></div>
      <div className="card">
        <h2>Backup local</h2><p className="sub">Atualmente existem {phases.length} fases salvas neste navegador.</p>
        <div className="actions" style={{marginTop:20}}>
          <button className="btn" onClick={onExport}>Exportar fases (.json)</button>
          <label className="btn">Importar JSON<input type="file" accept=".json,application/json" style={{display:"none"}} onChange={e=>e.target.files?.[0]&&onImport(e.target.files[0])}/></label>
          <button className="btn danger" onClick={onReset}>Restaurar padrão</button>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <h2>Arquitetura da V1</h2>
        <p className="sub" style={{lineHeight:1.8}}>Editor local → localStorage → exportação JSON. A próxima etapa pode conectar este painel a uma API/banco e a um fluxo de publicação, sem precisar refazer a interface.</p>
      </div>
    </main>
  </div>;
}
