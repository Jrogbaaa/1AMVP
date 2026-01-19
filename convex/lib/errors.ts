/**
 * Database error utilities for Convex operations
 */

/**
 * Assert that an entity exists, throwing an error if not found.
 * Use this in mutations to validate entities before operations.
 *
 * @param entity - The entity to check (result from ctx.db.get() or query)
 * @param entityName - Human-readable name of the entity type (e.g., "GeneratedVideo")
 * @param identifier - The ID or identifier used to look up the entity
 * @throws Error if entity is null or undefined
 */
export function assertExists<T>(
  entity: T | null | undefined,
  entityName: string,
  identifier: string
): asserts entity is T {
  if (entity === null || entity === undefined) {
    throw new Error(`${entityName} not found: ${identifier}`);
  }
}
