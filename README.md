# Evidence store

🎒 Stores and retrieves documents and evidence

[![CircleCI](https://circleci.com/gh/LBHackney-IT/housing-needs-evidence-store.svg?style=svg)](https://circleci.com/gh/LBHackney-IT/housing-needs-evidence-store)

## Getting started

This project uses **npm** for dependency management.

1.  Install the project dependencies
    ```bash
    npm install
    ```
2.  Set local environment variables, adjust as needed
    ```bash
    cp .env.sample .env
    ```
3.  Start running your local copy of evidence store!
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

By default integration tests will run against the local version of evidence store, you can configure this to run against any URL by setting an environment variable before running the tests. If you are running tests against a real instance, you must also set `INTEGRATION_TEST_JWT` to a valid Hackney-issued JWT with appropriate permissions.

```bash
export INTEGRATION_TEST_BASE_URL=https://my.evidence.store/test
npm run test:integration
```

## Deployment

### A note about running this project locally

A key aspect of Evidence Store functionality is automatically indexing documents after they have been uploaded, this relies on an S3 event triggering a Lambda and therefore is very hard to test locally. If you are working on this functionality you may find it a lot easier to do a temporary deployment to AWS to test this integration.

### Temporary personal deployments

You can deploy a temporary copy of the application, if you want to debug in a real AWS environment.

```bash
npm run deploy:personal
npm run deploy:personal:cleanup # remember to remove it when you're done!
```

### Automated deployments

CircleCI will run unit and integration tests when a new PR is opened, these tests run against a test deployment of the application. This test environment is shared and therefore test runs will be queued when there are multiple PRs open at the same time to avoid conflicting deployments occurring.

Merging into `master` triggers a new deployment to staging, there is a manual approval process in CircleCI to trigger deployment to production.
