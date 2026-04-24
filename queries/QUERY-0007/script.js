// @polenta contract 1
// Nombre de liens par type ; détail = objets reliés (source et cible).
export default function (data) {
  const groups = new Map()
  for (const l of data.links) {
    let g = groups.get(l.type)
    if (!g) groups.set(l.type, (g = { type: l.type, count: 0, ids: new Set() }))
    g.count++
    g.ids.add(l.sourceId)
    g.ids.add(l.targetId)
  }
  return Array.from(groups.values())
    .sort((a, b) => b.count - a.count)
    .map((g) => ({ type: g.type, count: g.count, _ids: Array.from(g.ids) }))
}
