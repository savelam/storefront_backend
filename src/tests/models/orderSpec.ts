import supertest = require('supertest');

import { OrderStore } from '../../models/Order';
import { ProductStore } from '../../models/Product';
import { UserStore } from '../../models/User';
import { Order } from '../../types/order';
import app from '../../server';
import { TEST_USER_PASSWORD, API_BASE_URL } from '../../utils/constants';

const req = supertest(app);

describe('OrderStore should have ', () => {
  it('create method', () => {
    expect(OrderStore.create).toBeDefined();
  });
  it('currentOrdersByUser method', () => {
    expect(OrderStore.currentOrdersByUser).toBeDefined();
  });
  it('completedOrdersByUser method', () => {
    expect(OrderStore.completedOrdersByUser).toBeDefined();
  });
  it('completeUserOrder method', () => {
    expect(OrderStore.completeUserOrder).toBeDefined();
  });
});

describe('OrderStore should', () => {
  it('create order', async () => {
    const user = await UserStore.create({
      firstName: 'Adam',
      lastName: 'Smith',
      password: 'Smith@123'
    });
    const product = await ProductStore.create({
      name: 'Product  ',
      price: '150',
      category: 'Test'
    });

    const order = (await OrderStore.create({
      userId: user.id,
      products: [{ productId: product.id, quantity: 3 }]
    })) as Order;

    expect(order).toEqual({
      id: order.id,
      products: [
        {
          id: order.products[0].id,
          productId: product.id,
          quantity: 3,
          orderId: order.id
        }
      ],
      status: order.status,
      userId: order.userId,
      createdAt: order.createdAt,
      completedAt: null
    });
  });

  it('should create multiple orders', async () => {
    const user = await UserStore.create({
      firstName: 'Paul',
      lastName: 'Jake',
      password: 'jake@paul'
    });

    const product = await ProductStore.create({
      name: 'Product 2',
      price: '30',
      category: 'Test 2'
    });

    const orderOne = {
      userId: user.id,
      products: [{ productId: product.id, quantity: 4 }]
    };

    const orderTwo = {
      userId: user.id,
      products: [{ productId: product.id, quantity: 3 }]
    };

    const orders = (await OrderStore.create([orderOne, orderTwo])) as Order[];

    expect(orders).toEqual([orders[0], orders[1]]);
  });

  it('should complete order', async () => {
    const user = await UserStore.create({
      firstName: 'Anthony',
      lastName: 'Joshua',
      password: 'joshua@#anthony'
    });
    const product = await ProductStore.create({
      name: 'Fancy Fish',
      price: '50.50',
      category: 'Fish'
    });
    const compOrder = (await OrderStore.create({
      userId: user.id,
      products: [{ productId: product.id, quantity: 3 }]
    })) as Order;

    const orderToComplete = {
      orderId: compOrder.id,
      userId: user.id
    };
    const completedOrder = (await OrderStore.completeUserOrder(
      orderToComplete
    )) as Order;

    expect(completedOrder).toEqual({
      id: completedOrder.id,
      products: completedOrder.products,
      userId: completedOrder.userId,
      status: completedOrder.status,
      createdAt: completedOrder.createdAt,
      completedAt: completedOrder.completedAt
    });
  });

  it('should complete multiple orders', async () => {
    const multiProduct = await ProductStore.create({
      name: 'Product 3',
      price: '3.45',
      category: 'Category 3'
    });

    const multiUser = await UserStore.create({
      firstName: 'Tyson',
      lastName: 'Fury',
      password: 'fury@$usyk'
    });

    const multiOrder = (await OrderStore.create({
      userId: multiUser.id,
      products: [{ productId: multiProduct.id, quantity: 5 }]
    })) as Order;

    const multiOrderTwo = (await OrderStore.create({
      userId: multiUser.id,
      products: [{ productId: multiProduct.id, quantity: 5 }]
    })) as Order;

    const completedOrders = (await OrderStore.completeUserOrder([
      {
        orderId: multiOrder.id,
        userId: multiUser.id
      },
      {
        orderId: multiOrderTwo.id,
        userId: multiUser.id
      }
    ])) as Order[];

    expect(completedOrders).toEqual([
      {
        id: completedOrders[0].id,
        products: completedOrders[0].products,
        userId: completedOrders[0].userId,
        status: completedOrders[0].status,
        createdAt: completedOrders[0].createdAt,
        completedAt: completedOrders[0].completedAt
      },
      {
        id: completedOrders[1].id,
        products: completedOrders[1].products,
        userId: completedOrders[1].userId,
        status: completedOrders[1].status,
        createdAt: completedOrders[1].createdAt,
        completedAt: completedOrders[1].completedAt
      }
    ]);
  });

  it('should show active orders by user', async () => {
    const activeUser = await UserStore.create({
      firstName: 'Usyk',
      lastName: 'Osleksandr',
      password: 'usyk@38d'
    });

    const activeProduct = await ProductStore.create({
      name: 'Product 7',
      price: '350',
      category: 'Category 7'
    });

    const orderFour = {
      userId: activeUser.id,
      products: [{ productId: activeProduct.id, quantity: 5 }]
    };

    const activeOrder = (await OrderStore.create(orderFour)) as Order;

    expect(await OrderStore.currentOrdersByUser(activeUser.id)).toEqual([
      activeOrder
    ]);
  });

  it('should show completed orders by user', async () => {
    const compProduct = await ProductStore.create({
      name: 'Plate',
      price: '89',
      category: 'Category 7'
    });

    const compUser = await UserStore.create({
      firstName: 'Joe',
      lastName: 'Joyce',
      password: 'joyce@33'
    });

    const compOrderFive = (await OrderStore.create({
      userId: compUser.id,
      products: [{ productId: compProduct.id, quantity: 7 }]
    })) as Order;

    const completedOrderFive = (await OrderStore.completeUserOrder({
      userId: compUser.id,
      orderId: compOrderFive.id
    })) as Order;

    const result = await OrderStore.completedOrdersByUser(compUser.id);

    expect(result).toEqual([completedOrderFive]);
  });
});

describe('order route should send status code', () => {
  it('200 if completed orders route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'Joseph',
      lastName: 'Parker',
      password: TEST_USER_PASSWORD
    });
    const res = await req.get(`${API_BASE_URL}/orders/${user.id}/complete`);
    expect(res.statusCode).toBe(200);
  });

  it('200 if active orders route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'Deontay',
      lastName: 'Wilder',
      password: TEST_USER_PASSWORD
    });
    const res = await req.get(`${API_BASE_URL}/orders/${user.id}/active`);
    expect(res.statusCode).toBe(200);
  });

  it('201 if order is created', async () => {
    const user = await UserStore.create({
      firstName: 'Daniel',
      lastName: 'Duboi',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Ladies wear',
      price: '10',
      category: 'Fashion'
    });
    const res = await req.post(`${API_BASE_URL}/orders`).send({
      userId: user.id,
      products: [
        {
          productId: product.id,
          quantity: 5
        }
      ]
    });
    expect(res.statusCode).toBe(201);
  });

  it('201 if  multiple orders are created', async () => {
    const user = await UserStore.create({
      firstName: 'Dell',
      lastName: 'Boy',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Jacket',
      price: '50',
      category: 'Fashion'
    });
    const res = await req.post(`${API_BASE_URL}/orders`).send([
      {
        userId: user.id,
        products: [{ productId: product.id, quantity: 5 }]
      },
      {
        userId: user.id,
        products: [{ productId: product.id, quantity: 12 }]
      }
    ]);
    expect(res.statusCode).toBe(201);
  });

  it('200 if order is completed', async () => {
    const user = await UserStore.create({
      firstName: 'Dell',
      lastName: 'Boy',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Jeans',
      price: '80.88',
      category: 'Fashion'
    });

    const order = (await OrderStore.create({
      userId: user.id,
      products: [{ productId: product.id, quantity: 3 }]
    })) as Order;
    const res = await req.post(`${API_BASE_URL}/orders/complete-order`).send({
      userId: user.id,
      orderId: order.id
    });
    expect(res.statusCode).toBe(200);
  });

  it('200 if  multiple orders are complete', async () => {
    const user = await UserStore.create({
      firstName: 'Otto',
      lastName: 'Wallen',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Shirt',
      price: '23',
      category: 'Fashion'
    });

    const productTwo = await ProductStore.create({
      name: 'Shorts',
      price: '32.99',
      category: 'Fashion'
    });

    const order = (await OrderStore.create({
      userId: user.id,
      products: [{ productId: product.id, quantity: 3 }]
    })) as Order;

    const orderTwo = (await OrderStore.create({
      userId: user.id,
      products: [{ productId: productTwo.id, quantity: 15 }]
    })) as Order;

    const res = await req.post(`${API_BASE_URL}/orders/complete-order`).send([
      {
        userId: user.id,
        orderId: order.id
      },
      {
        userId: user.id,
        orderId: orderTwo.id
      }
    ]);
    expect(res.statusCode).toBe(200);
  });
});
