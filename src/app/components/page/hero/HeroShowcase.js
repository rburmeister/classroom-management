const HeroShowcase = ({ props }) => {
  if (!props) {
    return null; 
  }

  const {
    image,
    backgroundColor,
    textColor,
    title,
    subtitle,
    buttonLink,
    buttonText,
  } = props;

  const heroStyle = {
    backgroundColor: backgroundColor, 
    color: textColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '50px',
    textAlign: 'center',
  };

  return (
    <div className="container" style={heroStyle}>
    <div className="row p-4 pb-0 pe-lg-0 py-lg-5 align-items-center rounded-3 border shadow-lg">
    <div className="col-lg-7 p-3 p-lg-5 pt-lg-3 d-flex flex-column align-items-start">
        <h1 className="display-4 fw-bold lh-1">{title}</h1>
        <p className="lead">{subtitle}</p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-4 mb-lg-3">
        {buttonLink && buttonText && (
            <a href={buttonLink} className="btn btn-primary btn-lg px-4 me-md-2 fw-bold">
            {buttonText}
            </a>
        )}
        </div>
    </div>
    <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
        <img className="rounded-lg-3 img-fluid" src={image} alt="" width="720" />
    </div>
    </div>
</div>
  );
};

export default HeroShowcase;
