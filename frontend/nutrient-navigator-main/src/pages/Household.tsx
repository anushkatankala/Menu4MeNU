import { useState } from "react";
import { Users, Plus, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  category: string;
}

interface PriceResult {
  store: string;
  price: number;
  unit: string;
  distance?: string;
  savings?: number;
  logo: string;
}

const members: HouseholdMember[] = [
  { id: "1", name: "You", avatar: "👤" },
  { id: "2", name: "Alex", avatar: "🧑" },
  { id: "3", name: "Jamie", avatar: "👩" },
];

const initialInventory: InventoryItem[] = [
  { id: "1", name: "Milk", quantity: "1 gallon", addedBy: "You", category: "Dairy" },
  { id: "2", name: "Eggs", quantity: "12 count", addedBy: "Alex", category: "Dairy" },
  { id: "3", name: "Bread", quantity: "1 loaf", addedBy: "Jamie", category: "Bakery" },
  { id: "4", name: "Chicken Breast", quantity: "2 lbs", addedBy: "You", category: "Meat" },
  { id: "5", name: "Spinach", quantity: "1 bag", addedBy: "Alex", category: "Produce" },
];

const categories = ["All", "Produce", "Dairy", "Meat", "Pantry", "Bakery", "Frozen"];

const samplePrices: Record<string, PriceResult[]> = {
  "tomatoes": [
    { store: "Farmboy", price: 2.99, unit: "kg", distance: "0.8 km", logo: "🏪" },
    { store: "FreshCo", price: 3.49, unit: "kg", distance: "1.2 km", logo: "🥬" },
  ],
  "olive oil": [
    { store: "Costco", price: 12.99, unit: "1L", distance: "2.5 mi", logo: "📦" },
    { store: "Farmboy", price: 6.99, unit: "500ml", distance: "0.8 mi", logo: "🏪" },
  ]
};

const Household = ({ isDark, toggleDarkMode }: Householdprops) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [neededItems, setNeededItems] = useState<string[]>(["Butter", "Onions", "Garlic"]);
  const [newNeeded, setNewNeeded] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [priceSearchQuery, setPriceSearchQuery] = useState("");
  const [priceSearchResults, setPriceSearchResults] = useState<PriceResult[]>([]);
  const [hasPriceSearched, setHasPriceSearched] = useState(false);

  const filteredInventory = selectedCategory === "All"
    ? inventory
    : inventory.filter(item => item.category === selectedCategory);

  const addItem = () => {
    if (newItem.trim()) {
      setInventory([...inventory, {
        id: Date.now().toString(),
        name: newItem,
        quantity: newQuantity || "1",
        addedBy: "You",
        category: "Pantry"
      }]);
      setNewItem("");
      setNewQuantity("");
    }
  };

  const removeItem = (id: string) => setInventory(inventory.filter(i => i.id !== id));

  const addNeededItem = () => {
    if (newNeeded.trim() && !neededItems.includes(newNeeded.trim())) {
      setNeededItems([...neededItems, newNeeded.trim()]);
      setNewNeeded("");
    }
  };

  const removeNeededItem = (item: string) => setNeededItems(neededItems.filter(i => i !== item));

  const moveToInventory = (item: string) => {
    setInventory([...inventory, {
      id: Date.now().toString(),
      name: item,
      quantity: "1",
      addedBy: "You",
      category: "Pantry"
    }]);
    removeNeededItem(item);
  };

  const handlePriceSearch = () => {
    const query = priceSearchQuery.toLowerCase();
    if (samplePrices[query]) {
      setPriceSearchResults(samplePrices[query]);
    } else {
      setPriceSearchResults([
        { store: "Local Market", price: 3.99, unit: "each", distance: "0.3 km", logo: "🏬" },
      ]);
    }
    setHasPriceSearched(true);
  };

  return (
    <>
      <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

      <div className="min-h-screen bg-background mt-20 py-8 md:py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">

          {/* Household Members */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-sage" />
                <span className="font-display text-sm font-semibold text-foreground">Household Members</span>
              </div>
              <div className="flex items-center gap-2">
                {members.map(m => (
                  <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                    <span>{m.avatar}</span>
                    <span className="font-body text-sm text-foreground">{m.name}</span>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={()=>setInviteOpen(true)}>
                  <Plus className="h-4 w-4 mr-1"/>Invite
                </Button>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-sage" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Household Inventory</h2>
                </div>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Item name..."
                    value={newItem}
                    onChange={(e)=>setNewItem(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Quantity"
                    value={newQuantity}
                    onChange={(e)=>setNewQuantity(e.target.value)}
                    className="w-24"
                  />
                  <Button onClick={addItem}>Add</Button>
                </div>

                <div className="space-y-2">
                  {filteredInventory.map(item => (
                    <div key={item.id} className="flex justify-between bg-muted p-2 rounded">
                      <div>
                        <span className="font-semibold">{item.name}</span> - {item.quantity} ({item.category})
                      </div>
                      <Button variant="ghost" size="sm" onClick={()=>removeItem(item.id)}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needed Items */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold text-foreground mb-2">Needed Items</h2>
                <div className="flex gap-2 mb-4">
                  <Input placeholder="New item..." value={newNeeded} onChange={(e)=>setNewNeeded(e.target.value)} className="flex-1"/>
                  <Button onClick={addNeededItem}>Add</Button>
                </div>
                <div className="space-y-2">
                  {neededItems.map(item => (
                    <div key={item} className="flex justify-between bg-muted p-2 rounded">
                      <span>{item}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={()=>moveToInventory(item)}>Move</Button>
                        <Button size="sm" variant="ghost" onClick={()=>removeNeededItem(item)}><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Search */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold text-foreground mb-2">Price Search</h2>
                <div className="flex gap-2 mb-4">
                  <Input placeholder="Item..." value={priceSearchQuery} onChange={(e)=>setPriceSearchQuery(e.target.value)} />
                  <Button onClick={handlePriceSearch}>Search</Button>
                </div>
                {hasPriceSearched && (
                  <div className="space-y-2">
                    {priceSearchResults.map((p,i)=>(
                      <div key={i} className="flex justify-between bg-muted p-2 rounded">
                        <span>{p.logo} {p.store} - ${p.price} ({p.unit})</span>
                        {p.savings && <span className="text-green-600">Save ${p.savings}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>Enter the email of the person you want to invite.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Email..."
              value={inviteEmail}
              onChange={(e)=>setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={()=>{alert(`Invite sent to ${inviteEmail}`); setInviteEmail(""); setInviteOpen(false);}}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Household;
