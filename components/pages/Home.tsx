import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Button, Card, CardHeader, CardTitle } from '../ShadcnUI';
import { motion } from 'framer-motion';
import { AwardIcon, CertificateIcon } from '../IconComponents';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 0.5,
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

const Home: React.FC = () => {
  const { about, certifications } = useAppSelector((state) => state.portfolio);

  const awards = certifications.filter(c => c.isAward);
  const certs = certifications.filter(c => !c.isAward);

  return (
    <motion.div 
      className="space-y-24"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.img 
          src={about.heroImage} 
          alt={about.name} 
          className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-primary/10 shadow-lg"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        />
        <motion.h1 
          className="text-4xl md:text-5xl font-bold tracking-tight text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {about.name}
        </motion.h1>
        <motion.p 
          className="mt-3 text-xl md:text-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {about.title}
        </motion.p>
        <motion.div 
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild size="lg">
            <Link to="/contact">Get in Touch</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/projects">View My Projects</Link>
          </Button>
        </motion.div>
      </section>

      {/* About Me Section */}
      <motion.section 
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
          <div className="prose lg:prose-xl mx-auto text-center text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {about.bio}
          </div>
        </div>
      </motion.section>

       {/* Certifications & Awards Section */}
      <motion.section 
        id="certifications"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications & Awards</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><CertificateIcon/> Certifications</h3>
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                {certs.map(cert => (
                  <motion.div key={cert.id} variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium">{cert.name}</CardTitle>
                        </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
             <div>
              <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2"><AwardIcon/> Honors & Awards</h3>
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                {awards.map(award => (
                  <motion.div key={award.id} variants={itemVariants}>
                    <Card>
                       <CardHeader>
                           <CardTitle className="text-base font-medium">{award.name}</CardTitle>
                       </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;