import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Button } from '../ShadcnUI';
import { motion } from 'framer-motion';

const pageAnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeInOut" as const },
};

const BlogPostPage: React.FC = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { blogs } = useAppSelector((state) => state.portfolio);
  const blog = blogs.find(b => b.slug === slug);

  if (!blog) {
    return (
      <motion.div {...pageAnimationProps} className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
        <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.article className="max-w-3xl mx-auto" {...pageAnimationProps}>
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">{blog.title}</h1>
        <p className="text-muted-foreground">
          By {blog.author} &bull; Published on {blog.date}
        </p>
      </header>
      <div className="prose prose-lg max-w-none">
        <p className="whitespace-pre-wrap">{blog.content}</p>
      </div>
      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link to="/blog">Back to All Posts</Link>
        </Button>
      </div>
    </motion.article>
  );
};

export default BlogPostPage;