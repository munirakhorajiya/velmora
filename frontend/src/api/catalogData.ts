// Authentic Velmora Catalog - 1:1 match from real Velmora storefront
export interface CatalogColor {
  name: string;
  variantTitle?: string;
  code: string;
  primary: string;
  alt: string;
  images: string[];
  stock?: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  variantTitle?: string;
  category: string;
  department: string;
  price: number;
  badge?: string;
  colors: CatalogColor[];
  description: string;
  features: string[];
  dimensions: string;
  materials: string;
  care?: string;
  stock_quantity?: number;
}

export const VELMORA_CATALOG: CatalogProduct[] = [

  {
    "id": "mini-sling-black-raffia",
    "name": "MINI SLING BAG",
    "variantTitle": "in Black Raffia/Black",
    "category": "Crossbody Bags",
    "department": "Bags",
    "price": 504,
    "badge": "New",
    "colors": [
      {
        "name": "Black Raffia/Black",
        "code": "#141414",
        "primary": "/media/products/Bags/sling/black_raffia_1.jpg",
        "alt": "/media/products/Bags/sling/black_raffia_2.jpg",
        "images": [
          "/media/products/Bags/sling/black_raffia_1.jpg",
          "/media/products/Bags/sling/black_raffia_2.jpg"
        ]
      },
      {
        "name": "Natural Raffia/Black",
        "code": "#D2A26F",
        "primary": "/media/products/Bags/sling/natural_raffia_1.jpg",
        "alt": "/media/products/Bags/sling/natural_raffia_2.jpg",
        "images": [
          "/media/products/Bags/sling/natural_raffia_1.jpg"
        ]
      },
      {
        "name": "Desert Python",
        "code": "#C5B29B",
        "primary": "/media/products/Bags/sling/desert_python_1.jpg",
        "alt": "/media/products/Bags/sling/desert_python_2.jpg",
        "images": [
          "/media/products/Bags/sling/desert_python_1.jpg"
        ]
      }
    ],
    "description": "The Mini Sling Bag is sculpted with an ergonomic curved silhouette, handcrafted in Madagascar natural raffia and trimmed with supple French calfskin.",
    "features": [
      "Handwoven natural raffia",
      "Solid brass hardware",
      "Interior slip pocket",
      "Adjustable shoulder strap"
    ],
    "dimensions": "26cm W x 14cm H x 6cm D",
    "materials": "Body: 100% Madagascar Raffia. Trim: 100% French Calfskin. Hardware: 100% Solid Brass."
  },
  {
    "id": "mini-sling-natural-raffia",
    "name": "MINI SLING BAG",
    "variantTitle": "in Natural Raffia/Black",
    "category": "Crossbody Bags",
    "department": "Bags",
    "price": 504,
    "badge": "New",
    "colors": [
      {
        "name": "Natural Raffia/Black",
        "code": "#D2A26F",
        "primary": "/media/products/Bags/sling/natural_raffia_1.jpg",
        "alt": "/media/products/Bags/sling/natural_raffia_2.jpg",
        "images": [
          "/media/products/Bags/sling/natural_raffia_1.jpg"
        ]
      },
      {
        "name": "Black Raffia/Black",
        "code": "#141414",
        "primary": "/media/products/Bags/sling/black_raffia_1.jpg",
        "alt": "/media/products/Bags/sling/black_raffia_2.jpg",
        "images": [
          "/media/products/Bags/sling/black_raffia_1.jpg"
        ]
      },
      {
        "name": "Ochre",
        "code": "#C68B3C",
        "primary": "/media/products/Bags/sling/milk_1.jpg",
        "alt": "",
        "images": []
      }
    ],
    "description": "Handcrafted in natural golden raffia with contrast black leather strap.",
    "features": [
      "Handwoven natural raffia",
      "Contrast calfskin strap"
    ],
    "dimensions": "26cm W x 14cm H x 6cm D",
    "materials": "Body: 100% Natural Raffia. Trim: 100% Calfskin."
  },
  {
    "id": "mini-sling-desert-python",
    "name": "MINI SLING BAG",
    "variantTitle": "in Desert Python",
    "category": "Crossbody Bags",
    "department": "Bags",
    "price": 630,
    "badge": "New",
    "colors": [
      {
        "name": "Desert Python",
        "code": "#C5B29B",
        "primary": "/media/products/Bags/sling/desert_python_1.jpg",
        "alt": "/media/products/Bags/sling/desert_python_2.jpg",
        "images": [
          "/media/products/Bags/sling/desert_python_1.jpg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/sling/black_raffia_1.jpg",
        "alt": "",
        "images": []
      },
      {
        "name": "Ochre",
        "code": "#C68B3C",
        "primary": "/media/products/Bags/sling/milk_1.jpg",
        "alt": "",
        "images": []
      }
    ],
    "description": "Printed desert python leather with tactile scale texture.",
    "features": [
      "Printed python calfskin",
      "Brass hardware"
    ],
    "dimensions": "26cm W x 14cm H x 6cm D",
    "materials": "100% Embossed Python Calfskin."
  },
  {
    "id": "mini-sling-milk",
    "name": "MINI SLING BAG",
    "variantTitle": "in Milk",
    "category": "Crossbody Bags",
    "department": "Bags",
    "price": 504,
    "badge": "New",
    "colors": [
      {
        "name": "Milk",
        "code": "#EFECE6",
        "primary": "/media/products/Bags/sling/milk_1.jpg",
        "alt": "/media/products/Bags/sling/milk_2.jpg",
        "images": [
          "/media/products/Bags/sling/milk_1.jpg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/sling/black_raffia_1.jpg",
        "alt": "",
        "images": []
      },
      {
        "name": "Ochre",
        "code": "#C68B3C",
        "primary": "/media/products/Bags/sling/natural_raffia_1.jpg",
        "alt": "",
        "images": []
      }
    ],
    "description": "Smooth full-grain calfskin leather in pure milk white.",
    "features": [
      "Smooth French calfskin",
      "Brass hardware"
    ],
    "dimensions": "26cm W x 14cm H x 6cm D",
    "materials": "100% Calfskin."
  },
  {
    "id": "bag1",
    "name": "Mr Caiman",
    "category": "Crossbody Bags",
    "department": "Bags",
    "price": 689,
    "badge": "Bestseller",
    "colors": [
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-1_51cd2259-dac3-4e1f-bf84-e7c638f8cabd.jpeg",
        "alt": "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-2.jpeg",
        "images": [
          "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-1_51cd2259-dac3-4e1f-bf84-e7c638f8cabd.jpeg",
          "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-2.jpeg",
          "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-3.jpeg",
          "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-4.jpeg",
          "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-5.jpeg",
          "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-6.jpeg",
          "/media/products/Bags/bag1/VELMORA-MR-CAIMAN-BLACK-BULLE-8.jpeg"
        ]
      },
      {
        "name": "Brown",
        "code": "#56382D",
        "primary": "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-1.jpeg",
        "alt": "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-10.jpeg",
        "images": [
          "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-1.jpeg",
          "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-3.jpeg",
          "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-4.jpeg",
          "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-6.jpeg",
          "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-7.jpeg",
          "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-9.jpeg",
          "/media/products/Bags/bag1/brown/VELMORA-MR-CAIMAN-JAVA-BULLE-10.jpeg"
        ]
      }
    ],
    "description": "The Mr Caiman embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag2",
    "name": "Mr Leopard",
    "category": "Shoulder Bags",
    "department": "Bags",
    "price": 799,
    "badge": "New Season",
    "colors": [
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-11_8d332524-0907-4062-8b63-4f14592453b6.jpeg",
        "alt": "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-12.jpeg",
        "images": [
          "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-11_8d332524-0907-4062-8b63-4f14592453b6.jpeg",
          "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-1_1.jpeg",
          "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-4_1.jpeg",
          "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-12.jpeg",
          "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-3_5304a7af-eb31-48c3-986e-6ded2fb0d06a.jpeg",
          "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-6_f5050f28-14e6-441e-965a-493f481661f3.jpeg",
          "/media/products/Bags/bag2/VELMORA-MR-LEOPARD-BLACK-9_631c7b8a-cf5c-4b7b-9c4c-2a80ab5c98b6.jpeg"
        ]
      },
      {
        "name": "Brown",
        "code": "#56382D",
        "primary": "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-1.jpeg",
        "alt": "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-2.jpeg",
        "images": [
          "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-1.jpeg",
          "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-2.jpeg",
          "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-4.jpeg",
          "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-5.jpeg",
          "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-6.jpeg",
          "/media/products/Bags/bag2/brown/VELMORA-LEOPARD-HOBO-COCOA-7.jpeg"
        ]
      }
    ],
    "description": "The Mr Leopard embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag3",
    "name": "Chopalopagus",
    "category": "Tote Bags",
    "department": "Bags",
    "price": 849,
    "badge": "Iconic",
    "colors": [
      {
        "name": "Brown",
        "code": "#8B6544",
        "primary": "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-1.jpeg",
        "alt": "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-2.jpeg",
        "images": [
          "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-1.jpeg",
          "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-2.jpeg",
          "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-3.jpeg",
          "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-5.jpeg",
          "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-6.jpeg",
          "/media/products/Bags/bag3/VELMORA-CHOPALOPAGUS-BAG-HAZEL-SUEDE-7.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-1.jpeg",
        "alt": "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-2.jpeg",
        "images": [
          "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-1.jpeg",
          "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-2.jpeg",
          "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-3.jpeg",
          "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-4.jpeg",
          "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-5.jpeg",
          "/media/products/Bags/bag3/black/VELMORA-CHOPALOPAGUS-BAG-BLACK-6.jpeg"
        ]
      }
    ],
    "description": "The Chopalopagus embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag4",
    "name": "Mini Chopalopagus",
    "category": "Crossbody Bags",
    "department": "Bags",
    "price": 529,
    "badge": "Limited Edition",
    "colors": [
      {
        "name": "White",
        "code": "#ECE6D8",
        "primary": "/media/products/Bags/bag4/VELMORA-MINI-CHOPALOPAGUS-BAG-LEMONADE-1.jpeg",
        "alt": "/media/products/Bags/bag4/VELMORA-MINI-CHOPALOPAGUS-BAG-LEMONADE-3.jpeg",
        "images": [
          "/media/products/Bags/bag4/VELMORA-MINI-CHOPALOPAGUS-BAG-LEMONADE-1.jpeg",
          "/media/products/Bags/bag4/VELMORA-MINI-CHOPALOPAGUS-BAG-LEMONADE-3.jpeg",
          "/media/products/Bags/bag4/VELMORA-MINI-CHOPALOPAGUS-BAG-LEMONADE-5.jpeg",
          "/media/products/Bags/bag4/VELMORA-MINI-CHOPALOPAGUS-BAG-LEMONADE-6.jpeg",
          "/media/products/Bags/bag4/VELMORA-MINI-CHOPALOPAGUS-BAG-LEMONADE-7.jpeg"
        ]
      },
      {
        "name": "Grey",
        "code": "#64625F",
        "primary": "/media/products/Bags/bag4/grey/VELMORA-MINI-CHOPALOPAGUS-BAG-PETROL-CALF-HAIR-1.jpeg",
        "alt": "/media/products/Bags/bag4/grey/VELMORA-MINI-CHOPALOPAGUS-BAG-PETROL-CALF-HAIR-2.jpeg",
        "images": [
          "/media/products/Bags/bag4/grey/VELMORA-MINI-CHOPALOPAGUS-BAG-PETROL-CALF-HAIR-1.jpeg",
          "/media/products/Bags/bag4/grey/VELMORA-MINI-CHOPALOPAGUS-BAG-PETROL-CALF-HAIR-2.jpeg",
          "/media/products/Bags/bag4/grey/VELMORA-MINI-CHOPALOPAGUS-BAG-PETROL-CALF-HAIR-3.jpeg",
          "/media/products/Bags/bag4/grey/VELMORA-MINI-CHOPALOPAGUS-BAG-PETROL-CALF-HAIR-4.jpeg",
          "/media/products/Bags/bag4/grey/VELMORA-MINI-CHOPALOPAGUS-BAG-PETROL-CALF-HAIR-5.jpeg"
        ]
      }
    ],
    "description": "The Mini Chopalopagus embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag5",
    "name": "Vault Clutch",
    "category": "Clutches & Pouches",
    "department": "Bags",
    "price": 449,
    "badge": "Evening",
    "colors": [
      {
        "name": "Brown",
        "code": "#8B6544",
        "primary": "/media/products/Bags/bag5/VELMORA-VAULT-CLUTCH-HAZEL-SUEDE-1.jpeg",
        "alt": "/media/products/Bags/bag5/VELMORA-VAULT-CLUTCH-HAZEL-SUEDE-2.jpeg",
        "images": [
          "/media/products/Bags/bag5/VELMORA-VAULT-CLUTCH-HAZEL-SUEDE-1.jpeg",
          "/media/products/Bags/bag5/VELMORA-VAULT-CLUTCH-HAZEL-SUEDE-2.jpeg",
          "/media/products/Bags/bag5/VELMORA-VAULT-CLUTCH-HAZEL-SUEDE-3.jpeg",
          "/media/products/Bags/bag5/VELMORA-VAULT-CLUTCH-HAZEL-SUEDE-5.jpeg",
          "/media/products/Bags/bag5/VELMORA-VAULT-CLUTCH-HAZEL-SUEDE-6.jpeg",
          "/media/products/Bags/bag5/VAULT-FAMILY-PDP-L.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-1.jpeg",
        "alt": "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-2_dfcb527f-b15e-4dfc-8b5d-950ad178b29c.jpeg",
        "images": [
          "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-1.jpeg",
          "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-4.jpeg",
          "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-8.jpeg",
          "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-9.jpeg",
          "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-2_dfcb527f-b15e-4dfc-8b5d-950ad178b29c.jpeg",
          "/media/products/Bags/bag5/black/VELMORA-MR-VAULT-BLACK-7_3b0c058b-0b98-4434-b0c9-812a1832f58b.jpeg"
        ]
      }
    ],
    "description": "The Vault Clutch embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag6",
    "name": "Mr Vault Tote",
    "category": "Tote Bags",
    "department": "Bags",
    "price": 995,
    "badge": "Handcrafted",
    "colors": [
      {
        "name": "Brown",
        "code": "#8B6544",
        "primary": "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-1.jpeg",
        "alt": "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-2.jpeg",
        "images": [
          "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-1.jpeg",
          "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-2.jpeg",
          "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-3.jpeg",
          "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-4.jpeg",
          "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-5.jpeg",
          "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-6.jpeg",
          "/media/products/Bags/bag6/VELMORA-VAULT-TOTE-HAZEL-SUEDE-7.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-1.jpeg",
        "alt": "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-3.jpeg",
        "images": [
          "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-1.jpeg",
          "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-3.jpeg",
          "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-5.jpeg",
          "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-6.jpeg",
          "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-7.jpeg",
          "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-8.jpeg",
          "/media/products/Bags/bag6/black/VELMORA-MR-VAULT-TOTE-BLACK-SUEDE-9.jpeg"
        ]
      }
    ],
    "description": "The Mr Vault Tote embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag7",
    "name": "Clippity Tote",
    "category": "Tote Bags",
    "department": "Bags",
    "price": 890,
    "badge": "Signature",
    "colors": [
      {
        "name": "Grey",
        "code": "#64625F",
        "primary": "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-1 (1).jpeg",
        "alt": "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-1.jpeg",
        "images": [
          "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-1.jpeg",
          "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-2.jpeg",
          "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-3.jpeg",
          "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-4.jpeg",
          "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-5.jpeg",
          "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-6.jpeg",
          "/media/products/Bags/bag7/VELMORA-CLIPPITY-TOTE-ASPHALT-SUEDE-7.jpeg"
        ]
      },
      {
        "name": "Brown",
        "code": "#56382D",
        "primary": "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-1 (1).jpeg",
        "alt": "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-1.jpeg",
        "images": [
          "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-1.jpeg",
          "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-2.jpeg",
          "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-3.jpeg",
          "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-4.jpeg",
          "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-5.jpeg",
          "/media/products/Bags/bag7/brown/VELMORA-CLIPPITY-TOTE-COCOA-6.jpeg"
        ]
      }
    ],
    "description": "The Clippity Tote embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag8",
    "name": "Mr Siamese",
    "category": "Shoulder Bags",
    "department": "Bags",
    "price": 749,
    "badge": "Multicolor Icon",
    "colors": [
      {
        "name": "Cheetah",
        "code": "#B8860B",
        "primary": "/media/products/Bags/bag8/VELMORA-MR-SIAMESE-CHEETAH-CALF-HAIR-2.jpeg",
        "alt": "/media/products/Bags/bag8/VELMORA-MR-SIAMESE-CHEETAH-CALF-HAIR-3.jpeg",
        "images": [
          "/media/products/Bags/bag8/VELMORA-MR-SIAMESE-CHEETAH-CALF-HAIR-2.jpeg",
          "/media/products/Bags/bag8/VELMORA-MR-SIAMESE-CHEETAH-CALF-HAIR-3.jpeg",
          "/media/products/Bags/bag8/VELMORA-MR-SIAMESE-CHEETAH-CALF-HAIR-5.jpeg",
          "/media/products/Bags/bag8/VELMORA-MR-SIAMESE-CHEETAH-CALF-HAIR-6.jpeg",
          "/media/products/Bags/bag8/VELMORA-MR-SIAMESE-CHEETAH-CALF-HAIR-7.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-1_ac83f9ca-5cca-474c-ab9a-4a7726435839.jpeg",
        "alt": "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-2_fd86a7d8-76f2-47cf-8324-eb0e858754b5.jpeg",
        "images": [
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-1_ac83f9ca-5cca-474c-ab9a-4a7726435839.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-SIAMESE-BAG-BLACK-5.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-2_fd86a7d8-76f2-47cf-8324-eb0e858754b5.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-3_051badce-186f-4bbe-a4af-08a3e45b3b88.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-4_18f929d7-fa35-423e-b524-72b51116b3f8.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-5_5f428971-81a7-4ebd-a7b6-dbad72ce6460.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-6_2d2e2e58-87f1-4510-8cab-b34077328b8b.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-7_ed2fecbb-1de8-47e6-89f3-d742067a8626.jpeg",
          "/media/products/Bags/bag8/black/VELMORA-MR-SIAMESE-BLACK-8_e65eec50-1b09-490c-af13-a9902c6a290e.jpeg"
        ]
      },
      {
        "name": "Blue",
        "code": "#385273",
        "primary": "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-1.jpeg",
        "alt": "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-2.jpeg",
        "images": [
          "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-1.jpeg",
          "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-2.jpeg",
          "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-3.jpeg",
          "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-4.jpeg",
          "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-6.jpeg",
          "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-7.jpeg",
          "/media/products/Bags/bag8/blue/VELMORA-MR-SIAMESE-IRIS-8.jpeg"
        ]
      },
      {
        "name": "Green",
        "code": "#566B57",
        "primary": "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-1 (1).jpeg",
        "alt": "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-1.jpeg",
        "images": [
          "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-1.jpeg",
          "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-2.jpeg",
          "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-3.jpeg",
          "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-4.jpeg",
          "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-5.jpeg",
          "/media/products/Bags/bag8/green/VELMORA-SIAMESE-BAG-SAGE-6.jpeg"
        ]
      },
      {
        "name": "White",
        "code": "#ECE6D8",
        "primary": "/media/products/Bags/bag8/white/VELMORA-MR-SIAMESE-COCONUT-1_a43e5d3f-6594-417e-b1b6-6a900d461898 (1).jpeg",
        "alt": "/media/products/Bags/bag8/white/VELMORA-MR-SIAMESE-COCONUT-1_a43e5d3f-6594-417e-b1b6-6a900d461898.jpeg",
        "images": [
          "/media/products/Bags/bag8/white/VELMORA-MR-SIAMESE-COCONUT-1_a43e5d3f-6594-417e-b1b6-6a900d461898.jpeg",
          "/media/products/Bags/bag8/white/VELMORA-MR-SIAMESE-COCONUT-2_58f392fb-bcb0-4937-8bea-b2ad9379614e.jpeg",
          "/media/products/Bags/bag8/white/VELMORA-MR-SIAMESE-COCONUT-3_acc7cfa3-3d88-4cb8-a3cb-f381483ac591.jpeg",
          "/media/products/Bags/bag8/white/VELMORA-MR-SIAMESE-COCONUT-4_5906470a-e6e3-4474-8170-3ada988b96ee.jpeg",
          "/media/products/Bags/bag8/white/VELMORA-MR-SIAMESE-COCONUT-5_36e72b82-237a-4c2e-a525-cca5fd010a2f.jpeg"
        ]
      }
    ],
    "description": "The Mr Siamese embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag9",
    "name": "Mini Miro Bag",
    "category": "Crossbody Bags",
    "department": "Bags",
    "price": 610,
    "badge": "Trending",
    "colors": [
      {
        "name": "Brown",
        "code": "#8B6544",
        "primary": "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-1_9dd13710-7471-43c5-be3a-b8a5eb046e64.jpeg",
        "alt": "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-2.jpeg",
        "images": [
          "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-1_9dd13710-7471-43c5-be3a-b8a5eb046e64.jpeg",
          "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-2.jpeg",
          "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-3.jpeg",
          "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-4.jpeg",
          "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-5.jpeg",
          "/media/products/Bags/bag9/VELMORA-MINI-MIRO-BAG-HAZEL-SUEDE-6.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-1.jpeg",
        "alt": "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-2.jpeg",
        "images": [
          "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-1.jpeg",
          "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-2.jpeg",
          "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-3.jpeg",
          "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-4.jpeg",
          "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-5.jpeg",
          "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-6.jpeg",
          "/media/products/Bags/bag9/black/VELMORA-MINI-MIRO-BAG-BLACK-7.jpeg"
        ]
      }
    ],
    "description": "The Mini Miro Bag embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag10",
    "name": "Penny Phone Pouch",
    "category": "Clutches & Pouches",
    "department": "Bags",
    "price": 389,
    "badge": "Micro Luxury",
    "colors": [
      {
        "name": "Cheetah",
        "code": "#B8860B",
        "primary": "/media/products/Bags/bag10/VELMORA-MR-PENNY-POUCHETTE-GINGERBREAD-SUEDE-71_dfdfdab9-c744-4cbe-89b5-8127094b4be2.jpeg",
        "alt": "/media/products/Bags/bag10/VELMORA-PENNY-PHONE-POUCH-HAZEL-SUEDE-1 (1).jpeg",
        "images": [
          "/media/products/Bags/bag10/VELMORA-MR-PENNY-POUCHETTE-GINGERBREAD-SUEDE-71_dfdfdab9-c744-4cbe-89b5-8127094b4be2.jpeg",
          "/media/products/Bags/bag10/VELMORA-PENNY-PHONE-POUCH-HAZEL-SUEDE-1.jpeg",
          "/media/products/Bags/bag10/VELMORA-PENNY-PHONE-POUCH-HAZEL-SUEDE-2.jpeg",
          "/media/products/Bags/bag10/VELMORA-PENNY-PHONE-POUCH-HAZEL-SUEDE-3.jpeg",
          "/media/products/Bags/bag10/VELMORA-PENNY-PHONE-POUCH-HAZEL-SUEDE-4.jpeg",
          "/media/products/Bags/bag10/VELMORA-PENNY-PHONE-POUCH-HAZEL-SUEDE-5.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag10/black/VELMORA-PENNY-PHONE-POUCH-SAGE-1 (1).jpeg",
        "alt": "/media/products/Bags/bag10/black/VELMORA-PENNY-PHONE-POUCH-SAGE-1.jpeg",
        "images": [
          "/media/products/Bags/bag10/black/VELMORA-PENNY-PHONE-POUCH-SAGE-1.jpeg",
          "/media/products/Bags/bag10/black/VELMORA-PENNY-PHONE-POUCH-SAGE-2.jpeg",
          "/media/products/Bags/bag10/black/VELMORA-PENNY-PHONE-POUCH-SAGE-3.jpeg",
          "/media/products/Bags/bag10/black/VELMORA-PENNY-PHONE-POUCH-SAGE-4.jpeg",
          "/media/products/Bags/bag10/black/VELMORA-PENNY-PHONE-POUCH-SAGE-5.jpeg"
        ]
      },
      {
        "name": "Offwhite",
        "code": "#EBE5D6",
        "primary": "/media/products/Bags/bag10/offwhite/VELMORA-PENNY-PHONE-POUCH-LEMONADE-1 (1).jpeg",
        "alt": "/media/products/Bags/bag10/offwhite/VELMORA-PENNY-PHONE-POUCH-LEMONADE-1.jpeg",
        "images": [
          "/media/products/Bags/bag10/offwhite/VELMORA-PENNY-PHONE-POUCH-LEMONADE-1.jpeg",
          "/media/products/Bags/bag10/offwhite/VELMORA-PENNY-PHONE-POUCH-LEMONADE-2.jpeg",
          "/media/products/Bags/bag10/offwhite/VELMORA-PENNY-PHONE-POUCH-LEMONADE-3.jpeg",
          "/media/products/Bags/bag10/offwhite/VELMORA-PENNY-PHONE-POUCH-LEMONADE-4.jpeg",
          "/media/products/Bags/bag10/offwhite/VELMORA-PENNY-PHONE-POUCH-LEMONADE-5.jpeg"
        ]
      }
    ],
    "description": "The Penny Phone Pouch embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "bag11",
    "name": "Zorro Briefcase",
    "category": "Work & Travel",
    "department": "Bags",
    "price": 1150,
    "badge": "Artisan Edition",
    "colors": [
      {
        "name": "Brown",
        "code": "#8B6544",
        "primary": "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-10.jpeg",
        "alt": "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-11.jpeg",
        "images": [
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-10.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-4.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-5.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-6.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-7.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-8.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-9.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-11.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-12.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-1_543542c6-ff03-4164-82d9-7dc133f3e1f2.jpeg",
          "/media/products/Bags/bag11/VELMORA-ZORRO-BRIEFCASE-HAZEL-SUEDE-3_7ed04959-1c98-4179-b14f-654cb27be441.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#141414",
        "primary": "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-1_6746c2bb-4981-4663-8d69-efc8eecd5ea8.jpeg",
        "alt": "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-2_e3b601ee-65a5-427a-8832-1798d8606b2a.jpeg",
        "images": [
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-1_6746c2bb-4981-4663-8d69-efc8eecd5ea8.jpeg",
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-4.jpeg",
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-5.jpeg",
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-6.jpeg",
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-7.jpeg",
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-8.jpeg",
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-9.jpeg",
          "/media/products/Bags/bag11/black/VELMORA-ZORRO-BRIEFCASE-BLACK-SUEDE-SILVER-2_e3b601ee-65a5-427a-8832-1798d8606b2a.jpeg"
        ]
      }
    ],
    "description": "The Zorro Briefcase embodies sculptural elegance and enduring craftsmanship. Handcrafted from sustainably sourced, full-grain calfskin leather with hand-painted bevelled edges, signature solid brass hardware, and dual interior compartments.",
    "features": [
      "Handcrafted in limited editions from certified tannery leathers",
      "Signature gold-foil Velmora blind emboss",
      "Dual internal slip pockets with archival canvas lining",
      "Adjustable and detachable shoulder strap with solid brass buckles",
      "Concealed magnetic foldover closure"
    ],
    "dimensions": "24cm W x 17cm H x 7.5cm D. Strap length: 100cm - 130cm.",
    "materials": "Exterior: 100% French Calfskin. Interior: 100% Black Cotton Canvas. Hardware: 100% Solid Polished Brass.",
    "care": "Treat with organic Velmora leather cream every 3-6 months. Keep away from direct heat and water. Store in provided dust bag."
  },
  {
    "id": "shoe_1",
    "name": "Uma Loafer",
    "category": "Loafers",
    "department": "Shoes",
    "price": 549,
    "badge": "New Season",
    "colors": [
      {
        "name": "Oat Suede",
        "code": "#ECE6D8",
        "primary": "/media/products/Shoes/1/velmora-search-S26-footwear.jpeg",
        "alt": "/media/products/Shoes/1/VELMORA-UMA-LOAFER-OAT-SUEDE-1_8b0ef864-d36a-421b-a033-44ee582a1b2e (1).jpeg",
        "images": [
          "/media/products/Shoes/1/velmora-search-S26-footwear.jpeg",
          "/media/products/Shoes/1/VELMORA-UMA-LOAFER-OAT-SUEDE-1_8b0ef864-d36a-421b-a033-44ee582a1b2e.jpeg",
          "/media/products/Shoes/1/VELMORA-UMA-LOAFER-OAT-SUEDE-2_73f0147f-54b9-449a-827e-273a6ef51146.jpeg",
          "/media/products/Shoes/1/VELMORA-UMA-LOAFER-OAT-SUEDE-3_eb36a840-1dca-4cc0-9839-2f7cc22d75b2.jpeg",
          "/media/products/Shoes/1/VELMORA-UMA-LOAFER-OAT-SUEDE-5_b80e3c64-c3eb-47bd-b223-e61ae578aaa1.jpeg",
          "/media/products/Shoes/1/VELMORA-UMA-LOAFER-OAT-SUEDE-6_f82eb4d1-085b-43a7-90a9-a4824abfd0b2.jpeg"
        ]
      },
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-1_842fc393-c1de-4936-b643-8383a0307006.jpeg",
        "alt": "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-2_070621b8-4e89-4c64-9852-6d8950fc3cdd.jpeg",
        "images": [
          "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-1_842fc393-c1de-4936-b643-8383a0307006.jpeg",
          "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-2_070621b8-4e89-4c64-9852-6d8950fc3cdd.jpeg",
          "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-3_74a129f8-dd30-4a71-aaee-a8cadfddd508.jpeg",
          "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-4_912876d7-2e2e-48b4-8c44-bdf89f20ae62.jpeg",
          "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-5_ac25c5e2-49aa-43fb-896d-6e664b256bad.jpeg",
          "/media/products/Shoes/1/black/VELMORA-UMA-LOAFER-JAVA-SUEDE-6_c99276a4-8b30-46a6-b040-b697123488f4.jpeg"
        ]
      }
    ],
    "description": "The Uma Loafer pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_2",
    "name": "Road Rider",
    "category": "Sneakers",
    "department": "Shoes",
    "price": 489,
    "badge": "Essential",
    "colors": [
      {
        "name": "Donkey Suede",
        "code": "#9C8F84",
        "primary": "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-1.jpeg",
        "alt": "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-3.jpeg",
        "images": [
          "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-1.jpeg",
          "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-3.jpeg",
          "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-4.jpeg",
          "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-5.jpeg",
          "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-6.jpeg",
          "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DONKEY-SUEDE-7.jpeg",
          "/media/products/Shoes/2/VELMORA-ROAD-RIDER-DUNE-SUEDE.jpeg"
        ]
      },
      {
        "name": "Grey Calf",
        "code": "#64625F",
        "primary": "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-1_cd872557-c24a-4838-ac38-0661d62e336c.jpeg",
        "alt": "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-2_613a5527-84a8-4c58-8ec3-78a6cb4b71f4.jpeg",
        "images": [
          "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-1_cd872557-c24a-4838-ac38-0661d62e336c.jpeg",
          "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-6.jpeg",
          "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-2_613a5527-84a8-4c58-8ec3-78a6cb4b71f4.jpeg",
          "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-3_f7b94815-69d3-4e17-b9be-e08b2014889b.jpeg",
          "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-4_7d754453-e38a-406a-aa37-76227edc560c.jpeg",
          "/media/products/Shoes/2/grey/VELMORA-ROAD-RIDER-PETROL-CALF-HAIR-6_09a38c07-7094-4a99-a56b-222f51e4f967.jpeg"
        ]
      }
    ],
    "description": "The Road Rider pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_3",
    "name": "Cinch Pump",
    "category": "Heels",
    "department": "Shoes",
    "price": 599,
    "badge": "Signature",
    "colors": [
      {
        "name": "Dune Suede",
        "code": "#B59E87",
        "primary": "/media/products/Shoes/3/VELMORA-CINCH-PUMP-DUNE-SUEDE-1.jpeg",
        "alt": "/media/products/Shoes/3/VELMORA-CINCH-PUMP-DUNE-SUEDE-2.jpeg",
        "images": [
          "/media/products/Shoes/3/VELMORA-CINCH-PUMP-DUNE-SUEDE-1.jpeg",
          "/media/products/Shoes/3/VELMORA-CINCH-PUMP-DUNE-SUEDE-2.jpeg",
          "/media/products/Shoes/3/VELMORA-CINCH-PUMP-DUNE-SUEDE-3.jpeg",
          "/media/products/Shoes/3/VELMORA-CINCH-PUMP-DUNE-SUEDE-4.jpeg",
          "/media/products/Shoes/3/VELMORA-CINCH-PUMP-DUNE-SUEDE-5.jpeg"
        ]
      },
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-1.jpeg",
        "alt": "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-2.jpeg",
        "images": [
          "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-1.jpeg",
          "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-2.jpeg",
          "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-3.jpeg",
          "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-4.jpeg",
          "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-5.jpeg",
          "/media/products/Shoes/3/black/VELMORA-CINCH-PUMP-JAVA-CALF-HAIR-6.jpeg"
        ]
      }
    ],
    "description": "The Cinch Pump pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_4",
    "name": "Lo Rider Boot",
    "category": "Boots",
    "department": "Shoes",
    "price": 699,
    "badge": "Iconic",
    "colors": [
      {
        "name": "Java Suede",
        "code": "#4A3326",
        "primary": "/media/products/Shoes/4/VELMORA-LO-RIDER-BOOT-JAVA-1.jpeg",
        "alt": "/media/products/Shoes/4/VELMORA-LO-RIDER-BOOT-JAVA-3.jpeg",
        "images": [
          "/media/products/Shoes/4/VELMORA-LO-RIDER-BOOT-JAVA-1.jpeg",
          "/media/products/Shoes/4/VELMORA-LO-RIDER-BOOT-JAVA-3.jpeg",
          "/media/products/Shoes/4/VELMORA-LO-RIDER-BOOT-JAVA-4.jpeg",
          "/media/products/Shoes/4/VELMORA-LO-RIDER-BOOT-JAVA-5.jpeg",
          "/media/products/Shoes/4/VELMORA-LO-RIDER-BOOT-JAVA.jpeg"
        ]
      },
      {
        "name": "Cocoa Brown",
        "code": "#56382D",
        "primary": "/media/products/Shoes/4/brown/VELMORA-LO-RIDER-BOOT-DONKEY-SUEDE-1 (1).jpeg",
        "alt": "/media/products/Shoes/4/brown/VELMORA-LO-RIDER-BOOT-DONKEY-SUEDE-1.jpeg",
        "images": [
          "/media/products/Shoes/4/brown/VELMORA-LO-RIDER-BOOT-DONKEY-SUEDE-1.jpeg",
          "/media/products/Shoes/4/brown/VELMORA-LO-RIDER-BOOT-DONKEY-SUEDE-3.jpeg",
          "/media/products/Shoes/4/brown/VELMORA-LO-RIDER-BOOT-DONKEY-SUEDE-4.jpeg",
          "/media/products/Shoes/4/brown/VELMORA-LO-RIDER-BOOT-DONKEY-SUEDE-5.jpeg"
        ]
      }
    ],
    "description": "The Lo Rider Boot pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_5",
    "name": "Cinch Flat",
    "category": "Flats",
    "department": "Shoes",
    "price": 469,
    "badge": "Trending",
    "colors": [
      {
        "name": "Salsa Suede",
        "code": "#9B2A2B",
        "primary": "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-1_5aa71d15-e800-4883-86c7-5353ec286ca0.jpeg",
        "alt": "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-2_39cb5e46-2ee2-43c8-962a-43ae1c7fab62 (1).jpeg",
        "images": [
          "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-1_5aa71d15-e800-4883-86c7-5353ec286ca0.jpeg",
          "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-6.jpeg",
          "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-2_39cb5e46-2ee2-43c8-962a-43ae1c7fab62.jpeg",
          "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-3_94e48088-44a1-4e19-aa69-d0dc9e87977b.jpeg",
          "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-4_752176f6-ab3d-4eae-9ab3-32979169db85.jpeg",
          "/media/products/Shoes/5/VELMORA-CINCH-FLAT-SALSA-SUEDE-5_f9815dbe-beb9-4334-8c91-068608a367a4.jpeg"
        ]
      },
      {
        "name": "Green",
        "code": "#ECE6D8",
        "primary": "/media/products/Shoes/5/green/VELMORA-CINCH-FLAT-DONKEY-SUEDE-1_54503dbe-ee7d-4636-a629-dbbfbfdeb102.jpeg",
        "alt": "/media/products/Shoes/5/green/VELMORA-CINCH-FLAT-DONKEY-SUEDE-3_4fa6dd7a-1e26-4db5-a3d2-2f96bede99bb.jpeg",
        "images": [
          "/media/products/Shoes/5/green/VELMORA-CINCH-FLAT-DONKEY-SUEDE-1_54503dbe-ee7d-4636-a629-dbbfbfdeb102.jpeg",
          "/media/products/Shoes/5/green/VELMORA-CINCH-FLAT-DONKEY-SUEDE-3_4fa6dd7a-1e26-4db5-a3d2-2f96bede99bb.jpeg",
          "/media/products/Shoes/5/green/VELMORA-CINCH-FLAT-DONKEY-SUEDE-4_3e7dcd05-dddf-48ae-952a-9823f6b95f20.jpeg",
          "/media/products/Shoes/5/green/VELMORA-CINCH-FLAT-DONKEY-SUEDE-5_31cf88b9-162d-4b11-9b6e-0401d20c3958.jpeg"
        ]
      },
      {
        "name": "Oat Suede",
        "code": "#ECE6D8",
        "primary": "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-1_ef0f2ddb-b4cf-4100-bd0e-24c6f4073b6e.jpeg",
        "alt": "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-2_d3629910-d182-459f-a599-61258e2fa1ee.jpeg",
        "images": [
          "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-1_ef0f2ddb-b4cf-4100-bd0e-24c6f4073b6e.jpeg",
          "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-2_d3629910-d182-459f-a599-61258e2fa1ee.jpeg",
          "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-3_e4153943-2197-4c9d-98e3-3e0413ff7052.jpeg",
          "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-4_715c3240-fbe9-41a1-877b-db468f2ce8f5.jpeg",
          "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-5_e061f796-620e-4678-ba88-9b1252c8aa24.jpeg",
          "/media/products/Shoes/5/white/VELMORA-CINCH-FLAT-OAT-SUEDE-6_d8858e6e-10af-4139-b506-db48aaa10e14.jpeg"
        ]
      }
    ],
    "description": "The Cinch Flat pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_6",
    "name": "Apollo Mule",
    "category": "Mules",
    "department": "Shoes",
    "price": 499,
    "badge": "Handcrafted",
    "colors": [
      {
        "name": "Java Suede",
        "code": "#4A3326",
        "primary": "/media/products/Shoes/6/VELMORA-APOLLO-MULE-JAVA-SUEDE-1.jpeg",
        "alt": "/media/products/Shoes/6/VELMORA-APOLLO-MULE-JAVA-SUEDE-3 (1).jpeg",
        "images": [
          "/media/products/Shoes/6/VELMORA-APOLLO-MULE-JAVA-SUEDE-1.jpeg",
          "/media/products/Shoes/6/VELMORA-APOLLO-MULE-JAVA-SUEDE-3.jpeg",
          "/media/products/Shoes/6/VELMORA-APOLLO-MULE-JAVA-SUEDE-4.jpeg",
          "/media/products/Shoes/6/VELMORA-APOLLO-MULE-JAVA-SUEDE-5.jpeg",
          "/media/products/Shoes/6/VELMORA-APOLLO-MULE-JAVA-SUEDE-8.jpeg"
        ]
      },
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/Shoes/6/black/VELMORA-APOLLO-MULE-BLACK-1_04ad7036-67db-45aa-b884-9d4f9c2df07e.jpeg",
        "alt": "/media/products/Shoes/6/black/VELMORA-APOLLO-MULE-BLACK-3_41aaa0c0-d3c0-436c-bc2e-e410471ac7ba (1).jpeg",
        "images": [
          "/media/products/Shoes/6/black/VELMORA-APOLLO-MULE-BLACK-1_04ad7036-67db-45aa-b884-9d4f9c2df07e.jpeg",
          "/media/products/Shoes/6/black/VELMORA-APOLLO-MULE-BLACK-9.jpeg",
          "/media/products/Shoes/6/black/VELMORA-APOLLO-MULE-BLACK-3_41aaa0c0-d3c0-436c-bc2e-e410471ac7ba.jpeg",
          "/media/products/Shoes/6/black/VELMORA-APOLLO-MULE-BLACK-4_9134091a-b494-40fc-ab42-0473b5e52351.jpeg"
        ]
      }
    ],
    "description": "The Apollo Mule pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_7",
    "name": "Alastor Slide",
    "category": "Slides",
    "department": "Shoes",
    "price": 429,
    "badge": "Summer Edition",
    "colors": [
      {
        "name": "Dark Cherry",
        "code": "#58111A",
        "primary": "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-1_48078c70-39fb-45ca-b33e-a9b7dfc3ba1f.jpeg",
        "alt": "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-2_e4da02e0-7efb-48cc-9df3-040429c8ee55.jpeg",
        "images": [
          "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-1_48078c70-39fb-45ca-b33e-a9b7dfc3ba1f.jpeg",
          "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-2_e4da02e0-7efb-48cc-9df3-040429c8ee55.jpeg",
          "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-3_07132001-2c8c-4e7f-9e15-0de3d532a113.jpeg",
          "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-4_6f01924e-dae3-459f-ac85-b3661073592d.jpeg",
          "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-5_0e5bbe76-969b-412b-a414-7ab4af0bf6c2.jpeg",
          "/media/products/Shoes/7/VELMORA-ALASTOR-SLIDE-DARK-CHERRY-WOVEN-6_a9d9bc04-6d90-4c5b-9019-3f390144a99c.jpeg"
        ]
      },
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-1 (1).jpeg",
        "alt": "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-1.jpeg",
        "images": [
          "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-1.jpeg",
          "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-3.jpeg",
          "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-4.jpeg",
          "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-5.jpeg",
          "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-6.jpeg",
          "/media/products/Shoes/7/black/VELMORA-ALASTOR-SLIDE-BLACK-WOVEN-6_be6fb899-0b2e-4199-9b45-ff0be35493b7.jpeg"
        ]
      }
    ],
    "description": "The Alastor Slide pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_8",
    "name": "Epona Heel",
    "category": "Heels",
    "department": "Shoes",
    "price": 649,
    "badge": "Artisan",
    "colors": [
      {
        "name": "Black Croc",
        "code": "#141414",
        "primary": "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-1_2002a666-eb39-4d25-bd88-9e4b27a1ecd4 (1).jpeg",
        "alt": "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-1_2002a666-eb39-4d25-bd88-9e4b27a1ecd4.jpeg",
        "images": [
          "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-6.jpeg",
          "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-1_2002a666-eb39-4d25-bd88-9e4b27a1ecd4.jpeg",
          "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-2_c8148d06-e2b2-46f3-97d6-98870d60e649.jpeg",
          "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-3_7e0b350a-4ee8-4eb4-8897-87167b61cfee.jpeg",
          "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-4_da11774c-9f30-4de6-896f-89b9bf40c3fc.jpeg",
          "/media/products/Shoes/8/VELMORA-EPONA-HEEL-BLACK-CROC-5_54cfde6f-6a70-4a5a-ba08-c9c5dc7d173a.jpeg"
        ]
      },
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-1_2002a666-eb39-4d25-bd88-9e4b27a1ecd4 (1).jpeg",
        "alt": "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-1_2002a666-eb39-4d25-bd88-9e4b27a1ecd4.jpeg",
        "images": [
          "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-6.jpeg",
          "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-1_2002a666-eb39-4d25-bd88-9e4b27a1ecd4.jpeg",
          "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-2_c8148d06-e2b2-46f3-97d6-98870d60e649.jpeg",
          "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-3_7e0b350a-4ee8-4eb4-8897-87167b61cfee.jpeg",
          "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-4_da11774c-9f30-4de6-896f-89b9bf40c3fc.jpeg",
          "/media/products/Shoes/8/black/VELMORA-EPONA-HEEL-BLACK-CROC-5_54cfde6f-6a70-4a5a-ba08-c9c5dc7d173a.jpeg"
        ]
      },
      {
        "name": "Cocoa Brown",
        "code": "#56382D",
        "primary": "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-1_aa7b4e99-ce7a-4220-ba83-e09c4c0c100d (1).jpeg",
        "alt": "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-1_aa7b4e99-ce7a-4220-ba83-e09c4c0c100d.jpeg",
        "images": [
          "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-6.jpeg",
          "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-1_aa7b4e99-ce7a-4220-ba83-e09c4c0c100d.jpeg",
          "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-2_d068e641-9297-443d-b728-39e4d57042bb.jpeg",
          "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-3_912429d6-5f1e-4061-9664-ccce374a0575.jpeg",
          "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-4_670e748f-79d6-485b-8f07-ea48fa60b694.jpeg",
          "/media/products/Shoes/8/brown/VELMORA-EPONA-HEEL-DARK-CHERRY-GLOSS-5_06a07da4-fa4b-4809-addd-3cf7c6a61db4.jpeg"
        ]
      }
    ],
    "description": "The Epona Heel pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_9",
    "name": "Sola Slide",
    "category": "Slides",
    "department": "Shoes",
    "price": 389,
    "badge": "Minimalist",
    "colors": [
      {
        "name": "Oat Suede",
        "code": "#ECE6D8",
        "primary": "/media/products/Shoes/9/VELMORA-SOLA-SLIDE-OAT-SUEDE-1_43255a26-6f12-41f8-b5a3-43c51414e420.jpeg",
        "alt": "/media/products/Shoes/9/VELMORA-SOLA-SLIDE-OAT-SUEDE-2_c08211aa-8b17-46c8-b65f-caa12c7a49c6.jpeg",
        "images": [
          "/media/products/Shoes/9/VELMORA-SOLA-SLIDE-OAT-SUEDE-1_43255a26-6f12-41f8-b5a3-43c51414e420.jpeg",
          "/media/products/Shoes/9/VELMORA-SOLA-SLIDE-OAT-SUEDE-6.jpeg",
          "/media/products/Shoes/9/VELMORA-SOLA-SLIDE-OAT-SUEDE-2_c08211aa-8b17-46c8-b65f-caa12c7a49c6.jpeg",
          "/media/products/Shoes/9/VELMORA-SOLA-SLIDE-OAT-SUEDE-3_c2715eb1-efc5-4eab-a2eb-3cfb5fadc3e5.jpeg",
          "/media/products/Shoes/9/VELMORA-SOLA-SLIDE-OAT-SUEDE-5_3a0390f9-cfae-4e03-923c-6c5b35c8da93.jpeg"
        ]
      },
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-1_43abf877-0943-4dc2-bfc5-f87e1d0dbece.jpeg",
        "alt": "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-2_a7c6ac9e-0d98-4f53-8b3b-42c26743ee92.jpeg",
        "images": [
          "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-1_43abf877-0943-4dc2-bfc5-f87e1d0dbece.jpeg",
          "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-6.jpeg",
          "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-2_a7c6ac9e-0d98-4f53-8b3b-42c26743ee92.jpeg",
          "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-3_62834c9a-1cf0-41b3-a443-8fd0a35f4f28.jpeg",
          "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-4_ab0e9163-0ef9-4728-8438-a9302ceb8efa.jpeg",
          "/media/products/Shoes/9/black/VELMORA-SOLA-SLIDE-BLACK-5_4a2c99a6-d176-46e3-8dec-b558b5f9329a.jpeg"
        ]
      }
    ],
    "description": "The Sola Slide pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_10",
    "name": "Triton Sandal",
    "category": "Sandals",
    "department": "Shoes",
    "price": 449,
    "badge": "Resort",
    "colors": [
      {
        "name": "Oat Suede",
        "code": "#ECE6D8",
        "primary": "/media/products/Shoes/10/VELMORA-TRITON-SANDAL-OAT-SUEDE-1.jpeg",
        "alt": "/media/products/Shoes/10/VELMORA-TRITON-SANDAL-OAT-SUEDE-2.jpeg",
        "images": [
          "/media/products/Shoes/10/VELMORA-TRITON-SANDAL-OAT-SUEDE-1.jpeg",
          "/media/products/Shoes/10/VELMORA-TRITON-SANDAL-OAT-SUEDE-2.jpeg",
          "/media/products/Shoes/10/VELMORA-TRITON-SANDAL-OAT-SUEDE-3.jpeg",
          "/media/products/Shoes/10/VELMORA-TRITON-SANDAL-OAT-SUEDE-4.jpeg",
          "/media/products/Shoes/10/VELMORA-TRITON-SANDAL-OAT-SUEDE-2_716076ed-f646-48a5-821a-33a7e60d2dfb.jpeg"
        ]
      },
      {
        "name": "Cocoa Brown",
        "code": "#56382D",
        "primary": "/media/products/Shoes/10/brown/VELMORA-TRITON-SANDAL-DARK-CHERRY-1.jpeg",
        "alt": "/media/products/Shoes/10/brown/VELMORA-TRITON-SANDAL-DARK-CHERRY-2.jpeg",
        "images": [
          "/media/products/Shoes/10/brown/VELMORA-TRITON-SANDAL-DARK-CHERRY-1.jpeg",
          "/media/products/Shoes/10/brown/VELMORA-TRITON-SANDAL-DARK-CHERRY-2.jpeg",
          "/media/products/Shoes/10/brown/VELMORA-TRITON-SANDAL-DARK-CHERRY-3.jpeg",
          "/media/products/Shoes/10/brown/VELMORA-TRITON-SANDAL-DARK-CHERRY-4.jpeg",
          "/media/products/Shoes/10/brown/VELMORA-TRITON-SANDAL-DARK-CHERRY-5.jpeg"
        ]
      }
    ],
    "description": "The Triton Sandal pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "shoe_11",
    "name": "Rider Boot",
    "category": "Boots",
    "department": "Shoes",
    "price": 890,
    "badge": "Limited Run",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/Shoes/11/VELMORA-RIDER-BOOT-BLACK-1_b1fecdf0-3000-458d-bf90-dcf348eb6124.jpeg",
        "alt": "/media/products/Shoes/11/VELMORA-RIDER-BOOT-BLACK-2_54070bf2-e034-49c7-b9cc-6a37dc499dcd.jpeg",
        "images": [
          "/media/products/Shoes/11/VELMORA-RIDER-BOOT-BLACK-1_b1fecdf0-3000-458d-bf90-dcf348eb6124.jpeg",
          "/media/products/Shoes/11/VELMORA-RIDER-BOOT-BLACK-2_54070bf2-e034-49c7-b9cc-6a37dc499dcd.jpeg",
          "/media/products/Shoes/11/VELMORA-RIDER-BOOT-BLACK-3_5bcf158c-9de5-484e-a1ae-29d01e9d36a3.jpeg",
          "/media/products/Shoes/11/VELMORA-RIDER-BOOT-BLACK-4_507f0444-cdb0-4808-b999-7cfb42df2ea9.jpeg",
          "/media/products/Shoes/11/VELMORA-RIDER-BOOT-BLACK-7_bdb6dc63-eabf-4c8a-b613-e8341270c5db.jpeg"
        ]
      },
      {
        "name": "Oat Suede",
        "code": "#ECE6D8",
        "primary": "/media/products/Shoes/11/offwhite/b41eb41e8b524f2387da06b553d923ed.thumbnail.0000000000_2560x.jpeg",
        "alt": "/media/products/Shoes/11/offwhite/VELMORA-RIDER-BOOT-OAT-SUEDE-2.jpeg",
        "images": [
          "/media/products/Shoes/11/offwhite/b41eb41e8b524f2387da06b553d923ed.thumbnail.0000000000_2560x.jpeg",
          "/media/products/Shoes/11/offwhite/VELMORA-RIDER-BOOT-OAT-SUEDE-2.jpeg",
          "/media/products/Shoes/11/offwhite/VELMORA-RIDER-BOOT-OAT-SUEDE-3.jpeg",
          "/media/products/Shoes/11/offwhite/VELMORA-RIDER-BOOT-OAT-SUEDE-4.jpeg",
          "/media/products/Shoes/11/offwhite/VELMORA-RIDER-BOOT-OAT-SUEDE-5.jpeg",
          "/media/products/Shoes/11/offwhite/VELMORA-RIDER-BOOT-OAT-SUEDE-6.jpeg"
        ]
      }
    ],
    "description": "The Rider Boot pairs architectural lines with effortless comfort. Constructed from vegetable-tanned Italian hides with cushioned memory-foam leather insoles and Goodyear-welted soles.",
    "features": [
      "Hand-lasted by master footwear artisans",
      "Ultra-cushioned ergonomically moulded leather footbed",
      "Non-slip ridged rubber outer sole with stacked leather heel",
      "Embossed Velmora gold insole branding"
    ],
    "dimensions": "Fits true to size. If between sizes, we recommend sizing up.",
    "materials": "Upper: 100% Calfskin / Suede. Insole: 100% Calf Leather. Outsole: Natural Rubber & Leather.",
    "care": "Wipe clean with a damp cloth. Apply neutral leather conditioner to nourish hides."
  },
  {
    "id": "acc_belt",
    "name": "Wide Oval Belt",
    "category": "Belts",
    "department": "Accessories",
    "price": 289,
    "badge": "Signature",
    "colors": [
      {
        "name": "Classic Black",
        "code": "#141414",
        "primary": "/media/products/accessories/belts/VELMORA-WIDE-BELT-OVAL-BLACK-1.jpeg",
        "alt": "/media/products/accessories/belts/VELMORA-WIDE-BELT-OVAL-BLACK-2.jpeg",
        "images": [
          "/media/products/accessories/belts/VELMORA-WIDE-BELT-OVAL-BLACK-1.jpeg",
          "/media/products/accessories/belts/VELMORA-WIDE-BELT-OVAL-BLACK-2.jpeg",
          "/media/products/accessories/belts/VELMORA-WIDE-BELT-OVAL-BLACK-3.jpeg",
          "/media/products/accessories/belts/VELMORA-WIDE-BELT-OVAL-BLACK-4.jpeg"
        ]
      },
      {
        "name": "Black Croc Silver",
        "code": "#1A1A1A",
        "primary": "/media/products/accessories/belts/black/VELMORA-WIDE-BELT-OVAL-BLACK-CROC-SILVER-1_285f463d-bbd4-4ba9-ac28-060370965072.jpeg",
        "alt": "/media/products/accessories/belts/black/VELMORA-WIDE-BELT-OVAL-BLACK-CROC-SILVER-2_f51c9ad3-d958-42c3-b9b7-bb3c8bd2eaf5.jpeg",
        "images": [
          "/media/products/accessories/belts/black/VELMORA-WIDE-BELT-OVAL-BLACK-CROC-SILVER-1_285f463d-bbd4-4ba9-ac28-060370965072.jpeg",
          "/media/products/accessories/belts/black/VELMORA-WIDE-BELT-OVAL-BLACK-CROC-SILVER-2_f51c9ad3-d958-42c3-b9b7-bb3c8bd2eaf5.jpeg",
          "/media/products/accessories/belts/black/VELMORA-WIDE-BELT-OVAL-BLACK-CROC-SILVER-3_74597d6b-46c9-4db4-b83d-b107f07b39f9.jpeg"
        ]
      },
      {
        "name": "Hazel Suede",
        "code": "#8B6544",
        "primary": "/media/products/accessories/belts/brown/VELMORA-WIDE-EPONA-BELT-HAZEL-SUEDE-BRASS-1.jpeg",
        "alt": "/media/products/accessories/belts/brown/VELMORA-WIDE-EPONA-BELT-HAZEL-SUEDE-BRASS-2.jpeg",
        "images": [
          "/media/products/accessories/belts/brown/VELMORA-WIDE-EPONA-BELT-HAZEL-SUEDE-BRASS-1.jpeg",
          "/media/products/accessories/belts/brown/VELMORA-WIDE-EPONA-BELT-HAZEL-SUEDE-BRASS-2.jpeg",
          "/media/products/accessories/belts/brown/VELMORA-WIDE-EPONA-BELT-HAZEL-SUEDE-BRASS-3.jpeg",
          "/media/products/accessories/belts/brown/VELMORA-WIDE-EPONA-BELT-HAZEL-SUEDE-BRASS-4.jpeg"
        ]
      },
      {
        "name": "Oat Suede",
        "code": "#ECE6D8",
        "primary": "/media/products/accessories/belts/offwhite/VELMORA-WIDE-BELT-OVAL-OAT-SUEDE-1.jpeg",
        "alt": "/media/products/accessories/belts/offwhite/VELMORA-WIDE-BELT-OVAL-OAT-SUEDE-2_eaa1b2b3-c009-4830-ab24-c0cba843b912.jpeg",
        "images": [
          "/media/products/accessories/belts/offwhite/VELMORA-WIDE-BELT-OVAL-OAT-SUEDE-1.jpeg",
          "/media/products/accessories/belts/offwhite/VELMORA-WIDE-BELT-OVAL-OAT-SUEDE-3.jpeg",
          "/media/products/accessories/belts/offwhite/VELMORA-WIDE-BELT-OVAL-OAT-SUEDE-2_eaa1b2b3-c009-4830-ab24-c0cba843b912.jpeg"
        ]
      }
    ],
    "description": "The Wide Oval Belt is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_1",
    "name": "Medium Poucher",
    "category": "Wallets",
    "department": "Accessories",
    "price": 249,
    "badge": "Bestseller",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/1/VELMORA-MEDIUM-POUCHER-BLACK-CROC-1 (1).jpeg",
        "alt": "/media/products/accessories/wallets/1/VELMORA-MEDIUM-POUCHER-BLACK-CROC-1.jpeg",
        "images": [
          "/media/products/accessories/wallets/1/VELMORA-MEDIUM-POUCHER-BLACK-CROC-1.jpeg",
          "/media/products/accessories/wallets/1/VELMORA-MEDIUM-POUCHER-BLACK-CROC-2.jpeg",
          "/media/products/accessories/wallets/1/VELMORA-MEDIUM-POUCHER-BLACK-CROC-3.jpeg",
          "/media/products/accessories/wallets/1/VELMORA-MEDIUM-POUCHER-BLACK-CROC-4.jpeg",
          "/media/products/accessories/wallets/1/VELMORA-MEDIUM-POUCHER-BLACK-CROC-5.jpeg"
        ]
      },
      {
        "name": "Cheetah",
        "code": "#B8860B",
        "primary": "/media/products/accessories/wallets/1/brown/VELMORA-POUCHER-GRANDE-CHEETAH-CALF-HAIR-1.jpeg",
        "alt": "/media/products/accessories/wallets/1/brown/VELMORA-POUCHER-GRANDE-CHEETAH-CALF-HAIR-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/1/brown/VELMORA-POUCHER-GRANDE-CHEETAH-CALF-HAIR-1.jpeg",
          "/media/products/accessories/wallets/1/brown/VELMORA-POUCHER-GRANDE-CHEETAH-CALF-HAIR-2.jpeg",
          "/media/products/accessories/wallets/1/brown/VELMORA-POUCHER-GRANDE-CHEETAH-CALF-HAIR-3.jpeg",
          "/media/products/accessories/wallets/1/brown/VELMORA-POUCHER-GRANDE-CHEETAH-CALF-HAIR-4.jpeg",
          "/media/products/accessories/wallets/1/brown/VELMORA-POUCHER-GRANDE-CHEETAH-CALF-HAIR-5.jpeg"
        ]
      },
      {
        "name": "Sage Green",
        "code": "#566B57",
        "primary": "/media/products/accessories/wallets/1/green/VELMORA-MEDIUM-POUCHER-SAGE-1.jpeg",
        "alt": "/media/products/accessories/wallets/1/green/VELMORA-MEDIUM-POUCHER-SAGE-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/1/green/VELMORA-MEDIUM-POUCHER-SAGE-1.jpeg",
          "/media/products/accessories/wallets/1/green/VELMORA-MEDIUM-POUCHER-SAGE-2.jpeg",
          "/media/products/accessories/wallets/1/green/VELMORA-MEDIUM-POUCHER-SAGE-3.jpeg",
          "/media/products/accessories/wallets/1/green/VELMORA-MEDIUM-POUCHER-SAGE-4.jpeg",
          "/media/products/accessories/wallets/1/green/VELMORA-MEDIUM-POUCHER-SAGE-5.jpeg"
        ]
      },
      {
        "name": "Lemonade White",
        "code": "#ECE6D8",
        "primary": "/media/products/accessories/wallets/1/white/VELMORA-MEDIUM-POUCHER-LEMONADE-1 (1).jpeg",
        "alt": "/media/products/accessories/wallets/1/white/VELMORA-MEDIUM-POUCHER-LEMONADE-1.jpeg",
        "images": [
          "/media/products/accessories/wallets/1/white/VELMORA-MEDIUM-POUCHER-LEMONADE-1.jpeg",
          "/media/products/accessories/wallets/1/white/VELMORA-MEDIUM-POUCHER-LEMONADE-2.jpeg",
          "/media/products/accessories/wallets/1/white/VELMORA-MEDIUM-POUCHER-LEMONADE-3.jpeg",
          "/media/products/accessories/wallets/1/white/VELMORA-MEDIUM-POUCHER-LEMONADE-5.jpeg"
        ]
      }
    ],
    "description": "The Medium Poucher is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_2",
    "name": "Card File",
    "category": "Wallets",
    "department": "Accessories",
    "price": 169,
    "badge": "Essential",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-1_e8c5d03c-541c-4fdc-a2d3-df08c2c26109.jpeg",
        "alt": "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-2_c4405418-6c87-46ab-8169-383120664ecd.jpeg",
        "images": [
          "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-1_e8c5d03c-541c-4fdc-a2d3-df08c2c26109.jpeg",
          "/media/products/accessories/wallets/2/VELMORA-CARD-SLEEVE-BLACK-1.jpeg",
          "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-6.jpeg",
          "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-2_c4405418-6c87-46ab-8169-383120664ecd.jpeg",
          "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-3_c6ef91ed-873a-4899-a997-b881caacc1d4.jpeg",
          "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-4_ef6a51fb-8b09-4020-bb37-6be0cac7f241.jpeg",
          "/media/products/accessories/wallets/2/VELMORA-CARD-FILE-BLACK-5_d9c5999a-c86d-4b1a-b15c-5d1df0a0ff04.jpeg"
        ]
      },
      {
        "name": "Sage Green",
        "code": "#566B57",
        "primary": "/media/products/accessories/wallets/2/green/VELMORA-CARD-SLEEVE-SAGE-1.jpeg",
        "alt": "/media/products/accessories/wallets/2/green/VELMORA-CARD-SLEEVE-SAGE-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/2/green/VELMORA-CARD-SLEEVE-SAGE-1.jpeg",
          "/media/products/accessories/wallets/2/green/VELMORA-CARD-SLEEVE-SAGE-2.jpeg",
          "/media/products/accessories/wallets/2/green/VELMORA-CARD-SLEEVE-SAGE-3.jpeg",
          "/media/products/accessories/wallets/2/green/VELMORA-CARD-SLEEVE-SAGE-4.jpeg"
        ]
      },
      {
        "name": "Rose Pink",
        "code": "#D98993",
        "primary": "/media/products/accessories/wallets/2/pink/VELMORA-CARD-SLEEVE-FROSTING-2.jpeg",
        "alt": "/media/products/accessories/wallets/2/pink/VELMORA-CARD-SLEEVE-FROSTING-3.jpeg",
        "images": [
          "/media/products/accessories/wallets/2/pink/VELMORA-CARD-SLEEVE-FROSTING-2.jpeg",
          "/media/products/accessories/wallets/2/pink/VELMORA-CARD-SLEEVE-FROSTING-3.jpeg",
          "/media/products/accessories/wallets/2/pink/VELMORA-CARD-SLEEVE-FROSTING-4.jpeg",
          "/media/products/accessories/wallets/2/pink/VELMORA-CARD-SLEEVE-FROSTING-5.jpeg"
        ]
      }
    ],
    "description": "The Card File is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_3",
    "name": "Zip Card Holder",
    "category": "Wallets",
    "department": "Accessories",
    "price": 199,
    "badge": "Compact",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/3/VELMORA-ZIP-CARD-HOLDER-DARK-CHERRY-1.jpeg",
        "alt": "/media/products/accessories/wallets/3/VELMORA-ZIP-CARD-HOLDER-DARK-CHERRY-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/3/VELMORA-ZIP-CARD-HOLDER-DARK-CHERRY-1.jpeg",
          "/media/products/accessories/wallets/3/VELMORA-ZIP-CARD-HOLDER-DARK-CHERRY-2.jpeg",
          "/media/products/accessories/wallets/3/VELMORA-ZIP-CARD-HOLDER-DARK-CHERRY-3.jpeg",
          "/media/products/accessories/wallets/3/VELMORA-ZIP-CARD-HOLDER-DARK-CHERRY-4.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#56382D",
        "primary": "/media/products/accessories/wallets/3/black/VELMORA-ZIP-CARD-HOLDER-BLACK-SILVER-1.jpeg",
        "alt": "/media/products/accessories/wallets/3/black/VELMORA-ZIP-CARD-HOLDER-BLACK-SILVER-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/3/black/VELMORA-ZIP-CARD-HOLDER-BLACK-SILVER-1.jpeg",
          "/media/products/accessories/wallets/3/black/VELMORA-ZIP-CARD-HOLDER-BLACK-SILVER-2.jpeg",
          "/media/products/accessories/wallets/3/black/VELMORA-ZIP-CARD-HOLDER-BLACK-SILVER-3.jpeg",
          "/media/products/accessories/wallets/3/black/VELMORA-ZIP-CARD-HOLDER-BLACK-SILVER-4.jpeg",
          "/media/products/accessories/wallets/3/black/VELMORA-ZIP-CARD-HOLDER-BLACK-SILVER-5.jpeg"
        ]
      },
      {
        "name": "Rose Pink",
        "code": "#D98993",
        "primary": "/media/products/accessories/wallets/3/pink/VELMORA-ZIP-CARD-HOLDER-FROSTING-1 (1).jpeg",
        "alt": "/media/products/accessories/wallets/3/pink/VELMORA-ZIP-CARD-HOLDER-FROSTING-1.jpeg",
        "images": [
          "/media/products/accessories/wallets/3/pink/VELMORA-ZIP-CARD-HOLDER-FROSTING-1.jpeg",
          "/media/products/accessories/wallets/3/pink/VELMORA-ZIP-CARD-HOLDER-FROSTING-2.jpeg",
          "/media/products/accessories/wallets/3/pink/VELMORA-ZIP-CARD-HOLDER-FROSTING-3.jpeg",
          "/media/products/accessories/wallets/3/pink/VELMORA-ZIP-CARD-HOLDER-FROSTING-4.jpeg",
          "/media/products/accessories/wallets/3/pink/VELMORA-ZIP-CARD-HOLDER-FROSTING-5.jpeg"
        ]
      }
    ],
    "description": "The Zip Card Holder is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_4",
    "name": "Croc Card Holder",
    "category": "Wallets",
    "department": "Accessories",
    "price": 219,
    "badge": "Luxury Croc",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/4/VELMORA-ZIP-CARD-HOLDER-BLACK-CROC-1 (1).jpeg",
        "alt": "/media/products/accessories/wallets/4/VELMORA-ZIP-CARD-HOLDER-BLACK-CROC-1.jpeg",
        "images": [
          "/media/products/accessories/wallets/4/VELMORA-ZIP-CARD-HOLDER-BLACK-CROC-1.jpeg",
          "/media/products/accessories/wallets/4/VELMORA-ZIP-CARD-HOLDER-BLACK-CROC-2.jpeg",
          "/media/products/accessories/wallets/4/VELMORA-ZIP-CARD-HOLDER-BLACK-CROC-3.jpeg",
          "/media/products/accessories/wallets/4/VELMORA-ZIP-CARD-HOLDER-BLACK-CROC-4.jpeg",
          "/media/products/accessories/wallets/4/VELMORA-ZIP-CARD-HOLDER-BLACK-CROC-5.jpeg"
        ]
      }
    ],
    "description": "The Croc Card Holder is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_5",
    "name": "Mini Wallet",
    "category": "Wallets",
    "department": "Accessories",
    "price": 239,
    "badge": "Minimalist",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/5/VELMORA-MINI-WALLET-FROSTING-1 (1).jpeg",
        "alt": "/media/products/accessories/wallets/5/VELMORA-MINI-WALLET-FROSTING-1.jpeg",
        "images": [
          "/media/products/accessories/wallets/5/VELMORA-MINI-WALLET-FROSTING-1.jpeg",
          "/media/products/accessories/wallets/5/VELMORA-MINI-WALLET-FROSTING-2.jpeg",
          "/media/products/accessories/wallets/5/VELMORA-MINI-WALLET-FROSTING-3.jpeg",
          "/media/products/accessories/wallets/5/VELMORA-MINI-WALLET-FROSTING-5.jpeg"
        ]
      },
      {
        "name": "Black",
        "code": "#56382D",
        "primary": "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-1_8ddfdbe9-066b-46e8-916f-94a48276abf2.jpeg",
        "alt": "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-2_78c3b8c3-f493-44f8-bd82-af03f5d0ad56.jpeg",
        "images": [
          "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-1_8ddfdbe9-066b-46e8-916f-94a48276abf2.jpeg",
          "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-6.jpeg",
          "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-2_78c3b8c3-f493-44f8-bd82-af03f5d0ad56.jpeg",
          "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-3_0e5abd7e-5186-441b-b976-ee6808362174.jpeg",
          "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-4_b3aa94ad-df4d-4705-a147-f900c41c65f7.jpeg",
          "/media/products/accessories/wallets/5/black/VELMORA-MINI-WALLET-BLACK-5_a0cf4051-cf27-4bd3-aba2-9233064671ec.jpeg"
        ]
      },
      {
        "name": "Brown",
        "code": "#56382D",
        "primary": "/media/products/accessories/wallets/5/brown/VELMORA-MINI-WALLET-DARK-CHERRY-1.jpeg",
        "alt": "/media/products/accessories/wallets/5/brown/VELMORA-MINI-WALLET-DARK-CHERRY-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/5/brown/VELMORA-MINI-WALLET-DARK-CHERRY-1.jpeg",
          "/media/products/accessories/wallets/5/brown/VELMORA-MINI-WALLET-DARK-CHERRY-2.jpeg",
          "/media/products/accessories/wallets/5/brown/VELMORA-MINI-WALLET-DARK-CHERRY-3.jpeg",
          "/media/products/accessories/wallets/5/brown/VELMORA-MINI-WALLET-DARK-CHERRY-4.jpeg"
        ]
      },
      {
        "name": "Sage Green",
        "code": "#566B57",
        "primary": "/media/products/accessories/wallets/5/green/VELMORA-MINI-WALLET-SAGE-1.jpeg",
        "alt": "/media/products/accessories/wallets/5/green/VELMORA-MINI-WALLET-SAGE-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/5/green/VELMORA-MINI-WALLET-SAGE-1.jpeg",
          "/media/products/accessories/wallets/5/green/VELMORA-MINI-WALLET-SAGE-2.jpeg",
          "/media/products/accessories/wallets/5/green/VELMORA-MINI-WALLET-SAGE-3.jpeg",
          "/media/products/accessories/wallets/5/green/VELMORA-MINI-WALLET-SAGE-4.jpeg",
          "/media/products/accessories/wallets/5/green/VELMORA-MINI-WALLET-SAGE-5.jpeg"
        ]
      }
    ],
    "description": "The Mini Wallet is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_6",
    "name": "Travel Wallet",
    "category": "Travel & Folios",
    "department": "Accessories",
    "price": 389,
    "badge": "Travel",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/6/VELMORA-TRAVEL-WALLET-BLACK-1_55ae502d-a0fc-4d02-8d91-faa627d11f75.jpeg",
        "alt": "/media/products/accessories/wallets/6/VELMORA-TRAVEL-WALLET-BLACK-2_a25806fd-32fa-4baa-898f-1b785dfd6c23.jpeg",
        "images": [
          "/media/products/accessories/wallets/6/VELMORA-TRAVEL-WALLET-BLACK-1_55ae502d-a0fc-4d02-8d91-faa627d11f75.jpeg",
          "/media/products/accessories/wallets/6/VELMORA-TRAVEL-WALLET-BLACK-4.jpeg",
          "/media/products/accessories/wallets/6/VELMORA-TRAVEL-WALLET-BLACK-5.jpeg",
          "/media/products/accessories/wallets/6/VELMORA-TRAVEL-WALLET-BLACK-2_a25806fd-32fa-4baa-898f-1b785dfd6c23.jpeg",
          "/media/products/accessories/wallets/6/VELMORA-TRAVEL-WALLET-BLACK-3_8c4b9b0d-3e1a-4722-8c12-f76dbddbe568.jpeg"
        ]
      },
      {
        "name": "Brown",
        "code": "#56382D",
        "primary": "/media/products/accessories/wallets/6/brown/VELMORA-TRAVEL-WALLET-DARK-CHERRY-1_3c0ad832-9c8a-4393-a6de-7d007082bf57.jpeg",
        "alt": "/media/products/accessories/wallets/6/brown/VELMORA-TRAVEL-WALLET-DARK-CHERRY-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/6/brown/VELMORA-TRAVEL-WALLET-DARK-CHERRY-1_3c0ad832-9c8a-4393-a6de-7d007082bf57.jpeg",
          "/media/products/accessories/wallets/6/brown/VELMORA-TRAVEL-WALLET-DARK-CHERRY-2.jpeg",
          "/media/products/accessories/wallets/6/brown/VELMORA-TRAVEL-WALLET-DARK-CHERRY-5.jpeg",
          "/media/products/accessories/wallets/6/brown/VELMORA-TRAVEL-WALLET-DARK-CHERRY-3_c621dd78-56ea-4801-8f2d-a9f93c24d7ad.jpeg",
          "/media/products/accessories/wallets/6/brown/VELMORA-TRAVEL-WALLET-DARK-CHERRY-4_601acca4-18c1-4feb-aa1b-8973103987f0.jpeg"
        ]
      }
    ],
    "description": "The Travel Wallet is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_7",
    "name": "Passport Holder",
    "category": "Travel & Folios",
    "department": "Accessories",
    "price": 189,
    "badge": "Jetset",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/7/VELMORA-PASSPORT-HOLDER-BLACK-1.jpeg",
        "alt": "/media/products/accessories/wallets/7/VELMORA-PASSPORT-HOLDER-BLACK-1_fa7da02f-95cf-442b-b374-b4df0e1308b3.jpeg",
        "images": [
          "/media/products/accessories/wallets/7/VELMORA-PASSPORT-HOLDER-BLACK-1.jpeg",
          "/media/products/accessories/wallets/7/VELMORA-PASSPORT-HOLDER-BLACK-2.jpeg",
          "/media/products/accessories/wallets/7/VELMORA-PASSPORT-HOLDER-BLACK-3.jpeg",
          "/media/products/accessories/wallets/7/VELMORA-PASSPORT-HOLDER-BLACK-4.jpeg",
          "/media/products/accessories/wallets/7/VELMORA-PASSPORT-HOLDER-BLACK-1_fa7da02f-95cf-442b-b374-b4df0e1308b3.jpeg"
        ]
      },
      {
        "name": "Rose Pink",
        "code": "#D98993",
        "primary": "/media/products/accessories/wallets/7/pink/VELMORA-PASSPORT-WALLET-FROSTING-1 (1).jpeg",
        "alt": "/media/products/accessories/wallets/7/pink/VELMORA-PASSPORT-WALLET-FROSTING-1.jpeg",
        "images": [
          "/media/products/accessories/wallets/7/pink/VELMORA-PASSPORT-WALLET-FROSTING-1.jpeg",
          "/media/products/accessories/wallets/7/pink/VELMORA-PASSPORT-WALLET-FROSTING-2.jpeg",
          "/media/products/accessories/wallets/7/pink/VELMORA-PASSPORT-WALLET-FROSTING-3.jpeg",
          "/media/products/accessories/wallets/7/pink/VELMORA-PASSPORT-WALLET-FROSTING-5.jpeg"
        ]
      }
    ],
    "description": "The Passport Holder is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_8",
    "name": "Poucheroo Phone Wallet",
    "category": "Wallets",
    "department": "Accessories",
    "price": 329,
    "badge": "Micro Bag",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/8/VELMORA-POUCHEROO-PHONE-WALLET-BLACK-CROC-1.jpeg",
        "alt": "/media/products/accessories/wallets/8/VELMORA-POUCHEROO-PHONE-WALLET-BLACK-CROC-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/8/VELMORA-POUCHEROO-PHONE-WALLET-BLACK-CROC-1.jpeg",
          "/media/products/accessories/wallets/8/VELMORA-POUCHEROO-PHONE-WALLET-BLACK-CROC-2.jpeg",
          "/media/products/accessories/wallets/8/VELMORA-POUCHEROO-PHONE-WALLET-BLACK-CROC-3.jpeg",
          "/media/products/accessories/wallets/8/VELMORA-POUCHEROO-PHONE-WALLET-BLACK-CROC-4.jpeg",
          "/media/products/accessories/wallets/8/VELMORA-POUCHEROO-PHONE-WALLET-BLACK-CROC-5.jpeg"
        ]
      },
      {
        "name": "Blue",
        "code": "#56382D",
        "primary": "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-1.jpeg",
        "alt": "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-2.jpeg",
        "images": [
          "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-1.jpeg",
          "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-2.jpeg",
          "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-3.jpeg",
          "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-4.jpeg",
          "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-5.jpeg",
          "/media/products/accessories/wallets/8/blue/VELMORA-POUCHEROO-IRIS-6.jpeg"
        ]
      }
    ],
    "description": "The Poucheroo Phone Wallet is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_wallet_10",
    "name": "Fritz Wallet",
    "category": "Wallets",
    "department": "Accessories",
    "price": 299,
    "badge": "Classic Folio",
    "colors": [
      {
        "name": "Black Leather",
        "code": "#141414",
        "primary": "/media/products/accessories/wallets/10/VELMORA-FRITZ-WALLET-BLACK-1_d4988d5f-4211-4612-a7f7-0d705b41afaf.jpeg",
        "alt": "/media/products/accessories/wallets/10/VELMORA-FRITZ-WALLET-BLACK-2_f79789b5-5452-41b7-b0b5-787f63141fd2.jpeg",
        "images": [
          "/media/products/accessories/wallets/10/VELMORA-FRITZ-WALLET-BLACK-1_d4988d5f-4211-4612-a7f7-0d705b41afaf.jpeg",
          "/media/products/accessories/wallets/10/VELMORA-FRITZ-WALLET-BLACK-2_f79789b5-5452-41b7-b0b5-787f63141fd2.jpeg",
          "/media/products/accessories/wallets/10/VELMORA-FRITZ-WALLET-BLACK-3_9c715946-4fc8-46aa-a5d0-2e02fc3f8e2d.jpeg",
          "/media/products/accessories/wallets/10/VELMORA-FRITZ-WALLET-BLACK-4_dfd88d3c-e191-4396-9f0f-e992c1f6b15f.jpeg",
          "/media/products/accessories/wallets/10/VELMORA-FRITZ-WALLET-BLACK-5_8dfb950d-db86-407f-98c9-c3b1798cc4a1.jpeg"
        ]
      }
    ],
    "description": "The Fritz Wallet is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_blanket",
    "name": "Mountaineer Blanket",
    "category": "Home D\u00e9cor",
    "department": "Accessories",
    "price": 420,
    "badge": "Wool & Silk",
    "colors": [
      {
        "name": "Schist Grey",
        "code": "#64625F",
        "primary": "/media/products/accessories/homedecore/VELMORA-MOUNTAINEER-BLANKET-SCHIST-1.jpeg",
        "alt": "/media/products/accessories/homedecore/VELMORA-MOUNTAINEER-BLANKET-SCHIST-2.jpeg",
        "images": [
          "/media/products/accessories/homedecore/VELMORA-MOUNTAINEER-BLANKET-SCHIST-1.jpeg",
          "/media/products/accessories/homedecore/VELMORA-MOUNTAINEER-BLANKET-SCHIST-2.jpeg",
          "/media/products/accessories/homedecore/VELMORA-MOUNTAINEER-BLANKET-SCHIST-3.jpeg"
        ]
      }
    ],
    "description": "The Mountaineer Blanket is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_candle",
    "name": "Atelier Scented Candle",
    "category": "Home D\u00e9cor",
    "department": "Accessories",
    "price": 98,
    "badge": "Organic Soy",
    "colors": [
      {
        "name": "Smoked Cedar",
        "code": "#C0C0C0",
        "primary": "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-1.jpeg",
        "alt": "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-10.jpeg",
        "images": [
          "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-1.jpeg",
          "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-5.jpeg",
          "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-6.jpeg",
          "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-7.jpeg",
          "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-10.jpeg",
          "/media/products/accessories/homedecore/candle/VELMORA-CANDLE-BOTANICAL-4_3df6d427-5cc0-46c4-93da-7b2a1b8a0323.jpeg"
        ]
      }
    ],
    "description": "The Atelier Scented Candle is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  },
  {
    "id": "acc_leathercare",
    "name": "Organic Leather Care Kit",
    "category": "Leather Care",
    "department": "Accessories",
    "price": 65,
    "badge": "Atelier Care",
    "colors": [
      {
        "name": "Neutral Wax",
        "code": "#E5D3B3",
        "primary": "/media/products/accessories/leathercare/VELMORA-LEATHER-CARE-KIT-1.jpeg",
        "alt": "/media/products/accessories/leathercare/VELMORA-LEATHER-CARE-KIT-2.jpeg",
        "images": [
          "/media/products/accessories/leathercare/VELMORA-LEATHER-CARE-KIT-1.jpeg",
          "/media/products/accessories/leathercare/VELMORA-LEATHER-CARE-KIT-2.jpeg",
          "/media/products/accessories/leathercare/VELMORA-LEATHER-CARE-KIT-4.jpeg"
        ]
      }
    ],
    "description": "The Organic Leather Care Kit is an exquisite small leather companion, tailored with precision stitching, hand-finished edges, and thoughtful functional compartments.",
    "features": [
      "Full-grain buttery calfskin leather exterior",
      "Multiple dedicated card slots and secure cash slip",
      "Hand-lacquered edge stain for lifelong resilience",
      "Velmora gold foil accent branding"
    ],
    "dimensions": "11.5cm W x 8.5cm H x 1.5cm D.",
    "materials": "Exterior: Full-grain French Calfskin. Lining: Archival Cotton Canvas.",
    "care": "Avoid overfilling card slots to preserve shape. Store in dust bag when traveling."
  }
];
