import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ShadcnUI';
import { BriefcaseIcon } from '../IconComponents';
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
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


const ExperiencePage: React.FC = () => {
  const { experiences } = useAppSelector((state) => state.portfolio);

  return (
    <motion.section {...pageAnimationProps}>
      <h2 className="text-3xl font-bold text-center mb-16">Work Experience</h2>
      <div className="relative max-w-3xl mx-auto px-4">
        {/* Timeline Bar */}
        <div className="absolute top-0 left-4 md:left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>
        
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              className="relative pl-10 md:pl-0"
              variants={itemVariants}
            >
              {/* Icon on Timeline */}
              <div className="absolute top-1 left-4 md:left-1/2 w-10 h-10 rounded-full bg-background flex items-center justify-center -translate-x-1/2
                            md:top-1/2 md:-translate-y-1/2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <BriefcaseIcon className="w-4 h-4"/>
                  </div>
              </div>

              {/* Card Container */}
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-auto'}`}>
                <Card>
                  <CardHeader className={index % 2 === 0 ? 'text-left' : 'md:text-right'}>
                    <CardTitle>{exp.title}</CardTitle>
                    <CardDescription>{exp.company} &bull; {exp.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className={index % 2 === 0 ? 'text-left' : 'md:text-right'}>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ExperiencePage;
