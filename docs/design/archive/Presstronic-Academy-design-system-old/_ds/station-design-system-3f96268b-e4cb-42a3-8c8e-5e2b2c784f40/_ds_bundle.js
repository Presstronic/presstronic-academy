/* @ds-bundle: {"format":3,"namespace":"PresstronicDesignSystem_3f9626","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"}],"sourceHashes":{"app-v2/data-ops.jsx":"627bbb8bfa9c","app-v2/data.jsx":"bf2db05fdf85","app-v2/helpers.jsx":"dc23dbfd47ed","app-v2/icons.jsx":"fc5637d614d2","app-v2/screens-blueprints.jsx":"cfe51c5b9d95","app-v2/screens-contracts.jsx":"503694da61fc","app-v2/screens-dashboard.jsx":"d06eafabf9ff","app-v2/screens-fleet.jsx":"64afd0b097ed","app-v2/screens-hr.jsx":"66a2b0770235","app-v2/screens-inventory.jsx":"81b45a6ca5e2","app-v2/screens-market.jsx":"b33e4d9670fe","app-v2/screens-overview.jsx":"c5c6c720950d","app-v2/screens-profile.jsx":"a3c223b3bea1","app-v2/screens-refinery.jsx":"7d8a0109d33a","app-v2/screens-sessions.jsx":"32ad41f17fef","app-v2/screens-treasury.jsx":"c388633d6c82","app-v2/shell.jsx":"e0700005a28a","app-v2/ui.jsx":"7810a8fc24c7","app/Contracts.jsx":"bc24663f237f","app/Fleet.jsx":"0ed133c61505","app/Inventory.jsx":"b20fe1387538","app/Members.jsx":"daf666b4ec8c","app/Profile.jsx":"f735a1854dd2","app/Treasury.jsx":"7eb901b5d5df","app/WorkOrders.jsx":"8b5dc2c831ea","app/app-shell.jsx":"338b41267a51","app/inventory-data.jsx":"5d0632104ee7","app/inventory-rows.jsx":"28d6fd25fda8","components/core/Badge.jsx":"124145452c28","components/core/Button.jsx":"826a3bbfc99d","dashboard/DashboardApp.jsx":"ca089cacba29","dashboard/DashboardGrid.jsx":"d3c9a2282784","dashboard/portlets.jsx":"497062a158c4","dashboard/tweaks-panel.jsx":"6591467622ed","landing/LandingApp.jsx":"44a4077a3389","landing/tweaks-panel.jsx":"6591467622ed","legal/legal.js":"ef1537f6660c","ui_kits/station/CTA.jsx":"5195d96fbd35","ui_kits/station/FAQ.jsx":"f428f56a7f18","ui_kits/station/Features.jsx":"c22be823d213","ui_kits/station/Hero.jsx":"1dfbd339d8f1","ui_kits/station/Nav.jsx":"e155ceb6dd83","ui_kits/station/Pricing.jsx":"255d9d9fa209","ui_kits/station/StationApp.jsx":"c526f294b5a9","ui_kits/station/tweaks-panel.jsx":"6591467622ed"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PresstronicDesignSystem_3f9626 = window.PresstronicDesignSystem_3f9626 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// app-v2/data-ops.jsx
try { (() => {
/* ============================================================
   STATION APP — Operations data (Star Citizen flavoured)
   Work Sessions (parent) → Work Orders (children) → ships/ore/crew.
   Plus ore reference + payout math, shared by the Work Sessions,
   Refinery and Treasury screens. Exposed on window.
   ============================================================ */

/* ---- ore reference (aUEC per refined SCU, plausible 4.x) ---- */
const ORE = {
  Quantanium: {
    price: 26800,
    color: '#5BD6B0'
  },
  Bexalite: {
    price: 17400,
    color: '#7CBEF9'
  },
  Taranite: {
    price: 16100,
    color: '#C879D8'
  },
  Gold: {
    price: 12300,
    color: '#E0B23A'
  },
  Laranite: {
    price: 6300,
    color: '#9AA7B2'
  },
  Agricium: {
    price: 5800,
    color: '#B6E3D4'
  },
  Hephaestanite: {
    price: 5300,
    color: '#E0913A'
  },
  Titanium: {
    price: 1900,
    color: '#8FA0AE'
  },
  Tungsten: {
    price: 1500,
    color: '#6E7BF2'
  },
  Iron: {
    price: 1100,
    color: '#C2724B'
  },
  RMC: {
    price: 12100,
    color: '#5BD6B0'
  },
  CMAT: {
    price: 1800,
    color: '#9AA7B2'
  }
};
const oreColor = n => ORE[n] && ORE[n].color || '#9AA7B2';

/* ---- work-order type + status meta -------------------------- */
const WO_TYPE = {
  ship: {
    icon: 'pickaxe',
    label: 'Ship Mining',
    cls: 'wt-ship',
    shipIcon: 'gem',
    cat: 'mining'
  },
  vehicle: {
    icon: 'car',
    label: 'Vehicle (ROC)',
    cls: 'wt-vehicle',
    shipIcon: 'car',
    cat: 'mining'
  },
  rocds: {
    icon: 'car',
    label: 'ROC DS',
    cls: 'wt-vehicle',
    shipIcon: 'car',
    cat: 'mining'
  },
  geo: {
    icon: 'gem',
    label: 'Geo Mining',
    cls: 'wt-geo',
    shipIcon: 'gem',
    cat: 'mining'
  },
  hand: {
    icon: 'pickaxe',
    label: 'Hand Mining',
    cls: 'wt-hand',
    shipIcon: 'pickaxe',
    cat: 'mining'
  },
  salvage: {
    icon: 'recycle',
    label: 'Salvage',
    cls: 'wt-salvage',
    shipIcon: 'recycle',
    cat: 'salvage'
  }
};
const WO_CATEGORY = {
  mining: {
    label: 'Mining',
    icon: 'pickaxe',
    methods: ['ship', 'vehicle', 'rocds', 'geo', 'hand']
  },
  salvage: {
    label: 'Salvage',
    icon: 'recycle',
    methods: ['salvage']
  }
};
const WO_STATUS = {
  queued: {
    tone: 'neutral',
    icon: 'circleDashed',
    label: 'Queued'
  },
  refining: {
    tone: 'warn',
    icon: 'loader',
    label: 'Refining'
  },
  refined: {
    tone: 'info',
    icon: 'packageCheck',
    label: 'Refined'
  },
  sold: {
    tone: 'success',
    icon: 'badgeCheck',
    label: 'Sold'
  },
  failed: {
    tone: 'danger',
    icon: 'circleX',
    label: 'Failed'
  }
};
const SESSION_STATUS = {
  planned: {
    tone: 'neutral',
    icon: 'calendar',
    label: 'Planned'
  },
  active: {
    tone: 'warn',
    icon: 'loader',
    label: 'Active'
  },
  closed: {
    tone: 'info',
    icon: 'lock',
    label: 'Ready to settle'
  },
  settled: {
    tone: 'success',
    icon: 'badgeCheck',
    label: 'Settled'
  }
};

/* ---- work sessions (each groups N work orders) -------------- */
const WORK_SESSIONS = [{
  id: 'WS-118',
  name: 'Aaron Halo — Saturday Op',
  theater: 'Aaron Halo · Stanton',
  lead: 'Mara Vex',
  status: 'active',
  started: '3h ago',
  window: 'Sat 20:00–23:30 UTC',
  live: true,
  note: 'Big quant push with two MOLE crews + escort. Iris running the Prospector solo on cluster scans.',
  participants: ['Mara Vex', 'Rook Calder', 'Sable Ng', 'Korr Vaeth', 'Juno Reyes'],
  invited: ['Tessa Brandt'],
  declined: ['Dex Marrow'],
  orgCutPct: 10,
  orgCutEnabled: true,
  crews: [{
    id: 'CR-41',
    type: 'ship',
    name: 'Mole Wing',
    ship: 'MISC Mole',
    commander: 'Mara Vex',
    members: ['Mara Vex', 'Korr Vaeth', 'Juno Reyes'],
    orderIds: ['WO-3041', 'WO-3036']
  }, {
    id: 'CR-40',
    type: 'ship',
    name: 'Prospector Solo',
    ship: 'MISC Prospector',
    commander: 'Sable Ng',
    members: ['Sable Ng'],
    orderIds: ['WO-3040']
  }],
  orders: [{
    id: 'WO-3041',
    title: 'Aaron Halo dragline',
    type: 'ship',
    status: 'refining',
    loc: 'Aaron Halo · Cluster 7',
    refinery: 'ARC-L1 · Refinery',
    method: 'Dinyx Solventation',
    yield: 78,
    progress: 0.64,
    timeLeft: '1h 12m',
    ships: [{
      ship: 'MISC Mole',
      op: 'Mara Vex',
      scu: 96
    }, {
      ship: 'MISC Mole',
      op: 'Korr Vaeth',
      scu: 88
    }, {
      ship: 'MISC Prospector',
      op: 'Sable Ng',
      scu: 32
    }],
    ores: [['Quantanium', 132, 103], ['Taranite', 60, 47], ['Bexalite', 24, 19]],
    expenses: [['Refinery fee', 31400, 'Mara Vex'], ['Fuel + QT', 8200, 'Korr Vaeth']],
    crew: [{
      name: 'Mara Vex',
      role: 'Lead · Seller',
      type: 'equal'
    }, {
      name: 'Korr Vaeth',
      role: 'Operator',
      type: 'equal'
    }, {
      name: 'Sable Ng',
      role: 'Operator',
      type: 'equal'
    }, {
      name: 'Juno Reyes',
      role: 'Escort',
      type: 'percent',
      val: 10
    }]
  }, {
    id: 'WO-3040',
    title: 'Lyria surface sweep',
    type: 'ship',
    status: 'refined',
    loc: 'Lyria · Crater Field',
    refinery: 'ARC-L1 · Refinery',
    method: 'Ferron Exchange',
    yield: 71,
    progress: 1,
    timeLeft: 'Ready to sell',
    ships: [{
      ship: 'MISC Prospector',
      op: 'Sable Ng',
      scu: 50
    }],
    ores: [['Laranite', 32, 23], ['Agricium', 18, 13]],
    expenses: [['Refinery fee', 6200, 'Sable Ng']],
    crew: [{
      name: 'Sable Ng',
      role: 'Solo · Seller',
      type: 'equal'
    }]
  }, {
    id: 'WO-3036',
    title: 'Aaron Halo cluster 4',
    type: 'ship',
    status: 'queued',
    loc: 'Aaron Halo · Cluster 4',
    refinery: 'Not submitted',
    method: '—',
    yield: 0,
    progress: 0,
    timeLeft: 'Awaiting refinery',
    ships: [{
      ship: 'MISC Mole',
      op: 'Mara Vex',
      scu: 84
    }, {
      ship: 'MISC Mole',
      op: 'Korr Vaeth',
      scu: 76
    }],
    ores: [['Bexalite', 54, 0], ['Titanium', 120, 0]],
    expenses: [],
    crew: [{
      name: 'Mara Vex',
      role: 'Lead · Seller',
      type: 'equal'
    }, {
      name: 'Korr Vaeth',
      role: 'Operator',
      type: 'equal'
    }]
  }]
}, {
  id: 'WS-117',
  name: 'Yela Reclamation Run',
  theater: 'Yela Belt · Stanton',
  lead: 'Rook Calder',
  status: 'active',
  started: '5h ago',
  window: 'Open-ended',
  live: true,
  note: 'Reclaimer + Vulture stripping the wreck field. Talia on processing.',
  participants: ['Rook Calder', 'Korr Vaeth', 'Tessa Brandt'],
  invited: [],
  declined: [],
  orgCutPct: 10,
  orgCutEnabled: true,
  crews: [{
    id: 'CR-37',
    type: 'salvage',
    name: 'Reclaimer Team',
    ship: 'Aegis Reclaimer',
    commander: 'Rook Calder',
    members: ['Rook Calder', 'Korr Vaeth', 'Tessa Brandt'],
    orderIds: ['WO-3037']
  }],
  orders: [{
    id: 'WO-3037',
    title: 'Yela wreck reclaim',
    type: 'salvage',
    status: 'refining',
    loc: 'Yela Belt · Wrecks 19–24',
    refinery: 'CRU-L1 · Reclamation',
    method: 'Material Reclaim',
    yield: 96,
    progress: 0.31,
    timeLeft: '3h 48m',
    ships: [{
      ship: 'Drake Vulture',
      op: 'Korr Vaeth',
      scu: 64
    }, {
      ship: 'Aegis Reclaimer',
      op: 'Rook Calder',
      scu: 220
    }],
    ores: [['RMC', 180, 172], ['CMAT', 96, 91]],
    expenses: [['Hull repair', 18400, 'Korr Vaeth']],
    crew: [{
      name: 'Rook Calder',
      role: 'Reclaimer · Seller',
      type: 'equal'
    }, {
      name: 'Korr Vaeth',
      role: 'Operator',
      type: 'flat',
      val: 120000
    }, {
      name: 'Tessa Brandt',
      role: 'Processing',
      type: 'equal'
    }],
    altSeller: 'Rook Calder'
  }]
}, {
  id: 'WS-115',
  name: 'Daymar ROC Gem Night',
  theater: 'Daymar · Stanton',
  lead: 'Sable Ng',
  status: 'closed',
  started: 'Yesterday',
  window: 'Fri 21:00–23:00 UTC',
  live: false,
  note: 'Hand-mined gems, sold direct. Ready to settle payouts to the two drivers.',
  participants: ['Sable Ng', 'Juno Reyes'],
  invited: ['Mara Vex'],
  declined: [],
  orgCutPct: 5,
  orgCutEnabled: false,
  crews: [{
    id: 'CR-38',
    type: 'geo',
    name: 'ROC Drivers',
    ship: 'Greycat ROC',
    commander: 'Sable Ng',
    members: ['Sable Ng', 'Juno Reyes'],
    orderIds: ['WO-3038']
  }],
  orders: [{
    id: 'WO-3038',
    title: 'Daymar ROC gem run',
    type: 'vehicle',
    status: 'sold',
    loc: 'Daymar · Eager Flats',
    refinery: '—',
    method: 'Hand-sold (gems)',
    yield: 100,
    progress: 1,
    timeLeft: 'Sold',
    ships: [{
      ship: 'Greycat ROC',
      op: 'Sable Ng',
      scu: 9
    }, {
      ship: 'Greycat ROC',
      op: 'Juno Reyes',
      scu: 7
    }],
    ores: [['Hephaestanite', 16, 16]],
    expenses: [],
    crew: [{
      name: 'Sable Ng',
      role: 'Driver · Seller',
      type: 'equal'
    }, {
      name: 'Juno Reyes',
      role: 'Driver',
      type: 'equal'
    }]
  }]
}, {
  id: 'WS-120',
  name: 'Wala Ring Sweep',
  theater: 'Wala · Stanton',
  lead: 'Korr Vaeth',
  status: 'planned',
  started: 'Scheduled',
  window: 'Sun 19:00 UTC',
  live: false,
  note: 'Planned ring sweep — roster forming. No work orders logged yet.',
  participants: ['Korr Vaeth', 'Mara Vex'],
  invited: ['Sable Ng', 'Juno Reyes'],
  declined: [],
  orgCutPct: 10,
  orgCutEnabled: true,
  crews: [],
  orders: []
}, {
  id: 'WS-112',
  name: 'Lyria Quant Push',
  theater: 'Lyria · Stanton',
  lead: 'Mara Vex',
  status: 'settled',
  started: '3 weeks ago',
  window: 'Closed',
  live: false,
  note: 'Settled and paid out. Archived for the books.',
  participants: ['Mara Vex', 'Dex Marrow'],
  invited: [],
  declined: [],
  orgCutPct: 10,
  orgCutEnabled: true,
  crews: [{
    id: 'CR-24',
    type: 'ship',
    name: 'Quant Haul',
    ship: 'MISC Mole',
    commander: 'Mara Vex',
    members: ['Mara Vex', 'Dex Marrow'],
    orderIds: ['WO-3024', 'WO-3030']
  }],
  orders: [{
    id: 'WO-3024',
    title: 'Daymar quant haul',
    type: 'ship',
    status: 'sold',
    loc: 'Daymar · Kudre Ore',
    refinery: 'CRU-L1 · Refinery',
    method: 'Dinyx Solventation',
    yield: 82,
    progress: 1,
    timeLeft: 'Sold',
    ships: [{
      ship: 'MISC Mole',
      op: 'Mara Vex',
      scu: 110
    }, {
      ship: 'MISC Prospector',
      op: 'Dex Marrow',
      scu: 44
    }],
    ores: [['Quantanium', 120, 98], ['Taranite', 30, 24]],
    expenses: [['Refinery fee', 22400, 'Mara Vex']],
    crew: [{
      name: 'Mara Vex',
      role: 'Lead · Seller',
      type: 'equal'
    }, {
      name: 'Dex Marrow',
      role: 'Operator',
      type: 'equal'
    }]
  }, {
    id: 'WO-3030',
    title: 'Wala ring (ship lost)',
    type: 'ship',
    status: 'failed',
    loc: 'Wala · Ring',
    refinery: 'HUR-L2 · Refinery',
    method: 'Cormack Method',
    yield: 0,
    progress: 0,
    timeLeft: 'Ship lost — claim filed',
    ships: [{
      ship: 'MISC Prospector',
      op: 'Dex Marrow',
      scu: 28
    }],
    ores: [['Gold', 28, 0]],
    expenses: [['Insurance excess', 4500, 'Dex Marrow']],
    crew: [{
      name: 'Dex Marrow',
      role: 'Solo',
      type: 'equal'
    }]
  }]
}];

/* ---- money helpers ----------------------------------------- */
const moneyFmt = n => Math.round(Number(n) || 0).toLocaleString('en-US');
const moneyAbbr = n => {
  const a = Math.abs(Number(n) || 0);
  if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(Math.round(n || 0));
};
const unrealised = o => o.status === 'queued' || o.status === 'failed';

/* ---- per-order math ---------------------------------------- */
function grossOf(o) {
  return o.ores.reduce((s, [name,, refined]) => s + refined * (ORE[name] ? ORE[name].price : 0), 0);
}
function scuOf(o) {
  return o.ores.reduce((s, x) => s + (unrealised(o) ? x[1] : x[2]), 0);
}
function expensesOf(o) {
  return o.expenses.reduce((s, [, amt]) => s + amt, 0);
}
function payoutOf(o, orgCutPct) {
  const gross = grossOf(o);
  const totalExp = expensesOf(o);
  const net = Math.max(0, gross - totalExp);
  const orgCut = Math.max(0, Math.round(net * (orgCutPct || 0) / 100));
  const distributable = Math.max(0, net - orgCut);
  const flats = o.crew.filter(c => c.type === 'flat');
  const pcts = o.crew.filter(c => c.type === 'percent');
  const shareWeighted = o.crew.filter(c => c.type === 'share');
  const equals = o.crew.filter(c => !c.type || c.type === 'equal');
  const flatSum = flats.reduce((s, c) => s + (c.val || 0), 0);
  const pctSum = pcts.reduce((s, c) => s + distributable * (c.val || 0) / 100, 0);
  const afterFixed = Math.max(0, distributable - flatSum - pctSum);
  const shareUnits = shareWeighted.reduce((s, c) => s + (c.val || 1), 0) + equals.length;
  const perUnit = shareUnits ? afterFixed / shareUnits : 0;
  const rows = o.crew.map(c => {
    let share = 0,
      label = 'Equal';
    if (c.type === 'flat') {
      share = c.val || 0;
      label = 'Flat';
    } else if (c.type === 'percent') {
      share = distributable * (c.val || 0) / 100;
      label = (c.val || 0) + '%';
    } else if (c.type === 'share') {
      share = perUnit * (c.val || 1);
      label = (c.val || 1) + '\u00d7 share';
    } else {
      share = perUnit;
      label = 'Equal';
    }
    const reimb = o.expenses.filter(e => e[2] === c.name).reduce((s, e) => s + e[1], 0);
    return {
      ...c,
      share,
      reimb,
      total: share + reimb,
      label
    };
  });
  return {
    gross,
    totalExp,
    net,
    orgCut,
    distributable,
    rows
  };
}

/* ---- estimated order value (realised → actual; else projected) --- */
function estGrossOf(o) {
  if (!unrealised(o)) return grossOf(o);
  const y = o.yield ? o.yield / 100 : 0.7;
  return o.ores.reduce((s, [name, raw]) => s + raw * y * (ORE[name] ? ORE[name].price : 0), 0);
}

/* ---- SESSION-LEVEL payout ----------------------------------
   Pools every work order's (estimated) value, nets expenses,
   takes the org cut, THEN splits the remaining crew pool across
   the roster. The split TYPE is chosen once for the whole roster
   (s.payoutMode: equal · share · percent · flat); per-user values
   (s.payout = [{name,val}]) set each person's cut within that
   type (equal needs none). --------------------------------------- */
function sessionPayout(s) {
  let gross = 0,
    exp = 0,
    anyEst = false;
  (s.orders || []).forEach(o => {
    gross += estGrossOf(o);
    exp += expensesOf(o);
    if (unrealised(o)) anyEst = true;
  });
  const net = Math.max(0, gross - exp);
  const cut = s.orgCutEnabled ? s.orgCutPct || 0 : 0;
  const orgCut = Math.round(net * cut / 100);
  const distributable = Math.max(0, net - orgCut); // roster split happens on THIS, after org cut
  const names = s.participants || [];
  const mode = s.payoutMode || 'equal';
  const saved = {};
  (s.payout || []).forEach(p => {
    saved[p.name] = p;
  });
  const valOf = n => saved[n] && saved[n].val != null ? saved[n].val : mode === 'share' ? 1 : 0;
  let rows = [];
  if (mode === 'share') {
    const units = names.reduce((a, n) => a + (valOf(n) || 0), 0);
    const per = units ? distributable / units : 0;
    rows = names.map(n => ({
      name: n,
      val: valOf(n),
      share: per * (valOf(n) || 0),
      label: (valOf(n) || 0) + '\u00d7'
    }));
  } else if (mode === 'percent') {
    rows = names.map(n => ({
      name: n,
      val: valOf(n),
      share: distributable * (valOf(n) || 0) / 100,
      label: (valOf(n) || 0) + '%'
    }));
  } else if (mode === 'flat') {
    rows = names.map(n => ({
      name: n,
      val: valOf(n),
      share: valOf(n) || 0,
      label: 'Flat'
    }));
  } else {
    const per = names.length ? distributable / names.length : 0;
    rows = names.map(n => ({
      name: n,
      val: null,
      share: per,
      label: 'Equal'
    }));
  }
  const allocated = rows.reduce((a, r) => a + r.share, 0);
  const remaining = distributable - allocated;
  return {
    gross,
    exp,
    net,
    orgCut,
    cut,
    distributable,
    mode,
    rows,
    allocated,
    remaining,
    estimated: anyEst
  };
}
/* ---- session rollups --------------------------------------- */
function sessionTotals(s) {
  let yieldScu = 0,
    gross = 0,
    exp = 0,
    refining = 0,
    ships = 0;
  const people = new Set(s.participants);
  s.orders.forEach(o => {
    if (!unrealised(o)) {
      yieldScu += o.ores.reduce((a, x) => a + x[2], 0);
      gross += grossOf(o);
      exp += expensesOf(o);
    }
    if (o.status === 'refining') refining += 1;
    ships += o.ships.length;
    o.crew.forEach(c => people.add(c.name));
  });
  return {
    yieldScu,
    gross,
    exp,
    net: Math.max(0, gross - exp),
    refining,
    ships,
    orders: s.orders.length,
    people: people.size
  };
}

/* ============================================================
   REFINERY — ore-refining job pipeline
   queued → processing → ready → collected (+ failed)
   ============================================================ */
const REF_STATUS = {
  queued: {
    tone: 'neutral',
    icon: 'circleDashed',
    label: 'Queued'
  },
  processing: {
    tone: 'warn',
    icon: 'loader',
    label: 'Processing'
  },
  ready: {
    tone: 'info',
    icon: 'packageCheck',
    label: 'Ready to collect'
  },
  collected: {
    tone: 'success',
    icon: 'badgeCheck',
    label: 'Collected'
  },
  failed: {
    tone: 'danger',
    icon: 'circleX',
    label: 'Failed'
  }
};

/* refining methods — yield / speed / fee tradeoffs (SC-flavoured) */
const REFINERY_METHODS = {
  'Dinyx Solventation': {
    yield: 0.78,
    speedH: 9.5,
    feeMul: 1.30,
    note: 'Best yield, slowest & priciest.'
  },
  'Ferron Exchange': {
    yield: 0.71,
    speedH: 6.0,
    feeMul: 1.00,
    note: 'Balanced all-rounder.'
  },
  'Cormack Method': {
    yield: 0.66,
    speedH: 4.0,
    feeMul: 0.85,
    note: 'Fast, lower yield.'
  },
  'Electrostarisis': {
    yield: 0.74,
    speedH: 7.5,
    feeMul: 1.15,
    note: 'High yield on metals.'
  },
  'Pyrometric Chromalysis': {
    yield: 0.69,
    speedH: 5.0,
    feeMul: 0.95,
    note: 'Good for mixed ore.'
  },
  'Kazen Winnowing': {
    yield: 0.62,
    speedH: 3.0,
    feeMul: 0.70,
    note: 'Cheapest & fastest.'
  },
  'Gaussian Reflection': {
    yield: 0.73,
    speedH: 6.8,
    feeMul: 1.10,
    note: 'Strong on crystalline ore.'
  },
  'Thermonatic Deposition': {
    yield: 0.76,
    speedH: 8.2,
    feeMul: 1.22,
    note: 'High yield, slow throughput.'
  },
  'XCR Reaction': {
    yield: 0.68,
    speedH: 4.6,
    feeMul: 0.90,
    note: 'Quick turnaround, mid yield.'
  },
  'Ferromatic Resonance': {
    yield: 0.70,
    speedH: 5.5,
    feeMul: 1.02,
    note: 'Reliable on common metals.'
  }
};

/* refinery terminals (stations) + live capacity */
const REFINERY_TERMINALS = [{
  id: 'ARC-L1',
  name: 'ARC-L1 Refinery',
  system: 'Stanton · Arccorp',
  slots: 8,
  methods: ['Dinyx Solventation', 'Ferron Exchange', 'Electrostarisis', 'Pyrometric Chromalysis', 'Gaussian Reflection', 'Thermonatic Deposition', 'XCR Reaction']
}, {
  id: 'CRU-L1',
  name: 'CRU-L1 Refinery',
  system: 'Stanton · Crusader',
  slots: 8,
  methods: ['Ferron Exchange', 'Cormack Method', 'Pyrometric Chromalysis', 'Kazen Winnowing', 'XCR Reaction', 'Ferromatic Resonance']
}, {
  id: 'HUR-L2',
  name: 'HUR-L2 Refinery',
  system: 'Stanton · Hurston',
  slots: 6,
  methods: ['Dinyx Solventation', 'Cormack Method', 'Electrostarisis', 'Thermonatic Deposition', 'Ferromatic Resonance']
}, {
  id: 'MIC-L1',
  name: 'MIC-L1 Refinery',
  system: 'Stanton · Microtech',
  slots: 6,
  methods: ['Ferron Exchange', 'Electrostarisis', 'Kazen Winnowing', 'Gaussian Reflection', 'XCR Reaction']
}, {
  id: 'PYRO-R',
  name: 'Ruin Station',
  system: 'Pyro · Ruin',
  slots: 4,
  methods: ['Cormack Method', 'Kazen Winnowing', 'XCR Reaction', 'Ferromatic Resonance']
}];

/* active + recent refining batches. ores: [name, inputScu] */
const REFINERY_BATCHES = [{
  id: 'RB-204',
  owner: 'Mara Vex',
  terminal: 'ARC-L1',
  method: 'Dinyx Solventation',
  status: 'processing',
  ores: [['Quantanium', 132], ['Taranite', 60], ['Bexalite', 24]],
  yield: 0.78,
  progress: 0.64,
  eta: '1h 12m',
  fee: 31400,
  started: '3h ago',
  session: 'WS-118',
  order: 'WO-3041'
}, {
  id: 'RB-203',
  owner: 'Rook Calder',
  terminal: 'CRU-L1',
  method: 'Ferron Exchange',
  status: 'processing',
  ores: [['RMC', 180], ['CMAT', 96]],
  yield: 0.96,
  progress: 0.31,
  eta: '3h 48m',
  fee: 18400,
  started: '5h ago',
  session: 'WS-117',
  order: 'WO-3037'
}, {
  id: 'RB-202',
  owner: 'Sable Ng',
  terminal: 'ARC-L1',
  method: 'Ferron Exchange',
  status: 'ready',
  ores: [['Laranite', 32], ['Agricium', 18]],
  yield: 0.71,
  progress: 1,
  eta: 'Ready',
  fee: 6200,
  started: 'Yesterday',
  session: 'WS-118',
  order: 'WO-3040'
}, {
  id: 'RB-201',
  owner: 'Korr Vaeth',
  terminal: 'HUR-L2',
  method: 'Electrostarisis',
  status: 'queued',
  ores: [['Titanium', 220], ['Tungsten', 80]],
  yield: 0.74,
  progress: 0,
  eta: 'Awaiting slot',
  fee: 14200,
  started: '1h ago',
  session: null,
  order: null
}, {
  id: 'RB-198',
  owner: 'Mara Vex',
  terminal: 'CRU-L1',
  method: 'Dinyx Solventation',
  status: 'collected',
  ores: [['Quantanium', 120], ['Taranite', 30]],
  yield: 0.82,
  progress: 1,
  eta: 'Collected',
  fee: 22400,
  started: '3 weeks ago',
  session: 'WS-112',
  order: 'WO-3024'
}, {
  id: 'RB-196',
  owner: 'Dex Marrow',
  terminal: 'HUR-L2',
  method: 'Cormack Method',
  status: 'failed',
  ores: [['Gold', 28]],
  yield: 0,
  progress: 0,
  eta: 'Lost — ship destroyed',
  fee: 4500,
  started: '3 weeks ago',
  session: 'WS-112',
  order: 'WO-3030'
}];
const batchInputScu = b => b.ores.reduce((s, [, scu]) => s + scu, 0);
const batchYieldScu = b => Math.round(b.ores.reduce((s, [, scu]) => s + scu, 0) * b.yield);
const batchValue = b => Math.round(b.ores.reduce((s, [name, scu]) => s + scu * b.yield * (ORE[name] ? ORE[name].price : 0), 0));

/* ============================================================
   TREASURY — accounts, ledger & payout approvals (aUEC)
   ============================================================ */
const TREASURY_ACCOUNTS = [{
  id: 'ops',
  name: 'Operating Account',
  kind: 'operating',
  icon: 'landmark',
  balance: 14820400,
  note: 'Primary org treasury — fees, rewards, day-to-day.'
}, {
  id: 'mining',
  name: 'Mining Division Fund',
  kind: 'division',
  icon: 'pickaxe',
  balance: 6240100,
  note: 'Industry payouts & equipment.'
}, {
  id: 'payroll',
  name: 'Payroll Escrow',
  kind: 'payroll',
  icon: 'handCoins',
  balance: 3180000,
  note: 'Held for pending crew payouts.'
}, {
  id: 'security',
  name: 'Security Division Fund',
  kind: 'division',
  icon: 'shield',
  balance: 1920500,
  note: 'Escort & defense operations.'
}];
const TX_TYPE = {
  reward: {
    dir: 'in',
    icon: 'badgeCheck',
    label: 'Contract reward',
    tone: 'pos'
  },
  refine: {
    dir: 'in',
    icon: 'factory',
    label: 'Refined sale',
    tone: 'pos'
  },
  dues: {
    dir: 'in',
    icon: 'arrowDownLeft',
    label: 'Member dues',
    tone: 'pos'
  },
  deposit: {
    dir: 'in',
    icon: 'arrowDownLeft',
    label: 'Deposit',
    tone: 'pos'
  },
  payout: {
    dir: 'out',
    icon: 'handCoins',
    label: 'Crew payout',
    tone: 'neg'
  },
  fee: {
    dir: 'out',
    icon: 'receipt',
    label: 'Refinery fee',
    tone: 'neg'
  },
  expense: {
    dir: 'out',
    icon: 'arrowUpRight',
    label: 'Expense',
    tone: 'neg'
  },
  transfer: {
    dir: 'out',
    icon: 'arrowLeftRight',
    label: 'Transfer',
    tone: 'neutral'
  }
};
const TX_STATUS = {
  cleared: {
    tone: 'success',
    label: 'Cleared'
  },
  pending: {
    tone: 'warn',
    label: 'Pending'
  },
  void: {
    tone: 'neutral',
    label: 'Voided'
  }
};
const TREASURY_TX = [{
  id: 'TX-7841',
  date: 'Today · 14:20',
  account: 'ops',
  type: 'reward',
  amount: 420000,
  party: 'Quantanium run — A18',
  status: 'cleared',
  note: 'Contract c1 reward settled to treasury.'
}, {
  id: 'TX-7840',
  date: 'Today · 11:02',
  account: 'mining',
  type: 'refine',
  amount: 1840600,
  party: 'WS-118 · Aaron Halo',
  status: 'cleared',
  note: 'Refined Quantanium sale proceeds.'
}, {
  id: 'TX-7839',
  date: 'Today · 09:48',
  account: 'payroll',
  type: 'payout',
  amount: 312400,
  party: 'Sable Ng',
  status: 'pending',
  note: 'Crew share — Lyria surface sweep.'
}, {
  id: 'TX-7838',
  date: 'Yesterday',
  account: 'ops',
  type: 'fee',
  amount: 31400,
  party: 'ARC-L1 Refinery',
  status: 'cleared',
  note: 'Refinery fee — RB-204.'
}, {
  id: 'TX-7837',
  date: 'Yesterday',
  account: 'ops',
  type: 'dues',
  amount: 48000,
  party: '12 members',
  status: 'cleared',
  note: 'Monthly member dues.'
}, {
  id: 'TX-7836',
  date: '2 days ago',
  account: 'security',
  type: 'payout',
  amount: 180000,
  party: 'Rook Calder',
  status: 'cleared',
  note: 'Escort contract payout.'
}, {
  id: 'TX-7835',
  date: '2 days ago',
  account: 'mining',
  type: 'transfer',
  amount: 500000,
  party: '→ Operating Account',
  status: 'cleared',
  note: 'Division surplus swept to operating.'
}, {
  id: 'TX-7834',
  date: '3 days ago',
  account: 'ops',
  type: 'expense',
  amount: 64000,
  party: 'Hull repairs',
  status: 'cleared',
  note: 'Reclaimer hull repair reimbursement.'
}, {
  id: 'TX-7833',
  date: '4 days ago',
  account: 'mining',
  type: 'refine',
  amount: 980000,
  party: 'WS-112 · Lyria',
  status: 'cleared',
  note: 'Refined sale proceeds.'
}, {
  id: 'TX-7832',
  date: '5 days ago',
  account: 'payroll',
  type: 'payout',
  amount: 240000,
  party: 'Korr Vaeth',
  status: 'void',
  note: 'Voided — duplicate request.'
}];
const PAYOUT_REQUESTS = [{
  id: 'PR-318',
  member: 'Korr Vaeth',
  amount: 120000,
  account: 'payroll',
  reason: 'Yela belt fuel + hull repairs reimbursement',
  requested: '4m ago',
  status: 'pending',
  session: 'WS-117'
}, {
  id: 'PR-317',
  member: 'Sable Ng',
  amount: 312400,
  account: 'payroll',
  reason: 'Crew share — Lyria surface sweep (WO-3040)',
  requested: '1h ago',
  status: 'pending',
  session: 'WS-118'
}, {
  id: 'PR-316',
  member: 'Juno Reyes',
  amount: 88000,
  account: 'ops',
  reason: 'Escort standby — Daymar convoy',
  requested: '6h ago',
  status: 'pending',
  session: null
}, {
  id: 'PR-314',
  member: 'Tessa Brandt',
  amount: 54000,
  account: 'ops',
  reason: 'Medical supplies restock',
  requested: 'Yesterday',
  status: 'approved',
  session: null
}, {
  id: 'PR-311',
  member: 'Dex Marrow',
  amount: 40000,
  account: 'mining',
  reason: 'ROC rental',
  requested: '2 days ago',
  status: 'denied',
  session: null
}];
const accountById = id => TREASURY_ACCOUNTS.find(a => a.id === id);

/* ---- crews (within a work session) ------------------------- */
const CREW_TYPE = {
  ship: {
    icon: 'rocket',
    label: 'Ship crew',
    cls: 'wt-ship'
  },
  hand: {
    icon: 'pickaxe',
    label: 'Hand mining',
    cls: 'wt-vehicle'
  },
  geo: {
    icon: 'car',
    label: 'Geo (ROC)',
    cls: 'wt-vehicle'
  },
  salvage: {
    icon: 'recycle',
    label: 'Salvage crew',
    cls: 'wt-salvage'
  }
};
function crewOrders(crew, session) {
  return (session.orders || []).filter(o => (crew.orderIds || []).includes(o.id));
}
function crewRollup(crew, session) {
  const ords = crewOrders(crew, session);
  let gross = 0,
    yieldScu = 0;
  ords.forEach(o => {
    if (!unrealised(o)) {
      gross += grossOf(o);
      yieldScu += o.ores.reduce((a, x) => a + x[2], 0);
    }
  });
  return {
    orders: ords.length,
    gross,
    yieldScu,
    members: (crew.members || []).length
  };
}
window.OPS = {
  ORE,
  oreColor,
  WO_TYPE,
  WO_CATEGORY,
  WO_STATUS,
  SESSION_STATUS,
  WORK_SESSIONS,
  moneyFmt,
  moneyAbbr,
  unrealised,
  grossOf,
  scuOf,
  expensesOf,
  payoutOf,
  sessionTotals,
  estGrossOf,
  sessionPayout,
  REFINERY_TERMINALS,
  REFINERY_METHODS,
  REFINERY_BATCHES,
  REF_STATUS,
  batchInputScu,
  batchYieldScu,
  batchValue,
  TREASURY_ACCOUNTS,
  TX_TYPE,
  TX_STATUS,
  TREASURY_TX,
  PAYOUT_REQUESTS,
  accountById,
  CREW_TYPE,
  crewOrders,
  crewRollup
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/data-ops.jsx", error: String((e && e.message) || e) }); }

// app-v2/data.jsx
try { (() => {
/* ============================================================
   STATION APP — shared mock data (Star Citizen flavoured)
   Exposed on window for the screen component files.
   ============================================================ */

// ---- current user / org context ----------------------------
const CURRENT_USER = {
  username: 'vanta',
  firstName: 'Mara',
  lastName: 'Vex',
  email: 'mara.vex@gitaddremote.com',
  phone: '+1 555 0142',
  initial: 'M',
  bio: "Lead hauler & refinery lead for Deepwater Syndicate. I fly a C2 Hercules and an MOLE — if it needs moving or mining, I'm your pilot. Stanton-based, UTC-6.",
  rank: 'Member'
};
const ORGS = [{
  id: 'dws',
  name: 'Deepwater Syndicate',
  tag: 'DWS',
  role: 'Director',
  members: 142,
  primary: true
}, {
  id: 'rdb',
  name: 'Red Banner Mining Co.',
  tag: 'RB',
  role: 'Refinery Lead',
  members: 58
}, {
  id: 'aeg',
  name: 'Aegis Vanguard',
  tag: 'AV',
  role: 'Member',
  members: 311
}];

// ---- dashboard portlets ------------------------------------
const INVITATIONS = [{
  org: 'Stanton Freight Union',
  tag: 'SF',
  role: 'Hauler'
}, {
  org: 'Crusader Salvage',
  tag: 'CS',
  role: 'Salvager'
}];

// ---- inventory ---------------------------------------------
// catalog kinds: item · commodity · vehicle ; quality 0–1000
const INVENTORY = [{
  name: 'Quantanium',
  kind: 'commodity',
  cat: 'Ore › Refined',
  qty: '128.40',
  uom: 'SCU',
  quality: 982,
  qcount: 2,
  loc: 'ARC-L1 Refinery',
  locs: 3,
  updated: '2h ago'
}, {
  name: 'Laranite',
  kind: 'commodity',
  cat: 'Ore › Refined',
  qty: '64.00',
  uom: 'SCU',
  quality: 714,
  qcount: 1,
  loc: 'Port Olisar',
  locs: 1,
  updated: '6h ago'
}, {
  name: 'C2 Hercules Star Lifter',
  kind: 'vehicle',
  cat: 'Ships › Cargo',
  qty: '1',
  uom: 'unit',
  quality: null,
  qcount: 0,
  loc: 'Lorville · A18',
  locs: 1,
  updated: 'yesterday'
}, {
  name: 'Size 3 Quantum Drive',
  kind: 'item',
  cat: 'Components › Drives',
  qty: '4',
  uom: 'unit',
  quality: 640,
  qcount: 4,
  loc: 'ARC-L1 Hangar',
  locs: 2,
  updated: '3d ago'
}, {
  name: 'Medical Supplies',
  kind: 'commodity',
  cat: 'Cargo › Medical',
  qty: '22.00',
  uom: 'SCU',
  quality: 500,
  qcount: 1,
  loc: 'Grim HEX',
  locs: 1,
  updated: '3d ago'
}, {
  name: 'Titanium',
  kind: 'commodity',
  cat: 'Ore › Raw',
  qty: '310.00',
  uom: 'SCU',
  quality: 410,
  qcount: 5,
  loc: 'CRU-L5',
  locs: 4,
  updated: '4d ago'
}, {
  name: 'Ballistic Gatling',
  kind: 'item',
  cat: 'Components › Weapons',
  qty: '6',
  uom: 'unit',
  quality: 720,
  qcount: 3,
  loc: 'ARC-L1 Hangar',
  locs: 1,
  updated: '5d ago'
}, {
  name: 'Agricium',
  kind: 'commodity',
  cat: 'Ore › Refined',
  qty: '47.00',
  uom: 'SCU',
  quality: 880,
  qcount: 2,
  loc: 'Area18',
  locs: 2,
  updated: '1w ago'
}];
const INVENTORY_SUBROWS = {
  'Quantanium': [{
    loc: 'ARC-L1 Refinery',
    qty: '88.40',
    quality: 982,
    updated: '2h ago'
  }, {
    loc: 'Port Tressler',
    qty: '24.00',
    quality: 940,
    updated: '1d ago'
  }, {
    loc: 'CRU-L1',
    qty: '16.00',
    quality: 902,
    updated: '2d ago'
  }],
  'Titanium': [{
    loc: 'CRU-L5',
    qty: '120.00',
    quality: 410,
    updated: '4d ago'
  }, {
    loc: 'ARC-L1',
    qty: '90.00',
    quality: 388,
    updated: '5d ago'
  }, {
    loc: 'Lorville',
    qty: '60.00',
    quality: 365,
    updated: '6d ago'
  }, {
    loc: 'HUR-L2',
    qty: '40.00',
    quality: 350,
    updated: '1w ago'
  }]
};
const INVENTORY_CATEGORIES = ['All categories', 'Ore › Raw', 'Ore › Refined', 'Components › Drives', 'Components › Weapons', 'Cargo › Medical', 'Ships › Cargo'];
const ORG_INV_SUMMARY = {
  totalItems: 1284,
  totalQuantity: '9,420.6',
  cat1: {
    name: 'Ore › Refined',
    qty: '4,180.0'
  },
  cat2: {
    name: 'Components',
    qty: '612'
  }
};

// ---- contracts ---------------------------------------------
// types: transport transfer mining security salvage medical refueling
// status: draft open claimed active completed disputed cancelled
const CONTRACTS = [{
  id: 'c1',
  title: 'Quantanium run — ARC-L1 → Area18',
  type: 'transport',
  status: 'open',
  risk: 'high',
  reward: '420000',
  deadline: 4,
  claimedBy: '—',
  ownedBy: 'Mara',
  cargo: 'Refined Quantanium',
  scu: '96',
  pickup: 'ARC-L1 Refinery',
  delivery: 'Area18 TDD',
  brief: 'Time-critical haul of refined Quantanium before market decay. Escort recommended — recent piracy on the A18 lane.',
  milestones: [['Cargo loaded at ARC-L1', 'completed'], ['In transit', 'in_progress'], ['Delivered & sold', 'pending']]
}, {
  id: 'c2',
  title: 'Escort convoy — Daymar loop',
  type: 'security',
  status: 'active',
  risk: 'medium',
  reward: '180000',
  deadline: 22,
  claimedBy: 'Rook',
  ownedBy: 'Mara',
  detail: {
    'Mission kind': 'Escort',
    'Threat level': 'Medium',
    'Head count': '3'
  },
  brief: 'Two-ship convoy needs armed escort on the Daymar mining loop. Expect light interdiction.',
  milestones: [['Rally at CRU-L1', 'completed'], ['Convoy underway', 'in_progress'], ['Safe arrival', 'pending']]
}, {
  id: 'c3',
  title: 'Mine Quantanium — Yela belt',
  type: 'mining',
  status: 'open',
  risk: 'high',
  reward: '650000',
  deadline: 50,
  claimedBy: '—',
  ownedBy: 'Korr',
  detail: {
    'Target system': 'Stanton',
    'Target body': 'Yela',
    'Resource type': 'Quantanium',
    'Target SCU': '120',
    'Mining method': 'Ship'
  },
  brief: 'Full MOLE crew wanted to fill a 120 SCU quota of raw Quantanium from the Yela asteroid belt.',
  milestones: [['Crew assembled', 'pending'], ['Quota mined', 'pending'], ['Delivered to refinery', 'pending']]
}, {
  id: 'c4',
  title: 'Salvage derelict Reclaimer',
  type: 'salvage',
  status: 'claimed',
  risk: 'medium',
  reward: '240000',
  deadline: 70,
  claimedBy: 'Vex',
  ownedBy: 'Deepwater',
  detail: {
    'Target location': 'Derelict Reclaimer, Yela orbit',
    'SCU estimate': '60',
    'Salvage kind': 'Wreck salvage'
  },
  brief: 'Hull-stripping contract on a derelict Reclaimer. Bring a Vulture or Reclaimer of your own.',
  milestones: [['Site located', 'completed'], ['Munching hull', 'pending'], ['RMC delivered', 'pending']]
}, {
  id: 'c5',
  title: 'Transfer med supplies to Grim HEX',
  type: 'transfer',
  status: 'completed',
  risk: 'low',
  reward: '0',
  deadline: null,
  claimedBy: 'Sable',
  ownedBy: 'Mara',
  brief: 'Internal donation transfer — no reward. Move 22 SCU of medical supplies to the Grim HEX clinic.',
  milestones: [['Handoff scheduled', 'completed'], ['Delivered', 'completed']]
}, {
  id: 'c6',
  title: 'Medical rescue standby — Cellin',
  type: 'medical',
  status: 'open',
  risk: 'low',
  reward: '90000',
  deadline: 120,
  claimedBy: '—',
  ownedBy: 'Aegis',
  detail: {
    'Service kind': 'Rescue',
    'Location': 'Cellin surface',
    'Patient count': '2'
  },
  brief: 'On-call Cutlass Red standby for a surface mining op. Pays on completion of the op window.',
  milestones: [['On station', 'pending'], ['Window cleared', 'pending']]
}, {
  id: 'c7',
  title: 'Refuel staging — CRU-L1',
  type: 'refueling',
  status: 'disputed',
  risk: 'medium',
  reward: '60000',
  deadline: -3,
  claimedBy: 'Juno',
  ownedBy: 'Mara',
  detail: {
    'Fuel type': 'Quantum',
    'SCU required': '40',
    'Location': 'Near CRU-L1'
  },
  brief: 'Quantum refuel for a staging fleet. Disputed — quantity delivered is contested.',
  milestones: [['Tanker dispatched', 'completed'], ['Refuel complete', 'in_progress']]
}];
const CONTRACT_TYPE_FILTERS = ['all', 'transport', 'security', 'mining', 'salvage', 'transfer', 'medical', 'refueling'];

// ---- members ------------------------------------------------
const MEMBERS = [{
  name: 'Mara Vex',
  username: 'vanta',
  role: 'Director',
  unit: 'Command',
  joined: 'Jan 4, 2949',
  discord: true,
  active: true,
  email: 'mara.vex@gitaddremote.com'
}, {
  name: 'Rook Calder',
  username: 'rook',
  role: 'Officer',
  unit: 'Security › Alpha Squadron',
  joined: 'Feb 18, 2949',
  discord: true,
  active: true,
  email: 'rook@dws.org'
}, {
  name: 'Sable Ng',
  username: 'sable',
  role: 'Logistics',
  unit: 'Logistics › Hauling',
  joined: 'Mar 2, 2949',
  discord: true,
  active: true,
  email: 'sable@dws.org'
}, {
  name: 'Korr Vaeth',
  username: 'korr',
  role: 'Miner',
  unit: 'Industry › Mining',
  joined: 'Mar 19, 2949',
  discord: false,
  active: true,
  email: 'korr@dws.org'
}, {
  name: 'Juno Reyes',
  username: 'juno',
  role: 'Refueler',
  unit: 'Logistics › Fuel',
  joined: 'Apr 1, 2949',
  discord: true,
  active: false,
  email: 'juno@dws.org'
}, {
  name: 'Tessa Brandt',
  username: 'tess',
  role: 'Medic',
  unit: 'Medical',
  joined: 'Apr 11, 2949',
  discord: true,
  active: true,
  email: 'tess@dws.org'
}, {
  name: 'Dex Marrow',
  username: 'dex',
  role: 'Recruit',
  unit: null,
  joined: 'May 2, 2949',
  discord: false,
  active: true,
  email: 'dex@dws.org'
}];

// ---- business units (tree) ---------------------------------
const BUSINESS_UNITS = [{
  name: 'Command',
  kind: 'division',
  desc: 'Org leadership & strategy',
  children: [{
    name: 'Operations',
    kind: 'department',
    desc: 'Day-to-day op coordination',
    children: []
  }]
}, {
  name: 'Industry',
  kind: 'division',
  desc: 'Mining, refining & salvage',
  children: [{
    name: 'Mining',
    kind: 'department',
    desc: 'Ore extraction',
    children: [{
      name: 'Alpha Dig Team',
      kind: 'squad',
      desc: 'ROC & ship mining',
      children: []
    }]
  }, {
    name: 'Refining',
    kind: 'department',
    desc: 'Refinery management',
    children: []
  }]
}, {
  name: 'Logistics',
  kind: 'division',
  desc: 'Hauling, trade & fuel',
  children: [{
    name: 'Hauling',
    kind: 'department',
    desc: 'Cargo runs',
    children: []
  }, {
    name: 'Fuel',
    kind: 'team',
    desc: 'Refueling support',
    children: []
  }]
}, {
  name: 'Security',
  kind: 'division',
  desc: 'Escort & defense',
  children: [{
    name: 'Alpha Squadron',
    kind: 'squad',
    desc: 'Primary escort wing',
    children: []
  }]
}, {
  name: 'Medical',
  kind: 'department',
  desc: 'Rescue & trauma support',
  children: []
}];

// ---- admin invites -----------------------------------------
const INVITES = [{
  token: 'a3f91c08',
  created: 'Jun 10, 2949',
  expires: 'Jun 24, 2949',
  status: 'Pending',
  usedBy: '—'
}, {
  token: '7b2e44d1',
  created: 'Jun 8, 2949',
  expires: 'Jun 22, 2949',
  status: 'Used',
  usedBy: 'dex'
}, {
  token: 'c19a07ff',
  created: 'Jun 1, 2949',
  expires: 'Jun 15, 2949',
  status: 'Expired',
  usedBy: '—'
}, {
  token: 'e58013ab',
  created: 'May 28, 2949',
  expires: 'Jun 11, 2949',
  status: 'Revoked',
  usedBy: '—'
}];

// ---- notifications -----------------------------------------
// kind drives icon + colour; actor = who prompted it (null = system).
// unread, high (priority), bucket (time group), target (deep-link label),
// actions (inline approve/decline etc).
const NOTIFICATIONS = [{
  id: 'nt1',
  kind: 'treasury',
  actor: 'Korr Vaeth',
  verb: 'requested a payout',
  body: '120,000 aUEC — reimbursement for “Yela belt fuel + hull repairs”.',
  target: 'Treasury · Operating account',
  nav: 'treasury',
  time: '4m',
  bucket: 'today',
  unread: true,
  high: true,
  actions: [{
    id: 'approve',
    label: 'Approve',
    tone: 'primary'
  }, {
    id: 'review',
    label: 'Review',
    tone: 'ghost'
  }]
}, {
  id: 'nt2',
  kind: 'session',
  actor: 'Rook Calder',
  verb: 'closed the work session',
  body: '“Aaron Halo — Saturday Op” is settled. Your crew share of 312,400 aUEC is ready to confirm.',
  target: 'Work Sessions · WS-118',
  nav: 'sessions',
  time: '22m',
  bucket: 'today',
  unread: true,
  high: false,
  actions: [{
    id: 'confirm',
    label: 'Confirm payout',
    tone: 'primary'
  }]
}, {
  id: 'nt3',
  kind: 'refinery',
  actor: null,
  verb: 'Refinery batch ready',
  body: 'Quantanium batch RB-204 finished refining at ARC-L1 — 103 SCU yielded (78%). Ready to collect.',
  target: 'Refinery · RB-204',
  nav: 'refinery',
  time: '1h',
  bucket: 'today',
  unread: true,
  high: false,
  actions: [{
    id: 'collect',
    label: 'Mark collected',
    tone: 'ghost'
  }]
}, {
  id: 'nt4',
  kind: 'mention',
  actor: 'Sable Ng',
  verb: 'mentioned you',
  body: '“@vanta can you take the lead seller slot on this one? I’m off after the next run.”',
  target: 'WO-3041 · Aaron Halo dragline',
  nav: 'sessions',
  time: '2h',
  bucket: 'today',
  unread: true,
  high: false
}, {
  id: 'nt5',
  kind: 'contract',
  actor: 'Rook Calder',
  verb: 'claimed your contract',
  body: 'Escort convoy — Daymar loop. Rook is standing by for the rally at CRU-L1.',
  target: 'Contracts · Escort convoy',
  nav: 'contracts',
  time: '5h',
  bucket: 'today',
  unread: false,
  high: false
}, {
  id: 'nt6',
  kind: 'member',
  actor: 'Dex Marrow',
  verb: 'requested to join',
  body: 'Dex Marrow applied to Deepwater Syndicate as a Recruit via invite a3f91c08.',
  target: 'Members · Join requests',
  nav: 'members',
  time: 'Yesterday',
  bucket: 'week',
  unread: false,
  high: false,
  actions: [{
    id: 'admit',
    label: 'Admit',
    tone: 'primary'
  }, {
    id: 'decline',
    label: 'Decline',
    tone: 'ghost'
  }]
}, {
  id: 'nt7',
  kind: 'fleet',
  actor: 'Juno Reyes',
  verb: 'returned a loaned ship',
  body: 'C2 Hercules Star Lifter checked back in at Lorville · A18. No damage reported.',
  target: 'Fleet · C2 Hercules',
  nav: 'fleet',
  time: 'Yesterday',
  bucket: 'week',
  unread: false,
  high: false
}, {
  id: 'nt8',
  kind: 'contract',
  actor: 'Juno Reyes',
  verb: 'disputed a contract',
  body: 'Refuel staging — CRU-L1 is contested: delivered quantity does not match the agreed 40 SCU.',
  target: 'Contracts · Refuel staging',
  nav: 'contracts',
  time: '2d ago',
  bucket: 'week',
  unread: false,
  high: true,
  actions: [{
    id: 'resolve',
    label: 'Open dispute',
    tone: 'ghost'
  }]
}, {
  id: 'nt9',
  kind: 'refinery',
  actor: null,
  verb: 'Refinery job failed',
  body: 'Wala ring batch was lost — ship destroyed before submission. An insurance claim was filed automatically.',
  target: 'Refinery · RB-198',
  nav: 'refinery',
  time: '3d ago',
  bucket: 'week',
  unread: false,
  high: false
}, {
  id: 'nt10',
  kind: 'member',
  actor: 'Tessa Brandt',
  verb: 'was promoted',
  body: 'Tessa Brandt is now an Officer in Medical. You approved this change.',
  target: 'Members · Tessa Brandt',
  nav: 'members',
  time: '4d ago',
  bucket: 'week',
  unread: false,
  high: false
}, {
  id: 'nt11',
  kind: 'system',
  actor: null,
  verb: 'New sign-in to your account',
  body: 'A new session started from a Windows device near Stanton-West. If this wasn’t you, secure your account.',
  target: 'Security · Active sessions',
  nav: 'profile',
  time: '5d ago',
  bucket: 'older',
  unread: false,
  high: false,
  actions: [{
    id: 'secure',
    label: 'Review devices',
    tone: 'ghost'
  }]
}];
Object.assign(window, {
  CURRENT_USER,
  ORGS,
  INVITATIONS,
  INVENTORY,
  INVENTORY_SUBROWS,
  INVENTORY_CATEGORIES,
  ORG_INV_SUMMARY,
  CONTRACTS,
  CONTRACT_TYPE_FILTERS,
  MEMBERS,
  BUSINESS_UNITS,
  INVITES,
  NOTIFICATIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/data.jsx", error: String((e && e.message) || e) }); }

// app-v2/helpers.jsx
try { (() => {
/* ============================================================
   STATION APP — shared helpers (formatters + icon maps)
   ============================================================ */

// contract type → icon
const CT_ICON = {
  transport: 'truck',
  transfer: 'article',
  mining: 'diamond',
  security: 'security',
  salvage: 'recycling',
  medical: 'medical',
  refueling: 'gas'
};
// contract type → tint class (from Contracts.css)
const CT_CLASS = {
  transport: 'ct-transport',
  transfer: 'ct-transfer',
  mining: 'ct-mining',
  security: 'ct-security',
  salvage: 'ct-salvage',
  medical: 'ct-medical',
  refueling: 'ct-refueling'
};
const CT_LABEL = {
  transport: 'Transport',
  transfer: 'Transfer',
  mining: 'Mining',
  security: 'Security',
  salvage: 'Salvage',
  medical: 'Medical',
  refueling: 'Refueling'
};
// status → chip class + label
const STATUS_META = {
  draft: {
    chip: 'neutral',
    label: 'Draft'
  },
  open: {
    chip: 'brand',
    label: 'Open'
  },
  claimed: {
    chip: 'neutral',
    label: 'Claimed'
  },
  active: {
    chip: 'warm',
    label: 'In progress'
  },
  completed: {
    chip: 'success',
    label: 'Completed'
  },
  disputed: {
    chip: 'warm',
    label: 'Disputed'
  },
  cancelled: {
    chip: 'neutral',
    label: 'Cancelled'
  }
};
const RISK_META = {
  low: {
    cls: 'risk-low',
    label: 'Low'
  },
  medium: {
    cls: 'risk-med',
    label: 'Medium'
  },
  high: {
    cls: 'risk-high',
    label: 'High'
  }
};
// inventory kind → icon
const KIND_ICON = {
  item: 'box',
  commodity: 'layers',
  vehicle: 'fleet'
};

// inventory category → icon + contract-style tint class (reuses .big-ic.ct-* colors)
const INV_CAT = {
  'Ore › Raw': {
    icon: 'pickaxe',
    cls: 'ct-transport'
  },
  'Ore › Refined': {
    icon: 'diamond',
    cls: 'ct-mining'
  },
  'Components › Drives': {
    icon: 'settings',
    cls: 'ct-transfer'
  },
  'Components › Weapons': {
    icon: 'crosshair',
    cls: 'ct-security'
  },
  'Cargo › Medical': {
    icon: 'medical',
    cls: 'ct-medical'
  },
  'Ships › Cargo': {
    icon: 'fleet',
    cls: 'ct-salvage'
  }
};
function invCatMeta(cat) {
  if (INV_CAT[cat]) return INV_CAT[cat];
  const stem = String(cat || '').split('›')[0].trim();
  const byStem = {
    Ore: 'ct-mining',
    Components: 'ct-transfer',
    Cargo: 'ct-medical',
    Ships: 'ct-salvage'
  };
  return {
    icon: 'box',
    cls: byStem[stem] || 'ct-refueling'
  };
}
function fmtAuec(val) {
  if (val == null || val === '') return '—';
  const n = parseFloat(val);
  if (n === 0) return '0';
  if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1e3) return Math.round(n / 1e3) + 'K';
  return Math.round(n).toLocaleString();
}
function fmtDeadline(h) {
  if (h == null) return {
    text: 'None set',
    urgent: false
  };
  if (h < 0) return {
    text: 'Overdue',
    urgent: true
  };
  if (h < 6) return {
    text: h + 'h left',
    urgent: true
  };
  if (h < 24) return {
    text: h + 'h left',
    urgent: false
  };
  return {
    text: Math.floor(h / 24) + 'd left',
    urgent: false
  };
}
Object.assign(window, {
  CT_ICON,
  CT_CLASS,
  CT_LABEL,
  STATUS_META,
  RISK_META,
  KIND_ICON,
  INV_CAT,
  invCatMeta,
  fmtAuec,
  fmtDeadline
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/helpers.jsx", error: String((e && e.message) || e) }); }

// app-v2/icons.jsx
try { (() => {
/* ============================================================
   STATION APP — icon set (Lucide-style inline SVG)
   <Icon name="contracts" /> · stroke inherits currentColor.
   ============================================================ */
const ICON_PATHS = {
  dashboard: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  contracts: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
  members: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  tree: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2h12v2"/>',
  refinery: '<path d="M2 20h20M4 20V9l5 3V9l5 3V5l5 3v12"/><path d="M9 20v-4M14 20v-4"/>',
  pickaxe: '<path d="M14.5 3.5a6 6 0 0 0-6 6M20.5 9.5a6 6 0 0 0-6-6M13 11l-9 9M11 13l2-2"/>',
  fleet: '<path d="M12 2 4 7v6c0 4 3.5 7 8 9 4.5-2 8-5 8-9V7z"/><path d="M9 12l2 2 4-4"/>',
  inventory: '<path d="M21 8V21H3V8M1 3h22v5H1zM10 12h4"/>',
  treasury: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  command: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5 19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/>',
  keyboard: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5 18 10l3-3-2.5-2.5z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 14 0v1"/>',
  article: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  circleDot: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  play: '<path d="M6 4l14 8-14 8z"/>',
  coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82"/>',
  business: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
  diamond: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3 6 9l6 12 6-12-3-6"/>',
  recycling: '<path d="M7 19H4a2 2 0 0 1-1.7-3l1.5-2.5M9.3 5.7 11 3l2.5 4.2M17 8l3 5a2 2 0 0 1-1.7 3H14"/>',
  medical: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M12 10v6M9 13h6M9 6V4h6v2"/>',
  gas: '<path d="M3 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18M2 22h13M13 8h3a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9l-3-3"/>',
  truck: '<path d="M10 17h4V5H2v12h3M20 17h2v-5l-3-4h-5v9h1"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
  security: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  sort: '<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 6v14"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  dots: '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/>',
  split: '<path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7"/>',
  grip: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  trendUp: '<path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  building: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/><path d="M9 9v.01M9 12v.01M9 15v.01"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  alertTriangle: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  // ---- industry / refinery / work orders ----
  factory: '<path d="M2 20h20M4 20V9l5 3V9l5 3V5l5 3v12"/><path d="M9 20v-4M14 20v-4"/>',
  beaker: '<path d="M9 3h6M10 3v6.5L4.6 19A2 2 0 0 0 6.4 22h11.2a2 2 0 0 0 1.8-3L14 9.5V3"/><path d="M7.5 16h9"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  droplet: '<path d="M12 2.7 17 7.7a7 7 0 1 1-10 0z"/>',
  loader: '<path d="M12 2v4M12 18v4M5 5l2.5 2.5M16.5 16.5 19 19M2 12h4M18 12h4M5 19l2.5-2.5M16.5 7.5 19 5"/>',
  packageCheck: '<path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  badgeCheck: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/><path d="m9 12 2 2 4-4"/>',
  circleDashed: '<path d="M10.1 2.2a10 10 0 0 1 3.8 0M17.6 3.7a10 10 0 0 1 2.7 2.7M21.8 10.1a10 10 0 0 1 0 3.8M20.3 17.6a10 10 0 0 1-2.7 2.7M13.9 21.8a10 10 0 0 1-3.8 0M6.4 20.3a10 10 0 0 1-2.7-2.7M2.2 13.9a10 10 0 0 1 0-3.8M3.7 6.4a10 10 0 0 1 2.7-2.7"/>',
  circleX: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
  scanLine: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
  gauge: '<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/><circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  // ---- finance / treasury ----
  handCoins: '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
  gavel: '<path d="m14 12-8.4 8.4a2 2 0 1 1-2.8-2.8L11 9"/><path d="m9.5 6.5 8 8M6.8 9.2l6 6M14 4l6 6"/>',
  scale: '<path d="M12 3v18M7 21h10"/><path d="M6 8 2 14h8zM18 8l-4 6h8z"/><path d="m6 8 6-2 6 2"/>',
  landmark: '<path d="M3 22h18M5 22V11M19 22V11M3 11h18L12 4z"/><path d="M9 22v-7M15 22v-7"/>',
  piggyBank: '<path d="M19 11a8 8 0 0 1-1 4 3 3 0 0 1-1 2.5V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.5H10V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2a4 4 0 0 1-2-3.5C4 11 7 9 12 9c1.2 0 2.3.1 3.3.4M16 11h.01M2 12h2"/><path d="M15 5.5A3 3 0 0 0 12 8"/>',
  gitBranch: '<path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  trendDown: '<path d="m23 18-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  arrowDownLeft: '<path d="M17 7 7 17M17 17H7V7"/>',
  arrowUpRight: '<path d="M7 17 17 7M7 7h10v10"/>',
  arrowLeftRight: '<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
  arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  // ---- fleet / ships ----
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  crosshair: '<circle cx="12" cy="12" r="9"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.3 5.3l-6 6a2.1 2.1 0 0 0 3 3l6-6a4 4 0 0 0 5.3-5.3l-2.7 2.7-2.3-.7-.7-2.3z"/>',
  navigation: '<path d="m3 11 19-9-9 19-2-8-8-2z"/>',
  warehouse: '<path d="M3 21V8.5L12 4l9 4.5V21"/><path d="M3 21h18M7 21v-7h10v7M7 14h10"/>',
  container: '<path d="M21 8V21H3V8M1 3h22v5H1zM10 11h4"/>',
  anchor: '<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/>',
  cross: '<path d="M12 6v12M6 12h12"/>',
  blueprint: '<path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z"/><path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/><path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
  hammer: '<path d="m15 12-8.4 8.4a2 2 0 0 1-2.8-2.8L12 9"/><path d="m18 15 4-4M14.5 5.5 18 9l3-3-3.5-3.5a2.1 2.1 0 0 0-3 0L12 5z"/>',
  userRound: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  userCheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  rotateCcw: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  messageCircle: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8z"/><path d="M7 7h.01"/>',
  mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  pencil: '<path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>'
};
function Icon({
  name,
  size = 18,
  style,
  className,
  fill = 'none'
}) {
  const d = ICON_PATHS[name] || '';
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    style,
    dangerouslySetInnerHTML: {
      __html: d
    }
  });
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/icons.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-blueprints.jsx
try { (() => {
/* ============================================================
   STATION APP — Blueprints (v1.0)
   A blueprint is a learned crafting recipe (not a physical item).
   Two views:
     • My Library — the blueprints I personally hold; I choose
       which to publish to the org.
     • Org Library — (directors+) every blueprint members have
       published, with who holds each so leadership can ask a
       holder to craft for the org.
   Detail slide-out (materials · holders · share) + register
   modal. Every modify/destructive action gated by confirmAction().
   ============================================================ */
(() => {
  const ME = 'Mara Vex';
  const ORG = 'Deepwater Syndicate';
  const IS_DIRECTOR = true; // current user has director access
  const members = ['Mara Vex', 'Rook Calder', 'Sable Ng', 'Korr Vaeth', 'Juno Reyes', 'Tessa Brandt', 'Dex Marrow'];
  const fmt = n => Math.round(Number(n) || 0).toLocaleString('en-US');
  function Pill({
    tone,
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + (tone || 'neutral')
    }, icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 11
    }), children);
  }

  /* category → icon + tint (mirrors contracts .ct-* / fleet .fr-*) */
  const CAT = {
    weapon: {
      icon: 'crosshair',
      label: 'Weapon',
      cls: 'bp-weapon'
    },
    armor: {
      icon: 'shield',
      label: 'Armor',
      cls: 'bp-armor'
    },
    component: {
      icon: 'cpu',
      label: 'Ship Component',
      cls: 'bp-component'
    },
    consumable: {
      icon: 'beaker',
      label: 'Consumable',
      cls: 'bp-consumable'
    },
    tool: {
      icon: 'wrench',
      label: 'Tool',
      cls: 'bp-tool'
    },
    vehicle: {
      icon: 'rocket',
      label: 'Vehicle Item',
      cls: 'bp-vehicle'
    }
  };
  const CAT_OPTS = Object.keys(CAT);
  /* grade → rarity tone */
  const GRADE = {
    Civilian: {
      tone: 'neutral',
      dot: 'var(--text-muted)'
    },
    Industrial: {
      tone: 'info',
      dot: 'var(--aqua-300)'
    },
    Military: {
      tone: 'danger',
      dot: 'var(--coral-400)'
    },
    Stellar: {
      tone: 'violet',
      dot: '#C0ADFB'
    }
  };
  const GRADE_OPTS = Object.keys(GRADE);

  /* ---- mock blueprints. holders: [{member, shared, acquired}] ---- */
  const BP0 = [{
    id: 'BP-2201',
    name: 'Ballistic Gatling — Mk3',
    cat: 'weapon',
    grade: 'Military',
    time: 6,
    source: 'Contested-zone reward',
    materials: [['Tungsten', 18], ['Titanium', 12], ['Processed Goods', 6]],
    holders: [{
      member: 'Mara Vex',
      shared: true,
      acquired: 'Mar 2949'
    }, {
      member: 'Korr Vaeth',
      shared: true,
      acquired: 'Apr 2949'
    }]
  }, {
    id: 'BP-2202',
    name: 'FS-9 LMG — Custom',
    cat: 'weapon',
    grade: 'Industrial',
    time: 3,
    source: 'Crafting research',
    materials: [['Aluminum', 14], ['Titanium', 8]],
    holders: [{
      member: 'Rook Calder',
      shared: true,
      acquired: 'Feb 2949'
    }]
  }, {
    id: 'BP-2203',
    name: 'Pembroke Heavy Armor',
    cat: 'armor',
    grade: 'Military',
    time: 5,
    source: 'Mission reward',
    materials: [['Titanium', 20], ['Polymers', 10], ['Quartzite', 4]],
    holders: [{
      member: 'Sable Ng',
      shared: true,
      acquired: 'Jan 2949'
    }, {
      member: 'Mara Vex',
      shared: false,
      acquired: 'May 2949'
    }]
  }, {
    id: 'BP-2204',
    name: 'Morozov-SH Undersuit',
    cat: 'armor',
    grade: 'Civilian',
    time: 2,
    source: 'Shop schematic',
    materials: [['Polymers', 8], ['Fibers', 6]],
    holders: [{
      member: 'Tessa Brandt',
      shared: true,
      acquired: 'Apr 2949'
    }]
  }, {
    id: 'BP-2205',
    name: 'Size 2 Quantum Drive — Bolon',
    cat: 'component',
    grade: 'Industrial',
    time: 8,
    source: 'Exploration cache',
    materials: [['Quantanium', 4], ['Gold', 6], ['Copper', 12]],
    holders: [{
      member: 'Korr Vaeth',
      shared: true,
      acquired: 'Mar 2949'
    }, {
      member: 'Dex Marrow',
      shared: true,
      acquired: 'May 2949'
    }]
  }, {
    id: 'BP-2206',
    name: 'Power Plant — JS-400',
    cat: 'component',
    grade: 'Military',
    time: 7,
    source: 'Salvage research',
    materials: [['Tungsten', 16], ['Copper', 10], ['Diamond', 2]],
    holders: [{
      member: 'Rook Calder',
      shared: true,
      acquired: 'Feb 2949'
    }]
  }, {
    id: 'BP-2207',
    name: 'CureLife MedPen Kit',
    cat: 'consumable',
    grade: 'Civilian',
    time: 1,
    source: 'Medical license',
    materials: [['Compounds', 6], ['Fibers', 4]],
    holders: [{
      member: 'Tessa Brandt',
      shared: true,
      acquired: 'Jan 2949'
    }]
  }, {
    id: 'BP-2208',
    name: 'Mining Laser — Helix II',
    cat: 'tool',
    grade: 'Industrial',
    time: 4,
    source: 'Industry research',
    materials: [['Laranite', 8], ['Titanium', 10], ['Copper', 6]],
    holders: [{
      member: 'Mara Vex',
      shared: true,
      acquired: 'Mar 2949'
    }, {
      member: 'Sable Ng',
      shared: true,
      acquired: 'Apr 2949'
    }]
  }, {
    id: 'BP-2209',
    name: 'Salvage Module — Abrade',
    cat: 'tool',
    grade: 'Industrial',
    time: 4,
    source: 'Reclaimer research',
    materials: [['RMC', 10], ['Aluminum', 8]],
    holders: [{
      member: 'Korr Vaeth',
      shared: true,
      acquired: 'May 2949'
    }]
  }, {
    id: 'BP-2210',
    name: 'Cargo Bracket — S4',
    cat: 'component',
    grade: 'Civilian',
    time: 2,
    source: 'Hauling schematic',
    materials: [['Aluminum', 12], ['Steel', 8]],
    holders: [{
      member: 'Juno Reyes',
      shared: true,
      acquired: 'Apr 2949'
    }]
  }, {
    id: 'BP-2211',
    name: 'Ares Inferno Gun — S7',
    cat: 'weapon',
    grade: 'Stellar',
    time: 12,
    source: 'Rare drop',
    materials: [['Quantanium', 8], ['Diamond', 4], ['Tungsten', 24]],
    holders: [{
      member: 'Mara Vex',
      shared: false,
      acquired: 'Jun 2949'
    }]
  }, {
    id: 'BP-2212',
    name: 'Stealth Coating — Voidskin',
    cat: 'component',
    grade: 'Stellar',
    time: 10,
    source: 'Pyro research',
    materials: [['Riccite', 3], ['Polymers', 14], ['Compounds', 8]],
    holders: [{
      member: 'Dex Marrow',
      shared: true,
      acquired: 'May 2949'
    }]
  }];
  const MAT_OPTS = ['Titanium', 'Tungsten', 'Aluminum', 'Copper', 'Steel', 'Gold', 'Diamond', 'Quantanium', 'Laranite', 'Quartzite', 'Riccite', 'RMC', 'Polymers', 'Compounds', 'Fibers', 'Processed Goods'];

  /* =========================================================
     BLUEPRINT detail drawer
     ========================================================= */
  function BlueprintDrawer({
    bp,
    view,
    onClose,
    onSaved,
    onRemoved,
    onRequest
  }) {
    const [editing, setEditing] = React.useState(false);
    const [form, setForm] = React.useState(bp);
    React.useEffect(() => {
      setForm(bp);
      setEditing(false);
    }, [bp && bp.id]);
    if (!bp) return null;
    const b = editing ? form : bp;
    const c = CAT[b.cat],
      g = GRADE[b.grade];
    const mine = b.holders.find(h => h.member === ME);
    const sharedHolders = b.holders.filter(h => h.shared);
    const set = (k, v) => setForm(f => ({
      ...f,
      [k]: v
    }));
    const save = async () => {
      if (!(await window.confirmAction({
        title: 'Save changes to this blueprint?',
        body: 'Updates the recipe details in your library.',
        confirmLabel: 'Save changes',
        icon: 'save'
      }))) return;
      onSaved(form);
      setEditing(false);
      window.toast('Blueprint updated', 'check');
    };
    const toggleShare = async () => {
      const now = mine && mine.shared;
      if (!(await window.confirmAction({
        title: (now ? 'Unpublish' : 'Publish') + ' “' + b.name + '”?',
        body: now ? 'Directors will no longer see you as a holder of this blueprint.' : 'Directors will see you can craft this and may ask you to make it for the org.',
        confirmLabel: now ? 'Unpublish' : 'Publish to org',
        icon: now ? 'lock' : 'check',
        tone: now ? 'danger' : undefined
      }))) return;
      onSaved({
        ...bp,
        holders: bp.holders.map(h => h.member === ME ? {
          ...h,
          shared: !now
        } : h)
      });
      window.toast(now ? 'Unpublished from org' : 'Published to org', now ? 'lock' : 'check');
    };
    const remove = async () => {
      if (!(await window.confirmAction({
        title: 'Remove “' + b.name + '” from your library?',
        body: 'Drops this blueprint from your personal library. If others hold it, it stays in the org library.',
        confirmLabel: 'Remove blueprint',
        tone: 'danger',
        icon: 'trash'
      }))) return;
      onRemoved(bp);
      onClose();
      window.toast('Blueprint removed', 'trash');
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!bp,
      onClose: onClose,
      width: 460
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, bp.id, " \xB7 Blueprint"), view === 'mine' && mine && !editing && /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: () => setEditing(true),
      title: "Edit",
      "aria-label": "Edit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'd-bigic ' + c.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, editing ? /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: b.name,
      onChange: e => set('name', e.target.value)
    }) : /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, b.name), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "blueprint"
    }), c.label)), /*#__PURE__*/React.createElement("span", {
      className: "chip-badge dot-led",
      style: {
        background: 'color-mix(in srgb, ' + g.dot + ' 16%, transparent)',
        color: g.dot
      }
    }, b.grade)), /*#__PURE__*/React.createElement("div", {
      className: "d-tiles"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "hammer"
    }), " Craft time"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, b.time, /*#__PURE__*/React.createElement("small", null, "hrs"))), /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "members"
    }), " Org holders"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, sharedHolders.length))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Materials to craft"), /*#__PURE__*/React.createElement("span", {
      className: "t-faint"
    }, b.materials.length, " types")), editing ? /*#__PURE__*/React.createElement("div", {
      className: "mat-edit"
    }, b.materials.map((m, i) => /*#__PURE__*/React.createElement("div", {
      className: "mat-edit-row",
      key: i
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: m[0],
      onChange: e => set('materials', b.materials.map((x, j) => j === i ? [e.target.value, x[1]] : x))
    }, MAT_OPTS.map(o => /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o))), /*#__PURE__*/React.createElement("input", {
      className: "fld mat-qty",
      type: "number",
      min: "1",
      value: m[1],
      onChange: e => set('materials', b.materials.map((x, j) => j === i ? [x[0], Math.max(1, +e.target.value)] : x))
    }), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: () => set('materials', b.materials.filter((x, j) => j !== i)),
      "aria-label": "Remove"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 14
    })))), /*#__PURE__*/React.createElement("button", {
      className: "link-btn",
      onClick: () => set('materials', [...b.materials, ['Titanium', 1]])
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 13
    }), " Add material")) : /*#__PURE__*/React.createElement("div", {
      className: "mat-list"
    }, b.materials.map(m => /*#__PURE__*/React.createElement("div", {
      className: "mat-row",
      key: m[0]
    }, /*#__PURE__*/React.createElement("span", {
      className: "mat-nm"
    }, m[0]), /*#__PURE__*/React.createElement("span", {
      className: "mat-qty-v"
    }, "\xD7", m[1]))))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Source"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, editing ? /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: b.source,
      onChange: e => set('source', e.target.value)
    }) : b.source)), editing && /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Grade"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: b.grade,
      onChange: e => set('grade', e.target.value)
    }, GRADE_OPTS.map(o => /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o)))))), view === 'org' && /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Who can craft this \xB7 ", sharedHolders.length)), sharedHolders.map(h => /*#__PURE__*/React.createElement("div", {
      className: "holder-row",
      key: h.member
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: h.member,
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "hr-nm"
    }, h.member, h.member === ME && /*#__PURE__*/React.createElement("span", {
      className: "rr-you"
    }, "You")), /*#__PURE__*/React.createElement("div", {
      className: "hr-sub"
    }, "Since ", h.acquired)), h.member !== ME && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => onRequest(b, h.member)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 13
    }), " Ask to craft")))), view === 'mine' && mine && /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: 'share-state' + (mine.shared ? ' on' : '')
    }, /*#__PURE__*/React.createElement("span", {
      className: "ss-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: mine.shared ? 'badgeCheck' : 'lock',
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "ss-txt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ss-t"
    }, mine.shared ? 'Published to ' + ORG : 'Private to you'), /*#__PURE__*/React.createElement("div", {
      className: "ss-s"
    }, mine.shared ? 'Directors can see you hold this and ask you to craft it.' : 'Only you can see this blueprint.')), /*#__PURE__*/React.createElement("button", {
      className: 'swtch' + (mine.shared ? ' on' : ''),
      role: "switch",
      "aria-checked": mine.shared,
      "aria-label": "Publish to org",
      onClick: toggleShare
    }, /*#__PURE__*/React.createElement("span", {
      className: "knob"
    })))), editing && /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger",
      style: {
        width: '100%',
        justifyContent: 'center'
      },
      onClick: remove
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    }), " Remove from my library"))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => {
        setForm(bp);
        setEditing(false);
      }
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: save
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "save",
      size: 15
    }), " Save changes")) : view === 'mine' && mine ? /*#__PURE__*/React.createElement("button", {
      className: 'btn ' + (mine.shared ? 'btn-ghost' : 'btn-primary'),
      onClick: toggleShare
    }, /*#__PURE__*/React.createElement(Icon, {
      name: mine.shared ? 'lock' : 'check',
      size: 15
    }), " ", mine.shared ? 'Unpublish from org' : 'Publish to org') : view === 'org' && sharedHolders.some(h => h.member !== ME) ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: () => onRequest(b, sharedHolders.find(h => h.member !== ME).member)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 15
    }), " Ask a holder to craft") : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close")));
  }

  /* =========================================================
     REGISTER blueprint modal
     ========================================================= */
  function RegisterBPModal({
    onClose,
    onCreate
  }) {
    const [name, setName] = React.useState('');
    const [cat, setCat] = React.useState('weapon');
    const [grade, setGrade] = React.useState('Industrial');
    const [source, setSource] = React.useState('');
    const [time, setTime] = React.useState(4);
    const [mats, setMats] = React.useState([['Titanium', 8]]);
    const [shared, setShared] = React.useState(true);
    const valid = name.trim() && mats.length > 0;
    const setMat = (i, k, v) => setMats(m => m.map((x, j) => j === i ? k === 0 ? [v, x[1]] : [x[0], v] : x));
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Add “' + name + '” to your library?',
        body: shared ? 'Adds the blueprint and publishes it so the org can see you hold it.' : 'Adds the blueprint privately to your library.',
        confirmLabel: 'Add blueprint',
        icon: 'plus'
      }))) return;
      onCreate({
        name: name.trim(),
        cat,
        grade,
        source: source.trim() || 'Self-logged',
        time: +time,
        materials: mats,
        shared
      });
      onClose();
      window.toast('Blueprint added' + (shared ? ' & published' : ''), 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "Add a blueprint",
      icon: "blueprint",
      onClose: onClose,
      width: 560,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
        className: "modal-inline-toggle"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        checked: shared,
        onChange: e => setShared(e.target.checked)
      }), " Publish to org"), /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }), " Add blueprint"))
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "What it crafts",
      required: true,
      hint: "The item this recipe produces"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      autoFocus: true,
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "e.g. Ballistic Gatling \u2014 Mk3"
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Category",
      required: true
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: 3,
      value: cat,
      onChange: setCat,
      options: CAT_OPTS.map(k => ({
        value: k,
        label: CAT[k].label,
        icon: CAT[k].icon
      }))
    })), /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Grade"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: grade,
      onChange: e => setGrade(e.target.value)
    }, GRADE_OPTS.map(o => /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Craft time"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "1",
      value: time,
      onChange: e => setTime(Math.max(1, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "hrs")))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Source",
      hint: "How you unlocked it"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: source,
      onChange: e => setSource(e.target.value),
      placeholder: "e.g. Contested-zone reward"
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Materials to craft",
      required: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "mat-edit"
    }, mats.map((m, i) => /*#__PURE__*/React.createElement("div", {
      className: "mat-edit-row",
      key: i
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: m[0],
      onChange: e => setMat(i, 0, e.target.value)
    }, MAT_OPTS.map(o => /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o))), /*#__PURE__*/React.createElement("input", {
      className: "fld mat-qty",
      type: "number",
      min: "1",
      value: m[1],
      onChange: e => setMat(i, 1, Math.max(1, +e.target.value))
    }), mats.length > 1 && /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: () => setMats(arr => arr.filter((x, j) => j !== i)),
      "aria-label": "Remove"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 14
    })))), /*#__PURE__*/React.createElement("button", {
      className: "link-btn",
      onClick: () => setMats(m => [...m, ['Titanium', 1]])
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 13
    }), " Add material"))));
  }

  /* =========================================================
     BLUEPRINT card
     ========================================================= */
  function BPCard({
    bp,
    view,
    onOpen
  }) {
    const c = CAT[bp.cat],
      g = GRADE[bp.grade];
    const sharedHolders = bp.holders.filter(h => h.shared);
    const mine = bp.holders.find(h => h.member === ME);
    return /*#__PURE__*/React.createElement("button", {
      className: "bp-card",
      onClick: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      className: "bp-card-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'big-ic ' + c.cls,
      style: {
        width: 40,
        height: 40,
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 18
    })), /*#__PURE__*/React.createElement("span", {
      className: "chip-badge dot-led bp-grade",
      style: {
        background: 'color-mix(in srgb, ' + g.dot + ' 16%, transparent)',
        color: g.dot
      }
    }, bp.grade)), /*#__PURE__*/React.createElement("div", {
      className: "bp-nm"
    }, bp.name), /*#__PURE__*/React.createElement("div", {
      className: "bp-cat"
    }, c.label), /*#__PURE__*/React.createElement("div", {
      className: "bp-foot"
    }, view === 'org' ? /*#__PURE__*/React.createElement("span", {
      className: "bp-holders"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bp-av-stack"
    }, sharedHolders.slice(0, 3).map((h, i) => /*#__PURE__*/React.createElement("span", {
      key: h.member,
      className: "bp-av-mini",
      style: {
        marginLeft: i ? -8 : 0,
        zIndex: 3 - i
      }
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: h.member,
      size: 22
    })))), /*#__PURE__*/React.createElement("span", {
      className: "bp-holdcount"
    }, sharedHolders.length, " ", sharedHolders.length === 1 ? 'holder' : 'holders')) : /*#__PURE__*/React.createElement("span", {
      className: 'bp-share-tag' + (mine && mine.shared ? ' on' : '')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: mine && mine.shared ? 'badgeCheck' : 'lock',
      size: 12
    }), " ", mine && mine.shared ? 'Published' : 'Private'), /*#__PURE__*/React.createElement("span", {
      className: "bp-time"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "hammer",
      size: 12
    }), " ", bp.time, "h")));
  }

  /* =========================================================
     BLUEPRINT table
     ========================================================= */
  function BPTable({
    rows,
    view,
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap",
      style: {
        marginTop: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Blueprints"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Blueprint"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Grade"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Craft"), /*#__PURE__*/React.createElement("th", null, view === 'org' ? 'Who can craft' : 'Status'), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(b => {
      const c = CAT[b.cat],
        g = GRADE[b.grade];
      const sharedHolders = b.holders.filter(h => h.shared);
      const mine = b.holders.find(h => h.member === ME);
      return /*#__PURE__*/React.createElement("tr", {
        key: b.id,
        onClick: () => onOpen(b.id),
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: 'ent-ic big-ic ' + c.cls
      }, /*#__PURE__*/React.createElement(Icon, {
        name: c.icon,
        size: 16
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, b.name), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, b.id, " \xB7 ", b.materials.length, " materials")))), /*#__PURE__*/React.createElement("td", {
        className: "t-muted"
      }, c.label), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        className: "chip-badge dot-led",
        style: {
          background: 'color-mix(in srgb, ' + g.dot + ' 16%, transparent)',
          color: g.dot
        }
      }, b.grade)), /*#__PURE__*/React.createElement("td", {
        className: "num t-mono"
      }, b.time, "h"), /*#__PURE__*/React.createElement("td", null, view === 'org' ? /*#__PURE__*/React.createElement("span", {
        className: "bp-holders"
      }, /*#__PURE__*/React.createElement("span", {
        className: "bp-av-stack"
      }, sharedHolders.slice(0, 3).map((h, i) => /*#__PURE__*/React.createElement("span", {
        key: h.member,
        className: "bp-av-mini",
        style: {
          marginLeft: i ? -8 : 0,
          zIndex: 3 - i
        }
      }, /*#__PURE__*/React.createElement(window.Avatar, {
        name: h.member,
        size: 22
      })))), /*#__PURE__*/React.createElement("span", {
        className: "bp-holdcount"
      }, sharedHolders.length)) : /*#__PURE__*/React.createElement("span", {
        className: 'bp-share-tag' + (mine && mine.shared ? ' on' : '')
      }, /*#__PURE__*/React.createElement(Icon, {
        name: mine && mine.shared ? 'badgeCheck' : 'lock',
        size: 12
      }), " ", mine && mine.shared ? 'Published' : 'Private')), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "list-hint"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open blueprint ", /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "n")), " add ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, rows.length, " blueprints")));
  }

  /* =========================================================
     PAGE
     ========================================================= */
  function BlueprintsScreen() {
    const [bps, setBps] = React.useState(() => BP0.map(b => ({
      ...b,
      holders: b.holders.map(h => ({
        ...h
      }))
    })));
    const [view, setView] = React.useState('mine');
    const [catFilter, setCatFilter] = React.useState('all');
    const [layout, setLayout] = React.useState('table');
    const [q, setQ] = React.useState('');
    const [openId, setOpenId] = React.useState(null);
    const [register, setRegister] = React.useState(false);
    const open = openId ? bps.find(b => b.id === openId) : null;
    React.useEffect(() => {
      const onKey = e => {
        if (e.key === 'n' && !/input|textarea|select/i.test(e.target.tagName) && !document.querySelector('.modal-backdrop') && !document.querySelector('.drawer')) {
          e.preventDefault();
          setRegister(true);
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, []);
    const scoped = view === 'mine' ? bps.filter(b => b.holders.some(h => h.member === ME)) : bps.filter(b => b.holders.some(h => h.shared));
    const visible = scoped.filter(b => (catFilter === 'all' || b.cat === catFilter) && (!q || b.name.toLowerCase().includes(q.toLowerCase())));
    const catCount = cat => scoped.filter(b => cat === 'all' || b.cat === cat).length;
    const myShared = bps.filter(b => {
      const m = b.holders.find(h => h.member === ME);
      return m && m.shared;
    }).length;
    const myTotal = bps.filter(b => b.holders.some(h => h.member === ME)).length;
    const orgUnique = bps.filter(b => b.holders.some(h => h.shared)).length;
    const orgHolders = new Set();
    bps.forEach(b => b.holders.forEach(h => {
      if (h.shared) orgHolders.add(h.member);
    }));
    const stats = view === 'mine' ? [{
      k: 'My blueprints',
      icon: 'blueprint',
      v: myTotal,
      d: 'in your library'
    }, {
      k: 'Published',
      icon: 'badgeCheck',
      v: myShared,
      d: 'visible to the org',
      tone: 'up'
    }, {
      k: 'Private',
      icon: 'lock',
      v: myTotal - myShared,
      d: 'only you can see'
    }, {
      k: 'Craftable items',
      icon: 'hammer',
      v: myTotal,
      d: 'you can produce'
    }] : [{
      k: 'Available blueprints',
      icon: 'blueprint',
      v: orgUnique,
      d: 'published by members'
    }, {
      k: 'Contributing members',
      icon: 'members',
      v: orgHolders.size,
      d: 'sharing recipes',
      tone: 'up'
    }, {
      k: 'Weapons',
      icon: 'crosshair',
      v: bps.filter(b => b.cat === 'weapon' && b.holders.some(h => h.shared)).length,
      d: 'craftable'
    }, {
      k: 'Components',
      icon: 'cpu',
      v: bps.filter(b => b.cat === 'component' && b.holders.some(h => h.shared)).length,
      d: 'craftable'
    }];
    const updateBp = b => setBps(xs => xs.map(x => x.id === b.id ? b : x));
    const removeMine = b => setBps(xs => xs.map(x => x.id === b.id ? {
      ...x,
      holders: x.holders.filter(h => h.member !== ME)
    } : x).filter(x => x.holders.length > 0));
    const create = d => {
      const nb = {
        id: 'BP-' + Math.floor(2213 + Math.random() * 600),
        name: d.name,
        cat: d.cat,
        grade: d.grade,
        time: d.time,
        source: d.source,
        materials: d.materials,
        holders: [{
          member: ME,
          shared: d.shared,
          acquired: 'Just now'
        }]
      };
      setBps(xs => [nb, ...xs]);
    };
    const requestCraft = (b, holder) => {
      window.dispatchEvent(new CustomEvent('station-notify', {
        detail: {
          kind: 'mention',
          actor: ME,
          verb: 'asked you to craft',
          body: '“' + b.name + '” for ' + ORG + ' — you hold this blueprint.',
          target: 'Blueprints · ' + b.id,
          nav: 'blueprints',
          high: true
        }
      }));
      window.toast('Craft request sent to ' + holder, 'send');
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "crumb"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "blueprint"
    }), " Assets ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight"
    }), " Blueprints"), /*#__PURE__*/React.createElement("h1", {
      className: "page-title"
    }, "Blueprints"), /*#__PURE__*/React.createElement("p", {
      className: "page-sub"
    }, "Crafting recipes your members have unlocked. Keep your own library, publish what you\u2019re willing to craft, and let leadership see everything ", ORG, " can make \u2014 and who can make it.")), /*#__PURE__*/React.createElement("div", {
      className: "page-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: () => setRegister(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    }), " Add blueprint ", /*#__PURE__*/React.createElement("span", {
      className: "kbd",
      style: {
        marginLeft: 6
      }
    }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement("div", {
      className: "scope-row"
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "View",
      value: view,
      onChange: v => {
        setView(v);
        setCatFilter('all');
      },
      options: [{
        value: 'mine',
        label: 'My Library',
        icon: 'userRound',
        count: myTotal
      }].concat(IS_DIRECTOR ? [{
        value: 'org',
        label: 'Org Library',
        icon: 'members',
        count: orgUnique
      }] : [])
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement("div", {
      className: "bp-search"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    }), /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Search blueprints\u2026"
    }))), /*#__PURE__*/React.createElement(window.StatStrip, {
      items: stats
    }), view === 'org' && /*#__PURE__*/React.createElement("div", {
      className: "bp-context"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 15
    }), " Directors and above can see every published blueprint and which members hold it \u2014 ask a holder to craft for the org."), /*#__PURE__*/React.createElement("div", {
      className: "toolbar-row",
      style: {
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Filter by category",
      value: catFilter,
      onChange: setCatFilter,
      options: [{
        value: 'all',
        label: 'All',
        count: catCount('all')
      }].concat(CAT_OPTS.filter(c => catCount(c) > 0).map(c => ({
        value: c,
        label: CAT[c].label,
        icon: CAT[c].icon,
        count: catCount(c)
      })))
    }), /*#__PURE__*/React.createElement("div", {
      className: "layout-toggle",
      role: "group",
      "aria-label": "Layout"
    }, /*#__PURE__*/React.createElement("button", {
      className: 'lt-btn' + (layout === 'table' ? ' active' : ''),
      onClick: () => setLayout('table'),
      title: "Table view",
      "aria-pressed": layout === 'table'
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "list",
      size: 16
    })), /*#__PURE__*/React.createElement("button", {
      className: 'lt-btn' + (layout === 'cards' ? ' active' : ''),
      onClick: () => setLayout('cards'),
      title: "Card view",
      "aria-pressed": layout === 'cards'
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "grid",
      size: 16
    })))), visible.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: "blueprint",
      title: view === 'mine' ? 'No blueprints yet' : 'Nothing published here',
      text: view === 'mine' ? 'Add a blueprint you’ve unlocked to start your library and optionally share it with the org.' : 'No members have published a blueprint in this category yet.'
    }) : layout === 'cards' ? /*#__PURE__*/React.createElement("div", {
      className: "bp-grid"
    }, visible.map(b => /*#__PURE__*/React.createElement(BPCard, {
      key: b.id,
      bp: b,
      view: view,
      onOpen: () => setOpenId(b.id)
    }))) : /*#__PURE__*/React.createElement(BPTable, {
      rows: visible,
      view: view,
      onOpen: setOpenId
    }), register && /*#__PURE__*/React.createElement(RegisterBPModal, {
      onClose: () => setRegister(false),
      onCreate: create
    }), open && /*#__PURE__*/React.createElement(BlueprintDrawer, {
      bp: open,
      view: view,
      onClose: () => setOpenId(null),
      onSaved: updateBp,
      onRemoved: removeMine,
      onRequest: requestCraft
    }));
  }
  window.BlueprintsScreen = BlueprintsScreen;
  window.BlueprintsData = {
    list: BP0,
    CAT,
    GRADE,
    ME
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-blueprints.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-contracts.jsx
try { (() => {
/* ============================================================
   STATION APP — Contracts (v0.4.0)
   Stat strip · type segmented filter + status select · data table ·
   slide-in detail drawer (brief, terms, type details, milestones,
   lifecycle actions) · create-contract modal.
   Mirrors src/pages/Contracts.tsx + Contracts.css.
   ============================================================ */

function ContractDrawer({
  c,
  onClose
}) {
  if (!c) return null;
  const st = STATUS_META[c.status];
  const risk = c.risk ? RISK_META[c.risk] : null;
  const dl = fmtDeadline(c.deadline);
  const detailRows = c.type === 'transport' ? [['Pickup', c.pickup], ['Delivery', c.delivery], c.cargo && ['Cargo', c.cargo], c.scu && ['SCU required', c.scu]].filter(Boolean) : Object.entries(c.detail || {});
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "con-drawer open"
  }, /*#__PURE__*/React.createElement("div", {
    className: "con-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "con-detail-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "con-detail-close",
    title: "Edit contract"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "con-detail-close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "con-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'big-ic ' + CT_CLASS[c.type]
  }, /*#__PURE__*/React.createElement(Icon, {
    name: CT_ICON[c.type],
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, /*#__PURE__*/React.createElement("span", null, CT_LABEL[c.type]))), /*#__PURE__*/React.createElement("span", {
    className: 'chip-badge ' + st.chip
  }, st.label)), /*#__PURE__*/React.createElement("div", {
    className: "reward-hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "rk"
  }, "Contract reward"), /*#__PURE__*/React.createElement("div", {
    className: "rv"
  }, fmtAuec(c.reward), /*#__PURE__*/React.createElement("small", null, "aUEC"))), risk && /*#__PURE__*/React.createElement("div", {
    className: "risk-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rk"
  }, "Risk"), /*#__PURE__*/React.createElement("span", {
    className: 'risk-badge ' + risk.cls
  }, risk.label)))), c.brief && /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, "Brief"), /*#__PURE__*/React.createElement("p", {
    className: "con-desc"
  }, c.brief)), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, "Terms"), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 13
  }), " Deadline"), /*#__PURE__*/React.createElement("span", {
    className: 'v' + (dl.urgent ? ' con-urgent' : '')
  }, dl.text)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "business",
    size: 13
  }), " Owned by"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.ownedBy)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "person",
    size: 13
  }), " Claimed by"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.claimedBy))), detailRows.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, "Details"), detailRows.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    className: "kv",
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, v)))), c.milestones && /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, "Progress"), /*#__PURE__*/React.createElement("div", {
    className: "miles"
  }, c.milestones.map(([label, state], i) => /*#__PURE__*/React.createElement("div", {
    className: 'mile ' + state,
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "mk"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: state === 'completed' ? 'check' : state === 'in_progress' ? 'play' : 'circleDot',
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "ml"
  }, label), state === 'in_progress' && /*#__PURE__*/React.createElement("span", {
    className: "mt"
  }, "now"))))), /*#__PURE__*/React.createElement("div", {
    className: "panel-body con-actions"
  }, c.status === 'draft' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, "Publish"), c.status === 'open' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, "Claim contract"), c.status === 'claimed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, "Start contract"), c.status === 'active' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, "Mark complete"), (c.status === 'active' || c.status === 'completed') && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, "Dispute"), c.status === 'disputed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, "Resolve dispute"), c.status !== 'completed' && c.status !== 'cancelled' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Cancel")))), /*#__PURE__*/React.createElement("div", {
    className: "con-drawer-backdrop",
    onClick: onClose
  }));
}
function CreateContractModal({
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "modal-title"
  }, "New contract"), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Title *"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    defaultValue: "Quantanium run \u2014 ARC-L1 \u2192 Area18"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Type *"), /*#__PURE__*/React.createElement("select", {
    className: "field-input",
    defaultValue: "transport"
  }, Object.keys(CT_LABEL).map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, CT_LABEL[t])))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Organization *"), /*#__PURE__*/React.createElement("select", {
    className: "field-input"
  }, ORGS.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.id
  }, o.name)))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Assignee"), /*#__PURE__*/React.createElement("div", {
    className: "assignee-radios"
  }, /*#__PURE__*/React.createElement("label", {
    className: "assignee-radio selected"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "as",
    defaultChecked: true
  }), " Open \u2014 anyone can claim"), /*#__PURE__*/React.createElement("label", {
    className: "assignee-radio"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "as"
  }), " Specific member"), /*#__PURE__*/React.createElement("label", {
    className: "assignee-radio"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "as"
  }), " Division"))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Reward (aUEC)"), /*#__PURE__*/React.createElement("label", {
    className: "donation-toggle"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  }), " Donation \u2014 no reward (amount will be set to 0)"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "number",
    defaultValue: "420000"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Deadline"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "datetime-local"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Pickup location"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    defaultValue: "ARC-L1 Refinery"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Delivery location"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    defaultValue: "Area18 TDD"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Cargo description"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    defaultValue: "Refined Quantanium"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: onClose
  }, "Create contract"))));
}
function ContractsScreen() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selId, setSelId] = useState('c1');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const visible = CONTRACTS.filter(c => (typeFilter === 'all' || c.type === typeFilter) && (statusFilter === 'all' || c.status === statusFilter));
  const sel = drawerOpen ? CONTRACTS.find(c => c.id === selId) : null;
  const open = CONTRACTS.filter(c => c.status === 'open').length;
  const active = CONTRACTS.filter(c => c.status === 'active' || c.status === 'claimed').length;
  const pool = CONTRACTS.filter(c => ['open', 'active', 'claimed'].includes(c.status)).reduce((s, c) => s + parseFloat(c.reward || '0'), 0);
  const done = CONTRACTS.filter(c => c.status === 'completed').length;
  const rowClick = id => {
    if (selId === id && drawerOpen) setDrawerOpen(false);else {
      setSelId(id);
      setDrawerOpen(true);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "article",
    size: 13
  }), " Operations ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 13
  }), " Contracts"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Contracts"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Service contracts across every discipline \u2014 transport, security, mining, and salvage.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setShowCreate(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " New contract"))), /*#__PURE__*/React.createElement("div", {
    className: "statstrip",
    style: {
      '--n': 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circleDot",
    size: 13
  }), " Open contracts"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, open), /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, "available to claim")), /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 13
  }), " In progress"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, active), /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, "claimed or active")), /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "coins",
    size: 13
  }), " Reward pool"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, fmtAuec(String(pool)), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)',
      fontWeight: 400
    }
  }, "aUEC")), /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, "active contract value")), /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "checkCircle",
    size: 13
  }), " Completed"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, done), /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, "this cycle"))), /*#__PURE__*/React.createElement("div", {
    className: "con-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg-group"
  }, CONTRACT_TYPE_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    className: 'seg-btn' + (typeFilter === f ? ' active' : ''),
    onClick: () => setTypeFilter(f)
  }, f === 'all' ? 'All' : CT_LABEL[f], f === 'all' && /*#__PURE__*/React.createElement("span", {
    className: "seg-count"
  }, CONTRACTS.length)))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("select", {
    className: "con-status-filter",
    value: statusFilter,
    onChange: e => setStatusFilter(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All statuses"), Object.keys(STATUS_META).map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }, STATUS_META[s].label)))), /*#__PURE__*/React.createElement("div", {
    className: "con-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Contract"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Deadline"), /*#__PURE__*/React.createElement("th", null, "Claimed By"), /*#__PURE__*/React.createElement("th", null, "Owned By"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Reward"))), /*#__PURE__*/React.createElement("tbody", null, visible.map(c => {
    const dl = fmtDeadline(c.deadline);
    return /*#__PURE__*/React.createElement("tr", {
      key: c.id,
      className: c.id === selId && drawerOpen ? 'selected' : '',
      onClick: () => rowClick(c.id),
      tabIndex: 0
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "t-ent"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'ic ' + CT_CLASS[c.type]
    }, /*#__PURE__*/React.createElement(Icon, {
      name: CT_ICON[c.type],
      size: 16
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "nm"
    }, c.title)))), /*#__PURE__*/React.createElement("td", {
      className: "cell-muted"
    }, CT_LABEL[c.type]), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + STATUS_META[c.status].chip
    }, STATUS_META[c.status].label)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: 'deadline' + (dl.urgent ? ' urgent' : '')
    }, dl.text !== 'None set' && /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 12
    }), dl.text)), /*#__PURE__*/React.createElement("td", {
      className: "cell-muted"
    }, c.claimedBy), /*#__PURE__*/React.createElement("td", {
      className: "cell-muted"
    }, c.ownedBy), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, /*#__PURE__*/React.createElement("span", {
      className: "reward"
    }, fmtAuec(c.reward), " ", /*#__PURE__*/React.createElement("small", null, "aUEC"))));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "list-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hint-keys"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " move", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, visible.length, " of ", CONTRACTS.length, " contracts"))), /*#__PURE__*/React.createElement(ContractDrawer, {
    c: sel,
    onClose: () => setDrawerOpen(false)
  })), showCreate && /*#__PURE__*/React.createElement(CreateContractModal, {
    onClose: () => setShowCreate(false)
  }));
}
window.ContractsScreen = ContractsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-contracts.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-dashboard.jsx
try { (() => {
/* ============================================================
   STATION APP — Dashboard (customizable portlet grid)
   Self-contained, uniform portlets that snap into a 3-col grid;
   edit mode reveals drag grips + size controls + the edit banner.
   Mirrors src/pages/Dashboard.tsx + dashboard.css.
   ============================================================ */

function Portlet({
  icon,
  title,
  size = 'compact',
  editing,
  onCycle,
  action,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: 'pcard pcard--' + size
  }, /*#__PURE__*/React.createElement("div", {
    className: "pcard-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pcard-grip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "grip",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "pcard-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    className: "pcard-title"
  }, title), editing ? /*#__PURE__*/React.createElement("button", {
    className: "pcard-act pcard-size-btn",
    onClick: onCycle,
    title: "Resize widget"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 16
  })) : action), /*#__PURE__*/React.createElement("div", {
    className: "pcard-body"
  }, children));
}
function ProfilePortletBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pprofile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "big-av"
  }, CURRENT_USER.initial), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, CURRENT_USER.firstName, " ", CURRENT_USER.lastName), /*#__PURE__*/React.createElement("div", {
    className: "pr"
  }, "@", CURRENT_USER.username, " \xB7 ", ORGS[0].role))), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "members",
    size: 14
  }), " Organizations"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, ORGS.length)), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 14
  }), " Status"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "Active"))));
}
function OrgsPortletBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, ORGS.map(o => /*#__PURE__*/React.createElement("div", {
    className: "pmini",
    key: o.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "pavatar"
  }, o.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pnm"
  }, o.name), /*#__PURE__*/React.createElement("div", {
    className: "pmeta"
  }, o.role, " \xB7 ", o.members, " members"))))));
}
function InvitationsPortletBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, INVITATIONS.map((iv, i) => /*#__PURE__*/React.createElement("div", {
    className: "pmini",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "pavatar"
  }, iv.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pnm"
  }, iv.org), /*#__PURE__*/React.createElement("div", {
    className: "pmeta"
  }, "Invited as ", iv.role)), /*#__PURE__*/React.createElement("div", {
    className: "pbtn-row",
    style: {
      margin: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 14
  })))))));
}
function ContractsPortletBody({
  onNavigate
}) {
  const STATUS = {
    open: 'brand',
    active: 'warm',
    claimed: 'neutral',
    completed: 'success',
    disputed: 'warm'
  };
  const rows = CONTRACTS.filter(c => ['open', 'active', 'claimed'].includes(c.status)).slice(0, 5);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cp-filter-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-filter-pill active"
  }, "Active"), /*#__PURE__*/React.createElement("button", {
    className: "cp-filter-pill"
  }, "Open"), /*#__PURE__*/React.createElement("button", {
    className: "cp-filter-pill"
  }, "Mine")), /*#__PURE__*/React.createElement("div", {
    className: "pcard-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "inv-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Contract"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Reward"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.id,
    onClick: () => onNavigate('contracts'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "inv-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'thumb'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: CT_ICON[c.type],
    size: 13
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "sku"
  }, c.type)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'chip-badge ' + STATUS[c.status]
  }, c.status === 'active' ? 'In progress' : c.status)), /*#__PURE__*/React.createElement("td", {
    className: "cell-num"
  }, fmtAuec(c.reward))))))));
}
function InventoryPortletBody({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "portlet-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search inventory\u2026"
  })), /*#__PURE__*/React.createElement("label", {
    className: "p-toggle on"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-switch"
  }), " Org view")), /*#__PURE__*/React.createElement("div", {
    className: "pcard-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "inv-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Qty"))), /*#__PURE__*/React.createElement("tbody", null, INVENTORY.slice(0, 7).map(it => /*#__PURE__*/React.createElement("tr", {
    key: it.name,
    onClick: () => onNavigate('inventory'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "inv-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "thumb"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: KIND_ICON[it.kind],
    size: 13
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, it.name), /*#__PURE__*/React.createElement("div", {
    className: "sku"
  }, it.uom)))), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, it.cat), /*#__PURE__*/React.createElement("td", {
    className: "cell-num"
  }, it.qty)))))), /*#__PURE__*/React.createElement("div", {
    className: "p-pagination"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-count"
  }, "8 items \xB7 1 org"), /*#__PURE__*/React.createElement("div", {
    className: "pager"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: true
  }, "\u2039"), /*#__PURE__*/React.createElement("button", null, "\u203A"))));
}
function TrendMini({
  v
}) {
  const up = v >= 0;
  return /*#__PURE__*/React.createElement("span", {
    className: "dtrend",
    style: {
      color: up ? 'var(--success-500)' : 'var(--coral-400)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: up ? 'trendUp' : 'trendDown',
    size: 11
  }), (up ? '+' : '−') + Math.abs(v).toFixed(1) + '%');
}
function BlueprintsPortletBody({
  onNavigate
}) {
  const D = window.BlueprintsData;
  if (!D) return /*#__PURE__*/React.createElement("div", {
    className: "pstub"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "blueprint",
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    className: "pstub-label"
  }, "Loading\u2026"));
  const mine = D.list.filter(b => b.holders.some(h => h.member === D.ME));
  const published = mine.filter(b => {
    const m = b.holders.find(h => h.member === D.ME);
    return m && m.shared;
  }).length;
  const rows = mine.slice(0, 6);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pstat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstat-v"
  }, mine.length), /*#__PURE__*/React.createElement("div", {
    className: "pstat-k"
  }, "In library")), /*#__PURE__*/React.createElement("div", {
    className: "pstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstat-v",
    style: {
      color: 'var(--success-500)'
    }
  }, published), /*#__PURE__*/React.createElement("div", {
    className: "pstat-k"
  }, "Published")), /*#__PURE__*/React.createElement("div", {
    className: "pstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstat-v"
  }, mine.length - published), /*#__PURE__*/React.createElement("div", {
    className: "pstat-k"
  }, "Private"))), /*#__PURE__*/React.createElement("div", {
    className: "pcard-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "inv-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Blueprint"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Grade"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(b => {
    const c = D.CAT[b.cat],
      g = D.GRADE[b.grade];
    return /*#__PURE__*/React.createElement("tr", {
      key: b.id,
      onClick: () => onNavigate('blueprints'),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "inv-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'thumb big-ic ' + c.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 13
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "nm"
    }, b.name), /*#__PURE__*/React.createElement("div", {
      className: "sku"
    }, c.label)))), /*#__PURE__*/React.createElement("td", {
      className: "cell-muted"
    }, c.label), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "chip-badge dot-led",
      style: {
        background: 'color-mix(in srgb, ' + g.dot + ' 16%, transparent)',
        color: g.dot
      }
    }, b.grade)));
  })))));
}
function MarketPortletBody({
  onNavigate
}) {
  const D = window.MarketData;
  if (!D) return /*#__PURE__*/React.createElement("div", {
    className: "pstub"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "coins",
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    className: "pstub-label"
  }, "Loading\u2026"));
  const watch = D.list.filter(m => D.watch.includes(m.name));
  const movers = D.list.slice().sort((a, b) => Math.abs(b.t1w) - Math.abs(a.t1w)).slice(0, 2);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pmover-row"
  }, movers.map(m => /*#__PURE__*/React.createElement("div", {
    className: "pmover",
    key: m.id,
    onClick: () => onNavigate('market')
  }, /*#__PURE__*/React.createElement("div", {
    className: "pmover-nm"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "pmover-b"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pmover-p"
  }, D.fmt(m.avg)), /*#__PURE__*/React.createElement(TrendMini, {
    v: m.t1w
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "pcard-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "inv-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Watchlist"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Avg"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "1w"))), /*#__PURE__*/React.createElement("tbody", null, watch.map(m => {
    const c = D.CAT[m.cat];
    return /*#__PURE__*/React.createElement("tr", {
      key: m.id,
      onClick: () => onNavigate('market'),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "inv-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'thumb big-ic ' + c.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 13
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "nm"
    }, m.name), /*#__PURE__*/React.createElement("div", {
      className: "sku"
    }, m.listings, " listings")))), /*#__PURE__*/React.createElement("td", {
      className: "cell-num"
    }, D.fmt(m.avg)), /*#__PURE__*/React.createElement("td", {
      className: "cell-num"
    }, /*#__PURE__*/React.createElement(TrendMini, {
      v: m.t1w
    })));
  })))));
}
function WorkSessionsPortletBody({
  onNavigate
}) {
  const O = window.OPS;
  if (!O) return /*#__PURE__*/React.createElement("div", {
    className: "pstub"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pickaxe",
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    className: "pstub-label"
  }, "Loading\u2026"));
  const list = O.WORK_SESSIONS;
  const active = list.filter(s => s.status === 'active');
  const toSettle = list.filter(s => s.status === 'closed');
  const rows = list.filter(s => s.status === 'active' || s.status === 'closed' || s.status === 'planned').slice(0, 4);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pstat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstat-v",
    style: {
      color: 'var(--coral-400)'
    }
  }, active.length), /*#__PURE__*/React.createElement("div", {
    className: "pstat-k"
  }, "Active")), /*#__PURE__*/React.createElement("div", {
    className: "pstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstat-v"
  }, toSettle.length), /*#__PURE__*/React.createElement("div", {
    className: "pstat-k"
  }, "To settle"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, rows.map(s => {
    const st = O.SESSION_STATUS[s.status];
    return /*#__PURE__*/React.createElement("div", {
      className: "pmini",
      key: s.id,
      onClick: () => onNavigate('sessions'),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "pnm"
    }, s.name), /*#__PURE__*/React.createElement("div", {
      className: "pmeta"
    }, s.theater)), /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + st.tone
    }, st.label));
  })));
}
function RefineryPortletBody({
  onNavigate
}) {
  const O = window.OPS;
  if (!O) return /*#__PURE__*/React.createElement("div", {
    className: "pstub"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "factory",
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    className: "pstub-label"
  }, "Loading\u2026"));
  const rows = O.REFINERY_BATCHES.filter(b => ['processing', 'ready', 'queued'].includes(b.status)).slice(0, 6);
  return /*#__PURE__*/React.createElement("div", {
    className: "pcard-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "inv-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Batch"), /*#__PURE__*/React.createElement("th", null, "Terminal"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(b => {
    const st = O.REF_STATUS[b.status];
    return /*#__PURE__*/React.createElement("tr", {
      key: b.id,
      onClick: () => onNavigate('refinery'),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "inv-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "thumb",
      style: {
        background: 'color-mix(in srgb, #E0913A 16%, transparent)',
        color: '#E0913A',
        borderColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "factory",
      size: 13
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "nm"
    }, b.id), /*#__PURE__*/React.createElement("div", {
      className: "sku"
    }, b.ores.map(o => o[0]).join(' · '))))), /*#__PURE__*/React.createElement("td", {
      className: "cell-muted"
    }, b.terminal), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + st.tone
    }, b.status === 'processing' ? b.eta : st.label)));
  }))));
}
function StubPortlet({
  icon,
  title,
  label
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "pcard pcard--compact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pcard-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pcard-grip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "grip",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "pcard-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    className: "pcard-title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "pcard-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pstub"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    className: "pstub-label"
  }, label))));
}
function DashboardScreen({
  onNavigate
}) {
  const [editing, setEditing] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "dash-page screen-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-welcome"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-welcome-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-eyebrow"
  }, "Deepwater Syndicate \xB7 Director"), /*#__PURE__*/React.createElement("h1", {
    className: "dash-title"
  }, "Welcome back, ", /*#__PURE__*/React.createElement("span", {
    className: "dash-title-name"
  }, CURRENT_USER.firstName)), /*#__PURE__*/React.createElement("p", {
    className: "dash-sub"
  }, "Your mission control. Drag widgets to match how you play.")), /*#__PURE__*/React.createElement("div", {
    className: "dash-welcome-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: 'btn btn-ghost btn-sm' + (editing ? ' is-on' : ''),
    onClick: () => setEditing(e => !e)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "grip",
    size: 15
  }), " ", editing ? 'Done' : 'Edit layout'), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => onNavigate('contracts')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " New contract"))), editing && /*#__PURE__*/React.createElement("div", {
    className: "dash-edit-banner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dash-edit-banner-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "grip",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "dash-edit-banner-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-edit-banner-title"
  }, "Arranging your dashboard"), /*#__PURE__*/React.createElement("div", {
    className: "dash-edit-banner-sub"
  }, "Drag any widget to reorder. Use the resize control to cycle compact \u2192 standard \u2192 full. Layout saves automatically.")), /*#__PURE__*/React.createElement("div", {
    className: "dash-edit-banner-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setEditing(false)
  }, "Save layout"))), /*#__PURE__*/React.createElement("div", {
    className: 'dash-pgrid' + (editing ? ' editing' : '')
  }, /*#__PURE__*/React.createElement(Portlet, {
    icon: "inventory",
    title: "Inventory",
    size: "standard",
    editing: editing,
    action: /*#__PURE__*/React.createElement("a", {
      className: "pcard-act",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('inventory');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))
  }, /*#__PURE__*/React.createElement(InventoryPortletBody, {
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement(Portlet, {
    icon: "contracts",
    title: "Contracts",
    size: "compact",
    editing: editing,
    action: /*#__PURE__*/React.createElement("a", {
      className: "pcard-act",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('contracts');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))
  }, /*#__PURE__*/React.createElement(ContractsPortletBody, {
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement(Portlet, {
    icon: "pickaxe",
    title: "Work Sessions",
    size: "compact",
    editing: editing,
    action: /*#__PURE__*/React.createElement("a", {
      className: "pcard-act",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('sessions');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))
  }, /*#__PURE__*/React.createElement(WorkSessionsPortletBody, {
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement(Portlet, {
    icon: "refinery",
    title: "Refinery",
    size: "standard",
    editing: editing,
    action: /*#__PURE__*/React.createElement("a", {
      className: "pcard-act",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('refinery');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))
  }, /*#__PURE__*/React.createElement(RefineryPortletBody, {
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement(Portlet, {
    icon: "blueprint",
    title: "Blueprints",
    size: "standard",
    editing: editing,
    action: /*#__PURE__*/React.createElement("a", {
      className: "pcard-act",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('blueprints');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))
  }, /*#__PURE__*/React.createElement(BlueprintsPortletBody, {
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement(Portlet, {
    icon: "coins",
    title: "Market",
    size: "compact",
    editing: editing,
    action: /*#__PURE__*/React.createElement("a", {
      className: "pcard-act",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('market');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))
  }, /*#__PURE__*/React.createElement(MarketPortletBody, {
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement(Portlet, {
    icon: "person",
    title: "Profile",
    size: "compact",
    editing: editing,
    action: /*#__PURE__*/React.createElement("a", {
      className: "pcard-act",
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('profile');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))
  }, /*#__PURE__*/React.createElement(ProfilePortletBody, null)), /*#__PURE__*/React.createElement(Portlet, {
    icon: "members",
    title: "Organizations",
    size: "compact",
    editing: editing
  }, /*#__PURE__*/React.createElement(OrgsPortletBody, null)), /*#__PURE__*/React.createElement(Portlet, {
    icon: "bell",
    title: "Invitations",
    size: "compact",
    editing: editing
  }, /*#__PURE__*/React.createElement(InvitationsPortletBody, null))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-dashboard.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-fleet.jsx
try { (() => {
/* ============================================================
   STATION APP — Fleet (v2 restyle of app/Fleet.jsx)
   Three views: Org Fleet (leadership) · My Ships (member +
   offer to org) · Member-Offered (rentable capacity).
   Ship review/edit slide-out + Register modal. Every modify/
   destructive action gated by confirmAction().
   ============================================================ */
(() => {
  const O = window.OPS;
  const ME = 'Mara Vex';
  const ORG = 'Deepwater Syndicate';
  const members = ['Mara Vex', 'Rook Calder', 'Sable Ng', 'Korr Vaeth', 'Juno Reyes', 'Tessa Brandt', 'Dex Marrow'];
  function Pill({
    tone,
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + (tone || 'neutral')
    }, icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 11
    }), children);
  }
  const ROLE = {
    combat: {
      icon: 'crosshair',
      label: 'Combat',
      cls: 'fr-combat'
    },
    mining: {
      icon: 'gem',
      label: 'Mining',
      cls: 'fr-mining'
    },
    salvage: {
      icon: 'recycle',
      label: 'Salvage',
      cls: 'fr-salvage'
    },
    hauling: {
      icon: 'container',
      label: 'Hauling',
      cls: 'fr-hauling'
    },
    explore: {
      icon: 'compass',
      label: 'Exploration',
      cls: 'fr-explore'
    },
    transport: {
      icon: 'members',
      label: 'Transport',
      cls: 'fr-transport'
    },
    medical: {
      icon: 'cross',
      label: 'Medical',
      cls: 'fr-medical'
    },
    support: {
      icon: 'wrench',
      label: 'Support',
      cls: 'fr-support'
    }
  };
  const SHIP_STATUS = {
    ready: {
      tone: 'success',
      icon: 'badgeCheck',
      label: 'Ready'
    },
    deployed: {
      tone: 'info',
      icon: 'navigation',
      label: 'Deployed'
    },
    loaned: {
      tone: 'violet',
      icon: 'arrowUpRight',
      label: 'Loaned out'
    },
    repair: {
      tone: 'warn',
      icon: 'wrench',
      label: 'In repair'
    },
    stored: {
      tone: 'neutral',
      icon: 'warehouse',
      label: 'Stored'
    },
    claim: {
      tone: 'danger',
      icon: 'circleX',
      label: 'Claim filed'
    }
  };
  const ROLE_OPTS = Object.keys(ROLE);
  const STATUS_OPTS = ['ready', 'deployed', 'repair', 'stored', 'loaned', 'claim'];
  const fmt = O.moneyFmt;
  const ORG_FLEET0 = [{
    id: 'DWS-01',
    ship: 'Polaris',
    mfr: 'RSI',
    role: 'combat',
    status: 'deployed',
    captain: 'Rook Calder',
    crew: 14,
    cargo: 576,
    loc: 'Aaron Halo · Patrol',
    flag: true,
    note: 'Org flagship — corvette.',
    insured: 'LTI'
  }, {
    id: 'DWS-02',
    ship: 'Hammerhead',
    mfr: 'Aegis',
    role: 'combat',
    status: 'ready',
    captain: 'Korr Vaeth',
    crew: 9,
    cargo: 40,
    loc: 'Everus Harbor · Hangar 2',
    insured: '5yr'
  }, {
    id: 'DWS-03',
    ship: 'Reclaimer',
    mfr: 'Aegis',
    role: 'salvage',
    status: 'repair',
    captain: 'Korr Vaeth',
    crew: 5,
    cargo: 420,
    loc: 'CRU-L1 · Repair bay',
    note: 'Hull integrity 62% — in repair.',
    insured: '6mo'
  }, {
    id: 'DWS-04',
    ship: 'Hull C',
    mfr: 'MISC',
    role: 'hauling',
    status: 'deployed',
    captain: 'Sable Ng',
    crew: 4,
    cargo: 4608,
    loc: 'ARC → Hurston run',
    insured: 'LTI'
  }, {
    id: 'DWS-05',
    ship: 'Carrack',
    mfr: 'Anvil',
    role: 'explore',
    status: 'stored',
    captain: '—',
    crew: 6,
    cargo: 456,
    loc: 'New Babbage · Storage',
    insured: '5yr'
  }, {
    id: 'DWS-06',
    ship: 'Argo MOLE',
    mfr: 'Argo',
    role: 'mining',
    status: 'ready',
    captain: 'Mara Vex',
    crew: 3,
    cargo: 96,
    loc: 'Lyria · Outpost',
    insured: 'LTI'
  }, {
    id: 'DWS-07',
    ship: 'C2 Hercules',
    mfr: 'Crusader',
    role: 'hauling',
    status: 'loaned',
    captain: 'Juno Reyes',
    crew: 2,
    cargo: 696,
    loc: 'On loan · Juno Reyes',
    note: 'Checked out for a personal haul.',
    insured: '5yr'
  }, {
    id: 'DWS-08',
    ship: 'Prospector',
    mfr: 'MISC',
    role: 'mining',
    status: 'claim',
    captain: '—',
    crew: 1,
    cargo: 32,
    loc: 'Wala · Ring (lost)',
    note: 'Destroyed at Wala ring — insurance claim filed.',
    insured: '6mo'
  }];
  const MY_SHIPS0 = [{
    id: 'MY-1',
    ship: 'C2 Hercules Star Lifter',
    mfr: 'Crusader',
    role: 'hauling',
    crew: 2,
    cargo: 696,
    offered: true,
    rate: 0,
    who: 'Leadership'
  }, {
    id: 'MY-2',
    ship: 'Argo MOLE',
    mfr: 'Argo',
    role: 'mining',
    crew: 3,
    cargo: 96,
    offered: true,
    rate: 25000,
    who: 'Any member'
  }, {
    id: 'MY-3',
    ship: 'Prospector',
    mfr: 'MISC',
    role: 'mining',
    crew: 1,
    cargo: 32,
    offered: false,
    rate: 0,
    who: 'Leadership'
  }, {
    id: 'MY-4',
    ship: 'Cutlass Black',
    mfr: 'Drake',
    role: 'transport',
    crew: 3,
    cargo: 46,
    offered: false,
    rate: 18000,
    who: 'Leadership'
  }];
  const OFFERED0 = [{
    id: 'OF-1',
    ship: 'Constellation Phoenix',
    mfr: 'RSI',
    role: 'transport',
    owner: 'Sable Ng',
    crew: 4,
    cargo: 96,
    rate: 45000,
    status: 'available',
    who: 'Leadership'
  }, {
    id: 'OF-2',
    ship: 'Redeemer',
    mfr: 'Aegis',
    role: 'combat',
    owner: 'Rook Calder',
    crew: 5,
    cargo: 6,
    rate: 60000,
    status: 'available',
    who: 'Leadership'
  }, {
    id: 'OF-3',
    ship: 'Caterpillar',
    mfr: 'Drake',
    role: 'hauling',
    owner: 'Korr Vaeth',
    crew: 4,
    cargo: 576,
    rate: 30000,
    status: 'onloan',
    who: 'Any member',
    borrowedBy: 'Org haul · WS-118'
  }, {
    id: 'OF-4',
    ship: 'Vulture',
    mfr: 'Drake',
    role: 'salvage',
    owner: 'Dex Marrow',
    crew: 1,
    cargo: 12,
    rate: 25000,
    status: 'available',
    who: 'Any member'
  }];
  const roleTint = {
    combat: 'var(--coral-300)',
    mining: 'var(--aqua-300)',
    salvage: '#D9A6E6',
    hauling: 'var(--warning-500)',
    explore: 'var(--teal-300)',
    transport: '#9AA6F5',
    medical: 'var(--success-500)',
    support: 'var(--text-muted)'
  };

  /* ---- org ship review / edit drawer ---------------------- */
  function ShipDrawer({
    ship,
    onClose,
    onSaved,
    onRemoved
  }) {
    const [editing, setEditing] = React.useState(false);
    const [form, setForm] = React.useState(ship);
    React.useEffect(() => {
      setForm(ship);
      setEditing(false);
    }, [ship && ship.id]);
    if (!ship) return null;
    const s = editing ? form : ship;
    const r = ROLE[s.role],
      st = SHIP_STATUS[s.status];
    const set = (k, v) => setForm(f => ({
      ...f,
      [k]: v
    }));
    const save = async () => {
      if (!(await window.confirmAction({
        title: 'Save changes to ' + ship.ship + '?',
        body: 'Updates this ship in the org fleet register.',
        confirmLabel: 'Save changes',
        icon: 'save'
      }))) return;
      onSaved(form);
      setEditing(false);
      window.toast(ship.ship + ' updated', 'check');
    };
    const remove = async () => {
      if (!(await window.confirmAction({
        title: 'Remove ' + ship.ship + ' from the fleet?',
        body: 'Deletes ' + ship.id + ' from the org register. Crew assignments are cleared. This cannot be undone.',
        confirmLabel: 'Remove ship',
        tone: 'danger',
        icon: 'trash',
        requireText: ship.id
      }))) return;
      onRemoved(ship);
      onClose();
      window.toast(ship.ship + ' removed from fleet', 'trash');
    };
    const fileClaim = async () => {
      if (!(await window.confirmAction({
        title: 'File insurance claim for ' + ship.ship + '?',
        body: 'Marks the ship as a filed claim and starts the ' + (ship.insured || 'insurance') + ' replacement timer.',
        confirmLabel: 'File claim',
        icon: 'shield'
      }))) return;
      onSaved({
        ...ship,
        status: 'claim',
        captain: '—'
      });
      window.toast('Claim filed for ' + ship.ship, 'shield');
    };
    const recall = async () => {
      if (!(await window.confirmAction({
        title: 'Recall ' + ship.ship + '?',
        body: 'Returns the ship from loan back to the org fleet as Ready.',
        confirmLabel: 'Recall ship',
        icon: 'rotateCcw'
      }))) return;
      onSaved({
        ...ship,
        status: 'ready',
        loc: 'Everus Harbor · Hangar'
      });
      window.toast(ship.ship + ' recalled', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!ship,
      onClose: onClose,
      width: 460
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, ship.id, " \xB7 Org ship"), !editing && /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: () => setEditing(true),
      title: "Edit",
      "aria-label": "Edit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'd-bigic ' + r.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: r.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, s.mfr, " ", s.ship, " ", s.flag && /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 14,
      style: {
        color: 'var(--brand)',
        verticalAlign: '-1px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, r.label, s.flag ? ' · Flagship' : '')), /*#__PURE__*/React.createElement(Pill, {
      tone: st.tone,
      icon: st.icon
    }, st.label)), /*#__PURE__*/React.createElement("div", {
      className: "d-tiles"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "members"
    }), " Crew"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, s.crew, /*#__PURE__*/React.createElement("small", null, "seats"))), /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "container"
    }), " Cargo"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, fmt(s.cargo), /*#__PURE__*/React.createElement("small", null, "SCU")))), editing ? /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Edit ship"), /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Role"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: s.role,
      onChange: e => set('role', e.target.value)
    }, ROLE_OPTS.map(k => /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, ROLE[k].label)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Status"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: s.status,
      onChange: e => set('status', e.target.value)
    }, STATUS_OPTS.map(k => /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, SHIP_STATUS[k].label))))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Captain"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: s.captain,
      onChange: e => set('captain', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "\u2014"
    }, "Unassigned"), members.map(m => /*#__PURE__*/React.createElement("option", {
      key: m,
      value: m
    }, m)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Location"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: s.loc,
      onChange: e => set('loc', e.target.value)
    }))) : /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Assignment"), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Captain"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, s.captain === '—' ? /*#__PURE__*/React.createElement("span", {
      className: "t-muted"
    }, "Unassigned") : /*#__PURE__*/React.createElement(window.AvatarChip, {
      name: s.captain
    }))), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Location"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, s.loc)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Role"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, r.label)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Insurance"), /*#__PURE__*/React.createElement("span", {
      className: "v t-mono"
    }, s.insured || '—')), s.note && /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Note"), /*#__PURE__*/React.createElement("span", {
      className: "v",
      style: {
        fontWeight: 400,
        color: 'var(--text-muted)'
      }
    }, s.note))), editing && /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger",
      style: {
        width: '100%',
        justifyContent: 'center'
      },
      onClick: remove
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    }), " Remove from fleet"))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => {
        setForm(ship);
        setEditing(false);
      }
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: save
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "save",
      size: 15
    }), " Save changes")) : ship.status === 'loaned' ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: recall
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCcw",
      size: 15
    }), " Recall ship") : ship.status === 'repair' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger",
      onClick: fileClaim
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 15
    }), " File claim")) : ship.status === 'claim' ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "userCheck",
      size: 15
    }), " Assign & set status"))));
  }

  /* ---- offered ship drawer (request / return) ------------- */
  function OfferedDrawer({
    ship,
    onClose,
    onResolve
  }) {
    if (!ship) return null;
    const r = ROLE[ship.role],
      onloan = ship.status === 'onloan';
    const request = async () => {
      if (!(await window.confirmAction({
        title: 'Request ' + ship.ship + '?',
        body: (ship.rate ? 'At ' + fmt(ship.rate) + ' aUEC/day. ' : 'Free for org ops. ') + ship.owner + ' will be asked to approve.',
        confirmLabel: 'Send request',
        icon: 'send'
      }))) return;
      onResolve({
        ...ship,
        status: 'onloan',
        borrowedBy: 'Requested by ' + ME
      });
      onClose();
      window.toast('Requested ' + ship.ship, 'send');
    };
    const ret = async () => {
      if (!(await window.confirmAction({
        title: 'Request return of ' + ship.ship + '?',
        body: 'Notifies the current borrower to return ' + ship.ship + ' to ' + ship.owner + '.',
        confirmLabel: 'Request return',
        icon: 'rotateCcw'
      }))) return;
      onResolve({
        ...ship,
        status: 'available',
        borrowedBy: null
      });
      onClose();
      window.toast('Return requested', 'rotateCcw');
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!ship,
      onClose: onClose,
      width: 440
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, ship.id, " \xB7 Member ship"), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'd-bigic ' + r.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: r.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, ship.mfr, " ", ship.ship), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, r.label, " \xB7 owned by ", ship.owner)), onloan ? /*#__PURE__*/React.createElement(Pill, {
      tone: "info",
      icon: "navigation"
    }, "On loan") : /*#__PURE__*/React.createElement(Pill, {
      tone: "brand",
      icon: "badgeCheck"
    }, "Available")), /*#__PURE__*/React.createElement("div", {
      className: "d-tiles"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "members"
    }), " Crew"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, ship.crew, /*#__PURE__*/React.createElement("small", null, "seats"))), /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "container"
    }), " Cargo"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, fmt(ship.cargo), /*#__PURE__*/React.createElement("small", null, "SCU")))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Rental terms"), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Rate"), /*#__PURE__*/React.createElement("span", {
      className: "v brand"
    }, ship.rate ? fmt(ship.rate) + ' aUEC / day' : 'Free for org ops')), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Who can request"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, ship.who)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Owner"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, /*#__PURE__*/React.createElement(window.AvatarChip, {
      name: ship.owner
    }))), onloan && /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Current use"), /*#__PURE__*/React.createElement("span", {
      className: "v",
      style: {
        fontWeight: 400,
        color: 'var(--text-muted)'
      }
    }, ship.borrowedBy)))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, onloan ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: ret
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCcw",
      size: 15
    }), " Request return") : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: request
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 15
    }), " Request ship")));
  }

  /* ---- register ship modal -------------------------------- */
  function RegisterModal({
    context,
    onClose,
    onCreate
  }) {
    const [ship, setShip] = React.useState('');
    const [mfr, setMfr] = React.useState('');
    const [role, setRole] = React.useState('hauling');
    const [crew, setCrew] = React.useState(1);
    const [cargo, setCargo] = React.useState(0);
    const valid = ship.trim() && mfr.trim();
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Register ' + (mfr || 'ship') + ' ' + ship + '?',
        body: context === 'mine' ? 'Adds the ship to your personal hangar.' : 'Adds the ship to the ' + ORG + ' fleet register.',
        confirmLabel: 'Register ship',
        icon: 'plus'
      }))) return;
      onCreate({
        ship: ship.trim(),
        mfr: mfr.trim(),
        role,
        crew: +crew,
        cargo: +cargo
      });
      onClose();
      window.toast('Ship registered', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: context === 'mine' ? 'Add a ship' : 'Register a ship',
      icon: "rocket",
      onClose: onClose,
      width: 540,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }), " Register ship"))
    }, /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Manufacturer",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      autoFocus: true,
      value: mfr,
      onChange: e => setMfr(e.target.value),
      placeholder: "e.g. Aegis"
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Ship model",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: ship,
      onChange: e => setShip(e.target.value),
      placeholder: "e.g. Reclaimer"
    }))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Primary role",
      required: true
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: 4,
      value: role,
      onChange: setRole,
      options: ROLE_OPTS.map(k => ({
        value: k,
        label: ROLE[k].label,
        icon: ROLE[k].icon
      }))
    })), /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Crew seats"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "1",
      value: crew,
      onChange: e => setCrew(Math.max(1, +e.target.value))
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Cargo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "0",
      value: cargo,
      onChange: e => setCargo(Math.max(0, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "SCU")))));
  }

  /* ---- org fleet table ------------------------------------ */
  function OrgFleetView({
    ships,
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap",
      style: {
        marginTop: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Org fleet"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Ship"), /*#__PURE__*/React.createElement("th", null, "Captain"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Crew"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Cargo"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, ships.map(s => {
      const r = ROLE[s.role],
        st = SHIP_STATUS[s.status];
      return /*#__PURE__*/React.createElement("tr", {
        key: s.id,
        onClick: () => onOpen(s),
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: 'ent-ic big-ic ' + r.cls
      }, /*#__PURE__*/React.createElement(Icon, {
        name: r.icon,
        size: 16
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, s.mfr, " ", s.ship, " ", s.flag && /*#__PURE__*/React.createElement(Icon, {
        name: "star",
        size: 12,
        style: {
          color: 'var(--brand)'
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, s.id, " \xB7 ", r.label)))), /*#__PURE__*/React.createElement("td", null, s.captain === '—' ? /*#__PURE__*/React.createElement("span", {
        className: "t-muted"
      }, "Unassigned") : /*#__PURE__*/React.createElement(window.AvatarChip, {
        name: s.captain
      })), /*#__PURE__*/React.createElement("td", {
        className: "num t-mono"
      }, s.crew), /*#__PURE__*/React.createElement("td", {
        className: "num t-mono"
      }, fmt(s.cargo)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
        tone: st.tone,
        icon: st.icon
      }, st.label)), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "list-hint"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open ship ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, ships.length, " org ships")));
  }

  /* ---- my ships (offer cards) ----------------------------- */
  function MyShipsView({
    ships,
    setShips,
    onAdd
  }) {
    const offeredCount = ships.filter(s => s.offered).length;
    const toggle = async s => {
      if (!(await window.confirmAction({
        title: (s.offered ? 'Withdraw ' : 'Offer ') + s.ship + (s.offered ? ' from org?' : ' to org?'),
        body: s.offered ? 'Leadership will no longer see this ship as available capacity.' : 'Leadership can request this ship for org operations. You keep ownership and can withdraw anytime.',
        confirmLabel: s.offered ? 'Withdraw ship' : 'Offer to org',
        icon: s.offered ? 'lock' : 'check',
        tone: s.offered ? 'danger' : undefined
      }))) return;
      setShips(arr => arr.map(x => x.id === s.id ? {
        ...x,
        offered: !x.offered
      } : x));
      window.toast(s.offered ? s.ship + ' withdrawn' : s.ship + ' offered to org', s.offered ? 'lock' : 'check');
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "offer-summary"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "userCheck",
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      className: "txt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tt"
    }, offeredCount, " of ", ships.length, " ships offered to ", ORG), /*#__PURE__*/React.createElement("div", {
      className: "ss"
    }, "Toggle a ship to make it available for org operations. You keep ownership and set the terms.")), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: onAdd
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " Add ship")), /*#__PURE__*/React.createElement("div", {
      className: "offer-list"
    }, ships.map(s => {
      const r = ROLE[s.role];
      return /*#__PURE__*/React.createElement("div", {
        className: 'offer-card' + (s.offered ? ' on' : ''),
        key: s.id
      }, /*#__PURE__*/React.createElement("span", {
        className: 'big-ic ' + r.cls,
        style: {
          width: 38,
          height: 38
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: r.icon,
        size: 17
      })), /*#__PURE__*/React.createElement("div", {
        className: "offer-info"
      }, /*#__PURE__*/React.createElement("div", {
        className: "offer-nm"
      }, s.mfr, " ", s.ship), /*#__PURE__*/React.createElement("div", {
        className: "offer-meta"
      }, r.label, " \xB7 ", /*#__PURE__*/React.createElement(Icon, {
        name: "members",
        size: 12
      }), " ", s.crew, " \xB7 ", /*#__PURE__*/React.createElement(Icon, {
        name: "container",
        size: 12
      }), " ", fmt(s.cargo), " SCU")), /*#__PURE__*/React.createElement("div", {
        className: "offer-terms"
      }, /*#__PURE__*/React.createElement("div", {
        className: "ot-lbl"
      }, s.offered ? s.rate ? fmt(s.rate) + ' aUEC/day' : 'Free for org' : 'Private'), /*#__PURE__*/React.createElement("div", {
        className: "ot-sub"
      }, s.offered ? 'to ' + s.who : 'Not shared')), /*#__PURE__*/React.createElement("button", {
        className: 'swtch' + (s.offered ? ' on' : ''),
        role: "switch",
        "aria-checked": s.offered,
        "aria-label": 'Offer ' + s.ship + ' to org',
        onClick: () => toggle(s)
      }, /*#__PURE__*/React.createElement("span", {
        className: "knob"
      })));
    })));
  }

  /* ---- offered table -------------------------------------- */
  function OfferedView({
    ships,
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap",
      style: {
        marginTop: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Member-offered ships"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Ship"), /*#__PURE__*/React.createElement("th", null, "Offered by"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Rate"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, ships.map(s => {
      const r = ROLE[s.role],
        onloan = s.status === 'onloan';
      return /*#__PURE__*/React.createElement("tr", {
        key: s.id,
        onClick: () => onOpen(s),
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: 'ent-ic big-ic ' + r.cls
      }, /*#__PURE__*/React.createElement(Icon, {
        name: r.icon,
        size: 16
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, s.mfr, " ", s.ship), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, r.label)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(window.AvatarChip, {
        name: s.owner
      })), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, s.rate ? /*#__PURE__*/React.createElement("span", {
        className: "t-mono"
      }, fmt(s.rate), " ", /*#__PURE__*/React.createElement("span", {
        className: "t-faint"
      }, "/day")) : /*#__PURE__*/React.createElement("span", {
        className: "rate-free"
      }, "Free")), /*#__PURE__*/React.createElement("td", null, onloan ? /*#__PURE__*/React.createElement(Pill, {
        tone: "info",
        icon: "navigation"
      }, "On loan") : /*#__PURE__*/React.createElement(Pill, {
        tone: "brand",
        icon: "badgeCheck"
      }, "Available")), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "list-hint"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open ship ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, ships.length, " member ships")));
  }

  /* ---- fleet page ----------------------------------------- */
  function FleetScreen() {
    const [tab, setTab] = React.useState('org');
    const [orgFleet, setOrgFleet] = React.useState(() => ORG_FLEET0.map(s => ({
      ...s
    })));
    const [myShips, setMyShips] = React.useState(() => MY_SHIPS0.map(s => ({
      ...s
    })));
    const [offered, setOffered] = React.useState(() => OFFERED0.map(s => ({
      ...s
    })));
    const [openShip, setOpenShip] = React.useState(null);
    const [openOffered, setOpenOffered] = React.useState(null);
    const [register, setRegister] = React.useState(false);
    React.useEffect(() => {
      const onKey = e => {
        if (e.key === 'n' && !/input|textarea|select/i.test(e.target.tagName) && !document.querySelector('.modal-backdrop') && !document.querySelector('.drawer')) {
          e.preventDefault();
          setRegister(true);
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, []);
    const ready = orgFleet.filter(s => s.status === 'ready').length;
    const deployed = orgFleet.filter(s => s.status === 'deployed').length;
    const totalCargo = orgFleet.reduce((a, s) => a + s.cargo, 0);
    const myOffered = myShips.filter(s => s.offered).length;
    const availOffered = offered.filter(s => s.status === 'available').length;
    const stats = tab === 'mine' ? [{
      k: 'My ships',
      icon: 'rocket',
      v: myShips.length,
      d: 'in personal hangar'
    }, {
      k: 'Offered to org',
      icon: 'userCheck',
      v: myOffered,
      d: 'available for ops',
      tone: 'up'
    }, {
      k: 'Earning potential',
      icon: 'coins',
      v: fmt(myShips.filter(s => s.offered).reduce((a, s) => a + s.rate, 0)),
      unit: 'aUEC/day',
      d: 'from rentals'
    }, {
      k: 'Total cargo',
      icon: 'container',
      v: fmt(myShips.reduce((a, s) => a + s.cargo, 0)),
      unit: 'SCU',
      d: 'across your ships'
    }] : tab === 'offered' ? [{
      k: 'Member ships',
      icon: 'userCheck',
      v: offered.length,
      d: 'offered to the org'
    }, {
      k: 'Available now',
      icon: 'badgeCheck',
      v: availOffered,
      d: 'ready to request',
      tone: 'up'
    }, {
      k: 'On loan',
      icon: 'navigation',
      v: offered.length - availOffered,
      d: 'currently in use'
    }, {
      k: 'Rentable cargo',
      icon: 'container',
      v: fmt(offered.reduce((a, s) => a + s.cargo, 0)),
      unit: 'SCU',
      d: 'extra capacity'
    }] : [{
      k: 'Org ships',
      icon: 'rocket',
      v: orgFleet.length,
      d: 'owned by ' + ORG
    }, {
      k: 'Ready',
      icon: 'badgeCheck',
      v: ready,
      d: 'crewed & flightworthy',
      tone: 'up'
    }, {
      k: 'Deployed',
      icon: 'navigation',
      v: deployed,
      d: 'on active ops'
    }, {
      k: 'Fleet cargo',
      icon: 'container',
      v: fmt(totalCargo),
      unit: 'SCU',
      d: 'total capacity'
    }];
    const addShip = d => {
      if (tab === 'mine') {
        setMyShips(xs => [{
          id: 'MY-' + Math.floor(5 + Math.random() * 90),
          ship: d.ship,
          mfr: d.mfr,
          role: d.role,
          crew: d.crew,
          cargo: d.cargo,
          offered: false,
          rate: 0,
          who: 'Leadership'
        }, ...xs]);
      } else {
        setOrgFleet(xs => [{
          id: 'DWS-' + Math.floor(9 + Math.random() * 90),
          ship: d.ship,
          mfr: d.mfr,
          role: d.role,
          status: 'stored',
          captain: '—',
          crew: d.crew,
          cargo: d.cargo,
          loc: 'New hangar',
          insured: '6mo'
        }, ...xs]);
      }
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "crumb"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "fleet"
    }), " Assets ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight"
    }), " Fleet"), /*#__PURE__*/React.createElement("h1", {
      className: "page-title"
    }, "Fleet"), /*#__PURE__*/React.createElement("p", {
      className: "page-sub"
    }, "Manage the org armada, your personal hangar, and the ships members lend to the cause \u2014 all in one command view.")), /*#__PURE__*/React.createElement("div", {
      className: "page-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: () => setRegister(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    }), " ", tab === 'mine' ? 'Add ship' : 'Register ship', " ", /*#__PURE__*/React.createElement("span", {
      className: "kbd",
      style: {
        marginLeft: 6
      }
    }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement("div", {
      className: "scope-row"
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Fleet view",
      value: tab,
      onChange: setTab,
      options: [{
        value: 'org',
        label: 'Org Fleet',
        icon: 'members',
        count: orgFleet.length
      }, {
        value: 'mine',
        label: 'My Ships',
        icon: 'userRound',
        count: myShips.length
      }, {
        value: 'offered',
        label: 'Member-Offered',
        icon: 'userCheck',
        count: offered.length
      }]
    })), /*#__PURE__*/React.createElement(window.StatStrip, {
      items: stats
    }), tab === 'org' && /*#__PURE__*/React.createElement(OrgFleetView, {
      ships: orgFleet,
      onOpen: setOpenShip
    }), tab === 'mine' && /*#__PURE__*/React.createElement(MyShipsView, {
      ships: myShips,
      setShips: setMyShips,
      onAdd: () => setRegister(true)
    }), tab === 'offered' && /*#__PURE__*/React.createElement(OfferedView, {
      ships: offered,
      onOpen: setOpenOffered
    }), register && /*#__PURE__*/React.createElement(RegisterModal, {
      context: tab,
      onClose: () => setRegister(false),
      onCreate: addShip
    }), openShip && /*#__PURE__*/React.createElement(ShipDrawer, {
      ship: openShip,
      onClose: () => setOpenShip(null),
      onSaved: u => setOrgFleet(xs => xs.map(x => x.id === u.id ? u : x)),
      onRemoved: s => setOrgFleet(xs => xs.filter(x => x.id !== s.id))
    }), openOffered && /*#__PURE__*/React.createElement(OfferedDrawer, {
      ship: openOffered,
      onClose: () => setOpenOffered(null),
      onResolve: u => setOffered(xs => xs.map(x => x.id === u.id ? u : x))
    }));
  }
  window.FleetScreen = FleetScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-fleet.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-hr.jsx
try { (() => {
/* ============================================================
   STATION APP — Human Resources
   HR hub (member + business-unit widgets) · Members (table +
   member drawer with unit assignment, lock/unlock, remove) ·
   Business Units (hierarchical tree table with kind badges).
   Mirrors HumanResources / Members / BusinessUnits pages.
   ============================================================ */

function initials(name) {
  return name.split(' ').map(p => p[0]).slice(0, 1).join('').toUpperCase();
}

// ---------- HR HUB ----------
function flattenUnits(nodes, depth, out) {
  nodes.forEach(n => {
    out.push({
      ...n,
      depth
    });
    flattenUnits(n.children, depth + 1, out);
  });
  return out;
}
function countUnits(nodes) {
  return nodes.reduce((s, n) => s + 1 + countUnits(n.children), 0);
}
function kindCounts(nodes, acc = {}) {
  nodes.forEach(n => {
    acc[n.kind] = (acc[n.kind] || 0) + 1;
    kindCounts(n.children, acc);
  });
  return acc;
}
function HRHubScreen({
  onNavigate
}) {
  const totalUnits = countUnits(BUSINESS_UNITS);
  const kinds = kindCounts(BUSINESS_UNITS);
  const flat = flattenUnits(BUSINESS_UNITS, 0, []).slice(0, 7);
  return /*#__PURE__*/React.createElement("div", {
    className: "hr-page screen-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-eyebrow"
  }, "Operations"), /*#__PURE__*/React.createElement("h1", {
    className: "hr-title"
  }, "Human Resources"), /*#__PURE__*/React.createElement("p", {
    className: "hr-sub"
  }, "Manage your organization's roster and structure.")), /*#__PURE__*/React.createElement("div", {
    className: "hr-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-widget"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "members",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-title"
  }, "Members"), /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-sub"
  }, MEMBERS.length)), /*#__PURE__*/React.createElement("button", {
    className: "hr-view-all",
    onClick: () => onNavigate('members')
  }, "View all ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-member-list"
  }, MEMBERS.slice(0, 6).map(m => /*#__PURE__*/React.createElement("div", {
    className: "hr-member-row",
    key: m.username,
    onClick: () => onNavigate('members')
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-avatar"
  }, initials(m.name)), /*#__PURE__*/React.createElement("div", {
    className: "hr-member-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-member-name"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "hr-member-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hr-role-badge"
  }, m.role), m.discord && /*#__PURE__*/React.createElement("span", {
    className: "hr-discord-dot"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 10
  })))), /*#__PURE__*/React.createElement("div", {
    className: "hr-member-date"
  }, m.joined))), /*#__PURE__*/React.createElement("div", {
    className: "hr-more",
    onClick: () => onNavigate('members')
  }, "+", MEMBERS.length - 6, " more \u2014 view all")))), /*#__PURE__*/React.createElement("div", {
    className: "hr-widget"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "tree",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-title"
  }, "Business Units"), /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-sub"
  }, totalUnits)), /*#__PURE__*/React.createElement("button", {
    className: "hr-view-all",
    onClick: () => onNavigate('business-units')
  }, "View all ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hr-widget-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hr-kind-pills"
  }, Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([k, c]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: 'hr-kind-pill hr-kind-' + k
  }, c, " ", k, c !== 1 ? 's' : ''))), /*#__PURE__*/React.createElement("div", {
    className: "hr-tree-preview",
    onClick: () => onNavigate('business-units')
  }, flat.map((n, i) => /*#__PURE__*/React.createElement("div", {
    className: "hr-tree-row",
    key: i,
    style: {
      paddingLeft: n.depth * 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: 'hr-tree-dot hr-tree-dot-' + n.kind
  }), /*#__PURE__*/React.createElement("span", {
    className: "hr-tree-name"
  }, n.name), /*#__PURE__*/React.createElement("span", {
    className: "hr-tree-kind"
  }, n.kind))))))));
}

// ---------- MEMBERS ----------
function MemberDrawer({
  m,
  onClose
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mem-drawer open"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-drawer-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-drawer-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-avatar-lg"
  }, initials(m.name)), /*#__PURE__*/React.createElement("div", {
    className: "mem-drawer-name-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-drawer-name"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "mem-drawer-username"
  }, "@", m.username)), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mem-drawer-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-section-cap"
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    className: "mem-kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mem-k"
  }, "Email"), /*#__PURE__*/React.createElement("span", {
    className: "mem-v"
  }, m.email)), /*#__PURE__*/React.createElement("div", {
    className: "mem-kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mem-k"
  }, "Role"), /*#__PURE__*/React.createElement("span", {
    className: "mem-v"
  }, m.role)), /*#__PURE__*/React.createElement("div", {
    className: "mem-kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mem-k"
  }, "Joined org"), /*#__PURE__*/React.createElement("span", {
    className: "mem-v"
  }, m.joined)), m.discord && /*#__PURE__*/React.createElement("div", {
    className: "mem-kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mem-k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 12
  }), " Discord"), /*#__PURE__*/React.createElement("span", {
    className: "mem-v mem-discord"
  }, m.username, "#4471")), /*#__PURE__*/React.createElement("div", {
    className: "mem-kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mem-k"
  }, "Account status"), /*#__PURE__*/React.createElement("span", {
    className: 'chip chip-' + (m.active ? 'success' : 'danger')
  }, m.active ? 'Active' : 'Locked'))), /*#__PURE__*/React.createElement("div", {
    className: "mem-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-section-cap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "tree",
    size: 12
  }), " Business Unit"), /*#__PURE__*/React.createElement("select", {
    className: "field-input",
    defaultValue: m.unit || ''
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Unassigned \u2014"), flattenUnits(BUSINESS_UNITS, 0, []).map((u, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: u.name
  }, '\u00A0\u00A0'.repeat(u.depth), u.name)), m.unit && !flattenUnits(BUSINESS_UNITS, 0, []).some(u => u.name === m.unit) && /*#__PURE__*/React.createElement("option", {
    value: m.unit
  }, m.unit))), /*#__PURE__*/React.createElement("div", {
    className: "mem-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-section-cap"
  }, "Member actions"), /*#__PURE__*/React.createElement("div", {
    className: "mem-actions-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-warning-outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 15
  }), " Invalidate sessions"), m.active ? /*#__PURE__*/React.createElement("button", {
    className: "btn-danger-outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 15
  }), " Lock account") : /*#__PURE__*/React.createElement("button", {
    className: "btn-warning-outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 15
  }), " Unlock account"))), /*#__PURE__*/React.createElement("div", {
    className: "mem-section mem-section-danger"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-section-cap"
  }, "Danger zone"), /*#__PURE__*/React.createElement("button", {
    className: "btn-danger-outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 15
  }), " Remove from organization"))))), /*#__PURE__*/React.createElement("div", {
    className: "mem-backdrop",
    onClick: onClose
  }));
}
function MembersScreen() {
  const [selId, setSelId] = useState('rook');
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const roles = [...new Set(MEMBERS.map(m => m.role))];
  const filtered = MEMBERS.filter(m => (!search || m.name.toLowerCase().includes(search.toLowerCase()) || m.username.includes(search.toLowerCase())) && (!role || m.role === role));
  const sel = open ? MEMBERS.find(m => m.username === selId) : null;
  const click = u => {
    if (selId === u && open) setOpen(false);else {
      setSelId(u);
      setOpen(true);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mem-layout screen-root",
    style: {
      height: 'auto',
      minHeight: 'calc(100vh - 124px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: 'mem-main' + (open ? ' drawer-open' : ''),
    style: {
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "mem-title"
  }, "Members"), /*#__PURE__*/React.createElement("p", {
    className: "mem-sub"
  }, filtered.length, " members"))), /*#__PURE__*/React.createElement("div", {
    className: "mem-filters"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mem-search-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  }), /*#__PURE__*/React.createElement("input", {
    className: "mem-search",
    placeholder: "Search name, username, email\u2026",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("select", {
    className: "field-input mem-role-filter",
    value: role,
    onChange: e => setRole(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All roles"), roles.map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r)))), /*#__PURE__*/React.createElement("div", {
    className: "mem-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "mem-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Member"), /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Business unit"), /*#__PURE__*/React.createElement("th", null, "Joined"), /*#__PURE__*/React.createElement("th", null, "Discord"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(m => /*#__PURE__*/React.createElement("tr", {
    key: m.username,
    className: 'mem-row' + (m.username === selId && open ? ' selected' : ''),
    onClick: () => click(m.username),
    tabIndex: 0
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "mem-cell-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-avatar"
  }, initials(m.name)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mem-name",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, m.name, !m.active && /*#__PURE__*/React.createElement("span", {
    className: "chip chip-danger",
    style: {
      fontSize: 10
    }
  }, "Locked")), /*#__PURE__*/React.createElement("div", {
    className: "mem-username"
  }, "@", m.username)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "mem-role-badge"
  }, m.role)), /*#__PURE__*/React.createElement("td", {
    className: "mem-cell-unit"
  }, m.unit || /*#__PURE__*/React.createElement("span", {
    className: "mem-unassigned"
  }, "\u2014")), /*#__PURE__*/React.createElement("td", {
    className: "mem-cell-date"
  }, m.joined), /*#__PURE__*/React.createElement("td", {
    className: "mem-cell-discord"
  }, m.discord ? /*#__PURE__*/React.createElement("span", {
    className: "mem-discord-tag"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 12
  }), " Linked") : /*#__PURE__*/React.createElement("span", {
    className: "mem-no-discord"
  }, "\u2014")))))))), open && sel && /*#__PURE__*/React.createElement(MemberDrawer, {
    m: sel,
    onClose: () => setOpen(false)
  }));
}

// ---------- BUSINESS UNITS ----------
const KIND_LABELS = {
  division: 'Division',
  department: 'Department',
  team: 'Team',
  squad: 'Squad',
  wing: 'Wing',
  custom: 'Custom'
};
function BURow({
  node,
  depth,
  expanded,
  onToggle
}) {
  const isOpen = expanded.has(node.name);
  const has = node.children.length > 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", {
    className: 'bu-row bu-depth-' + Math.min(depth, 3)
  }, /*#__PURE__*/React.createElement("td", {
    className: "bu-cell-name"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bu-name-wrap",
    style: {
      paddingLeft: depth * 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "bu-expand-btn",
    style: {
      visibility: has ? 'visible' : 'hidden'
    },
    onClick: () => onToggle(node.name)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isOpen ? 'chevronDown' : 'chevronRight',
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "bu-name"
  }, node.name))), /*#__PURE__*/React.createElement("td", {
    className: "bu-cell-kind"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'bu-kind-badge bu-kind-' + node.kind
  }, KIND_LABELS[node.kind])), /*#__PURE__*/React.createElement("td", {
    className: "bu-cell-desc"
  }, node.desc), /*#__PURE__*/React.createElement("td", {
    className: "bu-cell-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-icon bu-action-btn",
    title: "Add child"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon bu-action-btn",
    title: "Edit"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon bu-action-btn bu-action-delete",
    title: "Delete"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 15
  })))), isOpen && node.children.map((c, i) => /*#__PURE__*/React.createElement(BURow, {
    key: i,
    node: c,
    depth: depth + 1,
    expanded: expanded,
    onToggle: onToggle
  })));
}
function BusinessUnitsScreen() {
  const allNames = flattenUnits(BUSINESS_UNITS, 0, []).map(n => n.name);
  const [expanded, setExpanded] = useState(new Set(allNames));
  const toggle = name => setExpanded(prev => {
    const n = new Set(prev);
    n.has(name) ? n.delete(name) : n.add(name);
    return n;
  });
  const total = countUnits(BUSINESS_UNITS);
  return /*#__PURE__*/React.createElement("div", {
    className: "bu-page screen-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bu-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bu-header-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bu-eyebrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "tree",
    size: 14
  }), " Organization structure"), /*#__PURE__*/React.createElement("h1", {
    className: "bu-title"
  }, "Business Units"), /*#__PURE__*/React.createElement("p", {
    className: "bu-sub"
  }, "Divisions, departments, teams, and squads \u2014 arranged in a hierarchy.")), /*#__PURE__*/React.createElement("div", {
    className: "bu-header-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " Add unit"))), /*#__PURE__*/React.createElement("div", {
    className: "bu-table-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bu-table-meta"
  }, total, " units"), /*#__PURE__*/React.createElement("table", {
    className: "bu-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "bu-th-name"
  }, "Name"), /*#__PURE__*/React.createElement("th", {
    className: "bu-th-kind"
  }, "Kind"), /*#__PURE__*/React.createElement("th", {
    className: "bu-th-desc"
  }, "Description"), /*#__PURE__*/React.createElement("th", {
    className: "bu-th-actions"
  }))), /*#__PURE__*/React.createElement("tbody", null, BUSINESS_UNITS.map((n, i) => /*#__PURE__*/React.createElement(BURow, {
    key: i,
    node: n,
    depth: 0,
    expanded: expanded,
    onToggle: toggle
  }))))));
}
Object.assign(window, {
  HRHubScreen,
  MembersScreen,
  BusinessUnitsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-hr.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-inventory.jsx
try { (() => {
/* ============================================================
   STATION APP — Inventory (v0.3.0)
   Personal ⇄ Org views · permission bar · stat strip (org) ·
   toolbar (search/category/sort/filters/density/layout/add) ·
   catalog-grouped accordion table with multi-location rollups ·
   row actions incl. "Contract this item".
   Mirrors src/pages/Inventory.tsx + Inventory.css.
   ============================================================ */

function QualityPill({
  q,
  count
}) {
  if (q == null) return /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "\u2014");
  return /*#__PURE__*/React.createElement("span", {
    className: "quality-pill"
  }, q, count > 1 && /*#__PURE__*/React.createElement("span", {
    className: "quality-pill-count"
  }, " \xD7", count));
}
function InvAccordionRow({
  it,
  expanded,
  onToggle,
  onContract
}) {
  const subs = INVENTORY_SUBROWS[it.name];
  const hasSubs = it.locs > 1 && subs;
  return /*#__PURE__*/React.createElement("div", {
    className: "acc-entry"
  }, /*#__PURE__*/React.createElement("div", {
    className: 'acc-parent' + (expanded ? ' expanded' : '')
  }, /*#__PURE__*/React.createElement("button", {
    className: 'acc-chevron' + (hasSubs ? '' : ' invisible'),
    onClick: () => hasSubs && onToggle(it.name)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 16,
    style: {
      transform: expanded ? 'rotate(90deg)' : 'none',
      transition: 'transform 160ms'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "acc-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'big-ic ' + invCatMeta(it.cat).cls,
    style: {
      width: 30,
      height: 30,
      marginRight: 10,
      flex: 'none'
    },
    title: it.cat
  }, /*#__PURE__*/React.createElement(Icon, {
    name: invCatMeta(it.cat).icon,
    size: 15
  })), it.name), /*#__PURE__*/React.createElement("div", {
    className: "acc-cat cell-muted",
    style: {
      fontSize: 'var(--text-sm)'
    }
  }, it.cat), /*#__PURE__*/React.createElement("div", {
    className: "acc-qty"
  }, it.qty, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontWeight: 400,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)'
    }
  }, it.uom)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(QualityPill, {
    q: it.quality,
    count: it.qcount
  })), /*#__PURE__*/React.createElement("div", {
    className: hasSubs ? 'acc-multi' : 'acc-location'
  }, hasSubs ? `${it.locs} locations` : it.loc), /*#__PURE__*/React.createElement("div", {
    className: "acc-date"
  }, it.updated), /*#__PURE__*/React.createElement("div", {
    className: "acc-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "row-act",
    title: "Contract this item",
    onClick: () => onContract(it)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "article",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "row-act",
    title: "Actions"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dots",
    size: 16
  })))), expanded && hasSubs && /*#__PURE__*/React.createElement("div", {
    className: "acc-subrows",
    role: "rowgroup"
  }, subs.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "acc-parent acc-subrow",
    key: i,
    style: {
      gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1fr 1fr auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-subname"
  }, s.loc), /*#__PURE__*/React.createElement("div", {
    className: "acc-cat cell-muted"
  }), /*#__PURE__*/React.createElement("div", {
    className: "acc-qty"
  }, s.qty, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontWeight: 400,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)'
    }
  }, it.uom)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(QualityPill, {
    q: s.quality,
    count: 1
  })), /*#__PURE__*/React.createElement("div", {
    className: "acc-location cell-muted"
  }), /*#__PURE__*/React.createElement("div", {
    className: "acc-date"
  }, s.updated), /*#__PURE__*/React.createElement("div", {
    className: "acc-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "row-act",
    title: "Actions"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dots",
    size: 16
  })))))));
}
function InventoryScreen() {
  const [view, setView] = useState('personal');
  const [layout, setLayout] = useState('table');
  const [density, setDensity] = useState('standard');
  const [expanded, setExpanded] = useState(new Set(['Quantanium']));
  const [contractItem, setContractItem] = useState(null);
  const isOrg = view === 'org';
  const toggle = name => setExpanded(prev => {
    const n = new Set(prev);
    n.has(name) ? n.delete(name) : n.add(name);
    return n;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "inv-page screen-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head",
    style: {
      marginBottom: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "inventory",
    size: 13
  }), " Assets ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 13
  }), " Inventory"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Inventory"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Every item, commodity and vehicle you hold \u2014 batched, located and quality-graded.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inv-seg"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-selected": !isOrg,
    onClick: () => setView('personal')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "person",
    size: 15
  }), " Personal"), /*#__PURE__*/React.createElement("button", {
    "aria-selected": isOrg,
    onClick: () => setView('org')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "members",
    size: 15
  }), " Organization")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " ", isOrg ? 'Add org item' : 'Add item'))), isOrg && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "perm-bar manage"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, "You have ", /*#__PURE__*/React.createElement("strong", null, "manage"), " rights on ", /*#__PURE__*/React.createElement("strong", null, ORGS[0].name), " inventory \u2014 add, edit and batch items."), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "inv-orgsel"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, ORGS[0].tag), " ", ORGS[0].name, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    className: "statstrip",
    style: {
      '--n': 4,
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "box",
    size: 13
  }), " Total items"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, ORG_INV_SUMMARY.totalItems.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 13
  }), " Total quantity"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, ORG_INV_SUMMARY.totalQuantity)), /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, ORG_INV_SUMMARY.cat1.name), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, ORG_INV_SUMMARY.cat1.qty)), /*#__PURE__*/React.createElement("div", {
    className: "statcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, ORG_INV_SUMMARY.cat2.name), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, ORG_INV_SUMMARY.cat2.qty)))), /*#__PURE__*/React.createElement("div", {
    className: "inv-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inv-search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search items\u2026"
  })), /*#__PURE__*/React.createElement("span", {
    className: "inv-select"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 15,
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", null, INVENTORY_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c
  }, c))), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 15,
    className: "chev"
  })), /*#__PURE__*/React.createElement("span", {
    className: "inv-select"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sort",
    size: 15,
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", null, /*#__PURE__*/React.createElement("option", null, "Recently updated"), /*#__PURE__*/React.createElement("option", null, "Name A\u2013Z"), /*#__PURE__*/React.createElement("option", null, "Quantity")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 15,
    className: "chev"
  })), /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 15
  }), " Filters"), /*#__PURE__*/React.createElement("span", {
    className: "inv-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "density-toggle"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-pressed": density === 'standard',
    onClick: () => setDensity('standard'),
    title: "Standard density"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    "aria-pressed": density === 'compact',
    onClick: () => setDensity('compact'),
    title: "Compact editor mode"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "density-toggle"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-pressed": layout === 'table',
    onClick: () => setLayout('table'),
    title: "Table view"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    "aria-pressed": layout === 'card',
    onClick: () => setLayout('card'),
    title: "Card view"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "grid",
    size: 16
  })))), density === 'compact' && /*#__PURE__*/React.createElement("div", {
    className: "inv-editor-head",
    style: {
      gridTemplateColumns: '2fr 1fr 1.5fr 0.8fr 1fr 1fr 1fr auto'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Item"), /*#__PURE__*/React.createElement("span", null, "Qty"), /*#__PURE__*/React.createElement("span", null, "Location"), /*#__PURE__*/React.createElement("span", null, "Quality"), /*#__PURE__*/React.createElement("span", null, "UoM"), /*#__PURE__*/React.createElement("span", null, "Updated"), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "grp-section single"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap",
    style: {
      borderRadius: 'var(--radius-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "inv-row-head",
    style: {
      gridTemplateColumns: '32px 2fr 1fr 1fr 0.8fr 1fr 1fr auto'
    }
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, "Item"), /*#__PURE__*/React.createElement("span", null, "Category"), /*#__PURE__*/React.createElement("span", null, "Quantity"), /*#__PURE__*/React.createElement("span", null, "Quality"), /*#__PURE__*/React.createElement("span", null, "Location"), /*#__PURE__*/React.createElement("span", null, "Updated"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    role: "rowgroup"
  }, INVENTORY.map(it => /*#__PURE__*/React.createElement(InvAccordionRow, {
    key: it.name,
    it: it,
    expanded: expanded.has(it.name),
    onToggle: toggle,
    onContract: setContractItem
  })))), /*#__PURE__*/React.createElement("div", {
    className: "inv-pager"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rpp"
  }, "Rows ", /*#__PURE__*/React.createElement("select", null, /*#__PURE__*/React.createElement("option", null, "25"), /*#__PURE__*/React.createElement("option", null, "50"))), /*#__PURE__*/React.createElement("span", null, "1\u20138 of 8"), /*#__PURE__*/React.createElement("div", {
    className: "pager"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: true
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronLeft",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    disabled: true
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 16
  }))))), contractItem && /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onClick: () => setContractItem(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "modal-title"
  }, "New contract"), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setContractItem(null)
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Title *"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    defaultValue: `Move ${contractItem.name}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Type *"), /*#__PURE__*/React.createElement("select", {
    className: "field-input",
    defaultValue: "transfer"
  }, Object.keys(CT_LABEL).map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, CT_LABEL[t])))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Item"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: contractItem.name,
    readOnly: true,
    tabIndex: -1
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Quantity to contract"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "number",
    defaultValue: contractItem.qty
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setContractItem(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setContractItem(null)
  }, "Create contract")))));
}
window.InventoryScreen = InventoryScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-inventory.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-market.jsx
try { (() => {
/* ============================================================
   STATION APP — Market (v1.1)
   Player-marketplace intelligence for the trade desk, modelled
   on the live UEX API (base https://api.uexcorp.uk/2.0):
     • marketplace_listings              → live player ads (buy/sell)
     • marketplace_prices_averages_all   → price_avg / _week / _month
     • marketplace_prices_history        → hourly price snapshots
     • marketplace_trends                → 1w / 1m / 3m trend %
     • items_prices                      → per-terminal buy/sell stats
   Views: Market (all items) · Watchlist (curated, changes weekly)
          · Compare (overlay item / category trends).
   Field names below mirror the UEX response keys so wiring the
   fetchers in loadMarket() is a drop-in swap.
   ============================================================ */
(() => {
  const ME = 'Mara Vex';
  const fmt = n => Math.round(Number(n) || 0).toLocaleString('en-US');
  const abbr = n => {
    const a = Math.abs(n || 0);
    if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (a >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(Math.round(n || 0));
  };
  const pct = n => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1) + '%';
  function Pill({
    tone,
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + (tone || 'neutral')
    }, icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 11
    }), children);
  }

  /* category → icon + tint */
  const CAT = {
    refined: {
      icon: 'diamond',
      label: 'Refined Ore',
      cls: 'mk-refined'
    },
    raw: {
      icon: 'layers',
      label: 'Raw Ore',
      cls: 'mk-raw'
    },
    component: {
      icon: 'cpu',
      label: 'Component',
      cls: 'mk-component'
    },
    weapon: {
      icon: 'crosshair',
      label: 'Weapon',
      cls: 'mk-weapon'
    },
    armor: {
      icon: 'shield',
      label: 'Armor',
      cls: 'mk-armor'
    },
    consumable: {
      icon: 'beaker',
      label: 'Consumable',
      cls: 'mk-consumable'
    }
  };
  const CAT_OPTS = Object.keys(CAT);
  const CAT_COLOR = {
    refined: '#5BD6B0',
    raw: '#7CBEF9',
    component: '#C0ADFB',
    weapon: 'var(--coral-300)',
    armor: 'var(--aqua-300)',
    consumable: 'var(--success-500)'
  };

  /* ---- mock market: [name, cat, avg, trend1w, listings, vol] ---
     The rest (history, ask/bid, low/high, 1m/3m trend) is derived
     deterministically so the dataset stays compact + realistic. */
  const RAW = [['Quantanium', 'refined', 26800, 4.2, 14, 5200], ['Bexalite', 'refined', 17400, 2.1, 9, 3100], ['Taranite', 'refined', 16100, -1.4, 7, 2400], ['Gold (refined)', 'refined', 12300, 2.1, 18, 6800], ['Laranite', 'refined', 6300, -1.8, 22, 8400], ['Agricium', 'refined', 5800, 0.6, 16, 5100], ['RMC', 'refined', 12100, 3.4, 11, 4200], ['Titanium', 'raw', 1900, -0.4, 31, 12400], ['Tungsten', 'raw', 1500, 0.9, 28, 9800], ['Iron', 'raw', 1100, -0.2, 40, 18200], ['Quartzite', 'raw', 2100, 1.2, 19, 6600], ['Size 2 QD — Bolon', 'component', 145000, 1.2, 6, 92], ['Power Plant JS-400', 'component', 92000, -2.3, 8, 130], ['Mining Laser Helix II', 'component', 88000, 5.1, 5, 78], ['Stealth Coating Voidskin', 'component', 168000, 6.4, 3, 41], ['Shield Gen — Aegis FR-86', 'component', 74000, -0.8, 9, 112], ['Ballistic Gatling Mk3', 'weapon', 64000, 0.8, 12, 240], ['Ares Inferno Gun S7', 'weapon', 210000, 6.4, 4, 56], ['FS-9 LMG Custom', 'weapon', 38000, -1.1, 15, 320], ['C788 Combat Knife', 'weapon', 9500, 0.3, 26, 540], ['Pembroke Heavy Armor', 'armor', 52000, 1.9, 10, 180], ['Morozov-SH Undersuit', 'armor', 14000, -0.5, 21, 410], ['Novikov Armor Set', 'armor', 61000, 2.7, 8, 150], ['CureLife MedPen Kit', 'consumable', 1200, 0.2, 44, 2200], ['Multitool — Pyro RYT', 'consumable', 8500, 1.4, 19, 880], ['OxyPen Canister', 'consumable', 650, -0.3, 52, 3400]];

  /* advertiser pool + UEX enum vocab (for marketplace_listings) */
  const ADVERTISERS = ['vanta', 'rookc', 'sable_ng', 'korrv', 'juno.r', 'tbrandt', 'dexm', 'halcyon', 'orbital_jim', 'nyx_trade', 'redline', 'caspian'];
  const SOURCES = ['looted', 'pledged', 'purchased_in_game', 'pirated', 'gifted'];
  const AVAIL = ['immediate', 'ready_pickup', 'on_demand', 'work_order', 'negotiable'];
  const TERMINALS = ['Port Tressler', 'Everus Harbor', 'Area18 · TDD', 'New Babbage · TDD', 'Lorville · L19', 'Grim HEX', 'CRU-L1', 'Baijini Point'];

  /* deterministic pseudo-random from string for stable history */
  function seed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h += 0x6D2B79F5;
      let t = h;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* synth individual player ads — shaped to /marketplace_listings */
  function buildListings(name, avg, count, rnd) {
    const out = [];
    const n = Math.min(count, 6 + Math.floor(rnd() * 4));
    for (let k = 0; k < n; k++) {
      const operation = rnd() > 0.32 ? 'sell' : 'buy';
      const off = (rnd() - 0.45) * 0.18; // ±~18% around avg
      const price = Math.max(1, Math.round(avg * (1 + off)));
      const quality = rnd() > 0.4 ? Math.round(500 + rnd() * 500) : null; // 0–1000
      out.push({
        id: 90000 + Math.floor(rnd() * 9000),
        operation,
        price,
        price_old: rnd() > 0.7 ? Math.round(price * (1 + (rnd() - 0.3) * 0.12)) : null,
        currency: 'UEC',
        user_username: ADVERTISERS[Math.floor(rnd() * ADVERTISERS.length)],
        location: TERMINALS[Math.floor(rnd() * TERMINALS.length)],
        source: SOURCES[Math.floor(rnd() * SOURCES.length)],
        availability: AVAIL[Math.floor(rnd() * AVAIL.length)],
        quality,
        durability: rnd() > 0.5 ? Math.round(60 + rnd() * 40) : null,
        // %
        in_stock: 1 + Math.floor(rnd() * 40),
        votes: Math.floor(rnd() * 24),
        hours_expiration: [12, 24, 48, 72, 168][Math.floor(rnd() * 5)]
      });
    }
    return out.sort((a, b) => a.price - b.price);
  }
  function buildItem(row, i) {
    const [name, cat, avg, t1w, listings, vol] = row;
    const rnd = seed(name);
    const N = 12;
    // end at avg; walk backwards applying ~weekly trend with noise
    const hist = new Array(N);
    hist[N - 1] = avg;
    for (let k = N - 2; k >= 0; k--) {
      const drift = t1w / 100 * (0.5 + rnd());
      const noise = (rnd() - 0.5) * 0.05;
      hist[k] = Math.max(1, Math.round(hist[k + 1] / (1 + drift / 4 + noise)));
    }
    const t1m = +((avg - hist[N - 5]) / hist[N - 5] * 100).toFixed(1);
    const t3m = +((avg - hist[0]) / hist[0] * 100).toFixed(1);
    const spread = 0.04 + rnd() * 0.05;
    const ads = buildListings(name, avg, listings, rnd);
    const sells = ads.filter(a => a.operation === 'sell');
    const buys = ads.filter(a => a.operation === 'buy');
    return {
      // identity (UEX: id_item / item_name / item_slug)
      id: 'MK-' + (2400 + i),
      id_item: 8400 + i,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      cat,
      // averages (UEX: /marketplace_prices_averages_all)
      avg,
      price_avg: avg,
      price_avg_week: Math.round(hist[N - 2]),
      price_avg_month: Math.round(hist[N - 5]),
      listings_count: listings,
      // current spread from live asks/bids
      ask: sells.length ? sells[0].price : Math.round(avg * (1 + spread)),
      // lowest sell ask
      bid: buys.length ? buys[buys.length - 1].price : Math.round(avg * (1 - spread)),
      // best buy offer
      low: Math.min.apply(null, hist),
      high: Math.max.apply(null, hist),
      listings,
      sells,
      buys,
      vol,
      t1w,
      t1m,
      t3m,
      history: hist,
      updated: ['2m', '5m', '11m', '18m', '24m', '40m'][i % 6] + ' ago'
    };
  }
  const MARKET = RAW.map(buildItem);
  const WATCH0 = ['Quantanium', 'Mining Laser Helix II', 'Ares Inferno Gun S7', 'RMC', 'Pembroke Heavy Armor'];
  const SOURCE_LABEL = {
    looted: 'Looted',
    pledged: 'Pledged',
    purchased_in_game: 'Bought in-game',
    pirated: 'Pirated',
    gifted: 'Gifted'
  };
  const AVAIL_LABEL = {
    immediate: 'Immediate',
    ready_pickup: 'Ready pickup',
    on_demand: 'On demand',
    work_order: 'Work order',
    negotiable: 'Negotiable'
  };

  /* =========================================================
     LINE CHART (svg) — single or multi-series
     series: [{ name, color, data:[n], norm?:bool }]
     ========================================================= */
  function LineChart({
    series,
    height = 150,
    area,
    labels
  }) {
    const W = 600,
      H = height,
      padX = 6,
      padY = 14;
    const norm = series.some(s => s.norm);
    const proc = series.map(s => norm ? s.data.map(v => v / s.data[0] * 100) : s.data);
    let min = Infinity,
      max = -Infinity;
    proc.forEach(d => d.forEach(v => {
      if (v < min) min = v;
      if (v > max) max = v;
    }));
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const span = max - min;
    const n = proc[0].length;
    const x = i => padX + i / (n - 1) * (W - padX * 2);
    const y = v => padY + (1 - (v - min) / span) * (H - padY * 2);
    const path = d => d.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
    return /*#__PURE__*/React.createElement("div", {
      className: "lchart"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: "none",
      className: "lchart-svg",
      role: "img"
    }, [0.25, 0.5, 0.75].map(g => /*#__PURE__*/React.createElement("line", {
      key: g,
      x1: padX,
      x2: W - padX,
      y1: padY + g * (H - padY * 2),
      y2: padY + g * (H - padY * 2),
      className: "lchart-grid"
    })), series.map((s, si) => /*#__PURE__*/React.createElement("g", {
      key: si
    }, area && si === 0 && /*#__PURE__*/React.createElement("path", {
      d: path(proc[si]) + ' L' + x(n - 1) + ' ' + (H - padY) + ' L' + x(0) + ' ' + (H - padY) + ' Z',
      fill: s.color,
      opacity: "0.12",
      stroke: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: path(proc[si]),
      fill: "none",
      stroke: s.color,
      strokeWidth: "2",
      strokeLinejoin: "round",
      strokeLinecap: "round",
      vectorEffect: "non-scaling-stroke"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x(n - 1),
      cy: y(proc[si][n - 1]),
      r: "3.5",
      fill: s.color
    })))), labels && /*#__PURE__*/React.createElement("div", {
      className: "lchart-x"
    }, /*#__PURE__*/React.createElement("span", null, labels[0]), /*#__PURE__*/React.createElement("span", null, labels[1])));
  }
  function TrendChip({
    v,
    label
  }) {
    const up = v >= 0;
    return /*#__PURE__*/React.createElement("span", {
      className: 'trend-chip ' + (up ? 'up' : 'down')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: up ? 'trendUp' : 'trendDown',
      size: 12
    }), pct(v), label && /*#__PURE__*/React.createElement("em", null, label));
  }

  /* =========================================================
     ITEM detail drawer
     ========================================================= */
  function ItemDrawer({
    item,
    onClose,
    watched,
    onToggleWatch
  }) {
    const [range, setRange] = React.useState('3m');
    const [op, setOp] = React.useState('sell');
    if (!item) return null;
    const c = CAT[item.cat];
    const isWatched = watched.includes(item.name);
    const slice = range === '1w' ? item.history.slice(-2) : range === '1m' ? item.history.slice(-5) : item.history;
    const rangeTrend = range === '1w' ? item.t1w : range === '1m' ? item.t1m : item.t3m;
    const color = CAT_COLOR[item.cat];
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!item,
      onClose: onClose,
      width: 500
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, item.id, " \xB7 Market item"), /*#__PURE__*/React.createElement("button", {
      className: 'd-iconbtn' + (isWatched ? ' star-on' : ''),
      onClick: () => onToggleWatch(item),
      title: isWatched ? 'In watchlist' : 'Add to watchlist',
      "aria-label": "Toggle watchlist"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 16
    })), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'd-bigic ' + c.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, item.name), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, c.label, " \xB7 updated ", item.updated))), /*#__PURE__*/React.createElement("div", {
      className: "d-metric"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "Average price"), /*#__PURE__*/React.createElement("div", {
      className: "mv"
    }, fmt(item.avg), /*#__PURE__*/React.createElement("small", null, "aUEC"))), /*#__PURE__*/React.createElement("div", {
      className: "mr"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "7-day trend"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement(TrendChip, {
      v: item.t1w
    })))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Price history"), /*#__PURE__*/React.createElement("div", {
      className: "range-seg"
    }, ['1w', '1m', '3m'].map(r => /*#__PURE__*/React.createElement("button", {
      key: r,
      className: 'range-btn' + (range === r ? ' active' : ''),
      onClick: () => setRange(r)
    }, r)))), /*#__PURE__*/React.createElement(LineChart, {
      series: [{
        name: item.name,
        color,
        data: slice
      }],
      area: true,
      labels: [range === '3m' ? '12 wks ago' : range === '1m' ? '4 wks ago' : 'last wk', 'now']
    }), /*#__PURE__*/React.createElement("div", {
      className: "chart-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "t-faint"
    }, "Range ", fmt(item.low), "\u2013", fmt(item.high)), /*#__PURE__*/React.createElement(TrendChip, {
      v: rangeTrend,
      label: 'over ' + range
    }))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Currently on the marketplace"), /*#__PURE__*/React.createElement("div", {
      className: "d-tiles"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "tag"
    }), " Lowest ask"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, abbr(item.ask), /*#__PURE__*/React.createElement("small", null, "aUEC"))), /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "coins"
    }), " Best bid"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, abbr(item.bid), /*#__PURE__*/React.createElement("small", null, "aUEC")))), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Active listings"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, item.listings, " for sale")), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Weekly volume"), /*#__PURE__*/React.createElement("span", {
      className: "v t-mono"
    }, fmt(item.vol), " units")), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Spread"), /*#__PURE__*/React.createElement("span", {
      className: "v t-mono"
    }, fmt(item.ask - item.bid), " aUEC"))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Player listings"), /*#__PURE__*/React.createElement("div", {
      className: "range-seg"
    }, /*#__PURE__*/React.createElement("button", {
      className: 'range-btn' + (op === 'sell' ? ' active' : ''),
      onClick: () => setOp('sell')
    }, "Sell ", item.sells.length), /*#__PURE__*/React.createElement("button", {
      className: 'range-btn' + (op === 'buy' ? ' active' : ''),
      onClick: () => setOp('buy')
    }, "Buy ", item.buys.length))), (op === 'sell' ? item.sells : item.buys).length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "t-muted",
      style: {
        fontSize: 'var(--text-sm)',
        margin: '4px 0 0'
      }
    }, "No active ", op, " listings right now.") : (op === 'sell' ? item.sells : item.buys).map(l => /*#__PURE__*/React.createElement("div", {
      className: "listing-row",
      key: l.id
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: l.user_username,
      size: 28
    }), /*#__PURE__*/React.createElement("div", {
      className: "lr-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lr-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lr-user"
    }, l.user_username), l.quality != null && /*#__PURE__*/React.createElement("span", {
      className: "lr-q",
      title: "Quality"
    }, "Q", l.quality), l.durability != null && /*#__PURE__*/React.createElement("span", {
      className: "lr-dur",
      title: "Durability"
    }, l.durability, "%")), /*#__PURE__*/React.createElement("div", {
      className: "lr-meta"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mapPin",
      size: 11
    }), l.location, " \xB7 ", SOURCE_LABEL[l.source], " \xB7 ", AVAIL_LABEL[l.availability])), /*#__PURE__*/React.createElement("div", {
      className: "lr-price"
    }, fmt(l.price), /*#__PURE__*/React.createElement("span", null, l.currency), l.price_old && /*#__PURE__*/React.createElement("em", null, fmt(l.price_old))))), /*#__PURE__*/React.createElement("div", {
      className: "listing-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 12
    }), " Live player ads \xB7 prices per unit, realtime from UEX")), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Trends"), /*#__PURE__*/React.createElement("div", {
      className: "trend-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "trend-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tcl"
    }, "1 week"), /*#__PURE__*/React.createElement(TrendChip, {
      v: item.t1w
    })), /*#__PURE__*/React.createElement("div", {
      className: "trend-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tcl"
    }, "1 month"), /*#__PURE__*/React.createElement(TrendChip, {
      v: item.t1m
    })), /*#__PURE__*/React.createElement("div", {
      className: "trend-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tcl"
    }, "3 months"), /*#__PURE__*/React.createElement(TrendChip, {
      v: item.t3m
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, /*#__PURE__*/React.createElement("button", {
      className: 'btn ' + (isWatched ? 'btn-ghost' : 'btn-primary'),
      onClick: () => onToggleWatch(item)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 15
    }), " ", isWatched ? 'Remove from watchlist' : 'Add to watchlist')));
  }

  /* =========================================================
     COMPARE view
     ========================================================= */
  const SERIES_COLORS = ['var(--coral-300)', 'var(--aqua-300)', '#5BD6B0', '#C0ADFB', 'var(--warning-500)'];
  function CompareView({
    items
  }) {
    const [picked, setPicked] = React.useState(() => MARKET.filter(m => ['Quantanium', 'RMC', 'Gold (refined)'].includes(m.name)));
    const [q, setQ] = React.useState('');
    const toggle = it => setPicked(p => p.find(x => x.id === it.id) ? p.filter(x => x.id !== it.id) : p.length >= 5 ? p : [...p, it]);
    const opts = items.filter(m => !q || m.name.toLowerCase().includes(q.toLowerCase()));
    const series = picked.map((p, i) => ({
      name: p.name,
      color: SERIES_COLORS[i % 5],
      data: p.history,
      norm: true
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "compare-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "compare-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panel compare-chart-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-cap",
      style: {
        padding: '0 0 var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Indexed price \xB7 12 weeks (start = 100)")), picked.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: "activity",
      title: "Pick items to compare",
      text: "Select up to five items or commodities from the list to overlay their price trends."
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LineChart, {
      series: series,
      height: 220,
      labels: ['12 wks ago', 'now']
    }), /*#__PURE__*/React.createElement("div", {
      className: "legend"
    }, picked.map((p, i) => /*#__PURE__*/React.createElement("span", {
      className: "legend-item",
      key: p.id
    }, /*#__PURE__*/React.createElement("span", {
      className: "legend-dot",
      style: {
        background: SERIES_COLORS[i % 5]
      }
    }), p.name, /*#__PURE__*/React.createElement("button", {
      onClick: () => toggle(p),
      "aria-label": 'Remove ' + p.name
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 12
    }))))))), picked.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap"
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Comparison"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Avg"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "1w"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "1m"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "3m"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Listings"))), /*#__PURE__*/React.createElement("tbody", null, picked.map((p, i) => /*#__PURE__*/React.createElement("tr", {
      key: p.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "ent"
    }, /*#__PURE__*/React.createElement("span", {
      className: "legend-dot",
      style: {
        background: SERIES_COLORS[i % 5],
        width: 10,
        height: 10
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "ent-nm",
      style: {
        marginLeft: 8
      }
    }, p.name))), /*#__PURE__*/React.createElement("td", {
      className: "num t-mono"
    }, fmt(p.avg)), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, /*#__PURE__*/React.createElement(TrendChip, {
      v: p.t1w
    })), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, /*#__PURE__*/React.createElement(TrendChip, {
      v: p.t1m
    })), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, /*#__PURE__*/React.createElement(TrendChip, {
      v: p.t3m
    })), /*#__PURE__*/React.createElement("td", {
      className: "num t-mono"
    }, p.listings))))))), /*#__PURE__*/React.createElement("aside", {
      className: "compare-picker"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cp-search"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    }), /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Add item\u2026"
    })), /*#__PURE__*/React.createElement("div", {
      className: "cp-list"
    }, opts.map(m => {
      const on = !!picked.find(x => x.id === m.id);
      const c = CAT[m.cat];
      return /*#__PURE__*/React.createElement("button", {
        key: m.id,
        className: 'cp-row' + (on ? ' on' : ''),
        onClick: () => toggle(m),
        disabled: !on && picked.length >= 5
      }, /*#__PURE__*/React.createElement("span", {
        className: 'big-ic ' + c.cls,
        style: {
          width: 28,
          height: 28
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: c.icon,
        size: 13
      })), /*#__PURE__*/React.createElement("span", {
        className: "cp-nm"
      }, m.name), /*#__PURE__*/React.createElement("span", {
        className: 'cp-check' + (on ? ' on' : '')
      }, on && /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 12
      })));
    }))));
  }

  /* =========================================================
     PAGE
     ========================================================= */
  function MarketScreen() {
    const [view, setView] = React.useState('market');
    const [cat, setCat] = React.useState('all');
    const [q, setQ] = React.useState('');
    const [sort, setSort] = React.useState('name');
    const [openId, setOpenId] = React.useState(null);
    const [watched, setWatched] = React.useState(WATCH0);
    const open = openId ? MARKET.find(m => m.id === openId) : null;
    const scoped = view === 'watch' ? MARKET.filter(m => watched.includes(m.name)) : MARKET;
    let visible = scoped.filter(m => (cat === 'all' || m.cat === cat) && (!q || m.name.toLowerCase().includes(q.toLowerCase())));
    visible = visible.slice().sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'price' ? b.avg - a.avg : sort === 'trend' ? b.t1w - a.t1w : b.listings - a.listings);
    const catCount = c => scoped.filter(m => c === 'all' || m.cat === c).length;
    const gainers = MARKET.filter(m => m.t1w > 0).length;
    const topGain = MARKET.slice().sort((a, b) => b.t1w - a.t1w)[0];
    const topDrop = MARKET.slice().sort((a, b) => a.t1w - b.t1w)[0];
    const totalListings = MARKET.reduce((s, m) => s + m.listings, 0);
    const toggleWatch = async it => {
      if (watched.includes(it.name)) {
        if (!(await window.confirmAction({
          title: 'Remove “' + it.name + '” from the watchlist?',
          body: 'It will drop off the trade-desk watchlist.',
          confirmLabel: 'Remove',
          tone: 'danger',
          icon: 'star'
        }))) return;
        setWatched(w => w.filter(n => n !== it.name));
        window.toast('Removed from watchlist', 'star');
      } else {
        setWatched(w => [...w, it.name]);
        window.toast('Added to watchlist', 'star');
      }
    };
    const clearWatch = async () => {
      if (!(await window.confirmAction({
        title: 'Clear the whole watchlist?',
        body: 'Removes all ' + watched.length + ' items. You can rebuild it any time.',
        confirmLabel: 'Clear watchlist',
        tone: 'danger',
        icon: 'trash',
        requireText: 'CLEAR'
      }))) return;
      setWatched([]);
      window.toast('Watchlist cleared', 'trash');
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "crumb"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "coins"
    }), " Assets ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight"
    }), " Market"), /*#__PURE__*/React.createElement("h1", {
      className: "page-title"
    }, "Market"), /*#__PURE__*/React.createElement("p", {
      className: "page-sub"
    }, "Live player-marketplace prices, history and trends from UEX. Curate a watchlist for the trade desk, see what\u2019s selling and for how much, and compare how items or categories are moving.")), /*#__PURE__*/React.createElement("div", {
      className: "page-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => window.toast('Refreshed from UEX', 'rotateCcw')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCcw",
      size: 15
    }), " Refresh"))), /*#__PURE__*/React.createElement("div", {
      className: "scope-row"
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "View",
      value: view,
      onChange: v => {
        setView(v);
        setCat('all');
      },
      options: [{
        value: 'market',
        label: 'Market',
        icon: 'coins'
      }, {
        value: 'watch',
        label: 'Watchlist',
        icon: 'star',
        count: watched.length
      }, {
        value: 'compare',
        label: 'Compare',
        icon: 'activity'
      }]
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), view !== 'compare' && /*#__PURE__*/React.createElement("div", {
      className: "bp-search"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    }), /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Search items\u2026"
    }))), /*#__PURE__*/React.createElement(window.StatStrip, {
      items: [{
        k: 'Tracked items',
        icon: 'coins',
        v: MARKET.length,
        d: 'across ' + CAT_OPTS.length + ' categories'
      }, {
        k: 'Top gainer (1w)',
        icon: 'trendUp',
        v: pct(topGain.t1w),
        d: topGain.name,
        tone: 'up'
      }, {
        k: 'Top drop (1w)',
        icon: 'trendDown',
        v: pct(topDrop.t1w),
        d: topDrop.name,
        tone: 'warn'
      }, {
        k: 'Active listings',
        icon: 'tag',
        v: fmt(totalListings),
        d: 'on the marketplace'
      }]
    }), view === 'compare' ? /*#__PURE__*/React.createElement(CompareView, {
      items: MARKET
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "toolbar-row",
      style: {
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Category",
      value: cat,
      onChange: setCat,
      options: [{
        value: 'all',
        label: 'All',
        count: catCount('all')
      }].concat(CAT_OPTS.filter(c => catCount(c) > 0).map(c => ({
        value: c,
        label: CAT[c].label,
        icon: CAT[c].icon,
        count: catCount(c)
      })))
    }), /*#__PURE__*/React.createElement("div", {
      className: "sort-wrap"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sort",
      size: 14
    }), /*#__PURE__*/React.createElement("select", {
      className: "fld sort-sel",
      value: sort,
      onChange: e => setSort(e.target.value),
      "aria-label": "Sort"
    }, /*#__PURE__*/React.createElement("option", {
      value: "name"
    }, "Name"), /*#__PURE__*/React.createElement("option", {
      value: "price"
    }, "Price"), /*#__PURE__*/React.createElement("option", {
      value: "trend"
    }, "Trend"), /*#__PURE__*/React.createElement("option", {
      value: "listings"
    }, "Listings")))), view === 'watch' && watched.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "watch-bar"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 14
    }), " Trade-desk watchlist \xB7 ", watched.length, " items ", /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement("button", {
      className: "link-btn",
      onClick: clearWatch
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 13
    }), " Clear")), visible.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: view === 'watch' ? 'star' : 'coins',
      title: view === 'watch' ? 'Watchlist is empty' : 'No items match',
      text: view === 'watch' ? 'Star items from the market to track them here — the list is yours to curate week to week.' : 'Try a different category or search.'
    }) : /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap",
      style: {
        marginTop: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Market items"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Avg price"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Ask / Bid"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "1w"), /*#__PURE__*/React.createElement("th", null, "12-wk"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Listings"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, visible.map(m => {
      const c = CAT[m.cat];
      return /*#__PURE__*/React.createElement("tr", {
        key: m.id,
        onClick: () => setOpenId(m.id),
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: 'ent-ic big-ic ' + c.cls
      }, /*#__PURE__*/React.createElement(Icon, {
        name: c.icon,
        size: 16
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, watched.includes(m.name) && /*#__PURE__*/React.createElement(Icon, {
        name: "star",
        size: 11,
        style: {
          color: 'var(--warning-500)',
          marginRight: 4,
          verticalAlign: '-1px'
        }
      }), m.name), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, m.id)))), /*#__PURE__*/React.createElement("td", {
        className: "t-muted"
      }, c.label), /*#__PURE__*/React.createElement("td", {
        className: "num t-mono"
      }, fmt(m.avg)), /*#__PURE__*/React.createElement("td", {
        className: "num t-mono",
        style: {
          fontSize: 'var(--text-xs)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)'
        }
      }, abbr(m.ask)), " / ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-faint)'
        }
      }, abbr(m.bid))), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(TrendChip, {
        v: m.t1w
      })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        className: "row-spark"
      }, /*#__PURE__*/React.createElement(LineChart, {
        series: [{
          name: m.name,
          color: m.t3m >= 0 ? 'var(--success-500)' : 'var(--coral-400)',
          data: m.history
        }],
        height: 34
      }))), /*#__PURE__*/React.createElement("td", {
        className: "num t-mono"
      }, m.listings), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "list-hint"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open item \xB7 prices via UEX ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, visible.length, " items")))), open && /*#__PURE__*/React.createElement(ItemDrawer, {
      item: open,
      onClose: () => setOpenId(null),
      watched: watched,
      onToggleWatch: toggleWatch
    }));
  }
  window.MarketScreen = MarketScreen;
  window.MarketData = {
    list: MARKET,
    CAT,
    watch: WATCH0,
    fmt,
    abbr,
    pct,
    CAT_COLOR
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-market.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-overview.jsx
try { (() => {
/* ============================================================
   STATION APP — Overview / "What's New" (design-doc landing)
   Snapshot of what the app is today: new feature areas, the
   screen index, the design system in play, shell capabilities,
   and the review scope.
   ============================================================ */

const OV_SCREENS = [{
  id: 'dashboard',
  icon: 'dashboard',
  name: 'Dashboard',
  badge: 'reworked',
  d: 'Customizable portlet grid — drag to arrange by playstyle; compact/standard/full sizes.'
}, {
  id: 'inventory',
  icon: 'inventory',
  name: 'Inventory',
  badge: 'v0.3.0',
  d: 'Personal & org inventory: catalog items, batches, locations, quality, inline editor.'
}, {
  id: 'contracts',
  icon: 'contracts',
  name: 'Contracts',
  badge: 'v0.4.0',
  d: '7 contract types, 7-state lifecycle, parties, rewards, milestones, detail drawer.'
}, {
  id: 'hr',
  icon: 'members',
  name: 'Human Resources',
  badge: 'new',
  d: 'Roster + org-structure hub bringing Members and Business Units together.'
}, {
  id: 'members',
  icon: 'members',
  name: 'Members',
  badge: 'new',
  d: 'Org roster with unit assignment, account lock/unlock, session control.'
}, {
  id: 'business-units',
  icon: 'tree',
  name: 'Business Units',
  badge: 'new',
  d: 'Hierarchical divisions/departments/teams/squads with CRUD.'
}, {
  id: 'profile',
  icon: 'person',
  name: 'My Profile',
  d: 'Identity, bio, organizations, and account security.'
}, {
  id: 'admin-invites',
  icon: 'userPlus',
  name: 'Invite Management',
  badge: 'admin',
  d: 'Super-admin: generate and revoke single-use alpha invites.'
}];
function OverviewScreen({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-root ov-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-kicker"
  }, "Station design review ", /*#__PURE__*/React.createElement("span", {
    className: "ov-ver-chip"
  }, "updated \xB7 ", new Date().getFullYear())), /*#__PURE__*/React.createElement("h1", {
    className: "ov-h1"
  }, "Station, as it stands today"), /*#__PURE__*/React.createElement("p", {
    className: "ov-lede"
  }, "A refreshed walkthrough of the live app \u2014 every screen that's been built or reworked since the original design, rendered hi-fi against the current Presstronic tokens."), /*#__PURE__*/React.createElement("div", {
    className: "ov-hero-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("b", null, "8"), " screens in scope"), /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("b", null, "2"), " MVP feature areas shipped"), /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("b", null, "1"), " customizable dashboard"), /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("b", null, "\u2318K"), " command palette + theming"))), /*#__PURE__*/React.createElement("div", {
    className: "ov-section-cap"
  }, "What's new since the original design"), /*#__PURE__*/React.createElement("div", {
    className: "ov-new-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-new"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-new-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "inventory",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-title"
  }, "Inventory"), /*#__PURE__*/React.createElement("div", {
    className: "ov-new-tag"
  }, "v0.3.0 \xB7 Inventory MVP"))), /*#__PURE__*/React.createElement("p", null, "A full catalog-driven inventory for personal and organization holdings \u2014 items, commodities and vehicles, each with quantity, units of measure, quality grade and physical location."), /*#__PURE__*/React.createElement("div", {
    className: "ov-feat"
  }, /*#__PURE__*/React.createElement("span", null, "Personal \u21C4 Org"), /*#__PURE__*/React.createElement("span", null, "Catalog + categories"), /*#__PURE__*/React.createElement("span", null, "Batches"), /*#__PURE__*/React.createElement("span", null, "Locations"), /*#__PURE__*/React.createElement("span", null, "Quality 0\u20131000"), /*#__PURE__*/React.createElement("span", null, "Inline editor"), /*#__PURE__*/React.createElement("span", null, "Permission-gated"), /*#__PURE__*/React.createElement("span", null, "\u2192 Contract item"))), /*#__PURE__*/React.createElement("div", {
    className: "ov-new"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-new-ic warm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "contracts",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-title"
  }, "Contracts"), /*#__PURE__*/React.createElement("div", {
    className: "ov-new-tag"
  }, "v0.4.0 \xB7 Contracts MVP"))), /*#__PURE__*/React.createElement("p", null, "Org service contracts spanning every discipline, with a full draft \u2192 open \u2192 claimed \u2192 active \u2192 completed lifecycle, assignable parties, aUEC rewards and progress milestones."), /*#__PURE__*/React.createElement("div", {
    className: "ov-feat"
  }, /*#__PURE__*/React.createElement("span", null, "7 types"), /*#__PURE__*/React.createElement("span", null, "7-state lifecycle"), /*#__PURE__*/React.createElement("span", null, "Parties"), /*#__PURE__*/React.createElement("span", null, "Rewards (aUEC)"), /*#__PURE__*/React.createElement("span", null, "Risk + deadline"), /*#__PURE__*/React.createElement("span", null, "Milestones"), /*#__PURE__*/React.createElement("span", null, "Type-specific fields"), /*#__PURE__*/React.createElement("span", null, "Detail drawer"))), /*#__PURE__*/React.createElement("div", {
    className: "ov-new"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-new-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "members",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-title"
  }, "Human Resources"), /*#__PURE__*/React.createElement("div", {
    className: "ov-new-tag"
  }, "new nav group"))), /*#__PURE__*/React.createElement("p", null, "A dedicated HR area: a roster hub, a full Members table with per-member administration, and a hierarchical Business Units tree used across the app (e.g. assigning contracts to a division)."), /*#__PURE__*/React.createElement("div", {
    className: "ov-feat"
  }, /*#__PURE__*/React.createElement("span", null, "HR hub"), /*#__PURE__*/React.createElement("span", null, "Members table"), /*#__PURE__*/React.createElement("span", null, "Unit assignment"), /*#__PURE__*/React.createElement("span", null, "Lock / unlock"), /*#__PURE__*/React.createElement("span", null, "BU tree"), /*#__PURE__*/React.createElement("span", null, "6 unit kinds"))), /*#__PURE__*/React.createElement("div", {
    className: "ov-new"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-new-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dashboard",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ov-new-title"
  }, "Customizable dashboard + shell"), /*#__PURE__*/React.createElement("div", {
    className: "ov-new-tag"
  }, "reworked"))), /*#__PURE__*/React.createElement("p", null, "The dashboard is now a drag-to-arrange widget grid that adapts to playstyle. The shell gained a multi-org switcher, a \u2318K command palette, keyboard navigation, and light/dark + accent theming."), /*#__PURE__*/React.createElement("div", {
    className: "ov-feat"
  }, /*#__PURE__*/React.createElement("span", null, "Widget grid"), /*#__PURE__*/React.createElement("span", null, "Org switcher"), /*#__PURE__*/React.createElement("span", null, "\u2318K palette"), /*#__PURE__*/React.createElement("span", null, "Keyboard help"), /*#__PURE__*/React.createElement("span", null, "Light / dark"), /*#__PURE__*/React.createElement("span", null, "Accent toggle")))), /*#__PURE__*/React.createElement("div", {
    className: "ov-section-cap"
  }, "Screens in scope"), /*#__PURE__*/React.createElement("div", {
    className: "ov-screens"
  }, OV_SCREENS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: "ov-screen",
    onClick: () => onNavigate(s.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-screen-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "ov-screen-nm"
  }, s.name, " ", /*#__PURE__*/React.createElement("span", {
    className: "go"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowRight",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ov-screen-d"
  }, s.d), s.badge && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "ov-screen-badge"
  }, s.badge))))), /*#__PURE__*/React.createElement("div", {
    className: "ov-section-cap"
  }, "Foundations"), /*#__PURE__*/React.createElement("div", {
    className: "ov-two"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-panel"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 16
  }), " Design system in play"), /*#__PURE__*/React.createElement("div", {
    className: "ov-swatches"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ov-sw",
    style: {
      background: 'linear-gradient(140deg,#3D8FC4,#246390)'
    }
  }, "brand"), /*#__PURE__*/React.createElement("div", {
    className: "ov-sw",
    style: {
      background: '#F9545B'
    }
  }, "warm"), /*#__PURE__*/React.createElement("div", {
    className: "ov-sw",
    style: {
      background: '#14304A'
    }
  }, "card"), /*#__PURE__*/React.createElement("div", {
    className: "ov-sw",
    style: {
      background: '#1A2731'
    }
  }, "page"), /*#__PURE__*/React.createElement("div", {
    className: "ov-sw",
    style: {
      background: '#1F8A5B'
    }
  }, "success")), /*#__PURE__*/React.createElement("div", {
    className: "ov-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-li-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Presstronic tokens"), " \u2014 cornflower/Deepwater blue primary, coral reserved as the warm accent. Dark \"mission control\" theme by default.")), /*#__PURE__*/React.createElement("div", {
    className: "ov-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-li-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Type:"), " Space Grotesk (display), Hanken Grotesk (UI), JetBrains Mono (data & labels).")), /*#__PURE__*/React.createElement("div", {
    className: "ov-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-li-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Built on MUI"), " with the tokens exposed as CSS variables \u2014 utility classes (", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11
    }
  }, ".panel \xB7 .dtable \xB7 .chip-badge \xB7 .statstrip"), ") carry the visual language."))), /*#__PURE__*/React.createElement("div", {
    className: "ov-panel"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "command",
    size: 16
  }), " Shell capabilities"), /*#__PURE__*/React.createElement("div", {
    className: "ov-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-li-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "members",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Multi-org switcher"), " \u2014 prioritise organizations; the active org scopes inventory, contracts and HR. ", /*#__PURE__*/React.createElement("i", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "Open it from the sidebar header."))), /*#__PURE__*/React.createElement("div", {
    className: "ov-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-li-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "command",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Command palette"), " \u2014 ", /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      border: '1px solid var(--border-default)',
      borderRadius: 4,
      padding: '1px 5px'
    }
  }, "\u2318K"), " to jump anywhere or change settings.")), /*#__PURE__*/React.createElement("div", {
    className: "ov-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-li-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "keyboard",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Keyboard navigation"), " \u2014 ", /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      border: '1px solid var(--border-default)',
      borderRadius: 4,
      padding: '1px 5px'
    }
  }, "?"), " for the shortcut map; g-key jumps per page.")), /*#__PURE__*/React.createElement("div", {
    className: "ov-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ov-li-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sun",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Theming"), " \u2014 light/dark and aqua/coral accent toggles live in the app bar. Try them top-right.")))), /*#__PURE__*/React.createElement("div", {
    className: "ov-scope"
  }, /*#__PURE__*/React.createElement("span", {
    className: "i"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 18
  })), /*#__PURE__*/React.createElement("p", null, "This review covers the worked areas only. ", /*#__PURE__*/React.createElement("b", null, "Work Orders, Fleet, and Treasury are intentionally excluded"), " \u2014 they're stubbed in the live app and appear here as \u201Csoon\u201D items in the sidebar. Everything else reflects what's actually built today.")));
}
window.OverviewScreen = OverviewScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-overview.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-profile.jsx
try { (() => {
/* ============================================================
   STATION APP — Profile + Invite Management
   Profile: hero banner, quick stats, bio + identity panels,
   organizations list, account & security (locked fields).
   Invite Management (super-admin): generate + table of invites.
   Mirrors Profile.tsx / AdminInvites.tsx.
   ============================================================ */

function ExportDataModal({
  email,
  onClose
}) {
  const [done, setDone] = useState(false);
  const INCLUDED = ['Account — username, email, name, phone', 'Profile — bio, avatar, linked Discord handle', 'Organizations — memberships, roles, business-unit assignments', 'Inventory — your personal items, batches and locations', 'Contracts — contracts you created or are party to', 'Activity — sessions and security events tied to you'];
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "modal-title"
  }, done ? 'Export requested' : 'Export your data'), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose
  }, "\u2715")), done ? /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "data-modal-success"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-success-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-success-title"
  }, "Check your inbox"), /*#__PURE__*/React.createElement("p", {
    className: "dm-success-text"
  }, "We're assembling your data now. A secure, single-use download link will arrive at ", /*#__PURE__*/React.createElement("strong", null, email), " shortly \u2014 and always within 30 days, as required by GDPR Art. 12."))) : /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "data-modal-lede"
  }, "We'll package a machine-readable copy (JSON) of everything we hold about you and email you a secure download link. This covers your ", /*#__PURE__*/React.createElement("strong", null, "right of access"), " and ", /*#__PURE__*/React.createElement("strong", null, "right to data portability"), "."), /*#__PURE__*/React.createElement("div", {
    className: "data-modal-cap"
  }, "What's included"), /*#__PURE__*/React.createElement("ul", {
    className: "data-modal-list"
  }, INCLUDED.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " ", i))), /*#__PURE__*/React.createElement("div", {
    className: "field-row",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), " Confirm your password to continue"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement("span", {
    className: "field-hint"
  }, "We verify identity before sending data, to keep your account safe."))), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, done ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: onClose
  }, "Done") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 15
  }), " Request export")))));
}
function DeleteAccountModal({
  username,
  onClose
}) {
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const match = confirm.trim().toLowerCase() === username.toLowerCase();
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "modal-title"
  }, done ? 'Deletion scheduled' : 'Delete your account'), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose
  }, "\u2715")), done ? /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "data-modal-success"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-success-ic danger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-success-title"
  }, "Your account is deactivated"), /*#__PURE__*/React.createElement("p", {
    className: "dm-success-text"
  }, "You have a ", /*#__PURE__*/React.createElement("strong", null, "30-day grace period"), " to cancel by signing back in. After that, your personal data is permanently erased, org-owned records are anonymized, logs are pseudonymized, and backups purge on their next rotation. We'll email a confirmation when erasure completes."))) : /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "data-modal-warn"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alertTriangle",
    size: 18
  })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "This cannot be undone after the grace period."), " Deleting your account exercises your right to erasure under GDPR Art. 17.")), /*#__PURE__*/React.createElement("div", {
    className: "data-modal-cap"
  }, "What happens"), /*#__PURE__*/React.createElement("ul", {
    className: "data-modal-list tight"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Icon, {
    name: "circleDot",
    size: 13
  }), " Your account is ", /*#__PURE__*/React.createElement("strong", null, "deactivated immediately"), "; sessions are revoked."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Icon, {
    name: "circleDot",
    size: 13
  }), " A ", /*#__PURE__*/React.createElement("strong", null, "30-day grace window"), " lets you cancel by signing in again."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Icon, {
    name: "circleDot",
    size: 13
  }), " Then personal data is ", /*#__PURE__*/React.createElement("strong", null, "hard-deleted"), "; org-owned contracts & history are reassigned to a \u201CDeleted user\u201D tombstone."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Icon, {
    name: "circleDot",
    size: 13
  }), " Logs are ", /*#__PURE__*/React.createElement("strong", null, "pseudonymized"), " and aged out; backups are purged on rotation.")), /*#__PURE__*/React.createElement("div", {
    className: "field-row",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Type your username ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-mono)'
    }
  }, username), " to confirm"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: confirm,
    onChange: e => setConfirm(e.target.value),
    placeholder: username,
    autoFocus: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, done ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: onClose
  }, "Close") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn-danger-solid",
    disabled: !match,
    onClick: () => match && setDone(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 15
  }), " Permanently delete")))));
}
function ProfileScreen() {
  const [editing, setEditing] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const u = CURRENT_USER;
  const fullName = `${u.firstName} ${u.lastName}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "person",
    size: 13
  }), " Account \u203A My Profile"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "My Profile"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Your identity across Station \u2014 in-game name, bio, and the organizations you belong to.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, editing ? /*#__PURE__*/React.createElement("div", {
    className: "pf-savebar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hint"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circleDot",
    size: 14
  }), " Unsaved changes"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setEditing(false)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setEditing(false)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save",
    size: 15
  }), " Save changes")) : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setEditing(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 15
  }), " Edit profile ", /*#__PURE__*/React.createElement("kbd", {
    style: {
      marginLeft: 6,
      fontSize: 10,
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 3,
      padding: '1px 5px',
      fontFamily: 'var(--font-mono)',
      color: 'rgba(255,255,255,0.7)'
    }
  }, "e")))), /*#__PURE__*/React.createElement("div", {
    className: "pf-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-av"
  }, u.initial), /*#__PURE__*/React.createElement("div", {
    className: "pf-id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-name"
  }, fullName, /*#__PURE__*/React.createElement("span", {
    className: "rank member"
  }, "Member")), /*#__PURE__*/React.createElement("div", {
    className: "pf-handle"
  }, /*#__PURE__*/React.createElement("span", null, "@", u.username), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, fullName)), /*#__PURE__*/React.createElement("div", {
    className: "pf-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mi"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "members",
    size: 13
  }), " ", ORGS[0].name), /*#__PURE__*/React.createElement("span", {
    className: "mi"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 13
  }), " Station member")))), /*#__PURE__*/React.createElement("div", {
    className: "pf-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, ORGS.length), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Organizations")), /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "37"), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Ops attended")), /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "214"), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Hours logged")), /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "Active"), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Status")))), /*#__PURE__*/React.createElement("div", {
    className: "pf-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "article",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "About")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, editing ? /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, "Bio"), /*#__PURE__*/React.createElement("textarea", {
    defaultValue: u.bio,
    style: {
      minHeight: 150
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "charcount"
  }, u.bio.length, "/500")) : /*#__PURE__*/React.createElement("div", {
    className: "pf-bio"
  }, u.bio))), /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "person",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Identity & contact")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, "First name"), /*#__PURE__*/React.createElement("input", {
    defaultValue: u.firstName
  })), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, "Last name"), /*#__PURE__*/React.createElement("input", {
    defaultValue: u.lastName
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, "Phone number"), /*#__PURE__*/React.createElement("input", {
    defaultValue: u.phone
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Real name"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, fullName)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Phone"), /*#__PURE__*/React.createElement("span", {
    className: "v mono"
  }, u.phone)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "members",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Organizations"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, ORGS.length)), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, ORGS.map(o => /*#__PURE__*/React.createElement("div", {
    className: "org-card",
    key: o.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "org-logo"
  }, o.tag), /*#__PURE__*/React.createElement("div", {
    className: "org-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "org-nm"
  }, o.name), /*#__PURE__*/React.createElement("div", {
    className: "org-meta"
  }, o.role, " \xB7 ", o.members, " members")))))), /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Account & security")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), " Station username"), /*#__PURE__*/React.createElement("div", {
    className: "locked-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lv"
  }, u.username), /*#__PURE__*/React.createElement("span", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), " Permanent"))), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), " Email"), /*#__PURE__*/React.createElement("div", {
    className: "locked-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lv"
  }, u.email), /*#__PURE__*/React.createElement("span", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), " Verified"))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      width: '100%',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "key",
    size: 15
  }), " Change password"), /*#__PURE__*/React.createElement("div", {
    className: "sec-note"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14
  }), " Your username and email are tied to your Station account and can't be changed here."))))), /*#__PURE__*/React.createElement("div", {
    className: "panel pf-data-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "database",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Privacy & your data"), /*#__PURE__*/React.createElement("span", {
    className: "pf-gdpr-tag"
  }, "GDPR")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "data-right-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dr-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "dr-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dr-title"
  }, "Export my data"), /*#__PURE__*/React.createElement("div", {
    className: "dr-desc"
  }, "Download a machine-readable copy of everything Station holds about you \u2014 profile, organizations, inventory and contracts."), /*#__PURE__*/React.createElement("div", {
    className: "dr-cite"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 11
  }), " Right of access & portability \xB7 GDPR Art. 15 & 20")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setExportOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 15
  }), " Request export")), /*#__PURE__*/React.createElement("div", {
    className: "data-right-row danger"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dr-ic danger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "dr-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dr-title"
  }, "Delete my account"), /*#__PURE__*/React.createElement("div", {
    className: "dr-desc"
  }, "Permanently erase your account and personal data. Org-owned records are anonymized; logs are pseudonymized and aged out; backups purge on rotation."), /*#__PURE__*/React.createElement("div", {
    className: "dr-cite"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 11
  }), " Right to erasure (\u201Cright to be forgotten\u201D) \xB7 GDPR Art. 17")), /*#__PURE__*/React.createElement("button", {
    className: "btn-danger-outline",
    onClick: () => setDeleteOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 15
  }), " Delete account")), /*#__PURE__*/React.createElement("div", {
    className: "sec-note"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14
  }), " We verify your identity first, then complete requests within 30 days \u2014 usually much sooner. Questions? ", /*#__PURE__*/React.createElement("a", {
    href: "../legal/Privacy Policy.html",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: 'var(--brand)'
    }
  }, "privacy@station.app")))), exportOpen && /*#__PURE__*/React.createElement(ExportDataModal, {
    email: u.email,
    onClose: () => setExportOpen(false)
  }), deleteOpen && /*#__PURE__*/React.createElement(DeleteAccountModal, {
    username: u.username,
    onClose: () => setDeleteOpen(false)
  }));
}

// ---------- INVITE MANAGEMENT ----------
const INVITE_CHIP = {
  Pending: 'success',
  Used: 'neutral',
  Expired: 'warm',
  Revoked: 'warm'
};
function AdminInvitesScreen() {
  const [generated, setGenerated] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "userPlus",
    size: 13
  }), " Super Admin ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 13
  }), " Invites"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Invite Management"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Generate single-use invite links for the closed alpha. Links expire after 14 days.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setGenerated(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " Generate invite"))), generated && /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      marginBottom: 'var(--space-5)',
      borderColor: 'var(--border-brand)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-body",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "checkCircle",
    size: 18,
    style: {
      color: 'var(--success-500)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-strong)',
      marginBottom: 4
    }
  }, "Invite generated \u2014 copy this link, it won't be shown again."), /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--brand)'
    }
  }, "https://station.app/register?invite=9f1c-a3f9-1c08-4471")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 15
  }), " Copy"))), /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Token"), /*#__PURE__*/React.createElement("th", null, "Created"), /*#__PURE__*/React.createElement("th", null, "Expires"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Used by"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }))), /*#__PURE__*/React.createElement("tbody", null, INVITES.map(iv => /*#__PURE__*/React.createElement("tr", {
    key: iv.token
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-body)'
    }
  }, iv.token, "\u2026"), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, iv.created), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, iv.expires), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'chip-badge ' + INVITE_CHIP[iv.status]
  }, iv.status)), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, iv.usedBy === '—' ? '—' : '@' + iv.usedBy), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, iv.status === 'Pending' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Revoke"))))))));
}
Object.assign(window, {
  ProfileScreen,
  AdminInvitesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-profile.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-refinery.jsx
try { (() => {
/* ============================================================
   STATION APP — Refinery (v1.0)
   The ore-refining job pipeline that feeds Work Sessions:
   queued → processing → ready → collected (+ failed).
   Views: Active batches · Terminals (capacity). Scope All/Mine.
   Batch review/edit slide-out + New refining job modal.
   Every modify/destructive action gated by confirmAction().
   ============================================================ */
(() => {
  const O = window.OPS;
  const ME = 'Mara Vex';
  const T = O.REFINERY_TERMINALS;
  const M = O.REFINERY_METHODS;
  function Pill({
    tone,
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + (tone || 'neutral')
    }, icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 11
    }), children);
  }
  const termName = id => {
    const t = T.find(x => x.id === id);
    return t ? t.name : id;
  };

  /* ---- batch review / edit drawer ------------------------- */
  function BatchDrawer({
    batch,
    onClose,
    onSaved,
    onRemoved
  }) {
    const [editing, setEditing] = React.useState(false);
    const [form, setForm] = React.useState(batch);
    React.useEffect(() => {
      setForm(batch);
      setEditing(false);
    }, [batch && batch.id]);
    if (!batch) return null;
    const b = editing ? form : batch;
    const st = O.REF_STATUS[b.status];
    const input = O.batchInputScu(b),
      yieldScu = O.batchYieldScu(b),
      value = O.batchValue(b);
    const set = (k, v) => setForm(f => ({
      ...f,
      [k]: v
    }));
    const realised = b.status !== 'failed' && b.status !== 'queued';
    const save = async () => {
      if (!(await window.confirmAction({
        title: 'Save changes to ' + batch.id + '?',
        body: 'Updates the refining job before it processes.',
        confirmLabel: 'Save changes',
        icon: 'save'
      }))) return;
      const meth = M[form.method];
      onSaved({
        ...form,
        yield: meth ? meth.yield : form.yield
      });
      setEditing(false);
      window.toast(batch.id + ' updated', 'check');
    };
    const collect = async () => {
      if (!(await window.confirmAction({
        title: 'Collect ' + batch.id + '?',
        body: 'Moves ' + O.moneyFmt(yieldScu) + ' SCU of refined material into inventory and closes the batch.',
        confirmLabel: 'Mark collected',
        icon: 'packageCheck'
      }))) return;
      onSaved({
        ...batch,
        status: 'collected',
        progress: 1,
        eta: 'Collected'
      });
      window.toast(batch.id + ' collected', 'check');
    };
    const cancel = async () => {
      const processing = batch.status === 'processing';
      if (!(await window.confirmAction({
        title: 'Cancel ' + batch.id + '?',
        body: processing ? 'This stops an in-progress refine. The refinery fee already paid is not refunded.' : 'Removes this queued job before it starts.',
        confirmLabel: 'Cancel batch',
        tone: 'danger',
        icon: 'trash'
      }))) return;
      onRemoved(batch);
      onClose();
      window.toast(batch.id + ' cancelled', 'trash');
    };
    const resubmit = async () => {
      if (!(await window.confirmAction({
        title: 'Resubmit ' + batch.id + '?',
        body: 'Re-queues the ore at ' + termName(b.terminal) + ' using ' + b.method + '.',
        confirmLabel: 'Resubmit',
        icon: 'rotateCcw'
      }))) return;
      onSaved({
        ...batch,
        status: 'queued',
        progress: 0,
        eta: 'Awaiting slot'
      });
      window.toast(batch.id + ' resubmitted', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!batch,
      onClose: onClose,
      width: 460
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, batch.id, " \xB7 Refining batch"), b.status === 'queued' && !editing && /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: () => setEditing(true),
      title: "Edit",
      "aria-label": "Edit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: "d-bigic",
      style: {
        background: 'color-mix(in srgb, #E0913A 18%, transparent)',
        color: '#E0913A'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "factory",
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, termName(b.terminal)), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "flame"
    }), b.method)), /*#__PURE__*/React.createElement(Pill, {
      tone: st.tone,
      icon: st.icon
    }, b.status === 'processing' ? b.eta : st.label)), /*#__PURE__*/React.createElement("div", {
      className: "d-metric"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, realised ? 'Refined value' : 'Projected value'), /*#__PURE__*/React.createElement("div", {
      className: "mv"
    }, O.moneyFmt(value), /*#__PURE__*/React.createElement("small", null, "aUEC"))), /*#__PURE__*/React.createElement("div", {
      className: "mr"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "Refinery fee"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-lg)',
        color: 'var(--coral-400)'
      }
    }, "\u2212", O.moneyFmt(b.fee)))), /*#__PURE__*/React.createElement("div", {
      className: "d-tiles"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "container"
    }), " Input"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, input, /*#__PURE__*/React.createElement("small", null, "SCU"))), /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "gauge"
    }), " Yield"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, Math.round(b.yield * 100), "%", /*#__PURE__*/React.createElement("small", null, yieldScu, " SCU")))), b.status === 'processing' && /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Progress"), /*#__PURE__*/React.createElement("span", {
      className: "t-mono t-faint"
    }, "ETA ", b.eta)), /*#__PURE__*/React.createElement("div", {
      className: "prog-track"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: Math.round(b.progress * 100) + '%',
        background: 'var(--warning-500)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "refbox-foot"
    }, /*#__PURE__*/React.createElement("span", null, Math.round(b.progress * 100), "% complete"), /*#__PURE__*/React.createElement("span", null, "started ", b.started))), editing ? /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Refining setup"), /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Terminal"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: form.terminal,
      onChange: e => set('terminal', e.target.value)
    }, T.map(t => /*#__PURE__*/React.createElement("option", {
      key: t.id,
      value: t.id
    }, t.name)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Method"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: form.method,
      onChange: e => set('method', e.target.value)
    }, (T.find(t => t.id === form.terminal)?.methods || Object.keys(M)).map(m => /*#__PURE__*/React.createElement("option", {
      key: m,
      value: m
    }, m, " \xB7 ", Math.round(M[m].yield * 100), "%"))))), /*#__PURE__*/React.createElement("div", {
      className: "method-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 13
    }), M[form.method] ? M[form.method].note : '')) : /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Ore in this batch"), /*#__PURE__*/React.createElement("span", {
      className: "t-mono t-faint"
    }, input, " SCU in")), /*#__PURE__*/React.createElement("table", {
      className: "ore-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Ore"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Input"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Refined"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Value"))), /*#__PURE__*/React.createElement("tbody", null, b.ores.map(([name, scu]) => /*#__PURE__*/React.createElement("tr", {
      key: name
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "ore-name"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ore-dot",
      style: {
        background: O.oreColor(name)
      }
    }), name)), /*#__PURE__*/React.createElement("td", {
      className: "num t-faint"
    }, scu), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, realised ? Math.round(scu * b.yield) : '—'), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, realised ? O.moneyFmt(Math.round(scu * b.yield * (O.ORE[name] ? O.ORE[name].price : 0))) : '—')))))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Owner"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, /*#__PURE__*/React.createElement(window.AvatarChip, {
      name: b.owner
    }))), b.session && /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Source"), /*#__PURE__*/React.createElement("span", {
      className: "v t-mono"
    }, b.session, b.order ? ' · ' + b.order : '')), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Started"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, b.started)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Status"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, /*#__PURE__*/React.createElement(Pill, {
      tone: st.tone,
      icon: st.icon
    }, st.label))))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => {
        setForm(batch);
        setEditing(false);
      }
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: save
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "save",
      size: 15
    }), " Save changes")) : b.status === 'ready' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger flex-none",
      onClick: cancel,
      "aria-label": "Cancel batch"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: collect
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "packageCheck",
      size: 15
    }), " Collect refined ore")) : b.status === 'failed' ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: resubmit
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCcw",
      size: 15
    }), " Resubmit batch") : b.status === 'collected' ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close") : b.status === 'queued' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger",
      onClick: cancel
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    }), " Cancel batch")) : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger",
      onClick: cancel
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    }), " Cancel batch")));
  }

  /* ---- new refining job modal ----------------------------- */
  function NewBatchModal({
    onClose,
    onCreate,
    prefill
  }) {
    const pf = prefill && prefill.ores && prefill.ores.length ? prefill.ores.slice().sort((a, b) => b[1] - a[1])[0] : null;
    const [ore, setOre] = React.useState(pf ? pf[0] : 'Quantanium');
    const [scu, setScu] = React.useState(pf ? pf[1] : 100);
    const [terminal, setTerminal] = React.useState('ARC-L1');
    const term = T.find(t => t.id === terminal);
    const [method, setMethod] = React.useState(term.methods[0]);
    React.useEffect(() => {
      if (!term.methods.includes(method)) setMethod(term.methods[0]);
    }, [terminal]);
    const m = M[method];
    const yieldScu = Math.round(scu * m.yield);
    const value = Math.round(scu * m.yield * (O.ORE[ore] ? O.ORE[ore].price : 0));
    const fee = Math.round(scu * 120 * m.feeMul);
    const valid = scu > 0;
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Submit refining job?',
        body: scu + ' SCU of ' + ore + ' to ' + term.name + ' via ' + method + ' — projected ' + yieldScu + ' SCU (' + Math.round(m.yield * 100) + '%), fee ' + O.moneyFmt(fee) + ' aUEC.',
        confirmLabel: 'Submit to refinery',
        icon: 'send'
      }))) return;
      onCreate({
        ores: [[ore, scu]],
        terminal,
        method,
        yield: m.yield,
        fee
      });
      onClose();
      window.toast('Refining job queued', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "New refining job",
      icon: "factory",
      onClose: onClose,
      width: 560,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "send",
        size: 15
      }), " Submit to refinery"))
    }, prefill && prefill.source && /*#__PURE__*/React.createElement("div", {
      className: "ctx-row"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "layers",
      size: 14
    }), " Pre-filled from ", /*#__PURE__*/React.createElement("strong", null, prefill.source), prefill.session ? ' · ' + prefill.session : '', prefill.ores.length > 1 ? ' · ' + prefill.ores.length + ' ores pooled (largest selected)' : ''), /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Ore",
      required: true
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: ore,
      onChange: e => setOre(e.target.value)
    }, Object.keys(O.ORE).map(n => /*#__PURE__*/React.createElement("option", {
      key: n,
      value: n
    }, n)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Raw amount",
      required: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "1",
      value: scu,
      onChange: e => setScu(Math.max(0, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "SCU")))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Refinery terminal",
      required: true
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: terminal,
      onChange: e => setTerminal(e.target.value)
    }, T.map(t => /*#__PURE__*/React.createElement("option", {
      key: t.id,
      value: t.id
    }, t.name, " \u2014 ", t.system)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Method",
      hint: m.note
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: method,
      onChange: e => setMethod(e.target.value)
    }, term.methods.map(mm => /*#__PURE__*/React.createElement("option", {
      key: mm,
      value: mm
    }, mm, " \xB7 ", Math.round(M[mm].yield * 100), "% \xB7 ", M[mm].speedH, "h \xB7 \xD7", M[mm].feeMul)))), /*#__PURE__*/React.createElement("div", {
      className: "proj-box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "proj-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk"
    }, "Projected yield"), /*#__PURE__*/React.createElement("div", {
      className: "pv"
    }, yieldScu, /*#__PURE__*/React.createElement("small", null, "SCU"))), /*#__PURE__*/React.createElement("div", {
      className: "proj-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk"
    }, "Est. value"), /*#__PURE__*/React.createElement("div", {
      className: "pv"
    }, O.moneyAbbr(value), /*#__PURE__*/React.createElement("small", null, "aUEC"))), /*#__PURE__*/React.createElement("div", {
      className: "proj-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk"
    }, "Refinery fee"), /*#__PURE__*/React.createElement("div", {
      className: "pv",
      style: {
        color: 'var(--coral-400)'
      }
    }, "\u2212", O.moneyAbbr(fee))), /*#__PURE__*/React.createElement("div", {
      className: "proj-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk"
    }, "Est. time"), /*#__PURE__*/React.createElement("div", {
      className: "pv"
    }, m.speedH, /*#__PURE__*/React.createElement("small", null, "h")))));
  }

  /* ---- terminals (capacity) view -------------------------- */
  function TerminalsView({
    batches
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "term-grid"
    }, T.map(t => {
      const active = batches.filter(b => b.terminal === t.id && (b.status === 'processing' || b.status === 'queued'));
      const used = active.length,
        pct = Math.min(100, Math.round(used / t.slots * 100));
      const tone = pct >= 90 ? 'danger' : pct >= 60 ? 'warn' : 'success';
      return /*#__PURE__*/React.createElement("div", {
        className: "term-card",
        key: t.id
      }, /*#__PURE__*/React.createElement("div", {
        className: "term-top"
      }, /*#__PURE__*/React.createElement("span", {
        className: "term-ic"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "factory",
        size: 18
      })), /*#__PURE__*/React.createElement("div", {
        className: "term-h"
      }, /*#__PURE__*/React.createElement("div", {
        className: "term-nm"
      }, t.name), /*#__PURE__*/React.createElement("div", {
        className: "term-sys"
      }, t.system)), /*#__PURE__*/React.createElement("span", {
        className: "chip-badge neutral"
      }, t.id)), /*#__PURE__*/React.createElement("div", {
        className: "term-cap"
      }, /*#__PURE__*/React.createElement("div", {
        className: "term-cap-row"
      }, /*#__PURE__*/React.createElement("span", null, "Slots in use"), /*#__PURE__*/React.createElement("span", {
        className: "t-mono"
      }, used, " / ", t.slots)), /*#__PURE__*/React.createElement(window.Progress, {
        value: used / t.slots,
        tone: tone
      })), /*#__PURE__*/React.createElement("div", {
        className: "term-methods"
      }, t.methods.map(m => /*#__PURE__*/React.createElement("span", {
        className: "mchip",
        key: m
      }, m))));
    }));
  }

  /* ---- refinery page -------------------------------------- */
  function RefineryScreen() {
    const [batches, setBatches] = React.useState(() => O.REFINERY_BATCHES.map(b => ({
      ...b
    })));
    const [view, setView] = React.useState('batches');
    const [scope, setScope] = React.useState('leadership');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [openId, setOpenId] = React.useState(null);
    const [newBatch, setNewBatch] = React.useState(false);
    const [prefill, setPrefill] = React.useState(null);
    React.useEffect(() => {
      if (window.__refineryPrefill) {
        setPrefill(window.__refineryPrefill);
        setNewBatch(true);
        window.__refineryPrefill = null;
      }
    }, []);
    const open = openId ? batches.find(b => b.id === openId) : null;
    React.useEffect(() => {
      const onKey = e => {
        if (e.key === 'n' && !/input|textarea|select/i.test(e.target.tagName) && !document.querySelector('.modal-backdrop') && !document.querySelector('.drawer')) {
          e.preventDefault();
          setNewBatch(true);
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, []);
    const scoped = scope === 'mine' ? batches.filter(b => b.owner === ME) : batches;
    const visible = scoped.filter(b => statusFilter === 'all' || b.status === statusFilter);
    const counts = st => scoped.filter(b => st === 'all' || b.status === st).length;
    const agg = scoped.reduce((a, b) => {
      if (b.status === 'processing') {
        a.refining += 1;
        a.pipeScu += O.batchInputScu(b);
      }
      if (b.status === 'ready') {
        a.ready += 1;
        a.readyScu += O.batchYieldScu(b);
      }
      if (b.status !== 'failed' && b.status !== 'collected') a.fees += b.fee;
      return a;
    }, {
      refining: 0,
      ready: 0,
      pipeScu: 0,
      readyScu: 0,
      fees: 0
    });
    const update = b => setBatches(xs => xs.map(x => x.id === b.id ? b : x));
    const remove = b => setBatches(xs => xs.filter(x => x.id !== b.id));
    const create = data => {
      const nb = {
        id: 'RB-' + Math.floor(205 + Math.random() * 90),
        owner: ME,
        terminal: data.terminal,
        method: data.method,
        status: 'queued',
        ores: data.ores,
        yield: data.yield,
        progress: 0,
        eta: 'Awaiting slot',
        fee: data.fee,
        started: 'Just now',
        session: null,
        order: null
      };
      setBatches(xs => [nb, ...xs]);
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "crumb"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "factory"
    }), " Operations ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight"
    }), " Refinery"), /*#__PURE__*/React.createElement("h1", {
      className: "page-title"
    }, "Refinery"), /*#__PURE__*/React.createElement("p", {
      className: "page-sub"
    }, "Every ore-refining job in one pipeline \u2014 submit raw ore, watch it process, and collect the refined yield. Batches feed straight back into your work sessions and inventory.")), /*#__PURE__*/React.createElement("div", {
      className: "page-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: () => setNewBatch(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    }), " New refining job ", /*#__PURE__*/React.createElement("span", {
      className: "kbd",
      style: {
        marginLeft: 6
      }
    }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement("div", {
      className: "scope-row"
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "View",
      value: view,
      onChange: setView,
      options: [{
        value: 'batches',
        label: 'Batches',
        icon: 'layers'
      }, {
        value: 'terminals',
        label: 'Terminals',
        icon: 'factory'
      }]
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 1,
        height: 22,
        background: 'var(--border-default)'
      }
    }), /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Scope",
      value: scope,
      onChange: setScope,
      options: [{
        value: 'leadership',
        label: 'Org',
        icon: 'members'
      }, {
        value: 'mine',
        label: 'Mine',
        icon: 'userRound'
      }]
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), agg.refining > 0 && /*#__PURE__*/React.createElement("span", {
      className: "live-tag"
    }, /*#__PURE__*/React.createElement("span", {
      className: "live"
    }), agg.refining, " refining")), /*#__PURE__*/React.createElement(window.StatStrip, {
      items: [{
        k: 'Refining now',
        icon: 'loader',
        v: agg.refining,
        d: O.moneyFmt(agg.pipeScu) + ' SCU in pipeline'
      }, {
        k: 'Ready to collect',
        icon: 'packageCheck',
        v: agg.ready,
        unit: '',
        d: O.moneyFmt(agg.readyScu) + ' SCU yielded',
        tone: agg.ready ? 'up' : null
      }, {
        k: 'Terminals',
        icon: 'factory',
        v: T.length,
        d: 'across Stanton + Pyro'
      }, {
        k: 'Open fees',
        icon: 'receipt',
        v: O.moneyAbbr(agg.fees),
        unit: 'aUEC',
        d: 'on active batches',
        tone: 'warn'
      }]
    }), view === 'terminals' ? /*#__PURE__*/React.createElement(TerminalsView, {
      batches: batches
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "toolbar-row"
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Filter by status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [{
        value: 'all',
        label: 'All',
        count: counts('all')
      }, {
        value: 'processing',
        label: 'Processing',
        count: counts('processing')
      }, {
        value: 'ready',
        label: 'Ready',
        count: counts('ready')
      }, {
        value: 'queued',
        label: 'Queued',
        count: counts('queued')
      }, {
        value: 'collected',
        label: 'Collected',
        count: counts('collected')
      }, {
        value: 'failed',
        label: 'Failed',
        count: counts('failed')
      }]
    })), visible.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: "factory",
      title: "No batches here",
      text: "Nothing matches this filter. Submit a new refining job to get ore into the pipeline."
    }) : /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap",
      style: {
        marginTop: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Refining batches"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Batch"), /*#__PURE__*/React.createElement("th", null, "Terminal"), /*#__PURE__*/React.createElement("th", null, "Method"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Yield"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Value"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, visible.map(b => {
      const st = O.REF_STATUS[b.status],
        real = b.status !== 'failed' && b.status !== 'queued';
      return /*#__PURE__*/React.createElement("tr", {
        key: b.id,
        onClick: () => setOpenId(b.id),
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: "ent-ic ref-rowic"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "factory",
        size: 16
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, b.id), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, b.ores.map(o => o[0]).join(' · '))))), /*#__PURE__*/React.createElement("td", {
        className: "t-muted"
      }, b.terminal), /*#__PURE__*/React.createElement("td", {
        className: "t-muted",
        style: {
          fontSize: 'var(--text-xs)'
        }
      }, b.method), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, Math.round(b.yield * 100), "%"), /*#__PURE__*/React.createElement("td", null, b.status === 'processing' ? /*#__PURE__*/React.createElement("div", {
        className: "row-prog"
      }, /*#__PURE__*/React.createElement(Pill, {
        tone: st.tone,
        icon: st.icon
      }, b.eta), /*#__PURE__*/React.createElement("div", {
        className: "prog-track mini"
      }, /*#__PURE__*/React.createElement("i", {
        style: {
          width: Math.round(b.progress * 100) + '%',
          background: 'var(--warning-500)'
        }
      }))) : /*#__PURE__*/React.createElement(Pill, {
        tone: st.tone,
        icon: st.icon
      }, st.label)), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, real ? O.moneyAbbr(O.batchValue(b)) : '—'), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "list-hint"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open batch ", /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "n")), " new ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, visible.length, " batches")))), newBatch && /*#__PURE__*/React.createElement(NewBatchModal, {
      prefill: prefill,
      onClose: () => {
        setNewBatch(false);
        setPrefill(null);
      },
      onCreate: create
    }), open && /*#__PURE__*/React.createElement(BatchDrawer, {
      batch: open,
      onClose: () => setOpenId(null),
      onSaved: update,
      onRemoved: remove
    }));
  }
  function makeRefineryBatch(data) {
    return {
      id: 'RB-' + Math.floor(205 + Math.random() * 90),
      owner: data.owner || 'Mara Vex',
      terminal: data.terminal,
      method: data.method,
      status: 'queued',
      ores: data.ores,
      yield: data.yield,
      progress: 0,
      eta: 'Awaiting slot',
      fee: data.fee,
      started: 'Just now',
      session: data.session || null,
      order: data.order || null
    };
  }
  Object.assign(window, {
    RefineryScreen,
    NewBatchModal,
    makeRefineryBatch
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-refinery.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-sessions.jsx
try { (() => {
/* ============================================================
   STATION APP — Work Sessions (v1.0)
   A Work Session groups N work orders. Two views:
     • LIST    — sessions across the org (leadership) or mine
     • DETAIL  — one session: aggregates, roster, its work orders
   Drill into a work order → review/edit slide-out drawer.
   Create flows are modals; every modify/destructive action
   is gated by confirmAction().
   Keyboard: ↑↓ move · ↵ open · n new · Esc back.
   ============================================================ */
(() => {
  const O = window.OPS;
  const CU = window.CURRENT_USER;
  const ME = 'Mara Vex';

  /* ---- small shared bits ---------------------------------- */
  function Pill({
    tone,
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + (tone || 'neutral')
    }, icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 11
    }), children);
  }
  function OreChips({
    ores,
    realised
  }) {
    const list = ores.filter(x => (realised ? x[2] : x[1]) > 0);
    if (!list.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "ore-sum"
    }, list.map(([name, raw, refined]) => /*#__PURE__*/React.createElement("span", {
      className: "ore-chip",
      key: name
    }, /*#__PURE__*/React.createElement("span", {
      className: "dot",
      style: {
        background: O.oreColor(name)
      }
    }), name, " ", /*#__PURE__*/React.createElement("span", {
      className: "q"
    }, realised ? refined : raw, " SCU"))));
  }

  /* =========================================================
     WORK ORDER — review / edit drawer
     ========================================================= */
  function OrderDrawer({
    order,
    session,
    sessionStatus,
    onClose,
    onSaved,
    onDeleted,
    onNavigate
  }) {
    const isOwner = session && session.lead === ME;
    const [editing, setEditing] = React.useState(false);
    const [refineryModal, setRefineryModal] = React.useState(null);
    const [form, setForm] = React.useState(order);
    React.useEffect(() => {
      setForm(order);
      setEditing(false);
    }, [order && order.id]);
    if (!order) return null;
    const o = editing ? form : order;
    const ty = O.WO_TYPE[o.type],
      st = O.WO_STATUS[o.status];
    const orgCutPct = session && session.orgCutEnabled ? session.orgCutPct || 0 : 0;
    const {
      gross,
      totalExp,
      net,
      orgCut,
      distributable,
      rows
    } = O.payoutOf(o, orgCutPct);
    const realised = !O.unrealised(o);
    const totalShipScu = o.ships.reduce((s, x) => s + x.scu, 0);
    const set = (k, v) => setForm(f => ({
      ...f,
      [k]: v
    }));
    const setCrew = (i, k, v) => setForm(f => ({
      ...f,
      crew: f.crew.map((c, idx) => idx === i ? {
        ...c,
        [k]: v
      } : c)
    }));
    const save = async () => {
      if (!(await window.confirmAction({
        title: 'Save changes to ' + order.id + '?',
        body: 'This updates the work order for everyone in the session.',
        confirmLabel: 'Save changes',
        icon: 'save'
      }))) return;
      onSaved(form);
      setEditing(false);
      window.toast(order.id + ' updated', 'check');
    };
    const del = async () => {
      if (!(await window.confirmAction({
        title: 'Delete ' + order.id + '?',
        body: 'The work order, its ore log and crew-share split will be removed from this session. This cannot be undone.',
        confirmLabel: 'Delete work order',
        tone: 'danger',
        icon: 'trash'
      }))) return;
      onDeleted(order);
      onClose();
      window.toast(order.id + ' deleted', 'trash');
    };
    const markSold = async () => {
      if (!(await window.confirmAction({
        title: 'Mark ' + order.id + ' sold & pay crew?',
        body: 'Records the sale at current value and releases ' + O.moneyFmt(net) + ' aUEC across ' + o.crew.length + ' crew shares.',
        confirmLabel: 'Mark sold & pay',
        icon: 'handCoins'
      }))) return;
      onSaved({
        ...order,
        status: 'sold'
      });
      window.toast(order.id + ' marked sold — crew paid', 'handCoins');
    };
    const submit = async () => {
      if (!(await window.confirmAction({
        title: 'Submit ' + order.id + ' to refinery?',
        body: 'Queues the pooled ore at ' + (o.refinery !== 'Not submitted' ? o.refinery : 'the selected refinery') + '.',
        confirmLabel: 'Submit to refinery',
        icon: 'send'
      }))) return;
      onSaved({
        ...order,
        status: 'refining',
        progress: 0.02,
        timeLeft: 'Just submitted'
      });
      window.toast(order.id + ' submitted to refinery', 'send');
    };
    const startRefinery = async () => {
      const ores = o.ores.filter(x => x[1] > 0);
      if (!ores.length) {
        window.toast('No ore logged on this order yet', 'info');
        return;
      }
      setRefineryModal({
        ores: ores.map(x => [x[0], x[1]]),
        source: order.id,
        session: session && session.id
      });
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!order,
      onClose: onClose,
      width: 460
    }, refineryModal && window.NewBatchModal && /*#__PURE__*/React.createElement(window.NewBatchModal, {
      prefill: refineryModal,
      onClose: () => setRefineryModal(null),
      onCreate: data => {
        const b = window.makeRefineryBatch({
          ...data,
          owner: ME,
          source: refineryModal.source,
          session: refineryModal.session,
          order: refineryModal.source
        });
        if (window.OPS && window.OPS.REFINERY_BATCHES) window.OPS.REFINERY_BATCHES.unshift(b);
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, order.id, " \xB7 Work order"), !editing && /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: () => setEditing(true),
      title: "Edit",
      "aria-label": "Edit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'd-bigic ' + ty.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ty.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, editing ? /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: o.title,
      onChange: e => set('title', e.target.value)
    }) : /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, o.title), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mapPin"
    }), o.loc, " \xB7 ", ty.label)), !editing && /*#__PURE__*/React.createElement(Pill, {
      tone: st.tone,
      icon: st.icon
    }, o.status === 'refining' ? o.timeLeft : st.label)), !realised ? /*#__PURE__*/React.createElement("div", {
      className: "d-metric"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "Projected yield"), /*#__PURE__*/React.createElement("div", {
      className: "mv",
      style: {
        color: 'var(--text-strong)'
      }
    }, O.scuOf(o), /*#__PURE__*/React.createElement("small", null, "SCU raw"))), /*#__PURE__*/React.createElement("div", {
      className: "mr"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "Status"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, o.timeLeft))) : /*#__PURE__*/React.createElement("div", {
      className: "d-metric"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "Gross value"), /*#__PURE__*/React.createElement("div", {
      className: "mv"
    }, O.moneyFmt(gross), /*#__PURE__*/React.createElement("small", null, "aUEC"))), /*#__PURE__*/React.createElement("div", {
      className: "mr"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "Net to crew"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-lg)',
        color: 'var(--success-500)'
      }
    }, O.moneyFmt(net)))), /*#__PURE__*/React.createElement("div", {
      className: "d-tiles"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rocket"
    }), " Ships"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, o.ships.length, /*#__PURE__*/React.createElement("small", null, totalShipScu, " SCU"))), /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "gauge"
    }), " Yield"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, o.yield ? o.yield + '%' : '—'))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Refinery"), editing ? /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Refinery"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: o.refinery,
      onChange: e => set('refinery', e.target.value)
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Method"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: o.method,
      onChange: e => set('method', e.target.value)
    }))) : /*#__PURE__*/React.createElement("div", {
      className: "refbox"
    }, /*#__PURE__*/React.createElement("div", {
      className: "refbox-top"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "refbox-method"
    }, o.method), /*#__PURE__*/React.createElement("div", {
      className: "refbox-sub"
    }, o.refinery)), /*#__PURE__*/React.createElement("div", {
      className: "refbox-time"
    }, o.timeLeft)), o.status === 'refining' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "prog-track",
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: Math.round(o.progress * 100) + '%',
        background: 'var(--warning-500)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "refbox-foot"
    }, /*#__PURE__*/React.createElement("span", null, Math.round(o.progress * 100), "% complete"), /*#__PURE__*/React.createElement("span", null, "ETA ", o.timeLeft))))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Ore yield (pooled)"), /*#__PURE__*/React.createElement("span", {
      className: "t-mono t-faint"
    }, realised ? O.moneyFmt(gross) + ' aUEC' : 'projected')), /*#__PURE__*/React.createElement("table", {
      className: "ore-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Ore"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Raw"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Refined"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Value"))), /*#__PURE__*/React.createElement("tbody", null, o.ores.map(([name, raw, refined]) => /*#__PURE__*/React.createElement("tr", {
      key: name
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "ore-name"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ore-dot",
      style: {
        background: O.oreColor(name)
      }
    }), name)), /*#__PURE__*/React.createElement("td", {
      className: "num t-faint"
    }, raw), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, realised ? refined : '—'), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, realised ? O.moneyFmt(refined * (O.ORE[name] ? O.ORE[name].price : 0)) : '—')))))), o.expenses.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Expenses"), /*#__PURE__*/React.createElement("span", {
      className: "t-mono",
      style: {
        color: 'var(--coral-400)'
      }
    }, "\u2212", O.moneyFmt(totalExp))), o.expenses.map(([label, amt, who], i) => /*#__PURE__*/React.createElement("div", {
      className: "exp-row",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "ex-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "receipt",
      size: 14
    })), /*#__PURE__*/React.createElement("div", {
      className: "ex-lbl"
    }, label, /*#__PURE__*/React.createElement("div", {
      className: "ex-claim"
    }, "Reimbursed to ", who)), /*#__PURE__*/React.createElement("span", {
      className: "ex-amt"
    }, "\u2212", O.moneyFmt(amt))))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Crew on this order \xB7 ", o.crew.length)), o.crew.map((c, i) => /*#__PURE__*/React.createElement("div", {
      className: "share-row",
      key: i
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: c.name,
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "sr-nm"
    }, c.name), /*#__PURE__*/React.createElement("div", {
      className: "sr-role"
    }, c.role)), o.expenses.filter(e => e[2] === c.name).length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "t-mono",
      style: {
        color: 'var(--teal-300)',
        fontSize: 'var(--text-2xs)'
      }
    }, "+", O.moneyAbbr(o.expenses.filter(e => e[2] === c.name).reduce((a, e) => a + e[1], 0)), " reimb"))), /*#__PURE__*/React.createElement("div", {
      className: "contrib-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "handCoins",
      size: 14
    }), /*#__PURE__*/React.createElement("div", null, "Contributes ", /*#__PURE__*/React.createElement("strong", null, O.moneyFmt(O.estGrossOf(o)), " aUEC"), " ", realised ? '' : '(est.) ', "to the session payout pool. Crew shares are set at the ", /*#__PURE__*/React.createElement("strong", null, "session"), " level.")), o.altSeller && /*#__PURE__*/React.createElement("div", {
      className: "alt-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "userCheck",
      size: 14
    }), "Alternate seller: ", /*#__PURE__*/React.createElement("strong", null, o.altSeller), " handles this order\u2019s sale.")), editing && isOwner && /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger",
      style: {
        width: '100%',
        justifyContent: 'center'
      },
      onClick: del
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    }), " Delete work order"))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => {
        setForm(order);
        setEditing(false);
      }
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: save
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "save",
      size: 15
    }), " Save changes")) : sessionStatus === 'settled' ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close") : o.status === 'refined' ? isOwner ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: markSold
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "handCoins",
      size: 15
    }), " Mark sold & pay crew")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close")) : o.status === 'queued' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: startRefinery
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "factory",
      size: 15
    }), " Start refinery order")) : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    }), " Edit work order")));
  }

  /* =========================================================
     NEW SESSION modal
     ========================================================= */
  function NewSessionModal({
    onClose,
    onCreate
  }) {
    const [name, setName] = React.useState('');
    const [theater, setTheater] = React.useState('');
    const [when, setWhen] = React.useState('');
    const [status, setStatus] = React.useState('planned');
    const valid = name.trim() && theater.trim();
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Create work session?',
        body: '“' + name + '” will be visible to your org and members can be added to it.',
        confirmLabel: 'Create session',
        icon: 'plus'
      }))) return;
      onCreate({
        name: name.trim(),
        theater: theater.trim(),
        window: when.trim() || 'TBD',
        status
      });
      onClose();
      window.toast('Work session created', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "New work session",
      icon: "layers",
      onClose: onClose,
      width: 540,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }), " Create session"))
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Session name",
      required: true,
      hint: "e.g. \u201CAaron Halo \u2014 Saturday Op\u201D"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      autoFocus: true,
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Name this operation"
    })), /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Theater / location",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: theater,
      onChange: e => setTheater(e.target.value),
      placeholder: "Aaron Halo \xB7 Stanton"
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Window",
      hint: "optional"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: when,
      onChange: e => setWhen(e.target.value),
      placeholder: "Sat 20:00 UTC"
    }))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Start as"
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: 2,
      value: status,
      onChange: setStatus,
      options: [{
        value: 'planned',
        label: 'Planned',
        desc: 'Schedule for later',
        icon: 'calendar'
      }, {
        value: 'active',
        label: 'Active now',
        desc: 'Crew is flying',
        icon: 'loader'
      }]
    })));
  }

  /* =========================================================
     NEW WORK ORDER modal (within a session)
     ========================================================= */
  function NewOrderModal({
    session,
    onClose,
    onCreate
  }) {
    const [title, setTitle] = React.useState('');
    const [cat, setCat] = React.useState('mining');
    const [type, setType] = React.useState('ship');
    const [loc, setLoc] = React.useState('');
    const valid = title.trim() && loc.trim();
    React.useEffect(() => {
      const ms = O.WO_CATEGORY[cat].methods;
      if (!ms.includes(type)) setType(ms[0]);
    }, [cat]);
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Add work order to ' + session.id + '?',
        body: 'Creates a new queued ' + O.WO_TYPE[type].label.toLowerCase() + ' job under “' + session.name + '”. You can add ships, ore and crew next.',
        confirmLabel: 'Add work order',
        icon: 'plus'
      }))) return;
      onCreate({
        title: title.trim(),
        type,
        loc: loc.trim()
      });
      onClose();
      window.toast('Work order added', 'check');
    };
    const methodDesc = {
      ship: 'MOLE / Prospector',
      vehicle: 'ROC',
      rocds: 'ROC dual-seat',
      geo: 'Geo survey',
      hand: 'On-foot gems',
      salvage: 'Reclaimer / Vulture'
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "New work order",
      icon: "pickaxe",
      onClose: onClose,
      width: 540,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }), " Add work order"))
    }, /*#__PURE__*/React.createElement("div", {
      className: "ctx-row"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "layers",
      size: 14
    }), " Adding to ", /*#__PURE__*/React.createElement("strong", null, session.name), " \xB7 ", session.id), /*#__PURE__*/React.createElement(window.Field, {
      label: "Job title",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      autoFocus: true,
      value: title,
      onChange: e => setTitle(e.target.value),
      placeholder: "e.g. Aaron Halo dragline"
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Category",
      required: true
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: 2,
      value: cat,
      onChange: setCat,
      options: [{
        value: 'mining',
        label: 'Mining',
        desc: 'Ship · vehicle · hand',
        icon: 'pickaxe'
      }, {
        value: 'salvage',
        label: 'Salvage',
        desc: 'Reclaim hulls & RMC',
        icon: 'recycle'
      }]
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Method",
      required: true,
      hint: cat === 'mining' ? 'How is this ore being extracted?' : null
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: cat === 'mining' ? 3 : 1,
      value: type,
      onChange: setType,
      options: O.WO_CATEGORY[cat].methods.map(m => ({
        value: m,
        label: O.WO_TYPE[m].label.replace(' Mining', ''),
        desc: methodDesc[m],
        icon: O.WO_TYPE[m].icon
      }))
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Location",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: loc,
      onChange: e => setLoc(e.target.value),
      placeholder: "Aaron Halo \xB7 Cluster 7"
    })));
  }

  /* =========================================================
     CREWS — cards, detail drawer, create + join
     ========================================================= */
  function CrewCard({
    crew,
    session,
    onOpen
  }) {
    const ct = O.CREW_TYPE[crew.type] || O.CREW_TYPE.ship;
    const roll = O.crewRollup(crew, session);
    const mine = crew.members.includes(ME);
    return /*#__PURE__*/React.createElement("button", {
      className: 'crew-card' + (mine ? ' mine' : ''),
      onClick: onOpen
    }, /*#__PURE__*/React.createElement("span", {
      className: 'big-ic ' + ct.cls,
      style: {
        width: 40,
        height: 40,
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ct.icon,
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      className: "crew-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "crew-nm"
    }, crew.name, mine && /*#__PURE__*/React.createElement("span", {
      className: "rr-you"
    }, "You")), /*#__PURE__*/React.createElement("div", {
      className: "crew-sub"
    }, ct.label, crew.ship ? ' · ' + crew.ship : ''), /*#__PURE__*/React.createElement("div", {
      className: "crew-cmd"
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: crew.commander,
      size: 18
    }), /*#__PURE__*/React.createElement("span", null, crew.commander), /*#__PURE__*/React.createElement("span", {
      className: "crew-cmd-tag"
    }, "Commander"))), /*#__PURE__*/React.createElement("div", {
      className: "crew-stats"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cs-row"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "members",
      size: 13
    }), " ", roll.members), /*#__PURE__*/React.createElement("div", {
      className: "cs-row"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pickaxe",
      size: 13
    }), " ", roll.orders, " ", roll.orders === 1 ? 'order' : 'orders'), roll.gross > 0 && /*#__PURE__*/React.createElement("div", {
      className: "cs-val"
    }, O.moneyAbbr(roll.gross), " ", /*#__PURE__*/React.createElement("span", null, "aUEC"))), /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight",
      size: 16,
      style: {
        color: 'var(--text-faint)',
        flex: 'none'
      }
    }));
  }
  function CrewDetail({
    crew,
    session,
    isOwner,
    onClose,
    onOpenOrder,
    onJoin,
    onLeave
  }) {
    if (!crew) return null;
    const ct = O.CREW_TYPE[crew.type] || O.CREW_TYPE.ship;
    const orders = O.crewOrders(crew, session);
    const roll = O.crewRollup(crew, session);
    const mine = crew.members.includes(ME);
    const editable = session.status === 'active' || session.status === 'planned';
    const join = async () => {
      if (!(await window.confirmAction({
        title: 'Join ' + crew.name + '?',
        body: 'You’ll be added to this crew’s roster and share in the work it logs during “' + session.name + '”.',
        confirmLabel: 'Join crew',
        icon: 'userCheck'
      }))) return;
      onJoin(crew);
      window.toast('Joined ' + crew.name, 'userCheck');
    };
    const leave = async () => {
      if (!(await window.confirmAction({
        title: 'Leave ' + crew.name + '?',
        body: 'You’ll be removed from this crew’s roster.',
        confirmLabel: 'Leave crew',
        tone: 'danger',
        icon: 'close'
      }))) return;
      onLeave(crew);
      window.toast('Left ' + crew.name, 'close');
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!crew,
      onClose: onClose,
      width: 460
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, crew.id, " \xB7 Crew"), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'd-bigic ' + ct.cls
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ct.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, crew.name), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, ct.label, crew.ship ? /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement(Icon, {
      name: "rocket"
    }), crew.ship) : ''))), /*#__PURE__*/React.createElement("div", {
      className: "d-tiles"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "members"
    }), " Crew"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, roll.members, /*#__PURE__*/React.createElement("small", null, "members"))), /*#__PURE__*/React.createElement("div", {
      className: "d-tile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "coins"
    }), " Hauled"), /*#__PURE__*/React.createElement("div", {
      className: "tv"
    }, roll.gross ? O.moneyAbbr(roll.gross) : '—', /*#__PURE__*/React.createElement("small", null, roll.gross ? 'aUEC' : '')))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Members \xB7 ", crew.members.length), crew.members.map(m => /*#__PURE__*/React.createElement("div", {
      className: "share-row",
      key: m
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: m,
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "sr-nm"
    }, m, m === ME && /*#__PURE__*/React.createElement("span", {
      className: "rr-you",
      style: {
        marginLeft: 6
      }
    }, "You")), /*#__PURE__*/React.createElement("div", {
      className: "sr-role"
    }, m === crew.commander ? 'Commander' : 'Crew member')), m === crew.commander && /*#__PURE__*/React.createElement("span", {
      className: "rr-lead"
    }, "Commander")))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap row"
    }, /*#__PURE__*/React.createElement("span", null, "Work orders \xB7 ", orders.length)), orders.length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "t-muted",
      style: {
        fontSize: 'var(--text-sm)',
        margin: 0
      }
    }, "This crew hasn\u2019t logged any work orders yet.") : orders.map(o => {
      const os = O.WO_STATUS[o.status],
        ty = O.WO_TYPE[o.type],
        real = !O.unrealised(o);
      return /*#__PURE__*/React.createElement("div", {
        className: "co-row",
        key: o.id,
        onClick: () => {
          onClose();
          onOpenOrder(o);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: 'co-ic big-ic ' + ty.cls
      }, /*#__PURE__*/React.createElement(Icon, {
        name: ty.icon,
        size: 14
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "co-nm"
      }, o.title), /*#__PURE__*/React.createElement("div", {
        className: "co-sub"
      }, o.id, " \xB7 ", real ? O.scuOf(o) + ' SCU' : 'pending')), /*#__PURE__*/React.createElement(Pill, {
        tone: os.tone,
        icon: os.icon
      }, o.status === 'refining' ? o.timeLeft : os.label));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, !editable ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close") : mine && crew.commander !== ME ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: leave
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 15
    }), " Leave crew") : !mine ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: join
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "userCheck",
      size: 15
    }), " Join this crew") : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close")));
  }
  function NewCrewModal({
    session,
    onClose,
    onCreate
  }) {
    const [type, setType] = React.useState('ship');
    const [name, setName] = React.useState('');
    const [ship, setShip] = React.useState('');
    const needsShip = type === 'ship' || type === 'geo' || type === 'salvage';
    const valid = name.trim() && (!needsShip || ship.trim());
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Add ' + (name || 'crew') + '?',
        body: 'You’ll command this crew in “' + session.name + '”. Members can join it and it can log work orders.',
        confirmLabel: 'Add crew',
        icon: 'plus'
      }))) return;
      onCreate({
        type,
        name: name.trim(),
        ship: needsShip ? ship.trim() : null
      });
      onClose();
      window.toast('Crew added — you’re the commander', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "Add a crew",
      icon: "rocket",
      onClose: onClose,
      width: 520,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }), " Add crew"))
    }, /*#__PURE__*/React.createElement("div", {
      className: "ctx-row"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "userCheck",
      size: 14
    }), " You\u2019ll be the ", /*#__PURE__*/React.createElement("strong", null, "commander"), " of this crew in ", session.name), /*#__PURE__*/React.createElement(window.Field, {
      label: "Crew type",
      required: true
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: 2,
      value: type,
      onChange: setType,
      options: [{
        value: 'ship',
        label: 'Ship crew',
        desc: 'MOLE / Prospector',
        icon: 'rocket'
      }, {
        value: 'geo',
        label: 'Geo (ROC)',
        desc: 'Ground vehicle',
        icon: 'car'
      }, {
        value: 'hand',
        label: 'Hand mining',
        desc: 'On-foot gems',
        icon: 'pickaxe'
      }, {
        value: 'salvage',
        label: 'Salvage',
        desc: 'Reclaimer / Vulture',
        icon: 'recycle'
      }]
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Crew name",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      autoFocus: true,
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "e.g. Mole Wing"
    })), needsShip && /*#__PURE__*/React.createElement(window.Field, {
      label: "Ship",
      required: true,
      hint: "Your ship for this crew"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: ship,
      onChange: e => setShip(e.target.value),
      placeholder: "e.g. MISC Mole"
    })));
  }
  function InviteParticipantModal({
    session,
    onClose,
    onInvite
  }) {
    const [q, setQ] = React.useState('');
    const [picked, setPicked] = React.useState([]);
    const pool = ['Mara Vex', 'Rook Calder', 'Sable Ng', 'Korr Vaeth', 'Juno Reyes', 'Tessa Brandt', 'Dex Marrow'].filter(m => !session.participants.includes(m) && !(session.invited || []).includes(m));
    const shown = pool.filter(m => m.toLowerCase().includes(q.toLowerCase()));
    const toggle = m => setPicked(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m]);
    const invite = async () => {
      if (!picked.length) return;
      if (!(await window.confirmAction({
        title: 'Invite ' + picked.length + ' ' + (picked.length === 1 ? 'member' : 'members') + '?',
        body: picked.join(', ') + ' will be added to the roster and notified to join “' + session.name + '”.',
        confirmLabel: 'Send invites',
        icon: 'send'
      }))) return;
      onInvite(picked);
      onClose();
      window.toast(picked.length + ' invited to the session', 'userPlus');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "Invite participants",
      icon: "userPlus",
      onClose: onClose,
      width: 480,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow t-muted",
        style: {
          fontSize: 'var(--text-xs)'
        }
      }, picked.length, " selected"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !picked.length,
        onClick: invite
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "send",
        size: 15
      }), " Send ", picked.length || '', " invite", picked.length === 1 ? '' : 's'))
    }, /*#__PURE__*/React.createElement("div", {
      className: "ms-search"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    }), /*#__PURE__*/React.createElement("input", {
      className: "fld",
      autoFocus: true,
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Search org members\u2026",
      style: {
        border: 'none',
        background: 'none',
        padding: '4px 0'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "mslist"
    }, shown.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "t-muted",
      style: {
        padding: 'var(--space-4)',
        textAlign: 'center',
        fontSize: 'var(--text-sm)'
      }
    }, "No members match.") : shown.map(m => /*#__PURE__*/React.createElement("button", {
      className: 'mslist-row' + (picked.includes(m) ? ' on' : ''),
      key: m,
      onClick: () => toggle(m)
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: m,
      size: 32
    }), /*#__PURE__*/React.createElement("span", {
      className: "ms-nm"
    }, m), /*#__PURE__*/React.createElement("span", {
      className: 'ms-check' + (picked.includes(m) ? ' on' : '')
    }, picked.includes(m) && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 13
    }))))));
  }
  function InviteLinkModal({
    session,
    onClose,
    onPreview
  }) {
    const url = 'https://station.app/s/' + session.id + '?invite=' + (session.id.replace(/\D/g, '') + 'a3f' + (session.name.length * 7).toString(16));
    const [copied, setCopied] = React.useState(false);
    const copy = () => {
      try {
        navigator.clipboard.writeText(url);
      } catch (e) {}
      setCopied(true);
      window.toast('Invite link copied', 'check');
      setTimeout(() => setCopied(false), 1800);
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "Invite link",
      icon: "gitBranch",
      onClose: onClose,
      width: 500,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost flex-none",
        onClick: onPreview
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "userRound",
        size: 15
      }), " Preview join"), /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        onClick: copy
      }, /*#__PURE__*/React.createElement(Icon, {
        name: copied ? 'check' : 'tag',
        size: 15
      }), " ", copied ? 'Copied' : 'Copy link'))
    }, /*#__PURE__*/React.createElement("p", {
      className: "t-muted",
      style: {
        marginTop: 0,
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, "Anyone in your org with this link is taken straight to ", /*#__PURE__*/React.createElement("strong", null, session.name), ". If they aren\u2019t on the roster yet, they\u2019ll be prompted to join. Signed-out members sign in first, then land here."), /*#__PURE__*/React.createElement("div", {
      className: "link-box"
    }, /*#__PURE__*/React.createElement("span", {
      className: "link-url"
    }, url), /*#__PURE__*/React.createElement("button", {
      className: "link-copy",
      onClick: copy,
      "aria-label": "Copy"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: copied ? 'check' : 'tag',
      size: 15
    }))), /*#__PURE__*/React.createElement("div", {
      className: "ctx-row",
      style: {
        marginTop: 'var(--space-4)',
        marginBottom: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14
    }), " Want to see what a member sees? ", /*#__PURE__*/React.createElement("button", {
      className: "link-btn",
      onClick: onPreview,
      style: {
        marginLeft: 4
      }
    }, "Preview the join experience")));
  }
  function JoinGateModal({
    session,
    onJoin,
    onDecline
  }) {
    return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
      className: "modal-backdrop confirm-backdrop",
      style: {
        zIndex: 360
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm-box",
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": 'Join ' + session.name
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm-ic brand"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "layers",
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      className: "confirm-title"
    }, "Join \u201C", session.name, "\u201D?"), /*#__PURE__*/React.createElement("p", {
      className: "confirm-body"
    }, "You\u2019ve been invited to this work session in ", session.theater, ". Join to see its crews, log work and share in the payouts. You can\u2019t view the session without joining."), /*#__PURE__*/React.createElement("div", {
      className: "join-gate-meta"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "userRound",
      size: 13
    }), " Lead ", session.lead), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "command",
      size: 13
    }), " ", session.id)), /*#__PURE__*/React.createElement("div", {
      className: "confirm-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onDecline
    }, "No, take me back"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: onJoin
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "userCheck",
      size: 15
    }), " Join")))), document.body);
  }

  /* =========================================================
     SESSION PAYOUT view (its own tab)
     ========================================================= */
  function PayoutView({
    pay,
    session,
    isOwner,
    setPayoutMode,
    setPayoutRow,
    onSettle
  }) {
    const s = session;
    const editable = isOwner && s.status !== 'settled';
    const valHead = {
      share: 'weight',
      percent: '%',
      flat: 'aUEC'
    }[pay.mode];
    const overFlat = pay.mode === 'flat' && pay.remaining < -0.5;
    const pctTotal = pay.mode === 'percent' ? pay.rows.reduce((a, r) => a + (r.val || 0), 0) : 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "payout-view"
    }, /*#__PURE__*/React.createElement("div", {
      className: "payout-summary"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ps-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "psk"
    }, "Combined value", pay.estimated ? ' (est.)' : ''), /*#__PURE__*/React.createElement("div", {
      className: "psv"
    }, O.moneyFmt(pay.gross), /*#__PURE__*/React.createElement("small", null, "aUEC"))), /*#__PURE__*/React.createElement("div", {
      className: "ps-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "psk"
    }, "Expenses"), /*#__PURE__*/React.createElement("div", {
      className: "psv neg"
    }, pay.exp ? '−' + O.moneyFmt(pay.exp) : '—')), pay.orgCut > 0 && /*#__PURE__*/React.createElement("div", {
      className: "ps-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "psk"
    }, "Org cut ", pay.cut, "%"), /*#__PURE__*/React.createElement("div", {
      className: "psv brand"
    }, "\u2212", O.moneyFmt(pay.orgCut))), /*#__PURE__*/React.createElement("div", {
      className: "ps-item hero"
    }, /*#__PURE__*/React.createElement("div", {
      className: "psk"
    }, "Crew pool"), /*#__PURE__*/React.createElement("div", {
      className: "psv pos"
    }, O.moneyFmt(pay.distributable), /*#__PURE__*/React.createElement("small", null, "aUEC")))), /*#__PURE__*/React.createElement("div", {
      className: "payout-mode-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pmr-label"
    }, "Split the crew pool by"), editable ? /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Split type",
      value: pay.mode,
      onChange: setPayoutMode,
      options: [{
        value: 'equal',
        label: 'Equal'
      }, {
        value: 'share',
        label: 'Shares'
      }, {
        value: 'percent',
        label: 'Percent'
      }, {
        value: 'flat',
        label: 'Flat'
      }]
    }) : /*#__PURE__*/React.createElement("span", {
      className: "chip-badge brand",
      style: {
        textTransform: 'capitalize'
      }
    }, pay.mode), /*#__PURE__*/React.createElement("span", {
      className: "pmr-note"
    }, "after org cut \xB7 same type for everyone")), /*#__PURE__*/React.createElement("div", {
      className: "panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "payout-split"
    }, pay.rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "t-muted",
      style: {
        padding: 'var(--space-4)',
        fontSize: 'var(--text-sm)'
      }
    }, "No participants on the roster yet \u2014 invite the crew to split the pool.") : pay.rows.map(r => /*#__PURE__*/React.createElement("div", {
      className: "psplit-row",
      key: r.name
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: r.name,
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      className: "psr-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "psr-nm"
    }, r.name, r.name === s.lead && /*#__PURE__*/React.createElement("span", {
      className: "rr-lead"
    }, "Lead"), r.name === ME && /*#__PURE__*/React.createElement("span", {
      className: "rr-you"
    }, "You"))), editable && pay.mode !== 'equal' ? /*#__PURE__*/React.createElement("div", {
      className: "psr-valwrap"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld se-val",
      type: "number",
      min: "0",
      value: r.val || 0,
      onChange: e => setPayoutRow(r.name, Math.max(0, +e.target.value)),
      "aria-label": 'Value for ' + r.name
    }), /*#__PURE__*/React.createElement("span", {
      className: "psr-unit"
    }, valHead)) : /*#__PURE__*/React.createElement("span", {
      className: "sr-type"
    }, r.label), /*#__PURE__*/React.createElement("div", {
      className: "psr-pay"
    }, O.moneyFmt(r.share), /*#__PURE__*/React.createElement("span", null, "aUEC"))))), pay.mode === 'percent' && pctTotal !== 100 && pay.rows.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: 'payout-flag' + (pctTotal > 100 ? ' warn' : '')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14
    }), " Allocations total ", pctTotal, "% \u2014 ", pctTotal > 100 ? 'over 100%, scale back.' : 100 - pctTotal + '% of the pool (' + O.moneyFmt(pay.remaining) + ' aUEC) is unassigned.'), overFlat && /*#__PURE__*/React.createElement("div", {
      className: "payout-flag warn"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14
    }), " Flat payouts exceed the crew pool by ", O.moneyFmt(-pay.remaining), " aUEC.")), /*#__PURE__*/React.createElement("div", {
      className: "payout-submit"
    }, s.status === 'settled' ? /*#__PURE__*/React.createElement("div", {
      className: "psub-done"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "badgeCheck",
      size: 16
    }), " Payouts recorded to Treasury \u2014 session settled.") : !isOwner ? /*#__PURE__*/React.createElement("div", {
      className: "payout-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14
    }), " The session lead records payouts once the session is settled.") : s.status === 'closed' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "psub-hint"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 14
    }), " Session is closed and ready to settle."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: onSettle
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "handCoins",
      size: 15
    }), " Record payouts & settle")) : /*#__PURE__*/React.createElement("div", {
      className: "payout-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14
    }), " Close the session for settlement to record these payouts to Treasury.")));
  }

  /* =========================================================
     SESSION DETAIL (drill-in)
     ========================================================= */
  function SessionDetail({
    session,
    onBack,
    onMutate,
    onOpenOrder,
    onPreviewJoin,
    onNavigate
  }) {
    const s = session;
    const st = O.SESSION_STATUS[s.status];
    const t = O.sessionTotals(s);
    const isOwner = s.lead === ME;
    const [view, setView] = React.useState('crews');
    const [newOrder, setNewOrder] = React.useState(false);
    const [newCrew, setNewCrew] = React.useState(false);
    const [invite, setInvite] = React.useState(false);
    const [inviteLink, setInviteLink] = React.useState(false);
    const [crewId, setCrewId] = React.useState(null);
    const [payoutEdit, setPayoutEdit] = React.useState(false);
    const pay = O.sessionPayout(s);
    const crews = s.crews || [];
    const openCrew = crewId ? crews.find(c => c.id === crewId) : null;
    React.useEffect(() => {
      const onKey = e => {
        if (e.key === 'Escape' && !document.querySelector('.drawer') && !document.querySelector('.modal-backdrop')) onBack();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [onBack]);
    const settle = async () => {
      const p = O.sessionPayout(s);
      const rows = p.rows.filter(r => r.share > 0);
      if (!(await window.confirmAction({
        title: 'Settle “' + s.name + '” & record payouts?',
        body: 'Splits the combined ' + O.moneyFmt(p.distributable) + ' aUEC crew pool into ' + rows.length + ' payout ' + (rows.length === 1 ? 'entry' : 'entries') + (p.orgCut ? ' plus a ' + O.moneyFmt(p.orgCut) + ' aUEC org cut' : '') + ' in Treasury, then closes the session.',
        confirmLabel: 'Settle & record payouts',
        icon: 'handCoins'
      }))) return;
      let n = 7900 + Math.floor(Math.random() * 90);
      const recs = [];
      rows.forEach(r => {
        recs.push({
          id: 'TX-' + n++,
          date: 'Just now',
          account: 'payroll',
          type: 'payout',
          amount: Math.round(r.share),
          party: r.name,
          status: 'pending',
          note: 'Session payout — ' + s.name + ' (' + s.id + ')'
        });
      });
      if (p.orgCut) recs.push({
        id: 'TX-' + n++,
        date: 'Just now',
        account: 'ops',
        type: 'dues',
        amount: Math.round(p.orgCut),
        party: 'Org cut · ' + s.id,
        status: 'cleared',
        note: 'Org cut (' + p.cut + '%) from ' + s.name
      });
      if (window.OPS && window.OPS.TREASURY_TX) window.OPS.TREASURY_TX.unshift.apply(window.OPS.TREASURY_TX, recs);
      onMutate({
        ...s,
        status: 'settled'
      });
      window.toast(rows.length + ' payouts recorded in Treasury', 'handCoins');
      if (onNavigate) onNavigate('treasury');
    };
    const setPayoutMode = mode => onMutate({
      ...s,
      payoutMode: mode
    });
    const setPayoutRow = (name, v) => {
      const base = s.participants.map(nm => {
        const ex = (s.payout || []).find(p => p.name === nm);
        return ex ? {
          ...ex
        } : {
          name: nm
        };
      });
      const row = base.find(r => r.name === name);
      row.val = v;
      onMutate({
        ...s,
        payout: base
      });
    };
    const resetPayout = async () => {
      if (!(await window.confirmAction({
        title: 'Reset to an equal split?',
        body: 'Every participant shares the crew pool equally.',
        confirmLabel: 'Reset split',
        icon: 'rotateCcw'
      }))) return;
      onMutate({
        ...s,
        payoutMode: 'equal',
        payout: []
      });
      window.toast('Payout reset to equal split', 'check');
    };
    const toggleOrgCut = async () => {
      if (!(await window.confirmAction({
        title: (s.orgCutEnabled ? 'Disable' : 'Enable') + ' the org cut?',
        body: s.orgCutEnabled ? 'No org cut will be taken — the full net pool goes to the crew.' : 'A ' + (s.orgCutPct || 10) + '% cut goes to the org treasury off the top of every payout.',
        confirmLabel: s.orgCutEnabled ? 'Disable org cut' : 'Enable org cut',
        icon: 'treasury'
      }))) return;
      onMutate({
        ...s,
        orgCutEnabled: !s.orgCutEnabled,
        orgCutPct: s.orgCutPct || 10
      });
      window.toast('Org cut ' + (s.orgCutEnabled ? 'disabled' : 'enabled'), 'check');
    };
    const setOrgCutPct = v => onMutate({
      ...s,
      orgCutPct: Math.max(0, Math.min(50, v))
    });
    const startSession = async () => {
      if (!(await window.confirmAction({
        title: 'Start “' + s.name + '”?',
        body: 'Marks the session active so the crew can log work orders against it.',
        confirmLabel: 'Start session',
        icon: 'loader'
      }))) return;
      onMutate({
        ...s,
        status: 'active',
        live: true
      });
      window.toast(s.name + ' is now active', 'check');
    };
    const closeSession = async () => {
      if (!(await window.confirmAction({
        title: 'Close “' + s.name + '” for settlement?',
        body: 'No more work orders can be added. You can still settle or reopen it.',
        confirmLabel: 'Close session',
        icon: 'lock'
      }))) return;
      onMutate({
        ...s,
        status: 'closed',
        live: false
      });
      window.toast(s.name + ' closed', 'lock');
    };
    const reopen = async () => {
      if (!(await window.confirmAction({
        title: 'Reopen “' + s.name + '”?',
        body: 'Returns the session to active so work orders can be edited or added.',
        confirmLabel: 'Reopen session',
        icon: 'rotateCcw'
      }))) return;
      onMutate({
        ...s,
        status: 'active',
        live: true
      });
      window.toast(s.name + ' reopened', 'check');
    };
    const cancel = async () => {
      if (!(await window.confirmAction({
        title: 'Cancel “' + s.name + '”?',
        body: 'This permanently removes the session and all of its work orders. Crew will be notified. This cannot be undone.',
        confirmLabel: 'Cancel session',
        tone: 'danger',
        icon: 'trash',
        requireText: s.id
      }))) return;
      onMutate(null, s.id);
      onBack();
      window.toast(s.name + ' cancelled', 'trash');
    };
    const addOrder = o => {
      const order = {
        id: 'WO-' + Math.floor(3100 + Math.random() * 800),
        title: o.title,
        type: o.type,
        status: 'queued',
        loc: o.loc,
        refinery: 'Not submitted',
        method: '—',
        yield: 0,
        progress: 0,
        timeLeft: 'Awaiting refinery',
        ships: [],
        ores: [],
        expenses: [],
        crew: [{
          name: ME,
          role: 'Lead · Seller',
          type: 'equal'
        }]
      };
      onMutate({
        ...s,
        orders: [order, ...s.orders]
      });
    };
    const updateOrder = updated => onMutate({
      ...s,
      orders: s.orders.map(o => o.id === updated.id ? updated : o)
    });
    const deleteOrder = o => onMutate({
      ...s,
      orders: s.orders.filter(x => x.id !== o.id)
    });
    const addCrew = d => {
      const crew = {
        id: 'CR-' + Math.floor(50 + Math.random() * 90),
        type: d.type,
        name: d.name,
        ship: d.ship,
        commander: ME,
        members: [ME],
        orderIds: []
      };
      const parts = s.participants.includes(ME) ? s.participants : [...s.participants, ME];
      onMutate({
        ...s,
        crews: [crew, ...crews],
        participants: parts
      });
    };
    const joinCrew = crew => {
      const parts = s.participants.includes(ME) ? s.participants : [...s.participants, ME];
      onMutate({
        ...s,
        participants: parts,
        invited: (s.invited || []).filter(x => x !== ME),
        crews: crews.map(c => c.id === crew.id ? {
          ...c,
          members: c.members.includes(ME) ? c.members : [...c.members, ME]
        } : c)
      });
    };
    const leaveCrew = crew => onMutate({
      ...s,
      crews: crews.map(c => c.id === crew.id ? {
        ...c,
        members: c.members.filter(m => m !== ME)
      } : c)
    });
    const inviteMembers = names => {
      onMutate({
        ...s,
        invited: [...(s.invited || []), ...names],
        declined: (s.declined || []).filter(d => !names.includes(d))
      });
      names.forEach(n => window.dispatchEvent(new CustomEvent('station-notify', {
        detail: {
          kind: 'session',
          actor: ME,
          verb: 'invited you to a work session',
          body: '“' + s.name + '” · ' + s.theater + '. Join to see crews and log work.',
          target: 'Work Sessions · ' + s.id,
          nav: 'sessions',
          high: true,
          actions: [{
            id: 'join',
            label: 'Join',
            tone: 'primary'
          }, {
            id: 'dismiss',
            label: 'Dismiss',
            tone: 'ghost'
          }]
        }
      })));
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "back-link",
      onClick: onBack
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowLeft",
      size: 16
    }), " All sessions ", /*#__PURE__*/React.createElement("span", {
      className: "kbd",
      style: {
        marginLeft: 4
      }
    }, /*#__PURE__*/React.createElement("kbd", null, "Esc"))), /*#__PURE__*/React.createElement("div", {
      className: "sess-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'sess-bigic ' + (s.live ? 'live' : '')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "layers",
      size: 24
    })), /*#__PURE__*/React.createElement("div", {
      className: "sess-head-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sess-head-top"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "sess-title"
    }, s.name), /*#__PURE__*/React.createElement(Pill, {
      tone: st.tone,
      icon: st.icon
    }, st.label), s.live && /*#__PURE__*/React.createElement("span", {
      className: "live-tag"
    }, /*#__PURE__*/React.createElement("span", {
      className: "live"
    }), "live")), /*#__PURE__*/React.createElement("div", {
      className: "sess-head-meta"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "mapPin",
      size: 13
    }), s.theater), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "command",
      size: 13
    }), s.id), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 13
    }), s.window), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
      name: "userRound",
      size: 13
    }), "Lead ", s.lead))), /*#__PURE__*/React.createElement("div", {
      className: "sess-head-acts"
    }, isOwner && s.status === 'planned' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: startSession
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "loader",
      size: 14
    }), " Start session"), isOwner && s.status === 'active' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: closeSession
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 14
    }), " Close"), isOwner && s.status === 'closed' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: settle
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "handCoins",
      size: 14
    }), " Settle & pay"), s.status === 'settled' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => window.toast('Session export started', 'download')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " Export"), (s.status === 'active' || s.status === 'planned') && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => setNewOrder(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " Work order"), isOwner && s.status !== 'settled' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => setInviteLink(true),
      title: "Invite link"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "gitBranch",
      size: 14
    }), " Invite link"), isOwner && s.status === 'closed' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: reopen
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCcw",
      size: 14
    }), " Reopen"), isOwner && s.status !== 'settled' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm icon-only",
      onClick: cancel,
      title: "Cancel session",
      "aria-label": "Cancel session"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    })))), /*#__PURE__*/React.createElement(window.StatStrip, {
      items: [{
        k: 'Work orders',
        icon: 'layers',
        v: t.orders,
        d: t.refining + ' refining now'
      }, {
        k: 'Yield',
        icon: 'gem',
        v: O.moneyFmt(t.yieldScu),
        unit: 'SCU',
        d: t.ships + ' ships involved'
      }, {
        k: 'Gross value',
        icon: 'coins',
        v: O.moneyAbbr(t.gross),
        unit: 'aUEC',
        d: 'at UEX prices'
      }, {
        k: 'Net payout',
        icon: 'handCoins',
        v: O.moneyAbbr(t.net),
        unit: 'aUEC',
        d: 'after expenses',
        tone: 'up'
      }, {
        k: 'Crew',
        icon: 'members',
        v: t.people,
        d: 'in this session'
      }]
    }), s.note && /*#__PURE__*/React.createElement("div", {
      className: "sess-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 15
    }), s.note), isOwner && s.status !== 'settled' && /*#__PURE__*/React.createElement("div", {
      className: "orgcut-bar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ocb-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "treasury",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "ocb-txt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ocb-t"
    }, "Org cut ", s.orgCutEnabled ? 'enabled' : 'disabled'), /*#__PURE__*/React.createElement("div", {
      className: "ocb-s"
    }, s.orgCutEnabled ? (s.orgCutPct || 10) + '% of every payout goes to the org treasury, off the top' : 'Disabled — the full net pool goes to the crew')), s.orgCutEnabled && /*#__PURE__*/React.createElement("div", {
      className: "ocb-pct"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "0",
      max: "50",
      value: s.orgCutPct || 10,
      onChange: e => setOrgCutPct(+e.target.value),
      "aria-label": "Org cut percent"
    }), /*#__PURE__*/React.createElement("span", null, "%")), /*#__PURE__*/React.createElement("button", {
      className: 'swtch' + (s.orgCutEnabled ? ' on' : ''),
      role: "switch",
      "aria-checked": s.orgCutEnabled,
      "aria-label": "Toggle org cut",
      onClick: toggleOrgCut
    }, /*#__PURE__*/React.createElement("span", {
      className: "knob"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "sess-grid"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sec-cap",
      style: {
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Session view",
      value: view,
      onChange: setView,
      options: [{
        value: 'crews',
        label: 'Crews',
        icon: 'userCheck',
        count: crews.length
      }, {
        value: 'orders',
        label: 'Work orders',
        icon: 'pickaxe',
        count: s.orders.length
      }, {
        value: 'payout',
        label: 'Payout',
        icon: 'handCoins'
      }]
    }), view === 'crews' && (s.status === 'active' || s.status === 'planned') && /*#__PURE__*/React.createElement("button", {
      className: "link-btn",
      onClick: () => setNewCrew(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rocket",
      size: 13
    }), " Add ship / crew"), view === 'orders' && (s.status === 'active' || s.status === 'planned') && /*#__PURE__*/React.createElement("button", {
      className: "link-btn",
      onClick: () => setNewOrder(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 13
    }), " Add"), view === 'payout' && isOwner && s.status !== 'settled' && /*#__PURE__*/React.createElement("button", {
      className: "link-btn",
      onClick: resetPayout
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCcw",
      size: 13
    }), " Reset equal")), view === 'crews' ? crews.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: "userCheck",
      title: "No crews yet",
      text: s.status === 'active' || s.status === 'planned' ? 'Add your ship to start a crew, or set up a hand- or geo-mining crew. Members join a crew, and each crew logs its own work orders.' : 'No crews were formed for this session.'
    }) : /*#__PURE__*/React.createElement("div", {
      className: "crew-list"
    }, crews.map(c => /*#__PURE__*/React.createElement(CrewCard, {
      key: c.id,
      crew: c,
      session: s,
      onOpen: () => setCrewId(c.id)
    }))) : view === 'orders' ? s.orders.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: "pickaxe",
      title: "No work orders yet",
      text: s.status === 'planned' ? 'This session is planned. Add the first work order when the crew forms up.' : 'Add a work order to start logging ships, ore and crew shares.'
    }) : /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap"
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Work orders in session"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Work order"), /*#__PURE__*/React.createElement("th", null, "Crew"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Yield"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Value"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, s.orders.map(o => {
      const ty = O.WO_TYPE[o.type],
        os = O.WO_STATUS[o.status],
        real = !O.unrealised(o);
      const ownerCrew = crews.find(c => (c.orderIds || []).includes(o.id));
      return /*#__PURE__*/React.createElement("tr", {
        key: o.id,
        onClick: () => onOpenOrder(o),
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: 'ent-ic big-ic ' + ty.cls
      }, /*#__PURE__*/React.createElement(Icon, {
        name: ty.icon,
        size: 16
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, o.title), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, o.id, " \xB7 ", ty.label)))), /*#__PURE__*/React.createElement("td", {
        className: "t-muted",
        style: {
          fontSize: 'var(--text-xs)'
        }
      }, ownerCrew ? ownerCrew.name : '—'), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, real ? O.scuOf(o) : '—', " ", /*#__PURE__*/React.createElement("span", {
        className: "t-faint"
      }, "SCU")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
        tone: os.tone,
        icon: os.icon
      }, o.status === 'refining' ? o.timeLeft : os.label)), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, real ? O.moneyAbbr(O.grossOf(o)) : '—'), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    })))) : /*#__PURE__*/React.createElement(PayoutView, {
      pay: pay,
      session: s,
      isOwner: isOwner,
      setPayoutMode: setPayoutMode,
      setPayoutRow: setPayoutRow,
      onSettle: settle
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sec-cap"
    }, /*#__PURE__*/React.createElement("span", null, "Roster \xB7 ", s.participants.length, " joined"), (s.invited || []).length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "t-faint",
      style: {
        textTransform: 'none',
        letterSpacing: 0
      }
    }, (s.invited || []).length, " invited")), /*#__PURE__*/React.createElement("div", {
      className: "panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "roster"
    }, s.participants.map(p => /*#__PURE__*/React.createElement("div", {
      className: "roster-row",
      key: p
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: p,
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      className: "rr-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rr-nm"
    }, p, p === s.lead && /*#__PURE__*/React.createElement("span", {
      className: "rr-lead"
    }, "Lead"), p === ME && /*#__PURE__*/React.createElement("span", {
      className: "rr-you"
    }, "You")), /*#__PURE__*/React.createElement("div", {
      className: "rr-sub"
    }, p === s.lead ? 'Session lead' : 'Participant')), /*#__PURE__*/React.createElement("span", {
      className: "ros-status joined"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "badgeCheck",
      size: 13
    }), " Joined"))), (s.invited || []).map(p => /*#__PURE__*/React.createElement("div", {
      className: "roster-row pending",
      key: 'i-' + p
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: p,
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      className: "rr-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rr-nm"
    }, p), /*#__PURE__*/React.createElement("div", {
      className: "rr-sub"
    }, "Invitation sent")), /*#__PURE__*/React.createElement("span", {
      className: "ros-status invited"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "loader",
      size: 13
    }), " Invited"))), (s.declined || []).map(p => /*#__PURE__*/React.createElement("div", {
      className: "roster-row pending",
      key: 'd-' + p
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: p,
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      className: "rr-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rr-nm"
    }, p), /*#__PURE__*/React.createElement("div", {
      className: "rr-sub"
    }, "Declined the invite")), /*#__PURE__*/React.createElement("span", {
      className: "ros-status declined"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circleX",
      size: 13
    }), " Declined")))), s.status !== 'settled' && /*#__PURE__*/React.createElement("button", {
      className: "roster-add",
      onClick: () => setInvite(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "userPlus",
      size: 15
    }), " Invite Participant")))), newOrder && /*#__PURE__*/React.createElement(NewOrderModal, {
      session: s,
      onClose: () => setNewOrder(false),
      onCreate: addOrder
    }), newCrew && /*#__PURE__*/React.createElement(NewCrewModal, {
      session: s,
      onClose: () => setNewCrew(false),
      onCreate: addCrew
    }), invite && /*#__PURE__*/React.createElement(InviteParticipantModal, {
      session: s,
      onClose: () => setInvite(false),
      onInvite: inviteMembers
    }), inviteLink && /*#__PURE__*/React.createElement(InviteLinkModal, {
      session: s,
      onClose: () => setInviteLink(false),
      onPreview: () => {
        setInviteLink(false);
        onPreviewJoin(s.id);
      }
    }), openCrew && /*#__PURE__*/React.createElement(CrewDetail, {
      crew: openCrew,
      session: s,
      isOwner: isOwner,
      onClose: () => setCrewId(null),
      onOpenOrder: onOpenOrder,
      onJoin: joinCrew,
      onLeave: leaveCrew
    }));
  }

  /* =========================================================
     SESSIONS LIST
     ========================================================= */
  function SessionsList({
    sessions,
    scope,
    setScope,
    statusFilter,
    setStatusFilter,
    onOpen,
    onNew
  }) {
    const scoped = scope === 'mine' ? sessions.filter(s => s.participants.includes(ME) || s.lead === ME) : sessions;
    const visible = scoped.filter(s => statusFilter === 'all' || s.status === statusFilter);
    const agg = visible.reduce((a, s) => {
      const t = O.sessionTotals(s);
      a.orders += t.orders;
      a.gross += t.gross;
      a.net += t.net;
      a.refining += t.refining;
      if (s.status === 'active') a.active += 1;
      return a;
    }, {
      orders: 0,
      gross: 0,
      net: 0,
      refining: 0,
      active: 0
    });
    const counts = st => scoped.filter(s => st === 'all' || s.status === st).length;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "crumb"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pickaxe"
    }), " Operations ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight"
    }), " Work Sessions"), /*#__PURE__*/React.createElement("h1", {
      className: "page-title"
    }, "Work Sessions"), /*#__PURE__*/React.createElement("p", {
      className: "page-sub"
    }, "Group every job from one op into a single session \u2014 ships, ore, expenses and crew-share payouts roll up automatically. Open a session to manage its work orders.")), /*#__PURE__*/React.createElement("div", {
      className: "page-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => window.toast('Capture from game (OCR) — share your window', 'scanLine')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "scanLine",
      size: 15
    }), " Capture"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: onNew
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    }), " New session ", /*#__PURE__*/React.createElement("span", {
      className: "kbd",
      style: {
        marginLeft: 6
      }
    }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement("div", {
      className: "scope-row"
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Scope",
      value: scope,
      onChange: setScope,
      options: [{
        value: 'leadership',
        label: 'All sessions',
        icon: 'members'
      }, {
        value: 'mine',
        label: 'Mine',
        icon: 'userRound'
      }]
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), agg.active > 0 && /*#__PURE__*/React.createElement("span", {
      className: "live-tag"
    }, /*#__PURE__*/React.createElement("span", {
      className: "live"
    }), agg.active, " active")), /*#__PURE__*/React.createElement(window.StatStrip, {
      items: [{
        k: 'Sessions',
        icon: 'layers',
        v: visible.length,
        d: agg.active + ' active'
      }, {
        k: 'Work orders',
        icon: 'pickaxe',
        v: agg.orders,
        d: agg.refining + ' refining now'
      }, {
        k: 'Gross value',
        icon: 'coins',
        v: O.moneyAbbr(agg.gross),
        unit: 'aUEC',
        d: 'this view'
      }, {
        k: 'Net payout',
        icon: 'handCoins',
        v: O.moneyAbbr(agg.net),
        unit: 'aUEC',
        d: 'after expenses',
        tone: 'up'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      className: "toolbar-row"
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "Filter by status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [{
        value: 'all',
        label: 'All',
        count: counts('all')
      }, {
        value: 'active',
        label: 'Active',
        count: counts('active')
      }, {
        value: 'closed',
        label: 'To settle',
        count: counts('closed')
      }, {
        value: 'planned',
        label: 'Planned',
        count: counts('planned')
      }, {
        value: 'settled',
        label: 'Settled',
        count: counts('settled')
      }]
    })), visible.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: "layers",
      title: "No sessions here",
      text: "Nothing matches this filter. Start a new session to coordinate your next op."
    }) : /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap",
      style: {
        marginTop: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Work sessions"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Session"), /*#__PURE__*/React.createElement("th", null, "Lead"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Orders"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Net payout"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, visible.map(s => {
      const t = O.sessionTotals(s),
        st = O.SESSION_STATUS[s.status];
      return /*#__PURE__*/React.createElement("tr", {
        key: s.id,
        onClick: () => onOpen(s.id),
        style: {
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: 'ent-ic sess-rowic ' + (s.live ? 'live' : '')
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "layers",
        size: 16
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, s.name), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, s.id, " \xB7 ", s.theater)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(window.AvatarChip, {
        name: s.lead
      })), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, t.orders, /*#__PURE__*/React.createElement("span", {
        className: "t-faint"
      }, " \xB7 ", t.ships, "\uD83D\uDE80")), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, t.net ? O.moneyAbbr(t.net) : '—', " ", /*#__PURE__*/React.createElement("span", {
        className: "t-faint"
      }, t.net ? 'aUEC' : '')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
        tone: st.tone,
        icon: st.icon
      }, st.label)), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "list-hint"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open session ", /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "n")), " new ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, visible.length, " sessions"))));
  }

  /* =========================================================
     PAGE
     ========================================================= */
  function SessionsScreen({
    onNavigate
  }) {
    const [sessions, setSessions] = React.useState(() => O.WORK_SESSIONS.map(s => ({
      ...s
    })));
    const [activeId, setActiveId] = React.useState(null);
    const [scope, setScope] = React.useState('leadership');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [newSession, setNewSession] = React.useState(false);
    const [orderId, setOrderId] = React.useState(null);
    const [gateId, setGateId] = React.useState(null);
    const active = activeId ? sessions.find(s => s.id === activeId) : null;
    const openOrder = active && orderId ? active.orders.find(o => o.id === orderId) : null;
    const gateSession = gateId ? sessions.find(s => s.id === gateId) : null;
    const joinViaGate = () => {
      setSessions(xs => xs.map(s => s.id === gateId ? {
        ...s,
        participants: s.participants.includes(ME) ? s.participants : [...s.participants, ME],
        invited: (s.invited || []).filter(x => x !== ME)
      } : s));
      setActiveId(gateId);
      setGateId(null);
      window.toast('You joined the session', 'userCheck');
    };
    const declineGate = () => {
      setSessions(xs => xs.map(s => s.id === gateId ? {
        ...s,
        invited: (s.invited || []).filter(x => x !== ME),
        declined: (s.declined || []).includes(ME) ? s.declined : [...(s.declined || []), ME]
      } : s));
      setGateId(null);
      setActiveId(null);
      setOrderId(null);
    };
    React.useEffect(() => {
      const onKey = e => {
        if (e.key === 'n' && !/input|textarea|select/i.test(e.target.tagName) && !document.querySelector('.modal-backdrop') && !document.querySelector('.drawer')) {
          e.preventDefault();
          if (!active) setNewSession(true);
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [active]);
    React.useEffect(() => {
      window.scrollTo(0, 0);
      document.querySelector('.shell-page') && document.querySelector('.shell-page').scrollTo(0, 0);
    }, [activeId]);
    const mutateSession = (updated, removeId) => {
      setSessions(xs => {
        if (removeId) return xs.filter(s => s.id !== removeId);
        return xs.map(s => s.id === updated.id ? updated : s);
      });
    };
    const createSession = data => {
      const s = {
        id: 'WS-' + Math.floor(120 + Math.random() * 80),
        name: data.name,
        theater: data.theater,
        lead: ME,
        status: data.status,
        started: 'Just now',
        window: data.window,
        live: data.status === 'active',
        note: '',
        participants: [ME],
        orders: [],
        crews: []
      };
      setSessions(xs => [s, ...xs]);
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, active ? /*#__PURE__*/React.createElement(SessionDetail, {
      session: active,
      onNavigate: onNavigate,
      onBack: () => {
        setActiveId(null);
        setOrderId(null);
      },
      onMutate: mutateSession,
      onOpenOrder: o => setOrderId(o.id),
      onPreviewJoin: id => {
        setActiveId(null);
        setOrderId(null);
        setGateId(id);
      }
    }) : /*#__PURE__*/React.createElement(SessionsList, {
      sessions: sessions,
      scope: scope,
      setScope: setScope,
      statusFilter: statusFilter,
      setStatusFilter: setStatusFilter,
      onOpen: setActiveId,
      onNew: () => setNewSession(true)
    }), gateSession && /*#__PURE__*/React.createElement(JoinGateModal, {
      session: gateSession,
      onJoin: joinViaGate,
      onDecline: declineGate
    }), newSession && /*#__PURE__*/React.createElement(NewSessionModal, {
      onClose: () => setNewSession(false),
      onCreate: createSession
    }), openOrder && /*#__PURE__*/React.createElement(OrderDrawer, {
      order: openOrder,
      session: active,
      sessionStatus: active.status,
      onNavigate: onNavigate,
      onClose: () => setOrderId(null),
      onSaved: u => mutateSession({
        ...active,
        orders: active.orders.map(o => o.id === u.id ? u : o)
      }),
      onDeleted: o => mutateSession({
        ...active,
        orders: active.orders.filter(x => x.id !== o.id)
      })
    }));
  }
  window.SessionsScreen = SessionsScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-sessions.jsx", error: String((e && e.message) || e) }); }

// app-v2/screens-treasury.jsx
try { (() => {
/* ============================================================
   STATION APP — Treasury (v1.0)
   Multiple accounts · ledger · payout requests + approval.
   Leadership: all accounts, approve/deny payouts, transfer.
   Member: my balance, my requests, request payout.
   Tx review/edit/void + payout approve/deny slide-outs.
   Create flows are modals. Every modify/destructive action
   is gated by confirmAction().
   ============================================================ */
(() => {
  const O = window.OPS;
  const ME = 'Mara Vex';
  const A = O.TREASURY_ACCOUNTS;
  function Pill({
    tone,
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: 'chip-badge ' + (tone || 'neutral')
    }, icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 11
    }), children);
  }
  const acctName = id => {
    const a = O.accountById(id);
    return a ? a.name : id;
  };

  /* ---- transaction drawer (review · edit · void) ---------- */
  function TxDrawer({
    tx,
    onClose,
    onSaved,
    onVoided
  }) {
    const [editing, setEditing] = React.useState(false);
    const [form, setForm] = React.useState(tx);
    React.useEffect(() => {
      setForm(tx);
      setEditing(false);
    }, [tx && tx.id]);
    if (!tx) return null;
    const t = editing ? form : tx;
    const meta = O.TX_TYPE[t.type],
      st = O.TX_STATUS[t.status];
    const inbound = meta.dir === 'in';
    const set = (k, v) => setForm(f => ({
      ...f,
      [k]: v
    }));
    const save = async () => {
      if (!(await window.confirmAction({
        title: 'Save changes to ' + tx.id + '?',
        body: 'Edits the ledger entry. The account balance updates to match.',
        confirmLabel: 'Save changes',
        icon: 'save'
      }))) return;
      onSaved(form);
      setEditing(false);
      window.toast(tx.id + ' updated', 'check');
    };
    const voidTx = async () => {
      if (!(await window.confirmAction({
        title: 'Void ' + tx.id + '?',
        body: 'Reverses this ' + meta.label.toLowerCase() + ' of ' + O.moneyFmt(t.amount) + ' aUEC and marks it voided in the ledger. This cannot be undone.',
        confirmLabel: 'Void transaction',
        tone: 'danger',
        icon: 'trash',
        requireText: tx.id
      }))) return;
      onVoided(tx);
      onClose();
      window.toast(tx.id + ' voided', 'trash');
    };
    const clear = async () => {
      if (!(await window.confirmAction({
        title: 'Clear ' + tx.id + '?',
        body: 'Marks this pending transaction as cleared.',
        confirmLabel: 'Mark cleared',
        icon: 'check'
      }))) return;
      onSaved({
        ...tx,
        status: 'cleared'
      });
      window.toast(tx.id + ' cleared', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!tx,
      onClose: onClose,
      width: 440
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, tx.id, " \xB7 Transaction"), t.status !== 'void' && !editing && /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: () => setEditing(true),
      title: "Edit",
      "aria-label": "Edit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tx-amount-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'tx-dir ' + meta.dir
    }, /*#__PURE__*/React.createElement(Icon, {
      name: meta.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      className: 'tx-amount ' + (inbound ? 'pos' : t.type === 'transfer' ? '' : 'neg')
    }, inbound ? '+' : t.type === 'transfer' ? '' : '−', O.moneyFmt(t.amount), " ", /*#__PURE__*/React.createElement("small", null, "aUEC")), /*#__PURE__*/React.createElement("div", {
      className: "tx-sub"
    }, meta.label, " \xB7 ", st.label)), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.Field, {
      label: "Amount"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      value: t.amount,
      onChange: e => set('amount', Math.max(0, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "aUEC"))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Account"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: t.account,
      onChange: e => set('account', e.target.value)
    }, A.map(a => /*#__PURE__*/React.createElement("option", {
      key: a.id,
      value: a.id
    }, a.name)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Description"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: t.party,
      onChange: e => set('party', e.target.value)
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Note"
    }, /*#__PURE__*/React.createElement("textarea", {
      className: "fld",
      value: t.note,
      onChange: e => set('note', e.target.value)
    }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Account"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, acctName(t.account))), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Counterparty"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, t.party)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Date"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, t.date)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Status"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, /*#__PURE__*/React.createElement(Pill, {
      tone: st.tone
    }, st.label))), t.note && /*#__PURE__*/React.createElement("div", {
      className: "tx-note"
    }, t.note)))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost flex-none",
      onClick: () => {
        setForm(tx);
        setEditing(false);
      }
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: save
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "save",
      size: 15
    }), " Save changes")) : t.status === 'void' ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close") : /*#__PURE__*/React.createElement(React.Fragment, null, t.status === 'pending' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: clear
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    }), " Clear"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger flex-none",
      onClick: voidTx
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 15
    }), " Void"), t.status !== 'pending' && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: () => setEditing(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 15
    }), " Edit"))));
  }

  /* ---- payout request drawer (approve · deny) ------------- */
  function RequestDrawer({
    req,
    onClose,
    onResolve
  }) {
    if (!req) return null;
    const acct = O.accountById(req.account);
    const reqStatus = {
      pending: {
        tone: 'warn',
        label: 'Pending review'
      },
      approved: {
        tone: 'success',
        label: 'Approved'
      },
      denied: {
        tone: 'danger',
        label: 'Denied'
      }
    }[req.status];
    const approve = async () => {
      if (!(await window.confirmAction({
        title: 'Approve payout to ' + req.member + '?',
        body: 'Releases ' + O.moneyFmt(req.amount) + ' aUEC from ' + acct.name + ' to ' + req.member + '.',
        confirmLabel: 'Approve & pay',
        icon: 'handCoins'
      }))) return;
      onResolve({
        ...req,
        status: 'approved'
      });
      onClose();
      window.toast('Payout approved — ' + req.member, 'handCoins');
    };
    const deny = async () => {
      if (!(await window.confirmAction({
        title: 'Deny payout to ' + req.member + '?',
        body: 'Rejects this request for ' + O.moneyFmt(req.amount) + ' aUEC. ' + req.member + ' will be notified.',
        confirmLabel: 'Deny request',
        tone: 'danger',
        icon: 'close'
      }))) return;
      onResolve({
        ...req,
        status: 'denied'
      });
      onClose();
      window.toast('Request denied', 'close');
    };
    return /*#__PURE__*/React.createElement(window.Drawer, {
      open: !!req,
      onClose: onClose,
      width: 440
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dh-kicker"
    }, req.id, " \xB7 Payout request"), /*#__PURE__*/React.createElement("button", {
      className: "d-iconbtn",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero"
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: req.member,
      size: 48
    }), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-hero-t"
    }, req.member), /*#__PURE__*/React.createElement("div", {
      className: "d-hero-s"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar"
    }), "Requested ", req.requested)), /*#__PURE__*/React.createElement(Pill, {
      tone: reqStatus.tone
    }, reqStatus.label)), /*#__PURE__*/React.createElement("div", {
      className: "d-metric"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mk"
    }, "Requested amount"), /*#__PURE__*/React.createElement("div", {
      className: "mv"
    }, O.moneyFmt(req.amount), /*#__PURE__*/React.createElement("small", null, "aUEC")))), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-cap"
    }, "Reason"), /*#__PURE__*/React.createElement("p", {
      className: "tx-note",
      style: {
        marginTop: 0
      }
    }, req.reason)), /*#__PURE__*/React.createElement("div", {
      className: "detail-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "From account"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, acct.name)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Account balance"), /*#__PURE__*/React.createElement("span", {
      className: "v t-mono"
    }, O.moneyFmt(acct.balance), " aUEC")), req.session && /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Linked session"), /*#__PURE__*/React.createElement("span", {
      className: "v t-mono"
    }, req.session)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "After payout"), /*#__PURE__*/React.createElement("span", {
      className: "v t-mono"
    }, O.moneyFmt(acct.balance - req.amount), " aUEC")))), /*#__PURE__*/React.createElement("div", {
      className: "drawer-foot"
    }, req.status === 'pending' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger flex-none",
      onClick: deny
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 15
    }), " Deny"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: approve
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "handCoins",
      size: 15
    }), " Approve & pay")) : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: onClose
    }, "Close")));
  }

  /* ---- modals --------------------------------------------- */
  function NewTxModal({
    onClose,
    onCreate
  }) {
    const [dir, setDir] = React.useState('in');
    const [amount, setAmount] = React.useState(0);
    const [account, setAccount] = React.useState('ops');
    const [type, setType] = React.useState('deposit');
    const [party, setParty] = React.useState('');
    const valid = amount > 0 && party.trim();
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Record transaction?',
        body: (dir === 'in' ? '+' : '−') + O.moneyFmt(amount) + ' aUEC on ' + acctName(account) + '. The balance updates immediately.',
        confirmLabel: 'Record transaction',
        icon: 'check'
      }))) return;
      onCreate({
        type,
        account,
        amount,
        party: party.trim()
      });
      onClose();
      window.toast('Transaction recorded', 'check');
    };
    const typeOpts = dir === 'in' ? ['deposit', 'reward', 'refine', 'dues'] : ['expense', 'payout', 'fee'];
    React.useEffect(() => {
      setType(typeOpts[0]);
    }, [dir]);
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "Record transaction",
      icon: "receipt",
      onClose: onClose,
      width: 520,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 15
      }), " Record"))
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Direction"
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: 2,
      value: dir,
      onChange: setDir,
      options: [{
        value: 'in',
        label: 'Money in',
        desc: 'Deposit / reward',
        icon: 'arrowDownLeft'
      }, {
        value: 'out',
        label: 'Money out',
        desc: 'Expense / payout',
        icon: 'arrowUpRight'
      }]
    })), /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Amount",
      required: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "1",
      value: amount,
      onChange: e => setAmount(Math.max(0, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "aUEC"))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Type"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: type,
      onChange: e => setType(e.target.value)
    }, typeOpts.map(tp => /*#__PURE__*/React.createElement("option", {
      key: tp,
      value: tp
    }, O.TX_TYPE[tp].label))))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Account"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: account,
      onChange: e => setAccount(e.target.value)
    }, A.map(a => /*#__PURE__*/React.createElement("option", {
      key: a.id,
      value: a.id
    }, a.name, " \u2014 ", O.moneyFmt(a.balance), " aUEC")))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Description",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      value: party,
      onChange: e => setParty(e.target.value),
      placeholder: "Counterparty or memo"
    })));
  }
  function RequestPayoutModal({
    onClose,
    onCreate
  }) {
    const [amount, setAmount] = React.useState(0);
    const [account, setAccount] = React.useState('payroll');
    const [reason, setReason] = React.useState('');
    const valid = amount > 0 && reason.trim();
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Submit payout request?',
        body: 'Requests ' + O.moneyFmt(amount) + ' aUEC from ' + acctName(account) + '. Leadership will review and approve.',
        confirmLabel: 'Submit request',
        icon: 'send'
      }))) return;
      onCreate({
        amount,
        account,
        reason: reason.trim()
      });
      onClose();
      window.toast('Payout request submitted', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "Request a payout",
      icon: "handCoins",
      onClose: onClose,
      width: 500,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "send",
        size: 15
      }), " Submit request"))
    }, /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Amount",
      required: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "1",
      value: amount,
      onChange: e => setAmount(Math.max(0, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "aUEC"))), /*#__PURE__*/React.createElement(window.Field, {
      label: "From account"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: account,
      onChange: e => setAccount(e.target.value)
    }, A.map(a => /*#__PURE__*/React.createElement("option", {
      key: a.id,
      value: a.id
    }, a.name))))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Reason",
      required: true,
      hint: "What's this payout for?"
    }, /*#__PURE__*/React.createElement("textarea", {
      className: "fld",
      value: reason,
      onChange: e => setReason(e.target.value),
      placeholder: "e.g. Crew share \u2014 Aaron Halo dragline"
    })));
  }
  function TransferModal({
    onClose,
    onTransfer
  }) {
    const [from, setFrom] = React.useState('mining');
    const [to, setTo] = React.useState('ops');
    const [amount, setAmount] = React.useState(0);
    const valid = amount > 0 && from !== to;
    const submit = async () => {
      if (!(await window.confirmAction({
        title: 'Transfer funds?',
        body: 'Moves ' + O.moneyFmt(amount) + ' aUEC from ' + acctName(from) + ' to ' + acctName(to) + '.',
        confirmLabel: 'Transfer',
        icon: 'arrowLeftRight'
      }))) return;
      onTransfer({
        from,
        to,
        amount
      });
      onClose();
      window.toast('Funds transferred', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "Transfer funds",
      icon: "arrowLeftRight",
      onClose: onClose,
      width: 500,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: submit
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "arrowLeftRight",
        size: 15
      }), " Transfer"))
    }, /*#__PURE__*/React.createElement("div", {
      className: "field-2"
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "From"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: from,
      onChange: e => setFrom(e.target.value)
    }, A.map(a => /*#__PURE__*/React.createElement("option", {
      key: a.id,
      value: a.id
    }, a.name)))), /*#__PURE__*/React.createElement(window.Field, {
      label: "To"
    }, /*#__PURE__*/React.createElement("select", {
      className: "fld",
      value: to,
      onChange: e => setTo(e.target.value)
    }, A.map(a => /*#__PURE__*/React.createElement("option", {
      key: a.id,
      value: a.id
    }, a.name))))), /*#__PURE__*/React.createElement(window.Field, {
      label: "Amount",
      required: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "1",
      value: amount,
      onChange: e => setAmount(Math.max(0, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "aUEC"))), from === to && /*#__PURE__*/React.createElement("div", {
      className: "method-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 13
    }), "Choose two different accounts."));
  }

  /* ---- treasury page -------------------------------------- */
  function NewAccountModal({
    onClose,
    onCreate
  }) {
    const [name, setName] = React.useState('');
    const [kind, setKind] = React.useState('division');
    const [balance, setBalance] = React.useState(0);
    const valid = name.trim();
    const ICN = {
      operating: 'landmark',
      division: 'shield',
      payroll: 'handCoins',
      reserve: 'piggyBank'
    };
    const create = async () => {
      if (!(await window.confirmAction({
        title: 'Create account?',
        body: '“' + name.trim() + '” will be added to the treasury' + (balance > 0 ? ' with an opening balance of ' + O.moneyFmt(balance) + ' aUEC' : '') + '.',
        confirmLabel: 'Create account',
        icon: 'plus'
      }))) return;
      onCreate({
        name: name.trim(),
        kind,
        balance: +balance || 0,
        icon: ICN[kind] || 'landmark'
      });
      onClose();
      window.toast('Account created', 'check');
    };
    return /*#__PURE__*/React.createElement(window.Modal, {
      title: "New account",
      icon: "landmark",
      onClose: onClose,
      width: 520,
      foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "grow"
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        disabled: !valid,
        onClick: create
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }), " Create account"))
    }, /*#__PURE__*/React.createElement(window.Field, {
      label: "Account name",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      autoFocus: true,
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "e.g. Exploration Division Fund"
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Account type",
      required: true
    }, /*#__PURE__*/React.createElement(window.ChoiceCards, {
      columns: 2,
      value: kind,
      onChange: setKind,
      options: [{
        value: 'operating',
        label: 'Operating',
        desc: 'Day-to-day treasury',
        icon: 'landmark'
      }, {
        value: 'division',
        label: 'Division',
        desc: 'Earmarked for a unit',
        icon: 'shield'
      }, {
        value: 'payroll',
        label: 'Payroll',
        desc: 'Held for payouts',
        icon: 'handCoins'
      }, {
        value: 'reserve',
        label: 'Reserve',
        desc: 'Savings / rainy day',
        icon: 'piggyBank'
      }]
    })), /*#__PURE__*/React.createElement(window.Field, {
      label: "Opening balance",
      hint: "optional"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fld-affix"
    }, /*#__PURE__*/React.createElement("input", {
      className: "fld",
      type: "number",
      min: "0",
      value: balance,
      onChange: e => setBalance(Math.max(0, +e.target.value))
    }), /*#__PURE__*/React.createElement("span", {
      className: "suffix"
    }, "aUEC"))));
  }
  function TreasuryScreen() {
    const [accounts, setAccounts] = React.useState(() => A.map(a => ({
      ...a
    })));
    const [txs, setTxs] = React.useState(() => O.TREASURY_TX.map(t => ({
      ...t
    })));
    const [reqs, setReqs] = React.useState(() => O.PAYOUT_REQUESTS.map(r => ({
      ...r
    })));
    const [tab, setTab] = React.useState('ledger');
    const [acctFilter, setAcctFilter] = React.useState('all');
    const [openTx, setOpenTx] = React.useState(null);
    const [openReq, setOpenReq] = React.useState(null);
    const [modal, setModal] = React.useState(null);
    const totalBal = accounts.reduce((s, a) => s + a.balance, 0);
    const pendingPayouts = reqs.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0);
    const pendingCount = reqs.filter(r => r.status === 'pending').length;
    const inflow = txs.filter(t => O.TX_TYPE[t.type].dir === 'in' && t.status === 'cleared').reduce((s, t) => s + t.amount, 0);
    const outflow = txs.filter(t => O.TX_TYPE[t.type].dir === 'out' && t.status === 'cleared').reduce((s, t) => s + t.amount, 0);
    const visibleTx = txs.filter(t => acctFilter === 'all' || t.account === acctFilter);
    const saveTx = t => setTxs(xs => xs.map(x => x.id === t.id ? t : x));
    const voidTx = t => setTxs(xs => xs.map(x => x.id === t.id ? {
      ...x,
      status: 'void'
    } : x));
    const resolveReq = r => setReqs(xs => xs.map(x => x.id === r.id ? r : x));
    const addTx = d => {
      const nt = {
        id: 'TX-' + Math.floor(7842 + Math.random() * 90),
        date: 'Just now',
        account: d.account,
        type: d.type,
        amount: d.amount,
        party: d.party,
        status: 'cleared',
        note: ''
      };
      setTxs(xs => [nt, ...xs]);
      const dir = O.TX_TYPE[d.type].dir;
      setAccounts(xs => xs.map(a => a.id === d.account ? {
        ...a,
        balance: a.balance + (dir === 'in' ? d.amount : -d.amount)
      } : a));
    };
    const addReq = d => {
      const nr = {
        id: 'PR-' + Math.floor(319 + Math.random() * 80),
        member: ME,
        amount: d.amount,
        account: d.account,
        reason: d.reason,
        requested: 'Just now',
        status: 'pending',
        session: null
      };
      setReqs(xs => [nr, ...xs]);
    };
    const transfer = d => setAccounts(xs => xs.map(a => a.id === d.from ? {
      ...a,
      balance: a.balance - d.amount
    } : a.id === d.to ? {
      ...a,
      balance: a.balance + d.amount
    } : a));
    const addAccount = d => {
      const acct = {
        id: 'acct-' + Date.now().toString(36),
        name: d.name,
        kind: d.kind,
        icon: d.icon,
        balance: d.balance || 0,
        note: ''
      };
      setAccounts(xs => [...xs, acct]);
      if (window.OPS && window.OPS.TREASURY_ACCOUNTS) window.OPS.TREASURY_ACCOUNTS.push(acct);
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "crumb"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "treasury"
    }), " Assets ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight"
    }), " Treasury"), /*#__PURE__*/React.createElement("h1", {
      className: "page-title"
    }, "Treasury"), /*#__PURE__*/React.createElement("p", {
      className: "page-sub"
    }, "Every aUEC the org holds \u2014 across operating, division and payroll accounts \u2014 with a full ledger and a payout-approval queue. Money in green, money out in coral.")), /*#__PURE__*/React.createElement("div", {
      className: "page-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => setModal('request')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "handCoins",
      size: 15
    }), " Request payout"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => setModal('transfer')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowLeftRight",
      size: 15
    }), " Transfer"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: () => setModal('tx')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    }), " Record"))), /*#__PURE__*/React.createElement(window.StatStrip, {
      items: [{
        k: 'Total balance',
        icon: 'landmark',
        v: O.moneyAbbr(totalBal),
        unit: 'aUEC',
        d: accounts.length + ' accounts'
      }, {
        k: 'Pending payouts',
        icon: 'handCoins',
        v: O.moneyAbbr(pendingPayouts),
        unit: 'aUEC',
        d: pendingCount + ' awaiting approval',
        tone: pendingCount ? 'warn' : null
      }, {
        k: '30d inflow',
        icon: 'arrowDownLeft',
        v: O.moneyAbbr(inflow),
        unit: 'aUEC',
        d: 'cleared',
        tone: 'up'
      }, {
        k: '30d outflow',
        icon: 'arrowUpRight',
        v: O.moneyAbbr(outflow),
        unit: 'aUEC',
        d: 'cleared'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      className: "treasury-split"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "acct-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "acct-panel-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "aph-k"
    }, "Total balance"), /*#__PURE__*/React.createElement("div", {
      className: "aph-v"
    }, O.moneyFmt(totalBal), " ", /*#__PURE__*/React.createElement("span", null, "aUEC"))), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      onClick: () => setModal('account')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " New")), /*#__PURE__*/React.createElement("div", {
      className: "acct-scroll"
    }, /*#__PURE__*/React.createElement("button", {
      className: 'acct-row' + (acctFilter === 'all' ? ' active' : ''),
      onClick: () => setAcctFilter('all')
    }, /*#__PURE__*/React.createElement("span", {
      className: "acct-ic ak-all"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "wallet",
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "acct-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "acct-nm"
    }, "All accounts"), /*#__PURE__*/React.createElement("div", {
      className: "acct-kind"
    }, accounts.length, " combined")), /*#__PURE__*/React.createElement("div", {
      className: "acct-bal"
    }, O.moneyAbbr(totalBal), /*#__PURE__*/React.createElement("span", null, "aUEC"))), accounts.map(a => /*#__PURE__*/React.createElement("button", {
      className: 'acct-row' + (acctFilter === a.id ? ' active' : ''),
      key: a.id,
      onClick: () => setAcctFilter(a.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: 'acct-ic ak-' + a.kind
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "acct-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "acct-nm"
    }, a.name), /*#__PURE__*/React.createElement("div", {
      className: "acct-kind"
    }, a.kind)), /*#__PURE__*/React.createElement("div", {
      className: "acct-bal"
    }, O.moneyAbbr(a.balance), /*#__PURE__*/React.createElement("span", null, "aUEC")))))), /*#__PURE__*/React.createElement("div", {
      className: "acct-detail"
    }, /*#__PURE__*/React.createElement("div", {
      className: "toolbar-row",
      style: {
        justifyContent: 'space-between',
        marginTop: 0
      }
    }, /*#__PURE__*/React.createElement(window.SegFilter, {
      ariaLabel: "View",
      value: tab,
      onChange: setTab,
      options: [{
        value: 'ledger',
        label: 'Ledger',
        icon: 'receipt'
      }, {
        value: 'requests',
        label: 'Payout requests',
        icon: 'handCoins',
        count: pendingCount
      }]
    }), tab === 'ledger' && acctFilter !== 'all' && /*#__PURE__*/React.createElement("span", {
      className: "acct-filter-tag"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "tag",
      size: 12
    }), " ", acctName(acctFilter), " ", /*#__PURE__*/React.createElement("button", {
      onClick: () => setAcctFilter('all'),
      "aria-label": "Clear account filter"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 12
    })))), tab === 'ledger' ? /*#__PURE__*/React.createElement("div", {
      className: "dtable-wrap",
      style: {
        marginTop: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "dtable",
      "aria-label": "Transaction ledger"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Transaction"), /*#__PURE__*/React.createElement("th", null, "Account"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Amount"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, visibleTx.map(t => {
      const meta = O.TX_TYPE[t.type],
        st = O.TX_STATUS[t.status],
        inbound = meta.dir === 'in';
      return /*#__PURE__*/React.createElement("tr", {
        key: t.id,
        onClick: () => setOpenTx(t),
        style: {
          cursor: 'pointer',
          opacity: t.status === 'void' ? 0.55 : 1
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "ent"
      }, /*#__PURE__*/React.createElement("span", {
        className: 'ent-ic tx-ic ' + meta.dir
      }, /*#__PURE__*/React.createElement(Icon, {
        name: meta.icon,
        size: 15
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "ent-nm"
      }, meta.label), /*#__PURE__*/React.createElement("div", {
        className: "ent-sub"
      }, t.id, " \xB7 ", t.party)))), /*#__PURE__*/React.createElement("td", {
        className: "t-muted",
        style: {
          fontSize: 'var(--text-xs)'
        }
      }, acctName(t.account)), /*#__PURE__*/React.createElement("td", {
        className: "t-muted",
        style: {
          fontSize: 'var(--text-xs)'
        }
      }, t.date), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
        tone: st.tone
      }, st.label)), /*#__PURE__*/React.createElement("td", {
        className: 'num tx-amt ' + (inbound ? 'pos' : t.type === 'transfer' ? '' : 'neg'),
        style: {
          textDecoration: t.status === 'void' ? 'line-through' : 'none'
        }
      }, inbound ? '+' : t.type === 'transfer' ? '' : '−', O.moneyFmt(t.amount)), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)'
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "list-hint"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbd"
    }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open transaction ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, visibleTx.length, " entries"))) : /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'var(--space-5)'
      }
    }, reqs.filter(r => r.status === 'pending').length === 0 && /*#__PURE__*/React.createElement(window.EmptyState, {
      icon: "badgeCheck",
      title: "No payouts awaiting approval",
      text: "Every request has been actioned. New requests will appear here for review."
    }), /*#__PURE__*/React.createElement("div", {
      className: "req-list"
    }, reqs.map(r => {
      const acct = O.accountById(r.account);
      const rs = {
        pending: {
          tone: 'warn',
          label: 'Pending'
        },
        approved: {
          tone: 'success',
          label: 'Approved'
        },
        denied: {
          tone: 'danger',
          label: 'Denied'
        }
      }[r.status];
      return /*#__PURE__*/React.createElement("div", {
        className: 'req-card' + (r.status === 'pending' ? ' pending' : ''),
        key: r.id,
        onClick: () => setOpenReq(r)
      }, /*#__PURE__*/React.createElement(window.Avatar, {
        name: r.member,
        size: 40
      }), /*#__PURE__*/React.createElement("div", {
        className: "req-main"
      }, /*#__PURE__*/React.createElement("div", {
        className: "req-top"
      }, /*#__PURE__*/React.createElement("span", {
        className: "req-nm"
      }, r.member), /*#__PURE__*/React.createElement(Pill, {
        tone: rs.tone
      }, rs.label)), /*#__PURE__*/React.createElement("div", {
        className: "req-reason"
      }, r.reason), /*#__PURE__*/React.createElement("div", {
        className: "req-meta"
      }, r.id, " \xB7 ", acct.name, " \xB7 ", r.requested)), /*#__PURE__*/React.createElement("div", {
        className: "req-amt"
      }, O.moneyFmt(r.amount), /*#__PURE__*/React.createElement("span", null, "aUEC")), r.status === 'pending' && /*#__PURE__*/React.createElement("div", {
        className: "req-acts",
        onClick: e => e.stopPropagation()
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn btn-ghost btn-sm",
        onClick: async () => {
          if (await window.confirmAction({
            title: 'Deny payout to ' + r.member + '?',
            body: 'Rejects ' + O.moneyFmt(r.amount) + ' aUEC.',
            confirmLabel: 'Deny request',
            tone: 'danger',
            icon: 'close'
          })) {
            resolveReq({
              ...r,
              status: 'denied'
            });
            window.toast('Request denied', 'close');
          }
        }
      }, "Deny"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary btn-sm",
        onClick: async () => {
          if (await window.confirmAction({
            title: 'Approve payout to ' + r.member + '?',
            body: 'Releases ' + O.moneyFmt(r.amount) + ' aUEC from ' + acct.name + '.',
            confirmLabel: 'Approve & pay',
            icon: 'handCoins'
          })) {
            resolveReq({
              ...r,
              status: 'approved'
            });
            window.toast('Payout approved', 'handCoins');
          }
        }
      }, "Approve")), /*#__PURE__*/React.createElement(Icon, {
        name: "chevronRight",
        size: 16,
        style: {
          color: 'var(--text-faint)',
          flex: 'none'
        }
      }));
    }))))), modal === 'tx' && /*#__PURE__*/React.createElement(NewTxModal, {
      onClose: () => setModal(null),
      onCreate: addTx
    }), modal === 'account' && /*#__PURE__*/React.createElement(NewAccountModal, {
      onClose: () => setModal(null),
      onCreate: addAccount
    }), modal === 'request' && /*#__PURE__*/React.createElement(RequestPayoutModal, {
      onClose: () => setModal(null),
      onCreate: addReq
    }), modal === 'transfer' && /*#__PURE__*/React.createElement(TransferModal, {
      onClose: () => setModal(null),
      onTransfer: transfer
    }), openTx && /*#__PURE__*/React.createElement(TxDrawer, {
      tx: openTx,
      onClose: () => setOpenTx(null),
      onSaved: saveTx,
      onVoided: voidTx
    }), openReq && /*#__PURE__*/React.createElement(RequestDrawer, {
      req: openReq,
      onClose: () => setOpenReq(null),
      onResolve: resolveReq
    }));
  }
  window.TreasuryScreen = TreasuryScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/screens-treasury.jsx", error: String((e && e.message) || e) }); }

// app-v2/shell.jsx
try { (() => {
/* ============================================================
   STATION APP — AppShell (sidebar · appbar · org switcher ·
   command palette ⌘K · keyboard help · theme + accent toggles)
   Mirrors src/components/AppShell.tsx using the real shell.css.
   ============================================================ */
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
const NAV_HOME = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'dashboard',
  key: 'd'
}];
const NAV_PRIMARY = [{
  id: 'contracts',
  label: 'Contracts',
  icon: 'contracts',
  key: 'c'
}, {
  id: 'hr',
  label: 'Human Resources',
  icon: 'members',
  key: 'm',
  children: [{
    id: 'members',
    label: 'Members',
    icon: 'members'
  }, {
    id: 'business-units',
    label: 'Business Units',
    icon: 'tree'
  }]
}, {
  id: 'refinery',
  label: 'Refinery',
  icon: 'refinery'
}, {
  id: 'sessions',
  label: 'Work Sessions',
  icon: 'pickaxe',
  key: 'w'
}];
const NAV_ASSETS = [{
  id: 'fleet',
  label: 'Fleet',
  icon: 'fleet',
  key: 'f'
}, {
  id: 'blueprints',
  label: 'Blueprints',
  icon: 'blueprint'
}, {
  id: 'market',
  label: 'Market',
  icon: 'coins'
}, {
  id: 'inventory',
  label: 'Inventory',
  icon: 'inventory'
}, {
  id: 'treasury',
  label: 'Treasury',
  icon: 'treasury'
}];
const NAV_SYSTEM = [{
  id: 'admin-invites',
  label: 'Invite Management',
  icon: 'userPlus'
}];
const ALL_NAV = [...NAV_HOME, ...NAV_PRIMARY, ...NAV_ASSETS, ...NAV_SYSTEM];
function SideLink({
  item,
  active,
  onNavigate
}) {
  const isActive = active === item.id;
  return /*#__PURE__*/React.createElement("a", {
    className: 'side-link' + (isActive ? ' active' : '') + (item.soon ? ' soon' : ''),
    onClick: e => {
      e.preventDefault();
      if (!item.soon) onNavigate(item.id);
    },
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon
  }), /*#__PURE__*/React.createElement("span", {
    className: "side-link-label"
  }, item.label), item.soon ? /*#__PURE__*/React.createElement("span", {
    className: "side-link-soon-tag"
  }, "soon") : item.key && /*#__PURE__*/React.createElement("span", {
    className: "side-link-key"
  }, item.key));
}
function NavGroup({
  item,
  active,
  onNavigate
}) {
  const childActive = item.children.some(c => c.id === active) || active === item.id;
  const [open, setOpen] = useState(childActive);
  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);
  return /*#__PURE__*/React.createElement("div", {
    className: "side-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: 'side-link side-link-group' + (active === item.id ? ' active' : ''),
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "side-link-group-main",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate(item.id);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon
  }), /*#__PURE__*/React.createElement("span", {
    className: "side-link-label"
  }, item.label)), /*#__PURE__*/React.createElement("button", {
    className: 'side-group-toggle' + (open ? ' open' : ''),
    onClick: () => setOpen(o => !o),
    "aria-label": "Toggle"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 16
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "side-children"
  }, item.children.map(c => /*#__PURE__*/React.createElement("a", {
    key: c.id,
    className: 'side-link side-link-child' + (active === c.id ? ' active' : ''),
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate(c.id);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.icon,
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    className: "side-link-label"
  }, c.label)))));
}
function OrgSwitcher() {
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState(ORGS);
  const [selected, setSelected] = useState(ORGS[0].id);
  const cur = orgs.find(o => o.id === selected);
  const move = (idx, dir) => {
    const next = [...orgs];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setOrgs(next);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "side-org-wrap"
  }, /*#__PURE__*/React.createElement("a", {
    className: "side-org-home",
    href: "#",
    onClick: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement("span", {
    className: "side-org-badge"
  }, cur.tag), /*#__PURE__*/React.createElement("span", {
    className: "side-org-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "side-org-name"
  }, cur.name), /*#__PURE__*/React.createElement("span", {
    className: "side-org-role"
  }, cur.role))), /*#__PURE__*/React.createElement("button", {
    className: 'side-org-switch' + (open ? ' open' : ''),
    onClick: () => setOpen(o => !o),
    "aria-label": "Switch organization"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 16
  })), open && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "org-panel-scrim",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "org-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "org-panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "org-panel-title"
  }, "Organizations"), /*#__PURE__*/React.createElement("span", {
    className: "org-panel-hint"
  }, "drag to prioritise")), /*#__PURE__*/React.createElement("ul", {
    className: "org-panel-list"
  }, orgs.map((o, i) => /*#__PURE__*/React.createElement("li", {
    key: o.id,
    className: 'org-panel-item' + (o.id === selected ? ' selected' : '')
  }, /*#__PURE__*/React.createElement("button", {
    className: "org-panel-select",
    onClick: () => {
      setSelected(o.id);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "org-panel-badge"
  }, o.tag), /*#__PURE__*/React.createElement("span", {
    className: "org-panel-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "org-panel-name"
  }, o.name, i === 0 && /*#__PURE__*/React.createElement("span", {
    className: "org-primary-chip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 9
  }), " Primary")), /*#__PURE__*/React.createElement("span", {
    className: "org-panel-role"
  }, o.role, " \xB7 ", o.members, " members")), o.id === selected && /*#__PURE__*/React.createElement("span", {
    className: "org-panel-check"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "org-panel-arrows"
  }, /*#__PURE__*/React.createElement("button", {
    className: "org-arrow-btn",
    disabled: i === 0,
    onClick: () => move(i, -1),
    "aria-label": "Move up"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 12,
    style: {
      transform: 'rotate(-90deg)'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "org-arrow-btn",
    disabled: i === orgs.length - 1,
    onClick: () => move(i, 1),
    "aria-label": "Move down"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 12,
    style: {
      transform: 'rotate(90deg)'
    }
  })))))))));
}
function CommandPalette({
  open,
  onClose,
  onNavigate,
  theme,
  toggleTheme,
  onHelp
}) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);
  if (!open) return null;
  const goItems = ALL_NAV.filter(n => !n.soon).map(n => ({
    group: 'Go to',
    icon: n.icon,
    label: n.label,
    hint: n.key ? 'g ' + n.key : null,
    run: () => {
      onNavigate(n.id);
      onClose();
    }
  }));
  const sysItems = [{
    group: 'System',
    icon: theme === 'dark' ? 'sun' : 'moon',
    label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
    run: () => {
      toggleTheme();
      onClose();
    }
  }, {
    group: 'System',
    icon: 'keyboard',
    label: 'Keyboard shortcuts',
    hint: '?',
    run: () => {
      onClose();
      onHelp();
    }
  }, {
    group: 'System',
    icon: 'logout',
    label: 'Sign out',
    run: onClose
  }];
  const all = [...goItems, ...sysItems].filter(it => it.label.toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(all.map(i => i.group))];
  return /*#__PURE__*/React.createElement("div", {
    className: "shell-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "shell-cmdk",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "shell-cmdk-in"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search Station \u2014 go to a page, change settings\u2026"
  }), /*#__PURE__*/React.createElement("span", {
    className: "shell-kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "esc"))), /*#__PURE__*/React.createElement("div", {
    className: "shell-cmdk-list"
  }, all.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "shell-cmdk-empty"
  }, "No matches for \"", q, "\""), groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g
  }, /*#__PURE__*/React.createElement("div", {
    className: "shell-cmdk-cap"
  }, g), all.filter(i => i.group === g).map((it, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "shell-cmdk-item",
    onClick: it.run
  }, /*#__PURE__*/React.createElement("span", {
    className: "shell-cmdk-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "shell-cmdk-label"
  }, it.label), it.hint && /*#__PURE__*/React.createElement("span", {
    className: "shell-cmdk-hint"
  }, it.hint)))))), /*#__PURE__*/React.createElement("div", {
    className: "shell-cmdk-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "shell-kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193"), " navigate"), /*#__PURE__*/React.createElement("span", {
    className: "shell-kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5"), " select"))));
}
const SHORTCUTS = [{
  group: 'Navigation',
  rows: [['Dashboard', 'g d'], ['Contracts', 'g c'], ['Members', 'g m'], ['Fleet', 'g f'], ['Work Sessions', 'g w']]
}, {
  group: 'Actions',
  rows: [['Command palette', '⌘ K'], ['Search', '/'], ['Keyboard help', '?'], ['Close / cancel', 'esc']]
}];
function KeyboardHelp({
  open,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "shell-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "shell-khelp",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "shell-khelp-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Keyboard shortcuts"), /*#__PURE__*/React.createElement("button", {
    className: "shell-ibtn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "shell-khelp-grid"
  }, SHORTCUTS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.group
  }, /*#__PURE__*/React.createElement("div", {
    className: "shell-khelp-grp-cap"
  }, s.group), s.rows.map(([label, key]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    className: "shell-krow"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    className: "shell-kbd"
  }, key.split(' ').map((k, i) => /*#__PURE__*/React.createElement("kbd", {
    key: i
  }, k))))))))));
}
const LEGAL = '../legal/';

/* ---- notifications ----------------------------------------- */
const NOTIF_META = {
  treasury: {
    icon: 'handCoins',
    color: '#4FC97E',
    label: 'Treasury'
  },
  session: {
    icon: 'pickaxe',
    color: '#53AEF7',
    label: 'Work session'
  },
  refinery: {
    icon: 'factory',
    color: '#E0913A',
    label: 'Refinery'
  },
  mention: {
    icon: 'messageCircle',
    color: 'var(--brand)',
    label: 'Mention'
  },
  contract: {
    icon: 'contracts',
    color: '#7CBEF9',
    label: 'Contract'
  },
  member: {
    icon: 'userPlus',
    color: '#9A7CF9',
    label: 'Members'
  },
  fleet: {
    icon: 'fleet',
    color: '#41D6D0',
    label: 'Fleet'
  },
  system: {
    icon: 'shield',
    color: '#FF8A8A',
    label: 'Security'
  }
};
const BUCKET_LABEL = {
  today: 'Today',
  week: 'Earlier this week',
  older: 'Older'
};
const niInitials = s => s.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const niHue = s => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
};
const flash = (msg, icon) => window.dispatchEvent(new CustomEvent('station-toast', {
  detail: {
    msg,
    icon
  }
}));
function NotifRow({
  n,
  onOpen,
  onDismiss,
  onAction
}) {
  const meta = NOTIF_META[n.kind] || NOTIF_META.system;
  const isSystem = !n.actor;
  return /*#__PURE__*/React.createElement("div", {
    className: 'ntf-item' + (n.unread ? ' unread' : '') + (n.high ? ' high' : ''),
    role: "button",
    tabIndex: 0,
    onClick: onOpen,
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpen();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ntf-av-wrap"
  }, isSystem ? /*#__PURE__*/React.createElement("span", {
    className: "ntf-sys-ic",
    style: {
      background: `color-mix(in srgb, ${meta.color} 18%, transparent)`,
      color: meta.color
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: meta.icon
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "av",
    style: {
      width: 38,
      height: 38,
      fontSize: 14,
      background: `hsl(${niHue(n.actor)} 42% 30%)`,
      color: `hsl(${niHue(n.actor)} 72% 86%)`
    }
  }, niInitials(n.actor)), /*#__PURE__*/React.createElement("span", {
    className: "ntf-cat-badge",
    style: {
      background: meta.color,
      color: '#0B1119'
    },
    title: meta.label
  }, /*#__PURE__*/React.createElement(Icon, {
    name: meta.icon
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ntf-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ntf-text"
  }, n.actor ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, n.actor), " ", n.verb) : /*#__PURE__*/React.createElement("b", null, n.verb), n.body ? ' — ' + n.body : ''), n.target && /*#__PURE__*/React.createElement("div", {
    className: "ntf-target"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 11
  }), n.target), /*#__PURE__*/React.createElement("div", {
    className: "ntf-meta"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)',
      color: meta.color
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: meta.color
    }
  }), meta.label), /*#__PURE__*/React.createElement("span", {
    className: "ntf-time"
  }, "\xB7 ", n.time)), n.actions && /*#__PURE__*/React.createElement("div", {
    className: "ntf-actions"
  }, n.actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    className: 'btn btn-sm ' + (a.tone === 'primary' ? 'btn-primary' : 'btn-ghost'),
    onClick: e => {
      e.stopPropagation();
      onAction(n, a);
    }
  }, a.label)))), /*#__PURE__*/React.createElement("div", {
    className: "ntf-rightcol"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ntf-dismiss",
    onClick: onDismiss,
    "aria-label": "Dismiss notification"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close"
  })), n.unread && /*#__PURE__*/React.createElement("span", {
    className: "ntf-dot"
  })));
}
function NotificationCenter({
  onNavigate
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() => window.NOTIFICATIONS || []);
  const [tab, setTab] = useState('all');
  const [flashing, setFlashing] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const unread = items.filter(n => n.unread).length;
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // external code can push a notification: window.dispatchEvent(new CustomEvent('station-notify', {detail:{...}}))
  useEffect(() => {
    const onNotify = e => {
      const d = e.detail || {};
      const n = {
        id: 'nt' + Date.now() + Math.floor(Math.random() * 999),
        kind: d.kind || 'session',
        actor: d.actor || null,
        verb: d.verb || 'New activity',
        body: d.body || '',
        target: d.target || null,
        nav: d.nav || null,
        time: 'just now',
        bucket: 'today',
        unread: true,
        high: !!d.high,
        actions: d.actions || null
      };
      setItems(xs => [n, ...xs]);
      setFlashing(true);
      setHasNew(true);
      setTimeout(() => setFlashing(false), 2400);
    };
    window.addEventListener('station-notify', onNotify);
    return () => window.removeEventListener('station-notify', onNotify);
  }, []);
  const markRead = id => setItems(xs => xs.map(n => n.id === id ? {
    ...n,
    unread: false
  } : n));
  const markAll = () => {
    setItems(xs => xs.map(n => ({
      ...n,
      unread: false
    })));
    flash('All notifications marked as read', 'check');
  };
  const dismiss = (id, e) => {
    e.stopPropagation();
    setItems(xs => xs.filter(n => n.id !== id));
  };
  const openItem = n => {
    markRead(n.id);
    if (n.nav) {
      setOpen(false);
      onNavigate(n.nav);
    }
  };
  const onAction = (n, a) => {
    setItems(xs => xs.map(x => x.id === n.id ? {
      ...x,
      unread: false,
      actions: null
    } : x));
    const verbs = {
      approve: 'Payout approved',
      confirm: 'Crew payout confirmed',
      collect: 'Batch marked collected',
      admit: 'Member admitted',
      decline: 'Request declined',
      resolve: 'Dispute opened',
      join: 'Opening the session to join',
      dismiss: 'Invitation dismissed',
      secure: 'Opening device review',
      review: 'Opening for review'
    };
    flash(verbs[a.id] || 'Done', a.id === 'decline' || a.id === 'dismiss' ? 'close' : 'check');
    if ((a.id === 'review' || a.id === 'resolve' || a.id === 'secure' || a.id === 'join') && n.nav) {
      setOpen(false);
      onNavigate(n.nav);
    }
  };
  const shown = tab === 'unread' ? items.filter(n => n.unread) : items;
  const buckets = ['today', 'week', 'older'].map(b => [b, shown.filter(n => n.bucket === b)]).filter(([, a]) => a.length);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: 'shell-ibtn' + (flashing ? ' ntf-flashing' : '') + (hasNew ? ' ntf-hasnew' : ''),
    onClick: () => {
      setOpen(true);
      setFlashing(false);
      setHasNew(false);
    },
    "aria-label": 'Notifications' + (unread ? ', ' + unread + ' unread' : ''),
    title: "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  }), unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: 'shell-ibtn-badge' + (flashing ? ' pop' : '')
  }, unread > 9 ? '9+' : unread)), open && ReactDOM.createPortal(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "drawer-backdrop",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "drawer",
    style: {
      width: 410
    },
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement("div", {
    className: "drawer-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dh-title ntf-head-row"
  }, "Notifications", unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "ntf-count"
  }, unread, " new")), /*#__PURE__*/React.createElement("button", {
    className: "d-iconbtn",
    onClick: markAll,
    title: "Mark all as read",
    "aria-label": "Mark all as read"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "d-iconbtn",
    onClick: () => setOpen(false),
    "aria-label": "Close notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ntf-tabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: 'ntf-tab' + (tab === 'all' ? ' active' : ''),
    onClick: () => setTab('all')
  }, "All ", /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, items.length)), /*#__PURE__*/React.createElement("button", {
    className: 'ntf-tab' + (tab === 'unread' ? ' active' : ''),
    onClick: () => setTab('unread')
  }, "Unread ", /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, unread))), /*#__PURE__*/React.createElement("div", {
    className: "drawer-body"
  }, buckets.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state",
    style: {
      paddingTop: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "es-ic",
    style: {
      color: 'var(--success-500)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "es-title"
  }, "You\u2019re all caught up"), /*#__PURE__*/React.createElement("p", {
    className: "es-text"
  }, "No ", tab === 'unread' ? 'unread ' : '', "notifications right now. We\u2019ll surface anything that needs you here.")) : buckets.map(([b, list]) => /*#__PURE__*/React.createElement("div", {
    key: b
  }, /*#__PURE__*/React.createElement("div", {
    className: "ntf-group-cap"
  }, BUCKET_LABEL[b]), list.map(n => /*#__PURE__*/React.createElement(NotifRow, {
    key: n.id,
    n: n,
    onOpen: () => openItem(n),
    onDismiss: e => dismiss(n.id, e),
    onAction: onAction
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "drawer-foot",
    style: {
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "ntf-foot-link",
    onClick: markAll
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Mark all read"), /*#__PURE__*/React.createElement("button", {
    className: "ntf-foot-link",
    onClick: () => {
      setOpen(false);
      onNavigate('profile');
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 14
  }), " Notification settings")))), document.body));
}
function AppFooter() {
  const year = new Date().getFullYear();
  const links = [['Terms of Service', 'Terms of Service.html'], ['Privacy Policy', 'Privacy Policy.html'], ['IP & Fan Content', 'Disclaimer.html'], ['Community Guidelines', 'Community Guidelines.html'], ['Cookies & Local Storage', 'Cookie & Local Storage Notice.html']];
  return /*#__PURE__*/React.createElement("footer", {
    className: "app-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app-foot-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app-foot-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "app-foot-mark"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "command",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    className: "app-foot-copy"
  }, "\xA9 ", year, " Presstronic LLC \xB7 Made with ", /*#__PURE__*/React.createElement("span", {
    className: "app-foot-heart"
  }, "\u2764"), " by Presstronic LLC")), /*#__PURE__*/React.createElement("nav", {
    className: "app-foot-links",
    "aria-label": "Legal"
  }, links.map(([label, href]) => /*#__PURE__*/React.createElement("a", {
    key: label,
    href: LEGAL + href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, label)))), /*#__PURE__*/React.createElement("div", {
    className: "app-foot-sc"
  }, "Station is an unofficial Star Citizen fan tool \u2014 not affiliated with or endorsed by Cloud Imperium Games or Roberts Space Industries. In-game currency and items have no real-world value."));
}
function AppShell({
  active,
  onNavigate,
  searchPlaceholder = 'Search Station…',
  children
}) {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('coral');
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(() => typeof window === 'undefined' ? true : window.innerWidth > 1080);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);
  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(o => !o);
      } else if (e.key === '?' && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault();
        setHelpOpen(true);
      } else if (e.key === '/' && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault();
        setCmdkOpen(true);
      } else if (e.key === 'Escape') {
        setCmdkOpen(false);
        setHelpOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: 'app-shell' + (navOpen ? ' nav-open' : ''),
    "data-accent": accent
  }, /*#__PURE__*/React.createElement("a", {
    className: "shell-skip",
    href: "#main"
  }, "Skip to content"), /*#__PURE__*/React.createElement("aside", {
    className: "shell-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(OrgSwitcher, null)), /*#__PURE__*/React.createElement("nav", {
    className: "side-nav"
  }, NAV_HOME.map(n => /*#__PURE__*/React.createElement(SideLink, {
    key: n.id,
    item: n,
    active: active,
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement("div", {
    className: "side-cap"
  }, "Operations"), NAV_PRIMARY.map(n => n.children ? /*#__PURE__*/React.createElement(NavGroup, {
    key: n.id,
    item: n,
    active: active,
    onNavigate: onNavigate
  }) : /*#__PURE__*/React.createElement(SideLink, {
    key: n.id,
    item: n,
    active: active,
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement("div", {
    className: "side-cap"
  }, "Assets"), NAV_ASSETS.map(n => /*#__PURE__*/React.createElement(SideLink, {
    key: n.id,
    item: n,
    active: active,
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement("div", {
    className: "side-cap"
  }, "Super Admin"), NAV_SYSTEM.map(n => /*#__PURE__*/React.createElement(SideLink, {
    key: n.id,
    item: n,
    active: active,
    onNavigate: onNavigate
  }))), /*#__PURE__*/React.createElement("div", {
    className: "side-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "side-help-btn",
    onClick: () => setHelpOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "keyboard"
  }), /*#__PURE__*/React.createElement("span", null, "Keyboard shortcuts"), /*#__PURE__*/React.createElement("span", {
    className: "shell-kbd side-help-kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "?"))))), navOpen && /*#__PURE__*/React.createElement("div", {
    className: "nav-scrim",
    onClick: () => setNavOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "shell-main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "shell-appbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "shell-ibtn shell-menu-toggle",
    onClick: () => setNavOpen(o => !o),
    "aria-label": navOpen ? 'Collapse menu' : 'Open menu',
    title: "Toggle menu"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu"
  })), /*#__PURE__*/React.createElement("button", {
    className: "shell-search-btn",
    onClick: () => setCmdkOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  }), /*#__PURE__*/React.createElement("span", {
    className: "shell-search-ph"
  }, searchPlaceholder), /*#__PURE__*/React.createElement("span", {
    className: "shell-kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2318"), /*#__PURE__*/React.createElement("kbd", null, "K"))), /*#__PURE__*/React.createElement("div", {
    className: "shell-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "shell-appbar-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "shell-ibtn",
    onClick: () => setAccent(a => a === 'aqua' ? 'coral' : 'aqua'),
    "aria-label": "Accent",
    title: "Toggle accent"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })), /*#__PURE__*/React.createElement("button", {
    className: "shell-ibtn",
    onClick: toggleTheme,
    "aria-label": "Theme",
    title: "Toggle light / dark"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === 'dark' ? 'sun' : 'moon'
  })), /*#__PURE__*/React.createElement(NotificationCenter, {
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("a", {
    className: "shell-avatar",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate('profile');
    }
  }, CURRENT_USER.initial))), /*#__PURE__*/React.createElement("main", {
    className: "shell-page",
    id: "main"
  }, children, /*#__PURE__*/React.createElement(AppFooter, {
    onNavigate: onNavigate
  }))), /*#__PURE__*/React.createElement(CommandPalette, {
    open: cmdkOpen,
    onClose: () => setCmdkOpen(false),
    onNavigate: onNavigate,
    theme: theme,
    toggleTheme: toggleTheme,
    onHelp: () => setHelpOpen(true)
  }), /*#__PURE__*/React.createElement(KeyboardHelp, {
    open: helpOpen,
    onClose: () => setHelpOpen(false)
  }), window.ToastHost && /*#__PURE__*/React.createElement(window.ToastHost, null), window.ConfirmHost && /*#__PURE__*/React.createElement(window.ConfirmHost, null));
}
window.AppShell = AppShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/shell.jsx", error: String((e && e.message) || e) }); }

// app-v2/ui.jsx
try { (() => {
/* ============================================================
   STATION APP — shared UI kit for the operations screens
   (Refinery · Work Orders · Fleet · Treasury)
   Reuses the global shell/contracts vocabulary; adds the
   review drawer, edit slide-out chrome, toast + a few atoms.
   ============================================================ */
const {
  useState: useStateU,
  useEffect: useEffectU,
  useRef: useRefU
} = React;

/* ---- money + string helpers ------------------------------ */
function fmtNum(n) {
  return Math.round(Number(n) || 0).toLocaleString('en-US');
}
function abbrNum(n) {
  const a = Math.abs(Number(n) || 0);
  if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(Math.round(n || 0));
}
function signed(n) {
  return (n >= 0 ? '+' : '−') + fmtNum(Math.abs(n));
}
function initialsOf(s) {
  return String(s || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function avHue(s) {
  let h = 0;
  for (let i = 0; i < String(s).length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

/* ---- avatar --------------------------------------------- */
function Avatar({
  name,
  size = 26
}) {
  if (!name || name === '—') return /*#__PURE__*/React.createElement("span", {
    className: "av-empty",
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  }, "\u2014");
  const hue = avHue(name);
  return /*#__PURE__*/React.createElement("span", {
    className: "av",
    style: {
      width: size,
      height: size,
      fontSize: Math.round(size * 0.4),
      background: `hsl(${hue} 42% 30%)`,
      color: `hsl(${hue} 70% 86%)`
    }
  }, initialsOf(name));
}
function AvatarChip({
  name
}) {
  if (!name || name === '—') return /*#__PURE__*/React.createElement("span", {
    className: "t-muted"
  }, "Unassigned");
  return /*#__PURE__*/React.createElement("span", {
    className: "av-chip"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: name,
    size: 22
  }), name);
}

/* ---- stat strip ----------------------------------------- */
function StatStrip({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "statstrip",
    style: {
      '--n': items.length
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "statcard",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, it.icon && /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 13
  }), " ", it.k), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: it.tone === 'up' ? {
      color: 'var(--success-500)'
    } : it.tone === 'warn' ? {
      color: 'var(--coral-400)'
    } : null
  }, it.v, it.unit && /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, " ", it.unit)), it.d && /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, it.d))));
}

/* ---- segmented filter ----------------------------------- */
function SegFilter({
  options,
  value,
  onChange,
  ariaLabel
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "seg-group",
    role: "group",
    "aria-label": ariaLabel
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    className: 'seg-btn' + (value === o.value ? ' active' : ''),
    onClick: () => onChange(o.value),
    "aria-pressed": value === o.value
  }, o.icon && /*#__PURE__*/React.createElement(Icon, {
    name: o.icon,
    size: 14
  }), o.label, o.count != null && /*#__PURE__*/React.createElement("span", {
    className: "seg-count"
  }, o.count))));
}

/* ---- progress / utilization bar ------------------------- */
function Progress({
  value,
  tone
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  const color = tone === 'warn' ? 'var(--warning-500)' : tone === 'danger' ? 'var(--coral-400)' : tone === 'success' ? 'var(--success-500)' : 'var(--brand)';
  return /*#__PURE__*/React.createElement("div", {
    className: "prog-track"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: pct + '%',
      background: color
    }
  }));
}

/* ---- spark bars ----------------------------------------- */
function MiniBars({
  data,
  active
}) {
  const max = Math.max(...data, 1);
  return /*#__PURE__*/React.createElement("div", {
    className: "spark"
  }, data.map((h, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: Math.max(8, h / max * 100) + '%',
      background: active ? 'var(--brand)' : 'var(--border-strong)'
    }
  })));
}

/* ---- empty state ---------------------------------------- */
function EmptyState({
  icon,
  title,
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("span", {
    className: "es-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon || 'box',
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "es-title"
  }, title), text && /*#__PURE__*/React.createElement("p", {
    className: "es-text"
  }, text));
}

/* ---- review / edit slide-out drawer --------------------- */
function Drawer({
  open,
  onClose,
  width = 440,
  children
}) {
  useEffectU(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "drawer",
    style: {
      width
    },
    role: "dialog",
    "aria-modal": "true"
  }, children), /*#__PURE__*/React.createElement("div", {
    className: "drawer-backdrop",
    onClick: onClose
  })), document.body);
}
function DrawerHead({
  kicker,
  onBack,
  onEdit,
  editing,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "drawer-head"
  }, onBack && /*#__PURE__*/React.createElement("button", {
    className: "d-iconbtn",
    onClick: onBack,
    "aria-label": "Back"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowLeft",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "dh-kicker"
  }, kicker), onEdit && !editing && /*#__PURE__*/React.createElement("button", {
    className: "d-iconbtn",
    onClick: onEdit,
    title: "Edit",
    "aria-label": "Edit"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "d-iconbtn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16
  })));
}
function DrawerHero({
  icon,
  iconStyle,
  iconClass,
  title,
  sub,
  badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "d-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'd-bigic ' + (iconClass || ''),
    style: iconStyle
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-hero-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-hero-t"
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    className: "d-hero-s"
  }, sub)), badge);
}

/* ---- modal ---------------------------------------------- */
function Modal({
  title,
  icon,
  onClose,
  children,
  foot,
  width = 520
}) {
  useEffectU(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onMouseDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box",
    style: {
      maxWidth: width
    },
    onMouseDown: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "modal-title"
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    style: {
      verticalAlign: '-3px',
      marginRight: 8,
      color: 'var(--brand)'
    }
  }), title), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, children), foot && /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, foot))), document.body);
}

/* ---- form field ----------------------------------------- */
function Field({
  label,
  hint,
  required,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, label, required && ' *'), children, hint && /*#__PURE__*/React.createElement("span", {
    className: "field-hint"
  }, hint));
}

/* ---- choice cards (radio group) ------------------------- */
function ChoiceCards({
  options,
  value,
  onChange,
  columns
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "choice-grid",
    style: columns ? {
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    } : null,
    role: "radiogroup"
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": value === o.value,
    className: 'choice-card' + (value === o.value ? ' selected' : ''),
    onClick: () => onChange(o.value)
  }, o.icon && /*#__PURE__*/React.createElement("span", {
    className: "cc-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: o.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "cc-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-title"
  }, o.label), o.desc && /*#__PURE__*/React.createElement("span", {
    className: "cc-desc"
  }, o.desc)), o.meta && /*#__PURE__*/React.createElement("span", {
    className: "cc-meta"
  }, o.meta))));
}

/* ---- toast --------------------------------------------- */
function ToastHost() {
  const [toasts, setToasts] = useStateU([]);
  useEffectU(() => {
    const onToast = e => {
      const id = Date.now() + Math.random();
      setToasts(t => [...t, {
        id,
        msg: e.detail.msg,
        icon: e.detail.icon
      }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
    };
    window.addEventListener('station-toast', onToast);
    return () => window.removeEventListener('station-toast', onToast);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "toast-host",
    "aria-live": "polite"
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    className: "toast",
    key: t.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "toast-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon || 'check',
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, t.msg))));
}
function toast(msg, icon) {
  window.dispatchEvent(new CustomEvent('station-toast', {
    detail: {
      msg,
      icon
    }
  }));
}

/* ---- confirm dialog (gates destructive / modify actions) - */
function ConfirmHost() {
  const [req, setReq] = useStateU(null);
  const [text, setText] = useStateU('');
  useEffectU(() => {
    const onReq = e => {
      setReq(e.detail);
      setText('');
    };
    window.addEventListener('station-confirm', onReq);
    return () => window.removeEventListener('station-confirm', onReq);
  }, []);
  useEffectU(() => {
    if (!req) return;
    const onKey = e => {
      if (e.key === 'Escape') {
        req.resolve(false);
        setReq(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [req]);
  if (!req) return null;
  const close = ok => {
    req.resolve(ok);
    setReq(null);
  };
  const danger = req.tone === 'danger';
  const needText = req.requireText;
  const canConfirm = !needText || text.trim().toUpperCase() === String(needText).toUpperCase();
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop confirm-backdrop",
    onMouseDown: () => close(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "confirm-box",
    onMouseDown: e => e.stopPropagation(),
    role: "alertdialog",
    "aria-modal": "true",
    "aria-label": req.title
  }, /*#__PURE__*/React.createElement("div", {
    className: 'confirm-ic ' + (danger ? 'danger' : 'brand')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: req.icon || (danger ? 'trash' : 'info'),
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "confirm-title"
  }, req.title), req.body && /*#__PURE__*/React.createElement("p", {
    className: "confirm-body"
  }, req.body), needText && /*#__PURE__*/React.createElement("div", {
    className: "confirm-type"
  }, /*#__PURE__*/React.createElement("label", null, "Type ", /*#__PURE__*/React.createElement("b", null, needText), " to confirm"), /*#__PURE__*/React.createElement("input", {
    className: "fld",
    value: text,
    onChange: e => setText(e.target.value),
    autoFocus: true,
    onKeyDown: e => {
      if (e.key === 'Enter' && canConfirm) close(true);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "confirm-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => close(false)
  }, req.cancelLabel || 'Cancel'), /*#__PURE__*/React.createElement("button", {
    className: 'btn ' + (danger ? 'btn-danger' : 'btn-primary'),
    disabled: !canConfirm,
    onClick: () => close(true),
    autoFocus: !needText
  }, req.icon && req.showIcon ? /*#__PURE__*/React.createElement(Icon, {
    name: req.icon,
    size: 15
  }) : null, req.confirmLabel || 'Confirm')))), document.body);
}
function confirmAction(opts) {
  return new Promise(resolve => {
    window.dispatchEvent(new CustomEvent('station-confirm', {
      detail: {
        ...opts,
        resolve
      }
    }));
  });
}
Object.assign(window, {
  fmtNum,
  abbrNum,
  signed,
  initialsOf,
  avHue,
  Avatar,
  AvatarChip,
  StatStrip,
  SegFilter,
  Progress,
  MiniBars,
  EmptyState,
  Drawer,
  DrawerHead,
  DrawerHero,
  Modal,
  Field,
  ChoiceCards,
  ToastHost,
  toast,
  ConfirmHost,
  confirmAction
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app-v2/ui.jsx", error: String((e && e.message) || e) }); }

// app/Contracts.jsx
try { (() => {
// ============================================================
// Station — Contracts page
// Service contracts: hauling/transport, security, mining, salvage.
// Board list + type-specific detail (route, quota, milestones,
// reward, assigned crew). Keyboard-first: roving list, Enter opens.
// ============================================================

const CI = window.StationIcon;
const CTYPE = {
  hauling: {
    icon: 'container',
    label: 'Hauling / Transport',
    cls: 'ct-hauling'
  },
  security: {
    icon: 'crosshair',
    label: 'Security',
    cls: 'ct-security'
  },
  mining: {
    icon: 'gem',
    label: 'Mining',
    cls: 'ct-mining'
  },
  salvage: {
    icon: 'recycle',
    label: 'Salvage',
    cls: 'ct-salvage'
  }
};
const CSTATUS = {
  open: {
    tone: 'brand',
    icon: 'circle-dot',
    label: 'Open'
  },
  claimed: {
    tone: 'info',
    icon: 'user-check',
    label: 'Claimed'
  },
  active: {
    tone: 'warn',
    icon: 'loader',
    label: 'In progress'
  },
  completed: {
    tone: 'success',
    icon: 'badge-check',
    label: 'Completed'
  },
  disputed: {
    tone: 'danger',
    icon: 'triangle-alert',
    label: 'Disputed'
  }
};
const RISK = {
  low: 'Low',
  med: 'Medium',
  high: 'High'
};
const riskIcon = {
  low: 'shield-check',
  med: 'shield-alert',
  high: 'shield-x'
};
const CONTRACTS = [{
  id: 'CT-512',
  type: 'hauling',
  title: 'Titanium haul — Hurston to ArcCorp',
  client: 'Hurston Dynamics',
  clientType: 'NPC contract',
  reward: 285000,
  status: 'active',
  risk: 'med',
  deadline: '6h',
  assigned: ['Iris Tanaka'],
  commodity: 'Titanium',
  scu: 768,
  origin: 'HDMS-Edmond',
  originSub: 'Hurston',
  dest: 'Area18',
  destSub: 'ArcCorp',
  desc: 'Bulk Titanium delivery on the Hurston→ArcCorp lane. Watch the Stanton pirate corridor near the jump.',
  miles: [['Cargo loaded at HDMS-Edmond', 'done'], ['In transit — Stanton lane', 'active'], ['Delivery to Area18 TDD', '']]
}, {
  id: 'CT-509',
  type: 'security',
  title: 'Escort mining op — Aaron Halo',
  client: 'Atlas Vanguard',
  clientType: 'Internal op',
  reward: 180000,
  status: 'active',
  risk: 'high',
  deadline: '2h',
  assigned: ['Dax Moreno', 'Talia Vance'],
  objective: 'Escort & Defend',
  threat: 'Pirate interdiction',
  location: 'Aaron Halo · Cluster 7',
  duration: '4h window',
  desc: 'Provide armed escort for the Day-3 mining session. Two fighters on overwatch, intercept hostiles before they reach the Mole.',
  miles: [['Wing assembled at ARC-L1', 'done'], ['Overwatch established', 'active'], ['Session complete — RTB', '']]
}, {
  id: 'CT-507',
  type: 'mining',
  title: 'Quantanium quota — refinery contract',
  client: 'Refinery Consortium',
  clientType: 'Org contract',
  reward: 520000,
  status: 'open',
  risk: 'med',
  deadline: '3d',
  assigned: [],
  commodity: 'Quantanium',
  quota: 150,
  location: 'Aaron Halo',
  refinery: 'ARC-L1',
  desc: 'Deliver 150 SCU of refined Quantanium. Volatile cargo — refine promptly and mind the inertia on the haul back.',
  miles: [['Accept contract', ''], ['Mine & refine 150 SCU', ''], ['Deliver to consortium', '']]
}, {
  id: 'CT-503',
  type: 'salvage',
  title: 'Wreck reclamation — Yela Belt',
  client: 'Drake Interplanetary',
  clientType: 'NPC contract',
  reward: 240000,
  status: 'claimed',
  risk: 'low',
  deadline: '2d',
  assigned: ['Kova Rhys'],
  site: 'Yela Belt · Wreck Field 22',
  target: 'RMC + CMAT',
  targetScu: 180,
  location: 'Crusader · Yela',
  desc: 'Strip and reclaim the marked hulls. RMC to CRU-L1, construction materials retained for the org.',
  miles: [['Claim contract', 'done'], ['Reclaim 180 SCU', 'active'], ['Sell RMC at CRU-L1', '']]
}, {
  id: 'CT-498',
  type: 'hauling',
  title: 'Medical supply run — microTech',
  client: 'microTech',
  clientType: 'NPC contract',
  reward: 96000,
  status: 'open',
  risk: 'low',
  deadline: '1d',
  assigned: [],
  commodity: 'Medical Supplies',
  scu: 120,
  origin: 'New Babbage',
  originSub: 'microTech',
  dest: 'Port Tressler',
  destSub: 'microTech orbit',
  desc: 'Quick low-risk medical resupply to Port Tressler. Good first contract for a recruit pilot.',
  miles: [['Load at New Babbage', ''], ['Deliver to Port Tressler', '']]
}, {
  id: 'CT-495',
  type: 'security',
  title: 'Bounty — Nine Tails cell',
  client: 'Crusader Security',
  clientType: 'NPC contract',
  reward: 145000,
  status: 'open',
  risk: 'high',
  deadline: '5d',
  assigned: [],
  objective: 'Bounty hunt',
  threat: 'Armed hostiles',
  location: 'Crusader · Cellin',
  duration: 'Until cleared',
  desc: 'Eliminate the flagged Nine Tails cell operating near Cellin. Multicrew gunship recommended.',
  miles: [['Accept bounty', ''], ['Locate & engage', ''], ['Confirm kills', '']]
}, {
  id: 'CT-489',
  type: 'mining',
  title: 'Laranite delivery — completed',
  client: 'ArcCorp Mining',
  clientType: 'NPC contract',
  reward: 134000,
  status: 'completed',
  risk: 'low',
  deadline: '—',
  assigned: ['Vesper Calderon'],
  commodity: 'Laranite',
  quota: 60,
  location: 'Lyria',
  refinery: 'ARC-L1',
  desc: 'Closed out last cycle. Paid in full and settled to the crew.',
  miles: [['Accepted', 'done'], ['Refined 60 SCU', 'done'], ['Delivered & paid', 'done']]
}, {
  id: 'CT-486',
  type: 'hauling',
  title: 'Agricium freight — disputed',
  client: 'Shubin Interstellar',
  clientType: 'NPC contract',
  reward: 210000,
  status: 'disputed',
  risk: 'med',
  deadline: '—',
  assigned: ['Orin Pell'],
  commodity: 'Agricium',
  scu: 320,
  origin: 'ArcCorp',
  originSub: 'Stanton',
  dest: 'Lorville',
  destSub: 'Hurston',
  desc: 'Delivery shortfall reported — 40 SCU unaccounted after a soft-death event. Under review with the client.',
  miles: [['Loaded', 'done'], ['Transit interrupted', 'done'], ['Delivery disputed', 'active']]
}];
const fmt = n => Math.round(n).toLocaleString('en-US');
const abbr = n => n >= 1e6 ? (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(n);
const initials = s => s.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ---- list row ----
function ContractRow({
  c,
  selected,
  tabIndex,
  regRef,
  onSelect
}) {
  const ty = CTYPE[c.type],
    st = CSTATUS[c.status];
  const urgent = (c.deadline === '2h' || c.deadline === '6h') && c.status === 'active';
  return /*#__PURE__*/React.createElement("tr", {
    ref: regRef,
    tabIndex: tabIndex,
    "aria-selected": selected,
    onClick: onSelect,
    onFocus: onSelect
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "t-ent"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + ty.cls
  }, /*#__PURE__*/React.createElement(CI, {
    n: ty.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, c.id, " \xB7 ", ty.label)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "client"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ci"
  }, /*#__PURE__*/React.createElement(CI, {
    n: c.clientType.includes('Internal') || c.clientType.includes('Org') ? 'shield' : 'building-2'
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "cn"
  }, c.client), /*#__PURE__*/React.createElement("span", {
    className: "ct"
  }, c.clientType)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'deadline' + (urgent ? ' urgent' : '')
  }, c.deadline !== '—' && /*#__PURE__*/React.createElement(CI, {
    n: "clock"
  }), c.deadline === '—' ? '—' : c.deadline)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, st.label)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "reward"
  }, abbr(c.reward), " ", /*#__PURE__*/React.createElement("small", null, "aUEC"))));
}

// ---- type-specific spec ----
function ContractSpec({
  c
}) {
  if (c.type === 'hauling') {
    return /*#__PURE__*/React.createElement("div", {
      className: "route"
    }, /*#__PURE__*/React.createElement("div", {
      className: "node"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }), /*#__PURE__*/React.createElement("span", {
      className: "lb"
    }, c.origin), /*#__PURE__*/React.createElement("span", {
      className: "sub"
    }, c.originSub)), /*#__PURE__*/React.createElement("div", {
      className: "line"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cargo"
    }, c.scu, " SCU \xB7 ", c.commodity)), /*#__PURE__*/React.createElement("div", {
      className: "node end"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }), /*#__PURE__*/React.createElement("span", {
      className: "lb"
    }, c.dest), /*#__PURE__*/React.createElement("span", {
      className: "sub"
    }, c.destSub)));
  }
  if (c.type === 'security') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "target"
    }), " Objective"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.objective)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "swords"
    }), " Threat"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.threat)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "map-pin"
    }), " Location"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.location)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "timer"
    }), " Duration"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.duration)));
  }
  if (c.type === 'mining') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "gem"
    }), " Commodity"), /*#__PURE__*/React.createElement("span", {
      className: "v brand"
    }, c.commodity)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "scale"
    }), " Quota"), /*#__PURE__*/React.createElement("span", {
      className: "v mono"
    }, c.quota, " SCU")), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "map-pin"
    }), " Field"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.location)), /*#__PURE__*/React.createElement("div", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, /*#__PURE__*/React.createElement(CI, {
      n: "factory"
    }), " Refinery"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.refinery)));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "ship"
  }), " Site"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.site)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "recycle"
  }), " Target"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.target)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "scale"
  }), " Volume"), /*#__PURE__*/React.createElement("span", {
    className: "v mono"
  }, c.targetScu, " SCU")), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "map-pin"
  }), " Location"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.location)));
}

// ---- detail ----
function ContractDetail({
  c
}) {
  const ty = CTYPE[c.type],
    st = CSTATUS[c.status];
  const tint = {
    hauling: 'var(--warning-500)',
    security: 'var(--coral-300)',
    mining: 'var(--aqua-300)',
    salvage: '#D9A6E6'
  }[c.type];
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "panel detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "con-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'big-ic ' + ty.cls
  }, /*#__PURE__*/React.createElement(CI, {
    n: ty.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, /*#__PURE__*/React.createElement("span", null, c.id), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, ty.label))), /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, st.label)), /*#__PURE__*/React.createElement("div", {
    className: "reward-hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "rk"
  }, "Contract reward"), /*#__PURE__*/React.createElement("div", {
    className: "rv"
  }, fmt(c.reward), /*#__PURE__*/React.createElement("small", null, "aUEC"))), /*#__PURE__*/React.createElement("div", {
    className: "risk"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rk"
  }, "Risk"), /*#__PURE__*/React.createElement("span", {
    className: 'risk-badge ' + c.risk
  }, /*#__PURE__*/React.createElement(CI, {
    n: riskIcon[c.risk]
  }), RISK[c.risk])))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, c.type === 'hauling' ? 'Route' : 'Brief')), /*#__PURE__*/React.createElement(ContractSpec, {
    c: c
  }), /*#__PURE__*/React.createElement("p", {
    className: "t-muted",
    style: {
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      marginTop: 'var(--space-3)',
      marginBottom: 0
    }
  }, c.desc)), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Client & terms")), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "building-2"
  }), " Client"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.client)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "file-text"
  }), " Type"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.clientType)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "clock"
  }), " Deadline"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.deadline === '—' ? 'Closed' : 'in ' + c.deadline)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "users"
  }), " Assigned"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, c.assigned.length ? /*#__PURE__*/React.createElement("span", {
    className: "assigned"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stack"
  }, c.assigned.map(a => /*#__PURE__*/React.createElement("span", {
    className: "av",
    key: a,
    style: {
      background: window.avColor(a)
    },
    title: a
  }, initials(a))))) : /*#__PURE__*/React.createElement("span", {
    className: "t-faint",
    style: {
      color: 'var(--text-faint)',
      fontWeight: 400
    }
  }, "Unassigned")))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Progress")), /*#__PURE__*/React.createElement("div", {
    className: "miles"
  }, c.miles.map(([label, state], i) => /*#__PURE__*/React.createElement("div", {
    className: 'mile ' + state,
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "mk"
  }, /*#__PURE__*/React.createElement(CI, {
    n: state === 'done' ? 'check' : state === 'active' ? 'loader' : 'circle'
  })), /*#__PURE__*/React.createElement("span", {
    className: "ml"
  }, label), state === 'active' && /*#__PURE__*/React.createElement("span", {
    className: "mt"
  }, "now"))))), /*#__PURE__*/React.createElement("div", {
    className: "panel-body",
    style: {
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, c.status === 'open' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(CI, {
    n: "hand"
  }), " Claim contract"), c.status === 'open' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(CI, {
    n: "user-plus"
  }), " Assign crew"), c.status === 'claimed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(CI, {
    n: "play"
  }), " Start contract"), c.status === 'active' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(CI, {
    n: "check-check"
  }), " Mark complete"), c.status === 'completed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(CI, {
    n: "copy"
  }), " Repost contract"), c.status === 'disputed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(CI, {
    n: "gavel"
  }), " Resolve dispute"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    "aria-label": "Contract settings"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "more-horizontal"
  }))));
}

// ---- page ----
function ContractsPage() {
  const [type, setType] = React.useState('all');
  const visible = React.useMemo(() => type === 'all' ? CONTRACTS : CONTRACTS.filter(c => c.type === type), [type]);
  const [selId, setSelId] = React.useState(CONTRACTS[0].id);
  const sel = CONTRACTS.find(c => c.id === selId) || visible[0];
  const roving = window.useRoving(visible.length, {
    onActivate: i => {
      if (visible[i]) setSelId(visible[i].id);
    }
  });
  React.useEffect(() => {
    if (visible.length && !visible.find(c => c.id === selId)) {
      setSelId(visible[0].id);
      roving.setIdx(0);
    }
  }, [type]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const open = CONTRACTS.filter(c => c.status === 'open').length;
  const active = CONTRACTS.filter(c => c.status === 'active' || c.status === 'claimed').length;
  const pool = CONTRACTS.filter(c => c.status === 'open' || c.status === 'active' || c.status === 'claimed').reduce((s, c) => s + c.reward, 0);
  const done = CONTRACTS.filter(c => c.status === 'completed').length;
  const filters = [{
    value: 'all',
    label: 'All',
    count: CONTRACTS.length
  }, {
    value: 'hauling',
    label: 'Hauling',
    icon: 'container'
  }, {
    value: 'security',
    label: 'Security',
    icon: 'crosshair'
  }, {
    value: 'mining',
    label: 'Mining',
    icon: 'gem'
  }, {
    value: 'salvage',
    label: 'Salvage',
    icon: 'recycle'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "scroll-text"
  }), " Operations ", /*#__PURE__*/React.createElement(CI, {
    n: "chevron-right"
  }), " Contracts"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Contracts"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Service contracts across every discipline \u2014 hauling, security, mining, and salvage. Post, claim, crew up, and settle the reward.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "layout-grid"
  }), " Board view"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    id: "con-new"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "plus"
  }), " New contract ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 6
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement(StatStrip, {
    items: [{
      k: 'Open contracts',
      icon: 'circle-dot',
      v: open,
      d: 'available to claim'
    }, {
      k: 'In progress',
      icon: 'loader',
      v: active,
      d: 'claimed or active',
      tone: 'warn'
    }, {
      k: 'Reward pool',
      icon: 'coins',
      v: abbr(pool),
      unit: 'aUEC',
      d: 'active contract value',
      tone: 'up'
    }, {
      k: 'Completed',
      icon: 'badge-check',
      v: done,
      d: 'this cycle'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "con-toolbar"
  }, /*#__PURE__*/React.createElement(Segmented, {
    options: filters,
    value: type,
    onChange: setType,
    ariaLabel: "Filter contracts by type"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "circle-dot"
  }), " Status: All"), /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(CI, {
    n: "arrow-down-up"
  }), " Sort: Reward"))), /*#__PURE__*/React.createElement("div", {
    className: "split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable",
    role: "grid",
    "aria-label": "Contracts",
    onKeyDown: roving.onKeyDown
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Contract"), /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "Deadline"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Reward"))), /*#__PURE__*/React.createElement("tbody", null, visible.map((c, i) => /*#__PURE__*/React.createElement(ContractRow, {
    key: c.id,
    c: c,
    selected: c.id === selId,
    tabIndex: roving.getTab(i),
    regRef: roving.register(i),
    onSelect: () => {
      setSelId(c.id);
      roving.setIdx(i);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "list-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " move ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "n")), " new ", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, visible.length, " of ", CONTRACTS.length, " contracts"))), sel && /*#__PURE__*/React.createElement(ContractDetail, {
    c: sel
  })));
}
function ContractsApp() {
  const commands = [{
    id: 'con-new',
    group: 'Contracts',
    icon: 'plus',
    label: 'New contract',
    hint: 'n',
    run: () => window.__toast && window.__toast('New contract drafted', 'plus')
  }, {
    id: 'con-haul',
    group: 'Contracts',
    icon: 'container',
    label: 'New hauling contract',
    run: () => window.__toast && window.__toast('Hauling contract', 'container')
  }, {
    id: 'con-sec',
    group: 'Contracts',
    icon: 'crosshair',
    label: 'New security contract',
    run: () => window.__toast && window.__toast('Security contract', 'crosshair')
  }, {
    id: 'con-open',
    group: 'Contracts',
    icon: 'circle-dot',
    label: 'Show open contracts',
    run: () => window.__toast && window.__toast('Showing open contracts', 'circle-dot')
  }];
  const helpExtra = [['New contract', ['n']], ['Filter type', ['←', '→']], ['Open contract', ['↵']], ['Toggle theme', ['t']]];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: "contracts",
    commands: commands,
    helpExtra: helpExtra,
    onNew: () => window.__toast && window.__toast('Draft a new contract', 'plus'),
    searchPlaceholder: "Search contracts, clients, commodities\u2026"
  }, /*#__PURE__*/React.createElement(ContractsPage, null));
}
window.ContractsApp = ContractsApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/Contracts.jsx", error: String((e && e.message) || e) }); }

// app/Fleet.jsx
try { (() => {
// ============================================================
// Station — Fleet management page
// Three views: Org Fleet (leadership manages owned ships),
// My Ships (members manage personal ships + offer them to the org),
// and Member-Offered (org-rentable capacity it doesn't own).
// Keyboard-first: roving tables, Enter opens, tabs via ← →.
// ============================================================

const FI = window.StationIcon;
const ROLE = {
  combat: {
    icon: 'crosshair',
    label: 'Combat',
    cls: 'role-combat'
  },
  mining: {
    icon: 'gem',
    label: 'Mining',
    cls: 'role-mining'
  },
  salvage: {
    icon: 'recycle',
    label: 'Salvage',
    cls: 'role-salvage'
  },
  hauling: {
    icon: 'container',
    label: 'Hauling',
    cls: 'role-hauling'
  },
  explore: {
    icon: 'compass',
    label: 'Exploration',
    cls: 'role-explore'
  },
  transport: {
    icon: 'users',
    label: 'Transport',
    cls: 'role-transport'
  },
  medical: {
    icon: 'cross',
    label: 'Medical',
    cls: 'role-medical'
  },
  support: {
    icon: 'wrench',
    label: 'Support',
    cls: 'role-support'
  }
};
const SHIP_STATUS = {
  ready: {
    tone: 'success',
    icon: 'circle-check',
    label: 'Ready'
  },
  deployed: {
    tone: 'info',
    icon: 'navigation',
    label: 'Deployed'
  },
  repair: {
    tone: 'warn',
    icon: 'wrench',
    label: 'In repair'
  },
  stored: {
    tone: 'neutral',
    icon: 'warehouse',
    label: 'Stored'
  }
};

// ---- org-owned fleet ----
const ORG_FLEET = [{
  id: 'AV-01',
  ship: 'Polaris',
  mfr: 'RSI',
  role: 'combat',
  status: 'deployed',
  captain: 'hezeqiah',
  crew: 14,
  cargo: 576,
  loc: 'Aaron Halo · Patrol',
  flag: true,
  note: 'Org flagship — corvette'
}, {
  id: 'AV-02',
  ship: 'Hammerhead',
  mfr: 'Aegis',
  role: 'combat',
  status: 'ready',
  captain: 'Dax Moreno',
  crew: 9,
  cargo: 40,
  loc: 'Everus Harbor · Hangar 2'
}, {
  id: 'AV-03',
  ship: 'Reclaimer',
  mfr: 'Aegis',
  role: 'salvage',
  status: 'repair',
  captain: 'Kova Rhys',
  crew: 5,
  cargo: 420,
  loc: 'CRU-L1 · Repair bay',
  note: 'Hull integrity 62% — in repair'
}, {
  id: 'AV-04',
  ship: 'Hull C',
  mfr: 'MISC',
  role: 'hauling',
  status: 'deployed',
  captain: 'Iris Tanaka',
  crew: 4,
  cargo: 4608,
  loc: 'ARC → Hurston run'
}, {
  id: 'AV-05',
  ship: 'Carrack',
  mfr: 'Anvil',
  role: 'explore',
  status: 'stored',
  captain: '—',
  crew: 6,
  cargo: 456,
  loc: 'New Babbage · Storage'
}, {
  id: 'AV-06',
  ship: 'Argo MOLE',
  mfr: 'Argo',
  role: 'mining',
  status: 'ready',
  captain: 'Vesper Calderon',
  crew: 3,
  cargo: 96,
  loc: 'Lyria · Outpost'
}, {
  id: 'AV-07',
  ship: 'Valkyrie',
  mfr: 'Anvil',
  role: 'transport',
  status: 'ready',
  captain: '—',
  crew: 5,
  cargo: 30,
  loc: 'Everus Harbor · Hangar 5'
}, {
  id: 'AV-08',
  ship: 'A2 Hercules',
  mfr: 'Crusader',
  role: 'combat',
  status: 'stored',
  captain: '—',
  crew: 4,
  cargo: 216,
  loc: 'Area18 · Storage'
}];

// ---- current member's personal ships (hezeqiah) ----
const MY_SHIPS = [{
  id: 'MY-1',
  ship: 'F8C Lightning',
  mfr: 'Anvil',
  role: 'combat',
  crew: 1,
  cargo: 0,
  offered: true,
  rate: 0,
  who: 'Leadership'
}, {
  id: 'MY-2',
  ship: 'Vulture',
  mfr: 'Drake',
  role: 'salvage',
  crew: 1,
  cargo: 12,
  offered: true,
  rate: 25000,
  who: 'Any member'
}, {
  id: 'MY-3',
  ship: 'Prospector',
  mfr: 'MISC',
  role: 'mining',
  crew: 1,
  cargo: 32,
  offered: false,
  rate: 0,
  who: 'Leadership'
}, {
  id: 'MY-4',
  ship: 'Cutlass Black',
  mfr: 'Drake',
  role: 'transport',
  crew: 3,
  cargo: 46,
  offered: false,
  rate: 18000,
  who: 'Leadership'
}, {
  id: 'MY-5',
  ship: 'Constellation Andromeda',
  mfr: 'RSI',
  role: 'combat',
  crew: 4,
  cargo: 96,
  offered: false,
  rate: 0,
  who: 'Leadership'
}];

// ---- ships members have offered to the org (org doesn't own) ----
const OFFERED = [{
  id: 'OF-1',
  ship: 'Constellation Phoenix',
  mfr: 'RSI',
  role: 'transport',
  owner: 'Vesper Calderon',
  crew: 4,
  cargo: 96,
  rate: 45000,
  status: 'available',
  who: 'Leadership'
}, {
  id: 'OF-2',
  ship: 'Redeemer',
  mfr: 'Aegis',
  role: 'combat',
  owner: 'Dax Moreno',
  crew: 5,
  cargo: 6,
  rate: 60000,
  status: 'available',
  who: 'Leadership'
}, {
  id: 'OF-3',
  ship: 'Caterpillar',
  mfr: 'Drake',
  role: 'hauling',
  owner: 'Kova Rhys',
  crew: 4,
  cargo: 576,
  rate: 30000,
  status: 'onloan',
  who: 'Any member',
  borrowedBy: 'Org haul · Op Ironwake'
}, {
  id: 'OF-4',
  ship: 'Carrack',
  mfr: 'Anvil',
  role: 'explore',
  owner: 'Iris Tanaka',
  crew: 6,
  cargo: 456,
  rate: 0,
  status: 'available',
  who: 'Leadership'
}, {
  id: 'OF-5',
  ship: 'Vulture',
  mfr: 'Drake',
  role: 'salvage',
  owner: 'hezeqiah',
  crew: 1,
  cargo: 12,
  rate: 25000,
  status: 'available',
  who: 'Any member'
}];
const fmt = n => Math.round(n).toLocaleString('en-US');
const initials = s => s.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ============== ORG FLEET VIEW ==============
function OrgFleetRow({
  s,
  selected,
  tabIndex,
  regRef,
  onSelect
}) {
  const r = ROLE[s.role],
    st = SHIP_STATUS[s.status];
  return /*#__PURE__*/React.createElement("tr", {
    ref: regRef,
    tabIndex: tabIndex,
    "aria-selected": selected,
    onClick: onSelect,
    onFocus: onSelect
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "t-ent"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + r.cls
  }, /*#__PURE__*/React.createElement(FI, {
    n: r.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, s.mfr, " ", s.ship, " ", s.flag && /*#__PURE__*/React.createElement(FI, {
    n: "star",
    style: {
      width: 13,
      height: 13,
      color: 'var(--brand)',
      verticalAlign: 'middle'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, s.id, " \xB7 ", r.label)))), /*#__PURE__*/React.createElement("td", null, s.captain === '—' ? /*#__PURE__*/React.createElement("span", {
    className: "t-muted"
  }, "Unassigned") : /*#__PURE__*/React.createElement(window.AvatarChip, {
    name: s.captain
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "fleet-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FI, {
    n: "users"
  }), /*#__PURE__*/React.createElement("span", {
    className: "t-mono"
  }, s.crew)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FI, {
    n: "container"
  }), /*#__PURE__*/React.createElement("span", {
    className: "t-mono"
  }, fmt(s.cargo))))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, st.label)));
}
function OrgFleetDetail({
  s
}) {
  const r = ROLE[s.role],
    st = SHIP_STATUS[s.status];
  const tint = {
    combat: 'var(--coral-300)',
    mining: 'var(--aqua-300)',
    salvage: '#D9A6E6',
    hauling: 'var(--warning-500)',
    explore: 'var(--teal-300)',
    transport: '#9AA6F5',
    medical: 'var(--success-500)',
    support: 'var(--text-muted)'
  }[s.role];
  return /*#__PURE__*/React.createElement("div", {
    className: "panel detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ship-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + r.cls
  }, /*#__PURE__*/React.createElement(FI, {
    n: r.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, s.mfr, " ", s.ship), /*#__PURE__*/React.createElement("div", {
    className: "mfr"
  }, s.id, " \xB7 ", r.label, " ", s.flag && '· Flagship')), /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, st.label)), /*#__PURE__*/React.createElement("div", {
    className: "spec-grid",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "users"
  }), " Crew"), /*#__PURE__*/React.createElement("div", {
    className: "sv"
  }, s.crew, /*#__PURE__*/React.createElement("small", null, "seats"))), /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "container"
  }), " Cargo"), /*#__PURE__*/React.createElement("div", {
    className: "sv"
  }, fmt(s.cargo), /*#__PURE__*/React.createElement("small", null, "SCU"))))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Assignment")), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "user-round"
  }), " Captain"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, s.captain)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "map-pin"
  }), " Location"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, s.loc)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "shield"
  }), " Role"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, r.label)), s.note && /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "info"
  }), " Note"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      fontWeight: 400,
      color: 'var(--text-muted)'
    }
  }, s.note))), /*#__PURE__*/React.createElement("div", {
    className: "panel-body",
    style: {
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FI, {
    n: "user-plus"
  }), " Assign crew"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FI, {
    n: "navigation"
  }), " Set status"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    "aria-label": "Ship settings"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "settings-2"
  }))));
}
function OrgFleetView() {
  const [selId, setSelId] = React.useState(ORG_FLEET[0].id);
  const sel = ORG_FLEET.find(s => s.id === selId);
  const roving = window.useRoving(ORG_FLEET.length, {
    onActivate: i => setSelId(ORG_FLEET[i].id)
  });
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable",
    role: "grid",
    "aria-label": "Org fleet",
    onKeyDown: roving.onKeyDown
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Ship"), /*#__PURE__*/React.createElement("th", null, "Captain"), /*#__PURE__*/React.createElement("th", null, "Capacity"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, ORG_FLEET.map((s, i) => /*#__PURE__*/React.createElement(OrgFleetRow, {
    key: s.id,
    s: s,
    selected: s.id === selId,
    tabIndex: roving.getTab(i),
    regRef: roving.register(i),
    onSelect: () => {
      setSelId(s.id);
      roving.setIdx(i);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "list-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " move ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open ", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, ORG_FLEET.length, " org ships"))), sel && /*#__PURE__*/React.createElement(OrgFleetDetail, {
    s: sel
  }));
}

// ============== MY SHIPS VIEW ==============
function MyShipOffer({
  s,
  onToggle,
  onToast
}) {
  const r = ROLE[s.role];
  return /*#__PURE__*/React.createElement("div", {
    className: 'offer' + (s.offered ? ' on' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "offer-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + r.cls
  }, /*#__PURE__*/React.createElement(FI, {
    n: r.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, s.mfr, " ", s.ship), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, /*#__PURE__*/React.createElement("span", null, r.label), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(FI, {
    n: "users",
    style: {
      width: 13,
      height: 13
    }
  }), s.crew, " crew"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(FI, {
    n: "container",
    style: {
      width: 13,
      height: 13
    }
  }), fmt(s.cargo), " SCU"))), /*#__PURE__*/React.createElement("div", {
    className: "offer-toggle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, /*#__PURE__*/React.createElement("strong", null, s.offered ? 'Offered to org' : 'Private'), s.offered ? s.rate ? fmt(s.rate) + ' aUEC/day' : 'Free for org' : 'Not shared'), /*#__PURE__*/React.createElement("button", {
    className: "swtch",
    role: "switch",
    "aria-checked": s.offered,
    "aria-label": 'Offer ' + s.ship + ' to org',
    onClick: () => {
      onToggle(s.id);
      onToast(s.offered ? s.ship + ' withdrawn from org' : s.ship + ' offered to org', s.offered ? 'lock' : 'check');
    }
  }))), s.offered && /*#__PURE__*/React.createElement("div", {
    className: "terms"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, "Rate"), /*#__PURE__*/React.createElement("div", {
    className: "control",
    tabIndex: "0",
    role: "button"
  }, s.rate ? /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fmt(s.rate)) : /*#__PURE__*/React.createElement("span", {
    className: "rate-free"
  }, "Free"), /*#__PURE__*/React.createElement("span", {
    className: "t-muted",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, s.rate ? 'aUEC/day' : ''), /*#__PURE__*/React.createElement(FI, {
    n: "pencil"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, "Who can request"), /*#__PURE__*/React.createElement("div", {
    className: "control",
    tabIndex: "0",
    role: "button"
  }, s.who, /*#__PURE__*/React.createElement(FI, {
    n: "chevron-down"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, "Status"), /*#__PURE__*/React.createElement("div", {
    className: "control",
    tabIndex: "0",
    role: "button",
    style: {
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement(StatusPill, {
    tone: "success",
    icon: "circle-check"
  }, "Available"))), /*#__PURE__*/React.createElement("div", {
    className: "terms-note"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "shield-check"
  }), " Leadership can see this ship as rentable capacity. You stay the owner and can withdraw it anytime.")));
}
function MyShipsView({
  ships,
  setShips
}) {
  const toast = window.__toast || (() => {});
  const onToggle = id => setShips(arr => arr.map(s => s.id === id ? {
    ...s,
    offered: !s.offered
  } : s));
  const offeredCount = ships.filter(s => s.offered).length;
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "offer-summary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "hand-helping"
  })), /*#__PURE__*/React.createElement("div", {
    className: "txt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tt"
  }, offeredCount, " of ", ships.length, " ships offered to Atlas Vanguard"), /*#__PURE__*/React.createElement("div", {
    className: "ss"
  }, "Toggle a ship to make it available for org operations. You keep ownership and set the terms.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "plus"
  }), " Add ship")), /*#__PURE__*/React.createElement("div", {
    className: "offer-list"
  }, ships.map(s => /*#__PURE__*/React.createElement(MyShipOffer, {
    key: s.id,
    s: s,
    onToggle: onToggle,
    onToast: toast
  }))));
}

// ============== MEMBER-OFFERED VIEW ==============
function OfferedRow({
  s,
  selected,
  tabIndex,
  regRef,
  onSelect
}) {
  const r = ROLE[s.role];
  const onloan = s.status === 'onloan';
  return /*#__PURE__*/React.createElement("tr", {
    ref: regRef,
    tabIndex: tabIndex,
    "aria-selected": selected,
    onClick: onSelect,
    onFocus: onSelect
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "t-ent"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + r.cls
  }, /*#__PURE__*/React.createElement(FI, {
    n: r.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, s.mfr, " ", s.ship), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, r.label)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(window.AvatarChip, {
    name: s.owner
  })), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, s.rate ? /*#__PURE__*/React.createElement("span", {
    className: "rate-pill"
  }, fmt(s.rate), " ", /*#__PURE__*/React.createElement("small", null, "/day")) : /*#__PURE__*/React.createElement("span", {
    className: "rate-free"
  }, "Free")), /*#__PURE__*/React.createElement("td", null, onloan ? /*#__PURE__*/React.createElement(StatusPill, {
    tone: "info",
    icon: "navigation"
  }, "On loan") : /*#__PURE__*/React.createElement(StatusPill, {
    tone: "brand",
    icon: "circle-check"
  }, "Available")));
}
function OfferedDetail({
  s
}) {
  const r = ROLE[s.role];
  const onloan = s.status === 'onloan';
  return /*#__PURE__*/React.createElement("div", {
    className: "panel detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ship-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + r.cls
  }, /*#__PURE__*/React.createElement(FI, {
    n: r.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, s.mfr, " ", s.ship), /*#__PURE__*/React.createElement("div", {
    className: "mfr"
  }, r.label, " \xB7 owned by ", s.owner)), onloan ? /*#__PURE__*/React.createElement(StatusPill, {
    tone: "info",
    icon: "navigation"
  }, "On loan") : /*#__PURE__*/React.createElement(StatusPill, {
    tone: "brand",
    icon: "circle-check"
  }, "Available")), /*#__PURE__*/React.createElement("div", {
    className: "spec-grid",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "users"
  }), " Crew"), /*#__PURE__*/React.createElement("div", {
    className: "sv"
  }, s.crew, /*#__PURE__*/React.createElement("small", null, "seats"))), /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "container"
  }), " Cargo"), /*#__PURE__*/React.createElement("div", {
    className: "sv"
  }, fmt(s.cargo), /*#__PURE__*/React.createElement("small", null, "SCU"))))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Rental terms")), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "coins"
  }), " Rate"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, s.rate ? fmt(s.rate) + ' aUEC / day' : 'Free for org ops')), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "key-round"
  }), " Who can request"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, s.who)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "user-round"
  }), " Owner"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, s.owner)), onloan && /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "navigation"
  }), " Current use"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      fontWeight: 400,
      color: 'var(--text-muted)'
    }
  }, s.borrowedBy))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Request to use")), /*#__PURE__*/React.createElement("div", {
    className: "req-box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic role-explore",
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(FI, {
    n: "calendar-clock"
  })), /*#__PURE__*/React.createElement("div", {
    className: "who"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, onloan ? 'Currently on loan to the org' : 'Reserve for an operation'), /*#__PURE__*/React.createElement("div", {
    className: "rt"
  }, onloan ? 'Returns after Op Ironwake' : s.rate ? fmt(s.rate) + ' aUEC/day · ' + s.owner + ' approves' : 'Free · ' + s.owner + ' approves')))), /*#__PURE__*/React.createElement("div", {
    className: "panel-body",
    style: {
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, onloan ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FI, {
    n: "rotate-ccw"
  }), " Request return") : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FI, {
    n: "send"
  }), " Request ship"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    "aria-label": "Message owner"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "message-circle"
  }))));
}
function OfferedView() {
  const [selId, setSelId] = React.useState(OFFERED[0].id);
  const sel = OFFERED.find(s => s.id === selId);
  const roving = window.useRoving(OFFERED.length, {
    onActivate: i => setSelId(OFFERED[i].id)
  });
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable",
    role: "grid",
    "aria-label": "Member-offered ships",
    onKeyDown: roving.onKeyDown
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Ship"), /*#__PURE__*/React.createElement("th", null, "Offered by"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Rate"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, OFFERED.map((s, i) => /*#__PURE__*/React.createElement(OfferedRow, {
    key: s.id,
    s: s,
    selected: s.id === selId,
    tabIndex: roving.getTab(i),
    regRef: roving.register(i),
    onSelect: () => {
      setSelId(s.id);
      roving.setIdx(i);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "list-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " move ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open ", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, OFFERED.length, " member ships available"))), sel && /*#__PURE__*/React.createElement(OfferedDetail, {
    s: sel
  }));
}

// ============== PAGE ==============
function FleetPage() {
  const [tab, setTab] = React.useState('org');
  const [myShips, setMyShips] = React.useState(MY_SHIPS);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const myOffered = myShips.filter(s => s.offered).length;
  const ready = ORG_FLEET.filter(s => s.status === 'ready').length;
  const deployed = ORG_FLEET.filter(s => s.status === 'deployed').length;
  const totalCargo = ORG_FLEET.reduce((s, x) => s + x.cargo, 0);
  const availOffered = OFFERED.filter(s => s.status === 'available').length;
  const tabs = [{
    value: 'org',
    label: 'Org Fleet',
    icon: 'building-2',
    count: ORG_FLEET.length
  }, {
    value: 'mine',
    label: 'My Ships',
    icon: 'user-round',
    count: myShips.length
  }, {
    value: 'offered',
    label: 'Member-Offered',
    icon: 'hand-helping',
    count: OFFERED.length
  }];
  const stats = tab === 'mine' ? [{
    k: 'My ships',
    icon: 'rocket',
    v: myShips.length,
    d: 'in personal hangar'
  }, {
    k: 'Offered to org',
    icon: 'hand-helping',
    v: myOffered,
    d: 'available for ops',
    tone: 'up'
  }, {
    k: 'Earning potential',
    icon: 'coins',
    v: fmt(myShips.filter(s => s.offered).reduce((a, s) => a + s.rate, 0)),
    unit: 'aUEC/day',
    d: 'from rentals'
  }, {
    k: 'Total cargo',
    icon: 'container',
    v: fmt(myShips.reduce((a, s) => a + s.cargo, 0)),
    unit: 'SCU',
    d: 'across your ships'
  }] : tab === 'offered' ? [{
    k: 'Member ships',
    icon: 'hand-helping',
    v: OFFERED.length,
    d: 'offered to the org'
  }, {
    k: 'Available now',
    icon: 'circle-check',
    v: availOffered,
    d: 'ready to request',
    tone: 'up'
  }, {
    k: 'On loan',
    icon: 'navigation',
    v: OFFERED.length - availOffered,
    d: 'currently in use'
  }, {
    k: 'Rentable cargo',
    icon: 'container',
    v: fmt(OFFERED.reduce((a, s) => a + s.cargo, 0)),
    unit: 'SCU',
    d: 'extra capacity'
  }] : [{
    k: 'Org ships',
    icon: 'rocket',
    v: ORG_FLEET.length,
    d: 'owned by Atlas Vanguard'
  }, {
    k: 'Ready',
    icon: 'circle-check',
    v: ready,
    d: 'crewed & flightworthy',
    tone: 'up'
  }, {
    k: 'Deployed',
    icon: 'navigation',
    v: deployed,
    d: 'on active ops'
  }, {
    k: 'Fleet cargo',
    icon: 'container',
    v: fmt(totalCargo),
    unit: 'SCU',
    d: 'total capacity'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "rocket"
  }), " Operations ", /*#__PURE__*/React.createElement(FI, {
    n: "chevron-right"
  }), " Fleet"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Fleet"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Manage the org armada, your personal hangar, and the ships members lend to the cause \u2014 all in one command view.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, tab === 'org' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "download"
  }), " Export"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    id: "fleet-new"
  }, /*#__PURE__*/React.createElement(FI, {
    n: "plus"
  }), " ", tab === 'mine' ? 'Add ship' : 'Register ship', " ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 6
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Segmented, {
    options: tabs,
    value: tab,
    onChange: setTab,
    ariaLabel: "Fleet view"
  })), /*#__PURE__*/React.createElement(StatStrip, {
    items: stats
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)'
    }
  }, tab === 'org' && /*#__PURE__*/React.createElement(OrgFleetView, null), tab === 'mine' && /*#__PURE__*/React.createElement(MyShipsView, {
    ships: myShips,
    setShips: setMyShips
  }), tab === 'offered' && /*#__PURE__*/React.createElement(OfferedView, null)));
}
function FleetApp() {
  const commands = [{
    id: 'fleet-org',
    group: 'Fleet',
    icon: 'building-2',
    label: 'View org fleet',
    run: () => window.__toast && window.__toast('Org fleet')
  }, {
    id: 'fleet-mine',
    group: 'Fleet',
    icon: 'user-round',
    label: 'My ships & offers',
    run: () => window.__toast && window.__toast('My ships')
  }, {
    id: 'fleet-offered',
    group: 'Fleet',
    icon: 'hand-helping',
    label: 'Member-offered ships',
    run: () => window.__toast && window.__toast('Member-offered')
  }, {
    id: 'fleet-register',
    group: 'Fleet',
    icon: 'plus',
    label: 'Register a ship',
    run: () => window.__toast && window.__toast('Register ship', 'plus')
  }];
  const helpExtra = [['Register ship', ['n']], ['Switch view', ['←', '→']], ['Open ship', ['↵']], ['Toggle theme', ['t']]];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: "fleet",
    commands: commands,
    helpExtra: helpExtra,
    onNew: () => window.__toast && window.__toast('Register a new ship', 'plus'),
    searchPlaceholder: "Search ships, captains, owners\u2026"
  }, /*#__PURE__*/React.createElement(FleetPage, null));
}
window.FleetApp = FleetApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/Fleet.jsx", error: String((e && e.message) || e) }); }

// app/Inventory.jsx
try { (() => {
// ============================================================
// Station — Inventory page (main)
// ============================================================

const II = window.StationIcon;
const SInv = window.StationInv;
function InventoryPage() {
  const toast = window.__toast || (() => {});
  const {
    qfmt,
    abbr
  } = window._invHelpers;
  const [view, setView] = React.useState('personal'); // personal | org
  const [orgId, setOrgId] = React.useState(1);
  const orgMode = view === 'org';
  const org = SInv.INV_ORGS.find(o => o.id === orgId);
  const canManage = orgMode ? org && (org.perms.includes('edit') || org.perms.includes('admin')) : true;
  const [personal, setPersonal] = React.useState(SInv.PERSONAL_ITEMS);
  const [orgItems, setOrgItems] = React.useState(SInv.ORG_ITEMS);
  const source = orgMode ? orgItems : personal;
  const setSource = orgMode ? setOrgItems : setPersonal;

  // filters / sort / group / density
  const [search, setSearch] = React.useState('');
  const [catId, setCatId] = React.useState('');
  const [sharedOnly, setSharedOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('date');
  const [sortDir, setSortDir] = React.useState('desc');
  const [groupBy, setGroupBy] = React.useState('none');
  const [density, setDensity] = React.useState('standard'); // standard | compact(editor)
  const editing = density === 'compact' && canManage;
  const [page, setPage] = React.useState(0);
  const [rpp, setRpp] = React.useState(25);

  // inline edit state
  const [drafts, setDrafts] = React.useState({});
  const [qtyState, setQtyState] = React.useState({}); // id -> saving|saved
  const [qtyErr, setQtyErr] = React.useState({});
  const [activeId, setActiveId] = React.useState(null);

  // action popover + catalog
  const [action, setAction] = React.useState(null); // {mode, item, anchorRect}
  const [catalogOpen, setCatalogOpen] = React.useState(false);
  React.useEffect(() => {
    setPage(0);
  }, [search, catId, sharedOnly, view, orgId]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // filtered + sorted
  const filtered = React.useMemo(() => {
    let r = source.filter(it => {
      if (search && !it.itemName.toLowerCase().includes(search.toLowerCase()) && !(it.notes || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (catId && it.categoryName !== SInv.catById(catId).name) return false;
      if (!orgMode && sharedOnly && !it.sharedOrgId) return false;
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    r = [...r].sort((a, b) => {
      if (sortBy === 'name') return a.itemName.localeCompare(b.itemName) * dir;
      if (sortBy === 'quantity') return (a.quantity - b.quantity) * dir;
      return (a.id - b.id) * dir; // date proxy
    });
    return r;
  }, [source, search, catId, sharedOnly, orgMode, sortBy, sortDir]);

  // group
  const groups = React.useMemo(() => {
    if (groupBy === 'none') return [['All items', filtered]];
    const m = new Map();
    filtered.forEach(it => {
      const key = groupBy === 'category' ? it.categoryName : it.sharedOrgId ? 'Shared' : 'Private';
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(it);
    });
    return [...m.entries()];
  }, [filtered, groupBy]);

  // pagination applies only when ungrouped
  const paged = groupBy === 'none' ? filtered.slice(page * rpp, page * rpp + rpp) : filtered;
  const pageGroups = groupBy === 'none' ? [['All items', paged]] : groups;
  const totalPages = Math.max(1, Math.ceil(filtered.length / rpp));

  // stats
  const totalQty = source.reduce((s, x) => s + Number(x.quantity), 0);
  const sharedCount = source.filter(x => x.sharedOrgId).length;
  const catCount = new Set(source.map(x => x.categoryName)).size;

  // ---- inline qty ----
  const onQtyChange = (it, v) => {
    setDrafts(d => ({
      ...d,
      [it.id]: v
    }));
    setQtyErr(e => ({
      ...e,
      [it.id]: null
    }));
  };
  const onQtyCommit = (it, advance) => {
    const raw = drafts[it.id];
    if (raw == null) return;
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) {
      setQtyErr(e => ({
        ...e,
        [it.id]: 'Must be greater than 0'
      }));
      return;
    }
    if (n === Number(it.quantity)) {
      setDrafts(d => {
        const c = {
          ...d
        };
        delete c[it.id];
        return c;
      });
      return;
    }
    setQtyState(s => ({
      ...s,
      [it.id]: 'saving'
    }));
    setTimeout(() => {
      setSource(arr => arr.map(x => x.id === it.id ? {
        ...x,
        quantity: n,
        modified: 'just now'
      } : x));
      setQtyState(s => ({
        ...s,
        [it.id]: 'saved'
      }));
      setDrafts(d => {
        const c = {
          ...d
        };
        delete c[it.id];
        return c;
      });
      setTimeout(() => setQtyState(s => {
        const c = {
          ...s
        };
        delete c[it.id];
        return c;
      }), 1200);
    }, 420);
  };

  // ---- add from catalog / new row ----
  const addItem = (catItem, quantity, notes) => {
    const cat = SInv.INV_CATEGORIES.find(c => c.id === catItem.categoryId);
    const existing = source.find(x => x.uexItemId === catItem.uexId);
    if (existing) {
      setSource(arr => arr.map(x => x.id === existing.id ? {
        ...x,
        quantity: Number(x.quantity) + Number(quantity),
        modified: 'just now'
      } : x));
      toast('Merged into ' + catItem.name, 'git-merge');
    } else {
      const nid = Math.max(0, ...source.map(x => x.id)) + 1;
      setSource(arr => [{
        id: nid,
        uexItemId: catItem.uexId,
        itemName: catItem.name,
        categoryName: cat.name,
        quantity: Number(quantity),
        notes: notes || '',
        sharedOrgId: null,
        location: orgMode ? 'Org vault' : 'Personal hangar',
        modified: 'just now'
      }, ...arr]);
      toast('Added ' + catItem.name, 'check');
    }
  };

  // ---- row actions ----
  const openAction = (anchor, item) => {
    const r = anchor.getBoundingClientRect();
    setAction({
      mode: 'menu',
      item,
      rect: r
    });
  };
  const doEdit = (item, quantity, notes) => {
    setSource(arr => arr.map(x => x.id === item.id ? {
      ...x,
      quantity: Number(quantity),
      notes,
      modified: 'just now'
    } : x));
    toast('Updated ' + item.itemName, 'check');
    setAction(null);
  };
  const doSplit = (item, amount) => {
    const a = Number(amount);
    if (a <= 0 || a >= Number(item.quantity)) {
      toast('Split must be less than current qty', 'triangle-alert');
      return;
    }
    const nid = Math.max(0, ...source.map(x => x.id)) + 1;
    setSource(arr => arr.flatMap(x => x.id === item.id ? [{
      ...x,
      quantity: Number(x.quantity) - a,
      modified: 'just now'
    }, {
      ...x,
      id: nid,
      quantity: a,
      sharedOrgId: null,
      notes: '',
      modified: 'just now'
    }] : [x]));
    toast('Split ' + qfmt(a) + ' off ' + item.itemName, 'split');
    setAction(null);
  };
  const doShare = (item, shareOrgId) => {
    setSource(arr => arr.map(x => x.id === item.id ? {
      ...x,
      sharedOrgId: Number(shareOrgId),
      modified: 'just now'
    } : x));
    toast('Shared ' + item.itemName, 'share-2');
    setAction(null);
  };
  const doUnshare = item => {
    setSource(arr => arr.map(x => x.id === item.id ? {
      ...x,
      sharedOrgId: null,
      modified: 'just now'
    } : x));
    toast('Unshared ' + item.itemName, 'lock');
    setAction(null);
  };
  const doDelete = item => {
    setSource(arr => arr.filter(x => x.id !== item.id));
    toast('Deleted ' + item.itemName, 'trash-2');
    setAction(null);
  };
  const InvRow = window.InvRow,
    NewRow = window.NewRow;
  const cycleSort = key => {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');else {
      setSortBy(key);
      setSortDir('desc');
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(II, {
    n: "archive"
  }), " Assets ", /*#__PURE__*/React.createElement(II, {
    n: "chevron-right"
  }), " Inventory"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Inventory"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Track everything you own and what your org holds \u2014 refined ore, components, weapons, and trade goods. Edit quantities inline, split stacks, and share with your org.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement(Segmented, {
    options: [{
      value: 'personal',
      label: 'Personal',
      icon: 'user-round'
    }, {
      value: 'org',
      label: 'Organization',
      icon: 'building-2'
    }],
    value: view,
    onChange: setView,
    ariaLabel: "Inventory view"
  }), orgMode && /*#__PURE__*/React.createElement("span", {
    className: "inv-orgsel",
    role: "button",
    tabIndex: "0",
    onClick: () => setOrgId(id => id === 1 ? 2 : 1),
    "aria-label": "Switch organization"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, org.badge), org.name, /*#__PURE__*/React.createElement(II, {
    n: "chevrons-up-down"
  })), (!orgMode || canManage) && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    id: "inv-new",
    onClick: () => setCatalogOpen(true)
  }, /*#__PURE__*/React.createElement(II, {
    n: "plus"
  }), " ", orgMode ? 'Add org item' : 'Add item', " ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 6
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), orgMode && /*#__PURE__*/React.createElement("div", {
    className: 'perm-bar ' + (canManage ? 'manage' : 'view')
  }, /*#__PURE__*/React.createElement(II, {
    n: canManage ? 'shield-check' : 'eye'
  }), canManage ? /*#__PURE__*/React.createElement("span", null, "You have ", /*#__PURE__*/React.createElement("strong", null, "manage"), " access to ", org.name, " inventory \u2014 add, edit, split, and delete org stock.") : /*#__PURE__*/React.createElement("span", null, "You have ", /*#__PURE__*/React.createElement("strong", null, "view-only"), " access to ", org.name, " inventory. Ask an admin for edit rights to make changes."), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "t-mono",
    style: {
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, org.perms.join(' · ').toUpperCase())), /*#__PURE__*/React.createElement(StatStrip, {
    items: [{
      k: orgMode ? 'Org records' : 'My records',
      icon: 'package',
      v: source.length,
      d: catCount + ' categories'
    }, {
      k: 'Total quantity',
      icon: 'layers',
      v: abbr(totalQty),
      d: 'units on hand'
    }, {
      k: orgMode ? 'Org stock' : 'Shared items',
      icon: orgMode ? 'building-2' : 'share-2',
      v: orgMode ? source.length : sharedCount,
      d: orgMode ? 'visible to members' : 'shared to orgs',
      tone: 'up'
    }, {
      k: 'Categories',
      icon: 'tag',
      v: catCount,
      d: 'item families'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "inv-toolbar"
  }, /*#__PURE__*/React.createElement("label", {
    className: "inv-search"
  }, /*#__PURE__*/React.createElement(II, {
    n: "search"
  }), /*#__PURE__*/React.createElement("input", {
    value: search,
    placeholder: "Search items, notes\u2026",
    onChange: e => setSearch(e.target.value),
    "aria-label": "Search inventory"
  })), /*#__PURE__*/React.createElement("span", {
    className: "inv-select"
  }, /*#__PURE__*/React.createElement(II, {
    n: "tag",
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", {
    value: catId,
    onChange: e => setCatId(e.target.value ? Number(e.target.value) : ''),
    "aria-label": "Category filter"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All categories"), SInv.INV_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.name))), /*#__PURE__*/React.createElement(II, {
    n: "chevron-down",
    className: "chev"
  })), !orgMode && /*#__PURE__*/React.createElement("button", {
    className: "fchip",
    "aria-pressed": sharedOnly,
    onClick: () => setSharedOnly(v => !v)
  }, /*#__PURE__*/React.createElement(II, {
    n: "share-2"
  }), " Shared only"), /*#__PURE__*/React.createElement("span", {
    className: "inv-select"
  }, /*#__PURE__*/React.createElement(II, {
    n: "arrow-down-up",
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", {
    value: sortBy + ':' + sortDir,
    onChange: e => {
      const [k, d] = e.target.value.split(':');
      setSortBy(k);
      setSortDir(d);
    },
    "aria-label": "Sort"
  }, /*#__PURE__*/React.createElement("option", {
    value: "date:desc"
  }, "Newest first"), /*#__PURE__*/React.createElement("option", {
    value: "date:asc"
  }, "Oldest first"), /*#__PURE__*/React.createElement("option", {
    value: "name:asc"
  }, "Name A\u2013Z"), /*#__PURE__*/React.createElement("option", {
    value: "name:desc"
  }, "Name Z\u2013A"), /*#__PURE__*/React.createElement("option", {
    value: "quantity:desc"
  }, "Quantity high\u2013low"), /*#__PURE__*/React.createElement("option", {
    value: "quantity:asc"
  }, "Quantity low\u2013high")), /*#__PURE__*/React.createElement(II, {
    n: "chevron-down",
    className: "chev"
  })), /*#__PURE__*/React.createElement("span", {
    className: "inv-select"
  }, /*#__PURE__*/React.createElement(II, {
    n: "group",
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", {
    value: groupBy,
    onChange: e => setGroupBy(e.target.value),
    "aria-label": "Group by"
  }, /*#__PURE__*/React.createElement("option", {
    value: "none"
  }, "No grouping"), /*#__PURE__*/React.createElement("option", {
    value: "category"
  }, "Group by category"), /*#__PURE__*/React.createElement("option", {
    value: "share"
  }, "Group by share status")), /*#__PURE__*/React.createElement(II, {
    n: "chevron-down",
    className: "chev"
  })), /*#__PURE__*/React.createElement("span", {
    className: "inv-spacer"
  }), canManage && /*#__PURE__*/React.createElement("div", {
    className: "density-toggle",
    role: "group",
    "aria-label": "Density"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-pressed": density === 'standard',
    onClick: () => setDensity('standard'),
    title: "Standard view",
    "aria-label": "Standard view"
  }, /*#__PURE__*/React.createElement(II, {
    n: "rows-3"
  })), /*#__PURE__*/React.createElement("button", {
    "aria-pressed": density === 'compact',
    onClick: () => setDensity('compact'),
    title: "Editor mode \u2014 inline editing",
    "aria-label": "Editor mode"
  }, /*#__PURE__*/React.createElement(II, {
    n: "pencil-ruler"
  })))), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap",
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "inv-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "e-ic"
  }, /*#__PURE__*/React.createElement(II, {
    n: "package-open"
  })), /*#__PURE__*/React.createElement("h3", null, "No inventory matches your filters"), /*#__PURE__*/React.createElement("p", null, "Adjust filters or ", canManage ? 'add a new item' : 'sync new items', " to get started."))) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    },
    className: editing ? 'editor' : ''
  }, pageGroups.map(([gname, gitems], gi) => /*#__PURE__*/React.createElement("div", {
    className: 'grp-section' + (groupBy === 'none' ? ' single' : ''),
    key: gname
  }, groupBy !== 'none' && /*#__PURE__*/React.createElement("div", {
    className: "grp-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gchip"
  }, gname), /*#__PURE__*/React.createElement("span", {
    className: "gcount"
  }, gitems.length, " item", gitems.length === 1 ? '' : 's')), /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable inv-table",
    "aria-label": 'Inventory — ' + gname
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Quantity"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Updated"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, editing && gi === 0 && groupBy === 'none' && /*#__PURE__*/React.createElement(NewRow, {
    orgMode: orgMode,
    onAdd: addItem
  }), gitems.map(it => /*#__PURE__*/React.createElement(InvRow, {
    key: it.id,
    it: it,
    editing: editing,
    orgMode: orgMode,
    draft: drafts[it.id],
    qtyState: qtyState[it.id],
    qtyErr: qtyErr[it.id],
    isActive: activeId === it.id,
    onSelect: () => setActiveId(it.id),
    onQtyFocus: () => setActiveId(it.id),
    onQtyChange: v => onQtyChange(it, v),
    onQtyCommit: adv => onQtyCommit(it, adv),
    onAction: openAction
  }))))))), groupBy === 'none' && /*#__PURE__*/React.createElement("div", {
    className: "inv-pager"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rpp"
  }, "Rows per page", /*#__PURE__*/React.createElement("select", {
    value: rpp,
    onChange: e => {
      setRpp(Number(e.target.value));
      setPage(0);
    },
    "aria-label": "Rows per page"
  }, [10, 25, 50, 100, 250].map(n => /*#__PURE__*/React.createElement("option", {
    key: n,
    value: n
  }, n)))), /*#__PURE__*/React.createElement("span", null, filtered.length === 0 ? 0 : page * rpp + 1, "\u2013", Math.min(filtered.length, (page + 1) * rpp), " of ", filtered.length), /*#__PURE__*/React.createElement("div", {
    className: "pager"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: page === 0,
    onClick: () => setPage(p => Math.max(0, p - 1)),
    "aria-label": "Previous page"
  }, /*#__PURE__*/React.createElement(II, {
    n: "chevron-left"
  })), /*#__PURE__*/React.createElement("button", {
    disabled: page >= totalPages - 1,
    onClick: () => setPage(p => Math.min(totalPages - 1, p + 1)),
    "aria-label": "Next page"
  }, /*#__PURE__*/React.createElement(II, {
    n: "chevron-right"
  }))))), action && action.mode === 'menu' && /*#__PURE__*/React.createElement(ActionMenu, {
    action: action,
    orgMode: orgMode,
    onClose: () => setAction(null),
    onPick: mode => setAction({
      ...action,
      mode
    }),
    onUnshare: () => doUnshare(action.item)
  }), action && action.mode && action.mode !== 'menu' && /*#__PURE__*/React.createElement(ActionDialog, {
    action: action,
    orgs: SInv.INV_ORGS,
    onClose: () => setAction(null),
    onEdit: doEdit,
    onSplit: doSplit,
    onShare: doShare,
    onDelete: doDelete
  }), catalogOpen && /*#__PURE__*/React.createElement(CatalogDialog, {
    orgMode: orgMode,
    orgName: org && org.name,
    onClose: () => setCatalogOpen(false),
    onAdd: addItem
  }));
}

// ---- row action menu (popover) ----
function ActionMenu({
  action,
  orgMode,
  onClose,
  onPick,
  onUnshare
}) {
  const {
    item,
    rect
  } = action;
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const style = {
    position: 'fixed',
    top: Math.min(rect.bottom + 6, window.innerHeight - 230),
    left: Math.max(12, rect.right - 200),
    width: 196,
    zIndex: 160
  };
  const items = [{
    mode: 'edit',
    icon: 'pencil',
    label: 'Edit'
  }, {
    mode: 'split',
    icon: 'split',
    label: 'Split'
  }, ...(!orgMode ? [{
    mode: 'share',
    icon: 'share-2',
    label: 'Share'
  }] : []), ...(!orgMode && item.sharedOrgId ? [{
    unshare: true,
    icon: 'lock',
    label: 'Unshare'
  }] : []), {
    mode: 'delete',
    icon: 'trash-2',
    label: 'Delete',
    danger: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    style: {
      background: 'transparent',
      backdropFilter: 'none'
    },
    onMouseDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop",
    style: style,
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6
    }
  }, items.map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "cmdk-item",
    style: {
      width: '100%',
      color: m.danger ? 'var(--coral-400)' : undefined
    },
    onClick: () => {
      if (m.unshare) onUnshare();else onPick(m.mode);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: m.danger ? {
      background: 'color-mix(in srgb, var(--coral-500) 16%, transparent)',
      color: 'var(--coral-400)'
    } : undefined
  }, /*#__PURE__*/React.createElement(II, {
    n: m.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, m.label))))));
}

// ---- action dialogs (edit/split/share/delete) ----
function ActionDialog({
  action,
  orgs,
  onClose,
  onEdit,
  onSplit,
  onShare,
  onDelete
}) {
  const {
    mode,
    item
  } = action;
  const [qty, setQty] = React.useState(String(item.quantity));
  const [notes, setNotes] = React.useState(item.notes || '');
  const [splitAmt, setSplitAmt] = React.useState('');
  const [shareOrg, setShareOrg] = React.useState('');
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [mode]);
  const titles = {
    edit: 'Edit item',
    split: 'Split stack',
    share: 'Share with org',
    delete: 'Delete item'
  };
  const icons = {
    edit: 'pencil',
    split: 'split',
    share: 'share-2',
    delete: 'trash-2'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onMouseDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop",
    onMouseDown: e => e.stopPropagation(),
    style: {
      marginTop: '14vh'
    },
    role: "dialog",
    "aria-label": titles[mode]
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic' + (mode === 'delete' ? ' danger' : '')
  }, /*#__PURE__*/React.createElement(II, {
    n: icons[mode]
  })), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, titles[mode]), /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(II, {
    n: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "act-pop-body"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-strong)',
      fontWeight: 'var(--weight-medium)'
    }
  }, item.itemName), mode === 'edit' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Quantity"), /*#__PURE__*/React.createElement("input", {
    className: "field-in mono",
    value: qty,
    onChange: e => setQty(e.target.value),
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Notes"), /*#__PURE__*/React.createElement("textarea", {
    className: "field-in",
    value: notes,
    onChange: e => setNotes(e.target.value),
    placeholder: "Optional note\u2026"
  }))), mode === 'split' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "act-note"
  }, "Current quantity: ", /*#__PURE__*/React.createElement("strong", null, window._invHelpers.qfmt(item.quantity)), ". The split amount becomes a new stack."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Quantity to split off"), /*#__PURE__*/React.createElement("input", {
    className: "field-in mono",
    value: splitAmt,
    onChange: e => setSplitAmt(e.target.value),
    placeholder: "0",
    autoFocus: true
  }))), mode === 'share' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "act-note"
  }, "Make this item visible to one of your organizations."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Organization"), /*#__PURE__*/React.createElement("span", {
    className: "inv-select",
    style: {
      width: '100%',
      height: 40
    }
  }, /*#__PURE__*/React.createElement(II, {
    n: "building-2",
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", {
    value: shareOrg,
    onChange: e => setShareOrg(e.target.value),
    style: {
      flex: 1
    },
    autoFocus: true
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select organization\u2026"), orgs.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.id,
    value: o.id
  }, o.name))), /*#__PURE__*/React.createElement(II, {
    n: "chevron-down",
    className: "chev"
  })))), mode === 'delete' && /*#__PURE__*/React.createElement("p", {
    className: "act-note"
  }, "Remove ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-strong)'
    }
  }, item.itemName), " from this inventory? You can re-add it later from the catalog.")), /*#__PURE__*/React.createElement("div", {
    className: "act-pop-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, "Cancel"), mode === 'edit' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => onEdit(item, qty, notes)
  }, /*#__PURE__*/React.createElement(II, {
    n: "check"
  }), " Save"), mode === 'split' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => onSplit(item, splitAmt)
  }, /*#__PURE__*/React.createElement(II, {
    n: "split"
  }), " Split"), mode === 'share' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    disabled: !shareOrg,
    onClick: () => shareOrg && onShare(item, shareOrg)
  }, /*#__PURE__*/React.createElement(II, {
    n: "share-2"
  }), " Share"), mode === 'delete' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    style: {
      background: 'var(--coral-500)',
      color: '#fff'
    },
    onClick: () => onDelete(item)
  }, /*#__PURE__*/React.createElement(II, {
    n: "trash-2"
  }), " Delete"))));
}

// ---- catalog add dialog ----
function CatalogDialog({
  orgMode,
  orgName,
  onClose,
  onAdd
}) {
  const [q, setQ] = React.useState('');
  const [catId, setCatId] = React.useState('');
  const [sel, setSel] = React.useState(null);
  const [qty, setQty] = React.useState('1');
  const [notes, setNotes] = React.useState('');
  const [hi, setHi] = React.useState(0);
  const searchRef = React.useRef(null);
  React.useEffect(() => {
    setTimeout(() => searchRef.current && searchRef.current.focus(), 20);
  }, []);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const results = React.useMemo(() => {
    let r = window.StationInv.UEX_CATALOG;
    if (catId) r = r.filter(c => c.categoryId === Number(catId));
    if (q.trim()) r = r.filter(c => c.name.toLowerCase().includes(q.trim().toLowerCase()));
    return r;
  }, [q, catId]);
  React.useEffect(() => {
    setSel(results[0] || null);
    setHi(0);
  }, [q, catId]);
  const ready = sel && Number(qty) > 0;
  const submit = stay => {
    if (!ready) return;
    onAdd(sel, Number(qty), notes);
    if (stay) {
      setQty('1');
      setNotes('');
      searchRef.current && searchRef.current.focus();
    } else onClose();
  };
  const onListKey = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const n = Math.min(results.length - 1, hi + 1);
      setHi(n);
      setSel(results[n]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const n = Math.max(0, hi - 1);
      setHi(n);
      setSel(results[n]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submit(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onMouseDown: onClose,
    onKeyDown: e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        submit(true);
      }
      if (e.key === 'Escape') onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalog",
    onMouseDown: e => e.stopPropagation(),
    role: "dialog",
    "aria-label": "Add inventory item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalog-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, orgMode ? 'Add org item · ' + orgName : 'Add inventory item'), /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(II, {
    n: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "catalog-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalog-left"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Search catalog"), /*#__PURE__*/React.createElement("label", {
    className: "inv-search",
    style: {
      maxWidth: 'none',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(II, {
    n: "search"
  }), /*#__PURE__*/React.createElement("input", {
    ref: searchRef,
    value: q,
    placeholder: "Search UEX items\u2026",
    onChange: e => setQ(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Category"), /*#__PURE__*/React.createElement("span", {
    className: "inv-select",
    style: {
      width: '100%',
      height: 40
    }
  }, /*#__PURE__*/React.createElement(II, {
    n: "tag",
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", {
    value: catId,
    onChange: e => setCatId(e.target.value),
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All"), window.StationInv.INV_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.name))), /*#__PURE__*/React.createElement(II, {
    n: "chevron-down",
    className: "chev"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Quantity"), /*#__PURE__*/React.createElement("div", {
    className: "stepper"
  }, /*#__PURE__*/React.createElement("input", {
    className: "field-in mono",
    value: qty,
    onChange: e => setQty(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(v => String(Math.max(1, (Number(v) || 0) - 1))),
    "aria-label": "Decrease"
  }, /*#__PURE__*/React.createElement(II, {
    n: "minus"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(v => String((Number(v) || 0) + 1)),
    "aria-label": "Increase"
  }, /*#__PURE__*/React.createElement(II, {
    n: "plus"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Notes"), /*#__PURE__*/React.createElement("input", {
    className: "field-in",
    value: notes,
    onChange: e => setNotes(e.target.value),
    placeholder: "Optional\u2026"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "catalog-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cr-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Catalog results"), /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, results.length, " items")), /*#__PURE__*/React.createElement("div", {
    className: "cat-list",
    tabIndex: 0,
    onKeyDown: onListKey,
    role: "listbox",
    "aria-label": "Catalog items"
  }, results.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-8)',
      textAlign: 'center',
      color: 'var(--text-faint)',
      fontSize: 'var(--text-sm)'
    }
  }, "No catalog items match.") : results.map((c, i) => {
    const cat = window.StationInv.INV_CATEGORIES.find(x => x.id === c.categoryId);
    return /*#__PURE__*/React.createElement("div", {
      key: c.uexId,
      className: 'cat-opt' + (sel && sel.uexId === c.uexId ? ' sel' : ''),
      tabIndex: -1,
      role: "option",
      "aria-selected": sel && sel.uexId === c.uexId,
      onClick: () => {
        setSel(c);
        setHi(i);
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "radio"
    }), /*#__PURE__*/React.createElement("span", {
      className: "catdot",
      style: {
        background: cat.color,
        alignSelf: 'center'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "nm"
    }, c.name), /*#__PURE__*/React.createElement("div", {
      className: "ct"
    }, cat.name)));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "catalog-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tip"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2318"), /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " add & keep open \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " browse"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    disabled: !ready,
    onClick: () => submit(true)
  }, "Add & stay"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    disabled: !ready,
    onClick: () => submit(false)
  }, /*#__PURE__*/React.createElement(II, {
    n: "check"
  }), " Add & close"))));
}
function InventoryApp() {
  const commands = [{
    id: 'inv-add',
    group: 'Inventory',
    icon: 'plus',
    label: 'Add inventory item',
    hint: 'n',
    run: () => window.__toast && window.__toast('Opening catalog', 'plus')
  }, {
    id: 'inv-personal',
    group: 'Inventory',
    icon: 'user-round',
    label: 'View personal inventory',
    run: () => window.__toast && window.__toast('Personal inventory')
  }, {
    id: 'inv-org',
    group: 'Inventory',
    icon: 'building-2',
    label: 'View org inventory',
    run: () => window.__toast && window.__toast('Org inventory')
  }, {
    id: 'inv-editor',
    group: 'Inventory',
    icon: 'pencil-ruler',
    label: 'Toggle editor mode',
    run: () => window.__toast && window.__toast('Editor mode')
  }];
  const helpExtra = [['Add item', ['n']], ['Switch view', ['←', '→']], ['Inline edit qty', ['↵']], ['Add & keep open', ['⌘', '↵']]];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: "inventory",
    commands: commands,
    helpExtra: helpExtra,
    onNew: () => {
      const b = document.getElementById('inv-new');
      if (b) b.click();
    },
    searchPlaceholder: "Search items, categories\u2026"
  }, /*#__PURE__*/React.createElement(InventoryPage, null));
}
window.InventoryApp = InventoryApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/Inventory.jsx", error: String((e && e.message) || e) }); }

// app/Members.jsx
try { (() => {
// ============================================================
// Station — Members / HR page
// Roster + member profile with view→edit (rank, division, status,
// certifications, HR notes). Leadership & HR can update records.
// Keyboard-first: roving roster, Enter opens, native selects in edit.
// ============================================================

const MI = window.StationIcon;
const RANKS = ['Recruit', 'Member', 'Senior', 'Officer', 'Leadership'];
const rankCls = r => ({
  Recruit: 'recruit',
  Member: 'member',
  Senior: 'senior',
  Officer: 'officer',
  Leadership: 'leadership'
})[r] || 'member';
const DIVISIONS = {
  Mining: {
    icon: 'gem',
    tint: 'role-mining'
  },
  Salvage: {
    icon: 'recycle',
    tint: 'role-salvage'
  },
  Security: {
    icon: 'crosshair',
    tint: 'role-combat'
  },
  Logistics: {
    icon: 'container',
    tint: 'role-hauling'
  },
  Medical: {
    icon: 'cross',
    tint: 'role-medical'
  },
  Industry: {
    icon: 'factory',
    tint: 'role-explore'
  }
};
const STATUS = {
  Active: {
    tone: 'success',
    icon: 'circle-check'
  },
  Recruit: {
    tone: 'info',
    icon: 'user-plus'
  },
  'On leave': {
    tone: 'warn',
    icon: 'pause'
  },
  Inactive: {
    tone: 'neutral',
    icon: 'moon'
  }
};
const ALL_CERTS = ['Pilot', 'Gunner', 'Mining Op', 'Salvage Op', 'Medic', 'Multicrew', 'Quartermaster', 'Engineer', 'Scout', 'FPS'];
const MEMBERS = [{
  id: 'M-001',
  name: 'hezeqiah',
  handle: '@hez',
  rank: 'Leadership',
  division: 'Mining',
  status: 'Active',
  presence: 'online',
  joined: '2952-03-14',
  lastSeen: 'Now',
  ops: 142,
  trust: 'trusted',
  ship: 'RSI Polaris',
  region: 'US-East',
  certs: ['Pilot', 'Mining Op', 'Multicrew', 'Quartermaster'],
  discord: 'hezeqiah#0001',
  note: 'Org founder & quartermaster. Final say on fleet allocations.'
}, {
  id: 'M-002',
  name: 'Vesper Calderon',
  handle: '@nyx',
  rank: 'Officer',
  division: 'Mining',
  status: 'Active',
  presence: 'online',
  joined: '2952-06-02',
  lastSeen: '4m ago',
  ops: 98,
  trust: 'trusted',
  ship: 'Argo MOLE',
  region: 'EU-West',
  certs: ['Pilot', 'Mining Op', 'Gunner'],
  discord: 'vesper#2231',
  note: 'Leads weekly mining ops. Reliable turret crew lead.'
}, {
  id: 'M-003',
  name: 'Dax Moreno',
  handle: '@dax',
  rank: 'Senior',
  division: 'Security',
  status: 'Active',
  presence: 'away',
  joined: '2953-01-19',
  lastSeen: '1h ago',
  ops: 76,
  trust: 'verified',
  ship: 'Aegis Hammerhead',
  region: 'US-West',
  certs: ['Pilot', 'Gunner', 'FPS', 'Multicrew'],
  discord: 'dax#5510',
  note: 'Combat division. Good under pressure, mentor for new gunners.'
}, {
  id: 'M-004',
  name: 'Iris Tanaka',
  handle: '@iris',
  rank: 'Senior',
  division: 'Logistics',
  status: 'Active',
  presence: 'offline',
  joined: '2953-02-08',
  lastSeen: '6h ago',
  ops: 64,
  trust: 'verified',
  ship: 'MISC Hull C',
  region: 'APAC',
  certs: ['Pilot', 'Multicrew'],
  discord: 'iris#7782',
  note: 'Runs the long-haul cargo routes. Detail-oriented logistician.'
}, {
  id: 'M-005',
  name: 'Kova Rhys',
  handle: '@kova',
  rank: 'Member',
  division: 'Salvage',
  status: 'Active',
  presence: 'away',
  joined: '2953-04-22',
  lastSeen: '22m ago',
  ops: 41,
  trust: 'verified',
  ship: 'Drake Vulture',
  region: 'EU-Central',
  certs: ['Pilot', 'Salvage Op'],
  discord: 'kova#3140',
  note: 'Salvage specialist. Wants to cross-train on the Reclaimer.'
}, {
  id: 'M-006',
  name: 'Sable Quinn',
  handle: '@sable',
  rank: 'Member',
  division: 'Medical',
  status: 'On leave',
  presence: 'offline',
  joined: '2953-05-30',
  lastSeen: '8d ago',
  ops: 33,
  trust: 'verified',
  ship: 'Cutlass Red',
  region: 'US-East',
  certs: ['Pilot', 'Medic'],
  discord: 'sable#9920',
  note: 'On leave until next patch. Primary field medic for combat ops.'
}, {
  id: 'M-007',
  name: 'Bram Holloway',
  handle: '@bram',
  rank: 'Recruit',
  division: 'Industry',
  status: 'Recruit',
  presence: 'online',
  joined: '2954-01-04',
  lastSeen: '12m ago',
  ops: 6,
  trust: 'new',
  ship: 'MISC Prospector',
  region: 'EU-West',
  certs: ['Pilot'],
  discord: 'bram#1188',
  note: 'Trial period — 2 ops attended this week. Eager, needs mining cert.'
}, {
  id: 'M-008',
  name: 'Talia Vance',
  handle: '@tal',
  rank: 'Member',
  division: 'Security',
  status: 'Active',
  presence: 'online',
  joined: '2953-09-12',
  lastSeen: '2m ago',
  ops: 52,
  trust: 'verified',
  ship: 'Anvil F8C',
  region: 'US-Central',
  certs: ['Pilot', 'Gunner', 'FPS'],
  discord: 'talia#4407',
  note: 'Escort wing. Requested officer review next cycle.'
}, {
  id: 'M-009',
  name: 'Orin Pell',
  handle: '@orin',
  rank: 'Recruit',
  division: 'Logistics',
  status: 'Inactive',
  presence: 'offline',
  joined: '2953-11-28',
  lastSeen: '31d ago',
  ops: 9,
  trust: 'new',
  ship: 'Freelancer MAX',
  region: 'APAC',
  certs: ['Pilot'],
  discord: 'orin#6635',
  note: 'Inactive 30+ days — flag for roster review / outreach.'
}];
const initials = s => s.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ---- roster row ----
function MemberRow({
  m,
  selected,
  tabIndex,
  regRef,
  onSelect
}) {
  const div = DIVISIONS[m.division],
    st = STATUS[m.status];
  return /*#__PURE__*/React.createElement("tr", {
    ref: regRef,
    tabIndex: tabIndex,
    "aria-selected": selected,
    onClick: onSelect,
    onFocus: onSelect
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "t-ent"
  }, /*#__PURE__*/React.createElement("span", {
    className: "av-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "r-av",
    style: {
      background: window.avColor(m.name)
    }
  }, initials(m.name), /*#__PURE__*/React.createElement("span", {
    className: 'pres ' + m.presence
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, m.handle, " \xB7 ", m.id)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'rank ' + rankCls(m.rank)
  }, m.rank)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "divc"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'di ' + div.tint
  }, /*#__PURE__*/React.createElement(MI, {
    n: div.icon
  })), m.division)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, m.status)), /*#__PURE__*/React.createElement("td", {
    className: "t-muted t-mono",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, m.lastSeen));
}

// ---- member detail (view + edit) ----
function MemberDetail({
  m,
  onSave
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(m);
  React.useEffect(() => {
    setDraft(m);
    setEditing(false);
  }, [m.id]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const toast = window.__toast || (() => {});
  const cur = editing ? draft : m;
  const div = DIVISIONS[cur.division],
    st = STATUS[cur.status];
  const set = (k, v) => setDraft(d => ({
    ...d,
    [k]: v
  }));
  const save = () => {
    onSave(draft);
    setEditing(false);
    toast(draft.name + ' record updated', 'check');
  };
  const cancel = () => {
    setDraft(m);
    setEditing(false);
  };
  const addCert = c => {
    if (c && !draft.certs.includes(c)) set('certs', [...draft.certs, c]);
  };
  const rmCert = c => set('certs', draft.certs.filter(x => x !== c));
  const trustIcon = {
    trusted: 'shield-check',
    verified: 'badge-check',
    new: 'user'
  }[cur.trust];
  const trustLabel = {
    trusted: 'Trusted',
    verified: 'Verified',
    new: 'New'
  }[cur.trust];
  return /*#__PURE__*/React.createElement("div", {
    className: "panel detail"
  }, editing && /*#__PURE__*/React.createElement("div", {
    className: "hr-bar"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "pencil"
  }), " Editing as ", /*#__PURE__*/React.createElement("strong", null, "\xA0HR / Leadership"), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), "changes are logged"), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mem-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: "av",
    style: {
      background: window.avColor(cur.name)
    }
  }, initials(cur.name), /*#__PURE__*/React.createElement("span", {
    className: 'pres ' + cur.presence
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, cur.name), /*#__PURE__*/React.createElement("div", {
    className: "hd"
  }, cur.handle, " \xB7 ", cur.discord)), /*#__PURE__*/React.createElement("span", {
    className: 'rank ' + rankCls(cur.rank)
  }, cur.rank)), /*#__PURE__*/React.createElement("div", {
    className: "mstats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, cur.ops), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Ops attended")), /*#__PURE__*/React.createElement("div", {
    className: "mstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      textTransform: 'capitalize'
    }
  }, trustLabel), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Trust")), /*#__PURE__*/React.createElement("div", {
    className: "mstat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, cur.joined.slice(0, 4)), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Member since")))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Role & assignment")), editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "shield"
  }), " Rank"), /*#__PURE__*/React.createElement("select", {
    value: draft.rank,
    onChange: e => set('rank', e.target.value)
  }, RANKS.map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r)))), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "git-branch"
  }), " Division"), /*#__PURE__*/React.createElement("select", {
    value: draft.division,
    onChange: e => set('division', e.target.value)
  }, Object.keys(DIVISIONS).map(d => /*#__PURE__*/React.createElement("option", {
    key: d
  }, d))))), /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "activity"
  }), " Status"), /*#__PURE__*/React.createElement("select", {
    value: draft.status,
    onChange: e => set('status', e.target.value)
  }, Object.keys(STATUS).map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s)))), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "rocket"
  }), " Primary ship"), /*#__PURE__*/React.createElement("input", {
    value: draft.ship,
    onChange: e => set('ship', e.target.value)
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "git-branch"
  }), " Division"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, /*#__PURE__*/React.createElement("span", {
    className: "divc"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'di ' + div.tint
  }, /*#__PURE__*/React.createElement(MI, {
    n: div.icon
  })), cur.division))), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "activity"
  }), " Status"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, cur.status))), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "rocket"
  }), " Primary ship"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, cur.ship)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "globe"
  }), " Region"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, cur.region)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(MI, {
    n: trustIcon
  }), " Trust"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'trust ' + cur.trust
  }, /*#__PURE__*/React.createElement(MI, {
    n: trustIcon
  }), trustLabel))), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "clock"
  }), " Last seen"), /*#__PURE__*/React.createElement("span", {
    className: "v t-mono",
    style: {
      fontWeight: 400,
      color: 'var(--text-muted)'
    }
  }, cur.lastSeen)))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Certifications \xB7 ", cur.certs.length)), /*#__PURE__*/React.createElement("div", {
    className: "cert-wrap"
  }, cur.certs.map(c => /*#__PURE__*/React.createElement("span", {
    className: "cert",
    key: c
  }, /*#__PURE__*/React.createElement(MI, {
    n: "award"
  }), c, editing && /*#__PURE__*/React.createElement("button", {
    className: "rm",
    "aria-label": 'Remove ' + c,
    onClick: () => rmCert(c)
  }, /*#__PURE__*/React.createElement(MI, {
    n: "x"
  })))), editing && ALL_CERTS.filter(c => !draft.certs.includes(c)).slice(0, 3).map(c => /*#__PURE__*/React.createElement("button", {
    className: "cert-add",
    key: c,
    onClick: () => addCert(c)
  }, /*#__PURE__*/React.createElement(MI, {
    n: "plus"
  }), c)))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "HR notes"), /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      color: 'var(--warning-500)'
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "HR only"))), editing ? /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: draft.note,
    onChange: e => set('note', e.target.value),
    placeholder: "Private note visible to HR & leadership\u2026"
  })) : /*#__PURE__*/React.createElement("div", {
    className: "hr-note"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "lock"
  }), " Visible to HR & leadership"), cur.note)), /*#__PURE__*/React.createElement("div", {
    className: "panel-body",
    style: {
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: cancel,
    style: {
      flex: 1
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: save,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(MI, {
    n: "check"
  }), " Save record")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setEditing(true),
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(MI, {
    n: "pencil"
  }), " Edit record"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(MI, {
    n: "message-circle"
  }), " Message"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    "aria-label": "More"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "more-horizontal"
  })))));
}

// ---- page ----
function MembersPage() {
  const [members, setMembers] = React.useState(MEMBERS);
  const [div, setDiv] = React.useState('all');
  const visible = React.useMemo(() => div === 'all' ? members : members.filter(m => m.division === div), [members, div]);
  const [selId, setSelId] = React.useState(MEMBERS[0].id);
  const sel = members.find(m => m.id === selId);
  const roving = window.useRoving(visible.length, {
    onActivate: i => {
      if (visible[i]) setSelId(visible[i].id);
    }
  });
  React.useEffect(() => {
    if (visible.length && !visible.find(m => m.id === selId)) {
      setSelId(visible[0].id);
      roving.setIdx(0);
    }
  }, [div]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const onSave = updated => setMembers(arr => arr.map(m => m.id === updated.id ? updated : m));
  const active = members.filter(m => m.status === 'Active').length;
  const recruits = members.filter(m => m.status === 'Recruit').length;
  const leave = members.filter(m => m.status === 'On leave').length;
  const flagged = members.filter(m => m.status === 'Inactive').length;
  const filters = [{
    value: 'all',
    label: 'All',
    count: members.length
  }, ...Object.keys(DIVISIONS).map(d => ({
    value: d,
    label: d,
    icon: DIVISIONS[d].icon
  }))];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "users"
  }), " Operations ", /*#__PURE__*/React.createElement(MI, {
    n: "chevron-right"
  }), " Members"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Members"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "The org roster \u2014 ranks, divisions, certifications, and HR records. Leadership and HR can view and update any member.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "download"
  }), " Export roster"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    id: "mem-new"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "user-plus"
  }), " Invite member ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 6
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement(StatStrip, {
    items: [{
      k: 'Total members',
      icon: 'users',
      v: members.length,
      d: Object.keys(DIVISIONS).length + ' divisions'
    }, {
      k: 'Active',
      icon: 'circle-check',
      v: active,
      d: 'currently serving',
      tone: 'up'
    }, {
      k: 'Recruits',
      icon: 'user-plus',
      v: recruits,
      d: 'in trial period'
    }, {
      k: 'On leave',
      icon: 'pause',
      v: leave,
      d: 'temporarily away',
      tone: 'warn'
    }, {
      k: 'Roster review',
      icon: 'flag',
      v: flagged,
      d: 'inactive 30d+',
      tone: flagged ? 'warn' : ''
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "roster-bar"
  }, /*#__PURE__*/React.createElement(Segmented, {
    options: filters,
    value: div,
    onChange: setDiv,
    ariaLabel: "Filter members by division"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "arrow-down-up"
  }), " Sort: Rank"), /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(MI, {
    n: "filter"
  }), " Status"))), /*#__PURE__*/React.createElement("div", {
    className: "split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable",
    role: "grid",
    "aria-label": "Member roster",
    onKeyDown: roving.onKeyDown
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Member"), /*#__PURE__*/React.createElement("th", null, "Rank"), /*#__PURE__*/React.createElement("th", null, "Division"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Last seen"))), /*#__PURE__*/React.createElement("tbody", null, visible.map((m, i) => /*#__PURE__*/React.createElement(MemberRow, {
    key: m.id,
    m: m,
    selected: m.id === selId,
    tabIndex: roving.getTab(i),
    regRef: roving.register(i),
    onSelect: () => {
      setSelId(m.id);
      roving.setIdx(i);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "list-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " move ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open ", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, visible.length, " of ", members.length, " members"))), sel && /*#__PURE__*/React.createElement(MemberDetail, {
    m: sel,
    onSave: onSave
  })));
}
function MembersApp() {
  const commands = [{
    id: 'mem-invite',
    group: 'Members',
    icon: 'user-plus',
    label: 'Invite a member',
    hint: 'n',
    run: () => window.__toast && window.__toast('Invite sent', 'user-plus')
  }, {
    id: 'mem-export',
    group: 'Members',
    icon: 'download',
    label: 'Export roster (CSV)',
    run: () => window.__toast && window.__toast('Roster exported', 'download')
  }, {
    id: 'mem-review',
    group: 'Members',
    icon: 'flag',
    label: 'Roster review — inactive members',
    run: () => window.__toast && window.__toast('Showing inactive members', 'flag')
  }];
  const helpExtra = [['Invite member', ['n']], ['Filter division', ['←', '→']], ['Open record', ['↵']], ['Toggle theme', ['t']]];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: "members",
    commands: commands,
    helpExtra: helpExtra,
    onNew: () => window.__toast && window.__toast('Invite a new member', 'user-plus'),
    searchPlaceholder: "Search members, handles, certs\u2026"
  }, /*#__PURE__*/React.createElement(MembersPage, null));
}
window.MembersApp = MembersApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/Members.jsx", error: String((e && e.message) || e) }); }

// app/Profile.jsx
try { (() => {
// ============================================================
// Station — My Profile page
// The logged-in member's own profile. View ↔ Edit (like Members).
// In-game name DEFAULTS to the Station login username. Includes bio,
// identity, contact, social connections, organizations, and security.
// Keyboard-first on the shared app shell.
// ============================================================

const PI = window.StationIcon;

// the account the user is logged into Station with
const LOGIN_USERNAME = 'hezeqiah';
const initials = s => (s || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const rankCls = r => (r || '').toLowerCase();

// social network definitions (order = display order)
const SOCIALS = [{
  key: 'discord',
  net: 'Discord',
  icon: 'message-circle',
  cls: 'soc-discord',
  prefix: '',
  placeholder: 'username#0000'
}, {
  key: 'rsi',
  net: 'RSI / Spectrum',
  icon: 'rocket',
  cls: 'soc-rsi',
  prefix: 'robertsspaceindustries.com/citizens/',
  placeholder: 'Citizen handle'
}, {
  key: 'twitch',
  net: 'Twitch',
  icon: 'twitch',
  cls: 'soc-twitch',
  prefix: 'twitch.tv/',
  placeholder: 'channel'
}, {
  key: 'youtube',
  net: 'YouTube',
  icon: 'youtube',
  cls: 'soc-youtube',
  prefix: 'youtube.com/@',
  placeholder: 'handle'
}, {
  key: 'twitter',
  net: 'X / Twitter',
  icon: 'at-sign',
  cls: 'soc-twitter',
  prefix: 'x.com/',
  placeholder: 'handle'
}];

// the profile record (would come from the API; seeded from the logged-in user)
const INITIAL = {
  username: LOGIN_USERNAME,
  // Station login — locked
  email: 'hez@atlasvanguard.org',
  // locked
  ign: LOGIN_USERNAME,
  // in-game name — defaults to username
  firstName: 'Hez',
  lastName: 'Okonkwo',
  pronouns: 'he/him',
  rank: 'Leadership',
  primaryOrg: 'atlas',
  region: 'US-East · UTC−5',
  language: 'English, Igbo',
  phone: '+1 555 0142',
  presence: 'online',
  joined: '2952-03-14',
  ops: 142,
  hoursLogged: '1,284',
  bio: "Quartermaster for Atlas Vanguard. Eight years flying the 'verse — started solo mining quant in a Prospector, now I run multi-ship dragline ops in the Halo and keep the org's books straight.\n\nIf you fly with me: comms discipline, share your scans, and we all eat well. Always happy to train new miners.",
  socials: {
    discord: 'hezeqiah',
    rsi: 'hezeqiah',
    twitch: 'hez_mines',
    youtube: '',
    twitter: 'hez_sc'
  },
  socialVerified: {
    discord: true,
    rsi: true
  }
};

// orgs the member belongs to
const MY_ORGS = [{
  id: 'atlas',
  sid: 'ATLAS',
  name: 'Atlas Vanguard',
  role: 'Quartermaster · Leadership',
  members: 312,
  since: '2952',
  grad: 'linear-gradient(140deg, var(--aqua-400), var(--aqua-600))'
}, {
  id: 'crimson',
  sid: 'CRIM',
  name: 'Crimson Fleet',
  role: 'Member',
  members: 88,
  since: '2953',
  grad: 'linear-gradient(140deg, var(--coral-300), var(--coral-500))'
}, {
  id: 'halo',
  sid: 'HALO',
  name: 'Halo Miners Union',
  role: 'Affiliate',
  members: 540,
  since: '2953',
  grad: 'linear-gradient(140deg, var(--teal-300), var(--teal-500))'
}];
function ProfilePage() {
  const toast = window.__toast || (() => {});
  const [cur, setCur] = React.useState(INITIAL);
  const [draft, setDraft] = React.useState(INITIAL);
  const [editing, setEditing] = React.useState(false);
  const [pwOpen, setPwOpen] = React.useState(false);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const set = (k, v) => setDraft(d => ({
    ...d,
    [k]: v
  }));
  const setSoc = (k, v) => setDraft(d => ({
    ...d,
    socials: {
      ...d.socials,
      [k]: v
    }
  }));
  const startEdit = () => {
    setDraft(cur);
    setEditing(true);
  };
  const cancel = () => {
    setDraft(cur);
    setEditing(false);
  };
  const save = () => {
    // in-game name falls back to the login username if cleared
    const fixed = {
      ...draft,
      ign: (draft.ign || '').trim() || cur.username
    };
    setCur(fixed);
    setDraft(fixed);
    setEditing(false);
    toast('Profile saved', 'check');
  };

  // keyboard: e to edit, Esc to cancel
  React.useEffect(() => {
    const onKey = e => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape' && editing) {
          e.target.blur();
        }
        return;
      }
      if (e.key === 'e' && !editing && !pwOpen) {
        e.preventDefault();
        startEdit();
      }
      if (e.key === 'Escape' && editing && !pwOpen) {
        cancel();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [editing, pwOpen, cur]);
  const primaryOrg = MY_ORGS.find(o => o.id === (editing ? draft.primaryOrg : cur.primaryOrg)) || MY_ORGS[0];
  const fullName = [cur.firstName, cur.lastName].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "user-round"
  }), " Account ", /*#__PURE__*/React.createElement(PI, {
    n: "chevron-right"
  }), " My Profile"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "My Profile"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Your identity across Station \u2014 in-game name, bio, social connections, and the organizations you belong to. This is how the rest of the org sees you.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, editing ? /*#__PURE__*/React.createElement("div", {
    className: "pf-savebar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hint"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "circle-dot"
  }), " Unsaved changes"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: cancel
  }, "Cancel ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 4
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "Esc"))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: save
  }, /*#__PURE__*/React.createElement(PI, {
    n: "check"
  }), " Save changes")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "share-2"
  }), " Share profile"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    id: "pf-edit",
    onClick: startEdit
  }, /*#__PURE__*/React.createElement(PI, {
    n: "pencil"
  }), " Edit profile ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 6
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "e")))))), /*#__PURE__*/React.createElement("div", {
    className: "pf-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-av",
    style: {
      background: window.avColor(cur.username)
    }
  }, initials(cur.ign), /*#__PURE__*/React.createElement("span", {
    className: 'pres ' + cur.presence
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-name"
  }, cur.ign, " ", /*#__PURE__*/React.createElement("span", {
    className: 'rank ' + rankCls(cur.rank)
  }, cur.rank)), /*#__PURE__*/React.createElement("div", {
    className: "pf-handle"
  }, /*#__PURE__*/React.createElement("span", null, "@", cur.username), cur.pronouns && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, cur.pronouns)), fullName && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, fullName))), /*#__PURE__*/React.createElement("div", {
    className: "pf-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mi"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "shield"
  }), primaryOrg.name), /*#__PURE__*/React.createElement("span", {
    className: "mi"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "map-pin"
  }), cur.region), /*#__PURE__*/React.createElement("span", {
    className: "mi"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "languages"
  }), cur.language), /*#__PURE__*/React.createElement("span", {
    className: "mi"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "calendar"
  }), "Joined ", cur.joined.slice(0, 4))))), /*#__PURE__*/React.createElement("div", {
    className: "pf-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, cur.ops), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Ops attended")), /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, cur.hoursLogged), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Hours logged")), /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, MY_ORGS.length), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Organizations")), /*#__PURE__*/React.createElement("div", {
    className: "pf-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, new Date().getFullYear() + 930 - Number(cur.joined.slice(0, 4)), "y"), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Years in service")))), /*#__PURE__*/React.createElement("div", {
    className: "pf-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "file-text"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "About")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, editing ? /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "file-text"
  }), " Bio"), /*#__PURE__*/React.createElement("textarea", {
    value: draft.bio,
    maxLength: 600,
    onChange: e => set('bio', e.target.value),
    style: {
      minHeight: 150
    },
    placeholder: "Tell the org about yourself, your playstyle, and what you fly\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    className: "charcount"
  }, draft.bio.length, "/600")) : /*#__PURE__*/React.createElement("div", {
    className: 'pf-bio' + (cur.bio ? '' : ' empty')
  }, cur.bio || 'No bio yet. Click Edit profile to add one.'))), /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "id-card"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Identity & contact")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "gamepad-2"
  }), " In-game name (IGN)"), /*#__PURE__*/React.createElement("input", {
    value: draft.ign,
    onChange: e => set('ign', e.target.value),
    placeholder: cur.username
  }), /*#__PURE__*/React.createElement("div", {
    className: "charcount",
    style: {
      textAlign: 'left',
      marginTop: 5,
      fontStyle: 'italic'
    }
  }, "Defaults to your Station username \u201C", cur.username, "\u201D if left blank.")), /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "user"
  }), " First name"), /*#__PURE__*/React.createElement("input", {
    value: draft.firstName,
    onChange: e => set('firstName', e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "user"
  }), " Last name"), /*#__PURE__*/React.createElement("input", {
    value: draft.lastName,
    onChange: e => set('lastName', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "venetian-mask"
  }), " Pronouns"), /*#__PURE__*/React.createElement("input", {
    value: draft.pronouns,
    onChange: e => set('pronouns', e.target.value),
    placeholder: "he/him"
  })), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "phone"
  }), " Phone"), /*#__PURE__*/React.createElement("input", {
    value: draft.phone,
    onChange: e => set('phone', e.target.value),
    placeholder: "+1 555 0000"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "map-pin"
  }), " Region / timezone"), /*#__PURE__*/React.createElement("input", {
    value: draft.region,
    onChange: e => set('region', e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "languages"
  }), " Languages"), /*#__PURE__*/React.createElement("input", {
    value: draft.language,
    onChange: e => set('language', e.target.value)
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "gamepad-2"
  }), " In-game name"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, cur.ign)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "user"
  }), " Real name"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, fullName || '—')), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "venetian-mask"
  }), " Pronouns"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, cur.pronouns || '—')), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "map-pin"
  }), " Region"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, cur.region)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "languages"
  }), " Languages"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, cur.language)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "phone"
  }), " Phone"), /*#__PURE__*/React.createElement("span", {
    className: "v t-mono",
    style: {
      fontWeight: 400,
      color: 'var(--text-muted)'
    }
  }, cur.phone))))), /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "link"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Social connections")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, editing ? SOCIALS.map(s => /*#__PURE__*/React.createElement("div", {
    className: "soc-edit",
    key: s.key
  }, /*#__PURE__*/React.createElement("span", {
    className: 'soc-ic ' + s.cls
  }, /*#__PURE__*/React.createElement(PI, {
    n: s.icon
  })), /*#__PURE__*/React.createElement("input", {
    value: draft.socials[s.key] || '',
    onChange: e => setSoc(s.key, e.target.value),
    placeholder: s.net + ' — ' + s.placeholder,
    "aria-label": s.net
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "soc-list"
  }, SOCIALS.map(s => {
    const val = cur.socials[s.key];
    const verified = cur.socialVerified && cur.socialVerified[s.key];
    return /*#__PURE__*/React.createElement("div", {
      className: "soc-row",
      key: s.key
    }, /*#__PURE__*/React.createElement("span", {
      className: 'soc-ic ' + s.cls
    }, /*#__PURE__*/React.createElement(PI, {
      n: s.icon
    })), /*#__PURE__*/React.createElement("div", {
      className: "soc-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "soc-net"
    }, s.net, " ", verified && /*#__PURE__*/React.createElement("span", {
      className: "soc-verified"
    }, /*#__PURE__*/React.createElement(PI, {
      n: "badge-check"
    }), " verified")), /*#__PURE__*/React.createElement("div", {
      className: 'soc-val' + (val ? '' : ' empty')
    }, val ? s.prefix ? s.prefix + val : val : 'Not connected')), val && /*#__PURE__*/React.createElement("button", {
      className: "soc-go",
      "aria-label": 'Open ' + s.net
    }, /*#__PURE__*/React.createElement(PI, {
      n: "external-link"
    })));
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "users"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Organizations"), /*#__PURE__*/React.createElement("span", {
    className: "t-mono t-muted",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, MY_ORGS.length)), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, MY_ORGS.map(o => {
    const isPrimary = o.id === (editing ? draft.primaryOrg : cur.primaryOrg);
    return /*#__PURE__*/React.createElement("div", {
      className: 'org-card' + (isPrimary ? ' primary' : ''),
      key: o.id
    }, /*#__PURE__*/React.createElement("span", {
      className: "org-logo",
      style: {
        background: o.grad
      }
    }, o.sid.slice(0, 2)), /*#__PURE__*/React.createElement("div", {
      className: "org-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "org-nm"
    }, o.name, " ", isPrimary && /*#__PURE__*/React.createElement("span", {
      className: "org-primary-badge"
    }, "Primary")), /*#__PURE__*/React.createElement("div", {
      className: "org-meta"
    }, /*#__PURE__*/React.createElement("span", null, o.role), /*#__PURE__*/React.createElement("span", {
      className: "sep"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, o.members, " members"), /*#__PURE__*/React.createElement("span", {
      className: "sep"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "since ", o.since))), editing && !isPrimary && /*#__PURE__*/React.createElement("button", {
      className: "org-leave",
      title: "Set as primary",
      "aria-label": 'Set ' + o.name + ' as primary',
      onClick: () => set('primaryOrg', o.id)
    }, /*#__PURE__*/React.createElement(PI, {
      n: "star"
    })));
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      width: '100%',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(PI, {
    n: "plus"
  }), " Find organizations"))), /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "shield-check"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Account & security")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "at-sign"
  }), " Station username"), /*#__PURE__*/React.createElement("div", {
    className: "locked-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lv"
  }, cur.username), /*#__PURE__*/React.createElement("span", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "lock"
  }), " Permanent"))), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "mail"
  }), " Email"), /*#__PURE__*/React.createElement("div", {
    className: "locked-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lv"
  }, cur.email), /*#__PURE__*/React.createElement("span", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "lock"
  }), " Verified"))), !pwOpen ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      width: '100%'
    },
    onClick: () => setPwOpen(true)
  }, /*#__PURE__*/React.createElement(PI, {
    n: "key-round"
  }), " Change password") : /*#__PURE__*/React.createElement(PasswordForm, {
    onClose: () => setPwOpen(false),
    onSave: () => {
      setPwOpen(false);
      toast('Password changed', 'shield-check');
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sec-note"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "info"
  }), " Your username and email are tied to your Station account and can't be changed here. Contact an org admin for account recovery."))))));
}

// ---- inline change-password ----
function PasswordForm({
  onClose,
  onSave
}) {
  const [cu, setCu] = React.useState('');
  const [nu, setNu] = React.useState('');
  const [cf, setCf] = React.useState('');
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const tooShort = nu && nu.length < 6;
  const mismatch = cf && nu !== cf;
  const ready = cu && nu.length >= 6 && nu === cf;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "lock"
  }), " Current password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: cu,
    onChange: e => setCu(e.target.value),
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "key-round"
  }), " New password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: nu,
    onChange: e => setNu(e.target.value)
  }), tooShort && /*#__PURE__*/React.createElement("div", {
    className: "charcount",
    style: {
      textAlign: 'left',
      color: 'var(--coral-400)'
    }
  }, "At least 6 characters")), /*#__PURE__*/React.createElement("div", {
    className: "fctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl"
  }, /*#__PURE__*/React.createElement(PI, {
    n: "key-round"
  }), " Confirm new password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: cf,
    onChange: e => setCf(e.target.value)
  }), mismatch && /*#__PURE__*/React.createElement("div", {
    className: "charcount",
    style: {
      textAlign: 'left',
      color: 'var(--coral-400)'
    }
  }, "Passwords don't match")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      flex: 1
    },
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      flex: 1
    },
    disabled: !ready,
    onClick: onSave
  }, /*#__PURE__*/React.createElement(PI, {
    n: "check"
  }), " Update password")));
}
function ProfileApp() {
  const commands = [{
    id: 'pf-edit',
    group: 'Profile',
    icon: 'pencil',
    label: 'Edit profile',
    hint: 'e',
    run: () => {
      const b = document.getElementById('pf-edit');
      if (b) b.click();
    }
  }, {
    id: 'pf-pw',
    group: 'Profile',
    icon: 'key-round',
    label: 'Change password',
    run: () => window.__toast && window.__toast('Open Account & security to change password', 'key-round')
  }, {
    id: 'pf-share',
    group: 'Profile',
    icon: 'share-2',
    label: 'Share profile link',
    run: () => window.__toast && window.__toast('Profile link copied', 'link')
  }];
  const helpExtra = [['Edit profile', ['e']], ['Cancel edit', ['Esc']], ['Command palette', ['⌘', 'K']], ['Toggle theme', ['t']]];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: "profile",
    commands: commands,
    helpExtra: helpExtra,
    onNew: () => {
      const b = document.getElementById('pf-edit');
      if (b) b.click();
    },
    searchPlaceholder: "Search Station\u2026"
  }, /*#__PURE__*/React.createElement(ProfilePage, null));
}
window.ProfileApp = ProfileApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/Profile.jsx", error: String((e && e.message) || e) }); }

// app/Treasury.jsx
try { (() => {
// ============================================================
// Station — Treasury page
// Multiple accounts (main org, division, funds), each with its own
// ledger and currency (aUEC or merits). Add accounts & transactions.
// Keyboard-first on the shared app shell.
// ============================================================

const TI = window.StationIcon;

// ---- currency ----
const CURRENCY = {
  aUEC: {
    label: 'aUEC',
    icon: 'coins',
    cls: 'auec',
    sub: 'Alpha United Earth Credits'
  },
  merits: {
    label: 'merits',
    icon: 'gavel',
    cls: 'merits',
    sub: 'Prison currency (Klescher)'
  }
};
const money = n => Math.round(Math.abs(n)).toLocaleString('en-US');
const moneySigned = n => (n >= 0 ? '+' : '−') + money(n);
const abbr = n => {
  const a = Math.abs(n);
  return a >= 1e6 ? (a / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M' : a >= 1e3 ? (a / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : String(Math.round(a));
};

// ---- categories ----
const CAT = {
  mining: {
    label: 'Mining payout',
    color: 'var(--aqua-400)',
    dir: 'in'
  },
  contract: {
    label: 'Contract reward',
    color: 'var(--warning-500)',
    dir: 'in'
  },
  salvage: {
    label: 'Salvage sale',
    color: '#C879D8',
    dir: 'in'
  },
  trade: {
    label: 'Trade profit',
    color: 'var(--success-500)',
    dir: 'in'
  },
  dues: {
    label: 'Member dues',
    color: 'var(--teal-400)',
    dir: 'in'
  },
  donation: {
    label: 'Donation',
    color: 'var(--success-500)',
    dir: 'in'
  },
  ship: {
    label: 'Ship purchase',
    color: 'var(--coral-400)',
    dir: 'out'
  },
  fees: {
    label: 'Refinery fees',
    color: 'var(--coral-400)',
    dir: 'out'
  },
  payout: {
    label: 'Member payout',
    color: 'var(--coral-400)',
    dir: 'out'
  },
  repair: {
    label: 'Repairs',
    color: 'var(--coral-400)',
    dir: 'out'
  },
  bail: {
    label: 'Bail posted',
    color: '#D9A6E6',
    dir: 'out'
  },
  fine: {
    label: 'Fine / penalty',
    color: 'var(--coral-400)',
    dir: 'out'
  },
  bounty: {
    label: 'Bounty earned',
    color: 'var(--success-500)',
    dir: 'in'
  },
  transfer: {
    label: 'Transfer',
    color: 'var(--teal-300)',
    dir: 'xfer'
  }
};

// ---- accounts ----
const ACCOUNTS = [{
  id: 'main',
  name: 'Main Treasury',
  type: 'main',
  typeLabel: 'Primary org account',
  currency: 'aUEC',
  icon: 'landmark',
  tint: 'acct-main',
  lead: 'hezeqiah',
  desc: 'The org\'s primary operating account. All division accounts roll up here.'
}, {
  id: 'mining',
  name: 'Mining Division',
  type: 'division',
  typeLabel: 'Division account',
  currency: 'aUEC',
  icon: 'gem',
  tint: 'acct-division',
  lead: 'Vesper Calderon',
  desc: 'Funds mining ops, refinery fees, and crew payouts for the mining division.'
}, {
  id: 'security',
  name: 'Security Division',
  type: 'division',
  typeLabel: 'Division account',
  currency: 'aUEC',
  icon: 'crosshair',
  tint: 'acct-division',
  lead: 'Dax Moreno',
  desc: 'Combat ops budget — escorts, bounties, and gear for the security wing.'
}, {
  id: 'bail',
  name: 'Bail & Legal Fund',
  type: 'fund',
  typeLabel: 'Merits fund',
  currency: 'merits',
  icon: 'scale',
  tint: 'acct-merits',
  lead: 'Sable Quinn',
  desc: 'Klescher prison merits pooled to bail out members and pay fines.'
}, {
  id: 'events',
  name: 'Events & Recruitment',
  type: 'fund',
  typeLabel: 'Reserve fund',
  currency: 'aUEC',
  icon: 'party-popper',
  tint: 'acct-fund',
  lead: 'Iris Tanaka',
  desc: 'Prize pools, giveaways, and recruitment drives.'
}];

// ---- ledgers (newest first); running balance computed from current balance) ----
const LEDGERS = {
  main: [{
    id: 1,
    date: '2954-01-12',
    t: '14:20',
    desc: 'Quantanium contract settled',
    cat: 'contract',
    member: 'Iris Tanaka',
    amount: 285000
  }, {
    id: 2,
    date: '2954-01-12',
    t: '09:05',
    desc: 'Mining division rollup',
    cat: 'transfer',
    member: 'Vesper Calderon',
    amount: 420000
  }, {
    id: 3,
    date: '2954-01-11',
    t: '22:48',
    desc: 'Hammerhead ammunition restock',
    cat: 'repair',
    member: 'Dax Moreno',
    amount: -64000
  }, {
    id: 4,
    date: '2954-01-11',
    t: '18:30',
    desc: 'Salvage haul — Yela wrecks',
    cat: 'salvage',
    member: 'Kova Rhys',
    amount: 240000
  }, {
    id: 5,
    date: '2954-01-10',
    t: '15:12',
    desc: 'Polaris hull repair',
    cat: 'repair',
    member: 'hezeqiah',
    amount: -88000
  }, {
    id: 6,
    date: '2954-01-10',
    t: '11:00',
    desc: 'Member dues — Jan cycle',
    cat: 'dues',
    member: '34 members',
    amount: 170000
  }, {
    id: 7,
    date: '2954-01-09',
    t: '20:15',
    desc: 'A2 Hercules acquisition',
    cat: 'ship',
    member: 'hezeqiah',
    amount: -2100000
  }, {
    id: 8,
    date: '2954-01-09',
    t: '08:40',
    desc: 'Trade run — medical supplies',
    cat: 'trade',
    member: 'Iris Tanaka',
    amount: 96000
  }],
  mining: [{
    id: 1,
    date: '2954-01-12',
    t: '13:00',
    desc: 'Aaron Halo session payout',
    cat: 'mining',
    member: 'hezeqiah',
    amount: 312000
  }, {
    id: 2,
    date: '2954-01-12',
    t: '09:05',
    desc: 'Rollup to Main Treasury',
    cat: 'transfer',
    member: 'Vesper Calderon',
    amount: -420000
  }, {
    id: 3,
    date: '2954-01-11',
    t: '16:22',
    desc: 'ARC-L1 refinery fees',
    cat: 'fees',
    member: 'Vesper Calderon',
    amount: -24600
  }, {
    id: 4,
    date: '2954-01-11',
    t: '10:10',
    desc: 'Lyria Laranite sale',
    cat: 'mining',
    member: 'Bram Holloway',
    amount: 134000
  }, {
    id: 5,
    date: '2954-01-10',
    t: '14:45',
    desc: 'Crew payout — Day 2',
    cat: 'payout',
    member: '5 crew',
    amount: -180000
  }],
  security: [{
    id: 1,
    date: '2954-01-12',
    t: '19:30',
    desc: 'Nine Tails bounty cleared',
    cat: 'bounty',
    member: 'Talia Vance',
    amount: 145000
  }, {
    id: 2,
    date: '2954-01-11',
    t: '21:00',
    desc: 'Escort contract — mining op',
    cat: 'contract',
    member: 'Dax Moreno',
    amount: 180000
  }, {
    id: 3,
    date: '2954-01-11',
    t: '12:15',
    desc: 'Ballistic ammo + medpens',
    cat: 'repair',
    member: 'Dax Moreno',
    amount: -38000
  }, {
    id: 4,
    date: '2954-01-10',
    t: '17:40',
    desc: 'Gladius component upgrade',
    cat: 'ship',
    member: 'Talia Vance',
    amount: -72000
  }],
  bail: [{
    id: 1,
    date: '2954-01-12',
    t: '02:10',
    desc: 'Bailed out — Orin (Klescher)',
    cat: 'bail',
    member: 'Orin Pell',
    amount: -25000
  }, {
    id: 2,
    date: '2954-01-11',
    t: '23:55',
    desc: 'Merits pooled from members',
    cat: 'donation',
    member: '7 members',
    amount: 42000
  }, {
    id: 3,
    date: '2954-01-10',
    t: '08:00',
    desc: 'Fine settled — contraband',
    cat: 'fine',
    member: 'Kova Rhys',
    amount: -8000
  }, {
    id: 4,
    date: '2954-01-09',
    t: '14:30',
    desc: 'Merits earned — prison labor',
    cat: 'donation',
    member: 'Bram Holloway',
    amount: 16500
  }],
  events: [{
    id: 1,
    date: '2954-01-12',
    t: '12:00',
    desc: 'Recruitment drive prize pool',
    cat: 'payout',
    member: 'Iris Tanaka',
    amount: -150000
  }, {
    id: 2,
    date: '2954-01-10',
    t: '19:00',
    desc: 'Org donation drive',
    cat: 'donation',
    member: '12 members',
    amount: 280000
  }, {
    id: 3,
    date: '2954-01-08',
    t: '16:20',
    desc: 'Racing event entry fees',
    cat: 'dues',
    member: '8 members',
    amount: 64000
  }]
};

// derive current balance from ledger sum + a base, so running balances are consistent
const balanceOf = id => (LEDGERS[id] || []).reduce((s, x) => s + x.amount, 0) + ({
  main: 4200000,
  mining: 540000,
  security: 410000,
  bail: 31500,
  events: 194000
}[id] || 0);
function CurBadge({
  currency
}) {
  const c = CURRENCY[currency];
  return /*#__PURE__*/React.createElement("span", {
    className: 'cur-badge ' + c.cls
  }, /*#__PURE__*/React.createElement(TI, {
    n: c.icon
  }), c.label);
}

// ---- account card ----
function AcctCard({
  a,
  balance,
  active,
  onSelect
}) {
  const spark = [40, 55, 48, 70, 62, 85, 78, 96];
  return /*#__PURE__*/React.createElement("button", {
    className: 'acct-card' + (active ? ' active' : ''),
    onClick: onSelect,
    "aria-pressed": active
  }, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + a.tint
  }, /*#__PURE__*/React.createElement(TI, {
    n: a.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, a.name), /*#__PURE__*/React.createElement("div", {
    className: "ty"
  }, a.typeLabel))), /*#__PURE__*/React.createElement("div", {
    className: "bal"
  }, abbr(balance), /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, CURRENCY[a.currency].label)), /*#__PURE__*/React.createElement("div", {
    className: "spark"
  }, spark.map((h, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: h + '%',
      background: active ? 'var(--brand)' : undefined
    }
  }))));
}

// ---- ledger row ----
function LedgerRow({
  tx,
  currency,
  running,
  tabIndex,
  regRef,
  onFocus,
  selected
}) {
  const cat = CAT[tx.cat];
  const dir = cat.dir;
  const icCls = dir === 'in' ? 'in' : dir === 'out' ? 'out' : 'xfer';
  const icName = dir === 'in' ? 'arrow-down-left' : dir === 'out' ? 'arrow-up-right' : 'arrow-left-right';
  return /*#__PURE__*/React.createElement("tr", {
    ref: regRef,
    tabIndex: tabIndex,
    "aria-selected": selected,
    onFocus: onFocus
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "t-ent"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'led-ic ' + icCls
  }, /*#__PURE__*/React.createElement(TI, {
    n: icName
  })), /*#__PURE__*/React.createElement("div", {
    className: "led-desc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, tx.desc), /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, tx.member)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "led-cat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cdot",
    style: {
      background: cat.color
    }
  }), cat.label)), /*#__PURE__*/React.createElement("td", {
    className: "t-muted t-mono",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, tx.date.slice(5), " \xB7 ", tx.t), /*#__PURE__*/React.createElement("td", {
    className: 'amt ' + (tx.amount >= 0 ? 'pos' : 'neg')
  }, moneySigned(tx.amount)), /*#__PURE__*/React.createElement("td", {
    className: "run"
  }, money(running)));
}
function TreasuryPage() {
  const toast = window.__toast || (() => {});
  const [accounts, setAccounts] = React.useState(ACCOUNTS);
  const [ledgers, setLedgers] = React.useState(LEDGERS);
  const [balances, setBalances] = React.useState(() => Object.fromEntries(ACCOUNTS.map(a => [a.id, balanceOf(a.id)])));
  const [selId, setSelId] = React.useState('main');
  const [search, setSearch] = React.useState('');
  const [dialog, setDialog] = React.useState(null); // 'tx' | 'account'
  const sel = accounts.find(a => a.id === selId);
  const ledger = ledgers[selId] || [];
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // running balances: start at current balance, walk down (newest first)
  const rows = React.useMemo(() => {
    const filtered = ledger.filter(tx => !search || tx.desc.toLowerCase().includes(search.toLowerCase()) || tx.member.toLowerCase().includes(search.toLowerCase()) || CAT[tx.cat].label.toLowerCase().includes(search.toLowerCase()));
    let run = balances[selId];
    // compute running for the full ledger first
    const fullRun = {};
    let r = balances[selId];
    for (const tx of ledger) {
      fullRun[tx.id] = r;
      r -= tx.amount;
    }
    return filtered.map(tx => ({
      tx,
      running: fullRun[tx.id]
    }));
  }, [ledger, search, balances, selId]);
  const roving = window.useRoving(rows.length, {});
  React.useEffect(() => {
    roving.setIdx(0);
  }, [selId]);

  // cycle stats
  const income = ledger.filter(t => t.amount > 0 && CAT[t.cat].dir !== 'xfer').reduce((s, t) => s + t.amount, 0);
  const expense = ledger.filter(t => t.amount < 0 && CAT[t.cat].dir !== 'xfer').reduce((s, t) => s + Math.abs(t.amount), 0);
  const curLabel = CURRENCY[sel.currency].label;
  const addTx = tx => {
    const id = Math.max(0, ...ledger.map(x => x.id)) + 1;
    const signed = tx.dir === 'out' ? -Math.abs(tx.amount) : Math.abs(tx.amount);
    setLedgers(L => ({
      ...L,
      [selId]: [{
        id,
        date: '2954-01-12',
        t: 'now',
        desc: tx.desc,
        cat: tx.cat,
        member: tx.member || sel.lead,
        amount: signed
      }, ...(L[selId] || [])]
    }));
    setBalances(b => ({
      ...b,
      [selId]: b[selId] + signed
    }));
    toast('Transaction recorded', 'check');
    setDialog(null);
  };
  const addAccount = acc => {
    const id = 'acct-' + Date.now();
    const tintByType = {
      division: 'acct-division',
      fund: acc.currency === 'merits' ? 'acct-merits' : 'acct-fund',
      main: 'acct-main'
    };
    const a = {
      id,
      name: acc.name,
      type: acc.type,
      typeLabel: acc.type === 'division' ? 'Division account' : acc.currency === 'merits' ? 'Merits fund' : 'Reserve fund',
      currency: acc.currency,
      icon: acc.type === 'division' ? 'git-branch' : acc.currency === 'merits' ? 'scale' : 'piggy-bank',
      tint: tintByType[acc.type],
      lead: 'hezeqiah',
      desc: acc.desc || 'New account.'
    };
    setAccounts(arr => [...arr, a]);
    setLedgers(L => ({
      ...L,
      [id]: []
    }));
    setBalances(b => ({
      ...b,
      [id]: Number(acc.starting) || 0
    }));
    setSelId(id);
    toast('Account created: ' + acc.name, 'check');
    setDialog(null);
  };
  const totalAUEC = accounts.filter(a => a.currency === 'aUEC').reduce((s, a) => s + balances[a.id], 0);
  const totalMerits = accounts.filter(a => a.currency === 'merits').reduce((s, a) => s + balances[a.id], 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "landmark"
  }), " Assets ", /*#__PURE__*/React.createElement(TI, {
    n: "chevron-right"
  }), " Treasury"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Treasury"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Track the org's accounts and ledgers \u2014 a main treasury plus division accounts and funds, each in its own currency. Record income, expenses, and transfers.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setDialog('account')
  }, /*#__PURE__*/React.createElement(TI, {
    n: "plus"
  }), " New account"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    id: "trez-new",
    onClick: () => setDialog('tx')
  }, /*#__PURE__*/React.createElement(TI, {
    n: "arrow-left-right"
  }), " New transaction ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 6
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement(StatStrip, {
    items: [{
      k: 'Total holdings',
      icon: 'wallet',
      v: abbr(totalAUEC),
      unit: 'aUEC',
      d: accounts.filter(a => a.currency === 'aUEC').length + ' aUEC accounts'
    }, {
      k: 'Merits pool',
      icon: 'gavel',
      v: abbr(totalMerits),
      unit: 'merits',
      d: 'bail & legal fund'
    }, {
      k: 'Accounts',
      icon: 'layers',
      v: accounts.length,
      d: 'across the org'
    }, {
      k: 'Selected balance',
      icon: sel.icon,
      v: abbr(balances[selId]),
      unit: curLabel,
      d: sel.name
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "acct-strip"
  }, accounts.map(a => /*#__PURE__*/React.createElement(AcctCard, {
    key: a.id,
    a: a,
    balance: balances[a.id],
    active: a.id === selId,
    onSelect: () => setSelId(a.id)
  })), /*#__PURE__*/React.createElement("button", {
    className: "acct-add",
    onClick: () => setDialog('account')
  }, /*#__PURE__*/React.createElement("span", {
    className: "pl"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "plus"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Add account"))), /*#__PURE__*/React.createElement("div", {
    className: "acct-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'big-ic ' + sel.tint
  }, /*#__PURE__*/React.createElement(TI, {
    n: sel.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, sel.name, " ", /*#__PURE__*/React.createElement(CurBadge, {
    currency: sel.currency
  })), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, sel.desc, " \xB7 Managed by ", sel.lead)), /*#__PURE__*/React.createElement("div", {
    className: "bal-big"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Current balance"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, money(balances[selId]), /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, curLabel)))), /*#__PURE__*/React.createElement(StatStrip, {
    items: [{
      k: 'Income (cycle)',
      icon: 'trending-up',
      v: abbr(income),
      unit: curLabel,
      d: 'deposits this cycle',
      tone: 'up'
    }, {
      k: 'Expenses (cycle)',
      icon: 'trending-down',
      v: abbr(expense),
      unit: curLabel,
      d: 'withdrawals this cycle',
      tone: 'warn'
    }, {
      k: 'Net flow',
      icon: 'activity',
      v: (income - expense >= 0 ? '+' : '−') + abbr(income - expense),
      unit: curLabel,
      d: 'cycle net',
      tone: income - expense >= 0 ? 'up' : 'warn'
    }, {
      k: 'Entries',
      icon: 'receipt',
      v: ledger.length,
      d: 'ledger transactions'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "ledger-toolbar"
  }, /*#__PURE__*/React.createElement("label", {
    className: "inv-search"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "search"
  }), /*#__PURE__*/React.createElement("input", {
    value: search,
    placeholder: "Search ledger\u2026",
    onChange: e => setSearch(e.target.value),
    "aria-label": "Search ledger"
  })), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "filter"
  }), " All categories"), /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "download"
  }), " Export CSV"))), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ledger-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "e-ic"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "receipt"
  })), /*#__PURE__*/React.createElement("h3", null, search ? 'No entries match your search' : 'No transactions yet'), /*#__PURE__*/React.createElement("p", null, search ? 'Try a different term.' : 'Record income, an expense, or a transfer to start this ledger.'))) : /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "dtable led-table",
    role: "grid",
    "aria-label": sel.name + ' ledger',
    onKeyDown: roving.onKeyDown
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Transaction"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Amount"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Balance"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(({
    tx,
    running
  }, i) => /*#__PURE__*/React.createElement(LedgerRow, {
    key: tx.id,
    tx: tx,
    currency: sel.currency,
    running: running,
    tabIndex: roving.getTab(i),
    regRef: roving.register(i),
    onFocus: () => roving.setIdx(i),
    selected: roving.idx === i
  })))), /*#__PURE__*/React.createElement("div", {
    className: "list-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " move", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "n")), " new transaction", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, rows.length, " of ", ledger.length, " entries \xB7 all amounts in ", curLabel))), dialog === 'tx' && /*#__PURE__*/React.createElement(TxDialog, {
    account: sel,
    onClose: () => setDialog(null),
    onSave: addTx
  }), dialog === 'account' && /*#__PURE__*/React.createElement(AccountDialog, {
    onClose: () => setDialog(null),
    onSave: addAccount
  }));
}

// ---- new transaction dialog ----
function TxDialog({
  account,
  onClose,
  onSave
}) {
  const [dir, setDir] = React.useState('in');
  const [amount, setAmount] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [cat, setCat] = React.useState('contract');
  const [member, setMember] = React.useState('');
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [dir]);
  const cats = Object.entries(CAT).filter(([, c]) => dir === 'xfer' ? c.dir === 'xfer' : c.dir === dir || dir === 'in' && c.dir === 'in' || dir === 'out' && c.dir === 'out');
  const ready = Number(amount) > 0 && desc.trim();
  const cur = CURRENCY[account.currency].label;
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onMouseDown: onClose,
    onKeyDown: e => {
      if (e.key === 'Escape') onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop",
    style: {
      marginTop: '11vh',
      width: 'min(440px, 94vw)'
    },
    onMouseDown: e => e.stopPropagation(),
    role: "dialog",
    "aria-label": "New transaction"
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "arrow-left-right"
  })), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "New transaction \xB7 ", account.name), /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "act-pop-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg-pills",
    role: "group",
    "aria-label": "Direction"
  }, /*#__PURE__*/React.createElement("button", {
    className: "seg-pill",
    "aria-pressed": dir === 'in',
    onClick: () => {
      setDir('in');
      setCat('contract');
    }
  }, /*#__PURE__*/React.createElement(TI, {
    n: "arrow-down-left"
  }), " Income"), /*#__PURE__*/React.createElement("button", {
    className: "seg-pill",
    "aria-pressed": dir === 'out',
    onClick: () => {
      setDir('out');
      setCat('payout');
    }
  }, /*#__PURE__*/React.createElement(TI, {
    n: "arrow-up-right"
  }), " Expense"), /*#__PURE__*/React.createElement("button", {
    className: "seg-pill",
    "aria-pressed": dir === 'xfer',
    onClick: () => {
      setDir('xfer');
      setCat('transfer');
    }
  }, /*#__PURE__*/React.createElement(TI, {
    n: "arrow-left-right"
  }), " Transfer")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Amount (", cur, ")"), /*#__PURE__*/React.createElement("input", {
    className: "field-in mono",
    value: amount,
    onChange: e => setAmount(e.target.value),
    placeholder: "0",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Description"), /*#__PURE__*/React.createElement("input", {
    className: "field-in",
    value: desc,
    onChange: e => setDesc(e.target.value),
    placeholder: "What was this for?"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Category"), /*#__PURE__*/React.createElement("span", {
    className: "inv-select",
    style: {
      width: '100%',
      height: 40
    }
  }, /*#__PURE__*/React.createElement(TI, {
    n: "tag",
    className: "lead"
  }), /*#__PURE__*/React.createElement("select", {
    value: cat,
    onChange: e => setCat(e.target.value),
    style: {
      flex: 1
    }
  }, cats.map(([k, c]) => /*#__PURE__*/React.createElement("option", {
    key: k,
    value: k
  }, c.label))), /*#__PURE__*/React.createElement(TI, {
    n: "chevron-down",
    className: "chev"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Member / counterparty"), /*#__PURE__*/React.createElement("input", {
    className: "field-in",
    value: member,
    onChange: e => setMember(e.target.value),
    placeholder: account.lead
  }))), /*#__PURE__*/React.createElement("div", {
    className: "act-pop-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    disabled: !ready,
    onClick: () => onSave({
      dir,
      amount: Number(amount),
      desc,
      cat,
      member
    })
  }, /*#__PURE__*/React.createElement(TI, {
    n: "check"
  }), " Record"))));
}

// ---- new account dialog ----
function AccountDialog({
  onClose,
  onSave
}) {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('division');
  const [currency, setCurrency] = React.useState('aUEC');
  const [starting, setStarting] = React.useState('0');
  const [desc, setDesc] = React.useState('');
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [type, currency]);
  const ready = name.trim();
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onMouseDown: onClose,
    onKeyDown: e => {
      if (e.key === 'Escape') onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop",
    style: {
      marginTop: '9vh',
      width: 'min(460px, 94vw)'
    },
    onMouseDown: e => e.stopPropagation(),
    role: "dialog",
    "aria-label": "New account"
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "landmark"
  })), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "New account"), /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "act-pop-body"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Account name"), /*#__PURE__*/React.createElement("input", {
    className: "field-in",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g. Salvage Division",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Account type"), /*#__PURE__*/React.createElement("div", {
    className: "type-grid",
    role: "group",
    "aria-label": "Account type"
  }, /*#__PURE__*/React.createElement("button", {
    className: "type-opt",
    "aria-pressed": type === 'division',
    onClick: () => setType('division')
  }, /*#__PURE__*/React.createElement(TI, {
    n: "git-branch"
  }), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Division")), /*#__PURE__*/React.createElement("button", {
    className: "type-opt",
    "aria-pressed": type === 'fund',
    onClick: () => setType('fund')
  }, /*#__PURE__*/React.createElement(TI, {
    n: "piggy-bank"
  }), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Fund")), /*#__PURE__*/React.createElement("button", {
    className: "type-opt",
    "aria-pressed": type === 'main',
    onClick: () => setType('main')
  }, /*#__PURE__*/React.createElement(TI, {
    n: "landmark"
  }), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Operating")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Currency"), /*#__PURE__*/React.createElement("div", {
    className: "cur-choice",
    role: "group",
    "aria-label": "Currency"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cur-opt",
    "aria-pressed": currency === 'aUEC',
    onClick: () => setCurrency('aUEC')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ci acct-main"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "coins"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, "aUEC"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Standard credits"))), /*#__PURE__*/React.createElement("button", {
    className: "cur-opt",
    "aria-pressed": currency === 'merits',
    onClick: () => setCurrency('merits')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ci acct-merits"
  }, /*#__PURE__*/React.createElement(TI, {
    n: "gavel"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, "merits"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Prison currency"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Starting balance (", CURRENCY[currency].label, ")"), /*#__PURE__*/React.createElement("input", {
    className: "field-in mono",
    value: starting,
    onChange: e => setStarting(e.target.value),
    placeholder: "0"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-lbl"
  }, "Description (optional)"), /*#__PURE__*/React.createElement("input", {
    className: "field-in",
    value: desc,
    onChange: e => setDesc(e.target.value),
    placeholder: "What is this account for?"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "act-pop-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    disabled: !ready,
    onClick: () => onSave({
      name,
      type,
      currency,
      starting,
      desc
    })
  }, /*#__PURE__*/React.createElement(TI, {
    n: "check"
  }), " Create account"))));
}
function TreasuryApp() {
  const commands = [{
    id: 'trez-tx',
    group: 'Treasury',
    icon: 'arrow-left-right',
    label: 'New transaction',
    hint: 'n',
    run: () => {
      const b = document.getElementById('trez-new');
      if (b) b.click();
    }
  }, {
    id: 'trez-acct',
    group: 'Treasury',
    icon: 'plus',
    label: 'New account',
    run: () => window.__toast && window.__toast('New account')
  }, {
    id: 'trez-export',
    group: 'Treasury',
    icon: 'download',
    label: 'Export ledger (CSV)',
    run: () => window.__toast && window.__toast('Ledger exported', 'download')
  }];
  const helpExtra = [['New transaction', ['n']], ['Move ledger', ['↑', '↓']], ['Toggle theme', ['t']], ['Command palette', ['⌘', 'K']]];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: "treasury",
    commands: commands,
    helpExtra: helpExtra,
    onNew: () => {
      const b = document.getElementById('trez-new');
      if (b) b.click();
    },
    searchPlaceholder: "Search accounts, ledger\u2026"
  }, /*#__PURE__*/React.createElement(TreasuryPage, null));
}
window.TreasuryApp = TreasuryApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/Treasury.jsx", error: String((e && e.message) || e) }); }

// app/WorkOrders.jsx
try { (() => {
// ============================================================
// Station — Work Orders page (v2)
// A work order is a JOB that may involve MANY ships feeding one
// refinery batch + crew-share split. Two views:
//   • LIST  — top stats aggregate over a PERIOD (session / 7d / 30d)
//   • ACTIVE (drill-in) — top stats scoped to ONE work order, plus
//     the ships participating, refinery, ore, expenses, crew shares.
// Keyboard-first: roving list, Enter drills in, Esc steps back, n = new.
// ============================================================

const I = window.StationIcon;

// ---- ore reference (aUEC per refined SCU, plausible 4.x values) ----
const ORE = {
  Quantanium: {
    price: 26800,
    color: '#5BD6B0'
  },
  Bexalite: {
    price: 17400,
    color: '#7CBEF9'
  },
  Taranite: {
    price: 16100,
    color: '#C879D8'
  },
  Gold: {
    price: 12300,
    color: '#E0B23A'
  },
  Laranite: {
    price: 6300,
    color: '#9AA7B2'
  },
  Agricium: {
    price: 5800,
    color: '#B6E3D4'
  },
  Hephaestanite: {
    price: 5300,
    color: '#E0913A'
  },
  Titanium: {
    price: 1900,
    color: '#8FA0AE'
  },
  Tungsten: {
    price: 1500,
    color: '#6E7BF2'
  },
  Iron: {
    price: 1100,
    color: '#C2724B'
  },
  RMC: {
    price: 12100,
    color: '#5BD6B0'
  },
  CMAT: {
    price: 1800,
    color: '#9AA7B2'
  }
};
const oreColor = n => ORE[n] && ORE[n].color || '#9AA7B2';
const TYPE = {
  ship: {
    icon: 'gem',
    label: 'Ship Mining',
    cls: 'ship',
    shipIcon: 'gem'
  },
  vehicle: {
    icon: 'car',
    label: 'Vehicle (ROC)',
    cls: 'vehicle',
    shipIcon: 'car'
  },
  salvage: {
    icon: 'recycle',
    label: 'Salvage',
    cls: 'salvage',
    shipIcon: 'recycle'
  }
};
const STATUS = {
  refining: {
    tone: 'warn',
    icon: 'loader',
    label: 'Refining'
  },
  refined: {
    tone: 'info',
    icon: 'package-check',
    label: 'Refined'
  },
  sold: {
    tone: 'success',
    icon: 'badge-check',
    label: 'Sold'
  },
  pending: {
    tone: 'neutral',
    icon: 'circle-dashed',
    label: 'Pending'
  },
  failed: {
    tone: 'danger',
    icon: 'circle-x',
    label: 'Failed'
  }
};
const tintFor = type => ({
  ship: {
    background: 'color-mix(in srgb, var(--aqua-400) 18%, transparent)',
    color: 'var(--aqua-300)'
  },
  vehicle: {
    background: 'color-mix(in srgb, var(--teal-400) 18%, transparent)',
    color: 'var(--teal-300)'
  },
  salvage: {
    background: 'color-mix(in srgb, #C879D8 20%, transparent)',
    color: '#D9A6E6'
  }
})[type];

// ---- work orders (each can hold MANY ships) ----
const ORDERS = [{
  id: 'WO-3041',
  title: 'Aaron Halo dragline',
  type: 'ship',
  status: 'refining',
  loc: 'Aaron Halo · Cluster 7',
  daysAgo: 0,
  session: true,
  refinery: 'ARC-L1 · Refinery',
  method: 'Dinyx Solventation',
  yield: 78,
  progress: 0.64,
  timeLeft: '1h 12m',
  ships: [{
    ship: 'MISC Mole',
    op: 'hezeqiah',
    scu: 96
  }, {
    ship: 'MISC Mole',
    op: 'Vesper Calderon',
    scu: 88
  }, {
    ship: 'MISC Prospector',
    op: 'Iris Tanaka',
    scu: 32
  }],
  ores: [['Quantanium', 132, 103], ['Taranite', 60, 47], ['Bexalite', 24, 19]],
  expenses: [['Refinery fee', 31400, 'hezeqiah'], ['Fuel + QT', 8200, 'Vesper Calderon']],
  crew: [{
    name: 'hezeqiah',
    role: 'Lead · Seller',
    type: 'equal'
  }, {
    name: 'Vesper Calderon',
    role: 'Operator',
    type: 'equal'
  }, {
    name: 'Iris Tanaka',
    role: 'Operator',
    type: 'equal'
  }, {
    name: 'Dax Moreno',
    role: 'Escort',
    type: 'percent',
    val: 10
  }]
}, {
  id: 'WO-3040',
  title: 'Lyria surface sweep',
  type: 'ship',
  status: 'refined',
  loc: 'Lyria · Crater Field',
  daysAgo: 1,
  session: true,
  refinery: 'ARC-L1 · Refinery',
  method: 'Ferron Exchange',
  yield: 71,
  progress: 1,
  timeLeft: 'Ready to sell',
  ships: [{
    ship: 'MISC Prospector',
    op: 'Iris Tanaka',
    scu: 50
  }],
  ores: [['Laranite', 32, 23], ['Agricium', 18, 13]],
  expenses: [['Refinery fee', 6200, 'Iris Tanaka']],
  crew: [{
    name: 'Iris Tanaka',
    role: 'Solo · Seller',
    type: 'equal'
  }]
}, {
  id: 'WO-3038',
  title: 'Daymar ROC gem run',
  type: 'vehicle',
  status: 'sold',
  loc: 'Daymar · Eager Flats',
  daysAgo: 2,
  session: true,
  refinery: '—',
  method: 'Hand-sold (gems)',
  yield: 100,
  progress: 1,
  timeLeft: 'Sold',
  ships: [{
    ship: 'Greycat ROC',
    op: 'Dax Moreno',
    scu: 9
  }, {
    ship: 'Greycat ROC',
    op: 'Kova Rhys',
    scu: 7
  }],
  ores: [['Hephaestanite', 16, 16]],
  expenses: [],
  crew: [{
    name: 'Dax Moreno',
    role: 'Driver · Seller',
    type: 'equal'
  }, {
    name: 'Kova Rhys',
    role: 'Driver',
    type: 'equal'
  }]
}, {
  id: 'WO-3037',
  title: 'Yela wreck reclaim',
  type: 'salvage',
  status: 'refining',
  loc: 'Yela Belt · Wrecks 19–24',
  daysAgo: 4,
  refinery: 'CRU-L1 · Reclamation',
  method: 'Material Reclaim',
  yield: 96,
  progress: 0.31,
  timeLeft: '3h 48m',
  ships: [{
    ship: 'Drake Vulture',
    op: 'Kova Rhys',
    scu: 64
  }, {
    ship: 'Aegis Reclaimer',
    op: 'hezeqiah',
    scu: 220
  }],
  ores: [['RMC', 180, 172], ['CMAT', 96, 91]],
  expenses: [['Hull repair', 18400, 'Kova Rhys']],
  crew: [{
    name: 'hezeqiah',
    role: 'Reclaimer crew · Seller',
    type: 'equal'
  }, {
    name: 'Kova Rhys',
    role: 'Operator',
    type: 'flat',
    val: 120000
  }, {
    name: 'Talia Vance',
    role: 'Processing',
    type: 'equal'
  }],
  altSeller: 'hezeqiah'
}, {
  id: 'WO-3036',
  title: 'Aaron Halo cluster 4',
  type: 'ship',
  status: 'pending',
  loc: 'Aaron Halo · Cluster 4',
  daysAgo: 6,
  refinery: 'Not submitted',
  method: '—',
  yield: 0,
  progress: 0,
  timeLeft: 'Awaiting refinery',
  ships: [{
    ship: 'MISC Mole',
    op: 'hezeqiah',
    scu: 84
  }, {
    ship: 'MISC Mole',
    op: 'Vesper Calderon',
    scu: 76
  }],
  ores: [['Bexalite', 54, 0], ['Titanium', 120, 0]],
  expenses: [],
  crew: [{
    name: 'hezeqiah',
    role: 'Lead · Seller',
    type: 'equal'
  }, {
    name: 'Vesper Calderon',
    role: 'Operator',
    type: 'equal'
  }]
}, {
  id: 'WO-3030',
  title: 'Wala ring (ship lost)',
  type: 'ship',
  status: 'failed',
  loc: 'Wala · Ring',
  daysAgo: 12,
  refinery: 'HUR-L2 · Refinery',
  method: 'Cormack Method',
  yield: 0,
  progress: 0,
  timeLeft: 'Ship lost — claim filed',
  ships: [{
    ship: 'MISC Prospector',
    op: 'Vesper Calderon',
    scu: 28
  }],
  ores: [['Gold', 28, 0]],
  expenses: [['Insurance excess', 4500, 'Vesper Calderon']],
  crew: [{
    name: 'Vesper Calderon',
    role: 'Solo',
    type: 'equal'
  }]
}, {
  id: 'WO-3024',
  title: 'Daymar quant haul',
  type: 'ship',
  status: 'sold',
  loc: 'Daymar · Kudre Ore',
  daysAgo: 21,
  refinery: 'CRU-L1 · Refinery',
  method: 'Dinyx Solventation',
  yield: 82,
  progress: 1,
  timeLeft: 'Sold',
  ships: [{
    ship: 'MISC Mole',
    op: 'hezeqiah',
    scu: 110
  }, {
    ship: 'MISC Prospector',
    op: 'Bram Holloway',
    scu: 44
  }],
  ores: [['Quantanium', 120, 98], ['Taranite', 30, 24]],
  expenses: [['Refinery fee', 22400, 'hezeqiah']],
  crew: [{
    name: 'hezeqiah',
    role: 'Lead · Seller',
    type: 'equal'
  }, {
    name: 'Bram Holloway',
    role: 'Operator',
    type: 'equal'
  }]
}];
const PERIODS = [{
  value: 'session',
  label: 'This session'
}, {
  value: '7',
  label: 'Last 7 days'
}, {
  value: '30',
  label: 'Last 30 days'
}];
const inPeriod = (o, p) => p === 'session' ? !!o.session : o.daysAgo <= Number(p);

// ---- money helpers ----
const fmt = n => Math.round(n).toLocaleString('en-US');
const abbr = n => {
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(Math.round(n));
};
const initials = s => s.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const realisedQ = o => o.status === 'pending' || o.status === 'failed';
function grossOf(o) {
  return o.ores.reduce((s, [name,, refined]) => s + refined * (ORE[name] ? ORE[name].price : 0), 0);
}
function scuOf(o) {
  return o.ores.reduce((s, x) => s + (realisedQ(o) ? x[1] : x[2]), 0);
}
function payoutOf(o) {
  const gross = grossOf(o);
  const totalExp = o.expenses.reduce((s, [, amt]) => s + amt, 0);
  const net = Math.max(0, gross - totalExp);
  const flats = o.crew.filter(c => c.type === 'flat');
  const pcts = o.crew.filter(c => c.type === 'percent');
  const equals = o.crew.filter(c => c.type === 'equal');
  const flatSum = flats.reduce((s, c) => s + (c.val || 0), 0);
  const pctSum = pcts.reduce((s, c) => s + net * (c.val || 0) / 100, 0);
  const remainder = Math.max(0, net - flatSum - pctSum);
  const equalEach = equals.length ? remainder / equals.length : 0;
  const rows = o.crew.map(c => {
    let share = 0,
      label = 'Equal';
    if (c.type === 'flat') {
      share = c.val || 0;
      label = 'Flat';
    } else if (c.type === 'percent') {
      share = net * (c.val || 0) / 100;
      label = c.val + '%';
    } else {
      share = equalEach;
      label = 'Equal';
    }
    const reimb = o.expenses.filter(e => e[2] === c.name).reduce((s, e) => s + e[1], 0);
    return {
      ...c,
      share,
      reimb,
      total: share + reimb,
      label
    };
  });
  return {
    gross,
    totalExp,
    net,
    rows
  };
}

// ===========================================================
//  LIST VIEW
// ===========================================================
function OrderRow({
  o,
  selected,
  tabIndex,
  regRef,
  onSelect,
  onOpen
}) {
  const ty = TYPE[o.type],
    st = STATUS[o.status];
  const gross = grossOf(o);
  const scu = scuOf(o);
  return /*#__PURE__*/React.createElement("tr", {
    ref: regRef,
    tabIndex: tabIndex,
    "aria-selected": selected,
    onClick: onSelect,
    onDoubleClick: onOpen,
    onFocus: onSelect
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "t-ent"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ic ' + ty.cls
  }, /*#__PURE__*/React.createElement(I, {
    n: ty.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, o.title), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, o.id, " \xB7 ", ty.label)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "ship-count"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ship-stack"
  }, o.ships.slice(0, 3).map((s, i) => /*#__PURE__*/React.createElement("span", {
    className: "mini",
    key: i
  }, /*#__PURE__*/React.createElement(I, {
    n: ty.shipIcon
  })))), o.ships.length, " ", o.ships.length === 1 ? 'ship' : 'ships')), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, scu, " ", /*#__PURE__*/React.createElement("span", {
    className: "t-muted",
    style: {
      fontWeight: 400
    }
  }, "SCU")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, o.status === 'refining' ? o.timeLeft : st.label)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, realisedQ(o) ? '—' : abbr(gross)), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      paddingLeft: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    style: {
      width: 30,
      height: 30
    },
    "aria-label": 'Open ' + o.title,
    onClick: e => {
      e.stopPropagation();
      onOpen();
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "chevron-right"
  }))));
}
function ListView({
  period,
  setPeriod,
  filter,
  setFilter,
  onOpen
}) {
  const visible = React.useMemo(() => ORDERS.filter(o => inPeriod(o, period)).filter(o => filter === 'all' || o.type === filter), [period, filter]);
  const [selId, setSelId] = React.useState(visible[0] ? visible[0].id : null);
  React.useEffect(() => {
    if (visible.length && !visible.find(o => o.id === selId)) setSelId(visible[0].id);
  }, [period, filter]);
  const roving = window.useRoving(visible.length, {
    onActivate: i => {
      if (visible[i]) onOpen(visible[i].id);
    }
  });
  React.useEffect(() => {
    roving.setIdx(0);
  }, [period, filter]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // period aggregates
  const totals = React.useMemo(() => {
    let yieldScu = 0,
      gross = 0,
      exp = 0,
      refining = 0,
      ships = 0;
    visible.forEach(o => {
      if (!realisedQ(o)) {
        yieldScu += o.ores.reduce((s, x) => s + x[2], 0);
        gross += grossOf(o);
        exp += o.expenses.reduce((s, e) => s + e[1], 0);
      }
      if (o.status === 'refining') refining += 1;
      ships += o.ships.length;
    });
    return {
      yieldScu,
      gross,
      exp,
      net: gross - exp,
      refining,
      ships,
      orders: visible.length
    };
  }, [visible]);
  const oreSummary = React.useMemo(() => {
    const m = {};
    visible.forEach(o => {
      if (!realisedQ(o)) o.ores.forEach(([n,, r]) => {
        m[n] = (m[n] || 0) + r;
      });
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [visible]);
  const filters = [{
    value: 'all',
    label: 'All',
    count: ORDERS.filter(o => inPeriod(o, period)).length
  }, {
    value: 'ship',
    label: 'Ship',
    icon: 'gem'
  }, {
    value: 'vehicle',
    label: 'ROC',
    icon: 'car'
  }, {
    value: 'salvage',
    label: 'Salvage',
    icon: 'recycle'
  }];
  const periodLabel = PERIODS.find(p => p.value === period).label.toLowerCase();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement(I, {
    n: "pickaxe"
  }), " Operations ", /*#__PURE__*/React.createElement(I, {
    n: "chevron-right"
  }), " Work Orders"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Work Orders"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Every refinery job and its crew-share split in one place. A work order can pool many ships into one payout \u2014 open one to see the ships, ore, expenses, and who gets what.")), /*#__PURE__*/React.createElement("div", {
    className: "page-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(I, {
    n: "scan-line"
  }), " Capture"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    id: "wo-new"
  }, /*#__PURE__*/React.createElement(I, {
    n: "plus"
  }), " New work order ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 6
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "n"))))), /*#__PURE__*/React.createElement("div", {
    className: "wo-period"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pcap"
  }, "Summary for"), /*#__PURE__*/React.createElement(Segmented, {
    options: PERIODS,
    value: period,
    onChange: setPeriod,
    ariaLabel: "Summary period"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "live-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "live"
  }), "Aaron Halo session \xB7 open")), /*#__PURE__*/React.createElement(StatStrip, {
    items: [{
      k: 'Orders',
      icon: 'layers',
      v: totals.orders,
      d: totals.ships + ' ships involved'
    }, {
      k: 'Yield (' + periodLabel + ')',
      icon: 'gem',
      v: totals.yieldScu,
      unit: 'SCU',
      d: oreSummary.length + ' ores refined'
    }, {
      k: 'Gross value',
      icon: 'coins',
      v: abbr(totals.gross),
      unit: 'aUEC',
      d: 'at UEX sell prices'
    }, {
      k: 'Net payout',
      icon: 'hand-coins',
      v: abbr(totals.net),
      unit: 'aUEC',
      d: 'after expenses',
      tone: 'up'
    }, {
      k: 'Refining now',
      icon: 'loader',
      v: totals.refining,
      d: 'jobs in progress'
    }]
  }), oreSummary.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ore-sum"
  }, oreSummary.map(([name, scu]) => /*#__PURE__*/React.createElement("span", {
    className: "chip",
    key: name
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: oreColor(name)
    }
  }), name, " ", /*#__PURE__*/React.createElement("span", {
    className: "q"
  }, scu, " SCU")))), /*#__PURE__*/React.createElement("div", {
    className: "wo-toolbar"
  }, /*#__PURE__*/React.createElement(Segmented, {
    options: filters,
    value: filter,
    onChange: setFilter,
    ariaLabel: "Filter work orders by type"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(I, {
    n: "arrow-down-up"
  }), " Sort: Newest"), /*#__PURE__*/React.createElement("button", {
    className: "fchip"
  }, /*#__PURE__*/React.createElement(I, {
    n: "download"
  }), " Export CSV"))), /*#__PURE__*/React.createElement("div", {
    className: "dtable-wrap",
    style: {
      marginTop: 'var(--space-5)'
    }
  }, visible.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "e-ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "pickaxe"
  })), "No work orders in this period.") : /*#__PURE__*/React.createElement("table", {
    className: "dtable",
    role: "grid",
    "aria-label": "Work orders",
    onKeyDown: roving.onKeyDown
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Work order"), /*#__PURE__*/React.createElement("th", null, "Ships"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Yield"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Value"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, visible.map((o, i) => /*#__PURE__*/React.createElement(OrderRow, {
    key: o.id,
    o: o,
    selected: o.id === selId,
    tabIndex: roving.getTab(i),
    regRef: roving.register(i),
    onSelect: () => {
      setSelId(o.id);
      roving.setIdx(i);
    },
    onOpen: () => onOpen(o.id)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "list-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), " move", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), " open work order", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "n")), " new", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, visible.length, " orders \xB7 ", periodLabel))));
}

// ===========================================================
//  ACTIVE (drill-in) VIEW
// ===========================================================
function ActiveView({
  o,
  onBack
}) {
  const backRef = React.useRef(null);
  const ty = TYPE[o.type],
    st = STATUS[o.status];
  const {
    gross,
    totalExp,
    net,
    rows
  } = payoutOf(o);
  const realised = realisedQ(o);
  const totalShipScu = o.ships.reduce((s, x) => s + x.scu, 0);
  React.useEffect(() => {
    if (backRef.current) backRef.current.focus();
  }, [o.id]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') {
        const open = document.querySelector('.scrim');
        if (!open) onBack();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onBack]);
  return /*#__PURE__*/React.createElement("div", {
    className: "wo-active"
  }, /*#__PURE__*/React.createElement("button", {
    className: "wo-back",
    ref: backRef,
    onClick: onBack
  }, /*#__PURE__*/React.createElement(I, {
    n: "arrow-left"
  }), " All work orders ", /*#__PURE__*/React.createElement("span", {
    className: "kbd",
    style: {
      marginLeft: 4
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "Esc"))), /*#__PURE__*/React.createElement("div", {
    className: "wo-active-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "big-ic",
    style: tintFor(o.type)
  }, /*#__PURE__*/React.createElement(I, {
    n: ty.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, o.title, " ", /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    icon: st.icon
  }, st.label)), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, /*#__PURE__*/React.createElement("span", null, o.id), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, ty.label), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "map-pin"
  }), o.loc), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "rocket"
  }), o.ships.length, " ships \xB7 ", o.crew.length, " crew"))), /*#__PURE__*/React.createElement("div", {
    className: "acts"
  }, o.status === 'refined' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(I, {
    n: "coins"
  }), " Mark sold & pay crew"), o.status === 'pending' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(I, {
    n: "send"
  }), " Submit to refinery"), o.status === 'refining' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, /*#__PURE__*/React.createElement(I, {
    n: "bell"
  }), " Notify when done"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    "aria-label": "Edit work order"
  }, /*#__PURE__*/React.createElement(I, {
    n: "pencil"
  })))), /*#__PURE__*/React.createElement(StatStrip, {
    items: [{
      k: 'Order yield',
      icon: 'gem',
      v: scuOf(o),
      unit: 'SCU',
      d: o.ores.length + ' ore types'
    }, {
      k: 'Gross value',
      icon: 'coins',
      v: realised ? '—' : abbr(gross),
      unit: realised ? '' : 'aUEC',
      d: 'at UEX prices'
    }, {
      k: 'Expenses',
      icon: 'receipt',
      v: totalExp ? abbr(totalExp) : '0',
      unit: 'aUEC',
      d: o.expenses.length + ' items',
      tone: 'warn'
    }, {
      k: 'Net payout',
      icon: 'hand-coins',
      v: realised ? '—' : abbr(net),
      unit: realised ? '' : 'aUEC',
      d: 'split ' + o.crew.length + ' ways',
      tone: 'up'
    }, {
      k: 'Ships',
      icon: 'rocket',
      v: o.ships.length,
      d: totalShipScu + ' SCU hauled'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "split"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "rocket"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Ships participating"), /*#__PURE__*/React.createElement("span", {
    className: "t-mono t-muted",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, totalShipScu, " SCU")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body",
    style: {
      paddingTop: 4,
      paddingBottom: 4
    }
  }, o.ships.map((s, i) => {
    const pct = totalShipScu ? Math.round(s.scu / totalShipScu * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "ship-row",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "ship-ic",
      style: tintFor(o.type)
    }, /*#__PURE__*/React.createElement(I, {
      n: ty.shipIcon
    })), /*#__PURE__*/React.createElement("div", {
      className: "info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "nm"
    }, s.ship), /*#__PURE__*/React.createElement("div", {
      className: "op"
    }, /*#__PURE__*/React.createElement(I, {
      n: "user"
    }), s.op)), /*#__PURE__*/React.createElement("div", {
      className: "ship-scu"
    }, /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, s.scu), " ", /*#__PURE__*/React.createElement("span", {
      className: "u"
    }, "SCU \xB7 ", pct, "%"), /*#__PURE__*/React.createElement("div", {
      className: "bar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + '%'
      }
    }))));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "factory"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Refinery"), /*#__PURE__*/React.createElement("span", {
    className: "t-mono t-muted",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, "yield ", o.yield ? o.yield + '%' : '—')), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "refbox"
  }, /*#__PURE__*/React.createElement("div", {
    className: "refbox-top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "refbox-method"
  }, o.method), /*#__PURE__*/React.createElement("div", {
    className: "refbox-method st"
  }, o.refinery)), /*#__PURE__*/React.createElement("div", {
    className: "refbox-time"
  }, o.timeLeft)), o.status === 'refining' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tbar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: Math.round(o.progress * 100) + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "refbox-foot"
  }, /*#__PURE__*/React.createElement("span", null, Math.round(o.progress * 100), "% complete"), /*#__PURE__*/React.createElement("span", null, "ETA ", o.timeLeft))))), /*#__PURE__*/React.createElement("div", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-cap"
  }, /*#__PURE__*/React.createElement("span", null, "Ore yield (pooled)")), /*#__PURE__*/React.createElement("table", {
    className: "ore-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Ore"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Raw"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Refined"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Value"))), /*#__PURE__*/React.createElement("tbody", null, o.ores.map(([name, raw, refined]) => /*#__PURE__*/React.createElement("tr", {
    key: name
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "ore-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ore-dot",
    style: {
      background: oreColor(name)
    }
  }), name)), /*#__PURE__*/React.createElement("td", {
    className: "num t-muted"
  }, raw), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, realised ? '—' : refined), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, realised ? '—' : fmt(refined * (ORE[name] ? ORE[name].price : 0)))))), !realised && /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Gross"), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, fmt(gross)))))))), /*#__PURE__*/React.createElement("div", null, o.expenses.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "receipt"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Expenses"), /*#__PURE__*/React.createElement("span", {
    className: "t-mono",
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--coral-400)'
    }
  }, "\u2212", fmt(totalExp))), /*#__PURE__*/React.createElement("div", {
    className: "panel-body",
    style: {
      paddingTop: 4,
      paddingBottom: 8
    }
  }, o.expenses.map(([label, amt, claimant], i) => /*#__PURE__*/React.createElement("div", {
    className: "exp-row",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ex-ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "receipt"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ex-lbl"
  }, label, /*#__PURE__*/React.createElement("div", {
    className: "ex-claim"
  }, "Reimbursed to ", claimant)), /*#__PURE__*/React.createElement("span", {
    className: "ex-amt"
  }, "\u2212", fmt(amt)))))), /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "users"
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Crew shares \xB7 ", o.crew.length), /*#__PURE__*/React.createElement("span", {
    className: "t-muted",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, "net ", realised ? '—' : fmt(net))), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, rows.map(c => /*#__PURE__*/React.createElement("div", {
    className: "share-row",
    key: c.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "share-who"
  }, /*#__PURE__*/React.createElement("span", {
    className: "av",
    style: {
      background: window.avColor(c.name)
    }
  }, initials(c.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "role"
  }, c.role, c.reimb > 0 && /*#__PURE__*/React.createElement("span", {
    className: "t-mono",
    style: {
      color: 'var(--teal-300)'
    }
  }, "+", abbr(c.reimb), " reimb")))), /*#__PURE__*/React.createElement("span", {
    className: "share-type"
  }, c.label), /*#__PURE__*/React.createElement("div", {
    className: "share-pay"
  }, realised ? '—' : fmt(c.total), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "aUEC")))), o.altSeller && /*#__PURE__*/React.createElement("div", {
    className: "alt-note"
  }, /*#__PURE__*/React.createElement(I, {
    n: "user-check"
  }), "Alternate seller: ", /*#__PURE__*/React.createElement("strong", null, o.altSeller), " handles the sale and settles payouts to the crew."), /*#__PURE__*/React.createElement("div", {
    className: "payout-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Gross value"), /*#__PURE__*/React.createElement("span", {
    className: "r"
  }, realised ? '—' : fmt(gross))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Less expenses"), /*#__PURE__*/React.createElement("span", {
    className: "r",
    style: {
      color: 'var(--coral-400)'
    }
  }, totalExp ? '−' + fmt(totalExp) : '0')), /*#__PURE__*/React.createElement("div", {
    className: "row total"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Net distributed"), /*#__PURE__*/React.createElement("span", {
    className: "r"
  }, realised ? '—' : fmt(net) + ' aUEC'))))))));
}

// ===========================================================
//  PAGE
// ===========================================================
function WorkOrdersPage() {
  const [period, setPeriod] = React.useState('session');
  const [filter, setFilter] = React.useState('all');
  const [activeId, setActiveId] = React.useState(null);
  const active = activeId ? ORDERS.find(o => o.id === activeId) : null;
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeId]);
  if (active) return /*#__PURE__*/React.createElement(ActiveView, {
    o: active,
    onBack: () => setActiveId(null)
  });
  return /*#__PURE__*/React.createElement(ListView, {
    period: period,
    setPeriod: setPeriod,
    filter: filter,
    setFilter: setFilter,
    onOpen: setActiveId
  });
}
function WorkOrdersApp() {
  const onNew = () => {
    window.__toast && window.__toast('New work order — capture from game or enter ships manually', 'plus');
  };
  const commands = [{
    id: 'wo-new',
    group: 'Work Orders',
    icon: 'plus',
    label: 'New work order',
    hint: 'n',
    run: () => window.__toast && window.__toast('New work order started', 'plus')
  }, {
    id: 'wo-capture',
    group: 'Work Orders',
    icon: 'scan-line',
    label: 'Capture order from game (OCR)',
    run: () => window.__toast && window.__toast('Share your game window to capture', 'scan-line')
  }, {
    id: 'wo-summary',
    group: 'Work Orders',
    icon: 'receipt',
    label: 'Session summary & payouts',
    run: () => window.__toast && window.__toast('Opening session summary', 'receipt')
  }, {
    id: 'wo-close',
    group: 'Work Orders',
    icon: 'lock',
    label: 'Close session',
    run: () => window.__toast && window.__toast('Session closed', 'lock')
  }];
  const helpExtra = [['New work order', ['n']], ['Open work order', ['↵']], ['Back to list', ['Esc']], ['Change period', ['←', '→']]];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: "workorders",
    commands: commands,
    helpExtra: helpExtra,
    onNew: onNew,
    searchPlaceholder: "Search orders, ships, crew\u2026"
  }, /*#__PURE__*/React.createElement(WorkOrdersPage, null));
}
window.WorkOrdersApp = WorkOrdersApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/WorkOrders.jsx", error: String((e && e.message) || e) }); }

// app/app-shell.jsx
try { (() => {
// ============================================================
// Station — application shell (shared)
// Sidebar + app bar + command palette + keyboard shortcuts +
// roving-focus helpers + shared primitives. Exposed on window
// so each page's JSX can use them.
//   Keyboard model:
//   ⌘/Ctrl K  command palette      ?  shortcuts        /  search
//   g then d/w/c/f/m  go to page    n  new (page-defined)   Esc close
// ============================================================

// Render lucide icons as REAL React-owned SVG (no createIcons() DOM mutation).
// This keeps React in full control so subtree swaps (e.g. edit toggles) never
// hit "removeChild" errors from lucide replacing nodes in place.
const ICON_ALIAS = {
  'hand-helping': 'Handshake',
  'helping-hand': 'Handshake'
};
function lucideNode(name) {
  const L = window.lucide || {};
  const key = ICON_ALIAS[name] || String(name).split('-').map(s => s ? s[0].toUpperCase() + s.slice(1) : '').join('');
  const node = L[key] || L.icons && L.icons[key];
  return Array.isArray(node) ? node : null;
}
function iconChildren(kids) {
  return (kids || []).map((c, i) => {
    const [tag, attrs, sub] = c;
    const props = {
      key: i
    };
    for (const k in attrs || {}) props[k.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase())] = attrs[k];
    return React.createElement(tag, props, sub ? iconChildren(sub) : undefined);
  });
}
const Icon = ({
  n,
  size,
  ...p
}) => {
  const node = lucideNode(n);
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size || 24,
    height: size || 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...p
  }, node ? iconChildren(node[2]) : null);
};

// org-tool navigation (single source of truth)
const NAV = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'layout-dashboard',
  href: '../dashboard/Station Dashboard v2.html',
  key: 'd'
}, {
  id: 'workorders',
  label: 'Work Orders',
  icon: 'pickaxe',
  href: 'Work Orders.html',
  key: 'w'
}, {
  id: 'contracts',
  label: 'Contracts',
  icon: 'scroll-text',
  href: 'Contracts.html',
  key: 'c'
}, {
  id: 'fleet',
  label: 'Fleet',
  icon: 'rocket',
  href: 'Fleet.html',
  key: 'f'
}, {
  id: 'members',
  label: 'Members',
  icon: 'users',
  href: 'Members.html',
  key: 'm'
}];
const NAV_SECONDARY = [{
  id: 'inventory',
  label: 'Inventory',
  icon: 'archive',
  href: 'Inventory.html'
}, {
  id: 'treasury',
  label: 'Treasury',
  icon: 'landmark',
  href: 'Treasury.html'
}];

// ---- theme + accent (persisted; shared with dashboard) -------
function useChrome() {
  const [theme, setTheme] = React.useState(() => {
    try {
      return localStorage.getItem('station-dash-theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [accent, setAccent] = React.useState(() => {
    try {
      return localStorage.getItem('station-accent') || 'aqua';
    } catch (e) {
      return 'aqua';
    }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('station-dash-theme', theme);
    } catch (e) {}
  }, [theme]);
  React.useEffect(() => {
    try {
      localStorage.setItem('station-accent', accent);
    } catch (e) {}
  }, [accent]);
  return {
    theme,
    setTheme,
    accent,
    setAccent
  };
}

// ---- roving focus for lists/tables --------------------------
// returns handlers; rows get tabIndex from getTab(i); container onKeyDown.
function useRoving(count, {
  onActivate,
  orientation = 'vertical'
} = {}) {
  const [idx, setIdx] = React.useState(0);
  const refs = React.useRef([]);
  const focus = i => {
    const el = refs.current[i];
    if (el) el.focus();
  };
  const clamp = i => Math.max(0, Math.min(count - 1, i));
  const onKeyDown = e => {
    const nextKeys = orientation === 'vertical' ? ['ArrowDown', 'j'] : ['ArrowRight'];
    const prevKeys = orientation === 'vertical' ? ['ArrowUp', 'k'] : ['ArrowLeft'];
    if (nextKeys.includes(e.key)) {
      e.preventDefault();
      const i = clamp(idx + 1);
      setIdx(i);
      focus(i);
    } else if (prevKeys.includes(e.key)) {
      e.preventDefault();
      const i = clamp(idx - 1);
      setIdx(i);
      focus(i);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setIdx(0);
      focus(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setIdx(count - 1);
      focus(count - 1);
    } else if ((e.key === 'Enter' || e.key === ' ') && onActivate) {
      e.preventDefault();
      onActivate(idx);
    }
  };
  const getTab = i => i === idx ? 0 : -1;
  const register = i => el => {
    refs.current[i] = el;
  };
  return {
    idx,
    setIdx,
    onKeyDown,
    getTab,
    register,
    focus
  };
}

// ---- primitives ----------------------------------------------
function Kbd({
  keys
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, keys.map((k, i) => /*#__PURE__*/React.createElement("kbd", {
    key: i
  }, k)));
}
function Segmented({
  options,
  value,
  onChange,
  ariaLabel
}) {
  const ref = React.useRef(null);
  const onKey = e => {
    const i = options.findIndex(o => (o.value ?? o) === value);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const d = e.key === 'ArrowRight' ? 1 : -1;
      const n = (i + d + options.length) % options.length;
      onChange(options[n].value ?? options[n]);
      const btns = ref.current.querySelectorAll('button');
      if (btns[n]) btns[n].focus();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "seg",
    role: "tablist",
    "aria-label": ariaLabel,
    ref: ref,
    onKeyDown: onKey
  }, options.map(o => {
    const v = o.value ?? o;
    const label = o.label ?? o;
    const sel = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": sel,
      tabIndex: sel ? 0 : -1,
      onClick: () => onChange(v)
    }, o.icon && /*#__PURE__*/React.createElement(Icon, {
      n: o.icon
    }), label, o.count != null && /*#__PURE__*/React.createElement("span", {
      className: "count"
    }, o.count));
  }));
}
function StatusPill({
  tone = 'neutral',
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: 'spill ' + tone
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    n: icon
  }), children);
}
function StatStrip({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "statstrip",
    style: {
      '--n': items.length
    }
  }, items.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "statcard",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, s.icon && /*#__PURE__*/React.createElement(Icon, {
    n: s.icon
  }), s.k), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, s.v, s.unit && /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, s.unit)), s.d && /*#__PURE__*/React.createElement("div", {
    className: 'd' + (s.tone ? ' ' + s.tone : '')
  }, s.d))));
}

// deterministic avatar color from a string
function avColor(seed) {
  const palettes = ['var(--aqua-500)', 'var(--teal-500)', 'var(--coral-500)', '#6E7BF2', '#C879D8', '#3FB6A8', '#E0913A'];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return palettes[h % palettes.length];
}
function AvatarChip({
  name,
  handle
}) {
  const initials = name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    className: "achip"
  }, /*#__PURE__*/React.createElement("span", {
    className: "av",
    style: {
      background: avColor(name)
    }
  }, initials), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, name), handle && /*#__PURE__*/React.createElement("span", {
    className: "t-muted",
    style: {
      fontSize: 'var(--text-xs)',
      marginLeft: 6
    }
  }, handle)));
}

// ---- toasts (tiny global) -----------------------------------
const ToastCtx = React.createContext(() => {});
function useToast() {
  return React.useContext(ToastCtx);
}

// ---- command palette ----------------------------------------
function CommandPalette({
  open,
  onClose,
  commands
}) {
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 20);
    }
  }, [open]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  if (!open) return null;
  const filtered = commands.filter(c => (c.label + ' ' + (c.group || '')).toLowerCase().includes(q.toLowerCase()));
  const run = c => {
    onClose();
    if (c.run) c.run();
  };
  const onKey = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel(s => Math.min(filtered.length - 1, s + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel(s => Math.max(0, s - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[sel]) run(filtered[sel]);
    }
  };
  let lastGroup = null;
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onMouseDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmdk",
    role: "dialog",
    "aria-label": "Command palette",
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmdk-in"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "search"
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    placeholder: "Search actions, pages, people\u2026",
    onChange: e => {
      setQ(e.target.value);
      setSel(0);
    },
    onKeyDown: onKey
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "Esc"))), /*#__PURE__*/React.createElement("div", {
    className: "cmdk-list"
  }, filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cmdk-empty"
  }, "No matches for \u201C", q, "\u201D."), filtered.map((c, i) => {
    const head = c.group && c.group !== lastGroup ? /*#__PURE__*/React.createElement("div", {
      className: "cmdk-cap",
      key: 'g' + i
    }, c.group) : null;
    lastGroup = c.group;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: c.id
    }, head, /*#__PURE__*/React.createElement("div", {
      className: 'cmdk-item' + (i === sel ? ' active' : ''),
      onMouseEnter: () => setSel(i),
      onClick: () => run(c)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: c.icon
    })), /*#__PURE__*/React.createElement("span", {
      className: "lbl"
    }, c.label), c.hint && /*#__PURE__*/React.createElement("span", {
      className: "hint"
    }, c.hint)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cmdk-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2191"), /*#__PURE__*/React.createElement("kbd", null, "\u2193")), /*#__PURE__*/React.createElement("span", {
    className: "t-muted",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, "navigate"), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5")), /*#__PURE__*/React.createElement("span", {
    className: "t-muted",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, "run"))));
}

// ---- keyboard help ------------------------------------------
function KeyHelp({
  open,
  onClose,
  extra = []
}) {
  React.useEffect(() => {
    if (open && window.lucide) window.lucide.createIcons();
  });
  if (!open) return null;
  const groups = [{
    cap: 'Global',
    rows: [['Command palette', ['⌘', 'K']], ['Search', ['/']], ['This help', ['?']], ['Close / back', ['Esc']]]
  }, {
    cap: 'Go to',
    rows: [['Dashboard', ['g', 'd']], ['Work Orders', ['g', 'w']], ['Contracts', ['g', 'c']], ['Fleet', ['g', 'f']], ['Members', ['g', 'm']]]
  }, {
    cap: 'Lists & tables',
    rows: [['Move selection', ['↑', '↓']], ['Vim move', ['j', 'k']], ['First / last', ['Home', 'End']], ['Open row', ['↵']]]
  }, {
    cap: 'This page',
    rows: extra.length ? extra : [['New item', ['n']], ['Toggle theme', ['t']]]
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onMouseDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "khelp",
    role: "dialog",
    "aria-label": "Keyboard shortcuts",
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "khelp-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Keyboard shortcuts"), /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "khelp-grid"
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.cap
  }, /*#__PURE__*/React.createElement("div", {
    className: "grp-cap"
  }, g.cap), g.rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    className: "krow",
    key: i
  }, /*#__PURE__*/React.createElement("span", null, r[0]), /*#__PURE__*/React.createElement(Kbd, {
    keys: r[1]
  }))))))));
}

// ---- the shell ----------------------------------------------
function AppShell({
  active,
  title,
  children,
  commands = [],
  helpExtra = [],
  onNew,
  searchPlaceholder = 'Search…'
}) {
  const {
    theme,
    setTheme,
    accent,
    setAccent
  } = useChrome();
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const gPending = React.useRef(false);
  const pushToast = React.useCallback((msg, icon = 'check') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, {
      id,
      msg,
      icon
    }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  }, []);
  // expose toast globally so page-level commands can fire it
  React.useEffect(() => {
    window.__toast = pushToast;
    return () => {
      if (window.__toast === pushToast) delete window.__toast;
    };
  }, [pushToast]);
  const go = href => {
    if (href && href !== '#') window.location.href = href;
  };
  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

  // build default command set (nav + theme + page commands)
  const allCommands = React.useMemo(() => {
    const navCmds = NAV.filter(n => !n.soon).map(n => ({
      id: 'nav-' + n.id,
      group: 'Go to',
      icon: n.icon,
      label: n.label,
      hint: 'g ' + n.key,
      run: () => go(n.href)
    }));
    const sys = [{
      id: 'theme',
      group: 'System',
      icon: theme === 'dark' ? 'sun' : 'moon',
      label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      run: toggleTheme
    }, {
      id: 'accent',
      group: 'System',
      icon: 'palette',
      label: 'Toggle accent (Aqua / Coral)',
      run: () => setAccent(a => a === 'aqua' ? 'coral' : 'aqua')
    }, {
      id: 'help',
      group: 'System',
      icon: 'keyboard',
      label: 'Keyboard shortcuts',
      hint: '?',
      run: () => setHelpOpen(true)
    }];
    return [...commands, ...navCmds, ...sys];
  }, [commands, theme]);

  // global keyboard
  React.useEffect(() => {
    const onKey = e => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      // ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
        return;
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setHelpOpen(false);
        setNavOpen(false);
        return;
      }
      if (typing) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // g-then-key navigation
      if (gPending.current) {
        gPending.current = false;
        const target = NAV.find(n => n.key === e.key.toLowerCase());
        if (target) {
          e.preventDefault();
          go(target.href);
          return;
        }
      }
      if (e.key === 'g') {
        gPending.current = true;
        setTimeout(() => {
          gPending.current = false;
        }, 900);
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        setCmdOpen(true);
        return;
      }
      if (e.key === '?') {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }
      if (e.key === 't') {
        toggleTheme();
        return;
      }
      if (e.key === 'n' && onNew) {
        e.preventDefault();
        onNew();
        return;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onNew, theme]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const activeNav = NAV.find(n => n.id === active);
  return /*#__PURE__*/React.createElement(ToastCtx.Provider, {
    value: pushToast
  }, /*#__PURE__*/React.createElement("div", {
    className: 'app' + (navOpen ? ' nav-open' : ''),
    "data-theme": theme,
    "data-accent": accent
  }, /*#__PURE__*/React.createElement("a", {
    className: "skip",
    href: "#main"
  }, "Skip to content"), /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "side-org",
    "aria-label": "Switch organization"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, "AV"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, "Atlas Vanguard"), /*#__PURE__*/React.createElement("span", {
    className: "role"
  }, "Quartermaster")), /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "chevrons-up-down"
  })))), /*#__PURE__*/React.createElement("nav", {
    className: "side-nav",
    "aria-label": "Primary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-cap"
  }, "Operations"), NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    className: 'side-link' + (n.id === active ? ' active' : '') + (n.soon ? ' soon' : ''),
    href: n.soon ? undefined : n.href,
    "aria-current": n.id === active ? 'page' : undefined,
    "aria-disabled": n.soon || undefined
  }, /*#__PURE__*/React.createElement(Icon, {
    n: n.icon
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, n.label), n.soon ? /*#__PURE__*/React.createElement("span", {
    className: "soon-tag"
  }, "soon") : /*#__PURE__*/React.createElement("span", {
    className: "key"
  }, n.key))), /*#__PURE__*/React.createElement("div", {
    className: "side-cap"
  }, "Assets"), NAV_SECONDARY.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    className: 'side-link' + (n.id === active ? ' active' : '') + (n.soon ? ' soon' : ''),
    href: n.soon ? undefined : n.href,
    "aria-current": n.id === active ? 'page' : undefined,
    "aria-disabled": n.soon || undefined
  }, /*#__PURE__*/React.createElement(Icon, {
    n: n.icon
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, n.label), n.soon ? /*#__PURE__*/React.createElement("span", {
    className: "soon-tag"
  }, "soon") : n.id === active ? null : /*#__PURE__*/React.createElement("span", {
    className: "key"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "side-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "side-help",
    onClick: () => setHelpOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "keyboard"
  }), " Keyboard shortcuts ", /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "?"))))), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "appbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ibtn side-toggle",
    "aria-label": "Menu",
    onClick: () => setNavOpen(o => !o)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "menu"
  })), /*#__PURE__*/React.createElement("button", {
    className: "appbar-search",
    onClick: () => setCmdOpen(true),
    "aria-label": "Search and commands"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "search"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ph"
  }, searchPlaceholder), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u2318"), /*#__PURE__*/React.createElement("kbd", null, "K"))), /*#__PURE__*/React.createElement("span", {
    className: "appbar-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "appbar-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    onClick: toggleTheme,
    "aria-label": theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
    title: "Toggle theme (t)"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: theme === 'dark' ? 'sun' : 'moon'
  })), /*#__PURE__*/React.createElement("button", {
    className: "ibtn",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  })), /*#__PURE__*/React.createElement("a", {
    className: "uavatar",
    href: "Profile.html",
    "aria-label": "Account \xB7 My Profile",
    title: "My Profile",
    style: {
      textDecoration: 'none'
    }
  }, "H"))), /*#__PURE__*/React.createElement("main", {
    className: "page",
    id: "main"
  }, children)), /*#__PURE__*/React.createElement(CommandPalette, {
    open: cmdOpen,
    onClose: () => setCmdOpen(false),
    commands: allCommands
  }), /*#__PURE__*/React.createElement(KeyHelp, {
    open: helpOpen,
    onClose: () => setHelpOpen(false),
    extra: helpExtra
  }), /*#__PURE__*/React.createElement("div", {
    className: "toasts",
    "aria-live": "polite"
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    className: "toast",
    key: t.id
  }, /*#__PURE__*/React.createElement(Icon, {
    n: t.icon
  }), t.msg)))));
}
Object.assign(window, {
  StationIcon: Icon,
  NAV,
  useRoving,
  useChrome,
  useToast,
  Kbd,
  Segmented,
  StatusPill,
  StatStrip,
  AvatarChip,
  avColor,
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/app-shell.jsx", error: String((e && e.message) || e) }); }

// app/inventory-data.jsx
try { (() => {
// ============================================================
// Station — Inventory data & helpers
// Mock UEX catalog + personal/org inventory records, mirroring the
// real app's data model (uexItemId, categoryName, quantity, notes,
// sharedOrgId). Exposed on window for Inventory.jsx.
// ============================================================

// category families with tint colors (Star Citizen commodity/component types)
const INV_CATEGORIES = [{
  id: 1,
  name: 'Refined Ore',
  color: '#5BD6B0'
}, {
  id: 2,
  name: 'Raw Ore',
  color: '#C2724B'
}, {
  id: 3,
  name: 'Salvage',
  color: '#C879D8'
}, {
  id: 4,
  name: 'Components',
  color: '#7CBEF9'
}, {
  id: 5,
  name: 'Weapons',
  color: '#E06A52'
}, {
  id: 6,
  name: 'Ship Weapons',
  color: '#E0913A'
}, {
  id: 7,
  name: 'Consumables',
  color: '#5BD6B0'
}, {
  id: 8,
  name: 'Trade Goods',
  color: '#E0B23A'
}, {
  id: 9,
  name: 'Liveries',
  color: '#9AA7B2'
}, {
  id: 10,
  name: 'Vehicles',
  color: '#6E7BF2'
}];
const catById = id => INV_CATEGORIES.find(c => c.id === id) || INV_CATEGORIES[0];
const catColor = name => (INV_CATEGORIES.find(c => c.name === name) || {}).color || 'var(--text-faint)';
const catIcon = name => ({
  'Refined Ore': 'gem',
  'Raw Ore': 'mountain',
  'Salvage': 'recycle',
  'Components': 'cpu',
  'Weapons': 'crosshair',
  'Ship Weapons': 'rocket',
  'Consumables': 'flask-conical',
  'Trade Goods': 'package',
  'Liveries': 'paintbrush',
  'Vehicles': 'car'
})[name] || 'box';

// UEX catalog (searchable in the add dialog)
const UEX_CATALOG = [{
  uexId: 101,
  name: 'Quantanium',
  categoryId: 1
}, {
  uexId: 102,
  name: 'Bexalite',
  categoryId: 1
}, {
  uexId: 103,
  name: 'Taranite',
  categoryId: 1
}, {
  uexId: 104,
  name: 'Laranite',
  categoryId: 1
}, {
  uexId: 105,
  name: 'Agricium',
  categoryId: 1
}, {
  uexId: 106,
  name: 'Gold (refined)',
  categoryId: 1
}, {
  uexId: 107,
  name: 'Titanium',
  categoryId: 1
}, {
  uexId: 108,
  name: 'Hephaestanite',
  categoryId: 1
}, {
  uexId: 201,
  name: 'Quantanium (raw)',
  categoryId: 2
}, {
  uexId: 202,
  name: 'Iron (raw)',
  categoryId: 2
}, {
  uexId: 203,
  name: 'Tungsten (raw)',
  categoryId: 2
}, {
  uexId: 301,
  name: 'Recycled Material Composite',
  categoryId: 3
}, {
  uexId: 302,
  name: 'Construction Materials',
  categoryId: 3
}, {
  uexId: 303,
  name: 'Ship Hull Plating',
  categoryId: 3
}, {
  uexId: 401,
  name: 'C788 Sa Power Plant',
  categoryId: 4
}, {
  uexId: 402,
  name: 'FR-76 Shield Generator',
  categoryId: 4
}, {
  uexId: 403,
  name: 'Atlas Quantum Drive',
  categoryId: 4
}, {
  uexId: 404,
  name: 'JS-300 Jump Module',
  categoryId: 4
}, {
  uexId: 501,
  name: 'Demeco LMG',
  categoryId: 5
}, {
  uexId: 502,
  name: 'P8-AR Assault Rifle',
  categoryId: 5
}, {
  uexId: 503,
  name: 'Gemini S71 Rifle',
  categoryId: 5
}, {
  uexId: 601,
  name: 'CF-337 Panther Repeater',
  categoryId: 6
}, {
  uexId: 602,
  name: 'Attrition-3 Laser Cannon',
  categoryId: 6
}, {
  uexId: 701,
  name: 'Medical Supplies',
  categoryId: 7
}, {
  uexId: 702,
  name: 'Medical Pen (Hemozal)',
  categoryId: 7
}, {
  uexId: 703,
  name: 'Oxygen Canister',
  categoryId: 7
}, {
  uexId: 801,
  name: 'Stims',
  categoryId: 8
}, {
  uexId: 802,
  name: 'Distilled Spirits',
  categoryId: 8
}, {
  uexId: 803,
  name: 'Pressurized Ice',
  categoryId: 8
}, {
  uexId: 901,
  name: '100i Frostbite Livery',
  categoryId: 9
}, {
  uexId: 902,
  name: 'Cutlass Skull & Crossbones',
  categoryId: 9
}, {
  uexId: 1001,
  name: 'Greycat ROC',
  categoryId: 10
}, {
  uexId: 1002,
  name: 'Greycat PTV',
  categoryId: 10
}];

// orgs the user belongs to + permission sets
const INV_ORGS = [{
  id: 1,
  name: 'Atlas Vanguard',
  badge: 'AV',
  perms: ['view', 'edit', 'admin']
}, {
  id: 2,
  name: 'Crimson Fleet',
  badge: 'CF',
  perms: ['view']
}];

// personal inventory records
let _id = 1;
const rec = (uexId, quantity, opts = {}) => {
  const c = UEX_CATALOG.find(x => x.uexId === uexId);
  const cat = catById(c.categoryId);
  return {
    id: _id++,
    uexItemId: uexId,
    itemName: c.name,
    categoryName: cat.name,
    quantity,
    notes: opts.notes || '',
    sharedOrgId: opts.sharedOrgId || null,
    location: opts.location || 'Personal hangar',
    modified: opts.modified || '2d ago'
  };
};
const PERSONAL_ITEMS = [rec(101, 96, {
  location: 'ARC-L1 Storage',
  modified: '2h ago'
}), rec(103, 31, {
  sharedOrgId: 1,
  location: 'CRU-L1 Storage',
  modified: '5h ago'
}), rec(104, 23, {
  location: 'Lyria Outpost',
  modified: '1d ago'
}), rec(301, 61, {
  sharedOrgId: 1,
  location: 'CRU-L1',
  modified: '3h ago'
}), rec(403, 1, {
  notes: 'Spare — for the Prospector',
  location: 'New Babbage',
  modified: '4d ago'
}), rec(501, 1, {
  location: 'Area18 · Hangar 4',
  modified: '1w ago'
}), rec(502, 2, {
  sharedOrgId: 1,
  location: 'Port Olisar',
  modified: '6h ago'
}), rec(701, 48, {
  location: 'Atlas Hangar',
  modified: '2d ago'
}), rec(901, 3, {
  location: 'Everus Harbor',
  modified: '3w ago'
}), rec(1001, 2, {
  location: 'New Babbage',
  modified: '5d ago'
}), rec(102, 54, {
  location: 'Aaron Halo cache',
  modified: '8h ago'
}), rec(202, 1240, {
  sharedOrgId: 1,
  location: 'CRU-L1 Storage',
  modified: '1h ago'
}), rec(802, 18, {
  location: 'microTech',
  modified: '2w ago'
}), rec(303, 12, {
  location: 'CRU-L1 Reclamation',
  modified: '7h ago'
})];

// org inventory records (Atlas Vanguard)
const ORG_ITEMS = [rec(101, 420, {
  location: 'Org vault · ARC-L1',
  modified: '1h ago'
}), rec(403, 6, {
  location: 'Fleet stores',
  modified: '3d ago'
}), rec(402, 9, {
  location: 'Fleet stores',
  modified: '3d ago'
}), rec(701, 240, {
  location: 'Atlas medbay',
  modified: '12h ago'
}), rec(502, 14, {
  location: 'Armory',
  modified: '1d ago'
}), rec(601, 8, {
  location: 'Armory',
  modified: '2d ago'
}), rec(301, 880, {
  location: 'Org vault · CRU-L1',
  modified: '4h ago'
}), rec(803, 320, {
  location: 'Refinery dock',
  modified: '6h ago'
})];
window.StationInv = {
  INV_CATEGORIES,
  UEX_CATALOG,
  INV_ORGS,
  PERSONAL_ITEMS,
  ORG_ITEMS,
  catById,
  catColor,
  catIcon
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/inventory-data.jsx", error: String((e && e.message) || e) }); }

// app/inventory-rows.jsx
try { (() => {
// ============================================================
// Station — Inventory page
// Reimplements the app's Inventory: personal/org views, filters,
// sort, group, density editor mode (inline qty edit + new row),
// row actions (edit/split/share/unshare/delete), catalog add dialog.
// Keyboard-first on the shared app shell.
// ============================================================

const NI = window.StationIcon;
const {
  INV_CATEGORIES,
  UEX_CATALOG,
  INV_ORGS,
  PERSONAL_ITEMS,
  ORG_ITEMS,
  catColor,
  catIcon
} = window.StationInv;
const qfmt = n => Number(n).toLocaleString('en-US', {
  maximumFractionDigits: 6
});
const abbr = n => n >= 1e6 ? (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : String(Math.round(n));

// ============== row ==============
function InvRow({
  it,
  editing,
  orgMode,
  draft,
  qtyState,
  qtyErr,
  isActive,
  tabIndex,
  regRef,
  onSelect,
  onQtyFocus,
  onQtyChange,
  onQtyCommit,
  onAction
}) {
  const shared = it.sharedOrgId;
  const org = INV_ORGS.find(o => o.id === it.sharedOrgId);
  return /*#__PURE__*/React.createElement("tr", {
    ref: regRef,
    tabIndex: tabIndex,
    "aria-selected": isActive,
    onFocus: onSelect
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "t-ent"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inv-thumb"
  }, /*#__PURE__*/React.createElement(NI, {
    n: catIcon(it.categoryName)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, it.itemName), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, it.notes ? it.notes : it.location)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "divc",
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "catdot",
    style: {
      background: catColor(it.categoryName)
    }
  }), it.categoryName)), /*#__PURE__*/React.createElement("td", {
    className: "qty-cell"
  }, editing ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "qty-edit"
  }, /*#__PURE__*/React.createElement("input", {
    className: "qty-input",
    type: "text",
    inputMode: "decimal",
    value: draft != null ? draft : it.quantity,
    ref: regRef ? undefined : undefined,
    onFocus: onQtyFocus,
    onChange: e => onQtyChange(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onQtyCommit(true);
      }
    },
    onBlur: () => onQtyCommit(false),
    "aria-label": 'Quantity for ' + it.itemName
  }), /*#__PURE__*/React.createElement("span", {
    className: 'qty-state ' + (qtyState || '')
  }, qtyState === 'saving' && /*#__PURE__*/React.createElement(NI, {
    n: "loader"
  }), qtyState === 'saved' && /*#__PURE__*/React.createElement(NI, {
    n: "check"
  }))), qtyErr && /*#__PURE__*/React.createElement("div", {
    className: "qty-err"
  }, qtyErr)) : /*#__PURE__*/React.createElement("span", {
    className: "qty-static",
    tabIndex: -1
  }, qfmt(it.quantity))), /*#__PURE__*/React.createElement("td", null, orgMode ? /*#__PURE__*/React.createElement(StatusPill, {
    tone: "brand",
    icon: "building-2"
  }, "Org stock") : shared ? /*#__PURE__*/React.createElement(StatusPill, {
    tone: "success",
    icon: "share-2"
  }, org ? org.name : 'Shared') : /*#__PURE__*/React.createElement(StatusPill, {
    tone: "neutral",
    icon: "lock"
  }, "Private")), /*#__PURE__*/React.createElement("td", {
    className: "t-muted t-mono",
    style: {
      fontSize: 'var(--text-xs)'
    }
  }, it.modified), /*#__PURE__*/React.createElement("td", {
    style: {
      width: 44
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "row-act",
    "aria-label": 'Actions for ' + it.itemName,
    onClick: e => {
      e.stopPropagation();
      onAction(e.currentTarget, it);
    }
  }, /*#__PURE__*/React.createElement(NI, {
    n: "more-horizontal"
  }))));
}

// ============== new row (editor mode) ==============
function NewRow({
  orgMode,
  onAdd
}) {
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(null);
  const [qty, setQty] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [hi, setHi] = React.useState(0);
  const itemRef = React.useRef(null);
  const matches = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return UEX_CATALOG.slice(0, 8);
    return UEX_CATALOG.filter(c => c.name.toLowerCase().includes(s)).slice(0, 8);
  }, [q]);
  const choose = c => {
    setSel(c);
    setQ(c.name);
    setOpen(false);
  };
  const save = () => {
    if (!sel) {
      itemRef.current && itemRef.current.focus();
      return;
    }
    const n = Number(qty);
    if (!Number.isFinite(n) || n <= 0) return;
    onAdd(sel, n);
    setSel(null);
    setQ('');
    setQty('');
    setHi(0);
    itemRef.current && itemRef.current.focus();
  };
  return /*#__PURE__*/React.createElement("tr", {
    className: "new-row"
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: 2
  }, /*#__PURE__*/React.createElement("div", {
    className: "new-row-item"
  }, /*#__PURE__*/React.createElement(NI, {
    n: "plus"
  }), /*#__PURE__*/React.createElement("input", {
    ref: itemRef,
    value: q,
    placeholder: orgMode ? 'Add org item — search catalog…' : 'Add item — search catalog…',
    onChange: e => {
      setQ(e.target.value);
      setSel(null);
      setOpen(true);
      setHi(0);
    },
    onFocus: () => setOpen(true),
    onKeyDown: e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHi(h => Math.min(matches.length - 1, h + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHi(h => Math.max(0, h - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (matches[hi]) choose(matches[hi]);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    onBlur: () => setTimeout(() => setOpen(false), 150)
  }), open && matches.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "nr-suggest"
  }, matches.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.uexId,
    className: 'nr-opt' + (i === hi ? ' active' : ''),
    onMouseDown: e => {
      e.preventDefault();
      choose(c);
    },
    onMouseEnter: () => setHi(i)
  }, /*#__PURE__*/React.createElement("span", {
    className: "catdot",
    style: {
      background: catColor((INV_CATEGORIES.find(x => x.id === c.categoryId) || {}).name)
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "cat"
  }, (INV_CATEGORIES.find(x => x.id === c.categoryId) || {}).name)))))), /*#__PURE__*/React.createElement("td", {
    className: "qty-cell"
  }, /*#__PURE__*/React.createElement("input", {
    className: "new-row-qty",
    type: "text",
    inputMode: "decimal",
    placeholder: "Qty",
    value: qty,
    onChange: e => setQty(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        save();
      }
    },
    "aria-label": "New item quantity"
  })), /*#__PURE__*/React.createElement("td", {
    colSpan: 2
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: save
  }, /*#__PURE__*/React.createElement(NI, {
    n: "check"
  }), " Add row")), /*#__PURE__*/React.createElement("td", null));
}
window.InvRow = InvRow;
window.NewRow = NewRow;
window._invHelpers = {
  qfmt,
  abbr
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/inventory-rows.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Compact status / category label. Mono-cased pill used across Station
 * for fleet readiness, contract states, plan tiers, etc.
 */
function Badge({
  tone = 'brand',
  variant = 'soft',
  children,
  style,
  ...rest
}) {
  const palette = {
    brand: {
      c: 'var(--brand)',
      soft: 'var(--brand-subtle)'
    },
    warm: {
      c: 'var(--coral-500)',
      soft: 'color-mix(in srgb, var(--coral-500) 18%, transparent)'
    },
    success: {
      c: 'var(--success-500)',
      soft: 'color-mix(in srgb, var(--success-500) 16%, transparent)'
    },
    warning: {
      c: 'var(--warning-500)',
      soft: 'color-mix(in srgb, var(--warning-500) 18%, transparent)'
    },
    danger: {
      c: 'var(--danger-500)',
      soft: 'color-mix(in srgb, var(--danger-500) 16%, transparent)'
    },
    neutral: {
      c: 'var(--text-muted)',
      soft: 'var(--surface-sunken)'
    }
  };
  const p = palette[tone] || palette.brand;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xs)',
    fontWeight: 'var(--weight-semibold)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--tracking-wide)',
    padding: '3px 9px',
    borderRadius: 'var(--radius-pill)',
    lineHeight: 1.5,
    ...(variant === 'solid' ? {
      background: p.c,
      color: tone === 'brand' ? 'var(--brand-contrast)' : '#fff'
    } : {
      background: p.soft,
      color: p.c
    }),
    ...style
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Presstronic / Station primary action button.
 * Styled entirely from design-system tokens so it adapts to light/dark
 * and to the Station sub-brand automatically.
 */
function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  href,
  disabled = false,
  iconLeft,
  iconRight,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '9px 16px',
      fontSize: 'var(--text-sm)'
    },
    md: {
      padding: '13px 22px',
      fontSize: 'var(--text-sm)'
    },
    lg: {
      padding: '16px 28px',
      fontSize: 'var(--text-base)'
    }
  };
  const variants = {
    primary: {
      background: 'var(--brand)',
      color: 'var(--brand-contrast)',
      borderColor: 'transparent',
      boxShadow: 'var(--glow-aqua)'
    },
    warm: {
      background: 'var(--coral-500)',
      color: 'var(--white)',
      borderColor: 'transparent',
      boxShadow: 'var(--glow-coral)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'var(--border-strong)',
      boxShadow: 'none'
    },
    subtle: {
      background: 'var(--brand-subtle)',
      color: 'var(--brand)',
      borderColor: 'transparent',
      boxShadow: 'none'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 1,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform 120ms cubic-bezier(0.22,1,0.36,1), background 200ms, box-shadow 200ms, border-color 200ms',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, iconLeft, children, iconRight);
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      style: base
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: base
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// dashboard/DashboardApp.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
// Station — post-login dashboard (DashboardApp)
// Rebuilds the real Dashboard + InventoryPortlet on Presstronic tokens.
// Tweaks: data state (empty/populated), summary-card style, accent.
// ============================================================

const USER = {
  name: 'hezeqiah',
  email: 'hez@station.app'
};

// ---- mock data: populated state ------------------------------
const ITEMS_FULL = [{
  name: '100i Frostbite Livery',
  sku: 'UEX-100I-FRB',
  cat: 'Liveries',
  qty: 3,
  loc: 'Everus Harbor',
  status: 'Private',
  tone: 'neutral',
  ico: 'paintbrush'
}, {
  name: 'Demeco LMG',
  sku: 'UEX-WPN-DMC',
  cat: 'Personal Weapons',
  qty: 1,
  loc: 'Area18 · Hangar 4',
  status: 'Atlas Vanguard',
  tone: 'brand',
  ico: 'crosshair'
}, {
  name: 'P8-AR Assault Rifle',
  sku: 'UEX-WPN-P8AR',
  cat: 'Personal Weapons',
  qty: 2,
  loc: 'Port Olisar',
  status: 'Atlas Vanguard',
  tone: 'brand',
  ico: 'crosshair'
}, {
  name: 'Quantanium',
  sku: 'UEX-MAT-QNT',
  cat: 'Mining · Refined',
  qty: 1240,
  loc: 'CRU-L1 Storage',
  status: 'Shared',
  tone: 'success',
  ico: 'gem'
}, {
  name: 'Medical Supplies',
  sku: 'UEX-MED-SUP',
  cat: 'Consumables',
  qty: 48,
  loc: 'Atlas Hangar',
  status: 'Atlas Vanguard',
  tone: 'brand',
  ico: 'cross'
}, {
  name: 'Greycat ROC',
  sku: 'UEX-VEH-ROC',
  cat: 'Vehicles',
  qty: 2,
  loc: 'New Babbage',
  status: 'Private',
  tone: 'neutral',
  ico: 'truck'
}];
const ITEMS_EMPTY = [{
  name: '100i Frostbite Livery',
  sku: 'UEX-100I-FRB',
  cat: 'Liveries',
  qty: 3,
  loc: 'Unknown',
  status: 'Private',
  tone: 'neutral',
  ico: 'paintbrush'
}, {
  name: 'Demeco LMG',
  sku: 'UEX-WPN-DMC',
  cat: 'Personal Weapons',
  qty: 1,
  loc: 'Unknown',
  status: 'Private',
  tone: 'neutral',
  ico: 'crosshair'
}, {
  name: 'P8-AR Assault Rifle',
  sku: 'UEX-WPN-P8AR',
  cat: 'Personal Weapons',
  qty: 2,
  loc: 'Unknown',
  status: 'Private',
  tone: 'neutral',
  ico: 'crosshair'
}];
const Icon = ({
  n,
  ...p
}) => /*#__PURE__*/React.createElement("i", _extends({
  "data-lucide": n
}, p));

// ---- top bar -------------------------------------------------
function TopBar() {
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "logo",
    href: "#",
    "aria-label": "Station home"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "orbit"
  })), /*#__PURE__*/React.createElement("span", {
    className: "logo-word"
  }, "STATION")), /*#__PURE__*/React.createElement("nav", {
    className: "topbar-nav"
  }, /*#__PURE__*/React.createElement("a", {
    className: "topnav-link active",
    href: "#"
  }, "Overview"), /*#__PURE__*/React.createElement("a", {
    className: "topnav-link",
    href: "#"
  }, "Organizations"), /*#__PURE__*/React.createElement("a", {
    className: "topnav-link",
    href: "#"
  }, "Inventory"), /*#__PURE__*/React.createElement("a", {
    className: "topnav-link",
    href: "#"
  }, "Members")), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  })), /*#__PURE__*/React.createElement("button", {
    className: "avatar",
    "aria-label": "Account menu"
  }, USER.name.charAt(0).toUpperCase()))));
}

// ---- welcome + quick stats -----------------------------------
function Welcome({
  populated
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "welcome"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow welcome-eyebrow"
  }, "Command center"), /*#__PURE__*/React.createElement("h1", null, "Welcome back, ", /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, USER.name), "."), /*#__PURE__*/React.createElement("p", {
    className: "welcome-sub"
  }, USER.email)), /*#__PURE__*/React.createElement("div", {
    className: "welcome-actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "settings-2"
  }), " Settings"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-sm",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "plus"
  }), " New organization")));
}
function QuickStats() {
  const stats = [{
    k: 'Total items',
    ki: 'package',
    v: '1,296',
    d: '6 categories'
  }, {
    k: 'Organizations',
    ki: 'users',
    v: '2',
    d: 'Atlas Vanguard +1'
  }, {
    k: 'Shared items',
    ki: 'share-2',
    v: '291',
    d: '22% of inventory'
  }, {
    k: 'Est. value',
    ki: 'coins',
    v: '8.42M',
    d: '+4.1% this cycle',
    up: true
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "qstats"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    className: "qstat",
    key: s.k
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: s.ki
  }), " ", s.k), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, s.v), /*#__PURE__*/React.createElement("div", {
    className: 'd' + (s.up ? ' up' : '')
  }, s.d))));
}

// ---- summary cards -------------------------------------------
function SummaryCards({
  populated,
  cardStyle
}) {
  if (cardStyle === 'stat' && populated) {
    return /*#__PURE__*/React.createElement("section", {
      className: "summary-grid",
      "data-style": "stat"
    }, /*#__PURE__*/React.createElement("article", {
      className: "scard link"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-ico"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "user-round"
    })), /*#__PURE__*/React.createElement("h3", null, "My Profile"), /*#__PURE__*/React.createElement("p", null, "View and update your profile, handle, and contact details."), /*#__PURE__*/React.createElement("div", {
      className: "scard-foot"
    }, /*#__PURE__*/React.createElement("a", {
      className: "btn btn-ghost btn-sm",
      href: "#"
    }, "Open profile ", /*#__PURE__*/React.createElement(Icon, {
      n: "arrow-right"
    })))), /*#__PURE__*/React.createElement("article", {
      className: "scard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-ico"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "users"
    })), /*#__PURE__*/React.createElement("h3", null, "Organizations"), /*#__PURE__*/React.createElement("div", {
      className: "big"
    }, "2"), /*#__PURE__*/React.createElement("p", null, "Atlas Vanguard \xB7 Crimson Fleet"), /*#__PURE__*/React.createElement("div", {
      className: "scard-foot"
    }, /*#__PURE__*/React.createElement("a", {
      className: "btn btn-ghost btn-sm",
      href: "#"
    }, "Manage orgs ", /*#__PURE__*/React.createElement(Icon, {
      n: "arrow-right"
    })))), /*#__PURE__*/React.createElement("article", {
      className: "scard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-ico"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "mail"
    })), /*#__PURE__*/React.createElement("h3", null, "Invitations"), /*#__PURE__*/React.createElement("div", {
      className: "big"
    }, "1"), /*#__PURE__*/React.createElement("p", null, "Hollow Point Mercenaries invited you."), /*#__PURE__*/React.createElement("div", {
      className: "scard-foot"
    }, /*#__PURE__*/React.createElement("a", {
      className: "btn btn-primary btn-sm",
      href: "#"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "check"
    }), " Review"))));
  }
  if (populated) {
    return /*#__PURE__*/React.createElement("section", {
      className: "summary-grid"
    }, /*#__PURE__*/React.createElement("article", {
      className: "scard link"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-ico"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "user-round"
    })), /*#__PURE__*/React.createElement("h3", null, "My Profile"), /*#__PURE__*/React.createElement("p", null, "View and update your profile information, handle, and contact details."), /*#__PURE__*/React.createElement("div", {
      className: "scard-foot"
    }, /*#__PURE__*/React.createElement("a", {
      className: "btn btn-ghost btn-sm",
      href: "#"
    }, "Open profile ", /*#__PURE__*/React.createElement(Icon, {
      n: "arrow-right"
    })))), /*#__PURE__*/React.createElement("article", {
      className: "scard"
    }, /*#__PURE__*/React.createElement("span", {
      className: "scard-count"
    }, "2 orgs"), /*#__PURE__*/React.createElement("div", {
      className: "scard-ico"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "users"
    })), /*#__PURE__*/React.createElement("h3", null, "My Organizations"), /*#__PURE__*/React.createElement("div", {
      className: "org-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "org-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "org-badge"
    }, "AV"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "org-name"
    }, "Atlas Vanguard"), /*#__PURE__*/React.createElement("div", {
      className: "org-meta"
    }, "Quartermaster \xB7 312 members"))), /*#__PURE__*/React.createElement("div", {
      className: "org-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "org-badge",
      style: {
        background: 'linear-gradient(140deg, var(--coral-300), var(--coral-500))'
      }
    }, "CF"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "org-name"
    }, "Crimson Fleet"), /*#__PURE__*/React.createElement("div", {
      className: "org-meta"
    }, "Member \xB7 88 members"))))), /*#__PURE__*/React.createElement("article", {
      className: "scard"
    }, /*#__PURE__*/React.createElement("span", {
      className: "scard-count"
    }, "1 new"), /*#__PURE__*/React.createElement("div", {
      className: "scard-ico"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "mail"
    })), /*#__PURE__*/React.createElement("h3", null, "Invitations"), /*#__PURE__*/React.createElement("div", {
      className: "org-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "inv-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "org-badge",
      style: {
        background: 'linear-gradient(140deg, var(--teal-300), var(--teal-500))'
      }
    }, "HP"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "inv-name"
    }, "Hollow Point Mercenaries"), /*#__PURE__*/React.createElement("div", {
      className: "inv-meta"
    }, "Invited you as Operative")))), /*#__PURE__*/React.createElement("div", {
      className: "scard-foot",
      style: {
        display: 'flex',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("a", {
      className: "btn btn-primary btn-sm",
      href: "#"
    }, /*#__PURE__*/React.createElement(Icon, {
      n: "check"
    }), " Accept"), /*#__PURE__*/React.createElement("a", {
      className: "btn btn-ghost btn-sm",
      href: "#"
    }, "Decline"))));
  }

  // empty / new-user state (matches the screenshot)
  return /*#__PURE__*/React.createElement("section", {
    className: "summary-grid"
  }, /*#__PURE__*/React.createElement("article", {
    className: "scard link"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scard-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "user-round"
  })), /*#__PURE__*/React.createElement("h3", null, "My Profile"), /*#__PURE__*/React.createElement("p", null, "View and update your profile information."), /*#__PURE__*/React.createElement("div", {
    className: "scard-foot"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: "#"
  }, "Open profile ", /*#__PURE__*/React.createElement(Icon, {
    n: "arrow-right"
  })))), /*#__PURE__*/React.createElement("article", {
    className: "scard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scard-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "users"
  })), /*#__PURE__*/React.createElement("h3", null, "My Organizations"), /*#__PURE__*/React.createElement("p", null, "You are not a member of any organizations yet."), /*#__PURE__*/React.createElement("div", {
    className: "scard-foot"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-sm",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "plus"
  }), " Create organization"))), /*#__PURE__*/React.createElement("article", {
    className: "scard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scard-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "mail"
  })), /*#__PURE__*/React.createElement("h3", null, "Invitations"), /*#__PURE__*/React.createElement("p", null, "No pending invitations."), /*#__PURE__*/React.createElement("div", {
    className: "scard-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip-badge neutral"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "inbox"
  }), " Inbox zero"))));
}

// ---- inventory portlet ---------------------------------------
function InventoryPortlet({
  populated
}) {
  const items = populated ? ITEMS_FULL : ITEMS_EMPTY;
  const [sharedOnly, setSharedOnly] = React.useState(false);
  const shown = sharedOnly ? items.filter(i => i.status !== 'Private') : items;
  return /*#__PURE__*/React.createElement("section", {
    className: "portlet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "portlet-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "portlet-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "archive"
  })), /*#__PURE__*/React.createElement("div", {
    className: "portlet-title"
  }, "My Inventory", /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Synced from UEX \xB7 Star Citizen")), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    "aria-label": "Expand inventory"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "maximize-2"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "portlet-controls"
  }, /*#__PURE__*/React.createElement("label", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "search"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search items\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "select"
  }, /*#__PURE__*/React.createElement("span", null, "All categories"), /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-down"
  })), /*#__PURE__*/React.createElement("div", {
    className: 'toggle-field' + (sharedOnly ? ' on' : ''),
    onClick: () => setSharedOnly(v => !v),
    role: "switch",
    "aria-checked": sharedOnly
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch"
  }), /*#__PURE__*/React.createElement("span", null, "Shared only"))), shown.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "inv-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "e-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "package-open"
  })), /*#__PURE__*/React.createElement("p", null, "No items match \u2014 try turning off \u201CShared only\u201D.")) : /*#__PURE__*/React.createElement("table", {
    className: "inv-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Quantity"), /*#__PURE__*/React.createElement("th", null, "Location"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, shown.map(it => /*#__PURE__*/React.createElement("tr", {
    key: it.sku
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "inv-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "thumb"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: it.ico
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, it.name), /*#__PURE__*/React.createElement("div", {
    className: "sku"
  }, it.sku)))), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, it.cat), /*#__PURE__*/React.createElement("td", {
    className: "cell-num"
  }, it.qty.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, it.loc), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'chip-badge ' + it.tone
  }, it.tone === 'brand' && /*#__PURE__*/React.createElement(Icon, {
    n: "shield"
  }), it.tone === 'success' && /*#__PURE__*/React.createElement(Icon, {
    n: "share-2"
  }), it.tone === 'neutral' && /*#__PURE__*/React.createElement(Icon, {
    n: "lock"
  }), it.status)))))), /*#__PURE__*/React.createElement("div", {
    className: "pagination"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rpp"
  }, "Rows per page: ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, "10 ", /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-down"
  }))), /*#__PURE__*/React.createElement("span", null, "1\u2013", shown.length, " of ", shown.length), /*#__PURE__*/React.createElement("div", {
    className: "pager"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: true,
    "aria-label": "Previous page"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-left"
  })), /*#__PURE__*/React.createElement("button", {
    disabled: true,
    "aria-label": "Next page"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-right"
  })))));
}

// ---- quick actions -------------------------------------------
function QuickActions({
  populated
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "qactions"
  }, /*#__PURE__*/React.createElement("h2", null, "Quick actions"), /*#__PURE__*/React.createElement("div", {
    className: "qactions-row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "users"
  }), " ", populated ? 'New organization' : 'Create organization'), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "user-round-pen"
  }), " Edit profile"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "package-plus"
  }), " Add inventory item"), populated && /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "scroll-text"
  }), " Post contract")));
}

// ---- tweaks defaults -----------------------------------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dataState": "Populated",
  "cardStyle": "Detailed",
  "accent": "Aqua"
} /*EDITMODE-END*/;
function DashboardApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const populated = String(t.dataState || 'Populated') === 'Populated';
  const accent = String(t.accent || 'Aqua').toLowerCase();
  const cardStyle = String(t.cardStyle || 'Detailed') === 'Stat tiles' ? 'stat' : 'detailed';
  return /*#__PURE__*/React.createElement("div", {
    className: "dash station",
    "data-theme": "dark",
    "data-accent": accent
  }, /*#__PURE__*/React.createElement(TopBar, null), /*#__PURE__*/React.createElement("main", {
    className: "dash-main"
  }, /*#__PURE__*/React.createElement(Welcome, {
    populated: populated
  }), populated && /*#__PURE__*/React.createElement(QuickStats, null), /*#__PURE__*/React.createElement(SummaryCards, {
    populated: populated,
    cardStyle: cardStyle
  }), /*#__PURE__*/React.createElement(InventoryPortlet, {
    populated: populated
  }), /*#__PURE__*/React.createElement(QuickActions, {
    populated: populated
  })), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Data"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "State",
    value: t.dataState,
    options: ['Empty', 'Populated'],
    onChange: v => setTweak('dataState', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Layout"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Summary cards",
    value: t.cardStyle,
    options: ['Detailed', 'Stat tiles'],
    onChange: v => setTweak('cardStyle', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Brand"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Accent",
    value: t.accent,
    options: ['Aqua', 'Coral'],
    onChange: v => setTweak('accent', v)
  })));
}
window.DashboardApp = DashboardApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/DashboardApp.jsx", error: String((e && e.message) || e) }); }

// dashboard/DashboardGrid.jsx
try { (() => {
// ============================================================
// Station — customizable dashboard (v2)
// Edit-Layout mode + HTML5 drag-and-drop reorder into fixed grid zones,
// layout persistence, preset profiles (Miner/Salvager/Hauler), reset.
// Depends on portlets.jsx (window.Portlet / PORTLETS / LAYOUTS / PIcon).
// ============================================================

const LS_KEY = 'station-dash-layout-v2';
const THEME_KEY = 'station-dash-theme';
const RAIL_KEY = 'station-dash-rail';
const ALL_IDS = Object.keys(PORTLETS);

// shared nav (mirrors the app shell so the rail feels identical across screens)
const RAIL_NAV = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'layout-dashboard',
  href: '#',
  active: true
}, {
  id: 'workorders',
  label: 'Work Orders',
  icon: 'pickaxe',
  href: '../app/Work Orders.html'
}, {
  id: 'contracts',
  label: 'Contracts',
  icon: 'scroll-text',
  href: '../app/Contracts.html'
}, {
  id: 'fleet',
  label: 'Fleet',
  icon: 'rocket',
  href: '../app/Fleet.html'
}, {
  id: 'members',
  label: 'Members',
  icon: 'users',
  href: '../app/Members.html'
}];
const RAIL_NAV2 = [{
  id: 'inventory',
  label: 'Inventory',
  icon: 'archive',
  href: '../app/Inventory.html'
}, {
  id: 'treasury',
  label: 'Treasury',
  icon: 'landmark',
  href: '../app/Treasury.html'
}];

// ---- collapsible rail (defaults collapsed on the dashboard) --------
function DashSidebar({
  collapsed,
  onToggle
}) {
  const linkEl = n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    className: 'dr-link' + (n.active ? ' active' : ''),
    href: n.active ? undefined : n.href,
    "aria-current": n.active ? 'page' : undefined,
    title: collapsed ? n.label : undefined
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: n.icon
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, n.label));
  return /*#__PURE__*/React.createElement("aside", {
    className: "dash-rail",
    "aria-label": "Primary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dr-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dr-badge"
  }, "AV"), /*#__PURE__*/React.createElement("span", {
    className: "dr-org"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, "Atlas Vanguard"), /*#__PURE__*/React.createElement("span", {
    className: "role"
  }, "Quartermaster"))), /*#__PURE__*/React.createElement("nav", {
    className: "dr-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dr-cap"
  }, "Operations"), RAIL_NAV.map(linkEl), /*#__PURE__*/React.createElement("div", {
    className: "dr-cap"
  }, "Assets"), RAIL_NAV2.map(linkEl)), /*#__PURE__*/React.createElement("div", {
    className: "dr-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dr-toggle",
    onClick: onToggle,
    "aria-label": collapsed ? 'Expand sidebar' : 'Collapse sidebar',
    title: collapsed ? 'Expand' : 'Collapse'
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "chevrons-left"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Collapse"))));
}

// keep a saved order valid against the current registry
function reconcile(arr) {
  const seen = new Set();
  const out = [];
  arr.forEach(id => {
    if (PORTLETS[id] && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  });
  ALL_IDS.forEach(id => {
    if (!seen.has(id)) out.push(id);
  });
  return out;
}
function loadSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY));
    if (Array.isArray(s) && s.length) return reconcile(s);
  } catch (e) {/* ignore */}
  return null;
}
function persist(order) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(order));
  } catch (e) {/* ignore */}
}

// ---- top bar (self-contained) --------------------------------
function TopBar({
  theme,
  onToggleTheme,
  onToggleRail
}) {
  const dark = theme === 'dark';
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar-inner"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn topbar-railbtn",
    onClick: onToggleRail,
    "aria-label": "Toggle sidebar",
    title: "Toggle sidebar"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "panel-left"
  })), /*#__PURE__*/React.createElement("a", {
    className: "logo",
    href: "#",
    "aria-label": "Station home"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "orbit"
  })), /*#__PURE__*/React.createElement("span", {
    className: "logo-word"
  }, "STATION"))), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: onToggleTheme,
    "aria-label": dark ? 'Switch to light mode' : 'Switch to dark mode',
    title: dark ? 'Light mode' : 'Dark mode'
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: dark ? 'sun' : 'moon'
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  })), /*#__PURE__*/React.createElement("button", {
    className: "avatar",
    "aria-label": "Account menu"
  }, "H"))));
}
function DashboardGridApp() {
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "layout": "Default",
    "accent": "Aqua"
  } /*EDITMODE-END*/);
  const [order, setOrder] = React.useState(() => loadSaved() || LAYOUTS[String(t.layout)] || LAYOUTS.Default);
  const [editing, setEditing] = React.useState(false);
  const [editBase, setEditBase] = React.useState(null); // snapshot for Cancel
  const [dragId, setDragId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);

  // ---- theme (light-first token system; dark is the product default) ----
  const [theme, setTheme] = React.useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {/* ignore */}
  }, [theme]);
  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

  // ---- rail (collapsed by default on the dashboard; persisted) ----
  const [rail, setRail] = React.useState(() => {
    try {
      return localStorage.getItem(RAIL_KEY) || 'collapsed';
    } catch (e) {
      return 'collapsed';
    }
  });
  React.useEffect(() => {
    try {
      localStorage.setItem(RAIL_KEY, rail);
    } catch (e) {}
  }, [rail]);
  const toggleRail = () => setRail(p => p === 'collapsed' ? 'expanded' : 'collapsed');

  // apply a preset when the Tweak changes (but not on first mount)
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const next = LAYOUTS[String(t.layout)] || LAYOUTS.Default;
    setEditing(false);
    setOrder(next);
    persist(next);
  }, [t.layout]);

  // (re)build Lucide glyphs after each render
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const accent = String(t.accent || 'Aqua').toLowerCase();

  // ---- edit session controls ----
  const startEdit = () => {
    setEditBase(order);
    setEditing(true);
  };
  const cancelEdit = () => {
    if (editBase) setOrder(editBase);
    setEditing(false);
    setDragId(null);
    setOverId(null);
  };
  const saveEdit = () => {
    persist(order);
    setEditing(false);
    setDragId(null);
    setOverId(null);
  };
  const resetLayout = () => {
    const def = LAYOUTS[String(t.layout)] || LAYOUTS.Default;
    setOrder(def);
  };

  // ---- drag-and-drop reorder (insert dragged before target) ----
  const move = (drag, target) => {
    if (!drag || drag === target) return;
    setOrder(prev => {
      const arr = prev.filter(id => id !== drag);
      const idx = arr.indexOf(target);
      arr.splice(idx < 0 ? arr.length : idx, 0, drag);
      return arr;
    });
  };
  const dragPropsFor = id => editing ? {
    draggable: true,
    onDragStart: e => {
      setDragId(id);
      e.dataTransfer.effectAllowed = 'move';
      try {
        e.dataTransfer.setData('text/plain', id);
      } catch (x) {}
    },
    onDragOver: e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (overId !== id) setOverId(id);
    },
    onDragLeave: () => {
      if (overId === id) setOverId(null);
    },
    onDrop: e => {
      e.preventDefault();
      move(dragId, id);
      setDragId(null);
      setOverId(null);
    },
    onDragEnd: () => {
      setDragId(null);
      setOverId(null);
    }
  } : {};
  return /*#__PURE__*/React.createElement("div", {
    className: "dash station",
    "data-theme": theme,
    "data-accent": accent,
    "data-rail": rail
  }, /*#__PURE__*/React.createElement(DashSidebar, {
    collapsed: rail === 'collapsed',
    onToggle: toggleRail
  }), /*#__PURE__*/React.createElement("div", {
    className: "dash-shellcol"
  }, /*#__PURE__*/React.createElement(TopBar, {
    theme: theme,
    onToggleTheme: toggleTheme,
    onToggleRail: toggleRail
  }), /*#__PURE__*/React.createElement("main", {
    className: "dash-main",
    "data-comment-anchor": "b6e8155b74-main-179-9"
  }, /*#__PURE__*/React.createElement("section", {
    className: "welcome"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow welcome-eyebrow"
  }, "Command center"), /*#__PURE__*/React.createElement("h1", null, "Welcome back, ", /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "hezeqiah"), "."), /*#__PURE__*/React.createElement("p", {
    className: "welcome-sub"
  }, "Your dashboard, your way \u2014 arrange portlets around how you play.")), /*#__PURE__*/React.createElement("div", {
    className: "welcome-actions"
  }, !editing && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm edit-toggle",
    onClick: startEdit
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "layout-grid"
  }), " Edit layout"))), editing && /*#__PURE__*/React.createElement("div", {
    className: "edit-banner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eb-ico"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "move"
  })), /*#__PURE__*/React.createElement("div", {
    className: "eb-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eb-title"
  }, "Customizing your dashboard"), /*#__PURE__*/React.createElement("div", {
    className: "eb-sub"
  }, "Drag any portlet by its handle to move it into a new zone.")), /*#__PURE__*/React.createElement("div", {
    className: "eb-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-link",
    onClick: resetLayout
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "rotate-ccw"
  }), " Reset to default"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: cancelEdit
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: saveEdit
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "check"
  }), " Save layout"))), /*#__PURE__*/React.createElement("section", {
    className: 'pgrid' + (editing ? ' editing' : '')
  }, order.map(id => {
    const def = PORTLETS[id];
    if (!def) return null;
    const Body = def.Body;
    return /*#__PURE__*/React.createElement(Portlet, {
      key: id,
      id: id,
      icon: def.icon,
      title: def.title,
      href: def.href,
      full: def.full,
      editing: editing,
      dragging: dragId === id,
      dropTarget: editing && overId === id && dragId !== id,
      dragProps: dragPropsFor(id)
    }, /*#__PURE__*/React.createElement(Body, null));
  })))), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Layout profile"
  }), /*#__PURE__*/React.createElement(TweakSelect, {
    label: "Starting layout",
    value: t.layout,
    options: ['Default', 'Miner', 'Salvager', 'Hauler'],
    onChange: v => setTweak('layout', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Brand"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Accent",
    value: t.accent,
    options: ['Aqua', 'Coral'],
    onChange: v => setTweak('accent', v)
  })));
}
window.DashboardGridApp = DashboardGridApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/DashboardGrid.jsx", error: String((e && e.message) || e) }); }

// dashboard/portlets.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
// Station — portlet library (v2)
// A uniform Portlet shell + 10 portlet bodies + registry + presets.
// Every portlet is a self-contained card so it can be dragged into any
// grid zone. Exposed on window for DashboardGrid.jsx.
// ============================================================

const PIcon = ({
  n,
  ...p
}) => /*#__PURE__*/React.createElement("i", _extends({
  "data-lucide": n
}, p));

// ---- uniform shell -------------------------------------------
// dragHandlers + editing are injected by the grid; content is `children`.
function Portlet({
  id,
  icon,
  title,
  action,
  href,
  full,
  editing,
  dragging,
  dropTarget,
  dragProps = {},
  children
}) {
  const headAction = action || (href && !editing ? /*#__PURE__*/React.createElement("a", {
    className: "pcard-act",
    href: href,
    "aria-label": 'Open ' + title,
    title: 'Open ' + title,
    onClick: e => e.stopPropagation(),
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "arrow-up-right"
  })) : /*#__PURE__*/React.createElement("button", {
    className: "pcard-act",
    "aria-label": "Portlet options"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "more-horizontal"
  })));
  return /*#__PURE__*/React.createElement("article", _extends({
    className: 'pcard' + (full ? ' pcard--full' : '') + (dragging ? ' dragging' : '') + (dropTarget ? ' drop-target' : ''),
    "data-portlet": id
  }, dragProps), /*#__PURE__*/React.createElement("div", {
    className: "pcard-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pcard-grip",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "grip-vertical"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pcard-ico"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "pcard-title"
  }, title), headAction), /*#__PURE__*/React.createElement("div", {
    className: "pcard-body"
  }, children));
}

// ---- compact bodies ------------------------------------------
function MiningBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "plabel"
  }, "Refined \xB7 this cycle"), /*#__PURE__*/React.createElement("div", {
    className: "pmetric"
  }, "1,240", /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "SCU")), /*#__PURE__*/React.createElement("div", {
    className: "pdelta up"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "trending-up"
  }), " +18% vs last cycle"), /*#__PURE__*/React.createElement("div", {
    className: "pbars"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      height: '40%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '62%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '48%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '78%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '55%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    className: "hi",
    style: {
      height: '96%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "gem"
  }), " Top commodity"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "Quantanium")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "pickaxe"
  }), " Active rigs"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "3"))));
}
function WorkOrdersBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "plabel"
  }, "Session net payout \xB7 Aaron Halo"), /*#__PURE__*/React.createElement("div", {
    className: "pmetric"
  }, "3.55", /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "M aUEC")), /*#__PURE__*/React.createElement("div", {
    className: "pdelta warn"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "loader"
  }), " 2 jobs refining now"), /*#__PURE__*/React.createElement("div", {
    className: "pbars"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      height: '38%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '64%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '52%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '80%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '60%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    className: "hi",
    style: {
      height: '92%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "package-check"
  }), " Ready to sell"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "1 order")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "gem"
  }), " Session yield"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "250 SCU")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "users"
  }), " Crew shares"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "5"))));
}
function SalvageBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "plabel"
  }, "Reclaimed materials"), /*#__PURE__*/React.createElement("div", {
    className: "pmetric"
  }, "318", /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "RMC")), /*#__PURE__*/React.createElement("div", {
    className: "pdelta up"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "trending-up"
  }), " +42 this week"), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "recycle"
  }), " CM stripped"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "96")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "ship"
  }), " Hulls processed"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "12")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "map-pin"
  }), " Field"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "Aaron Halo"))));
}
function HaulingBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "plabel"
  }, "Trade profit \xB7 30d"), /*#__PURE__*/React.createElement("div", {
    className: "pmetric"
  }, "2.1", /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "M aUEC")), /*#__PURE__*/React.createElement("div", {
    className: "pdelta up"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "trending-up"
  }), " +4.1% margin"), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "route"
  }), " Routes run"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "42")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "container"
  }), " Cargo moved"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "9,840 SCU")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "fuel"
  }), " Best lane"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "ARC \u2192 Hurston"))));
}
function FleetBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "plabel"
  }, "Hangar status"), /*#__PURE__*/React.createElement("div", {
    className: "pmetric"
  }, "14", /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "ships")), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pdots"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ok"
  })), " Ready"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "9")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pdots"
  }, /*#__PURE__*/React.createElement("i", {
    className: "warn"
  })), " In repair"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "2")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pdots"
  }, /*#__PURE__*/React.createElement("i", {
    className: "off"
  })), " Stored"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "3")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "rocket"
  }), " Flagship"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "Polaris"))));
}
function ContractsBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "plabel"
  }, "Org contracts"), /*#__PURE__*/React.createElement("div", {
    className: "pmetric"
  }, "5", /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "active")), /*#__PURE__*/React.createElement("div", {
    className: "pdelta warn"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "clock"
  }), " 2 due within 48h"), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "hand-coins"
  }), " Pending payout"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "1.2M")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "check-check"
  }), " Completed \xB7 30d"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "23"))));
}
function TreasuryBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "plabel"
  }, "Org treasury"), /*#__PURE__*/React.createElement("div", {
    className: "pmetric"
  }, "8.42", /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "M aUEC")), /*#__PURE__*/React.createElement("div", {
    className: "pdelta up"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "trending-up"
  }), " +4.1% this cycle"), /*#__PURE__*/React.createElement("div", {
    className: "pbars"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      height: '52%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '46%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '64%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '58%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      height: '72%'
    }
  }), /*#__PURE__*/React.createElement("i", {
    className: "hi",
    style: {
      height: '88%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "users"
  }), " Contributors"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "41"))));
}
function OrganizationsBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pmini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pavatar"
  }, "AV"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pnm"
  }, "Atlas Vanguard"), /*#__PURE__*/React.createElement("div", {
    className: "pmeta"
  }, "Quartermaster \xB7 312 members"))), /*#__PURE__*/React.createElement("div", {
    className: "pmini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pavatar",
    style: {
      background: 'linear-gradient(140deg, var(--coral-300), var(--coral-500))'
    }
  }, "CF"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pnm"
  }, "Crimson Fleet"), /*#__PURE__*/React.createElement("div", {
    className: "pmeta"
  }, "Member \xB7 88 members"))), /*#__PURE__*/React.createElement("div", {
    className: "pbtn-row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: "#"
  }, "Manage orgs ", /*#__PURE__*/React.createElement(PIcon, {
    n: "arrow-right"
  }))));
}
function InvitationsBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pmini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pavatar",
    style: {
      background: 'linear-gradient(140deg, var(--teal-300), var(--teal-500))'
    }
  }, "HP"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pnm"
  }, "Hollow Point Mercs"), /*#__PURE__*/React.createElement("div", {
    className: "pmeta"
  }, "Invited you as Operative"))), /*#__PURE__*/React.createElement("div", {
    className: "pbtn-row"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-sm",
    href: "#",
    "data-comment-anchor": "f32f68a707-a-174-9"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "check"
  }), " Accept"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: "#"
  }, "Decline")));
}
function ProfileBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pprofile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "big-av"
  }, "H"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, "hezeqiah"), /*#__PURE__*/React.createElement("div", {
    className: "pr"
  }, "Quartermaster \xB7 Atlas Vanguard"))), /*#__PURE__*/React.createElement("div", {
    className: "prows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "shield-check"
  }), " Reputation"), /*#__PURE__*/React.createElement("span", {
    className: "v brand"
  }, "Trusted")), /*#__PURE__*/React.createElement("div", {
    className: "prow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "calendar"
  }), " Member since"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "2952"))));
}

// ---- inventory body (compact reuse of the table) -------------
const INV_ROWS = [{
  name: 'Quantanium',
  sku: 'UEX-MAT-QNT',
  cat: 'Mining · Refined',
  qty: 1240,
  loc: 'CRU-L1 Storage',
  status: 'Shared',
  tone: 'success',
  ico: 'gem',
  tint: 't-cyan'
}, {
  name: 'Demeco LMG',
  sku: 'UEX-WPN-DMC',
  cat: 'Personal Weapons',
  qty: 1,
  loc: 'Area18 · Hangar 4',
  status: 'Atlas Vanguard',
  tone: 'brand',
  ico: 'crosshair',
  tint: 't-coral'
}, {
  name: '100i Frostbite Livery',
  sku: 'UEX-100I-FRB',
  cat: 'Liveries',
  qty: 3,
  loc: 'Everus Harbor',
  status: 'Private',
  tone: 'neutral',
  ico: 'paintbrush',
  tint: 't-lav'
}, {
  name: 'Medical Supplies',
  sku: 'UEX-MED-SUP',
  cat: 'Consumables',
  qty: 48,
  loc: 'Atlas Hangar',
  status: 'Atlas Vanguard',
  tone: 'brand',
  ico: 'cross',
  tint: 't-green'
}];
function InventoryBody() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "portlet-controls"
  }, /*#__PURE__*/React.createElement("label", {
    className: "search"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "search"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search items\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "select"
  }, /*#__PURE__*/React.createElement("span", null, "All categories"), /*#__PURE__*/React.createElement(PIcon, {
    n: "chevron-down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "toggle-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch"
  }), /*#__PURE__*/React.createElement("span", null, "Shared only"))), /*#__PURE__*/React.createElement("table", {
    className: "inv-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Quantity"), /*#__PURE__*/React.createElement("th", null, "Location"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, INV_ROWS.map(it => /*#__PURE__*/React.createElement("tr", {
    key: it.sku
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "inv-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'thumb ' + (it.tint || '')
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: it.ico
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, it.name), /*#__PURE__*/React.createElement("div", {
    className: "sku"
  }, it.sku)))), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, it.cat), /*#__PURE__*/React.createElement("td", {
    className: "cell-num"
  }, it.qty.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "cell-muted"
  }, it.loc), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'chip-badge ' + it.tone
  }, it.tone === 'brand' && /*#__PURE__*/React.createElement(PIcon, {
    n: "shield"
  }), it.tone === 'success' && /*#__PURE__*/React.createElement(PIcon, {
    n: "share-2"
  }), it.tone === 'neutral' && /*#__PURE__*/React.createElement(PIcon, {
    n: "lock"
  }), it.status)))))), /*#__PURE__*/React.createElement("div", {
    className: "pagination"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rpp"
  }, "Rows per page: ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, "10 ", /*#__PURE__*/React.createElement(PIcon, {
    n: "chevron-down"
  }))), /*#__PURE__*/React.createElement("span", null, "1\u20134 of 4"), /*#__PURE__*/React.createElement("div", {
    className: "pager"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: true,
    "aria-label": "Previous"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "chevron-left"
  })), /*#__PURE__*/React.createElement("button", {
    disabled: true,
    "aria-label": "Next"
  }, /*#__PURE__*/React.createElement(PIcon, {
    n: "chevron-right"
  })))));
}

// ---- registry ------------------------------------------------
const PORTLETS = {
  profile: {
    icon: 'user-round',
    title: 'My Profile',
    Body: ProfileBody,
    href: '../app/Profile.html'
  },
  invitations: {
    icon: 'mail',
    title: 'Invitations',
    Body: InvitationsBody
  },
  workorders: {
    icon: 'pickaxe',
    title: 'Work Orders',
    Body: WorkOrdersBody,
    href: '../app/Work Orders.html'
  },
  fleet: {
    icon: 'rocket',
    title: 'Fleet',
    Body: FleetBody,
    href: '../app/Fleet.html'
  },
  mining: {
    icon: 'pickaxe',
    title: 'Mining',
    Body: MiningBody
  },
  salvage: {
    icon: 'recycle',
    title: 'Salvage',
    Body: SalvageBody
  },
  hauling: {
    icon: 'truck',
    title: 'Hauling & Trade',
    Body: HaulingBody
  },
  contracts: {
    icon: 'scroll-text',
    title: 'Contracts',
    Body: ContractsBody,
    href: '../app/Contracts.html'
  },
  treasury: {
    icon: 'landmark',
    title: 'Treasury',
    Body: TreasuryBody,
    href: '../app/Treasury.html'
  },
  inventory: {
    icon: 'archive',
    title: 'My Inventory',
    Body: InventoryBody,
    full: true,
    href: '../app/Inventory.html'
  }
};

// ---- preset layouts (seed of future system-level profiles) ---
const LAYOUTS = {
  Default: ['profile', 'invitations', 'workorders', 'fleet', 'hauling', 'contracts', 'treasury', 'inventory', 'mining', 'salvage'],
  Miner: ['workorders', 'treasury', 'fleet', 'inventory', 'hauling', 'contracts', 'invitations', 'profile', 'mining', 'salvage'],
  Salvager: ['workorders', 'fleet', 'treasury', 'inventory', 'contracts', 'hauling', 'invitations', 'profile', 'salvage', 'mining'],
  Hauler: ['hauling', 'treasury', 'contracts', 'inventory', 'fleet', 'workorders', 'invitations', 'profile', 'mining', 'salvage']
};
Object.assign(window, {
  Portlet,
  PORTLETS,
  LAYOUTS,
  PIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/portlets.jsx", error: String((e && e.message) || e) }); }

// dashboard/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// landing/LandingApp.jsx
try { (() => {
// ============================================================
// Station — pre-login landing page (LandingApp)
// Real app content (Home.tsx) rebuilt on the Presstronic design system.
// Reuses the established Station classes; hero has 3 switchable layouts.
// ============================================================

const HEADLINES = {
  'Guild — “like a pro”': 'Manage your gaming guild <span class="accent">like a pro</span>.',
  'Flagship, not a spreadsheet': 'Run your org like a <span class="accent">flagship</span>, not a spreadsheet.',
  'Command center': 'Your org deserves a <span class="accent">command center</span>.'
};

// ---- product console mock (org overview) ----------------------
function Console() {
  return /*#__PURE__*/React.createElement("div", {
    className: "console",
    role: "img",
    "aria-label": "Station org command dashboard preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "console-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "console-dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
    className: "console-title"
  }, "station.app / atlas-vanguard / overview")), /*#__PURE__*/React.createElement("div", {
    className: "console-body"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "console-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-item active"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "layout-dashboard"
  }), " Overview"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rocket"
  }), " Fleet"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "package"
  }), " Inventory"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "users"
  }), " Members"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shield-check"
  }), " Roles"), /*#__PURE__*/React.createElement("div", {
    className: "side-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "landmark"
  }), " Treasury"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "scroll-text"
  }), " Contracts")), /*#__PURE__*/React.createElement("div", {
    className: "console-main"
  }, /*#__PURE__*/React.createElement("h4", null, "Atlas Vanguard ", /*#__PURE__*/React.createElement("span", {
    className: "live"
  }, "Live")), /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Members"), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "312"), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, "+18 this week")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Active Roles"), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "24"), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, "synced to Discord")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Org Treasury"), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "8.42M"), /*#__PURE__*/React.createElement("div", {
    className: "delta warm"
  }, "+4.1% this cycle"))), /*#__PURE__*/React.createElement("div", {
    className: "console-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ship-ico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shield-check"
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Fleet Officer"), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "14 members \xB7 9 scopes"), /*#__PURE__*/React.createElement("span", {
    className: "pill-badge active"
  }, "Role")), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ship-ico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "user-round"
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Vesper \u201CNyx\u201D Calderon"), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "Quartermaster"), /*#__PURE__*/React.createElement("span", {
    className: "pill-badge ready"
  }, "Online")), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ship-ico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "user-plus"
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "3 applications pending"), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "Recruitment"), /*#__PURE__*/React.createElement("span", {
    className: "pill-badge warm"
  }, "Review"))))));
}

// ---- logo + nav ----------------------------------------------
function Logo() {
  return /*#__PURE__*/React.createElement("a", {
    className: "logo",
    href: "#top",
    "aria-label": "Station home"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "orbit"
  })), /*#__PURE__*/React.createElement("span", {
    className: "logo-word"
  }, "STATION"));
}
function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    className: 'nav' + (scrolled ? ' scrolled' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-inner"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("ul", {
    className: "nav-links"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#features"
  }, "Features")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#features"
  }, "Security")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#cta"
  }, "Discord")))), /*#__PURE__*/React.createElement("div", {
    className: "nav-actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: "#"
  }, "Sign in"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-sm",
    href: "#"
  }, "Get started"))));
}

// ---- hero -----------------------------------------------------
function Hero({
  layout,
  headlineKey,
  showConsole
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lhero",
    id: "top",
    "data-hero": layout,
    "data-console": showConsole ? 'on' : 'off'
  }, /*#__PURE__*/React.createElement("div", {
    className: "lhero-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lhero-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lhero-inner wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lhero-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lhero-pill"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "New"), "Station Bot syncs roles to Discord in real time"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "For Star Citizen orgs"), /*#__PURE__*/React.createElement("h1", {
    className: "lhero-title",
    style: {
      marginTop: 'var(--space-4)'
    },
    dangerouslySetInnerHTML: {
      __html: HEADLINES[headlineKey] || Object.values(HEADLINES)[0]
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "lhero-sub"
  }, "Multi-org management, fine-grained role permissions, and member coordination \u2014 purpose-built for competitive gaming orgs that run like a business."), /*#__PURE__*/React.createElement("div", {
    className: "hero-cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-lg",
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rocket"
  }), " Get started free"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-lg",
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "log-in"
  }), " Sign in")), /*#__PURE__*/React.createElement("div", {
    className: "lhero-trust"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shield-check"
  }), "Free for squads up to 25 \xB7 No card required")), /*#__PURE__*/React.createElement("div", {
    className: "lhero-visual"
  }, /*#__PURE__*/React.createElement(Console, null))));
}

// ---- features (bento) ----------------------------------------
function FeatureCard({
  icon,
  title,
  children,
  span = 2,
  warm = false,
  chips
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: 'fcard col-' + span + (warm ? ' warm' : '') + (chips ? ' feature-lg' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "fcard-glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon
  })), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, children), chips && /*#__PURE__*/React.createElement("div", {
    className: "chip-row"
  }, chips.map(c => /*#__PURE__*/React.createElement("span", {
    className: "chip",
    key: c
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  }), " ", c))));
}
function Features() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "features"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Capabilities"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Everything your guild needs."), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Professional-grade organization tooling for competitive gaming teams \u2014 roles, members, and operations in one cohesive command center.")), /*#__PURE__*/React.createElement("div", {
    className: "bento"
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "boxes",
    title: "Multi-organization support",
    span: 3,
    chips: ['Separate roles', 'Per-org permissions', 'One login']
  }, "Manage multiple guilds from a single account, with independent roles, ranks, and permissions scoped to each organization you run or belong to."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "key-round",
    title: "Advanced permissions",
    span: 3,
    warm: true,
    chips: ['Role-based access', 'Granular scopes', 'Per-member overrides']
  }, "Fine-grained, role-based access control with flexible permission sets for every organization, division, and member \u2014 set it once, enforce it everywhere."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "layout-dashboard",
    title: "Intuitive dashboard"
  }, "A clean, modern command center for members, roles, and guild operations, with real-time updates the moment anything changes."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "zap",
    title: "Lightning fast"
  }, "Redis-powered caching keeps member lists and permission checks instant, even as your roster scales from a squad to an armada."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "id-card",
    title: "Member profiles"
  }, "Rich profiles with bio, contact, and role history across every organization a member belongs to \u2014 no more pinned-message rosters."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "shield-check",
    title: "Secure & reliable",
    span: 6,
    chips: ['JWT + refresh tokens', 'bcrypt hashing', 'Audit logging', 'Discord sync']
  }, "Built on JWT authentication with refresh tokens, bcrypt password hashing, and comprehensive security measures \u2014 so your org\u2019s data stays exactly where it belongs while roles and ranks stay in lockstep with Discord."))));
}

// ---- final CTA + footer --------------------------------------
function FinalCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section cta-band",
    id: "cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-card-glow"
  }), /*#__PURE__*/React.createElement("h2", null, "Ready to level up your guild?"), /*#__PURE__*/React.createElement("p", null, "Join the gaming organizations using Station to run their teams like flagships. Set up in minutes \u2014 your crew stays right where they are, in Discord."), /*#__PURE__*/React.createElement("div", {
    className: "hero-cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-lg",
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rocket"
  }), " Get started free"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-lg",
    href: "#",
    style: {
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.25)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "log-in"
  }), " Sign in")))));
}
function Footer() {
  const L = '../legal/';
  const cols = [['Product', [['Features', '#features'], ['Security', '#features'], ['Station Bot', '#cta'], ['Changelog', '#']]], ['Resources', [['Docs', '#'], ['API', '#'], ['Community', '#cta'], ['Support', '#']]], ['Legal', [['Terms of Service', L + 'Terms of Service.html'], ['Privacy Policy', L + 'Privacy Policy.html'], ['IP & Fan Content', L + 'Disclaimer.html'], ['Community Guidelines', L + 'Community Guidelines.html'], ['Cookies & Local Storage', L + 'Cookie & Local Storage Notice.html']]]];
  return /*#__PURE__*/React.createElement("footer", {
    className: "foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-brand"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("p", null, "Organization management for competitive gaming guilds. A Presstronic product."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)',
      marginTop: 'var(--space-2)'
    }
  }, "Station is an unofficial fan tool. Not affiliated with or endorsed by Cloud Imperium Games or Roberts Space Industries.")), cols.map(([title, links]) => /*#__PURE__*/React.createElement("div", {
    className: "foot-col",
    key: title
  }, /*#__PURE__*/React.createElement("h5", null, title), /*#__PURE__*/React.createElement("ul", null, links.map(([label, href]) => /*#__PURE__*/React.createElement("li", {
    key: label
  }, /*#__PURE__*/React.createElement("a", {
    href: href
  }, label))))))), /*#__PURE__*/React.createElement("div", {
    className: "foot-bottom"
  }, /*#__PURE__*/React.createElement("p", {
    className: "made"
  }, "\xA9 ", new Date().getFullYear(), " Presstronic LLC \xB7 Made with ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--coral-500)'
    }
  }, "\u2764"), " by Presstronic LLC"), /*#__PURE__*/React.createElement("div", {
    className: "foot-social"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Discord"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "message-circle"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "GitHub"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "github"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "X"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "at-sign"
  }))))));
}

// ---- tweaks defaults -----------------------------------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroLayout": "Centered",
  "accent": "Aqua",
  "headline": "Guild — “like a pro”",
  "showConsole": true
} /*EDITMODE-END*/;
function LandingApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // (re)build Lucide glyphs after every render so new icons resolve
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const layout = String(t.heroLayout || 'Centered').toLowerCase();
  const accent = String(t.accent || 'Aqua').toLowerCase();
  return /*#__PURE__*/React.createElement("div", {
    className: "station",
    "data-theme": "dark",
    "data-accent": accent
  }, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, {
    layout: layout,
    headlineKey: t.headline,
    showConsole: t.showConsole !== false
  }), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(FinalCTA, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Hero"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Layout",
    value: t.heroLayout,
    options: ['Centered', 'Split', 'Oversized'],
    onChange: v => setTweak('heroLayout', v)
  }), /*#__PURE__*/React.createElement(TweakSelect, {
    label: "Headline",
    value: t.headline,
    options: Object.keys(HEADLINES),
    onChange: v => setTweak('headline', v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Product preview",
    value: t.showConsole !== false,
    onChange: v => setTweak('showConsole', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Brand"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Accent",
    value: t.accent,
    options: ['Aqua', 'Coral'],
    onChange: v => setTweak('accent', v)
  })));
}
window.LandingApp = LandingApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "landing/LandingApp.jsx", error: String((e && e.message) || e) }); }

// landing/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "landing/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// legal/legal.js
try { (() => {
/* ============================================================
   STATION — legal pages shared behaviour
   · injects the consistent site footer into #site-footer
   · TOC scroll-spy (highlights the section in view)
   · renders Lucide icons
   ============================================================ */
(function () {
  var LINKS = [['Terms of Service.html', 'Terms of Service'], ['Privacy Policy.html', 'Privacy Policy'], ['Disclaimer.html', 'IP & Fan Content Disclaimer'], ['Community Guidelines.html', 'Community Guidelines'], ['Cookie & Local Storage Notice.html', 'Cookies & Local Storage']];
  var YEAR = new Date().getFullYear();
  function footerHTML() {
    var links = LINKS.map(function (l) {
      return '<a href="' + encodeURI(l[0]) + '">' + l[1] + '</a>';
    }).join('');
    return '' + '<footer class="foot">' + '<div class="wrap">' + '<div class="site-foot-main">' + '<div class="site-foot-brand">' + '<a class="legal-logo" href="../landing/Station Landing.html">' + '<span class="legal-logo-mark"><i data-lucide="orbit"></i></span>' + '<span class="legal-logo-word">STATION</span>' + '</a>' + '<p>Organization management for competitive gaming guilds. A Presstronic product.</p>' + '<p class="site-foot-sc">Station is an unofficial fan tool. Not affiliated with, endorsed, or sponsored by Cloud Imperium Games or Roberts Space Industries.</p>' + '</div>' + '<nav class="site-foot-links" aria-label="Legal">' + links + '</nav>' + '</div>' + '<div class="site-foot-bottom">' + '<p>&copy; ' + YEAR + ' Presstronic LLC. All rights reserved.</p>' + '<p class="site-foot-made">Made with <span class="heart">&#10084;</span> by Presstronic LLC</p>' + '</div>' + '</div>' + '</footer>';
  }
  function initFooter() {
    var mount = document.getElementById('site-footer');
    if (mount) mount.innerHTML = footerHTML();
  }
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.legal-toc a[href^="#"]'));
    if (!links.length) return;
    var sections = links.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {
      rootMargin: '-92px 0px -70% 0px',
      threshold: 0
    });
    sections.forEach(function (s) {
      io.observe(s);
    });
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.getElementById(a.getAttribute('href').slice(1));
        if (t) {
          e.preventDefault();
          window.scrollTo({
            top: t.getBoundingClientRect().top + window.scrollY - 88,
            behavior: 'smooth'
          });
          history.replaceState(null, '', a.getAttribute('href'));
        }
      });
    });
  }
  function ready(fn) {
    if (document.readyState !== 'loading') fn();else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    initFooter();
    initScrollSpy();
    if (window.lucide) window.lucide.createIcons();
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "legal/legal.js", error: String((e && e.message) || e) }); }

// ui_kits/station/CTA.jsx
try { (() => {
function FinalCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section cta-band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-card-glow"
  }), /*#__PURE__*/React.createElement("h2", null, "Your org deserves a command center."), /*#__PURE__*/React.createElement("p", null, "Bring your fleets, finances, and members under one roof. Set up Station in minutes \u2014 your crew stays right where they are, in Discord."), /*#__PURE__*/React.createElement("div", {
    className: "hero-cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-lg",
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rocket"
  }), " Launch your org free"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-lg",
    href: "#",
    style: {
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.25)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "calendar"
  }), " Book a demo")))));
}
function Footer() {
  const cols = [["Product", ["Features", "Pricing", "Station Bot", "Changelog", "Status"]], ["Resources", ["Docs", "API", "Guides", "Community", "Support"]], ["Company", ["About Presstronic", "Blog", "Privacy", "Terms"]]];
  return /*#__PURE__*/React.createElement("footer", {
    className: "foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-brand"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("p", null, "The full-stack command center for gaming guilds and orgs. A Presstronic product.")), cols.map(([title, links]) => /*#__PURE__*/React.createElement("div", {
    className: "foot-col",
    key: title
  }, /*#__PURE__*/React.createElement("h5", null, title), /*#__PURE__*/React.createElement("ul", null, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    className: "foot-bottom"
  }, /*#__PURE__*/React.createElement("p", {
    className: "made"
  }, "Made by ", /*#__PURE__*/React.createElement("b", null, "Presstronic"), " \xB7 \xA9 2026 Presstronic LLC"), /*#__PURE__*/React.createElement("div", {
    className: "foot-social"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Discord"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "message-circle"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Bluesky"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "cloud"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "X"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "at-sign"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "GitHub"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "github"
  }))))));
}
window.FinalCTA = FinalCTA;
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/CTA.jsx", error: String((e && e.message) || e) }); }

// ui_kits/station/FAQ.jsx
try { (() => {
function FAQItem({
  q,
  a,
  open,
  onToggle
}) {
  const ref = React.useRef(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "faq-item" + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    className: "faq-q",
    onClick: onToggle,
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", null, q), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus"
  })), /*#__PURE__*/React.createElement("div", {
    className: "faq-a",
    style: {
      maxHeight: open && ref.current ? ref.current.scrollHeight + 'px' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-a-inner",
    ref: ref
  }, a)));
}
function FAQ() {
  const [openIdx, setOpenIdx] = React.useState(0);
  const items = [{
    q: "Which games and universes does Station support?",
    a: "Station is built for org and guild management in any persistent-universe or team-based game. Fleets, mining, and contracts map naturally onto space-sim orgs, while inventory, HR, and accounting work for any community running a real organization."
  }, {
    q: "How does the Discord integration work?",
    a: "Station connects to your server through the Station Bot. Ranks, roles, and certifications stay synced in real time, members authenticate with Discord, and notifications post to the channels you choose — no separate logins to manage."
  }, {
    q: "Is our org's data secure?",
    a: "Yes. Station is built on Presstronic's secure full-stack foundation with encrypted storage, scoped permissions, and a complete audit log on every treasury and inventory action. You stay in control of who can see and do what."
  }, {
    q: "Can we manage multiple divisions and budgets?",
    a: "On the Org and Fleet plans you get a general fund plus separate accounts for each division or department, with independent ledgers, payouts, and balances — so your mining wing and your logistics arm keep their own books."
  }, {
    q: "What happens when we outgrow a plan?",
    a: "Upgrades are instant and prorated. Your data, fleets, and history carry over untouched — you simply unlock more seats and capabilities as your org grows."
  }, {
    q: "Do you offer a free option?",
    a: "Squads of up to 25 members run on Station free, forever, with fleet and inventory tracking plus Discord sync. No credit card required to get started."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "faq"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow center"
  }, "Questions"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Frequently asked.")), /*#__PURE__*/React.createElement("div", {
    className: "faq-list"
  }, items.map((it, i) => /*#__PURE__*/React.createElement(FAQItem, {
    key: i,
    q: it.q,
    a: it.a,
    open: openIdx === i,
    onToggle: () => setOpenIdx(openIdx === i ? -1 : i)
  })))));
}
window.FAQ = FAQ;
window.FAQItem = FAQItem;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/FAQ.jsx", error: String((e && e.message) || e) }); }

// ui_kits/station/Features.jsx
try { (() => {
function FeatureCard({
  icon,
  title,
  children,
  span = 2,
  warm = false,
  chips
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "fcard col-" + span + (warm ? " warm" : "") + (chips ? " feature-lg" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "fcard-glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon
  })), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, children), chips && /*#__PURE__*/React.createElement("div", {
    className: "chip-row"
  }, chips.map(c => /*#__PURE__*/React.createElement("span", {
    className: "chip",
    key: c
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  }), " ", c))));
}
function Features() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "features"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Capabilities"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Everything your org needs, in one hangar."), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Station replaces a dozen bots, spreadsheets, and side channels with a single cohesive platform \u2014 purpose-built for the way orgs actually operate.")), /*#__PURE__*/React.createElement("div", {
    className: "bento"
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "rocket",
    title: "Fleet management & sharing",
    span: 3,
    chips: ["Shared loadouts", "Crew assignments", "Showcase pages", "Readiness status"]
  }, "Catalog every hull in the org, assign crews, and track readiness at a glance. Members share fleets, publish showcase pages, and rally the right ships for any operation."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "landmark",
    title: "Org & division accounting",
    span: 3,
    warm: true,
    chips: ["General fund", "Division ledgers", "Payouts", "Full audit log"]
  }, "A real treasury for your org \u2014 a general fund plus separate accounts for every division and department, with payouts, balances, and an immutable audit trail."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "bot",
    title: "Station Bot"
  }, "Manage the Station Discord bot from a dashboard \u2014 commands, permissions, and automations without touching a config file."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "message-square-share",
    title: "Discord integration"
  }, "Roles, ranks, and notifications stay in lockstep with Discord in real time. Members never leave the server they already live in."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "package",
    title: "Inventory management"
  }, "Track stock across hangars and personal holds, set thresholds, and know exactly what the org owns and where it sits."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "pickaxe",
    title: "Mining operations"
  }, "Plan extraction runs, log yields, and split refined returns across the crew with transparent, rules-based distribution."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "scroll-text",
    title: "Contract system"
  }, "Post, claim, and settle contracts for items and services \u2014 with escrow-style payouts and a record of who delivered what."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "users",
    title: "Members & HR"
  }, "Onboarding, ranks, applications, and reviews. Manage your roster with proper HR tooling instead of pinned messages."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "arrow-left-right",
    title: "Internal trade board"
  }, "A members-only marketplace to buy, sell, and barter inside the org at fair internal rates \u2014 no scams, no spam."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "badge-check",
    title: "Certification management"
  }, "Define skill certifications, run sign-offs, and gate operations to qualified members so the right people fly the right roles."), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "medal",
    title: "Rewards & commendations"
  }, "Recognize contribution with commendations, medals, and reward payouts that keep your best members engaged and visible."))));
}
window.Features = Features;
window.FeatureCard = FeatureCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/Features.jsx", error: String((e && e.message) || e) }); }

// ui_kits/station/Hero.jsx
try { (() => {
function Console() {
  return /*#__PURE__*/React.createElement("div", {
    className: "console",
    role: "img",
    "aria-label": "Station org command dashboard preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "console-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "console-dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
    className: "console-title"
  }, "station.app / atlas-vanguard / overview")), /*#__PURE__*/React.createElement("div", {
    className: "console-body"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "console-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-item active"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "layout-dashboard"
  }), " Overview"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rocket"
  }), " Fleet"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "package"
  }), " Inventory"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "pickaxe"
  }), " Mining"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "scroll-text"
  }), " Contracts"), /*#__PURE__*/React.createElement("div", {
    className: "side-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "users"
  }), " Members"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "landmark"
  }), " Treasury"), /*#__PURE__*/React.createElement("div", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "award"
  }), " Certs")), /*#__PURE__*/React.createElement("div", {
    className: "console-main"
  }, /*#__PURE__*/React.createElement("h4", null, "Atlas Vanguard ", /*#__PURE__*/React.createElement("span", {
    className: "live"
  }, "Live")), /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Org Treasury"), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "8.42M"), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, "+4.1% this cycle")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Active Members"), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "312"), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, "+18 this week")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Open Contracts"), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "27"), /*#__PURE__*/React.createElement("div", {
    className: "delta warm"
  }, "6 awaiting payout"))), /*#__PURE__*/React.createElement("div", {
    className: "console-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ship-ico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rocket"
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Carrack \xB7 \u201CMeridian\u201D"), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "Exploration"), /*#__PURE__*/React.createElement("span", {
    className: "pill-badge ready"
  }, "Ready")), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ship-ico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "pickaxe"
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Prospector Wing"), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "Mining \xB7 6 crew"), /*#__PURE__*/React.createElement("span", {
    className: "pill-badge active"
  }, "Deployed")), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ship-ico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "scroll-text"
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Quantanium Haul \xB7 Lot 0912"), /*#__PURE__*/React.createElement("span", {
    className: "meta"
  }, "Contract"), /*#__PURE__*/React.createElement("span", {
    className: "pill-badge warm"
  }, "Payout due"))))));
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-inner wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-pill"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "New"), "Station Bot now syncs roles to Discord in real time"), /*#__PURE__*/React.createElement("h1", null, "Run your org like a ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "flagship"), ", not a spreadsheet."), /*#__PURE__*/React.createElement("p", {
    className: "hero-sub"
  }, "Station is the full-stack command center for gaming guilds and orgs \u2014 fleets, inventory, mining, contracts, treasury, and HR, all wired straight into Discord."), /*#__PURE__*/React.createElement("div", {
    className: "hero-cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-lg",
    href: "#pricing"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rocket"
  }), " Launch your org"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-lg",
    href: "#features"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "play"
  }), " See it in action")), /*#__PURE__*/React.createElement("div", {
    className: "hero-trust"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shield-check",
    style: {
      width: 16,
      height: 16
    }
  }), "Free for squads up to 25 \xB7 No card required")), /*#__PURE__*/React.createElement(Console, null));
}
function Marquee() {
  const items = [['users-round', 'Atlas Vanguard'], ['gem', 'Quantum Miners'], ['radar', 'Deepwatch'], ['swords', 'Iron Concord'], ['orbit', 'Nova Syndicate']];
  return /*#__PURE__*/React.createElement("section", {
    className: "marquee"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "marquee-label"
  }, "Trusted by orgs running thousands of members"), /*#__PURE__*/React.createElement("div", {
    className: "marquee-row"
  }, items.map(([ic, name]) => /*#__PURE__*/React.createElement("span", {
    className: "marquee-item",
    key: name
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": ic
  }), " ", name)))));
}
window.Hero = Hero;
window.Console = Console;
window.Marquee = Marquee;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/station/Nav.jsx
try { (() => {
function Logo() {
  return /*#__PURE__*/React.createElement("a", {
    className: "logo",
    href: "#top",
    "aria-label": "Station home"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "orbit"
  })), /*#__PURE__*/React.createElement("span", {
    className: "logo-word"
  }, "STATION"));
}
function Nav({
  theme,
  onToggleTheme
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    className: "nav" + (scrolled ? " scrolled" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-inner"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("ul", {
    className: "nav-links"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#features"
  }, "Features")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#pricing"
  }, "Pricing")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#faq"
  }, "FAQ")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Docs")))), /*#__PURE__*/React.createElement("div", {
    className: "nav-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "theme-toggle",
    onClick: onToggleTheme,
    "aria-label": "Toggle color theme"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "sun",
    className: "ico-light"
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "moon",
    className: "ico-dark"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: "#"
  }, "Sign in"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-sm",
    href: "#pricing"
  }, "Launch Station"))));
}
window.Nav = Nav;
window.Logo = Logo;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/station/Pricing.jsx
try { (() => {
function PriceCard({
  tier,
  price,
  per,
  note,
  cta,
  featured,
  badge,
  features
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pcard" + (featured ? " featured" : "")
  }, badge && /*#__PURE__*/React.createElement("span", {
    className: "badge-pop"
  }, badge), /*#__PURE__*/React.createElement("span", {
    className: "tier"
  }, tier), /*#__PURE__*/React.createElement("div", {
    className: "price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "amt"
  }, price), per && /*#__PURE__*/React.createElement("span", {
    className: "per"
  }, per)), /*#__PURE__*/React.createElement("p", {
    className: "price-note"
  }, note), /*#__PURE__*/React.createElement("a", {
    className: "btn " + (featured ? "btn-primary" : "btn-ghost"),
    href: "#"
  }, cta), /*#__PURE__*/React.createElement("ul", null, features.map(f => /*#__PURE__*/React.createElement("li", {
    className: f.muted ? "muted" : "",
    key: f.label
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": f.muted ? "minus" : "check"
  }), " ", f.label))));
}
function Pricing() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "pricing",
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow center"
  }, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Scale from a squad to an armada."), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Start free, upgrade when your org grows. Every plan includes Discord sync and the Station Bot \u2014 no add-ons, no surprises.")), /*#__PURE__*/React.createElement("div", {
    className: "price-grid"
  }, /*#__PURE__*/React.createElement(PriceCard, {
    tier: "Squad",
    price: "$0",
    per: "/ forever",
    note: "For small crews finding their feet.",
    cta: "Start free",
    features: [{
      label: "Up to 25 members"
    }, {
      label: "Fleet & inventory tracking"
    }, {
      label: "Discord role sync"
    }, {
      label: "Basic Station Bot"
    }, {
      label: "Org accounting",
      muted: true
    }, {
      label: "Contracts & trade board",
      muted: true
    }]
  }), /*#__PURE__*/React.createElement(PriceCard, {
    tier: "Org",
    price: "$19",
    per: "/ month",
    note: "For active orgs running real operations.",
    cta: "Launch Station",
    featured: true,
    badge: "Most popular",
    features: [{
      label: "Up to 300 members"
    }, {
      label: "Everything in Squad, plus:"
    }, {
      label: "Org & division accounting"
    }, {
      label: "Contracts & mining tools"
    }, {
      label: "Internal trade board"
    }, {
      label: "Certifications & HR tools"
    }, {
      label: "Rewards & commendations"
    }]
  }), /*#__PURE__*/React.createElement(PriceCard, {
    tier: "Fleet",
    price: "$49",
    per: "/ month",
    note: "For large orgs and multi-division empires.",
    cta: "Talk to us",
    features: [{
      label: "Unlimited members"
    }, {
      label: "Everything in Org, plus:"
    }, {
      label: "Unlimited divisions"
    }, {
      label: "Advanced audit & exports"
    }, {
      label: "SSO & priority support"
    }, {
      label: "Custom bot automations"
    }]
  }))));
}
window.Pricing = Pricing;
window.PriceCard = PriceCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/Pricing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/station/StationApp.jsx
try { (() => {
const STATION_TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "dark"
} /*EDITMODE-END*/;
function StationApp() {
  const [t, setTweak] = useTweaks(STATION_TWEAKS);
  const theme = t.theme === 'light' ? 'light' : 'dark';

  // Render Lucide icons after mount.
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, []);
  const toggleTheme = () => setTweak('theme', theme === 'dark' ? 'light' : 'dark');
  return /*#__PURE__*/React.createElement("div", {
    className: "station",
    "data-theme": theme === 'dark' ? 'dark' : undefined
  }, /*#__PURE__*/React.createElement(Nav, {
    theme: theme,
    onToggleTheme: toggleTheme
  }), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Marquee, null), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(Pricing, null), /*#__PURE__*/React.createElement(FAQ, null), /*#__PURE__*/React.createElement(FinalCTA, null)), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Appearance"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Theme",
    value: theme === 'dark' ? 'Dark' : 'Light',
    options: ['Dark', 'Light'],
    onChange: v => setTweak('theme', v === 'Dark' ? 'dark' : 'light')
  })));
}
window.StationApp = StationApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/StationApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/station/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/station/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

})();
