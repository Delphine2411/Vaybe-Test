# Vaybe Careers

Mini application fullstack de gestion de candidatures construite avec Next.js App Router et TypeScript.

## Fonctionnalites

- Soumission de candidature via `POST /api/applications`
- Consultation des candidatures via `GET /api/applications`
- Validation client et serveur
- Scoring automatique sur 3 points
- Interface responsive avec page formulaire et page admin
- Tri par score ou date et filtre par role
- Envoi d'emails via Nodemailer SMTP, avec fallback Resend ou simulation serveur si non configure

## Stack technique

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Route Handlers Next.js pour l'API REST

## Choix techniques

- Utilisation d'un store en memoire pour garder le projet simple et rapide a lancer sans base de donnees.
- Separation claire entre logique metier (`lib/applications.ts`), API (`app/api/applications/route.ts`) et interface (`components/` + `app/`).
- Le scoring est calcule cote backend pour garantir une source unique de verite.
- Design base sur un bleu inspire du code couleur `2728 C`.

## Regles de scoring

Chaque candidature obtient un score sur 3 :

- message de motivation contenant au moins un mot cle pertinent
- portfolio renseigne
- email valide

## Lancer le projet

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Puis ouvrir `http://localhost:3000`.

Pour activer l'envoi d'emails, renseigner de preference les variables SMTP dans `.env.local` :
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` et `SMTP_FROM_EMAIL`.
Si SMTP n'est pas configure, le projet peut encore utiliser `RESEND_API_KEY` et `RESEND_FROM_EMAIL`.
Sans configuration email, l'application simule l'envoi dans les logs serveur afin de conserver un parcours de demo complet.

## Pages

- `/` : formulaire de candidature
- `/admin` : interface simple d'administration

## API

### `POST /api/applications`

Exemple de payload :

```json
{
  "name": "Delphine Kiki",
  "email": "delphine@example.com",
  "role": "dev",
  "motivation": "Je veux avoir un impact produit en tant que fullstack dans une equipe collaborative.",
  "portfolio": "https://portfolio.example.com",
  "cv": "https://docs.example.com/cv.pdf"
}
```

### `GET /api/applications`

Retourne la liste des candidatures avec score et date de creation.

## Limite connue

- Les donnees sont stockees en memoire : elles sont reinitialisees au redemarrage du serveur.


