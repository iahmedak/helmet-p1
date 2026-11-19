# Apple product presentation — research notes

Working notes behind the SONA product experience. Scope: what Apple's product
films and pages actually do, which of those techniques transfer to a
single-buzzer helmet prototype, and which do not.

## Method and honesty note

I could not watch the films frame by frame: this environment has no video
playback. Everything below comes from published frame analyses, Apple's own
developer sessions, page-source analyses, teardown documentation and
transcripts — not from impressions of a video I did not see. Where a source
gives a timestamp, it is quoted from that source. Where a claim is inference
from the implementation, it is labelled as such.

Sources, with what each contributed:

| Source | What it contributed |
| --- | --- |
| [Apple Vision Pro film table — Blackman & Harley, *Convergence* (2024)](https://journals.sagepub.com/doi/10.1177/29768624241283913) | Runtime and structure of Apple's Vision Pro films: "Introducing Apple Vision Pro" (9:11, simulated use cases + voice-over), "A Guided Tour" (9:53, product manager narrating while a first-time user tries it), "Making Apple Vision Pro" (1:22, manufacturing montage). Useful: three different films for three jobs — launch, guided use, and build credibility. |
| [9to5Mac — keynote transitions and editing (2023)](https://9to5mac.com/2023/06/21/apple-keynote-videos-transitions-and-editing) | Documents the invisible-cut technique: a transition that passes through a close-up of the iPhone camera module and out into Apple Park, cited at the 6:24 mark of the analysis video. Useful: continuity is built by matching shapes between shots, not by cutting on action. |
| [Quince Creative — why Apple still launches in 3D (2026)](https://quincemedia.com/2026/09/10/apple-3d-product-launch-videos) | Frame-level notes on recent AirPods films: macro shots into a mesh grille, textile knit resolved to individual yarns, and noise cancellation shown as "concentric rings of light" around dancers rather than a cutaway. Useful: when the mechanism is invisible, visualise the *effect*, not a fake cross-section. |
| [videngineer — MacBook Pro M5 launch film teardown](https://videngineer.com/teardowns/launch/apple-macbook-pro-m5-launch-film-teardown) | Third-party structural teardown: 79 scenes and 46 cuts in 100 seconds, described as people-first with the product kept quiet. Useful: pacing — short scenes, many cuts, product withheld rather than over-shown. |
| [CSS-Tricks — rebuilding the AirPods Pro scroll effect (2020)](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages) | The AirPods Pro hero as 148 images drawn to a canvas, one frame per slice of scroll. Useful: the mechanic behind "the product turns as you scroll" is a pinned section plus a scrubbed timeline. |
| [scrollytelling.ai — Apple-style scroll animation (2026)](https://scrollytelling.ai/apple-style-scroll-animation/) | Notes the 2026 AirPods Pro page holds 15 video elements inside pinned scroll components and no canvas; same idea, different asset. Useful: the technique survives format changes; the pinned section is the constant. |
| [Graydon Pleasants — Apple's "Flow" compression (2023)](https://graydonpleasants.com/posts/flow-apples-secret-weapon) | Apple's in-house sequence compression for scroll-tied imagery, in use since around 2018. Useful: their polish depends on asset budgets most projects cannot match — so this build should use vector and CSS motion instead of frame sequences. |
| [NN/g — scroll fading 101 (2023)](https://www.nngroup.com/articles/scroll-fading-101) | Distinguishes reveal-on-scroll from scrolljacking and warns that hijacking breaks the user's sense of control. Useful: animate in place, never take over the wheel. |
| [iFixit — iPhone X teardown (2017)](https://www.ifixit.com/Teardown/iPhone+X+Teardown/98975) | The teardown grammar: numbered steps, one layer per step, labelled parts, X-ray recon before opening. Useful: anatomy is best taught in ordered steps with names attached. |
| [Exploded-view practice — Lindhout Technisch Artwork](https://tbl.nl/en/exploded-view) and [engineering exploded views](https://engineeringniche.com/article/tips-for-creating-accurate-and-detailed-exploded-views-in-solid-models) | Number parts, keep one base part fixed, explode along the assembly axis, show the assembled view beside the exploded one, use ghosting so the whole object still reads. Useful: the anatomy section keeps the product assembled and moves the *information*, not the parts. |
| [Apple WWDC17 — Designing Sound](https://developer.apple.com/videos/play/wwdc2017/803) | Apple's own account of how UI sounds are made: recorded or synthesised sources, deliberately "unobtrusive and repeatable" because they play millions of times (transcript around 13:58 and 20:58). Useful: interface audio should be short, repeatable and generated, not licensed music. |
| [Apple WWDC23 — Explore immersive sound design](https://developer.apple.com/videos/play/wwdc2023/10271) | Spatially placed interaction sounds and slight variation of repeated sounds so they do not feel static. Useful: the cue lab varies pattern rather than volume, and never loops. |
| [Apple WWDC17 — Cinematic Mode explainer (TechCrunch, 2021)](https://techcrunch.com/2021/09/23/how-apple-built-the-iphone-13-pros-cinematic-mode) | Not a film, but a model for technical explanation: each capability named, then tied to the hardware that performs it. Useful: one claim, one component, one visual. |

## Patterns that recur, and what they are for

1. **One idea per section.** Every source that analyses structure converges on
   the same thing: a section makes a single claim, shows the one visual that
   proves it, and moves on. Vision Pro's guided tour is the clearest case —
   each capability gets its own scene and its own narrator sentence.
2. **Pinned stage, scrubbed visual.** Pinning a section and driving one visual
   from scroll position turns a list of claims into a sequence. This is the
   signature move, and it is a *timeline* problem, not a 3D problem.
3. **Macro before whole.** Close-ups establish material credibility before the
   wide shot establishes the object. Apple's AirPods films spend their opening
   on a grille and a knit; the product is withheld until it has been earned.
4. **Visualise the effect when the mechanism is invisible.** Noise cancellation
   as rings of light, not a cutaway of a chip. The honest version of this for
   SONA is showing *sound leaving the ear pocket*, not a fake PCB render.
5. **Diagram grammar for hardware.** Numbered parts, one base part fixed,
   leader lines, ghosting, an assembled view beside the detail. Teardown
   documentation is a better model here than film, because it is legible at
   rest.
6. **Continuity by shape matching.** The invisible cut through the camera
   module works because the outgoing and incoming shapes agree. On the web the
   equivalent is keeping the product in the same place across section changes.
7. **Sound is short, repeatable, generated.** Apple's UI sounds are designed to
   survive repetition; nothing about a product film needs licensed music to
   explain a mechanism.
8. **Restraint as the actual technique.** Long holds, few words, generous
   negative space, one accent colour. The polish is subtraction.

## Applied to this product

Kept:

- A dark, silent stage for the reveal, with the product as the only lit object
  (key light + faint engineering grid), and a headline of two words.
- Pinned, scroll-driven ride sequence with three moments — scroll position
  selects the cue, so copy, pulse pattern and product state never disagree.
- Anatomy as a numbered callout diagram over the assembled product, with a
  parts list and Next/Previous — iFixit grammar, not a fake exploded 3D model.
- Signal path as a five-step stepper the visitor drives, because the mechanism
  (byte → GATT write → switch statement → PWM → ear) is genuinely sequential.
- Interface audio generated with the Web Audio API at the documented
  frequencies, pulse lengths and gaps. Simulations, labelled as simulations.
- One accent colour (signal blue) used only where information flows.
- Mono type for measurements and bytes; sentence-case headings; hairline rules.

Rejected:

- Image-sequence product rotation. There is no render of this helmet, and a
  frame sequence would be megabytes of something that does not exist.
- Scrolljacking and "scroll to continue" locks. Scroll stays native; pinned
  stages advance with position only.
- Fake internals: no invented PCB, no invented microphone, no exploded view of
  parts that are not in the bill of materials.
- Treated glass, glow and gradient decoration as a substitute for a
  demonstration.
- Any claim that AI voice, calls or notifications work on Prototype 04. They
  are listed as planned, with the hardware they would need named.

## Known limits of this build

- The helmet visual is a vector drawing, not a photograph or 3D render. It is
  the most honest asset available: no product photography exists in the repo.
  Swapping in a real render is a one-component change (`HelmetRender.tsx`).
- The cue lab is a browser simulation of the firmware, not a recording of the
  physical buzzer. Frequency response, loudness and damping are not simulated.
- No audio is autoplayed; every sound requires a click, per browser policy and
  because a helmet cue should never surprise the visitor.
