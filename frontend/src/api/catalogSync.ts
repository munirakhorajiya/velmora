import { VELMORA_CATALOG, type CatalogProduct, type CatalogColor } from './catalogData';
import { api } from './client';

const STORAGE_KEY = 'velmora_custom_catalog';
const DB_STORAGE_KEY = 'velmora_db_products_cache';
const SYNC_EVENT = 'velmora-catalog-updated';

export interface ApiCatalogProduct {
  id: number | string;
  name: string;
  price: string | number;
  current_price?: string | number;
  category?: number | { id?: number; name?: string };
  category_name?: string;
  gallery_images?: string[];
  display_image_url?: string;
  description?: string;
  material?: string;
  available_colours?: string;
  stock_quantity?: number;
}

/**
 * Converts a backend API product object into the rich CatalogProduct interface
 */
export function convertApiToCatalogProduct(apiP: ApiCatalogProduct): CatalogProduct {
  const catName =
    apiP.category_name ||
    (typeof apiP.category === 'object' && apiP.category?.name ? apiP.category.name : '') ||
    'Bags';

  const gallery: string[] =
    apiP.gallery_images && apiP.gallery_images.length > 0
      ? apiP.gallery_images
      : [apiP.display_image_url || '/media/editorial/cat_shoulder.jpg'];

  // 1. First check if there is an active custom modification saved for this product
  const customMap = getSavedCustomProducts();
  const customKey = String(apiP.id).toLowerCase();
  const customByName = apiP.name ? customMap[String(apiP.name).toLowerCase()] : undefined;
  const customMatch = customMap[customKey] || customByName;

  if (customMatch && customMatch.colors && customMatch.colors.length > 0) {
    const stockQty = apiP.stock_quantity ?? customMatch.stock_quantity ?? 0;
    return {
      id: String(apiP.id),
      name: apiP.name,
      category: catName,
      department: catName,
      price: parseFloat(String(apiP.current_price || apiP.price)) || (customMatch.price || 0),
      badge: stockQty === 0 ? 'Sold Out' : (stockQty <= 5 ? 'Low Stock' : 'New'),
      colors: customMatch.colors,
      description: apiP.description || customMatch.description || `The ${apiP.name} embodies sculptural elegance.`,
      features: customMatch.features || [
        'Handcrafted in limited editions from certified tannery leathers',
        'Signature gold-foil Velmora blind emboss',
        'Dual internal slip pockets with archival canvas lining',
        'Adjustable and detachable shoulder strap with solid brass buckles'
      ],
      dimensions: customMatch.dimensions || '26cm W x 17cm H x 8cm D',
      materials: apiP.material || customMatch.materials || 'Exterior: 100% French Calfskin. Interior: Cotton Canvas.',
      stock_quantity: stockQty
    };
  }

  // 2. Check if authentic VELMORA_CATALOG has this piece with its dedicated per-colour photo stacks
  const searchName = String(apiP.name).toLowerCase().trim();
  const searchId = String(apiP.id).toLowerCase().trim();
  const catalogMatch = VELMORA_CATALOG.find((cat) => {
    const fullName = `${cat.name} ${cat.variantTitle || ''}`.toLowerCase().trim();
    const vtitle = (cat.variantTitle || '').toLowerCase().trim();
    return (
      String(cat.id).toLowerCase() === searchId ||
      String(cat.id).toLowerCase() === `bag${searchId}` ||
      fullName === searchName ||
      (vtitle && searchName.includes(vtitle)) ||
      cat.name.toLowerCase() === searchName ||
      cat.name.toLowerCase().includes(searchName)
    );
  });

  if (catalogMatch && catalogMatch.colors && catalogMatch.colors.length > 0) {
    return {
      ...catalogMatch,
      id: String(apiP.id),
      name: apiP.name,
      price: parseFloat(String(apiP.current_price || apiP.price)) || catalogMatch.price,
      stock_quantity: apiP.stock_quantity !== undefined ? apiP.stock_quantity : catalogMatch.stock_quantity,
      description: apiP.description || catalogMatch.description,
      materials: apiP.material || catalogMatch.materials
    };
  }

  // 3. Fallback: Parse available_colours and partition gallery images intelligently per colour
  let colors: CatalogColor[] = [];
  if (apiP.available_colours) {
    const rawColours = String(apiP.available_colours)
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    colors = rawColours.map((cName: string, cIdx: number) => {
      let code = '#141414';
      const low = cName.toLowerCase();
      if (low.includes('brown') || low.includes('java') || low.includes('cocoa') || low.includes('hazel')) code = '#56382D';
      else if (low.includes('raffia') || low.includes('tan') || low.includes('dune') || low.includes('cheetah')) code = '#D2A26F';
      else if (low.includes('python') || low.includes('schist') || low.includes('grey') || low.includes('oat')) code = '#C5B29B';
      else if (low.includes('rose') || low.includes('pink') || low.includes('salsa')) code = '#D98993';
      else if (low.includes('blue') || low.includes('iris') || low.includes('petrol')) code = '#3A4E68';
      else if (low.includes('green') || low.includes('sage') || low.includes('forest')) code = '#5E6B54';
      else if (low.includes('white') || low.includes('milk') || low.includes('lemonade') || low.includes('offwhite')) code = '#F4F2EC';

      // Match images specifically belonging to this colour keyword
      const matchedImages = gallery.filter((img) => {
        const imgLow = img.toLowerCase();
        if (low.includes('black') && imgLow.includes('black')) return true;
        if ((low.includes('brown') || low.includes('java') || low.includes('cocoa') || low.includes('hazel') || low.includes('gingerbread')) &&
            (imgLow.includes('brown') || imgLow.includes('java') || imgLow.includes('cocoa') || imgLow.includes('hazel') || imgLow.includes('gingerbread'))) return true;
        if ((low.includes('green') || low.includes('sage')) && (imgLow.includes('green') || imgLow.includes('sage'))) return true;
        if ((low.includes('yellow') || low.includes('lemonade') || low.includes('sunlight') || low.includes('offwhite')) &&
            (imgLow.includes('yellow') || imgLow.includes('lemonade') || imgLow.includes('sunlight') || imgLow.includes('offwhite'))) return true;
        if ((low.includes('rose') || low.includes('pink')) && (imgLow.includes('rose') || imgLow.includes('pink'))) return true;
        if (low.includes('raffia') && imgLow.includes('raffia')) return true;
        if (low.includes('blue') && (imgLow.includes('blue') || imgLow.includes('iris'))) return true;
        return false;
      });

      let colorImages: string[];
      if (matchedImages.length > 0) {
        colorImages = matchedImages;
      } else if (rawColours.length > 1 && gallery.length >= rawColours.length) {
        const chunkSize = Math.ceil(gallery.length / rawColours.length);
        colorImages = gallery.slice(cIdx * chunkSize, (cIdx + 1) * chunkSize);
      } else {
        colorImages = gallery[cIdx] ? [gallery[cIdx]] : (gallery.length > 0 ? [gallery[0]] : []);
      }

      if (colorImages.length === 0 && gallery.length > 0) {
        colorImages = [gallery[0]];
      }

      return {
        name: cName,
        code,
        primary: colorImages[0] || '/media/editorial/cat_shoulder.jpg',
        alt: colorImages[1] || colorImages[0] || '/media/editorial/cat_shoulder.jpg',
        images: colorImages,
        stock: Math.max(1, Math.floor((apiP.stock_quantity || 1) / (rawColours.length || 1)))
      };
    });
  }

  if (colors.length === 0) {
    colors = [
      {
        name: 'Classic',
        code: '#141414',
        primary: gallery[0] || '/media/editorial/cat_shoulder.jpg',
        alt: gallery[1] || gallery[0] || '/media/editorial/cat_shoulder.jpg',
        images: gallery,
        stock: apiP.stock_quantity || 0
      }
    ];
  }

  const stockCount = apiP.stock_quantity || 0;
  return {
    id: String(apiP.id),
    name: apiP.name,
    category: catName,
    department: catName,
    price: parseFloat(String(apiP.current_price || apiP.price)) || 0,
    badge: stockCount === 0 ? 'Sold Out' : (stockCount <= 5 ? 'Low Stock' : 'New'),
    colors,
    description:
      apiP.description ||
      `The ${apiP.name} embodies sculptural elegance, handcrafted in limited numbers with signature solid brass hardware.`,
    features: [
      'Handcrafted in limited editions from certified tannery leathers',
      'Signature gold-foil Velmora blind emboss',
      'Dual internal slip pockets with archival canvas lining',
      'Adjustable and detachable shoulder strap with solid brass buckles'
    ],
    dimensions: '26cm W x 17cm H x 8cm D',
    materials: apiP.material || 'Exterior: 100% French Calfskin. Interior: Cotton Canvas. Hardware: Solid Brass.',
    stock_quantity: stockCount
  };
}

export async function syncWithBackendApi(): Promise<CatalogProduct[]> {
  try {
    const res = await api.get('/products/?page_size=200');
    const results = res.data.results || res.data || [];
    if (results.length > 0) {
      const converted = results.map(convertApiToCatalogProduct);
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(converted));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: converted }));
      return converted;
    }
  } catch (err) {
    console.warn('Backend API sync fallback:', err);
  }
  return [];
}

/**
 * Reads any modifications or custom additions saved in localStorage
 */
export function getSavedCustomProducts(): { [id: string]: Partial<CatalogProduct> } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse saved custom products from localStorage:', e);
    return {};
  }
}

/**
 * Reads cached DB products
 */
export function getCachedDbProducts(): CatalogProduct[] {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Returns the full merged catalog:
 * Combines VELMORA_CATALOG + live DB products + any modifications made in dashboard
 */
export function getMergedCatalog(): CatalogProduct[] {
  const customMap = getSavedCustomProducts();
  const dbProds = getCachedDbProducts();
  const catalogCopy: CatalogProduct[] = JSON.parse(JSON.stringify(VELMORA_CATALOG));

  // 1. Start with VELMORA_CATALOG
  const merged: CatalogProduct[] = [...catalogCopy];

  // 2. Add or overlay products from the database
  dbProds.forEach((dbP) => {
    const existingIdx = merged.findIndex(
      (m) =>
        String(m.id).toLowerCase() === String(dbP.id).toLowerCase() ||
        m.name.toLowerCase() === dbP.name.toLowerCase()
    );
    if (existingIdx !== -1) {
      merged[existingIdx] = {
        ...merged[existingIdx],
        ...dbP,
        colors: dbP.colors && dbP.colors.length > 0 ? dbP.colors : merged[existingIdx].colors
      };
    } else {
      merged.push(dbP);
    }
  });

  // 3. Overlay any active modifications saved in dashboard
  const finalMerged = merged.map((item) => {
    const key = String(item.id).toLowerCase();
    const update = customMap[key] || customMap[item.name.toLowerCase()];
    if (update) {
      return { ...item, ...update };
    }
    return item;
  });

  // 4. Add any newly created pieces from dashboard
  Object.keys(customMap).forEach((key) => {
    const item = customMap[key];
    if (item && item.id && !finalMerged.some((m) => String(m.id).toLowerCase() === String(item.id).toLowerCase())) {
      finalMerged.unshift(item as CatalogProduct);
    }
  });

  return finalMerged;
}

/**
 * Looks up a single product by numeric ID, string ID, slug, or name
 */
export function getProductByIdOrSlug(idOrSlug?: string): CatalogProduct {
  if (!idOrSlug) return VELMORA_CATALOG[0];

  const search = String(idOrSlug).toLowerCase().trim();
  const merged = getMergedCatalog();

  // 1. Exact ID match (e.g. "bag1", "1", "35", "mini-sling-black-raffia")
  let found = merged.find((p) => String(p.id).toLowerCase() === search);
  if (found) return found;

  // 2. Check numeric ID mapping (e.g. 1 -> bag1, 2 -> bag2, 3 -> bag3, etc.)
  if (/^\d+$/.test(search)) {
    const num = parseInt(search, 10);
    const bagMatch = merged.find((p) => String(p.id).toLowerCase() === `bag${num}`);
    if (bagMatch) return bagMatch;
    if (num > 0 && num <= merged.length) {
      return merged[num - 1];
    }
  }

  // 3. Name or slug match
  found = merged.find((p) => {
    const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullName = `${p.name} ${p.variantTitle || ''}`.toLowerCase().trim();
    const vtitle = (p.variantTitle || '').toLowerCase().trim();
    return (
      pSlug === search ||
      fullName === search ||
      (vtitle && search.includes(vtitle)) ||
      p.name.toLowerCase() === search ||
      p.name.toLowerCase().includes(search)
    );
  });

  return found || merged[0];
}

/**
 * Saves a product modification into localStorage and dispatches a broadcast event
 */
export function saveProductModification(
  productId: string | number,
  updates: Partial<CatalogProduct>
): void {
  try {
    const customMap = getSavedCustomProducts();
    const key = String(productId).toLowerCase();

    // Find base product if exists to keep unedited fields
    const base = getProductByIdOrSlug(String(productId));
    const mergedProduct: CatalogProduct = {
      ...base,
      ...updates,
      id: String(updates.id || base.id || productId),
      name: updates.name || base.name,
      price: updates.price !== undefined ? Number(updates.price) : base.price,
      colors: updates.colors && updates.colors.length > 0 ? updates.colors : base.colors,
      stock_quantity: updates.stock_quantity !== undefined ? updates.stock_quantity : base.stock_quantity,
    };

    customMap[key] = mergedProduct;
    if (mergedProduct.name) {
      customMap[mergedProduct.name.toLowerCase()] = mergedProduct;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customMap));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: mergedProduct }));
  } catch (e) {
    console.error('Failed to save product modification:', e);
  }
}

/**
 * Subscribes to catalog updates across tabs / components
 */
export function subscribeToCatalogUpdates(callback: (updated: CatalogProduct | CatalogProduct[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CatalogProduct | CatalogProduct[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };
  window.addEventListener(SYNC_EVENT, handler);
  return () => window.removeEventListener(SYNC_EVENT, handler);
}
