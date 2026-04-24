// @polenta contract 1
// Nombre d'exigences par version, versions croissantes.
export default function (data) {
  const groups = new Map()
  for (const r of data.requirements) {
    let g = groups.get(r.version)
    if (!g) groups.set(r.version, (g = { version: r.version, count: 0, _ids: [] }))
    g.count++
    g._ids.push(r.id)
  }
  return Array.from(groups.values()).sort((a, b) => a.version - b.version)
}
