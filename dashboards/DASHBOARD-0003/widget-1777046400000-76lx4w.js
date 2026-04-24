// @polenta contract 1
// Transformation « pie » v1, généré par Polenta. Modifier ce code détache l'objet de son modèle.

const P = {
  "category": "decision",
  "measure": "sum",
  "measureColumn": "count"
}

const SEVERITY = { FAIL: 4, BLOCKED: 3, INCOMPLETE: 2, pending: 1, PASS: 0 }
const ENTRY_ORDER = ["pending","INCOMPLETE","BLOCKED","FAIL","PASS"]

function measure(op, values) {
  if (op === 'count') return values.length
  const present = values.filter((v) => v !== null && v !== undefined)
  if (op === 'worst') {
    let w = null
    for (const v of present) if (w === null || (SEVERITY[v] ?? -1) > (SEVERITY[w] ?? -1)) w = v
    return w
  }
  if (op === 'distinct') return Array.from(new Set(present.map(String))).join(', ')
  const nums = present.map(Number).filter((n) => !isNaN(n))
  if (op === 'sum') return nums.reduce((a, b) => a + b, 0)
  if (!nums.length) return null
  return op === 'min' ? Math.min.apply(null, nums) : Math.max.apply(null, nums)
}

/** Regroupe les lignes par `keys` ; une ligne par groupe (ordre de première apparition), union des _ids. */
function groupRows(rows, keys, op, column, valueName) {
  const groups = new Map()
  for (const r of rows) {
    const k = JSON.stringify(keys.map((f) => (r[f] === undefined ? null : r[f])))
    let g = groups.get(k)
    if (!g) {
      g = { row: {}, values: [], ids: [] }
      for (const f of keys) g.row[f] = r[f] === undefined ? null : r[f]
      groups.set(k, g)
    }
    g.values.push(op === 'count' ? 1 : r[column])
    if (r._ids) for (const id of r._ids) g.ids.push(id)
  }
  return Array.from(groups.values()).map((g) => {
    const out = Object.assign({}, g.row)
    out[valueName] = measure(op, g.values)
    out._ids = Array.from(new Set(g.ids))
    return out
  })
}

/** Tri : statuts d'entrée dans leur ordre, sinon ordre naturel (« TEST-2 » avant « TEST-10 »). */
function compare(a, b) {
  const ia = ENTRY_ORDER.indexOf(a)
  const ib = ENTRY_ORDER.indexOf(b)
  if (ia >= 0 && ib >= 0) return ia - ib
  if (a === null) return 1
  if (b === null) return -1
  const pa = String(a).split(/(\d+)/)
  const pb = String(b).split(/(\d+)/)
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
    if (pa[i] === pb[i]) continue
    const na = Number(pa[i])
    const nb = Number(pb[i])
    if (i % 2 === 1 && !isNaN(na) && !isNaN(nb)) return na - nb
    return pa[i] < pb[i] ? -1 : 1
  }
  return pa.length - pb.length
}

export default function (rows, polenta) {
  const out = groupRows(rows, ["decision"], "sum", P.measureColumn, "sum_count")
  return out
}
