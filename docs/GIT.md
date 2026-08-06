# Git conventions (TradeImpact)

## Branch naming

```text
cursor/<descriptive-kebab>-e9ae
```

Always lowercase. Always include the `-e9ae` suffix for cloud agent branches.

## Conventional Commits

```text
<type>(optional-scope): <summary>
```

Allowed types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`, `build`, `ci`.

## Versioning

| Artifact                   | Scheme                                        |
| -------------------------- | --------------------------------------------- |
| npm `package.json`         | Semver for packaging                          |
| Marketing / product        | Version N.x labels in app copy (e.g. V13 TIE) |
| TradeImpact Score™ weights | `scoreWeights.vN` + changelog                 |
| Provider HTTP API          | Additive; breaking → new path version         |

## Protected files

Never commit:

- `.env.local` / real secrets
- `.next/` / `node_modules/`
- Personal IDE folders

`.env.local.example` is allowed.
