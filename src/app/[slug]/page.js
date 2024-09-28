import Image from 'next/image';
import { getPageBySlug, getComponentsByPageId } from '../utils/data/pages';
import { RichText } from '@graphcms/rich-text-react-renderer';
import Hero from '../components/page/hero/Hero';
import HeroShowcase from '../components/page/hero/HeroShowcase';
import Highlights from '../components/page/Highlights';
import HighlightCards from '../components/page/HighlightCards';

export default async function DynamicPage({ params }) {
  let pageData = null;
  let componentData = null;
  const { slug } = params; // Access the dynamic parameter


  try {
    console.log('Slug:' + slug);
    pageData = await getPageBySlug(slug);
    console.log('Page data:', pageData);
  // console.log('Page data:', pageData.components[0].component.props);
  } catch (error) {
    console.error('Failed to load page:', error);
    return <div>Failed to load [slug] data. Please try again later.</div>;
  }

  return (
    <>
      <div className="container-fluid px-0 position-relative">
        <div className="container py-5 position-relative z-2">
          <div className="row">
            <div className="col-12">
              <div className="p-5 mb-4 bg-light rounded-3 position-relative">
                <div className="container-fluid py-5 position-relative z-2">
                  <h1 className="display-5 fw-bold">{pageData.title}</h1>
                </div>
                <Image
                  src={pageData.featuredImage}
                  alt={pageData.title}
                  fill={true}
                  className="img-fluid w-100 position-absolute start-0 top-0 rounded"
                />
              </div>
            </div>
          </div>
          {pageData.content && (
          <div className="row py-4">
            <div className="col py-5">
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </div>
          </div>
          )}
        </div>
      </div>


      {/* Render Components */}
      {pageData?.components && pageData.components.map((component) => (
      <div key={component.component.id} className="component-card mb-2">
        {component.component.type.toLowerCase() === 'herodefault' && (
          <Hero props={component.component.props} /> 
        )}
        {component.component.type.toLowerCase() === 'heroshowcase' && (
          <HeroShowcase props={component.component.props} /> 
        )}
        {component.component.type.toLowerCase() === 'highlights' && (
          <Highlights props={component.component.props} /> 
        )}
        {component.component.type.toLowerCase() === 'highlightcards' && (
          <HighlightCards props={component.component.props} /> 
        )}
      </div>
      ))}
    </>
  );
}
