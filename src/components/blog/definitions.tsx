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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>useEffect</strong> is a React Hook that lets you perform side
          effects in functional components.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2">Syntax:</h4>
          <code className="text-sm">useEffect(setup, dependencies?)</code>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Parameters:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
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
          <h4 className="font-semibold text-base mb-2">Common Use Cases:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
            <li>• Fetching data from APIs</li>
            <li>• Setting up subscriptions</li>
            <li>• Manually changing the DOM</li>
            <li>• Cleanup (timers, subscriptions)</li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-yellow-800 dark:text-yellow-200">
            ⚠️ Important:
          </h4>
          <p className="text-base text-yellow-700 dark:text-yellow-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>useState</strong> is a React Hook that lets you add state to
          functional components.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2">Syntax:</h4>
          <code className="text-sm">
            const [state, setState] = useState(initialState)
          </code>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Returns:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
            <li>
              <strong>state</strong>: Current state value
            </li>
            <li>
              <strong>setState</strong>: Function to update the state
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-blue-800 dark:text-blue-200">
            💡 Best Practice:
          </h4>
          <p className="text-base text-blue-700 dark:text-blue-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>useMemo</strong> is a React Hook that lets you cache expensive
          calculations between re-renders.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2">Syntax:</h4>
          <code className="text-sm">
            const memoizedValue = useMemo(() =&gt; computation, [dependencies])
          </code>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">When to Use:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
            <li>• Expensive calculations</li>
            <li>• Creating objects that cause re-renders</li>
            <li>• Optimizing child component props</li>
          </ul>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-orange-800 dark:text-orange-200">
            ⚡ Performance:
          </h4>
          <p className="text-base text-orange-700 dark:text-orange-300">
            Only use when you have a proven performance problem. Profile first!
          </p>
        </div>
      </div>
    ),
  },

  useCallback: {
    title: "useCallback Hook",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>useCallback</strong> is a React Hook that lets you cache a
          function definition between re-renders.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2">Syntax:</h4>
          <code className="text-sm">
            const memoizedCallback = useCallback(fn, [dependencies])
          </code>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Common Use Cases:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
            <li>• Preventing unnecessary re-renders of child components</li>
            <li>• Optimizing event handlers passed as props</li>
            <li>• Dependency of other hooks</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-green-800 dark:text-green-200">
            ✅ Tip:
          </h4>
          <p className="text-base text-green-700 dark:text-green-300">
            Use with React.memo() for maximum optimization benefit.
          </p>
        </div>
      </div>
    ),
  },

  keys: {
    title: "React Keys",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Keys</strong> help React identify which items have changed,
          are added, or are removed in lists.
        </p>

        <div>
          <h4 className="font-semibold text-base mb-2">Requirements:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
            <li>• Must be unique among siblings</li>
            <li>• Should be stable across re-renders</li>
            <li>• Should not be array indices (in most cases)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Good Key Examples:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
            <li>
              • Database IDs: <code>user.id</code>
            </li>
            <li>• UUIDs or unique identifiers</li>
            <li>• Stable content hashes</li>
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-red-800 dark:text-red-200">
            ❌ Avoid:
          </h4>
          <p className="text-base text-red-700 dark:text-red-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Immutability</strong> means not changing existing
          objects/arrays, but creating new ones instead.
        </p>

        <div>
          <h4 className="font-semibold text-base mb-2">Why It Matters:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
            <li>• React uses Object.is() to detect changes</li>
            <li>• Enables efficient re-rendering</li>
            <li>• Prevents bugs from shared references</li>
            <li>• Makes state updates predictable</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Safe Update Patterns:</h4>
          <ul className="text-base space-y-1 text-gray-600 dark:text-gray-300">
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

        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-purple-800 dark:text-purple-200">
            🔧 Tools:
          </h4>
          <p className="text-base text-purple-700 dark:text-purple-300">
            Consider using Immer for complex state updates.
          </p>
        </div>
      </div>
    ),
  },

  hedonicAdaptation: {
    title: "Hedonic Adaptation",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Hedonic Adaptation</strong> is the tendency for humans to
          quickly return to a baseline level of happiness despite positive or
          negative events.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-blue-800 dark:text-blue-200">
            How it works:
          </h4>
          <ul className="text-base space-y-1 text-blue-700 dark:text-blue-300">
            <li>• Initial boost in happiness from positive changes</li>
            <li>• Gradual return to baseline happiness level</li>
            <li>• New circumstances become "normal"</li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-yellow-800 dark:text-yellow-200">
            Examples:
          </h4>
          <p className="text-base text-yellow-700 dark:text-yellow-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Affective Forecasting</strong> is our ability to predict how
          future events will make us feel. Humans are notoriously bad at this.
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-red-800 dark:text-red-200">
            Common Mistakes:
          </h4>
          <ul className="text-base space-y-1 text-red-700 dark:text-red-300">
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

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-green-800 dark:text-green-200">
            Why it matters:
          </h4>
          <p className="text-base text-green-700 dark:text-green-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Social Comparison Theory</strong> explains how we evaluate
          ourselves relative to others to assess our own worth and abilities.
        </p>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-purple-800 dark:text-purple-200">
            Types of Comparison:
          </h4>
          <ul className="text-base space-y-1 text-purple-700 dark:text-purple-300">
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

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-orange-800 dark:text-orange-200">
            Impact on happiness:
          </h4>
          <p className="text-base text-orange-700 dark:text-orange-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Mindfulness</strong> is the practice of purposeful,
          non-judgmental awareness of the present moment.
        </p>

        <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-teal-800 dark:text-teal-200">
            Core Elements:
          </h4>
          <ul className="text-base space-y-1 text-teal-700 dark:text-teal-300">
            <li>• Present-moment awareness</li>
            <li>• Non-judgmental observation</li>
            <li>• Acceptance of current experience</li>
            <li>• Letting go of mental autopilot</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-green-800 dark:text-green-200">
            Benefits for happiness:
          </h4>
          <p className="text-base text-green-700 dark:text-green-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Gratitude Practice</strong> involves regularly acknowledging
          and appreciating positive aspects of life, both big and small.
        </p>

        <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-pink-800 dark:text-pink-200">
            Effective Methods:
          </h4>
          <ul className="text-base space-y-1 text-pink-700 dark:text-pink-300">
            <li>• Three good things exercise (daily)</li>
            <li>• Gratitude journaling</li>
            <li>• Gratitude letters to others</li>
            <li>• Mindful appreciation moments</li>
          </ul>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-indigo-800 dark:text-indigo-200">
            Research findings:
          </h4>
          <p className="text-base text-indigo-700 dark:text-indigo-300">
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
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Thâm hụt ngân sách</strong> xảy ra khi chính phủ chi tiêu nhiều hơn số tiền thu được từ thuế và các nguồn thu khác.
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-red-800 dark:text-red-200">
            Tác động:
          </h4>
          <ul className="text-base space-y-1 text-red-700 dark:text-red-300">
            <li>• Chính phủ phải đi vay để bù đắp</li>
            <li>• Tăng nợ công quốc gia</li>
            <li>• Có thể dẫn đến lạm phát nếu in thêm tiền</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-blue-800 dark:text-blue-200">
            Cách xử lý:
          </h4>
          <p className="text-base text-blue-700 dark:text-blue-300">
            Chính phủ thường phát hành trái phiếu để vay tiền thay vì in thêm tiền.
          </p>
        </div>
      </div>
    ),
  },

  traiPhieuKhoBac: {
    title: "Trái Phiếu Kho Bạc (Treasury Bonds)",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Trái phiếu kho bạc</strong> là chứng khoán nợ do chính phủ phát hành để huy động vốn từ các nhà đầu tư.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-green-800 dark:text-green-200">
            Các loại:
          </h4>
          <ul className="text-base space-y-1 text-green-700 dark:text-green-300">
            <li>• <strong>Treasury Bills:</strong> Ngắn hạn (&lt;1 năm)</li>
            <li>• <strong>Treasury Notes:</strong> Trung hạn (2-10 năm)</li>
            <li>• <strong>Treasury Bonds:</strong> Dài hạn (20-30 năm)</li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-yellow-800 dark:text-yellow-200">
            💡 Đặc điểm:
          </h4>
          <p className="text-base text-yellow-700 dark:text-yellow-300">
            Được coi là đầu tư an toàn nhất vì có sự bảo đảm của chính phủ Mỹ.
          </p>
        </div>
      </div>
    ),
  },

  lamPhat: {
    title: "Lạm Phát (Inflation)",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Lạm phát</strong> là hiện tượng giá cả hàng hóa và dịch vụ tăng liên tục trong thời gian dài.
        </p>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-orange-800 dark:text-orange-200">
            Nguyên nhân chính:
          </h4>
          <ul className="text-base space-y-1 text-orange-700 dark:text-orange-300">
            <li>• In quá nhiều tiền</li>
            <li>• Cầu vượt quá cung</li>
            <li>• Chi phí sản xuất tăng</li>
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-red-800 dark:text-red-200">
            ⚠️ Ví dụ lịch sử:
          </h4>
          <p className="text-base text-red-700 dark:text-red-300">
            Đức sau Thế chiến I và Zimbabwe trong những năm 2000 đã trải qua siêu lạm phát.
          </p>
        </div>
      </div>
    ),
  },

  brettonWoods: {
    title: "Hiệp Định Bretton Woods (1944)",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Hiệp định Bretton Woods</strong> là thỏa thuận quốc tế thiết lập hệ thống tiền tệ toàn cầu sau Thế chiến II.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-blue-800 dark:text-blue-200">
            Nội dung chính:
          </h4>
          <ul className="text-base space-y-1 text-blue-700 dark:text-blue-300">
            <li>• Đô la Mỹ được neo vào vàng</li>
            <li>• Các đồng tiền khác neo vào đô la</li>
            <li>• Tỷ giá hối đoái cố định</li>
          </ul>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1">
            📅 Kết thúc: 1971
          </h4>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Nixon Shock chấm dứt việc quy đổi đô la sang vàng.
          </p>
        </div>
      </div>
    ),
  },

  nixonShock: {
    title: "Nixon Shock (1971)",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Nixon Shock</strong> là quyết định của Tổng thống Nixon ngừng quy đổi đô la Mỹ sang vàng vào năm 1971.
        </p>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-purple-800 dark:text-purple-200">
            Hậu quả:
          </h4>
          <ul className="text-base space-y-1 text-purple-700 dark:text-purple-300">
            <li>• Đô la trở thành tiền pháp định</li>
            <li>• Tỷ giá hối đoái thả nổi</li>
            <li>• Kết thúc hệ thống Bretton Woods</li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-yellow-800 dark:text-yellow-200">
            🌍 Tác động toàn cầu:
          </h4>
          <p className="text-base text-yellow-700 dark:text-yellow-300">
            Bắt đầu kỷ nguyên đô la dựa vào niềm tin chứ không phải vàng.
          </p>
        </div>
      </div>
    ),
  },

  tienPhapDinh: {
    title: "Tiền Pháp Định (Fiat Currency)",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Tiền pháp định</strong> là đồng tiền không được bảo đảm bằng vàng hay kim loại quý, mà dựa vào niềm tin của người dân.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-indigo-800 dark:text-indigo-200">
            Đặc điểm:
          </h4>
          <ul className="text-base space-y-1 text-indigo-700 dark:text-indigo-300">
            <li>• Không neo vào vàng</li>
            <li>• Giá trị dựa vào niềm tin</li>
            <li>• Chính phủ có thể in thêm tiền</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-green-800 dark:text-green-200">
            ✅ Ưu điểm:
          </h4>
          <p className="text-base text-green-700 dark:text-green-300">
            Linh hoạt trong chính sách tiền tệ để ứng phó với khủng hoảng.
          </p>
        </div>
      </div>
    ),
  },

  petrodollar: {
    title: "Petrodollar",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Petrodollar</strong> là hệ thống sử dụng đô la Mỹ làm đồng tiền chính trong giao dịch dầu mỏ toàn cầu.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-amber-800 dark:text-amber-200">
            Cách hoạt động:
          </h4>
          <ul className="text-base space-y-1 text-amber-700 dark:text-amber-300">
            <li>• Dầu được bán bằng đô la</li>
            <li>• Các nước phải có đô la để mua dầu</li>
            <li>• Tăng cầu đô la toàn cầu</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-blue-800 dark:text-blue-200">
            💪 Củng cố sức mạnh:
          </h4>
          <p className="text-base text-blue-700 dark:text-blue-300">
            Giúp duy trì vị thế đô la như đồng tiền dự trữ toàn cầu.
          </p>
        </div>
      </div>
    ),
  },

  thanhKhoan: {
    title: "Thanh Khoản (Liquidity)",
    content: (
      <div className="space-y-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          <strong>Thanh khoản</strong> là khả năng chuyển đổi một tài sản thành tiền mặt một cách nhanh chóng và không mất giá.
        </p>

        <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-2 text-teal-800 dark:text-teal-200">
            Mức độ thanh khoản:
          </h4>
          <ul className="text-base space-y-1 text-teal-700 dark:text-teal-300">
            <li>• <strong>Cao:</strong> Tiền mặt, trái phiếu chính phủ</li>
            <li>• <strong>Trung bình:</strong> Cổ phiếu lớn</li>
            <li>• <strong>Thấp:</strong> Bất động sản, tranh nghệ thuật</li>
          </ul>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
          <h4 className="font-semibold text-base mb-1 text-emerald-800 dark:text-emerald-200">
            🏦 Thị trường Mỹ:
          </h4>
          <p className="text-base text-emerald-700 dark:text-emerald-300">
            Có thanh khoản cao nhất thế giới, thu hút nhà đầu tư toàn cầu.
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
};
