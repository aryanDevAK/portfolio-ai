import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, CardDescription } from '../ShadcnUI';
import { motion } from 'framer-motion';
import { GithubIcon, ExternalLinkIcon } from '../IconComponents';

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

const ProjectsPage: React.FC = () => {
  const { projects } = useAppSelector((state) => state.portfolio);

  return (
    <motion.section {...pageAnimationProps}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">My Projects</h2>
        <p className="text-muted-foreground mt-2">A selection of my recent work.</p>
      </div>
      <motion.div
        className="grid md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.techStack}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
              <CardFooter className="gap-2">
                {project.liveLink && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-4 h-4 mr-2" /> Live Demo
                    </a>
                  </Button>
                )}
                 {project.githubLink && (
                  <Button asChild variant="secondary" className="w-full">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="w-4 h-4 mr-2" /> GitHub
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default ProjectsPage;