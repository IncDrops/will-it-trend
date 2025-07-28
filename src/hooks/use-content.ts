
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';
import { contentData, type ContentItem } from '@/lib/data';

// This function seeds the database with the initial content if it's empty.
// It's useful for the first time the app runs.
const seedDatabase = async () => {
  const contentCollectionRef = collection(dbClient, 'content');
  const snapshot = await getDocs(contentCollectionRef);
  if (snapshot.empty) {
    console.log('Content collection is empty. Seeding database...');
    const promises = contentData.map(item => {
      const docRef = doc(contentCollectionRef, item.id.toString());
      // Ensure 'id' is part of the document data
      const dataWithId = { ...item, originalId: item.id };
      return setDoc(docRef, dataWithId);
    });
    await Promise.all(promises);
    console.log('Database seeded successfully.');
  } else {
    console.log('Content collection already has data. Skipping seed.');
  }
};


export const useContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // First, check if we need to seed the database
        await seedDatabase();
        
        // Then, fetch the content
        const contentCollectionRef = collection(dbClient, 'content');
        const q = query(contentCollectionRef, orderBy('originalId'));
        const snapshot = await getDocs(q);
        
        const fetchedContent = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ContentItem[];

        setContent(fetchedContent);
      } catch (e) {
        setError(e as Error);
        console.error("Error fetching content:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);
  
  const handleImageUpdate = (id: string, newImageUrl: string) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === id ? { ...item, image: newImageUrl } : item
      )
    );
  };

  return { content, loading, error, handleImageUpdate };
};
