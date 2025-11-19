import { CONFIG } from 'src/global-config';

import ImageComponent from './ImageComponent';
import ChartComponent from './ChartComponent';
import AuthorComponent from './AuthorComponent';
import ButtonComponent from './ButtonComponent';
import SpacerComponent from './SpacerComponent';
import HeadingComponent from './HeadingComponent';
import DividerComponent from './DividerComponent';
import GalleryComponent from './GalleryComponent';
import SummaryComponent from './SummaryComponent';
import CategoryComponent from './CategoryComponent';
import ParagraphComponent from './ParagraphComponent';
import ImageTextComponent from './ImageTextComponent';
import BulletListComponent from './BulletListComponent';
import MultiColumnsComponent from './MultiColumnsComponent';
import TextWithIconComponent from './TextWithIconComponent';
import HerramientasComponent from './HerramientasComponent';
import RespaldadoPorComponent from './RespaldadoPorComponent';
import NoteContainerComponent from './NoteContainerComponent';
import TituloConIconoComponent from './TituloConIconoComponent';
import FileAttachmentComponent from './FileAttachmentComponent';
import ComponentContainerComponent from './ComponentContainerComponent';
import NewsletterHeaderReusableComponent from './NewsletterHeaderReusableComponent';
import NewsletterFooterReusableComponent from './NewsletterFooterReusableComponent';

import type { ComponentType } from '../types';
import type { EmailComponentProps } from './types';

const isMichinPlatform = CONFIG.platform === 'MICHIN';

const EmailComponentRenderer = (props: EmailComponentProps) => {
  const { component } = props;

  switch (component.type as ComponentType) {
    case 'category':
      return <CategoryComponent {...props} />;
    case 'author':
      return <AuthorComponent {...props} />;
    case 'summary':
      return isMichinPlatform ? (
        <ImageTextComponent
          {...props}
          component={{
            ...component,
            props: {
              variant: 'amarillo',
              titleContent: '<p>Resumen</p>',
              imageAlt: 'Imagen',
              layout: 'image-left',
              ...component.props,
            },
          }}
        />
      ) : (
        <SummaryComponent {...props} />
      );
    case 'heading':
      return <HeadingComponent {...props} />;
    case 'paragraph':
      return <ParagraphComponent {...props} />;
    case 'button':
      return <ButtonComponent {...props} />;
    case 'divider':
      // Verificar si es un contenedor de componente individual (legacy)
      if (component.props?.isComponentContainer) {
        return <ComponentContainerComponent {...props} />;
      }
      return <DividerComponent {...props} />;
    case 'noteContainer':
      return <NoteContainerComponent {...props} />;
    case 'bulletList':
      return <BulletListComponent {...props} />;
    case 'image':
      return <ImageComponent {...props} />;
    case 'gallery':
      return <GalleryComponent {...props} />;
    case 'imageText':
      return <ImageTextComponent {...props} />;
    case 'twoColumns':
      return <MultiColumnsComponent {...props} />;
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
    case 'chart':
      return <ChartComponent {...props} />;
    case 'newsletterHeaderReusable':
      return <NewsletterHeaderReusableComponent {...props} />;
    case 'newsletterFooterReusable':
      return <NewsletterFooterReusableComponent {...props} />;
    case 'fileAttachment':
      return <FileAttachmentComponent {...props} />;
    // case 'newsletterHeader': // ELIMINADO: Solo header global
    //   return <NewsletterHeaderComponent {...props} />;
    default:
      return null;
  }
};

export default EmailComponentRenderer;
