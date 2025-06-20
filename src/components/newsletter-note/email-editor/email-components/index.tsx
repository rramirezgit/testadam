import ImageComponent from './ImageComponent';
import AuthorComponent from './AuthorComponent';
import ButtonComponent from './ButtonComponent';
import SpacerComponent from './SpacerComponent';
import SummaryComponent from './SummaryComponent';
import HeadingComponent from './HeadingComponent';
import DividerComponent from './DividerComponent';
import GalleryComponent from './GalleryComponent';
import CategoryComponent from './CategoryComponent';
import ParagraphComponent from './ParagraphComponent';
import ImageTextComponent from './ImageTextComponent';
import BulletListComponent from './BulletListComponent';
import TwoColumnsComponent from './TwoColumnsComponent';
import TextWithIconComponent from './TextWithIconComponent';
import HerramientasComponent from './HerramientasComponent';
import RespaldadoPorComponent from './RespaldadoPorComponent';
import TituloConIconoComponent from './TituloConIconoComponent';

import type { EmailComponentProps } from './types';

const EmailComponentRenderer = (props: EmailComponentProps) => {
  const { component } = props;

  switch (component.type) {
    case 'category':
      return <CategoryComponent {...props} />;
    case 'author':
      return <AuthorComponent {...props} />;
    case 'summary':
      return <SummaryComponent {...props} />;
    case 'heading':
      return <HeadingComponent {...props} />;
    case 'paragraph':
      return <ParagraphComponent {...props} />;
    case 'button':
      return <ButtonComponent {...props} />;
    case 'divider':
      return <DividerComponent {...props} />;
    case 'bulletList':
      return <BulletListComponent {...props} />;
    case 'image':
      return <ImageComponent {...props} />;
    case 'gallery':
      return <GalleryComponent {...props} />;
    case 'imageText':
      return <ImageTextComponent {...props} />;
    case 'twoColumns':
      return <TwoColumnsComponent {...props} />;
    case 'textWithIcon':
      return <TextWithIconComponent {...props} />;
    case 'tituloConIcono':
      return <TituloConIconoComponent {...props} />;
    case 'herramientas':
      return <HerramientasComponent {...props} />;
    case 'respaldadoPor':
      return <RespaldadoPorComponent {...props} />;
    case 'spacer':
      return <SpacerComponent {...props} />;
    default:
      return null;
  }
};

export default EmailComponentRenderer;
