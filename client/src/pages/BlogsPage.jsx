import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from '../api/axios';
import './StaticPages.css';

const MOCK_BLOGS = [
  { _id: '1', title: '10 Tips for Smart Online Shopping', tag: 'Shopping', excerpt: 'Discover how to get the best deals, avoid scams, and make the most of your online shopping experience...', author: 'Sarah W.', date: '2024-01-15', emoji: '🛒' },
  { _id: '2', title: 'Top Electronics Trends in 2024', tag: 'Tech', excerpt: 'From foldable phones to AI-powered gadgets, here are the biggest electronics trends shaping this year...', author: 'Michael C.', date: '2024-02-08', emoji: '💻' },
  { _id: '3', title: 'How to Choose the Right Product Size', tag: 'Guide', excerpt: 'Sizing can be confusing when shopping online. Here is a comprehensive guide to finding your perfect fit...', author: 'Emma D.', date: '2024-02-20', emoji: '📏' },
  { _id: '4', title: 'The Rise of Sustainable Shopping', tag: 'Sustainability', excerpt: 'Eco-conscious consumers are transforming the retail landscape. Here is how you can make greener choices...', author: 'Alex J.', date: '2024-03-01', emoji: '🌿' },
  { _id: '5', title: 'Unboxing: Our Premium Gift Collection', tag: 'Lifestyle', excerpt: 'Take a peek at our curated gift collection perfect for every occasion and every budget...', author: 'Sarah W.', date: '2024-03-10', emoji: '🎁' },
  { _id: '6', title: 'How to Read Product Reviews Like a Pro', tag: 'Guide', excerpt: 'Not all reviews are equal. Here is how to spot fake reviews and find the most helpful feedback...', author: 'Michael C.', date: '2024-03-22', emoji: '⭐' },
];

const BlogsPage = () => {
  const [blogs, setBlogs] = useState(MOCK_BLOGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/blogs?limit=12')
      .then(res => {
        if (res.data.blogs?.length) setBlogs(res.data.blogs);
      })
      .catch(() => {}) // fallback to mock
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <span className="static-badge">Our Blog</span>
          <h1>Latest Articles</h1>
          <p>Stay informed with tips, trends, and guides from our team of shopping experts.</p>
        </div>
      </section>

      <section className="static-section">
        <div className="static-container">
          {loading ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>Loading articles...</div>
          ) : (
            <div className="blogs-grid">
              {blogs.map(blog => (
                <Link key={blog._id} to={`/blogs/${blog._id}`} className="blog-card">
                  <div className="blog-card-image">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} />
                    ) : (
                      <span style={{ fontSize: '3.5rem' }}>{blog.emoji || '📝'}</span>
                    )}
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-card-tag">{blog.tag || 'Article'}</span>
                    <div className="blog-card-title">{blog.title}</div>
                    <div className="blog-card-excerpt">{blog.excerpt || blog.content?.slice(0, 120)}</div>
                    <div className="blog-card-meta">
                      <span>By {blog.author?.name || blog.author}</span>
                      <span>{new Date(blog.date || blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
