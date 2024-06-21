export const createHtmlDocuments = async (
  htmlDocumentPath: string,
  replacements?: { [key: string]: string },
) => {
  let html: string;

  try {
    html = await Deno.readTextFile(htmlDocumentPath);
  } catch (error) {
    throw error;
  }

  if (replacements && typeof replacements === "object") {
    Object.keys(replacements).forEach((replacementKey) => {
      const replacement = replacements[replacementKey];
      html = html.replaceAll(
        new RegExp(`{{{ ${replacementKey} }}}`, "g"),
        replacement,
      );
    });
  }

  return html;
};
