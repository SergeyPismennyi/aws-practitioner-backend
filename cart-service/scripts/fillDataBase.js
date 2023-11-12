/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require('pg');
require('dotenv').config();
const { DB_HOST, DB_PORT, DB_NAME, DB_USER_NAME, DB_PASSWORD } = process.env;

const users = [
  '0b846046-2081-40b7-8365-bf273c17b32e',
  '1c3567be-1406-4fd9-ab02-f100df60c73d',
  '6ed744b0-ab7f-439f-b435-b731fa6b5248',
  'a643b8c4-a3f2-4d5b-8a4a-a4186f424ab8',
  'cc7acd74-d182-4ea8-8512-56272e134f0a',
];

const products = [
  '509182b7-f92f-482a-ac68-d2ff629c84de',
  'd7808ff9-1734-46de-99c7-748e590a00af',
  'b856d0c2-4b7f-425a-8968-3e925cf98164',
  '48c9102b-d5c2-4da7-b789-1fc56516095d',
  '134a4ecb-4df3-445d-9169-8b3880bc360c',
  '5cf83aa7-a20f-4584-8d6b-ba11c620ecc2',
  '515c0d05-55d9-4da5-98c7-8333b3b0d774',
  '317a0346-a988-4bf4-a8f9-3c20d11dc0a4',
  '506c0e52-27f4-409a-be79-073f4d3d627b',
  '506c0e52-27f4-409a-be79-143f4d3d627b',
];

const carts = [
  {
    id: '5c775110-be38-48a5-a302-eed57c2e1ac6',
    user_id: users[0],
    created_at: '2023-11-01',
    updated_at: '2023-11-01',
    status: 'ORDERED',
  },
  {
    id: '93d9f74a-7bc9-4892-b9a3-a6a51a507e60',
    user_id: users[0],
    created_at: '2023-11-02',
    updated_at: '2023-11-02',
    status: 'OPEN',
  },
  {
    id: 'bc379c81-9b51-4a87-88cb-266a9766e0ba',
    user_id: users[1],
    created_at: '2023-11-02',
    updated_at: '2023-11-02',
    status: 'OPEN',
  },
  {
    id: '2fec4468-7f7b-4a30-86e3-62dd36041c8e',
    user_id: users[1],
    created_at: '2023-11-03',
    updated_at: '2023-11-03',
    status: 'ORDERED',
  },
  {
    id: 'ea75a8cb-bfc7-481a-9fe8-dde5f2ee177f',
    user_id: users[2],
    created_at: '2023-11-03',
    updated_at: '2023-11-03',
    status: 'ORDERED',
  },
  {
    id: 'a9856e94-3f8d-4f72-9622-0e81f15b67a6',
    user_id: users[2],
    created_at: '2023-11-04',
    updated_at: '2023-11-04',
    status: 'OPEN',
  },
  {
    id: '8ca4a9b3-13ec-40d2-9d49-bd41ce81a1df',
    user_id: users[3],
    created_at: '2023-11-04',
    updated_at: '2023-11-04',
    status: 'ORDERED',
  },
  {
    id: 'bce5adfc-dcd9-489d-b713-a1e00c8af9b5',
    user_id: users[3],
    created_at: '2023-11-05',
    updated_at: '2023-11-05',
    status: 'OPEN',
  },
  {
    id: '7e323cde-212d-4623-b1ec-580f67d5835d',
    user_id: users[4],
    created_at: '2023-11-05',
    updated_at: '2023-11-05',
    status: 'ORDERED',
  },
  {
    id: '8fc28edb-ff2a-4869-968e-6ef08af7ae30',
    user_id: users[4],
    created_at: '2023-11-06',
    updated_at: '2023-11-06',
    status: 'OPEN',
  },
];

const cartItems = [
  { cart_id: carts[0].id, product_id: products[0], count: 1 },
  { cart_id: carts[1].id, product_id: products[1], count: 1 },
  { cart_id: carts[2].id, product_id: products[2], count: 1 },
  { cart_id: carts[3].id, product_id: products[3], count: 1 },
  { cart_id: carts[4].id, product_id: products[4], count: 1 },
  { cart_id: carts[5].id, product_id: products[5], count: 1 },
  { cart_id: carts[6].id, product_id: products[6], count: 1 },
  { cart_id: carts[7].id, product_id: products[7], count: 1 },
  { cart_id: carts[8].id, product_id: products[8], count: 1 },
  { cart_id: carts[9].id, product_id: products[9], count: 1 },
];

const getInsertQuery = (table, values, data) =>
  `insert into ${table} (${values.join(', ')}) values
${data.map(item => `(${values.map(value => `'${item[value]}'`).join(', ')})`).join(',\n')};
`;

(async () => {
  const dbClient = new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER_NAME,
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  await dbClient.connect();
  await dbClient.query(getInsertQuery('carts', ['id', 'user_id', 'created_at', 'updated_at', 'status'], carts));
  await dbClient.query(getInsertQuery('cart_items', ['cart_id', 'product_id', 'count'], cartItems));

  process.exit();
})();
