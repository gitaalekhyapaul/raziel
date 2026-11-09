# Raziel Quickstart

## Try the SDK first

The fastest runnable example uses the public TypeScript SDK. With Node.js 24.18.0
or newer and npm registry access, run this in a scratch project or directory:

```sh
npm install @gitaalekhyapaul/raziel-sdk-ts@0.1.0
node --input-type=module <<'JS'
import { canonicalizeRequestTarget } from '@gitaalekhyapaul/raziel-sdk-ts';

console.log(canonicalizeRequestTarget('/payments?flag&q=a+b'));
JS
```

Expected output: `/payments?flag=&q=a%2Bb`. This example formats a request target
locally. It needs no server, credentials, or transaction data. For signed API calls
against a configured Raziel instance, see the [SDK README](https://github.com/gitaalekhyapaul/raziel-sdk-ts/blob/6239fad9d02b1047806b3c449eb593ea7cd9f119/README.md).

## Get the source

```sh
git clone --recurse-submodules https://github.com/gitaalekhyapaul/raziel.git
cd raziel
```

Git needs access to the three component repositories. The submodules contain the
[backend](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/README.md), [SDK](https://github.com/gitaalekhyapaul/raziel-sdk-ts/blob/6239fad9d02b1047806b3c449eb593ea7cd9f119/README.md), and
[demo agents](https://github.com/gitaalekhyapaul/raziel-demo-agents/blob/44d5b0af940b755b1cdb6c9209a52757f2f59b92/README.md) at the showcase's pinned revisions.

## Open the local operator portal

Use Docker with Compose. The first start downloads pinned images and build
dependencies. Set `RAZIEL_M5_OPERATOR_PASSWORD` for the first startup as described
in the [M5 portal runbook](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/docs/runbooks/M5-LOCAL-PORTAL.md#start).
From the showcase checkout, run:

```sh
cd components/backend
./scripts/start-m5-demo --recorded
```

Open [the operator portal](http://127.0.0.1:3000). You can create synthetic dataset
revisions, compile a visual policy, and replay a public proof-job timeline. Keep
`--recorded` explicit: the script defaults to live mode. Live capability issuance
and protected queries use the VM path below.
The [local M6 preview](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/docs/runbooks/AGENT-ACCESS-INBOX.md#local-m6-preview)
covers the access inbox and policy versions on a separately prepared stack.

## Run the real proof flow

The [M5 live walkthrough](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/docs/runbooks/M5-LOCAL-PORTAL.md#live-vm-proof-and-protected-query)
reproduces the single-capability flow. Raziel generates a real SP1 Plonk proof of
scoped authorization. The gateway checks the capability before returning synthetic
rows. The [M5 live evidence](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/docs/runbooks/M5-LOCAL-PORTAL.md#live-vm-evidence)
shows an independent verifier check and a cache-backed repeat read.

For the two-agent flow, start with the
[M6 VM prerequisites](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/docs/runbooks/M6-LIVE-VM.md#vm-backend-prepare)
and follow the [three-dashboard runbook](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/docs/runbooks/M7-AGENT-DEMO.md).
The documented setup uses a 64 GiB Linux x86_64 VM, pinned Docker toolchain, and
prepared Plonk artifacts and verifier keys. The M6 prover runs one job at a time
with eight CPUs, a 56 GiB limit, and no swap. Each agent needs its own registration
and token. The container agents reach the API over trusted HTTPS, separate from
the SSH forwards used to open the dashboards.

The operator finalises two [synthetic ledgers](https://github.com/gitaalekhyapaul/hypha-backend/blob/47661695cad950dd3683d74709f5875f9ae76019/examples/reconciliation/README.md),
each seeded with three rows. Agent A requests processor data and Agent B requests
bank settlements. Each uses the SDK and its own proof-backed capability for
protected reads. Use the runbook to reproduce and check that flow on a prepared VM.
