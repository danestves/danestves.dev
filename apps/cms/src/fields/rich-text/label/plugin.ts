const withLargeBody = (incomingEditor: any) => {
  const editor = incomingEditor;
  const { shouldBreakOutOnEnter } = editor;

  editor.shouldBreakOutOnEnter = (element: Record<string, unknown>) =>
    element.type === "label" ? true : shouldBreakOutOnEnter(element);

  return editor;
};

export default withLargeBody;
