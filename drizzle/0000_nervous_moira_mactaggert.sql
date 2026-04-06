CREATE TABLE `activity_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`details` text,
	`timestamp` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ai_config` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`system_prompt` text,
	`tone` text DEFAULT 'amigable' NOT NULL,
	`temperature` real DEFAULT 0.7 NOT NULL,
	`max_tokens` integer DEFAULT 600 NOT NULL,
	`only_school` integer DEFAULT 1 NOT NULL,
	`welcome_message` text DEFAULT '👋 ¡Hola! Soy el asistente virtual del **Liceo Pedro Emilio Coll**. ¿En qué puedo ayudarte hoy?' NOT NULL,
	`error_message` text DEFAULT '❌ Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentar de nuevo?' NOT NULL,
	`placeholder` text DEFAULT 'Escribe tu pregunta...' NOT NULL,
	`suggestions` text DEFAULT '["📋 Inscripciones","📚 Horarios","📞 Contacto","🏫 Sobre el Liceo"]' NOT NULL,
	`feedback_enabled` integer DEFAULT 1 NOT NULL,
	`history_enabled` integer DEFAULT 1 NOT NULL,
	`max_messages` integer DEFAULT 50 NOT NULL,
	`typing_indicator` integer DEFAULT 1 NOT NULL,
	`widget_color` text DEFAULT '#0b92d5' NOT NULL,
	`widget_position` text DEFAULT 'bottom-right' NOT NULL,
	`auto_open` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ai_custom_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trigger` text NOT NULL,
	`response` text NOT NULL,
	`enabled` integer DEFAULT 1 NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`session_id` text NOT NULL,
	`category` text,
	`action` text,
	`label` text,
	`value` integer,
	`url` text,
	`referrer` text,
	`timestamp` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_session` ON `analytics_events` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_analytics_timestamp` ON `analytics_events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_analytics_type` ON `analytics_events` (`event_type`);--> statement-breakpoint
CREATE TABLE `chat_conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`timestamp` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chatbot_analytics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`timestamp` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chatbot_feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`message_id` integer,
	`rating` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chatbot_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_active` text DEFAULT (datetime('now')) NOT NULL,
	`message_count` integer DEFAULT 0 NOT NULL,
	`country` text,
	`region` text
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`asunto` text DEFAULT 'general' NOT NULL,
	`mensaje` text NOT NULL,
	`leido` integer DEFAULT 0 NOT NULL,
	`timestamp` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contact_replies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`message_id` integer NOT NULL,
	`respuesta` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`message_id`) REFERENCES `contact_messages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descripcion` text,
	`fecha` text NOT NULL,
	`hora` text,
	`tipo` text DEFAULT 'general' NOT NULL,
	`lugar` text,
	`enabled` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descripcion` text,
	`image_url` text NOT NULL,
	`categoria` text DEFAULT 'general' NOT NULL,
	`enabled` integer DEFAULT 1 NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`fecha` text NOT NULL,
	`categoria` text DEFAULT 'general' NOT NULL,
	`extracto` text NOT NULL,
	`contenido` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`image_url` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`scheduled_at` text,
	`orden` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_login` text,
	`failed_attempts` integer DEFAULT 0,
	`locked_until` text,
	`reset_token` text,
	`reset_token_expires` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);