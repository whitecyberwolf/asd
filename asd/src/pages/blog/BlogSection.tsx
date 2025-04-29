// src/components/BlogSection.tsx
import { FC } from 'react';
import { Link } from 'react-router-dom';
import './BlogSection.css';
import React from 'react';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  hasComments: boolean;
}

const BlogSection: FC = () => {
  const latestPost: BlogPost = {
    id: 'understanding-sizes',
    title: 'Understanding Jewellery Sizes: Your Ultimate Guide',
    date: 'September 27, 2024',
    excerpt: 'Choosing the right size for your jewelry is crucial for comfort and style. Whether you\'re buying a ring, bracelet, or necklace, knowing the correct size ensures a perfect fit.',
    hasComments: false
  };

  const recentPosts: BlogPost[] = [
    {
      id: 'our-story',
      title: 'Our Story: The Sparkle Behind Aprilshine Jewellery',
      date: 'September 15, 2024',
      excerpt: 'Welcome to Aprilshine Jewellery, where every piece tells a story of elegance, craftsmanship, and passion. Nestled in the heart of Hong Kong, our journey began with a simple yet.',
      hasComments: true
    },
    {
      id: 'celebrity-styles',
      title: 'Celebrity Jewellery Styles: Get The Look For Less',
      date: 'September 01, 2024',
      excerpt: 'Celebrities often grace the red carpet and magazine covers adorned in stunning jewellery that many of us can only dream of owning. However, you don\'t need a celebrity budget.',
      hasComments: true
    },
    {
      id: 'natural-diamonds',
      title: 'Why Natural Diamonds?',
      date: 'August 20, 2024',
      excerpt: 'Natural Diamonds Are Formed At Least 85 Miles Below: The Earth\'s Surface Under Natural Conditions Of High Pressure And Heat Over Billions Of Years.',
      hasComments: true
    }
  ];

  return (
    <section className="blog-section">
      <div className="container">
        <h2 className="section-title">LATEST BLOG</h2>
        
        <div className="latest-post">
          <Link to={`/blog/${latestPost.id}`}>
            <h3 className="post-title">{latestPost.title}</h3>
          </Link>
          <p className="post-excerpt">{latestPost.excerpt}</p>
          <p className="post-date">{latestPost.date}</p>
        </div>
        
        <h2 className="section-title">RECENT BLOGS</h2>
        
        <div className="recent-posts">
          {recentPosts.map((post, index) => (
            <div key={index} className="recent-post">
              <p className="post-date">{post.date}</p>
              {post.hasComments && <span className="comments-label">Comments</span>}
              <Link to={`/blog/${post.id}`}>
                <h3 className="post-title">{post.title}</h3>
              </Link>
              <p className="post-excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="read-more">Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;