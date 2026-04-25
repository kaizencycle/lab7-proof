# C-292 Final Phase — Env Sample Hardening

## Scope

This phase removes committed runtime-style OAA environment files and keeps only safe examples.

## Changes

- Removed `oaa.env` from the repository.
- Hardened `oaa.env.example` so it is clearly an example file.
- Removed credential-shaped Redis placeholder text from the example.
- Kept only replace-with placeholders for local operator setup.

## Operator guidance

Use:

```txt
oaa.env.example
```

as the template.

Create a local, untracked file:

```txt
.env
```

and place real values there.

## Canon

Example files may teach setup.
Runtime env files must not be committed.
Secrets belong in local env or deployment secret stores.

We heal as we walk.
