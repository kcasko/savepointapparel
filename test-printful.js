// Test file to verify Printful API integration
const PRINTFUL_API_TOKEN = 'jcnXNj5djU7assowHkbcIJm78BKaKe1yPMBJnKDS';

async function testPrintfulAPI() {
  try {
    console.log('Testing Printful API...');
    
    const response = await fetch('https://api.printful.com/products', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.result.length} catalog products`);
    
    // Show first few products
    const products = data.result.slice(0, 5);
    products.forEach(product => {
      console.log(`- ${product.title} (ID: ${product.id}, Type: ${product.type_name})`);
    });

    return data.result;
  } catch (error) {
    console.error('❌ Error testing Printful API:', error.message);
    return null;
  }
}

// Transform function test
function transformPrintfulProduct(printfulProduct) {
  const imageUrl = printfulProduct.image || '/placeholder.jpg';
  const category = printfulProduct.type_name || 'General';
  const basePrice = 25.99;

  return {
    id: printfulProduct.id,
    name: printfulProduct.title,
    description: printfulProduct.description || `High-quality ${printfulProduct.title} with retro gaming design`,
    price: basePrice,
    image: imageUrl,
    category: category,
    variants: [{
      id: `${printfulProduct.id}-default`,
      title: printfulProduct.title,
      price: basePrice,
      available: true,
      sku: `catalog-${printfulProduct.id}`,
    }],
    images: [imageUrl],
    tags: [category.toLowerCase(), 'retro', 'gaming'],
    printfulId: printfulProduct.id,
    external_id: `catalog-${printfulProduct.id}`,
  };
}

testPrintfulAPI().then(products => {
  if (products) {
    console.log('🎉 Printful integration should work!');
    console.log('\nTransforming first product as example:');
    const transformed = transformPrintfulProduct(products[0]);
    console.log('Transformed product:', JSON.stringify(transformed, null, 2));
  } else {
    console.log('❌ Printful integration has issues');
  }
});