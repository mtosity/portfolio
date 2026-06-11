import React from "react";

export interface Definition {
  title: string;
  content: React.ReactNode;
}

export interface CodeExample {
  title: string;
  description: string;
  wrongCode?: {
    code: string;
    language: string;
    explanation: string;
  };
  correctCode?: {
    code: string;
    language: string;
    explanation: string;
  };
  alternativeCode?: {
    code: string;
    language: string;
    explanation: string;
  };
}

export const definitions: Record<string, Definition> = {
  useEffect: {
    title: "useEffect Hook",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>useEffect</strong> is a React Hook that lets you perform side
          effects in functional components.
        </p>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Syntax:</h4>
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.82em", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "0.1em 0.35em", color: "var(--fg)" }}>useEffect(setup, dependencies?)</code>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Parameters:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              <strong>setup</strong>: Function with your Effect&apos;s logic
            </li>
            <li>
              <strong>dependencies</strong>: Optional array of values that
              trigger the effect
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Common Use Cases:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Fetching data from APIs</li>
            <li>• Setting up subscriptions</li>
            <li>• Manually changing the DOM</li>
            <li>• Cleanup (timers, subscriptions)</li>
          </ul>
        </div>

        <div style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.3em" }}>
            ⚠️ Important:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Always include all dependencies that are used inside the effect to
            avoid stale closures.
          </p>
        </div>
      </div>
    ),
  },

  useState: {
    title: "useState Hook",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>useState</strong> is a React Hook that lets you add state to
          functional components.
        </p>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Syntax:</h4>
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.82em", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "0.1em 0.35em", color: "var(--fg)" }}>
            const [state, setState] = useState(initialState)
          </code>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Returns:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              <strong>state</strong>: Current state value
            </li>
            <li>
              <strong>setState</strong>: Function to update the state
            </li>
          </ul>
        </div>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.3em" }}>
            💡 Best Practice:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Use functional updates when the new state depends on the previous
            state.
          </p>
        </div>
      </div>
    ),
  },

  useMemo: {
    title: "useMemo Hook",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>useMemo</strong> is a React Hook that lets you cache expensive
          calculations between re-renders.
        </p>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Syntax:</h4>
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.82em", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "0.1em 0.35em", color: "var(--fg)" }}>
            const memoizedValue = useMemo(() =&gt; computation, [dependencies])
          </code>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>When to Use:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Expensive calculations</li>
            <li>• Creating objects that cause re-renders</li>
            <li>• Optimizing child component props</li>
          </ul>
        </div>

        <div style={{ background: "#fff7ed", border: "1px solid #fdba74", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c2410c", marginBottom: "0.3em" }}>
            ⚡ Performance:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Only use when you have a proven performance problem. Profile first!
          </p>
        </div>
      </div>
    ),
  },

  useCallback: {
    title: "useCallback Hook",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>useCallback</strong> is a React Hook that lets you cache a
          function definition between re-renders.
        </p>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Syntax:</h4>
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.82em", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "0.1em 0.35em", color: "var(--fg)" }}>
            const memoizedCallback = useCallback(fn, [dependencies])
          </code>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Common Use Cases:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Preventing unnecessary re-renders of child components</li>
            <li>• Optimizing event handlers passed as props</li>
            <li>• Dependency of other hooks</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            ✅ Tip:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Use with React.memo() for maximum optimization benefit.
          </p>
        </div>
      </div>
    ),
  },

  keys: {
    title: "React Keys",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Keys</strong> help React identify which items have changed,
          are added, or are removed in lists.
        </p>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Requirements:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Must be unique among siblings</li>
            <li>• Should be stable across re-renders</li>
            <li>• Should not be array indices (in most cases)</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Good Key Examples:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • Database IDs: <code>user.id</code>
            </li>
            <li>• UUIDs or unique identifiers</li>
            <li>• Stable content hashes</li>
          </ul>
        </div>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.3em" }}>
            ❌ Avoid:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Using array indices as keys when list items can be reordered, added,
            or removed.
          </p>
        </div>
      </div>
    ),
  },

  immutability: {
    title: "State Immutability",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Immutability</strong> means not changing existing
          objects/arrays, but creating new ones instead.
        </p>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Why It Matters:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• React uses Object.is() to detect changes</li>
            <li>• Enables efficient re-rendering</li>
            <li>• Prevents bugs from shared references</li>
            <li>• Makes state updates predictable</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>
            Safe Update Patterns:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • Arrays: <code>[...items, newItem]</code>
            </li>
            <li>
              • Objects: <code>{`{...obj, prop: newValue}`}</code>
            </li>
            <li>
              • Filtering: <code>items.filter(item =&gt; ...)</code>
            </li>
            <li>
              • Mapping: <code>items.map(item =&gt; ...)</code>
            </li>
          </ul>
        </div>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.3em" }}>
            🔧 Tools:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Consider using Immer for complex state updates.
          </p>
        </div>
      </div>
    ),
  },

  hedonicAdaptation: {
    title: "Hedonic Adaptation",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Hedonic Adaptation</strong> is the tendency for humans to
          quickly return to a baseline level of happiness despite positive or
          negative events.
        </p>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.4em" }}>
            How it works:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Initial boost in happiness from positive changes</li>
            <li>• Gradual return to baseline happiness level</li>
            <li>• New circumstances become "normal"</li>
          </ul>
        </div>

        <div style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.3em" }}>
            Examples:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Winning the lottery, getting a promotion, or buying a new car
            initially brings joy, but happiness levels typically return to
            baseline within months.
          </p>
        </div>
      </div>
    ),
  },

  affectiveForecasting: {
    title: "Affective Forecasting",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Affective Forecasting</strong> is our ability to predict how
          future events will make us feel. Humans are notoriously bad at this.
        </p>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.4em" }}>
            Common Mistakes:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>Impact bias:</strong> Overestimating intensity of future
              emotions
            </li>
            <li>
              • <strong>Durability bias:</strong> Overestimating how long
              emotions will last
            </li>
            <li>
              • <strong>Focusing illusion:</strong> Overweighting one factor
              while ignoring others
            </li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            Why it matters:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Understanding this bias helps us make better decisions and have more
            realistic expectations about future happiness.
          </p>
        </div>
      </div>
    ),
  },

  socialComparison: {
    title: "Social Comparison Theory",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Social Comparison Theory</strong> explains how we evaluate
          ourselves relative to others to assess our own worth and abilities.
        </p>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.4em" }}>
            Types of Comparison:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>Upward:</strong> Comparing to those "better off"
            </li>
            <li>
              • <strong>Downward:</strong> Comparing to those "worse off"
            </li>
            <li>
              • <strong>Lateral:</strong> Comparing to similar others
            </li>
          </ul>
        </div>

        <div style={{ background: "#fff7ed", border: "1px solid #fdba74", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c2410c", marginBottom: "0.3em" }}>
            Impact on happiness:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Frequent upward comparisons can decrease life satisfaction, while
            focusing on personal progress tends to increase well-being.
          </p>
        </div>
      </div>
    ),
  },

  mindfulness: {
    title: "Mindfulness",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Mindfulness</strong> is the practice of purposeful,
          non-judgmental awareness of the present moment.
        </p>

        <div style={{ background: "#f0fdfa", border: "1px solid #5eead4", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0f766e", marginBottom: "0.4em" }}>
            Core Elements:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Present-moment awareness</li>
            <li>• Non-judgmental observation</li>
            <li>• Acceptance of current experience</li>
            <li>• Letting go of mental autopilot</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            Benefits for happiness:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Regular mindfulness practice can increase life satisfaction, reduce
            stress, and help you savor positive experiences more fully.
          </p>
        </div>
      </div>
    ),
  },

  gratitudePractice: {
    title: "Gratitude Practice",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Gratitude Practice</strong> involves regularly acknowledging
          and appreciating positive aspects of life, both big and small.
        </p>

        <div style={{ background: "#fdf2f8", border: "1px solid #f9a8d4", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#be185d", marginBottom: "0.4em" }}>
            Effective Methods:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Three good things exercise (daily)</li>
            <li>• Gratitude journaling</li>
            <li>• Gratitude letters to others</li>
            <li>• Mindful appreciation moments</li>
          </ul>
        </div>

        <div style={{ background: "#eef2ff", border: "1px solid #a5b4fc", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4f46e5", marginBottom: "0.3em" }}>
            Research findings:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Studies show gratitude practice can increase happiness by 25%,
            improve sleep quality, strengthen relationships, and boost immune
            function.
          </p>
        </div>
      </div>
    ),
  },

  // Vietnamese Financial Terms
  thamHutNganSach: {
    title: "Thâm Hụt Ngân Sách (Budget Deficit)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Thâm hụt ngân sách</strong> xảy ra khi chính phủ chi tiêu
          nhiều hơn số tiền thu được từ thuế và các nguồn thu khác.
        </p>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.4em" }}>
            Tác động:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Chính phủ phải đi vay để bù đắp</li>
            <li>• Tăng nợ công quốc gia</li>
            <li>• Có thể dẫn đến lạm phát nếu in thêm tiền</li>
          </ul>
        </div>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.3em" }}>
            Cách xử lý:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Chính phủ thường phát hành trái phiếu để vay tiền thay vì in thêm
            tiền.
          </p>
        </div>
      </div>
    ),
  },

  traiPhieuKhoBac: {
    title: "Trái Phiếu Kho Bạc (Treasury Bonds)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Trái phiếu kho bạc</strong> là chứng khoán nợ do chính phủ
          phát hành để huy động vốn từ các nhà đầu tư.
        </p>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.4em" }}>
            Các loại:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>Treasury Bills:</strong> Ngắn hạn (&lt;1 năm)
            </li>
            <li>
              • <strong>Treasury Notes:</strong> Trung hạn (2-10 năm)
            </li>
            <li>
              • <strong>Treasury Bonds:</strong> Dài hạn (20-30 năm)
            </li>
          </ul>
        </div>

        <div style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.3em" }}>
            💡 Đặc điểm:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Được coi là đầu tư an toàn nhất vì có sự bảo đảm của chính phủ Mỹ.
          </p>
        </div>
      </div>
    ),
  },

  lamPhat: {
    title: "Lạm Phát (Inflation)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Lạm phát</strong> là hiện tượng giá cả hàng hóa và dịch vụ
          tăng liên tục trong thời gian dài.
        </p>

        <div style={{ background: "#fff7ed", border: "1px solid #fdba74", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c2410c", marginBottom: "0.4em" }}>
            Nguyên nhân chính:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• In quá nhiều tiền</li>
            <li>• Cầu vượt quá cung</li>
            <li>• Chi phí sản xuất tăng</li>
          </ul>
        </div>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.3em" }}>
            ⚠️ Ví dụ lịch sử:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Đức sau Thế chiến I và Zimbabwe trong những năm 2000 đã trải qua
            siêu lạm phát.
          </p>
        </div>
      </div>
    ),
  },

  brettonWoods: {
    title: "Hiệp Định Bretton Woods (1944)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Hiệp định Bretton Woods</strong> là thỏa thuận quốc tế thiết
          lập hệ thống tiền tệ toàn cầu sau Thế chiến II.
        </p>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.4em" }}>
            Nội dung chính:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Đô la Mỹ được neo vào vàng</li>
            <li>• Các đồng tiền khác neo vào đô la</li>
            <li>• Tỷ giá hối đoái cố định</li>
          </ul>
        </div>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.3em" }}>📅 Kết thúc: 1971</h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Nixon Shock chấm dứt việc quy đổi đô la sang vàng.
          </p>
        </div>
      </div>
    ),
  },

  nixonShock: {
    title: "Nixon Shock (1971)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Nixon Shock</strong> là quyết định của Tổng thống Nixon ngừng
          quy đổi đô la Mỹ sang vàng vào năm 1971.
        </p>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.4em" }}>
            Hậu quả:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Đô la trở thành tiền pháp định</li>
            <li>• Tỷ giá hối đoái thả nổi</li>
            <li>• Kết thúc hệ thống Bretton Woods</li>
          </ul>
        </div>

        <div style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.3em" }}>
            🌍 Tác động toàn cầu:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Bắt đầu kỷ nguyên đô la dựa vào niềm tin chứ không phải vàng.
          </p>
        </div>
      </div>
    ),
  },

  tienPhapDinh: {
    title: "Tiền Pháp Định (Fiat Currency)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Tiền pháp định</strong> là đồng tiền không được bảo đảm bằng
          vàng hay kim loại quý, mà dựa vào niềm tin của người dân.
        </p>

        <div style={{ background: "#eef2ff", border: "1px solid #a5b4fc", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4f46e5", marginBottom: "0.4em" }}>
            Đặc điểm:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Không neo vào vàng</li>
            <li>• Giá trị dựa vào niềm tin</li>
            <li>• Chính phủ có thể in thêm tiền</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            ✅ Ưu điểm:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Linh hoạt trong chính sách tiền tệ để ứng phó với khủng hoảng.
          </p>
        </div>
      </div>
    ),
  },

  petrodollar: {
    title: "Petrodollar",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Petrodollar</strong> là hệ thống sử dụng đô la Mỹ làm đồng
          tiền chính trong giao dịch dầu mỏ toàn cầu.
        </p>

        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.4em" }}>
            Cách hoạt động:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Dầu được bán bằng đô la</li>
            <li>• Các nước phải có đô la để mua dầu</li>
            <li>• Tăng cầu đô la toàn cầu</li>
          </ul>
        </div>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.3em" }}>
            💪 Củng cố sức mạnh:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Giúp duy trì vị thế đô la như đồng tiền dự trữ toàn cầu.
          </p>
        </div>
      </div>
    ),
  },

  thanhKhoan: {
    title: "Thanh Khoản (Liquidity)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Thanh khoản</strong> là khả năng chuyển đổi một tài sản thành
          tiền mặt một cách nhanh chóng và không mất giá.
        </p>

        <div style={{ background: "#f0fdfa", border: "1px solid #5eead4", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0f766e", marginBottom: "0.4em" }}>
            Mức độ thanh khoản:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>Cao:</strong> Tiền mặt, trái phiếu chính phủ
            </li>
            <li>
              • <strong>Trung bình:</strong> Cổ phiếu lớn
            </li>
            <li>
              • <strong>Thấp:</strong> Bất động sản, tranh nghệ thuật
            </li>
          </ul>
        </div>

        <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#047857", marginBottom: "0.3em" }}>
            🏦 Thị trường Mỹ:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Có thanh khoản cao nhất thế giới, thu hút nhà đầu tư toàn cầu.
          </p>
        </div>
      </div>
    ),
  },

  // React Performance Terms
  wastedRender: {
    title: "Wasted Render",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          A <strong>Wasted Render</strong> happens when React runs a
          component&apos;s logic and generates a Virtual DOM tree, but the
          result is exactly the same as before.
        </p>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.4em" }}>
            Why it&apos;s bad:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Burns CPU cycles for no visible change</li>
            <li>• Slows down your app unnecessarily</li>
            <li>• Drains battery on mobile devices</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            ✅ How to detect:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Use React DevTools Profiler. Yellow/red bars indicate components
            that took time to render.
          </p>
        </div>
      </div>
    ),
  },

  webVitals: {
    title: "Web Vitals",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Web Vitals</strong> are Google&apos;s industry-standard
          metrics for measuring real user experience on websites.
        </p>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.4em" }}>
            Core Metrics:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>LCP:</strong> Largest Contentful Paint (loading speed)
            </li>
            <li>
              • <strong>CLS:</strong> Cumulative Layout Shift (visual stability)
            </li>
            <li>
              • <strong>INP:</strong> Interaction to Next Paint (responsiveness)
            </li>
          </ul>
        </div>

        <div style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.3em" }}>
            💡 Good to know:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            These metrics affect your Google Search ranking!
          </p>
        </div>
      </div>
    ),
  },

  shallowEquality: {
    title: "Shallow Equality (===)",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Shallow Equality</strong> is how React compares props using
          the strict equality operator (===). This is the root cause of many
          performance issues.
        </p>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>Examples:</h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              ✅ <code>true === true</code> (Pass)
            </li>
            <li>
              ✅ <code>1 === 1</code> (Pass)
            </li>
            <li>
              ❌ <code>{`{ id: 1 } === { id: 1 }`}</code> (FAIL!)
            </li>
          </ul>
        </div>

        <div style={{ background: "#fff7ed", border: "1px solid #fdba74", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c2410c", marginBottom: "0.3em" }}>
            ⚠️ The trap:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Objects, Arrays, and Functions are reference types. Creating new
            ones makes React think data changed!
          </p>
        </div>
      </div>
    ),
  },

  reconciliation: {
    title: "Reconciliation",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Reconciliation</strong> is React&apos;s process of comparing
          the new Virtual DOM tree with the old one to figure out what actually
          changed.
        </p>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.4em" }}>
            The Process:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>1. Build new Virtual DOM tree</li>
            <li>2. Compare with old tree (diffing)</li>
            <li>3. Calculate minimal changes needed</li>
            <li>4. Apply only those changes to real DOM</li>
          </ul>
        </div>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.3em" }}>
            💡 Performance tip:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Shallower component trees = faster reconciliation = better
            performance.
          </p>
        </div>
      </div>
    ),
  },

  treeShaking: {
    title: "Tree Shaking",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Tree Shaking</strong> is the process of removing unused code
          (dead code) from your JavaScript bundle during the build.
        </p>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.4em" }}>
            How it works:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Bundler analyzes your imports</li>
            <li>• Removes functions you never call</li>
            <li>• Smaller bundle = faster load times</li>
          </ul>
        </div>

        <div style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.3em" }}>
            ⚠️ Gotcha:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Use named exports instead of default objects. Bundlers can&apos;t
            shake out unused keys from objects!
          </p>
        </div>
      </div>
    ),
  },

  codeSplitting: {
    title: "Code Splitting",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Code Splitting</strong> breaks your app into smaller chunks
          that load on-demand instead of shipping everything at once.
        </p>

        <div style={{ background: "#eef2ff", border: "1px solid #a5b4fc", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4f46e5", marginBottom: "0.4em" }}>
            Types:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>Static:</strong> Separate vendor vs app code
            </li>
            <li>
              • <strong>Dynamic:</strong> Load on user interaction
            </li>
            <li>
              • <strong>Route-based:</strong> Load per page/route
            </li>
          </ul>
        </div>

        <div style={{ background: "#f0fdfa", border: "1px solid #5eead4", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0f766e", marginBottom: "0.3em" }}>
            ✅ In React:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Use <code>React.lazy()</code> and <code>Suspense</code> to split
            heavy components.
          </p>
        </div>
      </div>
    ),
  },

  reactMemo: {
    title: "React.memo()",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>React.memo()</strong> is a higher-order component that
          prevents re-renders when props haven&apos;t changed.
        </p>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>How it works:</h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Wraps your component in a &quot;shield&quot; that compares old vs
            new props before deciding to re-render.
          </p>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            ✅ When to use:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Expensive child components</li>
            <li>• Parents that update frequently</li>
            <li>• When Profiler shows wasted renders</li>
          </ul>
        </div>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.3em" }}>
            ❌ Don&apos;t overuse:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Adds memory overhead. Only use when Profiler proves you have a
            problem!
          </p>
        </div>
      </div>
    ),
  },

  rumVsSynthetic: {
    title: "RUM vs Synthetic Monitoring",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          Two approaches to monitoring your app&apos;s performance in the real
          world.
        </p>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.4em" }}>
            RUM (Real User Monitoring):
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Data from actual users&apos; browsers</li>
            <li>• High variability (different devices/networks)</li>
            <li>• Shows real pain points</li>
          </ul>
        </div>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.4em" }}>
            Synthetic Monitoring:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Automated tests in controlled lab</li>
            <li>• Low variability (consistent)</li>
            <li>• Catches regressions before deploy</li>
          </ul>
        </div>
      </div>
    ),
  },

  profilerApi: {
    title: "React Profiler API",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          The <strong>Profiler API</strong> lets you measure rendering
          performance programmatically in your code.
        </p>

        <div style={{ background: "#f9fafb", border: "1px solid #d1d5db", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "0.4em" }}>
            Key metrics provided:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>actualDuration:</strong> Time spent rendering
            </li>
            <li>
              • <strong>baseDuration:</strong> Time without memoization
            </li>
            <li>
              • <strong>phase:</strong> &quot;mount&quot; or &quot;update&quot;
            </li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            💡 Pro tip:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            If actualDuration ≈ baseDuration on updates, your memoization is
            broken!
          </p>
        </div>
      </div>
    ),
  },

  useDeferredValue: {
    title: "useDeferredValue Hook",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>useDeferredValue</strong> tells React to prioritize urgent
          updates (like typing) over expensive ones (like filtering a list).
        </p>

        <div style={{ background: "#eef2ff", border: "1px solid #a5b4fc", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4f46e5", marginBottom: "0.4em" }}>
            How it works:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Returns a &quot;deferred&quot; version of a value</li>
            <li>• React updates UI immediately for urgent updates</li>
            <li>• Heavy updates happen in background</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdfa", border: "1px solid #5eead4", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0f766e", marginBottom: "0.3em" }}>
            ✅ Perfect for:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Search inputs that filter large lists, autocomplete, or any input +
            heavy computation combo.
          </p>
        </div>
      </div>
    ),
  },

  stylingStrategy: {
    title: "Styling Strategy & Performance",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          How you style your React app directly affects the{" "}
          <strong>Reconciliation</strong> cost—the process where React compares
          Virtual DOM trees.
        </p>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.4em" }}>
            ⚠️ CSS-in-JS (Styled Components):
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Creates deep component wrappers</li>
            <li>• Runtime style computation</li>
            <li>• Higher reconciliation cost</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.4em" }}>
            ✅ Atomic CSS (Tailwind):
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Zero runtime cost</li>
            <li>• Tiny footprint</li>
            <li>• No component wrappers</li>
          </ul>
        </div>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.4em" }}>
            ✅ CSS Modules:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Scoped styles, no runtime cost</li>
            <li>• Solid middle ground</li>
            <li>• Works great with React</li>
          </ul>
        </div>
      </div>
    ),
  },

  renderProps: {
    title: "Render Props Pattern",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Render Props</strong> is a pattern where a component takes a
          function as a prop that returns React elements. It allows you to
          isolate renders to specific parts of your UI.
        </p>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.4em" }}>
            Why use it:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Hooks couple state to the whole component</li>
            <li>• Render props isolate updates to sub-sections</li>
            <li>• Only the specific part re-renders</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdfa", border: "1px solid #5eead4", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0f766e", marginBottom: "0.3em" }}>
            ✅ Perfect for:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            High-performance forms (like React Final Form), animation libraries,
            and any scenario where you need fine-grained render control.
          </p>
        </div>
      </div>
    ),
  },

  leanScorecard: {
    title: "The Lean React Scorecard",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          When evaluating a new library or pattern, score it against these
          metrics to improve real-user experience:
        </p>

        <div style={{ margin: "0.75rem 0" }}>
          <img
            src="/blog-images/react-performance/scorecard.png"
            alt="React Performance Scorecard - Application Delivery Scorecard"
            style={{ maxWidth: "100%", height: "auto", display: "block", border: "1px solid var(--border-light)" }}
          />
        </div>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.4em" }}>
            🎯 Quantitative Metrics:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>Improve initial load:</strong> Does it reduce time to
              interactive?
            </li>
            <li>
              • <strong>Smaller footprint:</strong> Does it minimize bundle
              size?
            </li>
            <li>
              • <strong>Less energy usage:</strong> Does it reduce CPU/battery
              drain?
            </li>
            <li>
              • <strong>Smarter networking:</strong> Does it optimize data
              fetching?
            </li>
          </ul>
        </div>

        <div style={{ background: "#fdf2f8", border: "1px solid #f9a8d4", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#be185d", marginBottom: "0.4em" }}>
            🧠 Qualitative Metrics:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>More flexibility:</strong> Can it adapt to different use
              cases?
            </li>
            <li>
              • <strong>Promotes reuse:</strong> Does it encourage composable
              patterns?
            </li>
            <li>
              • <strong>Less cognitive load:</strong> Is it easy to understand
              and maintain?
            </li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.3em" }}>
            💡 Rule of thumb:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            If a library or pattern scores poorly on 3+ metrics, look for
            alternatives or isolate its usage to non-critical paths.
          </p>
        </div>
      </div>
    ),
  },

  suspenseTransitions: {
    title: "Suspense & Transitions",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Suspense</strong> and <strong>Transitions</strong> are React
          18 features that let you mark updates as &quot;non-urgent&quot; so
          React can prioritize user interactions.
        </p>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.4em" }}>
            How it works:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>startTransition:</strong> Marks state updates as low
              priority
            </li>
            <li>
              • <strong>Suspense:</strong> Shows fallback while data loads
            </li>
            <li>• React keeps the UI responsive during heavy updates</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.4em" }}>
            Use cases:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • Route transitions (navigate while old page stays interactive)
            </li>
            <li>• Data fetching (show stale data while new data loads)</li>
            <li>• Tab switching (keep other tabs responsive)</li>
          </ul>
        </div>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.3em" }}>
            ✨ The power:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Unlike useDeferredValue (which defers a value), startTransition
            defers the entire state update, giving you even finer control over
            rendering priorities.
          </p>
        </div>
      </div>
    ),
  },

  browserslist: {
    title: "Browserslist Configuration",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Browserslist</strong> tells your bundler which browsers you
          support, so it knows which syntax to transpile and which polyfills to
          include.
        </p>

        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: "0.4em" }}>
            ❌ Too broad (default):
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <code>&quot;defaults&quot;</code> includes IE 11!
            </li>
            <li>• Ships massive polyfills for ancient browsers</li>
            <li>• Transpiles modern syntax unnecessarily</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.4em" }}>
            ✅ Optimized for modern browsers:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <code>&quot;last 2 versions, not dead&quot;</code>
            </li>
            <li>• Smaller bundles (no IE polyfills)</li>
            <li>• Faster parsing (native modern syntax)</li>
          </ul>
        </div>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.3em" }}>
            💡 Pro tip:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Check your analytics! If 99% of users are on modern browsers, why
            ship polyfills for the 1%?
          </p>
        </div>
      </div>
    ),
  },

  sourceMaps: {
    title: "Source Maps in Production",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          <strong>Source Maps</strong> let you debug minified production code,
          but they come with a performance cost if shipped to users.
        </p>

        <div style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b45309", marginBottom: "0.4em" }}>
            ⚠️ The trade-off:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>• Source maps are HUGE (often larger than your code)</li>
            <li>• Users download them even though they never use them</li>
            <li>• Increases bandwidth costs</li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.4em" }}>
            ✅ Best practice:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <strong>Development:</strong> Full source maps for debugging
            </li>
            <li>
              • <strong>Production:</strong> <code>hidden-source-map</code> or
              none
            </li>
            <li>
              • Upload maps to error tracking (Sentry, Datadog) separately
            </li>
          </ul>
        </div>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.3em" }}>
            🔧 Webpack config:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Set <code>devtool: &apos;hidden-source-map&apos;</code> to generate
            maps without the comment in your bundle. Users don&apos;t download
            them, but you can still debug crashes!
          </p>
        </div>
      </div>
    ),
  },

  fetchPriority: {
    title: "Fetch Priority API",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
          The <strong>Fetch Priority API</strong> lets you tell the browser
          which resources are most important to load first.
        </p>

        <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "0.4em" }}>
            Priority values:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • <code>fetchpriority=&quot;high&quot;</code> - Load ASAP (hero
              images, critical CSS)
            </li>
            <li>
              • <code>fetchpriority=&quot;low&quot;</code> - Load when idle
              (below-fold images)
            </li>
            <li>
              • <code>fetchpriority=&quot;auto&quot;</code> - Let browser decide
              (default)
            </li>
          </ul>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2d7a4f", marginBottom: "0.4em" }}>
            Perfect for:
          </h4>
          <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
            <li>
              • Improving LCP (Largest Contentful Paint) by prioritizing hero
              images
            </li>
            <li>• Loading critical fonts faster</li>
            <li>• Deferring below-the-fold images</li>
          </ul>
        </div>

        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.75rem 1rem", margin: "0.25rem 0" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.3em" }}>
            💡 In Next.js:
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
            Use <code>&lt;Image priority /&gt;</code> for above-fold images and
            <code>&lt;Script strategy=&quot;lazyOnload&quot; /&gt;</code> for
            non-critical scripts.
          </p>
        </div>
      </div>
    ),
  },
};

export const codeExamples: Record<string, CodeExample> = {
  stateReference: {
    title: "setState the Same Array/Object References",
    description:
      "Mutating state directly instead of creating new references prevents React from detecting changes.",
    wrongCode: {
      code: `import { useState } from "react";

function App() {
  const [items, setItems] = useState(["Bread"]);

  return (
    <>
      <div>
        <p>{items.join(", ")}</p>
        <button
          onClick={() => {
            items.push("Egg");
            console.log(items);
            setItems(items); // This will not work, because React will not detect the change,
            // since the array is the same reference, even though the content is different
          }}
        >
          Add Egg
        </button>
      </div>
    </>
  );
}`,
      language: "jsx",
      explanation:
        "React will not detect the change since the array reference is the same, even though the content changed.",
    },
    correctCode: {
      code: `import { useState } from "react";

function App() {
  const [items, setItems] = useState(["Bread"]);

  return (
    <>
      <div>
        <p>{items.join(", ")}</p>
        <button
          onClick={() => {
            setItems([...items, "Egg"]); // This will work, because we are creating a new array
          }}
        >
          Add Egg
        </button>
      </div>
    </>
  );
}`,
      language: "jsx",
      explanation:
        "Creating a new array with the spread operator allows React to detect the change and re-render.",
    },
  },

  unnecessaryUseEffect: {
    title: "Using useEffect for Unnecessary Tracking",
    description:
      "Many developers overuse useEffect for computations that could be done directly during rendering.",
    wrongCode: {
      code: `import React, { useEffect, useState } from "react";

const UserAgeCalculator = ({ userInfo }) => {
  const [userAge, setUserAge] = useState(0);

  useEffect(() => {
    // Track changes in 'userInfo' prop and calculate user age
    const age = calculateAge(userInfo.birthdate);
    setUserAge(age);
  }, [userInfo]);

  return (
    <div>
      <h2>User Information</h2>
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
      <p>Age: {userAge}</p>
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "Using useEffect for simple calculations adds unnecessary complexity and potential bugs.",
    },
    correctCode: {
      code: `import React from "react";

const UserAgeCalculator = ({ userInfo }) => {
  const userAge = calculateAge(userInfo.birthdate);

  return (
    <div>
      <h2>User Information</h2>
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
      <p>Age: {userAge}</p>
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "Calculate the value directly during render - simpler, more predictable, and less error-prone.",
    },
  },

  noCleanup: {
    title: "Not Using Cleanup Functions in useEffect",
    description:
      "Failing to clean up asynchronous operations can lead to race conditions and memory leaks.",
    wrongCode: {
      code: `export const Example3 = () => {
  const [data, setData] = React.useState("");
  const [selectValue, setSelectValue] = React.useState("volvo");

  useEffect(() => {
    heavyNetworkMock.getSomethingHeavy(selectValue).then((data) => {
      setData(data);
    });
  }, [selectValue]);

  return (
    <div>
      <select
        name="cars"
        onChange={(e) => {
          setSelectValue(e.target.value);
        }}
      >
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      <div>{data}</div>
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "Without cleanup, rapid changes could cause race conditions where old requests complete after new ones.",
    },
    correctCode: {
      code: `export const Example3 = () => {
  const [data, setData] = React.useState("");
  const [selectValue, setSelectValue] = React.useState("volvo");

  useEffect(() => {
    heavyNetworkMock.getSomethingHeavy(selectValue).then((data) => {
      setData(data);
    });

    // Include cleanup function to cancel ongoing heavy data fetch
    return () => {
      heavyNetworkMock.cancelHeavy();
    };
  }, [selectValue]);

  return (
    <div>
      <select
        name="cars"
        onChange={(e) => {
          setSelectValue(e.target.value);
        }}
      >
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      <div>{data}</div>
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "The cleanup function cancels ongoing requests, preventing race conditions and memory leaks.",
    },
  },

  tooManyUseStates: {
    title: "Using Too Many useStates for a Form",
    description:
      "Managing form state with multiple useState hooks can lead to verbose code and unnecessary re-renders.",
    wrongCode: {
      code: `export const Example4 = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [selectValue, setSelectValue] = React.useState("volvo");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, selectValue });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <select
          name="cars"
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};`,
      language: "jsx",
      explanation:
        "Multiple useState calls create unnecessary complexity and can cause performance issues with many form fields.",
    },
    correctCode: {
      code: `export const Example4 = () => {
  const formRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current ?? undefined);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div>
        <input type="text" name="name" placeholder="Name" />
      </div>
      <div>
        <input type="text" name="email" placeholder="Email" />
      </div>
      <div>
        <select name="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};`,
      language: "jsx",
      explanation:
        "Using useRef with FormData simplifies form handling and eliminates unnecessary re-renders.",
    },
  },

  useEffectVsLayoutEffect: {
    title: "Not Using useLayoutEffect for Layout Shifting",
    description:
      "useLayoutEffect runs synchronously before browser paint, preventing layout shifts.",
    wrongCode: {
      code: `export const Example5 = () => {
  const [marginTop, setMarginTop] = useState(0);

  useEffect(() => {
    setMarginTop(100);

    return () => {
      setMarginTop(0);
    };
  }, []);

  // This artificially slows down rendering
  const now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  return (
    <div
      style={{
        marginTop,
        backgroundColor: "red",
      }}
    >
      Example
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "useEffect runs after paint, causing visible layout shift as the element jumps from position 0 to 100.",
    },
    correctCode: {
      code: `export const Example5 = () => {
  const [marginTop, setMarginTop] = useState(0);

  useLayoutEffect(() => {
    setMarginTop(100);

    return () => {
      setMarginTop(0);
    };
  }, []);

  // This artificially slows down rendering
  const now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  return (
    <div
      style={{
        marginTop,
        backgroundColor: "red",
      }}
    >
      Example
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "useLayoutEffect runs before paint, preventing visible layout shift and providing smooth rendering.",
    },
  },

  unnecessaryDependencies: {
    title: "Unnecessary useEffect Function Dependencies",
    description:
      "Including functions in useEffect dependencies that recreate on every render causes unnecessary re-runs.",
    wrongCode: {
      code: `function ChatRoom() {
  const [message, setMessage] = useState("");

  const createRoom = useCallback(() => {
    // 🚩 This function is created from scratch on every re-render
    const roomId = Math.random();
    return {
      serverUrl: "url",
      roomId: roomId,
      message: "Welcome to the chat room " + roomId + "!",
    };
  }, []);

  useEffect(() => {
    const room = createRoom(); // It's used inside the Effect
    setMessage(room.message);
  }, [createRoom]); // 🚩 As a result, these dependencies are always different on a re-render

  return <div>{message}</div>;
}`,
      language: "jsx",
      explanation:
        "The function dependency causes the effect to run on every render, even when unnecessary.",
    },
    correctCode: {
      code: `function ChatRoom() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const createRoom = () => {
      const roomId = Math.random();
      return {
        serverUrl: "url",
        roomId: roomId,
        message: "Welcome to the chat room " + roomId + "!",
      };
    };

    const room = createRoom(); // It's used inside the Effect
    setMessage(room.message);
  }, []); // No unnecessary dependencies

  return <div>{message}</div>;
}`,
      language: "jsx",
      explanation:
        "Moving the function inside the effect eliminates the dependency and prevents unnecessary re-runs.",
    },
    alternativeCode: {
      code: `function ChatRoom() {
  const [message, setMessage] = useState("");

  const createRoom = useCallback(() => {
    const roomId = Math.random();
    return {
      serverUrl: "url",
      roomId: roomId,
      message: "Welcome to the chat room " + roomId + "!",
    };
  }, []); // Properly memoized

  useEffect(() => {
    const room = createRoom();
    setMessage(room.message);
  }, [createRoom]); // Now this dependency is stable

  return <div>{message}</div>;
}`,
      language: "jsx",
      explanation:
        "Alternatively, properly memoize the function with useCallback to make the dependency stable.",
    },
  },

  // Video Call App Code Examples
  mainGo: {
    title: "Go Main Server Setup",
    description:
      "Main server file that sets up HTTP endpoints, WebSocket handling, and CORS for the signaling server.",
    correctCode: {
      code: `package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := mux.NewRouter()

	// WebSocket endpoint for signaling
	r.HandleFunc("/ws", handleWebSocket)

	// REST API endpoints
	r.HandleFunc("/api/rooms", createRoom).Methods("POST")
	r.HandleFunc("/api/rooms/{roomId}", getRoomInfo).Methods("GET")

	// Enable CORS for React development
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}`,
      language: "go",
      explanation:
        "Sets up the main HTTP server with WebSocket support, REST endpoints for room management, and CORS configuration for frontend development.",
    },
  },

  webSocketHandlers: {
    title: "WebSocket Message Handlers",
    description:
      "Core WebSocket logic for handling signaling messages, room management, and peer connection coordination.",
    correctCode: {
      code: `package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin in development
	},
}

type Room struct {
	ID          string                           \`json:"id"\`
	Clients     map[*websocket.Conn]*ClientInfo  \`json:"-"\`
	Broadcast   chan []byte                      \`json:"-"\`
	Register    chan *websocket.Conn             \`json:"-"\`
	Unregister  chan *websocket.Conn             \`json:"-"\`
	CreatedAt   time.Time                        \`json:"createdAt"\`
}

type ClientInfo struct {
	ID       string    \`json:"id"\`
	Name     string    \`json:"name"\`
	Conn     *websocket.Conn \`json:"-"\`
	JoinedAt time.Time \`json:"joinedAt"\`
}

type Message struct {
	Type     string      \`json:"type"\`
	Data     interface{} \`json:"data"\`
	RoomID   string      \`json:"roomId,omitempty"\`
	ClientID string      \`json:"clientId,omitempty"\`
	ClientName string    \`json:"clientName,omitempty"\`
	TargetID string      \`json:"targetId,omitempty"\`
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("WebSocket read error:", err)
			break
		}

		handleMessage(conn, msg)
	}
}

func handleMessage(conn *websocket.Conn, msg Message) {
	switch msg.Type {
	case "join-room":
		joinRoom(conn, msg.RoomID, msg.ClientID, msg.ClientName)
	case "offer", "answer", "ice-candidate":
		relayMessage(msg)
	case "leave-room":
		leaveRoom(conn, msg.RoomID)
	}
}`,
      language: "go",
      explanation:
        "Handles WebSocket connections, message parsing, and routing for different signaling message types including room joining and WebRTC signaling.",
    },
  },

  redisIntegration: {
    title: "Redis Integration for Scalability",
    description:
      "Redis client setup for persistent storage and pub/sub messaging to support multiple server instances.",
    correctCode: {
      code: `package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

type RedisManager struct {
	client *redis.Client
	ctx    context.Context
}

func NewRedisManager() *RedisManager {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	ctx := context.Background()

	// Test connection
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Printf("Redis connection failed: %v", err)
		return nil
	}

	log.Println("Redis connected successfully")
	return &RedisManager{
		client: rdb,
		ctx:    ctx,
	}
}

// Store room information in Redis
func (r *RedisManager) StoreRoom(roomID string, roomData map[string]interface{}) error {
	data, err := json.Marshal(roomData)
	if err != nil {
		return err
	}

	return r.client.Set(r.ctx, "room:"+roomID, data, 24*time.Hour).Err()
}

// Publish real-time updates to subscribers
func (r *RedisManager) PublishUpdate(channel string, data interface{}) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	return r.client.Publish(r.ctx, channel, jsonData).Err()
}

// Add user to room set
func (r *RedisManager) AddUserToRoom(roomID, userID string) error {
	return r.client.SAdd(r.ctx, "room:"+roomID+":users", userID).Err()
}`,
      language: "go",
      explanation:
        "Provides Redis connectivity for storing room data, publishing real-time updates, and managing user sessions across multiple server instances.",
    },
  },

  webRTCService: {
    title: "WebRTC Service Class",
    description:
      "Complete TypeScript service for managing WebRTC peer connections, signaling, and media streams in the React frontend.",
    correctCode: {
      code: `export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room' | 'user-joined' | 'existing-user' | 'user-left';
  data?: any;
  roomId?: string;
  clientId?: string;
  clientName?: string;
  targetId?: string;
}

export class WebRTCService {
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, PeerConnection> = new Map();
  private websocket: WebSocket | null = null;
  private roomId: string | null = null;
  private clientId: string;

  // Event callbacks
  public onLocalStream?: (stream: MediaStream) => void;
  public onRemoteStream?: (clientId: string, stream: MediaStream) => void;
  public onUserJoined?: (clientId: string, clientName?: string) => void;

  constructor() {
    this.clientId = this.generateClientId();
  }

  async initializeLocalStream(video: boolean = true, audio: boolean = true): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio: audio
      });

      if (this.onLocalStream) {
        this.onLocalStream(this.localStream);
      }

      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  connectToSignalingServer(serverUrl: string = 'ws://localhost:8080/ws'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.websocket = new WebSocket(serverUrl);

      this.websocket.onopen = () => {
        console.log('Connected to signaling server');
        resolve();
      };

      this.websocket.onmessage = (event) => {
        const message: SignalingMessage = JSON.parse(event.data);
        this.handleSignalingMessage(message);
      };
    });
  }

  private createPeerConnection(clientId: string): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          peerConnection.addTrack(track, this.localStream);
        }
      });
    }

    return peerConnection;
  }
}`,
      language: "typescript",
      explanation:
        "Comprehensive WebRTC service that handles peer connections, media stream management, and signaling server communication for real-time video calling.",
    },
  },

  appComponent: {
    title: "Main App Component",
    description:
      "React component that manages application routing between home page and video call room, handling room state and user information.",
    correctCode: {
      code: `import React, { useState } from 'react';
import HomePage from './components/HomePage';
import VideoCallRoom from './components/VideoCallRoom';

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleJoinRoom = (roomId: string, userName: string) => {
    setCurrentRoom(roomId);
    setUserName(userName);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setUserName('');
  };

  return (
    <div className="App">
      {currentRoom ? (
        <VideoCallRoom
          roomId={currentRoom}
          userName={userName}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <HomePage onJoinRoom={handleJoinRoom} />
      )}
    </div>
  );
}

export default App;`,
      language: "jsx",
      explanation:
        "Main application component that handles routing between the home page and video call room, managing room state and user session data.",
    },
  },

  homePageComponent: {
    title: "Home Page Component",
    description:
      "Landing page component with room creation and joining functionality, featuring a Google Meet-inspired interface design.",
    correctCode: {
      code: `import React, { useState } from 'react';
import { Button } from './ui/button';

interface HomePageProps {
  onJoinRoom: (roomId: string, userName: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createRoom = async () => {
    if (!userName.trim()) {
      alert('Please enter your name before creating a room');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('http://localhost:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        onJoinRoom(data.roomId, userName.trim());
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const joinExistingRoom = () => {
    if (!userName.trim() || !roomId.trim()) {
      alert('Please enter your name and room code');
      return;
    }
    onJoinRoom(roomId.trim(), userName.trim());
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-medium text-gray-900">Meet</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-normal text-gray-900">
              Premium video meetings.<br />Now free for everyone.
            </h1>
          </div>

          <div className="space-y-2">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
              Your name
            </label>
            <input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              maxLength={50}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Button
              onClick={createRoom}
              disabled={isCreating || !userName.trim()}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isCreating ? 'Starting meeting...' : 'New meeting'}
            </Button>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter a code or link"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <Button
                onClick={joinExistingRoom}
                disabled={!roomId.trim() || !userName.trim()}
                className="px-6"
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;`,
      language: "jsx",
      explanation:
        "Home page component that provides room creation and joining functionality with a clean, Google Meet-inspired interface including form validation and loading states.",
    },
  },

  dockerCompose: {
    title: "Docker Compose Configuration",
    description:
      "Complete Docker Compose setup for running the video call application with Redis, backend, and volume management.",
    correctCode: {
      code: `version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis:6379
      - PORT=8080
    volumes:
      - ./backend:/app
    working_dir: /app

volumes:
  redis_data:`,
      language: "yaml",
      explanation:
        "Docker Compose configuration that sets up Redis for data persistence, the Go backend server, and proper networking between services for development and production deployment.",
    },
  },

  dockerfile: {
    title: "Multi-stage Docker Build",
    description:
      "Optimized Dockerfile for the Go backend using multi-stage builds to create a minimal production image.",
    correctCode: {
      code: `FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]`,
      language: "dockerfile",
      explanation:
        "Multi-stage Docker build that compiles the Go application in a full Go environment, then creates a minimal Alpine-based production image with just the compiled binary and certificates.",
    },
  },

  // React Performance Code Examples
  profilerApiExample: {
    title: "React Profiler API Usage",
    description:
      "How to programmatically measure component rendering performance and send to analytics.",
    wrongCode: {
      code: `// ❌ Without Profiler API - flying blind on performance
export const ComplexSidebar = () => {
  // No way to measure how long this takes in production
  return (
    <div className="sidebar">
      <NavigationList />
      <AdsWidget /> {/* Is this slow? Who knows! */}
    </div>
  );
};

// You have to guess which components are slow
// Or rely only on DevTools (which users don't have)`,
      language: "jsx",
      explanation:
        "Without the Profiler API, you can't measure performance in production. You're relying on local DevTools testing, which doesn't represent real user conditions.",
    },
    correctCode: {
      code: `import React, { Profiler } from "react";

// Define the callback that receives performance data
const onRenderCallback = (
  id,           // the "id" prop of the Profiler tree
  phase,        // "mount" (first render) or "update" (re-render)
  actualDuration,   // time spent rendering this update
  baseDuration,     // estimated time without memoization
  startTime,        // when React began rendering
  commitTime        // when React committed this update
) => {
  // Log to console during development
  console.log(\`[\${id}] Phase: \${phase} | Duration: \${actualDuration}ms\`);

  // Send slow renders to analytics in production
  if (phase === "mount" && actualDuration > 50) {
    navigator.sendBeacon("/analytics/perf", JSON.stringify({
      id,
      actualDuration,
      baseDuration
    }));
  }
};

// Wrap your component tree to measure it
export const ComplexSidebar = () => {
  return (
    <Profiler id="SidebarNavigation" onRender={onRenderCallback}>
      <div className="sidebar">
        <NavigationList />
        <AdsWidget /> {/* Suspected slow component */}
      </div>
    </Profiler>
  );
};`,
      language: "jsx",
      explanation:
        "The Profiler API lets you capture render metrics programmatically. Compare actualDuration vs baseDuration - if they're similar on updates, your memoization isn't working!",
    },
  },

  contextSplitting: {
    title: "Context Splitting Pattern",
    description:
      "How to split Context by update frequency to prevent unnecessary re-renders.",
    wrongCode: {
      code: `// ❌ BAD: Everything in one Context
const AppContext = createContext({
  user: { name: "Minh" },    // Updates rarely
  theme: "dark",              // Updates sometimes
  scrollY: 0,                 // Updates CONSTANTLY!
});

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState({ name: "Minh" });
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Every scroll event re-renders ALL consumers!
  return (
    <AppContext.Provider value={{ user, theme, scrollY }}>
      <UserProfile />  {/* Re-renders on scroll! */}
      <ThemeToggle />  {/* Re-renders on scroll! */}
      <ScrollIndicator />
    </AppContext.Provider>
  );
}`,
      language: "jsx",
      explanation:
        "When scrollY updates (60+ times per second!), every component consuming AppContext re-renders, even if they only care about user or theme.",
    },
    correctCode: {
      code: `// ✅ GOOD: Split by update frequency
const UserContext = createContext({ name: "Minh" });  // Rarely updates
const ThemeContext = createContext("dark");            // Sometimes updates
const ScrollContext = createContext(0);                // Updates constantly

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState({ name: "Minh" });
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <ScrollContext.Provider value={scrollY}>
          <UserProfile />     {/* Only re-renders when user changes */}
          <ThemeToggle />     {/* Only re-renders when theme changes */}
          <ScrollIndicator /> {/* Only this re-renders on scroll */}
        </ScrollContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}`,
      language: "jsx",
      explanation:
        "By splitting contexts based on update frequency, each consumer only re-renders when its specific data changes. Much better performance!",
    },
  },

  useCallbackExample: {
    title: "Stabilizing Function References",
    description:
      "How to prevent child re-renders caused by new function references.",
    wrongCode: {
      code: `const Parent = () => {
  const [count, setCount] = useState(0);

  // ❌ This function is recreated on EVERY render
  const handleLoad = () => {
    sendAnalytics("promo_loaded");
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>

      {/* ExpensivePromo re-renders every time Parent renders */}
      {/* because handleLoad is a new function each time! */}
      <ExpensivePromo onLoad={handleLoad} />
    </div>
  );
};

// Even with React.memo, this re-renders because onLoad changes!
const ExpensivePromo = React.memo(({ onLoad }) => {
  useEffect(() => { onLoad(); }, [onLoad]);
  return <div>Expensive promo component...</div>;
});`,
      language: "jsx",
      explanation:
        "Every time Parent renders (e.g., when count changes), handleLoad is a brand new function. React.memo can't help because the prop technically changed!",
    },
    correctCode: {
      code: `const Parent = () => {
  const [count, setCount] = useState(0);

  // ✅ useCallback keeps the same function reference
  const handleLoad = useCallback(() => {
    sendAnalytics("promo_loaded");
  }, []); // Empty deps = never changes

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>

      {/* ExpensivePromo now skips re-render when count changes */}
      {/* because handleLoad reference stays stable! */}
      <ExpensivePromo onLoad={handleLoad} />
    </div>
  );
};

// React.memo now works correctly - props don't change!
const ExpensivePromo = React.memo(({ onLoad }) => {
  useEffect(() => { onLoad(); }, [onLoad]);
  return <div>Expensive promo component...</div>;
});`,
      language: "jsx",
      explanation:
        "useCallback memoizes the function so it keeps the same reference across renders. Combined with React.memo, the expensive child won't re-render unnecessarily.",
    },
  },

  useMemoObjectExample: {
    title: "Stabilizing Object References",
    description: "How to prevent re-renders caused by inline object creation.",
    wrongCode: {
      code: `const Parent = ({ rawData }) => {
  // ❌ This object is recreated on EVERY render
  const processedData = {
    id: rawData.id,
    title: rawData.title.toUpperCase(),
    timestamp: Date.now() // Just for formatting
  };

  // Child always sees a "new" object, even if values are same
  return <ExpensiveChart data={processedData} />;
};

// Even with React.memo, this re-renders every time!
const ExpensiveChart = React.memo(({ data }) => {
  // Expensive chart rendering...
  return <canvas>{/* Chart visualization */}</canvas>;
});`,
      language: "jsx",
      explanation:
        "Creating an object inline means a new reference every render. { id: 1 } === { id: 1 } is FALSE in JavaScript!",
    },
    correctCode: {
      code: `const Parent = ({ rawData }) => {
  // ✅ useMemo keeps the same object reference
  const processedData = useMemo(() => ({
    id: rawData.id,
    title: rawData.title.toUpperCase(),
    timestamp: Date.now()
  }), [rawData.id, rawData.title]); // Only recreate if these change

  // Child now skips re-render when object values haven't changed
  return <ExpensiveChart data={processedData} />;
};

// React.memo now works correctly!
const ExpensiveChart = React.memo(({ data }) => {
  // Expensive chart rendering only happens when needed
  return <canvas>{/* Chart visualization */}</canvas>;
});`,
      language: "jsx",
      explanation:
        "useMemo caches the object and only creates a new one when dependencies change. The reference stays stable, so React.memo can skip renders.",
    },
  },

  slotPattern: {
    title: "The Slot Pattern (Component Composition)",
    description:
      "How to lift component ownership to prevent unnecessary re-renders.",
    wrongCode: {
      code: `// ❌ Header OWNS SearchBar - they're tightly coupled
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // When menuOpen changes, SearchBar MUST re-render
  // even though it doesn't use menuOpen at all!
  return (
    <div className="header">
      <button onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
      {menuOpen && <MobileMenu />}
      <SearchBar />  {/* Wasted render every time! */}
    </div>
  );
};

// SearchBar is defined inside Header's render
const SearchBar = () => {
  // Expensive search component
  return <input placeholder="Search..." />;
};`,
      language: "jsx",
      explanation:
        "Because Header creates SearchBar in its JSX, any Header re-render forces SearchBar to re-render too. They're coupled by ownership.",
    },
    correctCode: {
      code: `// ✅ Header receives SearchBar as a prop (slot)
const Header = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // When menuOpen changes, children keeps its identity!
  // React knows it's the same element, so it skips re-rendering it
  return (
    <div className="header">
      <button onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
      {menuOpen && <MobileMenu />}
      {children}  {/* This doesn't re-render! */}
    </div>
  );
};

// App owns SearchBar, not Header
const App = () => {
  return (
    <Header>
      <SearchBar />  {/* Created here, passed as children */}
    </Header>
  );
};

const SearchBar = () => {
  return <input placeholder="Search..." />;
};`,
      language: "jsx",
      explanation:
        "By passing SearchBar as children, App becomes the owner. When Header re-renders, the children prop hasn't changed, so SearchBar is skipped. This is the 'slot' pattern!",
    },
  },

  normalizedState: {
    title: "Normalized State (O(1) Lookups)",
    description:
      "How to structure state for instant lookups instead of slow array searches.",
    wrongCode: {
      code: `// ❌ BAD: Storing as array = O(n) lookups
const [todos, setTodos] = useState([
  { id: "1", text: "Buy milk", done: false },
  { id: "2", text: "Walk dog", done: true },
  { id: "3", text: "Learn React", done: false },
  // ... imagine 1000 more items
]);

// Finding an item requires looping through the entire array!
const findTodo = (id) => todos.find(todo => todo.id === id);

// Updating requires finding + creating new array
const toggleTodo = (id) => {
  setTodos(todos.map(todo =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  ));
};

// With 1000 items, this gets SLOW
// O(n) find + O(n) map = performance problem`,
      language: "jsx",
      explanation:
        "Arrays require iteration to find items. With large datasets, these O(n) operations add up and slow down your app.",
    },
    correctCode: {
      code: `// ✅ GOOD: Storing as object = O(1) lookups
const [todos, setTodos] = useState({
  "1": { id: "1", text: "Buy milk", done: false },
  "2": { id: "2", text: "Walk dog", done: true },
  "3": { id: "3", text: "Learn React", done: false },
  // ... even with 1000 items, lookup is instant!
});

// Finding is instant! O(1)
const findTodo = (id) => todos[id];

// Updating is also much cleaner
const toggleTodo = (id) => {
  setTodos({
    ...todos,
    [id]: { ...todos[id], done: !todos[id].done }
  });
};

// For rendering as a list:
const todoList = Object.values(todos);

// Bonus: Store order separately if needed
const [todoOrder, setTodoOrder] = useState(["1", "2", "3"]);`,
      language: "jsx",
      explanation:
        "Objects provide O(1) instant access by key. No matter how many items you have, lookup is always fast. This is called 'normalized' state.",
    },
  },

  lazyLoadingExample: {
    title: "Code Splitting with React.lazy",
    description:
      "How to split heavy components into separate bundles that load on-demand.",
    wrongCode: {
      code: `import React from "react";

// ❌ Regular imports - everything in one bundle
import HeavyChart from "./HeavyChart";        // 150 KB
import AdminPanel from "./AdminPanel";        // 200 KB
import PdfViewer from "./PdfViewer";          // 300 KB

function Dashboard({ showChart, isAdmin, pdfUrl }) {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* All code downloaded even if user never sees these! */}
      {showChart && <HeavyChart />}
      {isAdmin && <AdminPanel />}
      {pdfUrl && <PdfViewer url={pdfUrl} />}
    </div>
  );
}

export default Dashboard;

// Result: Initial bundle = 650 KB
// User downloads admin panel code even if they're not an admin!`,
      language: "jsx",
      explanation:
        "Regular imports bundle everything together. Users download 650KB even if they only need the chart. That's a waste of bandwidth and parsing time!",
    },
    correctCode: {
      code: `import React, { Suspense, lazy } from "react";

// ❌ Regular import - included in main bundle
// import HeavyChart from "./HeavyChart";

// ✅ Lazy import - separate chunk, loads when needed
const HeavyChart = lazy(() => import("./HeavyChart"));
const AdminPanel = lazy(() => import("./AdminPanel"));
const PdfViewer = lazy(() => import("./PdfViewer"));

function Dashboard({ showChart, isAdmin, pdfUrl }) {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* HeavyChart chunk only downloads when showChart is true */}
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}

      {/* AdminPanel chunk only downloads for admin users */}
      {isAdmin && (
        <Suspense fallback={<div>Loading admin panel...</div>}>
          <AdminPanel />
        </Suspense>
      )}

      {/* PdfViewer chunk only downloads when there's a PDF */}
      {pdfUrl && (
        <Suspense fallback={<div>Loading PDF viewer...</div>}>
          <PdfViewer url={pdfUrl} />
        </Suspense>
      )}
    </div>
  );
}

export default Dashboard;`,
      language: "jsx",
      explanation:
        "React.lazy() tells the bundler to create separate chunks. Users only download what they actually need. Suspense shows a loading state while the chunk loads.",
    },
  },

  deferredValueExample: {
    title: "useDeferredValue for Responsive Inputs",
    description:
      "How to keep inputs responsive while rendering expensive lists.",
    wrongCode: {
      code: `import { useState, useMemo } from "react";

// ❌ Without useDeferredValue - typing feels laggy
function SearchableList({ items }) {
  const [query, setQuery] = useState("");

  // Heavy filtering happens on EVERY keystroke
  // This blocks the input from updating smoothly
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  return (
    <div>
      {/* Input feels laggy because React is busy filtering 10,000 items */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
      language: "jsx",
      explanation:
        "Every keystroke triggers expensive filtering. When the list has 10,000 items, the input feels laggy because React is busy updating the list instead of responding to your typing.",
    },
    correctCode: {
      code: `import { useState, useDeferredValue, useMemo } from "react";

// ✅ With useDeferredValue - input stays responsive!
function SearchableList({ items }) {
  const [query, setQuery] = useState("");

  // Create a "deferred" version of the query
  // This value "lags behind" the real query during heavy renders
  const deferredQuery = useDeferredValue(query);

  // Heavy filtering only uses the deferred value
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [items, deferredQuery]);

  // Check if we're showing stale results
  const isStale = query !== deferredQuery;

  return (
    <div>
      {/* Input uses real query - stays instantly responsive! */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {/* List uses deferred query - updates in background */}
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        {isStale && <span>Updating...</span>}
        <ul>
          {filteredItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}`,
      language: "jsx",
      explanation:
        "useDeferredValue tells React: 'Prioritize the input, update the list when you have time.' The input stays snappy while expensive filtering happens in the background.",
    },
  },

  buildOptimizationExample: {
    title: "Build Configuration: Browserslist & Source Maps",
    description:
      "How to configure your build tools for optimal production performance.",
    wrongCode: {
      code: `// ❌ BAD: Default configuration ships huge bundles

// package.json
{
  "browserslist": [
    "defaults"  // This includes IE 11! 😱
  ]
}

// webpack.config.js (or next.config.js)
module.exports = {
  productionBrowserSourceMaps: true,  // Ships source maps to users!
  
  // Webpack devtool
  devtool: 'source-map',  // Full source maps in production
};

// Result:
// ✗ main.js: 450 KB (transpiled for ancient browsers)
// ✗ main.js.map: 1.2 MB (downloaded by every user!)
// ✗ Includes polyfills for Array.prototype.includes, Promise, etc.
// ✗ Slower parsing (transpiled code is harder for engines to optimize)`,
      language: "javascript",
      explanation:
        "Default config assumes you support ancient browsers. You're shipping massive polyfills and transpiled code that 99% of your users don't need!",
    },
    correctCode: {
      code: `// ✅ GOOD: Optimized for modern browsers

// package.json or .browserslistrc
{
  "browserslist": {
    "production": [
      ">0.2%",              // Browsers with >0.2% market share
      "not dead",           // Still maintained browsers
      "not op_mini all"     // Exclude Opera Mini (rarely used)
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

// next.config.js (Next.js example)
module.exports = {
  productionBrowserSourceMaps: false,  // Don't ship maps to users
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production client-side only
      config.devtool = 'hidden-source-map';
      
      // Optional: Upload source maps to error tracking
      // config.plugins.push(new SentryWebpackPlugin({
      //   include: '.next',
      //   ignore: ['node_modules'],
      //   urlPrefix: '~/_next',
      // }));
    }
    return config;
  },
};

// webpack.config.js (plain Webpack)
module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map',  // Generates maps but doesn't link them
  
  // Or use this to skip source maps entirely in production:
  // devtool: false,
};

// Result:
// ✓ main.js: 180 KB (native modern syntax, smaller!)
// ✓ main.js.map: Not sent to users (but available for debugging)
// ✓ No unnecessary polyfills
// ✓ Faster parsing and execution`,
      language: "javascript",
      explanation:
        "Target modern browsers to reduce bundle size by 60%+! Hidden source maps let you debug without shipping them to users.",
    },
    alternativeCode: {
      code: `// Advanced: Differential loading (Modern + Legacy bundles)
// Serve modern JS to modern browsers, legacy to old browsers

// .browserslistrc
[production-modern]
edge >= 79
firefox >= 67
chrome >= 64
safari >= 12
ios >= 12

[production-legacy]
> 0.5%
not dead
not op_mini all

// next.config.js with differential loading
module.exports = {
  experimental: {
    modernTargets: 'edge >= 79, firefox >= 67, chrome >= 64, safari >= 12'
  },
  
  webpack: (config, { dev, isServer, webpack }) => {
    if (!dev && !isServer) {
      // Modern browsers get clean, fast code
      // Legacy browsers get transpiled + polyfills
      // Only 5% of users download the legacy bundle!
    }
    return config;
  }
};

// HTML output:
<script type="module" src="/modern.js"></script>
<script nomodule src="/legacy.js"></script>

// Modern browsers ignore nomodule, legacy ignore type="module"
// Best of both worlds: 95% of users get fast code!`,
      language: "javascript",
      explanation:
        "Differential loading serves optimized code to modern browsers while maintaining backward compatibility. Most users get 40-60% smaller bundles!",
    },
  },

  resourceHints: {
    title: "Resource Hints for Smart Loading",
    description:
      "How to use preload and prefetch to optimize resource loading.",
    wrongCode: {
      code: `// ❌ Without resource hints - everything loads in order
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  
  {/* Browser discovers these one by one as it parses HTML */}
  <link rel="stylesheet" href="/styles.css" />
  <script src="/app.js"></script>
  
  {/* Font only discovered after CSS loads */}
  {/* Image only discovered after HTML renders */}
</head>
<body>
  <h1 style="font-family: InterVar">Welcome</h1>
  <img src="/hero.webp" alt="Hero" />
  
  {/* By the time browser gets here, seconds have passed! */}
</body>
</html>

// Waterfall:
// 1. HTML loads (100ms)
// 2. CSS loads (200ms) 
// 3. Font discovered and loads (300ms)
// 4. Image discovered and loads (400ms)
// Total: 1000ms to see the page properly`,
      language: "html",
      explanation:
        "Without hints, the browser discovers resources sequentially. It doesn't know about your font until after CSS loads, creating a waterfall of requests.",
    },
    correctCode: {
      code: `// In your HTML <head> or Next.js _document.js

// PRELOAD: "I need this NOW for the current page"
// Use for critical resources like fonts and hero images
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>

<link
  rel="preload"
  href="/hero-image.webp"
  as="image"
  fetchpriority="high"
/>

// PREFETCH: "User will probably need this next"
// Use for resources on the NEXT page user will visit
<link rel="prefetch" href="/dashboard.js" />
<link rel="prefetch" href="/settings.js" />

// In React component for dynamic prefetching:
function NavLink({ href, children }) {
  const prefetchOnHover = () => {
    // Prefetch the route when user hovers
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  };

  return (
    <a href={href} onMouseEnter={prefetchOnHover}>
      {children}
    </a>
  );
}

// Next.js does this automatically for <Link> components!
import Link from "next/link";
<Link href="/about">About</Link> // Auto-prefetches on viewport`,
      language: "jsx",
      explanation:
        "preload = download NOW (blocks nothing else). prefetch = download when idle (for future navigation). Use preload sparingly for truly critical resources.",
    },
  },

  suspenseTransitionsExample: {
    title: "Suspense & Transitions for Priority Updates",
    description:
      "How to use startTransition and Suspense to keep your UI responsive during expensive updates.",
    wrongCode: {
      code: `// ❌ Without Transitions - UI freezes during expensive updates
import { useState } from 'react';

function TabContainer() {
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState([]);

  const handleTabClick = async (tab) => {
    // This blocks the UI! The tab doesn't switch until fetch completes
    const response = await fetch(\`/api/\${tab}\`);
    const newData = await response.json();
    
    // Both updates happen together, blocking the main thread
    setActiveTab(tab);
    setData(newData);
  };

  return (
    <div>
      <div className="tabs">
        <button onClick={() => handleTabClick('home')}>Home</button>
        <button onClick={() => handleTabClick('profile')}>Profile</button>
        <button onClick={() => handleTabClick('settings')}>Settings</button>
      </div>
      
      {/* The tab indicator doesn't switch until everything is ready */}
      <div className="active-indicator">Active: {activeTab}</div>
      
      {/* This list might be HUGE and take time to render */}
      <HeavyDataList data={data} />
    </div>
  );
}

// Imagine this renders 10,000 items
const HeavyDataList = ({ data }) => {
  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};`,
      language: "jsx",
      explanation:
        "The UI freezes while fetching and rendering the new data. The user clicks a tab, but nothing happens for seconds. Bad UX!",
    },
    correctCode: {
      code: `// ✅ With Transitions - UI stays responsive!
import { useState, useTransition, Suspense } from 'react';

function TabContainer() {
  const [activeTab, setActiveTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const handleTabClick = (tab) => {
    // Urgent: Switch tab indicator immediately
    setActiveTab(tab);
    
    // Non-urgent: Mark data loading as low priority
    startTransition(() => {
      // This won't block the tab switch!
      // React will keep the UI interactive while this runs
      fetchAndRenderData(tab);
    });
  };

  return (
    <div>
      <div className="tabs">
        <button onClick={() => handleTabClick('home')}>Home</button>
        <button onClick={() => handleTabClick('profile')}>Profile</button>
        <button onClick={() => handleTabClick('settings')}>Settings</button>
      </div>
      
      {/* Tab indicator switches INSTANTLY */}
      <div className="active-indicator">
        Active: {activeTab}
        {isPending && <span> (Loading...)</span>}
      </div>
      
      {/* Suspense shows fallback while transition is pending */}
      <Suspense fallback={<div>Loading data...</div>}>
        <HeavyDataList tab={activeTab} />
      </Suspense>
    </div>
  );
}

// This component can suspend and React will show the fallback
const HeavyDataList = ({ tab }) => {
  // Use React 18's "use" hook or a suspense-enabled library
  const data = useSuspenseQuery(\`/api/\${tab}\`);
  
  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};`,
      language: "jsx",
      explanation:
        "startTransition tells React: 'The tab switch is urgent, but the data loading is not.' The tab indicator switches immediately, and the user can keep clicking while data loads in the background!",
    },
    alternativeCode: {
      code: `// Advanced: Using Transitions for Search with Instant Feedback
import { useState, useTransition, useDeferredValue } from 'react';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  
  // Alternative: Use useDeferredValue for simpler cases
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const handleSearch = (value) => {
    // Urgent: Update the input immediately
    setSearchTerm(value);
    
    // Non-urgent: Update the results in a transition
    startTransition(() => {
      // This expensive update won't block typing!
      performExpensiveSearch(value);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      
      {isPending && <div className="spinner">Searching...</div>}
      
      <Suspense fallback={<div>Loading results...</div>}>
        {/* You can use either approach: */}
        {/* Option 1: startTransition with Suspense */}
        <SearchResults query={searchTerm} />
        
        {/* Option 2: useDeferredValue (simpler) */}
        {/* <SearchResults query={deferredSearchTerm} /> */}
      </Suspense>
    </div>
  );
}

// When to use which:
// - useDeferredValue: Simple value deferral, React decides timing
// - startTransition: Full control over which updates are non-urgent
// - Suspense: Show fallback during async operations`,
      language: "jsx",
      explanation:
        "Transitions + Suspense = The user types freely while React renders search results in the background. Best of both worlds: instant feedback + responsive UI.",
    },
  },

  uncontrolledComponentExample: {
    title: "Uncontrolled Components with useRef",
    description:
      "How to use useRef for high-frequency updates to bypass React's rendering entirely.",
    wrongCode: {
      code: `// ❌ Controlled Component - React state causes re-render on EVERY change
// This is terrible for high-frequency updates like canvas drawing or rich text editing

const DrawingCanvas = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const handleMouseMove = (e) => {
    // setState triggers a re-render!
    // At 60 FPS, that's 60 renders per second
    setMousePosition({ x: e.clientX, y: e.clientY });

    if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Draw line - but React is busy re-rendering!
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }
  };

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);

  // This entire component re-renders 60 times per second!
  console.log("Canvas re-rendered!", mousePosition);

  return (
    <div>
      <p>Position: {mousePosition.x}, {mousePosition.y}</p>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "Using React state for high-frequency updates (like mouse movement) causes 60+ re-renders per second. The browser struggles to keep up, making the drawing laggy and janky.",
    },
    correctCode: {
      code: `// ✅ Uncontrolled Component - useRef bypasses React rendering
// Perfect for canvas, rich text editors, or any high-frequency updates

const DrawingCanvas = () => {
  // useRef holds values WITHOUT triggering re-renders
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const contextRef = useRef(null);

  useEffect(() => {
    // Set up canvas context once
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    contextRef.current = ctx;
  }, []);

  const handleMouseMove = (e) => {
    // NO setState = NO re-render!
    // Direct DOM manipulation for maximum speed
    if (!isDrawingRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = contextRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseDown = (e) => {
    isDrawingRef.current = true;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    contextRef.current.closePath();
  };

  // This component NEVER re-renders during drawing!
  // Only the initial render happens
  console.log("Canvas rendered - only once!");

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ border: '1px solid black', cursor: 'crosshair' }}
    />
  );
};`,
      language: "jsx",
      explanation:
        "useRef stores values that DON'T cause re-renders. We manipulate the canvas directly via DOM APIs. The component renders once, then all drawing happens outside React's control. Smooth 60 FPS performance!",
    },
    alternativeCode: {
      code: `// Advanced: Rich Text Editor with useRef (like Draft.js approach)
const RichTextEditor = () => {
  const editorRef = useRef(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  // Store formatting state in refs, not React state
  const formattingRef = useRef({
    bold: false,
    italic: false,
    underline: false
  });

  const applyFormatting = (format) => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    
    // Direct DOM manipulation - no React re-render!
    document.execCommand(format);
    
    // Update our ref tracking (still no re-render)
    formattingRef.current[format] = !formattingRef.current[format];
  };

  const handleInput = (e) => {
    // Track selection in ref
    const selection = window.getSelection();
    selectionRef.current = {
      start: selection.anchorOffset,
      end: selection.focusOffset
    };
    
    // NO setState = smooth typing at any speed!
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => applyFormatting('bold')}>Bold</button>
        <button onClick={() => applyFormatting('italic')}>Italic</button>
        <button onClick={() => applyFormatting('underline')}>Underline</button>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px'
        }}
      />
    </div>
  );
};`,
      language: "jsx",
      explanation:
        "For rich text editors, every keystroke in controlled mode = re-render. By using refs and contentEditable with direct DOM manipulation, typing stays smooth even with complex formatting.",
    },
  },

  renderPropsExample: {
    title: "Render Props for Isolated Updates",
    description:
      "How to use Render Props to isolate re-renders to specific parts of your UI.",
    wrongCode: {
      code: `// ❌ Using hooks couples state to the entire component
const ContactForm = () => {
  // Every keystroke re-renders the ENTIRE form!
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  console.log("Entire form re-rendered!");

  return (
    <form>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {/* ... more fields */}
      <ExpensiveValidationSummary />
      <SubmitButton />
    </form>
  );
};`,
      language: "jsx",
      explanation:
        "With hooks, every keystroke in ANY field causes the entire form (including ExpensiveValidationSummary) to re-render. This is wasteful!",
    },
    correctCode: {
      code: `// ✅ Using Render Props for isolated field updates
// (Inspired by React Final Form's approach)

const Field = ({ name, render }) => {
  // Each Field manages its own state
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  // Only THIS field re-renders when its value changes
  return render({
    value,
    onChange: (e) => setValue(e.target.value),
    onBlur: () => setTouched(true),
    touched,
  });
};

const ContactForm = () => {
  console.log("Form wrapper rendered - but only once!");

  return (
    <form>
      {/* Each field manages its own state and re-renders independently */}
      <Field
        name="firstName"
        render={({ value, onChange }) => (
          <input value={value} onChange={onChange} placeholder="First Name" />
        )}
      />

      <Field
        name="lastName"
        render={({ value, onChange }) => (
          <input value={value} onChange={onChange} placeholder="Last Name" />
        )}
      />

      <Field
        name="email"
        render={({ value, onChange, touched }) => (
          <div>
            <input value={value} onChange={onChange} placeholder="Email" />
            {touched && !value && <span>Required</span>}
          </div>
        )}
      />

      {/* These DON'T re-render when fields change! */}
      <ExpensiveValidationSummary />
      <SubmitButton />
    </form>
  );
};`,
      language: "jsx",
      explanation:
        "Each Field component manages its own state. When you type in 'firstName', only that Field's render prop function runs. The form wrapper and other fields stay untouched!",
    },
  },

  reactMemoExample: {
    title: "React.memo to Prevent Wasted Renders",
    description:
      "How to use React.memo to shield expensive components from unnecessary re-renders.",
    wrongCode: {
      code: `// ❌ Without React.memo - ExpensiveList re-renders every time!
const Dashboard = () => {
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <h1>Dashboard (renders: {count})</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Increment Counter: {count}
      </button>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />

      {/* This expensive component re-renders when count changes
          even though it only needs searchTerm! */}
      <ExpensiveList searchTerm={searchTerm} />
    </div>
  );
};

// Imagine this renders 10,000 items
const ExpensiveList = ({ searchTerm }) => {
  console.log("ExpensiveList rendered!");
  
  // Heavy computation
  const items = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`);
  const filtered = items.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul>
      {filtered.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
};`,
      language: "jsx",
      explanation:
        "Every time count increases, ExpensiveList re-renders and filters all 10,000 items again, even though searchTerm didn't change. This wastes CPU cycles!",
    },
    correctCode: {
      code: `// ✅ With React.memo - ExpensiveList only re-renders when searchTerm changes!
const Dashboard = () => {
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <h1>Dashboard (renders: {count})</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Increment Counter: {count}
      </button>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />

      {/* Now this only re-renders when searchTerm changes! */}
      <ExpensiveList searchTerm={searchTerm} />
    </div>
  );
};

// React.memo wraps the component and compares props
const ExpensiveList = React.memo(({ searchTerm }) => {
  console.log("ExpensiveList rendered!");
  
  // Heavy computation only runs when searchTerm actually changes
  const items = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`);
  const filtered = items.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul>
      {filtered.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
});

// Optional: Add display name for debugging
ExpensiveList.displayName = "ExpensiveList";`,
      language: "jsx",
      explanation:
        "React.memo creates a 'shield' around the component. Now when count changes, React compares the old searchTerm with the new one. Since they're the same, the re-render is skipped!",
    },
    alternativeCode: {
      code: `// Advanced: Custom comparison function for complex props
const ExpensiveList = React.memo(
  ({ searchTerm, config }) => {
    console.log("ExpensiveList rendered!");
    
    const items = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`);
    const filtered = items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <ul>
        {filtered.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  },
  // Custom comparison function (returns true if props are equal)
  (prevProps, nextProps) => {
    // Only re-render if searchTerm OR config.theme changed
    return (
      prevProps.searchTerm === nextProps.searchTerm &&
      prevProps.config.theme === nextProps.config.theme
    );
  }
);`,
      language: "jsx",
      explanation:
        "You can provide a custom comparison function as the second argument to React.memo for fine-grained control over when to re-render. Return true to skip render, false to allow it.",
    },
  },
};
