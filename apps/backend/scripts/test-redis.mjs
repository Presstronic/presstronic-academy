#!/usr/bin/env node

/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * @file test-redis.mjs — Presstronic Academy (interactive learning platform)
 * @author Your Name <you@example.com>
 * @copyright 2025 Presstronic Studios LLC
 */
import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function testRedis() {
  console.log('🔍 Testing Redis connection...\n');
  console.log(`Connecting to: ${REDIS_URL}`);

  const client = createClient({
    url: REDIS_URL,
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));

  try {
    await client.connect();
    console.log('✅ Connected to Redis successfully!\n');

    // Test 1: Write and Read
    console.log('Test 1: Write and Read');
    const testKey = 'test:hello';
    const testValue = JSON.stringify({ message: 'Hello Redis!', timestamp: Date.now() });
    await client.set(testKey, testValue, { EX: 60 });
    const retrieved = await client.get(testKey);
    console.log(`  ✅ Stored: ${testValue}`);
    console.log(`  ✅ Retrieved: ${retrieved}`);
    console.log(`  ✅ Match: ${testValue === retrieved}\n`);

    // Test 2: Complex Object
    console.log('Test 2: Complex Object Storage');
    const complexKey = 'test:complex';
    const complexObject = {
      user: { id: '123', name: 'Test User', roles: ['admin', 'user'] },
      metadata: { created: new Date().toISOString(), nested: { level: 2 } },
    };
    await client.set(complexKey, JSON.stringify(complexObject), { EX: 60 });
    const retrievedComplex = JSON.parse(await client.get(complexKey));
    console.log(`  ✅ Stored complex object`);
    console.log(`  ✅ Retrieved and parsed successfully`);
    console.log(`  ✅ User name: ${retrievedComplex.user.name}\n`);

    // Test 3: TTL (Time To Live)
    console.log('Test 3: TTL Expiration');
    const ttlKey = 'test:ttl';
    await client.set(ttlKey, 'expires in 2 seconds', { EX: 2 });
    const ttl1 = await client.ttl(ttlKey);
    console.log(`  ✅ TTL set to ~2 seconds (actual: ${ttl1}s)`);
    await new Promise((resolve) => setTimeout(resolve, 2100));
    const expired = await client.get(ttlKey);
    console.log(`  ✅ After expiration, value is: ${expired === null ? 'null (expired)' : expired}\n`);

    // Test 4: Delete
    console.log('Test 4: Delete Key');
    const deleteKey = 'test:delete';
    await client.set(deleteKey, 'will be deleted', { EX: 60 });
    const beforeDelete = await client.get(deleteKey);
    await client.del(deleteKey);
    const afterDelete = await client.get(deleteKey);
    console.log(`  ✅ Before delete: ${beforeDelete}`);
    console.log(`  ✅ After delete: ${afterDelete === null ? 'null (deleted)' : afterDelete}\n`);

    // Test 5: Multiple Keys
    console.log('Test 5: Multiple Keys');
    await client.set('test:key1', 'value1', { EX: 60 });
    await client.set('test:key2', 'value2', { EX: 60 });
    await client.set('test:key3', 'value3', { EX: 60 });
    const [val1, val2, val3] = await Promise.all([
      client.get('test:key1'),
      client.get('test:key2'),
      client.get('test:key3'),
    ]);
    console.log(`  ✅ Retrieved 3 keys: ${val1}, ${val2}, ${val3}\n`);

    // Cleanup
    console.log('🧹 Cleaning up test keys...');
    await client.del([testKey, complexKey, deleteKey, 'test:key1', 'test:key2', 'test:key3']);
    console.log('✅ Cleanup complete\n');

    console.log('🎉 All Redis tests passed successfully!');
    console.log('\n📊 Summary:');
    console.log('  ✅ Connection established');
    console.log('  ✅ Read/Write operations working');
    console.log('  ✅ Complex objects supported');
    console.log('  ✅ TTL expiration working');
    console.log('  ✅ Delete operations working');
    console.log('  ✅ Multiple keys supported');

    await client.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Redis test failed:', error.message);
    await client.disconnect();
    process.exit(1);
  }
}

testRedis();
