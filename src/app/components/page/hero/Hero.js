const Hero = ({ props }) => {
  if (!props) {
    return null; 
  }

  const {
    backgroundImage,
    backgroundColor,
    textColor,
    title,
    subtitle,
    image,
    buttonLink,
    buttonText,
    buttonLink2,
    buttonText2,
  } = props;

  const heroStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundColor: backgroundImage ? 'transparent' : backgroundColor, 
    color: textColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="container py-5" style={heroStyle}>
      <div className="row">
        <div className="col-12 col-md-5 col-lg-5 d-flex flex-column justify-content-center">
          {title && <h1>{title}</h1>}
          {subtitle && <p className="my-2">{subtitle}</p>}
          <div className="d-flex mt-3">
            {buttonLink && buttonText && (
              <a href={buttonLink} className="btn btn-primary me-3 border-0 px-4 py-3 fw-bold">
                {buttonText}
              </a>
            )}
            {buttonLink2 && buttonText2 && (
              <a href={buttonLink2} className="btn btn-secondary border-0 px-4 py-3 fw-bold">
                {buttonText2}
              </a>
            )}
          </div>
          </div>
        <div className="col-12 col-md-6 col-lg-6 ms-auto mt-5 mt-lg-0">
          {image && (
            <div className="img-wrap">
              <img src={image} alt={title} className="img-fluid rounded-4" />
            </div>
          )}
        </div>
    </div>
  </div>
  );
};

export default Hero;
