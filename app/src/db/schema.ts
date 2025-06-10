import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["owner", "admin", "member"]);
export const activityEntityEnum = pgEnum("activity_entity", ["workspace", "board", "list", "card"]);
export const activityActionEnum = pgEnum("activity_action", ["create", "update", "delete"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    hash: text("hash").notNull(),
    name: text("name").notNull(),
    bio: text("bio").notNull().default(""),
    email: text("email").unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const workspaces = pgTable("workspaces", {
    id: serial("id").primaryKey(),
    name: text("name").notNull()
});

export const workspaceMembers = pgTable(
    "workspace_members",
    {
        userId: integer("user_id")
            .notNull()
            .references(() => users.id),
        workspaceId: integer("workspace_id")
            .notNull()
            .references(() => workspaces.id),
        role: roleEnum("role").notNull()
    },
    (table) => [primaryKey({ columns: [table.userId, table.workspaceId] })]
);

export const boards = pgTable("boards", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    backgroundId: integer("background_id").notNull(),
    workspaceId: integer("workspace_id")
        .notNull()
        .references(() => workspaces.id)
});

export const lists = pgTable("lists", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    order: integer("order").notNull(),
    boardId: integer("board_id")
        .notNull()
        .references(() => boards.id)
});

export const cards = pgTable("cards", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    done: boolean("done").default(false).notNull(),
    listId: integer("list_id")
        .notNull()
        .references(() => lists.id)
});

export const activities = pgTable("activities", {
    id: serial("id").primaryKey(),
    time: timestamp("time").defaultNow().notNull(),
    workspaceId: integer("workspace_id")
        .notNull()
        .references(() => workspaces.id),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    entityName: text("entity_name").notNull(),
    entityType: activityEntityEnum("entity_type").notNull(),
    action: activityActionEnum("action").notNull()
});
