# Lave-linge LL800 — repo produit (démonstration Polenta)

Repo racine du workspace de démonstration Polenta : lave-linge frontal 8 kg / 1400 tr/min.

Il porte les exigences produit (PRD) et système (SYS), les tests système, les campagnes, les
reviews, les requêtes/dashboards partagés, et déclare ses composants réutilisables dans
`polenta-repo.yaml` :

| Montage | Rôle | Pin |
| --- | --- | --- |
| `comp-moteur` | Moteur BLDC & onduleur (dépend lui-même de `if-bus-interne`) | `main` (branche) |
| `comp-pompe-vidange` | Pompe de vidange, affichée sous le composant local *hydraulique* | `v2.0` (tag) |
| `comp-module-wifi` | Module Wi-Fi | SHA de commit |
| `if-bus-interne` | Repo **interface** (rôles controller / device) | `v1.1` (tag) |

Voir `GUIDE-EVALUATION.md` pour la liste des fonctionnalités illustrées et les scénarios de test.
