const HighlightCards = ({ props }) => {
    if (!props) {
      return null;
    }
  
    const {
      title,
      description,
      card1Image,
      card1Title,
      card1Link,
      card2Image,
      card2Title,
      card2Link,
      card3Image,
      card3Title,
      card3Link,
    } = props;
  
    return (
        <div className="container py-5 my-5">
          <div className="row mb-20 align-items-center">
            <div className="col-12 col-md-6 mb-6 mb-md-0">
              <h1 className="fw-bold h3 mb-0">{title}</h1>
            </div>
            <div className="col-12 col-md-6">
              <div className="mw-xl">
                <p className="fs-7 mb-0">{description}</p>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 col-md-4 mb-8 mb-5">
              <div className="position-relative">
                <img className="d-block w-100 img-fluid rounded-4" src={card1Image} alt={card1Title} style={{ height: '427px', objectFit: 'cover' }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-4 rounded text-none">
                  <div className="d-flex h-100 px-4 align-items-center justify-content-center py-4 rounded-4" style={{ backdropFilter: 'blur(20px)' }}>
                    <a href={card1Link} className="text-white text-decoration-none">
                      <h5 className="text-white mb-0">{card1Title}</h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mb-5">
              <div className="position-relative">
                <img className="d-block w-100 img-fluid rounded-4" src={card2Image} alt={card2Title} style={{ height: '427px', objectFit: 'cover' }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-4 rounded text-none">
                  <div className="d-flex h-100 px-4 align-items-center justify-content-center py-4 rounded-4" style={{ backdropFilter: 'blur(20px)' }}>
                    <a href={card2Link} className="text-white text-decoration-none">
                      <h5 className="text-white mb-0">{card2Title}</h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="position-relative">
                <img className="d-block w-100 img-fluid rounded-4" src={card3Image} alt={card3Title} style={{ height: '427px', objectFit: 'cover' }} />
                <div className="position-absolute bottom-0 start-0 w-100 p-4 rounded text-none">
                  <div className="d-flex h-100 px-4 align-items-center justify-content-center py-4 rounded-4" style={{ backdropFilter: 'blur(20px)' }}>
                    <a href={card3Link} className="text-white text-decoration-none">
                      <h5 className="text-white mb-0">{card3Title}</h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };
  
  export default HighlightCards;
  