const Highlights = ({ props }) => {
    if (!props) {
      return null;
    }
  
    const {
      title,
      highlight1Title,
      highlight1Description,
      highlight1Icon,
      highlight1Link,
      highlight1LinkText,
      highlight1IconBgColor,
      highlight2Title,
      highlight2Description,
      highlight2Icon,
      highlight2Link,
      highlight2LinkText,
      highlight2IconBgColor,
      highlight3Title,
      highlight3Description,
      highlight3Icon,
      highlight3Link,
      highlight3LinkText,
      highlight3IconBgColor,
    } = props;

    console.log('Props:', props);
  
    return (
      <div className="container px-4 py-5" id="featured-3">
        <h2 className="pb-2 border-bottom">{title}</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
  
          {/* Highlight 1 */}
          <div className="feature col">
            <div
              className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3"
              style={{ backgroundColor: highlight1IconBgColor || '#0d6efd' }}
            >
              {highlight1Icon && (
                <img
                  src={highlight1Icon}
                  alt="icon"
                  style={{ width: '2em', height: '2em' }}
                />
              )}
            </div>
            <h3 className="fs-2 text-body-emphasis">{highlight1Title}</h3>
            <p>{highlight1Description}</p>
            {highlight1Link && highlight1LinkText && (
              <a href={highlight1Link} className="icon-link">
                {highlight1LinkText}
                <svg className="bi">
                  <use xlinkHref="#chevron-right" />
                </svg>
              </a>
            )}
          </div>
  
          {/* Highlight 2 */}
          <div className="feature col">
            <div
              className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3"
              style={{ backgroundColor: highlight2IconBgColor || '#0d6efd' }}
            >
              {highlight2Icon && (
                <img
                  src={highlight2Icon}
                  alt="icon"
                  style={{ width: '2em', height: '2em' }}
                />
              )}
            </div>
            <h3 className="fs-2 text-body-emphasis">{highlight2Title}</h3>
            <p>{highlight2Description}</p>
            {highlight2Link && highlight2LinkText && (
              <a href={highlight2Link} className="icon-link">
                {highlight2LinkText}
                <svg className="bi">
                  <use xlinkHref="#chevron-right" />
                </svg>
              </a>
            )}
          </div>
  
          {/* Highlight 3 */}
          <div className="feature col">
            <div
              className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3"
              style={{ backgroundColor: highlight3IconBgColor || '#0d6efd' }}
            >
              {highlight3Icon && (
                <img
                  src={highlight3Icon}
                  alt="icon"
                  style={{ width: '2em', height: '2em' }}
                />
              )}
            </div>
            <h3 className="fs-2 text-body-emphasis">{highlight3Title}</h3>
            <p>{highlight3Description}</p>
            {highlight3Link && highlight3LinkText && (
              <a href={highlight3Link} className="icon-link">
                {highlight3LinkText}
                <svg className="bi">
                  <use xlinkHref="#chevron-right" />
                </svg>
              </a>
            )}
          </div>
  
        </div>
      </div>
    );
  };
  
  export default Highlights;
  