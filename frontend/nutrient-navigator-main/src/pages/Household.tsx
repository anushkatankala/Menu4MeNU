import { useState } from "react";
import { Users, Plus, Package, AlertTriangle, Check, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";


interface Householdprops {
  isDark: boolean;
  toggleDarkMode: () => void;
}

interface HouseholdMember {
  id: string;
  name: string;
  avatar: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  addedBy: string;
  expiresIn?: number;
  category: string;
}

const members: HouseholdMember[] = [
  { id: "1", name: "You", avatar: "👤" },
  { id: "2", name: "Alex", avatar: "🧑" },
  { id: "3", name: "Jamie", avatar: "👩" },
];

const initialInventory: InventoryItem[] = [
  { id: "1", name: "Milk", quantity: "1 gallon", addedBy: "You", expiresIn: 3, category: "Dairy" },
  { id: "2", name: "Eggs", quantity: "12 count", addedBy: "Alex", expiresIn: 10, category: "Dairy" },
  { id: "3", name: "Bread", quantity: "1 loaf", addedBy: "Jamie", expiresIn: 5, category: "Bakery" },
  { id: "4", name: "Chicken Breast", quantity: "2 lbs", addedBy: "You", expiresIn: 2, category: "Meat" },
  { id: "5", name: "Spinach", quantity: "1 bag", addedBy: "Alex", expiresIn: 4, category: "Produce" },
  { id: "6", name: "Pasta", quantity: "2 boxes", addedBy: "Jamie", category: "Pantry" },
  { id: "7", name: "Olive Oil", quantity: "1 bottle", addedBy: "You", category: "Pantry" },
  { id: "8", name: "Tomatoes", quantity: "6 count", addedBy: "Alex", expiresIn: 5, category: "Produce" },
];

const categories = ["All", "Produce", "Dairy", "Meat", "Pantry", "Bakery", "Frozen"];

const Household = ({isDark, toggleDarkMode}: Householdprops) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [neededItems, setNeededItems] = useState<string[]>(["Butter", "Onions", "Garlic"]);
  const [newNeeded, setNewNeeded] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");


  const filteredInventory = selectedCategory === "All"
    ? inventory
    : inventory.filter(item => item.category === selectedCategory);

  const addItem = () => {
    if (newItem.trim()) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        name: newItem,
        quantity: newQuantity || "1",
        addedBy: "You",
        category: "Pantry"
      };
      setInventory([...inventory, item]);
      setNewItem("");
      setNewQuantity("");
    }
  };

  const removeItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const addNeededItem = () => {
    if (newNeeded.trim() && !neededItems.includes(newNeeded.trim())) {
      setNeededItems([...neededItems, newNeeded.trim()]);
      setNewNeeded("");
    }
  };

  const removeNeededItem = (item: string) => {
    setNeededItems(neededItems.filter(i => i !== item));
  };

  const moveToInventory = (item: string) => {
    const newInventoryItem: InventoryItem = {
      id: Date.now().toString(),
      name: item,
      quantity: "1",
      addedBy: "You",
      category: "Pantry"
    };
    setInventory([...inventory, newInventoryItem]);
    removeNeededItem(item);
  };

  return (
    <>
        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
        <div className="min-h-screen bg-background mt-20 py-8 md:py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Shared Households
            </h1>
            <p className="font-body text-muted-foreground">
                Track shared ingredients, reduce duplicate purchases, and cut food waste together.
            </p>
            </div>

            {/* Members */}
            <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-sage" />
                    <span className="font-display text-sm font-semibold text-foreground">Household Members</span>
                </div>
                <div className="flex items-center gap-2">
                    {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
                        title={member.name}
                    >
                        <span>{member.avatar}</span>
                        <span className="font-body text-sm text-foreground">{member.name}</span>
                    </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Invite
                    </Button>
                </div>
                </div>
            </div>
            </div>

            <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Inventory */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-sage" />
                    <h2 className="font-display text-lg font-semibold text-foreground">
                        Household Inventory
                    </h2>
                    </div>
                </div>

                {/* Add Item */}
                <div className="flex gap-2 mb-4">
                    <Input
                    placeholder="Item name..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1"
                    />
                    <Input
                    placeholder="Qty"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-24"
                    />
                    <Button onClick={addItem} variant="default" size="icon">
                    <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                        "px-3 py-1 rounded-full font-body text-xs whitespace-nowrap transition-all duration-300",
                        selectedCategory === category
                            ? "bg-sage text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-sage/20"
                        )}
                    >
                        {category}
                    </button>
                    ))}
                </div>

                {/* Inventory List */}
                <div className="space-y-2">
                    {filteredInventory.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all duration-300 group",
                        item.expiresIn && item.expiresIn <= 2
                            ? "bg-calm-red/10 border-calm-red/30"
                            : "bg-muted/30 border-border hover:border-sage/30"
                        )}
                    >
                        <div className="flex items-center gap-3">
                        <div>
                            <p className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                            {item.name}
                            {item.expiresIn && item.expiresIn <= 2 && (
                                <AlertTriangle className="h-3 w-3 text-calm-red" />
                            )}
                            </p>
                            <p className="font-body text-xs text-muted-foreground">
                            {item.quantity} • Added by {item.addedBy}
                            {item.expiresIn && (
                                <span className={cn(
                                "ml-2",
                                item.expiresIn <= 2 ? "text-calm-red" : ""
                                )}>
                                • Expires in {item.expiresIn} days
                                </span>
                            )}
                            </p>
                        </div>
                        </div>
                        <button
                        onClick={() => removeItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-calm-red transition-all"
                        >
                        <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Needed Items */}
            <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-calm-red" />
                    <h2 className="font-display text-lg font-semibold text-foreground">
                    Shopping List
                    </h2>
                </div>

                <div className="flex gap-2 mb-4">
                    <Input
                    placeholder="Add item..."
                    value={newNeeded}
                    onChange={(e) => setNewNeeded(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addNeededItem()}
                    className="flex-1"
                    />
                    <Button onClick={addNeededItem} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2">
                    {neededItems.map((item) => (
                    <div
                        key={item}
                        className="flex items-center justify-between p-3 bg-calm-red/10 rounded-lg border border-calm-red/20 group"
                    >
                        <span className="font-body text-sm text-foreground">{item}</span>
                        <div className="flex items-center gap-1">
                        <button
                            onClick={() => moveToInventory(item)}
                            className="p-1 text-sage hover:bg-sage/20 rounded transition-all"
                            title="Mark as bought"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => removeNeededItem(item)}
                            className="p-1 text-muted-foreground hover:text-calm-red transition-all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>

                {neededItems.length > 0 && (
                    <p className="font-body text-xs text-muted-foreground mt-4">
                    Click ✓ to mark as bought and add to inventory
                    </p>
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
        <Footer/>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Household Member</DialogTitle>
                    <DialogDescription>
                        Enter the email address of the person you want to invite.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    type="email"
                    placeholder="email@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                />

                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setInviteOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Invite sent to:", inviteEmail);
                            setInviteEmail("");
                            setInviteOpen(false);
                        }}
                        disabled={!inviteEmail}
                    >
                        Send Invite
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
};

export default Household;
