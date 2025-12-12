import type { StoredUser, StoredSkill, StoredRequest, StoredExchange } from './types';

const DB_NAME = 'skillswap_db';
const DB_VERSION = 2;

const STORES = {
  USERS: 'users',
  SKILLS: 'skills',
  REQUESTS: 'requests',
  EXCHANGES: 'exchanges',
  META: 'meta',
} as const;

/**
 * IndexedDB хранилище для кумулятивных изменений
 *
 * Хранит только НОВЫЕ/ИЗМЕНЁННЫЕ данные относительно mock JSON.
 * Изображения хранятся как Data URL строки — сериализуются автоматически.
 */
class DeltaStorageClass {
  private db: IDBDatabase | null = null;

  private initPromise: Promise<void> | null = null;

  // ==================== INITIALIZATION ====================

  async init(): Promise<void> {
    if (this.db) {
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = new Promise((res, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        res();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const store = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
          store.createIndex('email', 'email', { unique: true });
        }

        // Skills store
        if (!db.objectStoreNames.contains(STORES.SKILLS)) {
          const store = db.createObjectStore(STORES.SKILLS, { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
        }

        // Requests store
        if (!db.objectStoreNames.contains(STORES.REQUESTS)) {
          const store = db.createObjectStore(STORES.REQUESTS, { keyPath: 'id' });
          store.createIndex('fromUser', 'fromUser', { unique: false });
          store.createIndex('requestedSkill', 'requestedSkill', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // Exchanges store
        if (!db.objectStoreNames.contains(STORES.EXCHANGES)) {
          const store = db.createObjectStore(STORES.EXCHANGES, { keyPath: 'id' });
          store.createIndex('requestId', 'requestId', { unique: true });
          store.createIndex('status', 'status', { unique: false });
        }

        // Meta store
        if (!db.objectStoreNames.contains(STORES.META)) {
          db.createObjectStore(STORES.META, { keyPath: 'key' });
        }
      };
    });

    await this.initPromise;
  }

  // ==================== HELPERS ====================

  private async getStore(
    storeName: string,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    await this.init();
    const tx = this.db!.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  private static promisify<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((res, reject) => {
      request.onsuccess = () => res(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== USERS ====================

  async addUser(user: StoredUser): Promise<void> {
    const store = await this.getStore(STORES.USERS, 'readwrite');
    await DeltaStorageClass.promisify(store.put(user));
  }

  async updateUser(id: number, changes: Partial<StoredUser>): Promise<void> {
    const store = await this.getStore(STORES.USERS, 'readwrite');
    const existing = await DeltaStorageClass.promisify(store.get(id));

    if (existing) {
      await DeltaStorageClass.promisify(store.put({ ...existing, ...changes }));
    }
  }

  async deleteUser(id: number): Promise<void> {
    const store = await this.getStore(STORES.USERS, 'readwrite');
    await DeltaStorageClass.promisify(store.delete(id));

    // Удаляем навыки пользователя
    const skills = await this.getSkillsByUserId(id);
    await Promise.all(skills.map((skill) => this.deleteSkill(skill.id)));
  }

  async getUserById(id: number): Promise<StoredUser | undefined> {
    const store = await this.getStore(STORES.USERS);
    return DeltaStorageClass.promisify(store.get(id));
  }

  async getUserByEmail(email: string): Promise<StoredUser | undefined> {
    const store = await this.getStore(STORES.USERS);
    const index = store.index('email');
    return DeltaStorageClass.promisify(index.get(email.toLowerCase()));
  }

  async getAllUsers(): Promise<StoredUser[]> {
    const store = await this.getStore(STORES.USERS);
    return DeltaStorageClass.promisify(store.getAll());
  }

  // ==================== SKILLS ====================

  async addSkill(skill: StoredSkill): Promise<void> {
    const store = await this.getStore(STORES.SKILLS, 'readwrite');
    await DeltaStorageClass.promisify(store.put(skill));
  }

  async updateSkill(id: number, changes: Partial<StoredSkill>): Promise<void> {
    const store = await this.getStore(STORES.SKILLS, 'readwrite');
    const existing = await DeltaStorageClass.promisify(store.get(id));

    if (existing) {
      await DeltaStorageClass.promisify(store.put({ ...existing, ...changes }));
    }
  }

  async deleteSkill(id: number): Promise<void> {
    const store = await this.getStore(STORES.SKILLS, 'readwrite');
    await DeltaStorageClass.promisify(store.delete(id));
  }

  async getSkillById(id: number): Promise<StoredSkill | undefined> {
    const store = await this.getStore(STORES.SKILLS);
    return DeltaStorageClass.promisify(store.get(id));
  }

  async getSkillsByUserId(userId: number): Promise<StoredSkill[]> {
    const store = await this.getStore(STORES.SKILLS);
    const index = store.index('userId');
    return DeltaStorageClass.promisify(index.getAll(userId));
  }

  async getAllSkills(): Promise<StoredSkill[]> {
    const store = await this.getStore(STORES.SKILLS);
    return DeltaStorageClass.promisify(store.getAll());
  }

  // ==================== REQUESTS ====================

  async addRequest(request: StoredRequest): Promise<void> {
    const store = await this.getStore(STORES.REQUESTS, 'readwrite');
    await DeltaStorageClass.promisify(store.put(request));
  }

  async updateRequest(id: number, changes: Partial<StoredRequest>): Promise<void> {
    const store = await this.getStore(STORES.REQUESTS, 'readwrite');
    const existing = await DeltaStorageClass.promisify(store.get(id));

    if (existing) {
      await DeltaStorageClass.promisify(store.put({ ...existing, ...changes }));
    }
  }

  async deleteRequest(id: number): Promise<void> {
    const store = await this.getStore(STORES.REQUESTS, 'readwrite');
    await DeltaStorageClass.promisify(store.delete(id));
  }

  async getRequestById(id: number): Promise<StoredRequest | undefined> {
    const store = await this.getStore(STORES.REQUESTS);
    return DeltaStorageClass.promisify(store.get(id));
  }

  async getRequestsByUserId(userId: number): Promise<StoredRequest[]> {
    const store = await this.getStore(STORES.REQUESTS);
    const index = store.index('fromUser');
    return DeltaStorageClass.promisify(index.getAll(userId));
  }

  async getAllRequests(): Promise<StoredRequest[]> {
    const store = await this.getStore(STORES.REQUESTS);
    return DeltaStorageClass.promisify(store.getAll());
  }

  // ==================== EXCHANGES ====================

  async addExchange(exchange: StoredExchange): Promise<void> {
    const store = await this.getStore(STORES.EXCHANGES, 'readwrite');
    await DeltaStorageClass.promisify(store.put(exchange));
  }

  async updateExchange(id: number, changes: Partial<StoredExchange>): Promise<void> {
    const store = await this.getStore(STORES.EXCHANGES, 'readwrite');
    const existing = await DeltaStorageClass.promisify(store.get(id));

    if (existing) {
      await DeltaStorageClass.promisify(store.put({ ...existing, ...changes }));
    }
  }

  async deleteExchange(id: number): Promise<void> {
    const store = await this.getStore(STORES.EXCHANGES, 'readwrite');
    await DeltaStorageClass.promisify(store.delete(id));
  }

  async getExchangeById(id: number): Promise<StoredExchange | undefined> {
    const store = await this.getStore(STORES.EXCHANGES);
    return DeltaStorageClass.promisify(store.get(id));
  }

  async getExchangeByRequestId(requestId: number): Promise<StoredExchange | undefined> {
    const store = await this.getStore(STORES.EXCHANGES);
    const index = store.index('requestId');
    return DeltaStorageClass.promisify(index.get(requestId));
  }

  async getAllExchanges(): Promise<StoredExchange[]> {
    const store = await this.getStore(STORES.EXCHANGES);
    return DeltaStorageClass.promisify(store.getAll());
  }

  // ==================== META ====================

  async getMeta<T>(key: string): Promise<T | undefined> {
    const store = await this.getStore(STORES.META);
    const result = await DeltaStorageClass.promisify(store.get(key));
    return result?.value;
  }

  async setMeta<T>(key: string, value: T): Promise<void> {
    const store = await this.getStore(STORES.META, 'readwrite');
    await DeltaStorageClass.promisify(store.put({ key, value }));
  }

  // ==================== UTILITIES ====================

  async hasAnyData(): Promise<boolean> {
    const users = await this.getAllUsers();
    return users.length > 0;
  }

  async getStats(): Promise<{
    users: number;
    skills: number;
    requests: number;
    exchanges: number;
    estimatedSize: string;
  }> {
    const [users, skills, requests, exchanges] = await Promise.all([
      this.getAllUsers(),
      this.getAllSkills(),
      this.getAllRequests(),
      this.getAllExchanges(),
    ]);

    // Примерная оценка размера
    const jsonSize = JSON.stringify({ users, skills, requests, exchanges }).length;

    return {
      users: users.length,
      skills: skills.length,
      requests: requests.length,
      exchanges: exchanges.length,
      estimatedSize: `~${(jsonSize / 1024).toFixed(1)} KB`,
    };
  }

  async clearAll(): Promise<void> {
    await this.init();

    const storeNames = Object.values(STORES);
    const clearOperations = storeNames.map(async (storeName) => {
      const store = await this.getStore(storeName, 'readwrite');
      return DeltaStorageClass.promisify(store.clear());
    });
    await Promise.all(clearOperations);
  }
}

const DeltaStorage = new DeltaStorageClass();

export default DeltaStorage;
