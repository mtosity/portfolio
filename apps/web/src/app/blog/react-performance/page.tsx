import BlogLayout from "@/components/blog/BlogLayout";
import InteractiveAnchor from "@/components/blog/InteractiveAnchor";
import CodeAnchor from "@/components/blog/CodeAnchor";
import Image from "next/image";

function BlogContent() {
  return (
    <>
      <p>
        Imagine a bookshelf. If you want to read a specific book, you simply
        take it off the shelf. The other books stay put. But in a poorly
        optimized React application, taking one book off the shelf causes{" "}
        <em>every other book</em> to fall off and be put back one by one.
      </p>

      <p>
        This phenomenon is known as a{" "}
        <InteractiveAnchor text="Wasted Render" definitionKey="wastedRender" />.
        It&apos;s the most common cause of performance issues in React apps.
        This guide will teach you a systematic approach to finding and fixing
        these issues—moving beyond random optimizations to establish a
        repeatable, data-driven process.
      </p>

      <p className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-blue-800 dark:text-blue-200">
        <strong>Golden Rule:</strong> &quot;Measure, don&apos;t guess.&quot;
        Premature optimization is the root of all evil. Only optimize when the
        Profiler proves you have a problem!
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Part 1: The Audit Strategy
      </h2>

      <p>
        Before opening DevTools, you need a plan. Without a strategy, you risk
        optimizing things that don&apos;t impact the business. Many developers
        treat performance as a bug fix: see something slow, hack at it until it
        feels faster. But in professional development,{" "}
        <strong>performance is a system, not a task</strong>.
      </p>

      <div className="my-8">
        <Image
          src="/blog-images/react-performance/audit-strategy.jpg"
          alt="React Performance Audit Strategy Workflow"
          width={1200}
          height={675}
          className="rounded-lg shadow-lg"
        />
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Understanding Web Vitals
      </h3>

      <p>
        Google&apos;s{" "}
        <InteractiveAnchor text="Web Vitals" definitionKey="webVitals" /> are
        the industry standard for measuring user experience. You must track
        these metrics in your React app:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>LCP (Largest Contentful Paint)</strong> — How fast does the
          main content load? This measures perceived speed.
        </li>
        <li>
          <strong>CLS (Cumulative Layout Shift)</strong> — Does the page jump
          around? A common React issue is lazy-loaded components popping in
          unexpectedly.
        </li>
        <li>
          <strong>INP (Interaction to Next Paint)</strong> — How fast does the
          browser respond when I click? React hydration can block the main
          thread and hurt this metric.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        RUM vs Synthetic Monitoring
      </h3>

      <p>
        You need two types of eyes on your application.{" "}
        <InteractiveAnchor
          text="RUM and Synthetic monitoring"
          definitionKey="rumVsSynthetic"
        />{" "}
        serve different purposes:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Real User Monitoring (RUM)</strong> — Data from actual users.
          High variability because of different phones, networks, locations.
          Shows real pain points.
        </li>
        <li>
          <strong>Synthetic Monitoring</strong> — Automated tests in controlled
          environments. Low variability. Catches regressions before deployment.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">The Audit Workflow</h3>

      <p>Don&apos;t wing it. Follow this repeatable cycle:</p>

      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>Strategy:</strong> Define scope (e.g., &quot;Holiday Landing
          Page&quot;) and KPIs (e.g., &quot;Add-to-cart conversion rate&quot;).
        </li>
        <li>
          <strong>Measure:</strong> Establish a baseline using a clean
          environment (Guest Mode, specific browser profile).
        </li>
        <li>
          <strong>Synthesize:</strong> Organize findings into three buckets:{" "}
          <em>Highly Recommended</em> (quick wins), <em>Suggested</em> (needs
          analysis), and <em>Maybe Later</em> (low priority).
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Part 2: Understanding React&apos;s Rendering Cycle
      </h2>

      <p>
        To fix performance issues, you must understand how React works under the
        hood. The rendering process happens in three phases:
      </p>

      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>Trigger:</strong> State or Props change.
        </li>
        <li>
          <strong>Render Phase (The &quot;Diff&quot;):</strong> React calls your
          component functions to determine what the UI <em>should</em> look
          like. It compares the new tree with the old tree.
        </li>
        <li>
          <strong>Commit Phase (The &quot;Paint&quot;):</strong> React applies
          the changes to the real DOM.
        </li>
      </ol>

      <div className="my-8">
        <Image
          src="/blog-images/react-performance/react-rendering-cycle.jpg"
          alt="React Rendering Cycle: Trigger, Render, and Commit Phases"
          width={1200}
          height={675}
          className="rounded-lg shadow-lg"
        />
      </div>

      <p className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-yellow-800 dark:text-yellow-200 mt-4">
        <strong>The Trap:</strong> Developers often confuse the Render Phase
        with the Commit Phase. React runs your component&apos;s JavaScript logic{" "}
        <em>every time</em> a parent renders—but it only touches the DOM if the
        output is different. The performance cost comes from running that
        JavaScript logic unnecessarily!
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        The Root Cause: Shallow Equality
      </h3>

      <p>
        Why do components render when they don&apos;t need to? Usually it&apos;s
        due to{" "}
        <InteractiveAnchor
          text="Shallow Equality"
          definitionKey="shallowEquality"
        />
        . React compares props using the strict equality operator (
        <code>===</code>). This works fine for primitives like numbers and
        strings, but Objects, Arrays, and Functions are <em>reference types</em>
        . Creating a new one during a render cycle makes React think the data is
        &quot;new&quot;, forcing a re-render.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Part 3: Your Performance Toolkit
      </h2>

      <p>
        The audit relies on three specific tools to diagnose different layers of
        the application.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Tool 1: React DevTools Profiler
      </h3>

      <p>
        This tells you <em>which</em> components are rendering and <em>why</em>.
        Open React DevTools, go to the Profiler tab, and record a session.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>The Flamegraph:</strong> Each bar is a component.{" "}
          <span className="text-gray-500">Gray</span> = did not render (good).{" "}
          <span className="text-yellow-600">Yellow/Red</span> = took time to
          render (investigate).
        </li>
        <li>
          <strong>Exclusive vs Inclusive Time:</strong> <em>Exclusive</em> is
          time spent in just this component. <em>Inclusive</em> includes all
          children too.
        </li>
        <li>
          <strong>Pro Tip:</strong> Look for the &quot;Commit&quot; timeline.
          Many rapid commits often means state thrashing.
        </li>
      </ul>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        Enable{" "}
        <strong>
          &quot;Record why each component rendered while profiling&quot;
        </strong>{" "}
        in DevTools settings to see exactly why each component re-rendered!
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Tool 2: Chrome Performance Tab
      </h3>

      <p>
        When React DevTools says a component took 200ms, the Chrome Performance
        tab tells you
        <em>what specific JavaScript function</em> caused it.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Self Time:</strong> How long a specific function took
          (excluding functions it called).
        </li>
        <li>
          <strong>The Call Stack:</strong> Look for &quot;Deep V&quot; shapes
          which indicate massive recursion or heavy computation.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Tool 3: Memory Profiler
      </h3>

      <p>
        React apps are long-lived Single Page Applications. If you don&apos;t
        manage memory, the browser tab will crash.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Heap Snapshot:</strong> Take a photo of memory before and
          after an action. Compare to find leaks.
        </li>
        <li>
          <strong>Detached DOM Nodes:</strong> A common SPA leak. If you
          navigate away but keep references to old DOM nodes, garbage collection
          can&apos;t clear them.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Programmatic Profiling
      </h3>

      <p>
        Sometimes you need to measure performance in production. React provides
        a native{" "}
        <InteractiveAnchor text="Profiler API" definitionKey="profilerApi" />{" "}
        for this.
      </p>

      <p>
        <CodeAnchor
          text="View Profiler API Example"
          codeKey="profilerApiExample"
        />{" "}
        — See how to wrap components with the Profiler and send metrics to
        analytics.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Part 4: Fixing Wasted Renders
      </h2>

      <p>
        Now that you can identify problems, let&apos;s fix them. Follow this
        order of operations:
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Strategy 1: Fix Your Architecture First
      </h3>

      <p>
        Before reaching for memoization hooks, fix the underlying architecture
        issues.
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">Split Your Contexts</h4>

      <p>
        A common mistake is putting high-frequency data (like scroll position)
        in the same Context as low-frequency data (like user profile). Every
        time the user scrolls, <em>everything</em> re-renders!
      </p>

      <p>
        <CodeAnchor
          text="View Context Splitting Pattern"
          codeKey="contextSplitting"
        />{" "}
        — See how to split contexts by update frequency.
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">Use the Slot Pattern</h4>

      <p>
        There&apos;s a difference between a component&apos;s{" "}
        <strong>Parent</strong> (contains it in DOM) and its{" "}
        <strong>Owner</strong> (created the element). You can &quot;lift
        ownership&quot; using the slot pattern to prevent re-renders.
      </p>

      <p>
        <CodeAnchor text="View Slot Pattern Example" codeKey="slotPattern" /> —
        Learn how passing components as children prevents wasted renders.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Strategy 2: Stabilize Your References
      </h3>

      <p>
        If you&apos;re passing functions or objects to children, you need to
        keep their &quot;identity&quot; stable across renders.
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">
        useCallback for Functions
      </h4>

      <p>
        When you define a function inside a component and pass it to a child,
        that child sees a &quot;new&quot; function every single time.{" "}
        <InteractiveAnchor text="useCallback" definitionKey="useCallback" />{" "}
        fixes this.
      </p>

      <p>
        <CodeAnchor
          text="View useCallback Example"
          codeKey="useCallbackExample"
        />{" "}
        — See how to stabilize function references.
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">
        useMemo for Objects and Arrays
      </h4>

      <p>
        Use <InteractiveAnchor text="useMemo" definitionKey="useMemo" /> when
        you&apos;re calculating expensive data OR passing a complex object as a
        prop.
      </p>

      <p>
        <CodeAnchor
          text="View useMemo Example"
          codeKey="useMemoObjectExample"
        />{" "}
        — See how to stabilize object references.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Strategy 3: The Shield (React.memo)
      </h3>

      <p>
        Sometimes a parent component <em>must</em> update often, but the child
        is expensive and shouldn&apos;t move.{" "}
        <InteractiveAnchor text="React.memo" definitionKey="reactMemo" /> acts
        as a shield—it tells React to only render the component if its props
        have actually changed.
      </p>

      <p>
        <CodeAnchor text="View React.memo Example" codeKey="reactMemoExample" />{" "}
        — See how to protect expensive components from unnecessary re-renders.
      </p>

      <p className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
        <strong>Warning:</strong> Don&apos;t add React.memo everywhere! It adds
        memory overhead and code complexity. Only use it when the Profiler
        proves you have a problem.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Strategy 4: Normalize Your State
      </h3>

      <p>
        How you structure state determines how fast your selectors run. Storing
        data as an array requires iterating to find items—that&apos;s{" "}
        <strong>O(n)</strong> complexity. As your data grows, your app slows
        down.
      </p>

      <p>
        <CodeAnchor
          text="View Normalized State Pattern"
          codeKey="normalizedState"
        />{" "}
        — Learn how to get O(1) instant lookups.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Strategy 5: Choose Your Styling Wisely
      </h3>

      <p>
        How you style your app affects performance more than you might think.{" "}
        <InteractiveAnchor
          text="Styling strategies"
          definitionKey="stylingStrategy"
        />{" "}
        have different impacts on the{" "}
        <InteractiveAnchor
          text="Reconciliation"
          definitionKey="reconciliation"
        />{" "}
        process.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>CSS-in-JS (Styled Components):</strong> Creates deep component
          trees. Every style rule adds a wrapper component, increasing
          reconciliation cost significantly.
        </li>
        <li>
          <strong>Atomic CSS (Tailwind):</strong> High initial learning curve,
          but extremely lean. Zero runtime cost and tiny footprint.
        </li>
        <li>
          <strong>CSS Modules:</strong> Solid middle ground. Scoped styles
          without the runtime cost of CSS-in-JS.
        </li>
      </ul>

      <p className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-blue-800 dark:text-blue-200 mt-4">
        <strong>Recommendation:</strong> If performance is paramount, move away
        from runtime CSS-in-JS toward <strong>Atomic CSS</strong> or{" "}
        <strong>CSS Modules</strong>.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Strategy 6: Render Props for Fine-Grained Control
      </h3>

      <p>
        While Hooks are great, they have a downside: they tightly couple state
        to the component that calls them. If a hook updates, the <em>entire</em>{" "}
        component re-renders.
      </p>

      <p>
        The{" "}
        <InteractiveAnchor
          text="Render Props Pattern"
          definitionKey="renderProps"
        />{" "}
        allows you to isolate rendering to a specific sub-section of your JSX.
        This is especially useful for high-performance forms—typing one letter
        only re-renders that specific field, not the whole form.
      </p>

      <p>
        <CodeAnchor
          text="View Render Props Example"
          codeKey="renderPropsExample"
        />{" "}
        — See how to isolate field updates in forms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Part 5: Advanced Escape Hatches
      </h2>

      <p>
        Sometimes React is just too slow for extreme scenarios. Here are some
        escape hatches.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        useDeferredValue for Responsive Inputs
      </h3>

      <p>
        If you have a heavy list that filters as the user types, the typing
        might feel laggy.
        <InteractiveAnchor
          text="useDeferredValue"
          definitionKey="useDeferredValue"
        />{" "}
        tells React: &quot;Prioritize the user&apos;s keystrokes. Update the
        heavy list when you have CPU time.&quot;
      </p>

      <p>
        <CodeAnchor
          text="View useDeferredValue Example"
          codeKey="deferredValueExample"
        />{" "}
        — Keep inputs snappy while rendering heavy lists.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Suspense & Transitions for Priority Updates
      </h3>

      <p>
        React 18 introduced{" "}
        <InteractiveAnchor
          text="Suspense & Transitions"
          definitionKey="suspenseTransitions"
        />
        , which let you mark state updates as &quot;urgent&quot; or
        &quot;non-urgent.&quot; This is more powerful than useDeferredValue
        because you control <em>which updates</em> get deferred, not just
        values.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>startTransition:</strong> Wrap non-urgent state updates to
          tell React they can be interrupted. Perfect for tab switches, route
          navigation, or search results.
        </li>
        <li>
          <strong>Suspense:</strong> Shows a fallback UI while async data loads.
          Combine with transitions to keep the old UI interactive while the new
          one prepares in the background.
        </li>
        <li>
          <strong>isPending flag:</strong> Shows loading state without blocking
          user interactions.
        </li>
      </ul>

      <p>
        <CodeAnchor
          text="View Suspense & Transitions Example"
          codeKey="suspenseTransitionsExample"
        />{" "}
        — See how to keep tabs responsive while loading heavy data.
      </p>

      <p className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-blue-800 dark:text-blue-200 mt-4">
        <strong>The Difference:</strong> useDeferredValue defers a{" "}
        <em>value</em> (like search input), while startTransition defers an
        entire <em>state update</em> (like switching tabs). Use Transitions when
        you need fine-grained control over which updates are urgent vs
        non-urgent.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Uncontrolled Components with useRef
      </h3>

      <p>
        For extremely high-frequency updates (like rich text editors or canvas
        games), letting React manage state is too expensive. Use{" "}
        <code>useRef</code> to hold the DOM node and manipulate it directly. You
        lose React&apos;s safety features, but you gain raw speed.
      </p>

      <p>
        <CodeAnchor
          text="View Uncontrolled Component Example"
          codeKey="uncontrolledComponentExample"
        />{" "}
        — See how to achieve 60 FPS canvas drawing without re-renders.
      </p>

      <p className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-orange-800 dark:text-orange-200 mt-4">
        <strong>Trade-off:</strong> Uncontrolled components bypass React&apos;s
        declarative model. Use them only when performance profiling proves
        React&apos;s rendering is the bottleneck. They&apos;re perfect for
        canvas drawing, real-time audio visualizers, or contentEditable rich
        text editors.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Part 6: Optimizing Delivery
      </h2>

      <p>
        Optimizing React isn&apos;t just about preventing re-renders—it&apos;s
        about how fast you can get your application from the server to the
        user&apos;s device.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">The Real User Mindset</h3>

      <p>
        Developers often work on high-end MacBooks with fiber internet. Real
        users browse on mid-range Android phones over spotty 4G.{" "}
        <strong>Always test with throttling enabled!</strong>
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Developer Mode:</strong> 60ms load time (unrealistic)
        </li>
        <li>
          <strong>Real User Mode:</strong> Enable &quot;Slow 3G&quot; in
          DevTools. That 60ms might become 2.5 seconds!
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Tree Shaking Dead Code
      </h3>

      <p>
        <InteractiveAnchor text="Tree Shaking" definitionKey="treeShaking" />{" "}
        removes unused code during the build. But bundlers are conservative—if
        they think code <em>might</em> have a side effect, they keep it.
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Use Chrome DevTools <strong>Coverage</strong> tool to see exactly which
        bytes of code were actually executed vs wasted.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Build Configuration: Browserslist & Source Maps
      </h3>

      <p>
        Your build configuration has a massive impact on bundle size and parsing
        speed. Two often-overlooked settings can reduce your bundle by 40-60%:
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">Browserslist</h4>

      <p>
        <InteractiveAnchor text="Browserslist" definitionKey="browserslist" />{" "}
        tells your bundler which browsers to support. The default configuration
        includes Internet Explorer 11, which means you&apos;re shipping massive
        polyfills and transpiled code that 99% of your users don&apos;t need.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Check your analytics:</strong> If 95%+ of your users are on
          modern browsers, why support IE 11?
        </li>
        <li>
          <strong>Update your config:</strong> Use{" "}
          <code>&gt;0.2%, not dead, not op_mini all</code> to target modern
          browsers only.
        </li>
        <li>
          <strong>The win:</strong> Smaller bundles (no polyfills), faster
          parsing (native syntax), better performance.
        </li>
      </ul>

      <h4 className="text-lg font-medium mt-4 mb-2">Source Maps</h4>

      <p>
        <InteractiveAnchor text="Source Maps" definitionKey="sourceMaps" /> are
        essential for debugging, but they&apos;re often larger than your actual
        code. Shipping them to production users wastes bandwidth and increases
        load times.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Development:</strong> Use full source maps for debugging.
        </li>
        <li>
          <strong>Production:</strong> Use <code>hidden-source-map</code> or
          disable entirely. Upload maps to error tracking services (Sentry,
          Datadog) separately.
        </li>
        <li>
          <strong>The win:</strong> Users don&apos;t download massive .map
          files, but you can still debug production issues.
        </li>
      </ul>

      <p>
        <CodeAnchor
          text="View Build Configuration Example"
          codeKey="buildOptimizationExample"
        />{" "}
        — See how to configure browserslist and source maps properly.
      </p>

      <p className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-green-800 dark:text-green-200 mt-4">
        <strong>Real Impact:</strong> Updating browserslist alone can reduce
        your bundle from 450KB to 180KB. That&apos;s a 60% reduction with a
        5-line config change!
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Code Splitting with React.lazy
      </h3>

      <p>
        Instead of shipping one massive JavaScript file,{" "}
        <InteractiveAnchor
          text="Code Splitting"
          definitionKey="codeSplitting"
        />{" "}
        breaks your app into chunks that load on-demand.
      </p>

      <p>
        <CodeAnchor
          text="View Code Splitting Example"
          codeKey="lazyLoadingExample"
        />{" "}
        — Learn how to lazy-load heavy components.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Speculative Loading: Predicting User Navigation
      </h3>

      <p>
        Code splitting improves initial page load by shipping only what&apos;s
        needed. But here&apos;s the problem: when a user clicks a link to
        navigate to a new route, the browser has to fetch, parse, and execute
        that route&apos;s JavaScript <em>before</em> it can render the page.
        That creates lag.
      </p>

      <p>
        <strong>Speculative loading</strong> solves this by loading resources{" "}
        <em>before</em> the user needs them. When the user hovers over a link or
        the browser predicts they&apos;ll navigate somewhere, we tell the
        browser to preload that route&apos;s code.
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">
        The Resource Hint API: prefetch vs preload
      </h4>

      <p>
        Browsers provide <code>&lt;link rel&gt;</code> tags to hint at future
        resource needs:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>prefetch:</strong> &quot;I&apos;m not sure the user will need
          this, but load it when idle.&quot; (Low priority)
        </li>
        <li>
          <strong>preload:</strong> &quot;I&apos;m 90% sure this is needed soon,
          load it now!&quot; (High priority)
        </li>
        <li>
          <strong>dns-prefetch:</strong> &quot;We&apos;ll connect to this
          domain, so resolve the DNS now.&quot;
        </li>
      </ul>

      <p>
        <CodeAnchor
          text="View Resource Hints Example"
          codeKey="resourceHints"
        />{" "}
        — See how to implement prefetch and preload.
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">
        Framework vs Build Tool: Who Handles This?
      </h4>

      <p>
        <strong>React frameworks</strong> like Next.js and Remix understand your
        app&apos;s routing structure at the code level. They automatically
        inject resource hints when you use their <code>&lt;Link&gt;</code>{" "}
        components. Hover over a Next.js link? The route&apos;s JavaScript is
        prefetched instantly.
      </p>

      <p>
        <strong>Build tools</strong> like Vite, Webpack, or Create React App
        don&apos;t have this insight. They bundle your code but don&apos;t know
        about your routes. Solutions:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Manual route splitting:</strong> Configure entry points and
          inject hints yourself (tedious).
        </li>
        <li>
          <strong>Use TanStack Router:</strong> Provides route-based code
          splitting for Vite/Webpack apps.
        </li>
        <li>
          <strong>Prefetch all chunks:</strong> Vite&apos;s default—inject
          module preload hints for all imports (can over-fetch).
        </li>
      </ul>

      <h4 className="text-lg font-medium mt-4 mb-2">The Fetch Priority API</h4>

      <p>
        Beyond hints, you can explicitly tell the browser which resources are
        most critical using the{" "}
        <InteractiveAnchor
          text="Fetch Priority API"
          definitionKey="fetchPriority"
        />
        . This is especially powerful for images.
      </p>

      <p>
        For example, setting <code>fetchpriority=&quot;high&quot;</code> on your
        hero image tells the browser to prioritize it over other images. This
        directly improves your <strong>LCP (Largest Contentful Paint)</strong>{" "}
        Web Vital.
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        In Next.js: Use <code>&lt;Image priority /&gt;</code> for above-fold
        images and <code>&lt;Script strategy=&quot;lazyOnload&quot; /&gt;</code>{" "}
        for non-critical third-party scripts.
      </p>

      <h4 className="text-lg font-medium mt-4 mb-2">The Trade-offs</h4>

      <p>
        Speculative loading isn&apos;t free. Here&apos;s what you&apos;re
        trading:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>More server load:</strong> The browser makes prefetch requests
          even if the user never clicks. Solution: Use CDN caching and HTTP
          headers to serve from edge without hitting your origin.
        </li>
        <li>
          <strong>More device work:</strong> The user&apos;s device downloads
          and parses JavaScript they might not need. Fortunately, browsers are
          smart—they won&apos;t prefetch if the device is busy or on a slow
          connection.
        </li>
        <li>
          <strong>Cognitive overhead:</strong> You need to track which routes
          are prefetched, monitor extra network requests, and understand caching
          behavior.
        </li>
      </ul>

      <p className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-yellow-800 dark:text-yellow-200 mt-4">
        <strong>Best Practice:</strong> Start with framework defaults (Next.js
        auto-prefetches). If using Vite/Webpack, implement route-based splitting
        with TanStack Router. Only manually optimize if profiling shows slow
        navigations.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Summary Checklist</h2>

      <p>When you see performance issues, follow this order of operations:</p>

      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>Measure:</strong> Use the Profiler. Are you seeing yellow
          bars?
        </li>
        <li>
          <strong>Simplify:</strong> Are you spreading props? Creating inline
          objects?
        </li>
        <li>
          <strong>Split:</strong> Are high-frequency and low-frequency data in
          the same Context?
        </li>
        <li>
          <strong>Stabilize:</strong> Use useCallback for handlers and useMemo
          for objects passed as props.
        </li>
        <li>
          <strong>Shield:</strong> Use React.memo to protect expensive children
          from noisy parents.
        </li>
        <li>
          <strong>Defer:</strong> Use useDeferredValue for heavy computations
          tied to user input.
        </li>
        <li>
          <strong>Split Bundles:</strong> Apply React.lazy to heavy routes and
          modals.
        </li>
      </ol>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        The Lean React Scorecard
      </h3>

      <p>
        When evaluating a new library or pattern, score it against the{" "}
        <InteractiveAnchor
          text="Lean React Scorecard"
          definitionKey="leanScorecard"
        />
        :
      </p>

      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>Rendering:</strong> Does it cause unnecessary renders?
        </li>
        <li>
          <strong>Reconciliation:</strong> Does it deepen the component tree
          (like CSS-in-JS)?
        </li>
        <li>
          <strong>Footprint:</strong> Does it bloat the bundle size?
        </li>
        <li>
          <strong>Memory:</strong> Does it create excessive closures or objects?
        </li>
        <li>
          <strong>Cognitive Load:</strong> Is it hard to reason about (like deep
          prop drilling)?
        </li>
      </ol>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        If a library scores poorly on 3+ metrics, look for alternatives or
        isolate its usage to non-critical paths.
      </p>

      <p className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-green-800 dark:text-green-200 mt-6">
        <strong>Final Thought:</strong> &quot;Building the right thing wrong is
        better than building the wrong thing right... but you can always make
        the right thing <em>righter</em>.&quot;
      </p>
    </>
  );
}

export default function ReactPerformancePost() {
  return (
    <BlogLayout
      title="React Performance: From Audit to Optimization"
      date="January 3, 2026"
    >
      <BlogContent />
    </BlogLayout>
  );
}
