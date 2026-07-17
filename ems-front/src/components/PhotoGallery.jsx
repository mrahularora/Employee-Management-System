import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CarouselImage from './CarouselImage';
import 'bootstrap/dist/css/bootstrap.min.css';

const images = [
  ['1.jpg', 'Recreation Activity: 2023 Office Game', 'Happened in 2023, featuring activities such as cards, UNO, and Codenames games!'],
  ['2.jpg', 'Outdoor Activity: March 2023', 'Godrich Beach Games'],
  ['3.png', 'Community Service: April 2023', 'Volunteering at the local shelter'],
  ['4.jpg', 'Team Building: May 2023', 'Corporate retreat with team-building exercises'],
  ['5.jpg', 'Health and Wellness: June 2023', 'Yoga and meditation sessions for employee wellness']
];

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {images.map(([image, title, caption], idx) => (
        <Carousel.Item key={idx}>
          <CarouselImage src={image} alt={`Slide ${idx + 1}`} />
          <Carousel.Caption>
            <h3>{title}</h3>
            <p>{caption}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ControlledCarousel;
