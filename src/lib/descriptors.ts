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

// SCA Coffee Taster's Flavor Wheel — 9 families, center → subcategory → outer ring
export const DESCRIPTOR_FAMILIES: DescriptorFamilyDef[] = [
  {
    key: "floral",
    label: "Floral",
    color: "#D946EF",
    chipClasses: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    items: [
      { category: "Floral", descriptors: ["Chamomile", "Rose", "Jasmine"] },
      { category: "Black Tea",  descriptors: ["Black Tea"] },
    ],
  },
  // key "fruit" kept for backward-compat with stored data
  {
    key: "fruit",
    label: "Fruity",
    color: "#EF4444",
    chipClasses: "bg-rose-100 text-rose-700 border-rose-200",
    items: [
      { category: "Berry",        descriptors: ["Blackberry", "Raspberry", "Blueberry", "Strawberry"] },
      { category: "Dried Fruit",  descriptors: ["Raisin", "Prune", "Coconut"] },
      { category: "Other Fruit",  descriptors: ["Cherry", "Pomegranate", "Pineapple", "Grape", "Apple", "Peach", "Pear"] },
      { category: "Citrus Fruit", descriptors: ["Grapefruit", "Orange", "Lemon", "Lime"] },
    ],
  },
  {
    key: "sour",
    label: "Sour / Fermented",
    color: "#84CC16",
    chipClasses: "bg-lime-100 text-lime-700 border-lime-200",
    items: [
      { category: "Sour",              descriptors: ["Sour Aromatics", "Acetic Acid", "Butyric Acid", "Isovaleric Acid", "Citric Acid", "Malic Acid"] },
      { category: "Alcohol/Fermented", descriptors: ["Winey", "Whiskey", "Fermented", "Overripe"] },
    ],
  },
  // key "earthy" kept for backward-compat
  {
    key: "earthy",
    label: "Green / Vegetative",
    color: "#22C55E",
    chipClasses: "bg-green-100 text-green-700 border-green-200",
    items: [
      { category: "Olive Oil",          descriptors: ["Olive Oil"] },
      { category: "Raw",                descriptors: ["Under-ripe", "Peapod", "Fresh"] },
      { category: "Green/Vegetative",   descriptors: ["Dark Green", "Vegetative", "Hay-like", "Herb-like"] },
      { category: "Beany",              descriptors: ["Beany"] },
    ],
  },
  {
    key: "other",
    label: "Other",
    color: "#0EA5E9",
    chipClasses: "bg-sky-100 text-sky-700 border-sky-200",
    items: [
      { category: "Papery/Musty", descriptors: ["Stale", "Cardboard", "Papery", "Woody", "Moldy/Damp", "Musty/Dusty", "Musty/Earthy"] },
      { category: "Chemical",     descriptors: ["Bitter", "Salty", "Medicinal", "Petroleum", "Rubber", "Skunky", "Phenolic", "Animalic", "Meaty/Brothy"] },
    ],
  },
  {
    key: "roasted",
    label: "Roasted",
    color: "#92400E",
    chipClasses: "bg-amber-100 text-amber-900 border-amber-300",
    items: [
      { category: "Tobacco", descriptors: ["Pipe Tobacco", "Tobacco"] },
      { category: "Burnt",   descriptors: ["Acrid", "Ashy", "Smoky"] },
      { category: "Cereal",  descriptors: ["Brown Roast", "Grain", "Malt"] },
    ],
  },
  // key "spice" kept for backward-compat
  {
    key: "spice",
    label: "Spices",
    color: "#B91C1C",
    chipClasses: "bg-red-100 text-red-700 border-red-200",
    items: [
      { category: "Pungent",     descriptors: ["Pepper"] },
      { category: "Brown Spice", descriptors: ["Anise", "Nutmeg", "Cinnamon", "Clove"] },
    ],
  },
  {
    key: "nutty",
    label: "Nutty / Cocoa",
    color: "#D97706",
    chipClasses: "bg-yellow-100 text-yellow-800 border-yellow-200",
    items: [
      { category: "Nutty", descriptors: ["Peanuts", "Hazelnut", "Almond"] },
      { category: "Cocoa", descriptors: ["Chocolate", "Dark Chocolate", "Molasses", "Maple Syrup", "Caramelized", "Honey"] },
    ],
  },
  {
    key: "sweet",
    label: "Sweet",
    color: "#F97316",
    chipClasses: "bg-orange-100 text-orange-700 border-orange-200",
    items: [
      { category: "Brown Sugar",    descriptors: ["Brown Sugar"] },
      { category: "Vanilla",        descriptors: ["Vanilla", "Vanillin"] },
      { category: "Overall Sweet",  descriptors: ["Overall Sweet", "Sweet Aromatics"] },
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
