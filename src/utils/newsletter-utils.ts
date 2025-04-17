import type { Newsletter } from 'src/types/newsletter';

const STORAGE_KEY = 'email_editor_newsletters';

export const saveNewsletterToStorage = (newsletter: Newsletter): void => {
  try {
    // Get existing newsletters
    const existingNewslettersJson = localStorage.getItem(STORAGE_KEY);
    const existingNewsletters: Newsletter[] = existingNewslettersJson
      ? JSON.parse(existingNewslettersJson)
      : [];

    // Check if newsletter already exists (update) or is new (add)
    const newsletterIndex = existingNewsletters.findIndex((n) => n.id === newsletter.id);

    if (newsletterIndex >= 0) {
      // Update existing newsletter
      existingNewsletters[newsletterIndex] = newsletter;
    } else {
      // Add new newsletter
      existingNewsletters.push(newsletter);
    }

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingNewsletters));
  } catch (error) {
    console.error('Error saving newsletter to localStorage:', error);
  }
};

export const getAllNewslettersFromStorage = (): Newsletter[] => {
  try {
    const newslettersJson = localStorage.getItem(STORAGE_KEY);
    return newslettersJson ? JSON.parse(newslettersJson) : [];
  } catch (error) {
    console.error('Error retrieving newsletters from localStorage:', error);
    return [];
  }
};

export const getNewsletterFromStorage = (newsletterId: string): Newsletter | null => {
  try {
    const newsletters = getAllNewslettersFromStorage();
    return newsletters.find((newsletter) => newsletter.id === newsletterId) || null;
  } catch (error) {
    console.error('Error retrieving newsletter from localStorage:', error);
    return null;
  }
};

export const deleteNewsletterFromStorage = (newsletterId: string): void => {
  try {
    const newsletters = getAllNewslettersFromStorage();
    const updatedNewsletters = newsletters.filter((newsletter) => newsletter.id !== newsletterId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNewsletters));
  } catch (error) {
    console.error('Error deleting newsletter from localStorage:', error);
  }
};
