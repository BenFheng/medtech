import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function runSQL(filePath, label) {
  const sql = readFileSync(filePath, 'utf-8');
  console.log(`\n--- Running: ${label} ---`);

  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) {
    // RPC won't work for DDL, try via fetch to pg endpoint
    console.log(`RPC failed (expected for DDL): ${error.message}`);
    return false;
  }
  console.log(`Success: ${label}`);
  return true;
}

// Since we can't run raw SQL via the client library,
// we'll use the Supabase Management API
async function runViaManagementAPI(sql, label) {
  console.log(`\n--- Running: ${label} ---`);

  // Try using the pg_net or direct database URL approach
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  console.log(`Status: ${response.status}`);
}

// Since raw SQL execution needs the DB password, let's verify connectivity
// and insert products via the REST API instead
async function seedProductsViaAPI() {
  console.log('\n--- Seeding products via REST API ---');

  const supplementsPath = join(__dirname, '..', 'src', 'data', 'supplements.json');
  const supplements = JSON.parse(readFileSync(supplementsPath, 'utf-8'));

  const products = supplements.map(s => ({
    name: s.name,
    description: s.dosage.form,
    unit_cost: s.pricePerMonth,
    category_tags: [s.category, ...s.targets, ...s.symptoms.slice(0, 3)],
    timing_schedule: s.schedule,
    evidence_level: s.evidence.level,
    citation_count: s.evidence.citations,
    dosage_amount: s.dosage.amount,
    dosage_unit: s.dosage.unit,
    dosage_form: s.dosage.form,
    price_per_month: s.pricePerMonth,
  }));

  // Check if products already exist
  const { data: existing } = await supabase.from('products').select('product_id, name');
  if (existing && existing.length > 0) {
    console.log(`Products already seeded (${existing.length} found). Skipping insert.`);
    return existing;
  }

  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select('product_id, name');

  if (error) {
    console.error('Error seeding products:', error.message);
    return null;
  }

  console.log(`Seeded ${data?.length ?? 0} products`);
  return data;
}

async function seedInteractionsViaAPI(products) {
  if (!products || products.length === 0) {
    console.log('No products to create interactions for');
    return;
  }

  console.log('\n--- Seeding interactions via REST API ---');

  const nameToId = {};
  for (const p of products) {
    nameToId[p.name] = p.product_id;
  }

  const synergies = [
    ['Vitamin D3', 'Vitamin K2 MK-7', 'D3 promotes calcium absorption; K2 directs calcium to bones, away from arteries', 'Take together with fat-containing meal', 'Strong'],
    ['Vitamin C Liposomal', 'Collagen Peptides (Type I & III)', 'Vitamin C is essential cofactor for collagen synthesis', 'Take together for maximum collagen production', 'Strong'],
    ['NMN (Nicotinamide Mononucleotide)', 'Trans-Resveratrol', 'NMN provides NAD+; Resveratrol activates sirtuins that consume NAD+', 'Take together in the morning', 'Moderate'],
    ['NMN (Nicotinamide Mononucleotide)', 'CoQ10 Ubiquinol', 'Combined cardiovascular benefits stronger than either alone', 'Take together with fat-containing meal', 'Moderate'],
    ['CoQ10 Ubiquinol', 'PQQ (Pyrroloquinoline Quinone)', 'PQQ promotes mitochondrial biogenesis; CoQ10 supports function', 'Take together in the morning with food', 'Moderate'],
    ['CoQ10 Ubiquinol', 'Omega-3 EPA/DHA', 'Fish oil enhances CoQ10 absorption; complementary cardiovascular support', 'Take together — omega-3 provides fat vehicle', 'Moderate'],
    ['Astaxanthin', 'Omega-3 EPA/DHA', 'Synergistic antioxidant effects; astaxanthin protects omega-3s from oxidation', 'Take together with fat-containing meal', 'Moderate'],
    ['Alpha-GPC', 'L-Theanine', 'Cholinergic boost + GABAergic calm = focused clarity without jitters', 'Take together before cognitive work', 'Moderate'],
    ['Lion\'s Mane (Hericium erinaceus)', 'Bacopa Monnieri', 'Complementary neuroprotection + neurogenesis + memory consolidation', 'Take together; effects build over 4-6 weeks', 'Moderate'],
    ['Magnesium Bisglycinate', 'Vitamin D3', 'Magnesium required for D3 activation; D3 may improve Mg absorption', 'Both essential; can be taken at different times', 'Strong'],
    ['Magnesium Bisglycinate', 'B-Complex Methylated', 'B6 enhances intracellular magnesium transport', 'B-Complex AM, Magnesium PM', 'Moderate'],
    ['Selenium', 'Vitamin D3', 'Both essential for thyroid; selenium supports deiodinase enzymes', 'Take together with food', 'Moderate'],
    ['Rhodiola Rosea', 'Cordyceps Militaris', 'Synergistic endurance and athletic performance support', 'Take both 30 min before exercise', 'Moderate'],
    ['Phytoceramides', 'Hyaluronic Acid', 'Ceramides seal moisture barrier; HA attracts and retains moisture', 'Take together with a meal', 'Moderate'],
    ['Glycine', 'Magnesium Bisglycinate', 'Complementary sleep support via different mechanisms', 'Take both 60 min before bed', 'Moderate'],
    ['Phosphatidylserine', 'Omega-3 EPA/DHA', 'Complementary cell membrane phospholipid support', 'Take together with food', 'Moderate'],
    ['Ashwagandha KSM-66', 'Magnesium Bisglycinate', 'Ashwagandha lowers cortisol; magnesium promotes GABAergic relaxation', 'Take both in the evening', 'Moderate'],
    ['Rhodiola Rosea', 'Creatine Monohydrate', 'Rhodiola reduces perceived exertion; creatine boosts phosphocreatine', 'Rhodiola before exercise, creatine post-workout', 'Moderate'],
    ['Apigenin', 'Magnesium Bisglycinate', 'Apigenin modulates GABA-A; magnesium supports GABAergic tone', 'Take both before bed', 'Moderate'],
    ['L-Tryptophan', 'B-Complex Methylated', 'B6 is a required cofactor for converting tryptophan to serotonin', 'B-Complex AM, Tryptophan PM', 'Strong'],
  ];

  const antagonisms = [
    ['Zinc Picolinate', 'Magnesium Bisglycinate', 'High-dose zinc and magnesium compete for absorption via shared transporters', 'Take at least 2 hours apart (Zinc AM, Magnesium PM)', 'Moderate'],
    ['Ashwagandha KSM-66', 'Rhodiola Rosea', 'Both are potent HPA-axis adaptogens; concurrent use may cause overstimulation', 'Use one at a time, or Rhodiola AM and Ashwagandha PM', 'Moderate'],
  ];

  const cautions = [
    ['Zinc Picolinate', 'Selenium', 'Antagonistic absorption at certain concentrations', 'Separate by 2+ hours if high doses', 'Moderate'],
    ['Vitamin C Liposomal', 'Selenium', 'Very high dose vitamin C may impair selenite absorption', 'Use selenomethionine form to avoid', 'Low'],
  ];

  const interactions = [];

  for (const [nameA, nameB, mechanism, recommendation, evidence] of synergies) {
    const idA = nameToId[nameA];
    const idB = nameToId[nameB];
    if (idA && idB) {
      interactions.push({
        supplement_a: idA,
        supplement_b: idB,
        interaction_type: 'synergy',
        mechanism,
        recommendation,
        evidence_level: evidence,
      });
    } else {
      console.log(`  Skipping synergy: ${nameA} (${!!idA}) + ${nameB} (${!!idB})`);
    }
  }

  for (const [nameA, nameB, mechanism, recommendation, evidence] of antagonisms) {
    const idA = nameToId[nameA];
    const idB = nameToId[nameB];
    if (idA && idB) {
      interactions.push({
        supplement_a: idA,
        supplement_b: idB,
        interaction_type: 'antagonism',
        mechanism,
        recommendation,
        evidence_level: evidence,
      });
    }
  }

  for (const [nameA, nameB, mechanism, recommendation, evidence] of cautions) {
    const idA = nameToId[nameA];
    const idB = nameToId[nameB];
    if (idA && idB) {
      interactions.push({
        supplement_a: idA,
        supplement_b: idB,
        interaction_type: 'caution',
        mechanism,
        recommendation,
        evidence_level: evidence,
      });
    }
  }

  const { data, error } = await supabase
    .from('supplement_interactions')
    .insert(interactions)
    .select('id');

  if (error) {
    console.error('Error seeding interactions:', error.message);
    return;
  }

  console.log(`Seeded ${data?.length ?? 0} interactions (${synergies.length} synergies, ${antagonisms.length} antagonisms, ${cautions.length} cautions)`);
}

async function main() {
  // First check if the extended tables exist
  const { error: checkErr } = await supabase.from('products').select('product_id').limit(1);

  if (checkErr) {
    console.error('Cannot access products table:', checkErr.message);
    console.log('\nYou need to run the migrations first.');
    console.log('Go to Supabase Dashboard → SQL Editor and run:');
    console.log('1. supabase/migrations/20260321_extend_tables.sql');
    process.exit(1);
  }

  // Check if extended columns exist
  const { data: testData, error: testErr } = await supabase
    .from('products')
    .select('timing_schedule')
    .limit(1);

  if (testErr && testErr.message.includes('timing_schedule')) {
    console.log('Extended columns not found. Run 20260321_extend_tables.sql first.');
    console.log('Printing SQL for you to paste in Supabase SQL Editor...\n');
    const extendSql = readFileSync(join(__dirname, '..', 'supabase', 'migrations', '20260321_extend_tables.sql'), 'utf-8');
    console.log(extendSql);
    process.exit(1);
  }

  console.log('Tables verified. Starting seed...');

  const products = await seedProductsViaAPI();
  if (products && products.length > 0) {
    await seedInteractionsViaAPI(products);
  }

  console.log('\nDone!');
}

main().catch(console.error);
