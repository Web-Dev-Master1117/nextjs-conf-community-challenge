import estree from "prettier/plugins/estree";
import ts from "prettier/plugins/typescript";
import * as prettier from "prettier/standalone";
import { useEffect } from "react";
import tutorialStore from "tutorialkit:store";

export default function Prettier() {
  useEffect(() => {
    const cleanupRef = { current: () => {} };

    tutorialStore.lessonFullyLoaded.listen((loaded) => {
      if (loaded) {
        const cleanups = setupPrettier();
        cleanupRef.current = cleanups;
      }
    });

    return () => cleanupRef.current();
  }, []);

  return <></>;
}

function setupPrettier() {
  const filenames = tutorialStore.documents.get();
  const cleanups: (() => void)[] = [];

  for (const filename in filenames) {
    if (!filename.endsWith(".ts") && !filename.endsWith(".tsx")) {
      continue;
    }

    let timeout: NodeJS.Timeout;

    const unsubscribe = tutorialStore.onDocumentChanged(filename, (doc) => {
      clearTimeout(timeout);

      timeout = setTimeout(async () => {
        const code = await prettier.format(doc.value.toString(), {
          semi: false,
          parser: "typescript",
          plugins: [ts, estree],
        });
        tutorialStore.updateFile(filename, code);
      }, 1_000);
    });

    cleanups.push(unsubscribe);
  }

  return function cleanup() {
    cleanups.splice(0).forEach((fn) => fn());
  };
}
