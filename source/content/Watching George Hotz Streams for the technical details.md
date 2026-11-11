---
created: 2026-11-11
published: 2026-11-11
tags:
  - tinygrad
  - george-hotz
---
I've been watching [[George Hotz]] streams since 2022. When I looked back through my notes on them, most of what I wrote down wasn't about the code at all. Only recently have I been able to dig into some technical stuff, starting with `CLOUD=1`.

## My notes

### **Nov 11, 2026: looking back at my George Hotz notes**

- I filtered my notes for the George Hotz videos I've watched. There are almost 50 of them, going back to April 2022.
- Most of my thoughts were on non-technical topics, even when the stream title said "Programming":
    - **stable diffusion, in tinygrad?!? pt 2:** rules for any social environment. Read the room. Show up at a sports bar and figure out who they support by watching. Also: what crypto is good for.
    - **training imagenet with tinygrad:** life after a degree, honest conversations, "compassion will hold you back", Elon's rules.
    - **aside: Nvidia open source kernel driver:** why football markets itself better than tech does. Personally, I was just seeing some guy typing obscure syntax in a terminal.
    - **building the new tinygrad computer:** "I'm not Wozniak, I'm like Jobs." Hard-core programming nerds take care of the coding and I can simply use the libraries.
    - **Fun with MuZero and MCTS:** I mostly laughed. What is he trying to figure out for 19 hours?
- The technical parts I did note were one-liners: decoding DNA into codons, launching a CUDA kernel without the CUDA driver, block-scaled matrix multiplication.
- So what changed?

### **Nov 9, 2026: making tinygrad CLOUD=1 fast**

- This may be the first time I'm watching a George Hotz stream for the technical details. How times have changed.
- Two years ago, on Nov 10, 2024, I logged "tinygrad, starting on CLOUD=1 | Part 1" and wrote nothing under it.
- Where `CLOUD=1` comes from: the [tiny corp master plan](https://x.com/__tinygrad__/status/1724198204441546995) (Nov 2023). First the framework, then the hardware, then the cloud.
    - > Currently, you set the default device in tinygrad with an environment variable, like GPU=1. With CLOUD=1, all your compute will be in the cloud.
    - The idea is a tinygrad-specific cloud with zero lock-in, since it's the exact same tinygrad code.
- geohot: what I realized is that all of this stuff doesn't have to run in realtime.
    - My broad reading of the situation is that tinygrad allows you to specify training jobs as programs.
- **What happened to `CloudAllocator`?** I went looking for it in the codebase and it's gone.
    - May 2025: renamed. `ops_cloud.py` became `ops_remote.py`, `CloudAllocator` became `RemoteAllocator`, `CLOUD=1` became `REMOTE=1` ([#10166](https://github.com/tinygrad/tinygrad/pull/10166)).
    - May–Oct 2025: it grew remote BEAM, multihost, and InfiniBand p2p ([#9746](https://github.com/tinygrad/tinygrad/pull/9746)).
    - Dec 2025: geohot deleted all of it, about 970 lines ([#13722](https://github.com/tinygrad/tinygrad/pull/13722) "remove REMOTE=1").
    - 2026: remote came back in a different form, at the PCI level ([#18173](https://github.com/tinygrad/tinygrad/pull/18173) "bring back remote"). A `RemotePCIDevice` sends MMIO and memory reads/writes over a socket, so the normal AMD/NV drivers work on a GPU in another machine as if it were plugged in locally. No separate allocator needed.
    - None of the PRs say why. For the actual reasoning I'd need geohot's commentary on stream or the tinygrad Discord.

### **Feb 4, 2026: how I actually use agentic coding**

- From the stream: the skills required to use these tools are the identical skills from before. You just have to be able to sort through a lot of information quickly and understand what's relevant and what's not.
    - This is similar to the Constraints-Led Approach to learning.
- Maybe this is part of why the technical side finally opened up for me.
