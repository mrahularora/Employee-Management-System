import PropTypes from 'prop-types';

const CarouselImage = ({ src, alt }) => {
  return (
    <div className="carousel-image">
      <img
        className="d-block"
        src={require(`../img/${src}`)} 
        alt={alt}
        style={{ width: '900px' }} 
      />
    </div>
  );
};

CarouselImage.propTypes = {
  src: PropTypes.string.isRequired, 
  alt: PropTypes.string.isRequired, 
};

export default CarouselImage;
