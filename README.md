# Tweetprenuer

Full-stack AI product that turns an X profile into a shareable business card.

**Live:** [tweetprenuer.net](https://tweetprenuer.net)  
**Backend:** [tweetprenuer-server](https://github.com/lefkosp/tweetprenuer-server)

## Stack

- Angular 19 frontend (this repo)
- Express + MongoDB API with OpenAI and SocialData integrations
- Response caching to control API spend on repeat lookups

## Local development

```bash
npm install
ng serve
```

Create `src/environments/environment.ts` pointing at your API:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
};
```

The backend needs `OPENAI_API_KEY`, `SOCIALDATA_API_KEY`, and `MONGODB_URI`. See the server repo for setup.

## Build

```bash
ng build
```

Production builds output to `dist/tweetprenuer` and use `environment.prod.ts` (`api.tweetprenuer.net`).
