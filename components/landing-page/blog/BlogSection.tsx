import BlogSectionClient from './BlogSectionClient';

const BlogSection = async () => {
  // Fetch blog posts
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/posts?status=ACTIVE&page=1&limit=6&sortBy=createdAt&sortOrder=desc`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data on each request
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch blog posts');
    return null; // Or handle the error as needed
  }

  const data = await response.json();
  const posts = data.data; // Adjusted to match GetBlogPostsResponse interface
  return <BlogSectionClient posts={posts} />;
};

export default BlogSection;
