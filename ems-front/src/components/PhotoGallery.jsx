import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CarouselImage from './CarouselImage';
import 'bootstrap/dist/css/bootstrap.min.css';

const images = [
  '1.jpg',
  '2.jpg',
  '3.png',
  '4.jpg',
  '5.jpg'
];

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {images.map((image, idx) => (
        <Carousel.Item key={idx}>
          <CarouselImage src={image} alt={`Slide ${idx + 1}`} />
          <Carousel.Caption>
            {idx === 0 ? (
              <>
                <h3>Recreation Activity: 2023 Office Game</h3>
                <p>Happened in 2023, featuring activities such as cards, UNO, and Codenames games!</p>
              </>
            ) : idx === 1 ? (
              <>
                <h3>Outdoor Activity: March 2023</h3>
                <p>Godrich Beach Games</p>
              </>
            ) : idx === 2 ? (
              <>
                <h3>Community Service: April 2023</h3>
                <p>Volunteering at the local shelter</p>
              </>
            ) : idx === 3 ? (
              <>
                <h3>Team Building: May 2023</h3>
                <p>Corporate retreat with team-building exercises</p>
              </>
            ) : (
              <>
                <h3>Health and Wellness: June 2023</h3>
                <p>Yoga and meditation sessions for employee wellness</p>
              </>
            )}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ControlledCarousel;
