import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addMessage as addMessageAction } from '../../store/portfolioSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label, Textarea } from '../ShadcnUI';
import { motion } from 'framer-motion';

const pageAnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeInOut" as const },
};

const ContactPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addMessageAction({ name, email, message }));
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  if (submitted) {
    return (
      <motion.div {...pageAnimationProps} className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-muted-foreground mb-8">Your message has been sent. I'll get back to you shortly.</p>
        <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
      </motion.div>
    );
  }

  return (
    <motion.section className="max-w-2xl mx-auto" {...pageAnimationProps}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Contact Me</CardTitle>
          <CardDescription>Have a project in mind? I'd love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project..." required />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default ContactPage;