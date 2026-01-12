import { useApp } from '@/shared/contexts/AppContext';
import { useState, useEffect } from 'react';

// Type definitions
export type TranslationObject = Record<string, unknown>;

// Translation cache
const translationCache = new Map<string, TranslationObject>();

// Pre-load all translation modules using import.meta.glob (works in production!)
const sharedTranslationModules = import.meta.glob<{ default: TranslationObject }>(
  '/src/shared/translations/**/*.json',
  { eager: false }
);

const featureTranslationModules = import.meta.glob<{ default: TranslationObject }>(
  '/src/features/*/translations/*.json',
  { eager: false }
);

// Shared translation function with parameter interpolation
const createTranslationFunction = (translations: TranslationObject) => {
  return (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Parameter interpolation
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };
};

// Dynamic import function for shared translations
const loadSharedTranslations = async (namespace: string, language: string): Promise<TranslationObject> => {
  const cacheKey = `${language}-${namespace}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const modulePath = `/src/shared/translations/${language}/${namespace}.json`;
    const moduleLoader = sharedTranslationModules[modulePath];
    
    if (!moduleLoader) {
      console.warn(`Translation module not found: ${modulePath}`);
      return {};
    }

    const module = await moduleLoader();
    const translations = module.default || module;
    translationCache.set(cacheKey, translations);
    return translations;
  } catch (error) {
    console.warn(`Translation not found: ${namespace} for ${language}`, error);
    return {};
  }
};

// Dynamic import function for feature translations
const loadFeatureTranslations = async (feature: string, language: string): Promise<TranslationObject> => {
  const cacheKey = `${language}-feature-${feature}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const modulePath = `/src/features/${feature}/translations/${language}.json`;
    const moduleLoader = featureTranslationModules[modulePath];
    
    if (!moduleLoader) {
      console.warn(`Feature translation module not found: ${modulePath}`);
      return {};
    }

    const module = await moduleLoader();
    const translations = module.default || module;
    translationCache.set(cacheKey, translations);
    return translations;
  } catch (error) {
    console.warn(`Feature translation not found: ${feature} for ${language}`, error);
    return {};
  }
};

// Main hook for shared translations (common, validation, errors, navigation, shared)
export const useSharedTranslations = (namespace: string) => {
  const { language } = useApp();
  const [translations, setTranslations] = useState<TranslationObject>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const loadTranslations = async () => {
      try {
        const loadedTranslations = await loadSharedTranslations(namespace, language);
        if (mounted) {
          setTranslations(loadedTranslations);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Failed to load translations for ${namespace}:`, error);
        if (mounted) {
          setTranslations({});
          setIsLoading(false);
        }
      }
    };

    loadTranslations();

    return () => { mounted = false; };
  }, [namespace, language]);

  const t = createTranslationFunction(translations);

  return { translations, t, isLoading };
};

// Main hook for feature-specific translations
export const useFeatureTranslations = (feature: string) => {
  const { language } = useApp();
  const [translations, setTranslations] = useState<TranslationObject>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const loadTranslations = async () => {
      try {
        const loadedTranslations = await loadFeatureTranslations(feature, language);
        if (mounted) {
          setTranslations(loadedTranslations);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Failed to load feature translations for ${feature}:`, error);
        if (mounted) {
          setTranslations({});
          setIsLoading(false);
        }
      }
    };

    loadTranslations();

    return () => { mounted = false; };
  }, [feature, language]);

  const t = createTranslationFunction(translations);

  return { translations, t, isLoading };
};

// Utility function to clear cache
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

// Preload critical translations
export const preloadCriticalTranslations = async (language: string): Promise<void> => {
  const promises = [
    loadSharedTranslations('validation', language),
    loadSharedTranslations('common', language),
    loadSharedTranslations('navigation', language),
    loadSharedTranslations('errors', language),
    loadSharedTranslations('shared', language)
  ];
  
  await Promise.all(promises);
};
