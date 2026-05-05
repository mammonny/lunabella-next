import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Make dog_id optional (nullable) in exposiciones_awards
    ALTER TABLE "exposiciones_awards"
      ALTER COLUMN "dog_id" DROP NOT NULL;

    -- Add dog_name column to exposiciones_awards (if not exists)
    ALTER TABLE "exposiciones_awards"
      ADD COLUMN IF NOT EXISTS "dog_name" varchar;

    -- Make dog_id optional (nullable) in draft/versions sibling table
    ALTER TABLE "_exposiciones_v_version_awards"
      ALTER COLUMN "dog_id" DROP NOT NULL;

    -- Add dog_name column to draft/versions sibling table (if not exists)
    ALTER TABLE "_exposiciones_v_version_awards"
      ADD COLUMN IF NOT EXISTS "dog_name" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore dog_id as NOT NULL in exposiciones_awards
    ALTER TABLE "exposiciones_awards"
      ALTER COLUMN "dog_id" SET NOT NULL;

    -- Remove dog_name column from exposiciones_awards
    ALTER TABLE "exposiciones_awards"
      DROP COLUMN IF EXISTS "dog_name";

    -- Restore dog_id as NOT NULL in draft/versions sibling table
    ALTER TABLE "_exposiciones_v_version_awards"
      ALTER COLUMN "dog_id" SET NOT NULL;

    -- Remove dog_name column from draft/versions sibling table
    ALTER TABLE "_exposiciones_v_version_awards"
      DROP COLUMN IF EXISTS "dog_name";
  `)
}
