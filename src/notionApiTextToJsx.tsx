import React from "react";

type Text = {
  content: string;
  link: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

type AnnotationTypes = keyof Text["annotations"];

const getElementTypeFromAnnotationType = (annotationType: AnnotationTypes) => {
  switch (annotationType) {
    case "bold":
      return "b";
    case "italic":
      return "em";
    case "strikethrough":
      return "s";
    case "underline":
      return "u";
    case "code":
      return "code";
    default:
      return "";
  }
};

export const notionApiTextToJsx = (text: Text, key = ""): React.ReactNode => {
  const { content, link, annotations } = text;
  const as = [];

  Object.entries(annotations).forEach(([key, value]) => {
    if (value) {
      const elementType = getElementTypeFromAnnotationType(
        key as AnnotationTypes
      );
      if (elementType) {
        as.push(elementType);
      }
    }
  });

  const c = as.reduce((acc, elm) => {
    return React.createElement(elm, { key }, acc);
  }, content);
  return link ? (
    <a key={key} href={link}>
      {c}
    </a>
  ) : (
    c
  );
};
