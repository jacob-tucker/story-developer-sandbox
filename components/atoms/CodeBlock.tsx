import { CopyBlock, github } from "react-code-blocks";
// googlecode
// github

export function Code({ code }: { code: string }) {
  return (
    <CopyBlock
      text={code.trim()}
      language={"javascript"}
      showLineNumbers
      theme={github}
      wrapLongLines
    />
  );
}
