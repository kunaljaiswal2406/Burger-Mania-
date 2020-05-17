var shoppingCart = (function() {
    // Private methods and propeties
    cart = [];
    
        // Constructor
        class Item {
            constructor(name, price, count,category) {
                this.name = name;
                this.price = price;
                this.count = count;
                this.category = category;
            }
        }
    
    // Save cart
    function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    
    // Load cart
    function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
    }
    
    //public obj and methods for it
    var obj = {};
    
    // Add to cart
    obj.addItemToCart = function(name, price, count,category) {
    for(var item in cart) {
    if(cart[item].name === name && cart[item].category === category) {
        cart[item].count ++;
        saveCart();
        return;
    }
    }
    var item = new Item(name, price, count,category);
    cart.push(item);
    saveCart();
    }
    // Set count from item
    obj.setCountForItem = function(name, count, category) {
    for(var i in cart) {
    if (cart[i].name === name && cart[i].category === category) {
        cart[i].count = count;
        break;
    }
    }
    };
    // Remove item from cart
    obj.removeItemFromCart = function(name,category) {
    for(var item in cart) {
        if(cart[item].name === name && cart[i].category === category) {
        cart[item].count --;
        if(cart[item].count === 0) {
            cart.splice(item, 1);
        }
        break;
        }
    }
    saveCart();
    }
    
    // Remove all items from cart
    obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
    if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
    }
    }
    saveCart();
    }
    
    // Clear cart
    obj.clearCart = function() {
    cart = [];
    saveCart();
    }
    
    // Count cart 
    obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
    totalCount += cart[item].count;
    }
    return totalCount;
    }
    
    // Total cart
    obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
    totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
    }
    
    // List cart
    obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
    item = cart[i];
    itemCopy = {};
    for(p in item) {
        itemCopy[p] = item[p];
    
    }
    itemCopy.total = Number(item.price * item.count).toFixed(2);
    cartCopy.push(itemCopy)
    }
    return cartCopy;
    }
    
    // cart : Array
    // Item : Object
    // addItemToCart : Function
    // removeItemFromCart : Function
    return obj;
    })();
    
    
// Triggers / Events

// Add item
$('.add-to-cart').click(function(event) {
let a = event.target;
let item=a.parentElement;
var name = $(this).data('name');
var price;
console.log(item);
var burgerType = item.getElementsByClassName("category");
burgerType = burgerType[0].value;
console.log(burgerType);
if(burgerType == "veg")
{
    price = 100;
    category="veg";
}
else if(burgerType == "egg")
{
    price=150;
    category="egg";
}
else if(burgerType == "chicken")
{
    price=200;
    category="chicken";
}
shoppingCart.addItemToCart(name, price, 1, category);
displayCart();
});

// Clear items
$('.clear-cart').click(function() {
shoppingCart.clearCart();
displayCart();
});


function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray) {
        output += "<tr>"
        + "<td>" + cartArray[i].name + "</td>" 
        + "<td>" + cartArray[i].category +"</td>"
        + "<td>("+ cartArray[i].price + ")</td>"
        + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
        + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
        + " = " 
        + "<td>" + cartArray[i].total + "</td>" 
        +  "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
    }

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
console.log("delete item");
var name = $(this).data('name');
console.log(name);
shoppingCart.removeItemFromCartAll(name);
displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
var name = $(this).data('name');
var count = Number($(this).val());
shoppingCart.setCountForItem(name, count);
displayCart();
});

$('.show-cart').on("click",".place-order",function(event){
    var dataorder = {
        'totalquantity' : shoppingCart.totalCount(),
        'totalPrice' : shoppingCart.totalcart()
    };
    $.ajax({
        type: "POST",
        url: "http://localhost:9876/orders",
        datatype: "JSON",
        ContentType: "application/json; character=utf-8",
        data: {
            "totalquantity" : shoppingCart.totalCount(),"totalPrice" : shoppingCart.totalCart
        },
        success: function(data){
            console.log("success" + JSON.stringify(data));
        },
        error:function(){
            console.log("Error");
        }
    });
})

displayCart();