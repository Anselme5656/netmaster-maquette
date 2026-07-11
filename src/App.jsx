import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Radio, Users, FileBarChart, AlertTriangle, Wrench,
  Package, ClipboardList, UserCircle2, ChevronRight, Signal, MapPin,
  CheckCircle2, Clock, XCircle, ArrowRightLeft, CreditCard, Boxes,
  TrendingUp, ShieldCheck, Antenna, PhoneCall, ChevronDown, Search,
  Bell, Settings2, Zap, Menu, X, Trash2, Download, Filter, FileText, Check
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ============================================================
   FONTS
   ============================================================ */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    @keyframes pulseRing {
      0% { transform: scale(0.9); opacity: 0.9; }
      70% { transform: scale(1.9); opacity: 0; }
      100% { transform: scale(1.9); opacity: 0; }
    }
    @keyframes dashFlow {
      to { stroke-dashoffset: -24; }
    }
    .pulse-ring { animation: pulseRing 2.4s cubic-bezier(0.2,0.6,0.4,1) infinite; }
    .flow-line { stroke-dasharray: 4 6; animation: dashFlow 1.6s linear infinite; }
  `}</style>
);

/* ============================================================
   MOCK DATA
   ============================================================ */
const INITIAL_BASES = [
  { id: "b1", nom: "Base Baguida", quartier: "Baguida, Lomé", statut: "active", gestionnaire: "Komla Agbeko" },
  { id: "b2", nom: "Base Adidogomé", quartier: "Adidogomé, Lomé", statut: "active", gestionnaire: "Afi Mensah" },
  { id: "b3", nom: "Base Agbalépédogan", quartier: "Agbalépédogan, Lomé", statut: "active", gestionnaire: "Komla Agbeko" },
  { id: "b4", nom: "Base Bè-Kpota", quartier: "Bè-Kpota, Lomé", statut: "maintenance", gestionnaire: "Yawa Dogbe" },
];

// Les tarifs sont définis par poste, car ils varient d'une base — voire d'un poste — à l'autre
const INITIAL_POSTES = [
  { id: "p1", baseId: "b1", nom: "Poste Marché", type: "Wifi Zone", vendeur: "Sena Kouassi", tarifs: { "1 jour": 100, "3 jours": 200, "7 jours": 500 } },
  { id: "p2", baseId: "b1", nom: "Poste Rond-Point", type: "Wifi Zone", vendeur: "Edem Aziaka", tarifs: { "1 jour": 100, "3 jours": 200, "7 jours": 500 } },
  { id: "p3", baseId: "b1", nom: "Poste Résidence Aku", type: "Abonnement", vendeur: "—", prixAbonnement: 1500 },
  { id: "p4", baseId: "b2", nom: "Poste Carrefour", type: "Wifi Zone", vendeur: "Ama Sossou", tarifs: { "1 jour": 100, "3 jours": 250, "7 jours": 550 } },
  { id: "p5", baseId: "b2", nom: "Poste Immeuble Nyekonakpoe", type: "Abonnement", vendeur: "—", prixAbonnement: 2000 },
];

// Catalogue global des types de tickets (durées) — le prix, lui, se règle poste par poste
const INITIAL_TICKET_TYPES = ["1 jour", "3 jours", "7 jours"];

// Rapports journaliers — simulés pour le maket (validation par gestionnaire, historique filtrable)
const INITIAL_RAPPORTS = [
  { id: "R-0512", date: "10 Jul 2026", base: "Base Baguida", auteur: "Fifonsi Adzo (agent)", type: "Caisse", declare: 54000, attendu: 54000, statut: "valide", validePar: "Komla Agbeko" },
  { id: "R-0511", date: "10 Jul 2026", base: "Base Adidogomé", auteur: "Yao Klu (agent)", type: "Caisse", declare: 41000, attendu: 43500, statut: "en_attente", validePar: null },
  { id: "R-0510", date: "10 Jul 2026", base: "Base Agbalépédogan", auteur: "Ayi Kokou (technicien)", type: "Intervention", declare: null, attendu: null, statut: "en_attente", validePar: null },
  { id: "R-0509", date: "09 Jul 2026", base: "Base Bè-Kpota", auteur: "Delali Amegan (agent)", type: "Caisse", declare: 19000, attendu: 21200, statut: "rejete", validePar: "Yawa Dogbe" },
  { id: "R-0508", date: "09 Jul 2026", base: "Base Baguida", auteur: "Kossi Amouzou (technicien)", type: "Intervention", declare: null, attendu: null, statut: "valide", validePar: "Komla Agbeko" },
];

const REVENUE_EVOLUTION = [
  { mois: "Fév", tickets: 312000, abonnements: 145000 },
  { mois: "Mar", tickets: 358000, abonnements: 162000 },
  { mois: "Avr", tickets: 401000, abonnements: 178000 },
  { mois: "Mai", tickets: 389000, abonnements: 195000 },
  { mois: "Jun", tickets: 452000, abonnements: 213000 },
  { mois: "Jul", tickets: 487000, abonnements: 228000 },
];

const REPARTITION = [
  { name: "Tickets Wifi Zone", value: 487000, color: "#2dd4bf" },
  { name: "Abonnements mensuels", value: 228000, color: "#f59e0b" },
];

const COMPARATIF_BASES = [
  { base: "Baguida", ventes: 218000 },
  { base: "Adidogomé", ventes: 176000 },
  { base: "Agbalépédogan", ventes: 93000 },
  { base: "Bè-Kpota", ventes: 61000 },
];

const INITIAL_PANNES = [
  { id: "PN-014", base: "Base Baguida", equipement: "Antenne secteur Nord", statut: "validee", technicien: "Kossi Amouzou", declare: "08 Jul, 14:20", desc: "Perte de signal intermittente" },
  { id: "PN-015", base: "Base Adidogomé", equipement: "Routeur Poste Carrefour", statut: "reparee", technicien: "Ayi Kokou", declare: "09 Jul, 09:05", desc: "Coupure totale après orage" },
  { id: "PN-016", base: "Base Agbalépédogan", equipement: "Switch central", statut: "autorisee", technicien: "Kossi Amouzou", declare: "10 Jul, 07:40", desc: "Surchauffe suspectée" },
  { id: "PN-017", base: "Base Bè-Kpota", equipement: "Antenne secteur Sud", statut: "declaree", technicien: "Ayi Kokou", declare: "10 Jul, 11:15", desc: "Aucun signal depuis ce matin" },
];

const STATUT_CONFIG = {
  declaree: { label: "Déclarée", color: "text-red-400", bg: "bg-red-400/10", ring: "ring-red-400/30", icon: AlertTriangle, step: 1, next: "autorisee", nextLabel: "Autoriser", nextRole: "gestionnaire" },
  autorisee: { label: "Autorisée", color: "text-amber-400", bg: "bg-amber-400/10", ring: "ring-amber-400/30", icon: ShieldCheck, step: 2, next: "reparee", nextLabel: "Marquer réparée", nextRole: "technicien" },
  reparee: { label: "Réparée (à confirmer)", color: "text-sky-400", bg: "bg-sky-400/10", ring: "ring-sky-400/30", icon: Wrench, step: 3, next: "validee", nextLabel: "Valider", nextRole: "gestionnaire" },
  validee: { label: "Validée", color: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/30", icon: CheckCircle2, step: 4, next: null },
};

const INITIAL_EQUIPMENT_TYPES = ["Antenne", "Routeur", "Switch", "Modem"];

const INITIAL_EQUIPEMENTS = [
  { id: "eq1", nom: "Antenne secteur Nord", type: "Antenne", base: "Base Baguida", reparations: 4, immobilisation: "6h cumulées", etat: "surveiller" },
  { id: "eq2", nom: "Routeur Poste Carrefour", type: "Routeur", base: "Base Adidogomé", reparations: 1, immobilisation: "2h", etat: "ok" },
  { id: "eq3", nom: "Switch central", type: "Switch", base: "Base Agbalépédogan", reparations: 3, immobilisation: "9h cumulées", etat: "surveiller" },
  { id: "eq4", nom: "Antenne secteur Sud", type: "Antenne", base: "Base Bè-Kpota", reparations: 6, immobilisation: "14h cumulées", etat: "critique" },
];

const INITIAL_GESTIONNAIRES = [
  { nom: "Komla Agbeko", bases: "Baguida, Agbalépédogan", derniere: "Distribution lot #A-231 · 10 Jul, 08:12" },
  { nom: "Afi Mensah", bases: "Adidogomé", derniere: "Déclaration caisse validée · 09 Jul, 18:40" },
  { nom: "Yawa Dogbe", bases: "Bè-Kpota", derniere: "Panne PN-017 signalée au technicien · 10 Jul, 11:16" },
];

const INITIAL_LOTS = [
  { lot: "A-231", agent: "Fifonsi Adzo", dist: 120, restant: 14, statut: "réconcilié" },
  { lot: "A-232", agent: "Delali Amegan", dist: 60, restant: 22, statut: "réconcilié" },
  { lot: "A-233", agent: "Fifonsi Adzo", dist: 100, restant: null, statut: "en cours" },
];

const INITIAL_AGENTS = [
  { nom: "Fifonsi Adzo", statut: "actif", peutValider: true, gestionnaire: "Komla Agbeko", lot: "120 tickets remis · 10 Jul" },
  { nom: "Yao Klu", statut: "actif", peutValider: false, gestionnaire: "Afi Mensah", lot: "80 tickets remis · 09 Jul" },
  { nom: "Delali Amegan", statut: "suspendu", peutValider: false, gestionnaire: "Yawa Dogbe", lot: "60 tickets remis · 10 Jul" },
];

// Identité simulée derrière chaque rôle — sert à la traçabilité automatique des actions
const ACTOR_NAMES = {
  admin: "Vous (Administrateur)",
  gestionnaire: "Komla Agbeko",
  technicien: "Kossi Amouzou",
  agent: "Fifonsi Adzo",
};

const ABONNES = [
  { nom: "M. Kpodar Sena", tel: "90 12 34 56", poste: "Résidence Aku", statut: "actif", expire: "28 Jul" },
  { nom: "Mme Adjovi Tsolenyanu", tel: "91 45 67 12", poste: "Résidence Aku", statut: "actif", expire: "02 Août" },
  { nom: "M. Bakoma Essonam", tel: "92 88 21 09", poste: "Immeuble Nyekonakpoe", statut: "expire bientôt", expire: "12 Jul" },
];

const fmtFCFA = (n) => n.toLocaleString("fr-FR") + " F";

/* ============================================================
   SIGNATURE ELEMENT — network pulse
   ============================================================ */
function NetworkPulse() {
  const nodes = [
    { x: 40, y: 70, label: "Baguida" },
    { x: 160, y: 30, label: "Adidogomé" },
    { x: 260, y: 90, label: "Agbalépédogan" },
    { x: 190, y: 140, label: "Bè-Kpota" },
  ];
  const hub = { x: 130, y: 95 };
  return (
    <svg viewBox="0 0 300 170" className="w-full h-full">
      {nodes.map((n, i) => (
        <line key={i} x1={hub.x} y1={hub.y} x2={n.x} y2={n.y}
          stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1.5" className="flow-line" />
      ))}
      <circle cx={hub.x} cy={hub.y} r="6" fill="#f59e0b" />
      <circle cx={hub.x} cy={hub.y} r="6" fill="#f59e0b" className="pulse-ring" style={{ transformOrigin: `${hub.x}px ${hub.y}px` }} />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="4" fill="#2dd4bf" />
          <text x={n.x} y={n.y - 10} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="Inter">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
   MODAL + TOAST
   ============================================================ */
function Modal({ title, sub, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/70" />
      <div className="relative bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:w-[420px] max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-lg text-slate-50">{title}</h3>
            {sub && <p className="text-xs text-slate-500 font-body mt-1">{sub}</p>}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="text-xs text-slate-400 font-body uppercase tracking-wide">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls = "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 font-body focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40";

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-emerald-400 text-slate-950 font-body font-semibold text-sm px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
      <CheckCircle2 size={16} /> {message}
    </div>
  );
}

/* ============================================================
   SHARED UI
   ============================================================ */
function KPICard({ label, value, sub, icon: Icon, accent = "amber" }) {
  const accentMap = {
    amber: "text-amber-400 bg-amber-400/10",
    teal: "text-teal-400 bg-teal-400/10",
    red: "text-red-400 bg-red-400/10",
    sky: "text-sky-400 bg-sky-400/10",
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs font-body uppercase tracking-wide">{label}</p>
        <p className="font-display text-2xl text-slate-50 mt-2">{value}</p>
        {sub && <p className="text-xs text-slate-500 font-body mt-1">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentMap[accent]}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="font-display text-xl text-slate-50">{title}</h2>
        {sub && <p className="text-sm text-slate-500 font-body mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function StatutBadge({ statut }) {
  const cfg = STATUT_CONFIG[statut];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium ring-1 ${cfg.color} ${cfg.bg} ${cfg.ring}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
}

function PanneProgress({ statut }) {
  const step = STATUT_CONFIG[statut].step;
  const labels = ["Déclarée", "Autorisée", "Réparée", "Validée"];
  return (
    <div className="flex items-center gap-1 mt-2">
      {labels.map((l, i) => (
        <React.Fragment key={l}>
          <div className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-amber-400" : "bg-slate-800"}`} />
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================================================
   PANNES — panneau partagé, piloté par les capacités du rôle
   (Admin/Gestionnaire ont les pleins pouvoirs, Technicien/Agent
   sont restreints selon la logique validée avec le client)
   ============================================================ */
function PannesPanel({ pannes, actor, title, sub, canDeclare, canAuthorize, canRepair, canValidate, onAdvance, onDeclare, bases }) {
  const [open, setOpen] = useState(false);
  const [base, setBase] = useState(bases[0]?.nom || "");
  const [equipement, setEquipement] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!equipement.trim() || !desc.trim()) return;
    const num = 17 + pannes.length;
    onDeclare({
      id: `PN-0${num}`, base, equipement: equipement.trim(), statut: "declaree",
      technicien: actor, declare: "10 Jul, à l'instant", desc: desc.trim(), dernierActeur: actor,
    });
    setEquipement(""); setDesc(""); setOpen(false);
  };

  return (
    <div>
      <SectionHeader title={title} sub={sub} action={canDeclare && (
        <button onClick={() => setOpen(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Déclarer une panne</button>
      )} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pannes.map((p) => {
          const canAct =
            (p.statut === "declaree" && canAuthorize) ||
            (p.statut === "autorisee" && canRepair) ||
            (p.statut === "reparee" && canValidate);
          return (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-slate-500">{p.id}</p>
                <StatutBadge statut={p.statut} />
              </div>
              <p className="font-display text-slate-50 mt-2">{p.equipement}</p>
              <p className="text-sm text-slate-500 font-body">{p.base} · {p.desc}</p>
              <PanneProgress statut={p.statut} />
              <p className="text-[11px] text-slate-600 font-mono mt-2">Dernière action : {p.dernierActeur || p.technicien}</p>
              {canAct && (
                <button
                  onClick={() => onAdvance(p.id, actor)}
                  className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 flex items-center gap-1"
                >
                  {p.statut === "declaree" && <><ShieldCheck size={12} /> Autoriser</>}
                  {p.statut === "autorisee" && <><Wrench size={12} /> Marquer réparée</>}
                  {p.statut === "reparee" && <><CheckCircle2 size={12} /> Valider</>}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {open && (
        <Modal title="Déclarer une panne" sub={`Enregistrée au nom de ${actor}`} onClose={() => setOpen(false)}>
          <Field label="Base">
            <select className={inputCls} value={base} onChange={(e) => setBase(e.target.value)}>
              {bases.map((b) => <option key={b.id} value={b.nom}>{b.nom}</option>)}
            </select>
          </Field>
          <Field label="Équipement concerné">
            <input className={inputCls} value={equipement} onChange={(e) => setEquipement(e.target.value)} placeholder="Ex : Antenne secteur Est" />
          </Field>
          <Field label="Description">
            <textarea className={inputCls} rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ce qui a été constaté sur place" />
          </Field>
          <button onClick={submit} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Déclarer la panne</button>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   NAV CONFIG
   ============================================================ */
const NAV = {
  admin: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "bases", label: "Bases & Postes", icon: Radio },
    { id: "gestionnaires", label: "Gestionnaires", icon: Users },
    { id: "agents", label: "Agents", icon: UserCircle2 },
    { id: "rapports", label: "Rapports financiers", icon: FileBarChart },
    { id: "pannes", label: "Supervision pannes", icon: AlertTriangle },
    { id: "equipements", label: "Équipements", icon: Wrench },
  ],
  gestionnaire: [
    { id: "dashboard", label: "Mon tableau de bord", icon: LayoutDashboard },
    { id: "distribution", label: "Distribution tickets", icon: Package },
    { id: "abonnements", label: "Abonnements", icon: CreditCard },
    { id: "rapports", label: "Rapports à valider", icon: FileBarChart },
    { id: "pannes", label: "Pannes de mon secteur", icon: AlertTriangle },
  ],
  technicien: [
    { id: "interventions", label: "Mes interventions", icon: Wrench },
    { id: "equipements", label: "Équipements", icon: Antenna },
  ],
  agent: [
    { id: "reception", label: "Réception de lots", icon: Boxes },
    { id: "reconciliation", label: "Réconciliation", icon: ArrowRightLeft },
    { id: "pannes", label: "Pannes", icon: AlertTriangle },
  ],
};

const ROLE_LABELS = {
  admin: "Administrateur",
  gestionnaire: "Gestionnaire",
  technicien: "Technicien",
  agent: "Agent",
};

/* ============================================================
   PAGES — ADMIN
   ============================================================ */
function AdminDashboard() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-full sm:w-40 h-24 sm:h-28 shrink-0"><NetworkPulse /></div>
          <div className="text-center sm:text-left">
            <p className="text-slate-400 text-xs uppercase tracking-wide font-body">Réseau opérationnel</p>
            <p className="font-display text-2xl sm:text-3xl text-slate-50 mt-1">4 bases <span className="text-slate-600">/</span> 12 postes actifs</p>
            <p className="text-sm text-slate-500 font-body mt-2">1 base en maintenance planifiée — Bè-Kpota</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-xs uppercase tracking-wide font-body mb-3">Recette du mois (juillet)</p>
          <p className="font-display text-3xl text-amber-400">{fmtFCFA(487000 + 228000)}</p>
          <p className="text-xs text-emerald-400 font-body mt-2 flex items-center gap-1"><TrendingUp size={13}/> +7,8% vs juin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Tickets vendus (juillet)" value="2 340" sub="Wifi zone, toutes bases" icon={Signal} accent="teal" />
        <KPICard label="Abonnés actifs" value="86" sub="3 arrivent à expiration" icon={CreditCard} accent="amber" />
        <KPICard label="Pannes en cours" value="3" sub="1 en attente d'autorisation" icon={AlertTriangle} accent="red" />
        <KPICard label="Gestionnaires actifs" value="3" sub="12 postes supervisés" icon={Users} accent="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <SectionHeader title="Évolution des recettes" sub="Tickets zone vs abonnements, 6 derniers mois" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_EVOLUTION}>
              <defs>
                <linearGradient id="ticketsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="abosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="mois" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtFCFA(v)} />
              <Area type="monotone" dataKey="tickets" stroke="#2dd4bf" fill="url(#ticketsGrad)" strokeWidth={2} name="Tickets zone" />
              <Area type="monotone" dataKey="abonnements" stroke="#f59e0b" fill="url(#abosGrad)" strokeWidth={2} name="Abonnements" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <SectionHeader title="Répartition des recettes" sub="Juillet 2026" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={REPARTITION} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {REPARTITION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtFCFA(v)} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-4">
        <SectionHeader title="Comparatif par base" sub="Recette du mois en cours" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={COMPARATIF_BASES}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="base" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtFCFA(v)} />
            <Bar dataKey="ventes" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TarifsModal({ poste, ticketTypes, onClose, onSave }) {
  const [prixAbonnement, setPrixAbonnement] = useState(poste.prixAbonnement ?? "");
  const [tarifs, setTarifs] = useState(poste.tarifs || {});

  const save = () => {
    if (poste.type === "Abonnement") {
      onSave(poste.id, { prixAbonnement: parseInt(prixAbonnement, 10) || 0 });
    } else {
      const cleaned = {};
      ticketTypes.forEach((t) => { cleaned[t] = parseInt(tarifs[t], 10) || 0; });
      onSave(poste.id, { tarifs: cleaned });
    }
    onClose();
  };

  return (
    <Modal title={`Tarifs — ${poste.nom}`} sub="Ces prix ne s'appliquent qu'à ce poste" onClose={onClose}>
      {poste.type === "Abonnement" ? (
        <Field label="Prix de l'abonnement mensuel (FCFA)">
          <input type="number" min="0" className={inputCls} value={prixAbonnement} onChange={(e) => setPrixAbonnement(e.target.value)} />
        </Field>
      ) : (
        ticketTypes.map((t) => (
          <Field key={t} label={`Ticket ${t} (FCFA)`}>
            <input
              type="number" min="0" className={inputCls}
              value={tarifs[t] ?? ""}
              onChange={(e) => setTarifs((prev) => ({ ...prev, [t]: e.target.value }))}
            />
          </Field>
        ))
      )}
      <button onClick={save} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Enregistrer les tarifs</button>
    </Modal>
  );
}

function AdminBases({ bases, postes, equipements, ticketTypes, onAddBase, onRemoveBase, onAddPoste, onRemovePoste, onSaveTarifs, onAddTicketType, onRemoveTicketType }) {
  const [openBase, setOpenBase] = useState(false);
  const [baseNom, setBaseNom] = useState("");
  const [baseQuartier, setBaseQuartier] = useState("");
  const [baseGestionnaire, setBaseGestionnaire] = useState(INITIAL_GESTIONNAIRES[0].nom);

  const [openPoste, setOpenPoste] = useState(false);
  const [posteNom, setPosteNom] = useState("");
  const [posteBaseId, setPosteBaseId] = useState(bases[0]?.id || "");
  const [posteType, setPosteType] = useState("Wifi Zone");
  const [posteVendeur, setPosteVendeur] = useState("");

  const [tarifsPoste, setTarifsPoste] = useState(null);
  const [newTicketType, setNewTicketType] = useState("");
  const [expanded, setExpanded] = useState(() => bases.reduce((acc, b) => ({ ...acc, [b.id]: true }), {}));

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const submitBase = () => {
    if (!baseNom.trim()) return;
    onAddBase({ id: `b${Date.now()}`, nom: baseNom.trim(), quartier: baseQuartier.trim(), statut: "active", gestionnaire: baseGestionnaire });
    setBaseNom(""); setBaseQuartier(""); setOpenBase(false);
  };

  const submitPoste = () => {
    if (!posteNom.trim() || !posteBaseId) return;
    const base = {
      id: `p${Date.now()}`, baseId: posteBaseId, nom: posteNom.trim(), type: posteType,
      vendeur: posteVendeur.trim() || "—",
    };
    if (posteType === "Abonnement") base.prixAbonnement = 0;
    else base.tarifs = Object.fromEntries(ticketTypes.map((t) => [t, 0]));
    onAddPoste(base);
    setPosteNom(""); setPosteVendeur(""); setOpenPoste(false);
  };

  const submitTicketType = () => {
    const t = newTicketType.trim();
    if (!t || ticketTypes.includes(t)) return;
    onAddTicketType(t);
    setNewTicketType("");
  };

  return (
    <div>
      <SectionHeader title="Bases & Postes" sub="Structure physique du réseau, entièrement configurable" action={
        <div className="flex gap-2">
          <button onClick={() => setOpenPoste(true)} className="bg-slate-800 text-slate-200 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition">+ Poste</button>
          <button onClick={() => setOpenBase(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Base</button>
        </div>
      } />

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-3">Types de tickets (catalogue global — le prix se règle par poste)</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ticketTypes.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 text-xs font-body px-3 py-1.5 rounded-full">
              {t}
              <button onClick={() => onRemoveTicketType(t)} className="text-slate-500 hover:text-red-400"><X size={12} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputCls + " flex-1"} value={newTicketType} onChange={(e) => setNewTicketType(e.target.value)} placeholder="Ex : 15 jours" onKeyDown={(e) => e.key === "Enter" && submitTicketType()} />
          <button onClick={submitTicketType} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 rounded-lg shrink-0">Ajouter</button>
        </div>
      </div>

      <div className="space-y-4">
        {bases.map((b) => {
          const basePostes = postes.filter((p) => p.baseId === b.id);
          const baseEquip = equipements.filter((e) => e.base === b.nom);
          const isOpen = expanded[b.id];
          return (
            <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              {/* En-tête de base, cliquable */}
              <button onClick={() => toggleExpand(b.id)} className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition text-left">
                <div className="flex items-center gap-3 min-w-0">
                  {isOpen ? <ChevronDown size={18} className="text-slate-500 shrink-0" /> : <ChevronRight size={18} className="text-slate-500 shrink-0" />}
                  <Antenna size={18} className="text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-display text-slate-50 truncate">{b.nom}</p>
                    <p className="text-xs text-slate-500 font-body flex items-center gap-1"><MapPin size={11} /> {b.quartier} · Gest. {b.gestionnaire}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-500 font-body hidden sm:inline">{basePostes.length} postes · {baseEquip.length} équip.</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-body ${b.statut === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                    {b.statut === "active" ? "Active" : "Maintenance"}
                  </span>
                  <span onClick={(e) => { e.stopPropagation(); onRemoveBase(b.id); }} className="text-slate-600 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></span>
                </div>
              </button>

              {/* Contenu déplié : postes + équipements */}
              {isOpen && (
                <div className="border-t border-slate-800 px-5 py-4 space-y-4">
                  {/* Postes */}
                  <div>
                    <p className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-2">Postes</p>
                    {basePostes.length === 0 ? (
                      <p className="text-xs text-slate-600 font-body">Aucun poste sur cette base.</p>
                    ) : (
                      <div className="space-y-2">
                        {basePostes.map((p) => (
                          <div key={p.id} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2.5 gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-body text-slate-200 text-sm truncate">{p.nom}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.type === "Wifi Zone" ? "bg-teal-400/10 text-teal-400" : "bg-amber-400/10 text-amber-400"}`}>{p.type}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-mono truncate">
                                {p.vendeur !== "—" ? p.vendeur + " · " : ""}
                                {p.type === "Abonnement" ? fmtFCFA(p.prixAbonnement || 0) + "/mois" : Object.entries(p.tarifs || {}).map(([k, v]) => `${k}: ${v}F`).join(" · ")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button onClick={() => setTarifsPoste(p)} className="text-xs text-amber-400 font-semibold hover:underline">Tarifs</button>
                              <button onClick={() => onRemovePoste(p.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={13} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Équipements */}
                  <div>
                    <p className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-2">Équipements</p>
                    {baseEquip.length === 0 ? (
                      <p className="text-xs text-slate-600 font-body">Aucun équipement sur cette base.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {baseEquip.map((e) => (
                          <span key={e.id} className="inline-flex items-center gap-1.5 bg-slate-950/50 border border-slate-800 text-slate-300 text-xs font-body px-2.5 py-1.5 rounded-lg">
                            <Wrench size={11} className="text-slate-500" />
                            {e.nom}
                            <span className="text-slate-600">· {e.type}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {bases.length === 0 && <p className="text-sm text-slate-600 font-body">Aucune base pour l'instant.</p>}
      </div>

      {openBase && (
        <Modal title="Ajouter une base" onClose={() => setOpenBase(false)}>
          <Field label="Nom de la base"><input className={inputCls} value={baseNom} onChange={(e) => setBaseNom(e.target.value)} placeholder="Ex : Base Kégué" /></Field>
          <Field label="Quartier"><input className={inputCls} value={baseQuartier} onChange={(e) => setBaseQuartier(e.target.value)} placeholder="Ex : Kégué, Lomé" /></Field>
          <Field label="Gestionnaire responsable">
            <select className={inputCls} value={baseGestionnaire} onChange={(e) => setBaseGestionnaire(e.target.value)}>
              {INITIAL_GESTIONNAIRES.map((g) => <option key={g.nom} value={g.nom}>{g.nom}</option>)}
            </select>
          </Field>
          <button onClick={submitBase} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Créer la base</button>
        </Modal>
      )}

      {openPoste && (
        <Modal title="Ajouter un poste" sub="Les tarifs se règlent juste après, poste par poste" onClose={() => setOpenPoste(false)}>
          <Field label="Nom du poste"><input className={inputCls} value={posteNom} onChange={(e) => setPosteNom(e.target.value)} placeholder="Ex : Poste Gare" /></Field>
          <Field label="Base">
            <select className={inputCls} value={posteBaseId} onChange={(e) => setPosteBaseId(e.target.value)}>
              {bases.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}
            </select>
          </Field>
          <Field label="Type">
            <select className={inputCls} value={posteType} onChange={(e) => setPosteType(e.target.value)}>
              <option value="Wifi Zone">Wifi Zone</option>
              <option value="Abonnement">Abonnement</option>
            </select>
          </Field>
          <Field label="Vendeur affecté (optionnel)"><input className={inputCls} value={posteVendeur} onChange={(e) => setPosteVendeur(e.target.value)} placeholder="Ex : Nom du vendeur" /></Field>
          <button onClick={submitPoste} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Créer le poste</button>
        </Modal>
      )}

      {tarifsPoste && (
        <TarifsModal poste={tarifsPoste} ticketTypes={ticketTypes} onClose={() => setTarifsPoste(null)} onSave={onSaveTarifs} />
      )}
    </div>
  );
}

function AdminGestionnaires({ gestionnaires, onAdd }) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [bases, setBases] = useState("");

  const submit = () => {
    if (!nom.trim() || !bases.trim()) return;
    onAdd({ nom: nom.trim(), bases: bases.trim(), derniere: "Compte créé · en attente de 1ère action" });
    setNom(""); setBases(""); setOpen(false);
  };

  return (
    <div>
      <SectionHeader title="Gestionnaires" sub="Traçabilité individuelle des actions" action={
        <button onClick={() => setOpen(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Ajouter un gestionnaire</button>
      } />
      <div className="space-y-3">
        {gestionnaires.map((g) => (
          <div key={g.nom} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                <UserCircle2 size={20} className="text-slate-400" />
              </div>
              <div>
                <p className="font-display text-slate-50">{g.nom}</p>
                <p className="text-xs text-slate-500 font-body">Supervise : {g.bases}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-body">Dernière action</p>
              <p className="text-sm text-slate-300 font-mono">{g.derniere}</p>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Modal title="Ajouter un gestionnaire" sub="Créera un compte avec accès de supervision" onClose={() => setOpen(false)}>
          <Field label="Nom complet">
            <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Sena Adjovi" />
          </Field>
          <Field label="Bases supervisées">
            <input className={inputCls} value={bases} onChange={(e) => setBases(e.target.value)} placeholder="Ex : Baguida, Bè-Kpota" />
          </Field>
          <button onClick={submit} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Créer le compte</button>
        </Modal>
      )}
    </div>
  );
}

function AdminAgents({ agents, onAdd, onToggle, onToggleValidation }) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [gestionnaire, setGestionnaire] = useState(INITIAL_GESTIONNAIRES[0].nom);

  const submit = () => {
    if (!nom.trim()) return;
    onAdd({ nom: nom.trim(), statut: "actif", peutValider: false, gestionnaire, lot: "Aucun lot reçu pour l'instant" });
    setNom(""); setOpen(false);
  };

  return (
    <div>
      <SectionHeader title="Agents" sub="Chaque agent a un compte — l'administrateur gère son accès et ses droits" action={
        <button onClick={() => setOpen(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Ajouter un agent</button>
      } />
      <div className="space-y-3">
        {agents.map((a) => (
          <div key={a.nom} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${a.statut === "actif" ? "bg-slate-800" : "bg-red-400/10"}`}>
                <UserCircle2 size={20} className={a.statut === "actif" ? "text-slate-400" : "text-red-400"} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-slate-50 truncate">{a.nom}</p>
                <p className="text-xs text-slate-500 font-body truncate">Sous {a.gestionnaire} · {a.lot}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-body ${a.statut === "actif" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                {a.statut === "actif" ? "Compte actif" : "Suspendu"}
              </span>
              <button
                onClick={() => onToggle(a.nom)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${a.statut === "actif" ? "bg-red-400/10 text-red-400 hover:bg-red-400/20" : "bg-emerald-400 text-slate-950 hover:bg-emerald-300"}`}
              >
                {a.statut === "actif" ? "Suspendre" : "Réactiver"}
              </button>
              <span className="w-px h-5 bg-slate-800 mx-1 hidden sm:block" />
              <span className={`text-xs px-2 py-0.5 rounded-full font-body ${a.peutValider ? "bg-teal-400/10 text-teal-400" : "bg-slate-800 text-slate-500"}`}>
                {a.peutValider ? "Peut valider" : "Ne valide pas"}
              </span>
              <button
                onClick={() => onToggleValidation(a.nom)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${a.peutValider ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-teal-400 text-slate-950 hover:bg-teal-300"}`}
              >
                {a.peutValider ? "Retirer le droit" : "Autoriser à valider"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Modal title="Ajouter un agent" sub="Créera un compte rattaché à un gestionnaire" onClose={() => setOpen(false)}>
          <Field label="Nom complet">
            <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Kokou Mensavi" />
          </Field>
          <Field label="Gestionnaire responsable">
            <select className={inputCls} value={gestionnaire} onChange={(e) => setGestionnaire(e.target.value)}>
              {INITIAL_GESTIONNAIRES.map((g) => <option key={g.nom} value={g.nom}>{g.nom}</option>)}
            </select>
          </Field>
          <button onClick={submit} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Créer le compte</button>
        </Modal>
      )}
    </div>
  );
}

function RapportsPanel({ rapports, canValidate, onValidate, onReject, actor }) {
  const [filtreBase, setFiltreBase] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [filtreType, setFiltreType] = useState("Tous");

  const basesUniques = ["Toutes", ...Array.from(new Set(rapports.map((r) => r.base)))];
  const filtered = rapports.filter((r) =>
    (filtreBase === "Toutes" || r.base === filtreBase) &&
    (filtreStatut === "Tous" || r.statut === filtreStatut) &&
    (filtreType === "Tous" || r.type === filtreType)
  );

  const statutCfg = {
    valide: { label: "Validé", cls: "bg-emerald-400/10 text-emerald-400" },
    en_attente: { label: "En attente", cls: "bg-amber-400/10 text-amber-400" },
    rejete: { label: "Rejeté", cls: "bg-red-400/10 text-red-400" },
  };

  const simulerPDF = (r) => {
    alert(`Génération du PDF du rapport ${r.id}\n\n(Simulation — dans l'application finale, un vrai fichier PDF sera téléchargé : ${r.base}, ${r.date}, ${r.auteur}.)`);
  };

  return (
    <div>
      <SectionHeader
        title={canValidate ? "Rapports à valider & historique" : "Rapports financiers"}
        sub={canValidate ? "Valider les rapports des agents et techniciens, consulter l'historique" : "Consolidé toutes bases"}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard label="Recette hebdomadaire" value={fmtFCFA(178400)} icon={FileBarChart} accent="amber" />
        <KPICard label="En attente de validation" value={String(rapports.filter((r) => r.statut === "en_attente").length)} sub="Rapports à traiter" icon={Clock} accent="red" />
        <KPICard label="Écarts de caisse" value="2" sub="À vérifier" icon={AlertTriangle} accent="red" />
      </div>

      {/* Filtres */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-body uppercase tracking-wide"><Filter size={14} /> Filtres</span>
        <select className={inputCls + " w-auto text-xs py-1.5"} value={filtreBase} onChange={(e) => setFiltreBase(e.target.value)}>
          {basesUniques.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className={inputCls + " w-auto text-xs py-1.5"} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
          <option value="Tous">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="rejete">Rejeté</option>
        </select>
        <select className={inputCls + " w-auto text-xs py-1.5"} value={filtreType} onChange={(e) => setFiltreType(e.target.value)}>
          <option value="Tous">Tous les types</option>
          <option value="Caisse">Caisse</option>
          <option value="Intervention">Intervention</option>
        </select>
        <span className="text-xs text-slate-600 font-body ml-auto">{filtered.length} rapport(s)</span>
      </div>

      {/* Historique */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Réf.</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Base</th>
              <th className="text-left px-4 py-3">Auteur</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Montant</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="px-4 py-3 text-slate-500">{r.date}</td>
                <td className="px-4 py-3">{r.base}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{r.auteur}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.type === "Caisse" ? "bg-teal-400/10 text-teal-400" : "bg-sky-400/10 text-sky-400"}`}>{r.type}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.declare !== null ? fmtFCFA(r.declare) : "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statutCfg[r.statut].cls}`}>{statutCfg[r.statut].label}</span>
                  {r.validePar && <p className="text-[10px] text-slate-600 font-mono mt-0.5">par {r.validePar}</p>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => simulerPDF(r)} className="text-slate-500 hover:text-amber-400" title="Télécharger le PDF"><Download size={15} /></button>
                    {canValidate && r.statut === "en_attente" && (
                      <>
                        <button onClick={() => onValidate(r.id, actor)} className="text-emerald-400 hover:text-emerald-300" title="Valider"><Check size={15} /></button>
                        <button onClick={() => onReject(r.id, actor)} className="text-red-400 hover:text-red-300" title="Rejeter"><X size={15} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-600 font-body">Aucun rapport ne correspond à ces filtres.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {!canValidate && (
        <p className="text-xs text-slate-600 font-body mt-3">La validation des rapports est réservée aux gestionnaires et à l'administrateur.</p>
      )}
    </div>
  );
}

function AdminEquipements({ equipements, types, onAddType, onRemoveType, onAddEquipement, onRemoveEquipement, bases }) {
  const [newType, setNewType] = useState("");
  const [openEq, setOpenEq] = useState(false);
  const [nom, setNom] = useState("");
  const [type, setType] = useState(types[0] || "");
  const [base, setBase] = useState(bases[0]?.nom || "");

  const submitType = () => {
    const t = newType.trim();
    if (!t || types.includes(t)) return;
    onAddType(t);
    setNewType("");
  };

  const submitEquipement = () => {
    if (!nom.trim() || !type) return;
    onAddEquipement({
      id: `eq${Date.now()}`, nom: nom.trim(), type, base,
      reparations: 0, immobilisation: "0h", etat: "ok",
    });
    setNom(""); setOpenEq(false);
  };

  return (
    <div>
      <SectionHeader title="Équipements" sub="Types configurables, ajout et retrait par l'administrateur" />

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-3">Types d'équipement</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {types.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 text-xs font-body px-3 py-1.5 rounded-full">
              {t}
              <button onClick={() => onRemoveType(t)} className="text-slate-500 hover:text-red-400"><X size={12} /></button>
            </span>
          ))}
          {types.length === 0 && <p className="text-xs text-slate-600 font-body">Aucun type défini pour l'instant.</p>}
        </div>
        <div className="flex gap-2">
          <input
            className={inputCls + " flex-1"}
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Nouveau type (ex : Câble fibre)"
            onKeyDown={(e) => e.key === "Enter" && submitType()}
          />
          <button onClick={submitType} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 rounded-lg shrink-0">Ajouter</button>
        </div>
      </div>

      <SectionHeader title="Parc matériel" sub="Fréquence de réparation par actif" action={
        <button onClick={() => setOpenEq(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Ajouter un équipement</button>
      } />
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Équipement</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Base</th>
              <th className="text-left px-4 py-3">Réparations (6 mois)</th>
              <th className="text-left px-4 py-3">Immobilisation</th>
              <th className="text-left px-4 py-3">État</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {equipements.map((e) => (
              <tr key={e.id} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3">{e.nom}</td>
                <td className="px-4 py-3 text-slate-500">{e.type}</td>
                <td className="px-4 py-3 text-slate-500">{e.base}</td>
                <td className="px-4 py-3 font-mono">{e.reparations}</td>
                <td className="px-4 py-3 text-slate-500">{e.immobilisation}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    e.etat === "ok" ? "bg-emerald-400/10 text-emerald-400" :
                    e.etat === "surveiller" ? "bg-amber-400/10 text-amber-400" :
                    "bg-red-400/10 text-red-400"
                  }`}>{e.etat === "ok" ? "Bon état" : e.etat === "surveiller" ? "À surveiller" : "Critique"}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => onRemoveEquipement(e.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {equipements.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-600 font-body">Aucun équipement enregistré.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-600 font-body mt-3">L'antenne secteur Sud de Bè-Kpota cumule 6 réparations en 6 mois — envisager un remplacement plutôt qu'une nouvelle réparation.</p>

      {openEq && (
        <Modal title="Ajouter un équipement" sub="Sera rattaché à une base, prêt pour le suivi des pannes" onClose={() => setOpenEq(false)}>
          <Field label="Nom de l'équipement">
            <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Routeur secteur Est" />
          </Field>
          <Field label="Type">
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {types.length === 0 && <p className="text-xs text-red-400 mt-1.5">Créez d'abord un type d'équipement ci-dessus.</p>}
          </Field>
          <Field label="Base">
            <select className={inputCls} value={base} onChange={(e) => setBase(e.target.value)}>
              {bases.map((b) => <option key={b.id} value={b.nom}>{b.nom}</option>)}
            </select>
          </Field>
          <button onClick={submitEquipement} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Ajouter au parc</button>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   PAGES — GESTIONNAIRE
   ============================================================ */
function GestionnaireDashboard({ agents }) {
  return (
    <div>
      <SectionHeader title="Mon tableau de bord" sub="Komla Agbeko — Bases Baguida & Agbalépédogan" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard label="Tickets en stock" value="340" sub="Répartis sur 2 agents" icon={Package} accent="teal" />
        <KPICard label="Vendus cette semaine" value="812" sub={fmtFCFA(178400)} icon={TrendingUp} accent="amber" />
        <KPICard label="Pannes de mon secteur" value="2" sub="1 en attente d'autorisation" icon={AlertTriangle} accent="red" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <SectionHeader title="Agents sous ma responsabilité" sub="La suspension d'un compte se fait côté administrateur" />
        <div className="space-y-3">
          {agents.filter((a) => a.gestionnaire === "Komla Agbeko").map((a) => (
            <div key={a.nom} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="font-body text-slate-200">{a.nom}</p>
                <p className="text-xs text-slate-500 font-mono">{a.lot}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-body ${a.statut === "actif" ? "bg-teal-400/10 text-teal-400" : "bg-red-400/10 text-red-400"}`}>
                {a.statut === "actif" ? "Compte actif" : "Suspendu"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GestionnaireDistribution({ lots, onAddLot, onReconcile, agents }) {
  const activeAgents = agents.filter((a) => a.statut === "actif");
  const [openNew, setOpenNew] = useState(false);
  const [openReconcile, setOpenReconcile] = useState(null); // lot id being reconciled
  const [agent, setAgent] = useState(activeAgents[0]?.nom || "");
  const [qte, setQte] = useState("");
  const [restant, setRestant] = useState("");

  const submitNew = () => {
    const n = parseInt(qte, 10);
    if (!n || n <= 0) return;
    const nextNum = 231 + lots.length;
    onAddLot({ lot: `A-${nextNum}`, agent, dist: n, restant: null, statut: "en cours" });
    setQte(""); setOpenNew(false);
  };

  const submitReconcile = () => {
    const r = parseInt(restant, 10);
    if (Number.isNaN(r) || r < 0) return;
    onReconcile(openReconcile, r);
    setRestant(""); setOpenReconcile(null);
  };

  return (
    <div>
      <SectionHeader title="Distribution de tickets" sub="Lot remis à un agent → réconciliation au retour" action={
        <button onClick={() => setOpenNew(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Nouveau lot</button>
      } />
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto mb-6">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Lot</th>
              <th className="text-left px-4 py-3">Agent</th>
              <th className="text-left px-4 py-3">Distribué</th>
              <th className="text-left px-4 py-3">Restant déclaré</th>
              <th className="text-left px-4 py-3">Vendu</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {lots.map((l, i) => (
              <tr key={i} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3 font-mono">{l.lot}</td>
                <td className="px-4 py-3">{l.agent}</td>
                <td className="px-4 py-3 font-mono">{l.dist}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{l.restant ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-amber-400">{l.restant !== null ? l.dist - l.restant : "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${l.statut === "réconcilié" ? "bg-emerald-400/10 text-emerald-400" : "bg-sky-400/10 text-sky-400"}`}>{l.statut}</span>
                </td>
                <td className="px-4 py-3">
                  {l.statut === "en cours" && (
                    <button onClick={() => setOpenReconcile(l.lot)} className="text-xs text-amber-400 font-semibold hover:underline">Réconcilier</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-600 font-body">Formule de réconciliation : tickets distribués − restant rapporté par l'agent = tickets vendus.</p>

      {openNew && (
        <Modal title="Nouveau lot" sub="Remise de tickets à un agent" onClose={() => setOpenNew(false)}>
          <Field label="Agent">
            <select className={inputCls} value={agent} onChange={(e) => setAgent(e.target.value)}>
              {activeAgents.map((a) => <option key={a.nom} value={a.nom}>{a.nom}</option>)}
            </select>
            {activeAgents.length === 0 && <p className="text-xs text-red-400 mt-1.5">Aucun agent actif — un compte doit d'abord être réactivé par l'administrateur.</p>}
          </Field>
          <Field label="Quantité de tickets remis">
            <input type="number" min="1" className={inputCls} value={qte} onChange={(e) => setQte(e.target.value)} placeholder="Ex : 100" />
          </Field>
          <button onClick={submitNew} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Enregistrer la remise</button>
        </Modal>
      )}

      {openReconcile && (
        <Modal title={`Réconcilier le lot ${openReconcile}`} sub="Saisir le nombre de tickets rapportés" onClose={() => setOpenReconcile(null)}>
          <Field label="Tickets restants rapportés par l'agent">
            <input type="number" min="0" className={inputCls} value={restant} onChange={(e) => setRestant(e.target.value)} placeholder="Ex : 18" />
          </Field>
          <button onClick={submitReconcile} className="w-full bg-emerald-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Valider la réconciliation</button>
        </Modal>
      )}
    </div>
  );
}

function GestionnaireAbonnements() {
  return (
    <div>
      <SectionHeader title="Abonnements" sub="Clients identifiés — postes abonnement" />
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Client</th>
              <th className="text-left px-4 py-3">Téléphone</th>
              <th className="text-left px-4 py-3">Poste</th>
              <th className="text-left px-4 py-3">Expiration</th>
              <th className="text-left px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {ABONNES.map((a, i) => (
              <tr key={i} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3">{a.nom}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{a.tel}</td>
                <td className="px-4 py-3 text-slate-500">{a.poste}</td>
                <td className="px-4 py-3 font-mono">{a.expire}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.statut === "actif" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>{a.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   PAGES — TECHNICIEN
   ============================================================ */
function TechnicienEquipements({ equipements }) {
  return (
    <div>
      <SectionHeader title="Équipements de mes bases" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {equipements.map((e) => (
          <div key={e.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="font-display text-slate-50">{e.nom}</p>
            <p className="text-xs text-slate-500 font-body mt-1">{e.type} · {e.base}</p>
            <div className="flex items-center justify-between mt-3 text-sm font-body">
              <span className="text-slate-400">{e.reparations} réparations</span>
              <span className="text-slate-500 font-mono">{e.immobilisation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PAGES — AGENT
   ============================================================ */
function AgentReception() {
  return (
    <div>
      <SectionHeader title="Réception de lots" sub="Fifonsi Adzo — sous Komla Agbeko" />
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center"><Boxes size={18} className="text-amber-400" /></div>
          <div>
            <p className="font-display text-slate-50">Lot A-233</p>
            <p className="text-xs text-slate-500 font-body">Reçu le 10 Jul, 08:12 — 100 tickets (1 jour)</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 font-body">À remettre aux vendeurs : Poste Marché (Sena Kouassi), Poste Rond-Point (Edem Aziaka).</p>
      </div>
    </div>
  );
}

function AgentReconciliation() {
  const distribues = 100;
  const [restant, setRestant] = useState(18);
  const [sent, setSent] = useState(false);
  const vendus = Math.max(0, distribues - (restant || 0));

  return (
    <div>
      <SectionHeader title="Réconciliation" sub="À la fin de la tournée — Lot A-233" />
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between text-sm font-body">
          <span className="text-slate-400">Tickets distribués</span>
          <span className="font-mono text-slate-200">{distribues}</span>
        </div>
        <Field label="Tickets restants rapportés">
          <input
            type="number" min="0" max={distribues}
            className={inputCls}
            value={restant}
            disabled={sent}
            onChange={(e) => setRestant(parseInt(e.target.value || "0", 10))}
          />
        </Field>
        <div className="h-px bg-slate-800" />
        <div className="flex items-center justify-between text-sm font-body">
          <span className="text-slate-300 font-semibold">Tickets vendus</span>
          <span className="font-mono text-amber-400 font-semibold">{vendus}</span>
        </div>
        {!sent ? (
          <button onClick={() => setSent(true)} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-2">Envoyer au gestionnaire</button>
        ) : (
          <div className="w-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 font-body font-semibold text-sm py-2.5 rounded-lg mt-2 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Envoyé au gestionnaire — en attente de confirmation
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */
export default function NetmasterMockup() {
  const [role, setRole] = useState("admin");
  const [tab, setTab] = useState("dashboard");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Shared, cross-role state — this is what makes actions feel "real"
  const [pannes, setPannes] = useState(INITIAL_PANNES);
  const [gestionnaires, setGestionnaires] = useState(INITIAL_GESTIONNAIRES);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [lots, setLots] = useState(INITIAL_LOTS);
  const [equipements, setEquipements] = useState(INITIAL_EQUIPEMENTS);
  const [bases, setBases] = useState(INITIAL_BASES);
  const [postes, setPostes] = useState(INITIAL_POSTES);
  const [ticketTypes, setTicketTypes] = useState(INITIAL_TICKET_TYPES);
  const [rapports, setRapports] = useState(INITIAL_RAPPORTS);
  const [equipmentTypes, setEquipmentTypes] = useState(INITIAL_EQUIPMENT_TYPES);
  const [toast, setToast] = useState("");

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const advancePanne = (id, actor) => {
    setPannes((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const next = STATUT_CONFIG[p.statut].next;
      return next ? { ...p, statut: next, dernierActeur: actor } : p;
    }));
    flash(`Statut de la panne mis à jour par ${actor}`);
  };

  const declarePanne = (nouvellePanne) => {
    setPannes((prev) => [nouvellePanne, ...prev]);
    flash(`Panne déclarée par ${nouvellePanne.dernierActeur} — en attente d'autorisation`);
  };

  const addGestionnaire = (g) => {
    setGestionnaires((prev) => [...prev, g]);
    flash(`Compte créé pour ${g.nom}`);
  };

  const addAgent = (a) => {
    setAgents((prev) => [...prev, a]);
    flash(`Compte agent créé pour ${a.nom}`);
  };

  const toggleAgent = (nom) => {
    setAgents((prev) => prev.map((a) => a.nom === nom ? { ...a, statut: a.statut === "actif" ? "suspendu" : "actif" } : a));
    flash("Statut du compte agent mis à jour");
  };

  const toggleAgentValidation = (nom) => {
    setAgents((prev) => prev.map((a) => a.nom === nom ? { ...a, peutValider: !a.peutValider } : a));
    flash("Droit de validation mis à jour");
  };

  const addLot = (l) => {
    setLots((prev) => [...prev, l]);
    flash(`Lot ${l.lot} enregistré`);
  };

  const reconcileLot = (lotId, restant) => {
    setLots((prev) => prev.map((l) => l.lot === lotId ? { ...l, restant, statut: "réconcilié" } : l));
    flash(`Lot ${lotId} réconcilié`);
  };

  const addEquipmentType = (t) => {
    setEquipmentTypes((prev) => [...prev, t]);
    flash(`Type "${t}" ajouté`);
  };

  const removeEquipmentType = (t) => {
    setEquipmentTypes((prev) => prev.filter((x) => x !== t));
    flash(`Type "${t}" retiré`);
  };

  const addEquipement = (e) => {
    setEquipements((prev) => [...prev, e]);
    flash(`${e.nom} ajouté au parc`);
  };

  const removeEquipement = (id) => {
    setEquipements((prev) => prev.filter((e) => e.id !== id));
    flash("Équipement retiré du parc");
  };

  const addBase = (b) => {
    setBases((prev) => [...prev, b]);
    flash(`${b.nom} créée`);
  };

  const removeBase = (id) => {
    setBases((prev) => prev.filter((b) => b.id !== id));
    flash("Base retirée");
  };

  const addPoste = (p) => {
    setPostes((prev) => [...prev, p]);
    flash(`${p.nom} créé`);
  };

  const removePoste = (id) => {
    setPostes((prev) => prev.filter((p) => p.id !== id));
    flash("Poste retiré");
  };

  const saveTarifs = (posteId, patch) => {
    setPostes((prev) => prev.map((p) => p.id === posteId ? { ...p, ...patch } : p));
    flash("Tarifs mis à jour");
  };

  const addTicketType = (t) => {
    setTicketTypes((prev) => [...prev, t]);
    flash(`Type de ticket "${t}" ajouté`);
  };

  const removeTicketType = (t) => {
    setTicketTypes((prev) => prev.filter((x) => x !== t));
    flash(`Type de ticket "${t}" retiré`);
  };

  const validateRapport = (id, who) => {
    setRapports((prev) => prev.map((r) => r.id === id ? { ...r, statut: "valide", validePar: who } : r));
    flash(`Rapport ${id} validé par ${who}`);
  };

  const rejectRapport = (id, who) => {
    setRapports((prev) => prev.map((r) => r.id === id ? { ...r, statut: "rejete", validePar: who } : r));
    flash(`Rapport ${id} rejeté par ${who}`);
  };

  const navItems = NAV[role];
  const validTab = navItems.find((n) => n.id === tab) ? tab : navItems[0].id;
  const actor = ACTOR_NAMES[role];
  const currentAgent = agents.find((a) => a.nom === ACTOR_NAMES.agent);

  const renderPage = () => {
    if (role === "admin") {
      if (validTab === "dashboard") return <AdminDashboard />;
      if (validTab === "bases") return (
        <AdminBases
          bases={bases} postes={postes} equipements={equipements} ticketTypes={ticketTypes}
          onAddBase={addBase} onRemoveBase={removeBase}
          onAddPoste={addPoste} onRemovePoste={removePoste}
          onSaveTarifs={saveTarifs}
          onAddTicketType={addTicketType} onRemoveTicketType={removeTicketType}
        />
      );
      if (validTab === "gestionnaires") return <AdminGestionnaires gestionnaires={gestionnaires} onAdd={addGestionnaire} />;
      if (validTab === "agents") return <AdminAgents agents={agents} onAdd={addAgent} onToggle={toggleAgent} onToggleValidation={toggleAgentValidation} />;
      if (validTab === "rapports") return (
        <RapportsPanel
          rapports={rapports} canValidate actor={actor}
          onValidate={validateRapport} onReject={rejectRapport}
        />
      );
      if (validTab === "pannes") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases}
          title="Supervision des pannes" sub="Vue globale — pleins pouvoirs (comme sur le terrain)"
          canDeclare canAuthorize canRepair canValidate
          onAdvance={advancePanne} onDeclare={declarePanne}
        />
      );
      if (validTab === "equipements") return (
        <AdminEquipements
          equipements={equipements} types={equipmentTypes} bases={bases}
          onAddType={addEquipmentType} onRemoveType={removeEquipmentType}
          onAddEquipement={addEquipement} onRemoveEquipement={removeEquipement}
        />
      );
    }
    if (role === "gestionnaire") {
      if (validTab === "dashboard") return <GestionnaireDashboard agents={agents} />;
      if (validTab === "distribution") return <GestionnaireDistribution lots={lots} onAddLot={addLot} onReconcile={reconcileLot} agents={agents} />;
      if (validTab === "abonnements") return <GestionnaireAbonnements />;
      if (validTab === "rapports") return (
        <RapportsPanel
          rapports={rapports} canValidate actor={actor}
          onValidate={validateRapport} onReject={rejectRapport}
        />
      );
      if (validTab === "pannes") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases}
          title="Pannes de mon secteur" sub="Vous pouvez déclarer, autoriser, réparer et valider — comme sur le terrain"
          canDeclare canAuthorize canRepair canValidate
          onAdvance={advancePanne} onDeclare={declarePanne}
        />
      );
    }
    if (role === "technicien") {
      if (validTab === "interventions") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases}
          title="Mes interventions" sub="Kossi Amouzou & Ayi Kokou — jamais d'accès à l'argent ni aux tickets"
          canDeclare canRepair
          onAdvance={advancePanne} onDeclare={declarePanne}
        />
      );
      if (validTab === "equipements") return <TechnicienEquipements equipements={equipements} />;
    }
    if (role === "agent") {
      if (validTab === "reception") return <AgentReception />;
      if (validTab === "reconciliation") return <AgentReconciliation />;
      if (validTab === "pannes") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases}
          title="Pannes" sub={currentAgent?.peutValider ? "Vous pouvez déclarer, réparer et valider — droit accordé par l'administrateur" : "Vous pouvez déclarer et réparer — la validation n'est pas activée pour votre compte"}
          canDeclare canRepair canValidate={!!currentAgent?.peutValider}
          onAdvance={advancePanne} onDeclare={declarePanne}
        />
      );
    }
    return null;
  };

  const handleRoleChange = (r) => {
    setRole(r);
    setTab(NAV[r][0].id);
    setRoleMenuOpen(false);
    setSidebarOpen(false);
  };

  const handleTabChange = (id) => {
    setTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-slate-950 font-body flex overflow-hidden">
      <FontLoader />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-slate-950" />
            </div>
            <div>
              <p className="font-display text-slate-50 text-sm leading-none">NETMASTER</p>
              <p className="text-[10px] text-slate-500 tracking-widest">WISP CONTROL</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === validTab;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? "bg-amber-400/10 text-amber-400" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto shrink-0" />}
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-slate-800">
          <p className="text-[10px] text-slate-600 font-mono">Lomé, Togo · v0.1 maquette</p>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-3 sm:px-6 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 shrink-0">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-slate-500 min-w-0">
              <Search size={16} className="shrink-0" />
              <span className="text-sm font-body truncate">Rechercher une base, un poste, un ticket…</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Bell size={17} className="text-slate-500 hidden sm:block" />
            <Settings2 size={17} className="text-slate-500 hidden sm:block" />
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-200"
              >
                <UserCircle2 size={16} className="text-amber-400 shrink-0" />
                <span className="hidden xs:inline">{ROLE_LABELS[role]}</span>
                <ChevronDown size={14} className="text-slate-500 shrink-0" />
              </button>
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl z-50">
                  <p className="text-[10px] uppercase tracking-wide text-slate-600 px-3 pt-2 pb-1 font-body">Simuler le rôle</p>
                  {Object.keys(NAV).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 text-sm ${r === role ? "text-amber-400 bg-amber-400/5" : "text-slate-300 hover:bg-slate-800"}`}
                    >
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>

      <Toast message={toast} />
    </div>
  );
}
