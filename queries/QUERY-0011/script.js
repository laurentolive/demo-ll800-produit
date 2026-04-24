// @polenta contract 1
// Modèle « campaign-results » v1, généré par Polenta. Modifier ce code détache l'objet de son modèle.
// Colonne calculée éclatée de la Vue Système : une sous-colonne par campagne, une ligne par
// (campagne, test). Règles (dans lib/campaign.js, modifiables par le projet) : toutes les campagnes,
// abandonnées comprises, par date de création ; test itérant : pire statut des instances.
import { entryResultsByCampaign } from 'lib/campaign.js'
import { dayOf } from 'lib/time.js'

export default function (data, polenta) {
  return entryResultsByCampaign(data).map((r) => ({
    id: r.testId,
    value: r.status,
    campaignId: r.campaignId,
    campaignTitle: r.campaignTitle,
    tooltip: r.campaignId + ' — ' + r.campaignTitle
      + (r.executedAt ? ' · ' + dayOf(r.executedAt, polenta) + (r.executedBy ? ' · ' + r.executedBy : '') : polenta.locale === 'en' ? ' · not executed' : ' · non exécuté')
      + (r.statuses.length > 1 ? ' · ' + r.statuses.join(', ') : ''),
    _ids: [r.campaignId + '/' + r.entryId],
  }))
}
