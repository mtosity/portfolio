export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: 'Building' | 'Living' | 'Money' | 'Tiếng Việt';
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'decoding-happiness',
    title: 'Decoding Happiness: Strategies to Cultivate Joy and Fulfillment in Everyday Life',
    date: 'June 17, 2024',
    excerpt: 'Discover evidence-based strategies to find lasting happiness beyond material pursuits. Learn how to overcome your brain&apos;s misconceptions and cultivate genuine joy through meaningful connections, gratitude, and mindful living...',
    category: 'Living'
  },
  {
    slug: 'react-common-mistakes',
    title: 'React Common Mistakes: How to Avoid and Fix Them',
    date: 'January 15, 2024',
    excerpt: 'A comprehensive guide to the most frequent React mistakes and practical solutions with code examples to help you write better, more maintainable React applications...',
    category: 'Building'
  },
  {
    slug: 'hoa-ky-vay-tien',
    title: 'Hoa Kỳ Vay Tiền Như Thế Nào? Vai Trò của Trái Phiếu Kho Bạc',
    date: 'July 14, 2025',
    excerpt: 'Tìm hiểu cách chính phủ Hoa Kỳ huy động vốn qua trái phiếu kho bạc, vai trò của đồng đô la như tiền dự trữ toàn cầu, và tác động của Nhật Bản trong việc nắm giữ nợ công Mỹ...',
    category: 'Tiếng Việt'
  }
];

export const categories = ['Building', 'Living', 'Money', 'Tiếng Việt'] as const;
export type CategoryType = typeof categories[number];