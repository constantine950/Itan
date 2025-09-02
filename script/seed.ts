import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

// Load data.json
const raw = fs.readFileSync(
  new URL("../data/itan_seed_with_images.json", import.meta.url)
);
const data = JSON.parse(raw.toString());

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("🌱 Starting database seed...");

  const categories = data.categories || [];
  const events = data.events || [];

  if (!Array.isArray(categories) || !Array.isArray(events)) {
    throw new Error(
      "❌ Could not find valid categories/events arrays in itan_seed.json"
    );
  }

  // 1. Seed categories
  console.log("📂 Seeding categories...");
  await supabase.from("categories").delete().neq("id", 0); // Clear existing
  const { error: catError } = await supabase
    .from("categories")
    .insert(categories);
  if (catError) {
    console.error("⚠️ Failed inserting categories:", catError.message);
    return;
  }
  console.log("✅ Inserted categories:", categories.length);

  // 2. Seed events
  console.log("📂 Seeding events...");
  await supabase.from("events").delete().neq("id", 0); // Clear existing
  const { error: eventError } = await supabase.from("events").insert(events);
  if (eventError) {
    console.error("⚠️ Failed bulk insert:", eventError.message);
  } else {
    console.log("✅ Inserted events:", events.length);
  }

  console.log("🌱 Seeding finished!");
}

seed();
