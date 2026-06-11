import BlogLayout from "@/components/blog/BlogLayout";
import InteractiveAnchor from "@/components/blog/InteractiveAnchor";
import CodeAnchor from "@/components/blog/CodeAnchor";

function BlogContent() {
  return (
    <>
      <p>
        React hooks have revolutionized how we write React components, but they come with their own set of pitfalls. 
        Even experienced developers can fall into common mistakes that lead to bugs, performance issues, and 
        maintenance headaches. In this guide, we&apos;ll explore the most frequent React hooks mistakes and 
        provide practical solutions to help you write better, more efficient React applications.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. setState the Same Array/Object References</h2>
      
      <p>
        One of the most fundamental mistakes is mutating state directly instead of creating new references. 
        React relies on reference equality to detect changes, so mutating the same array or object won&apos;t trigger a re-render.
      </p>

      <p>
        <CodeAnchor text="View Code Example" codeKey="stateReference" /> - See how mutating state directly fails and how to fix it properly.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Using <InteractiveAnchor text="useEffect" definitionKey="useEffect" /> Just to Track Unnecessary Props/State Changes</h2>
      
      <p>
        Many developers overuse useEffect for computations that could be done directly during rendering. 
        If you can derive a value from existing state or props, you don&apos;t need useEffect.
      </p>

      <p>
        <CodeAnchor text="View Code Example" codeKey="unnecessaryUseEffect" /> - Learn when to avoid useEffect for simple calculations.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Not Using Cleanup Functions in useEffect When Necessary</h2>
      
      <p>
        When useEffect triggers asynchronous operations, failing to clean up can lead to race conditions, 
        memory leaks, and setting state on unmounted components.
      </p>

      <p>
        <CodeAnchor text="View Code Example" codeKey="noCleanup" /> - See how to properly clean up async operations in useEffect.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Using Too Many useStates for a Form</h2>
      
      <p>
        Managing form state with multiple useState hooks can lead to verbose code and unnecessary re-renders. 
        Consider using useReducer, useRef, or form libraries for complex forms.
      </p>

      <p>
        <CodeAnchor text="View Code Example" codeKey="tooManyUseStates" /> - Learn better approaches to form state management.
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        For complex forms, consider using libraries like <strong>Formik</strong> or <strong>React Hook Form</strong>.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Not Using useLayoutEffect for Handling Initial Layout Shifting</h2>
      
      <p>
        When you need to make DOM measurements or prevent layout shifts, useLayoutEffect runs synchronously 
        before the browser paints, while useEffect runs after.
      </p>

      <p>
        <CodeAnchor text="View Code Example" codeKey="useEffectVsLayoutEffect" /> - Understand when to use useLayoutEffect instead of useEffect.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Not Removing Unnecessary useEffect Function Dependencies</h2>
      
      <p>
        Including functions in useEffect dependencies that are recreated on every render causes unnecessary effect runs. 
        Move functions inside the effect or use <InteractiveAnchor text="useCallback" definitionKey="useCallback" /> to memoize them.
      </p>

      <p>
        <CodeAnchor text="View Code Example" codeKey="unnecessaryDependencies" /> - Learn how to optimize useEffect dependencies and see alternative approaches.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">Best Practices Summary</h2>
      
      <p>
        To write better React hooks code and avoid these common mistakes, follow these key principles:
      </p>
      
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Always create new references for state updates</strong> - Use spread operators, array methods, or immutability helpers</li>
        <li><strong>Avoid unnecessary useEffect</strong> - If you can derive a value during render, you don&apos;t need useEffect</li>
        <li><strong>Always clean up side effects</strong> - Cancel network requests, clear timers, and remove event listeners</li>
        <li><strong>Choose the right state management approach</strong> - Consider useReducer, useRef, or form libraries for complex forms</li>
        <li><strong>Use useLayoutEffect for DOM measurements</strong> - Prevent layout shifts when making synchronous DOM changes</li>
        <li><strong>Minimize useEffect dependencies</strong> - Move functions inside effects or memoize them with useCallback</li>
        <li><strong>Profile before optimizing</strong> - Use React DevTools to identify actual performance bottlenecks</li>
      </ul>
      
      <p>
        By understanding and avoiding these common React hooks mistakes, you&apos;ll write more reliable, 
        performant, and maintainable React applications. Remember that proper tooling like ESLint with 
        react-hooks rules can help catch many of these issues during development.
      </p>
    </>
  );
}

export default function ReactMistakesPost() {
  return (
    <BlogLayout 
      title="React Hooks Common Mistakes: How to Avoid and Fix Them" 
      date="January 15, 2024"
    >
      <BlogContent />
    </BlogLayout>
  );
}