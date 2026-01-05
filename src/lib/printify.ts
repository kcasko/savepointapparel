interface PrintifyProduct {
  id: string
  title: string
  description: string
  tags: string[]
  options: Array<{
    name: string
    type: string
    values: Array<{
      id: number
      title: string
    }>
  }>
  variants: Array<{
    id: number
    sku: string
    cost: number
    price: number
    title: string
    grams: number
    is_enabled: boolean
    is_default: boolean
    is_available: boolean
    options: number[]
  }>
  images: Array<{
    src: string
    variant_ids: number[]
    position: string
    is_default: boolean
  }>
  created_at: string
  updated_at: string
  visible: boolean
  is_locked: boolean
  blueprint_id: number
  user_id: number
  shop_id: number
}

interface PrintifyOrder {
  id?: string
  external_id: string
  label?: string
  line_items: Array<{
    product_id: string
    variant_id: number
    quantity: number
  }>
  shipping_method: number
  is_printify_express: boolean
  send_shipping_notification: boolean
  address_to: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    country: string
    region: string
    address1: string
    address2?: string
    city: string
    zip: string
  }
}

interface PrintifyShop {
  id: number
  title: string
  sales_channel: string
}

class PrintifyAPI {
  private baseURL = 'https://api.printify.com/v1'
  private apiToken: string
  private shopId: string

  constructor(apiToken: string, shopId: string) {
    this.apiToken = apiToken
    this.shopId = shopId
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
      throw new Error(`Printify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Shop operations
  async getShops(): Promise<PrintifyShop[]> {
    const response = await this.request<{ data: PrintifyShop[] }>('/shops.json')
    return response.data
  }

  // Product operations
  async getProducts(page = 1, limit = 10): Promise<{ data: PrintifyProduct[], current_page: number, total: number }> {
    return this.request(`/shops/${this.shopId}/products.json?page=${page}&limit=${limit}`)
  }

  async getProduct(productId: string): Promise<PrintifyProduct> {
    return this.request(`/shops/${this.shopId}/products/${productId}.json`)
  }

  async createProduct(product: Partial<PrintifyProduct>): Promise<PrintifyProduct> {
    return this.request(`/shops/${this.shopId}/products.json`, {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateProduct(productId: string, product: Partial<PrintifyProduct>): Promise<PrintifyProduct> {
    return this.request(`/shops/${this.shopId}/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.request(`/shops/${this.shopId}/products/${productId}.json`, {
      method: 'DELETE',
    })
  }

  // Order operations
  async getOrders(page = 1, limit = 10): Promise<{ data: PrintifyOrder[], current_page: number, total: number }> {
    return this.request(`/shops/${this.shopId}/orders.json?page=${page}&limit=${limit}`)
  }

  async getOrder(orderId: string): Promise<PrintifyOrder> {
    return this.request(`/shops/${this.shopId}/orders/${orderId}.json`)
  }

  async createOrder(order: PrintifyOrder): Promise<PrintifyOrder> {
    return this.request(`/shops/${this.shopId}/orders.json`, {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  async submitOrder(orderId: string): Promise<PrintifyOrder> {
    return this.request(`/shops/${this.shopId}/orders/${orderId}/actions/send_to_production.json`, {
      method: 'POST',
    })
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.request(`/shops/${this.shopId}/orders/${orderId}/actions/cancel.json`, {
      method: 'POST',
    })
  }

  // Catalog operations (for discovering products to sell)
  async getBlueprintProviders(): Promise<any[]> {
    const response = await this.request<{ data: any[] }>('/catalog/blueprints.json')
    return response.data
  }

  async getBlueprint(blueprintId: number): Promise<any> {
    return this.request(`/catalog/blueprints/${blueprintId}.json`)
  }

  async getPrintProviders(blueprintId: number): Promise<any[]> {
    const response = await this.request<{ data: any[] }>(`/catalog/blueprints/${blueprintId}/print_providers.json`)
    return response.data
  }

  async getVariants(blueprintId: number, printProviderId: number): Promise<any[]> {
    const response = await this.request<{ data: any[] }>(`/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`)
    return response.data
  }

  async getShippingInformation(blueprintId: number, printProviderId: number): Promise<any> {
    const response = await this.request<{ data: any }>(`/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/shipping.json`)
    return response.data
  }
}

// Helper function to transform Printify product to our internal product format
export function transformPrintifyProduct(printifyProduct: PrintifyProduct) {
  const defaultVariant = printifyProduct.variants.find(v => v.is_default) || printifyProduct.variants[0]
  const defaultImage = printifyProduct.images.find(img => img.is_default) || printifyProduct.images[0]

  return {
    id: parseInt(printifyProduct.id),
    name: printifyProduct.title,
    description: printifyProduct.description,
    price: defaultVariant ? defaultVariant.price / 100 : 0, // Convert cents to dollars
    image: defaultImage ? defaultImage.src : '/placeholder.jpg',
    category: printifyProduct.tags[0] || 'General',
    variants: printifyProduct.variants.map(variant => ({
      id: variant.id,
      title: variant.title,
      price: variant.price / 100,
      available: variant.is_available && variant.is_enabled,
      sku: variant.sku,
    })),
    images: printifyProduct.images.map(img => img.src),
    tags: printifyProduct.tags,
    printifyId: printifyProduct.id,
  }
}

export default PrintifyAPI
export type { PrintifyProduct, PrintifyOrder, PrintifyShop }