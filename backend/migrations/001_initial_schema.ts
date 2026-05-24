// Database migration example
export async function migrate() {
  // Run all pending migrations
  console.log('Running migrations...');

  // Example: Add indexes
  await db.collection('conversations').createIndex({ workspaceId: 1, createdAt: -1 });
  await db.collection('chatHistory').createIndex({ conversationId: 1, createdAt: 1 });

  console.log('✓ Migrations complete');
}

export async function rollback() {
  // Rollback last migration
  console.log('Rolling back...');

  // Example: Drop indexes
  await db.collection('conversations').dropIndex('workspaceId_1_createdAt_-1');
  await db.collection('chatHistory').dropIndex('conversationId_1_createdAt_1');

  console.log('✓ Rollback complete');
}
