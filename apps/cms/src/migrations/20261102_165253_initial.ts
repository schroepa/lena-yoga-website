import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('editor', 'admin');
  CREATE TYPE "public"."enum_kurse_ort" AS ENUM('online', 'studio');
  CREATE TYPE "public"."enum_kurse_wochentag" AS ENUM('mo', 'di', 'mi', 'do', 'fr', 'sa', 'so');
  CREATE TYPE "public"."enum_kurse_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__kurse_v_version_ort" AS ENUM('online', 'studio');
  CREATE TYPE "public"."enum__kurse_v_version_wochentag" AS ENUM('mo', 'di', 'mi', 'do', 'fr', 'sa', 'so');
  CREATE TYPE "public"."enum__kurse_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_meditationen_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__meditationen_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_gedanken_kategorie" AS ENUM('atmen', 'koerper', 'yoga-fuer-jeden', 'alltag');
  CREATE TYPE "public"."enum_gedanken_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__gedanken_v_version_kategorie" AS ENUM('atmen', 'koerper', 'yoga-fuer-jeden', 'alltag');
  CREATE TYPE "public"."enum__gedanken_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_anleitungen_haltungsart" AS ENUM('stehen', 'sitzen', 'liegen', 'vierfuessler');
  CREATE TYPE "public"."enum_anleitungen_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__anleitungen_v_version_haltungsart" AS ENUM('stehen', 'sitzen', 'liegen', 'vierfuessler');
  CREATE TYPE "public"."enum__anleitungen_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_fragen_seite" AS ENUM('kurse', 'yoga-entdecken');
  CREATE TYPE "public"."enum_fragen_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__fragen_v_version_seite" AS ENUM('kurse', 'yoga-entdecken');
  CREATE TYPE "public"."enum__fragen_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"bildnachweis" varchar,
  	"einwilligung" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_vorschau_url" varchar,
  	"sizes_vorschau_width" numeric,
  	"sizes_vorschau_height" numeric,
  	"sizes_vorschau_mime_type" varchar,
  	"sizes_vorschau_filesize" numeric,
  	"sizes_vorschau_filename" varchar,
  	"sizes_karte_url" varchar,
  	"sizes_karte_width" numeric,
  	"sizes_karte_height" numeric,
  	"sizes_karte_mime_type" varchar,
  	"sizes_karte_filesize" numeric,
  	"sizes_karte_filename" varchar,
  	"sizes_gross_url" varchar,
  	"sizes_gross_width" numeric,
  	"sizes_gross_height" numeric,
  	"sizes_gross_mime_type" varchar,
  	"sizes_gross_filesize" numeric,
  	"sizes_gross_filename" varchar
  );
  
  CREATE TABLE "audio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"transkript" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "kurse" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"ort" "enum_kurse_ort",
  	"wochentag" "enum_kurse_wochentag",
  	"uhrzeit" varchar,
  	"dauer_minuten" numeric,
  	"beschreibung" varchar,
  	"buchungslink" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_kurse_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_kurse_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_ort" "enum__kurse_v_version_ort",
  	"version_wochentag" "enum__kurse_v_version_wochentag",
  	"version_uhrzeit" varchar,
  	"version_dauer_minuten" numeric,
  	"version_beschreibung" varchar,
  	"version_buchungslink" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__kurse_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "meditationen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"dauer_minuten" numeric,
  	"audio_id" integer,
  	"beschreibung" varchar,
  	"reihenfolge" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_meditationen_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_meditationen_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_dauer_minuten" numeric,
  	"version_audio_id" integer,
  	"version_beschreibung" varchar,
  	"version_reihenfolge" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__meditationen_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "gedanken" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"slug" varchar,
  	"kategorie" "enum_gedanken_kategorie",
  	"titelbild_id" integer,
  	"text" jsonb,
  	"veroeffentlicht_am" timestamp(3) with time zone,
  	"lesezeit_minuten" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_gedanken_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_gedanken_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_slug" varchar,
  	"version_kategorie" "enum__gedanken_v_version_kategorie",
  	"version_titelbild_id" integer,
  	"version_text" jsonb,
  	"version_veroeffentlicht_am" timestamp(3) with time zone,
  	"version_lesezeit_minuten" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__gedanken_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "anleitungen_schritte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "anleitungen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"slug" varchar,
  	"haltungsart" "enum_anleitungen_haltungsart",
  	"dauer_minuten" numeric,
  	"foto_id" integer,
  	"einleitung" varchar,
  	"hinweis_titel" varchar,
  	"hinweis_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_anleitungen_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_anleitungen_v_version_schritte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_anleitungen_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_slug" varchar,
  	"version_haltungsart" "enum__anleitungen_v_version_haltungsart",
  	"version_dauer_minuten" numeric,
  	"version_foto_id" integer,
  	"version_einleitung" varchar,
  	"version_hinweis_titel" varchar,
  	"version_hinweis_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__anleitungen_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "fragen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"frage" varchar,
  	"antwort" varchar,
  	"seite" "enum_fragen_seite" DEFAULT 'kurse',
  	"reihenfolge" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_fragen_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_fragen_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_frage" varchar,
  	"version_antwort" varchar,
  	"version_seite" "enum__fragen_v_version_seite" DEFAULT 'kurse',
  	"version_reihenfolge" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__fragen_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"audio_id" integer,
  	"kurse_id" integer,
  	"meditationen_id" integer,
  	"gedanken_id" integer,
  	"anleitungen_id" integer,
  	"fragen_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seiteneinstellungen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Lena Yoga' NOT NULL,
  	"claim" varchar DEFAULT 'Yoga for EveryBody' NOT NULL,
  	"kontakt_email" varchar,
  	"studio_adresse" varchar,
  	"abschluss_titel" varchar DEFAULT 'Probestunde buchen und Lena kennenlernen.' NOT NULL,
  	"abschluss_text" varchar DEFAULT 'Die erste Stunde ist ein Kennenlernen. Du wählst, ob online über Sophies Safe Space oder im Studio.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_haupt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_service" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hauptaktion_label" varchar NOT NULL,
  	"hauptaktion_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_kurse_v" ADD CONSTRAINT "_kurse_v_parent_id_kurse_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."kurse"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "meditationen" ADD CONSTRAINT "meditationen_audio_id_audio_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_meditationen_v" ADD CONSTRAINT "_meditationen_v_parent_id_meditationen_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."meditationen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_meditationen_v" ADD CONSTRAINT "_meditationen_v_version_audio_id_audio_id_fk" FOREIGN KEY ("version_audio_id") REFERENCES "public"."audio"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gedanken" ADD CONSTRAINT "gedanken_titelbild_id_media_id_fk" FOREIGN KEY ("titelbild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gedanken_v" ADD CONSTRAINT "_gedanken_v_parent_id_gedanken_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gedanken"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gedanken_v" ADD CONSTRAINT "_gedanken_v_version_titelbild_id_media_id_fk" FOREIGN KEY ("version_titelbild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "anleitungen_schritte" ADD CONSTRAINT "anleitungen_schritte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."anleitungen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "anleitungen" ADD CONSTRAINT "anleitungen_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_anleitungen_v_version_schritte" ADD CONSTRAINT "_anleitungen_v_version_schritte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_anleitungen_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_anleitungen_v" ADD CONSTRAINT "_anleitungen_v_parent_id_anleitungen_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."anleitungen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_anleitungen_v" ADD CONSTRAINT "_anleitungen_v_version_foto_id_media_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fragen_v" ADD CONSTRAINT "_fragen_v_parent_id_fragen_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fragen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audio_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kurse_fk" FOREIGN KEY ("kurse_id") REFERENCES "public"."kurse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_meditationen_fk" FOREIGN KEY ("meditationen_id") REFERENCES "public"."meditationen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gedanken_fk" FOREIGN KEY ("gedanken_id") REFERENCES "public"."gedanken"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_anleitungen_fk" FOREIGN KEY ("anleitungen_id") REFERENCES "public"."anleitungen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fragen_fk" FOREIGN KEY ("fragen_id") REFERENCES "public"."fragen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_haupt" ADD CONSTRAINT "navigation_haupt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_service" ADD CONSTRAINT "navigation_service_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_vorschau_sizes_vorschau_filename_idx" ON "media" USING btree ("sizes_vorschau_filename");
  CREATE INDEX "media_sizes_karte_sizes_karte_filename_idx" ON "media" USING btree ("sizes_karte_filename");
  CREATE INDEX "media_sizes_gross_sizes_gross_filename_idx" ON "media" USING btree ("sizes_gross_filename");
  CREATE INDEX "audio_updated_at_idx" ON "audio" USING btree ("updated_at");
  CREATE INDEX "audio_created_at_idx" ON "audio" USING btree ("created_at");
  CREATE UNIQUE INDEX "audio_filename_idx" ON "audio" USING btree ("filename");
  CREATE INDEX "kurse_updated_at_idx" ON "kurse" USING btree ("updated_at");
  CREATE INDEX "kurse_created_at_idx" ON "kurse" USING btree ("created_at");
  CREATE INDEX "kurse__status_idx" ON "kurse" USING btree ("_status");
  CREATE INDEX "_kurse_v_parent_idx" ON "_kurse_v" USING btree ("parent_id");
  CREATE INDEX "_kurse_v_version_version_updated_at_idx" ON "_kurse_v" USING btree ("version_updated_at");
  CREATE INDEX "_kurse_v_version_version_created_at_idx" ON "_kurse_v" USING btree ("version_created_at");
  CREATE INDEX "_kurse_v_version_version__status_idx" ON "_kurse_v" USING btree ("version__status");
  CREATE INDEX "_kurse_v_created_at_idx" ON "_kurse_v" USING btree ("created_at");
  CREATE INDEX "_kurse_v_updated_at_idx" ON "_kurse_v" USING btree ("updated_at");
  CREATE INDEX "_kurse_v_latest_idx" ON "_kurse_v" USING btree ("latest");
  CREATE INDEX "meditationen_audio_idx" ON "meditationen" USING btree ("audio_id");
  CREATE INDEX "meditationen_updated_at_idx" ON "meditationen" USING btree ("updated_at");
  CREATE INDEX "meditationen_created_at_idx" ON "meditationen" USING btree ("created_at");
  CREATE INDEX "meditationen__status_idx" ON "meditationen" USING btree ("_status");
  CREATE INDEX "_meditationen_v_parent_idx" ON "_meditationen_v" USING btree ("parent_id");
  CREATE INDEX "_meditationen_v_version_version_audio_idx" ON "_meditationen_v" USING btree ("version_audio_id");
  CREATE INDEX "_meditationen_v_version_version_updated_at_idx" ON "_meditationen_v" USING btree ("version_updated_at");
  CREATE INDEX "_meditationen_v_version_version_created_at_idx" ON "_meditationen_v" USING btree ("version_created_at");
  CREATE INDEX "_meditationen_v_version_version__status_idx" ON "_meditationen_v" USING btree ("version__status");
  CREATE INDEX "_meditationen_v_created_at_idx" ON "_meditationen_v" USING btree ("created_at");
  CREATE INDEX "_meditationen_v_updated_at_idx" ON "_meditationen_v" USING btree ("updated_at");
  CREATE INDEX "_meditationen_v_latest_idx" ON "_meditationen_v" USING btree ("latest");
  CREATE UNIQUE INDEX "gedanken_slug_idx" ON "gedanken" USING btree ("slug");
  CREATE INDEX "gedanken_titelbild_idx" ON "gedanken" USING btree ("titelbild_id");
  CREATE INDEX "gedanken_updated_at_idx" ON "gedanken" USING btree ("updated_at");
  CREATE INDEX "gedanken_created_at_idx" ON "gedanken" USING btree ("created_at");
  CREATE INDEX "gedanken__status_idx" ON "gedanken" USING btree ("_status");
  CREATE INDEX "_gedanken_v_parent_idx" ON "_gedanken_v" USING btree ("parent_id");
  CREATE INDEX "_gedanken_v_version_version_slug_idx" ON "_gedanken_v" USING btree ("version_slug");
  CREATE INDEX "_gedanken_v_version_version_titelbild_idx" ON "_gedanken_v" USING btree ("version_titelbild_id");
  CREATE INDEX "_gedanken_v_version_version_updated_at_idx" ON "_gedanken_v" USING btree ("version_updated_at");
  CREATE INDEX "_gedanken_v_version_version_created_at_idx" ON "_gedanken_v" USING btree ("version_created_at");
  CREATE INDEX "_gedanken_v_version_version__status_idx" ON "_gedanken_v" USING btree ("version__status");
  CREATE INDEX "_gedanken_v_created_at_idx" ON "_gedanken_v" USING btree ("created_at");
  CREATE INDEX "_gedanken_v_updated_at_idx" ON "_gedanken_v" USING btree ("updated_at");
  CREATE INDEX "_gedanken_v_latest_idx" ON "_gedanken_v" USING btree ("latest");
  CREATE INDEX "anleitungen_schritte_order_idx" ON "anleitungen_schritte" USING btree ("_order");
  CREATE INDEX "anleitungen_schritte_parent_id_idx" ON "anleitungen_schritte" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "anleitungen_slug_idx" ON "anleitungen" USING btree ("slug");
  CREATE INDEX "anleitungen_foto_idx" ON "anleitungen" USING btree ("foto_id");
  CREATE INDEX "anleitungen_updated_at_idx" ON "anleitungen" USING btree ("updated_at");
  CREATE INDEX "anleitungen_created_at_idx" ON "anleitungen" USING btree ("created_at");
  CREATE INDEX "anleitungen__status_idx" ON "anleitungen" USING btree ("_status");
  CREATE INDEX "_anleitungen_v_version_schritte_order_idx" ON "_anleitungen_v_version_schritte" USING btree ("_order");
  CREATE INDEX "_anleitungen_v_version_schritte_parent_id_idx" ON "_anleitungen_v_version_schritte" USING btree ("_parent_id");
  CREATE INDEX "_anleitungen_v_parent_idx" ON "_anleitungen_v" USING btree ("parent_id");
  CREATE INDEX "_anleitungen_v_version_version_slug_idx" ON "_anleitungen_v" USING btree ("version_slug");
  CREATE INDEX "_anleitungen_v_version_version_foto_idx" ON "_anleitungen_v" USING btree ("version_foto_id");
  CREATE INDEX "_anleitungen_v_version_version_updated_at_idx" ON "_anleitungen_v" USING btree ("version_updated_at");
  CREATE INDEX "_anleitungen_v_version_version_created_at_idx" ON "_anleitungen_v" USING btree ("version_created_at");
  CREATE INDEX "_anleitungen_v_version_version__status_idx" ON "_anleitungen_v" USING btree ("version__status");
  CREATE INDEX "_anleitungen_v_created_at_idx" ON "_anleitungen_v" USING btree ("created_at");
  CREATE INDEX "_anleitungen_v_updated_at_idx" ON "_anleitungen_v" USING btree ("updated_at");
  CREATE INDEX "_anleitungen_v_latest_idx" ON "_anleitungen_v" USING btree ("latest");
  CREATE INDEX "fragen_updated_at_idx" ON "fragen" USING btree ("updated_at");
  CREATE INDEX "fragen_created_at_idx" ON "fragen" USING btree ("created_at");
  CREATE INDEX "fragen__status_idx" ON "fragen" USING btree ("_status");
  CREATE INDEX "_fragen_v_parent_idx" ON "_fragen_v" USING btree ("parent_id");
  CREATE INDEX "_fragen_v_version_version_updated_at_idx" ON "_fragen_v" USING btree ("version_updated_at");
  CREATE INDEX "_fragen_v_version_version_created_at_idx" ON "_fragen_v" USING btree ("version_created_at");
  CREATE INDEX "_fragen_v_version_version__status_idx" ON "_fragen_v" USING btree ("version__status");
  CREATE INDEX "_fragen_v_created_at_idx" ON "_fragen_v" USING btree ("created_at");
  CREATE INDEX "_fragen_v_updated_at_idx" ON "_fragen_v" USING btree ("updated_at");
  CREATE INDEX "_fragen_v_latest_idx" ON "_fragen_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_audio_id_idx" ON "payload_locked_documents_rels" USING btree ("audio_id");
  CREATE INDEX "payload_locked_documents_rels_kurse_id_idx" ON "payload_locked_documents_rels" USING btree ("kurse_id");
  CREATE INDEX "payload_locked_documents_rels_meditationen_id_idx" ON "payload_locked_documents_rels" USING btree ("meditationen_id");
  CREATE INDEX "payload_locked_documents_rels_gedanken_id_idx" ON "payload_locked_documents_rels" USING btree ("gedanken_id");
  CREATE INDEX "payload_locked_documents_rels_anleitungen_id_idx" ON "payload_locked_documents_rels" USING btree ("anleitungen_id");
  CREATE INDEX "payload_locked_documents_rels_fragen_id_idx" ON "payload_locked_documents_rels" USING btree ("fragen_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "navigation_haupt_order_idx" ON "navigation_haupt" USING btree ("_order");
  CREATE INDEX "navigation_haupt_parent_id_idx" ON "navigation_haupt" USING btree ("_parent_id");
  CREATE INDEX "navigation_service_order_idx" ON "navigation_service" USING btree ("_order");
  CREATE INDEX "navigation_service_parent_id_idx" ON "navigation_service" USING btree ("_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "audio" CASCADE;
  DROP TABLE "kurse" CASCADE;
  DROP TABLE "_kurse_v" CASCADE;
  DROP TABLE "meditationen" CASCADE;
  DROP TABLE "_meditationen_v" CASCADE;
  DROP TABLE "gedanken" CASCADE;
  DROP TABLE "_gedanken_v" CASCADE;
  DROP TABLE "anleitungen_schritte" CASCADE;
  DROP TABLE "anleitungen" CASCADE;
  DROP TABLE "_anleitungen_v_version_schritte" CASCADE;
  DROP TABLE "_anleitungen_v" CASCADE;
  DROP TABLE "fragen" CASCADE;
  DROP TABLE "_fragen_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "seiteneinstellungen" CASCADE;
  DROP TABLE "navigation_haupt" CASCADE;
  DROP TABLE "navigation_service" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_kurse_ort";
  DROP TYPE "public"."enum_kurse_wochentag";
  DROP TYPE "public"."enum_kurse_status";
  DROP TYPE "public"."enum__kurse_v_version_ort";
  DROP TYPE "public"."enum__kurse_v_version_wochentag";
  DROP TYPE "public"."enum__kurse_v_version_status";
  DROP TYPE "public"."enum_meditationen_status";
  DROP TYPE "public"."enum__meditationen_v_version_status";
  DROP TYPE "public"."enum_gedanken_kategorie";
  DROP TYPE "public"."enum_gedanken_status";
  DROP TYPE "public"."enum__gedanken_v_version_kategorie";
  DROP TYPE "public"."enum__gedanken_v_version_status";
  DROP TYPE "public"."enum_anleitungen_haltungsart";
  DROP TYPE "public"."enum_anleitungen_status";
  DROP TYPE "public"."enum__anleitungen_v_version_haltungsart";
  DROP TYPE "public"."enum__anleitungen_v_version_status";
  DROP TYPE "public"."enum_fragen_seite";
  DROP TYPE "public"."enum_fragen_status";
  DROP TYPE "public"."enum__fragen_v_version_seite";
  DROP TYPE "public"."enum__fragen_v_version_status";`);
}
