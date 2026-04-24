// @polenta contract 1
// Décisions d'une validation, choisie par le paramètre du dashboard.
export default function (data, polenta) {
  const wanted = polenta.params.validation ?? 'Validation 1.0'
  const groups = new Map()
  for (const v of data.validations) {
    if (v.title !== wanted) continue
    for (const e of v.entries) {
      let g = groups.get(e.decision)
      if (!g) groups.set(e.decision, (g = { decision: e.decision, count: 0, _ids: [] }))
      g.count++
      g._ids.push(e.requirementId)
    }
  }
  return Array.from(groups.values())
}
