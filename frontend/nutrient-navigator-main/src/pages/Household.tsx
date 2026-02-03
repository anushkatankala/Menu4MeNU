import { useState, useEffect } from "react";
import { Users, Plus, Package, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  getUserHousehold,
  getHouseholdInventory,
  addInventoryItem,
  deleteInventoryItem,
  getHouseholdNeededItems,
  addNeededItem,
  deleteNeededItem,
  type HouseholdInventoryItem,
  type HouseholdNeededItem,
} from "@/services/api";
import { searchPrices, getMockPrices, type PriceResult } from "@/services/api";

interface HouseholdProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const categories = ["All", "Produce", "Dairy", "Meat", "Pantry", "Bakery", "Frozen"];

const Household = ({ isDark, toggleDarkMode }: HouseholdProps) => {
  const { user, profile } = useAuth();
  
  // State
  const [householdId, setHouseholdId] = useState<number | null>(null);
  const [householdName, setHouseholdName] = useState<string>("My Household");
  const [inventory, setInventory] = useState<HouseholdInventoryItem[]>([]);
  const [neededItems, setNeededItems] = useState<HouseholdNeededItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Form state
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newCategory, setNewCategory] = useState("Pantry");
  const [newNeeded, setNewNeeded] = useState("");
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [isAddingNeeded, setIsAddingNeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // price search state
  const [priceSearchQuery, setPriceSearchQuery] = useState("");
  const [priceSearchResults, setPriceSearchResults] = useState<PriceResult[]>([]);
  const [isSearchingPrices, setIsSearchingPrices] = useState(false);
  const [priceSearchError, setPriceSearchError] = useState<string | null>(null);

const handlePriceSearch = async () => {
  if (!priceSearchQuery.trim()) return;

  try {
    setIsSearchingPrices(true);
    setPriceSearchError(null);

    // CALL THE REAL SCRAPER ONLY
    const results = await searchPrices(priceSearchQuery);
    
    if (results.length === 0) {
      setPriceSearchError("No real-time prices found for this item.");
    }
    
    setPriceSearchResults(results);
  } catch (error) {
    setPriceSearchError("Could not connect to the Walmart scraper.");
    setPriceSearchResults([]);
  } finally {
    setIsSearchingPrices(false);
  }
};

  // Fetch household data
  useEffect(() => {
    const fetchHouseholdData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get household ID
        const household = await getUserHousehold(user.id);
        setHouseholdId(household.id);
        setHouseholdName(household.name);

        // Fetch inventory and needed items
        const [inventoryData, neededData] = await Promise.all([
          getHouseholdInventory(household.id),
          getHouseholdNeededItems(household.id),
        ]);

        setInventory(inventoryData);
        setNeededItems(neededData);
      } catch (err) {
        console.error("Failed to fetch household data:", err);
        setError("Failed to load household data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHouseholdData();
  }, [user]);

  // Filter inventory by category
  const filteredInventory = selectedCategory === "All"
    ? inventory
    : inventory.filter(item => item.category === selectedCategory);

  // Add inventory item
  const handleAddItem = async () => {
    if (!newItem.trim() || !householdId || !user) return;

    try {
      setIsAddingInventory(true);
      await addInventoryItem(
        householdId,
        newItem.trim(),
        newQuantity || "1",
        newCategory,
        user.id
      );

      // Refresh inventory
      const updatedInventory = await getHouseholdInventory(householdId);
      setInventory(updatedInventory);

      // Clear form
      setNewItem("");
      setNewQuantity("");
      setNewCategory("Pantry");
    } catch (err) {
      console.error("Failed to add inventory item:", err);
      alert("Failed to add item. Please try again.");
    } finally {
      setIsAddingInventory(false);
    }
  };

  // Remove inventory item
  const handleRemoveItem = async (itemId: number) => {
    if (!householdId) return;

    try {
      await deleteInventoryItem(itemId);

      // Refresh inventory
      const updatedInventory = await getHouseholdInventory(householdId);
      setInventory(updatedInventory);
    } catch (err) {
      console.error("Failed to delete inventory item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  // Add needed item
  const handleAddNeededItem = async () => {
    if (!newNeeded.trim() || !householdId || !user) return;

    try {
      setIsAddingNeeded(true);
      await addNeededItem(householdId, newNeeded.trim(), user.id);

      // Refresh needed items
      const updatedNeeded = await getHouseholdNeededItems(householdId);
      setNeededItems(updatedNeeded);

      // Clear form
      setNewNeeded("");
    } catch (err) {
      console.error("Failed to add needed item:", err);
      alert("Failed to add needed item. Please try again.");
    } finally {
      setIsAddingNeeded(false);
    }
  };

  // Remove needed item
  const handleRemoveNeededItem = async (itemId: number) => {
    if (!householdId) return;

    try {
      await deleteNeededItem(itemId);

      // Refresh needed items
      const updatedNeeded = await getHouseholdNeededItems(householdId);
      setNeededItems(updatedNeeded);
    } catch (err) {
      console.error("Failed to delete needed item:", err);
      alert("Failed to delete needed item. Please try again.");
    }
  };

  // Move needed item to inventory
  const handleMoveToInventory = async (item: HouseholdNeededItem) => {
    if (!householdId || !user) return;

    try {
      // Add to inventory
      await addInventoryItem(householdId, item.name, "1", "Pantry", user.id);
      
      // Remove from needed
      await deleteNeededItem(item.id);

      // Refresh both lists
      const [updatedInventory, updatedNeeded] = await Promise.all([
        getHouseholdInventory(householdId),
        getHouseholdNeededItems(householdId),
      ]);

      setInventory(updatedInventory);
      setNeededItems(updatedNeeded);
    } catch (err) {
      console.error("Failed to move item:", err);
      alert("Failed to move item. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading household...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Household</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

      <div className="min-h-screen bg-background mt-20 py-8 md:py-12">
        <div className="container mx-auto px-4">

          {/* Household Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-card rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-sage" />
                  <span className="font-display text-lg font-semibold text-foreground">
                    {householdName}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                  <span className="text-sm text-muted-foreground">
                    Logged in as: {profile?.username || profile?.first_name || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
            
            {/* Inventory Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-sage" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Household Inventory
                  </h2>
                </div>

                {/* Add Item Form */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Item name..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <Input
                    placeholder="Quantity"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-24"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  >
                    {categories.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Button onClick={handleAddItem} disabled={isAddingInventory}>
                    {isAddingInventory ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Inventory List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredInventory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No items in {selectedCategory === "All" ? "inventory" : selectedCategory}
                    </p>
                  ) : (
                    filteredInventory.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-foreground">{item.name}</span>
                          <span className="text-muted-foreground"> - {item.quantity}</span>
                          <span className="text-xs text-muted-foreground ml-2">({item.category})</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Needed Items Section */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Shopping List
                </h2>
                
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="New item..."
                    value={newNeeded}
                    onChange={(e) => setNewNeeded(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNeededItem()}
                  />
                  <Button onClick={handleAddNeededItem} disabled={isAddingNeeded}>
                    {isAddingNeeded ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  {neededItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No items needed
                    </p>
                  ) : (
                    neededItems.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-muted p-3 rounded-lg"
                      >
                        <span className="text-foreground">{item.name}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveToInventory(item)}
                          >
                            Got It
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveNeededItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-semibold text-foreground">{inventory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shopping List:</span>
                  <span className="font-semibold text-foreground">{neededItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categories:</span>
                  <span className="font-semibold text-foreground">
                    {new Set(inventory.map(i => i.category)).size}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Price Search
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                Compare prices across stores in Ottawa
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search item..."
                  value={priceSearchQuery}
                  onChange={(e) => setPriceSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePriceSearch()}
                  disabled={isSearchingPrices}
                />
                <Button 
                  onClick={handlePriceSearch}
                  disabled={isSearchingPrices || !priceSearchQuery.trim()}
                >
                  {isSearchingPrices ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>

              {priceSearchError && (
                <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-600 dark:text-yellow-400">
                  {priceSearchError}
                </div>
              )}

              {/* Added optional chaining (?.length) here for safety */}
              {(priceSearchResults?.length ?? 0) > 0 ? (
                <div className="space-y-2">
                  {priceSearchResults.map((result, i) => (
                    <div 
                      key={i} 
                      className={`bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors ${
                        result.savings === undefined ? 'border-2 border-green-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-foreground">
                          {result.logo} {result.store}
                        </span>
                        <span className="font-bold text-primary">
                          ${typeof result.price === 'number' ? result.price.toFixed(2) : result.price}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.unit} • {result.distance}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isSearchingPrices 
                    ? "Searching..." 
                    : "Search for items to compare prices"}
                </p>
              )}
            </div>
          </div> {/* End Stats Sidebar */}
        </div> {/* End Main Content Grid */}
      </div> {/* End Container */}
    </div> {/* End Min-h-screen Wrapper */}

    <Footer />
  </>
);
};

export default Household;