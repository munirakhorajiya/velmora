import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth-context';
import { Link } from 'react-router-dom';
import { api, getApiErrorMessage } from '../api/client';
import { getProductByIdOrSlug, saveProductModification } from '../api/catalogSync';
import type { ProductImage } from '../api/types';

export interface ColorVariantItem {
  name: string;
  code: string;
  stock: number;
  primary?: string;
  alt?: string;
  images?: string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
  sale_price?: string | number | null;
  stock_quantity: number;
  available_sizes?: string;
  available_colours?: string;
  material?: string;
  description?: string;
  main_image?: string;
  display_image_url?: string;
  gallery_images?: string[];
  images?: ProductImage[];
  colors?: ColorVariantItem[];
  is_active: boolean;
  category?: Category | number;
  category_name?: string;
  department?: string;
}

interface ProductWritePayload {
  name: string;
  category: number;
  price: number | string;
  stock_quantity: number;
  sku?: string;
  available_sizes: string;
  available_colours: string;
  material: string;
  description: string;
  main_image: string;
  gallery_images: string[];
  is_active: boolean;
}

interface OrderItem {
  id: number;
  product_name: string;
  sku?: string;
  unit_price: string | number;
  quantity: number;
  selected_size?: string;
  selected_colour?: string;
  line_total: string | number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  phone_number: string;
  shipping_address: string;
  total_amount: string | number;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

interface UserAccount {
  id: number;
  email: string;
  phone_number?: string;
  role: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined?: string;
}

interface LuxuryToast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const ProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<'products' | 'stock' | 'orders' | 'accounts'>('products');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [toasts, setToasts] = useState<LuxuryToast[]>([]);

  // Search & Filters for Products Tab
  const [productSearch, setProductSearch] = useState('');
  const [productDeptFilter, setProductDeptFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');

  // Search & Filters for Stock Tab
  const [stockSearch, setStockSearch] = useState('');
  const [stockFilterChip, setStockFilterChip] = useState<'all' | 'low' | 'out' | 'available'>('all');

  // Filter for Orders Tab
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Stock edit tracking
  const [stockEdits, setStockEdits] = useState<{ [id: number]: number }>({});
  const [savedSuccessMap, setSavedSuccessMap] = useState<{ [id: number]: boolean }>({});
  const [justUpdatedMap, setJustUpdatedMap] = useState<{ [id: number]: boolean }>({});

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    price: '',
    stock_quantity: 15,
    sku: '',
    available_sizes: '',
    available_colours: '',
    material: '',
    description: '',
    main_image: '/media/editorial/cat_shoulder.jpg',
    is_active: true
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Add Piece Color Variants & Dedicated Photo Stacks State
  const [addColors, setAddColors] = useState<ColorVariantItem[]>([
    {
      name: 'Classic Black',
      code: '#141414',
      stock: 15,
      primary: '/media/editorial/cat_shoulder.jpg',
      images: ['/media/editorial/cat_shoulder.jpg']
    }
  ]);
  const [selectedAddColorTab, setSelectedAddColorTab] = useState<number>(0);
  const [newAddColorPhotoUrl, setNewAddColorPhotoUrl] = useState<string>('');

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: '',
    stock_quantity: 0,
    sku: '',
    available_sizes: '',
    available_colours: '',
    material: '',
    description: '',
    main_image: '',
    is_active: true
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Edit Piece Color Variants & Dedicated Photo Stacks State
  const [editColors, setEditColors] = useState<ColorVariantItem[]>([]);
  const [selectedColorTab, setSelectedColorTab] = useState<number>(0);
  const [newColorPhotoUrl, setNewColorPhotoUrl] = useState<string>('');

  // Delete Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Order status update state
  const [orderUpdatingId, setOrderUpdatingId] = useState<number | null>(null);
  const [selectedOrderStatusMap, setSelectedOrderStatusMap] = useState<{ [id: number]: string }>({});

  // Helper to trigger luxury floating toasts
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        // 1. Fetch all real products from backend (using page_size=200 to dump all 35+ items)
        const prodRes = await api.get('/products/?page_size=200');
        if (!active) return;
        const prodList = (prodRes.data.results || prodRes.data || []) as Product[];
        setProducts(prodList);

        // Initialize stock edits
        const initialStock: { [id: number]: number } = {};
        prodList.forEach((p: Product) => {
          initialStock[p.id] = p.stock_quantity;
        });
        setStockEdits(initialStock);

        // 2. Fetch Categories
        try {
          const catRes = await api.get('/categories/');
          if (!active) return;
          const catList = (catRes.data.results || catRes.data || []) as Category[];
          setCategories(catList);
          if (catList.length > 0) {
            setAddForm((prev) => ({ ...prev, category: String(catList[0].id) }));
          }
        } catch (err) {
          console.warn('Error loading categories:', err);
        }

        // 3. Fetch Orders
        try {
          const orderRes = await api.get('/orders/');
          if (!active) return;
          const orderList = (orderRes.data.results || orderRes.data || []) as Order[];
          setOrders(orderList);
          const orderStatusInit: { [id: number]: string } = {};
          orderList.forEach((o: Order) => {
            orderStatusInit[o.id] = o.status;
          });
          setSelectedOrderStatusMap(orderStatusInit);
        } catch (err) {
          console.warn('Error loading orders:', err);
        }

        // 4. Fallback accounts list for store owner oversight
        setUsersList([
          { id: 6, email: user?.email || 'admin@velmora.com', role: 'ADMIN', is_staff: true, is_superuser: true, date_joined: '2026-11-01' },
          { id: 3, email: 'provider@velmora.com', role: 'SERVICE_PROVIDER', is_staff: false, is_superuser: false, date_joined: '2026-11-02' },
          { id: 4, email: 'customer@velmora.com', role: 'CUSTOMER', is_staff: false, is_superuser: false, date_joined: '2026-11-04' }
        ]);
      } catch (err: unknown) {
        console.error('Failed to load dashboard data:', err);
        addToast('Failed to connect to atelier database. Please verify API server is running.', 'error');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [addToast, user?.email]);

  // Compute Live KPIs
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock_quantity > 0).length;
  const lowStockCount = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length;
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => {
      const val = typeof o.total_amount === 'string' ? parseFloat(o.total_amount) : Number(o.total_amount);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [orders]);

  // Filtered Products for Tab 1
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catName = typeof p.category === 'object' && p.category?.name ? p.category.name : (p.category_name || '');
      const matchSearch =
        !productSearch.trim() ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        catName.toLowerCase().includes(productSearch.toLowerCase());

      const matchDept =
        productDeptFilter === 'all' ||
        catName.toLowerCase().includes(productDeptFilter.toLowerCase());

      let matchStatus = true;
      if (productStatusFilter === 'in_stock') matchStatus = p.stock_quantity > 0;
      else if (productStatusFilter === 'low_stock') matchStatus = p.stock_quantity > 0 && p.stock_quantity <= 5;
      else if (productStatusFilter === 'out_stock') matchStatus = p.stock_quantity === 0;
      else if (productStatusFilter === 'active') matchStatus = p.is_active;
      else if (productStatusFilter === 'inactive') matchStatus = !p.is_active;

      return matchSearch && matchDept && matchStatus;
    });
  }, [products, productSearch, productDeptFilter, productStatusFilter]);

  // Filtered Products for Tab 2 (Stock)
  const filteredStockProducts = useMemo(() => {
    return products.filter((p) => {
      const catName = typeof p.category === 'object' && p.category?.name ? p.category.name : (p.category_name || '');
      const matchSearch =
        !stockSearch.trim() ||
        p.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(stockSearch.toLowerCase()) ||
        catName.toLowerCase().includes(stockSearch.toLowerCase());

      let matchChip = true;
      if (stockFilterChip === 'low') matchChip = p.stock_quantity > 0 && p.stock_quantity <= 5;
      else if (stockFilterChip === 'out') matchChip = p.stock_quantity === 0;
      else if (stockFilterChip === 'available') matchChip = p.stock_quantity > 5;

      return matchSearch && matchChip;
    });
  }, [products, stockSearch, stockFilterChip]);

  // Filtered Orders for Tab 3
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter === 'all') return true;
      return o.status === orderStatusFilter;
    });
  }, [orders, orderStatusFilter]);

  // Helper to extract category name
  const getCatName = (p: Product) => {
    if (typeof p.category === 'object' && p.category?.name) return p.category.name;
    if (p.category_name) return p.category_name;
    const found = categories.find((c) => c.id === p.category);
    return found ? found.name : 'Atelier Collection';
  };

  // Helper for real product image url
  const getImageUrl = (p: Product) => {
    let url = p.display_image_url || p.main_image || '';
    if (!url && p.gallery_images && p.gallery_images.length > 0) {
      url = p.gallery_images[0];
    }
    if (!url && p.images && p.images.length > 0) {
      url = p.images[0].image_url || p.images[0].image || '';
    }
    if (!url) return '/media/editorial/cat_shoulder.jpg';
    url = url.trim().replace(/\\/g, '/');

    // Strip duplicate or malformed prefixes like /media/http://127.0.0.1:8000
    if (url.includes('http://127.0.0.1:8000/media/')) {
      url = url.substring(url.indexOf('http://127.0.0.1:8000/media/') + 'http://127.0.0.1:8000'.length);
    } else if (url.includes('http://localhost:8000/media/')) {
      url = url.substring(url.indexOf('http://localhost:8000/media/') + 'http://localhost:8000'.length);
    }

    // Fix double /media/media/ if present
    url = url.replace('/media/media/', '/media/');
    if (!url.startsWith('http')) {
      if (url.startsWith('products/')) {
        url = '/media/' + url;
      } else if (url.startsWith('media/')) {
        url = '/' + url;
      } else if (!url.startsWith('/')) {
        url = '/media/' + url;
      }
    }
    return url;
  };

  const handleThumbError = (e: React.SyntheticEvent<HTMLImageElement>, galleryImages?: string[]) => {
    const img = e.currentTarget;
    const cur = img.src;
    if (cur.includes('/media/') && img.dataset.triedRel !== 'true') {
      img.dataset.triedRel = 'true';
      img.src = '/media/' + cur.split('/media/').slice(1).join('/media/').replace(/^\/+/, '');
      return;
    }
    if (galleryImages && galleryImages.length > 0 && img.dataset.triedGal !== 'true') {
      img.dataset.triedGal = 'true';
      const g = galleryImages[0];
      img.src = g.startsWith('http') || g.startsWith('/') ? g : `/media/${g}`;
      return;
    }
    img.src = '/media/editorial/cat_shoulder.jpg';
  };

  // Add Product Handler
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAdd(true);
    try {
      const catId = parseInt(addForm.category, 10) || (categories[0]?.id || 1);
      const catObj = categories.find((c) => c.id === catId);
      const catName = catObj?.name || 'Bags';

      // Compute stock from variants if configured
      const totalColorStock = addColors.length > 0
        ? addColors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)
        : parseInt(String(addForm.stock_quantity), 10) || 15;
      const finalStock = totalColorStock > 0 ? totalColorStock : 15;

      const coloursString = addColors.map((c) => c.name.trim()).filter(Boolean).join(', ') || addForm.available_colours || 'Classic Black';
      
      // Collect all images across all colors for backend gallery payload
      const allAddImages: string[] = [];
      addColors.forEach((c) => {
        if (c.images) {
          c.images.forEach((img) => {
            if (img && !allAddImages.includes(img)) allAddImages.push(img);
          });
        }
      });

      const primaryImg =
        addColors[0]?.images?.[0] ||
        addColors[0]?.primary ||
        allAddImages[0] ||
        addForm.main_image ||
        '/media/editorial/cat_shoulder.jpg';

      const galleryPayload = allAddImages.length > 0 ? allAddImages : [primaryImg];
      const safeDesc = addForm.description?.trim() || `The ${addForm.name.trim()} is sculpted with timeless proportions and bespoke artisanal finishing. Handcrafted from sustainably sourced European materials with hand-painted bevelled edges and solid polished brass hardware.`;

      const payload: ProductWritePayload = {
        name: addForm.name.trim(),
        category: catId,
        price: parseFloat(addForm.price) || 0,
        stock_quantity: finalStock,
        available_sizes: addForm.available_sizes || 'One Size',
        available_colours: coloursString,
        material: addForm.material || 'Exterior: 100% French Calfskin. Interior: Cotton Canvas. Hardware: Solid Brass.',
        description: safeDesc,
        main_image: primaryImg,
        gallery_images: galleryPayload,
        is_active: addForm.is_active
      };
      if (addForm.sku.trim()) payload.sku = addForm.sku.trim();

      const res = await api.post('/products/', payload);
      const created = res.data;

      // Update local state
      setProducts((prev) => [created, ...prev]);
      setStockEdits((prev) => ({ ...prev, [created.id]: created.stock_quantity }));

      // Save to active catalog store so Storefront PDP (/products/:id) & Collections immediately display it!
      saveProductModification(created.id, {
        id: String(created.id),
        name: created.name,
        price: parseFloat(created.price),
        category: catName,
        department: catName,
        description: safeDesc,
        materials: payload.material,
        stock_quantity: finalStock,
        colors: addColors.map((c) => {
          const cImgs = c.images && c.images.length > 0 ? c.images : [c.primary || primaryImg];
          return {
            name: c.name,
            code: c.code,
            stock: Number(c.stock) || 0,
            primary: cImgs[0] || c.primary || primaryImg,
            alt: cImgs[1] || cImgs[0] || primaryImg,
            images: cImgs
          };
        })
      });

      setShowAddModal(false);
      setAddForm({
        name: '',
        category: '',
        price: '',
        stock_quantity: 15,
        sku: '',
        available_sizes: '',
        available_colours: '',
        material: '',
        description: '',
        main_image: '/media/editorial/cat_shoulder.jpg',
        is_active: true
      });
      setAddColors([
        {
          name: 'Classic Black',
          code: '#141414',
          stock: 15,
          primary: '/media/editorial/cat_shoulder.jpg',
          images: ['/media/editorial/cat_shoulder.jpg']
        }
      ]);
      setSelectedAddColorTab(0);
      setNewAddColorPhotoUrl('');

      addToast(`Piece "${created.name}" created and saved to database & live storefront!`, 'success');
    } catch (err: unknown) {
      console.error('Failed to add piece:', err);
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        addToast('Authentication required: Please sign in as Store Administrator to add pieces.', 'error');
      } else {
        const msg = axios.isAxiosError(err) && err.response?.data ? JSON.stringify(err.response.data) : 'Failed to register piece.';
        addToast(msg, 'error');
      }
    } finally {
      setSubmittingAdd(false);
    }
  };

  const openEditModal = (p: Product) => {
    setEditProduct(p);
    const catId = typeof p.category === 'object' && p.category !== null ? p.category.id : p.category;
    setEditForm({
      name: p.name,
      category: String(catId || categories[0]?.id || ''),
      price: String(p.price),
      stock_quantity: p.stock_quantity,
      sku: p.sku,
      available_sizes: p.available_sizes || '',
      available_colours: p.available_colours || '',
      material: p.material || '',
      description: p.description || '',
      main_image: p.main_image || '',
      is_active: p.is_active
    });

    // Extract Color Variants & their DEDICATED photo stacks separately!
    const catItem = getProductByIdOrSlug(String(p.id)) || getProductByIdOrSlug(p.name);
    let initialColors: ColorVariantItem[] = [];

    if (catItem && catItem.colors && catItem.colors.length > 0) {
      const perColorStock = Math.max(1, Math.floor(p.stock_quantity / catItem.colors.length));
      initialColors = catItem.colors.map((c) => {
        const cImages = c.images && c.images.length > 0 ? [...c.images] : [];
        if (c.primary && !cImages.includes(c.primary)) {
          cImages.unshift(c.primary);
        }
        if (c.alt && !cImages.includes(c.alt)) {
          cImages.push(c.alt);
        }
        return {
          name: c.name,
          code: c.code || '#141414',
          stock: c.stock !== undefined ? c.stock : perColorStock,
          primary: c.primary || cImages[0] || '',
          alt: c.alt || cImages[1] || cImages[0] || '',
          images: cImages
        };
      });

      // Special check: If all colors accidentally shared the identical 15+ images array:
      const allIdentical = initialColors.length > 1 && initialColors.every(
        (col) => col.images && col.images.length === initialColors[0].images?.length && col.images.length >= 10
      );
      if (allIdentical) {
        const fullGallery = initialColors[0].images || [];
        initialColors = initialColors.map((col, cIdx) => {
          const low = col.name.toLowerCase();
          const matched = fullGallery.filter((img) => {
            const imgLow = img.toLowerCase();
            if (low.includes('black') && imgLow.includes('black')) return true;
            if ((low.includes('brown') || low.includes('java') || low.includes('cocoa') || low.includes('hazel') || low.includes('gingerbread') || low.includes('cheetah')) &&
                (imgLow.includes('brown') || imgLow.includes('java') || imgLow.includes('cocoa') || imgLow.includes('hazel') || imgLow.includes('gingerbread') || imgLow.includes('cheetah'))) return true;
            if ((low.includes('green') || low.includes('sage')) && (imgLow.includes('green') || imgLow.includes('sage'))) return true;
            if ((low.includes('yellow') || low.includes('lemonade') || low.includes('sunlight') || low.includes('offwhite')) &&
                (imgLow.includes('yellow') || imgLow.includes('lemonade') || imgLow.includes('sunlight') || imgLow.includes('offwhite'))) return true;
            if ((low.includes('rose') || low.includes('pink')) && (imgLow.includes('rose') || imgLow.includes('pink'))) return true;
            if (low.includes('raffia') && imgLow.includes('raffia')) return true;
            if (low.includes('blue') && (imgLow.includes('blue') || imgLow.includes('iris'))) return true;
            return false;
          });

          let cImgs = matched;
          if (cImgs.length === 0) {
            const chunkSize = Math.ceil(fullGallery.length / initialColors.length);
            cImgs = fullGallery.slice(cIdx * chunkSize, (cIdx + 1) * chunkSize);
          }
          if (cImgs.length === 0 && fullGallery.length > 0) {
            cImgs = [fullGallery[0]];
          }
          return {
            ...col,
            primary: cImgs[0] || col.primary || '',
            images: cImgs
          };
        });
      }
    } else if (p.available_colours) {
      const parts = p.available_colours.split(',').map((s) => s.trim()).filter(Boolean);
      const perColorStock = Math.max(1, Math.floor(p.stock_quantity / (parts.length || 1)));
      const pGallery = p.gallery_images || (p.display_image_url ? [p.display_image_url] : []);
      initialColors = parts.map((name, idx) => {
        const low = name.toLowerCase();
        let matched = pGallery.filter((img) => {
          const imgLow = img.toLowerCase();
          if (low.includes('black') && imgLow.includes('black')) return true;
          if ((low.includes('brown') || low.includes('java') || low.includes('cocoa') || low.includes('hazel') || low.includes('gingerbread') || low.includes('cheetah')) &&
              (imgLow.includes('brown') || imgLow.includes('java') || imgLow.includes('cocoa') || imgLow.includes('hazel') || imgLow.includes('gingerbread') || imgLow.includes('cheetah'))) return true;
          if ((low.includes('green') || low.includes('sage')) && (imgLow.includes('green') || imgLow.includes('sage'))) return true;
          if ((low.includes('yellow') || low.includes('lemonade') || low.includes('sunlight') || low.includes('offwhite')) &&
              (imgLow.includes('yellow') || imgLow.includes('lemonade') || imgLow.includes('sunlight') || imgLow.includes('offwhite'))) return true;
          if ((low.includes('rose') || low.includes('pink')) && (imgLow.includes('rose') || imgLow.includes('pink'))) return true;
          if (low.includes('raffia') && imgLow.includes('raffia')) return true;
          if (low.includes('blue') && (imgLow.includes('blue') || imgLow.includes('iris'))) return true;
          return false;
        });

        if (matched.length === 0 && pGallery.length > 0) {
          if (parts.length > 1) {
            const chunkSize = Math.ceil(pGallery.length / parts.length);
            matched = pGallery.slice(idx * chunkSize, (idx + 1) * chunkSize);
          } else {
            matched = pGallery;
          }
        }
        return {
          name,
          code: idx === 0 ? '#141414' : idx === 1 ? '#56382D' : idx === 2 ? '#D2A26F' : '#8C6D37',
          stock: perColorStock,
          primary: matched[0] || p.display_image_url || p.main_image || '',
          images: matched.length > 0 ? matched : (p.display_image_url ? [p.display_image_url] : [])
        };
      });
    }

    if (initialColors.length === 0) {
      const pGallery = p.gallery_images && p.gallery_images.length > 0 ? [...p.gallery_images] : (p.display_image_url ? [p.display_image_url] : []);
      initialColors = [{
        name: 'Classic Black',
        code: '#141414',
        stock: p.stock_quantity,
        primary: pGallery[0] || p.display_image_url || p.main_image || '',
        images: pGallery
      }];
    }

    setEditColors(initialColors);
    setSelectedColorTab(0);
    setNewColorPhotoUrl('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setSubmittingEdit(true);
    try {
      // 1. Sanitize category as integer ID
      const fallbackCatId =
        typeof editProduct.category === 'object' && editProduct.category !== null
          ? editProduct.category.id
          : editProduct.category;
      const catId = parseInt(String(editForm.category), 10) || fallbackCatId || 1;

      // 2. Synchronize stock and colors
      const totalColorStock = editColors.length > 0
        ? editColors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)
        : parseInt(String(editForm.stock_quantity), 10) || 0;
      const finalStock = totalColorStock > 0 ? totalColorStock : (parseInt(String(editForm.stock_quantity), 10) || 0);

      const coloursString = editColors.map((c) => c.name.trim()).filter(Boolean).join(', ') || editForm.available_colours;

      // Collect all images across all colors for backend gallery payload
      const allEditImages: string[] = [];
      editColors.forEach((c) => {
        if (c.images) {
          c.images.forEach((img) => {
            if (img && !allEditImages.includes(img)) allEditImages.push(img);
          });
        }
      });

      const primaryImg =
        editColors[0]?.images?.[0] ||
        editColors[0]?.primary ||
        allEditImages[0] ||
        editForm.main_image ||
        (editProduct.main_image as string) ||
        '/media/editorial/cat_shoulder.jpg';

      const galleryPayload = allEditImages.length > 0 ? allEditImages : [primaryImg];

      // 3. Build comprehensive backend payload
      const payload: ProductWritePayload = {
        name: editForm.name.trim(),
        category: catId,
        price: parseFloat(editForm.price) || editProduct.price,
        stock_quantity: finalStock,
        sku: editForm.sku.trim() || editProduct.sku,
        available_sizes: editForm.available_sizes,
        available_colours: coloursString,
        material: editForm.material,
        description: editForm.description?.trim() || editProduct.description || `The ${editForm.name.trim()} embodies sculptural elegance and enduring craftsmanship, handcrafted in limited numbers with signature solid brass hardware.`,
        is_active: editForm.is_active,
        main_image: primaryImg,
        gallery_images: galleryPayload
      };

      const res = await api.patch(`/products/${editProduct.id}/`, payload);
      const updated = res.data;

      // 4. Update local state and stock maps
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updated.id
            ? { ...p, ...updated, gallery_images: galleryPayload, stock_quantity: finalStock, colors: editColors }
            : p
        )
      );
      setStockEdits((prev) => ({ ...prev, [updated.id]: finalStock }));

      // 5. Broadcast to active catalog store so Storefront PDP (/products/:id) & Collections immediately update!
      saveProductModification(editProduct.id, {
        id: String(editProduct.id),
        name: updated.name,
        price: parseFloat(updated.current_price || updated.price),
        description: updated.description,
        materials: updated.material,
        stock_quantity: finalStock,
        colors: editColors.map((c) => {
          const cImgs = c.images && c.images.length > 0 ? c.images : [c.primary || primaryImg];
          return {
            name: c.name,
            code: c.code,
            stock: Number(c.stock) || 0,
            primary: cImgs[0] || c.primary || primaryImg,
            alt: cImgs[1] || cImgs[0] || primaryImg,
            images: cImgs
          };
        })
      });

      setShowEditModal(false);
      setEditProduct(null);

      // Flash row
      setJustUpdatedMap((prev) => ({ ...prev, [updated.id]: true }));
      setTimeout(() => {
        setJustUpdatedMap((prev) => ({ ...prev, [updated.id]: false }));
      }, 2500);

      addToast(`Piece "${updated.name}" specifications, colors, and separate photo stacks updated successfully!`, 'success');
    } catch (err: unknown) {
      console.error('Failed to update product:', err);
      const errMsg = axios.isAxiosError(err) && err.response?.data
        ? JSON.stringify(err.response.data)
        : getApiErrorMessage(err, 'Failed to update piece specifications.');
      addToast(errMsg, 'error');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete.id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      addToast(`Piece "${productToDelete.name}" removed from catalog.`, 'info');
      setProductToDelete(null);
    } catch (err: unknown) {
      console.error('Failed to delete product:', err);
      addToast('Cannot delete piece. It may be linked to active customer orders.', 'error');
    }
  };

  // Stock Instant Save Handler
  const handleStockSave = async (productId: number) => {
    const newQty = stockEdits[productId];
    if (newQty === undefined || isNaN(newQty) || newQty < 0) {
      addToast('Please enter a valid stock quantity (>= 0).', 'error');
      return;
    }
    try {
      await api.patch(`/products/${productId}/`, { stock_quantity: newQty });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock_quantity: newQty } : p))
      );

      // Show green button SAVED ✓
      setSavedSuccessMap((prev) => ({ ...prev, [productId]: true }));
      setJustUpdatedMap((prev) => ({ ...prev, [productId]: true }));

      setTimeout(() => {
        setSavedSuccessMap((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
      setTimeout(() => {
        setJustUpdatedMap((prev) => ({ ...prev, [productId]: false }));
      }, 2000);

      const p = products.find((x) => x.id === productId);
      addToast(`Stock for "${p?.name || 'Piece'}" updated to ${newQty} units.`, 'success');
    } catch (err: unknown) {
      console.error('Failed to update stock:', err);
      addToast('Failed to save stock quantity.', 'error');
    }
  };

  // Rapid Increment / Decrement
  const changeStockDelta = (productId: number, delta: number) => {
    setStockEdits((prev) => {
      const current = prev[productId] !== undefined ? prev[productId] : 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [productId]: updated };
    });
  };

  // Order Status Update Handler
  const handleOrderStatusSubmit = async (orderId: number) => {
    const newStatus = selectedOrderStatusMap[orderId];
    if (!newStatus) return;
    setOrderUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status/`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast(`Order #${orders.find((o) => o.id === orderId)?.order_number || orderId} status updated to ${newStatus}.`, 'success');
    } catch (err: unknown) {
      console.error('Failed to update order status:', err);
      addToast(getApiErrorMessage(err, 'Failed to update order status.'), 'error');
    } finally {
      setOrderUpdatingId(null);
    }
  };

  return (
    <div className="provider-dashboard-wrap">
      {/* 0. Embedded Quiet Luxury CSS matching templates/provider/dashboard.html */}
      <style>{`
        .provider-dashboard-wrap {
          background-color: #FAF9F6;
          min-height: 90vh;
          padding: 36px 40px 90px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #141414;
        }
        @media (max-width: 768px) {
          .provider-dashboard-wrap {
            padding: 20px 16px 60px;
          }
        }
        .luxury-toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }
        .luxury-toast {
          background: #141414;
          color: #FFFFFF;
          border-left: 4px solid #C5A880;
          border-radius: 3px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          padding: 14px 18px;
          min-width: 320px;
          max-width: 460px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          font-size: 12.5px;
          pointer-events: auto;
          animation: toastSlideIn 0.28s ease-out;
        }
        .luxury-toast.toast-error { border-left-color: #D32F2F; }
        .luxury-toast.toast-success { border-left-color: #2E7D32; }
        @keyframes toastSlideIn {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .provider-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 24px;
          border-bottom: 1px solid #ECEAE5;
          margin-bottom: 30px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .provider-brand-title {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 28px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #141414;
          margin: 0 0 6px 0;
          font-weight: 500;
        }
        .provider-sub-badge-line {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          color: #767676;
          flex-wrap: wrap;
        }
        .provider-badge-pill {
          background: #141414;
          color: #FFFFFF;
          padding: 3px 8px;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          border-radius: 2px;
        }
        .provider-badge-pill.main-badge { background: #795548; }
        .provider-quick-links {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .provider-quick-links a {
          color: #141414;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .provider-quick-links a:hover {
          border-color: #141414;
        }
        .provider-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 18px;
          margin-bottom: 36px;
        }
        .kpi-card {
          background: #FFFFFF;
          border: 1px solid #ECEAE5;
          padding: 22px 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
        }
        .kpi-card-title {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #767676;
          margin-bottom: 8px;
        }
        .kpi-card-value {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 32px;
          color: #141414;
          line-height: 1.1;
          font-weight: 500;
        }
        .kpi-card-sub {
          font-size: 11px;
          color: #888;
          margin-top: 6px;
        }
        .provider-tabs-bar {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #ECEAE5;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .provider-tab-btn {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 12px 20px;
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #767676;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .provider-tab-btn:hover { color: #141414; }
        .provider-tab-btn.active {
          color: #141414;
          border-color: #141414;
          background: #FFFFFF;
        }
        .provider-panel-card {
          background: #FFFFFF;
          border: 1px solid #ECEAE5;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          padding: 28px;
        }
        .panel-toolbar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .btn-provider-action {
          background: #141414;
          color: #FFFFFF;
          border: 1px solid #141414;
          padding: 9px 18px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .btn-provider-action:hover {
          background: #333333;
          color: #FFFFFF;
        }
        .btn-stock-chip {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          border-radius: 0;
          padding: 5px 12px;
          border: 1px solid #141414;
          background: #FFF;
          color: #141414;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-stock-chip.active {
          background: #141414 !important;
          color: #FFFFFF !important;
        }
        .luxury-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .luxury-table th {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #767676;
          padding: 12px 14px;
          border-bottom: 1px solid #ECEAE5;
          background: #FAF9F6;
          text-align: left;
        }
        .luxury-table td {
          padding: 14px;
          border-bottom: 1px solid #F0EFEA;
          vertical-align: middle;
          color: #141414;
          transition: background-color 0.3s ease;
        }
        .luxury-table tr:hover td {
          background-color: #FCFBF9;
        }
        .table-img-thumb {
          width: 48px;
          height: 58px;
          object-fit: cover;
          background-color: #F4F3F0;
          border: 1px solid #ECEAE5;
          display: block;
        }
        .status-pill {
          display: inline-block;
          padding: 3px 8px;
          font-size: 9.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          border-radius: 3px;
        }
        .status-in-stock { background: #E8F5E9; color: #2E7D32; }
        .status-low-stock { background: #FFF3E0; color: #E65100; }
        .status-out-stock { background: #FFEBEE; color: #C62828; }
        .status-confirmed { background: #E3F2FD; color: #1565C0; }
        .status-processing { background: #FFF8E1; color: #F57F17; }
        .status-shipped { background: #EDE7F6; color: #512DA8; }
        .status-delivered { background: #E8F5E9; color: #2E7D32; }
        .status-cancelled { background: #FFEBEE; color: #C62828; }
        .stock-input-inline {
          width: 65px;
          padding: 5px 6px;
          font-size: 12px;
          border: 1px solid #D5D2CB;
          background: #FAF9F6;
          text-align: center;
          font-weight: 600;
        }
        .btn-inline-save {
          background: #141414;
          color: #FFF;
          border: none;
          padding: 6px 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-inline-save:hover { background: #444; }
        .btn-inline-save.saved-success {
          background: #2E7D32 !important;
          color: #FFF !important;
        }
        @keyframes rowUpdatedHighlight {
          0% { background-color: #E8F5E9; }
          100% { background-color: transparent; }
        }
        .row-just-updated td {
          animation: rowUpdatedHighlight 1.5s ease-out;
        }
        .modal-overlay-luxury {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.55);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-box-luxury {
          background: #FFFFFF;
          max-width: 780px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        }
        .modal-header-luxury {
          border-bottom: 1px solid #ECEAE5;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-title-luxury {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 22px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
          font-weight: 500;
        }
        .modal-footer-luxury {
          border-top: 1px solid #ECEAE5;
          padding: 16px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>

      {/* Floating Toast Notifications */}
      <div className="luxury-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`luxury-toast ${t.type === 'error' ? 'toast-error' : t.type === 'success' ? 'toast-success' : ''}`}>
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '15px' }}>✕</button>
          </div>
        ))}
      </div>

      {/* 1. Top Header Row */}
      <div className="provider-header-row">
        <div>
          <h1 className="provider-brand-title">Atelier &amp; Service Provider Portal</h1>
          <div className="provider-sub-badge-line">
            <span className="provider-badge-pill main-badge">Store Administrator</span>
            <span>Atelier: <strong>Velmora Master Workshop</strong></span>
            <span>&bull;</span>
            <span>Operator: <strong>{user?.email || 'admin@velmora.com'}</strong></span>
          </div>
        </div>

        <div className="provider-quick-links">
          <Link to="/collections" target="_blank" rel="noopener noreferrer">
            View Live Storefront &nearr;
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="provider-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-card-title">Total Catalog Pieces</span>
          <span className="kpi-card-value">{loading ? '...' : totalProducts}</span>
          <span className="kpi-card-sub">Handcrafted Active Designs</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-card-title">Stock Availability</span>
          <span className="kpi-card-value">{loading ? '...' : inStockCount}</span>
          <span className="kpi-card-sub">
            <span style={{ color: '#E65100', fontWeight: 600 }}>{lowStockCount} Low Stock</span> &bull;{' '}
            <span style={{ color: '#C62828', fontWeight: 600 }}>{outOfStockCount} Out</span>
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-card-title">Customer Orders</span>
          <span className="kpi-card-value">{loading ? '...' : totalOrders}</span>
          <span className="kpi-card-sub">
            <span style={{ color: '#1565C0', fontWeight: 600 }}>{pendingOrders} Requiring Dispatch</span>
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-card-title">Workshop Revenue</span>
          <span className="kpi-card-value">${loading ? '...' : totalRevenue.toFixed(2)}</span>
          <span className="kpi-card-sub">Completed &amp; Dispatched Orders</span>
        </div>
      </div>

      {/* 3. Tabs Navigation */}
      <div className="provider-tabs-bar">
        <button
          className={`provider-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          1. Catalog Items Management (CRUD)
        </button>
        <button
          className={`provider-tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          2. Inventory &amp; Stock Handling
        </button>
        <button
          className={`provider-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          3. Customer Orders Handling ({orders.length})
        </button>
        <button
          className={`provider-tab-btn ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          4. Registered Store Accounts &amp; Security
        </button>
      </div>

      {/* =========================================================================
           TAB 1: PRODUCT CATALOG MANAGEMENT (CRUD)
           ========================================================================= */}
      {activeTab === 'products' && (
        <div className="provider-panel-card">
          <div className="panel-toolbar-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Real-Time Search */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Instant search pieces by name, SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 26px 6px 10px',
                    fontSize: '12px',
                    border: '1px solid #D5D2CB',
                    borderRadius: '2px'
                  }}
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '11px' }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Department Filter */}
              <select
                value={productDeptFilter}
                onChange={(e) => setProductDeptFilter(e.target.value)}
                style={{ width: '145px', padding: '6px 8px', fontSize: '12px', border: '1px solid #D5D2CB', borderRadius: '2px' }}
              >
                <option value="all">All Departments</option>
                <option value="Bags">Bags</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
                <option value="Wallets">Wallets</option>
              </select>

              {/* Status Filter */}
              <select
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value)}
                style={{ width: '135px', padding: '6px 8px', fontSize: '12px', border: '1px solid #D5D2CB', borderRadius: '2px' }}
              >
                <option value="all">All Inventory</option>
                <option value="in_stock">In Stock (&gt;0)</option>
                <option value="low_stock">Low Stock (&le;5)</option>
                <option value="out_stock">Sold Out (0)</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <span style={{ fontSize: '11px', color: '#767676', fontFamily: 'monospace' }}>
                Showing {filteredProducts.length} pieces
              </span>
            </div>

            <button
              type="button"
              className="btn-provider-action"
              onClick={() => setShowAddModal(true)}
            >
              <span>＋</span> ADD NEW PIECE
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Piece Image</th>
                  <th>Name &amp; SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isFlash = justUpdatedMap[p.id];
                  return (
                    <tr key={p.id} className={isFlash ? 'row-just-updated' : ''}>
                      <td>
                        <img
                          src={getImageUrl(p)}
                          alt={p.name}
                          className="table-img-thumb"
                          onError={(e) => handleThumbError(e, p.gallery_images)}
                        />
                      </td>
                      <td>
                        <strong style={{ fontSize: '13px' }}>{p.name}</strong>
                        <div style={{ fontSize: '10px', color: '#767676', fontFamily: 'monospace' }}>{p.sku}</div>
                      </td>
                      <td>{getCatName(p)}</td>
                      <td style={{ fontWeight: 600 }}>${p.price}</td>
                      <td>
                        {p.stock_quantity > 10 ? (
                          <span className="status-pill status-in-stock">{p.stock_quantity} In Stock</span>
                        ) : p.stock_quantity > 0 ? (
                          <span className="status-pill status-low-stock">{p.stock_quantity} Low Stock</span>
                        ) : (
                          <span className="status-pill status-out-stock">Out of Stock</span>
                        )}
                      </td>
                      <td>
                        {p.is_active ? (
                          <span style={{ background: '#141414', color: '#FFF', fontSize: '9px', padding: '3px 6px', letterSpacing: '0.08em', borderRadius: '2px' }}>
                            ACTIVE
                          </span>
                        ) : (
                          <span style={{ background: '#767676', color: '#FFF', fontSize: '9px', padding: '3px 6px', borderRadius: '2px' }}>
                            INACTIVE
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            style={{
                              background: '#FFF',
                              border: '1px solid #141414',
                              color: '#141414',
                              padding: '4px 8px',
                              fontSize: '10.5px',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            style={{
                              background: '#FFF',
                              border: '1px solid #C62828',
                              color: '#C62828',
                              padding: '4px 8px',
                              fontSize: '10.5px',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#888' }}>
                      No pieces found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
           TAB 2: INVENTORY & STOCK HANDLING
           ========================================================================= */}
      {activeTab === 'stock' && (
        <div className="provider-panel-card">
          <div className="panel-toolbar-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Stock Search */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Instant search stock by piece or SKU..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 26px 6px 10px',
                    fontSize: '12px',
                    border: '1px solid #D5D2CB',
                    borderRadius: '2px'
                  }}
                />
                {stockSearch && (
                  <button
                    onClick={() => setStockSearch('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '11px' }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Filter Chips */}
              <div style={{ display: 'inline-flex' }}>
                <button
                  type="button"
                  className={`btn-stock-chip ${stockFilterChip === 'all' ? 'active' : ''}`}
                  onClick={() => setStockFilterChip('all')}
                >
                  ALL ({products.length})
                </button>
                <button
                  type="button"
                  className={`btn-stock-chip ${stockFilterChip === 'low' ? 'active' : ''}`}
                  onClick={() => setStockFilterChip('low')}
                >
                  LOW STOCK (&le;5)
                </button>
                <button
                  type="button"
                  className={`btn-stock-chip ${stockFilterChip === 'out' ? 'active' : ''}`}
                  onClick={() => setStockFilterChip('out')}
                >
                  SOLD OUT (0)
                </button>
                <button
                  type="button"
                  className={`btn-stock-chip ${stockFilterChip === 'available' ? 'active' : ''}`}
                  onClick={() => setStockFilterChip('available')}
                >
                  AVAILABLE (&gt;5)
                </button>
              </div>

              <span style={{ fontSize: '11px', color: '#767676', fontFamily: 'monospace' }}>
                Showing {filteredStockProducts.length} pieces
              </span>
            </div>

            <span style={{ fontSize: '11px', color: '#767676' }}>
              Update quantities directly &bull; changes apply immediately to live database
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Piece</th>
                  <th>Category</th>
                  <th>Current Units</th>
                  <th>Inventory Status</th>
                  <th>Inline Stock Adjustment</th>
                </tr>
              </thead>
              <tbody>
                {filteredStockProducts.map((p) => {
                  const currentInputVal = stockEdits[p.id] !== undefined ? stockEdits[p.id] : p.stock_quantity;
                  const isSavedSuccess = savedSuccessMap[p.id];
                  const isFlash = justUpdatedMap[p.id];

                  return (
                    <tr key={p.id} className={isFlash ? 'row-just-updated' : ''}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={getImageUrl(p)}
                            alt={p.name}
                            className="table-img-thumb"
                            onError={(e) => handleThumbError(e)}
                          />
                          <div>
                            <strong style={{ fontSize: '13px' }}>{p.name}</strong>
                            <div style={{ fontSize: '10px', color: '#767676', fontFamily: 'monospace' }}>{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td>{getCatName(p)}</td>
                      <td>
                        <strong style={{ fontSize: '15px' }}>{p.stock_quantity}</strong>
                      </td>
                      <td>
                        {p.stock_quantity > 10 ? (
                          <span className="status-pill status-in-stock">Available ({p.stock_quantity})</span>
                        ) : p.stock_quantity > 0 ? (
                          <span className="status-pill status-low-stock">Low Stock ({p.stock_quantity})</span>
                        ) : (
                          <span className="status-pill status-out-stock">Sold Out</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => changeStockDelta(p.id, -1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid #D5D2CB',
                              background: '#FFF',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            title="Subtract 1"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="9999"
                            value={currentInputVal}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setStockEdits((prev) => ({ ...prev, [p.id]: isNaN(val) ? 0 : val }));
                            }}
                            className="stock-input-inline"
                          />
                          <button
                            type="button"
                            onClick={() => changeStockDelta(p.id, 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid #D5D2CB',
                              background: '#FFF',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            title="Add 1"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockSave(p.id)}
                            className={`btn-inline-save ${isSavedSuccess ? 'saved-success' : ''}`}
                          >
                            {isSavedSuccess ? 'SAVED ✓' : 'SAVE STOCK'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
           TAB 3: CUSTOMER ORDERS MANAGEMENT
           ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="provider-panel-card">
          <div className="panel-toolbar-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '11px', color: '#767676', fontFamily: 'monospace' }}>Filter Status:</label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{ width: '200px', padding: '6px 8px', fontSize: '12px', border: '1px solid #D5D2CB', borderRadius: '2px' }}
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">In Workshop / Processing</option>
                <option value="SHIPPED">Dispatched / Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <span style={{ fontSize: '11px', color: '#767676' }}>
              Real live orders synced with database &bull; Customer purchases reflect here
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Client Name</th>
                  <th>Shipping Destination</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Current Status</th>
                  <th>Update Status Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const currentSelected = selectedOrderStatusMap[o.id] || o.status;
                  const isUpdating = orderUpdatingId === o.id;

                  return (
                    <tr key={o.id}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', fontSize: '13px' }}>{o.order_number}</strong>
                        <div style={{ fontSize: '10px', color: '#767676' }}>{o.created_at ? new Date(o.created_at).toLocaleString() : ''}</div>
                      </td>
                      <td>
                        <div><strong>{o.customer_name}</strong></div>
                        <div style={{ fontSize: '11px', color: '#767676' }}>{o.phone_number}</div>
                      </td>
                      <td style={{ maxWidth: '200px', fontSize: '11px' }}>
                        {o.shipping_address}
                      </td>
                      <td>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '11px' }}>
                          {o.items && o.items.length > 0 ? (
                            o.items.map((it) => (
                              <li key={it.id} style={{ marginBottom: '4px' }}>
                                <strong>{it.quantity}x</strong> {it.product_name}
                                {it.selected_colour && <span style={{ color: '#767676' }}> ({it.selected_colour})</span>}
                                {it.selected_size && <span style={{ color: '#767676' }}> [{it.selected_size}]</span>}
                              </li>
                            ))
                          ) : (
                            <li style={{ color: '#888' }}>Standard Atelier Piece</li>
                          )}
                        </ul>
                      </td>
                      <td>
                        <strong style={{ fontSize: '14px' }}>${o.total_amount}</strong>
                      </td>
                      <td>
                        {o.status === 'CONFIRMED' && <span className="status-pill status-confirmed">Confirmed</span>}
                        {o.status === 'PROCESSING' && <span className="status-pill status-processing">In Workshop</span>}
                        {o.status === 'SHIPPED' && <span className="status-pill status-shipped">Dispatched</span>}
                        {o.status === 'DELIVERED' && <span className="status-pill status-delivered">Delivered</span>}
                        {o.status === 'CANCELLED' && <span className="status-pill status-cancelled">Cancelled</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <select
                            value={currentSelected}
                            onChange={(e) =>
                              setSelectedOrderStatusMap((prev) => ({ ...prev, [o.id]: e.target.value }))
                            }
                            style={{ fontSize: '11px', padding: '4px 6px', border: '1px solid #D5D2CB' }}
                          >
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing / In Workshop</option>
                            <option value="SHIPPED">Shipped / Dispatched</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleOrderStatusSubmit(o.id)}
                            disabled={isUpdating}
                            style={{
                              background: '#141414',
                              color: '#FFF',
                              border: 'none',
                              padding: '5px 10px',
                              fontSize: '10px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {isUpdating ? '...' : 'UPDATE'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '56px 24px', backgroundColor: '#FAF9F6' }}>
                      <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '50%', backgroundColor: '#ECEAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                        📦
                      </div>
                      <strong style={{ display: 'block', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', marginBottom: '6px' }}>
                        No Client Orders Under Selected Filter
                      </strong>
                      <p style={{ margin: 0, fontSize: '12px', color: '#767676', letterSpacing: '0.02em' }}>
                        All dummy orders have been removed. Verified customer orders placed during checkout will display here in real time.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
           TAB 4: REGISTERED STORE ACCOUNTS & SECURITY
           ========================================================================= */}
      {activeTab === 'accounts' && (
        <div className="provider-panel-card">
          <div className="panel-toolbar-row">
            <div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, fontWeight: 500 }}>
                Store Administrative Accounts &amp; Customer Directory
              </h3>
              <p style={{ fontSize: '12px', color: '#767676', margin: '4px 0 0' }}>
                Single-store administrative oversight for boutique operators and registered clients.
              </p>
            </div>
            <span style={{ background: '#141414', color: '#FFF', fontSize: '10px', padding: '4px 10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Main Atelier Oversight: Active
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Account Email</th>
                  <th>Role</th>
                  <th>Staff / Superuser</th>
                  <th>Joined Date</th>
                  <th>Authorization Status</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong style={{ fontSize: '13px' }}>{u.email}</strong>
                    </td>
                    <td>
                      {u.role === 'ADMIN' ? (
                        <span style={{ background: '#795548', color: '#FFF', fontSize: '9px', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.1em' }}>
                          STORE OWNER / ADMIN
                        </span>
                      ) : u.role === 'SERVICE_PROVIDER' ? (
                        <span style={{ background: '#141414', color: '#FFF', fontSize: '9px', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.1em' }}>
                          WORKSHOP PROVIDER
                        </span>
                      ) : (
                        <span style={{ background: '#E0E0E0', color: '#333', fontSize: '9px', padding: '3px 8px', borderRadius: '2px' }}>
                          CLIENT / CUSTOMER
                        </span>
                      )}
                    </td>
                    <td>
                      {u.is_superuser ? (
                        <span style={{ color: '#2E7D32', fontWeight: 600 }}>Master Superuser</span>
                      ) : u.is_staff ? (
                        <span style={{ color: '#1565C0', fontWeight: 600 }}>Staff Member</span>
                      ) : (
                        <span style={{ color: '#767676' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px' }}>{u.date_joined || 'Recent'}</td>
                    <td>
                      <span style={{ color: '#2E7D32', fontWeight: 600, fontSize: '11px' }}>
                        ✓ FULL BOUTIQUE CLEARANCE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
           MODAL: ADD NEW CATALOG PIECE
           ========================================================================= */}
      {showAddModal && (
        <div className="modal-overlay-luxury" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-box-luxury"
            style={{ maxWidth: '880px', width: '100%', maxHeight: '92vh', overflowY: 'auto', borderRadius: '2px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleAddSubmit}>
              <div className="modal-header-luxury" style={{ padding: '20px 28px', borderBottom: '1px solid #ECEAE5' }}>
                <div>
                  <h5 className="modal-title-luxury" style={{ fontSize: '18px', margin: 0, letterSpacing: '0.04em' }}>
                    Add New Catalog Piece
                  </h5>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#767676' }}>
                    Register a new piece with multiple gallery photos and colour variants directly to store database &amp; website storefront.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '24px 28px' }}>
                {/* ==============================================================
                    SECTION 1: CORE SPECIFICATIONS & PRICING
                    ============================================================== */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#141414', borderBottom: '1px solid #ECEAE5', paddingBottom: '6px', marginBottom: '14px' }}>
                    1. Piece Specifications &amp; Pricing
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '14px' }}>
                    <div style={{ gridColumn: 'span 8' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Piece Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mr Caiman Midi"
                        value={addForm.name}
                        onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Category *
                      </label>
                      <select
                        value={addForm.category}
                        onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Price ($ USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 689.00"
                        value={addForm.price}
                        onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Total Stock Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={
                          addColors.length > 0
                            ? addColors.reduce((acc, c) => acc + (Number(c.stock) || 0), 0)
                            : addForm.stock_quantity
                        }
                        onChange={(e) => setAddForm({ ...addForm, stock_quantity: parseInt(e.target.value, 10) || 0 })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                      <span style={{ fontSize: '10px', color: '#767676' }}>
                        {addColors.length > 0 ? '(Sum of colour variant stocks)' : 'Units in stock'}
                      </span>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        SKU (Auto-assigned if blank)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VEL-BAG99"
                        value={addForm.sku}
                        onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Available Sizes
                      </label>
                      <input
                        type="text"
                        value={addForm.available_sizes}
                        onChange={(e) => setAddForm({ ...addForm, available_sizes: e.target.value })}
                        placeholder="e.g. One Size or 36, 37, 38, 39, 40"
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Material Specifications
                      </label>
                      <input
                        type="text"
                        value={addForm.material}
                        onChange={(e) => setAddForm({ ...addForm, material: e.target.value })}
                        placeholder="e.g. 100% French Calfskin, Solid Brass Hardware"
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 12' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Detailed atelier description of the piece, silhouette, craftsmanship..."
                        value={addForm.description}
                        onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 12' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={addForm.is_active}
                          onChange={(e) => setAddForm({ ...addForm, is_active: e.target.checked })}
                        />
                        <span style={{ fontWeight: 500 }}>Active in Live Boutique Storefront</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* ==============================================================
                    SECTION 2: COLOUR VARIANTS & DEDICATED PHOTO STACKS
                    ============================================================== */}
                <div style={{ background: '#FFF', border: '1px solid #ECEAE5', padding: '18px 20px', borderRadius: '2px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#141414' }}>
                        2. Colour Variants &amp; Dedicated Photo Stacks ({addColors.length} Colours)
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>
                        Each colour variant has its own dedicated vertical photo stack for seamless storefront switching.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newVariant: ColorVariantItem = {
                          name: `New Variant #${addColors.length + 1}`,
                          code: '#56382D',
                          stock: 5,
                          primary: '',
                          images: []
                        };
                        setAddColors([...addColors, newVariant]);
                        setSelectedAddColorTab(addColors.length);
                      }}
                      style={{
                        background: '#FAF9F6',
                        color: '#141414',
                        border: '1px solid #D5D2CB',
                        padding: '7px 14px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontSize: '14px', lineHeight: '12px' }}>+</span> ADD COLOUR VARIANT
                    </button>
                  </div>

                  {/* Horizontal Colour Variant Switcher Tabs */}
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px', borderBottom: '1px solid #ECEAE5' }}>
                    {addColors.map((col, idx) => {
                      const isSelected = selectedAddColorTab === idx;
                      const count = col.images ? col.images.length : 0;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedAddColorTab(idx)}
                          style={{
                            background: isSelected ? '#141414' : '#FAF9F6',
                            color: isSelected ? '#FFF' : '#333',
                            border: isSelected ? '1px solid #141414' : '1px solid #E5E2DC',
                            borderRadius: '20px',
                            padding: '6px 14px',
                            fontSize: '11.5px',
                            fontWeight: isSelected ? 600 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: col.code || '#141414',
                              border: isSelected ? '1.5px solid #FFF' : '1px solid rgba(0,0,0,0.25)',
                              display: 'inline-block'
                            }}
                          />
                          <span>{col.name || `Variant ${idx + 1}`}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              opacity: isSelected ? 0.95 : 0.65,
                              background: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.06)',
                              padding: '1px 6px',
                              borderRadius: '10px'
                            }}
                          >
                            {count} {count === 1 ? 'photo' : 'photos'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Selected Colour Variant Controls & Photo Stack */}
                  {addColors[selectedAddColorTab] ? (
                    <div style={{ background: '#FAF9F6', border: '1px solid #ECEAE5', padding: '16px 18px', borderRadius: '2px' }}>
                      {/* Colour Metadata Strip */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <div style={{ gridColumn: 'span 4' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#555' }}>
                            Colour Variant Name
                          </label>
                          <input
                            type="text"
                            value={addColors[selectedAddColorTab].name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAddColors((prev) => {
                                const next = [...prev];
                                next[selectedAddColorTab] = { ...next[selectedAddColorTab], name: val };
                                return next;
                              });
                            }}
                            placeholder="e.g. Black Raffia or Hazel Suede"
                            style={{ width: '100%', padding: '7px 9px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                          />
                        </div>

                        <div style={{ gridColumn: 'span 3' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#555' }}>
                            Swatch Hex Code
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="color"
                              value={addColors[selectedAddColorTab].code.startsWith('#') && addColors[selectedAddColorTab].code.length === 7 ? addColors[selectedAddColorTab].code : '#141414'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAddColors((prev) => {
                                  const next = [...prev];
                                  next[selectedAddColorTab] = { ...next[selectedAddColorTab], code: val };
                                  return next;
                                });
                              }}
                              style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                              title="Pick colour"
                            />
                            <input
                              type="text"
                              value={addColors[selectedAddColorTab].code}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAddColors((prev) => {
                                  const next = [...prev];
                                  next[selectedAddColorTab] = { ...next[selectedAddColorTab], code: val };
                                  return next;
                                });
                              }}
                              style={{ flex: 1, padding: '7px 9px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                            />
                          </div>
                        </div>

                        <div style={{ gridColumn: 'span 3' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#555' }}>
                            Variant Stock Qty
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={addColors[selectedAddColorTab].stock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setAddColors((prev) => {
                                const next = [...prev];
                                next[selectedAddColorTab] = { ...next[selectedAddColorTab], stock: val };
                                return next;
                              });
                            }}
                            style={{ width: '100%', padding: '7px 9px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                          />
                        </div>

                        <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                          {addColors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = addColors.filter((_, i) => i !== selectedAddColorTab);
                                setAddColors(filtered);
                                setSelectedAddColorTab(Math.max(0, selectedAddColorTab - 1));
                              }}
                              style={{
                                background: '#FFF',
                                border: '1px solid #E57373',
                                color: '#C62828',
                                padding: '7px 10px',
                                fontSize: '10.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                borderRadius: '2px',
                                width: '100%'
                              }}
                              title="Delete this colour variant"
                            >
                              ✕ Remove Colour
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dedicated Photo Stack Section */}
                      <div style={{ borderTop: '1px solid #ECEAE5', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#141414' }}>
                              Photo Stack for {addColors[selectedAddColorTab].name || `Variant #${selectedAddColorTab + 1}`} ({addColors[selectedAddColorTab].images?.length || 0} Photos)
                            </span>
                            <div style={{ fontSize: '10.5px', color: '#767676', marginTop: '2px' }}>
                              These photos appear in the seamless vertical hero stack when customer selects "{addColors[selectedAddColorTab].name}".
                            </div>
                          </div>
                          <span style={{ fontSize: '10px', color: '#666' }}>
                            Use [◀] [▶] to arrange angles • [Primary] sets thumbnail
                          </span>
                        </div>

                        {/* Visual Photos Grid for Active Colour */}
                        {(!addColors[selectedAddColorTab].images || addColors[selectedAddColorTab].images!.length === 0) ? (
                          <div style={{ padding: '28px 16px', textAlign: 'center', background: '#FFF', border: '1px dashed #D5D2CB', marginBottom: '14px', color: '#888', fontSize: '12px' }}>
                            No photos added yet for this colour variant. Add photo URLs or /media paths below.
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                            {addColors[selectedAddColorTab].images!.map((imgUrl, imgIdx) => {
                              const isPrimary = imgIdx === 0;
                              const cleanSrc = imgUrl.startsWith('http') || imgUrl.startsWith('/') ? imgUrl : `/media/${imgUrl}`;
                              return (
                                <div
                                  key={imgIdx}
                                  style={{
                                    position: 'relative',
                                    background: '#FFF',
                                    border: isPrimary ? '2px solid #141414' : '1px solid #D5D2CB',
                                    padding: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: isPrimary ? '0 2px 6px rgba(0,0,0,0.12)' : 'none'
                                  }}
                                >
                                  {isPrimary && (
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: '6px',
                                        left: '6px',
                                        background: '#141414',
                                        color: '#FFF',
                                        fontSize: '8px',
                                        fontWeight: 700,
                                        padding: '2px 5px',
                                        letterSpacing: '0.06em',
                                        zIndex: 2
                                      }}
                                    >
                                      PRIMARY
                                    </span>
                                  )}
                                  {/* Delete Photo Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAddColors((prev) => {
                                        const next = [...prev];
                                        const currImgs = next[selectedAddColorTab].images || [];
                                        const filtered = currImgs.filter((_, i) => i !== imgIdx);
                                        next[selectedAddColorTab] = {
                                          ...next[selectedAddColorTab],
                                          images: filtered,
                                          primary: filtered[0] || ''
                                        };
                                        return next;
                                      });
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '4px',
                                      right: '4px',
                                      background: 'rgba(0,0,0,0.65)',
                                      color: '#FFF',
                                      border: 'none',
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '10px',
                                      cursor: 'pointer',
                                      zIndex: 2
                                    }}
                                    title="Delete photo from this colour"
                                  >
                                    ✕
                                  </button>

                                  <img
                                    src={cleanSrc}
                                    alt={`Angle ${imgIdx + 1}`}
                                    style={{ width: '100%', height: '110px', objectFit: 'cover', background: '#F4F3F0' }}
                                    onError={(e) => {
                                      e.currentTarget.src = '/media/editorial/cat_shoulder.jpg';
                                    }}
                                  />

                                  {/* Controls below image */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '9px', color: '#767676' }}>Angle #{imgIdx + 1}</span>
                                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                      {/* Move Left / Earlier */}
                                      {imgIdx > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAddColors((prev) => {
                                              const next = [...prev];
                                              const list = [...(next[selectedAddColorTab].images || [])];
                                              const temp = list[imgIdx - 1];
                                              list[imgIdx - 1] = list[imgIdx];
                                              list[imgIdx] = temp;
                                              next[selectedAddColorTab] = { ...next[selectedAddColorTab], images: list, primary: list[0] || '' };
                                              return next;
                                            });
                                          }}
                                          style={{ background: '#FAF9F6', border: '1px solid #D5D2CB', fontSize: '9px', padding: '1px 3px', cursor: 'pointer', lineHeight: '10px' }}
                                          title="Move earlier in stack"
                                        >
                                          ◀
                                        </button>
                                      )}
                                      {/* Move Right / Later */}
                                      {imgIdx < addColors[selectedAddColorTab].images!.length - 1 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAddColors((prev) => {
                                              const next = [...prev];
                                              const list = [...(next[selectedAddColorTab].images || [])];
                                              const temp = list[imgIdx + 1];
                                              list[imgIdx + 1] = list[imgIdx];
                                              list[imgIdx] = temp;
                                              next[selectedAddColorTab] = { ...next[selectedAddColorTab], images: list, primary: list[0] || '' };
                                              return next;
                                            });
                                          }}
                                          style={{ background: '#FAF9F6', border: '1px solid #D5D2CB', fontSize: '9px', padding: '1px 3px', cursor: 'pointer', lineHeight: '10px' }}
                                          title="Move later in stack"
                                        >
                                          ▶
                                        </button>
                                      )}
                                      {!isPrimary && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAddColors((prev) => {
                                              const next = [...prev];
                                              const currImgs = next[selectedAddColorTab].images || [];
                                              const rest = currImgs.filter((_, i) => i !== imgIdx);
                                              const reordered = [imgUrl, ...rest];
                                              next[selectedAddColorTab] = {
                                                ...next[selectedAddColorTab],
                                                images: reordered,
                                                primary: imgUrl
                                              };
                                              return next;
                                            });
                                          }}
                                          style={{ background: 'none', border: 'none', fontSize: '9px', color: '#141414', textDecoration: 'underline', cursor: 'pointer', padding: 0, marginLeft: '3px' }}
                                          title="Set as primary photo for this colour"
                                        >
                                          Primary
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add Photo Bar specifically to THIS selected colour */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder={`Add photo URL or /media path to ${addColors[selectedAddColorTab].name || 'this colour'}...`}
                            value={newAddColorPhotoUrl}
                            onChange={(e) => setNewAddColorPhotoUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = newAddColorPhotoUrl.trim();
                                if (trimmed) {
                                  setAddColors((prev) => {
                                    const next = [...prev];
                                    const curr = next[selectedAddColorTab].images || [];
                                    if (!curr.includes(trimmed)) {
                                      const updated = [...curr, trimmed];
                                      next[selectedAddColorTab] = {
                                        ...next[selectedAddColorTab],
                                        images: updated,
                                        primary: next[selectedAddColorTab].primary || updated[0]
                                      };
                                    }
                                    return next;
                                  });
                                  setNewAddColorPhotoUrl('');
                                }
                              }
                            }}
                            style={{ flex: 1, padding: '7px 10px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = newAddColorPhotoUrl.trim();
                              if (trimmed) {
                                setAddColors((prev) => {
                                  const next = [...prev];
                                  const curr = next[selectedAddColorTab].images || [];
                                  if (!curr.includes(trimmed)) {
                                    const updated = [...curr, trimmed];
                                    next[selectedAddColorTab] = {
                                      ...next[selectedAddColorTab],
                                      images: updated,
                                      primary: next[selectedAddColorTab].primary || updated[0]
                                    };
                                  }
                                  return next;
                                });
                                setNewAddColorPhotoUrl('');
                              }
                            }}
                            style={{
                              background: '#141414',
                              color: '#FFF',
                              border: 'none',
                              padding: '7px 14px',
                              fontSize: '11px',
                              fontWeight: 600,
                              letterSpacing: '0.04em',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            + ADD PHOTO TO {addColors[selectedAddColorTab].name.toUpperCase() || 'COLOUR'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="modal-footer-luxury" style={{ padding: '16px 28px', borderTop: '1px solid #ECEAE5', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: '#FFF', border: '1px solid #CCC', padding: '8px 20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="btn-provider-action"
                  style={{ minWidth: '180px' }}
                >
                  {submittingAdd ? 'CREATING & SYNCHRONIZING...' : 'CREATE & SAVE PIECE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editProduct && (
        <div className="modal-overlay-luxury" onClick={() => setShowEditModal(false)}>
          <div
            className="modal-box-luxury"
            style={{ maxWidth: '880px', width: '100%', maxHeight: '92vh', overflowY: 'auto', borderRadius: '2px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleEditSubmit}>
              <div className="modal-header-luxury" style={{ padding: '20px 28px', borderBottom: '1px solid #ECEAE5' }}>
                <div>
                  <h5 className="modal-title-luxury" style={{ fontSize: '18px', margin: 0, letterSpacing: '0.04em' }}>
                    Edit Piece: {editProduct.name}
                  </h5>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#767676' }}>
                    Update specifications, multiple gallery photos, and color variants with instant storefront synchronization.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '24px 28px' }}>
                {/* ==============================================================
                    SECTION 1: CORE SPECIFICATIONS & PRICING
                    ============================================================== */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#141414', borderBottom: '1px solid #ECEAE5', paddingBottom: '6px', marginBottom: '14px' }}>
                    1. Piece Specifications &amp; Pricing
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '14px' }}>
                    <div style={{ gridColumn: 'span 8' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Piece Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Category *
                      </label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Price ($ USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Total Stock Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={
                          editColors.length > 0
                            ? editColors.reduce((acc, c) => acc + (Number(c.stock) || 0), 0)
                            : editForm.stock_quantity
                        }
                        onChange={(e) => setEditForm({ ...editForm, stock_quantity: parseInt(e.target.value, 10) || 0 })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                      <span style={{ fontSize: '10px', color: '#767676' }}>
                        {editColors.length > 0 ? '(Sum of color variant stocks)' : 'Units in stock'}
                      </span>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        SKU
                      </label>
                      <input
                        type="text"
                        value={editForm.sku}
                        onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Available Sizes
                      </label>
                      <input
                        type="text"
                        value={editForm.available_sizes}
                        onChange={(e) => setEditForm({ ...editForm, available_sizes: e.target.value })}
                        placeholder="e.g. One Size or 36, 37, 38, 39, 40"
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Material Specifications
                      </label>
                      <input
                        type="text"
                        value={editForm.material}
                        onChange={(e) => setEditForm({ ...editForm, material: e.target.value })}
                        placeholder="e.g. 100% French Calfskin, Solid Brass Hardware"
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 12' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #D5D2CB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 12' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editForm.is_active}
                          onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                        />
                        <span style={{ fontWeight: 500 }}>Active in Live Boutique Storefront</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* ==============================================================
                    SECTION 2: COLOUR VARIANTS & DEDICATED PHOTO STACKS
                    ============================================================== */}
                <div style={{ background: '#FFF', border: '1px solid #ECEAE5', padding: '18px 20px', borderRadius: '2px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#141414' }}>
                        2. Colour Variants &amp; Dedicated Photo Stacks ({editColors.length} Colours)
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>
                        Each colour variant maintains its own dedicated photo stack. Click each colour tab to manage its photos, swatch code, and stock separately.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newVariant: ColorVariantItem = {
                          name: `New Variant #${editColors.length + 1}`,
                          code: '#56382D',
                          stock: 5,
                          primary: '',
                          images: []
                        };
                        setEditColors([...editColors, newVariant]);
                        setSelectedColorTab(editColors.length);
                      }}
                      style={{
                        background: '#FAF9F6',
                        color: '#141414',
                        border: '1px solid #D5D2CB',
                        padding: '7px 14px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontSize: '14px', lineHeight: '12px' }}>+</span> ADD COLOUR VARIANT
                    </button>
                  </div>

                  {/* Horizontal Colour Variant Switcher Tabs */}
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px', borderBottom: '1px solid #ECEAE5' }}>
                    {editColors.map((col, idx) => {
                      const isSelected = selectedColorTab === idx;
                      const count = col.images ? col.images.length : 0;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColorTab(idx)}
                          style={{
                            background: isSelected ? '#141414' : '#FAF9F6',
                            color: isSelected ? '#FFF' : '#333',
                            border: isSelected ? '1px solid #141414' : '1px solid #E5E2DC',
                            borderRadius: '20px',
                            padding: '6px 14px',
                            fontSize: '11.5px',
                            fontWeight: isSelected ? 600 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: col.code || '#141414',
                              border: isSelected ? '1.5px solid #FFF' : '1px solid rgba(0,0,0,0.25)',
                              display: 'inline-block'
                            }}
                          />
                          <span>{col.name || `Variant ${idx + 1}`}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              opacity: isSelected ? 0.95 : 0.65,
                              background: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.06)',
                              padding: '1px 6px',
                              borderRadius: '10px'
                            }}
                          >
                            {count} {count === 1 ? 'photo' : 'photos'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Selected Colour Variant Controls & Photo Stack */}
                  {editColors[selectedColorTab] ? (
                    <div style={{ background: '#FAF9F6', border: '1px solid #ECEAE5', padding: '16px 18px', borderRadius: '2px' }}>
                      {/* Colour Metadata Strip */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <div style={{ gridColumn: 'span 4' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#555' }}>
                            Colour Variant Name
                          </label>
                          <input
                            type="text"
                            value={editColors[selectedColorTab].name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditColors((prev) => {
                                const next = [...prev];
                                next[selectedColorTab] = { ...next[selectedColorTab], name: val };
                                return next;
                              });
                            }}
                            placeholder="e.g. Black Raffia or Hazel Suede"
                            style={{ width: '100%', padding: '7px 9px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                          />
                        </div>

                        <div style={{ gridColumn: 'span 3' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#555' }}>
                            Swatch Hex Code
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="color"
                              value={editColors[selectedColorTab].code.startsWith('#') && editColors[selectedColorTab].code.length === 7 ? editColors[selectedColorTab].code : '#141414'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditColors((prev) => {
                                  const next = [...prev];
                                  next[selectedColorTab] = { ...next[selectedColorTab], code: val };
                                  return next;
                                });
                              }}
                              style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                              title="Pick colour"
                            />
                            <input
                              type="text"
                              value={editColors[selectedColorTab].code}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditColors((prev) => {
                                  const next = [...prev];
                                  next[selectedColorTab] = { ...next[selectedColorTab], code: val };
                                  return next;
                                });
                              }}
                              style={{ flex: 1, padding: '7px 9px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                            />
                          </div>
                        </div>

                        <div style={{ gridColumn: 'span 3' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', color: '#555' }}>
                            Variant Stock Qty
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={editColors[selectedColorTab].stock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setEditColors((prev) => {
                                const next = [...prev];
                                next[selectedColorTab] = { ...next[selectedColorTab], stock: val };
                                return next;
                              });
                            }}
                            style={{ width: '100%', padding: '7px 9px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                          />
                        </div>

                        <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                          {editColors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = editColors.filter((_, i) => i !== selectedColorTab);
                                setEditColors(filtered);
                                setSelectedColorTab(Math.max(0, selectedColorTab - 1));
                              }}
                              style={{
                                background: '#FFF',
                                border: '1px solid #E57373',
                                color: '#C62828',
                                padding: '7px 10px',
                                fontSize: '10.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                borderRadius: '2px',
                                width: '100%'
                              }}
                              title="Delete this colour variant"
                            >
                              ✕ Remove Colour
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dedicated Photo Stack Section */}
                      <div style={{ borderTop: '1px solid #ECEAE5', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#141414' }}>
                              Photo Stack for {editColors[selectedColorTab].name || `Variant #${selectedColorTab + 1}`} ({editColors[selectedColorTab].images?.length || 0} Photos)
                            </span>
                            <div style={{ fontSize: '10.5px', color: '#767676', marginTop: '2px' }}>
                              These photos appear in the seamless vertical hero stack when customer selects "{editColors[selectedColorTab].name}".
                            </div>
                          </div>
                          <span style={{ fontSize: '10px', color: '#666' }}>
                            Use [◀] [▶] to arrange angles • [Primary] sets thumbnail
                          </span>
                        </div>

                        {/* Visual Photos Grid for Active Colour */}
                        {(!editColors[selectedColorTab].images || editColors[selectedColorTab].images!.length === 0) ? (
                          <div style={{ padding: '28px 16px', textAlign: 'center', background: '#FFF', border: '1px dashed #D5D2CB', marginBottom: '14px', color: '#888', fontSize: '12px' }}>
                            No photos added yet for this colour variant. Add photo URLs or /media paths below.
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                            {editColors[selectedColorTab].images!.map((imgUrl, imgIdx) => {
                              const isPrimary = imgIdx === 0;
                              const cleanSrc = imgUrl.startsWith('http') || imgUrl.startsWith('/') ? imgUrl : `/media/${imgUrl}`;
                              return (
                                <div
                                  key={imgIdx}
                                  style={{
                                    position: 'relative',
                                    background: '#FFF',
                                    border: isPrimary ? '2px solid #141414' : '1px solid #D5D2CB',
                                    padding: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: isPrimary ? '0 2px 6px rgba(0,0,0,0.12)' : 'none'
                                  }}
                                >
                                  {isPrimary && (
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: '6px',
                                        left: '6px',
                                        background: '#141414',
                                        color: '#FFF',
                                        fontSize: '8px',
                                        fontWeight: 700,
                                        padding: '2px 5px',
                                        letterSpacing: '0.06em',
                                        zIndex: 2
                                      }}
                                    >
                                      PRIMARY
                                    </span>
                                  )}
                                  {/* Delete Photo Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditColors((prev) => {
                                        const next = [...prev];
                                        const currImgs = next[selectedColorTab].images || [];
                                        const filtered = currImgs.filter((_, i) => i !== imgIdx);
                                        next[selectedColorTab] = {
                                          ...next[selectedColorTab],
                                          images: filtered,
                                          primary: filtered[0] || ''
                                        };
                                        return next;
                                      });
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: '4px',
                                      right: '4px',
                                      background: 'rgba(0,0,0,0.65)',
                                      color: '#FFF',
                                      border: 'none',
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '10px',
                                      cursor: 'pointer',
                                      zIndex: 2
                                    }}
                                    title="Delete photo from this colour"
                                  >
                                    ✕
                                  </button>

                                  <img
                                    src={cleanSrc}
                                    alt={`Angle ${imgIdx + 1}`}
                                    style={{ width: '100%', height: '110px', objectFit: 'cover', background: '#F4F3F0' }}
                                    onError={(e) => {
                                      e.currentTarget.src = '/media/editorial/cat_shoulder.jpg';
                                    }}
                                  />

                                  {/* Controls below image */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '9px', color: '#767676' }}>Angle #{imgIdx + 1}</span>
                                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                      {/* Move Left / Earlier */}
                                      {imgIdx > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditColors((prev) => {
                                              const next = [...prev];
                                              const list = [...(next[selectedColorTab].images || [])];
                                              const temp = list[imgIdx - 1];
                                              list[imgIdx - 1] = list[imgIdx];
                                              list[imgIdx] = temp;
                                              next[selectedColorTab] = { ...next[selectedColorTab], images: list, primary: list[0] || '' };
                                              return next;
                                            });
                                          }}
                                          style={{ background: '#FAF9F6', border: '1px solid #D5D2CB', fontSize: '9px', padding: '1px 3px', cursor: 'pointer', lineHeight: '10px' }}
                                          title="Move earlier in stack"
                                        >
                                          ◀
                                        </button>
                                      )}
                                      {/* Move Right / Later */}
                                      {imgIdx < editColors[selectedColorTab].images!.length - 1 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditColors((prev) => {
                                              const next = [...prev];
                                              const list = [...(next[selectedColorTab].images || [])];
                                              const temp = list[imgIdx + 1];
                                              list[imgIdx + 1] = list[imgIdx];
                                              list[imgIdx] = temp;
                                              next[selectedColorTab] = { ...next[selectedColorTab], images: list, primary: list[0] || '' };
                                              return next;
                                            });
                                          }}
                                          style={{ background: '#FAF9F6', border: '1px solid #D5D2CB', fontSize: '9px', padding: '1px 3px', cursor: 'pointer', lineHeight: '10px' }}
                                          title="Move later in stack"
                                        >
                                          ▶
                                        </button>
                                      )}
                                      {!isPrimary && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditColors((prev) => {
                                              const next = [...prev];
                                              const currImgs = next[selectedColorTab].images || [];
                                              const rest = currImgs.filter((_, i) => i !== imgIdx);
                                              const reordered = [imgUrl, ...rest];
                                              next[selectedColorTab] = {
                                                ...next[selectedColorTab],
                                                images: reordered,
                                                primary: imgUrl
                                              };
                                              return next;
                                            });
                                          }}
                                          style={{ background: 'none', border: 'none', fontSize: '9px', color: '#141414', textDecoration: 'underline', cursor: 'pointer', padding: 0, marginLeft: '3px' }}
                                          title="Set as primary photo for this colour"
                                        >
                                          Primary
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add Photo Bar specifically to THIS selected colour */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder={`Add photo URL or /media path to ${editColors[selectedColorTab].name || 'this colour'}...`}
                            value={newColorPhotoUrl}
                            onChange={(e) => setNewColorPhotoUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = newColorPhotoUrl.trim();
                                if (trimmed) {
                                  setEditColors((prev) => {
                                    const next = [...prev];
                                    const curr = next[selectedColorTab].images || [];
                                    if (!curr.includes(trimmed)) {
                                      const updated = [...curr, trimmed];
                                      next[selectedColorTab] = {
                                        ...next[selectedColorTab],
                                        images: updated,
                                        primary: next[selectedColorTab].primary || updated[0]
                                      };
                                    }
                                    return next;
                                  });
                                  setNewColorPhotoUrl('');
                                }
                              }
                            }}
                            style={{ flex: 1, padding: '7px 10px', border: '1px solid #D5D2CB', fontSize: '12px', background: '#FFF' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = newColorPhotoUrl.trim();
                              if (trimmed) {
                                setEditColors((prev) => {
                                  const next = [...prev];
                                  const curr = next[selectedColorTab].images || [];
                                  if (!curr.includes(trimmed)) {
                                    const updated = [...curr, trimmed];
                                    next[selectedColorTab] = {
                                      ...next[selectedColorTab],
                                      images: updated,
                                      primary: next[selectedColorTab].primary || updated[0]
                                    };
                                  }
                                  return next;
                                });
                                setNewColorPhotoUrl('');
                              }
                            }}
                            style={{
                              background: '#141414',
                              color: '#FFF',
                              border: 'none',
                              padding: '7px 14px',
                              fontSize: '11px',
                              fontWeight: 600,
                              letterSpacing: '0.04em',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            + ADD PHOTO TO {editColors[selectedColorTab].name.toUpperCase() || 'COLOUR'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="modal-footer-luxury" style={{ padding: '16px 28px', borderTop: '1px solid #ECEAE5', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ background: '#FFF', border: '1px solid #CCC', padding: '8px 20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="btn-provider-action"
                  style={{ minWidth: '180px' }}
                >
                  {submittingEdit ? 'UPDATING & SYNCHRONIZING...' : 'SAVE MODIFICATIONS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
           MODAL: DELETE CONFIRMATION
           ========================================================================= */}
      {productToDelete && (
        <div className="modal-overlay-luxury" onClick={() => setProductToDelete(null)}>
          <div style={{ background: '#FFF', maxWidth: '440px', width: '100%', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '20px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              Confirm Catalog Deletion
            </h4>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Are you sure you want to remove <strong>{productToDelete.name}</strong> ({productToDelete.sku}) from the Velmora boutique catalog? This action will remove it from the live store database.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                style={{ background: '#FFF', border: '1px solid #CCC', padding: '8px 16px', fontSize: '11px', cursor: 'pointer' }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                style={{ background: '#C62828', color: '#FFF', border: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboardPage;
