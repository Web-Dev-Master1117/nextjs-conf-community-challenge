import estree from "prettier/plugins/estree";
import ts from "prettier/plugins/typescript";
import postcss from "prettier/plugins/postcss";
import * as prettier from "prettier/standalone";
import { useEffect } from "react";
import tutorialStore from "tutorialkit:store";

export default function Prettier() {
  useEffect(() => {
    tutorialStore.lessonFullyLoaded.listen((loaded) => {
      if (loaded) {
        const existingPrettierButton = document.querySelector(
          "#editor-opened .panel-header #prettier"
        );
        const editorResetButton = document.querySelector(
          "#editor-opened .panel-header .panel-button"
        );

        if (editorResetButton && !existingPrettierButton) {
          const prettierButton = document.createElement("button");
          prettierButton.id = "prettier";
          prettierButton.className = "panel-button px-2 py-0.5 mr-3 -my-1";
          prettierButton.textContent = "Format";
          prettierButton.addEventListener("click", async () => {
            const doc = tutorialStore.currentDocument.get()!;
            const code = await prettier.format(doc.value.toString(), {
              parser: doc.filePath.endsWith(".css") ? "css" : "typescript",
              plugins: [ts, estree, postcss],
            });
            tutorialStore.setCurrentDocumentContent(code);
          });
          editorResetButton.parentNode?.insertBefore(
            prettierButton,
            editorResetButton
          );

          const prettierIcon = document.createElement("img");
          prettierIcon.src = "/prettier-icon.svg";
          prettierIcon.className = "dark:invert";
          prettierButton.prepend(prettierIcon);
        }
      }
    });
  }, []);

  return <></>;
}
