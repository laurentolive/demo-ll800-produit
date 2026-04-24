// @polenta contract 1
// Nombre d'issues incluses par version ; détail = issues.
export default function (data) {
  const issues = new Set(data.issues.map((i) => i.id))
  return data.versions.map((v) => {
    const ids = v.changes.map((c) => c.id).filter((id) => issues.has(id))
    return { version: v.component + ' ' + v.title, state: v.state, count: ids.length, _ids: ids }
  })
}
