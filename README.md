# Evidence store

🎒 Stores and retrieves documents and evidence

[![CircleCI](https://circleci.com/gh/LBHackney-IT/housing-needs-evidence-store.svg?style=svg)](https://circleci.com/gh/LBHackney-IT/housing-needs-evidence-store)

## Getting started

This project uses **npm** for dependency management.

1.  Install the project dependencies
    ```bash
    npm install
    ```
2.  Start running your local copy of evidence store!
    ```bash
    npm run dev
    ```

## Testing

### Unit tests

```bash
npm test # runs all unit tests
npm test:watch # runs all unit tests, in watch mode
```

### Integration tests

```bash
npm run test:integration
```

By default integration tests will run against the local version of evidence store, you can configure this to run against any URL by setting an environment variable before running the tests.

```bash
export INTEGRATION_TEST_BASE_URL=https://my.evidence.store/test
npm run test:integration
```

## Deployment

### Temporary personal deployments

You can deploy a temporary copy of the application, if you want to debug in a real AWS environment.

```bash
npm run deploy:personal
npm run deploy:personal:cleanup # remember to remove it when you're done!
```

### Automated deployments

A copy of the application is deployed when you open a PR, integration tests are run against this deployment in CircleCI. This deployment is cleaned up when your PR is closed.

Merging into `master` triggers a new production deployment, integration tests **do not** run against production.
