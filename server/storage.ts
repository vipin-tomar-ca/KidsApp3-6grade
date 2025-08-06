import { 
  type User, 
  type InsertUser, 
  type LearningModule, 
  type UserProgress, 
  type Achievement, 
  type UserAchievement, 
  type Activity,
  type InsertProgress,
  type InsertAchievement
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<void>;

  // Learning modules
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: string): Promise<LearningModule | undefined>;
  getLearningModulesBySubject(subject: string): Promise<LearningModule[]>;

  // User progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressBySubject(userId: string, subject: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, subject: string, data: Partial<InsertProgress>): Promise<UserProgress>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  addUserAchievement(data: InsertAchievement): Promise<UserAchievement>;

  // Activities
  getActivitiesByModule(moduleId: string): Promise<Activity[]>;
  getActivity(id: string): Promise<Activity | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private learningModules: Map<string, LearningModule>;
  private userProgress: Map<string, UserProgress>;
  private achievements: Map<string, Achievement>;
  private userAchievements: Map<string, UserAchievement>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.learningModules = new Map();
    this.userProgress = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.activities = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Create sample learning modules
    const modules: LearningModule[] = [
      {
        id: "math-1",
        name: "Math Fun",
        subject: "math",
        description: "Numbers & Puzzles",
        icon: "calculator",
        color: "blue",
        difficulty: 1,
        pointsReward: 10,
        isActive: true,
      },
      {
        id: "reading-1",
        name: "Reading",
        subject: "reading",
        description: "Stories & Words",
        icon: "book-open",
        color: "green",
        difficulty: 1,
        pointsReward: 15,
        isActive: true,
      },
      {
        id: "science-1",
        name: "Science",
        subject: "science",
        description: "Experiments",
        icon: "flask",
        color: "purple",
        difficulty: 1,
        pointsReward: 20,
        isActive: true,
      },
      {
        id: "art-1",
        name: "Art",
        subject: "art",
        description: "Create & Draw",
        icon: "palette",
        color: "orange",
        difficulty: 1,
        pointsReward: 12,
        isActive: true,
      },
    ];

    modules.forEach(module => this.learningModules.set(module.id, module));

    // Create sample achievements
    const sampleAchievements: Achievement[] = [
      {
        id: "math-star",
        name: "Math Star",
        description: "Complete 10 math activities",
        icon: "medal",
        color: "yellow",
        pointsRequired: 100,
        type: "medal",
      },
      {
        id: "bookworm",
        name: "Bookworm",
        description: "Read 5 stories",
        icon: "book",
        color: "green",
        pointsRequired: 75,
        type: "badge",
      },
      {
        id: "explorer",
        name: "Explorer",
        description: "Complete first science experiment",
        icon: "rocket",
        color: "blue",
        pointsRequired: 50,
        type: "trophy",
      },
    ];

    sampleAchievements.forEach(achievement => this.achievements.set(achievement.id, achievement));

    // Create a sample user
    const sampleUser: User = {
      id: "user-1",
      username: "emma",
      name: "Emma",
      password: "password123",
      points: 250,
      level: 3,
      createdAt: new Date(),
    };

    this.users.set(sampleUser.id, sampleUser);

    // Create sample progress for Emma
    const sampleProgress: UserProgress[] = [
      {
        id: "progress-1",
        userId: "user-1",
        subject: "math",
        progressPercentage: 75,
        completedActivities: 15,
        totalActivities: 20,
        lastActivity: new Date(),
      },
      {
        id: "progress-2",
        userId: "user-1",
        subject: "reading",
        progressPercentage: 80,
        completedActivities: 16,
        totalActivities: 20,
        lastActivity: new Date(),
      },
      {
        id: "progress-3",
        userId: "user-1",
        subject: "science",
        progressPercentage: 50,
        completedActivities: 10,
        totalActivities: 20,
        lastActivity: new Date(),
      },
      {
        id: "progress-4",
        userId: "user-1",
        subject: "art",
        progressPercentage: 60,
        completedActivities: 12,
        totalActivities: 20,
        lastActivity: new Date(),
      },
    ];

    sampleProgress.forEach(progress => this.userProgress.set(progress.id, progress));

    // Add sample user achievements
    const sampleUserAchievements: UserAchievement[] = [
      {
        id: "user-achievement-1",
        userId: "user-1",
        achievementId: "math-star",
        earnedAt: new Date(),
      },
      {
        id: "user-achievement-2",
        userId: "user-1",
        achievementId: "bookworm",
        earnedAt: new Date(),
      },
      {
        id: "user-achievement-3",
        userId: "user-1",
        achievementId: "explorer",
        earnedAt: new Date(),
      },
    ];

    sampleUserAchievements.forEach(achievement => this.userAchievements.set(achievement.id, achievement));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      points: 0, 
      level: 1, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.points = points;
      this.users.set(userId, user);
    }
  }

  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values()).filter(module => module.isActive);
  }

  async getLearningModule(id: string): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }

  async getLearningModulesBySubject(subject: string): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values()).filter(
      module => module.subject === subject && module.isActive
    );
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressBySubject(userId: string, subject: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      progress => progress.userId === userId && progress.subject === subject
    );
  }

  async updateUserProgress(userId: string, subject: string, data: Partial<InsertProgress>): Promise<UserProgress> {
    const existingProgress = await this.getUserProgressBySubject(userId, subject);
    
    if (existingProgress) {
      const updated = { ...existingProgress, ...data, lastActivity: new Date() };
      this.userProgress.set(existingProgress.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newProgress: UserProgress = {
        id,
        userId,
        subject,
        progressPercentage: data.progressPercentage || 0,
        completedActivities: data.completedActivities || 0,
        totalActivities: data.totalActivities || 0,
        lastActivity: new Date(),
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(achievement => achievement.userId === userId);
  }

  async addUserAchievement(data: InsertAchievement): Promise<UserAchievement> {
    const id = randomUUID();
    const achievement: UserAchievement = {
      ...data,
      id,
      earnedAt: new Date(),
    };
    this.userAchievements.set(id, achievement);
    return achievement;
  }

  async getActivitiesByModule(moduleId: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.moduleId === moduleId);
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
}

export const storage = new MemStorage();
