interface PrintfulProduct {
  id: number
  external_id: string
  name: string
  variants: number
  synced: number
  thumbnail_url?: string
  is_ignored: boolean
}

interface PrintfulProductDetails {
  id: number
  external_id: string
  name: string
  variants: Array<{
    id: number
    external_id: string
    sync_variant_id: number
    name: string
    synced: boolean
    variant_id: number
    main_category_id: number
    warehouse_product_variant_id?: number
    retail_price: string
    sku: string
    product: {
      variant_id: number
      product_id: number
      image: string
      name: string
    }
    files: Array<{
      id: number
      type: string
      hash?: string
      url?: string
      filename: string
      mime_type: string
      size: number
      width?: number
      height?: number
      x?: number
      y?: number
      scale?: number
      visible: boolean
    }>
    options: Array<{
      id: string
      value: string | number
    }>
    is_ignored: boolean
  }>
  synced: number
  thumbnail_url?: string
}

interface PrintfulOrder {
  external_id: string
  shipping: string
  recipient: {
    name: string
    company?: string
    address1: string
    address2?: string
    city: string
    state_code: string
    state_name: string
    country_code: string
    country_name: string
    zip: string
    phone?: string
    email: string
  }
  items: Array<{
    sync_variant_id?: number
    external_variant_id?: string
    variant_id?: number
    quantity: number
    price: string
    retail_price?: string
    name?: string
    product?: {
      variant_id: number
      product_id: number
      image: string
      name: string
    }
    files?: Array<{
      type: string
      url: string
    }>
    options?: Array<{
      id: string
      value: string | number
    }>
  }>
  retail_costs?: {
    currency: string
    subtotal: string
    discount: string
    shipping: string
    tax: string
    vat: string
    total: string
  }
}

class PrintfulAPI {
  private baseURL = 'https://api.printful.com'
  private apiToken: string
  private storeId?: string

  constructor(apiToken: string, storeId?: string) {
    this.apiToken = apiToken
    this.storeId = storeId
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Printful API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.result
  }

  // Store operations
  async getStoreInfo() {
    return this.request('/store')
  }

  // Product operations - Use sync products for stores with synced products
  async getProducts(): Promise<any[]> {
    try {
      // Use sync products endpoint for stores with synced products
      const params = this.storeId ? `?store_id=${this.storeId}` : ''
      const response = await this.request<any[]>(`/sync/products${params}`)
      console.log(`Fetched ${response.length} synced products from your store`)
      return response
    } catch (error) {
      console.error('Error fetching sync products:', error)
      throw error
    }
  }

  async getProduct(id: string): Promise<any> {
    try {
      // Use sync products endpoint
      const params = this.storeId ? `?store_id=${this.storeId}` : ''
      return await this.request(`/sync/products/${id}${params}`)
    } catch (error) {
      console.error(`Error fetching sync product ${id}:`, error)
      throw error
    }
  }

  async createProduct(product: any): Promise<PrintfulProductDetails> {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    return this.request(`/store/products${params}`, {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, product: any): Promise<PrintfulProductDetails> {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    return this.request(`/store/products/${id}${params}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    await this.request(`/store/products/${id}${params}`, {
      method: 'DELETE',
    })
  }

  // Order operations
  async getOrders() {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    return this.request(`/orders${params}`)
  }

  async getOrder(id: string) {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    return this.request(`/orders/${id}${params}`)
  }

  async createOrder(order: PrintfulOrder) {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    return this.request(`/orders${params}`, {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  async confirmOrder(id: string) {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    return this.request(`/orders/${id}/confirm${params}`, {
      method: 'POST',
    })
  }

  async cancelOrder(id: string) {
    const params = this.storeId ? `?store_id=${this.storeId}` : ''
    return this.request(`/orders/${id}${params}`, {
      method: 'DELETE',
    })
  }

  // Catalog operations (for product templates)
  async getCatalogProducts() {
    return this.request('/products')
  }

  async getCatalogProduct(id: string) {
    return this.request(`/products/${id}`)
  }

  async getCatalogVariant(id: string) {
    return this.request(`/products/variant/${id}`)
  }

  // Shipping operations
  async calculateShipping(order: Partial<PrintfulOrder>) {
    return this.request('/shipping/rates', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  // Webhook operations
  async getWebhooks() {
    return this.request('/webhooks')
  }

  async createWebhook(url: string, types: string[]) {
    return this.request('/webhooks', {
      method: 'POST',
      body: JSON.stringify({ url, types }),
    })
  }

  async deleteWebhook(id: string) {
    return this.request(`/webhooks/${id}`, {
      method: 'DELETE',
    })
  }
}

// Helper function to transform Printful sync product to our internal product format
export function transformPrintfulProduct(syncProduct: any) {
  try {
    // Handle sync product structure from /sync/products endpoint
    if (!syncProduct || !syncProduct.sync_variants || syncProduct.sync_variants.length === 0) {
      console.warn(`Product ${syncProduct?.id} has no variants, skipping`)
      return null
    }

    // Find a synced variant or use the first available
    const defaultVariant = syncProduct.sync_variants.find((v: any) => v.synced) || syncProduct.sync_variants[0]
    
    if (!defaultVariant) {
      console.warn(`Product ${syncProduct.id} has no valid variant`)
      return null
    }

    // Get the best available image
    const imageUrl = 
      defaultVariant?.files?.find((f: any) => f.type === 'preview')?.preview_url ||
      defaultVariant?.files?.find((f: any) => f.type === 'default')?.preview_url ||
      defaultVariant?.product?.image ||
      syncProduct.thumbnail_url ||
      'https://via.placeholder.com/400x400/1a1a1a/00ffff?text=Product'
    
    // Get category from product type or name
    const category = defaultVariant?.product?.type_name || syncProduct.sync_variants?.[0]?.product?.type_name || 'General'

    // Parse retail price - ensure it's a valid number
    let price = 25.99 // Default fallback
    if (defaultVariant.retail_price) {
      const parsedPrice = parseFloat(defaultVariant.retail_price)
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        price = parsedPrice
      }
    }

    return {
      id: syncProduct.id,
      name: syncProduct.name,
      description: `High-quality ${syncProduct.name}`,
      price: price,
      image: imageUrl,
      category: category,
      variants: (syncProduct.sync_variants || [])
        .filter((v: any) => v.synced) // Only include synced variants
        .map((variant: any) => {
          let variantPrice = price // Use default price as fallback
          if (variant.retail_price) {
            const parsedVariantPrice = parseFloat(variant.retail_price)
            if (!isNaN(parsedVariantPrice) && parsedVariantPrice > 0) {
              variantPrice = parsedVariantPrice
            }
          }

          return {
            id: variant.id,
            title: variant.name || 'Default',
            price: variantPrice,
            available: variant.synced,
            sku: variant.sku || '',
            sync_variant_id: variant.id,
            product: variant.product,
          }
        }),
      images: [imageUrl],
      tags: [category.toLowerCase(), 'retro', 'gaming'],
      printfulId: syncProduct.id,
      external_id: syncProduct.external_id,
    }
  } catch (error) {
    console.error(`Error transforming product ${syncProduct?.id}:`, error)
    return null
  }
}

export default PrintfulAPI
export type { PrintfulProduct, PrintfulProductDetails, PrintfulOrder }