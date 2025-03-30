import React, { useState, useEffect } from 'react';
import './App.css';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import { ConfigData } from './config';

type TabType = 'projects' | 'about' | 'contact';

function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('projects');

  const [config, setConfig] = useState(
    {
    images: [],
    galleryTitle: "",
    artistName: "",
    email: "",
    phone: "",
    aboutMe: "",
    insta: "",
    artistPhotoPath: "",
    descriptionParagraphs: [],
    emailjsServiceId: "",
    emailjsTemplateId: "",
    emailjsPublicId: "",
    scaleFactor: 6,
  });

  const [loading, setLoading] = useState<boolean>(true);
  // Track any error state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to load image configuration
    const loadConfig = async (): Promise<void> => {
      try {
        const response = await fetch("/config/configuration.json");
        
        if (!response.ok) {
          console.log(response)
          throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
        }
        
        setConfig(await response.json() as ConfigData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading configuration:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    loadConfig();
  }, []);

  if (error) {
    return (
      <div className="app">
        <h2>Oh no!</h2>
        <div className="error-message">
          <p>Failed to load configuration: {error}</p>
          <p>Please make sure the configuration file is accessible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>{config.artistName}</h1>
        
        <nav>
          <ul>
            <li>
              <button 
                className={activeTab === 'projects' ? 'active' : ''} 
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'about' ? 'active' : ''} 
                onClick={() => setActiveTab('about')}
              >
                About Me
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'contact' ? 'active' : ''} 
                onClick={() => setActiveTab('contact')}
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <main>
          {activeTab === 'projects' && <Projects config={config}/>}
          {activeTab === 'about' && <About config={config}/>}
          {activeTab === 'contact' && <Contact config={config}/>}
        </main>
      )}
    </div>
  );
}

export default App;
