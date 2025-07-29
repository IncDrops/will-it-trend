
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, query, orderBy, getCountFromServer } from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';
import { contentData, type ContentItem } from '@/lib/data';

const seedDatabase = async () => {
  const contentCollectionRef = collection(dbClient, 'content');
  const snapshot = await getCountFromServer(contentCollectionRef);
  if (snapshot.data().count === 0) {
    console.log('Content collection is empty. Seeding database...');
    const promises = contentData.map(item => {
      const docRef = doc(contentCollectionRef, item.id.toString());
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
        await seedDatabase();
        
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

  return { content, loading, error };
};
