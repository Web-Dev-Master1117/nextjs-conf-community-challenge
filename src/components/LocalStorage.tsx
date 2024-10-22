import { useEffect } from "react";
import tutorialStore from "tutorialkit:store";

export default function LocalStorage() {
  useEffect(() => {
    const cleanupRef = { current: () => {} };

    tutorialStore.lessonFullyLoaded.listen((loaded) => {
      if (loaded) {
        const cleanups = setupLocalStorage();
        cleanupRef.current = cleanups;
      }
    });

    return () => cleanupRef.current();
  }, []);

  return null;
}

function setupLocalStorage() {
  const filenames = tutorialStore.documents.get();
  console.log("filenames", filenames);
  const cleanups: (() => void)[] = [];

  for (const filename in filenames) {
    // load initial values
    const value = localStorage.getItem(filename);

    if (value) {
      tutorialStore.updateFile(filename, value);
    }

    // reflect changes in local storage
    const unsubscribe = tutorialStore.onDocumentChanged(filename, (doc) => {
      localStorage.setItem(filename, doc.value.toString());
    });

    cleanups.push(unsubscribe);
  }

  return function cleanup() {
    cleanups.splice(0).forEach((fn) => fn());
  };
}
