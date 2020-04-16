[![Continuous Integration](https://circleci.com/gh/MieuxVoter/mvfront-react.svg?style=svg)](https://circleci.com/gh/MieuxVoter/mvfront-react)
[![Continuous Deployment](https://api.netlify.com/api/v1/badges/021c39c6-1018-4e3f-98e2-f808b4ea8f6d/deploy-status)](https://app.netlify.com/sites/epic-nightingale-99f910/deploys)

# Voting application in React

A demo is available at [our website](http://demo.mieuxvoter.fr/).

## Installation

1. Copy `.env` file into `.env.local` and set there environment variables.
2. Install [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable).
3. Install dependencies:
```bash
$ cd mvfront-react
$ yarn install
```

## Starting

In dev:

`yarn start`

For production, see our [CI/CD configuration](https://github.com/MieuxVoter/continuous-integration).

## Testing

`yarn test`
