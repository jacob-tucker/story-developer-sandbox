import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStory } from "@/lib/context/AppContext";

function stringifyData(data: any) {
  console.log(data);
  return JSON.stringify(
    data,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
}

export function ConsoleLog() {
  const { transactions, txLoading } = useStory();
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className="w-[150px] bottom-[0px] right-[50px] fixed"
        data-title="Console Log"
        data-intro="On each step, you'll need data from a previous step. You can find all that information, including transaction data, in the console log."
        data-step="4"
      >
        <Button
          variant="outline"
          className="rounded-bl-none rounded-br-none gap-[10px]"
        >
          <Icon icon="tabler:arrow-up" />
          Open log
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Console log</SheetTitle>
          <SheetDescription>
            View all of your transactions and their results.
          </SheetDescription>
        </SheetHeader>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Tx Hash</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {txLoading ? (
              <TableRow>
                <TableCell className="italic">Pending transaction...</TableCell>
              </TableRow>
            ) : transactions.length == 0 ? (
              <TableRow>
                <TableCell className="italic">
                  There are no transactions yet.
                </TableCell>
              </TableRow>
            ) : null}
            {transactions
              .slice()
              .reverse()
              .map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{transactions.length - 1 - index}</TableCell>
                  <TableCell className="font-medium">{tx.action}</TableCell>
                  <TableCell className="flex items-center gap-[5px]">
                    {tx.txHash ? (
                      <>
                        {tx.txHash}{" "}
                        <a
                          href={`https://aeneid.storyscan.xyz/tx/${tx.txHash}`}
                          target="_blank"
                          style={{ color: "rgb(255, 40, 37)" }}
                        >
                          <Icon icon="tabler:link" />
                        </a>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {tx.action == "Register IPA" ? (
                      <div className="flex items-center gap-[5px]">
                        IPA{" "}
                        <a
                          href={`https://aeneid.explorer.story.foundation/ipa/${tx.data["ipId"]}`}
                          target="_blank"
                          style={{ color: "rgb(255, 40, 37)" }}
                        >
                          <Icon icon="tabler:link" />
                        </a>
                      </div>
                    ) : (
                      stringifyData(tx.data)
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
