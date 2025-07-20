
import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
    setPortfolio,
    updateAbout, addExperience, updateExperience, deleteExperience,
    addProject, updateProject, deleteProject,
    addBlog, updateBlog, deleteBlog,
    deleteMessage,
    addCertification, updateCertification, deleteCertification,
} from '../../store/portfolioSlice';
import type { AdminSection, Experience, Project, Blog, ContactMessage, Certification } from '../../types';
import { Button, Input, Label, Textarea, Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../ShadcnUI';
import { generateBlogIdeas, generateAiReply, improveText } from '../../services/geminiService';
import { SparklesIcon } from '../IconComponents';
import { motion, AnimatePresence } from 'framer-motion';

type EditableItem = Experience | Project | Blog | Certification | null;
type DashboardSection = AdminSection | 'data';

const pageAnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeInOut" as const },
};

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('experience');
  const [editingItem, setEditingItem] = useState<EditableItem>(null);
  const dispatch = useAppDispatch();
  const portfolioState = useAppSelector(state => state.portfolio);
  const {
    about, experiences, projects, blogs, messages, certifications
  } = portfolioState;


  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEditClick = (item: EditableItem) => {
    setEditingItem(item);
    setFormData(item || {});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const checked = e.target.checked;
    setFormData({ ...formData, [name]: isCheckbox ? checked : value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    switch (activeSection) {
      case 'experience': dispatch(updateExperience(formData as Experience)); break;
      case 'projects': dispatch(updateProject(formData as Project)); break;
      case 'blogs': dispatch(updateBlog(formData as Blog)); break;
      case 'certifications': dispatch(updateCertification(formData as Certification)); break;
      case 'about': dispatch(updateAbout(formData)); break;
    }
    setEditingItem(null);
  };
  
  const handleExport = () => {
    const { messages, ...exportData } = portfolioState;
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        const data = JSON.parse(text);
        dispatch(setPortfolio(data));
        alert('Data imported successfully! Your changes are now loaded in the editor.');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Failed to import data. Please ensure it is a valid portfolio JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset file input value to allow importing the same file again
    event.target.value = '';
  };


  const renderSection = () => {
    switch (activeSection) {
      case 'experience': return <CrudSection title="Experience" items={experiences} onEdit={handleEditClick} onDelete={(id) => dispatch(deleteExperience(id))} formFields={['title', 'company', 'duration', 'description']} onAddNew={(item) => dispatch(addExperience(item))} />;
      case 'projects': return <CrudSection title="Projects" items={projects} onEdit={handleEditClick} onDelete={(id) => dispatch(deleteProject(id))} formFields={['name', 'techStack', 'description', 'liveLink', 'githubLink']} onAddNew={(item) => dispatch(addProject(item))} />;
      case 'blogs': return <BlogSection blogs={blogs} onEdit={handleEditClick} onDelete={(id) => dispatch(deleteBlog(id))} onAddNew={(item) => dispatch(addBlog(item))} />;
      case 'messages': return <MessagesSection messages={messages} onDelete={(id) => dispatch(deleteMessage(id))} />;
      case 'about': return <AboutSection about={about} onEdit={handleEditClick} />;
      case 'certifications': return <CrudSection title="Certifications" items={certifications} onEdit={handleEditClick} onDelete={(id) => dispatch(deleteCertification(id))} formFields={['name', 'issuer', 'isAward']} onAddNew={(item) => dispatch(addCertification(item))} />;
      case 'data': return <DataManagementSection onExport={handleExport} onImport={handleImport} />;
      default: return null;
    }
  };

  return (
    <motion.div {...pageAnimationProps}>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex border-b mb-6 overflow-x-auto">
        <TabButton section="about" activeSection={activeSection} setActiveSection={setActiveSection}>About</TabButton>
        <TabButton section="experience" activeSection={activeSection} setActiveSection={setActiveSection}>Experience</TabButton>
        <TabButton section="projects" activeSection={activeSection} setActiveSection={setActiveSection}>Projects</TabButton>
        <TabButton section="certifications" activeSection={activeSection} setActiveSection={setActiveSection}>Certs/Awards</TabButton>
        <TabButton section="blogs" activeSection={activeSection} setActiveSection={setActiveSection}>Blogs</TabButton>
        <TabButton section="messages" activeSection={activeSection} setActiveSection={setActiveSection}>Messages</TabButton>
        <TabButton section="data" activeSection={activeSection} setActiveSection={setActiveSection}>Data Management</TabButton>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            {renderSection()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {editingItem && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader><CardTitle>Edit {activeSection}</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                    {Object.keys(formData).filter(k => k !== 'id' && k !== 'slug' && k!=='icon').map(key => (
                      <div key={key} className="space-y-2">
                         {typeof formData[key] === 'boolean' ? (
                            <div className="flex items-center gap-2">
                                <Input type="checkbox" id={key} name={key} checked={formData[key]} onChange={handleFormChange} className="h-4 w-4" />
                                <Label htmlFor={key} className="capitalize">{key === 'isAward' ? 'Is an Award?' : key}</Label>
                            </div>
                         ) : (
                          <>
                            <Label htmlFor={key} className="capitalize">{key}</Label>
                            {key.includes('description') || key.includes('bio') || key.includes('content') ? (
                              <div className="relative">
                                <Textarea id={key} name={key} value={formData[key]} onChange={handleFormChange} rows={5} />
                                <Button type="button" size="sm" variant="ghost" className="absolute bottom-2 right-2" disabled={isLoading} onClick={async () => {
                                    setIsLoading(true);
                                    const improved = await improveText(formData[key]);
                                    setFormData({...formData, [key]: improved});
                                    setIsLoading(false);
                                }}>
                                    <SparklesIcon className="w-4 h-4 mr-1"/> Improve with AI
                                </Button>
                              </div>
                            ) : (
                              <Input id={key} name={key} value={formData[key]} onChange={handleFormChange} />
                            )}
                          </>
                         )}
                      </div>
                    ))}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TabButton: React.FC<{ section: DashboardSection, activeSection: DashboardSection, setActiveSection: (s: DashboardSection) => void, children: React.ReactNode }> = ({ section, activeSection, setActiveSection, children }) => (
  <button
    onClick={() => setActiveSection(section)}
    className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSection === section ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
  >
    {children}
  </button>
);

const DataManagementSection: React.FC<{onExport: ()=>void, onImport: (e: React.ChangeEvent<HTMLInputElement>)=>void}> = ({onExport, onImport}) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Publishing & Drafts</CardTitle>
          <CardDescription>
            Your site loads its content from a `data.json` file. To permanently save changes for all visitors, you must export the new data file and redeploy your site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Publish Changes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click to download the current state of your portfolio as a `data.json` file. 
              Replace the existing `data.json` in your project with this new file, then commit and redeploy your site to publish the changes for all visitors.
            </p>
            <Button onClick={onExport}>Export to JSON for Publishing</Button>
          </div>
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Save/Load a Draft</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use Import to load a previously exported JSON file to continue editing. This is useful for saving your progress without publishing.
            </p>
            <input type="file" accept=".json" onChange={onImport} className="hidden" ref={importInputRef} />
            <Button variant="outline" onClick={() => importInputRef.current?.click()}>Import from JSON</Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            <b>Important:</b> Changes made in the admin panel are temporary and will be lost if you refresh the page. Use the export/import feature to save and load drafts.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};


const CrudSection: React.FC<{title:string, items: any[], onEdit: (item:any)=>void, onDelete: (id:string)=>void, formFields: string[], onAddNew: (item:any)=>void}> = ({title, items, onEdit, onDelete, formFields, onAddNew}) => {
    const [newItem, setNewItem] = useState<any>({});
    const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const checked = e.target.checked;
        setNewItem({...newItem, [name]: type === 'checkbox' ? checked : value});
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddNew(newItem);
        setNewItem(formFields.reduce((acc, field) => ({...acc, [field]: ''}), {}));
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <Card className="mb-8">
                <CardHeader><CardTitle>Add New {title.endsWith('s') ? title.slice(0, -1) : title}</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {formFields.map(field => (
                            <div key={field} className="space-y-2">
                               {field.includes('isAward') ? (
                                    <div className="flex items-center gap-2">
                                        <Input type="checkbox" id={`new-${field}`} name={field} checked={!!newItem[field]} onChange={handleNewChange} className="h-4 w-4" />
                                        <Label htmlFor={`new-${field}`} className="capitalize">Is an Award?</Label>
                                    </div>
                               ) : (
                                <>
                                 <Label htmlFor={`new-${field}`} className="capitalize">{field}</Label>
                                {field.includes('description') || field.includes('content') ? 
                                    <Textarea id={`new-${field}`} name={field} value={newItem[field] || ''} onChange={handleNewChange} required/> :
                                    <Input id={`new-${field}`} name={field} value={newItem[field] || ''} onChange={handleNewChange} required/>
                                }
                                </>
                               )}
                            </div>
                        ))}
                        <Button type="submit">Add</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {items.map(item => (
                    <Card key={item.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{item.title || item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.company || item.issuer || item.description?.substring(0, 50)}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(item)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const BlogSection: React.FC<{blogs: Blog[], onEdit: (blog: Blog) => void, onDelete: (id: string) => void, onAddNew: (blog: Omit<Blog, 'id'|'slug'>) => void}> = ({blogs, onEdit, onDelete, onAddNew}) => {
    const { about } = useAppSelector(state => state.portfolio);
    const [newItem, setNewItem] = useState<{title: string, content: string, author: string, date:string}>({title: '', content: '', author: about.name, date: new Date().toISOString().split('T')[0]});
    const [ideaTopic, setIdeaTopic] = useState('');
    const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateIdeas = async () => {
        if (!ideaTopic) return;
        setIsLoading(true);
        const ideas = await generateBlogIdeas(ideaTopic);
        setGeneratedIdeas(ideas);
        setIsLoading(false);
    }
    
    const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewItem({...newItem, [e.target.name]: e.target.value});
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddNew(newItem);
        setNewItem({title: '', content: '', author: about.name, date: new Date().toISOString().split('T')[0]});
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Blogs</h2>
             <Card className="mb-8">
                <CardHeader><CardTitle className="flex items-center gap-2">Generate Blog Ideas <SparklesIcon className="w-5 h-5 text-yellow-500"/></CardTitle></CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input placeholder="Enter a topic (e.g., 'React performance')" value={ideaTopic} onChange={e => setIdeaTopic(e.target.value)} />
                        <Button onClick={handleGenerateIdeas} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate'}</Button>
                    </div>
                    {generatedIdeas.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {generatedIdeas.map((idea, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                                    <p className="text-sm">{idea}</p>
                                    <Button size="sm" variant="ghost" onClick={() => setNewItem({...newItem, title: idea})}>Use Idea</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader><CardTitle>Add New Blog Post</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                       <div className="space-y-2">
                           <Label htmlFor="new-title">Title</Label>
                           <Input id="new-title" name="title" value={newItem.title} onChange={handleNewChange} required/>
                       </div>
                        <div className="space-y-2">
                           <Label htmlFor="new-content">Content</Label>
                           <Textarea id="new-content" name="content" value={newItem.content} onChange={handleNewChange} required rows={6}/>
                       </div>
                        <Button type="submit">Add Post</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {blogs.map(blog => (
                    <Card key={blog.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{blog.title}</p>
                                <p className="text-sm text-muted-foreground">{blog.date}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(blog)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(blog.id)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

const MessagesSection: React.FC<{messages: ContactMessage[], onDelete: (id: string) => void}> = ({messages, onDelete}) => {
    const [aiReply, setAiReply] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

    const handleGenerateReply = async (msg: ContactMessage) => {
        setIsLoading(prev => ({...prev, [msg.id]: true}));
        const reply = await generateAiReply(msg.message);
        setAiReply(prev => ({...prev, [msg.id]: reply}));
        setIsLoading(prev => ({...prev, [msg.id]: false}));
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
            {messages.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
            <div className="space-y-4">
                {messages.map(msg => (
                    <Card key={msg.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{msg.name}</CardTitle>
                                    <CardDescription>{msg.email} - {msg.date}</CardDescription>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(msg.id)}>Delete</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{msg.message}</p>
                            {aiReply[msg.id] ? (
                                <div className="p-3 bg-secondary rounded-md">
                                    <p className="font-semibold text-sm mb-1">Suggested AI Reply:</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiReply[msg.id]}</p>
                                </div>
                            ) : (
                                <Button size="sm" variant="secondary" onClick={() => handleGenerateReply(msg)} disabled={isLoading[msg.id]}>
                                    <SparklesIcon className="w-4 h-4 mr-2"/>
                                    {isLoading[msg.id] ? 'Generating...' : 'Generate AI Reply'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}


const AboutSection: React.FC<{about: any, onEdit: (about: any) => void}> = ({ about, onEdit }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">About / Landing Page Content</h2>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div><strong>Name:</strong> {about.name}</div>
            <div><strong>Title:</strong> {about.title}</div>
            <div><strong>Bio:</strong> <p className="text-muted-foreground whitespace-pre-wrap">{about.bio}</p></div>
            <div><strong>Hero Image URL:</strong> <p className="text-muted-foreground text-sm break-all">{about.heroImage}</p></div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onEdit(about)}>Edit Content</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default AdminDashboard;
