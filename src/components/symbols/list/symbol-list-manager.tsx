import { Button } from "@/components/ui/button";
import { generateId } from "@/utils/generate-id";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSymbolListsStore } from "@/lib/zustand/stores/symbol-list-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SymbolListManager() {
  const { lists, activeListId, setActiveList, addList, removeList } =
    useSymbolListsStore();

  const [openCreateListModal, setOpenCreateListModal] = useState(false);
  const [listName, setListName] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedListId, setSelectedListId] = useState<string>(
    activeListId ?? "",
  );

  const handleChangeList = (value: string) => {
    setSelectedListId(value);
    setActiveList(value);
  };

  const handleCreateList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = listName.trim();

    if (!trimmed) {
      setFormError("The list name cannot be empty.");
      return;
    }

    const createdList = addList(trimmed);
    setActiveList(createdList);
    setListName("");
    setFormError("");
    setOpenCreateListModal(false);
  };

  const handleRemoveList = () => {
    if (!activeListId) {
      toast.error("No active list selected to remove.");

      return;
    }

    removeList(activeListId);
    setActiveList(null);
  };

  useEffect(() => {
    if (selectedListId === activeListId) return;

    setSelectedListId(activeListId ?? "");
  }, [selectedListId, activeListId]);

  return (
    <div className="w-full flex gap-2">
      <div className="flex w-[calc(100%-36px)]">
        <Select value={selectedListId} onValueChange={handleChangeList}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a list" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {lists?.map(({ id, name }) => (
                <SelectItem key={id ?? generateId()} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Dialog
          open={openCreateListModal}
          onOpenChange={(value) => {
            setOpenCreateListModal(value);

            if (!value) {
              setListName("");
              setFormError("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button aria-label="Open modal add list" className="px-2.5">
              <PlusIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New List</DialogTitle>
              <DialogDescription>
                Give a name to your new list.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateList} className="w-full flex">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="list" className="sr-only">
                  List
                </Label>
                <Input
                  id="list"
                  value={listName}
                  onChange={(e) => {
                    setListName(e.target.value);
                    if (formError) setFormError("");
                  }}
                  placeholder="e.g. List A"
                  min={1}
                  max={50}
                  className={formError ? "border-red-500" : ""}
                />
                {formError && (
                  <span className="text-sm text-red-500">{formError}</span>
                )}
                <Button type="submit">Add List</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Button
          aria-label="Remove selected list"
          className="px-2.5 bg-red-500 hover:bg-red-600"
          onClick={handleRemoveList}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}
