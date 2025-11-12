import type { EmailComponent } from 'src/types/saved-note';

import { useState, useCallback } from 'react';

import { buildListHtml, normaliseListStyle } from '../email-components/utils';
import { debugComponents, findComponentById } from '../utils/componentHelpers';
import {
  newsComponents,
  howtoComponents,
  plaidComponents,
  marketComponents,
  notionComponents,
  stripeComponents,
  vercelComponents,
  featureComponents,
  skillupComponents,
  newsComponentsWeb,
  howtoComponentsWeb,
  plaidComponentsWeb,
  marketComponentsWeb,
  notionComponentsWeb,
  stripeComponentsWeb,
  vercelComponentsWeb,
  newsletterComponents,
  storyboardComponents,
  skillupComponentsWeb,
  newsletterComponentsWeb,
  storyboardComponentsWeb,
} from '../data/template-components';

// Crear una plantilla vacía
const emptyTemplate: EmailComponent[] = [];

function ensureMeta(components: EmailComponent[] = []): EmailComponent[] {
  return components.map(ensureComponentMeta);
}

function ensureComponentMeta(component: EmailComponent): EmailComponent {
  const isBulletList = component.type === 'bulletList';
  const listStyle = isBulletList ? normaliseListStyle(component.props?.listStyle) : undefined;
  const items = isBulletList ? component.props?.items || ['Elemento de lista'] : undefined;

  const normalizedComponent =
    isBulletList && items
      ? {
          ...component,
          content:
            component.content && component.content.trim().length > 0
              ? component.content
              : buildListHtml(items, listStyle),
          props: {
            ...component.props,
            listStyle,
            items,
          },
        }
      : component;

  const children = component.props?.componentsData;
  const preparedChildren = Array.isArray(children) ? ensureMeta(children) : undefined;

  const hasMeta =
    normalizedComponent.meta &&
    normalizedComponent.meta.defaultContentSnapshot !== undefined &&
    normalizedComponent.meta.defaultPropsSnapshot !== undefined;

  const baseComponent = hasMeta
    ? normalizedComponent
    : {
        ...normalizedComponent,
        meta: {
          isDefaultContent: false,
          defaultContentSnapshot: normalizedComponent.content,
          defaultPropsSnapshot: normalizedComponent.props,
          defaultStyleSnapshot: normalizedComponent.style,
        },
      };

  if (preparedChildren) {
    return {
      ...baseComponent,
      props: {
        ...baseComponent.props,
        componentsData: preparedChildren,
      },
    };
  }

  return baseComponent;
}

export const useEmailComponents = () => {
  // Estados para los componentes de cada plantilla
  const [blankComponentsState, setBlankComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(emptyTemplate)
  );
  const [blankComponentsWebState, setBlankComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(emptyTemplate)
  );
  const [notionComponentsState, setNotionComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(notionComponents)
  );
  const [notionComponentsWebState, setNotionComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(notionComponentsWeb)
  );
  const [plaidComponentsState, setPlaidComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(plaidComponents)
  );
  const [plaidComponentsWebState, setPlaidComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(plaidComponentsWeb)
  );
  const [stripeComponentsState, setStripeComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(stripeComponents)
  );
  const [stripeComponentsWebState, setStripeComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(stripeComponentsWeb)
  );
  const [vercelComponentsState, setVercelComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(vercelComponents)
  );
  const [vercelComponentsWebState, setVercelComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(vercelComponentsWeb)
  );
  const [newsComponentsState, setNewsComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(newsComponents)
  );
  const [newsComponentsWebState, setNewsComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(newsComponentsWeb)
  );
  const [marketComponentsState, setMarketComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(marketComponents)
  );
  const [marketComponentsWebState, setMarketComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(marketComponentsWeb)
  );
  const [featureComponentsState, setFeatureComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(featureComponents)
  );
  const [newsletterComponentsState, setNewsletterComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(newsletterComponents)
  );
  const [newsletterComponentsWebState, setNewsletterComponentsWeb] = useState<EmailComponent[]>(
    () => ensureMeta(newsletterComponentsWeb)
  );
  const [storyboardComponentsState, setStoryboardComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(storyboardComponents)
  );
  const [storyboardComponentsWebState, setStoryboardComponentsWeb] = useState<EmailComponent[]>(
    () => ensureMeta(storyboardComponentsWeb)
  );
  const [skillupComponentsState, setSkillupComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(skillupComponents)
  );
  const [skillupComponentsWebState, setSkillupComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(skillupComponentsWeb)
  );
  const [howtoComponentsState, setHowtoComponents] = useState<EmailComponent[]>(() =>
    ensureMeta(howtoComponents)
  );
  const [howtoComponentsWebState, setHowtoComponentsWeb] = useState<EmailComponent[]>(() =>
    ensureMeta(howtoComponentsWeb)
  );

  // Obtener los componentes activos según la plantilla seleccionada y la versión activa
  const getActiveComponents = useCallback(
    (activeTemplate: string, activeVersion: 'newsletter' | 'web') => {
      let components: EmailComponent[] = [];

      if (activeVersion === 'newsletter') {
        switch (activeTemplate) {
          case 'blank':
            components = blankComponentsState;
            break;
          case 'notion':
            components = notionComponentsState;
            break;
          case 'plaid':
            components = plaidComponentsState;
            break;
          case 'stripe':
            components = stripeComponentsState;
            break;
          case 'vercel':
            components = vercelComponentsState;
            break;
          case 'news':
            components = newsComponentsState;
            break;
          case 'market':
            components = marketComponentsState;
            break;
          case 'feature':
            components = featureComponentsState;
            break;
          case 'newsletter':
            components = newsletterComponentsState;
            break;
          case 'storyboard':
            components = storyboardComponentsState;
            break;
          case 'skillup':
            components = skillupComponentsState;
            break;
          case 'howto':
            components = howtoComponentsState;
            break;
          default:
            components = blankComponentsState;
            break;
        }
      } else {
        switch (activeTemplate) {
          case 'blank':
            components = blankComponentsWebState;
            break;
          case 'notion':
            components = notionComponentsWebState;
            break;
          case 'plaid':
            components = plaidComponentsWebState;
            break;
          case 'stripe':
            components = stripeComponentsWebState;
            break;
          case 'vercel':
            components = vercelComponentsWebState;
            break;
          case 'news':
            components = newsComponentsWebState;
            break;
          case 'market':
            components = marketComponentsWebState;
            break;
          case 'feature':
            components = featureComponentsState; // Feature solo tiene versión newsletter
            break;
          case 'newsletter':
            components = newsletterComponentsWebState;
            break;
          case 'storyboard':
            components = storyboardComponentsWebState;
            break;
          case 'skillup':
            components = skillupComponentsWebState;
            break;
          case 'howto':
            components = howtoComponentsWebState;
            break;
          default:
            components = blankComponentsWebState;
            break;
        }
      }

      // Debug de componentes activos
      if (process.env.NODE_ENV === 'development') {
        debugComponents(components, `getActiveComponents(${activeTemplate}, ${activeVersion})`);
      }

      return components;
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
      newsletterComponentsState,
      newsletterComponentsWebState,
      storyboardComponentsState,
      storyboardComponentsWebState,
      skillupComponentsState,
      skillupComponentsWebState,
      howtoComponentsState,
      howtoComponentsWebState,
    ]
  );

  // Nueva función para filtrar componentes inyectados
  const getFilteredActiveComponents = useCallback(
    (
      activeTemplate: string,
      activeVersion: 'newsletter' | 'web',
      filterInjected: boolean = false
    ) => {
      const components = getActiveComponents(activeTemplate, activeVersion);

      if (!filterInjected) {
        return components;
      }

      // Filtrar componentes inyectados (que tienen IDs con el patrón -injected-)
      return components.filter((component) => {
        // Si es un contenedor de nota, verificar si contiene componentes inyectados
        if (component.type === 'noteContainer' && component.props?.componentsData) {
          const hasInjectedComponents = component.props.componentsData.some(
            (comp: any) => comp.id && comp.id.includes('-injected-')
          );
          return !hasInjectedComponents;
        }

        // Para componentes individuales, verificar si tienen el patrón -injected-
        return !(component.id && component.id.includes('-injected-'));
      });
    },
    [getActiveComponents]
  );

  // Nueva función para obtener solo componentes inyectados
  const getInjectedComponents = useCallback(
    (activeTemplate: string, activeVersion: 'newsletter' | 'web') => {
      const components = getActiveComponents(activeTemplate, activeVersion);
      const injectedComponents: EmailComponent[] = [];

      components.forEach((component) => {
        // Si es un contenedor de nota, extraer los componentes inyectados
        if (component.type === 'noteContainer' && component.props?.componentsData) {
          const injectedInContainer = component.props.componentsData.filter(
            (comp: any) => comp.id && comp.id.includes('-injected-')
          );
          injectedComponents.push(...injectedInContainer);
        }

        // Para componentes individuales inyectados
        if (component.id && component.id.includes('-injected-')) {
          injectedComponents.push(component);
        }
      });

      return injectedComponents;
    },
    [getActiveComponents]
  );

  // Nueva función para resolver el problema específico de componentes inyectados
  const resolveInjectedComponentIssue = useCallback(
    (activeTemplate: string, activeVersion: 'newsletter' | 'web', targetComponentId?: string) => {
      const components = getActiveComponents(activeTemplate, activeVersion);

      console.log('🔧 Resolviendo problema de componentes inyectados:', {
        activeTemplate,
        activeVersion,
        targetComponentId,
        totalComponents: components.length,
      });

      // Buscar componentes inyectados específicos
      if (targetComponentId) {
        const foundComponent = findComponentById(components, targetComponentId);
        console.log('🎯 Componente buscado:', {
          targetId: targetComponentId,
          found: !!foundComponent,
          component: foundComponent ? { id: foundComponent.id, type: foundComponent.type } : null,
        });

        if (foundComponent) {
          return foundComponent;
        }
      }

      // Listar todos los componentes inyectados
      const injectedComponents = getInjectedComponents(activeTemplate, activeVersion);
      console.log(
        '📋 Componentes inyectados encontrados:',
        injectedComponents.map((c) => ({ id: c.id, type: c.type }))
      );

      // Listar contenedores de nota
      const noteContainers = components.filter((c) => c.type === 'noteContainer');
      console.log(
        '📦 Contenedores de nota:',
        noteContainers.map((c) => ({
          id: c.id,
          containedComponents: c.props?.componentsData?.length || 0,
          componentIds: c.props?.componentsData?.map((comp: any) => comp.id) || [],
        }))
      );

      return {
        components,
        injectedComponents,
        noteContainers,
        targetComponent: targetComponentId
          ? findComponentById(components, targetComponentId)
          : null,
      };
    },
    [getActiveComponents, getInjectedComponents]
  );

  /*
   * EJEMPLO DE USO PARA RESOLVER EL PROBLEMA DE COMPONENTES INYECTADOS:
   *
   * Si tienes un problema con un componente como "tituloConIcono-1-injected-1752787453909-0",
   * puedes usar estas funciones para debuggear y resolver el problema:
   *
   * // 1. Obtener todos los componentes activos
   * const allComponents = getActiveComponents('newsletter', 'newsletter');
   *
   * // 2. Obtener solo componentes inyectados
   * const injectedComponents = getInjectedComponents('newsletter', 'newsletter');
   *
   * // 3. Filtrar componentes inyectados (excluir componentes con -injected-)
   * const filteredComponents = getFilteredActiveComponents('newsletter', 'newsletter', true);
   *
   * // 4. Resolver problema específico con un componente
   * const issueResolution = resolveInjectedComponentIssue('newsletter', 'newsletter', 'tituloConIcono-1-injected-1752787453909-0');
   *
   * // 5. Buscar un componente específico
   * const specificComponent = findComponentById(allComponents, 'tituloConIcono-1-injected-1752787453909-0');
   *
   * Estas funciones te ayudarán a:
   * - Identificar dónde están los componentes inyectados
   * - Verificar si se están filtrando correctamente
   * - Debuggear problemas específicos con componentes inyectados
   * - Obtener información detallada sobre la estructura de componentes
   */

  // Actualizar los componentes activos según la versión
  const updateActiveComponents = useCallback(
    (activeTemplate: string, activeVersion: 'newsletter' | 'web', components: EmailComponent[]) => {
      const preparedComponents = ensureMeta(components);

      if (activeVersion === 'web') {
        switch (activeTemplate) {
          case 'blank':
            setBlankComponentsWeb(preparedComponents);
            break;
          case 'news':
            setNewsComponentsWeb(preparedComponents);
            break;
          case 'notion':
            setNotionComponentsWeb(preparedComponents);
            break;
          case 'plaid':
            setPlaidComponentsWeb(preparedComponents);
            break;
          case 'stripe':
            setStripeComponentsWeb(preparedComponents);
            break;
          case 'vercel':
            setVercelComponentsWeb(preparedComponents);
            break;
          case 'market':
            setMarketComponentsWeb(preparedComponents);
            break;
          case 'feature':
            setFeatureComponents(preparedComponents); // Feature solo tiene versión newsletter, actualizar la misma
            break;
          case 'newsletter':
            setNewsletterComponentsWeb(preparedComponents);
            break;
          case 'storyboard':
            setStoryboardComponentsWeb(preparedComponents);
            break;
          case 'skillup':
            setSkillupComponentsWeb(preparedComponents);
            break;
          case 'howto':
            setHowtoComponentsWeb(preparedComponents);
            break;
          default:
            break;
        }
      } else {
        switch (activeTemplate) {
          case 'blank':
            setBlankComponents(preparedComponents);
            break;
          case 'news':
            setNewsComponents(preparedComponents);
            break;
          case 'notion':
            setNotionComponents(preparedComponents);
            break;
          case 'plaid':
            setPlaidComponents(preparedComponents);
            break;
          case 'stripe':
            setStripeComponents(preparedComponents);
            break;
          case 'vercel':
            setVercelComponents(preparedComponents);
            break;
          case 'market':
            setMarketComponents(preparedComponents);
            break;
          case 'feature':
            setFeatureComponents(preparedComponents);
            break;
          case 'newsletter':
            setNewsletterComponents(preparedComponents);
            break;
          case 'storyboard':
            setStoryboardComponents(preparedComponents);
            break;
          case 'skillup':
            setSkillupComponents(preparedComponents);
            break;
          case 'howto':
            setHowtoComponents(preparedComponents);
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
          case 'newsletter':
            return [...newsletterComponentsWebState];
          case 'storyboard':
            return [...storyboardComponentsWebState];
          case 'skillup':
            return [...skillupComponentsWebState];
          case 'howto':
            return [...howtoComponentsWebState];
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
          case 'newsletter':
            return [...newsletterComponentsState];
          case 'storyboard':
            return [...storyboardComponentsState];
          case 'skillup':
            return [...skillupComponentsState];
          case 'howto':
            return [...howtoComponentsState];
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
      newsletterComponentsState,
      newsletterComponentsWebState,
      storyboardComponentsState,
      storyboardComponentsWebState,
      skillupComponentsState,
      skillupComponentsWebState,
      howtoComponentsState,
      howtoComponentsWebState,
    ]
  );

  // Función para cargar componentes del post
  const loadPostComponents = useCallback((templateType: string, objData: any, objDataWeb: any) => {
    // Validar que objData sea un array antes de cargarlo
    if (!Array.isArray(objData)) {
      console.error('loadPostComponents: objData no es un array válido', objData);
      return;
    }

    // Validar objDataWeb si existe
    if (objDataWeb && !Array.isArray(objDataWeb)) {
      console.error('loadPostComponents: objDataWeb no es un array válido', objDataWeb);
      objDataWeb = null; // Ignorar objDataWeb inválido
    }

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
      case 'newsletter':
        setNewsletterComponents(objData);
        if (objDataWeb) setNewsletterComponentsWeb(objDataWeb);
        break;
      case 'skillup':
        setSkillupComponents(objData);
        if (objDataWeb) setSkillupComponentsWeb(objDataWeb);
        break;
      case 'howto':
        setHowtoComponents(objData);
        if (objDataWeb) setHowtoComponentsWeb(objDataWeb);
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
    newsletterComponentsState,
    newsletterComponentsWebState,
    skillupComponentsState,
    skillupComponentsWebState,
    howtoComponentsState,
    howtoComponentsWebState,

    // Funciones
    getActiveComponents,
    getFilteredActiveComponents,
    getInjectedComponents,
    resolveInjectedComponentIssue,
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
    setNewsletterComponents,
    setNewsletterComponentsWeb,
    setStoryboardComponents,
    setStoryboardComponentsWeb,
  };
};
