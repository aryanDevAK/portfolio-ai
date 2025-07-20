import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '../ShadcnUI';
import { motion } from 'framer-motion';

const pageAnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeInOut" as const },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const BlogListPage: React.FC = () => {
  const { blogs } = useAppSelector((state) => state.portfolio);

  return (
    <motion.section {...pageAnimationProps}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">My Blog</h2>
        <p className="text-muted-foreground mt-2">Thoughts on technology, design, and development.</p>
      </div>
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>By {blog.author} on {blog.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{blog.content}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link to={`/blog/${blog.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default BlogListPage;