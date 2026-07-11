import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Radio, Users, FileBarChart, AlertTriangle, Wrench,
  Package, ClipboardList, UserCircle2, ChevronRight, Signal, MapPin,
  CheckCircle2, Clock, XCircle, ArrowRightLeft, CreditCard, Boxes,
  TrendingUp, ShieldCheck, Antenna, PhoneCall, ChevronDown, Search,
  Bell, Settings2, Zap, Menu, X, Trash2, Download, Filter, FileText, Check,
  Award, Navigation, Calendar, Plus, Minus
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
// Chaque base a un tarif d'abonnement de référence — modifiable par l'administrateur.
// Un abonné peut néanmoins avoir un prix personnalisé qui écrase celui de sa base.
const INITIAL_BASES = [
  { id: "b1", nom: "Base Baguida", quartier: "Baguida, Lomé", statut: "active", gestionnaire: "Komla Agbeko", tarifAbonnement: 1500 },
  { id: "b2", nom: "Base Adidogomé", quartier: "Adidogomé, Lomé", statut: "active", gestionnaire: "Afi Mensah", tarifAbonnement: 2000 },
  { id: "b3", nom: "Base Agbalépédogan", quartier: "Agbalépédogan, Lomé", statut: "active", gestionnaire: "Komla Agbeko", tarifAbonnement: 1500 },
  { id: "b4", nom: "Base Bè-Kpota", quartier: "Bè-Kpota, Lomé", statut: "maintenance", gestionnaire: "Yawa Dogbe", tarifAbonnement: 1800 },
];

// Les POSTES sont les points de vente de tickets Wi-Fi zone, rattachés à une base.
// Les tarifs des tickets varient d'un poste à l'autre.
const INITIAL_POSTES = [
  { id: "p1", baseId: "b1", nom: "Poste Marché", vendeur: "Sena Kouassi", tarifs: { "1 jour": 100, "3 jours": 200, "7 jours": 500 }, gps: { lat: 6.1919, lng: 1.3200 } },
  { id: "p2", baseId: "b1", nom: "Poste Rond-Point", vendeur: "Edem Aziaka", tarifs: { "1 jour": 100, "3 jours": 200, "7 jours": 500 }, gps: { lat: 6.1885, lng: 1.3255 } },
  { id: "p3", baseId: "b2", nom: "Poste Carrefour", vendeur: "Ama Sossou", tarifs: { "1 jour": 100, "3 jours": 250, "7 jours": 550 }, gps: { lat: 6.1740, lng: 1.2090 } },
  { id: "p4", baseId: "b2", nom: "Poste Gare", vendeur: "Kodjo Amevor", tarifs: { "1 jour": 100, "3 jours": 250, "7 jours": 550 }, gps: null },
  { id: "p5", baseId: "b3", nom: "Poste Carrefour Limousine", vendeur: "Afiwa Gbedey", tarifs: { "1 jour": 100, "3 jours": 200, "7 jours": 500 }, gps: null },
];

// Les ABONNÉS sont rattachés directement à une BASE (branche parallèle aux postes).
// prixPerso = null → l'abonné paie le tarif de référence de sa base.
// statut : actif | suspendu   ·   paiement : a_jour | en_retard | impaye
const INITIAL_ABONNES = [
  { id: "ab1", baseId: "b1", nom: "M. Kpodar Sena", tel: "90 12 34 56", adresse: "Rue des Cocotiers, Baguida", prixPerso: null, statut: "actif", paiement: "a_jour", echeance: "2026-07-28", depuis: "2025-11-01" },
  { id: "ab2", baseId: "b1", nom: "Mme Adjovi Tsolenyanu", tel: "91 45 67 12", adresse: "Résidence Aku, villa 4", prixPerso: 2500, statut: "actif", paiement: "a_jour", echeance: "2026-08-02", depuis: "2026-01-15" },
  { id: "ab3", baseId: "b1", nom: "M. Bakoma Essonam", tel: "92 88 21 09", adresse: "Immeuble Sodji, 2e étage", prixPerso: null, statut: "actif", paiement: "en_retard", echeance: "2026-07-08", depuis: "2025-08-20" },
  { id: "ab4", baseId: "b2", nom: "Mme Lawson Akouvi", tel: "93 11 22 33", adresse: "Nyekonakpoe, lot 12", prixPerso: null, statut: "actif", paiement: "a_jour", echeance: "2026-07-25", depuis: "2026-02-10" },
  { id: "ab5", baseId: "b2", nom: "M. Agbo Yao", tel: "96 55 44 21", adresse: "Adidogomé, près du marché", prixPerso: 1200, statut: "suspendu", paiement: "impaye", echeance: "2026-06-15", depuis: "2025-05-05" },
  { id: "ab6", baseId: "b3", nom: "Mlle Amenyo Rita", tel: "97 33 66 88", adresse: "Agbalépédogan, rue 45", prixPerso: null, statut: "actif", paiement: "a_jour", echeance: "2026-07-30", depuis: "2026-03-01" },
  { id: "ab7", baseId: "b4", nom: "M. Dossou Komi", tel: "98 74 12 65", adresse: "Bè-Kpota, carrefour", prixPerso: null, statut: "actif", paiement: "en_retard", echeance: "2026-07-05", depuis: "2025-12-12" },
];

// Catalogue global des types de tickets (durées) — le prix, lui, se règle poste par poste
const INITIAL_TICKET_TYPES = ["1 jour", "3 jours", "7 jours"];

// Rapports journaliers — simulés pour le maket (validation par gestionnaire, historique filtrable)
const INITIAL_RAPPORTS = [
  { id: "R-0512", iso: "2026-07-10", date: "10 Jul 2026", baseId: "b1", posteId: "p1", auteur: "Fifonsi Adzo (agent)", type: "Caisse", declare: 54000, attendu: 54000, statut: "valide", validePar: "Komla Agbeko", justification: null },
  { id: "R-0511", iso: "2026-07-10", date: "10 Jul 2026", baseId: "b2", posteId: "p4", auteur: "Yao Klu (agent)", type: "Caisse", declare: 41000, attendu: 43500, statut: "en_attente", validePar: null, justification: null },
  { id: "R-0510", iso: "2026-07-10", date: "10 Jul 2026", baseId: "b3", posteId: null, auteur: "Ayi Kokou (technicien)", type: "Intervention", declare: null, attendu: null, statut: "en_attente", validePar: null, justification: null },
  { id: "R-0509", iso: "2026-07-09", date: "09 Jul 2026", baseId: "b4", posteId: null, auteur: "Delali Amegan (agent)", type: "Caisse", declare: 19000, attendu: 21200, statut: "rejete", validePar: "Yawa Dogbe", justification: "Écart non justifié — 2 200 F manquants" },
  { id: "R-0508", iso: "2026-07-09", date: "09 Jul 2026", baseId: "b1", posteId: null, auteur: "Kossi Amouzou (technicien)", type: "Intervention", declare: null, attendu: null, statut: "valide", validePar: "Komla Agbeko", justification: null },
  { id: "R-0507", iso: "2026-07-08", date: "08 Jul 2026", baseId: "b1", posteId: "p2", auteur: "Fifonsi Adzo (agent)", type: "Caisse", declare: 38000, attendu: 38000, statut: "valide", validePar: "Komla Agbeko", justification: null },
  { id: "R-0506", iso: "2026-07-07", date: "07 Jul 2026", baseId: "b1", posteId: "p1", auteur: "Fifonsi Adzo (agent)", type: "Caisse", declare: 47500, attendu: 48000, statut: "valide", validePar: "Komla Agbeko", justification: "1 ticket abîmé — écart accepté" },
  { id: "R-0505", iso: "2026-07-06", date: "06 Jul 2026", baseId: "b2", posteId: "p4", auteur: "Yao Klu (agent)", type: "Caisse", declare: 52000, attendu: 52000, statut: "valide", validePar: "Afi Mensah", justification: null },
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

// Une panne cible soit un équipement précis, soit tout un poste (sans précision), soit la base
const INITIAL_PANNES = [
  { id: "PN-014", baseId: "b1", posteId: null, equipementId: "eq2", cible: "MikroTik central", statut: "validee", technicien: "Kossi Amouzou", declare: "08 Jul, 14:20", desc: "Perte de signal intermittente", dernierActeur: "Komla Agbeko" },
  { id: "PN-015", baseId: "b2", posteId: "p4", equipementId: "eq5", cible: "Routeur Poste Carrefour", statut: "reparee", technicien: "Ayi Kokou", declare: "09 Jul, 09:05", desc: "Coupure totale après orage", dernierActeur: "Ayi Kokou" },
  { id: "PN-016", baseId: "b1", posteId: "p1", equipementId: null, cible: "Poste Marché (tout le poste)", statut: "autorisee", technicien: "Kossi Amouzou", declare: "10 Jul, 07:40", desc: "Faiblesse de connexion sur tout le poste", dernierActeur: "Komla Agbeko" },
  { id: "PN-017", baseId: "b4", posteId: null, equipementId: "eq7", cible: "Nano M2 secteur Sud", statut: "declaree", technicien: "Ayi Kokou", declare: "10 Jul, 11:15", desc: "Aucun signal depuis ce matin", dernierActeur: "Ayi Kokou" },
];

const STATUT_CONFIG = {
  declaree: { label: "Déclarée", color: "text-red-400", bg: "bg-red-400/10", ring: "ring-red-400/30", icon: AlertTriangle, step: 1, next: "autorisee", nextLabel: "Autoriser", nextRole: "gestionnaire" },
  autorisee: { label: "Autorisée", color: "text-amber-400", bg: "bg-amber-400/10", ring: "ring-amber-400/30", icon: ShieldCheck, step: 2, next: "reparee", nextLabel: "Marquer réparée", nextRole: "technicien" },
  reparee: { label: "Réparée (à confirmer)", color: "text-sky-400", bg: "bg-sky-400/10", ring: "ring-sky-400/30", icon: Wrench, step: 3, next: "validee", nextLabel: "Valider", nextRole: "gestionnaire" },
  validee: { label: "Validée", color: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/30", icon: CheckCircle2, step: 4, next: null },
};

// Types d'équipement — liste réelle du client, entièrement modifiable par l'admin
const INITIAL_EQUIPMENT_TYPES = ["MikroTik", "Nano M5 (1ère gén.)", "Nano M5 (2e gén.)", "Nano M2", "Starlink", "PE", "Poteau", "Routeur"];

// Un équipement est rattaché à une base, et éventuellement à un poste de cette base.
// posteId = null → équipement de la base elle-même (ex : Starlink, qui n'existe qu'à la base).
const INITIAL_EQUIPEMENTS = [
  { id: "eq1", nom: "Starlink principal", type: "Starlink", baseId: "b1", posteId: null, reparations: 1, immobilisation: "3h", etat: "ok" },
  { id: "eq2", nom: "MikroTik central", type: "MikroTik", baseId: "b1", posteId: null, reparations: 4, immobilisation: "6h cumulées", etat: "surveiller" },
  { id: "eq3", nom: "Nano M5 Marché", type: "Nano M5 (2e gén.)", baseId: "b1", posteId: "p1", reparations: 2, immobilisation: "4h", etat: "ok" },
  { id: "eq4", nom: "Routeur Rond-Point", type: "Routeur", baseId: "b1", posteId: "p2", reparations: 1, immobilisation: "2h", etat: "ok" },
  { id: "eq5", nom: "Routeur Poste Carrefour", type: "Routeur", baseId: "b2", posteId: "p4", reparations: 1, immobilisation: "2h", etat: "ok" },
  { id: "eq6", nom: "MikroTik Adidogomé", type: "MikroTik", baseId: "b2", posteId: null, reparations: 3, immobilisation: "9h cumulées", etat: "surveiller" },
  { id: "eq7", nom: "Nano M2 secteur Sud", type: "Nano M2", baseId: "b4", posteId: null, reparations: 6, immobilisation: "14h cumulées", etat: "critique" },
];

// ============================================================
// SYSTÈME DE POINTS — barème réel du client
// Seul l'ADMINISTRATEUR peut créer une tâche et fixer ses points.
// ============================================================
const CATEGORIES_TACHE = ["Technique", "Tickets & collecte"];

const INITIAL_BAREME = [
  // Technique — communes au technicien principal et aux secondaires (participation)
  { id: "t1", tache: "Installation d'un nouvel UFI", points: 3, categorie: "Technique" },
  { id: "t2", tache: "Correction de la position d'un UFI", points: 2, categorie: "Technique" },
  { id: "t3", tache: "Remplacement d'un routeur", points: 1, categorie: "Technique" },
  { id: "t4", tache: "Remplacement d'un PU", points: 1, categorie: "Technique" },
  { id: "t5", tache: "Installation d'un M2", points: 0.5, categorie: "Technique" },
  // Tickets & collecte
  { id: "t6", tache: "Distribution de tickets à un point de vente", points: 0.5, categorie: "Tickets & collecte" },
  { id: "t7", tache: "Compte (rapprochement) avec un vendeur", points: 1, categorie: "Tickets & collecte" },
  { id: "t8", tache: "Gestion correcte du stock de tickets de la journée", points: 1, categorie: "Tickets & collecte" },
  { id: "t9", tache: "Préparation des tickets pour les points de vente", points: 0.5, categorie: "Tickets & collecte" },
];

const INITIAL_REGLES_POINTS = {
  objectifJournalier: 10,
  seuilBonus: 220,
  seuilAvertissement: 180,
};

// MISSIONS — le gestionnaire demande, le technicien coche, le gestionnaire valide
// statut : demandee → rapportee → validee (ou rejetee)
const INITIAL_MISSIONS = [
  {
    id: "M-042", date: "11 Jul 2026", baseId: "b1", posteId: "p1",
    demandeePar: "Komla Agbeko", assigneA: "Kossi Amouzou",
    consigne: "Installer un nouvel UFI et remplacer le routeur défaillant",
    tachesDemandees: ["t1", "t3"],
    rapport: null,
    statut: "demandee", validePar: null,
  },
  {
    id: "M-041", date: "11 Jul 2026", baseId: "b2", posteId: "p4",
    demandeePar: "Afi Mensah", assigneA: "Ayi Kokou",
    consigne: "Corriger la position de l'UFI, orientation faussée par le vent",
    tachesDemandees: ["t2"],
    rapport: [{ tacheId: "t2", quantite: 1 }, { tacheId: "t5", quantite: 2 }],
    statut: "rapportee", validePar: null,
  },
  {
    id: "M-040", date: "10 Jul 2026", baseId: "b1", posteId: "p2",
    demandeePar: "Komla Agbeko", assigneA: "Kossi Amouzou",
    consigne: "Tournée de distribution et rapprochement des comptes",
    tachesDemandees: ["t6", "t7"],
    rapport: [{ tacheId: "t6", quantite: 4 }, { tacheId: "t7", quantite: 3 }],
    statut: "validee", validePar: "Komla Agbeko",
  },
  {
    id: "M-039", date: "10 Jul 2026", baseId: "b4", posteId: null,
    demandeePar: "Yawa Dogbe", assigneA: "Ayi Kokou",
    consigne: "Installation de 2 UFI sur la base",
    tachesDemandees: ["t1"],
    rapport: [{ tacheId: "t1", quantite: 2 }, { tacheId: "t3", quantite: 1 }],
    statut: "validee", validePar: "Yawa Dogbe",
  },
];

// Demandes d'ajout au barème — remontées par le gestionnaire, tranchées par l'admin
const INITIAL_DEMANDES_TACHE = [
  {
    id: "DT-003", date: "11 Jul 2026", demandeePar: "Komla Agbeko",
    libelle: "Remplacement d'un câble d'alimentation sur poteau",
    motif: "Kossi a dû le faire hier — cas non prévu au barème, travail déjà exécuté après mon accord téléphonique.",
    statut: "en_attente",
  },
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
function PannesPanel({ pannes, actor, title, sub, canDeclare, canAuthorize, canRepair, canValidate, onAdvance, onDeclare, bases, postes, equipements }) {
  const [open, setOpen] = useState(false);
  const [baseId, setBaseId] = useState(bases[0]?.id || "");
  const [posteId, setPosteId] = useState("");        // "" = panne au niveau de la base
  const [equipementId, setEquipementId] = useState(""); // "" = tout le poste/la base, sans précision
  const [desc, setDesc] = useState("");

  // Cascade : les postes dépendent de la base choisie
  const postesDeLaBase = postes.filter((p) => p.baseId === baseId);
  // Les équipements dépendent du poste choisi — ou de la base si aucun poste n'est sélectionné
  const equipementsDisponibles = equipements.filter((e) =>
    posteId ? e.posteId === posteId : (e.baseId === baseId && !e.posteId)
  );

  const changeBase = (id) => { setBaseId(id); setPosteId(""); setEquipementId(""); };
  const changePoste = (id) => { setPosteId(id); setEquipementId(""); };

  const submit = () => {
    if (!desc.trim() || !baseId) return;
    const num = 18 + pannes.length;
    const poste = postes.find((p) => p.id === posteId);
    const equip = equipements.find((e) => e.id === equipementId);
    const base = bases.find((b) => b.id === baseId);

    let cible;
    if (equip) cible = equip.nom;
    else if (poste) cible = `${poste.nom} (tout le poste)`;
    else cible = `${base?.nom} (toute la base)`;

    onDeclare({
      id: `PN-0${num}`, baseId, posteId: posteId || null, equipementId: equipementId || null,
      cible, statut: "declaree", technicien: actor, declare: "11 Jul, à l'instant",
      desc: desc.trim(), dernierActeur: actor,
    });
    setDesc(""); setPosteId(""); setEquipementId(""); setOpen(false);
  };

  const nomBase = (id) => bases.find((b) => b.id === id)?.nom || "—";
  const nomPoste = (id) => postes.find((p) => p.id === id)?.nom;

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
              <p className="font-display text-slate-50 mt-2">{p.cible}</p>
              <p className="text-xs text-slate-600 font-body mt-0.5">
                {nomBase(p.baseId)}
                {p.posteId && <> <span className="text-slate-700">›</span> {nomPoste(p.posteId)}</>}
                {!p.equipementId && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-red-400/10 text-red-400">Sans équipement précis</span>}
              </p>
              <p className="text-sm text-slate-500 font-body mt-1">{p.desc}</p>
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
          <Field label="1 · Base">
            <select className={inputCls} value={baseId} onChange={(e) => changeBase(e.target.value)}>
              {bases.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}
            </select>
          </Field>

          <Field label="2 · Poste (optionnel)">
            <select className={inputCls} value={posteId} onChange={(e) => changePoste(e.target.value)}>
              <option value="">— Panne au niveau de la base —</option>
              {postesDeLaBase.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </Field>

          <Field label="3 · Équipement (optionnel)">
            <select className={inputCls} value={equipementId} onChange={(e) => setEquipementId(e.target.value)}>
              <option value="">
                {posteId ? "— Tout le poste est en panne (sans précision) —" : "— Toute la base est en panne —"}
              </option>
              {equipementsDisponibles.map((e) => <option key={e.id} value={e.id}>{e.nom} ({e.type})</option>)}
            </select>
            {equipementsDisponibles.length === 0 && (
              <p className="text-xs text-slate-600 mt-1.5">Aucun équipement enregistré ici — la panne portera sur l'ensemble.</p>
            )}
          </Field>

          <Field label="Description">
            <textarea className={inputCls} rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ex : faiblesse de connexion, coupure totale…" />
          </Field>
          <button onClick={submit} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Déclarer la panne</button>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   POINTS & PERFORMANCE
   Chaîne de validation calquée sur la hiérarchie :
   agent/technicien → validé par le gestionnaire
   gestionnaire     → validé par l'administrateur
   ============================================================ */
/* ============================================================
   MISSIONS & POINTS
   Circuit : le gestionnaire DEMANDE → le technicien COCHE ce qu'il a fait
             → le gestionnaire VALIDE → les points sont crédités.
   Seul l'ADMINISTRATEUR peut créer une tâche et fixer son barème.
   ============================================================ */

const fmtPts = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ","));

/* Calcule le total de points d'un rapport de mission */
const totalPointsRapport = (rapport, bareme) =>
  (rapport || []).reduce((s, l) => {
    const t = bareme.find((b) => b.id === l.tacheId);
    return s + (t ? t.points * l.quantite : 0);
  }, 0);

/* --- Modale : le gestionnaire crée une mission --- */
function MissionModal({ bareme, bases, postes, actor, onClose, onCreate }) {
  const [baseId, setBaseId] = useState(bases[0]?.id || "");
  const [posteId, setPosteId] = useState("");
  const [assigneA, setAssigneA] = useState("Kossi Amouzou");
  const [consigne, setConsigne] = useState("");
  const [taches, setTaches] = useState([]);

  const postesDeLaBase = postes.filter((p) => p.baseId === baseId);
  const toggle = (id) => setTaches((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const submit = () => {
    if (!consigne.trim() || taches.length === 0) return;
    onCreate({
      id: `M-0${43 + Math.floor(Math.random() * 50)}`, date: "11 Jul 2026",
      baseId, posteId: posteId || null, demandeePar: actor, assigneA,
      consigne: consigne.trim(), tachesDemandees: taches,
      rapport: null, statut: "demandee", validePar: null,
    });
    onClose();
  };

  return (
    <Modal title="Nouvelle demande de travail" sub={`Demandée par ${actor} — le technicien n'aura qu'à cocher`} onClose={onClose}>
      <Field label="Base">
        <select className={inputCls} value={baseId} onChange={(e) => { setBaseId(e.target.value); setPosteId(""); }}>
          {bases.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}
        </select>
      </Field>
      <Field label="Poste (optionnel)">
        <select className={inputCls} value={posteId} onChange={(e) => setPosteId(e.target.value)}>
          <option value="">— Travail au niveau de la base —</option>
          {postesDeLaBase.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
        </select>
      </Field>
      <Field label="Assigné à">
        <select className={inputCls} value={assigneA} onChange={(e) => setAssigneA(e.target.value)}>
          <option value="Kossi Amouzou">Kossi Amouzou (technicien principal)</option>
          <option value="Ayi Kokou">Ayi Kokou (technicien)</option>
          <option value="Fifonsi Adzo">Fifonsi Adzo (agent)</option>
        </select>
      </Field>
      <Field label="Consigne">
        <textarea className={inputCls} rows={2} value={consigne} onChange={(e) => setConsigne(e.target.value)} placeholder="Ex : installer un UFI et remplacer le routeur défaillant" />
      </Field>

      <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-2">Tâches demandées</p>
      <div className="space-y-1.5 mb-4 max-h-52 overflow-y-auto">
        {bareme.map((b) => (
          <label key={b.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 cursor-pointer hover:border-slate-700">
            <span className="flex items-center gap-2 min-w-0">
              <input type="checkbox" checked={taches.includes(b.id)} onChange={() => toggle(b.id)} className="accent-amber-400 shrink-0" />
              <span className="text-sm text-slate-200 font-body truncate">{b.tache}</span>
            </span>
            <span className="text-xs font-mono text-amber-400 shrink-0 ml-2">{fmtPts(b.points)}</span>
          </label>
        ))}
      </div>

      <button onClick={submit} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg">Envoyer la demande</button>
    </Modal>
  );
}

/* --- Modale : le technicien coche ce qu'il a fait (avec quantités) --- */
function RapportMissionModal({ mission, bareme, onClose, onSubmit, onDemanderTache, actor }) {
  const [lignes, setLignes] = useState(() =>
    mission.tachesDemandees.reduce((acc, id) => ({ ...acc, [id]: 1 }), {})
  );
  const [openHorsBareme, setOpenHorsBareme] = useState(false);
  const [libelle, setLibelle] = useState("");
  const [motif, setMotif] = useState("");

  const setQte = (id, q) => setLignes((prev) => ({ ...prev, [id]: Math.max(0, q) }));

  const rapport = Object.entries(lignes).filter(([, q]) => q > 0).map(([tacheId, quantite]) => ({ tacheId, quantite }));
  const total = totalPointsRapport(rapport, bareme);

  const submitHorsBareme = () => {
    if (!libelle.trim()) return;
    onDemanderTache({
      id: `DT-0${Math.floor(Math.random() * 900) + 100}`, date: "11 Jul 2026",
      demandeePar: actor, libelle: libelle.trim(),
      motif: motif.trim() || "Signalé depuis un rapport de mission.",
      statut: "en_attente",
    });
    setLibelle(""); setMotif(""); setOpenHorsBareme(false);
  };

  return (
    <Modal title={`Rapport — ${mission.id}`} sub="Cochez ce que vous avez fait, ajustez les quantités" onClose={onClose}>
      <p className="text-xs text-slate-500 font-body mb-4 bg-slate-950 border border-slate-800 rounded-lg p-3">
        <span className="text-slate-400">Consigne :</span> {mission.consigne}
      </p>

      <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-2">Tâches réalisées</p>
      <div className="space-y-1.5 mb-4 max-h-64 overflow-y-auto">
        {bareme.map((b) => {
          const demandee = mission.tachesDemandees.includes(b.id);
          const q = lignes[b.id] || 0;
          return (
            <div key={b.id} className={`flex items-center justify-between rounded-lg px-3 py-2 border ${q > 0 ? "bg-amber-400/5 border-amber-400/30" : "bg-slate-950 border-slate-800"}`}>
              <div className="min-w-0">
                <p className="text-sm text-slate-200 font-body truncate">{b.tache}</p>
                <p className="text-[10px] font-mono text-slate-500">
                  {fmtPts(b.points)} pt{b.points > 1 ? "s" : ""}
                  {demandee && <span className="ml-1.5 text-amber-400">· demandée</span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button onClick={() => setQte(b.id, q - 1)} className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700">−</button>
                <span className="w-6 text-center font-mono text-sm text-slate-200">{q}</span>
                <button onClick={() => setQte(b.id, q + 1)} className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700">+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 mb-4">
        <span className="text-sm font-body text-slate-300 font-semibold">Total du rapport</span>
        <span className="font-mono text-amber-400 font-semibold">{fmtPts(total)} pts</span>
      </div>

      {!openHorsBareme ? (
        <button onClick={() => setOpenHorsBareme(true)} className="w-full text-xs text-sky-400 font-body font-semibold py-2 mb-3 hover:underline">
          Une tâche réalisée ne figure pas dans la liste ?
        </button>
      ) : (
        <div className="bg-slate-950 border border-sky-400/30 rounded-lg p-3 mb-4">
          <p className="text-xs text-slate-400 font-body mb-2">
            Cette tâche sera remontée à l'administrateur, seul habilité à la créer et à fixer ses points.
          </p>
          <input className={inputCls + " mb-2"} value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Tâche réalisée (ex : remplacement câble)" />
          <textarea className={inputCls + " mb-2"} rows={2} value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Contexte (optionnel)" />
          <div className="flex gap-2">
            <button onClick={submitHorsBareme} className="flex-1 bg-sky-400 text-slate-950 font-body font-semibold text-xs py-2 rounded-lg">Remonter à l'administrateur</button>
            <button onClick={() => setOpenHorsBareme(false)} className="px-3 bg-slate-800 text-slate-400 text-xs rounded-lg">Annuler</button>
          </div>
        </div>
      )}

      <button onClick={() => { onSubmit(mission.id, rapport); onClose(); }} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg">
        Envoyer le rapport
      </button>
    </Modal>
  );
}

/* --- Panneau principal --- */
function PointsPanel({
  role, actor, missions, bareme, regles, demandesTache, bases, postes,
  onCreerMission, onRapporter, onValiderMission, onRejeterMission,
  onDemanderTache, onCreerTache, onRejeterDemande, onRemoveTache, onSaveRegles,
}) {
  const isAdmin = role === "admin";
  const isGestionnaire = role === "gestionnaire";
  const peutDemander = isAdmin || isGestionnaire;
  const peutValider = isAdmin || isGestionnaire;

  const [openMission, setOpenMission] = useState(false);
  const [rapportMission, setRapportMission] = useState(null);
  const [openConfig, setOpenConfig] = useState(false);
  const [openTache, setOpenTache] = useState(null); // demande d'ajout en cours de traitement

  const nomBase = (id) => bases.find((b) => b.id === id)?.nom || "—";
  const nomPoste = (id) => postes.find((p) => p.id === id)?.nom;

  // Bilan : seules les missions VALIDÉES créditent des points
  const employes = Array.from(new Set(missions.map((m) => m.assigneA)));
  const bilan = employes.map((emp) => {
    const validees = missions.filter((m) => m.assigneA === emp && m.statut === "validee");
    const attente = missions.filter((m) => m.assigneA === emp && m.statut === "rapportee");
    return {
      emp,
      total: validees.reduce((s, m) => s + totalPointsRapport(m.rapport, bareme), 0),
      enAttente: attente.reduce((s, m) => s + totalPointsRapport(m.rapport, bareme), 0),
      nbAttente: attente.length,
    };
  }).sort((a, b) => b.total - a.total);

  const mesMissions = missions.filter((m) => m.assigneA === actor);
  const mesPoints = mesMissions.filter((m) => m.statut === "validee").reduce((s, m) => s + totalPointsRapport(m.rapport, bareme), 0);
  const aFaire = mesMissions.filter((m) => m.statut === "demandee");
  const aValider = missions.filter((m) => m.statut === "rapportee");
  const demandesEnAttente = demandesTache.filter((d) => d.statut === "en_attente");

  const statutCfg = {
    demandee: { label: "À faire", cls: "bg-sky-400/10 text-sky-400" },
    rapportee: { label: "Rapportée — à valider", cls: "bg-amber-400/10 text-amber-400" },
    validee: { label: "Validée", cls: "bg-emerald-400/10 text-emerald-400" },
    rejetee: { label: "Rejetée", cls: "bg-red-400/10 text-red-400" },
  };

  return (
    <div>
      <SectionHeader
        title={isAdmin ? "Missions, barème & points" : isGestionnaire ? "Missions & points à valider" : "Mes missions & points"}
        sub={
          isAdmin ? "Vous seul créez les tâches et fixez leur barème"
          : isGestionnaire ? "Demander un travail, valider les rapports — les points ne comptent qu'après votre validation"
          : "Cochez ce que vous avez fait — les points sont crédités après validation du gestionnaire"
        }
        action={
          <div className="flex gap-2">
            {isAdmin && (
              <button onClick={() => setOpenConfig(true)} className="bg-slate-800 text-slate-200 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition flex items-center gap-1.5">
                <Settings2 size={14} /> Barème
                {demandesEnAttente.length > 0 && (
                  <span className="bg-red-400 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">{demandesEnAttente.length}</span>
                )}
              </button>
            )}
            {peutDemander && (
              <button onClick={() => setOpenMission(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Demander un travail</button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard label="Mes points validés" value={fmtPts(mesPoints)} sub={`Objectif : ${regles.objectifJournalier}/jour`} icon={Award} accent="amber" />
        <KPICard label={peutValider ? "Rapports à valider" : "Missions à faire"} value={String(peutValider ? aValider.length : aFaire.length)} sub={peutValider ? "En attente de votre contrôle" : "Assignées par le gestionnaire"} icon={Clock} accent="sky" />
        <KPICard
          label="Situation du mois"
          value={mesPoints >= regles.seuilBonus ? "Prime" : mesPoints < regles.seuilAvertissement ? "Alerte" : "Conforme"}
          sub={`Prime ≥ ${regles.seuilBonus} · Alerte < ${regles.seuilAvertissement}`}
          icon={TrendingUp}
          accent={mesPoints >= regles.seuilBonus ? "teal" : mesPoints < regles.seuilAvertissement ? "red" : "amber"}
        />
      </div>

      {/* Demandes d'ajout au barème — visible par l'admin */}
      {isAdmin && demandesEnAttente.length > 0 && (
        <div className="bg-sky-400/5 border border-sky-400/30 rounded-xl p-4 mb-6">
          <p className="text-xs text-sky-400 font-body uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <AlertTriangle size={13} /> Tâches remontées par les gestionnaires ({demandesEnAttente.length})
          </p>
          <div className="space-y-2">
            {demandesEnAttente.map((d) => (
              <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-slate-200 font-body truncate">{d.libelle}</p>
                  <p className="text-xs text-slate-500 font-body truncate">{d.demandeePar} · {d.date} — {d.motif}</p>
                </div>
                <button onClick={() => setOpenTache(d)} className="text-xs bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg shrink-0">Créer la tâche</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missions à faire (technicien/agent) */}
      {!peutValider && (
        <div className="mb-6">
          <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-3">Travaux demandés ({aFaire.length})</p>
          <div className="space-y-2">
            {aFaire.map((m) => (
              <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{m.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statutCfg[m.statut].cls}`}>{statutCfg[m.statut].label}</span>
                  </div>
                  <p className="font-body text-slate-200 text-sm mt-1 truncate">{m.consigne}</p>
                  <p className="text-xs text-slate-500 font-body">
                    {nomBase(m.baseId)}{m.posteId && ` › ${nomPoste(m.posteId)}`} · demandé par {m.demandeePar}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {m.tachesDemandees.map((tid) => {
                      const t = bareme.find((b) => b.id === tid);
                      return t ? <span key={tid} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{t.tache}</span> : null;
                    })}
                  </div>
                </div>
                <button onClick={() => setRapportMission(m)} className="text-xs bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg shrink-0">Faire le rapport</button>
              </div>
            ))}
            {aFaire.length === 0 && <p className="text-sm text-slate-600 font-body">Aucun travail en attente.</p>}
          </div>
        </div>
      )}

      {/* Rapports à valider (gestionnaire/admin) */}
      {peutValider && (
        <div className="mb-6">
          <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-3">Rapports à valider ({aValider.length}) — après contrôle terrain</p>
          <div className="space-y-2">
            {aValider.map((m) => {
              const total = totalPointsRapport(m.rapport, bareme);
              return (
                <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">{m.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statutCfg[m.statut].cls}`}>{statutCfg[m.statut].label}</span>
                      </div>
                      <p className="font-body text-slate-200 text-sm mt-1 truncate">{m.assigneA} — {m.consigne}</p>
                      <p className="text-xs text-slate-500 font-body">{nomBase(m.baseId)}{m.posteId && ` › ${nomPoste(m.posteId)}`} · {m.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-amber-400 font-semibold">{fmtPts(total)} pts</p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 space-y-1">
                    {(m.rapport || []).map((l) => {
                      const t = bareme.find((b) => b.id === l.tacheId);
                      if (!t) return null;
                      const horsDemande = !m.tachesDemandees.includes(l.tacheId);
                      return (
                        <div key={l.tacheId} className="flex items-center justify-between text-xs font-body">
                          <span className="text-slate-400">
                            {t.tache} <span className="text-slate-600">× {l.quantite}</span>
                            {horsDemande && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-sky-400/10 text-sky-400">hors demande</span>}
                          </span>
                          <span className="font-mono text-slate-500">{fmtPts(t.points * l.quantite)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => onValiderMission(m.id, actor)} className="flex-1 text-xs bg-emerald-400 text-slate-950 font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
                      <Check size={12} /> Valider et créditer {fmtPts(total)} pts
                    </button>
                    <button onClick={() => onRejeterMission(m.id, actor)} className="px-4 text-xs bg-red-400/10 text-red-400 font-semibold py-2 rounded-lg">Rejeter</button>
                  </div>
                </div>
              );
            })}
            {aValider.length === 0 && <p className="text-sm text-slate-600 font-body">Aucun rapport en attente de validation.</p>}
          </div>
        </div>
      )}

      {/* Bilan de l'équipe */}
      {peutValider && (
        <div className="mb-6">
          <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-3">Bilan de l'équipe (points validés uniquement)</p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Employé</th>
                  <th className="text-left px-4 py-3">Points validés</th>
                  <th className="text-left px-4 py-3">En attente</th>
                  <th className="text-left px-4 py-3">Situation</th>
                </tr>
              </thead>
              <tbody>
                {bilan.map((b) => (
                  <tr key={b.emp} className="border-t border-slate-800 text-slate-300">
                    <td className="px-4 py-3">{b.emp}</td>
                    <td className="px-4 py-3 font-mono text-amber-400">{fmtPts(b.total)}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{b.nbAttente > 0 ? `+${fmtPts(b.enAttente)} (${b.nbAttente})` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        b.total >= regles.seuilBonus ? "bg-emerald-400/10 text-emerald-400"
                        : b.total < regles.seuilAvertissement ? "bg-red-400/10 text-red-400"
                        : "bg-amber-400/10 text-amber-400"
                      }`}>
                        {b.total >= regles.seuilBonus ? "Prime due" : b.total < regles.seuilAvertissement ? "Avertissement" : "Conforme"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Historique des missions */}
      <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-3">Historique des missions</p>
      <div className="space-y-2">
        {missions.filter((m) => m.statut === "validee" || m.statut === "rejetee").map((m) => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-body text-slate-200 text-sm truncate">
                <span className="font-mono text-xs text-slate-500 mr-1.5">{m.id}</span>
                {m.assigneA} — {m.consigne}
              </p>
              <p className="text-xs text-slate-500 font-body">
                {m.date} · {nomBase(m.baseId)}{m.validePar && ` · validé par ${m.validePar}`}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-sm text-amber-400">{fmtPts(totalPointsRapport(m.rapport, bareme))} pts</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statutCfg[m.statut].cls}`}>{statutCfg[m.statut].label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      {openMission && (
        <MissionModal bareme={bareme} bases={bases} postes={postes} actor={actor} onClose={() => setOpenMission(false)} onCreate={onCreerMission} />
      )}

      {rapportMission && (
        <RapportMissionModal
          mission={rapportMission} bareme={bareme} actor={actor}
          onClose={() => setRapportMission(null)}
          onSubmit={onRapporter}
          onDemanderTache={onDemanderTache}
        />
      )}

      {openTache && (
        <CreerTacheModal
          demande={openTache}
          onClose={() => setOpenTache(null)}
          onCreate={(points, categorie) => { onCreerTache(openTache, points, categorie); setOpenTache(null); }}
          onReject={() => { onRejeterDemande(openTache.id); setOpenTache(null); }}
        />
      )}

      {openConfig && (
        <BaremeModal
          bareme={bareme} regles={regles}
          onClose={() => setOpenConfig(false)}
          onRemove={onRemoveTache}
          onSaveRegles={onSaveRegles}
          onCreerTache={(libelle, points, categorie) => onCreerTache({ libelle }, points, categorie)}
        />
      )}
    </div>
  );
}

/* --- Modale : l'admin crée la tâche remontée et fixe ses points --- */
function CreerTacheModal({ demande, onClose, onCreate, onReject }) {
  const [points, setPoints] = useState("");
  const [categorie, setCategorie] = useState(CATEGORIES_TACHE[0]);

  return (
    <Modal title="Créer la tâche" sub={`Remontée par ${demande.demandeePar} · ${demande.date}`} onClose={onClose}>
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4">
        <p className="text-sm text-slate-200 font-body">{demande.libelle}</p>
        <p className="text-xs text-slate-500 font-body mt-1">{demande.motif}</p>
      </div>
      <p className="text-xs text-slate-500 font-body mb-3">
        Vous seul fixez la valeur de cette tâche. Une fois créée, elle entrera dans le barème et pourra être utilisée par toute l'équipe.
      </p>
      <Field label="Catégorie">
        <select className={inputCls} value={categorie} onChange={(e) => setCategorie(e.target.value)}>
          {CATEGORIES_TACHE.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Points attribués">
        <input type="number" step="0.5" min="0" className={inputCls} value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Ex : 1,5" />
      </Field>
      <div className="flex gap-2">
        <button onClick={() => { const p = parseFloat(points); if (p >= 0) onCreate(p, categorie); }} className="flex-1 bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg">
          Créer et ajouter au barème
        </button>
        <button onClick={onReject} className="px-4 bg-red-400/10 text-red-400 font-body font-semibold text-sm py-2.5 rounded-lg">Refuser</button>
      </div>
    </Modal>
  );
}

/* --- Modale : le barème complet, géré par l'admin --- */
function BaremeModal({ bareme, regles, onClose, onRemove, onSaveRegles, onCreerTache }) {
  const [libelle, setLibelle] = useState("");
  const [points, setPoints] = useState("");
  const [categorie, setCategorie] = useState(CATEGORIES_TACHE[0]);
  const [objectif, setObjectif] = useState(regles.objectifJournalier);
  const [seuilBonus, setSeuilBonus] = useState(regles.seuilBonus);
  const [seuilAvert, setSeuilAvert] = useState(regles.seuilAvertissement);

  const submitTache = () => {
    const p = parseFloat(points);
    if (!libelle.trim() || !(p >= 0)) return;
    onCreerTache(libelle.trim(), p, categorie);
    setLibelle(""); setPoints("");
  };

  return (
    <Modal title="Barème & règles" sub="Vous seul définissez les tâches et leur valeur" onClose={onClose}>
      {CATEGORIES_TACHE.map((cat) => (
        <div key={cat} className="mb-4">
          <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-2">{cat}</p>
          <div className="space-y-1.5">
            {bareme.filter((b) => b.categorie === cat).map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-200 font-body truncate">{b.tache}</span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-xs font-mono text-amber-400">{fmtPts(b.points)}</span>
                  <button onClick={() => onRemove(b.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-2">Nouvelle tâche</p>
      <div className="space-y-2 mb-5">
        <input className={inputCls} value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Libellé de la tâche" />
        <div className="flex gap-2">
          <select className={inputCls + " flex-1"} value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            {CATEGORIES_TACHE.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" step="0.5" min="0" className={inputCls + " w-24"} value={points} onChange={(e) => setPoints(e.target.value)} placeholder="pts" />
          <button onClick={submitTache} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 rounded-lg shrink-0">+</button>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-2">Règles</p>
      <Field label="Objectif journalier (points)">
        <input type="number" className={inputCls} value={objectif} onChange={(e) => setObjectif(e.target.value)} />
      </Field>
      <Field label="Seuil de prime (points/mois)">
        <input type="number" className={inputCls} value={seuilBonus} onChange={(e) => setSeuilBonus(e.target.value)} />
      </Field>
      <Field label="Seuil d'avertissement (points/mois)">
        <input type="number" className={inputCls} value={seuilAvert} onChange={(e) => setSeuilAvert(e.target.value)} />
      </Field>
      <button
        onClick={() => {
          onSaveRegles({
            objectifJournalier: parseFloat(objectif) || 0,
            seuilBonus: parseFloat(seuilBonus) || 0,
            seuilAvertissement: parseFloat(seuilAvert) || 0,
          });
          onClose();
        }}
        className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1"
      >
        Enregistrer
      </button>
    </Modal>
  );
}

/* ============================================================
   SUIVI PAR POSTE — rentabilité sur une période libre
   ============================================================ */
function SuiviPostes({ bases, postes, rapports }) {
  const [debut, setDebut] = useState("2026-07-01");
  const [fin, setFin] = useState("2026-07-31");
  const [cible, setCible] = useState("all"); // "all" | baseId | posteId

  const dansPeriode = (r) => r.iso >= debut && r.iso <= fin;

  const rapportsFiltres = rapports.filter((r) => {
    if (!dansPeriode(r) || r.type !== "Caisse") return false;
    if (cible === "all") return true;
    if (cible.startsWith("b")) return r.baseId === cible;
    return r.posteId === cible;
  });

  const totalDeclare = rapportsFiltres.reduce((s, r) => s + (r.declare || 0), 0);
  const totalAttendu = rapportsFiltres.reduce((s, r) => s + (r.attendu || 0), 0);
  const ecart = totalDeclare - totalAttendu;

  // Détail poste par poste sur la période
  const detail = postes.map((p) => {
    const rs = rapports.filter((r) => dansPeriode(r) && r.type === "Caisse" && r.posteId === p.id);
    return {
      poste: p,
      base: bases.find((b) => b.id === p.baseId)?.nom || "—",
      montant: rs.reduce((s, r) => s + (r.declare || 0), 0),
      nb: rs.length,
    };
  }).filter((d) => d.nb > 0).sort((a, b) => b.montant - a.montant);

  const imprimer = () => {
    const libelle = cible === "all" ? "Toutes bases"
      : cible.startsWith("b") ? bases.find((b) => b.id === cible)?.nom
      : postes.find((p) => p.id === cible)?.nom;
    alert(`Impression de la situation générale\n\n${libelle}\nPériode : ${debut} → ${fin}\nRecette : ${fmtFCFA(totalDeclare)}\n\n(Simulation — un PDF sera généré dans l'application finale.)`);
  };

  return (
    <div>
      <SectionHeader title="Suivi par poste" sub="Ce qu'une base ou un poste a rapporté sur une période libre" action={
        <button onClick={imprimer} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition flex items-center gap-1.5">
          <Download size={14} /> Imprimer la situation
        </button>
      } />

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide flex items-center gap-1 mb-1"><Calendar size={11} /> Du</label>
          <input type="date" className={inputCls + " w-auto text-xs py-1.5"} value={debut} onChange={(e) => setDebut(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-1 block">Au</label>
          <input type="date" className={inputCls + " w-auto text-xs py-1.5"} value={fin} onChange={(e) => setFin(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-1 block">Base ou poste</label>
          <select className={inputCls + " text-xs py-1.5"} value={cible} onChange={(e) => setCible(e.target.value)}>
            <option value="all">Toutes les bases</option>
            {bases.map((b) => (
              <optgroup key={b.id} label={b.nom}>
                <option value={b.id}>{b.nom} (toute la base)</option>
                {postes.filter((p) => p.baseId === b.id).map((p) => (
                  <option key={p.id} value={p.id}>&nbsp;&nbsp;› {p.nom}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard label="Recette sur la période" value={fmtFCFA(totalDeclare)} sub={`${rapportsFiltres.length} rapport(s)`} icon={TrendingUp} accent="amber" />
        <KPICard label="Montant attendu" value={fmtFCFA(totalAttendu)} sub="Calculé par l'application" icon={FileBarChart} accent="teal" />
        <KPICard
          label="Écart cumulé"
          value={ecart === 0 ? "0 F" : fmtFCFA(ecart)}
          sub={ecart === 0 ? "Aucun écart" : ecart < 0 ? "Manquant" : "Excédent"}
          icon={AlertTriangle}
          accent={ecart === 0 ? "teal" : "red"}
        />
      </div>

      <p className="text-xs text-slate-400 font-body uppercase tracking-wide mb-3">Détail poste par poste</p>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Poste</th>
              <th className="text-left px-4 py-3">Base</th>
              <th className="text-left px-4 py-3">Rapports</th>
              <th className="text-left px-4 py-3">Recette</th>
            </tr>
          </thead>
          <tbody>
            {detail.map((d) => (
              <tr key={d.poste.id} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3">{d.poste.nom}</td>
                <td className="px-4 py-3 text-slate-500">{d.base}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{d.nb}</td>
                <td className="px-4 py-3 font-mono text-amber-400">{fmtFCFA(d.montant)}</td>
              </tr>
            ))}
            {detail.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-600 font-body">Aucune recette enregistrée sur cette période.</td></tr>
            )}
          </tbody>
        </table>
      </div>
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
    { id: "abonnements", label: "Abonnés", icon: CreditCard },
    { id: "rapports", label: "Rapports financiers", icon: FileBarChart },
    { id: "suivi", label: "Suivi par poste", icon: TrendingUp },
    { id: "points", label: "Missions & barème", icon: Award },
    { id: "pannes", label: "Supervision pannes", icon: AlertTriangle },
    { id: "equipements", label: "Équipements", icon: Wrench },
  ],
  gestionnaire: [
    { id: "dashboard", label: "Mon tableau de bord", icon: LayoutDashboard },
    { id: "distribution", label: "Distribution tickets", icon: Package },
    { id: "abonnements", label: "Abonnés", icon: CreditCard },
    { id: "rapports", label: "Rapports à valider", icon: FileBarChart },
    { id: "suivi", label: "Suivi par poste", icon: TrendingUp },
    { id: "points", label: "Missions & points", icon: Award },
    { id: "pannes", label: "Pannes de mon secteur", icon: AlertTriangle },
  ],
  technicien: [
    { id: "interventions", label: "Mes interventions", icon: Wrench },
    { id: "points", label: "Mes missions", icon: Award },
    { id: "equipements", label: "Équipements", icon: Antenna },
  ],
  agent: [
    { id: "reception", label: "Réception de lots", icon: Boxes },
    { id: "reconciliation", label: "Réconciliation", icon: ArrowRightLeft },
    { id: "points", label: "Mes missions", icon: Award },
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
  const [tarifs, setTarifs] = useState(poste.tarifs || {});

  const save = () => {
    const cleaned = {};
    ticketTypes.forEach((t) => { cleaned[t] = parseInt(tarifs[t], 10) || 0; });
    onSave(poste.id, { tarifs: cleaned });
    onClose();
  };

  return (
    <Modal title={`Tarifs — ${poste.nom}`} sub="Ces prix de tickets ne s'appliquent qu'à ce poste" onClose={onClose}>
      {ticketTypes.map((t) => (
        <Field key={t} label={`Ticket ${t} (FCFA)`}>
          <input
            type="number" min="0" className={inputCls}
            value={tarifs[t] ?? ""}
            onChange={(e) => setTarifs((prev) => ({ ...prev, [t]: e.target.value }))}
          />
        </Field>
      ))}
      <button onClick={save} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Enregistrer les tarifs</button>
    </Modal>
  );
}

function AdminBases({ bases, postes, equipements, abonnes, ticketTypes, onAddBase, onRemoveBase, onAddPoste, onRemovePoste, onSaveTarifs, onAddTicketType, onRemoveTicketType, onCapturerGPS }) {
  const [openBase, setOpenBase] = useState(false);
  const [baseNom, setBaseNom] = useState("");
  const [baseQuartier, setBaseQuartier] = useState("");
  const [baseGestionnaire, setBaseGestionnaire] = useState(INITIAL_GESTIONNAIRES[0].nom);

  const [openPoste, setOpenPoste] = useState(false);
  const [posteNom, setPosteNom] = useState("");
  const [posteBaseId, setPosteBaseId] = useState(bases[0]?.id || "");
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
      id: `p${Date.now()}`, baseId: posteBaseId, nom: posteNom.trim(),
      vendeur: posteVendeur.trim() || "—", gps: null,
      tarifs: Object.fromEntries(ticketTypes.map((t) => [t, 0])),
    };
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
          const equipDeLaBase = equipements.filter((e) => e.baseId === b.id && !e.posteId);
          const nbEquipTotal = equipements.filter((e) => e.baseId === b.id).length;
          const abonnesDeLaBase = abonnes.filter((a) => a.baseId === b.id);
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
                  <span className="text-xs text-slate-500 font-body hidden sm:inline">{basePostes.length} postes · {abonnesDeLaBase.length} abonnés · {nbEquipTotal} équip.</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-body ${b.statut === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                    {b.statut === "active" ? "Active" : "Maintenance"}
                  </span>
                  <span onClick={(e) => { e.stopPropagation(); onRemoveBase(b.id); }} className="text-slate-600 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-800 px-5 py-4 space-y-5">
                  {/* Équipements de la base elle-même */}
                  <div>
                    <p className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-2">Équipements de la base</p>
                    {equipDeLaBase.length === 0 ? (
                      <p className="text-xs text-slate-600 font-body">Aucun équipement directement sur la base.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {equipDeLaBase.map((e) => (
                          <span key={e.id} className="inline-flex items-center gap-1.5 bg-slate-950/50 border border-slate-800 text-slate-300 text-xs font-body px-2.5 py-1.5 rounded-lg">
                            <Wrench size={11} className="text-slate-500" />
                            {e.nom}
                            <span className="text-slate-600">· {e.type}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Postes, chacun avec ses propres équipements */}
                  <div>
                    <p className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-2">Postes rattachés</p>
                    {basePostes.length === 0 ? (
                      <p className="text-xs text-slate-600 font-body">Aucun poste sur cette base.</p>
                    ) : (
                      <div className="space-y-2">
                        {basePostes.map((p) => {
                          const equipDuPoste = equipements.filter((e) => e.posteId === p.id);
                          return (
                            <div key={p.id} className="bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2.5">
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-body text-slate-200 text-sm truncate">{p.nom}</p>
                                    {p.gps && (
                                      <a
                                        href={`https://www.google.com/maps?q=${p.gps.lat},${p.gps.lng}`}
                                        target="_blank" rel="noreferrer"
                                        onClick={(ev) => ev.stopPropagation()}
                                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-400/10 text-sky-400 inline-flex items-center gap-1 hover:bg-sky-400/20"
                                      >
                                        <Navigation size={9} /> {p.gps.lat.toFixed(4)}, {p.gps.lng.toFixed(4)}
                                      </a>
                                    )}
                                    {!p.gps && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-500">Sans GPS</span>}
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                                    {p.vendeur !== "—" ? p.vendeur + " · " : ""}
                                    {Object.entries(p.tarifs || {}).map(([k, v]) => `${k}: ${v}F`).join(" · ")}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button onClick={() => onCapturerGPS(p.id)} className="text-xs text-sky-400 font-semibold hover:underline flex items-center gap-1" title="Capturer ma position actuelle">
                                    <Navigation size={12} /> GPS
                                  </button>
                                  <button onClick={() => setTarifsPoste(p)} className="text-xs text-amber-400 font-semibold hover:underline">Tarifs</button>
                                  <button onClick={() => onRemovePoste(p.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={13} /></button>
                                </div>
                              </div>

                              {/* Équipements du poste */}
                              {equipDuPoste.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-800/60">
                                  {equipDuPoste.map((e) => (
                                    <span key={e.id} className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-body px-2 py-1 rounded">
                                      <Wrench size={10} className="text-slate-600" />
                                      {e.nom}
                                      <span className="text-slate-600">· {e.type}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Abonnés de la base — branche parallèle aux postes */}
                  <div>
                    <p className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-2">
                      Abonnés mensuels · tarif de référence {fmtFCFA(b.tarifAbonnement)}
                    </p>
                    {abonnesDeLaBase.length === 0 ? (
                      <p className="text-xs text-slate-600 font-body">Aucun abonné sur cette base.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {abonnesDeLaBase.map((a) => (
                          <span key={a.id} className={`inline-flex items-center gap-1.5 border text-xs font-body px-2.5 py-1.5 rounded-lg ${
                            a.statut === "suspendu" ? "bg-red-400/5 border-red-400/20 text-red-400/80"
                            : a.paiement !== "a_jour" ? "bg-amber-400/5 border-amber-400/20 text-amber-400/90"
                            : "bg-slate-950/50 border-slate-800 text-slate-300"
                          }`}>
                            <CreditCard size={11} className="opacity-60" />
                            {a.nom}
                            <span className="opacity-50 font-mono">{fmtFCFA(a.prixPerso ?? b.tarifAbonnement)}</span>
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

function RapportsPanel({ rapports, canValidate, onValidate, onReject, actor, bases, postes }) {
  const [debut, setDebut] = useState("2026-07-01");
  const [fin, setFin] = useState("2026-07-31");
  const [filtreBase, setFiltreBase] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [filtreType, setFiltreType] = useState("Tous");
  const [validation, setValidation] = useState(null); // rapport en cours de validation

  const nomBase = (id) => bases.find((b) => b.id === id)?.nom || "—";
  const nomPoste = (id) => postes.find((p) => p.id === id)?.nom;

  const filtered = rapports.filter((r) =>
    r.iso >= debut && r.iso <= fin &&
    (filtreBase === "Toutes" || r.baseId === filtreBase) &&
    (filtreStatut === "Tous" || r.statut === filtreStatut) &&
    (filtreType === "Tous" || r.type === filtreType)
  );

  const totalPeriode = filtered.filter((r) => r.type === "Caisse").reduce((s, r) => s + (r.declare || 0), 0);
  const ecartsNonJustifies = rapports.filter((r) => r.declare !== null && r.attendu !== null && r.declare !== r.attendu && !r.justification).length;

  const statutCfg = {
    valide: { label: "Validé", cls: "bg-emerald-400/10 text-emerald-400" },
    en_attente: { label: "En attente", cls: "bg-amber-400/10 text-amber-400" },
    rejete: { label: "Rejeté", cls: "bg-red-400/10 text-red-400" },
  };

  const simulerPDF = (r) => {
    alert(`Génération du PDF du rapport ${r.id}\n\n${nomBase(r.baseId)}${r.posteId ? " › " + nomPoste(r.posteId) : ""}\n${r.date} · ${r.auteur}\n\n(Simulation — un vrai PDF sera téléchargé dans l'application finale.)`);
  };

  const exporterPeriode = () => {
    alert(`Export de la période\n\nDu ${debut} au ${fin}\n${filtered.length} rapport(s) · ${fmtFCFA(totalPeriode)}\n\n(Simulation — un PDF récapitulatif sera généré dans l'application finale.)`);
  };

  return (
    <div>
      <SectionHeader
        title={canValidate ? "Rapports à valider & historique" : "Rapports financiers"}
        sub={canValidate ? "Valider les rapports, justifier les écarts, extraire par période" : "Consolidé toutes bases"}
        action={
          <button onClick={exporterPeriode} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition flex items-center gap-1.5">
            <Download size={14} /> Extraire la période
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard label="Recette sur la période" value={fmtFCFA(totalPeriode)} sub={`${filtered.length} rapport(s)`} icon={FileBarChart} accent="amber" />
        <KPICard label="En attente de validation" value={String(rapports.filter((r) => r.statut === "en_attente").length)} sub="Rapports à traiter" icon={Clock} accent="sky" />
        <KPICard label="Écarts non justifiés" value={String(ecartsNonJustifies)} sub="À élucider avec les gestionnaires" icon={AlertTriangle} accent="red" />
      </div>

      {/* Filtres — période libre + critères */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide flex items-center gap-1 mb-1"><Calendar size={11} /> Du</label>
          <input type="date" className={inputCls + " w-auto text-xs py-1.5"} value={debut} onChange={(e) => setDebut(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-1 block">Au</label>
          <input type="date" className={inputCls + " w-auto text-xs py-1.5"} value={fin} onChange={(e) => setFin(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-1 block">Base</label>
          <select className={inputCls + " w-auto text-xs py-1.5"} value={filtreBase} onChange={(e) => setFiltreBase(e.target.value)}>
            <option value="Toutes">Toutes les bases</option>
            {bases.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-1 block">Statut</label>
          <select className={inputCls + " w-auto text-xs py-1.5"} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
            <option value="Tous">Tous</option>
            <option value="en_attente">En attente</option>
            <option value="valide">Validé</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] text-slate-500 font-body uppercase tracking-wide mb-1 block">Type</label>
          <select className={inputCls + " w-auto text-xs py-1.5"} value={filtreType} onChange={(e) => setFiltreType(e.target.value)}>
            <option value="Tous">Tous</option>
            <option value="Caisse">Caisse</option>
            <option value="Intervention">Intervention</option>
          </select>
        </div>
        <span className="text-xs text-slate-600 font-body ml-auto">{filtered.length} rapport(s)</span>
      </div>

      {/* Historique */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Réf.</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Base / Poste</th>
              <th className="text-left px-4 py-3">Auteur</th>
              <th className="text-left px-4 py-3">Déclaré</th>
              <th className="text-left px-4 py-3">Attendu</th>
              <th className="text-left px-4 py-3">Écart</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const ecart = (r.declare !== null && r.attendu !== null) ? r.declare - r.attendu : null;
              return (
                <tr key={r.id} className="border-t border-slate-800 text-slate-300">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.date}</td>
                  <td className="px-4 py-3 text-xs">
                    {nomBase(r.baseId)}
                    {r.posteId && <span className="text-slate-600"> › {nomPoste(r.posteId)}</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.auteur}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.declare !== null ? fmtFCFA(r.declare) : "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.attendu !== null ? fmtFCFA(r.attendu) : "—"}</td>
                  <td className="px-4 py-3">
                    {ecart === null ? <span className="text-slate-600">—</span> : ecart === 0 ? (
                      <span className="font-mono text-xs text-emerald-400">0 F</span>
                    ) : (
                      <div>
                        <span className="font-mono text-xs text-red-400">{fmtFCFA(ecart)}</span>
                        {r.justification
                          ? <p className="text-[10px] text-slate-500 font-body mt-0.5 max-w-[160px]">{r.justification}</p>
                          : <p className="text-[10px] text-red-400/70 font-body mt-0.5">Non justifié</p>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statutCfg[r.statut].cls}`}>{statutCfg[r.statut].label}</span>
                    {r.validePar && <p className="text-[10px] text-slate-600 font-mono mt-0.5">par {r.validePar}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => simulerPDF(r)} className="text-slate-500 hover:text-amber-400" title="Télécharger le PDF"><Download size={15} /></button>
                      {canValidate && r.statut === "en_attente" && (
                        <button onClick={() => setValidation(r)} className="text-xs text-amber-400 font-semibold hover:underline">Traiter</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-slate-600 font-body">Aucun rapport sur cette période.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {!canValidate && (
        <p className="text-xs text-slate-600 font-body mt-3">La validation des rapports est réservée aux gestionnaires et à l'administrateur.</p>
      )}

      {validation && (
        <ValidationModal
          rapport={validation}
          nomBase={nomBase(validation.baseId)}
          nomPoste={validation.posteId ? nomPoste(validation.posteId) : null}
          onClose={() => setValidation(null)}
          onValidate={(justif) => { onValidate(validation.id, actor, justif); setValidation(null); }}
          onReject={(justif) => { onReject(validation.id, actor, justif); setValidation(null); }}
        />
      )}
    </div>
  );
}

/* Traitement d'un rapport : l'écart n'est jamais effacé — il est justifié, puis validé ou rejeté */
function ValidationModal({ rapport, nomBase, nomPoste, onClose, onValidate, onReject }) {
  const [justif, setJustif] = useState("");
  const ecart = (rapport.declare !== null && rapport.attendu !== null) ? rapport.declare - rapport.attendu : null;

  return (
    <Modal title={`Traiter le rapport ${rapport.id}`} sub={`${nomBase}${nomPoste ? " › " + nomPoste : ""} · ${rapport.date}`} onClose={onClose}>
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm font-body">
          <span className="text-slate-400">Montant remis (déclaré)</span>
          <span className="font-mono text-slate-200">{rapport.declare !== null ? fmtFCFA(rapport.declare) : "—"}</span>
        </div>
        <div className="flex justify-between text-sm font-body">
          <span className="text-slate-400">Montant attendu (calculé)</span>
          <span className="font-mono text-slate-500">{rapport.attendu !== null ? fmtFCFA(rapport.attendu) : "—"}</span>
        </div>
        <div className="h-px bg-slate-800" />
        <div className="flex justify-between text-sm font-body">
          <span className="text-slate-300 font-semibold">Écart</span>
          <span className={`font-mono font-semibold ${!ecart ? "text-emerald-400" : "text-red-400"}`}>
            {ecart === null ? "—" : ecart === 0 ? "0 F" : fmtFCFA(ecart)}
          </span>
        </div>
      </div>

      {ecart !== null && ecart !== 0 && (
        <>
          <p className="text-xs text-slate-500 font-body mb-3">
            L'écart n'est jamais effacé — il reste dans l'historique. Justifiez-le pour valider, ou rejetez le rapport.
          </p>
          <Field label="Justification de l'écart">
            <textarea className={inputCls} rows={2} value={justif} onChange={(e) => setJustif(e.target.value)} placeholder="Ex : 1 ticket abîmé · erreur de comptage · manque confirmé" />
          </Field>
        </>
      )}

      <div className="flex gap-2">
        <button onClick={() => onValidate(justif.trim() || null)} className="flex-1 bg-emerald-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-1.5">
          <Check size={15} /> Valider
        </button>
        <button onClick={() => onReject(justif.trim() || null)} className="flex-1 bg-red-400/10 text-red-400 font-body font-semibold text-sm py-2.5 rounded-lg">
          Rejeter
        </button>
      </div>
    </Modal>
  );
}

function AdminEquipements({ equipements, types, onAddType, onRemoveType, onAddEquipement, onRemoveEquipement, bases, postes }) {
  const [newType, setNewType] = useState("");
  const [openEq, setOpenEq] = useState(false);
  const [nom, setNom] = useState("");
  const [type, setType] = useState(types[0] || "");
  const [baseId, setBaseId] = useState(bases[0]?.id || "");
  const [posteId, setPosteId] = useState(""); // "" = équipement de la base elle-même

  const postesDeLaBase = postes.filter((p) => p.baseId === baseId);

  const submitType = () => {
    const t = newType.trim();
    if (!t || types.includes(t)) return;
    onAddType(t);
    setNewType("");
  };

  const submitEquipement = () => {
    if (!nom.trim() || !type || !baseId) return;
    onAddEquipement({
      id: `eq${Date.now()}`, nom: nom.trim(), type, baseId, posteId: posteId || null,
      reparations: 0, immobilisation: "0h", etat: "ok",
    });
    setNom(""); setOpenEq(false);
  };

  const nomBase = (id) => bases.find((b) => b.id === id)?.nom || "—";
  const nomPoste = (id) => postes.find((p) => p.id === id)?.nom;

  return (
    <div>
      <SectionHeader title="Équipements" sub="Types libres · rattachement à une base ou à un poste" />

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
            placeholder="Nouveau type (ex : Nano M5 3e gén.)"
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
              <th className="text-left px-4 py-3">Emplacement</th>
              <th className="text-left px-4 py-3">Réparations</th>
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
                <td className="px-4 py-3 text-xs">
                  {nomBase(e.baseId)}
                  {e.posteId
                    ? <span className="text-slate-600"> › {nomPoste(e.posteId)}</span>
                    : <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">Base</span>}
                </td>
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
      <p className="text-xs text-slate-600 font-body mt-3">Le Nano M2 secteur Sud de Bè-Kpota cumule 6 réparations — envisager un remplacement plutôt qu'une nouvelle réparation.</p>

      {openEq && (
        <Modal title="Ajouter un équipement" sub="Rattaché à une base, et éventuellement à un poste de cette base" onClose={() => setOpenEq(false)}>
          <Field label="Nom de l'équipement">
            <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : MikroTik secteur Est" />
          </Field>
          <Field label="Type">
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {types.length === 0 && <p className="text-xs text-red-400 mt-1.5">Créez d'abord un type d'équipement ci-dessus.</p>}
          </Field>
          <Field label="Base">
            <select className={inputCls} value={baseId} onChange={(e) => { setBaseId(e.target.value); setPosteId(""); }}>
              {bases.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}
            </select>
          </Field>
          <Field label="Poste (optionnel)">
            <select className={inputCls} value={posteId} onChange={(e) => setPosteId(e.target.value)}>
              <option value="">— Équipement de la base (ex : Starlink) —</option>
              {postesDeLaBase.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </Field>
          <button onClick={submitEquipement} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Ajouter au parc</button>
        </Modal>
      )}
    </div>
  );
}
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

/* ============================================================
   ABONNÉS — rattachés à une BASE (branche parallèle aux postes)
   Prix : tarif de référence de la base, surchargeable par abonné.
   Deux axes indépendants : statut (actif/suspendu) et paiement.
   ============================================================ */
function AbonnesPanel({ abonnes, bases, canManage, onAdd, onToggleStatut, onEncaisser, onSavePrix, onRemove, onSaveTarifBase }) {
  const [filtreBase, setFiltreBase] = useState("Toutes");
  const [filtrePaiement, setFiltrePaiement] = useState("Tous");
  const [openAdd, setOpenAdd] = useState(false);
  const [openTarifs, setOpenTarifs] = useState(false);
  const [editPrix, setEditPrix] = useState(null);

  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [adresse, setAdresse] = useState("");
  const [baseId, setBaseId] = useState(bases[0]?.id || "");
  const [prixPerso, setPrixPerso] = useState("");

  const nomBase = (id) => bases.find((b) => b.id === id)?.nom || "—";
  const prixEffectif = (a) => a.prixPerso ?? (bases.find((b) => b.id === a.baseId)?.tarifAbonnement || 0);

  const filtered = abonnes.filter((a) =>
    (filtreBase === "Toutes" || a.baseId === filtreBase) &&
    (filtrePaiement === "Tous" || a.paiement === filtrePaiement)
  );

  const actifs = abonnes.filter((a) => a.statut === "actif").length;
  const impayes = abonnes.filter((a) => a.paiement !== "a_jour").length;
  const revenuMensuel = abonnes.filter((a) => a.statut === "actif").reduce((s, a) => s + prixEffectif(a), 0);

  const paiementCfg = {
    a_jour: { label: "À jour", cls: "bg-emerald-400/10 text-emerald-400" },
    en_retard: { label: "En retard", cls: "bg-amber-400/10 text-amber-400" },
    impaye: { label: "Impayé", cls: "bg-red-400/10 text-red-400" },
  };

  const submitAdd = () => {
    if (!nom.trim() || !baseId) return;
    onAdd({
      id: `ab${Date.now()}`, baseId, nom: nom.trim(), tel: tel.trim() || "—",
      adresse: adresse.trim() || "—",
      prixPerso: prixPerso ? parseInt(prixPerso, 10) : null,
      statut: "actif", paiement: "a_jour",
      echeance: "2026-08-11", depuis: "2026-07-11",
    });
    setNom(""); setTel(""); setAdresse(""); setPrixPerso(""); setOpenAdd(false);
  };

  return (
    <div>
      <SectionHeader
        title="Abonnés"
        sub="Clients mensuels rattachés à une base — indépendants des postes de tickets"
        action={canManage && (
          <div className="flex gap-2">
            <button onClick={() => setOpenTarifs(true)} className="bg-slate-800 text-slate-200 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition flex items-center gap-1.5">
              <Settings2 size={14} /> Tarifs par base
            </button>
            <button onClick={() => setOpenAdd(true)} className="bg-amber-400 text-slate-950 font-body font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-300 transition">+ Ajouter un abonné</button>
          </div>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard label="Abonnés actifs" value={String(actifs)} sub={`${abonnes.length - actifs} suspendu(s)`} icon={Users} accent="teal" />
        <KPICard label="Revenu mensuel attendu" value={fmtFCFA(revenuMensuel)} sub="Abonnés actifs uniquement" icon={CreditCard} accent="amber" />
        <KPICard label="Paiements en souffrance" value={String(impayes)} sub="En retard ou impayés" icon={AlertTriangle} accent="red" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-body uppercase tracking-wide"><Filter size={14} /> Filtres</span>
        <select className={inputCls + " w-auto text-xs py-1.5"} value={filtreBase} onChange={(e) => setFiltreBase(e.target.value)}>
          <option value="Toutes">Toutes les bases</option>
          {bases.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}
        </select>
        <select className={inputCls + " w-auto text-xs py-1.5"} value={filtrePaiement} onChange={(e) => setFiltrePaiement(e.target.value)}>
          <option value="Tous">Tous les paiements</option>
          <option value="a_jour">À jour</option>
          <option value="en_retard">En retard</option>
          <option value="impaye">Impayé</option>
        </select>
        <span className="text-xs text-slate-600 font-body ml-auto">{filtered.length} abonné(s)</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Abonné</th>
              <th className="text-left px-4 py-3">Base</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Tarif</th>
              <th className="text-left px-4 py-3">Échéance</th>
              <th className="text-left px-4 py-3">Paiement</th>
              <th className="text-left px-4 py-3">Compte</th>
              {canManage && <th className="text-left px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-slate-800 text-slate-300">
                <td className="px-4 py-3">
                  <p>{a.nom}</p>
                  <p className="text-[11px] text-slate-600 font-body">{a.adresse}</p>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{nomBase(a.baseId)}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.tel}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs">{fmtFCFA(prixEffectif(a))}</span>
                  {a.prixPerso != null && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-sky-400/10 text-sky-400">perso</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.echeance}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${paiementCfg[a.paiement].cls}`}>{paiementCfg[a.paiement].label}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.statut === "actif" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                    {a.statut === "actif" ? "Actif" : "Suspendu"}
                  </span>
                </td>
                {canManage && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {a.paiement !== "a_jour" && (
                        <button onClick={() => onEncaisser(a.id)} className="text-xs bg-emerald-400 text-slate-950 font-semibold px-2.5 py-1 rounded-lg">Encaisser</button>
                      )}
                      <button onClick={() => setEditPrix(a)} className="text-xs text-amber-400 font-semibold hover:underline">Prix</button>
                      <button onClick={() => onToggleStatut(a.id)} className={`text-xs font-semibold hover:underline ${a.statut === "actif" ? "text-red-400" : "text-emerald-400"}`}>
                        {a.statut === "actif" ? "Suspendre" : "Réactiver"}
                      </button>
                      <button onClick={() => onRemove(a.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={canManage ? 8 : 7} className="px-4 py-6 text-center text-slate-600 font-body">Aucun abonné ne correspond à ces filtres.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {openAdd && (
        <Modal title="Ajouter un abonné" sub="Rattaché à une base — laissez le prix vide pour appliquer le tarif de la base" onClose={() => setOpenAdd(false)}>
          <Field label="Nom complet">
            <input className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : M. Kossi Amegan" />
          </Field>
          <Field label="Base">
            <select className={inputCls} value={baseId} onChange={(e) => setBaseId(e.target.value)}>
              {bases.map((b) => <option key={b.id} value={b.id}>{b.nom} — {fmtFCFA(b.tarifAbonnement)}/mois</option>)}
            </select>
          </Field>
          <Field label="Téléphone">
            <input className={inputCls} value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Ex : 90 12 34 56" />
          </Field>
          <Field label="Adresse">
            <input className={inputCls} value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Ex : Rue des Cocotiers, villa 3" />
          </Field>
          <Field label="Prix personnalisé (optionnel)">
            <input type="number" min="0" className={inputCls} value={prixPerso} onChange={(e) => setPrixPerso(e.target.value)} placeholder={`Par défaut : ${fmtFCFA(bases.find((b) => b.id === baseId)?.tarifAbonnement || 0)}`} />
          </Field>
          <button onClick={submitAdd} className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1">Créer l'abonné</button>
        </Modal>
      )}

      {openTarifs && (
        <TarifsBasesModal bases={bases} onClose={() => setOpenTarifs(false)} onSave={onSaveTarifBase} />
      )}

      {editPrix && (
        <PrixAbonneModal
          abonne={editPrix}
          tarifBase={bases.find((b) => b.id === editPrix.baseId)?.tarifAbonnement || 0}
          onClose={() => setEditPrix(null)}
          onSave={(prix) => { onSavePrix(editPrix.id, prix); setEditPrix(null); }}
        />
      )}
    </div>
  );
}

/* Tarif de référence de chaque base */
function TarifsBasesModal({ bases, onClose, onSave }) {
  const [valeurs, setValeurs] = useState(() => bases.reduce((acc, b) => ({ ...acc, [b.id]: b.tarifAbonnement }), {}));

  return (
    <Modal title="Tarifs d'abonnement par base" sub="Prix de référence — surchargeable abonné par abonné" onClose={onClose}>
      {bases.map((b) => (
        <Field key={b.id} label={b.nom}>
          <input
            type="number" min="0" className={inputCls}
            value={valeurs[b.id] ?? ""}
            onChange={(e) => setValeurs((prev) => ({ ...prev, [b.id]: e.target.value }))}
          />
        </Field>
      ))}
      <button
        onClick={() => { Object.entries(valeurs).forEach(([id, v]) => onSave(id, parseInt(v, 10) || 0)); onClose(); }}
        className="w-full bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg mt-1"
      >
        Enregistrer les tarifs
      </button>
    </Modal>
  );
}

/* Prix individuel d'un abonné */
function PrixAbonneModal({ abonne, tarifBase, onClose, onSave }) {
  const [prix, setPrix] = useState(abonne.prixPerso ?? "");

  return (
    <Modal title={`Prix — ${abonne.nom}`} sub={`Tarif de sa base : ${fmtFCFA(tarifBase)}/mois`} onClose={onClose}>
      <Field label="Prix personnalisé (FCFA/mois)">
        <input type="number" min="0" className={inputCls} value={prix} onChange={(e) => setPrix(e.target.value)} placeholder={`Vide = tarif de la base (${fmtFCFA(tarifBase)})`} />
      </Field>
      <p className="text-xs text-slate-500 font-body mb-4">
        Laissez vide pour que cet abonné suive automatiquement le tarif de sa base.
      </p>
      <div className="flex gap-2">
        <button onClick={() => onSave(prix === "" ? null : parseInt(prix, 10))} className="flex-1 bg-amber-400 text-slate-950 font-body font-semibold text-sm py-2.5 rounded-lg">Enregistrer</button>
        <button onClick={() => onSave(null)} className="px-4 bg-slate-800 text-slate-300 font-body font-semibold text-sm py-2.5 rounded-lg">Suivre la base</button>
      </div>
    </Modal>
  );
}

/* ============================================================
   PAGES — TECHNICIEN
   ============================================================ */
function TechnicienEquipements({ equipements, bases, postes }) {
  const nomBase = (id) => bases.find((b) => b.id === id)?.nom || "—";
  const nomPoste = (id) => postes.find((p) => p.id === id)?.nom;
  return (
    <div>
      <SectionHeader title="Équipements de mes bases" sub="Classés par base et par poste" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {equipements.map((e) => (
          <div key={e.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="font-display text-slate-50">{e.nom}</p>
            <p className="text-xs text-slate-500 font-body mt-1">
              {e.type} <span className="text-slate-700">·</span> {nomBase(e.baseId)}
              {e.posteId && <span className="text-slate-600"> › {nomPoste(e.posteId)}</span>}
            </p>
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
  const [abonnes, setAbonnes] = useState(INITIAL_ABONNES);
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [demandesTache, setDemandesTache] = useState(INITIAL_DEMANDES_TACHE);
  const [bareme, setBareme] = useState(INITIAL_BAREME);
  const [reglesPoints, setReglesPoints] = useState(INITIAL_REGLES_POINTS);
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

  const validateRapport = (id, who, justif) => {
    setRapports((prev) => prev.map((r) => r.id === id ? { ...r, statut: "valide", validePar: who, justification: justif ?? r.justification } : r));
    flash(`Rapport ${id} validé par ${who}`);
  };

  const rejectRapport = (id, who, justif) => {
    setRapports((prev) => prev.map((r) => r.id === id ? { ...r, statut: "rejete", validePar: who, justification: justif ?? r.justification } : r));
    flash(`Rapport ${id} rejeté par ${who}`);
  };

  // --- Missions & points ---
  const creerMission = (m) => {
    setMissions((prev) => [m, ...prev]);
    flash(`Travail demandé à ${m.assigneA}`);
  };

  const rapporterMission = (id, rapport) => {
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, rapport, statut: "rapportee" } : m));
    flash("Rapport envoyé — en attente de validation du gestionnaire");
  };

  const validerMission = (id, who) => {
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, statut: "validee", validePar: who } : m));
    flash(`Mission validée par ${who} — points crédités`);
  };

  const rejeterMission = (id, who) => {
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, statut: "rejetee", validePar: who } : m));
    flash(`Mission rejetée par ${who} — aucun point crédité`);
  };

  const demanderTache = (d) => {
    setDemandesTache((prev) => [d, ...prev]);
    flash("Tâche remontée à l'administrateur");
  };

  // L'admin crée la tâche et fixe ses points — elle rejoint le barème
  const creerTache = (demande, points, categorie) => {
    const libelle = demande.libelle;
    setBareme((prev) => [...prev, { id: `t${Date.now()}`, tache: libelle, points, categorie }]);
    if (demande.id) {
      setDemandesTache((prev) => prev.map((d) => d.id === demande.id ? { ...d, statut: "creee" } : d));
    }
    flash(`"${libelle}" ajoutée au barème (${points} pts)`);
  };

  const rejeterDemandeTache = (id) => {
    setDemandesTache((prev) => prev.map((d) => d.id === id ? { ...d, statut: "refusee" } : d));
    flash("Demande de tâche refusée");
  };

  const removeTache = (id) => {
    setBareme((prev) => prev.filter((b) => b.id !== id));
    flash("Tâche retirée du barème");
  };

  const saveRegles = (r) => {
    setReglesPoints(r);
    flash("Règles de points mises à jour");
  };

  // --- Abonnés ---
  const addAbonne = (a) => {
    setAbonnes((prev) => [...prev, a]);
    flash(`${a.nom} ajouté aux abonnés`);
  };

  const toggleStatutAbonne = (id) => {
    setAbonnes((prev) => prev.map((a) => a.id === id
      ? { ...a, statut: a.statut === "actif" ? "suspendu" : "actif" }
      : a));
    flash("Statut de l'abonné mis à jour");
  };

  const encaisserAbonne = (id) => {
    setAbonnes((prev) => prev.map((a) => a.id === id
      ? { ...a, paiement: "a_jour", echeance: "2026-08-11" }
      : a));
    flash("Paiement encaissé — abonné à jour");
  };

  const savePrixAbonne = (id, prix) => {
    setAbonnes((prev) => prev.map((a) => a.id === id ? { ...a, prixPerso: prix } : a));
    flash(prix == null ? "L'abonné suit désormais le tarif de sa base" : "Prix personnalisé enregistré");
  };

  const removeAbonne = (id) => {
    setAbonnes((prev) => prev.filter((a) => a.id !== id));
    flash("Abonné retiré");
  };

  const saveTarifBase = (baseId, tarif) => {
    setBases((prev) => prev.map((b) => b.id === baseId ? { ...b, tarifAbonnement: tarif } : b));
  };

  // --- GPS ---
  const capturerGPS = (posteId) => {
    if (!navigator.geolocation) {
      flash("Géolocalisation non disponible sur cet appareil");
      return;
    }
    flash("Capture de la position en cours…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPostes((prev) => prev.map((p) => p.id === posteId
          ? { ...p, gps: { lat: pos.coords.latitude, lng: pos.coords.longitude } }
          : p));
        flash("Position du poste enregistrée");
      },
      () => flash("Position refusée ou indisponible")
    );
  };

  const navItems = NAV[role];
  const validTab = navItems.find((n) => n.id === tab) ? tab : navItems[0].id;
  const actor = ACTOR_NAMES[role];
  const currentAgent = agents.find((a) => a.nom === ACTOR_NAMES.agent);

  const pointsProps = {
    role, actor, missions, bareme, regles: reglesPoints, demandesTache, bases, postes,
    onCreerMission: creerMission, onRapporter: rapporterMission,
    onValiderMission: validerMission, onRejeterMission: rejeterMission,
    onDemanderTache: demanderTache, onCreerTache: creerTache,
    onRejeterDemande: rejeterDemandeTache, onRemoveTache: removeTache,
    onSaveRegles: saveRegles,
  };

  const renderPage = () => {
    if (role === "admin") {
      if (validTab === "dashboard") return <AdminDashboard />;
      if (validTab === "bases") return (
        <AdminBases
          bases={bases} postes={postes} equipements={equipements} abonnes={abonnes} ticketTypes={ticketTypes}
          onAddBase={addBase} onRemoveBase={removeBase}
          onAddPoste={addPoste} onRemovePoste={removePoste}
          onSaveTarifs={saveTarifs} onCapturerGPS={capturerGPS}
          onAddTicketType={addTicketType} onRemoveTicketType={removeTicketType}
        />
      );
      if (validTab === "gestionnaires") return <AdminGestionnaires gestionnaires={gestionnaires} onAdd={addGestionnaire} />;
      if (validTab === "agents") return <AdminAgents agents={agents} onAdd={addAgent} onToggle={toggleAgent} onToggleValidation={toggleAgentValidation} />;
      if (validTab === "abonnements") return (
        <AbonnesPanel
          abonnes={abonnes} bases={bases} canManage
          onAdd={addAbonne} onToggleStatut={toggleStatutAbonne} onEncaisser={encaisserAbonne}
          onSavePrix={savePrixAbonne} onRemove={removeAbonne} onSaveTarifBase={saveTarifBase}
        />
      );
      if (validTab === "rapports") return (
        <RapportsPanel
          rapports={rapports} canValidate actor={actor} bases={bases} postes={postes}
          onValidate={validateRapport} onReject={rejectRapport}
        />
      );
      if (validTab === "suivi") return <SuiviPostes bases={bases} postes={postes} rapports={rapports} />;
      if (validTab === "points") return <PointsPanel {...pointsProps} />;
      if (validTab === "pannes") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases} postes={postes} equipements={equipements}
          title="Supervision des pannes" sub="Vue globale — pleins pouvoirs (comme sur le terrain)"
          canDeclare canAuthorize canRepair canValidate
          onAdvance={advancePanne} onDeclare={declarePanne}
        />
      );
      if (validTab === "equipements") return (
        <AdminEquipements
          equipements={equipements} types={equipmentTypes} bases={bases} postes={postes}
          onAddType={addEquipmentType} onRemoveType={removeEquipmentType}
          onAddEquipement={addEquipement} onRemoveEquipement={removeEquipement}
        />
      );
    }
    if (role === "gestionnaire") {
      if (validTab === "dashboard") return <GestionnaireDashboard agents={agents} />;
      if (validTab === "distribution") return <GestionnaireDistribution lots={lots} onAddLot={addLot} onReconcile={reconcileLot} agents={agents} />;
      if (validTab === "abonnements") return (
        <AbonnesPanel
          abonnes={abonnes} bases={bases} canManage
          onAdd={addAbonne} onToggleStatut={toggleStatutAbonne} onEncaisser={encaisserAbonne}
          onSavePrix={savePrixAbonne} onRemove={removeAbonne} onSaveTarifBase={saveTarifBase}
        />
      );
      if (validTab === "rapports") return (
        <RapportsPanel
          rapports={rapports} canValidate actor={actor} bases={bases} postes={postes}
          onValidate={validateRapport} onReject={rejectRapport}
        />
      );
      if (validTab === "suivi") return <SuiviPostes bases={bases} postes={postes} rapports={rapports} />;
      if (validTab === "points") return <PointsPanel {...pointsProps} />;
      if (validTab === "pannes") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases} postes={postes} equipements={equipements}
          title="Pannes de mon secteur" sub="Vous pouvez déclarer, autoriser, réparer et valider — comme sur le terrain"
          canDeclare canAuthorize canRepair canValidate
          onAdvance={advancePanne} onDeclare={declarePanne}
        />
      );
    }
    if (role === "technicien") {
      if (validTab === "interventions") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases} postes={postes} equipements={equipements}
          title="Mes interventions" sub="Kossi Amouzou & Ayi Kokou — jamais d'accès à l'argent ni aux tickets"
          canDeclare canRepair
          onAdvance={advancePanne} onDeclare={declarePanne}
        />
      );
      if (validTab === "points") return <PointsPanel {...pointsProps} />;
      if (validTab === "equipements") return <TechnicienEquipements equipements={equipements} bases={bases} postes={postes} />;
    }
    if (role === "agent") {
      if (validTab === "reception") return <AgentReception />;
      if (validTab === "reconciliation") return <AgentReconciliation />;
      if (validTab === "points") return <PointsPanel {...pointsProps} />;
      if (validTab === "pannes") return (
        <PannesPanel
          pannes={pannes} actor={actor} bases={bases} postes={postes} equipements={equipements}
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
