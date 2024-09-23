import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export function OutdatedAlert() {
  return (
    <Alert className="max-w-[300px] md:max-w-[600px] mb-[10px] bg-[#FF5733] text-white">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle className="text-black">Warning: Outdated</AlertTitle>
      <AlertDescription>
        The Developer Sandbox is currently outdated. This is because it relies
        on our React SDK, which is not yet updated to our latest protocol
        release. This will be fixed very soon.
      </AlertDescription>
    </Alert>
  );
}
