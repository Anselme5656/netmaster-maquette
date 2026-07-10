import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Radio, Users, FileBarChart, AlertTriangle, Wrench,
  Package, ClipboardList, UserCircle2, ChevronRight, Signal, MapPin,
  CheckCircle2, Clock, XCircle, ArrowRightLeft, CreditCard, Boxes,
  TrendingUp, ShieldCheck, Antenna, PhoneCall, ChevronDown, Search,
  Bell, Settings2, Zap, Menu, X
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
const BASES = [
  { id: "b1", nom: "Base Baguida", quartier: "Baguida, Lomé", postes: 4, statut: "active", gestionnaire: "Komla Agbeko" },
  { id: "b2", nom: "Base Adidogomé", quartier: "Adidogomé, Lomé", postes: 3, statut: "active", gestionnaire: "Afi Mensah" },
  { id: "b3", nom: "Base Agbalépédogan", quartier: "Agbalépédogan, Lomé", postes: 2, statut: "active", gestionnaire: "Komla Agbeko" },
  { id: "b4", nom: "Base Bè-Kpota", quartier: "Bè-Kpota, Lomé", postes: 3, statut: "maintenance", gestionnaire: "Yawa Dogbe" },
];

const POSTES = [
  { id: "p1", base: "Base Baguida", nom: "Poste Marché", type: "Wifi Zone", vendeur: "Sena Kouassi" },
  { id: "p2", base: "Base Baguida", nom: "Poste Rond-Point", type: "Wifi Zone", vendeur: "Edem Aziaka" },
  { id: "p3", base: "Base Baguida", nom: "Poste Résidence Aku", type: "Abonnement", vendeur: "—" },
  { id: "p4", base: "Base Adidogomé", nom: "Poste Carrefour", type: "Wifi Zone", vendeur: "Ama Sossou" },
  { id: "p5", base: "Base Adidogomé", nom: "Poste Immeuble Nyekonakpoe", type: "Abonnement", vendeur: "—" },
];

const TICKET_TYPES = [
  { nom: "1 jour", prix: 100, couleur: "#2dd4bf" },
  { nom: "3 jours", prix: 200, couleur: "#38bdf8" },
  { nom: "7 jours", prix: 500, couleur: "#a78bfa" },
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

const EQUIPEMENTS = [
  { nom: "Antenne secteur Nord", base: "Base Baguida", reparations: 4, immobilisation: "6h cumulées", etat: "surveiller" },
  { nom: "Routeur Poste Carrefour", base: "Base Adidogomé", reparations: 1, immobilisation: "2h", etat: "ok" },
  { nom: "Switch central", base: "Base Agbalépédogan", reparations: 3, immobilisation: "9h cumulées", etat: "surveiller" },
  { nom: "Antenne secteur Sud", base: "Base Bè-Kpota", reparations: 6, immobilisation: "14h cumulées", etat: "critique" },
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
  { nom: "Fifonsi Adzo", statut: "actif", gestionnaire: "Komla Agbeko", lot: "120 tickets remis · 10 Jul" },
  { nom: "Yao Klu", statut: "actif", gestionnaire: "Afi Mensah", lot: "80 tickets remis · 09 Jul" },
  { nom: "Delali Amegan", statut: "suspendu", gestionnaire: "Yawa Dogbe", lot: "60 tickets remis · 10 Jul" },
];

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
    { id: "pannes", label: "Pannes de mon secteur", icon: AlertTriangle },
  ],
  technicien: [
    { id: "interventions", label: "Mes interventions", icon: Wrench },
    { id: "equipements", label: "Équipements", icon: Antenna },
  ],
  agent: [
    { id: "reception", label: "Réception de lots", icon: Boxes },
    { id: "reconciliation", label: "Réconciliation", icon: ArrowRightLeft },
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

function AdminBases() {
  return (
    <div>
      <SectionHeader title="Bases & Postes" sub="Structure physique du réseau" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {BASES.map((b) => (
          <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Antenna size={16} className="text-amber-400" />
                <p className="font-display text-slate-50">{b.nom}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-body ${b.statut === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                {b.statut === "active" ? "Active" : "Maintenance"}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-body mt-1 flex items-center gap-1"><MapPin size={12}/> {b.quartier}</p>
            <div className="flex items-center justify-between mt-4 text-sm font-body">
              <span className="text-slate-400">{b.postes} postes rattachés</span>
              <span className="text-slate-400">Gest. {b.gestionnaire}</span>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Détail des postes" />
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Poste</th>
              <th className="text-left px-4 py-3">Base</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Vendeur affecté</th>
            </tr>
          </thead>
          <tbody>
            {POSTES.map((p) => (
              <tr key={p.id} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3">{p.nom}</td>
                <td className="px-4 py-3 text-slate-500">{p.base}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.type === "Wifi Zone" ? "bg-teal-400/10 text-teal-400" : "bg-amber-400/10 text-amber-400"}`}>{p.type}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{p.vendeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

function AdminAgents({ agents, onAdd, onToggle }) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [gestionnaire, setGestionnaire] = useState(INITIAL_GESTIONNAIRES[0].nom);

  const submit = () => {
    if (!nom.trim()) return;
    onAdd({ nom: nom.trim(), statut: "actif", gestionnaire, lot: "Aucun lot reçu pour l'instant" });
    setNom(""); setOpen(false);
  };

  return (
    <div>
      <SectionHeader title="Agents" sub="Chaque agent a un compte — l'administrateur peut le créer ou le suspendre" action={
        <button onClick={() => setOpen(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Ajouter un agent</button>
      } />
      <div className="space-y-3">
        {agents.map((a) => (
          <div key={a.nom} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${a.statut === "actif" ? "bg-slate-800" : "bg-red-400/10"}`}>
                <UserCircle2 size={20} className={a.statut === "actif" ? "text-slate-400" : "text-red-400"} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-slate-50 truncate">{a.nom}</p>
                <p className="text-xs text-slate-500 font-body truncate">Sous {a.gestionnaire} · {a.lot}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-body ${a.statut === "actif" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                {a.statut === "actif" ? "Compte actif" : "Suspendu"}
              </span>
              <button
                onClick={() => onToggle(a.nom)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${a.statut === "actif" ? "bg-red-400/10 text-red-400 hover:bg-red-400/20" : "bg-emerald-400 text-slate-950 hover:bg-emerald-300"}`}
              >
                {a.statut === "actif" ? "Suspendre" : "Réactiver"}
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

function AdminRapports() {
  return (
    <div>
      <SectionHeader title="Rapports financiers" sub="Consolidé toutes bases" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard label="Recette hebdomadaire" value={fmtFCFA(178400)} icon={FileBarChart} accent="amber" />
        <KPICard label="Recette mensuelle" value={fmtFCFA(715000)} icon={TrendingUp} accent="teal" />
        <KPICard label="Écarts de caisse signalés" value="2" sub="À vérifier avec les gestionnaires" icon={AlertTriangle} accent="red" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Base</th>
              <th className="text-left px-4 py-3">Gestionnaire</th>
              <th className="text-left px-4 py-3">Déclaré</th>
              <th className="text-left px-4 py-3">Attendu</th>
              <th className="text-left px-4 py-3">Écart</th>
            </tr>
          </thead>
          <tbody>
            {[
              { base: "Baguida", g: "Komla Agbeko", declare: 54000, attendu: 54000 },
              { base: "Adidogomé", g: "Afi Mensah", declare: 41000, attendu: 43500 },
              { base: "Agbalépédogan", g: "Komla Agbeko", declare: 27500, attendu: 27500 },
              { base: "Bè-Kpota", g: "Yawa Dogbe", declare: 19000, attendu: 21200 },
            ].map((r, i) => {
              const ecart = r.declare - r.attendu;
              return (
                <tr key={i} className="border-t border-slate-800 text-slate-300">
                  <td className="px-4 py-3">{r.base}</td>
                  <td className="px-4 py-3 text-slate-500">{r.g}</td>
                  <td className="px-4 py-3 font-mono">{fmtFCFA(r.declare)}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{fmtFCFA(r.attendu)}</td>
                  <td className={`px-4 py-3 font-mono ${ecart === 0 ? "text-emerald-400" : "text-red-400"}`}>{ecart === 0 ? "—" : fmtFCFA(ecart)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPannes({ pannes }) {
  return (
    <div>
      <SectionHeader title="Supervision des pannes" sub="Vue globale — toutes bases" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pannes.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-slate-500">{p.id}</p>
              <StatutBadge statut={p.statut} />
            </div>
            <p className="font-display text-slate-50 mt-2">{p.equipement}</p>
            <p className="text-sm text-slate-500 font-body">{p.base} · {p.desc}</p>
            <PanneProgress statut={p.statut} />
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-body">
              <span className="flex items-center gap-1"><Wrench size={12}/> {p.technicien}</span>
              <span className="flex items-center gap-1"><Clock size={12}/> {p.declare}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEquipements() {
  return (
    <div>
      <SectionHeader title="Équipements" sub="Fréquence de réparation par actif" />
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Équipement</th>
              <th className="text-left px-4 py-3">Base</th>
              <th className="text-left px-4 py-3">Réparations (6 mois)</th>
              <th className="text-left px-4 py-3">Immobilisation</th>
              <th className="text-left px-4 py-3">État</th>
            </tr>
          </thead>
          <tbody>
            {EQUIPEMENTS.map((e, i) => (
              <tr key={i} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3">{e.nom}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-600 font-body mt-3">L'antenne secteur Sud de Bè-Kpota cumule 6 réparations en 6 mois — envisager un remplacement plutôt qu'une nouvelle réparation.</p>
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

function GestionnairePannes({ pannes, onAdvance }) {
  return (
    <div>
      <SectionHeader title="Pannes de mon secteur" sub="Autoriser la réparation, valider une fois confirmée" />
      <div className="space-y-3">
        {pannes.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-body text-slate-200 truncate">{p.equipement} <span className="text-slate-600 font-mono text-xs">({p.id})</span></p>
              <p className="text-xs text-slate-500 font-body">{p.base} · {p.desc}</p>
              <PanneProgress statut={p.statut} />
            </div>
            <div className="text-right shrink-0">
              <StatutBadge statut={p.statut} />
              {p.statut === "declaree" && <button onClick={() => onAdvance(p.id)} className="block mt-2 text-xs bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg">Autoriser</button>}
              {p.statut === "reparee" && <button onClick={() => onAdvance(p.id)} className="block mt-2 text-xs bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg">Valider</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PAGES — TECHNICIEN
   ============================================================ */
function TechnicienInterventions({ pannes, onAdvance, onDeclare }) {
  const [open, setOpen] = useState(false);
  const [base, setBase] = useState(BASES[0].nom);
  const [equipement, setEquipement] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!equipement.trim() || !desc.trim()) return;
    const num = 17 + pannes.filter((p) => true).length;
    onDeclare({
      id: `PN-0${num}`, base, equipement: equipement.trim(), statut: "declaree",
      technicien: "Kossi Amouzou", declare: "10 Jul, à l'instant", desc: desc.trim(),
    });
    setEquipement(""); setDesc(""); setOpen(false);
  };

  return (
    <div>
      <SectionHeader title="Mes interventions" sub="Kossi Amouzou & Ayi Kokou" action={
        <button onClick={() => setOpen(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Déclarer une panne</button>
      } />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pannes.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-slate-500">{p.id}</p>
              <StatutBadge statut={p.statut} />
            </div>
            <p className="font-display text-slate-50 mt-2">{p.equipement}</p>
            <p className="text-sm text-slate-500 font-body">{p.base} · {p.desc}</p>
            <PanneProgress statut={p.statut} />
            {p.statut === "autorisee" && (
              <button onClick={() => onAdvance(p.id)} className="mt-3 text-xs bg-sky-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Wrench size={12} /> Marquer réparée
              </button>
            )}
          </div>
        ))}
      </div>

      {open && (
        <Modal title="Déclarer une panne" sub="Sera visible par le gestionnaire pour autorisation" onClose={() => setOpen(false)}>
          <Field label="Base">
            <select className={inputCls} value={base} onChange={(e) => setBase(e.target.value)}>
              {BASES.map((b) => <option key={b.id} value={b.nom}>{b.nom}</option>)}
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

function TechnicienEquipements() {
  return (
    <div>
      <SectionHeader title="Équipements de mes bases" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EQUIPEMENTS.map((e, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="font-display text-slate-50">{e.nom}</p>
            <p className="text-xs text-slate-500 font-body mt-1">{e.base}</p>
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
  const [toast, setToast] = useState("");

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const advancePanne = (id) => {
    setPannes((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const next = STATUT_CONFIG[p.statut].next;
      return next ? { ...p, statut: next } : p;
    }));
    flash("Statut de la panne mis à jour");
  };

  const declarePanne = (nouvellePanne) => {
    setPannes((prev) => [nouvellePanne, ...prev]);
    flash("Panne déclarée — en attente d'autorisation");
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

  const addLot = (l) => {
    setLots((prev) => [...prev, l]);
    flash(`Lot ${l.lot} enregistré`);
  };

  const reconcileLot = (lotId, restant) => {
    setLots((prev) => prev.map((l) => l.lot === lotId ? { ...l, restant, statut: "réconcilié" } : l));
    flash(`Lot ${lotId} réconcilié`);
  };

  const navItems = NAV[role];
  const validTab = navItems.find((n) => n.id === tab) ? tab : navItems[0].id;

  const renderPage = () => {
    if (role === "admin") {
      if (validTab === "dashboard") return <AdminDashboard />;
      if (validTab === "bases") return <AdminBases />;
      if (validTab === "gestionnaires") return <AdminGestionnaires gestionnaires={gestionnaires} onAdd={addGestionnaire} />;
      if (validTab === "agents") return <AdminAgents agents={agents} onAdd={addAgent} onToggle={toggleAgent} />;
      if (validTab === "rapports") return <AdminRapports />;
      if (validTab === "pannes") return <AdminPannes pannes={pannes} />;
      if (validTab === "equipements") return <AdminEquipements />;
    }
    if (role === "gestionnaire") {
      if (validTab === "dashboard") return <GestionnaireDashboard agents={agents} />;
      if (validTab === "distribution") return <GestionnaireDistribution lots={lots} onAddLot={addLot} onReconcile={reconcileLot} agents={agents} />;
      if (validTab === "abonnements") return <GestionnaireAbonnements />;
      if (validTab === "pannes") return <GestionnairePannes pannes={pannes} onAdvance={advancePanne} />;
    }
    if (role === "technicien") {
      if (validTab === "interventions") return <TechnicienInterventions pannes={pannes} onAdvance={advancePanne} onDeclare={declarePanne} />;
      if (validTab === "equipements") return <TechnicienEquipements />;
    }
    if (role === "agent") {
      if (validTab === "reception") return <AgentReception />;
      if (validTab === "reconciliation") return <AgentReconciliation />;
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
