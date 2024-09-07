import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function Introduction() {
  return (
    <section
      className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20"
      data-title="Hi there!"
      data-intro="Welcome to the Developer Sandbox 👋"
      data-step="1"
    >
      <Alert className="max-w-[300px] md:max-w-[600px] mb-[10px] bg-[#FF5733] text-white">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle className="text-black">Warning: Outdated</AlertTitle>
        <AlertDescription>
          The Developer Sandbox is currently outdated. This is because it relies
          on our React SDK, which is not yet updated to our latest protocol
          release. This will be fixed very soon.
        </AlertDescription>
      </Alert>
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
        Developer Sandbox
      </h1>
      <span
        className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl"
        data-br=":rgm:"
        data-brr="1"
        style={{
          display: "inline-block",
          verticalAlign: "top",
          textDecoration: "inherit",
          maxWidth: "570px",
        }}
      >
        Learn the React SDK by playing around with the most common actions.
      </span>
    </section>
  );
}
