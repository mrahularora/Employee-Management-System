import PropTypes from 'prop-types';

const images = import.meta.glob('../img/*', {
  eager: true,
  import: 'default',
  query: '?url',
});

const CarouselImage = ({ src, alt }) => {
  return (
    <div className="carousel-image">
      <img
        className="d-block w-100"
        src={images[`../img/${src}`]}
        alt={alt}
      />
    </div>
  );
};

CarouselImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default CarouselImage;
