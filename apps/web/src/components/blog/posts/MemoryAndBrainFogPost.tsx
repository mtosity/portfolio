import React from "react";
import BlogLayout from "@/components/blog/BlogLayout";
import InteractiveAnchor from "@/components/blog/InteractiveAnchor";
import type { Definition } from "@/components/blog/definitions";

/**
 * Hand-written post, served through LEGACY_POSTS in app/blog/[slug]/page.tsx.
 * Index metadata (slug, date, excerpt) lives in @/data/blogPosts.ts.
 */
function MemoryAndBrainFogContent() {
  return (
    <>
      <p>
        I spent a few evenings digging through the actual literature on memory
        and brain fog. Not blog posts about blog posts. The meta-analyses and
        systematic reviews, the top of the evidence pyramid. I came away
        convinced that most of what the internet sells for this is noise, and
        that a short list of boring interventions carries almost all the
        weight. Here is what the studies say, with the numbers attached.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Brain fog is an attention problem first
      </h2>
      <p>
        The word fog sounds vague, but the recent research is not.{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1093/braincomms/fcag361"
          target="_blank"
          rel="noreferrer"
        >
          A study of 24,095 people in <em>Brain Communications</em>
        </a>{" "}
        dissected long COVID brain fog with structural equation modeling and
        found that the memory complaints ride on top of a foundational
        breakdown in sustained attention and on-task fatigue. The memory
        circuits are mostly fine. The gatekeeper deciding what gets in is not.
        Fix attention and energy, and most of what people call memory problems
        go with it.
      </p>
      <p>
        The known drivers are consistent across papers: sleep loss,
        dehydration, chronic stress, inflammation after infections, blood
        sugar swings, hormonal shifts, alcohol, and medication effects. If
        your fog came on suddenly or is getting worse, get bloodwork before
        you get a supplement. Thyroid, B12, and sleep apnea all dress up as
        fog.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Exercise is the strongest lever in the literature
      </h2>
      <p>
        <a
          className="link-hover"
          href="https://doi.org/10.1016/j.maturitas.2026.109109"
          target="_blank"
          rel="noreferrer"
        >
          A 2026 network meta-analysis in <em>Maturitas</em>
        </a>{" "}
        pooled 110 randomized controlled trials with 8,130 participants and
        broke the effects down by type. Aerobic work was best for global
        cognition with a large effect size of 1.11. Mind-body work, tai chi
        and yoga, topped executive function, processing speed, and attention.
        High intensity interval training ranked highest for memory
        specifically, at 0.58.{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.3389/fpubh.2026.1794345"
          target="_blank"
          rel="noreferrer"
        >
          A separate analysis of sedentary adults
        </a>{" "}
        found the same ordering and, importantly, no minimum threshold. Even
        low volume helps.
      </p>
      <p>
        The{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1186/s12877-026-07746-7"
          target="_blank"
          rel="noreferrer"
        >
          dose analysis
        </a>{" "}
        lands near the standard guideline of 600 to 1,200 MET-minutes a week.
        In plain terms, 150 minutes of moderate cardio plus a couple of
        strength sessions. Nothing exotic. Just the thing everyone already
        knows they should do, now with 110 trials behind it.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        The simple moves, with receipts
      </h3>
      <p>
        A drill-down people ask for: which specific aerobic moves does the
        research actually back, for anyone, no equipment? Ranked by strength
        of evidence. The dotted terms open the receipts.
      </p>
      <ol className="list-decimal pl-6 my-4 space-y-3">
        <li>
          <InteractiveAnchor
            text="Timing cardio around learning"
            definitionKey="aerobicTiming"
          />
          . The single best-supported memory trick in this whole literature:
          a 20 to 30 minute moderate session, brisk walking or easy cycling,
          placed on either side of the thing you are trying to remember. A
          meta-analysis of 42 experiments put exercise before encoding at d
          = 0.23, with free recall at 0.40, and exercise right after
          encoding at d = 0.33, with recognition at 0.62. Exercising during
          learning does nothing. The walk goes before or after the study
          session, never in the middle.
        </li>
        <li>
          <InteractiveAnchor
            text="Movement breaks"
            definitionKey="movementBreaks"
          />
          . Standing up or a short walk every 30 to 60 minutes. Two 2026
          meta-analyses of randomized crossover trials pooled the sitting
          literature and found brief interruptions improve memory function
          at g = 0.37 and executive function at g = 0.13 to 0.18. Free, and
          the only equipment is a timer.
        </li>
        <li>
          <InteractiveAnchor text="Brisk walking" definitionKey="briskWalking" />{" "}
          as a program, not a stroll. The famous one-year trial had 120 older
          adults walk 40 minutes a day, three days a week, and grew their
          hippocampi by 2 percent with better spatial memory. The pooled
          picture is humbler, and worth reading in the receipts, but walking
          is the delivery vehicle that makes the weekly aerobic volume
          happen, and the volume is where the 110-trial effect lives.
        </li>
        <li>
          <InteractiveAnchor
            text="Exercise snacks"
            definitionKey="exerciseSnacks"
          />
          . One-minute vigorous bursts, running in place or a few flights of
          stairs. Acute and sustained executive function gains in the trials
          that exist, but they are small pilots. Promising, not settled.
        </li>
        <li>
          <InteractiveAnchor text="Dance" definitionKey="danceMoves" />. The
          fun one. Three months of aerobic dance changed white-matter
          integrity in the brain&apos;s default mode network in adults with
          mild cognitive impairment, and a meta-analysis in Parkinson&apos;s
          found
          dance beats no exercise for global cognition. Unisex, social, and
          the effect nobody meta-analyzes is the one that matters most: you
          actually keep doing it.
        </li>
      </ol>
      <p>
        None of these trials carve the prescription by sex. The effects hold
        for men and women, and if anything the largest creatine-style
        modifiers show up in subgroup analyses, not in the aerobic
        literature. The moves are for everyone.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Sleep is where memory consolidation happens
      </h2>
      <p>
        <a
          className="link-hover"
          href="https://doi.org/10.7554/elife.101992"
          target="_blank"
          rel="noreferrer"
        >
          A 2025 Bayesian meta-analysis
        </a>{" "}
        confirmed the mechanism: the timing between slow oscillations and
        sleep spindles during deep sleep predicts how well new memories
        stick. You can optimize every supplement on the market and it will
        not compensate for a 1am bedtime. If insomnia is the problem,
        cognitive behavioral therapy works, and the digital versions now
        have{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1093/sleep/zsag264"
          target="_blank"
          rel="noreferrer"
        >
          twenty years of trials
        </a>{" "}
        behind them, roughly matching in-person outcomes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Two supplements earned their spot
      </h2>
      <p>
        <strong>Omega-3.</strong>{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1038/s41598-025-16129-8"
          target="_blank"
          rel="noreferrer"
        >
          A 2025 dose-response meta-analysis of 58 randomized trials
        </a>{" "}
        found that each 2,000 mg per day increment improved attention with an
        effect size of 0.98 and primary memory at 0.87. The curves are
        nonlinear, so past a point more does nothing. The certainty ratings
        are low to moderate. Promising, not magic.
      </p>
      <p>
        <strong>Creatine.</strong> The quiet overperformer.{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.3389/fnut.2024.1424972"
          target="_blank"
          rel="noreferrer"
        >
          A 2024 meta-analysis of 16 trials
        </a>{" "}
        found creatine monohydrate improved memory at 0.31 and sped up both
        attention and processing speed, with the largest effects in stressed
        and sleep-deprived adults aged 18 to 60, and in women. Moderate
        certainty on the memory number. Cheap, studied for decades, and
        strongest exactly in the states that produce fog in the first place.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        How to take them: dose, timing, and brands
      </h3>
      <p>
        The studies tell you whether. Here is the how, because the
        difference between a supplement that works and one that does nothing
        is mostly buying and taking it right. Standard caveat first: I am a
        developer who reads papers, not your doctor. If you are on blood
        thinners, have kidney disease, or manage a heart rhythm issue, run
        this section past a professional before buying anything.
      </p>
      <p>
        <strong>Buying omega-3.</strong> Two things on the label matter. The
        oil should be{" "}
        <InteractiveAnchor text="triglyceride form" definitionKey="suppTgForm" />,
        and it should carry a third-party purity mark, ideally{" "}
        <InteractiveAnchor
          text="IFOS certification"
          definitionKey="suppIfos"
        />
        . Brands that clear both bars: Nordic Naturals Ultimate Omega,
        Carlson Elite Omega-3 Gems, Sports Research Triple Strength, Thorne
        Super EPA. They are picks because of the certifications, not the
        marketing. Cheap drugstore oils usually fail on oxidation, not
        mercury, and oxidized omega-3 is worse than none.
      </p>
      <p>
        <strong>Taking it.</strong> 1 to 2 g of combined EPA + DHA a day,
        the range the cognition trials live in. Take it with the largest,
        fattiest meal of the day, because absorption climbs with the fat in
        the meal. A capsule on an empty stomach is partly wasted money. If
        it repeats on you, split the dose across two meals or freeze the
        capsules.
      </p>
      <p>
        <strong>The ceiling.</strong> More is not better. A meta-analysis
        of 35 trials and 114,592 people found{" "}
        <InteractiveAnchor
          text="an atrial fibrillation ceiling"
          definitionKey="afCeiling"
        />
        . Below 1,500 mg a day, no significant risk in any group. Above it,
        in people already at high cardiovascular risk, atrial fibrillation
        odds rose 1.43-fold. Stay in the 1 to 2 g lane unless a cardiologist
        is steering. On warfarin or another blood thinner, ask first:
        high-dose fish oil plus anticoagulants has produced subdural
        hematomas in case reports.
      </p>
      <p>
        <strong>Buying creatine.</strong> Creatine monohydrate, micronized,
        nothing else in the tub. Every cognitive trial used monohydrate, and
        the fancier forms, hydrochloride, ethyl ester, buffered, cost more
        without beating it. Look for{" "}
        <InteractiveAnchor text="Creapure" definitionKey="suppCreapure" />{" "}
        sourcing or an NSF Certified for Sport or USP Verified mark. Brands
        that qualify: Thorne Creatine, Nutricost Creapure monohydrate, NOW
        Sports, Klean Athlete.
      </p>
      <p>
        <strong>Taking it.</strong> 3 to 5 g a day, any time of day, every
        day. Timing around workouts is gym folklore; for the brain effect,
        consistency is the whole game. A{" "}
        <InteractiveAnchor text="loading phase" definitionKey="suppLoading" />{" "}
        is optional: it saturates stores in about a week instead of four.
        With a meal is fine, plain water is fine.
      </p>
      <p>
        <strong>Safety.</strong> The kidney question now has a clean
        answer: across the meta-analyses, in healthy adults,{" "}
        <InteractiveAnchor
          text="kidney function is preserved"
          definitionKey="suppKidney"
        />
        . One practical note: creatine slightly raises serum creatinine,
        and that shows up on a metabolic panel. It is the metabolite, not
        damage, but mention you supplement before the blood draw so nobody
        chases a ghost. Real reasons to pause: existing kidney disease, or
        being under 18 or pregnant, where the data is thin and a doctor
        should decide.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        What mostly does not work
      </h2>
      <p>
        Brain training apps deserve their asterisk. Computerized working
        memory training does improve the trained tasks, with an effect size
        of 0.50 in{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1038/s41746-026-02478-9"
          target="_blank"
          rel="noreferrer"
        >
          the 2026 meta-analysis
        </a>
        , but the transfer barely survives the journey.{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.3758/s13423-026-02994-5"
          target="_blank"
          rel="noreferrer"
        >
          A separate meta-analysis
        </a>{" "}
        found training gains leak into similar tasks at 0.18 and essentially
        vanish at distance. You get better at the game. The same hours in the
        gym improve memory through half a dozen domains instead.
      </p>
      <p>
        And the nootropic shelf, mushrooms, Racetams, mystery blends, has
        nothing at this evidence tier. Nothing. When a category has this many
        sellers and this few meta-analyses, the meta-analysis is not coming.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">The small stuff</h2>
      <p>
        A handful of unglamorous levers keep showing up.{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1249/mss.0000000000001682"
          target="_blank"
          rel="noreferrer"
        >
          Dehydration impairs every cognitive domain
        </a>{" "}
        once body mass loss exceeds 2 percent, which describes most
        afternoons.{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1016/j.arr.2024.102419"
          target="_blank"
          rel="noreferrer"
        >
          Alcohol is dose-linked to cognitive decline
        </a>{" "}
        with no safe floor. Probiotics and fiber moved global cognition in{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1093/ageing/afag287"
          target="_blank"
          rel="noreferrer"
        >
          a 2026 meta-analysis
        </a>
        , low risk, modest evidence. Mindfulness practice{" "}
        <a
          className="link-hover"
          href="https://doi.org/10.1002/smi.70209"
          target="_blank"
          rel="noreferrer"
        >
          tracks with lower perceived stress
        </a>{" "}
        at a correlation of 0.40 across 24,000 people, and stress directly
        impairs the hippocampus, so anything that lowers it is a memory
        intervention in disguise.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">The short version</h2>
      <ul className="list-disc pl-6 my-4 space-y-2">
        <li>150 minutes of aerobic work a week, plus two strength sessions</li>
        <li>A tai chi or yoga block if attention is your weak point</li>
        <li>Sleep treated as non-negotiable, CBT-I if insomnia is chronic</li>
        <li>2,000 mg of omega-3 and 5 g of creatine monohydrate daily</li>
        <li>Water through the day, alcohol down or out</li>
        <li>Brain training apps, only if you enjoy them</li>
      </ul>
      <p>
        Every item on that list has at least one decent meta-analysis behind
        it, and almost nothing on it costs more than a supplement bottle.
        The honest caveat: nutrition trials are short and small, so expect
        modest effects, not transformation. The stack is not exciting. That
        is usually a sign it is real.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Sources</h2>
      <ul className="list-disc pl-6 my-4 space-y-2">
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1093/braincomms/fcag361"
            target="_blank"
            rel="noreferrer"
          >
            A cognitive architecture for Long COVID: the interplay of brain
            fog, fatigue, attention and memory
          </a>{" "}
          (Brain Communications, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1016/j.maturitas.2026.109109"
            target="_blank"
            rel="noreferrer"
          >
            Domain-specific effects of exercise types on cognitive function
            in healthy older adults
          </a>{" "}
          (Maturitas, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.3389/fpubh.2026.1794345"
            target="_blank"
            rel="noreferrer"
          >
            Effects of exercise interventions on cognitive function in
            sedentary adults
          </a>{" "}
          (Frontiers in Public Health, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1186/s12877-026-07746-7"
            target="_blank"
            rel="noreferrer"
          >
            Optimal type and dose of exercise for improving executive
            functions in older adults
          </a>{" "}
          (BMC Geriatrics, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.7554/elife.101992"
            target="_blank"
            rel="noreferrer"
          >
            Bayesian meta-analysis of slow oscillation-spindle coupling in
            sleep-dependent memory consolidation
          </a>{" "}
          (eLife, 2025)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1093/sleep/zsag264"
            target="_blank"
            rel="noreferrer"
          >
            Sleep Healthy Using the Internet: twenty years of research on a
            digital CBT-I program
          </a>{" "}
          (Sleep, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1038/s41598-025-16129-8"
            target="_blank"
            rel="noreferrer"
          >
            A dose response meta analysis of Omega 3 supplementation on
            cognitive function
          </a>{" "}
          (Scientific Reports, 2025)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.3389/fnut.2024.1424972"
            target="_blank"
            rel="noreferrer"
          >
            The effects of creatine supplementation on cognitive function in
            adults
          </a>{" "}
          (Frontiers in Nutrition, 2024)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1038/s41746-026-02478-9"
            target="_blank"
            rel="noreferrer"
          >
            Meta-analysis of computerised working memory training
          </a>{" "}
          (npj Digital Medicine, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.3758/s13423-026-02994-5"
            target="_blank"
            rel="noreferrer"
          >
            The asymmetry of working memory training transfer
          </a>{" "}
          (Psychonomic Bulletin &amp; Review, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1249/mss.0000000000001682"
            target="_blank"
            rel="noreferrer"
          >
            Dehydration Impairs Cognitive Performance: A Meta-analysis
          </a>{" "}
          (Medicine &amp; Science in Sports &amp; Exercise, 2018)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1016/j.arr.2024.102419"
            target="_blank"
            rel="noreferrer"
          >
            Alcohol consumption in relation to cognitive dysfunction and
            dementia: A dose-response meta-analysis
          </a>{" "}
          (Ageing Research Reviews, 2024)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1093/ageing/afag287"
            target="_blank"
            rel="noreferrer"
          >
            Gut microbiome modulation can improve cognitive function in older
            adults
          </a>{" "}
          (Age and Ageing, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1002/smi.70209"
            target="_blank"
            rel="noreferrer"
          >
            The Association Between Mindfulness and Perceived Stress
          </a>{" "}
          (Stress and Health, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.3389/fcogn.2024.1367569"
            target="_blank"
            rel="noreferrer"
          >
            The effects of acute exercise on long-term episodic memory: a
            systematic review and meta-analysis
          </a>{" "}
          (Frontiers in Cognition, 2024)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1073/pnas.1015950108"
            target="_blank"
            rel="noreferrer"
          >
            Exercise training increases size of hippocampus and improves
            memory
          </a>{" "}
          (PNAS, 2011)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1007/s11357-023-00971-7"
            target="_blank"
            rel="noreferrer"
          >
            Aerobic exercise training effects on hippocampal volume in
            healthy older individuals: a meta-analysis of RCTs
          </a>{" "}
          (GeroScience, 2024)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.3389/fpsyg.2026.1720121"
            target="_blank"
            rel="noreferrer"
          >
            The impact of walking training on cognitive function in older
            adults: a meta-analysis
          </a>{" "}
          (Frontiers in Psychology, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1186/s12966-026-01953-6"
            target="_blank"
            rel="noreferrer"
          >
            Acute cognitive effects of interruptions to prolonged sitting
            with brief standing or physical activity
          </a>{" "}
          (International Journal of Behavioral Nutrition and Physical
          Activity, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1186/s12966-026-01942-9"
            target="_blank"
            rel="noreferrer"
          >
            Effect of breaking up prolonged sitting with physical activity on
            executive function: a three-level meta-analysis
          </a>{" "}
          (International Journal of Behavioral Nutrition and Physical
          Activity, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.3390/sports13060186"
            target="_blank"
            rel="noreferrer"
          >
            The Influence of Workplace-Integrated Exercise Snacks on
            Cognitive Performance in Sedentary Middle-Aged Adults
          </a>{" "}
          (Sports, 2025)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1123/japa.2021-0125"
            target="_blank"
            rel="noreferrer"
          >
            Effects of a Brief Stair-Climbing Intervention on Cognitive
            Functioning and Mood States in Older Adults
          </a>{" "}
          (Journal of Aging and Physical Activity, 2022)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.21037/qims-24-1212"
            target="_blank"
            rel="noreferrer"
          >
            White matter integrity of default mode network after a 3-month
            aerobic dance program in patients with mild cognitive impairment
          </a>{" "}
          (Quantitative Imaging in Medicine and Surgery, 2025)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1016/j.jbmt.2024.10.058"
            target="_blank"
            rel="noreferrer"
          >
            The importance of dance for the cognitive function of people
            with Parkinson&apos;s: A systematic review with meta-analysis
          </a>{" "}
          (Journal of Bodywork and Movement Therapies, 2024)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1161/circep.125.014785"
            target="_blank"
            rel="noreferrer"
          >
            Effects of Omega-3 Fatty Acid Treatment on Risk for Atrial
            Fibrillation: An Updated Meta-Analysis of 35 Trials
          </a>{" "}
          (Circulation: Arrhythmia and Electrophysiology, 2026)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1186/s12882-025-04558-6"
            target="_blank"
            rel="noreferrer"
          >
            Effect of creatine supplementation on kidney function: a
            systematic review and meta-analysis
          </a>{" "}
          (BMC Nephrology, 2025)
        </li>
        <li>
          <a
            className="link-hover"
            href="https://doi.org/10.1592/phco.27.1.152"
            target="_blank"
            rel="noreferrer"
          >
            Subdural hematoma after a fall in an elderly patient taking
            high-dose omega-3 fatty acids with warfarin
          </a>{" "}
          (Pharmacotherapy, 2007)
        </li>
      </ul>
    </>
  );
}

const card = {
  background: "var(--def-gray-bg)",
  border: "1px solid var(--def-gray-border)",
  padding: "0.75rem 1rem",
  margin: "0.25rem 0",
};

const cardText: React.CSSProperties = {
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "var(--muted)",
  margin: 0,
};

const cardLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--fg)",
  marginBottom: "0.4em",
};

function sourceLink(href: string, label: string) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ color: "var(--def-blue-text)", textDecoration: "underline" }}
    >
      {label}
    </a>
  );
}

/**
 * Definitions for the "simple moves" and "how to take them" drill-downs,
 * passed to BlogLayout as extraDefinitions so the side rail can render
 * them. Keys are namespaced to avoid colliding with the static
 * definitions.tsx entries.
 */
const memoryMoveDefinitions: Record<string, Definition> = {
  aerobicTiming: {
    title: "Timing cardio around learning",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          A meta-analysis of 42 experiments on acute exercise and episodic
          memory. Timing, not duration, is the trick.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>Before encoding</h4>
          <p style={cardText}>
            d = 0.23 overall, and free recall at d = 0.40. A 20 to 30 minute
            moderate walk or bike ride before a study session primes the
            hippocampus for what comes next.
          </p>
        </div>
        <div style={card}>
          <h4 style={cardLabel}>Right after encoding</h4>
          <p style={cardText}>
            d = 0.33 overall, with recognition at d = 0.62. Exercising
            shortly after learning helps the memory settle. During learning,
            d = -0.04, nothing. Walk before or after, not in the middle.
          </p>
        </div>
        <p style={cardText}>
          {sourceLink(
            "https://doi.org/10.3389/fcogn.2024.1367569",
            "Frontiers in Cognition, 2024"
          )}
        </p>
      </div>
    ),
  },
  movementBreaks: {
    title: "Movement breaks",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          Breaking up prolonged sitting with brief standing or light movement.
          Two three-level meta-analyses of randomized crossover trials,
          published in 2026, pooled the field.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>Memory</h4>
          <p style={cardText}>
            21 trials, 433 participants: sitting interruptions improved memory
            function at Hedges&apos; g = 0.37. For a free intervention, that
            is a serious effect size.
          </p>
        </div>
        <div style={card}>
          <h4 style={cardLabel}>Executive function</h4>
          <p style={cardText}>
            22 trials, 418 participants: g = 0.13 overall, working memory g =
            0.17. GRADE certainty is low, small samples, but the cost is
            also zero.
          </p>
        </div>
        <p style={cardText}>
          Protocol: stand or walk 2 to 3 minutes every 30 to 60 minutes of
          sitting.{" "}
          {sourceLink(
            "https://doi.org/10.1186/s12966-026-01953-6",
            "IJBNPA, 2026"
          )}{" "}
          and{" "}
          {sourceLink(
            "https://doi.org/10.1186/s12966-026-01942-9",
            "IJBNPA, 2026"
          )}
        </p>
      </div>
    ),
  },
  briskWalking: {
    title: "Brisk walking",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          The classic trial: 120 older adults, one year of moderate walking,
          40 minutes a day, three days a week. The walking group&apos;s
          anterior hippocampus grew about 2 percent, reversing one to two
          years of age-related shrinkage, with better spatial memory.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>The honest counterweights</h4>
          <p style={cardText}>
            Pooled across 8 trials, aerobic training did not significantly
            move hippocampal volume in healthy older adults (SMD 0.10, p =
            0.073). A walking-only meta-analysis of 8 RCTs, 772 older
            adults, found no significant cognitive gains on its own (memory
            SMD 0.04). Walking works as the delivery vehicle for weekly
            aerobic volume, which is where the 110-trial effect lives. A
            stroll is not a program.
          </p>
        </div>
        <p style={cardText}>
          {sourceLink(
            "https://doi.org/10.1073/pnas.1015950108",
            "PNAS, 2011"
          )}{" "}
          {sourceLink(
            "https://doi.org/10.1007/s11357-023-00971-7",
            "GeroScience, 2024"
          )}{" "}
          {sourceLink(
            "https://doi.org/10.3389/fpsyg.2026.1720121",
            "Frontiers in Psychology, 2026"
          )}
        </p>
      </div>
    ),
  },
  exerciseSnacks: {
    title: "Exercise snacks",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          Very short vigorous bursts, running in place, a few flights of
          stairs, chair stands. The idea: get the intensity without the time.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>What the trials show</h4>
          <p style={cardText}>
            Twenty-five sedentary office workers did three 1-minute bouts of
            running in place daily for four weeks: significant acute gains
            on Trail Making and Stroop after a single bout, and sustained
            gains after four weeks. A stair-interval pilot in 28 older adults
            showed marginal cognitive gains, but left them more tired.
          </p>
        </div>
        <div style={card}>
          <h4 style={cardLabel}>The catch</h4>
          <p style={cardText}>
            These are pilots, n = 25 and n = 28. Promising, directionally
            consistent with the sitting-break metas, but not settled
            evidence. Treat them as the minimum viable dose for busy days,
            not a replacement for the 150 minutes.
          </p>
        </div>
        <p style={cardText}>
          {sourceLink(
            "https://doi.org/10.3390/sports13060186",
            "Sports, 2025"
          )}{" "}
          {sourceLink(
            "https://doi.org/10.1123/japa.2021-0125",
            "Journal of Aging and Physical Activity, 2022"
          )}
        </p>
      </div>
    ),
  },
  danceMoves: {
    title: "Dance",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          Dance is aerobic exercise plus choreography, and the choreography
          is the point: remembering sequences is a built-in memory workout.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>What the trials show</h4>
          <p style={cardText}>
            A three-month aerobic dance program improved white-matter
            integrity in the default mode network of adults with mild
            cognitive impairment, in a randomized trial&apos;s imaging
            analysis. A meta-analysis in Parkinson&apos;s disease found dance
            superior to no exercise for global cognition, with some
            comparisons favoring it over repetitive exercise.
          </p>
        </div>
        <div style={card}>
          <h4 style={cardLabel}>Why it earns the slot</h4>
          <p style={cardText}>
            Unisex, social, and adherence is the real advantage. The best
            program on paper loses to the one you actually keep doing, and
            people keep dancing.
          </p>
        </div>
        <p style={cardText}>
          {sourceLink(
            "https://doi.org/10.21037/qims-24-1212",
            "Quantitative Imaging in Medicine and Surgery, 2025"
          )}{" "}
          {sourceLink(
            "https://doi.org/10.1016/j.jbmt.2024.10.058",
            "Journal of Bodywork and Movement Therapies, 2024"
          )}
        </p>
      </div>
    ),
  },
  suppTgForm: {
    title: "Triglyceride form",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          Fish oil comes in two molecular forms. Triglyceride (TG or rTG) is
          the form found in actual fish. Ethyl ester (EE) is the cheaper,
          processed form most budget oils use.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>Why it matters</h4>
          <p style={cardText}>
            TG-form oils absorb better, especially when the meal is not
            fat-heavy. If the label does not say triglyceride, rTG, or
            re-esterified, assume ethyl ester.
          </p>
        </div>
      </div>
    ),
  },
  suppIfos: {
    title: "IFOS certification",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          The International Fish Oil Standards program runs independent
          batch testing for purity, heavy metals, PCBs, dioxins, and
          oxidation (the TOTOX score). A 5-star IFOS mark means that
          specific lot passed everything.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>Equivalent marks</h4>
          <p style={cardText}>
            NSF Certified for Sport, USP Verified, and Informed Choice.
            Any third-party mark beats none. Label claims without a
            certification are marketing.
          </p>
        </div>
      </div>
    ),
  },
  afCeiling: {
    title: "The atrial fibrillation ceiling",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          The 2026 update meta-analysis: 35 randomized trials, 114,592
          participants, daily EPA + DHA of at least 500 mg for a year or
          more, participants 50 and older.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>What it found</h4>
          <p style={cardText}>
            Only one group showed significant atrial fibrillation risk:
            doses above 1,500 mg a day in people already at high
            cardiovascular risk, odds ratio 1.43, absolute increase 0.8
            percent. Low-dose groups showed no significant risk anywhere,
            including in high-risk patients.
          </p>
        </div>
        <p style={cardText}>
          {sourceLink(
            "https://doi.org/10.1161/circep.125.014785",
            "Circulation: Arrhythmia and Electrophysiology, 2026"
          )}
        </p>
      </div>
    ),
  },
  suppCreapure: {
    title: "Creapure",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          The raw-material gold standard: creatine monohydrate produced by
          AlzChem in Germany, batch-tested for contaminants with a
          traceable supply chain. Products using it print the Creapure
          logo, and it barely costs more than generic monohydrate.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>If it is not on the label</h4>
          <p style={cardText}>
            An NSF Certified for Sport or USP Verified mark does the same
            job: someone outside the manufacturer checked what is in the
            tub.
          </p>
        </div>
      </div>
    ),
  },
  suppLoading: {
    title: "Loading phase",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          20 g per day split into four 5 g doses for 5 to 7 days, then 3 to
          5 g as maintenance. Loading saturates muscle creatine stores in
          about a week instead of the roughly four weeks that plain 3 g a
          day takes.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>Worth it?</h4>
          <p style={cardText}>
            Entirely optional. Same end state either way. Loading just gets
            you there faster, with a little extra water weight on the scale.
          </p>
        </div>
      </div>
    ),
  },
  suppKidney: {
    title: "Kidney function on creatine",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={cardText}>
          The 2025 meta-analysis in BMC Nephrology, 21 studies: serum
          creatinine rose slightly, but glomerular filtration rate, the
          actual measure of kidney function, did not change. The
          creatinine bump is metabolic turnover, not organ damage.
        </p>
        <div style={card}>
          <h4 style={cardLabel}>The narrow caveats</h4>
          <p style={cardText}>
            Existing kidney disease, and populations the trials
            underrepresent: adolescents and pregnancy. Those are doctor
            conversations, not label-reading ones.
          </p>
        </div>
        <p style={cardText}>
          {sourceLink(
            "https://doi.org/10.1186/s12882-025-04558-6",
            "BMC Nephrology, 2025"
          )}
        </p>
      </div>
    ),
  },
};

export default function MemoryAndBrainFogPost() {
  return (
    <BlogLayout
      title="Memory and Brain Fog: What the Evidence Says"
      date="November 1, 2026"
      category="Living"
      extraDefinitions={memoryMoveDefinitions}
    >
      <MemoryAndBrainFogContent />
    </BlogLayout>
  );
}