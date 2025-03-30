import React from 'react';
import { ConfigData } from '../config';

interface AboutProps {
  config: ConfigData
}

interface DescriptionParagraph {
  value: String;
}

const About = ({config}: AboutProps): React.ReactElement => {
  return (
    <div className="about">
      <h2>About Me</h2>
      <div className="bio">
        <img src={config.artistPhotoPath} alt="Artist portrait" className="artist-photo" />
        <div className="bio-text">
          {config.descriptionParagraphs.map((desc: DescriptionParagraph) => (
            <p>{desc.value}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
