import { useApp } from '@/shared/contexts/AppContext';
import { useState, useEffect } from 'react';

// Type definitions
export type TranslationObject = Record<string, unknown>;

// Translation cache
const translationCache = new Map<string, TranslationObject>();
const loadingPromises = new Map<string, Promise<TranslationObject>>();

// Shared translation function with parameter interpolation
const createTranslationFunction = (translations: TranslationObject) => {
  return (key: string, params?: Record<string, string | number>): string => {
    // Navigate through nested keys (e.g., "email.required")
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
  
  // Return cached translations if available
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  // Return existing loading promise if already loading
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!;
  }
  
  // Create new loading promise
  const loadingPromise = (async () => {
    try {
      const module = await import(`/src/shared/translations/${language}/${namespace}.json`);
      const translations = module.default || module;
      
      translationCache.set(cacheKey, translations);
      loadingPromises.delete(cacheKey);
      
      return translations;
    } catch (error) {
      console.warn(`Translation not found: ${namespace} for ${language}`, error);
      loadingPromises.delete(cacheKey);
      return {};
    }
  })();
  
  loadingPromises.set(cacheKey, loadingPromise);
  return loadingPromise;
};

// Dynamic import function for feature translations
const loadFeatureTranslations = async (feature: string, language: string): Promise<TranslationObject> => {
  const cacheKey = `${language}-${feature}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!;
  }
  
  const loadingPromise = (async () => {
    try {
      const module = await import(`/src/features/${feature}/translations/${language}.json`);
      const translations = module.default || module;
      
      translationCache.set(cacheKey, translations);
      loadingPromises.delete(cacheKey);
      
      return translations;
    } catch (error) {
      console.warn(`Feature translation not found: ${feature} for ${language}`, error);
      loadingPromises.delete(cacheKey);
      return {};
    }
  })();
  
  loadingPromises.set(cacheKey, loadingPromise);
  return loadingPromise;
};

// Main hook for shared translations (common, validation, errors, navigation)
export const useSharedTranslations = (namespace: string) => {
  const { language } = useApp();
  const [translations, setTranslations] = useState<TranslationObject>({});
  
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const loadedTranslations = await loadSharedTranslations(namespace, language);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error(`Failed to load translations for ${namespace}:`, error);
        setTranslations({});
      }
    };
    
    loadTranslations();
  }, [namespace, language]);
  
  const t = createTranslationFunction(translations);
  
  return { translations, t };
};

// Main hook for feature-specific translations
export const useFeatureTranslations = (feature: string) => {
  const { language } = useApp();
  const [translations, setTranslations] = useState<TranslationObject>({});
  
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const loadedTranslations = await loadFeatureTranslations(feature, language);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error(`Failed to load feature translations for ${feature}:`, error);
        setTranslations({});
      }
    };
    
    loadTranslations();
  }, [feature, language]);
  
  const t = createTranslationFunction(translations);
  
  return { translations, t };
};

// Utility function to clear cache
export const clearTranslationCache = (): void => {
  translationCache.clear();
  loadingPromises.clear();
};

// Preload critical translations (validation, common) immediately
export const preloadCriticalTranslations = async (language: string): Promise<void> => {
  const promises = [
    loadSharedTranslations('validation', language),
    loadSharedTranslations('common', language),
    loadSharedTranslations('navigation', language),
    loadSharedTranslations('errors', language)
  ];
  await Promise.all(promises);
};
