// @polenta contract 1
// Modèle « campaign-last-result » v1, généré par Polenta. Modifier ce code détache l'objet de son modèle.
// Colonne calculée de la Vue Système : une ligne par test exécuté en campagne.
// Règles (dans lib/campaign.js, modifiables par le projet) : entrée exécutée la plus récente,
// toutes campagnes, abandonnées comprises ; runs hors campagne ignorés.
import { lastEntryResults } from 'lib/campaign.js'
import { dayOf } from 'lib/time.js'

export default function (data, polenta) {
  const rows = []
  for (const [testId, r] of lastEntryResults(data)) {
    rows.push({
      id: testId,
      value: r.status,
      tooltip: r.campaignId + ' — ' + r.campaignTitle + ' · ' + dayOf(r.executedAt, polenta) + (r.executedBy ? ' · ' + r.executedBy : ''),
      _ids: [r.campaignId + '/' + r.entryId],
    })
  }
  return rows
}
