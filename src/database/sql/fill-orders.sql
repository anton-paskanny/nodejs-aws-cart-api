INSERT INTO orders (user_id, cart_id, payment, delivery, comments, status, total) 
VALUES
    (
        'a0eebf5b-233e-4a91-a098-36e657f39e09',  
        'b1f5ec6c-452b-4f56-9d88-8c3f5a2a8e5b',  
        '{"type": "credit_card"}',  
        '{"address": "123 Elm St, Springfield", "type": "standard"}',  
        'First order with comments',  
        'ORDERED',  
        50  
    ),
    (
        'c2d8ef7d-567c-4e5e-94f7-9e1b7c3f4a6d',  
        'd3e9f8ee-678d-4f6f-a0e1-a1c5d4a8f7be',  
        '{"type": "paypal"}',  
        '{"address": "456 Oak St, Springfield", "type": "express"}',  
        'Second order with additional notes',  
        'OPEN',  
        75  
    ),
    (
        'e4f9d8ce-789e-4b89-b1f3-a2d4b5c6d8f9',  
        'f5e9d9ef-789f-4b6f-a1e1-b3c5d6a7e8f9',  
        '{"type": "bank_transfer"}',  
        '{"address": "789 Pine St, Springfield", "type": "overnight"}',  
        'Third order, urgent delivery',  
        'ORDERED',  
        100  
    );
