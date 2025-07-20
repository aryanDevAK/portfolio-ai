import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ShadcnUI';
import { motion } from 'framer-motion';
import { CodeIcon, SparklesIcon, PenToolIcon } from '../IconComponents';

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
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
};

const services = [
  {
    icon: <CodeIcon className="w-8 h-8 text-primary" />,
    title: 'Custom Web Development',
    description: 'Building responsive, high-performance websites and web applications from scratch. I focus on clean code, modern frameworks, and a seamless user experience to bring your digital vision to life.',
  },
  {
    icon: <SparklesIcon className="w-8 h-8 text-primary" />,
    title: 'AI Integration',
    description: 'Enhancing applications with intelligent features. From AI-powered content generation to smart chatbots and data analysis, I can integrate cutting-edge AI models to make your products smarter.',
  },
  {
    icon: <PenToolIcon className="w-8 h-8 text-primary" />,
    title: 'UI/UX Design',
    description: 'Crafting intuitive and beautiful user interfaces. My design process is user-centric, ensuring that the final product is not only visually appealing but also easy to navigate and a joy to use.',
  },
];

const ServicesPage: React.FC = () => {
  return (
    <motion.section {...pageAnimationProps}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Services I Offer</h2>
        <p className="text-muted-foreground mt-2">Leveraging technology to build amazing things.</p>
      </div>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <Card className="flex flex-col h-full text-center items-center">
              <CardHeader>
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  {service.icon}
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default ServicesPage;