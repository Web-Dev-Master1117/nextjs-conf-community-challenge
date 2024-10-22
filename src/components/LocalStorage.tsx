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

  return <></>;
}

function setupLocalStorage() {
  const filenames = tutorialStore.documents.get();
  const cleanups: (() => void)[] = [];

  for (const filename in filenames) {
    // load initial values
    const pathPlusFilename = `/${tutorialStore.lesson?.filepath}${filename}`;
    const value = localStorage.getItem(pathPlusFilename);

    if (value) {
      tutorialStore.updateFile(filename, value);
    }

    // reflect changes in local storage
    const unsubscribe = tutorialStore.onDocumentChanged(filename, (doc) => {
      if (
        pathPlusFilename.includes(window.location.pathname) &&
        doc.loading === false
      ) {
        localStorage.setItem(pathPlusFilename, doc.value.toString());
      }
    });

    cleanups.push(unsubscribe);
  }

  return function cleanup() {
    cleanups.splice(0).forEach((fn) => fn());
  };
}
