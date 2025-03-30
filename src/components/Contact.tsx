import React, { FormEvent, useState } from 'react';
import { ConfigData } from '../config';
import emailjs from 'emailjs-com';

interface ContactProps {
  config: ConfigData;
}

const Contact = ({ config }: ContactProps): React.ReactElement => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null as string | null }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    
    try {
      // Replace these with your actual EmailJS service, template, and user IDs
      const templateParams = {
        from_name: formData.name,
        reply_to: formData.email,
        message: formData.message,
        to_email: config.email
      };
      
       await emailjs.send(
        config.emailjsServiceId,
        config.emailjsTemplateId,
        templateParams,
        config.emailjsPublicId,
      );
 
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: "Message sent successfully!" }
      });
      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: "An error occurred. Please try again later." }
      });
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">Get In Touch</h2>
      
      <div className="contact-content">
        <div className="contact-info-card">
          <h3>Contact Information</h3>
          <div className="contact-info-item">
            <span className="contact-icon">✉️</span>
            <a href={`mailto:${config.email}`}>{config.email}</a>
          </div>
          <div className="contact-info-item">
            <span className="contact-icon">📱</span>
            <a href={`tel:${config.phone}`}>{config.phone}</a>
          </div>
          <div className="contact-info-item">
            <span className="contact-icon">📸</span>
            <a 
              href={`https://instagram.com/${config.insta}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              @{config.insta}
            </a>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send a Message</h3>
          
          {status.info.msg && (
            <div className={`alert ${status.info.error ? 'alert-error' : 'alert-success'}`}>
              {status.info.msg}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              placeholder="Your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="What would you like to say?"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={status.submitting}
          >
            {status.submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
