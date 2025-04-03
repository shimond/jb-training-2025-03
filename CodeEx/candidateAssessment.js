// Complex object representing a shopping cart
const shoppingCart = {
    items: [],
    customer: {
        id: null,
        name: '',
        email: '',
        preferences: {
            notifications: true,
            currency: 'USD'
        }
    },
    
    // Method to add item with validation
    addItem(product, quantity = 1) {
        if (!product.id || !product.price || !product.name) {
            throw new Error('Invalid product structure');
        }

        const existingItem = this.items.find(item => item.productId === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = this.calculateItemPrice(existingItem);
        } else {
            this.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                totalPrice: product.price * quantity
            });
        }
    },

    // Calculate price with discount
    calculateItemPrice(item) {
        const discount = this.getDiscount(item.quantity);
        return (item.price * item.quantity) * (1 - discount);
    },

    // Progressive discount based on quantity
    getDiscount(quantity) {
        if (quantity >= 10) return 0.15;
        if (quantity >= 5) return 0.1;
        if (quantity >= 3) return 0.05;
        return 0;
    },

    // Async method to validate and update customer
    async updateCustomer(customerData) {
        try {
            // Email validation using regex
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            
            if (!emailRegex.test(customerData.email)) {
                throw new Error('Invalid email format');
            }

            // Simulate API call to validate customer
            const validationResult = await this.validateCustomerWithServer(customerData);
            
            if (validationResult.isValid) {
                this.customer = {
                    ...this.customer,
                    ...customerData
                };
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Customer update failed:', error);
            throw error;
        }
    },

    // Promise-based API call simulation
    validateCustomerWithServer(customerData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (customerData.id && customerData.name) {
                    resolve({ isValid: true });
                } else {
                    reject(new Error('Invalid customer data'));
                }
            }, 1000);
        });
    },

    // Complex cart total calculation
    calculateTotal() {
        return this.items.reduce((total, item) => {
            const itemTotal = this.calculateItemPrice(item);
            return total + itemTotal;
        }, 0);
    },

    // Array manipulation and filtering
    getItemsByPriceRange(minPrice, maxPrice) {
        return this.items
            .filter(item => item.price >= minPrice && item.price <= maxPrice)
            .sort((a, b) => a.price - b.price);
    },

    // Async data fetching with error handling
    async fetchRecommendations() {
        try {
            const response = await fetch('https://api.example.com/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerId: this.customer.id,
                    items: this.items.map(item => item.productId)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.processRecommendations(data);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            return [];
        }
    },

    // Data processing with array methods
    processRecommendations(data) {
        return data
            .filter(item => !this.items.some(cartItem => cartItem.productId === item.id))
            .map(item => ({
                ...item,
                relevanceScore: this.calculateRelevanceScore(item)
            }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 5);
    },

    // Complex scoring algorithm
    calculateRelevanceScore(item) {
        let score = 0;
        
        // Price range matching
        const avgCartPrice = this.items.reduce((sum, cartItem) => sum + cartItem.price, 0) / this.items.length;
        const priceDiff = Math.abs(item.price - avgCartPrice);
        score += (1 - (priceDiff / avgCartPrice)) * 50;

        // Category matching
        const categoryMatch = this.items.some(cartItem => cartItem.category === item.category);
        if (categoryMatch) score += 30;

        // Customer preference matching
        if (this.customer.preferences.categories?.includes(item.category)) {
            score += 20;
        }

        return Math.min(100, Math.max(0, score));
    }
};

// Usage example
async function demonstrateUsage() {
    // Initialize cart with customer
    await shoppingCart.updateCustomer({
        id: 123,
        name: 'John Doe',
        email: 'john@example.com'
    });

    // Add products
    const products = [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
        { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics' },
        { id: 3, name: 'Coffee Mug', price: 9.99, category: 'Kitchen' }
    ];

    products.forEach(product => shoppingCart.addItem(product));

    // Calculate total
    const total = shoppingCart.calculateTotal();
    console.log('Cart Total:', total);

    // Get filtered items
    const affordableItems = shoppingCart.getItemsByPriceRange(0, 100);
    console.log('Affordable Items:', affordableItems);

    // Get recommendations
    const recommendations = await shoppingCart.fetchRecommendations();
    console.log('Recommendations:', recommendations);
}