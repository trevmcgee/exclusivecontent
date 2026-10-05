# Security boundaries for Citizen Coder apps

Citizen Coder apps run in an isolated GCP project with no access to production systems.
This document describes what is and isn't permitted.

## Permitted

- Reading from public APIs (with an approved API key)
- Storing app state in Cloud Firestore or Cloud SQL (provisioned by platform team)
- Calling approved internal APIs over HTTPS
- Storing secrets in GCP Secret Manager

## Not permitted

| Restriction | Reason |
|------------|--------|
| Direct BigQuery access to production datasets | Data governance — use the approved data platform |
| Access to the production VPC or internal services | Blast radius isolation |
| Long-lived GCP service account JSON keys | Key leakage risk — use Workload Identity Federation |
| Deploying to external platforms (Railway, Netlify, etc.) | No SSO, no audit trail, no security review |
| Storing user PII in app databases without review | Privacy / GDPR compliance |

## Requesting exceptions

If your app needs access to something not listed above, open a request in **#ai-support**.
The platform and security teams will review it.

## Reporting a concern

If you accidentally committed a credential or exposed data, post immediately in **#security**.
