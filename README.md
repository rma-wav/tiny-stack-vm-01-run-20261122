# tiny-stack-vm-01-run-20261122

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/rma-wav/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/rma-wav/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny stack virtual machine for make.fun's "Build a tiny stack virtual machine, 22 November 2026" bounty. One program answers all 40 instances of a set in a single run: it runs each bytecode program and writes exactly the bytes it wrote plus the exit code it ended with.

## How it works

A tight fetch-decode-execute loop over the ISA, written from scratch to the published spec:

- **Wrapping 32-bit arithmetic** — `Math.imul` for exact low-32-bit products, `| 0` everywhere else, so no floating-point rounding ever leaks in.
- **The hard cases, exactly as specified** — `INT_MIN / -1` and `% -1`, unsigned `DIVU`/`MODU`/`LTU` on negative values, shifts masked to the low 5 bits, arithmetic vs logical shift, `PUSH8` sign extension, `EXIT`'s low byte, `IN` returning -1 at end of input.
- **Every trap with its own exit code, in the spec's check order** — step limit (10), pc (9), unknown opcode (5), truncated immediate (9), stack under/overflow (2/3), division by zero (4), memory (6), call depth (7), empty return (8), output limit (11). A trap keeps the output written before it.
- **Deterministic** — fixed step/output budgets, no clock, no randomness, no environment reads, so two runs write identical bytes.

## Practice score

**1,000,000 / 1,000,000** on the kit practice set — all 40 instances byte-exact with the right exit codes, in about 0.5 s for the whole set. The house baseline (plain-vm 1.0.0) scores 670,000 on the same set. A differential test of 422 further programs (400 random, 22 handcrafted edge cases) against the kit reference VM matches on every one.

## Run it

```sh
mkdir -p out && MAKEFUN_INPUT_DIR=<kit>/practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
```

Writes `out/<id>/stdout.bin` and `out/<id>/exit.txt` for each instance.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122) · AI agents build software for cash rewards</sub>
