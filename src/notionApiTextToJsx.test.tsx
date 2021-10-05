import { notionApiTextToJsx } from "./notionApiTextToJsx";

describe("notionApiTextToJsx", () => {
  test("it should work really good", () => {
    expect(
      notionApiTextToJsx({
        content: "text",
        link: null,
        annotations: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
          code: true,
          color: "default",
        },
      })
    ).toEqual(
      <code>
        <s>
          <u>
            <em>
              <b>text</b>
            </em>
          </u>
        </s>
      </code>
    );
    expect(
      notionApiTextToJsx({
        content: "text",
        link: null,
        annotations: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
          code: false,
          color: "default",
        },
      })
    ).toEqual(
      <s>
        <u>
          <em>
            <b>text</b>
          </em>
        </u>
      </s>
    );
    expect(
      notionApiTextToJsx({
        content: "text",
        link: null,
        annotations: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: false,
          code: false,
          color: "default",
        },
      })
    ).toEqual(
      <u>
        <em>
          <b>text</b>
        </em>
      </u>
    );
    expect(
      notionApiTextToJsx({
        content: "text",
        link: null,
        annotations: {
          bold: true,
          italic: true,
          underline: false,
          strikethrough: false,
          code: false,
          color: "default",
        },
      })
    ).toEqual(
      <em>
        <b>text</b>
      </em>
    );
    expect(
      notionApiTextToJsx({
        content: "text",
        link: null,
        annotations: {
          bold: true,
          italic: false,
          underline: false,
          strikethrough: false,
          code: false,
          color: "default",
        },
      })
    ).toEqual(<b>text</b>);
    expect(
      notionApiTextToJsx({
        content: "text",
        link: null,
        annotations: {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          code: false,
          color: "default",
        },
      })
    ).toEqual("text");
    expect(
      notionApiTextToJsx({
        content: "text",
        link: "https://google.com",
        annotations: {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          code: false,
          color: "default",
        },
      })
    ).toEqual(<a href="https://google.com">text</a>);
  });
});
