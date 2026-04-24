// @polenta contract 1
// Modèle « filtered-list » v1, généré par Polenta. Modifier ce code détache l'objet de son modèle.

const P = {
  "category": "requirement",
  "combinator": "AND",
  "conditions": [],
  "groupBy": [
    "component",
    "status"
  ]
}

function scalar(v) {
  if (v === undefined || v === null) return null
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))).join(', ')
  if (typeof v === 'object') return JSON.stringify(v)
  return v
}

function dayOf(instant, polenta) {
  const t = Date.parse(instant)
  let off = 0
  for (const o of polenta.timezoneOffsets) { if (Date.parse(o.from) <= t) off = o.offsetMinutes; else break }
  return new Date(t + off * 60000).toISOString().slice(0, 10)
}

function entryRows(data, campaigns, polenta) {
  const tests = new Map(data.tests.map((t) => [t.id, t]))
  const rows = []
  for (const c of campaigns) {
    const custom = {}
    for (const k of Object.keys(c.fields || {})) custom['campaign_' + k] = scalar(c.fields[k])
    for (const e of c.entries) {
      const live = tests.get(e.testCaseId)
      rows.push(Object.assign({}, custom, {
        campaignId: c.id, campaignTitle: c.title, campaignStatus: c.status, campaignCreatedAt: c.createdAt,
        objectTypeRef: c.objectTypeRef, level: c.level, campaignComponent: c.targetComponent,
        component: c.component, entryId: e.entryId, testCaseId: e.testCaseId, requirementId: e.requirementId,
        testTitle: e.snapshot ? e.snapshot.title : (live ? live.title : null),
        status: e.status, executed: e.status !== 'pending', addedAt: e.addedAt, executedAt: e.executedAt,
        executedDay: e.executedAt ? dayOf(e.executedAt, polenta) : null, executedBy: e.executedBy, runId: e.runId,
        _ids: [c.id + '/' + e.entryId],
      }))
    }
  }
  return rows
}

function num(v) {
  if (typeof v === 'number') return v
  if (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v))) return Number(v)
  return null
}

function eq(a, b) {
  if (a === null || a === undefined) return b === null || b === undefined || b === ''
  const na = num(a)
  const nb = num(b)
  if (na !== null && nb !== null) return na === nb
  return String(a) === String(b)
}

function lt(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) return false
  const na = num(a)
  const nb = num(b)
  if (na !== null && nb !== null) return na < nb
  return String(a) < String(b)
}

const OPS = {
  '=': eq,
  '!=': (a, b) => !eq(a, b),
  '>': (a, b) => lt(b, a),
  '<': lt,
  contains: (a, b) => String(a === null || a === undefined ? '' : a).toLowerCase().includes(String(b === null || b === undefined ? '' : b).toLowerCase()),
  in: (a, b) => (Array.isArray(b) ? b : String(b).split(',').map((s) => s.trim()).filter((s) => s)).some((x) => eq(a, x)),
}

function objectRow(o, extra) {
  const row = {}
  for (const k of Object.keys(o.fields || {})) row[k] = scalar(o.fields[k])
  Object.assign(row, {
    id: o.id, objectTypeRef: o.objectTypeRef, title: o.title, status: o.status, version: o.version,
    needsRevalidation: o.needsRevalidation, createdAt: o.createdAt, createdBy: o.createdBy,
    updatedAt: o.updatedAt, updatedBy: o.updatedBy, component: o.component,
  }, extra, { _ids: [o.id] })
  return row
}

export default function (data, polenta) {
  const component = P.component
  const objectTypeRef = P.objectTypeRef
  // Un type d'objet précis, ou tous les objets d'une catégorie (P.category, sans type).
  const types = data.schema.objectTypes.filter((t) => t.ref === objectTypeRef && (!component || t.component === component))
  const category = objectTypeRef ? (types.length ? types[0].category : 'requirement') : (P.category || 'requirement')
  const ofType = (o) => (!objectTypeRef || o.objectTypeRef === objectTypeRef) && (!component || o.component === component)
  let rows
  if (category === 'campaign') {
    rows = entryRows(data, data.campaigns.filter(ofType), polenta)
  } else if (category === 'test') {
    const latest = new Map()
    for (const r of data.runs) {
      const k = latest.get(r.testCaseId)
      if (!k || r.executedAt > k.executedAt) latest.set(r.testCaseId, r)
    }
    rows = data.tests
      .filter(ofType)
      .map((t) => {
        const run = latest.get(t.id)
        return objectRow(t, { latestRunResult: run ? run.result : null, latestRunDate: run ? run.executedAt : null })
      })
  } else {
    rows = data.requirements
      .filter(ofType)
      .map((r) => objectRow(r, { coverageStatus: r.coverageStatus }))
  }
  if (P.conditions.length) {
    const test = (row) => {
      const results = P.conditions.map((c) => OPS[c.operator](row[c.field], c.value))
      return P.combinator === 'OR' ? results.some(Boolean) : results.every(Boolean)
    }
    rows = rows.filter(test)
  }
  if (!P.groupBy) return rows
  const groups = new Map()
  for (const row of rows) {
    const key = JSON.stringify(P.groupBy.map((f) => (row[f] === undefined ? null : row[f])))
    let g = groups.get(key)
    if (!g) {
      g = { count: 0, _ids: [] }
      for (const f of P.groupBy) g[f] = row[f] === undefined ? null : row[f]
      groups.set(key, g)
    }
    g.count++
    g._ids = g._ids.concat(row._ids)
  }
  return Array.from(groups.values()).map((g) => {
    const out = {}
    for (const f of P.groupBy) out[f] = g[f]
    out.count = g.count
    out._ids = g._ids
    return out
  })
}
