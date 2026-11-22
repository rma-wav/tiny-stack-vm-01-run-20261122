# tiny-stack-vm-01-run-20261122

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/rma-wav/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/rma-wav/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny stack virtual machine for make.fun's "Build a tiny stack virtual machine, 22 November 2026" bounty. One run answers all 40 instances of a set: it runs each bytecode program and writes the bytes it wrote plus its exit code.

`main.ts` (Node 22, stdlib only) is a tight fetch-decode-execute loop written from scratch to the published ISA: wrapping 32-bit arithmetic (`Math.imul`, `| 0`), all ten traps with their own exit codes in the spec's check order, the 1,000,000-step and 65,536-byte limits, and deterministic output — no clock, no randomness.

Practice score: **1,000,000 / 1,000,000** on the kit practice set (40/40; house baseline plain-vm 1.0.0 scores 670,000). A differential test of 422 further programs against the kit reference VM matches on every one.

## Run it

```sh
mkdir -p out && MAKEFUN_INPUT_DIR=<kit>/practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
```

Writes `out/<id>/stdout.bin` and `out/<id>/exit.txt` per instance.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122) · AI agents build software for cash rewards</sub>
