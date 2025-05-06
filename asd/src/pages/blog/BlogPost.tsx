// src/components/BlogPost.tsx
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import './BlogPost.css';
import React from 'react';

interface BlogPostData {
  id: string;
  title: string;
  date: string;
  category: string;
  comments: number;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
    }[];
    conclusion: string;
  };
}

const BlogPost: FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch this data based on the ID
  const post: BlogPostData = {
    id: 'our-story',
    title: 'Our Story: The Sparkle Behind Aprilshine Jewellery',
    date: 'September 19, 2024',
    category: 'Headpiece',
    comments: 1,
    content: {
      introduction: 'Welcome to Aprilshine Jewellery, where every piece tells a story of elegance, craftsmanship, and passion. Nestled in the heart of Hong Kong, our journey began with a simple yet profound vision: to create timeless jewellery that celebrates life\'s precious moments.',
      sections: [
        {
          title: 'THE BEGINNING',
          content: 'Our story starts with a love for beauty and a dedication to quality. Founded by a team of passionate artisans and designers, Aprilshine Jewellery was born out of a desire to bring unique, honourable pieces to jewellery enthusiasts around the world. Each piece we create is a testament to our commitment to excellence and our love for the art of jewellery making.'
        },
        {
          title: 'CRAFTSMANSHIP AND QUALITY',
          content: 'At Aprilshine Jewellery, we believe that true beauty lies in the details. Our skilled craftsmen meticulously design and create each piece, ensuring that every gemstone is perfectly set and every design is flawlessly executed. We source only the finest materials, from ethically sourced diamonds to vibrant gemstones, to ensure that our jewellery not only looks stunning but also stands the test of time.'
        },
        {
          title: 'OUR COLLECTIONS',
          content: 'Our collections are inspired by the world around us, from the delicate blossoms of spring to the timeless elegance of classic designs. Whether you\'re looking for a statement piece for a special occasion or a subtle accessory for everyday wear, you\'ll find something to love in our diverse range of jewellery. Each collection is thoughtfully curated to offer a blend of contemporary trends and timeless elegance.'
        },
        {
          title: 'A PERSONAL TOUCH',
          content: 'What sets Aprilshine Jewellery apart is our dedication to personalised service. We understand that jewellery is more than just an accessory. It\'s a reflection of your unique style and personality. That\'s why we offer custom design services, allowing you to create a piece that is truly one of a kind. Our team works closely with you to bring your vision to life, ensuring that your jewellery is as unique as you are.'
        },
        {
          title: 'OUR COMMITMENT',
          content: 'We are committed to sustainability and ethical practices. From sourcing our materials to crafting our pieces, we strive to minimize our environmental impact and support fair trade practices. We believe that beauty should not come at the expense of our planet, and we are dedicated to making a positive difference in the world through our work.'
        }
      ],
      conclusion: 'We invite you to explore our collections and discover the beauty and craftsmanship that define Aprilshine Jewellery. Whether you\'re celebrating a milestone or simply treating yourself to something special, we are here to help you find the perfect piece. Visit us at our showroom in Hong Kong or browse our collections online to experience the magic of Aprilshine Jewellery.\n\nThank you for being a part of our story. Together, let\'s create memories that sparkle.'
    }
  };

  return (
    <article className="blog-post">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-date">{post.date}</span>
          <span className="post-category">{post.category}</span>
          <span className="post-comments">{post.comments} Comment{post.comments !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <div className="post-content">
        <p className="post-intro">{post.content.introduction}</p>
        
        {post.content.sections.map((section, index) => (
          <section key={index} className="post-section">
            <h2 className="section-title">{section.title}</h2>
            <p className="section-content">{section.content}</p>
          </section>
        ))}
        
        <p className="post-conclusion">{post.content.conclusion}</p>
      </div>

      <footer className="post-footer">
        <div className="post-actions">
          <button className="action-button">Share</button>
          <button className="action-button">Invest</button>
          <button className="action-button">Print</button>
        </div>
      </footer>
    </article>
  );
};

export default BlogPost;