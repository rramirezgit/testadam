import type { EmailComponent } from 'src/types/saved-note';

import { useState, useCallback } from 'react';

import {
  newsComponents,
  plaidComponents,
  notionComponents,
  stripeComponents,
  vercelComponents,
  marketComponents,
  featureComponents,
  newsComponentsWeb,
  plaidComponentsWeb,
  notionComponentsWeb,
  stripeComponentsWeb,
  vercelComponentsWeb,
  marketComponentsWeb,
} from '../data/template-components';

// Crear una plantilla vacía
const emptyTemplate: EmailComponent[] = [];

export const useEmailComponents = () => {
  // Estados para los componentes de cada plantilla
  const [blankComponentsState, setBlankComponents] = useState<EmailComponent[]>(emptyTemplate);
  const [blankComponentsWebState, setBlankComponentsWeb] =
    useState<EmailComponent[]>(emptyTemplate);
  const [notionComponentsState, setNotionComponents] = useState<EmailComponent[]>(notionComponents);
  const [notionComponentsWebState, setNotionComponentsWeb] =
    useState<EmailComponent[]>(notionComponentsWeb);
  const [plaidComponentsState, setPlaidComponents] = useState<EmailComponent[]>(plaidComponents);
  const [plaidComponentsWebState, setPlaidComponentsWeb] =
    useState<EmailComponent[]>(plaidComponentsWeb);
  const [stripeComponentsState, setStripeComponents] = useState<EmailComponent[]>(stripeComponents);
  const [stripeComponentsWebState, setStripeComponentsWeb] =
    useState<EmailComponent[]>(stripeComponentsWeb);
  const [vercelComponentsState, setVercelComponents] = useState<EmailComponent[]>(vercelComponents);
  const [vercelComponentsWebState, setVercelComponentsWeb] =
    useState<EmailComponent[]>(vercelComponentsWeb);
  const [newsComponentsState, setNewsComponents] = useState<EmailComponent[]>(newsComponents);
  const [newsComponentsWebState, setNewsComponentsWeb] =
    useState<EmailComponent[]>(newsComponentsWeb);
  const [marketComponentsState, setMarketComponents] = useState<EmailComponent[]>(marketComponents);
  const [marketComponentsWebState, setMarketComponentsWeb] =
    useState<EmailComponent[]>(marketComponentsWeb);
  const [featureComponentsState, setFeatureComponents] =
    useState<EmailComponent[]>(featureComponents);

  // Obtener los componentes activos según la plantilla seleccionada y la versión activa
  const getActiveComponents = useCallback(
    (activeTemplate: string, activeVersion: 'newsletter' | 'web') => {
      if (activeVersion === 'newsletter') {
        switch (activeTemplate) {
          case 'blank':
            return blankComponentsState;
          case 'notion':
            return notionComponentsState;
          case 'plaid':
            return plaidComponentsState;
          case 'stripe':
            return stripeComponentsState;
          case 'vercel':
            return vercelComponentsState;
          case 'news':
            return newsComponentsState;
          case 'market':
            return marketComponentsState;
          case 'feature':
            return featureComponentsState;
          default:
            return blankComponentsState;
        }
      } else {
        switch (activeTemplate) {
          case 'blank':
            return blankComponentsWebState;
          case 'notion':
            return notionComponentsWebState;
          case 'plaid':
            return plaidComponentsWebState;
          case 'stripe':
            return stripeComponentsWebState;
          case 'vercel':
            return vercelComponentsWebState;
          case 'news':
            return newsComponentsWebState;
          case 'market':
            return marketComponentsWebState;
          case 'feature':
            return featureComponentsState; // Feature solo tiene versión newsletter
          default:
            return blankComponentsWebState;
        }
      }
    },
    [
      blankComponentsState,
      blankComponentsWebState,
      notionComponentsState,
      notionComponentsWebState,
      plaidComponentsState,
      plaidComponentsWebState,
      stripeComponentsState,
      stripeComponentsWebState,
      vercelComponentsState,
      vercelComponentsWebState,
      newsComponentsState,
      newsComponentsWebState,
      marketComponentsState,
      marketComponentsWebState,
      featureComponentsState,
    ]
  );

  // Actualizar los componentes activos según la versión
  const updateActiveComponents = useCallback(
    (activeTemplate: string, activeVersion: 'newsletter' | 'web', components: EmailComponent[]) => {
      if (activeVersion === 'web') {
        switch (activeTemplate) {
          case 'blank':
            setBlankComponentsWeb(components);
            break;
          case 'news':
            setNewsComponentsWeb(components);
            break;
          case 'notion':
            setNotionComponentsWeb(components);
            break;
          case 'plaid':
            setPlaidComponentsWeb(components);
            break;
          case 'stripe':
            setStripeComponentsWeb(components);
            break;
          case 'vercel':
            setVercelComponentsWeb(components);
            break;
          case 'market':
            setMarketComponentsWeb(components);
            break;
          case 'feature':
            setFeatureComponents(components); // Feature solo tiene versión newsletter, actualizar la misma
            break;
          default:
            break;
        }
      } else {
        switch (activeTemplate) {
          case 'blank':
            setBlankComponents(components);
            break;
          case 'news':
            setNewsComponents(components);
            break;
          case 'notion':
            setNotionComponents(components);
            break;
          case 'plaid':
            setPlaidComponents(components);
            break;
          case 'stripe':
            setStripeComponents(components);
            break;
          case 'vercel':
            setVercelComponents(components);
            break;
          case 'market':
            setMarketComponents(components);
            break;
          case 'feature':
            setFeatureComponents(components);
            break;
          default:
            break;
        }
      }
    },
    []
  );

  // Función para obtener los componentes de la otra versión
  const getOtherVersionComponents = useCallback(
    (activeTemplate: string, otherVersion: 'newsletter' | 'web'): EmailComponent[] => {
      if (otherVersion === 'web') {
        switch (activeTemplate) {
          case 'blank':
            return [...blankComponentsWebState];
          case 'news':
            return [...newsComponentsWebState];
          case 'notion':
            return [...notionComponentsWebState];
          case 'plaid':
            return [...plaidComponentsWebState];
          case 'stripe':
            return [...stripeComponentsWebState];
          case 'vercel':
            return [...vercelComponentsWebState];
          case 'market':
            return [...marketComponentsWebState];
          case 'feature':
            return [...featureComponentsState]; // Feature solo tiene versión newsletter
          default:
            return [...blankComponentsWebState];
        }
      } else {
        switch (activeTemplate) {
          case 'blank':
            return [...blankComponentsState];
          case 'news':
            return [...newsComponentsState];
          case 'notion':
            return [...notionComponentsState];
          case 'plaid':
            return [...plaidComponentsState];
          case 'stripe':
            return [...stripeComponentsState];
          case 'vercel':
            return [...vercelComponentsState];
          case 'market':
            return [...marketComponentsState];
          case 'feature':
            return [...featureComponentsState];
          default:
            return [...blankComponentsState];
        }
      }
    },
    [
      blankComponentsState,
      blankComponentsWebState,
      notionComponentsState,
      notionComponentsWebState,
      plaidComponentsState,
      plaidComponentsWebState,
      stripeComponentsState,
      stripeComponentsWebState,
      vercelComponentsState,
      vercelComponentsWebState,
      newsComponentsState,
      newsComponentsWebState,
      marketComponentsState,
      marketComponentsWebState,
      featureComponentsState,
    ]
  );

  // Función para cargar componentes del post
  const loadPostComponents = useCallback((templateType: string, objData: any, objDataWeb: any) => {
    switch (templateType) {
      case 'blank':
        setBlankComponents(objData);
        if (objDataWeb) setBlankComponentsWeb(objDataWeb);
        break;
      case 'news':
        setNewsComponents(objData);
        if (objDataWeb) setNewsComponentsWeb(objDataWeb);
        break;
      case 'notion':
        setNotionComponents(objData);
        if (objDataWeb) setNotionComponentsWeb(objDataWeb);
        break;
      case 'plaid':
        setPlaidComponents(objData);
        if (objDataWeb) setPlaidComponentsWeb(objDataWeb);
        break;
      case 'stripe':
        setStripeComponents(objData);
        if (objDataWeb) setStripeComponentsWeb(objDataWeb);
        break;
      case 'vercel':
        setVercelComponents(objData);
        if (objDataWeb) setVercelComponentsWeb(objDataWeb);
        break;
      case 'market':
        setMarketComponents(objData);
        if (objDataWeb) setMarketComponentsWeb(objDataWeb);
        break;
      case 'feature':
        setFeatureComponents(objData);
        break;
      default:
        setNotionComponents(objData);
        if (objDataWeb) setNotionComponentsWeb(objDataWeb);
    }
  }, []);

  return {
    // Estados
    blankComponentsState,
    blankComponentsWebState,
    notionComponentsState,
    notionComponentsWebState,
    plaidComponentsState,
    plaidComponentsWebState,
    stripeComponentsState,
    stripeComponentsWebState,
    vercelComponentsState,
    vercelComponentsWebState,
    newsComponentsState,
    newsComponentsWebState,
    marketComponentsState,
    marketComponentsWebState,
    featureComponentsState,

    // Funciones
    getActiveComponents,
    updateActiveComponents,
    getOtherVersionComponents,
    loadPostComponents,

    // Setters directos
    setBlankComponents,
    setBlankComponentsWeb,
    setNotionComponents,
    setNotionComponentsWeb,
    setPlaidComponents,
    setPlaidComponentsWeb,
    setStripeComponents,
    setStripeComponentsWeb,
    setVercelComponents,
    setVercelComponentsWeb,
    setNewsComponents,
    setNewsComponentsWeb,
    setMarketComponents,
    setMarketComponentsWeb,
    setFeatureComponents,
  };
};
