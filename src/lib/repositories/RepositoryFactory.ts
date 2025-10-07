/**
 * Repository Factory
 * Provides a single entry point to get the appropriate repository implementation
 * Based on configuration or environment
 */

import { IRepository } from "./IRepository";
import { MockRepository } from "./MockRepository";
import { LocalStorageRepository } from "./LocalStorageRepository";

export type RepositoryType = "mock" | "localStorage" | "indexedDB" | "api";

/**
 * Repository configuration
 */
export interface RepositoryConfig {
  type: RepositoryType;
  apiUrl?: string;
}

/**
 * Default configuration - uses localStorage for production, mock for development
 */
const defaultConfig: RepositoryConfig = {
  type: (import.meta.env?.MODE === "development" ? "mock" : "localStorage") as RepositoryType,
};

/**
 * Repository Factory Class
 * Creates and manages repository instances
 */
class RepositoryFactory {
  private static instance: IRepository | null = null;
  private static config: RepositoryConfig = defaultConfig;

  /**
   * Configure the repository type
   */
  static configure(config: Partial<RepositoryConfig>): void {
    this.config = { ...this.config, ...config };
    // Reset instance to force recreation with new config
    this.instance = null;
  }

  /**
   * Get the repository instance
   * Implements singleton pattern
   */
  static getInstance(): IRepository {
    if (!this.instance) {
      this.instance = this.createRepository(this.config);
    }
    return this.instance;
  }

  /**
   * Create a repository based on configuration
   */
  private static createRepository(config: RepositoryConfig): IRepository {
    switch (config.type) {
      case "mock":
        console.info("🎮 Using Mock Repository (in-memory data)");
        return new MockRepository();

      case "localStorage":
        console.info("💾 Using LocalStorage Repository");
        return new LocalStorageRepository();

      case "indexedDB":
        // TODO: Implement IndexedDB repository (for larger datasets)
        console.warn("⚠️ IndexedDB not implemented yet, falling back to LocalStorage");
        return new LocalStorageRepository();

      case "api":
        // TODO: Implement API repository (for backend integration)
        console.warn("⚠️ API Repository not implemented yet, falling back to Mock");
        return new MockRepository();

      default:
        console.warn(`⚠️ Unknown repository type: ${config.type}, using Mock`);
        return new MockRepository();
    }
  }

  /**
   * Reset the repository instance (useful for testing)
   */
  static reset(): void {
    this.instance = null;
    this.config = defaultConfig;
  }

  /**
   * Switch repository type at runtime
   */
  static switchTo(type: RepositoryType): void {
    this.configure({ type });
  }
}

/**
 * Convenience function to get repository
 */
export function getRepository(): IRepository {
  return RepositoryFactory.getInstance();
}

/**
 * Convenience function to configure repository
 */
export function configureRepository(config: Partial<RepositoryConfig>): void {
  RepositoryFactory.configure(config);
}

export { RepositoryFactory };
