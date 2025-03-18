function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Improved Slideshow Functionality
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add('prev');
    
    currentSlide = (currentSlide + 1) % slides.length;
    
    slides[currentSlide].classList.add('active');
    setTimeout(() => {
        slides[(currentSlide - 1 + slides.length) % slides.length].classList.remove('prev');
    }, 1000);
}

// Initialize first slide
slides[0].classList.add('active');

// Start slideshow
setInterval(nextSlide, 8000);

// Add smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Function to load pets from JSON in chunks
let petsData = []; // Store all pets data
let currentIndex = 0;
const petsPerLoad = 8; // 6 pets per load (2 rows)

async function loadPets() {
    try {
        const response = await fetch("http://localhost/petcare/pets/fetch_pets.php"); // Fetch JSON
        petsData = await response.json(); // Store data in global variable
        // console.log(petsData)
        displayPets(); // Show initial pets
    } catch (error) {
        console.error("Error loading pet data:", error);
    }
}

// Function to display pets in chunks
function displayPets() {
    const petContainer = document.getElementById("petContainer");
    const showMoreBtn = document.getElementById("showMoreBtn");

    const petsToShow = petsData.slice(currentIndex, currentIndex + petsPerLoad);

    petsToShow.forEach(pet => {
        const petCard = document.createElement("div");
        petCard.classList.add("pet-card");
        petCard.innerHTML = `
            <img src="${pet.image}" alt="${pet.name}" class="pet-image">
            <div class="pet-info">
                <h3 class="pet-name">${pet.name}</h3>
                <p class="pet-breed">${pet.breed}</p>
                <p class="pet-age">${pet.age}</p>
                <button class="adopt-button" data-pet-id="${pet.id}">Adopt</button>
            </div>
        `;
        petContainer.appendChild(petCard);
    });

    currentIndex += petsPerLoad;
    if (currentIndex >= petsData.length) {
        showMoreBtn.style.display = "none";
    }
}

// Event Listener for "Show More" button
document.getElementById("showMoreBtn").addEventListener("click", displayPets);

// Load initial pets when the page loads
document.addEventListener("DOMContentLoaded", loadPets);

// Function to load products from JSON
async function loadProducts(url, containerId, showMoreBtnId) {
    try {
        const response = await fetch(url);
        const productsData = await response.json();
        displayProducts(productsData, containerId, showMoreBtnId);
    } catch (error) {
        console.error(`Error loading products from ${url}:`, error);
    }
}

// Function to display products in chunks
function displayProducts(productsData, containerId, showMoreBtnId) {
    const container = document.getElementById(containerId);
    const showMoreBtn = document.getElementById(showMoreBtnId);
    let currentIndex = 0;
    const productsPerLoad = 4;

    function loadMoreProducts() {
        const productsToShow = productsData.slice(currentIndex, currentIndex + productsPerLoad);

        productsToShow.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">${product.price}</p>
                    <button class="buy-button" data-product='${JSON.stringify(product)}'>Buy Now</button>
                </div>
            `;

            container.appendChild(productCard);

            // Add event listener for "Buy Now" button
            productCard.querySelector(".buy-button").addEventListener("click", function () {
                const isSignedIn = localStorage.getItem("userSignedIn");
                if(!isSignedIn){
                    alert("Sign-in to add the product to cart")
                }else{
                    const productData = JSON.parse(this.getAttribute("data-product"));
                    addToCart(productData);
                }
            });
        });

        currentIndex += productsPerLoad;

        if (currentIndex >= productsData.length) {
            showMoreBtn.style.display = "none";
        }
    }

    loadMoreProducts();

    showMoreBtn.addEventListener("click", loadMoreProducts);
}
// Load cat and dog products when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadProducts("http://localhost/petcare/products/cat_products.php", "catProductsContainer", "showMoreCat");
    loadProducts("http://localhost/petcare/products/dog_products.php", "dogProductsContainer", "showMoreDog");
});


// Function to create pet collage
async function createPetCollage() {
    try {
        const response = await fetch("pets.json");
        const petsData = await response.json();
        const collageContainer = document.getElementById("petCollage");
        
        // Shuffle pets array for random order
        const shuffledPets = petsData.sort(() => Math.random() - 0.5);
        
        shuffledPets.forEach(pet => {
            const petItem = document.createElement("div");
            petItem.className = "pet-item";
            petItem.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}" class="pet-images">
                <div class="pet-overlay">
                    <div class="pet-details">
                        <h3 class="pet-names">${pet.name}</h3>
                        <p class="pet-breeds">${pet.breed}</p>
                        <p class="pet-ages">${pet.age}</p>
                    </div>
                </div>
            `;
            collageContainer.appendChild(petItem);
        });

    } catch (error) {
        console.error("Error creating pet collage:", error);
    }
}

// Initialize collage when page loads
document.addEventListener("DOMContentLoaded", createPetCollage);



document.addEventListener("DOMContentLoaded", function () {
    // Attach event listener to the Sell button
    document.querySelector(".sell-link").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior

        // Check if user is signed in (assuming token or session storage)
        const isSignedIn = localStorage.getItem("userSignedIn");

        if (isSignedIn) {
            // Redirect to Sell page
            window.location.href = "sell.html";
        } else {
            // Redirect to Sign-in page
            window.location.href = "signin.html";
        }
    });
});


// pet modal/
const modal = document.getElementById('adoptionModal');
const closeModal = document.querySelector('.close-modal');

// Event delegation for dynamically loaded buttons
document.getElementById('petContainer').addEventListener('click', function(e) {
    if (e.target.classList.contains('adopt-button')) {
        console.log(e.target.classList)
        const petId = e.target.dataset.petId;
        const pet = petsData.find(p => p.id == petId);
        console.log(pet)
        
        if (pet) {
            document.getElementById('modalPetName').textContent = pet.name;
            document.getElementById('modalPetId').textContent = pet.id; 
            document.getElementById('modalPetBreed').textContent = pet.breed;
            document.getElementById('modalPetImage').src = pet.image;
            document.getElementById('modalPetAge').textContent = pet.age;
            document.getElementById('modalPetGender').textContent = pet.gender;
            document.getElementById('modalPetLocation').textContent = pet.location;
            document.getElementById('uploaderName').textContent = pet.uploader_name;
            document.getElementById('uploaderEmail').textContent = pet.uploader_email;
            modal.style.display = 'block';
        }
    }
});

// Keep existing close modal and request handling
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

document.getElementById('requestAdoption').addEventListener('click', () => {
    modal.style.display = 'none';
});

document.addEventListener("DOMContentLoaded", function () {
    const requestsListItem = document.getElementById("requestsListItem");
    const signupListItem = document.getElementById("signupListItem");
    const userEmail = localStorage.getItem("email");

    if (userEmail) {
        requestsListItem.style.display = "block"; // Show Requests link
        signupListItem.style.display = "none";    // Hide SignUp completely
    } else {
        requestsListItem.style.display = "none";  // Hide Requests link
        signupListItem.style.display = "block";   // Show SignUp
    }
});


function request() {
    // Get logged-in user details (assuming you store them in localStorage)
    const fromUser = localStorage.getItem("email"); // User's email
    const toUser = document.getElementById("uploaderEmail").textContent; // Pet uploader's email
    const petId = document.getElementById("modalPetId").textContent; // Unique pet ID from the database

    if (!fromUser) {
        alert("You need to be logged in to request adoption.");
        return;
    }

    // Prevent self-adoption requests
    if (fromUser === toUser) {
        alert("You cannot adopt your own pet.");
        return;
    }

    // Prepare data to send
    const requestData = {
        from: fromUser,
        to: toUser,
        pet_id: petId
    };

    // Send data to backend PHP script
    fetch("http://localhost/petcare/adopt/create_request.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Adoption request sent successfully!");
        } else {
            alert("You have already sent adopaion request!")
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error processing adoption request.");
    });

    // Close modal
    modal.style.display = "none";
}



let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Open cart modal
document.getElementById("cartIcon").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("cartModal").style.display = "block";
});

// Close cart modal
document.querySelector(".close-cart").addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
});

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    saveCart();
}

function updateCartDisplay(orderPlaced = false) {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.querySelector(".cart-count");
    const cartAddress = document.querySelector(".cart-address");
    const checkoutBtn = document.querySelector(".checkout-btn");
    const cart_total = document.querySelector(".cart-total");

    cartItems.innerHTML = "";
    let total = 0;
    let totalQuantity = 0;

    // Display placed orders
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (orders.length > 0) {
        orders.forEach((order) => {
            const orderElement = document.createElement("div");
            orderElement.className = "order-item";
            orderElement.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p><strong>Order Date:</strong> ${order.date}</p>
                <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-detail">
                            <img src="${item.image}" alt="${item.name}">
                            <p>${item.name} - ₹${item.price} x ${item.quantity}</p>
                        </div>
                    `).join("")}
                </div>
                <button class="cancel-order-btn" onclick="cancelOrder(${order.id})">Cancel Order</button>
            `;
            cartItems.appendChild(orderElement);
        });
    }

    // Display current cart items
    if (cart.length === 0) {
        if (!orderPlaced) {
            cartItems.innerHTML = "<p class='empty-cart-message'>No items available in cart</p>";
            cartTotal.textContent = "No items available";
            cart_total.style.display = "none";
        } else {
            cartTotal.textContent = ""; // Hide total when order is placed
        }

        cartAddress.style.display = "none";
        checkoutBtn.style.display = "none";
        cartCount.textContent = "0"; // Reset cart count
        return;
    }

    cartItems.innerHTML = "<p class='empty-cart-message'>All products on this website can only be delivered via Cash on Delivery (COD)</p>";

    cart.forEach((item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
        total += price * item.quantity;
        totalQuantity += item.quantity;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${price.toFixed(2)}</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        `;

        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = `₹${total.toFixed(2)}`;
    cartCount.textContent = totalQuantity;

    // Show address and checkout button if cart is not empty
    cartAddress.style.display = "block";
    checkoutBtn.style.display = "block";
}



// Update item quantity
function updateQuantity(id, change) {
    id = Number(id); // Convert id to a number to match cart item IDs
    console.log("Looking for ID:", id, "in cart:", cart);

    const item = cart.find((item) => Number(item.id) === id);
    console.log("Found item:", item);

    if (item) {
        item.quantity += change;

        // Prevent negative quantities
        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

// Remove item from cart
function removeItem(id) {
    cart = cart.filter((item) => Number(item.id) !== id);
    updateCartDisplay();
    saveCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Initialize cart display
updateCartDisplay();

function placeOrder() {
    const address = document.getElementById("address").value.trim();
    const orderMessage = document.getElementById("orderMessage");
    const cart_total = document.querySelector(".cart-total");

    if (cart.length === 0) {
        orderMessage.textContent = "Your cart is empty. Add items before placing an order.";
        orderMessage.style.color = "red";
        return;
    }

    if (address === "") {
        orderMessage.textContent = "Please enter a delivery address.";
        orderMessage.style.color = "red";
        return;
    }

    // Calculate delivery date (today + 10 days)
    const today = new Date();
    today.setDate(today.getDate() + 10);
    const deliveryDate = today.toDateString();

    // Create order object
    const order = {
        id: Date.now(), // Unique order ID
        date: new Date().toLocaleString(), // Order date
        deliveryDate: deliveryDate,
        address: address,
        items: cart,
        status: "Pending" // Order status
    };

    // Save order to local storage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Show order confirmation message
    orderMessage.textContent = `Your order has been placed! It will be delivered to "${address}" on ${deliveryDate}.`;
    orderMessage.style.color = "green";

    // Clear the cart after placing an order
    cart = [];
    saveCart();
    updateCartDisplay(true);
    cart_total.style.display = "none";
}


document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const subject = encodeURIComponent("User Feedback from " + name);
    const body = encodeURIComponent(message);

    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=petcare@gmail.com&su=${subject}&body=${body}`;
});