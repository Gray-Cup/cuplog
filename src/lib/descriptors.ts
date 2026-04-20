export type DescriptorTag = {
  id: string;
  label: string;
  family: string;
  attrKey?: string;
};

export type StoredDescriptor = {
  label: string;
  family: string;
  attrKey?: string;
};

export type DescriptorFamilyDef = {
  key: string;
  label: string;
  color: string;
  chipClasses: string;
  items: { category: string; descriptors: string[] }[];
};

export const DESCRIPTOR_FAMILIES: DescriptorFamilyDef[] = [
  {
    key: "fruit",
    label: "Fruit",
    color: "#F43F5E",
    chipClasses: "bg-rose-100 text-rose-700 border-rose-200",
    items: [
      { category: "Berry", descriptors: ["Blueberry", "Strawberry", "Raspberry", "Blackberry", "Cherry", "Cranberry"] },
      { category: "Stone Fruit", descriptors: ["Peach", "Apricot", "Plum", "Nectarine", "Mango"] },
      { category: "Tropical", descriptors: ["Pineapple", "Papaya", "Passion Fruit", "Lychee", "Guava"] },
      { category: "Dried Fruit", descriptors: ["Raisin", "Date", "Fig", "Prune"] },
    ],
  },
  {
    key: "citrus",
    label: "Citrus",
    color: "#F59E0B",
    chipClasses: "bg-amber-100 text-amber-700 border-amber-200",
    items: [
      { category: "Fresh", descriptors: ["Lemon", "Orange", "Grapefruit", "Lime", "Bergamot", "Yuzu"] },
      { category: "Zest", descriptors: ["Lemon Zest", "Orange Peel", "Mandarin", "Clementine"] },
    ],
  },
  {
    key: "floral",
    label: "Floral",
    color: "#8B5CF6",
    chipClasses: "bg-violet-100 text-violet-700 border-violet-200",
    items: [
      { category: "Flowers", descriptors: ["Jasmine", "Rose", "Lavender", "Elderflower", "Hibiscus", "Orange Blossom"] },
      { category: "Herbal", descriptors: ["Chamomile", "Mint", "Basil", "Lemongrass"] },
    ],
  },
  {
    key: "sweet",
    label: "Sweet",
    color: "#F97316",
    chipClasses: "bg-orange-100 text-orange-700 border-orange-200",
    items: [
      { category: "Caramelized", descriptors: ["Caramel", "Brown Sugar", "Toffee", "Molasses", "Butterscotch"] },
      { category: "Chocolate", descriptors: ["Dark Chocolate", "Milk Chocolate", "Cocoa", "Bittersweet"] },
      { category: "Other", descriptors: ["Vanilla", "Honey", "Maple Syrup", "Candy", "Nougat"] },
    ],
  },
  {
    key: "nutty",
    label: "Nutty",
    color: "#D97706",
    chipClasses: "bg-yellow-100 text-yellow-800 border-yellow-300",
    items: [
      { category: "Nuts", descriptors: ["Almond", "Hazelnut", "Walnut", "Peanut", "Pecan", "Macadamia"] },
      { category: "Grain", descriptors: ["Toasted Grain", "Malt", "Biscuit", "Bread", "Graham Cracker"] },
    ],
  },
  {
    key: "earthy",
    label: "Earthy",
    color: "#22C55E",
    chipClasses: "bg-green-100 text-green-700 border-green-200",
    items: [
      { category: "Earth", descriptors: ["Soil", "Tobacco", "Leather", "Wet Stone", "Cedar"] },
      { category: "Green", descriptors: ["Grass", "Green Tea", "Vegetal", "Herb", "Eucalyptus"] },
    ],
  },
  {
    key: "spice",
    label: "Spice",
    color: "#EF4444",
    chipClasses: "bg-red-100 text-red-700 border-red-200",
    items: [
      { category: "Warm", descriptors: ["Cinnamon", "Clove", "Cardamom", "Pepper", "Nutmeg", "Allspice"] },
      { category: "Other", descriptors: ["Anise", "Licorice", "Ginger"] },
    ],
  },
  {
    key: "roasted",
    label: "Roasted",
    color: "#78350F",
    chipClasses: "bg-amber-100 text-amber-900 border-amber-400",
    items: [
      { category: "Roast", descriptors: ["Smoky", "Ash", "Charcoal", "Roasted Almond", "Dark Roast"] },
    ],
  },
];

export function getFamilyDef(key: string): DescriptorFamilyDef | undefined {
  return DESCRIPTOR_FAMILIES.find((f) => f.key === key);
}

export function chipClasses(family: string): string {
  return getFamilyDef(family)?.chipClasses ?? "bg-neutral-100 text-neutral-600 border-neutral-200";
}

export function familyColor(family: string): string {
  return getFamilyDef(family)?.color ?? "#9ca3af";
}

export function computeFamilyCounts(descriptors: { family: string }[]): Record<string, number> {
  return descriptors.reduce<Record<string, number>>((acc, d) => {
    acc[d.family] = (acc[d.family] ?? 0) + 1;
    return acc;
  }, {});
}

export function parseStoredDescriptors(raw: StoredDescriptor[]): DescriptorTag[] {
  return raw.map((d, i) => ({ ...d, id: `stored-${i}-${d.label}`, attrKey: d.attrKey }));
}
